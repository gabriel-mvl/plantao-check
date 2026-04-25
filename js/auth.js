/* ============================================================
   PLANTÃO CHECK — Auth Module v3
   Acesso por e-mail + código de verificação (sem cadastro)
   Envio via Brevo (API REST — sem restrição de CORS)
   ============================================================ */

const WORKER_URL = 'https://plantaocheck-email.plantaocheck.workers.dev';

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

function syncLoginEmail() {
  const user   = (document.getElementById('loginUser')?.value || '').trim();
  const sel    = document.getElementById('loginSuffix');
  const custom = document.getElementById('loginSuffixCustom');
  const hidden = document.getElementById('loginEmail');

  if (sel?.value === 'outro') {
    custom?.classList.remove('hidden');
    const suf = (custom?.value || '').trim();
    if (hidden) hidden.value = user + suf;
  } else {
    custom?.classList.add('hidden');
    const suf = sel?.value || '@policiacivil.sp.gov.br';
    if (hidden) hidden.value = user + suf;
  }
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
  btn.textContent = input.type === 'password' ? '\u{1F441}' : '\u{1F648}';
}

function switchPanel(panelId) {
  ['emailPanel', 'verifyPanel'].forEach(id => {
    document.getElementById(id)?.classList.add('hidden');
  });
  document.getElementById(panelId)?.classList.remove('hidden');
  if (panelId === 'emailPanel') stopResendCountdown();
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

// ── EMAIL SEND (via Cloudflare Worker) ────────────────────────────
async function sendCodeEmail(toEmail, code) {
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: toEmail, code }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true };
    console.error('[Worker] Erro:', data);
    return { ok: false, error: data.error || res.status };
  } catch (err) {
    console.error('[Worker] Erro de rede:', err);
    return { ok: false, error: err.message };
  }
}

// ── REQUEST CODE (step 1) ─────────────────────────────────────
async function handleRequestCode() {
  hideMsg('emailMsg');
  const email = (document.getElementById('loginEmail')?.value || '').trim().toLowerCase();

  if (!validateEmail(email)) {
    return showMsg('emailMsg', 'Informe um e-mail institucional v\u00e1lido (.gov.br).');
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

  btn.textContent = 'Receber c\u00f3digo por e-mail';
  btn.disabled = false;

  if (!result.ok) {
    const detail = typeof result.error === 'string' ? ` (${result.error})` : '';
    console.error('[Auth] Falha no envio:', result.error);
    return showMsg('emailMsg', `N\u00e3o foi poss\u00edvel enviar o c\u00f3digo. Tente novamente ou contate o administrador.${detail}`);
  }

  document.getElementById('verifyEmailDisplay').textContent = email;
  switchPanel('verifyPanel');
  showMsg('verifyMsg', `C\u00f3digo enviado para ${email}. Verifique sua caixa de entrada.`, 'info');
  document.getElementById('d1')?.focus();
  startResendCountdown();
}

// ── VERIFY CODE (step 2) ──────────────────────────────────────
function handleVerify() {
  hideMsg('verifyMsg');
  const code = getCodeFromInputs();
  if (code.length < 6) return showMsg('verifyMsg', 'Digite os 6 d\u00edgitos do c\u00f3digo.');

  const email   = document.getElementById('verifyEmailDisplay')?.textContent || '';
  const pending = DB.getPending();
  const entry   = pending[email];

  if (!entry) return showMsg('verifyMsg', 'C\u00f3digo n\u00e3o encontrado. Solicite um novo.');
  if (Date.now() > entry.expires) {
    delete pending[email];
    DB.savePending(pending);
    return showMsg('verifyMsg', 'C\u00f3digo expirado. Solicite um novo.');
  }
  if (entry.code !== code) return showMsg('verifyMsg', 'C\u00f3digo incorreto. Tente novamente.');

  delete pending[email];
  DB.savePending(pending);

  const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  DB.setSession({ email, name });
  window.location.href = 'app.html';
}

// ── RESEND ────────────────────────────────────────────────────
async function resendCode() {
  const email = document.getElementById('verifyEmailDisplay')?.textContent || '';
  if (!email) return switchPanel('emailPanel');

  const btn = document.getElementById('btnResend');
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

  clearCodeInputs();
  hideMsg('verifyMsg');

  const code    = generateCode();
  const expires = Date.now() + 15 * 60 * 1000;
  const pending = DB.getPending();
  pending[email] = { code, expires };
  DB.savePending(pending);

  const result = await sendCodeEmail(email, code);

  if (!result.ok) {
    if (btn) { btn.disabled = false; btn.textContent = '\u21ba Reenviar c\u00f3digo'; }
    return showMsg('verifyMsg', 'Erro ao reenviar. Tente novamente.');
  }

  showMsg('verifyMsg', 'Novo c\u00f3digo enviado! Verifique sua caixa de entrada.', 'success');
  startResendCountdown();
}

// ── COUNTDOWN ─────────────────────────────────────────────────
let _countdownTimer = null;
const RESEND_WAIT_S  = 90;

function startResendCountdown() {
  clearInterval(_countdownTimer);

  const countdown = document.getElementById('resendCountdown');
  const timerEl   = document.getElementById('resendTimer');
  const btn       = document.getElementById('btnResend');

  if (!countdown || !timerEl || !btn) return;

  countdown.classList.remove('hidden');
  btn.classList.add('hidden');
  btn.disabled = false;
  btn.textContent = '\u21ba Reenviar c\u00f3digo';

  let remaining = RESEND_WAIT_S;

  function tick() {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
    if (remaining <= 0) {
      clearInterval(_countdownTimer);
      countdown.classList.add('hidden');
      btn.classList.remove('hidden');
    }
    remaining--;
  }

  tick();
  _countdownTimer = setInterval(tick, 1000);
}

function stopResendCountdown() {
  clearInterval(_countdownTimer);
  document.getElementById('resendCountdown')?.classList.add('hidden');
  const btn = document.getElementById('btnResend');
  if (btn) { btn.classList.remove('hidden'); btn.disabled = false; }
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
