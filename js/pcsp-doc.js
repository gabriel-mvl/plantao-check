/* ============================================================
   PLANTÃO CHECK — Motor de Documentos PCSP
   pcsp-doc.js

   Este módulo é a base reutilizável para todos os documentos
   gerados na plataforma. Para criar um novo documento:

   1. Defina um objeto PCSP_DOCS.meuDocumento (veja exemplo abaixo)
   2. Chame PCDoc.open('meuDocumento') para abrir o modal
   3. O motor cuida do cabeçalho, rodapé, seleção de unidade,
      formatação de data, impressão e cópia

   Exemplo de definição de documento:
   ─────────────────────────────────────────────────────────────
   PCSP_DOCS.minhaAutorizacao = {
     id: 'minhaAutorizacao',
     titulo: 'Minha Autorização',
     icone: '📄',
     campos: [
       { id: 'nome', label: 'Nome completo', placeholder: 'Ex: FULANO DE TAL' },
       { id: 'rg',   label: 'RG',            placeholder: 'Ex: 12.345.678-9' },
     ],
     gerar: (campos, unidade) => `
       <p>Eu, <strong>${campos.nome}</strong>, RG <strong>${campos.rg}</strong>...</p>
     `,
   };
   ─────────────────────────────────────────────────────────────

   A função gerar() recebe:
   - campos: objeto { id: valor } com os campos preenchidos
   - unidade: objeto com dept, div, nome, end, bairro, mun, cep, tel
   ============================================================ */

// ── CATÁLOGO DE DOCUMENTOS ────────────────────────────────────
// Cada documento registrado aqui fica disponível via PCDoc.open()
const PCSP_DOCS = {};

