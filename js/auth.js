/* ============================================================
   PLANTÃO CHECK — Auth Module v2
   Acesso por e-mail + código de verificação (sem cadastro)
   ============================================================

   CONFIGURAÇÃO (fazer uma única vez):
   1. Acesse https://www.emailjs.com
   2. Crie ou reutilize seu Email Service — anote o Service ID
   3. Edite seu Email Template — variáveis: {{to_email}}, {{code}}
      Sugestão de assunto: [Plantão Check] Código: {{code}}
      Corpo: Seu código de acesso é {{code}}. Expira em 15 minutos.
   4. Substitua os três valores abaixo com suas credenciais

   ============================================================ */

const EMAILJS_SERVICE_ID  = 'service_f8ahxdk';
const EMAILJS_TEMPLATE_ID = 'template_xqp8nw7';
const EMAILJS_PUBLIC_KEY  = '4ENO39pWC7a7b_oOB';

// Detecta se o EmailJS foi configurado
const EMAILJS_CONFIGURED = (
  EMAILJS_SERVICE_ID  !== 'SEU_SERVICE_ID' &&
  EMAILJS_TEMPLATE_ID !== 'SEU_TEMPLATE_ID' &&
  EMAILJS_PUBLIC_KEY  !== 'SUA_PUBLIC_KEY'
);

// Sessão expira em 8 horas
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

// ── STORAGE ──────────────────────────────────────────────────
const DB = {
  getPending : ()  => JSON.parse(localStorage.getItem('pc_pending')  || '{}'),
  savePending: (p) => localStorage.setItem('pc_pending', JSON.stringify(p)),
  setSession : (u) => localStorage.setItem('pc_session', JSON.stringify({ ...u, expiresAt: Date.now() + SESSION_DURATION_MS })),
  getSession : ()  => {
    const s = JSON.parse(localStorage.getItem('pc_session') || 'null');
    if (!s) return null;
    if (Date.now() > s.expiresAt) { localStorage.removeItem('pc_session'); return null; }
    return s;
  },
  clearSession: () => localStorage.removeItem('pc_session'),
};

// ── GUARD ────────────────────────────────────────────────────
(function () {
  if (DB.getSession() && window.location.pathname.includes('index')) {
    window.location.href = 'app.html';
  }
})();

// ── UTILITIES ────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.gov\.br$/.test(email.trim().toLowerCase());
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function showMsg(id, text, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `auth-msg ${type}`;
  el.classList.remove('hidden');
}

function hideMsg(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? '👁' : '🙈';
}

function switchPanel(panelId) {
  ['emailPanel', 'verifyPanel'].forEach(id => {
    document.getElementById(id)?.classList.add('hidden');
  });
  document.getElementById(panelId)?.classList.remove('hidden');
}

// ── DIGIT INPUT ──────────────────────────────────────────────
function digitNext(input, nextId) {
  input.value = input.value.replace(/[^0-9]/g, '').slice(-1);
  if (input.value && nextId) document.getElementById(nextId)?.focus();
}

function digitBack(event, input, prevId) {
  if (event.key === 'Backspace' && !input.value && prevId) {
    document.getElementById(prevId)?.focus();
  }
}

function getCodeFromInputs() {
  return ['d1','d2','d3','d4','d5','d6'].map(id => document.getElementById(id)?.value || '').join('');
}

function clearCodeInputs() {
  ['d1','d2','d3','d4','d5','d6'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('d1')?.focus();
}

// ── EMAIL SEND ───────────────────────────────────────────────
async function sendCodeEmail(toEmail, code) {
  if (!EMAILJS_CONFIGURED) {
    return { ok: false, error: 'EmailJS não configurado' };
  }
  try {
    if (!window.emailjs) await loadEmailJS();
    emailjs.init(EMAILJS_PUBLIC_KEY);
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { to_email: toEmail, code }
    );
    return response.status === 200 ? { ok: true } : { ok: false, error: response.text };
  } catch (err) {
    return { ok: false, error: err };
  }
}

function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ── REQUEST CODE (step 1) ─────────────────────────────────────
async function handleRequestCode() {
  hideMsg('emailMsg');
  const email = (document.getElementById('loginEmail')?.value || '').trim().toLowerCase();

  if (!validateEmail(email)) {
    return showMsg('emailMsg', 'Informe um e-mail institucional válido (.gov.br).');
  }

  const btn = document.getElementById('btnRequestCode');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  const code    = generateCode();
  const expires = Date.now() + 15 * 60 * 1000;

  const pending = DB.getPending();
  pending[email] = { code, expires };
  DB.savePending(pending);

  const result = await sendCodeEmail(email, code);

  btn.textContent = 'Receber código por e-mail';
  btn.disabled = false;

  if (!result.ok) {
    return showMsg('emailMsg', 'Não foi possível enviar o código. Verifique o e-mail ou contate o administrador.');
  }

  document.getElementById('verifyEmailDisplay').textContent = email;
  switchPanel('verifyPanel');
  showMsg('verifyMsg', `Código enviado para ${email}. Verifique sua caixa de entrada.`, 'info');
  document.getElementById('d1')?.focus();
}

// ── VERIFY CODE (step 2) ──────────────────────────────────────
function handleVerify() {
  hideMsg('verifyMsg');
  const code  = getCodeFromInputs();
  if (code.length < 6) return showMsg('verifyMsg', 'Digite os 6 dígitos do código.');

  const email   = document.getElementById('verifyEmailDisplay')?.textContent || '';
  const pending = DB.getPending();
  const entry   = pending[email];

  if (!entry) return showMsg('verifyMsg', 'Código não encontrado. Solicite um novo.');
  if (Date.now() > entry.expires) {
    delete pending[email];
    DB.savePending(pending);
    return showMsg('verifyMsg', 'Código expirado. Solicite um novo.');
  }
  if (entry.code !== code) return showMsg('verifyMsg', 'Código incorreto. Tente novamente.');

  delete pending[email];
  DB.savePending(pending);

  // Derive display name from email (part before @)
  const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  DB.setSession({ email, name });
  window.location.href = 'app.html';
}

// ── RESEND ────────────────────────────────────────────────────
async function resendCode() {
  const email = document.getElementById('verifyEmailDisplay')?.textContent || '';
  if (!email) return switchPanel('emailPanel');

  clearCodeInputs();
  hideMsg('verifyMsg');

  const code    = generateCode();
  const expires = Date.now() + 15 * 60 * 1000;
  const pending = DB.getPending();
  pending[email] = { code, expires };
  DB.savePending(pending);

  const result = await sendCodeEmail(email, code);
  if (!result.ok) return showMsg('verifyMsg', 'Erro ao reenviar. Tente novamente.');
  showMsg('verifyMsg', 'Novo código enviado!', 'success');
}

// ── LOGOUT (called from app) ──────────────────────────────────
function handleLogout() {
  DB.clearSession();
  window.location.href = 'index.html';
}

// ── ENTER KEY ────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const emailPanel  = document.getElementById('emailPanel');
  const verifyPanel = document.getElementById('verifyPanel');
  if (emailPanel  && !emailPanel.classList.contains('hidden'))  handleRequestCode();
  else if (verifyPanel && !verifyPanel.classList.contains('hidden')) handleVerify();
});
