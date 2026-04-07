/* ============================================================
   PLANTÃO CHECK — App Logic
   ============================================================ */

// ── SESSION GUARD ────────────────────────────────────────────
const session = JSON.parse(localStorage.getItem('pc_session') || 'null');
if (!session) { window.location.href = 'index.html'; }

// ── STATE ────────────────────────────────────────────────────
let currentOccurrence = null;
let checkState = {}; // { itemId: boolean }
let currentTemplate = null;
let sectionCollapsed = {}; // { sectionId: bool }

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyStoredTheme();
  renderUser();
  renderNavList();
  renderOccurrenceGrid();
});

// ── USER ──────────────────────────────────────────────────────
function renderUser() {
  const el = document.getElementById('sidebarUser');
  const initials = (session.name || 'U').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  el.innerHTML = `
    <div class="user-chip">
      <div class="user-avatar">${initials}</div>
      <div>
        <div class="user-name">${session.name}</div>
        <div class="user-role">${session.email}</div>
      </div>
    </div>`;
}

// ── THEME ─────────────────────────────────────────────────────
function applyStoredTheme() {
  const theme = localStorage.getItem('pc_theme') || 'dark';
  document.body.setAttribute('data-theme', theme);
  updateThemeBtn(theme);
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('pc_theme', next);
  updateThemeBtn(next);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀ Modo Claro' : '🌙 Modo Escuro';
}

// ── SIDEBAR ───────────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

// ── NAV ───────────────────────────────────────────────────────
function renderNavList() {
  const ul = document.getElementById('navList');
  ul.innerHTML = OCCURRENCES.map(occ => `
    <li>
      <a href="#" class="nav-link" data-id="${occ.id}" onclick="openOccurrence('${occ.id}'); return false;">
        <span class="nav-icon">${occ.icon}</span>
        ${occ.name}
      </a>
    </li>`).join('');
}

function setActiveNav(id) {
  document.querySelectorAll('.nav-link[data-id]').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
}

// ── OCCURRENCE GRID ───────────────────────────────────────────
function renderOccurrenceGrid() {
  const grid = document.getElementById('occurrenceGrid');
  grid.innerHTML = OCCURRENCES.map(occ => {
    const totalItems = occ.sections.reduce((acc, s) => acc + s.items.length, 0);
    return `
    <div class="occ-card" onclick="openOccurrence('${occ.id}')">
      <div class="occ-icon">${occ.icon}</div>
      <div class="occ-name">${occ.name}</div>
      <div class="occ-count">${totalItems} itens · ${occ.sections.length} seções</div>
    </div>`;
  }).join('');
}

// ── OPEN OCCURRENCE ───────────────────────────────────────────
function openOccurrence(id) {
  currentOccurrence = OCCURRENCES.find(o => o.id === id);
  if (!currentOccurrence) return;

  // Restore or init state
  const saved = JSON.parse(localStorage.getItem(`pc_check_${id}`) || 'null');
  checkState = saved || {};
  sectionCollapsed = {};

  showView('checklistView');
  setActiveNav(id);
  document.getElementById('topbarTitle').textContent = currentOccurrence.name;
  document.getElementById('clTitle').textContent = currentOccurrence.name;
  document.getElementById('clDesc').textContent = currentOccurrence.desc || '';

  // Set print date
  document.getElementById('checklistView').setAttribute('data-print-date', new Date().toLocaleDateString('pt-BR'));

  renderChecklist();
  updateProgress();
  updatePdfMeta();

  // Close sidebar on mobile
  if (window.innerWidth <= 768) toggleSidebar();
}

