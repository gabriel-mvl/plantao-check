/* ============================================================
   PLANTÃO CHECK — App Logic v2
   ============================================================ */

// ── SESSION GUARD ────────────────────────────────────────────
const session = (() => {
  const s = JSON.parse(localStorage.getItem('pc_session') || 'null');
  if (!s) return null;
  if (Date.now() > s.expiresAt) { localStorage.removeItem('pc_session'); return null; }
  return s;
})();
if (!session) window.location.href = 'index.html';

// ── STATE ────────────────────────────────────────────────────
let currentOccurrence  = null;
let currentSections    = [];   // sections after triage merge
let checkState         = {};
let currentTemplate    = null;
let sectionCollapsed   = {};
let triageAnswers      = {};   // { flagrante, preso, condutor }

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyStoredTheme();
  renderUser();
  renderNavList();
  renderOccurrenceGrid();
});

// ── USER ─────────────────────────────────────────────────────
function renderUser() {
  const el = document.getElementById('sidebarUser');
  if (!el) return;
  const initials = (session.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  el.innerHTML = `
    <div class="user-chip">
      <div class="user-avatar">${initials}</div>
      <div>
        <div class="user-name">${session.name}</div>
        <div class="user-role">${session.email}</div>
      </div>
    </div>`;
}

// ── THEME ────────────────────────────────────────────────────
function applyStoredTheme() {
  const theme = localStorage.getItem('pc_theme') || 'dark';
  document.body.setAttribute('data-theme', theme);
  updateThemeBtn(theme);
}
function toggleTheme() {
  const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('pc_theme', next);
  updateThemeBtn(next);
}
function updateThemeBtn(theme) {
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀ Modo Claro' : '🌙 Modo Escuro';
}

// ── SIDEBAR ──────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebarOverlay')?.classList.toggle('active');
}

// ── NAV ──────────────────────────────────────────────────────
function renderNavList() {
  const ul = document.getElementById('navList');
  if (!ul) return;
  ul.innerHTML = OCCURRENCES.map(occ => `
    <li>
      <a href="#" class="nav-link" data-id="${occ.id}" onclick="startTriage('${occ.id}'); return false;">
        <span class="nav-icon">${occ.icon}</span>${occ.name}
      </a>
    </li>`).join('');
}

function setActiveNav(id) {
  document.querySelectorAll('.nav-link[data-id]').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
}

// ── OCCURRENCE GRID ──────────────────────────────────────────
function renderOccurrenceGrid() {
  const grid = document.getElementById('occurrenceGrid');
  if (!grid) return;
  grid.innerHTML = OCCURRENCES.map(occ => {
    const saved   = JSON.parse(localStorage.getItem(`pc_check_${occ.id}`) || 'null');
    const total   = occ.sections.reduce((a, s) => a + s.items.length, 0);
    const checked = saved ? Object.values(saved).filter(Boolean).length : 0;
    const pct     = total ? Math.round((checked / total) * 100) : 0;
    const started = checked > 0;

    return `
    <div class="occ-card ${started ? 'occ-started' : ''}" onclick="startTriage('${occ.id}')">
      <div class="occ-card-top">
        <div class="occ-icon">${occ.icon}</div>
        ${started ? `<div class="occ-ring" title="${pct}% concluído">
          <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" stroke-width="2.5" pathLength="100"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="25" stroke-linecap="round" pathLength="100"/>
          </svg>
          <span>${pct}%</span>
        </div>` : ''}
      </div>
      <div class="occ-name">${occ.name}</div>
      <div class="occ-count">${occ.sections.length} seções · ${total} itens${started ? ` · <strong>${checked} feitos</strong>` : ''}</div>
    </div>`;
  }).join('');
}

