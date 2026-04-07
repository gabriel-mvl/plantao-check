/* ============================================================
   PLANTÃO CHECK — Templates de Texto
   Geradores de histórico, modelos de documentos etc.
   ============================================================ */

const TEMPLATES = {

  // ── HISTÓRICO DE BO — CAPTURA ─────────────────────────────
  historicoCaptura: {
    title: 'Histórico do BO — Captura de Procurado',
    fields: [
      { id: 'condutor', label: 'Nome do condutor (policial militar)', placeholder: 'Ex: Sd PM FULANO DE TAL' },
      { id: 'testemunha', label: 'Nome da testemunha (PM)', placeholder: 'Ex: Sd PM BELTRANO' },
      { id: 'capturado', label: 'Nome do capturado', placeholder: 'Ex: JOÃO DA SILVA' },
      { id: 'numMandado', label: 'Número do mandado', placeholder: 'Ex: 0000001-00.2024.8.26.0000' },
      { id: 'numProcesso', label: 'Número do processo', placeholder: 'Ex: 0000001-00.2024.8.26.0000' },
      { id: 'vara', label: 'Vara / Juízo', placeholder: 'Ex: 1ª Vara Criminal de Sorocaba' },
      { id: 'dataExpedicao', label: 'Data de expedição do mandado', placeholder: 'Ex: 10/01/2025' },
      { id: 'validade', label: 'Validade do mandado', placeholder: 'Ex: indeterminada / 10/01/2026' },
      { id: 'tipoPrisao', label: 'Tipo de prisão', placeholder: 'Ex: preventiva / temporária / definitiva' },
    ],
    generate: (f) => `Comparecem nesta unidade policial o condutor ${f.condutor} e a testemunha ${f.testemunha}, ambos policiais militares, apresentando o capturado ${f.capturado}, bem como informando que em patrulhamento realizaram a abordagem do apresentado e, em consulta aos sistemas, verificaram que o mesmo encontrava-se constando como procurado pela Justiça. Nada relacionado foi exibido para apreensão.

Já nesta delegacia, em consulta aos sistemas policiais, foi verificado mandado de prisão em desfavor de ${f.capturado}, cujos dados são: mandado nº ${f.numMandado}, processo nº ${f.numProcesso}, ${f.vara}, data de expedição: ${f.dataExpedicao}, validade: ${f.validade}, tipo de prisão: ${f.tipoPrisao}.

Diante do exposto, lavrou-se o presente boletim de ocorrência.`
  },

  // ── E-MAIL DE GUINCHO / VEÍCULO APREENDIDO ───────────────
  emailGuincho: {
    title: 'Modelo de E-mail — Veículo Apreendido / Guincho',
    fields: [
      { id: 'numBO', label: 'Número do BO', placeholder: 'Ex: AV0438-2026' },
      { id: 'veiculo', label: 'Veículo (marca/modelo)', placeholder: 'Ex: HONDA/CG 125 FAN' },
      { id: 'placa', label: 'Placa do veículo', placeholder: 'Ex: DPT3930' },
      { id: 'lacre', label: 'Número do lacre', placeholder: 'Ex: 0122261' },
      { id: 'dataAcionamento', label: 'Data e hora do acionamento do guincho', placeholder: 'Ex: 16/01/2026 às 17:50' },
      { id: 'dataChegada', label: 'Data e hora da chegada do guincho', placeholder: 'Ex: 16/01/2026 às 19:45' },
      { id: 'protocolo', label: 'Protocolo do guincho', placeholder: 'Ex: delitu1601261758' },
    ],
    generate: (f) => `Prezados,

Pelo presente informo que foi feita a solicitação de guincho no boletim de ocorrência nº ${f.numBO} para o veículo ${f.veiculo}, PLACA ${f.placa} — Lacre: ${f.lacre}.

Hora e data de acionamento do guincho: ${f.dataAcionamento}
Hora e data da chegada do guincho: ${f.dataChegada}
Protocolo do guincho: ${f.protocolo}
Veículo: ${f.veiculo} (PLACA ${f.placa})
Lacre: ${f.lacre}

Foi recolhido ao Pátio: SIM.

Atenciosamente,
Escrivão de Polícia

OBS.: Anexar cópia do boletim de ocorrência, exibição e apreensão e papeleta do guincho.`
  },

  // ── E-MAIL — OCORRÊNCIA DE RELEVÂNCIA ───────────────────
  emailRelevancia: {
    title: 'Modelo de E-mail — Ocorrência de Relevância',
    fields: [
      { id: 'local', label: 'Local da delegacia (ex: DELPOL ITU)', placeholder: 'DELPOL ITU' },
      { id: 'data', label: 'Data', placeholder: 'Ex: 30 DE JANEIRO DE 2026' },
      { id: 'crime', label: 'Tipo de crime', placeholder: 'Ex: HOMICÍDIO DOLOSO' },
      { id: 'numBO', label: 'Número do BO', placeholder: 'Ex: AV0100-2026' },
    ],
    generate: (f) => `${f.local}, ${f.data}

Excelentíssimo Delegado de Polícia,

Pelo presente, comunico ocorrência de relevância versando sobre crime de ${f.crime}, acerca do boletim de ocorrência ${f.numBO}.

[COLE AQUI O HISTÓRICO COMPLETO DO BOLETIM DE OCORRÊNCIA]

Delegado de Polícia

OBS.: Copiar e colar o BO inteiro no corpo da mensagem — NÃO anexar.`
  },

  // ── E-MAIL — DESAPARECIMENTO DE PESSOA ──────────────────
  emailDesaparecimento: {
    title: 'Modelo de E-mail — Desaparecimento de Pessoa',
    fields: [
      { id: 'local', label: 'Local da delegacia', placeholder: 'DELPOL ITU' },
      { id: 'data', label: 'Data', placeholder: 'Ex: 30 DE JANEIRO DE 2026' },
      { id: 'nome', label: 'Nome do desaparecido', placeholder: 'Ex: FULANO DE TAL' },
      { id: 'numBO', label: 'Número do BO', placeholder: 'Ex: AV0100-2026' },
    ],
    generate: (f) => `${f.local}, ${f.data}

Excelentíssimo Delegado de Polícia,

Pelo presente, comunico o desaparecimento de ${f.nome}, referente ao boletim de ocorrência ${f.numBO}.

[COLE AQUI O HISTÓRICO COMPLETO DO BOLETIM DE OCORRÊNCIA]

Delegado de Polícia

OBS.: Copiar e colar o BO inteiro no corpo da mensagem — NÃO anexar. Incluir o máximo de dados da pessoa desaparecida: cor da pele, adornos, vestimenta, placa do veículo (se houver) e fotos.`
  },
};
