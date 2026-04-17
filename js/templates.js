/* ============================================================
   PLANTÃO CHECK — Templates de Texto v3
   ============================================================ */

function formatarDataExtenso(iso) {
  if (!iso) return '[DATA]';
  const meses = ['JANEIRO','FEVEREIRO','MARCO','ABRIL','MAIO','JUNHO',
                 'JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];
  const [ano, mes, dia] = iso.split('-');
  const m = meses[parseInt(mes,10)-1].replace('MARCO','MARÇO');
  return parseInt(dia,10) + ' DE ' + m + ' DE ' + ano;
}

const EMAIL_TEMPLATES = [

  { id:'emailDesaparecimento', icon:'🔍', title:'Desaparecimento de Pessoa',
    fields:[
      {id:'delpol', label:'Delegacia',             placeholder:'Ex: DELPOL DA COMARCA'},
      {id:'data', label:'Data', type:'date'},
      {id:'nome',   label:'Nome do desaparecido',  placeholder:'Ex: FULANO DE TAL'},
      {id:'numBO',  label:'Número do BO',          placeholder:'Ex: AV0100-1/2026'},
    ],
    generate:(f)=>`${f.delpol}, ${formatarDataExtenso(f.data)}\n\nExcelentíssimo Delegado de Polícia,\n\nPelo presente, comunico o desaparecimento de ${f.nome}, conforme boletim de ocorrência ${f.numBO}.\n\n[COPIAR E COLAR O BOLETIM DE OCORRÊNCIA INTEIRO AQUI — NÃO COLOCAR EM ANEXO]\n\nDelegado de Polícia`,
    anexos:[],
    aviso:'Copiar e colar o boletim de ocorrência inteiro no corpo da mensagem. NÃO colocar o boletim em anexo.',
  },

  { id:'emailGuincho', icon:'🏗', title:'Acionamento de Guincho / Veículo Apreendido',
    fields:[
      {id:'delpol',          label:'Delegacia',                     placeholder:'Ex: DELPOL DA COMARCA'},
      {id:'data', label:'Data', type:'date'},
      {id:'numBO',           label:'Número do BO',                  placeholder:'Ex: AV0438-1/2026'},
      {id:'veiculo',         label:'Veículo (marca/modelo)',        placeholder:'Ex: HONDA/CG 125 FAN'},
      {id:'placa',           label:'Placa',                         placeholder:'Ex: DPT3930'},
      {id:'lacre',           label:'Número do lacre',               placeholder:'Ex: 0122261'},
      {id:'dataAcionamento', label:'Data e hora do acionamento',    placeholder:'Ex: 14/04/2026 às 17:50'},
      {id:'dataChegada',     label:'Data e hora da chegada',        placeholder:'Ex: 14/04/2026 às 19:45'},
      {id:'protocolo',       label:'Protocolo do guincho',          placeholder:'Ex: delitu1404261758'},
    ],
    generate:(f)=>`${f.delpol}, ${formatarDataExtenso(f.data)}\n\nPrezados,\n\nPelo presente informo que foi feita a solicitação de guincho no boletim de ocorrência nº ${f.numBO} para o veículo ${f.veiculo}, placa ${f.placa}, lacre nº ${f.lacre}.\n\nData e hora de acionamento do guincho: ${f.dataAcionamento}\nHora e data da chegada do guincho: ${f.dataChegada}\nProtocolo do guincho: ${f.protocolo}\nVeículo: ${f.veiculo} (placa ${f.placa})\nLacre: ${f.lacre}\nFoi recolhido ao pátio: SIM\n\nAtenciosamente,\nEscrivão de Polícia`,
    anexos:['Boletim de Ocorrência','Auto de Exibição e Apreensão','Papeleta do Guincho'],
    aviso:'',
  },

  { id:'emailEncaminhamientoTJ', icon:'⚖', title:'Encaminhamento de Expediente ao TJ (APF)',
    fields:[
      {id:'delpol',    label:'Delegacia',                             placeholder:'Ex: DELPOL DA COMARCA'},
      {id:'data', label:'Data', type:'date'},
      {id:'numAPF',    label:'Número do Auto de Prisão em Flagrante', placeholder:'Ex: AV0100-1/2026'},
      {id:'natureza',  label:'Natureza(s)',                           placeholder:'Ex: Tráfico de Drogas, Associação'},
      {id:'indiciado', label:'Nome do indiciado',                     placeholder:'Ex: FULANO DE TAL'},
    ],
    generate:(f)=>`${f.delpol}, ${formatarDataExtenso(f.data)}\n\nPrezado(a),\n\nEncaminho expediente do auto de prisão em flagrante nº ${f.numAPF}, natureza(s): ${f.natureza}, indiciado: ${f.indiciado}.\n\nAtenciosamente,\nEscrivão de Polícia`,
    anexos:['Livro do APF','Capa do APF'],
    aviso:'Anexar o livro e a capa do APF.',
  },

  { id:'emailCaptura', icon:'🔒', title:'Captura de Procurado',
    fields:[
      {id:'delpol',   label:'Delegacia',             placeholder:'Ex: DELPOL DA COMARCA'},
      {id:'data',     label:'Data',                  type:'date'},
      {id:'nome',     label:'Nome do capturado',     placeholder:'Ex: FULANO DE TAL'},
      {id:'rg',       label:'RG',                    placeholder:'Ex: 00.000.000-0'},
      {id:'cpf',      label:'CPF',                   placeholder:'Ex: 000.000.000-00'},
      {id:'mandado',  label:'Mandado nº',            placeholder:'Ex: 0000001-00.2024.8.26.0000'},
      {id:'processo', label:'Processo nº',           placeholder:'Ex: 0000001-00.2024.8.26.0000'},
      {id:'orgao',    label:'Órgão judicial',        placeholder:'Ex: 1ª Vara Criminal da Comarca'},
    ],
    generate:(f)=>`${f.delpol}, ${formatarDataExtenso(f.data)}\n\nPrezados,\n\nPelo presente, comunico captura de procurado conforme informações processuais abaixo:\n\nNome: ${f.nome}\nRG: ${f.rg}\nCPF: ${f.cpf}\nMandado nº: ${f.mandado}\nProcesso nº: ${f.processo}\nÓrgão judicial: ${f.orgao}\n\nAtenciosamente,\nEscrivão de Polícia`,
    anexos:['Mandado de Prisão Cumprido','Boletim de Ocorrência','Requisição de IML','Ficha Clínica','Auto de Qualificação','DVC'],
    aviso:'',
  },

  { id:'emailRelevancia', icon:'📢', title:'Ocorrência de Relevância',
    fields:[
      {id:'delpol', label:'Delegacia',              placeholder:'Ex: DELPOL DA COMARCA'},
      {id:'data',   label:'Data',                  type:'date'},
      {id:'crime',  label:'Natureza da ocorrência', placeholder:'Ex: HOMICÍDIO DOLOSO'},
      {id:'numBO',  label:'Número do BO',           placeholder:'Ex: AV0100-1/2026'},
    ],
    generate:(f)=>`${f.delpol}, ${formatarDataExtenso(f.data)}\n\nExcelentíssimo Delegado de Polícia,\n\nPelo presente, comunico ocorrência de relevância versando sobre ${f.crime}, conforme boletim de ocorrência nº ${f.numBO}.\n\n[COPIAR E COLAR O BOLETIM DE OCORRÊNCIA INTEIRO AQUI — NÃO COLOCAR EM ANEXO]\n\nDelegado de Polícia`,
    anexos:[],
    aviso:'Copiar e colar o boletim de ocorrência inteiro no corpo da mensagem. NÃO colocar em anexo.',
  },

  { id:'autorizacaoSangue', icon:'🩸', title:'Autorização — Coleta de Sangue (CONTRAN 432)',
    fields:[
      {id:'nome',    label:'Nome completo do autor',   placeholder:'Ex: FULANO DE TAL'},
      {id:'rg',      label:'RG',                       placeholder:'Ex: 00.000.000-0'},
      {id:'cidade',  label:'Cidade',                   placeholder:'Ex: Itu'},
    ],
    generate:(f) => {
      const hoje = new Date();
      const meses = ['janeiro','fevereiro','março','abril','maio','junho',
                     'julho','agosto','setembro','outubro','novembro','dezembro'];
      const dataExtenso = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
      return `AUTORIZAÇÃO PARA COLETA DE SANGUE
Resolução CONTRAN nº 432, de 23 de janeiro de 2013

Eu, ${f.nome}, RG ${f.rg}, estou sendo informado(a) de que fui flagrado(a) na condução de veículo automotor em via pública, sob suspeita de influência de álcool ou de outra substância psicoativa que cause dependência, conforme art. 306 do Código de Trânsito Brasileiro.

Nos termos da Resolução CONTRAN nº 432/2013, AUTORIZO a realização de exame clínico, incluindo a coleta de amostra de sangue para fins de dosagem alcoólica e/ou identificação de substâncias psicoativas.

Declaro que fui informado(a) de que:
- A recusa em submeter-se ao exame acarreta a penalidade prevista no art. 306, § 2º do CTB;
- Os resultados poderão ser utilizados como prova em processo administrativo e judicial;
- O exame será realizado por profissional de saúde habilitado.

${f.cidade}, ${dataExtenso}.


_____________________________________________
Assinatura do examinado(a)
${f.nome} — RG ${f.rg}


_____________________________________________
Assinatura da autoridade policial / médico responsável`;
    },
    anexos:[],
    aviso:'Data preenchida automaticamente com o dia de hoje. Imprimir em duas vias: uma para o examinado, uma para o processo.',
  },

  { id:'emailIML', icon:'🏥', title:'Encaminhamento ao IML — Exame Indireto',
    fields:[
      {id:'delpol', label:'Delegacia',               placeholder:'Ex: DELPOL DA COMARCA'},
      {id:'data', label:'Data', type:'date'},
      {id:'nome',   label:'Nome da pessoa',          placeholder:'Ex: FULANO DE TAL'},
      {id:'tipo',   label:'Tipo (preso / vítima)',   placeholder:'Ex: preso / vítima de lesão corporal'},
    ],
    generate:(f)=>`${f.delpol}, ${formatarDataExtenso(f.data)}\n\nPrezados,\n\nPelo presente, encaminho a ficha clínica de ${f.nome} (${f.tipo}) para realização do exame indireto, conforme requisição em anexo.\n\nAtenciosamente,\nEscrivão de Polícia`,
    anexos:['Ficha Clínica','Requisição de IML'],
    aviso:'Lesão corporal: enviar também fotos das lesões aparentes.',
  },

];

// ── TEMPLATES DE HISTÓRICO DE BO ──────────────────────────────
const TEMPLATES = {

  historicoCaptura: {
    title:'Histórico do BO — Captura de Procurado',
    fields:[
      {id:'tipoCondutor', label:'Tipo de condutor',         placeholder:'policial militar / guarda municipal'},
      {id:'numMandado',   label:'Número do mandado',        placeholder:'Ex: 0000001-00.2024.8.26.0000'},
      {id:'numProcesso',  label:'Número do processo',       placeholder:'Ex: 0000001-00.2024.8.26.0000'},
      {id:'vara',         label:'Vara / Juízo',             placeholder:'Ex: 1ª Vara Criminal da Comarca'},
      {id:'dataExpedicao',label:'Data de expedição',        placeholder:'Ex: 10/01/2025'},
      {id:'validade',     label:'Validade do mandado',      placeholder:'Ex: indeterminada'},
      {id:'tipoPrisao',   label:'Tipo de prisão',           placeholder:'Ex: preventiva / temporária / definitiva'},
    ],
    generate:(f)=>{
      const condutor = f.tipoCondutor || 'policial militar';
      return `Comparece o condutor, ${condutor} acima qualificado, noticiando que estava em patrulhamento com sua equipe quando realizou a abordagem do apresentado. Em consulta aos sistemas policiais, verificou-se que o indivíduo constava como procurado pela Justiça. Nada relacionado foi exibido para apreensão. O apresentado foi conduzido a esta unidade policial.\n\nJá nesta delegacia, em consulta aos sistemas, confirmou-se mandado de prisão em desfavor do conduzido, com os seguintes dados: mandado nº ${f.numMandado}, processo nº ${f.numProcesso}, ${f.vara}, expedido em ${f.dataExpedicao}, validade: ${f.validade}, modalidade: prisão ${f.tipoPrisao}.\n\nFace ao exposto, lavrou-se o presente boletim de ocorrência.`;
    }
  },

};