// ── TRIAGE MODAL ─────────────────────────────────────────────
function startTriage(id) {
  const occ = OCCURRENCES.find(o => o.id === id);
  if (!occ) return;

  // Warn if another checklist has progress
  if (currentOccurrence && currentOccurrence.id !== id) {
    const allItems  = currentSections.flatMap(s => s.items);
    const anyChecked = allItems.some(i => checkState[i.id]);
    if (anyChecked && !confirm(`Você tem itens marcados em "${currentOccurrence.name}". Deseja abrir outra ocorrência? O progresso atual está salvo e pode ser retomado.`)) return;
  }

  // Show triage modal
  document.getElementById('triageOccName').textContent = occ.name;
  document.getElementById('triageOccId').value = id;

  // Reset selections
  document.querySelectorAll('.triage-opt').forEach(el => el.classList.remove('selected'));
  document.getElementById('triageMsg').classList.add('hidden');

  openTriageModal();
  if (window.innerWidth <= 768 && document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
}

function openTriageModal() {
  document.getElementById('triageBackdrop').classList.remove('hidden');
  document.getElementById('triageModal').classList.remove('hidden');
}

function closeTriageModal() {
  document.getElementById('triageBackdrop').classList.add('hidden');
  document.getElementById('triageModal').classList.add('hidden');
}

function selectTriageOpt(group, value, el) {
  document.querySelectorAll(`.triage-opt[data-group="${group}"]`).forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  el.dataset.value = value;
}

function confirmTriage() {
  const id        = document.getElementById('triageOccId').value;
  const flagrante = document.querySelector('.triage-opt[data-group="flagrante"].selected')?.dataset.value;
  const preso     = document.querySelector('.triage-opt[data-group="preso"].selected')?.dataset.value;
  const condutor  = document.querySelector('.triage-opt[data-group="condutor"].selected')?.dataset.value;

  if (!flagrante || !preso || !condutor) {
    const msg = document.getElementById('triageMsg');
    msg.textContent = 'Responda todas as perguntas para continuar.';
    msg.classList.remove('hidden');
    return;
  }

  triageAnswers = { flagrante: flagrante === 'sim', preso: preso === 'sim', condutor };
  closeTriageModal();
  openOccurrence(id);
}

// ── OPEN OCCURRENCE ──────────────────────────────────────────
function openOccurrence(id) {
  currentOccurrence = OCCURRENCES.find(o => o.id === id);
  if (!currentOccurrence) return;

  const saved = JSON.parse(localStorage.getItem(`pc_check_${id}`) || 'null');
  checkState = saved || {};
  sectionCollapsed = {};

  // Build sections with triage merge
  currentSections = buildSections(currentOccurrence, triageAnswers);

  showView('checklistView');
  setActiveNav(id);
  document.getElementById('topbarTitle').textContent = currentOccurrence.name;
  document.getElementById('clTitle').textContent     = currentOccurrence.name;
  document.getElementById('clDesc').textContent      = currentOccurrence.desc || '';
  document.getElementById('metaBO').value            = '';
  document.getElementById('metaKW').value            = '';
  document.getElementById('obsText').value           = '';

  renderChecklist();
  updateProgress();
  updatePdfMeta();
}

// ── BUILD SECTIONS (triage merge) ────────────────────────────
function buildSections(occ, triage) {
  let sections = JSON.parse(JSON.stringify(occ.sections)); // deep clone

  // If flagrante, add APF label to first BO section
  if (triage.flagrante) {
    const boSec = sections.find(s => s.items.some(i => i.id.endsWith('_bo') || i.label?.toLowerCase().includes('boletim')));
    if (boSec) {
      const boItem = boSec.items.find(i => i.label?.toLowerCase().includes('boletim') || i.label?.toLowerCase().includes('abrir bo'));
      if (boItem) boItem.alert = (boItem.alert ? boItem.alert + ' — ' : '') + 'Selecionar "BO para flagrante"';
    }
  }

  // If preso, inject patuá section (unless already present)
  if (triage.preso && !sections.find(s => s.id === 'patua_auto')) {
    sections = injectPatuaSection(sections, triage.flagrante);
  }

  return sections;
}

function injectPatuaSection(sections, isFlagrante) {
  // Inject flagrante peças if flagrante and not already present
  const hasFlagrante = sections.some(s =>
    s.items.some(i => i.label?.toLowerCase().includes('auto de prisão em flagrante'))
  );

  if (isFlagrante && !hasFlagrante) {
    sections.push({
      id: 'flagrante_inj', icon: '⛓', name: 'Peças do Flagrante',
      items: [
        { id: 'fi1', label: 'Auto de Prisão em Flagrante', obs: 'Lavrado pelo delegado' },
        { id: 'fi2', label: 'Nota de culpa', obs: 'Lavrada pelo delegado' },
        { id: 'fi3', label: 'Interrogatório do preso + vida pregressa', obs: 'Escrivão preenche a vida pregressa' },
        { id: 'fi4', label: 'Auto de qualificação' },
        { id: 'fi5', label: 'BIC (no IPE)' },
      ]
    });
  }

  // Patuá do preso
  sections.push({
    id: 'patua_auto', icon: '🗂', name: 'Patuá do Preso',
    items: [
      { id: 'pa1', label: '3 vias — Ofício de encaminhamento do preso', tip: 'Confirme o destino antes de assinar' },
      { id: 'pa2', label: '1 via — Boletim de Ocorrência' },
      isFlagrante ? { id: 'pa3', label: '1 via — Auto de Prisão em Flagrante' } : null,
      isFlagrante ? { id: 'pa4', label: '1 via — Interrogatório + vida pregressa' } : null,
      isFlagrante ? { id: 'pa5', label: '1 via — Nota de culpa' } : null,
      { id: 'pa6', label: '1 via — Auto de qualificação' },
      { id: 'pa7', label: '1 via — Requisição de IML', obs: 'Juntar laudo quando recebido' },
      { id: 'pa8', label: '1 via — DVC' },
      { id: 'pa9', label: '1 via — LEAD' },
      { id: 'pa10', label: '1 via — Ficha clínica' },
      isFlagrante ? { id: 'pa11', label: '1 via — BIC' } : null,
    ].filter(Boolean),
  });

  // Destino do preso
  sections.push({
    id: 'destino_preso', icon: '🏛', name: 'Destinação do Preso',
    items: [
      { id: 'dp1', label: 'Verificar DVC: o preso possui crime sexual?', alert: 'Se sim → cela separada + encaminhar para CDP específico para crimes sexuais (independente da natureza da ocorrência)' },
      { id: 'dp2', label: 'Confirmar regime e destino correto conforme perfil do preso' },
      { id: 'dp3', label: 'Requisição de IML do preso', obs: 'Objetivo: exame cautelar indireto. Natureza: corpo de delito indireto.' },
      { id: 'dp4', label: 'Enviar e-mail ao IML com ficha clínica e requisição para exame indireto', alert: 'Enviar assim que o preso der entrada com a ficha do PS — não aguardar.' },
      { id: 'dp5', label: 'Ofício de encaminhamento do preso' },
      { id: 'dp6', label: 'Juntar ficha clínica (anexo)' },
    ]
  });

  return sections;
}

// ── PDF META ─────────────────────────────────────────────────
function updatePdfMeta() {
  if (!currentOccurrence) return;
  const bo = (document.getElementById('metaBO')?.value || '').trim();
  const kw = (document.getElementById('metaKW')?.value || '').trim();

  const nameEl = document.getElementById('pdfOccName');
  if (nameEl) nameEl.textContent = currentOccurrence.name.toUpperCase();

  const boEl = document.getElementById('pdfBoLine');
  if (boEl) { boEl.textContent = bo ? 'BO Nº ' + bo : ''; boEl.style.display = bo ? '' : 'none'; }

  const kwEl = document.getElementById('pdfKwLine');
  if (kwEl) { kwEl.textContent = kw || ''; kwEl.style.display = kw ? '' : 'none'; }

  const dateEl = document.getElementById('pdfDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleString('pt-BR');

  // Triage summary for PDF
  const triageEl = document.getElementById('pdfTriage');
  if (triageEl && triageAnswers.condutor) {
    const parts = [
      triageAnswers.condutor === 'pm' ? 'Condutor: PM' : 'Condutor: GCM',
      triageAnswers.flagrante ? 'Flagrante: Sim' : 'Flagrante: Não',
      triageAnswers.preso ? 'Preso: Sim' : 'Preso: Não',
    ];
    triageEl.textContent = parts.join('  ·  ');
  }
}

// ── RENDER CHECKLIST ─────────────────────────────────────────
function renderChecklist() {
  const body = document.getElementById('clBody');
  if (!body) return;
  body.innerHTML = currentSections.map(s => renderSection(s)).join('');
}

function renderSection(section) {
  const total   = section.items.length;
  const checked = section.items.filter(i => checkState[i.id]).length;
  const collapsed = sectionCollapsed[section.id] || false;
  const done = checked === total;

  return `
    <div class="cl-section ${done ? 'section-done' : ''}" id="sec_${section.id}">
      <div class="cl-section-header" onclick="toggleSection('${section.id}')">
        <span class="section-icon">${section.icon}</span>
        <span class="section-name">${section.name}</span>
        <span class="section-badge ${done ? 'badge-done' : ''}">${checked}/${total}</span>
        <span class="section-toggle ${collapsed ? '' : 'open'}">▼</span>
      </div>
      <div class="cl-items" id="items_${section.id}" style="${collapsed ? 'display:none' : ''}">
        ${section.items.map(item => renderItem(item)).join('')}
      </div>
    </div>`;
}

function renderItem(item) {
  const checked = !!checkState[item.id];
  const extras = [
    item.obs   ? `<div class="item-obs">ℹ ${item.obs}</div>`     : '',
    item.alert ? `<div class="item-alert">⚠ ${item.alert}</div>` : '',
    item.tip   ? `<div class="item-tip">✓ ${item.tip}</div>`     : '',
    item.template ? `<button class="btn-template" onclick="event.stopPropagation();openTemplate('${item.template}')">✎ Gerar texto</button>` : '',
  ].join('');

  return `
    <div class="cl-item ${checked ? 'checked' : ''}" id="item_${item.id}" onclick="toggleItem('${item.id}')">
      <div class="item-checkbox"></div>
      <div class="item-content">
        <div class="item-label">${item.label}</div>
        ${extras}
      </div>
    </div>`;
}

// ── TOGGLE ITEM ──────────────────────────────────────────────
function toggleItem(id) {
  checkState[id] = !checkState[id];
  persistState();
  document.getElementById(`item_${id}`)?.classList.toggle('checked', checkState[id]);
  updateProgress();
  updateSectionBadge(id);
}

function updateSectionBadge(itemId) {
  for (const section of currentSections) {
    if (!section.items.find(i => i.id === itemId)) continue;
    const total   = section.items.length;
    const checked = section.items.filter(i => checkState[i.id]).length;
    const badge   = document.querySelector(`#sec_${section.id} .section-badge`);
    const secEl   = document.getElementById(`sec_${section.id}`);
    if (badge) {
      badge.textContent = `${checked}/${total}`;
      badge.classList.toggle('badge-done', checked === total);
    }
    if (secEl) secEl.classList.toggle('section-done', checked === total);
    break;
  }
}

// ── TOGGLE SECTION ───────────────────────────────────────────
function toggleSection(sectionId) {
  sectionCollapsed[sectionId] = !sectionCollapsed[sectionId];
  const items  = document.getElementById(`items_${sectionId}`);
  const toggle = document.querySelector(`#sec_${sectionId} .section-toggle`);
  if (items)  items.style.display = sectionCollapsed[sectionId] ? 'none' : '';
  if (toggle) toggle.classList.toggle('open', !sectionCollapsed[sectionId]);
}

// ── PROGRESS ────────────────────────────────────────────────
function updateProgress() {
  if (!currentOccurrence) return;
  const allItems = currentSections.flatMap(s => s.items);
  const total    = allItems.length;
  const checked  = allItems.filter(i => checkState[i.id]).length;
  const pct      = total ? Math.round((checked / total) * 100) : 0;

  document.getElementById('clProgressFill').style.width  = pct + '%';
  document.getElementById('clProgressLabel').textContent = `${checked} / ${total}`;

  // Celebration on 100%
  if (pct === 100) {
    document.getElementById('clProgressFill').style.background = 'var(--success)';
  } else {
    document.getElementById('clProgressFill').style.background = '';
  }
}

// ── PERSIST ─────────────────────────────────────────────────
function persistState() {
  if (!currentOccurrence) return;
  localStorage.setItem(`pc_check_${currentOccurrence.id}`, JSON.stringify(checkState));
}

// ── RESET ────────────────────────────────────────────────────
function resetChecklist() {
  if (!currentOccurrence) return;
  if (!confirm('Reiniciar o checklist? Todos os itens marcados serão desmarcados.')) return;
  checkState = {};
  persistState();
  renderChecklist();
  updateProgress();
  renderOccurrenceGrid();
}

// ── VIEW MANAGEMENT ──────────────────────────────────────────
function showView(viewId) {
  ['homeView', 'checklistView', 'refView'].forEach(id => {
    document.getElementById(id)?.classList.toggle('hidden', id !== viewId);
  });
}

function backToHome() {
  currentOccurrence = null;
  showView('homeView');
  document.getElementById('topbarTitle').textContent = 'Selecione uma ocorrência';
  document.querySelectorAll('.nav-link[data-id]').forEach(el => el.classList.remove('active'));
  renderOccurrenceGrid();
}

// ── REFERENCE ────────────────────────────────────────────────
function openRef(key) {
  const ref = REFERENCIAS[key];
  if (!ref) return;
  showView('refView');
  document.getElementById('topbarTitle').textContent = ref.title.replace(/^.\s/, '');
  document.getElementById('refBody').innerHTML = `
    <div class="ref-section">
      <div class="ref-section-title">${ref.title}</div>
      ${ref.content}
    </div>`;
  if (window.innerWidth <= 768) toggleSidebar();
}

// ── TEMPLATE MODAL ───────────────────────────────────────────
function openTemplate(templateKey) {
  const tmpl = TEMPLATES[templateKey];
  if (!tmpl) return;
  currentTemplate = templateKey;

  // Pre-fill condutor type from triage
  document.getElementById('modalTitle').textContent = tmpl.title;

  const body = document.getElementById('modalBody');
  body.innerHTML = tmpl.fields.map(f => {
    const prefill = (f.id === 'tipoCondutor' && triageAnswers.condutor)
      ? (triageAnswers.condutor === 'pm' ? 'policial militar' : 'guarda municipal')
      : '';
    return `
      <div class="modal-form-group">
        <label>${f.label}</label>
        <input type="text" id="tmpl_${f.id}" placeholder="${f.placeholder || ''}" value="${prefill}" />
      </div>`;
  }).join('') + `
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
  const tmpl   = TEMPLATES[currentTemplate];
  const values = {};
  tmpl.fields.forEach(f => {
    values[f.id] = (document.getElementById(`tmpl_${f.id}`)?.value || '').trim() || `[${f.label.toUpperCase()}]`;
  });
  const text = tmpl.generate(values);
  document.getElementById('generatedOutput').classList.remove('hidden');
  document.getElementById('generatedText').textContent = text;
  const btn = document.getElementById('copyBtn');
  btn.textContent = '📋 Copiar texto';
  btn.className   = 'btn-copy';
}

function copyGenerated() {
  const text = document.getElementById('generatedText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✓ Copiado!';
    btn.className   = 'btn-copy copied';
    setTimeout(() => { btn.textContent = '📋 Copiar texto'; btn.className = 'btn-copy'; }, 2500);
  });
}

// ── OBSERVATIONS ─────────────────────────────────────────────
function updateObsForPdf() {
  const val = document.getElementById('obsText')?.value || '';
  const el  = document.getElementById('pdfObs');
  if (el) {
    el.textContent = val;
    el.parentElement.style.display = val.trim() ? '' : 'none';
  }
}

// ── PDF / PRINT ──────────────────────────────────────────────
function generatePDF() {
  if (!currentOccurrence) { alert('Selecione uma ocorrência para gerar o PDF.'); return; }
  updateObsForPdf();
  updatePdfMeta();
  window.print();
}

// ── LOGOUT ───────────────────────────────────────────────────
function handleLogout() {
  if (!confirm('Deseja sair do Plantão Check?')) return;
  localStorage.removeItem('pc_session');
  window.location.href = 'index.html';
}

// ── KEYBOARD ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeTriageModal(); }
});
