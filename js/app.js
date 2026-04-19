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
  renderDocCards();
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
      { pm:'Condutor: PM', gcm:'Condutor: GCM', pc:'Condutor: PC', parte:'Parte interessada' }[triageAnswers.condutor] || 'Condutor: PM',
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
  renderNavList();
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
    const condutorTextoMap = { pm:'policial militar', gcm:'guarda municipal', pc:'policial civil', parte:'parte interessada' };
    const prefill = (f.id === 'tipoCondutor' && triageAnswers.condutor)
      ? (condutorTextoMap[triageAnswers.condutor] || 'policial militar')
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

async function finalizarOcorrenciaHist(rowId) {
  if (!confirm('Marcar esta ocorrência como concluída?')) return;
  try {
    await DB_Ocorrencias.atualizar(rowId, { status: 'concluido', updated_at: new Date().toISOString() });
    showToast('✓ Ocorrência finalizada');
    openHistorico();
  } catch(e) {
    alert('Erro ao finalizar. Verifique sua conexão.');
  }
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
  showSplash('Recuperando sessão...');

  const localId = localStorage.getItem('pc_plantao_id');

  // 1. Try Supabase for the locally stored plantao ID
  if (localId) {
    try {
      const rows = await DB_Plantoes.listar(session.email);
      plantaoAtivo = rows?.find(p => p.id === localId && p.status === 'aberto') || null;
    } catch(e) { /* offline */ }
  }

  // 2. If nothing found locally, search Supabase for any open plantao today
  if (!plantaoAtivo) {
    try {
      plantaoAtivo = await DB_Plantoes.buscarAberto(session.email);
      if (plantaoAtivo) {
        localStorage.setItem('pc_plantao_id', plantaoAtivo.id);
        showToast(`↩ Plantão de ${new Date(plantaoAtivo.data + 'T12:00:00').toLocaleDateString('pt-BR')} recuperado`);
      }
    } catch(e) { /* offline */ }
  }

  // 3. Offline fallback: reconstruct from localStorage
  if (!plantaoAtivo && localId) {
    const localData = JSON.parse(localStorage.getItem(`pc_plantao_data_${localId}`) || 'null');
    if (localData) {
      plantaoAtivo = localData;
      showToast('⚡ Modo offline — dados locais');
    }
  }

  hideSplash();

  if (plantaoAtivo) {
    renderAppWithPlantao();
    showToast(`📋 ${plantaoAtivo.delegacia} — ${plantaoAtivo.turno === 'diurno' ? 'Diurno' : plantaoAtivo.turno === 'noturno' ? 'Noturno' : 'Extraordinário'}`);
  } else {
    openPlantaoModal();
  }
  renderAndamentoSection();
}

function showSplash(msg) {
  let el = document.getElementById('appSplash');
  if (!el) {
    el = document.createElement('div');
    el.id = 'appSplash';
    el.className = 'app-splash';
    document.body.appendChild(el);
  }
  el.innerHTML = `<div class="splash-inner"><div class="splash-spinner"></div><span>${msg}</span></div>`;
  el.classList.remove('hidden');
}

function hideSplash() {
  const el = document.getElementById('appSplash');
  if (el) {
    el.classList.add('splash-fade');
    setTimeout(() => el.remove(), 400);
  }
}

function openPlantaoModal() {
  document.getElementById('plantaoInicioBackdrop')?.classList.remove('hidden');
  document.getElementById('plantaoInicioModal')?.classList.remove('hidden');
  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('plantaoData');
  if (dateEl && !dateEl.value) dateEl.value = today;
  // Populate dept select from PCSP_UNITS (lazy)
  const deptSel = document.getElementById('plantaoDept');
  if (deptSel && deptSel.options.length <= 1 && typeof PCSP_UNITS !== 'undefined') {
    const seen = new Set();
    const depts = [];
    PCSP_UNITS.forEach(u => {
      if (!seen.has(u.dept_raw)) { seen.add(u.dept_raw); depts.push({ raw: u.dept_raw, label: u.dept }); }
    });
    depts.sort((a, b) => a.raw.localeCompare(b.raw, 'pt-BR'));
    depts.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.raw; opt.textContent = d.label;
      deptSel.appendChild(opt);
    });
  }
}