// ── PDF META ──────────────────────────────────────────────────
function updatePdfMeta() {
  if (!currentOccurrence) return;
  const bo = (document.getElementById('metaBO')?.value || '').trim();
  const kw = (document.getElementById('metaKW')?.value || '').trim();

  // occurrence name
  const nameEl = document.getElementById('pdfOccName');
  if (nameEl) nameEl.textContent = currentOccurrence.name.toUpperCase();

  // BO line
  const boEl = document.getElementById('pdfBoLine');
  if (boEl) {
    boEl.textContent = bo ? 'BO Nº ' + bo : '';
    boEl.style.display = bo ? '' : 'none';
  }

  // keywords line
  const kwEl = document.getElementById('pdfKwLine');
  if (kwEl) {
    kwEl.textContent = kw || '';
    kwEl.style.display = kw ? '' : 'none';
  }

  // date on print footer
  const dateEl = document.getElementById('pdfDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleString('pt-BR');
}

// ── RENDER CHECKLIST ──────────────────────────────────────────
function renderChecklist() {
  const body = document.getElementById('clBody');
  body.innerHTML = currentOccurrence.sections.map(section => renderSection(section)).join('');
}

function renderSection(section) {
  const total   = section.items.length;
  const checked = section.items.filter(i => checkState[i.id]).length;
  const collapsed = sectionCollapsed[section.id] || false;

  return `
    <div class="cl-section" id="sec_${section.id}">
      <div class="cl-section-header" onclick="toggleSection('${section.id}')">
        <span class="section-icon">${section.icon}</span>
        <span class="section-name">${section.name}</span>
        <span class="section-badge">${checked}/${total}</span>
        <span class="section-toggle ${collapsed ? '' : 'open'}">▼</span>
      </div>
      <div class="cl-items" id="items_${section.id}" style="${collapsed ? 'display:none' : ''}">
        ${section.items.map(item => renderItem(item)).join('')}
      </div>
    </div>`;
}

function renderItem(item) {
  const checked = !!checkState[item.id];
  const extraHtml = [
    item.obs   ? `<div class="item-obs">ℹ ${item.obs}</div>`   : '',
    item.alert ? `<div class="item-alert">⚠ ${item.alert}</div>` : '',
    item.tip   ? `<div class="item-tip">✓ ${item.tip}</div>`   : '',
    item.template ? `<button class="btn-template" onclick="event.stopPropagation(); openTemplate('${item.template}')">✎ Gerar texto modelo</button>` : '',
  ].join('');

  return `
    <div class="cl-item ${checked ? 'checked' : ''}" id="item_${item.id}" onclick="toggleItem('${item.id}')">
      <div class="item-checkbox"></div>
      <div class="item-content">
        <div class="item-label">${item.label}</div>
        ${extraHtml}
      </div>
    </div>`;
}

// ── TOGGLE ITEM ───────────────────────────────────────────────
function toggleItem(id) {
  checkState[id] = !checkState[id];
  persistState();

  const el = document.getElementById(`item_${id}`);
  if (el) el.classList.toggle('checked', checkState[id]);

  updateProgress();
  updateSectionBadge(id);
}

function updateSectionBadge(itemId) {
  for (const section of currentOccurrence.sections) {
    if (!section.items.find(i => i.id === itemId)) continue;
    const total   = section.items.length;
    const checked = section.items.filter(i => checkState[i.id]).length;
    const badge = document.querySelector(`#sec_${section.id} .section-badge`);
    if (badge) badge.textContent = `${checked}/${total}`;
    break;
  }
}

// ── TOGGLE SECTION ────────────────────────────────────────────
function toggleSection(sectionId) {
  sectionCollapsed[sectionId] = !sectionCollapsed[sectionId];
  const items  = document.getElementById(`items_${sectionId}`);
  const toggle = document.querySelector(`#sec_${sectionId} .section-toggle`);
  if (items)  items.style.display  = sectionCollapsed[sectionId] ? 'none' : '';
  if (toggle) toggle.classList.toggle('open', !sectionCollapsed[sectionId]);
}

// ── PROGRESS ──────────────────────────────────────────────────
function updateProgress() {
  if (!currentOccurrence) return;
  const allItems = currentOccurrence.sections.flatMap(s => s.items);
  const total    = allItems.length;
  const checked  = allItems.filter(i => checkState[i.id]).length;
  const pct      = total ? Math.round((checked / total) * 100) : 0;

  document.getElementById('clProgressFill').style.width  = pct + '%';
  document.getElementById('clProgressLabel').textContent = `${checked} / ${total}`;
}

// ── PERSIST ───────────────────────────────────────────────────
function persistState() {
  if (!currentOccurrence) return;
  localStorage.setItem(`pc_check_${currentOccurrence.id}`, JSON.stringify(checkState));
}

// ── RESET ─────────────────────────────────────────────────────
function resetChecklist() {
  if (!currentOccurrence) return;
  if (!confirm('Deseja reiniciar o checklist? Todos os itens marcados serão desmarcados.')) return;
  checkState = {};
  persistState();
  renderChecklist();
  updateProgress();
}

// ── VIEW MANAGEMENT ───────────────────────────────────────────
function showView(viewId) {
  ['homeView', 'checklistView', 'refView'].forEach(id => {
    document.getElementById(id).classList.toggle('hidden', id !== viewId);
  });
}

function backToHome() {
  currentOccurrence = null;
  showView('homeView');
  document.getElementById('topbarTitle').textContent = 'Selecione uma ocorrência';
  document.querySelectorAll('.nav-link[data-id]').forEach(el => el.classList.remove('active'));
}

// ── REFERENCE ─────────────────────────────────────────────────
function openRef(key) {
  const ref = REFERENCIAS[key];
  if (!ref) return;

  showView('refView');
  document.getElementById('topbarTitle').textContent = ref.title.replace(/^[^\s]+ /, '');

  document.getElementById('refBody').innerHTML = `
    <div class="ref-section">
      <div class="ref-section-title">${ref.title}</div>
      ${ref.content}
    </div>`;

  if (window.innerWidth <= 768) toggleSidebar();
}

// ── TEMPLATE MODAL ────────────────────────────────────────────
function openTemplate(templateKey) {
  const tmpl = TEMPLATES[templateKey];
  if (!tmpl) return;
  currentTemplate = templateKey;

  document.getElementById('modalTitle').textContent = tmpl.title;

  const body = document.getElementById('modalBody');
  body.innerHTML = tmpl.fields.map(f => `
    <div class="modal-form-group">
      <label>${f.label}</label>
      <input type="text" id="tmpl_${f.id}" placeholder="${f.placeholder || ''}" />
    </div>`).join('') + `
    <div id="generatedOutput" class="hidden">
      <div class="generated-text-box" id="generatedText"></div>
      <div class="copy-bar">
        <button class="btn-copy" id="copyBtn" onclick="copyGenerated()">📋 Copiar texto</button>
      </div>
    </div>`;

  document.getElementById('modalBackdrop').classList.remove('hidden');
  document.getElementById('templateModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.add('hidden');
  document.getElementById('templateModal').classList.add('hidden');
  currentTemplate = null;
}

function generateTemplate() {
  if (!currentTemplate) return;
  const tmpl = TEMPLATES[currentTemplate];

  const values = {};
  let hasEmpty = false;

  tmpl.fields.forEach(f => {
    const val = (document.getElementById(`tmpl_${f.id}`)?.value || '').trim();
    if (!val) hasEmpty = true;
    values[f.id] = val || `[${f.label.toUpperCase()}]`;
  });

  const text = tmpl.generate(values);

  const outputBox = document.getElementById('generatedOutput');
  const textEl    = document.getElementById('generatedText');
  outputBox.classList.remove('hidden');
  textEl.textContent = text;

  // Reset copy button
  const copyBtn = document.getElementById('copyBtn');
  copyBtn.textContent = '📋 Copiar texto';
  copyBtn.className = 'btn-copy';
}

function copyGenerated() {
  const text = document.getElementById('generatedText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✓ Copiado!';
    btn.className = 'btn-copy copied';
    setTimeout(() => {
      btn.textContent = '📋 Copiar texto';
      btn.className = 'btn-copy';
    }, 2500);
  });
}

// ── PDF / PRINT ───────────────────────────────────────────────
function generatePDF() {
  if (!currentOccurrence) {
    alert('Selecione uma ocorrência para gerar o PDF.');
    return;
  }
  window.print();
}

// ── LOGOUT ────────────────────────────────────────────────────
function handleLogout() {
  if (!confirm('Deseja sair do Plantão Check?')) return;
  localStorage.removeItem('pc_session');
  window.location.href = 'index.html';
}

// ── KEYBOARD ──────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
