/* ============================================================
   PLANTÃO CHECK — Templates de Texto v2
   ============================================================ */

const TEMPLATES = {

  // ── HISTÓRICO DE BO — CAPTURA DE PROCURADO ───────────────
  historicoCaptura: {
    title: 'Histórico do BO — Captura de Procurado',
    fields: [
      {
        id: 'tipoCondutor',
        label: 'Tipo de condutor',
        placeholder: 'policial militar / guarda municipal'
      },
      {
        id: 'numMandado',
        label: 'Número do mandado',
        placeholder: 'Ex: 0000001-00.2024.8.26.0000'
      },
      {
        id: 'numProcesso',
        label: 'Número do processo',
        placeholder: 'Ex: 0000001-00.2024.8.26.0000'
      },
      {
        id: 'vara',
        label: 'Vara / Juízo',
        placeholder: 'Ex: 1ª Vara Criminal da Comarca'
      },
      {
        id: 'dataExpedicao',
        label: 'Data de expedição do mandado',
        placeholder: 'Ex: 10/01/2025'
      },
      {
        id: 'validade',
        label: 'Validade do mandado',
        placeholder: 'Ex: indeterminada'
      },
      {
        id: 'tipoPrisao',
        label: 'Tipo de prisão',
        placeholder: 'Ex: preventiva / temporária / definitiva'
      },
    ],
    generate: (f) => {
      const condutor = f.tipoCondutor || 'policial militar';
      return `Comparece o condutor, ${condutor} acima qualificado, noticiando que estava em patrulhamento com sua equipe quando realizou a abordagem do apresentado e, em consulta aos sistemas policiais, verificou-se que o indivíduo constava como procurado pela Justiça. Em revista pessoal, nada de ilícito foi encontrado. Diante dos fatos, o indivíduo foi encaminhado à unidade de saúde local para realização de exame cautelar de praxe e, na sequência, conduzido a esta unidade policial.

Já nesta delegacia, em consulta aos sistemas Analítico, Banco Nacional de Mandados de Prisão (BNMP) e Prodesp, confirmou-se mandado de prisão em desfavor do conduzido, conforme número ${f.numMandado}, processo nº ${f.numProcesso}, expedido em ${f.dataExpedicao} pela ${f.vara}, com validade até ${f.validade}, na modalidade: prisão ${f.tipoPrisao}.

Face ao exposto, foi dado cumprimento ao referido mandado e lavrou-se o presente boletim de ocorrência. Acrescenta-se ainda que [NOME DA PESSOA + TELEFONE] foi comunicado(a) de sua prisão. Por fim, foram feitas as comunicações de praxe.`;
    }
  },

  // ── E-MAIL — VEÍCULO APREENDIDO / GUINCHO ────────────────
  emailGuincho: {
    title: 'Modelo de E-mail — Veículo Apreendido',
    fields: [
      { id: 'numBO',          label: 'Número do BO',                    placeholder: 'Ex: AV0438-2026' },
      { id: 'veiculo',        label: 'Veículo (marca/modelo)',           placeholder: 'Ex: HONDA/CG 125 FAN' },
      { id: 'placa',          label: 'Placa',                           placeholder: 'Ex: DPT3930' },
      { id: 'lacre',          label: 'Número do lacre',                 placeholder: 'Ex: 0122261' },
      { id: 'dataAcionamento',label: 'Data e hora — acionamento',       placeholder: 'Ex: 16/01/2026 às 17:50' },
      { id: 'dataChegada',    label: 'Data e hora — chegada do guincho', placeholder: 'Ex: 16/01/2026 às 19:45' },
      { id: 'protocolo',      label: 'Protocolo do guincho',            placeholder: 'Ex: delitu1601261758' },
    ],
    generate: (f) =>
`Prezados,

Pelo presente, informo que foi solicitado guincho no boletim de ocorrência nº ${f.numBO} para o veículo ${f.veiculo}, placa ${f.placa}, lacre nº ${f.lacre}.

Acionamento: ${f.dataAcionamento}
Chegada: ${f.dataChegada}
Protocolo: ${f.protocolo}

Veículo recolhido ao pátio: SIM.

Atenciosamente,
Escrivão de Polícia

OBS.: Anexar cópia do BO, auto de exibição e apreensão e papeleta do guincho.`
  },

  // ── E-MAIL — OCORRÊNCIA DE RELEVÂNCIA ───────────────────
  emailRelevancia: {
    title: 'Modelo de E-mail — Ocorrência de Relevância',
    fields: [
      { id: 'local',  label: 'Local da delegacia', placeholder: 'Ex: DELPOL DA COMARCA' },
      { id: 'data',   label: 'Data por extenso',   placeholder: 'Ex: 30 DE JANEIRO DE 2026' },
      { id: 'crime',  label: 'Natureza do crime',  placeholder: 'Ex: HOMICÍDIO DOLOSO' },
      { id: 'numBO',  label: 'Número do BO',        placeholder: 'Ex: AV0100-2026' },
    ],
    generate: (f) =>
`${f.local}, ${f.data}

Excelentíssimo Delegado de Polícia,

Pelo presente, comunico ocorrência de relevância versando sobre ${f.crime}, registrada no boletim de ocorrência nº ${f.numBO}.

[COLE AQUI O HISTÓRICO COMPLETO DO BO]

Delegado de Polícia

OBS.: Copiar e colar o BO inteiro no corpo da mensagem — NÃO colocar em anexo.`
  },

  // ── E-MAIL — DESAPARECIMENTO DE PESSOA ──────────────────
  emailDesaparecimento: {
    title: 'Modelo de E-mail — Desaparecimento de Pessoa',
    fields: [
      { id: 'local',  label: 'Local da delegacia', placeholder: 'Ex: DELPOL DA COMARCA' },
      { id: 'data',   label: 'Data por extenso',   placeholder: 'Ex: 30 DE JANEIRO DE 2026' },
      { id: 'nome',   label: 'Nome do desaparecido', placeholder: 'Ex: FULANO DE TAL' },
      { id: 'numBO',  label: 'Número do BO',          placeholder: 'Ex: AV0100-2026' },
    ],
    generate: (f) =>
`${f.local}, ${f.data}

Excelentíssimo Delegado de Polícia,

Pelo presente, comunico o desaparecimento de ${f.nome}, conforme boletim de ocorrência nº ${f.numBO}.

[COLE AQUI O HISTÓRICO COMPLETO DO BO]

Delegado de Polícia

OBS.: Copiar e colar o BO inteiro no corpo da mensagem — NÃO colocar em anexo. Incluir o máximo de dados sobre a pessoa desaparecida: cor da pele, adornos, vestimenta, placa do veículo (se houver) e fotos.`
  },
};
