/* ============================================================
   PLANTÃO CHECK — Auth Module
   EmailJS Integration for verification codes
   ============================================================

   SETUP INSTRUCTIONS (configure once):
   1. Acesse https://www.emailjs.com e crie uma conta gratuita
   2. Crie um "Email Service" conectando seu Gmail ou Outlook institucional
   3. Crie um "Email Template" com as variáveis: {{to_email}}, {{code}}, {{name}}
      Sugestão de template:
        Assunto: [Plantão Check] Seu código de verificação
        Corpo: Olá {{name}}, seu código de verificação é: {{code}}
              Este código expira em 15 minutos.
   4. Substitua os valores abaixo:
      - EMAILJS_SERVICE_ID: ID do serviço criado (ex: "service_abc123")
      - EMAILJS_TEMPLATE_ID: ID do template criado (ex: "template_xyz789")
      - EMAILJS_PUBLIC_KEY: Sua chave pública (em Account > API Keys)

   ============================================================ */

const EMAILJS_SERVICE_ID  = 'service_f8ahxdk';
const EMAILJS_TEMPLATE_ID = 'template_xqp8nw7';
const EMAILJS_PUBLIC_KEY  = '4ENO39pWC7a7b_oOB';

// Detecta se o EmailJS foi configurado
const EMAILJS_CONFIGURED = (
  EMAILJS_SERVICE_ID  !== 'service_f8ahxdk' &&
  EMAILJS_TEMPLATE_ID !== 'template_xqp8nw7' &&
  EMAILJS_PUBLIC_KEY  !== '4ENO39pWC7a7b_oOB'
);

// ── STORAGE HELPERS ──────────────────────────────────────────
const DB = {
  getUsers: () => JSON.parse(localStorage.getItem('pc_users') || '{}'),
  saveUsers: (u) => localStorage.setItem('pc_users', JSON.stringify(u)),
  getPending: () => JSON.parse(localStorage.getItem('pc_pending') || '{}'),
  savePending: (p) => localStorage.setItem('pc_pending', JSON.stringify(p)),
  setSession: (u) => localStorage.setItem('pc_session', JSON.stringify(u)),
  getSession: () => JSON.parse(localStorage.getItem('pc_session') || 'null'),
  clearSession: () => localStorage.removeItem('pc_session'),
};

