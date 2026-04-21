/* ============================================================
   PLANTÃO CHECK — Templates de Texto v3
   ============================================================ */

function formatarDataExtenso(iso) {
  if (!iso) return '[DATA]';
  const meses = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO',
                 'JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];
  const [ano, mes, dia] = iso.split('-');
  return parseInt(dia,10) + ' DE ' + meses[parseInt(mes,10)-1] + ' DE ' + ano;
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
    title: 'Histórico do BO — Captura de Procurado',
    fields: [
      { id: 'genero',       label: 'Gênero do(a) capturado(a)', type: 'select',
        options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }] },
      { id: 'nomeCompleto', label: 'Nome completo do(a) procurado(a)', placeholder: 'Ex: FULANO DE TAL' },
      { id: 'tipoCondutor', label: 'Tipo de condutor', type: 'select', options: [
        { value: 'policial militar',  label: 'policial militar'  },
        { value: 'policial civil',    label: 'policial civil'    },
        { value: 'guarda municipal',  label: 'guarda municipal'  },
      ]},
      { id: 'numMandado',   label: 'Número do mandado',  placeholder: 'Ex: 0000001-00.2024.8.26.0000' },
      { id: 'numProcesso',  label: 'Número do processo', placeholder: 'Ex: 0000001-00.2024.8.26.0000' },
      { id: 'vara',         label: 'Vara / Juízo',       placeholder: 'Ex: 1ª Vara Criminal da Comarca' },
      { id: 'dataExpedicao',label: 'Data de expedição',  placeholder: 'Ex: 10/01/2025' },
      { id: 'validade',     label: 'Validade do mandado',placeholder: 'Ex: indeterminada' },
      { id: 'tipoPrisao',   label: 'Tipo de prisão',     placeholder: 'Ex: preventiva / temporária / definitiva' },
      { id: 'nomeContato',  label: 'Nome do familiar/contato', placeholder: 'Ex: Maria da Silva' },
      { id: 'parentesco',   label: 'Parentesco',         placeholder: 'Ex: mãe / esposa / irmão' },
      { id: 'telContato',   label: 'Telefone do contato',placeholder: 'Ex: (11) 99999-9999' },
    ],
    generate: function(f) {
      var masc = (f.genero || 'M') === 'M';
      var condutor = f.tipoCondutor || 'policial militar';
      var nomeCompleto = f.nomeCompleto || '[NOME COMPLETO DO PROCURADO]';
      var primeiroNome = nomeCompleto.trim().split(' ')[0];
      var o_a       = masc ? 'o' : 'a';
      var conduzido = masc ? 'conduzido' : 'conduzida';
      var capturado = masc ? 'capturado' : 'capturada';
      var encaminh  = masc ? 'encaminhado' : 'encaminhada';
      var apresent  = masc ? 'apresentado' : 'apresentada';
      var est_a     = masc ? 'este' : 'esta';
      var cientif   = masc ? 'cientificado' : 'cientificada';

      return 'Comparece o condutor, ' + condutor + ' acima qualificado, noticiando que estava em patrulhamento com sua equipe quando realizou a abordagem d' + o_a + ' indivídu' + o_a + ' posteriormente identificad' + o_a + ' como ' + nomeCompleto + '.\n\n' +
        'Em consulta aos sistemas policiais, verificou-se que ' + primeiroNome + ' constava como procurad' + o_a + ' pela Justiça. Em revista pessoal, nada de ilícito foi encontrado, não sendo nenhum objeto exibido para apreensão.\n\n' +
        'Diante dos fatos, ' + primeiroNome + ' foi ' + encaminh + ' à unidade de saúde local para realização de avaliação médica cautelar e, em seguida, ' + apresent + ' neste Plantão Policial para adoção das providências de polícia judiciária.\n\n' +
        'Já em solo policial, em consulta detalhada aos sistemas Analítico, Prodesp, Muralha Paulista e Infoseg, bem como ao Banco Nacional de Mandados de Prisão (BNMP), confirmou-se o mandado de prisão em desfavor d' + o_a + ' ' + conduzido + ', conforme número ' + f.numMandado + ', processo ' + f.numProcesso + ', expedido pela ' + f.vara + ' em ' + f.dataExpedicao + ', com validade até ' + f.validade + ', na modalidade: prisão ' + f.tipoPrisao + '.\n\n' +
        'Ressalte-se que foi feito contato com ' + f.nomeContato + ', ' + f.parentesco + ' d' + o_a + ' ' + capturado + ', pelo telefone ' + f.telContato + ', sendo ' + est_a + ' ' + cientif + ' de sua prisão, bem como do local onde se encontra.\n\n' +
        'Por fim, a autoridade policial determinou a lavratura do presente registro, procedendo-se às comunicações de praxe. Nada mais.';
    }
  },

  autorizacaoContato: {
    title: 'Autorização de Contato',
    fields: [
      { id: 'whatsapp', label: 'Número de WhatsApp', placeholder: 'Ex: (11) 99999-9999', required: false },
      { id: 'email',    label: 'E-mail',              placeholder: 'Ex: nome@email.com',   required: false },
    ],
    generate: function(f) {
      var meios = [];
      if (f.whatsapp) meios.push('WhatsApp (' + f.whatsapp + ')');
      if (f.email)    meios.push('e-mail (' + f.email + ')');
      if (!meios.length) return '[Informe ao menos um meio de contato.]';
      var lista = meios.length === 2 ? meios[0] + ' e ' + meios[1] : meios[0];
      return 'A declarante autoriza que a Autoridade Policial e os demais agentes responsáveis pelo procedimento realizem contato por meio de ' + lista + ', para comunicação sobre eventuais movimentações, intimações ou providências relacionadas ao presente registro.';
    }
  },

  autorizacaoFotografias: {
    title: 'Autorização de Fotografias',
    fields: [],
    generate: function(f) {
      return 'A vítima declara possuir lesões aparentes decorrentes dos fatos narrados e, neste ato, autoriza expressamente a fotografação das referidas lesões pelos agentes policiais, bem como o anexo das imagens ao presente procedimento, para fins de instrução probatória.';
    }
  },

  representacaoCriminal: {
    title: 'Representação Criminal',
    fields: [
      { id: 'genero', label: 'Gênero do(a) declarante', type: 'select',
        options: [{ value: 'F', label: 'Feminino' }, { value: 'M', label: 'Masculino' }] },
    ],
    generate: function(f) {
      var masc = (f.genero || 'F') === 'M';
      var decl  = masc ? 'o declarante' : 'a declarante';
      var autor = masc ? 'o autor' : 'a autora';
      return (masc ? 'O' : 'A') + ' declarante manifesta, neste ato, de forma expressa e inequívoca, o desejo de representar criminalmente contra ' + autor + ' dos fatos narrados no presente registro, requerendo a adoção de todas as providências legais cabíveis e o prosseguimento das investigações.';
    }
  },

  medidaProtetiva: {
    title: 'Medida Protetiva — Lei Maria da Penha',
    fields: [
      { id: 'medidas', label: 'Medidas requeridas (selecione uma ou mais)', type: 'multiselect',
        options: [
          { value: 'afastamento',    label: 'Afastamento do lar (art. 22, II)' },
          { value: 'aproximacao',    label: 'Proibição de aproximação (art. 22, III, a)' },
          { value: 'contato',        label: 'Proibição de contato (art. 22, III, b)' },
          { value: 'lugares',        label: 'Proibição de frequentar lugares (art. 22, III, c)' },
          { value: 'visitas',        label: 'Restrição ou suspensão de visitas (art. 22, IV)' },
          { value: 'armas',          label: 'Suspensão do porte de armas (art. 22, I)' },
          { value: 'alimentos',      label: 'Prestação de alimentos provisionais (art. 22, V)' },
          { value: 'reeducacao',     label: 'Comparecimento a programas de reeducação (art. 22, VI)' },
          { value: 'protecao',       label: 'Encaminhamento a programa de proteção (art. 23, I)' },
          { value: 'bens',           label: 'Restituição de documentos e bens (art. 24, II)' },
          { value: 'venda',          label: 'Proibição de venda de bens comuns (art. 24, III)' },
          { value: 'acompanhamento', label: 'Acompanhamento para retirada de pertences (art. 23, III)' },
        ]
      },
    ],
    generate: function(f) {
      var medidas = f.medidas || [];
      if (!medidas.length) return '[Selecione ao menos uma medida protetiva.]';
      var map = {
        afastamento:    'afastamento do agressor do lar (art. 22, inciso II)',
        aproximacao:    'proibição de se aproximar da vítima, de seus familiares e das testemunhas, com fixação de limite mínimo de distância (art. 22, inciso III, alínea "a")',
        contato:        'proibição de contato com a vítima, seus familiares e testemunhas por qualquer meio de comunicação (art. 22, inciso III, alínea "b")',
        lugares:        'proibição de frequentar determinados locais para preservar a integridade física e psicológica da vítima (art. 22, inciso III, alínea "c")',
        visitas:        'restrição ou suspensão de visitas aos dependentes menores (art. 22, inciso IV)',
        armas:          'suspensão da posse ou restrição do porte de armas de fogo (art. 22, inciso I)',
        alimentos:      'prestação de alimentos provisionais à vítima e/ou aos filhos (art. 22, inciso V)',
        reeducacao:     'comparecimento obrigatório a programas de reeducação e reabilitação (art. 22, inciso VI)',
        protecao:       'encaminhamento da vítima e de seus dependentes a programas oficiais de proteção (art. 23, inciso I)',
        bens:           'determinação de restituição de documentos e bens indevidamente subtraídos (art. 24, inciso II)',
        venda:          'proibição de alienação ou disposição de bens e valores comuns do casal (art. 24, inciso III)',
        acompanhamento: 'acompanhamento pela autoridade policial para retirada de pertences do lar (art. 23, inciso III)',
      };
      var lista = medidas.map(function(m, i) {
        var texto = map[m] || m;
        if (i === 0) return texto.charAt(0).toUpperCase() + texto.slice(1);
        return texto;
      });
      var listaFmt = lista.length === 1
        ? lista[0]
        : lista.slice(0, -1).join('; ') + '; e ' + lista[lista.length - 1];
      return 'A declarante requer, nos termos da Lei n.º 11.340/2006 (Lei Maria da Penha), a concessão das seguintes medidas protetivas de urgência: ' + listaFmt + '. Requer, ainda, que as presentes medidas sejam comunicadas ao Ministério Público e submetidas à apreciação do Juízo competente com a máxima urgência.';
    }
  },

  lavraturaTermoCircunstanciado: {
    title: 'Lavratura de Termo Circunstanciado',
    fields: [
      { id: 'qtd', label: 'Quantas pessoas assinarão o termo?', type: 'select',
        options: [
          { value: '1', label: '1 pessoa' },
          { value: 'N', label: 'Mais de 1 pessoa' },
        ]
      },
    ],
    generate: function(f) {
      var plural = (f.qtd || '1') === 'N';
      var envolvido  = plural ? 'Os envolvidos' : 'O(a) envolvido(a)';
      var assinou    = plural ? 'assinaram' : 'assinou';
      var intimados  = plural ? 'intimados' : 'intimado(a)';
      var cientes    = plural ? 'cientes' : 'ciente';
      return 'Diante dos fatos expostos, a Autoridade Policial, reconhecendo a natureza de menor potencial ofensivo da infração penal narrada, nos termos do art. 61 da Lei n.º 9.099/1995 e do art. 69 do mesmo diploma legal, determinou a lavratura do presente Termo Circunstanciado de Ocorrência, com o imediato encaminhamento das partes ao Juizado Especial Criminal competente. ' + envolvido + ' ' + assinou + ' o Termo de Compromisso de comparecimento perante o Juizado, assumindo a obrigação de comparecer quando regularmente ' + intimados + ', ' + cientes + ' de que o descumprimento poderá ensejar as providências previstas no art. 71 da Lei n.º 9.099/1995.';
    }
  },

};
