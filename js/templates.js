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
    title: 'Historico do BO - Captura de Procurado',
    fields: [
      { id: 'genero', label: 'Genero do(a) capturado(a)', type: 'select',
        options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }] },
      { id: 'nomeCompleto', label: 'Nome completo do(a) procurado(a)', placeholder: 'Ex: FULANO DE TAL' },
      { id: 'tipoCondutor', label: 'Tipo de condutor', type: 'select', options: [
        { value: 'policial militar', label: 'policial militar' },
        { value: 'policial civil',   label: 'policial civil'   },
        { value: 'guarda municipal', label: 'guarda municipal' },
      ]},
      { id: 'numMandado',    label: 'Numero do mandado',  placeholder: 'Ex: 0000001-00.2024.8.26.0000' },
      { id: 'numProcesso',   label: 'Numero do processo', placeholder: 'Ex: 0000001-00.2024.8.26.0000' },
      { id: 'vara',          label: 'Vara / Juizo',       placeholder: 'Ex: 1a Vara Criminal da Comarca' },
      { id: 'dataExpedicao', label: 'Data de expedicao',  placeholder: 'Ex: 10/01/2025' },
      { id: 'validade',      label: 'Validade',           placeholder: 'Ex: indeterminada' },
      { id: 'tipoPrisao',    label: 'Tipo de prisao',     placeholder: 'Ex: preventiva' },
      { id: 'nomeContato',   label: 'Nome do familiar',   placeholder: 'Ex: Maria da Silva' },
      { id: 'parentesco',    label: 'Parentesco',         placeholder: 'Ex: mae / esposa' },
      { id: 'telContato',    label: 'Telefone',           placeholder: 'Ex: (11) 99999-9999' },
    ],
    generate: function(f) {
      var masc = (f.genero || 'M') === 'M';
      var condutor  = f.tipoCondutor || 'policial militar';
      var nome      = f.nomeCompleto || '[NOME]';
      var pri       = nome.trim().split(' ')[0];
      var o_a       = masc ? 'o' : 'a';
      var conduzido = masc ? 'conduzido' : 'conduzida';
      var capturado = masc ? 'capturado' : 'capturada';
      var encaminh  = masc ? 'encaminhado' : 'encaminhada';
      var apresent  = masc ? 'apresentado' : 'apresentada';
      var est_a     = masc ? 'este' : 'esta';
      var cientif   = masc ? 'cientificado' : 'cientificada';
      return 'Comparece o condutor, ' + condutor + ' acima qualificado, noticiando que estava em patrulhamento com sua equipe quando realizou a abordagem d' + o_a + ' individu' + o_a + ' posteriormente identificad' + o_a + ' como ' + nome + '.\n\n' +
        'Em consulta aos sistemas policiais, verificou-se que ' + pri + ' constava como procurad' + o_a + ' pela Justica. Em revista pessoal, nada de ilicito foi encontrado, nao sendo nenhum objeto exibido para apreensao.\n\n' +
        'Diante dos fatos, ' + pri + ' foi ' + encaminh + ' a unidade de saude local para realizacao de avaliacao medica cautelar e, em seguida, ' + apresent + ' neste Plantao Policial para adocao das providencias de policia judiciaria.\n\n' +
        'Ja em solo policial, em consulta detalhada aos sistemas Analitico, Prodesp, Muralha Paulista e Infoseg, bem como ao Banco Nacional de Mandados de Prisao (BNMP), confirmou-se o mandado de prisao em desfavor d' + o_a + ' ' + conduzido + ', conforme numero ' + f.numMandado + ', processo ' + f.numProcesso + ', expedido pela ' + f.vara + ' em ' + f.dataExpedicao + ', com validade ate ' + f.validade + ', na modalidade: prisao ' + f.tipoPrisao + '.\n\n' +
        'Ressalte-se que foi feito contato com ' + f.nomeContato + ', ' + f.parentesco + ' d' + o_a + ' ' + capturado + ', pelo telefone ' + f.telContato + ', sendo ' + est_a + ' ' + cientif + ' de sua prisao, bem como do local onde se encontra.\n\n' +
        'Por fim, a autoridade policial determinou a lavratura do presente registro, procedendo-se as comunicacoes de praxe. Nada mais.';
    }
  },

  autorizacaoContato: {
    title: 'Autorizacao de Contato',
    fields: [
      { id: 'whatsapp', label: 'WhatsApp', placeholder: 'Ex: (11) 99999-9999', required: false },
      { id: 'email',    label: 'E-mail',   placeholder: 'Ex: nome@email.com',   required: false },
    ],
    generate: function(f) {
      var meios = [];
      if (f.whatsapp) meios.push('WhatsApp (' + f.whatsapp + ')');
      if (f.email)    meios.push('e-mail (' + f.email + ')');
      if (!meios.length) return '[Informe ao menos um meio de contato.]';
      var lista = meios.length === 2 ? meios[0] + ' e ' + meios[1] : meios[0];
      return 'A declarante autoriza que a Autoridade Policial e os demais agentes responsaveis pelo procedimento realizem contato por meio de ' + lista + ', para comunicacao sobre eventuais movimentacoes, intimacoes ou providencias relacionadas ao presente registro.';
    }
  },

  autorizacaoFotografias: {
    title: 'Autorizacao de Fotografias',
    fields: [],
    generate: function(f) {
      return 'A vitima declara possuir lesoes aparentes decorrentes dos fatos narrados e, neste ato, autoriza expressamente a fotografacao das referidas lesoes pelos agentes policiais, bem como o anexo das imagens ao presente procedimento, para fins de instrucao probatoria.';
    }
  },

  representacaoCriminal: {
    title: 'Representacao Criminal',
    fields: [
      { id: 'genero', label: 'Genero do(a) declarante', type: 'select',
        options: [{ value: 'F', label: 'Feminino' }, { value: 'M', label: 'Masculino' }] },
    ],
    generate: function(f) {
      var masc  = (f.genero || 'F') === 'M';
      var autor = masc ? 'o autor' : 'a autora';
      return (masc ? 'O' : 'A') + ' declarante manifesta, neste ato, de forma expressa e inequivoca, o desejo de representar criminalmente contra ' + autor + ' dos fatos narrados no presente registro, requerendo a adocao de todas as providencias legais cabiveis e o prosseguimento das investigacoes.';
    }
  },

  medidaProtetiva: {
    title: 'Medida Protetiva - Lei Maria da Penha',
    fields: [
      { id: 'medidas', label: 'Medidas requeridas (selecione uma ou mais)', type: 'multiselect',
        options: [
          { value: 'afastamento',    label: 'Afastamento do lar (art. 22, II)' },
          { value: 'aproximacao',    label: 'Proibicao de aproximacao (art. 22, III, a)' },
          { value: 'contato',        label: 'Proibicao de contato (art. 22, III, b)' },
          { value: 'lugares',        label: 'Proibicao de frequentar lugares (art. 22, III, c)' },
          { value: 'visitas',        label: 'Restricao de visitas (art. 22, IV)' },
          { value: 'armas',          label: 'Suspensao do porte de armas (art. 22, I)' },
          { value: 'alimentos',      label: 'Alimentos provisionais (art. 22, V)' },
          { value: 'reeducacao',     label: 'Programas de reeducacao (art. 22, VI)' },
          { value: 'protecao',       label: 'Programa de protecao (art. 23, I)' },
          { value: 'bens',           label: 'Restituicao de bens (art. 24, II)' },
          { value: 'venda',          label: 'Proibicao de venda de bens (art. 24, III)' },
          { value: 'acompanhamento', label: 'Acompanhamento para pertences (art. 23, III)' },
        ]
      },
    ],
    generate: function(f) {
      var medidas = f.medidas || [];
      if (!medidas.length) return '[Selecione ao menos uma medida protetiva.]';
      var map = {
        afastamento:    'afastamento do agressor do lar (art. 22, inciso II)',
        aproximacao:    'proibicao de se aproximar da vitima, de seus familiares e das testemunhas, com fixacao de limite minimo de distancia (art. 22, inciso III, alinea a)',
        contato:        'proibicao de contato com a vitima, seus familiares e testemunhas por qualquer meio de comunicacao (art. 22, inciso III, alinea b)',
        lugares:        'proibicao de frequentar determinados locais para preservar a integridade fisica e psicologica da vitima (art. 22, inciso III, alinea c)',
        visitas:        'restricao ou suspensao de visitas aos dependentes menores (art. 22, inciso IV)',
        armas:          'suspensao da posse ou restricao do porte de armas de fogo (art. 22, inciso I)',
        alimentos:      'prestacao de alimentos provisionais a vitima e/ou aos filhos (art. 22, inciso V)',
        reeducacao:     'comparecimento obrigatorio a programas de reeducacao e reabilitacao (art. 22, inciso VI)',
        protecao:       'encaminhamento da vitima e de seus dependentes a programas oficiais de protecao (art. 23, inciso I)',
        bens:           'determinacao de restituicao de documentos e bens indevidamente subtraidos (art. 24, inciso II)',
        venda:          'proibicao de alienacao ou disposicao de bens e valores comuns do casal (art. 24, inciso III)',
        acompanhamento: 'acompanhamento pela autoridade policial para retirada de pertences do lar (art. 23, inciso III)',
      };
      var lista = medidas.map(function(m, i) {
        var t = map[m] || m;
        return i === 0 ? t.charAt(0).toUpperCase() + t.slice(1) : t;
      });
      var fmt = lista.length === 1 ? lista[0] : lista.slice(0,-1).join('; ') + '; e ' + lista[lista.length-1];
      return 'A declarante requer, nos termos da Lei n. 11.340/2006 (Lei Maria da Penha), a concessao das seguintes medidas protetivas de urgencia: ' + fmt + '. Requer, ainda, que as presentes medidas sejam comunicadas ao Ministerio Publico e submetidas a apreciacao do Juizo competente com a maxima urgencia.';
    }
  },

  lavraturaTermoCircunstanciado: {
    title: 'Lavratura de TCO',
    fields: [
      { id: 'qtd', label: 'Quantas pessoas assinarao o termo?', type: 'select',
        options: [{ value: '1', label: '1 pessoa' }, { value: 'N', label: 'Mais de 1 pessoa' }]
      },
    ],
    generate: function(f) {
      var plural    = (f.qtd || '1') === 'N';
      var envolvido = plural ? 'Os envolvidos' : 'O(a) envolvido(a)';
      var assinou   = plural ? 'assinaram' : 'assinou';
      var intimados = plural ? 'intimados' : 'intimado(a)';
      var cientes   = plural ? 'cientes' : 'ciente';
      return 'Diante dos fatos expostos, a Autoridade Policial, reconhecendo a natureza de menor potencial ofensivo da infracao penal narrada, nos termos do art. 61 da Lei n. 9.099/1995 e do art. 69 do mesmo diploma legal, determinou a lavratura do presente Termo Circunstanciado de Ocorrencia, com o imediato encaminhamento das partes ao Juizado Especial Criminal competente. ' + envolvido + ' ' + assinou + ' o Termo de Compromisso de comparecimento perante o Juizado, assumindo a obrigacao de comparecer quando regularmente ' + intimados + ', ' + cientes + ' de que o descumprimento podera ensejar as providencias previstas no art. 71 da Lei n. 9.099/1995.';
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
    title: 'Vida Pregressa — art. 6°, IX, CPP',
    fields: [
      { id: 'genero', label: 'Gênero do(a) conduzido(a)', type: 'select',
        options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }] },
      { id: 'filhoLegitimo',    label: 'É filho legítimo?',           type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'teveTutores',      label: 'Teve tutores?',                  type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'viveuCompanhia',   label: 'Viveu em sua companhia?',        type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'escolas',          label: 'Frequentou escolas?',            placeholder: 'Ex: sim, quinta serie / nao / prej' },
      { id: 'toxicos',          label: 'Dá-se ao uso de bebidas alcoólicas ou outros tóxicos?', placeholder: 'Ex: sim, crack / nao' },
      { id: 'internado',        label: 'Já esteve internado em casa de tratamento de moléstias mentais?', type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'internacaoQuandoQual', label: 'Quais e quando? (internação)', placeholder: 'Ex: prej / Hospital X em 2020', required: false },
      { id: 'estadoCivil',      label: 'É casado, divorciado, separado ou unido estávelmente?', type: 'select',
        options: [{ value: 'nao', label: 'nao' }, { value: 'casado', label: 'casado' }, { value: 'divorciado', label: 'divorciado' }, { value: 'separado judicialmente', label: 'separado judicialmente' }, { value: 'unido estavelmente', label: 'unido estavelmente' }] },
      { id: 'vidaConjugal',     label: 'É harmônica ou não a vida conjugal?', type: 'select',
        options: [{ value: 'prej', label: 'prej' }, { value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'temFilhos',        label: 'Tem filhos?',                    type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'quantosFilhos',    label: 'Quantos e idade?',               placeholder: 'Ex: prej / 2, sendo um de 3 e outro de 7 anos', required: false },
      { id: 'filhosDeficiencia',label: 'O(s) filho(s) possui(em) algum tipo de deficiência?', type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }, { value: 'prej', label: 'prej' }] },
      { id: 'responsavelFilhos',label: 'Quem é o responsável pelo(s) filho(s)?', placeholder: 'Ex: prej / a mae / o pai', required: false },
      { id: 'ondeReside',       label: 'Onde reside?', type: 'select',
        options: [{ value: 'casa propria', label: 'casa própria' }, { value: 'aluguel', label: 'aluguel' }, { value: 'com familiares', label: 'com familiares' }, { value: 'abrigo', label: 'abrigo' }, { value: 'situacao de rua', label: 'situação de rua' }] },
      { id: 'habitacaoColetiva',label: 'Trata-se de habitação coletiva?', type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'ondeTrabalha',     label: 'Onde trabalha?',                 placeholder: 'Ex: prej / nome da empresa', required: false },
      { id: 'ocupacao',         label: 'Qual a ocupação que exerce?', placeholder: 'Ex: desempregado / pedreiro / vendedor' },
      { id: 'bensImoveis',      label: 'Possui bens imóveis?',       type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'bensImoveisQtd',   label: 'Quantos e qual o valor?',        placeholder: 'Ex: prej / 1, avaliado em R$ 200.000', required: false },
      { id: 'depositos',        label: 'Possui depósito em bancos, caixas econômicas, apólices?', type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'salario',          label: 'Se trabalha, quanto ganha?',     placeholder: 'Ex: prej / R$ 1.500,00 mensais', required: false },
      { id: 'desocupadoPorque', label: 'Se é desocupado, por quê?', placeholder: 'Ex: prej / foi demitido', required: false },
      { id: 'recebeAjuda',      label: 'Recebe ajuda de parentes, particulares ou instituições beneficentes?', type: 'select', options: [{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'nao' }] },
      { id: 'socorreAlguem',    label: 'Socorre alguém?',           placeholder: 'Ex: nao / sim, dois filhos' },
    ],
    generate: function(f) {
      var masc = (f.genero || 'M') === 'M';
      var cond = masc ? 'do conduzido' : 'da conduzida';

      function R(val) {
        var v = (val || '').trim();
        return v ? v.toUpperCase() : '[...]';
      }

      return 'Após, em obediência ao art. 6°, IX, do Código de Processo Penal, passou a autoridade a consignar elementos sobre a VIDA PREGRESSA ' + cond + ', nos seguintes termos: ' +
        'é filho legítimo? ' + R(f.filhoLegitimo) + '; ' +
        'teve tutores? ' + R(f.teveTutores) + '; ' +
        'viveu em sua companhia? ' + R(f.viveuCompanhia) + '; ' +
        'frequentou escolas? ' + R(f.escolas) + '; ' +
        'dá-se ' + (masc ? 'o indiciado' : 'a indiciada') + ' ao uso de bebidas alcoólicas ou de outros tóxicos? ' + R(f.toxicos) + '; ' +
        'já esteve internado em casa de tratamento de moléstias mentais ou congêneres? ' + R(f.internado) + '; ' +
        'quais e quando? ' + R(f.internacaoQuandoQual) + '; ' +
        'é casado, divorciado, separado judicialmente ou unido estávelmente? ' + R(f.estadoCivil) + '; ' +
        'é harmônica ou não a vida conjugal? ' + R(f.vidaConjugal) + '; ' +
        'tem filhos? ' + R(f.temFilhos) + '; ' +
        'quantos e idade? ' + R(f.quantosFilhos) + '; ' +
        'o(s) filho(s) possui(em) algum tipo de deficiência? ' + R(f.filhosDeficiencia) + '; ' +
        'quem é o responsável pelo(s) filho(s)? ' + R(f.responsavelFilhos) + '; ' +
        'onde reside? ' + R(f.ondeReside) + '; ' +
        'trata-se de habitação coletiva? ' + R(f.habitacaoColetiva) + '; ' +
        'onde trabalha? ' + R(f.ondeTrabalha) + '; ' +
        'qual a ocupação que exerce? ' + R(f.ocupacao) + '; ' +
        'possui bens imóveis? ' + R(f.bensImoveis) + '; ' +
        'quantos e qual o valor? ' + R(f.bensImoveisQtd) + '; ' +
        'possui depósito em bancos, caixas econômicas, apólices? ' + R(f.depositos) + '; ' +
        'se trabalha, quanto ganha? ' + R(f.salario) + '; ' +
        'se é desocupado, por quê? ' + R(f.desocupadoPorque) + '; ' +
        'recebe ajuda de parentes, particulares ou de instituições beneficentes? ' + R(f.recebeAjuda) + '; ' +
        'socorre alguém? ' + R(f.socorreAlguem);
    }
  },

};