// ── ESTADO INTERNO ────────────────────────────────────────────
const PCDoc = (() => {

  let _currentDoc  = null;
  let _unitsFull   = null;   // lazy-loaded from PCSP_UNITS
  let _deptList    = [];
  let _unitList    = [];

  // ── HELPERS ────────────────────────────────────────────────

  function _dataExtenso() {
    const meses = ['janeiro','fevereiro','março','abril','maio','junho',
                   'julho','agosto','setembro','outubro','novembro','dezembro'];
    const d = new Date();
    return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
  }

  function _fmtEndereco(u) {
    const parts = [u.end, u.bairro, `${u.mun}/SP`];
    let linha = parts.filter(Boolean).join(', ');
    if (u.cep)  linha += `, CEP ${u.cep}`;
    if (u.tel)  linha += ` — Tel. ${u.tel}`;
    return linha;
  }

  function _loadUnits() {
    if (_unitsFull) return;
    _unitsFull = (typeof PCSP_UNITS !== 'undefined') ? PCSP_UNITS : [];
    const seen = new Set();
    _deptList = [];
    _unitsFull.forEach(u => {
      if (!seen.has(u.dept_raw)) {
        seen.add(u.dept_raw);
        _deptList.push({ raw: u.dept_raw, label: u.dept });
      }
    });
    _deptList.sort((a, b) => a.raw.localeCompare(b.raw, 'pt-BR'));
  }

  // ── CABEÇALHO HTML (reutilizável em qualquer documento) ────
  function _headerHtml(u) {
    return `
      <div style="display:flex;align-items:center;gap:1.1rem;
                  padding-bottom:.85rem;border-bottom:2px solid #000;
                  margin-bottom:1.4rem;font-family:Arial,Helvetica,sans-serif">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bras%C3%A3o_Nacional_PCSP.png"
             style="width:108px;height:108px;object-fit:contain;flex-shrink:0"
             alt="Brasão PCSP" />
        <div style="font-size:13.5px;line-height:1.85;font-weight:bold;color:#000">
          <div>${_esc(u.dept)}</div>
          ${u.div ? `<div>${_esc(u.div)}</div>` : ''}
          <div>${_esc(u.nome)}</div>
        </div>
      </div>`;
  }

  // ── RODAPÉ HTML ────────────────────────────────────────────
  function _footerHtml(u) {
    return `
      <div style="margin-top:2.5rem;padding-top:.7rem;
                  border-top:1px solid #888;font-size:10px;
                  text-align:center;font-family:Arial,Helvetica,sans-serif;color:#000;
                  page-break-inside:avoid;break-inside:avoid">
        <div style="font-weight:bold">${_esc(u.nome)}</div>
        <div>${_esc(_fmtEndereco(u))}</div>
      </div>`;
  }

  // ── DOCUMENTO COMPLETO HTML (para impressão) ───────────────
  function _docHtml(u, titulo, corpoHtml) {
    return `
      <div style="font-family:'Times New Roman',Georgia,serif;color:#000;
                  font-size:12pt;line-height:1.85;max-width:680px;
                  margin:0 auto;padding:.75rem .75rem">
        ${_headerHtml(u)}
        <div style="font-family:Arial,Helvetica,sans-serif;text-align:center;
                    font-weight:bold;font-size:13pt;margin-bottom:1.4rem;
                    text-transform:uppercase;letter-spacing:.04em;color:#000">
          ${_esc(titulo)}
        </div>
        ${corpoHtml}
        ${_footerHtml(u)}
      </div>`;
  }

  function _esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ── MODAL: renderiza seleção + campos ─────────────────────
  function _renderModal(doc) {
    _loadUnits();
    const el = document.getElementById('pcdocModalBody');
    if (!el) return;

    const deptOpts = _deptList.map(d =>
      `<option value="${_esc(d.raw)}">${_esc(d.label)}</option>`
    ).join('');

    const camposHtml = (doc.campos || []).map(c => {
      if (c.type === 'date') {
        return `
          <div class="modal-form-group">
            <label>${_esc(c.label)}</label>
            <input type="date" id="pcdoc_${c.id}" />
          </div>`;
      }
      if (c.type === 'toggle') {
        const subHtml = (c.subfields || []).map(sf => {
          if (sf.type === 'select') {
            const opts = (sf.options || []).map(o =>
              `<option value="${_esc(o.value)}">${_esc(o.label)}</option>`
            ).join('');
            return `
              <div class="modal-form-group" style="margin-top:.5rem">
                <label>${_esc(sf.label)}</label>
                <select id="pcdoc_${sf.id}"><option value="">Selecione...</option>${opts}</select>
              </div>`;
          }
          return `
            <div class="modal-form-group" style="margin-top:.5rem">
              <label>${_esc(sf.label)}</label>
              <input type="text" id="pcdoc_${sf.id}" placeholder="${_esc(sf.placeholder || '')}" autocomplete="off" />
            </div>`;
        }).join('');
        return `
          <div class="modal-form-group">
            <label class="pcdoc-toggle-label">
              <input type="checkbox" id="pcdoc_${c.id}"
                     onchange="document.getElementById('pcdoc_sub_${c.id}').style.display=this.checked?'block':'none'" />
              <span>${_esc(c.label)}</span>
            </label>
            <div id="pcdoc_sub_${c.id}" style="display:none;margin-top:.4rem;
                 padding:.75rem;background:var(--bg-surface);border:1px solid var(--border);
                 border-radius:var(--radius)">
              ${subHtml}
            </div>
          </div>`;
      }
      if (c.type === 'address') {
        return `
          <div class="modal-form-group pcdoc-address-group">
            <label>${_esc(c.label)}</label>
            <div class="pcdoc-cep-row">
              <input type="text" id="pcdoc_cep_${c.id}"
                     placeholder="CEP (somente n\u00fameros)" maxlength="9"
                     oninput="PCDoc._onCepInput(this,'${c.id}')"
                     autocomplete="off" style="width:140px;flex-shrink:0" />
              <span class="pcdoc-cep-status" id="pcdoc_cep_status_${c.id}"></span>
            </div>
            <div class="pcdoc-addr-fields">
              <input type="text" id="pcdoc_logradouro_${c.id}" placeholder="Logradouro" autocomplete="off" />
              <div class="pcdoc-addr-row2">
                <input type="text" id="pcdoc_numero_${c.id}" placeholder="N\u00famero" autocomplete="off" style="width:90px;flex-shrink:0" />
                <input type="text" id="pcdoc_complemento_${c.id}" placeholder="Complemento (opcional)" autocomplete="off" />
              </div>
              <div class="pcdoc-addr-row2">
                <input type="text" id="pcdoc_bairro_${c.id}" placeholder="Bairro" autocomplete="off" />
                <input type="text" id="pcdoc_cidade_${c.id}" placeholder="Cidade/UF" autocomplete="off" style="width:130px;flex-shrink:0" />
              </div>
              <input type="hidden" id="pcdoc_${c.id}" />
            </div>
          </div>`;
      }
      if (c.type === 'toggle') {
        // Checkbox that shows/hides a group of sub-fields
        const subHtml = (c.subfields || []).map(sf => {
          if (sf.type === 'select') {
            const opts = (sf.options || []).map(o =>
              `<option value="${_esc(o.value)}">${_esc(o.label)}</option>`
            ).join('');
            return `
              <div class="modal-form-group" style="margin-top:.5rem">
                <label>${_esc(sf.label)}</label>
                <select id="pcdoc_${sf.id}"><option value="">Selecione...</option>${opts}</select>
              </div>`;
          }
          return `
            <div class="modal-form-group" style="margin-top:.5rem">
              <label>${_esc(sf.label)}</label>
              <input type="text" id="pcdoc_${sf.id}" placeholder="${_esc(sf.placeholder || '')}" autocomplete="off" />
            </div>`;
        }).join('');
        return `
          <div class="modal-form-group">
            <label class="pcdoc-toggle-label">
              <input type="checkbox" id="pcdoc_${c.id}"
                     onchange="document.getElementById('pcdoc_sub_${c.id}').style.display=this.checked?'block':'none'" />
              <span>${_esc(c.label)}</span>
            </label>
            <div id="pcdoc_sub_${c.id}" style="display:none;margin-top:.4rem;
                 padding:.75rem;background:var(--bg-surface);border:1px solid var(--border);
                 border-radius:var(--radius)">
              ${subHtml}
            </div>
          </div>`;
      }
      if (c.type === 'select') {
        const opts = (c.options || []).map(o =>
          `<option value="${_esc(o.value)}">${_esc(o.label)}</option>`
        ).join('');
        return `
          <div class="modal-form-group">
            <label>${_esc(c.label)}</label>
            <select id="pcdoc_${c.id}">
              <option value="">Selecione...</option>
              ${opts}
            </select>
          </div>`;
      }
      return `
        <div class="modal-form-group">
          <label>${_esc(c.label)}</label>
          <input type="text" id="pcdoc_${c.id}" placeholder="${_esc(c.placeholder || '')}" autocomplete="off" />
        </div>`;
    }).join('');

    el.innerHTML = `
      <div class="modal-form-group">
        <label>Departamento</label>
        <select id="pcdocDept" onchange="PCDoc._onDeptChange()">
          <option value="">Selecione o departamento...</option>
          ${deptOpts}
        </select>
      </div>
      <div class="modal-form-group">
        <label>Unidade</label>
        <select id="pcdocUnit" disabled>
          <option value="">Selecione o departamento primeiro</option>
        </select>
      </div>
      ${camposHtml}
      <div id="pcdocOutput" class="hidden">
        <div class="email-output-label" style="margin-top:.75rem">Documento gerado:</div>
        <div id="pcdocPreview"
             style="background:var(--bg-input);border:1px solid var(--border);
                    border-radius:var(--radius);padding:.9rem;font-size:.8rem;
                    max-height:280px;overflow-y:auto;line-height:1.7"></div>
        <div class="email-aviso" style="margin-top:.6rem">
          &#9888; Imprimir em duas vias: uma para o interessado, uma para o processo.
        </div>
        <div class="copy-bar" style="margin-top:.6rem">
          <button class="btn-copy" id="pcdocBtnCopy" onclick="PCDoc._copy()">&#128203; Copiar texto</button>
          <button class="btn-print-doc" onclick="PCDoc._print()">&#128424; Imprimir</button>
        </div>
      </div>`;

    // Pre-fill date fields
    const today = new Date().toISOString().split('T')[0];
    el.querySelectorAll('input[type="date"]').forEach(i => { if (!i.value) i.value = today; });
  }

  // ── SELECT: ao mudar departamento ─────────────────────────
  function _onDeptChange() {
    const deptRaw = document.getElementById('pcdocDept')?.value;
    const unitSel = document.getElementById('pcdocUnit');
    if (!unitSel) return;
    document.getElementById('pcdocOutput')?.classList.add('hidden');

    if (!deptRaw) {
      unitSel.innerHTML = '<option value="">Selecione o departamento primeiro</option>';
      unitSel.disabled = true;
      return;
    }

    _unitList = _unitsFull.filter(u => u.dept_raw === deptRaw);
    PCDoc._unitListRef = _unitList;
    PCDoc._deptListRef = _deptList;
    _unitList.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    unitSel.innerHTML = '<option value="">Selecione a unidade...</option>' +
      _unitList.map((u, i) =>
        `<option value="${i}">${_esc(u.nome)}${u.mun && u.mun !== u.nome ? ` — ${u.mun}` : ''}</option>`
      ).join('');
    unitSel.disabled = false;
  }

  // ── GERAR documento ───────────────────────────────────────
  function _gerar() {
    const doc = _currentDoc;
    if (!doc) return;

    const unitIdx = document.getElementById('pcdocUnit')?.value;
    if (unitIdx === '' || unitIdx === undefined || unitIdx === null) {
      if (typeof showToast === 'function') showToast('Selecione uma unidade');
      return;
    }

    const u = _unitList[parseInt(unitIdx)];
    if (!u) return;

    // ── Collect field values ──────────────────────────────
    const campos = {};
    (doc.campos || []).forEach(campo => {
      if (campo.type === 'toggle') {
        const checked = document.getElementById('pcdoc_' + campo.id)?.checked || false;
        campos[campo.id] = checked;
        (campo.subfields || []).forEach(sf => {
          campos[sf.id] = checked
            ? (document.getElementById('pcdoc_' + sf.id)?.value?.trim() || '')
            : '';
        });
        return;
      }
      if (campo.type === 'address') {
        const log  = document.getElementById('pcdoc_logradouro_' + campo.id)?.value?.trim() || '';
        const num  = document.getElementById('pcdoc_numero_'    + campo.id)?.value?.trim() || '';
        const comp = document.getElementById('pcdoc_complemento_'+ campo.id)?.value?.trim() || '';
        const bai  = document.getElementById('pcdoc_bairro_'    + campo.id)?.value?.trim() || '';
        const cid  = document.getElementById('pcdoc_cidade_'    + campo.id)?.value?.trim() || '';
        const cep  = document.getElementById('pcdoc_cep_'       + campo.id)?.value?.trim() || '';
        const street = [log, num, comp].filter(Boolean).join(', ');
        const city   = [bai, cid].filter(Boolean).join(', ');
        const cepStr = cep ? ', CEP ' + cep.replace(/\D/g,'').replace(/(\d{5})(\d{3})/,'$1-$2') : '';
        campos[campo.id] = [street, city].filter(Boolean).join(', ') + cepStr;
        return;
      }
      campos[campo.id] = document.getElementById('pcdoc_' + campo.id)?.value?.trim() || '';
    });

    // ── Validate required fields ──────────────────────────
    const missingLabels = [];
    (doc.campos || []).forEach(campo => {
      if (campo.required === false) return;
      if (campo.type === 'toggle') return; // optional by nature
      if (campo.type === 'address') {
        const log = document.getElementById('pcdoc_logradouro_' + campo.id)?.value?.trim() || '';
        const num = document.getElementById('pcdoc_numero_'     + campo.id)?.value?.trim() || '';
        if (!log || !num) missingLabels.push(campo.label);
        return;
      }
      if (!campos[campo.id]) missingLabels.push(campo.label);
    });
    if (missingLabels.length) {
      if (typeof showToast === 'function') showToast('Preencha: ' + missingLabels.join(', '));
      return;
    }

    // Generate body HTML
    const corpoHtml = doc.gerar(campos, u, { dataExtenso: _dataExtenso(), unidade: u });

    // Full doc HTML for print
    const fullHtml = _docHtml(u, doc.titulo, corpoHtml);

    // Store for print/copy
    PCDoc._lastHtml   = fullHtml;
    PCDoc._lastUnit   = u;
    PCDoc._lastCampos = campos;
    PCDoc._lastDoc    = doc;

    // Show preview — force white background regardless of theme
    const preview = document.getElementById('pcdocPreview');
    if (preview) {
      preview.innerHTML = fullHtml;
      preview.style.background = '#fff';
      preview.style.borderRadius = '6px';
      preview.style.padding = '.75rem';
    }

    const output = document.getElementById('pcdocOutput');
    if (output) {
      output.classList.remove('hidden');
      output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const btn = document.getElementById('pcdocBtnCopy');
    if (btn) { btn.textContent = '📋 Copiar texto'; btn.className = 'btn-copy'; }
  }

  // ── IMPRIMIR ──────────────────────────────────────────────
  function _print() {
    if (!PCDoc._lastHtml) return;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head>
      <meta charset="UTF-8"/>
      <title>${PCDoc._lastDoc?.titulo || 'Documento'}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Times New Roman',Georgia,serif;font-size:12pt;
             color:#000;background:#fff;padding:0;margin:0}
        strong{font-weight:bold}
        @page{margin:1.2cm 1.5cm;size:A4}
        @media print{body{margin:0}}
      </style>
    </head><body>${PCDoc._lastHtml}</body>
    <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}<\/script>
    </html>`);
    win.document.close();
  }

  // ── COPIAR texto plano ────────────────────────────────────
  function _copy() {
    if (!PCDoc._lastHtml) return;
    // Strip HTML tags for plain text copy
    const tmp = document.createElement('div');
    tmp.innerHTML = PCDoc._lastHtml;
    const text = tmp.innerText || tmp.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('pcdocBtnCopy');
      if (btn) {
        btn.textContent = '✓ Copiado!';
        btn.className = 'btn-copy copied';
        setTimeout(() => { btn.textContent = '📋 Copiar texto'; btn.className = 'btn-copy'; }, 2500);
      }
    });
  }

  // ── CEP LOOKUP (ViaCEP) ──────────────────────────────────
  function _onCepInput(input, fieldId) {
    // Format as 00000-000 while typing
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5);
    input.value = v;

    const digits = v.replace(/\D/g,'');
    if (digits.length < 8) return;

    const status = document.getElementById(`pcdoc_cep_status_${fieldId}`);
    if (status) { status.textContent = '⏳'; status.className = 'pcdoc-cep-status loading'; }

    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then(r => r.json())
      .then(data => {
        if (data.erro) {
          if (status) { status.textContent = 'CEP não encontrado'; status.className = 'pcdoc-cep-status error'; }
          return;
        }
        // Fill sub-fields — user can still edit
        const set = (id, val) => {
          const el = document.getElementById(`pcdoc_${id}_${fieldId}`);
          if (el && val) el.value = val;
        };
        set('logradouro', data.logradouro);
        set('bairro',     data.bairro);
        set('cidade',     data.localidade ? `${data.localidade}/SP` : '');

        if (status) { status.textContent = '✓'; status.className = 'pcdoc-cep-status ok'; }

        // Auto-focus número after fill
        document.getElementById(`pcdoc_numero_${fieldId}`)?.focus();
      })
      .catch(() => {
        if (status) { status.textContent = 'Erro ao buscar CEP'; status.className = 'pcdoc-cep-status error'; }
      });
  }


  // ── MODAL CUSTOMIZADO (alteração de plantão) ─────────────
  function _renderModalCustom(doc) {
    _loadUnits();
    const el = document.getElementById('pcdocModalBody');
    if (!el) return;
    PCDoc._trocas = [];

    const deptOpts = _deptList.map(d =>
      `<option value="${_esc(d.raw)}">${_esc(d.label)}</option>`
    ).join('');

    el.innerHTML = `
      <div class="modal-form-group">
        <label>Departamento</label>
        <select id="pcdocDept" onchange="PCDoc._onDeptChange()">
          <option value="">Selecione o departamento...</option>
          ${deptOpts}
        </select>
      </div>
      <div class="modal-form-group">
        <label>Unidade policial</label>
        <select id="pcdocUnit" disabled>
          <option value="">Selecione o departamento primeiro</option>
        </select>
      </div>
      <div class="modal-form-group">
        <label>Delegado(a) titular</label>
        <input type="text" id="alteracaoDelegado" placeholder="Nome completo do delegado titular" autocomplete="off" />
      </div>

      <div style="border-top:1px solid var(--border);margin:1rem 0 .75rem;padding-top:.75rem">
        <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);font-family:var(--font-display);margin-bottom:.75rem">Adicionar troca</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.5rem">
          <div class="modal-form-group" style="margin:0">
            <label>Data</label>
            <input type="date" id="alteracaoData" />
          </div>
          <div class="modal-form-group" style="margin:0">
            <label>Turno</label>
            <select id="alteracaoTurno">
              <option value="diurno">Diurno</option>
              <option value="noturno">Noturno</option>
            </select>
          </div>
        </div>

        <div class="modal-form-group" style="margin-bottom:.75rem">
          <label class="pcdoc-toggle-label" style="font-size:.78rem;font-weight:600;color:var(--text-secondary)">
            <input type="checkbox" id="alteracaoFeriado" />
            <span>Feriado</span>
          </label>
        </div>

        <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.3rem;font-family:var(--font-display);font-weight:600;text-transform:uppercase;letter-spacing:.06em">Quem entra</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.65rem">
          <div class="modal-form-group" style="margin:0">
            <label>Carreira</label>
            <select id="alteracaoCarreiraEntra">
              <option value="">Selecione...</option>
              <option value="Agente Policial">Agente Policial</option>
              <option value="Delegado de Polícia">Delegado de Polícia</option>
              <option value="Escrivão de Polícia">Escrivão de Polícia</option>
              <option value="Investigador de Polícia">Investigador de Polícia</option>
            </select>
          </div>
          <div class="modal-form-group" style="margin:0">
            <label>Nome</label>
            <input type="text" id="alteracaoNomeEntra" placeholder="Nome completo" autocomplete="off" />
          </div>
        </div>

        <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.3rem;font-family:var(--font-display);font-weight:600;text-transform:uppercase;letter-spacing:.06em">Quem sai</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.75rem">
          <div class="modal-form-group" style="margin:0">
            <label>Carreira</label>
            <select id="alteracaoCarreiraSai">
              <option value="">Selecione...</option>
              <option value="Agente Policial">Agente Policial</option>
              <option value="Delegado de Polícia">Delegado de Polícia</option>
              <option value="Escrivão de Polícia">Escrivão de Polícia</option>
              <option value="Investigador de Polícia">Investigador de Polícia</option>
            </select>
          </div>
          <div class="modal-form-group" style="margin:0">
            <label>Nome</label>
            <input type="text" id="alteracaoNomeSai" placeholder="Nome completo" autocomplete="off" />
          </div>
        </div>

        <button class="btn-secondary" onclick="PCDoc._addTroca()" style="width:100%">+ Adicionar troca</button>
      </div>

      <div id="alteracaoTrocasList" style="margin-top:.5rem"></div>

      <div id="pcdocOutput" class="hidden">
        <div class="email-output-label" style="margin-top:.75rem">Documento gerado:</div>
        <div id="pcdocPreview"
             style="background:var(--bg-input);border:1px solid var(--border);
                    border-radius:var(--radius);padding:.9rem;font-size:.8rem;
                    max-height:280px;overflow-y:auto;line-height:1.7"></div>
        <div style="display:flex;gap:.5rem;margin-top:.6rem">
          <button class="btn-primary" onclick="PCDoc._print()" style="flex:1;margin:0">🖨 Imprimir / PDF</button>
        </div>
      </div>`;

    PCDoc._renderTrocas();
  }

  // ── API PÚBLICA ───────────────────────────────────────────
  return {
    // Abre o modal para um documento registrado
    open(docId) {
      const doc = PCSP_DOCS[docId];
      if (!doc) { console.error(`[PCDoc] Documento '${docId}' não registrado`); return; }
      _currentDoc = doc;
      document.getElementById('pcdocModalTitle')?.replaceChildren();
      const title = document.getElementById('pcdocModalTitle');
      if (title) title.textContent = doc.titulo;
      const sub = document.getElementById('pcdocModalSub');
      if (sub) sub.textContent = doc.subtitulo || '';
      if (doc.customModal) { _renderModalCustom(doc); } else { _renderModal(doc); }
      document.getElementById('pcdocBackdrop')?.classList.remove('hidden');
      document.getElementById('pcdocModal')?.classList.remove('hidden');
      if (typeof toggleSidebar === 'function' && window.innerWidth <= 768) toggleSidebar();
    },

    close() {
      document.getElementById('pcdocBackdrop')?.classList.add('hidden');
      document.getElementById('pcdocModal')?.classList.add('hidden');
      _currentDoc = null;
    },

    gerar: function() {
      if (_currentDoc && _currentDoc.customModal) {
        PCDoc._gerarAlteracao();
      } else {
        _gerar();
      }
    },

    // Helpers expostos para uso nos templates de documentos
    helpers: { dataExtenso: _dataExtenso, fmtEndereco: _fmtEndereco },

    // Internos (expostos para uso via onclick inline)
    _onDeptChange,
    _onCepInput: _onCepInput,
    _copy,
    _print,
    _docHtml,
    _lastHtml: null,
    _lastUnit: null,
    _lastCampos: null,
    _lastDoc: null,
  };

})();

// ── REGISTRO DE DOCUMENTOS ────────────────────────────────────

// ── 1. AUTORIZAÇÃO PARA COLETA DE SANGUE ──────────────────────
PCSP_DOCS.autorizacaoSangue = {
  id: 'autorizacaoSangue',
  icone: '🩸',
  titulo: 'Autorização para Coleta de Sangue',
  subtitulo: 'Resolução CONTRAN nº 432/2013',
  campos: [
    { id: 'nome',   label: 'Nome completo do examinado', placeholder: 'Ex: FULANO DE TAL' },
    { id: 'rg',     label: 'RG',                         placeholder: 'Ex: 12.345.678-9' },
  ],
  gerar(campos, u, ctx) {
    const meses = ['janeiro','fevereiro','março','abril','maio','junho',
                   'julho','agosto','setembro','outubro','novembro','dezembro'];
    const hoje  = new Date();
    const data  = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

    return `
      <p style="text-align:justify;margin-bottom:1.2rem">
        Eu, <strong>${campos.nome}</strong>, RG <strong>${campos.rg}</strong>, AUTORIZO, nos termos da
        Resolução Contran nº 432/2013, a coleta de amostra de sangue para fins de dosagem
        alcoólica e/ou identificação de substâncias psicoativas.
      </p>
      <p style="text-align:justify;margin-bottom:2rem">
        Declaro que fui informado(a) de que a recusa em submeter-se ao exame acarreta a
        penalidade prevista no art. 306, § 2º do CTB; que os resultados poderão ser utilizados
        como prova em processo administrativo e judicial; que a coleta será realizada por
        profissional habilitado em unidade de saúde; e que o exame será enviado ao Instituto
        Médico Legal (IML) para análise.
      </p>
      <p style="text-align:center;margin-bottom:3rem">
        ${u.mun}, ${data}
      </p>
      <div style="text-align:center;margin-top:3rem">
        <div style="border-top:1px solid #000;width:55%;margin:0 auto .4rem"></div>
        <div>Assinatura do examinado(a)</div>
        <div><strong>${campos.nome} — RG ${campos.rg}</strong></div>
      </div>`;
  },
};

// ── 2. AUTORIZAÇÃO PARA EXTRAÇÃO DE DADOS DE CELULAR ──────────
PCSP_DOCS.autorizacaoCelular = {
  id: 'autorizacaoCelular',
  icone: '📱',
  titulo: 'Autorização para Extração de Dados de Telefone Celular',
  subtitulo: 'Manifestação livre e voluntária — art. 5º X e XII CF/88',
  campos: [
    { id: 'nome',      label: 'Nome completo do declarante',    placeholder: 'Ex: FULANO DE TAL' },
    { id: 'rg',        label: 'RG',                             placeholder: 'Ex: 12.345.678-9' },
    { id: 'endereco',  label: 'Endereço completo',             type: 'address' },
    { id: 'qualidade', label: 'Qualidade do declarante', type: 'select', options: [
      { value: 'indiciado(a)',  label: 'Indiciado(a)'  },
      { value: 'investigado(a)', label: 'Investigado(a)' },
      { value: 'parte',         label: 'Parte'          },
    ]},
    { id: 'numBO',     label: 'Número do BO',                   placeholder: 'Ex: AV0100-1/2026' },
    { id: 'marca',     label: 'Marca e modelo do aparelho',     placeholder: 'Ex: Samsung Galaxy A54' },
    { id: 'imei',      label: 'IMEI',                           placeholder: 'Ex: 000000000000000' },
  ],
  gerar(campos, u, ctx) {
    const meses = ['janeiro','fevereiro','março','abril','maio','junho',
                   'julho','agosto','setembro','outubro','novembro','dezembro'];
    const hoje  = new Date();
    const data  = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

    return `
      <p style="text-align:justify;margin-bottom:1rem">
        Eu, <strong>${campos.nome}</strong>, RG <strong>${campos.rg}</strong>,
        residente e domiciliado(a) à <strong>${campos.endereco}</strong>, na condição de
        na condição de <strong>${campos.qualidade}</strong> nos autos do BO nº <strong>${campos.numBO}</strong>,
        DECLARO, de forma livre, expressa, voluntária e consciente, que:
      </p>

      <p style="text-align:justify;margin-bottom:1rem">
        Estou ciente de meus direitos e garantias constitucionais, especialmente os previstos
        no art. 5º, incisos X e XII, da Constituição Federal de 1988, inclusive quanto à
        inviolabilidade da intimidade, da vida privada e do sigilo de dados.
      </p>

      <p style="text-align:justify;margin-bottom:.6rem">
        <strong>AUTORIZO</strong>, de maneira plena e irrestrita, a extração, espelhamento,
        cópia, análise e preservação de todos os dados constantes no aparelho telefônico de
        minha propriedade/posse, <strong>${campos.marca}</strong>, IMEI nº
        <strong>${campos.imei}</strong>, incluindo:
      </p>

      <div style="margin:0 0 1rem 1.5rem">
        <p style="margin-bottom:.3rem">a) dados armazenados localmente no dispositivo;</p>
        <p style="margin-bottom:.3rem">b) registros de chamadas efetuadas, recebidas e não atendidas;</p>
        <p style="margin-bottom:.3rem">c) mensagens SMS e MMS;</p>
        <p style="margin-bottom:.3rem">d) conteúdos de aplicativos de mensagens e redes sociais (WhatsApp, Telegram, Instagram, Facebook e outros eventualmente instalados);</p>
        <p style="margin-bottom:.3rem">e) arquivos de mídia (fotos, vídeos, áudios);</p>
        <p style="margin-bottom:.3rem">f) contatos, agenda, anotações e documentos;</p>
        <p style="margin-bottom:.3rem">g) histórico de navegação na internet;</p>
        <p style="margin-bottom:.3rem">h) metadados associados a todos os conteúdos existentes no dispositivo.</p>
      </div>

      <p style="text-align:justify;margin-bottom:1rem">
        <strong>AUTORIZO</strong> igualmente o acesso e a extração de dados vinculados às
        contas associadas ao referido aparelho, inclusive aqueles armazenados em serviços
        de armazenamento em nuvem (<em>cloud</em>), tais como Google Drive, iCloud, OneDrive
        ou similares, bem como backups automáticos vinculados ao dispositivo.
      </p>

      <p style="text-align:justify;margin-bottom:1rem">
        Estou ciente de que a presente autorização implica renúncia ao sigilo dos dados
        contidos no aparelho e nas contas a ele vinculadas, <strong>exclusivamente para
        fins de investigação criminal</strong>.
      </p>

      <p style="text-align:justify;margin-bottom:1rem">
        Declaro que a presente autorização é concedida sem qualquer coação, ameaça ou
        promessa de vantagem, sendo manifestação livre da minha vontade. Por ser a
        expressão da verdade, firmo o presente.
      </p>

      <p style="text-align:center;margin:2rem 0">
        ${u.mun}, ${data}
      </p>

      <div style="text-align:center;margin-top:3rem">
        <div style="border-top:1px solid #000;width:55%;margin:0 auto .4rem"></div>
        <div>Assinatura do(a) declarante</div>
        <div><strong>${campos.nome} — RG ${campos.rg}</strong></div>
      </div>`;
  },
};

// ── 3. AUTORIZAÇÃO DE ENTRADA EM RESIDÊNCIA ───────────────────
PCSP_DOCS.autorizacaoEntrada = {
  id: 'autorizacaoEntrada',
  icone: '🏠',
  titulo: 'Autorização de Entrada em Residência',
  subtitulo: 'Consentimento voluntário — art. 5º XI CF/88 + HC 598.051/STJ',
  campos: [
    { id: 'nome',       label: 'Nome completo do declarante',       placeholder: 'Ex: FULANO DE TAL' },
    { id: 'rg',         label: 'RG',                                placeholder: 'Ex: 12.345.678-9' },
    { id: 'qualidade',  label: 'Qualidade (morador / responsável)',  placeholder: 'Ex: morador(a) / proprietário(a)' },
    { id: 'endereco',   label: 'Endereço do imóvel',                type: 'address' },
    { id: 'numBO',      label: 'Número do BO (se houver)',           placeholder: 'Ex: AV0100-1/2026', required: false },
    { id: 'inclui_policial', label: 'Incluir qualificação do policial responsável', type: 'toggle',
      subfields: [
        { id: 'pol_nome',    label: 'Nome do policial',  placeholder: 'Ex: João da Silva' },
        { id: 'pol_carreira', label: 'Carreira', type: 'select', options: [
          { value: 'Agente de Telecomunicações Policial', label: 'Agente de Telecomunicações Policial' },
          { value: 'Agente Policial',                     label: 'Agente Policial' },
          { value: 'Delegado de Polícia',                 label: 'Delegado de Polícia' },
          { value: 'Escrivão de Polícia',                 label: 'Escrivão de Polícia' },
          { value: 'Investigador de Polícia',             label: 'Investigador de Polícia' },
        ]},
      ],
    },
  ],
  gerar(campos, u, ctx) {
    const meses = ['janeiro','fevereiro','março','abril','maio','junho',
                   'julho','agosto','setembro','outubro','novembro','dezembro'];
    const hoje  = new Date();
    const data  = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
    const boRef = campos.numBO
      ? `, relacionado ao boletim de ocorrência nº <strong>${campos.numBO}</strong>,`
      : '';

    return `
      <p style="text-align:justify;margin-bottom:1rem">
        Eu, <strong>${campos.nome}</strong>, RG <strong>${campos.rg}</strong>,
        na qualidade de <strong>${campos.qualidade}</strong> do imóvel situado à
        <strong>${campos.endereco}</strong>${boRef}
        DECLARO, de forma livre, expressa, voluntária e consciente, que:
      </p>

      <p style="text-align:justify;margin-bottom:1rem">
        Estou ciente do direito fundamental à inviolabilidade domiciliar, garantido pelo
        art. 5º, inciso XI, da Constituição Federal de 1988.</em>
      </p>

      <p style="text-align:justify;margin-bottom:1rem">
        <strong>AUTORIZO</strong>, livremente e sem qualquer coação, ameaça ou
        promessa de vantagem, o ingresso de agentes da Polícia Civil do Estado de
        São Paulo no referido imóvel, bem como a realização de diligências de
        busca e apreensão necessárias à investigação policial em curso, nos termos
        dos arts. 240 a 250 do Código de Processo Penal.
      </p>

      <p style="text-align:justify;margin-bottom:1rem">
        A presente declaração é firmada em conformidade com as diretrizes estabelecidas
        pelo Superior Tribunal de Justiça no HC 598.051/SP (Sexta Turma, j. 02/03/2021),
        que exige o registro documental do consentimento do morador para fins de
        validade probatória do ingresso policial em domicílio sem mandado judicial.
      </p>

      <p style="text-align:justify;margin-bottom:1rem">
        Por ser a expressão da verdade, firmo o presente.
      </p>

      <p style="text-align:center;margin:2rem 0">
        ${u.mun}, ${data}
      </p>

      <div style="text-align:center;margin-top:3rem">
        <div style="border-top:1px solid #000;width:55%;margin:0 auto .4rem"></div>
        <div>Assinatura do(a) declarante</div>
        <div><strong>${campos.nome} — RG ${campos.rg}</strong></div>
      </div>

      ${campos.inclui_policial && campos.pol_nome ? '<div style="text-align:center;margin-top:2.5rem"><div style="border-top:1px solid #000;width:55%;margin:0 auto .4rem"></div><div>' + String(campos.pol_nome).toUpperCase() + '</div><div><strong>' + String(campos.pol_carreira || '') + '</strong></div></div>' : ''}`;
  },
};

// ── AUTORIZAÇÃO PARA ALTERAÇÃO DE PLANTÃO ─────────────────────
PCSP_DOCS.alteracaoPlantao = {
  id: 'alteracaoPlantao',
  icone: '🔄',
  titulo: 'Troca de Plantão',
  subtitulo: 'Autorização para alteração de escala',
  customModal: true,
};

PCDoc._trocas = [];

PCDoc._diaSemana = function(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return ['domingo','segunda','terça','quarta','quinta','sexta','sábado'][d.getDay()];
};

PCDoc._ehFimSemana = function(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T12:00:00');
  return d.getDay() === 0 || d.getDay() === 6;
};

PCDoc._horarios = function(dateStr, turno, feriado) {
  const fds = PCDoc._ehFimSemana(dateStr) || feriado;
  if (turno === 'diurno')  return fds ? 'das 08h00 às 20h00' : 'das 08h00 às 18h00';
  if (turno === 'noturno') return fds ? 'das 20h00 às 08h00' : 'das 18h00 às 08h00';
  return '';
};

PCDoc._renderTrocas = function() {
  const cont = document.getElementById('alteracaoTrocasList');
  if (!cont) return;
  if (PCDoc._trocas.length === 0) {
    cont.innerHTML = '<p style="color:var(--text-muted);font-size:.82rem;padding:.5rem 0">Nenhuma troca adicionada ainda.</p>';
    return;
  }
  cont.innerHTML = PCDoc._trocas.map(function(t, i) {
    const dia = PCDoc._diaSemana(t.data);
    const hor = PCDoc._horarios(t.data, t.turno, t.feriado);
    const dataFmt = t.data ? t.data.split('-').reverse().join('/') : '—';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem .75rem;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:.4rem;gap:.5rem">' +
      '<span style="font-size:.8rem;flex:1"><strong>' + dataFmt + '</strong> (' + dia + ' – ' + t.turno + ') ' + hor +
      ' — <em>' + t.nomeEntra + '</em> no lugar de <em>' + t.nomeSai + '</em>' +
      (t.feriado ? ' 🎉' : '') + '</span>' +
      '<button onclick="PCDoc._removeTroca(' + i + ')" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:1rem;flex-shrink:0" title="Remover">🗑</button>' +
      '</div>';
  }).join('');
};

PCDoc._removeTroca = function(i) {
  PCDoc._trocas.splice(i, 1);
  PCDoc._renderTrocas();
};

PCDoc._addTroca = function() {
  const data       = document.getElementById('alteracaoData')?.value;
  const turno      = document.getElementById('alteracaoTurno')?.value;
  const carreiraE  = document.getElementById('alteracaoCarreiraEntra')?.value?.trim();
  const nomeERaw   = document.getElementById('alteracaoNomeEntra')?.value?.trim();
  const carreiraS  = document.getElementById('alteracaoCarreiraSai')?.value?.trim();
  const nomeSRaw   = document.getElementById('alteracaoNomeSai')?.value?.trim();
  const ferial     = document.getElementById('alteracaoFeriado')?.checked || false;

  const nomeE = carreiraE ? carreiraE + ' ' + nomeERaw : nomeERaw;
  const nomeS = carreiraS ? carreiraS + ' ' + nomeSRaw : nomeSRaw;

  if (!data || !turno || !nomeERaw || !nomeSRaw) {
    if (typeof showToast === 'function') showToast('Preencha data, turno e os dois nomes.');
    return;
  }
  PCDoc._trocas.push({ data, turno,
    nomeEntra: nomeE, nomeSai: nomeS,
    carreiraEntra: carreiraE, carreiraEntraNome: nomeERaw,
    carreiraSai: carreiraS, carreiraSaiNome: nomeSRaw,
    feriado: ferial });
  document.getElementById('alteracaoData').value = '';
  document.getElementById('alteracaoNomeEntra').value = '';
  document.getElementById('alteracaoNomeSai').value = '';
  if (document.getElementById('alteracaoCarreiraEntra')) document.getElementById('alteracaoCarreiraEntra').value = '';
  if (document.getElementById('alteracaoCarreiraSai'))  document.getElementById('alteracaoCarreiraSai').value = '';
  document.getElementById('alteracaoFeriado').checked = false;
  PCDoc._renderTrocas();
  document.getElementById('alteracaoData').focus();
};

PCDoc._gerarAlteracao = function() {
  if (PCDoc._trocas.length === 0) {
    if (typeof showToast === 'function') showToast('Adicione ao menos uma troca.');
    return;
  }
  const unitIdx = document.getElementById('pcdocUnit')?.value;
  if (unitIdx === '' || unitIdx === undefined || unitIdx === null) {
    if (typeof showToast === 'function') showToast('Selecione a unidade policial.');
    return;
  }
  const u = (PCDoc._unitListRef || [])[parseInt(unitIdx)];
  if (!u) { if (typeof showToast === 'function') showToast('Selecione a unidade policial.'); return; }

  const cidade   = u.mun || u.nome;
  const delegado = document.getElementById('alteracaoDelegado')?.value?.trim() || '';

  const linhasTrocas = PCDoc._trocas.map(function(t) {
    const dia      = PCDoc._diaSemana(t.data);
    const fmt      = t.data.split('-').reverse().join('/');
    const fdsOuFer = PCDoc._ehFimSemana(t.data) || t.feriado;
    const iniFim   = t.turno === 'noturno'
      ? (fdsOuFer ? 'das 20:00 às 08:00 hs' : 'das 18:00 às 08:00 hs')
      : (fdsOuFer ? 'das 08:00 às 20:00 hs' : 'das 08:00 às 18:00 hs');
    return '<p style="margin-bottom:.9rem">' +
      'Dia ' + fmt + ' (' + dia + ' – ' + t.turno + ') – ' + iniFim + '<br>' +
      '<strong>' + t.nomeEntra + '</strong> no lugar ' + (t.nomeSai.match(/^Delegad/i) ? 'da ' : 'do ') + '<strong>' + t.nomeSai + '</strong>.' +
      '</p>';
  }).join('');

  // Build unique persons preserving carreira + nome separately
  const pessoasVistas = [];
  const pessoasKeys   = [];
  PCDoc._trocas.forEach(function(t) {
    if (!pessoasKeys.includes(t.nomeEntra)) {
      pessoasKeys.push(t.nomeEntra);
      pessoasVistas.push({ nome: t.carreiraEntraNome || t.nomeEntra, carreira: t.carreiraEntra || '' });
    }
    if (!pessoasKeys.includes(t.nomeSai)) {
      pessoasKeys.push(t.nomeSai);
      pessoasVistas.push({ nome: t.carreiraSaiNome  || t.nomeSai,   carreira: t.carreiraSai   || '' });
    }
  });

  // Each signature: line + NOME EM CAIXA ALTA sem negrito + Carreira em negrito
  const assinaturas = pessoasVistas.map(function(p) {
    return '<div style="margin-top:6rem">' +
      '<div style="border-top:1px solid #000;width:40%;margin-bottom:.5rem"></div>' +
      '<div style="text-transform:uppercase;letter-spacing:.02em">' + p.nome + '</div>' +
      (p.carreira ? '<div><strong>' + p.carreira + '</strong></div>' : '') +
      '</div>';
  }).join('');

  // Delegado block — centered, same format
  const delNome     = delegado || '_______________________________';
  const delCarreira = 'Delegado(a) de Polícia Titular — ' + u.nome;
  const delBlock =
    '<div style="margin-top:6rem;text-align:center">' +
    '<div style="border-top:1px solid #000;width:40%;margin:0 auto .5rem"></div>' +
    '<div style="text-transform:uppercase;letter-spacing:.02em">' + delNome + '</div>' +
    '<div><strong>' + delCarreira + '</strong></div>' +
    '</div>';

  const corpo =
    '<p style="margin-bottom:1.1rem">Solicitamos autorização para alteração na escala de plantão de <strong>' + cidade + '</strong>, ficando da seguinte forma:</p>' +
    linhasTrocas +
    assinaturas +
    '<div style="margin-top:5rem"><p style="margin-bottom:.4rem">Nada a opor</p>' +
    delBlock + '</div>';

  const html = PCDoc._docHtml(u, 'AUTORIZAÇÃO PARA ALTERAÇÃO DE PLANTÃO', corpo);
  PCDoc._lastHtml = html;
  PCDoc._lastDoc  = PCSP_DOCS.alteracaoPlantao;

  const prev = document.getElementById('pcdocPreview');
  const out  = document.getElementById('pcdocOutput');
  if (prev) prev.innerHTML = html;
  if (out)  out.classList.remove('hidden');
  setTimeout(function() { if (out) out.scrollIntoView({ behavior:'smooth' }); }, 100);
};


// ══════════════════════════════════════════════════════════════
// FONAR — Formulário Nacional de Avaliação de Risco
// Resolução Conjunta CNJ/CNMP nº 5/2020 / Lei nº 14.149/2021
// ══════════════════════════════════════════════════════════════
PCSP_DOCS.fonar = {
  id: 'fonar',
  icone: '\U0001F6BA',
  titulo: 'FONAR \u2014 Formul\u00e1rio Nacional de Avalia\u00e7\u00e3o de Risco',
  subtitulo: 'Viol\u00eancia Dom\u00e9stica e Familiar contra a Mulher',
  campos: [
    { id: 'boletim',       label: 'N\u00famero do BO',                              placeholder: 'Ex: 000001/2026',   required: false },
    { id: 'nomeVitima',    label: 'Nome da v\u00edtima',                             placeholder: 'Nome completo',      required: false },
    { id: 'idadeVitima',   label: 'Idade da v\u00edtima',                            placeholder: '',                   required: false },
    { id: 'escVitima',     label: 'Escolaridade da v\u00edtima',                     placeholder: '',                   required: false },
    { id: 'nacVitima',     label: 'Nacionalidade da v\u00edtima',                    placeholder: '',                   required: false },
    { id: 'nomeAgressor',  label: 'Nome do(a) agressor(a)',                           placeholder: 'Nome completo',      required: false },
    { id: 'idadeAgressor', label: 'Idade do(a) agressor(a)',                          placeholder: '',                   required: false },
    { id: 'escAgressor',   label: 'Escolaridade do(a) agressor(a)',                   placeholder: '',                   required: false },
    { id: 'nacAgressor',   label: 'Nacionalidade do(a) agressor(a)',                  placeholder: '',                   required: false },
    { id: 'vinculo',       label: 'V\u00ednculo entre v\u00edtima e agressor(a)',     placeholder: 'Ex: c\u00f4njuge',   required: false },
  ],
  gerar: function(campos, u) {
    var v = campos;
    var S = 'font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#000;';
    var J = S + 'text-align:justify;';

    function linhaFull(label, key) {
      return '<div style="' + J + 'display:flex;align-items:baseline;gap:4px;margin-bottom:5px;width:100%">' +
        '<span style="white-space:nowrap"><strong>' + label + ':</strong></span>' +
        (v[key]
          ? '<span>&nbsp;' + v[key] + '</span>'
          : '<div style="border-bottom:1px solid #000;flex:1;margin-left:4px">&nbsp;</div>') +
        '</div>';
    }
    function linhaDouble(l1, k1, l2, k2) {
      return '<div style="display:flex;gap:1rem;margin-bottom:5px;width:100%">' +
        '<div style="' + J + 'display:flex;align-items:baseline;gap:4px;flex:3">' +
          '<span style="white-space:nowrap"><strong>' + l1 + ':</strong></span>' +
          (v[k1]
            ? '<span>&nbsp;' + v[k1] + '</span>'
            : '<div style="border-bottom:1px solid #000;flex:1;margin-left:4px">&nbsp;</div>') +
        '</div>' +
        '<div style="' + J + 'display:flex;align-items:baseline;gap:4px;flex:1">' +
          '<span style="white-space:nowrap"><strong>' + l2 + ':</strong></span>' +
          (v[k2]
            ? '<span>&nbsp;' + v[k2] + '</span>'
            : '<div style="border-bottom:1px solid #000;flex:1;margin-left:4px">&nbsp;</div>') +
        '</div>' +
      '</div>';
    }

    // Seção com caixa de texto e bordas
    function secao(titulo) {
      return '<div style="border:1.5px solid #000;padding:5px 10px;margin:16px 0 8px;font-weight:bold;' + S + 'text-align:center;font-size:11pt">' +
        titulo + '</div>';
    }

    function cb(label) {
      return '<div style="display:flex;align-items:center;gap:5px;margin-bottom:1px;' + S + '">' +
        '<span style="display:inline-block;width:11px;height:11px;border:1.5px solid #000;flex-shrink:0"></span>' +
        '<span>' + label + '</span>' +
        '</div>';
    }

    function pergunta(num, texto, opcoes) {
      return '<div style="margin-bottom:10px">' +
        '<div style="' + J + S + 'margin-bottom:5px"><strong>' + num + '.</strong> ' + texto + '</div>' +
        '<div style="padding-left:10px">' + opcoes + '</div>' +
        '</div>';
    }

    var dataImpressao = new Date().toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric'});

    var corpo =
      // Identificação — caixa de borda
      secao('Identifica\u00e7\u00e3o das Partes') +
      linhaFull('N\u00famero do BO', 'boletim') +
      linhaDouble('Nome da v\u00edtima', 'nomeVitima', 'Idade', 'idadeVitima') +
      linhaFull('Escolaridade', 'escVitima') +
      linhaFull('Nacionalidade', 'nacVitima') +
      linhaDouble('Nome do(a) agressor(a)', 'nomeAgressor', 'Idade', 'idadeAgressor') +
      linhaFull('Escolaridade', 'escAgressor') +
      linhaFull('Nacionalidade', 'nacAgressor') +
      linhaFull('V\u00ednculo entre a v\u00edtima e o(a) agressor(a)', 'vinculo') +
      '<div style="' + J + S + 'margin-bottom:14px">Data: ' + dataImpressao + '</div>' +

      // BLOCO I
      secao('Bloco I \u2014 Sobre o hist\u00f3rico de viol\u00eancia') +

      pergunta(1,
        'O(A) agressor(a) j\u00e1 amea\u00e7ou voc\u00ea ou algum familiar com a finalidade de atingi-la?',
        cb('Sim, utilizando arma de fogo') +
        cb('Sim, utilizando faca') +
        cb('Sim, de outra forma') +
        cb('N\u00e3o')) +

      pergunta(2,
        'O(A) agressor(a) j\u00e1 praticou alguma(s) destas agress\u00f5es f\u00edsicas contra voc\u00ea?',
        cb('Queimadura') +
        cb('Enforcamento') +
        cb('Sufocamento') +
        cb('Tiro') +
        cb('Afogamento') +
        cb('Facada') +
        cb('Paulada') +
        cb('Nenhuma das agress\u00f5es acima')) +

      pergunta(3,
        'O(A) agressor(a) j\u00e1 praticou alguma(s) destas outras agress\u00f5es f\u00edsicas contra voc\u00ea?',
        cb('Socos') +
        cb('Chutes') +
        cb('Tapas') +
        cb('Empur\u00f5es') +
        cb('Pux\u00f5es de Cabelo') +
        cb('Nenhuma das agress\u00f5es acima')) +

      pergunta(4,
        'O(A) agressor(a) j\u00e1 obrigou voc\u00ea a fazer sexo ou a praticar atos sexuais contra sua vontade?',
        cb('Sim') +
        cb('N\u00e3o')) +

      pergunta(5,
        'O(A) agressor(a) j\u00e1 teve algum destes comportamentos?',
        cb('disse algo parecido com a frase: \u201cse n\u00e3o for minha, n\u00e3o ser\u00e1 de mais ningu\u00e9m\u201d') +
        cb('perturbou, perseguiu ou vigiou voc\u00ea nos locais em que frequenta') +
        cb('proibiu voc\u00ea de visitar familiares ou amigos') +
        cb('proibiu voc\u00ea de trabalhar ou estudar') +
        cb('fez telefonemas, enviou mensagens pelo celular ou e-mails de forma insistente') +
        cb('impediu voc\u00ea de ter acesso a dinheiro, conta banc\u00e1ria ou outros bens (como documentos pessoais, carro)') +
        cb('teve outros comportamentos de ci\u00fames excessivo e de controle sobre voc\u00ea') +
        cb('nenhum dos comportamentos acima listados')) +

      pergunta(6,
        'Voc\u00ea j\u00e1 registrou ocorr\u00eancia policial ou formulou pedido de medida protetiva de urg\u00eancia envolvendo essa mesma pessoa?',
        cb('Sim') +
        cb('N\u00e3o')) +

      pergunta(7,
        'As amea\u00e7as ou agress\u00f5es f\u00edsicas do(a) agressor(a) contra voc\u00ea se tornaram mais frequentes ou mais graves nos \u00faltimos meses?',
        cb('Sim') +
        cb('N\u00e3o')) +

      // BLOCO II
      secao('Bloco II \u2014 Sobre o(a) agressor(a)') +

      pergunta(8,
        'O(A) agressor(a) faz uso abusivo de \u00e1lcool ou de drogas?',
        cb('Sim, de \u00e1lcool') +
        cb('Sim, de drogas') +
        cb('N\u00e3o') +
        cb('N\u00e3o sei')) +

      pergunta(9,
        'O(A) agressor(a) tem alguma doen\u00e7a mental comprovada por avalia\u00e7\u00e3o m\u00e9dica?',
        cb('Sim e faz uso de medica\u00e7\u00e3o') +
        cb('Sim e n\u00e3o faz uso de medica\u00e7\u00e3o') +
        cb('N\u00e3o') +
        cb('N\u00e3o sei')) +

      pergunta(10,
        'O(A) agressor(a) j\u00e1 descumpriu medida protetiva anteriormente?',
        cb('Sim') +
        cb('N\u00e3o')) +

      pergunta(11,
        'O(A) agressor(a) j\u00e1 tentou suic\u00eddio ou falou em suicidar-se?',
        cb('Sim') +
        cb('N\u00e3o')) +

      pergunta(12,
        'O(A) agressor(a) est\u00e1 desempregado ou tem dificuldades financeiras?',
        cb('Sim') +
        cb('N\u00e3o') +
        cb('N\u00e3o sei')) +

      pergunta(13,
        'O(A) agressor(a) tem acesso a armas de fogo?',
        cb('Sim') +
        cb('N\u00e3o') +
        cb('N\u00e3o sei')) +

      pergunta(14,
        'O(A) agressor(a) j\u00e1 amea\u00e7ou ou agrediu seus filhos, outros familiares, amigos, colegas de trabalho, pessoas desconhecidas ou animais de estima\u00e7\u00e3o?',
        cb('Sim. Especifique:') +
        '<div style="padding-left:20px">' +
          cb('filhos') + cb('outros familiares') + cb('outras pessoas') + cb('animais') +
        '</div>' +
        cb('N\u00e3o') +
        cb('N\u00e3o sei')) +

      // BLOCO III
      secao('Bloco III \u2014 Sobre voc\u00ea') +

      pergunta(15,
        'Voc\u00ea se separou recentemente do(a) agressor(a) ou tentou se separar?',
        cb('Sim') +
        cb('N\u00e3o')) +

      pergunta(16,
        'Voc\u00ea tem filhos?',
        cb('Sim, com o agressor. Quantos? ______') +
        cb('Sim, de outro relacionamento. Quantos? ______') +
        cb('N\u00e3o')) +

      pergunta(17,
        'Se sim, assinale a faixa et\u00e1ria de seus filhos. Se tiver mais de um filho, pode assinalar mais de uma op\u00e7\u00e3o:',
        cb('0 a 11 anos') +
        cb('12 a 17 anos') +
        cb('A partir de 18 anos')) +

      pergunta(18,
        'Algum de seus filhos \u00e9 pessoa portadora de defici\u00eancia?',
        cb('Sim, Quantos? ______') +
        cb('N\u00e3o')) +

      pergunta(19,
        'Voc\u00ea est\u00e1 vivendo algum conflito com o(a) agressor(a) em rela\u00e7\u00e3o \u00e0 guarda do(s) filho(s), visitas ou pagamento de pens\u00e3o?',
        cb('Sim') +
        cb('N\u00e3o') +
        cb('N\u00e3o tenho filhos com o(a) agressor(a)')) +

      pergunta(20,
        'Seu(s) filho(s) j\u00e1 presenciaram ato(s) de viol\u00eancia do(a) agressor(a) contra voc\u00ea?',
        cb('Sim') +
        cb('N\u00e3o')) +

      pergunta(21,
        'Voc\u00ea sofreu algum tipo de viol\u00eancia durante a gravidez ou nos tr\u00eas meses posteriores ao parto?',
        cb('Sim') +
        cb('N\u00e3o')) +

      pergunta(22,
        'Se voc\u00ea est\u00e1 em um novo relacionamento, percebeu que as amea\u00e7as ou as agress\u00f5es f\u00edsicas aumentaram em raz\u00e3o disso?',
        cb('Sim') +
        cb('N\u00e3o')) +

      pergunta(23,
        'Voc\u00ea possui alguma defici\u00eancia ou \u00e9 portadora de doen\u00e7as degenerativas que acarretam condi\u00e7\u00e3o limitante ou de vulnerabilidade f\u00edsica ou mental?',
        cb('Sim. Qual(is)? _________________________________________') +
        cb('N\u00e3o')) +

      pergunta(24,
        'Com qual cor/ra\u00e7a voc\u00ea se identifica:',
        cb('branca') +
        cb('preta') +
        cb('parda') +
        cb('amarela/oriental') +
        cb('ind\u00edgena')) +

      // BLOCO IV
      secao('Bloco IV \u2014 Outras Informa\u00e7\u00f5es Importantes') +

      pergunta(25,
        'Voc\u00ea considera que mora em bairro, comunidade, \u00e1rea rural ou local de risco de viol\u00eancia?',
        cb('Sim') +
        cb('N\u00e3o') +
        cb('N\u00e3o sei')) +

      pergunta(26,
        'Voc\u00ea se considera dependente financeiramente do(a) agressor(a)?',
        cb('Sim') +
        cb('N\u00e3o')) +

      pergunta(27,
        'Voc\u00ea quer e aceita abrigamento tempor\u00e1rio?',
        cb('Sim') +
        cb('N\u00e3o')) +

      // Declaração
      '<div style="margin-top:16px;' + J + S + '">' +
        'Declaro, para os fins de direito, que as informa\u00e7\u00f5es supra s\u00e3o ver\u00eddicas e foram prestadas por mim.' +
      '</div>' +
      '<div style="' + S + 'display:flex;align-items:baseline;gap:4px;margin:10px 0 16px">' +
        '<span style="white-space:nowrap">Assinatura da v\u00edtima:</span>' +
        '<div style="border-bottom:1px solid #000;flex:1;margin-left:4px">&nbsp;</div>' +
      '</div>' +

      // Profissional
      secao('Para Preenchimento pelo Profissional') +
      cb('V\u00edtima respondeu a este formul\u00e1rio sem ajuda profissional') +
      cb('V\u00edtima respondeu a este formul\u00e1rio com aux\u00edlio profissional') +
      cb('V\u00edtima n\u00e3o teve condi\u00e7\u00f5es de responder a este formul\u00e1rio') +
      cb('V\u00edtima recusou-se a preencher o formul\u00e1rio') +
      cb('Terceiro comunicante respondeu a este formul\u00e1rio') +

      // Rodapé institucional
      '<div style="page-break-inside:avoid;break-inside:avoid">' +
        '<div style="margin-top:24px;border:1px solid #000;padding:10px 12px;' + J + S + 'font-size:10pt">' +
          'O Formul\u00e1rio Nacional de Avalia\u00e7\u00e3o de Risco foi institu\u00eddo pela Resolu\u00e7\u00e3o Conjunta CNJ/CNMP n\u00ba 5/2020 e \u00e9 um instrumento destinado a identificar fatores de risco de a mulher vir a sofrer qualquer forma de viol\u00eancia no \u00e2mbito das rela\u00e7\u00f5es dom\u00e9sticas e familiares.' +
        '</div>' +
      '</div>';

    return corpo;
  },
};
