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
             style="width:68px;height:68px;object-fit:contain;flex-shrink:0"
             alt="Brasão PCSP" />
        <div style="font-size:10.5px;line-height:1.85;font-weight:bold;color:#000">
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
                  text-align:center;font-family:Arial,Helvetica,sans-serif;color:#000">
        <div style="font-weight:bold">${_esc(u.nome)}</div>
        <div>${_esc(_fmtEndereco(u))}</div>
      </div>`;
  }

  // ── DOCUMENTO COMPLETO HTML (para impressão) ───────────────
  function _docHtml(u, titulo, corpoHtml) {
    return `
      <div style="font-family:'Times New Roman',Georgia,serif;color:#000;
                  font-size:12pt;line-height:1.85;max-width:680px;
                  margin:0 auto;padding:2.5rem 3rem">
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

    // Collect field values
    const campos = {};
    (doc.campos || []).forEach(c => {
      if (c.type === 'address') {
        // Build formatted address from sub-fields
        const log  = document.getElementById(`pcdoc_logradouro_${c.id}`)?.value?.trim() || '';
        const num  = document.getElementById(`pcdoc_numero_${c.id}`)?.value?.trim() || '';
        const comp = document.getElementById(`pcdoc_complemento_${c.id}`)?.value?.trim() || '';
        const bai  = document.getElementById(`pcdoc_bairro_${c.id}`)?.value?.trim() || '';
        const cid  = document.getElementById(`pcdoc_cidade_${c.id}`)?.value?.trim() || '';
        const cep  = document.getElementById(`pcdoc_cep_${c.id}`)?.value?.trim() || '';
        const parts = [log, num, comp].filter(Boolean).join(', ');
        const partsEnd = [bai, cid].filter(Boolean).join(', ');
        const cepStr = cep ? `, CEP ${cep.replace(/\D/g,'').replace(/(\d{5})(\d{3})/,'$1-$2')}` : '';
        campos[c.id] = [parts, partsEnd].filter(Boolean).join(', ') + cepStr;
      } else {
        campos[c.id] = document.getElementById(`pcdoc_${c.id}`)?.value?.trim() || '';
      }
    });

    // Validate required fields
    const missing = (doc.campos || []).filter(c => {
      if (c.required === false) return false;
      if (c.type === 'address') {
        const log = document.getElementById(`pcdoc_logradouro_${c.id}`)?.value?.trim() || '';
        const num = document.getElementById(`pcdoc_numero_${c.id}`)?.value?.trim() || '';
        return !log || !num;
      }
      return !campos[c.id];
    });
    if (missing.length) {
      if (typeof showToast === 'function') showToast(`Preencha: ${missing.map(c => c.label).join(', ')}`);
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
             color:#000;background:#fff}
        strong{font-weight:bold}
        @page{margin:2.5cm 2.5cm;size:A4}
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
      _renderModal(doc);
      document.getElementById('pcdocBackdrop')?.classList.remove('hidden');
      document.getElementById('pcdocModal')?.classList.remove('hidden');
      if (typeof toggleSidebar === 'function' && window.innerWidth <= 768) toggleSidebar();
    },

    close() {
      document.getElementById('pcdocBackdrop')?.classList.add('hidden');
      document.getElementById('pcdocModal')?.classList.add('hidden');
      _currentDoc = null;
    },

    gerar: _gerar,

    // Helpers expostos para uso nos templates de documentos
    helpers: { dataExtenso: _dataExtenso, fmtEndereco: _fmtEndereco },

    // Internos (expostos para uso via onclick inline)
    _onDeptChange,
    _onCepInput: _onCepInput,
    _copy,
    _print,
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
        indiciado(a) nos autos do BO nº <strong>${campos.numBO}</strong>,
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
    { id: 'nome',       label: 'Nome completo do declarante',      placeholder: 'Ex: FULANO DE TAL' },
    { id: 'rg',         label: 'RG',                               placeholder: 'Ex: 12.345.678-9' },
    { id: 'qualidade',  label: 'Qualidade (morador / responsável)', placeholder: 'Ex: morador(a) / proprietário(a)' },
    { id: 'endereco',   label: 'Endereço do imóvel',               type: 'address' },
    { id: 'numBO',      label: 'Número do BO (se houver)',          placeholder: 'Ex: AV0100-1/2026', required: false },
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
        art. 5º, inciso XI, da Constituição Federal de 1988</em>.
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

      <div style="text-align:center;margin-top:2.5rem">
        <div style="border-top:1px solid #000;width:55%;margin:0 auto .4rem"></div>
        <div>Assinatura do agente policial responsável pela diligência</div>
        <div style="font-size:.9em;margin-top:.15rem">Nome / RG funcional / Matrícula</div>
      </div>`;
  },
};
