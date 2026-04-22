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

var EMAIL_TEMPLATES = [

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

// -- TEMPLATES DE HISTORICO DE BO
var TEMPLATES = {

  historicoCaptura: {
    title: 'Hist\u00f3rico do BO \u2014 Captura de Procurado',
    fields: [
      { id: 'genero', label: 'G\u00eanero do(a) capturado(a)', type: 'select',
        options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }] },
      { id: 'nomeCompleto',  label: 'Nome completo do(a) procurado(a)', placeholder: 'Ex: FULANO DE TAL' },
      { id: 'tipoCondutor',  label: 'Tipo de condutor', type: 'select', options: [
          { value: 'policial militar', label: 'policial militar' },
          { value: 'policial civil',   label: 'policial civil'   },
          { value: 'guarda municipal', label: 'guarda municipal' },
        ]},
      { id: 'numMandado',    label: 'N\u00famero do mandado',   placeholder: 'Ex: 0000001-00.2024.8.26.0000' },
      { id: 'numProcesso',   label: 'N\u00famero do processo',  placeholder: 'Ex: 0000001-00.2024.8.26.0000' },
      { id: 'vara',          label: 'Vara / Ju\u00edzo',        placeholder: 'Ex: 1\u00aa Vara Criminal da Comarca' },
      { id: 'dataExpedicao', label: 'Data de expedi\u00e7\u00e3o', placeholder: 'Ex: 10/01/2025' },
      { id: 'validade',      label: 'Validade do mandado',      placeholder: 'Ex: indeterminada' },
      { id: 'tipoPrisao',    label: 'Tipo de pris\u00e3o',      placeholder: 'Ex: preventiva / tempor\u00e1ria / definitiva' },
      { id: 'nomeContato',   label: 'Nome do familiar/contato', placeholder: 'Ex: Maria da Silva' },
      { id: 'parentesco',    label: 'Parentesco',               placeholder: 'Ex: m\u00e3e / esposa / irm\u00e3o' },
      { id: 'telContato',    label: 'Telefone do contato',      placeholder: 'Ex: (11) 99999-9999' },
    ],
    generate: function(f) {
      var masc     = (f.genero || 'M') === 'M';
      var condutor = f.tipoCondutor || 'policial militar';
      var nome     = f.nomeCompleto || '[NOME]';
      var pri      = nome.trim().split(' ')[0];
      var o_a      = masc ? 'o' : 'a';
      var pessoa_o_a = masc ? 'o indiv\u00edduo' : 'a pessoa';
      var conduzido = masc ? 'conduzido' : 'conduzida';
      var capturado = masc ? 'capturado' : 'capturada';
      var encaminh  = masc ? 'encaminhado' : 'encaminhada';
      var apresent  = masc ? 'apresentado' : 'apresentada';
      var est_a     = masc ? 'este' : 'esta';
      var cientif   = masc ? 'cientificado' : 'cientificada';
      return 'Comparece o condutor, ' + condutor + ' acima qualificado, noticiando que estava em patrulhamento com sua equipe quando realizou a abordagem de ' + pessoa_o_a + ' posteriormente identificad' + o_a + ' como ' + nome + '.\n\n' +
        'Em consulta aos sistemas policiais, verificou-se que ' + pri + ' constava como procurad' + o_a + ' pela Justi\u00e7a. Em revista pessoal, nada de il\u00edcito foi encontrado, n\u00e3o sendo nenhum objeto exibido para apreens\u00e3o.\n\n' +
        'Diante dos fatos, ' + pri + ' foi ' + encaminh + ' \u00e0 unidade de sa\u00fade local para realiza\u00e7\u00e3o de avalia\u00e7\u00e3o m\u00e9dica cautelar e, em seguida, ' + apresent + ' neste Plant\u00e3o Policial para ado\u00e7\u00e3o das provid\u00eancias de pol\u00edcia judici\u00e1ria.\n\n' +
        'J\u00e1 em solo policial, em consulta detalhada aos sistemas Anal\u00edtico, Prodesp, Muralha Paulista e Infoseg, bem como ao Banco Nacional de Mandados de Pris\u00e3o (BNMP), confirmou-se o mandado de pris\u00e3o em desfavor d' + o_a + ' ' + conduzido + ', conforme n\u00famero ' + f.numMandado + ', processo ' + f.numProcesso + ', expedido pela ' + f.vara + ' em ' + f.dataExpedicao + ', com validade at\u00e9 ' + f.validade + ', na modalidade: pris\u00e3o ' + f.tipoPrisao + '.\n\n' +
        'Ressalte-se que foi feito contato com ' + f.nomeContato + ', ' + f.parentesco + ' d' + o_a + ' ' + capturado + ', pelo telefone ' + f.telContato + ', sendo ' + est_a + ' ' + cientif + ' de sua pris\u00e3o, bem como do local onde se encontra.\n\n' +
        'Por fim, a autoridade policial determinou a lavratura do presente registro, procedendo-se \u00e0s comunica\u00e7\u00f5es de praxe. Nada mais.';
    }
  },

  autorizacaoContato: {
    title: 'Autoriza\u00e7\u00e3o de Contato',
    fields: [
      { id: 'whatsapp', label: 'N\u00famero de WhatsApp', placeholder: 'Ex: (11) 99999-9999', required: false },
      { id: 'email',    label: 'E-mail',                  placeholder: 'Ex: nome@email.com',   required: false },
    ],
    generate: function(f) {
      var meios = [];
      if (f.whatsapp) meios.push('WhatsApp (' + f.whatsapp + ')');
      if (f.email)    meios.push('e-mail (' + f.email + ')');
      if (!meios.length) return '[Informe ao menos um meio de contato.]';
      var lista = meios.length === 2 ? meios[0] + ' e ' + meios[1] : meios[0];
      return 'A declarante autoriza que a Autoridade Policial e os demais agentes respons\u00e1veis pelo procedimento realizem contato por meio de ' + lista + ', para comunica\u00e7\u00e3o sobre eventuais movimenta\u00e7\u00f5es, intima\u00e7\u00f5es ou provid\u00eancias relacionadas ao presente registro.';
    }
  },

  autorizacaoFotografias: {
    title: 'Autoriza\u00e7\u00e3o de Fotografias',
    fields: [],
    generate: function(f) {
      return 'A v\u00edtima declara possuir les\u00f5es aparentes decorrentes dos fatos narrados e, neste ato, autoriza expressamente a fotografa\u00e7\u00e3o das referidas les\u00f5es pelos agentes policiais, bem como o anexo das imagens ao presente procedimento, para fins de instru\u00e7\u00e3o probat\u00f3ria.';
    }
  },

  representacaoCriminal: {
    title: 'Representa\u00e7\u00e3o Criminal',
    fields: [
      { id: 'genero', label: 'G\u00eanero do(a) declarante', type: 'select',
        options: [{ value: 'F', label: 'Feminino' }, { value: 'M', label: 'Masculino' }] },
    ],
    generate: function(f) {
      var masc  = (f.genero || 'F') === 'M';
      var autor = masc ? 'o autor' : 'a autora';
      return (masc ? 'O' : 'A') + ' declarante manifesta, neste ato, de forma expressa e inequ\u00edvoca, o desejo de representar criminalmente contra ' + autor + ' dos fatos narrados no presente registro, requerendo a ado\u00e7\u00e3o de todas as provid\u00eancias legais cab\u00edveis e o prosseguimento das investiga\u00e7\u00f5es.';
    }
  },

  medidaProtetiva: {
    title: 'Medida Protetiva \u2014 Lei Maria da Penha',
    fields: [
      { id: 'medidas', label: 'Medidas requeridas (selecione uma ou mais)', type: 'multiselect',
        options: [
          { value: 'afastamento',    label: 'Afastamento do lar (art. 22, II)' },
          { value: 'aproximacao',    label: 'Proibi\u00e7\u00e3o de aproxima\u00e7\u00e3o (art. 22, III, a)' },
          { value: 'contato',        label: 'Proibi\u00e7\u00e3o de contato (art. 22, III, b)' },
          { value: 'lugares',        label: 'Proibi\u00e7\u00e3o de frequentar lugares (art. 22, III, c)' },
          { value: 'visitas',        label: 'Restri\u00e7\u00e3o de visitas (art. 22, IV)' },
          { value: 'armas',          label: 'Suspens\u00e3o do porte de armas (art. 22, I)' },
          { value: 'alimentos',      label: 'Alimentos provisionais (art. 22, V)' },
          { value: 'reeducacao',     label: 'Programas de reeduca\u00e7\u00e3o (art. 22, VI)' },
          { value: 'protecao',       label: 'Programa de prote\u00e7\u00e3o (art. 23, I)' },
          { value: 'bens',           label: 'Restitui\u00e7\u00e3o de bens (art. 24, II)' },
          { value: 'venda',          label: 'Proibi\u00e7\u00e3o de venda de bens (art. 24, III)' },
          { value: 'acompanhamento', label: 'Acompanhamento para pertin\u00eances (art. 23, III)' },
        ]
      },
    ],
    generate: function(f) {
      var medidas = f.medidas || [];
      if (!medidas.length) return '[Selecione ao menos uma medida protetiva.]';
      var map = {
        afastamento:    'afastamento do agressor do lar (art. 22, inciso II)',
        aproximacao:    'proibi\u00e7\u00e3o de se aproximar da v\u00edtima, de seus familiares e das testemunhas, com fixa\u00e7\u00e3o de limite m\u00ednimo de dist\u00e2ncia (art. 22, inciso III, al\u00ednea \u201ca\u201d)',
        contato:        'proibi\u00e7\u00e3o de contato com a v\u00edtima, seus familiares e testemunhas por qualquer meio de comunica\u00e7\u00e3o (art. 22, inciso III, al\u00ednea \u201cb\u201d)',
        lugares:        'proibi\u00e7\u00e3o de frequentar determinados locais para preservar a integridade f\u00edsica e psicol\u00f3gica da v\u00edtima (art. 22, inciso III, al\u00ednea \u201cc\u201d)',
        visitas:        'restri\u00e7\u00e3o ou suspens\u00e3o de visitas aos dependentes menores (art. 22, inciso IV)',
        armas:          'suspens\u00e3o da posse ou restri\u00e7\u00e3o do porte de armas de fogo (art. 22, inciso I)',
        alimentos:      'presta\u00e7\u00e3o de alimentos provisionais \u00e0 v\u00edtima e/ou aos filhos (art. 22, inciso V)',
        reeducacao:     'comparecimento obrigat\u00f3rio a programas de reeduca\u00e7\u00e3o e reabilita\u00e7\u00e3o (art. 22, inciso VI)',
        protecao:       'encaminhamento da v\u00edtima e de seus dependentes a programas oficiais de prote\u00e7\u00e3o (art. 23, inciso I)',
        bens:           'determina\u00e7\u00e3o de restitui\u00e7\u00e3o de documentos e bens indevidamente subtra\u00eddos (art. 24, inciso II)',
        venda:          'proibi\u00e7\u00e3o de aliena\u00e7\u00e3o ou disposi\u00e7\u00e3o de bens e valores comuns do casal (art. 24, inciso III)',
        acompanhamento: 'acompanhamento pela autoridade policial para retirada de pertin\u00eances do lar (art. 23, inciso III)',
      };
      var lista = medidas.map(function(m, i) {
        var t = map[m] || m;
        return i === 0 ? t.charAt(0).toUpperCase() + t.slice(1) : t;
      });
      var fmt = lista.length === 1 ? lista[0] : lista.slice(0,-1).join('; ') + '; e ' + lista[lista.length-1];
      return 'A declarante requer, nos termos da Lei n.\u00ba 11.340/2006 (Lei Maria da Penha), a concess\u00e3o das seguintes medidas protetivas de urg\u00eancia: ' + fmt + '. Requer, ainda, que as presentes medidas sejam comunicadas ao Minist\u00e9rio P\u00fablico e submetidas \u00e0 aprecia\u00e7\u00e3o do Ju\u00edzo competente com a m\u00e1xima urg\u00eancia.';
    }
  },

  lavraturaTermoCircunstanciado: {
    title: 'Lavratura de TCO',
    fields: [
      { id: 'qtd', label: 'Quantas pessoas assinar\u00e3o o termo?', type: 'select',
        options: [{ value: '1', label: '1 pessoa' }, { value: 'N', label: 'Mais de 1 pessoa' }]
      },
    ],
    generate: function(f) {
      var plural    = (f.qtd || '1') === 'N';
      var envolvido = plural ? 'Os envolvidos' : 'O(a) envolvido(a)';
      var assinou   = plural ? 'assinaram' : 'assinou';
      var intimados = plural ? 'intimados' : 'intimado(a)';
      var cientes   = plural ? 'cientes' : 'ciente';
      return 'Diante dos fatos expostos, a Autoridade Policial, reconhecendo a natureza de menor potencial ofensivo da infra\u00e7\u00e3o penal narrada, nos termos do art. 61 da Lei n.\u00ba 9.099/1995 e do art. 69 do mesmo diploma legal, determinou a lavratura do presente Termo Circunstanciado de Ocorr\u00eancia, com o imediato encaminhamento das partes ao Juizado Especial Criminal competente. ' + envolvido + ' ' + assinou + ' o Termo de Compromisso de comparecimento perante o Juizado, assumindo a obriga\u00e7\u00e3o de comparecer quando regularmente ' + intimados + ', ' + cientes + ' de que o descumprimento poder\u00e1 ensejar as provid\u00eancias previstas no art. 71 da Lei n.\u00ba 9.099/1995.';
    }
  },

  historicoDesaparecimento: {
    title: 'Historico do BO - Desaparecimento de Pessoa',
    fields: [
      { id: 'comunicanteNome',       label: 'Nome do comunicante',                     placeholder: 'Ex: MARIA DA SILVA' },
      { id: 'comunicanteParentesco', label: 'Parentesco com o desaparecido',            placeholder: 'Ex: mae / companheiro / amigo' },
      { id: 'comunicanteGenero', label: 'Genero do comunicante', type: 'select',
        options: [{ value: 'F', label: 'Feminino' }, { value: 'M', label: 'Masculino' }]
      },
      { id: 'genero', label: 'Genero do desaparecido', type: 'select',
        options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }]
      },
      { id: 'nome',      label: 'Nome completo do desaparecido', placeholder: 'Ex: FULANO DE TAL' },
      { id: 'dataNasc',  label: 'Data de nascimento',            placeholder: 'Ex: 01/01/1990' },
      { id: 'rg',        label: 'RG ou CPF',                     placeholder: 'Ex: 12.345.678-9', required: false },
      { id: 'altura',    label: 'Altura',                        placeholder: 'Ex: 1,70m' },
      { id: 'peso',      label: 'Peso aproximado',               placeholder: 'Ex: 70kg' },
      { id: 'corPele',   label: 'Cor da pele',                   placeholder: 'Ex: branca / parda / negra' },
      { id: 'cabelo',    label: 'Cabelo (cor e tipo)',            placeholder: 'Ex: preto, liso, curto' },
      { id: 'olhos',     label: 'Cor dos olhos',                 placeholder: 'Ex: castanhos' },
      { id: 'sinais',    label: 'Sinais particulares',           placeholder: 'Ex: tatuagem no braco, oculos', required: false },
      { id: 'vestimenta',label: 'Vestimenta no desaparecimento', placeholder: 'Ex: camiseta branca, calca jeans' },
      { id: 'dataHora',  label: 'Data e hora do desaparecimento',placeholder: 'Ex: 20/04/2026 as 14h' },
      { id: 'ultimoLocal',   label: 'Ultimo local onde foi visto',      placeholder: 'Ex: Rua X, bairro Y' },
      { id: 'ultimoContato', label: 'Ultimo contato (quem viu e como)', placeholder: 'Ex: a mae, quando saiu de casa a pe' },
      { id: 'saidaVoluntaria', label: 'Aparencia da saida', type: 'select', options: [
          { value: 'aparentemente voluntaria, sem sinais de coacao ou violencia', label: 'Aparentemente voluntaria' },
          { value: 'com indicios de coacao ou violencia',  label: 'Com indicios de coacao/violencia' },
          { value: 'em circunstancias nao esclarecidas',   label: 'Circunstancias nao esclarecidas' },
        ]
      },
      { id: 'transtornoMental', label: 'Historico de transtorno mental ou uso de substancias', type: 'select', options: [
          { value: 'nao apresenta historico conhecido de transtorno mental ou uso de substancias psicoativas', label: 'Nao' },
          { value: 'possui historico de transtorno mental',                                              label: 'Transtorno mental' },
          { value: 'possui historico de uso de substancias psicoativas',                                label: 'Uso de substancias' },
          { value: 'possui historico de transtorno mental e uso de substancias psicoativas',            label: 'Ambos' },
          { value: 'nao foi possivel confirmar historico de transtorno mental ou uso de substancias',   label: 'Nao informado' },
        ]
      },
      { id: 'desapareceuAntes', label: 'Ja desapareceu anteriormente?', type: 'select', options: [
          { value: 'nao', label: 'Nao' },
          { value: 'sim, tendo retornado voluntariamente',   label: 'Sim, retornou voluntariamente' },
          { value: 'sim, sendo localizado por terceiros',    label: 'Sim, localizado por terceiros' },
        ]
      },
      { id: 'conflitos', label: 'Conflitos recentes', type: 'select', options: [
          { value: 'nao havia conflitos conhecidos',                    label: 'Nao' },
          { value: 'havia conflitos familiares recentes',               label: 'Conflitos familiares' },
          { value: 'havia conflitos conjugais recentes',                label: 'Conflitos conjugais' },
          { value: 'havia dificuldades financeiras recentes',           label: 'Dificuldades financeiras' },
          { value: 'havia conflitos familiares e conjugais recentes',   label: 'Familiares e conjugais' },
        ]
      },
      { id: 'intencaoSuicida', label: 'Declaracao previa de intencao de se machucar ou sumir', type: 'select', options: [
          { value: 'nao', label: 'Nao' },
          { value: 'sim, tendo manifestado intencao de se machucar',   label: 'Sim - intencao de se machucar' },
          { value: 'sim, tendo manifestado intencao de desaparecer',   label: 'Sim - intencao de desaparecer' },
        ]
      },
      { id: 'ameacas', label: 'Ameacas ou violencia domestica', type: 'select', options: [
          { value: 'nao havia relatos de ameacas ou violencia domestica', label: 'Nao' },
          { value: 'havia relatos de ameacas por parte de terceiro',       label: 'Ameacas por terceiro' },
          { value: 'era vitima de violencia domestica',                    label: 'Violencia domestica' },
        ]
      },
      { id: 'suspeito',           label: 'Possivel envolvido',         placeholder: 'Ex: ex-companheiro Joao da Silva', required: false },
      { id: 'celular',            label: 'Celular e status',           placeholder: 'Ex: (11) 99999-9999 - chamando', required: false },
      { id: 'redesSociais',       label: 'Redes sociais',              placeholder: 'Ex: Instagram @fulano', required: false },
      { id: 'veiculo',            label: 'Veiculo proprio',            placeholder: 'Ex: Honda/Civic cinza, ABC1234', required: false },
      { id: 'locaisFrequentados', label: 'Locais frequentados',        placeholder: 'Ex: academia na Rua X', required: false },
    ],
    generate: function(f) {
      var masc      = (f.genero || 'M') === 'M';
      var cMasc     = (f.comunicanteGenero || 'F') === 'M';
      var o_a       = masc ? 'o' : 'a';
      var do_da     = masc ? 'do' : 'da';
      var O_A       = masc ? 'O' : 'A';
      var oc_ac     = cMasc ? 'O' : 'A';
      var declarante = cMasc ? 'o declarante' : 'a declarante';
      var cientif_c = cMasc ? 'cientificado' : 'cientificada';
      var nome      = f.nome || '[NOME DO DESAPARECIDO]';
      var pri       = nome.trim().split(' ')[0];
      var comunic   = f.comunicanteNome ? f.comunicanteNome.trim().split(' ')[0] : (cMasc ? 'o comunicante' : 'a comunicante');
      var doc       = f.rg ? ', portador' + (masc ? '' : 'a') + ' do RG/CPF ' + f.rg : '';

      // P1 — identificacao
      var p1 = 'Comparece nesta unidade policial ' + (f.comunicanteNome || '[COMUNICANTE]') + ', ' + (f.comunicanteParentesco || '[PARENTESCO]') + ' ' + do_da + ' desaparecid' + o_a + ', noticiando o desaparecimento de ' + nome + ', do sexo ' + (masc ? 'masculino' : 'feminino') + ', nascid' + o_a + ' em ' + (f.dataNasc || '[DATA DE NASCIMENTO]') + doc + '.';

      // P2 — descricao fisica
      var sinais = f.sinais ? ' Apresenta os seguintes sinais particulares: ' + f.sinais + '.' : '';
      var p2 = O_A + ' desaparecid' + o_a + ' \u00e9 descrit' + o_a + ' com aproximadamente ' + (f.altura || '[ALTURA]') + ' de altura, ' + (f.peso || '[PESO]') + ', cor da pele ' + (f.corPele || '[COR DA PELE]') + ', cabelo ' + (f.cabelo || '[CABELO]') + ', olhos ' + (f.olhos || '[OLHOS]') + '.' + sinais + ' No momento do desaparecimento, vestia ' + (f.vestimenta || '[VESTIMENTA]') + '.';

      // P3 — circunstancias
      var contato = f.ultimoContato || '[ULTIMO CONTATO]';
      var p3 = 'Segundo ' + comunic + ', ' + pri + ' foi vist' + o_a + ' pela \u00faltima vez em ' + (f.ultimoLocal || '[LOCAL]') + ', em ' + (f.dataHora || '[DATA E HORA]') + ', oportunidade em que ' + contato + '. A sa\u00edda mostrou-se ' + (f.saidaVoluntaria || 'em circunst\u00e2ncias n\u00e3o esclarecidas') + '. Desde ent\u00e3o n\u00e3o h\u00e1 not\u00edcias do seu paradeiro.';

      // P4 — contexto sensivel
      var intencaoMap = {
        'sim, tendo manifestado intencao de se machucar': 'havia manifestado inten\u00e7\u00e3o de se machucar anteriormente ao desaparecimento',
        'sim, tendo manifestado intencao de desaparecer': 'havia manifestado inten\u00e7\u00e3o de desaparecer anteriormente',
      };
      var intencao = (f.intencaoSuicida && f.intencaoSuicida !== 'nao' && intencaoMap[f.intencaoSuicida])
        ? ' Consta ainda que ' + pri + ' ' + intencaoMap[f.intencaoSuicida] + '.' : '';
      var suspeito = f.suspeito
        ? ' ' + oc_ac + ' comunicante apontou ' + f.suspeito + ' como pessoa com quem ' + pri + ' mantinha relacionamento conflituoso.' : '';
      var desMap = {
        'sim, tendo retornado voluntariamente': 'j\u00e1 havia desaparecido anteriormente, tendo retornado voluntariamente',
        'sim, sendo localizado por terceiros':  'j\u00e1 havia desaparecido anteriormente, tendo sido localizado por terceiros',
      };
      var desBefore = (f.desapareceuAntes && desMap[f.desapareceuAntes])
        ? pri + ' ' + desMap[f.desapareceuAntes] + '.'
        : pri + ' nunca havia desaparecido anteriormente.';
      var p4 = oc_ac + ' comunicante informou que ' + pri + ' ' + (f.transtornoMental || 'n\u00e3o apresenta hist\u00f3rico conhecido de transtorno mental ou uso de subst\u00e2ncias psicoativas') + '. Informou ainda que ' + desBefore + ' Quanto \u00e0 situa\u00e7\u00e3o pessoal recente, ' + (f.conflitos || 'n\u00e3o havia conflitos conhecidos') + '. Relatou que ' + (f.ameacas || 'n\u00e3o havia relatos de amea\u00e7as ou viol\u00eancia dom\u00e9stica') + '.' + intencao + suspeito;

      // P5 — meios de localizacao
      var meios = [];
      if (f.celular)            meios.push('celular: ' + f.celular);
      if (f.redesSociais)       meios.push('redes sociais: ' + f.redesSociais);
      if (f.veiculo)            meios.push('ve\u00edculo: ' + f.veiculo);
      if (f.locaisFrequentados) meios.push('locais frequentados: ' + f.locaisFrequentados);
      var p5 = meios.length ? 'Para fins de localiza\u00e7\u00e3o, foram fornecidas as seguintes informa\u00e7\u00f5es: ' + meios.join('; ') + '.' : '';

      // Paragrafos finais
      var pFinal1 = 'Diante do exposto, a Autoridade Policial determinou a lavratura do presente boletim de ocorr\u00eancia, determinando o lan\u00e7amento de ' + nome + ' nos sistemas policiais na condi\u00e7\u00e3o de pessoa desaparecida, bem como as demais comunica\u00e7\u00f5es de praxe.';
      var pFinal2 = 'Por fim, ' + declarante + ' foi ' + cientif_c + ' quanto \u00e0 necessidade de comparecer a uma unidade policial para registro de boletim de ocorr\u00eancia de \u201cencontro de pessoa\u201d na hip\u00f3tese de ' + o_a + ' desaparecid' + o_a + ' vir a ser localizado/a.';

      return [p1, p2, p3, p4, p5, pFinal1, pFinal2].filter(Boolean).join('\n\n')
    }
  },


  vidaPregressa: {
    title: 'Vida Pregressa \u2014 art. 6\u00ba, IX, CPP',
    fields: [
      { id: 'genero', label: 'G\u00eanero do(a) conduzido(a)', type: 'select',
        options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }] },
      { id: 'filhoLegitimo',    label: '\u00c9 filho leg\u00edtimo?',                type: 'radio', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }] },
      { id: 'teveTutores',      label: 'Teve tutores?',                         type: 'radio', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }] },
      { id: 'viveuCompanhia',   label: 'Viveu em sua companhia?',               type: 'radio', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }] },
      { id: 'escolas',          label: 'Frequentou escolas?',                   placeholder: 'Ex: sim, quinta s\u00e9rie / n\u00e3o / prejudicado' },
      { id: 'toxicos',          label: 'D\u00e1-se ao uso de bebidas alco\u00f3licas ou outros t\u00f3xicos?', placeholder: 'Ex: sim, crack / n\u00e3o' },
      { id: 'internado',        label: 'J\u00e1 esteve internado em casa de tratamento de mol\u00e9stias mentais?', type: 'radio', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }] },
      { id: 'internacaoQuandoQual', label: 'Quais e quando? (interna\u00e7\u00e3o)', placeholder: 'Ex: prejudicado / Hospital X em 2020', required: false },
      { id: 'estadoCivil',      label: 'Estado civil', type: 'select',
        options: [
          { value: 'solteiro',               label: 'solteiro'               },
          { value: 'casado',                 label: 'casado'                 },
          { value: 'separado de fato',       label: 'separado de fato'       },
          { value: 'separado judicialmente', label: 'separado judicialmente' },
          { value: 'divorciado',             label: 'divorciado'             },
          { value: 'unido estavelmente',     label: 'unido est\u00e1velmente'},
          { value: 'viuvo',                  label: 'vi\u00favo'             },
          { value: 'nao declarado',          label: 'n\u00e3o declarado'    },
        ] },
      { id: 'vidaConjugal',     label: '\u00c9 harm\u00f4nica ou n\u00e3o a vida conjugal?', type: 'radio',
        options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }, { value: 'prejudicado', label: 'prejudicado' }] },
      { id: 'temFilhos',        label: 'Tem filhos?', type: 'radio', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }] },
      { id: 'quantosFilhos',    label: 'Quantos e idade?', placeholder: 'Ex: prejudicado / 2, sendo um de 3 e outro de 7 anos', required: false },
      { id: 'filhosDeficiencia',label: 'O(s) filho(s) possui(em) algum tipo de defici\u00eancia?', type: 'radio',
        options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }, { value: 'prejudicado', label: 'prejudicado' }] },
      { id: 'responsavelFilhos',label: 'Quem \u00e9 o respons\u00e1vel pelo(s) filho(s)?', placeholder: 'Ex: prejudicado / a m\u00e3e / o pai', required: false },
      { id: 'ondeReside',       label: 'Onde reside?', type: 'select',
        options: [
          { value: 'casa propria',   label: 'casa pr\u00f3pria'   },
          { value: 'aluguel',        label: 'aluguel'             },
          { value: 'com familiares', label: 'com familiares'      },
          { value: 'abrigo',         label: 'abrigo'              },
          { value: 'situacao de rua',label: 'situa\u00e7\u00e3o de rua' },
        ] },
      { id: 'habitacaoColetiva',label: 'Trata-se de habita\u00e7\u00e3o coletiva?', type: 'radio', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }] },
      { id: 'ondeTrabalha',     label: 'Onde trabalha?', placeholder: 'Ex: prejudicado / nome da empresa', required: false },
      { id: 'ocupacao',         label: 'Qual a ocupa\u00e7\u00e3o que exerce?', placeholder: 'Ex: desempregado / pedreiro / vendedor' },
      { id: 'bensImoveis',      label: 'Possui bens im\u00f3veis?', type: 'radio', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }] },
      { id: 'bensImoveisQtd',   label: 'Quantos e qual o valor?', placeholder: 'Ex: prejudicado / 1, avaliado em R$ 200.000', required: false },
      { id: 'depositos',        label: 'Possui dep\u00f3sito em bancos, caixas econ\u00f4micas, ap\u00f3lices?', type: 'radio', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }] },
      { id: 'salario',          label: 'Se trabalha, quanto ganha?', placeholder: 'Ex: prejudicado / R$ 1.500,00 mensais', required: false },
      { id: 'desocupadoPorque', label: 'Se \u00e9 desocupado, por qu\u00ea?', placeholder: 'Ex: prejudicado / foi demitido', required: false },
      { id: 'recebeAjuda',      label: 'Recebe ajuda de parentes, particulares ou institui\u00e7\u00f5es beneficentes?', type: 'radio', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'n\u00e3o' }] },
      { id: 'socorreAlguem',    label: 'Socorre algu\u00e9m?', placeholder: 'Ex: n\u00e3o / sim, dois filhos' },
    ],
    generate: function(f) {
      var masc = (f.genero || 'M') === 'M';
      var cond = masc ? 'do conduzido' : 'da conduzida';
      function R(val) {
        var v = (val || '').trim();
        if (!v || v === 'prejudicado' || v === 'PREJUDICADO') return '[...]';
        return v.toUpperCase();
      }
      return 'Ap\u00f3s, em obedi\u00eancia ao art. 6\u00ba, IX, do C\u00f3digo de Processo Penal, passou a autoridade a consignar elementos sobre a VIDA PREGRESSA ' + cond + ', nos seguintes termos: ' +
        '\u00e9 filho leg\u00edtimo? ' + R(f.filhoLegitimo) + '; ' +
        'teve tutores? ' + R(f.teveTutores) + '; ' +
        'viveu em sua companhia? ' + R(f.viveuCompanhia) + '; ' +
        'frequentou escolas? ' + R(f.escolas) + '; ' +
        'd\u00e1-se ' + (masc ? 'o indiciado' : 'a indiciada') + ' ao uso de bebidas alco\u00f3licas ou de outros t\u00f3xicos? ' + R(f.toxicos) + '; ' +
        'j\u00e1 esteve internado em casa de tratamento de mol\u00e9stias mentais ou cong\u00eaneres? ' + R(f.internado) + '; ' +
        'quais e quando? ' + R(f.internacaoQuandoQual) + '; ' +
        '\u00e9 casado, divorciado, separado judicialmente ou unido est\u00e1velmente? ' + R(f.estadoCivil) + '; ' +
        '\u00e9 harm\u00f4nica ou n\u00e3o a vida conjugal? ' + R(f.vidaConjugal) + '; ' +
        'tem filhos? ' + R(f.temFilhos) + '; ' +
        'quantos e idade? ' + R(f.quantosFilhos) + '; ' +
        'o(s) filho(s) possui(em) algum tipo de defici\u00eancia? ' + R(f.filhosDeficiencia) + '; ' +
        'quem \u00e9 o respons\u00e1vel pelo(s) filho(s)? ' + R(f.responsavelFilhos) + '; ' +
        'onde reside? ' + (f.ondeReside === '__outros__' ? R(f.ondeResideOutros) : R(f.ondeReside)) + '; ' +
        'trata-se de habita\u00e7\u00e3o coletiva? ' + R(f.habitacaoColetiva) + '; ' +
        'onde trabalha? ' + R(f.ondeTrabalha) + '; ' +
        'qual a ocupa\u00e7\u00e3o que exerce? ' + R(f.ocupacao) + '; ' +
        'possui bens im\u00f3veis? ' + R(f.bensImoveis) + '; ' +
        'quantos e qual o valor? ' + R(f.bensImoveisQtd) + '; ' +
        'possui dep\u00f3sito em bancos, caixas econ\u00f4micas, ap\u00f3lices? ' + R(f.depositos) + '; ' +
        'se trabalha, quanto ganha? ' + R(f.salario) + '; ' +
        'se \u00e9 desocupado, por qu\u00ea? ' + R(f.desocupadoPorque) + '; ' +
        'recebe ajuda de parentes, particulares ou de institui\u00e7\u00f5es beneficentes? ' + R(f.recebeAjuda) + '; ' +
        'socorre algu\u00e9m? ' + R(f.socorreAlguem);
    }
  },

};
