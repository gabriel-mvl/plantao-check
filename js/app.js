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

// Plantão ativo
let plantaoAtivo = null;

// ── STATE ────────────────────────────────────────────────────
let currentOccurrence  = null;
let currentSections    = [];   // sections after triage merge
let checkState         = {};
let currentTemplate    = null;
let sectionCollapsed   = {};
let triageAnswers      = {};   // { flagrante, preso, condutor }

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  applyStoredTheme();
  renderUser();
  renderNavList();
  await loadCustomOccurrences();
  await checkPlantaoAtivo();
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
  const all = [...OCCURRENCES, ...(window._customOccurrences || [])];
  ul.innerHTML = all.map(occ => `
    <li>
      <a href="#" class="nav-link" data-id="${occ.id}" onclick="startTriage('${occ.id}'); return false;">
        <span class="nav-icon">${occ.icon}</span>${occ.name}
        ${occ._custom ? '<span class="nav-custom-badge">custom</span>' : ''}
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
  const all = [...OCCURRENCES, ...(window._customOccurrences || [])];
  grid.innerHTML = all.map(occ => {
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

  // Add "create custom" card at the end
  grid.innerHTML += `
    <div class="occ-card occ-card-new" onclick="openCustomBuilder()">
      <div class="occ-card-top">
        <div class="occ-icon">➕</div>
      </div>
      <div class="occ-name">Novo checklist</div>
      <div class="occ-count">Criar modelo personalizado</div>
    </div>`;
}

// ── TRIAGE MODAL ─────────────────────────────────────────────
function startTriage(id) {
  const occ = [...OCCURRENCES, ...(window._customOccurrences || [])].find(o => o.id === id);
  if (!occ) return;

  // Warn if another checklist has progress
  if (currentOccurrence && currentOccurrence.id !== id) {
    const allItems   = currentSections.flatMap(s => s.items);
    const anyChecked = allItems.some(i => checkState[i.id]);
    if (anyChecked && !confirm(`Você tem itens marcados em "${currentOccurrence.name}". Deseja abrir outra ocorrência? O progresso atual está salvo e pode ser retomado.`)) return;
  }

  const modo = occ.triagem || 'completa';

  // Abre direto sem modal
  if (modo === 'nenhuma') {
    triageAnswers = { flagrante: false, preso: false, condutor: 'pm' };
    if (window.innerWidth <= 768 && document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
    openOccurrence(id);
    return;
  }

  // Configura o modal conforme modo
  document.getElementById('triageOccName').textContent = occ.name;
  document.getElementById('triageOccId').value = id;
  document.querySelectorAll('.triage-opt').forEach(el => el.classList.remove('selected'));
  document.getElementById('triageMsg').classList.add('hidden');

  // Mostrar/ocultar linhas conforme modo
  const rowFlagrante = document.getElementById('triageRowFlagrante');
  const rowPreso     = document.getElementById('triageRowPreso');
  if (rowFlagrante) rowFlagrante.style.display = modo === 'completa' ? '' : 'none';
  if (rowPreso)     rowPreso.style.display     = modo === 'completa' ? '' : 'none';

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
  const id       = document.getElementById('triageOccId').value;
  const occ      = [...OCCURRENCES, ...(window._customOccurrences || [])].find(o => o.id === id);
  const modo     = occ?.triagem || 'completa';
  const condutor = document.querySelector('.triage-opt[data-group="condutor"].selected')?.dataset.value;

  if (!condutor) {
    const msg = document.getElementById('triageMsg');
    msg.textContent = 'Selecione quem está conduzindo a ocorrência.';
    msg.classList.remove('hidden');
    return;
  }

  let flagrante = false;
  let preso     = false;

  if (modo === 'completa') {
    const fVal = document.querySelector('.triage-opt[data-group="flagrante"].selected')?.dataset.value;
    const pVal = document.querySelector('.triage-opt[data-group="preso"].selected')?.dataset.value;
    if (!fVal || !pVal) {
      const msg = document.getElementById('triageMsg');
      msg.textContent = 'Responda todas as perguntas para continuar.';
      msg.classList.remove('hidden');
      return;
    }
    flagrante = fVal === 'sim';
    preso     = pVal === 'sim';
  }

  triageAnswers = { flagrante, preso, condutor };
  closeTriageModal();
  openOccurrence(id);
}

// ── OPEN OCCURRENCE ──────────────────────────────────────────
function openOccurrence(id) {
  currentOccurrence = [...OCCURRENCES, ...(window._customOccurrences || [])].find(o => o.id === id);
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
  celebrationShown = false;
  startOccurrenceTimer();
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

  document.getElementById('clProgressFill').style.background = pct === 100 ? 'var(--success)' : '';
  checkCelebration(pct);
}

// ── PERSIST ─────────────────────────────────────────────────
function persistState() {
  if (!currentOccurrence) return;
  localStorage.setItem(`pc_check_${currentOccurrence.id}`, JSON.stringify(checkState));
  // Async sync to Supabase (fire and forget)
  const bo  = document.getElementById('metaBO')?.value || '';
  const kw  = document.getElementById('metaKW')?.value || '';
  const obs = document.getElementById('obsText')?.value || '';
  syncCheckState(currentOccurrence.id, checkState, obs, bo, kw, triageAnswers);
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
  stopOccurrenceTimer();
  currentOccurrence = null;
  showView('homeView');
  document.getElementById('topbarTitle').textContent = 'Selecione uma ocorrência';
  document.querySelectorAll('.nav-link[data-id]').forEach(el => el.classList.remove('active'));
  renderOccurrenceGrid();
  renderRecentOccurrence();
  // Clear search
  const search = document.getElementById('homeSearch');
  if (search) { search.value = ''; filterOccurrences(); }
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


// ── SEARCH / FILTER ──────────────────────────────────────────
function filterOccurrences() {
  const q = (document.getElementById('homeSearch')?.value || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.occ-card');
  let visible = 0;
  cards.forEach(card => {
    const name = card.querySelector('.occ-name')?.textContent.toLowerCase() || '';
    const show = !q || name.includes(q);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const noRes = document.getElementById('noResults');
  if (noRes) noRes.classList.toggle('hidden', visible > 0);
}

// ── RECENT OCCURRENCE ─────────────────────────────────────────
function renderRecentOccurrence() {
  const el = document.getElementById('recentOccurrence');
  if (!el) return;
  let best = null, bestTime = 0;
  OCCURRENCES.forEach(occ => {
    const saved = JSON.parse(localStorage.getItem(`pc_check_${occ.id}`) || 'null');
    const ts    = parseInt(localStorage.getItem(`pc_ts_${occ.id}`) || '0');
    if (saved && Object.values(saved).some(Boolean) && ts > bestTime) {
      bestTime = ts;
      const total   = occ.sections.reduce((a,s) => a + s.items.length, 0);
      const checked = Object.values(saved).filter(Boolean).length;
      best = { occ, checked, total, pct: Math.round((checked/total)*100) };
    }
  });
  if (!best) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="recent-occ" onclick="startTriage('${best.occ.id}')">
      <span class="recent-icon">${best.occ.icon}</span>
      <div class="recent-info">
        <span class="recent-label">Continuar onde parou</span>
        <span class="recent-name">${best.occ.name}</span>
      </div>
      <div class="recent-pct">${best.pct}%</div>
      <span class="recent-arrow">→</span>
    </div>`;
}