function onPlantaoDeptChange() {
  const deptRaw = document.getElementById('plantaoDept')?.value;
  const unitSel = document.getElementById('plantaoUnidade');
  if (!unitSel) return;
  if (!deptRaw) {
    unitSel.innerHTML = '<option value="">Selecione o departamento primeiro</option>';
    unitSel.disabled = true;
    return;
  }
  const units = (typeof PCSP_UNITS !== 'undefined' ? PCSP_UNITS : [])
    .filter(u => u.dept_raw === deptRaw)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  unitSel.innerHTML = '<option value="">Selecione a unidade...</option>' +
    units.map((u, i) => `<option value="${i}|${u.dept_raw}">${u.nome}${u.mun && u.mun !== u.nome ? ' — ' + u.mun : ''}</option>`).join('');
  unitSel.disabled = false;
  // store filtered list
  unitSel._units = units;
}

function onPlantaoUnidadeChange() {
  const unitSel = document.getElementById('plantaoUnidade');
  const val = unitSel?.value;
  if (!val || !unitSel._units) return;
  const idx = parseInt(val.split('|')[0]);
  const u = unitSel._units[idx];
  if (!u) return;
  // Auto-fill hidden delegacia field
  const delEl = document.getElementById('plantaoDelegacia');
  if (delEl) delEl.value = u.nome;
}