// ── GUARD: redirect to app if already logged in ──────────────
(function () {
  const session = DB.getSession();
  if (session && window.location.pathname.includes('index')) {
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
  el.textContent = text;
  el.className = `auth-msg ${type}`;
  el.classList.remove('hidden');
}

function hideMsg(id) {
  document.getElementById(id).classList.add('hidden');
}

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}

function switchPanel(panelId) {
  ['loginPanel', 'registerPanel', 'verifyPanel'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(panelId).classList.remove('hidden');
}

// ── DIGIT INPUT ──────────────────────────────────────────────
function digitNext(input, nextId) {
  input.value = input.value.replace(/[^0-9]/g, '').slice(-1);
  if (input.value && nextId) document.getElementById(nextId).focus();
}

function digitBack(event, input, prevId) {
  if (event.key === 'Backspace' && !input.value && prevId) {
    document.getElementById(prevId).focus();
  }
}

function getCodeFromInputs() {
  return ['d1','d2','d3','d4','d5','d6'].map(id => document.getElementById(id).value).join('');
}

function clearCodeInputs() {
  ['d1','d2','d3','d4','d5','d6'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('d1').focus();
}

// ── EMAIL SENDING ────────────────────────────────────────────
async function sendCodeEmail(toEmail, name, code) {
  if (!EMAILJS_CONFIGURED) {
    // EmailJS não configurado — retorna erro silencioso
    return { ok: false, error: 'EmailJS não configurado' };
  }

  // Carrega EmailJS SDK se não estiver carregado
  if (!window.emailjs) {
    await loadEmailJS();
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { to_email: toEmail, name: name, code: code },
      EMAILJS_PUBLIC_KEY
    );
    return { ok: true };
  } catch (err) {
    console.error('EmailJS error:', err);
    return { ok: false, error: err };
  }
}

function loadEmailJS() {
  return new Promise((resolve) => {
    if (window.emailjs) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

// ── REGISTER ─────────────────────────────────────────────────
async function handleRegister() {
  hideMsg('registerMsg');

  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regPasswordConfirm').value;

  if (!name) return showMsg('registerMsg', 'Informe seu nome completo.');
  if (!validateEmail(email)) return showMsg('registerMsg', 'Use um e-mail institucional .gov.br válido.');
  if (password.length < 6) return showMsg('registerMsg', 'A senha deve ter pelo menos 6 caracteres.');
  if (password !== confirm) return showMsg('registerMsg', 'As senhas não coincidem.');

  const users = DB.getUsers();
  if (users[email]) return showMsg('registerMsg', 'Este e-mail já está cadastrado. Faça login.');

  const code    = generateCode();
  const expires = Date.now() + 15 * 60 * 1000; // 15 min

  const pending = DB.getPending();
  pending[email] = { name, password: btoa(password), code, expires };
  DB.savePending(pending);

  const btn = document.querySelector('#registerPanel .btn-primary');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  const result = await sendCodeEmail(email, name, code);

  btn.textContent = 'Criar conta e enviar código';
  btn.disabled = false;

  if (!result.ok) {
    return showMsg('registerMsg', 'Não foi possível enviar o código de verificação. O serviço de e-mail pode não estar configurado. Entre em contato com o administrador do sistema.', 'error');
  }

  document.getElementById('verifyEmailDisplay').textContent = email;
  switchPanel('verifyPanel');
  showMsg('verifyMsg', `Código enviado para ${email}. Verifique sua caixa de entrada.`, 'info');
}

// ── VERIFY ───────────────────────────────────────────────────
function handleVerify() {
  hideMsg('verifyMsg');

  const code    = getCodeFromInputs();
  if (code.length < 6) return showMsg('verifyMsg', 'Insira todos os 6 dígitos.');

  const emailDisplay = document.getElementById('verifyEmailDisplay').textContent;
  const pending = DB.getPending();
  const entry   = pending[emailDisplay];

  if (!entry) return showMsg('verifyMsg', 'Nenhum cadastro pendente encontrado. Faça o cadastro novamente.');
  if (Date.now() > entry.expires) {
    delete pending[emailDisplay];
    DB.savePending(pending);
    return showMsg('verifyMsg', 'Código expirado. Faça o cadastro novamente.', 'error');
  }
  if (entry.code !== code) return showMsg('verifyMsg', 'Código incorreto. Tente novamente.', 'error');

  // Confirma cadastro
  const users = DB.getUsers();
  users[emailDisplay] = { name: entry.name, password: entry.password, createdAt: Date.now() };
  DB.saveUsers(users);

  delete pending[emailDisplay];
  DB.savePending(pending);

  // Loga automaticamente
  DB.setSession({ email: emailDisplay, name: entry.name });
  window.location.href = 'app.html';
}

// ── RESEND CODE ──────────────────────────────────────────────
async function resendCode() {
  const email   = document.getElementById('verifyEmailDisplay').textContent;
  const pending = DB.getPending();
  const entry   = pending[email];
  if (!entry) return showMsg('verifyMsg', 'Faça o cadastro novamente.', 'error');

  const code    = generateCode();
  const expires = Date.now() + 15 * 60 * 1000;
  pending[email] = { ...entry, code, expires };
  DB.savePending(pending);

  clearCodeInputs();
  const result = await sendCodeEmail(email, entry.name, code);

  if (!result.ok) return showMsg('verifyMsg', 'Erro ao reenviar. Tente novamente.', 'error');

  showMsg('verifyMsg', 'Novo código enviado!', 'success');
}

// ── LOGIN ─────────────────────────────────────────────────────
function handleLogin() {
  hideMsg('loginMsg');

  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  if (!validateEmail(email)) return showMsg('loginMsg', 'Use um e-mail institucional .gov.br válido.');
  if (!password) return showMsg('loginMsg', 'Informe sua senha.');

  const users = DB.getUsers();
  const user  = users[email];

  if (!user) return showMsg('loginMsg', 'E-mail não cadastrado. Faça o cadastro.');
  if (atob(user.password) !== password) return showMsg('loginMsg', 'Senha incorreta.');

  DB.setSession({ email, name: user.name });
  window.location.href = 'app.html';
}

// ── LOGOUT (chamado do app) ───────────────────────────────────
function handleLogout() {
  DB.clearSession();
  window.location.href = 'index.html';
}

// ── ENTER KEY SUPPORT ─────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const loginPanel   = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const verifyPanel  = document.getElementById('verifyPanel');
  if (!loginPanel.classList.contains('hidden'))    handleLogin();
  else if (!registerPanel.classList.contains('hidden')) handleRegister();
  else if (!verifyPanel.classList.contains('hidden'))   handleVerify();
});