// ── OCCURRENCE TIMER ──────────────────────────────────────────
let timerInterval = null;

function startOccurrenceTimer() {
  stopOccurrenceTimer();
  if (!currentOccurrence) return;
  const key = `pc_ts_${currentOccurrence.id}`;
  if (!localStorage.getItem(key)) localStorage.setItem(key, Date.now().toString());
  const startTime = parseInt(localStorage.getItem(key));
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const h = Math.floor(elapsed / 3600000);
    const m = Math.floor((elapsed % 3600000) / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const display = h > 0
      ? `${h}h ${String(m).padStart(2,'0')}m`
      : `${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
    const el = document.getElementById('occTimer');
    if (el) el.textContent = display;
  }, 1000);
}

function stopOccurrenceTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// ── CELEBRATION (100%) ────────────────────────────────────────
let celebrationShown = false;

function checkCelebration(pct) {
  if (pct === 100 && !celebrationShown) {
    celebrationShown = true;
    showCelebration();
  }
  if (pct < 100) celebrationShown = false;
}

function showCelebration() {
  const banner = document.getElementById('celebrationBanner');
  if (!banner) return;
  banner.classList.remove('hidden');
  banner.classList.add('celebrate-in');
  setTimeout(() => {
    banner.classList.add('celebrate-out');
    setTimeout(() => {
      banner.classList.add('hidden');
      banner.classList.remove('celebrate-in','celebrate-out');
    }, 500);
  }, 3500);
}

// ── PLANTÃO DIÁRIO ────────────────────────────────────────────
const PLANTAO_DIARIO = [
  {
    id: 'pd_livros', icon: '📚', name: 'Livros obrigatórios',
    items: [
      { id: 'pd1', label: 'Preenchimento do livro de BO' },
      { id: 'pd2', label: 'Preenchimento do livro de objetos apreendidos' },
      { id: 'pd3', label: 'Preenchimento do livro de fiança' },
    ]
  },
  {
    id: 'pd_iml', icon: '🏥', name: 'Comunicações ao IML',
    items: [
      { id: 'pd4', label: 'Envio de e-mail ao IML — exames indiretos de presos', obs: 'Anexar ficha clínica e requisição de cada preso custodiado' },
      { id: 'pd5', label: 'Envio de e-mail ao IML — exames indiretos de vítimas', obs: 'Anexar ficha clínica e requisição de cada vítima atendida' },
    ]
  },
  {
    id: 'pd_comunicacoes', icon: '📧', name: 'Comunicações de praxe',
    items: [
      { id: 'pd6', label: 'Comunicações de captura de procurado', obs: 'Para cada captura: e-mail aos destinatários obrigatórios + confirmar audiência de custódia' },
      { id: 'pd7', label: 'Comunicações de pessoa desaparecida', obs: 'Para cada BO de desaparecimento: e-mail ao CEPOL, DPM local e Delegacia de Homicídios da região' },
    ]
  },
];

let plantaoState = {};

function openPlantaoDiario() {
  const saved = JSON.parse(localStorage.getItem('pc_plantao_diario') || 'null');
  plantaoState = saved || {};
  const body = document.getElementById('plantaoBody');
  if (!body) return;
  body.innerHTML = PLANTAO_DIARIO.map(section => {
    const total   = section.items.length;
    const checked = section.items.filter(i => plantaoState[i.id]).length;
    const done    = checked === total;
    const items   = section.items.map(item => {
      const isChecked = !!plantaoState[item.id];
      const extra = item.obs ? `<div class="item-obs">ℹ ${item.obs}</div>` : '';
      return `
        <div class="cl-item ${isChecked ? 'checked' : ''}" id="pd_item_${item.id}" onclick="togglePlantaoItem('${item.id}')">
          <div class="item-checkbox"></div>
          <div class="item-content"><div class="item-label">${item.label}</div>${extra}</div>
        </div>`;
    }).join('');
    return `
      <div class="cl-section ${done ? 'section-done' : ''}" style="margin-bottom:.75rem">
        <div class="cl-section-header" style="cursor:default">
          <span class="section-icon">${section.icon}</span>
          <span class="section-name">${section.name}</span>
          <span class="section-badge ${done ? 'badge-done' : ''}">${checked}/${total}</span>
        </div>
        <div class="cl-items">${items}</div>
      </div>`;
  }).join('');
  document.getElementById('plantaoBackdrop').classList.remove('hidden');
  document.getElementById('plantaoModal').classList.remove('hidden');
}

function togglePlantaoItem(id) {
  plantaoState[id] = !plantaoState[id];
  localStorage.setItem('pc_plantao_diario', JSON.stringify(plantaoState));
  const el = document.getElementById(`pd_item_${id}`);
  if (el) el.classList.toggle('checked', plantaoState[id]);
  for (const section of PLANTAO_DIARIO) {
    if (!section.items.find(i => i.id === id)) continue;
    const total   = section.items.length;
    const checked = section.items.filter(i => plantaoState[i.id]).length;
    const secEl   = document.getElementById(`pd_item_${section.items[0].id}`)?.closest('.cl-section');
    if (secEl) {
      const badge = secEl.querySelector('.section-badge');
      if (badge) { badge.textContent = `${checked}/${total}`; badge.classList.toggle('badge-done', checked===total); }
      secEl.classList.toggle('section-done', checked===total);
    }
    break;
  }
}

function resetPlantao() {
  if (!confirm('Reiniciar a rotina do plantão?')) return;
  plantaoState = {};
  localStorage.removeItem('pc_plantao_diario');
  openPlantaoDiario();
}

function closePlantaoDiario() {
  document.getElementById('plantaoBackdrop').classList.add('hidden');
  document.getElementById('plantaoModal').classList.add('hidden');
}

// ── KEYBOARD ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeTriageModal(); closePlantaoDiario(); }
});

// ── PLANTÃO OBRIGATÓRIO ───────────────────────────────────────
async function checkPlantaoAtivo() {
  // Check localStorage first (fast)
  const localId = localStorage.getItem('pc_plantao_id');
  if (localId) {
    try {
      const rows = await DB_Plantoes.listar(session.email);
      plantaoAtivo = rows?.find(p => p.id === localId && p.status === 'aberto') || null;
    } catch(e) { /* offline - use local */ }
  }

  if (!plantaoAtivo) {
    // Try to find open plantao in Supabase
    try {
      plantaoAtivo = await DB_Plantoes.buscarAberto(session.email);
      if (plantaoAtivo) localStorage.setItem('pc_plantao_id', plantaoAtivo.id);
    } catch(e) { /* offline */ }
  }

  if (plantaoAtivo) {
    renderAppWithPlantao();
  } else {
    openPlantaoModal();
  }
}

function openPlantaoModal() {
  document.getElementById('plantaoInicioBackdrop')?.classList.remove('hidden');
  document.getElementById('plantaoInicioModal')?.classList.remove('hidden');
  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('plantaoData');
  if (dateEl) dateEl.value = today;
}

async function confirmarAberturaPlan() {
  const data      = document.getElementById('plantaoData')?.value;
  const turno     = document.querySelector('.turno-opt.selected')?.dataset.value;
  const delegacia = document.getElementById('plantaoDelegacia')?.value?.trim();
  const delegado  = document.getElementById('plantaoDelegado')?.value?.trim();

  const msg = document.getElementById('plantaoInicioMsg');

  if (!data || !turno || !delegacia || !delegado) {
    msg.textContent = 'Preencha todos os campos para continuar.';
    msg.classList.remove('hidden');
    return;
  }
  msg.classList.add('hidden');

  const btn = document.getElementById('btnAbrirPlantao');
  btn.textContent = 'Abrindo...';
  btn.disabled = true;

  try {
    const rows = await DB_Plantoes.criar(session.email, {
      data, turno, delegacia, delegado, status: 'aberto'
    });
    plantaoAtivo = Array.isArray(rows) ? rows[0] : rows;
    localStorage.setItem('pc_plantao_id', plantaoAtivo.id);
  } catch(e) {
    // Offline fallback
    plantaoAtivo = { id: `local_${Date.now()}`, data, turno, delegacia, delegado, status: 'aberto' };
    localStorage.setItem('pc_plantao_id', plantaoAtivo.id);
    localStorage.setItem(`pc_plantao_data_${plantaoAtivo.id}`, JSON.stringify(plantaoAtivo));
  }

  document.getElementById('plantaoInicioBackdrop')?.classList.add('hidden');
  document.getElementById('plantaoInicioModal')?.classList.add('hidden');
  renderAppWithPlantao();
}

function selectTurno(value, el) {
  document.querySelectorAll('.turno-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  el.dataset.value = value;
}

function renderAppWithPlantao() {
  // Update plantao info bar
  const bar = document.getElementById('plantaoBar');
  if (bar && plantaoAtivo) {
    const data = new Date(plantaoAtivo.data + 'T12:00:00').toLocaleDateString('pt-BR');
    const turnoLabel = { diurno: '☀ Diurno', noturno: '🌙 Noturno', extraordinario: '⭐ Extraordinário' };
    bar.innerHTML = `
      <span class="plantao-bar-info">
        <span class="plantao-bar-icon">📋</span>
        <span><strong>${plantaoAtivo.delegacia}</strong> — ${turnoLabel[plantaoAtivo.turno] || plantaoAtivo.turno} — ${data} — Del. ${plantaoAtivo.delegado}</span>
      </span>
      <button class="plantao-bar-btn" onclick="encerrarPlantao()">Encerrar plantão</button>`;
    bar.style.display = 'flex';
  }

  renderNavList();
  renderOccurrenceGrid();
  renderRecentOccurrence();
}

async function encerrarPlantao() {
  if (!confirm('Encerrar o plantão atual? Você precisará abrir um novo plantão para registrar ocorrências.')) return;
  try {
    if (plantaoAtivo?.id && !plantaoAtivo.id.startsWith('local_')) {
      await DB_Plantoes.encerrar(plantaoAtivo.id);
    }
  } catch(e) { /* offline */ }
  localStorage.removeItem('pc_plantao_id');
  plantaoAtivo = null;
  openPlantaoModal();
}

// ── HISTÓRICO ─────────────────────────────────────────────────
async function openHistorico() {
  showView('historicoView');
  document.getElementById('topbarTitle').textContent = 'Histórico de Ocorrências';
  document.querySelectorAll('.nav-link[data-id]').forEach(el => el.classList.remove('active'));

  const container = document.getElementById('historicoList');
  container.innerHTML = '<div class="hist-loading">Carregando...</div>';

  try {
    const rows = await DB_Ocorrencias.listarHistorico(session.email, 50);
    if (!rows?.length) {
      container.innerHTML = '<div class="hist-empty">Nenhuma ocorrência registrada ainda.</div>';
      return;
    }
    container.innerHTML = rows.map(row => {
      const dt = new Date(row.created_at).toLocaleString('pt-BR');
      const statusLabel = row.status === 'concluido'
        ? '<span class="hist-status done">Concluído</span>'
        : '<span class="hist-status wip">Em andamento</span>';
      const bo = row.num_bo ? `<span class="hist-bo">BO ${row.num_bo}</span>` : '';
      const kw = row.palavras_chave ? `<span class="hist-kw">${row.palavras_chave}</span>` : '';
      return `
        <div class="hist-item" onclick="reabrirOcorrencia('${row.id}', '${row.tipo_id}', ${JSON.stringify(JSON.stringify(row.check_state))}, ${JSON.stringify(JSON.stringify(row.triage))}, ${JSON.stringify(row.num_bo||'')}, ${JSON.stringify(row.palavras_chave||'')}, ${JSON.stringify(row.observacoes||'')})">
          <div class="hist-main">
            <span class="hist-nome">${row.tipo_nome}</span>
            ${statusLabel}
          </div>
          <div class="hist-meta">${bo}${kw}<span class="hist-dt">${dt}</span></div>
          <button class="hist-del" onclick="event.stopPropagation();deletarOcorrencia('${row.id}')" title="Remover">🗑</button>
        </div>`;
    }).join('');
  } catch(e) {
    container.innerHTML = '<div class="hist-empty">Erro ao carregar histórico. Verifique sua conexão.</div>';
  }
}

function reabrirOcorrencia(rowId, tipoId, checkStateStr, triageStr, bo, kw, obs) {
  const occ = [...OCCURRENCES, ...(window._customOccurrences || [])].find(o => o.id === tipoId);
  if (!occ) { alert('Tipo de ocorrência não encontrado.'); return; }
  try {
    checkState   = JSON.parse(checkStateStr);
    triageAnswers = JSON.parse(triageStr) || {};
  } catch(e) {
    checkState = {}; triageAnswers = {};
  }
  localStorage.setItem(`pc_check_${tipoId}`, JSON.stringify(checkState));
  currentOccurrence = occ;
  currentSections   = buildSections(occ, triageAnswers);
  sectionCollapsed  = {};
  showView('checklistView');
  setActiveNav(tipoId);
  document.getElementById('topbarTitle').textContent = occ.name;
  document.getElementById('clTitle').textContent     = occ.name;
  document.getElementById('clDesc').textContent      = occ.desc || '';
  document.getElementById('metaBO').value            = bo || '';
  document.getElementById('metaKW').value            = kw || '';
  document.getElementById('obsText').value           = obs || '';
  renderChecklist();
  updateProgress();
  updatePdfMeta();
  celebrationShown = false;
  startOccurrenceTimer();
}

async function deletarOcorrencia(id) {
  if (!confirm('Remover esta ocorrência do histórico?')) return;
  try {
    await DB_Ocorrencias.deletar(id);
    openHistorico();
  } catch(e) {
    alert('Erro ao remover. Tente novamente.');
  }
}

// ── BNMP — BUSCA DE PROCURADOS ────────────────────────────────
function openBNMP() {
  document.getElementById('bnmpBackdrop').classList.remove('hidden');
  document.getElementById('bnmpModal').classList.remove('hidden');
  document.getElementById('bnmpNome').focus();
}

function closeBNMP() {
  document.getElementById('bnmpBackdrop').classList.add('hidden');
  document.getElementById('bnmpModal').classList.add('hidden');
}

function buscarBNMP() {
  const nome = document.getElementById('bnmpNome')?.value?.trim();
  const cpf  = document.getElementById('bnmpCPF')?.value?.trim().replace(/\D/g,'');
  const rg   = document.getElementById('bnmpRG')?.value?.trim();

  if (!nome && !cpf && !rg) {
    document.getElementById('bnmpMsg').classList.remove('hidden');
    return;
  }
  document.getElementById('bnmpMsg').classList.add('hidden');

  // Monta URL do BNMP com parâmetros
  const params = new URLSearchParams();
  if (nome) params.set('nomePessoa', nome);
  if (cpf)  params.set('cpf', cpf);
  // BNMP não aceita RG diretamente, mas incluímos no nome se informado
  const nomeCompleto = nome + (rg ? ` RG ${rg}` : '');
  if (nome) params.set('nomePessoa', nomeCompleto);

  const url = `https://portalbnmp.cnj.jus.br/#/pesquisa-peca?${params.toString()}`;
  window.open(url, '_blank', 'noopener');
  closeBNMP();
}

// ── CHECKLISTS PERSONALIZADOS ─────────────────────────────────
window._customOccurrences = [];

async function loadCustomOccurrences() {
  try {
    const rows = await DB_Custom.listar(session.email);
    if (rows?.length) {
      window._customOccurrences = rows.map(r => ({
        id: `custom_${r.id}`,
        _customDbId: r.id,
        _custom: true,
        icon: r.icone || '📋',
        name: r.nome,
        desc: 'Checklist personalizado',
        triagem: 'condutor',
        sections: r.sections || [],
      }));
    }
  } catch(e) {
    // Offline: load from localStorage
    const local = JSON.parse(localStorage.getItem('pc_custom_checklists') || '[]');
    window._customOccurrences = local;
  }
}

function openCustomBuilder(editId = null) {
  const existing = editId
    ? window._customOccurrences.find(o => o.id === editId)
    : null;

  document.getElementById('customBuilderTitle').textContent = existing ? 'Editar checklist' : 'Novo checklist personalizado';
  document.getElementById('customNome').value  = existing?.name || '';
  document.getElementById('customIcone').value = existing?.icon || '📋';
  document.getElementById('customEditId').value = editId || '';

  // Render existing sections/items
  renderCustomSections(existing?.sections || []);

  document.getElementById('customBackdrop').classList.remove('hidden');
  document.getElementById('customBuilderModal').classList.remove('hidden');
}

function closeCustomBuilder() {
  document.getElementById('customBackdrop').classList.add('hidden');
  document.getElementById('customBuilderModal').classList.add('hidden');
}

function renderCustomSections(sections) {
  const container = document.getElementById('customSections');
  container.innerHTML = sections.map((s, si) => `
    <div class="custom-section" id="csec_${si}">
      <div class="custom-section-header">
        <input class="custom-input" value="${s.name}" placeholder="Nome da seção" id="csec_name_${si}" />
        <button class="custom-del-btn" onclick="removeCustomSection(${si})">✕</button>
      </div>
      <div class="custom-items" id="citems_${si}">
        ${s.items.map((item, ii) => `
          <div class="custom-item-row">
            <input class="custom-input custom-item-input" value="${item.label}" placeholder="Descrição do item" id="citem_${si}_${ii}" />
            <button class="custom-del-btn" onclick="removeCustomItem(${si},${ii})">✕</button>
          </div>`).join('')}
      </div>
      <button class="custom-add-item-btn" onclick="addCustomItem(${si})">+ Adicionar item</button>
    </div>`).join('');
}

function addCustomSection() {
  const sections = collectCustomSections();
  sections.push({ name: '', items: [] });
  renderCustomSections(sections);
}

function removeCustomSection(si) {
  const sections = collectCustomSections();
  sections.splice(si, 1);
  renderCustomSections(sections);
}

function addCustomItem(si) {
  const sections = collectCustomSections();
  if (!sections[si]) return;
  sections[si].items.push({ id: `ci_${Date.now()}`, label: '' });
  renderCustomSections(sections);
}

function removeCustomItem(si, ii) {
  const sections = collectCustomSections();
  sections[si]?.items.splice(ii, 1);
  renderCustomSections(sections);
}

function collectCustomSections() {
  const container = document.getElementById('customSections');
  const secEls = container.querySelectorAll('.custom-section');
  return Array.from(secEls).map((secEl, si) => {
    const name = document.getElementById(`csec_name_${si}`)?.value?.trim() || 'Seção';
    const itemEls = secEl.querySelectorAll('.custom-item-input');
    const items = Array.from(itemEls).map((el, ii) => ({
      id: `ci_${si}_${ii}_${Date.now()}`,
      label: el.value.trim() || 'Item',
    })).filter(i => i.label && i.label !== 'Item' || true);
    return { id: `csec_${si}`, icon: '📋', name, items };
  });
}

async function salvarCustomChecklist() {
  const nome  = document.getElementById('customNome')?.value?.trim();
  const icone = document.getElementById('customIcone')?.value?.trim() || '📋';
  const editId = document.getElementById('customEditId')?.value;

  if (!nome) {
    alert('Informe um nome para o checklist.');
    return;
  }

  const sections = collectCustomSections().filter(s => s.items.length > 0);
  if (!sections.length) {
    alert('Adicione pelo menos uma seção com um item.');
    return;
  }

  const btn = document.getElementById('btnSalvarCustom');
  btn.textContent = 'Salvando...';
  btn.disabled = true;

  try {
    if (editId) {
      const dbId = editId.replace('custom_', '');
      await DB_Custom.atualizar(dbId, { nome, icone, sections });
    } else {
      await DB_Custom.criar(session.email, { nome, icone, sections });
    }
  } catch(e) {
    // Offline fallback
    const local = JSON.parse(localStorage.getItem('pc_custom_checklists') || '[]');
    const newOcc = {
      id: `custom_local_${Date.now()}`, _custom: true,
      icon: icone, name: nome, desc: 'Checklist personalizado',
      triagem: 'condutor', sections,
    };
    if (editId) {
      const idx = local.findIndex(o => o.id === editId);
      if (idx >= 0) local[idx] = newOcc;
    } else {
      local.push(newOcc);
    }
    localStorage.setItem('pc_custom_checklists', JSON.stringify(local));
  }

  await loadCustomOccurrences();
  renderNavList();
  renderOccurrenceGrid();
  closeCustomBuilder();

  btn.textContent = 'Salvar checklist';
  btn.disabled = false;
}

async function deletarCustomChecklist(occId) {
  if (!confirm('Excluir este checklist personalizado?')) return;
  try {
    const dbId = occId.replace('custom_', '');
    await DB_Custom.deletar(dbId);
  } catch(e) {
    const local = JSON.parse(localStorage.getItem('pc_custom_checklists') || '[]');
    localStorage.setItem('pc_custom_checklists', JSON.stringify(local.filter(o => o.id !== occId)));
  }
  await loadCustomOccurrences();
  renderNavList();
  renderOccurrenceGrid();
}

// ── JURISPRUDÊNCIA ────────────────────────────────────────────
function openArtigos(categoriaId) {
  const cat = ARTIGOS.find(a => a.id === categoriaId);
  if (!cat) return;

  showView('refView');
  document.getElementById('topbarTitle').textContent = cat.nome;
  document.getElementById('refBody').innerHTML = `
    <div class="ref-section">
      <div class="ref-section-title ${cat.destaque_categoria ? 'ref-title-destaque' : ''}">${cat.icon} ${cat.nome} <span class="ref-subtitle">${cat.subtitulo}</span></div>
      <div class="artigos-list">
        ${cat.itens.map(item => `
          <div class="artigo-item ${item.destaque ? 'artigo-destaque' : ''}">
            <div class="artigo-header">
              <span class="artigo-num">${item.artigo}</span>
              <span class="artigo-titulo">${item.titulo}</span>
            </div>
            <p class="artigo-texto">${item.texto}</p>
          </div>`).join('')}
      </div>
    </div>`;

  if (window.innerWidth <= 768) toggleSidebar();
}

// ── UPDATE showView to include historico ──────────────────────
const _origShowView = showView;
showView = function(viewId) {
  ['homeView','checklistView','refView','historicoView'].forEach(id => {
    document.getElementById(id)?.classList.toggle('hidden', id !== viewId);
  });
};


// ── ARTIGOS MENU ──────────────────────────────────────────────
function openArtigosMenu() {
  const body = document.getElementById('artigosMenuBody');
  if (body) {
    body.innerHTML = ARTIGOS.map(cat => `
      <div class="artigos-menu-item ${cat.destaque_categoria ? 'artigos-menu-destaque' : ''}"
           onclick="closeArtigosMenu(); openArtigos('${cat.id}')">
        <span class="artigos-menu-icon">${cat.icon}</span>
        <div class="artigos-menu-info">
          <span class="artigos-menu-nome">${cat.nome}</span>
          <span class="artigos-menu-sub">${cat.subtitulo}</span>
        </div>
        <span style="color:var(--text-muted)">→</span>
      </div>`).join('');
  }
  document.getElementById('artigosMenuBackdrop')?.classList.remove('hidden');
  document.getElementById('artigosMenuModal')?.classList.remove('hidden');
  if (window.innerWidth <= 768) toggleSidebar();
}

function closeArtigosMenu() {
  document.getElementById('artigosMenuBackdrop')?.classList.add('hidden');
  document.getElementById('artigosMenuModal')?.classList.add('hidden');
}

// Update keyboard handler to close new modals
document.removeEventListener('keydown', window._keyHandler);
window._keyHandler = e => {
  if (e.key === 'Escape') {
    closeModal();
    closeTriageModal();
    closePlantaoDiario();
    closeBNMP();
    closeCustomBuilder();
    closeArtigosMenu();
  }
};
document.addEventListener('keydown', window._keyHandler);

// ── SYNC INDICATOR ────────────────────────────────────────────
function showSync() {
  const el = document.getElementById('syncIndicator');
  if (el) { el.classList.remove('hidden'); el.classList.add('syncing'); }
}
function hideSync() {
  const el = document.getElementById('syncIndicator');
  if (el) { el.classList.add('hidden'); el.classList.remove('syncing'); }
}

// Override syncCheckState to show indicator
const _origSync = syncCheckState;
syncCheckState = async function(...args) {
  showSync();
  try { await _origSync(...args); } finally { setTimeout(hideSync, 1200); }
};

// ── RELATÓRIO DO PLANTÃO ──────────────────────────────────────
async function openRelatorio() {
  if (!plantaoAtivo) {
    alert('Nenhum plantão ativo. Abra um plantão para gerar o relatório.');
    return;
  }

  showView('relatorioView');
  document.getElementById('topbarTitle').textContent = 'Relatório do Plantão';
  document.querySelectorAll('.nav-link[data-id]').forEach(el => el.classList.remove('active'));
  if (window.innerWidth <= 768) toggleSidebar();

  const container = document.getElementById('relatorioContent');
  container.innerHTML = '<div class="hist-loading">Carregando ocorrências...</div>';

  let ocorrencias = [];
  try {
    ocorrencias = await DB_Ocorrencias.listarPorPlantao(plantaoAtivo.id) || [];
  } catch(e) {
    // Fallback: try localStorage
    const all = [...OCCURRENCES, ...(window._customOccurrences || [])];
    all.forEach(occ => {
      const saved = JSON.parse(localStorage.getItem(`pc_check_${occ.id}`) || 'null');
      if (saved && Object.values(saved).some(Boolean)) {
        ocorrencias.push({
          tipo_id: occ.id, tipo_nome: occ.name,
          check_state: saved, status: 'andamento',
          triage: {}, num_bo: '', palavras_chave: '', observacoes: '',
          created_at: new Date().toISOString(),
        });
      }
    });
  }

  const data = new Date(plantaoAtivo.data + 'T12:00:00').toLocaleDateString('pt-BR');
  const turnoLabel = { diurno: 'Diurno', noturno: 'Noturno', extraordinario: 'Extraordinário' };
  const concluidas = ocorrencias.filter(o => o.status === 'concluido').length;

  container.innerHTML = `
    <div class="relatorio-actions">
      <button class="btn-primary" onclick="window.print()" style="width:auto;margin-top:0">&#128424; Imprimir / PDF</button>
      <button class="btn-secondary" onclick="backToHome()">&#8592; Voltar</button>
    </div>

    <div class="relatorio-doc" id="relatorioDoc">
      <div class="rel-header">
        <div class="rel-brand-row">
          <div class="rel-brand-icon">&#9878;</div>
          <div>
            <div class="rel-brand-name">Plant&#227;o<span>Check</span></div>
            <div class="rel-brand-sub">Relat&#243;rio do Plant&#227;o</div>
          </div>
        </div>
        <div class="rel-plantao-info">
          <div class="rel-info-row"><span class="rel-info-label">Delegacia</span><span class="rel-info-val">${plantaoAtivo.delegacia}</span></div>
          <div class="rel-info-row"><span class="rel-info-label">Delegado plantonista</span><span class="rel-info-val">${plantaoAtivo.delegado}</span></div>
          <div class="rel-info-row"><span class="rel-info-label">Data</span><span class="rel-info-val">${data}</span></div>
          <div class="rel-info-row"><span class="rel-info-label">Turno</span><span class="rel-info-val">${turnoLabel[plantaoAtivo.turno] || plantaoAtivo.turno}</span></div>
          <div class="rel-info-row"><span class="rel-info-label">Ocorrências registradas</span><span class="rel-info-val">${ocorrencias.length} (${concluidas} concluída${concluidas !== 1 ? 's' : ''})</span></div>
          <div class="rel-info-row"><span class="rel-info-label">Gerado em</span><span class="rel-info-val">${new Date().toLocaleString('pt-BR')}</span></div>
        </div>
      </div>

      ${ocorrencias.length === 0 ? '<div class="rel-empty">Nenhuma ocorrência registrada neste plantão.</div>' :
        ocorrencias.map((oc, idx) => renderRelatorioOcorrencia(oc, idx + 1)).join('')}

      <div class="rel-footer">
        Plant&#227;oCheck &mdash; Ferramenta de apoio operacional independente, sem v&#237;nculo institucional &mdash; Desenvolvido por Gabriel Vital
      </div>
    </div>`;
}

function renderRelatorioOcorrencia(oc, num) {
  const allOcc = [...OCCURRENCES, ...(window._customOccurrences || [])];
  const occ = allOcc.find(o => o.id === oc.tipo_id);
  const checkState = oc.check_state || {};
  const triage = oc.triage || {};
  const dt = new Date(oc.created_at).toLocaleString('pt-BR');

  const statusBadge = oc.status === 'concluido'
    ? '<span class="rel-badge-done">Conclu&#237;do</span>'
    : '<span class="rel-badge-wip">Em andamento</span>';

  const condutor = triage.condutor === 'gcm' ? 'GCM' : triage.condutor ? 'PM' : '—';
  const flagrante = triage.flagrante ? 'Sim' : triage.flagrante === false ? 'Não' : '—';
  const preso = triage.preso ? 'Sim' : triage.preso === false ? 'Não' : '—';

  // Build sections with check state
  let sectionsHtml = '';
  if (occ) {
    const sections = occ.sections || [];
    sections.forEach(sec => {
      const items = sec.items.map(item => {
        const checked = !!checkState[item.id];
        return `<div class="rel-item ${checked ? 'rel-item-done' : ''}">
          <span class="rel-item-box">${checked ? '&#10003;' : ''}</span>
          <span class="rel-item-label">${item.label}</span>
        </div>`;
      }).join('');
      const total = sec.items.length;
      const done = sec.items.filter(i => checkState[i.id]).length;
      sectionsHtml += `
        <div class="rel-section">
          <div class="rel-section-header">
            <span>${sec.icon} ${sec.name}</span>
            <span class="rel-section-badge">${done}/${total}</span>
          </div>
          <div class="rel-section-items">${items}</div>
        </div>`;
    });
  }

  return `
    <div class="rel-ocorrencia">
      <div class="rel-oc-header">
        <div class="rel-oc-num">${num}</div>
        <div class="rel-oc-info">
          <div class="rel-oc-nome">${oc.tipo_nome}</div>
          <div class="rel-oc-meta">
            ${oc.num_bo ? `<span>BO ${oc.num_bo}</span>` : ''}
            ${oc.palavras_chave ? `<span>${oc.palavras_chave}</span>` : ''}
            <span>${dt}</span>
            <span>Condutor: ${condutor}</span>
            <span>Flagrante: ${flagrante}</span>
            <span>Preso: ${preso}</span>
          </div>
        </div>
        ${statusBadge}
      </div>
      ${sectionsHtml}
      ${oc.observacoes ? `<div class="rel-observacoes"><strong>Observa&#231;&#245;es:</strong> ${oc.observacoes}</div>` : ''}
    </div>`;
}

// ── QUESITOS ──────────────────────────────────────────────────
function openQuesitosMenu() {
  renderQuesitosMenu('');
  document.getElementById('quesitosMenuBackdrop')?.classList.remove('hidden');
  document.getElementById('quesitosMenuModal')?.classList.remove('hidden');
  document.getElementById('quesitosSearch')?.focus();
  if (window.innerWidth <= 768) toggleSidebar();
}

function closeQuesitosMenu() {
  document.getElementById('quesitosMenuBackdrop')?.classList.add('hidden');
  document.getElementById('quesitosMenuModal')?.classList.add('hidden');
}

function filterQuesitos() {
  const q = document.getElementById('quesitosSearch')?.value || '';
  renderQuesitosMenu(q);
}

function renderQuesitosMenu(q) {
  const body = document.getElementById('quesitosMenuBody');
  if (!body) return;
  const lower = q.toLowerCase();

  const filtered = q
    ? QUESITOS.filter(cat =>
        cat.crime.toLowerCase().includes(lower) ||
        cat.artigo.toLowerCase().includes(lower) ||
        cat.grupos.some(g =>
          g.nome.toLowerCase().includes(lower) ||
          g.itens.some(i => i.toLowerCase().includes(lower))
        )
      )
    : QUESITOS;

  if (!filtered.length) {
    body.innerHTML = '<div class="hist-empty">Nenhum quesito encontrado.</div>';
    return;
  }

  body.innerHTML = filtered.map(cat => `
    <div class="artigos-menu-item" onclick="closeQuesitosMenu(); openQuesitos('${cat.id}')">
      <span class="artigos-menu-icon">${cat.icon}</span>
      <div class="artigos-menu-info">
        <span class="artigos-menu-nome">${cat.crime}</span>
        <span class="artigos-menu-sub">${cat.artigo} &middot; ${cat.grupos.reduce((a,g) => a + g.itens.length, 0)} quesitos</span>
      </div>
      <span style="color:var(--text-muted)">&#8594;</span>
    </div>`).join('');
}

function openQuesitos(catId) {
  const cat = QUESITOS.find(q => q.id === catId);
  if (!cat) return;

  showView('refView');
  document.getElementById('topbarTitle').textContent = cat.crime;

  const gruposHtml = cat.grupos.map(g => `
    <div class="artigo-item">
      <div class="artigo-header">
        <span class="artigo-num">${g.nome}</span>
      </div>
      <ol class="quesitos-list">
        ${g.itens.map(item => `<li class="quesito-item">${item}</li>`).join('')}
      </ol>
    </div>`).join('');

  const obsHtml = cat.obs ? `
    <div class="artigo-item" style="background:rgba(251,191,36,.04);border-left:3px solid var(--warning)">
      <div class="artigo-header"><span class="artigo-num" style="background:rgba(251,191,36,.15);color:var(--warning);border-color:transparent">Observações</span></div>
      <p class="artigo-texto">${cat.obs}</p>
    </div>` : '';

  document.getElementById('refBody').innerHTML = `
    <div class="ref-section">
      <div class="ref-section-title">${cat.icon} ${cat.crime} <span class="ref-subtitle">${cat.artigo}</span></div>
      <div class="artigos-list">
        ${gruposHtml}
        ${obsHtml}
      </div>
    </div>`;
}

// ── UPDATE showView to include relatorio ──────────────────────
showView = function(viewId) {
  ['homeView','checklistView','refView','historicoView','relatorioView'].forEach(id => {
    document.getElementById(id)?.classList.toggle('hidden', id !== viewId);
  });
};