async function confirmarAberturaPlan() {
  const data    = document.getElementById('plantaoData')?.value;
  const turno   = document.querySelector('.turno-opt.selected')?.dataset.value;
  const delegado = document.getElementById('plantaoDelegado')?.value?.trim();

  // Get delegacia from unit selector or fallback text field
  const unitSel = document.getElementById('plantaoUnidade');
  const unitVal = unitSel?.value;
  let delegacia = '';
  let plantaoUnidadeObj = null;
  if (unitVal && unitSel._units) {
    const idx = parseInt(unitVal.split('|')[0]);
    plantaoUnidadeObj = unitSel._units[idx] || null;
    if (plantaoUnidadeObj) delegacia = plantaoUnidadeObj.nome;
  }
  if (!delegacia) delegacia = document.getElementById('plantaoDelegacia')?.value?.trim() || '';

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
    // Always save locally for offline recovery
    localStorage.setItem(`pc_plantao_data_${plantaoAtivo.id}`, JSON.stringify(plantaoAtivo));
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

function pularPlantao() {
  document.getElementById('plantaoInicioBackdrop')?.classList.add('hidden');
  document.getElementById('plantaoInicioModal')?.classList.add('hidden');
  // Render without an active plantao
  renderNavList();
  renderOccurrenceGrid();
  renderRecentOccurrence();
  renderAndamentoSection();
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
  renderAndamentoSection();
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
      const isDone = row.status === 'concluido';
      const statusLabel = isDone
        ? '<span class="hist-status done">Conclu\u00eddo</span>'
        : '<span class="hist-status wip">Em andamento</span>';
      const bo  = row.num_bo ? `<span class="hist-bo">BO ${row.num_bo}</span>` : '';
      const kw  = row.palavras_chave ? `<span class="hist-kw">${row.palavras_chave}</span>` : '';
      const cs  = JSON.stringify(JSON.stringify(row.check_state));
      const tr  = JSON.stringify(JSON.stringify(row.triage));
      const nbo = JSON.stringify(row.num_bo||'');
      const nkw = JSON.stringify(row.palavras_chave||'');
      const nob = JSON.stringify(row.observacoes||'');
      const finBtn = !isDone
        ? `<button class="hist-action-btn hist-fin" onclick="finalizarOcorrenciaHist('${row.id}')">&#10003; Finalizar</button>`
        : '';
      return `
        <div class="hist-item">
          <div class="hist-main" onclick="reabrirOcorrencia('${row.id}','${row.tipo_id}',${cs},${tr},${nbo},${nkw},${nob})">
            <span class="hist-nome">${row.tipo_nome}</span>
            ${statusLabel}
          </div>
          <div class="hist-meta">${bo}${kw}<span class="hist-dt">${dt}</span></div>
          <div class="hist-action-row">
            <button class="hist-action-btn hist-open" onclick="reabrirOcorrencia('${row.id}','${row.tipo_id}',${cs},${tr},${nbo},${nkw},${nob})">&#128065; Abrir</button>
            ${finBtn}
            <button class="hist-action-btn hist-del" onclick="deletarOcorrencia('${row.id}')">&#128465; Excluir</button>
          </div>
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

// ── BNMP — removido (portal não aceita parâmetros externos) ──
function openBNMP() { window.open('https://portalbnmp.cnj.jus.br', '_blank', 'noopener'); }
function closeBNMP() {}
function buscarBNMP() {}

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
    PCDoc.close();
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
  container.innerHTML = '<div class="hist-loading">Carregando...</div>';

  let ocorrencias = [];
  try {
    ocorrencias = await DB_Ocorrencias.listarPorPlantao(plantaoAtivo.id) || [];
  } catch(e) {
    const all = [...OCCURRENCES, ...(window._customOccurrences || [])];
    all.forEach(occ => {
      const saved  = JSON.parse(localStorage.getItem(`pc_check_${occ.id}`) || 'null');
      const status = localStorage.getItem(`pc_status_${occ.id}`) || 'andamento';
      if (saved && Object.values(saved).some(Boolean)) {
        ocorrencias.push({
          tipo_id: occ.id, tipo_nome: occ.name,
          status, num_bo: '', palavras_chave: '', observacoes: '',
          created_at: new Date().toISOString(),
        });
      }
    });
  }

  const dataFmt    = new Date(plantaoAtivo.data + 'T12:00:00').toLocaleDateString('pt-BR');
  const turnoLabel = { diurno: 'Diurno', noturno: 'Noturno', extraordinario: 'Extraordinário' };
  const total      = ocorrencias.length;
  const nFin       = ocorrencias.filter(o => o.status === 'concluido').length;
  const nAnd       = total - nFin;

  // Render one row per occurrence — all together, ordered
  const linhas = ocorrencias.map((oc, i) => {
    const isDone  = oc.status === 'concluido';
    const boCell  = oc.num_bo ? oc.num_bo : '—';
    const kwCell  = oc.palavras_chave || '';
    const badge   = isDone
      ? '<span class="rel-badge-done">&#10003;</span>'
      : '<span class="rel-badge-wip">&#9201;</span>';
    return `<tr>
      <td class="rel-td-num">${i + 1}</td>
      <td class="rel-td-tipo">${oc.tipo_nome}</td>
      <td class="rel-td-bo">${boCell}</td>
      <td class="rel-td-kw">${kwCell}</td>
      <td class="rel-td-status">${badge}</td>
    </tr>`;
  }).join('');

  const tabela = total ? `
    <table class="rel-tabela">
      <thead>
        <tr>
          <th style="width:28px">#</th>
          <th>Ocorrência</th>
          <th style="width:120px">Nº do BO</th>
          <th>Palavras-chave</th>
          <th style="width:32px"></th>
        </tr>
      </thead>
      <tbody>${linhas}</tbody>
    </table>` : '<p class="rel-empty-sub">Nenhuma ocorrência registrada neste plantão.</p>';

  container.innerHTML = `
    <div class="relatorio-actions no-print">
      <button class="btn-primary" onclick="window.print()" style="width:auto;margin-top:0">&#128424; Imprimir / PDF</button>
      <button class="btn-secondary" onclick="backToHome()">&#8592; Voltar</button>
    </div>

    <div class="relatorio-doc" id="relatorioDoc">

      <div class="rel-header-simple">
        <div class="rel-header-left">
          <div class="rel-doc-title">RELAT&#211;RIO DO PLANT&#195;O</div>
          <div class="rel-doc-sub">Plant&#227;oCheck &mdash; Ferramenta de apoio operacional</div>
        </div>
        <div class="rel-header-right">
          <div class="rel-header-line"><strong>Delegacia:</strong> ${plantaoAtivo.delegacia}</div>
          <div class="rel-header-line"><strong>Delegado(a):</strong> ${plantaoAtivo.delegado}</div>
          <div class="rel-header-line"><strong>Data:</strong> ${dataFmt} &nbsp;|&nbsp; <strong>Turno:</strong> ${turnoLabel[plantaoAtivo.turno] || plantaoAtivo.turno}</div>
          <div class="rel-header-line rel-header-muted">Gerado em ${new Date().toLocaleString('pt-BR')} &nbsp;|&nbsp; ${nFin} finalizada${nFin !== 1 ? 's' : ''}, ${nAnd} em andamento</div>
        </div>
      </div>

      <div class="rel-tabela-wrap">
        ${tabela}
      </div>

      <div class="rel-footer-simple">
        Legenda: &#10003; Finalizado &nbsp;&nbsp; &#9201; Em andamento
        &nbsp;&nbsp;&mdash;&nbsp;&nbsp;
        Plant&#227;oCheck &mdash; sem v&#237;nculo institucional &mdash; Desenvolvido por Gabriel Vital
      </div>
    </div>`;
}

function renderRelatorioOcorrencia(oc, num) { return ''; } // legacy — unused

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


// ── MODELOS DE E-MAIL ─────────────────────────────────────────
let currentEmailTemplate = null;

function openEmailMenu() {
  const body = document.getElementById('emailMenuBody');
  if (body) {
    body.innerHTML = EMAIL_TEMPLATES.map(t => `
      <div class="artigos-menu-item" onclick="closeEmailMenu(); openEmailEditor('${t.id}')">
        <span class="artigos-menu-icon">${t.icon}</span>
        <div class="artigos-menu-info">
          <span class="artigos-menu-nome">${t.title}</span>
          <span class="artigos-menu-sub">${t.anexos.length ? t.anexos.length + ' anexo(s) obrigatório(s)' : 'Sem anexos'}</span>
        </div>
        <span style="color:var(--text-muted)">&#8594;</span>
      </div>`).join('');
  }
  document.getElementById('emailMenuBackdrop')?.classList.remove('hidden');
  document.getElementById('emailMenuModal')?.classList.remove('hidden');
  if (window.innerWidth <= 768) toggleSidebar();
}

function closeEmailMenu() {
  document.getElementById('emailMenuBackdrop')?.classList.add('hidden');
  document.getElementById('emailMenuModal')?.classList.add('hidden');
}

function openEmailEditor(id) {
  const tmpl = EMAIL_TEMPLATES.find(t => t.id === id);
  if (!tmpl) return;
  currentEmailTemplate = id;

  document.getElementById('emailEditorTitle').textContent = tmpl.title;
  document.getElementById('emailEditorSubtitle').textContent = tmpl.icon + ' Preencha os campos para gerar o e-mail pronto';

  const body = document.getElementById('emailEditorBody');
  const fieldsHtml = tmpl.fields.map(f => {
    const inputHtml = f.type === 'date'
      ? `<input type="date" id="email_${f.id}" />`
      : `<input type="text" id="email_${f.id}" placeholder="${f.placeholder || ''}" autocomplete="off" />`;
    return `<div class="modal-form-group"><label>${f.label}</label>${inputHtml}</div>`;
  }).join('');

  body.innerHTML = `
    <div class="email-fields">
      ${fieldsHtml}
    </div>
    <div id="emailOutput" class="hidden">
      <div class="email-output-label">E-mail gerado — pronto para copiar e colar:</div>
      <div class="generated-text-box" id="emailText"></div>
      ${tmpl.anexos.length ? `
        <div class="email-anexos">
          <div class="email-anexos-title">&#128206; Documentos a anexar:</div>
          ${tmpl.anexos.map(a => `<div class="email-anexo-item">&#9744; ${a}</div>`).join('')}
        </div>` : ''}
      ${tmpl.aviso ? `<div class="email-aviso">&#9888; ${tmpl.aviso}</div>` : ''}
      <div class="copy-bar">
        <button class="btn-copy" id="btnCopyEmail" onclick="copyEmail()">&#128203; Copiar e-mail</button>
      </div>
    </div>`;

  // Pre-fill date fields with today and focus first input
  const today = new Date().toISOString().split('T')[0];
  setTimeout(() => {
    body.querySelectorAll('input[type="date"]').forEach(el => { if (!el.value) el.value = today; });
    body.querySelector('input')?.focus();
  }, 100);

  document.getElementById('emailEditorBackdrop')?.classList.remove('hidden');
  document.getElementById('emailEditorModal')?.classList.remove('hidden');
}

function closeEmailEditor() {
  document.getElementById('emailEditorBackdrop')?.classList.add('hidden');
  document.getElementById('emailEditorModal')?.classList.add('hidden');
  currentEmailTemplate = null;
}

function gerarEmail() {
  if (!currentEmailTemplate) return;
  const tmpl = EMAIL_TEMPLATES.find(t => t.id === currentEmailTemplate);
  if (!tmpl) return;

  const values = {};
  tmpl.fields.forEach(f => {
    values[f.id] = (document.getElementById(`email_${f.id}`)?.value || '').trim() || `[${f.label.toUpperCase()}]`;
  });

  const text = tmpl.generate(values);
  document.getElementById('emailOutput').classList.remove('hidden');
  document.getElementById('emailText').textContent = text;

  const btn = document.getElementById('btnCopyEmail');
  if (btn) { btn.textContent = '📋 Copiar e-mail'; btn.className = 'btn-copy'; }

  document.getElementById('emailText').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyEmail() {
  const text = document.getElementById('emailText')?.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btnCopyEmail');
    if (btn) {
      btn.textContent = '✓ Copiado!';
      btn.className = 'btn-copy copied';
      setTimeout(() => { btn.textContent = '📋 Copiar e-mail'; btn.className = 'btn-copy'; }, 2500);
    }
  });
}

// Enter key no editor de e-mail
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const editorModal = document.getElementById('emailEditorModal');
    if (editorModal && !editorModal.classList.contains('hidden') &&
        document.activeElement?.tagName === 'INPUT') {
      gerarEmail();
    }
  }
});

// ── FINALIZAR CHECKLIST ───────────────────────────────────────
async function finalizarChecklist() {
  if (!currentOccurrence) return;
  if (!confirm(`Finalizar "${currentOccurrence.name}"?\nIsso marca a ocorrência como concluída no histórico.`)) return;

  // Mark all remaining items as done? No — just set status to concluido regardless of progress
  const bo  = document.getElementById('metaBO')?.value || '';
  const kw  = document.getElementById('metaKW')?.value || '';
  const obs = document.getElementById('obsText')?.value || '';

  // Force status to concluido in Supabase
  const plantaoId = localStorage.getItem('pc_plantao_id');
  if (plantaoId && session?.email) {
    try {
      const existing = await DB_Ocorrencias.listarPorPlantao(plantaoId);
      const row = existing?.find(o => o.tipo_id === currentOccurrence.id);
      if (row) {
        await DB_Ocorrencias.atualizar(row.id, { status: 'concluido', updated_at: new Date().toISOString() });
      } else {
        await syncCheckState(currentOccurrence.id, checkState, obs, bo, kw, triageAnswers);
        const rows2 = await DB_Ocorrencias.listarPorPlantao(plantaoId);
        const row2  = rows2?.find(o => o.tipo_id === currentOccurrence.id);
        if (row2) await DB_Ocorrencias.atualizar(row2.id, { status: 'concluido' });
      }
    } catch(e) { /* offline */ }
  }

  // Update local state
  const key = `pc_status_${currentOccurrence.id}`;
  localStorage.setItem(key, 'concluido');

  // Show toast and go back
  showToast(`✓ ${currentOccurrence.name} finalizado`);
  stopOccurrenceTimer();
  backToHome();
}

// ── TOAST NOTIFICATION ────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('toast-show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('toast-show'), 2800);
}

// ── SEÇÃO "EM ANDAMENTO" NA HOME ──────────────────────────────
async function renderAndamentoSection() {
  const el = document.getElementById('andamentoSection');
  if (!el) return;

  // Collect in-progress from localStorage first (fast)
  const local = [];
  const allOcc = [...OCCURRENCES, ...(window._customOccurrences || [])];
  allOcc.forEach(occ => {
    const saved   = JSON.parse(localStorage.getItem(`pc_check_${occ.id}`) || 'null');
    const status  = localStorage.getItem(`pc_status_${occ.id}`);
    if (saved && Object.values(saved).some(Boolean) && status !== 'concluido') {
      const total   = occ.sections.reduce((a, s) => a + s.items.length, 0);
      const checked = Object.values(saved).filter(Boolean).length;
      local.push({ occ, checked, total, pct: Math.round((checked / total) * 100) });
    }
  });

  if (!local.length) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="andamento-section">
      <div class="andamento-title">&#9200; Em andamento</div>
      ${local.map(({ occ, pct, checked, total }) => `
        <div class="andamento-item">
          <div class="andamento-main" onclick="startTriage('${occ.id}')">
            <span class="andamento-icon">${occ.icon}</span>
            <div class="andamento-info">
              <span class="andamento-nome">${occ.name}</span>
              <span class="andamento-prog">${checked}/${total} itens — ${pct}%</span>
            </div>
            <div class="andamento-bar-wrap">
              <div class="andamento-bar-fill" style="width:${pct}%"></div>
            </div>
          </div>
          <div class="andamento-btns">
            <button class="andamento-btn-fin" onclick="finalizarChecklistById('${occ.id}')" title="Finalizar">&#10003;</button>
            <button class="andamento-btn-del" onclick="excluirChecklistLocal('${occ.id}')" title="Excluir">&#128465;</button>
          </div>
        </div>`).join('')}
    </div>`;
}

async function finalizarChecklistById(occId) {
  const occ = [...OCCURRENCES, ...(window._customOccurrences || [])].find(o => o.id === occId);
  if (!occ || !confirm(`Finalizar "${occ.name}"?`)) return;
  localStorage.setItem(`pc_status_${occId}`, 'concluido');
  // Also update in Supabase if possible
  const plantaoId = localStorage.getItem('pc_plantao_id');
  if (plantaoId) {
    try {
      const rows = await DB_Ocorrencias.listarPorPlantao(plantaoId);
      const row  = rows?.find(r => r.tipo_id === occId);
      if (row) await DB_Ocorrencias.atualizar(row.id, { status: 'concluido' });
    } catch(e) { /* offline */ }
  }
  showToast(`✓ ${occ.name} finalizado`);
  renderAndamentoSection();
  renderOccurrenceGrid();
}

function excluirChecklistLocal(occId) {
  const occ = [...OCCURRENCES, ...(window._customOccurrences || [])].find(o => o.id === occId);
  if (!occ || !confirm(`Excluir progresso de "${occ.name}"?\nIsso remove os dados locais desta ocorrência.`)) return;
  localStorage.removeItem(`pc_check_${occId}`);
  localStorage.removeItem(`pc_status_${occId}`);
  localStorage.removeItem(`pc_ts_${occId}`);
  renderAndamentoSection();
  renderOccurrenceGrid();
  renderRecentOccurrence();
}

// ── UPDATE backToHome to refresh andamento section ────────────
const _origBackToHome = backToHome;
backToHome = function() {
  _origBackToHome();
  renderAndamentoSection();
};

// ── FINALIZAR OCORRÊNCIA DO HISTÓRICO ────────────────────────
async function finalizarOcorrenciaHist(rowId) {
  if (!confirm('Marcar esta ocorrência como concluída?')) return;
  try {
    await DB_Ocorrencias.atualizar(rowId, { status: 'concluido', updated_at: new Date().toISOString() });
    showToast('✓ Ocorrência finalizada');
    openHistorico();
  } catch(e) {
    alert('Erro ao finalizar. Verifique sua conexão.');
  }
}

// ── HOME: mostrar cards de documentos conforme disponibilidade ─
function renderDocCards() {
  // Reveal "Autorização Entrada" card when doc is registered
  const entradaCard = document.getElementById('homeToolEntrada');
  if (entradaCard && typeof PCSP_DOCS !== 'undefined' && PCSP_DOCS.autorizacaoEntrada) {
    entradaCard.style.display = '';
  }
}
