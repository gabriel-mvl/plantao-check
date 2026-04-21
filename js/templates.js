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
const TEMPLATES = {

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
      var masc    = (f.genero || 'M') === 'M';
      var o_a     = masc ? 'o' : 'a';
      var do_da   = masc ? 'do' : 'da';
      var O_A     = masc ? 'O' : 'A';
      var nome    = f.nome || '[NOME DO DESAPARECIDO]';
      var pri     = nome.trim().split(' ')[0];
      var comunic = f.comunicanteNome ? f.comunicanteNome.trim().split(' ')[0] : 'o comunicante';
      var doc     = f.rg ? ', portador' + (masc ? '' : 'a') + ' do RG/CPF ' + f.rg : '';

      var p1 = 'Comparece nesta unidade policial ' + (f.comunicanteNome || '[COMUNICANTE]') + ', ' + (f.comunicanteParentesco || '[PARENTESCO]') + ' ' + do_da + ' desaparecid' + o_a + ', noticiando o desaparecimento de ' + nome + ', do sexo ' + (masc ? 'masculino' : 'feminino') + ', nascid' + o_a + ' em ' + (f.dataNasc || '[DATA DE NASCIMENTO]') + doc + '.';

      var sinais = f.sinais ? ' Apresenta os seguintes sinais particulares: ' + f.sinais + '.' : '';
      var p2 = O_A + ' desaparecid' + o_a + ' e descrit' + o_a + ' com aproximadamente ' + (f.altura || '[ALTURA]') + ' de altura, ' + (f.peso || '[PESO]') + ', cor da pele ' + (f.corPele || '[COR DA PELE]') + ', cabelo ' + (f.cabelo || '[CABELO]') + ', olhos ' + (f.olhos || '[OLHOS]') + '.' + sinais + ' No momento do desaparecimento, vestia ' + (f.vestimenta || '[VESTIMENTA]') + '.';

      var p3 = 'Segundo ' + comunic + ', ' + pri + ' foi vist' + o_a + ' pela ultima vez em ' + (f.ultimoLocal || '[LOCAL]') + ', em ' + (f.dataHora || '[DATA E HORA]') + ', quando ' + (f.ultimoContato || '[ULTIMO CONTATO]') + '. A saida mostrou-se ' + (f.saidaVoluntaria || 'em circunstancias nao esclarecidas') + '. Desde entao nao ha noticias do seu paradeiro.';

      var intencao = (f.intencaoSuicida && f.intencaoSuicida !== 'nao')
        ? ' Consta ainda que ' + pri + ' ' + f.intencaoSuicida + ' anteriormente ao desaparecimento.' : '';
      var suspeito = f.suspeito
        ? ' O comunicante apontou ' + f.suspeito + ' como pessoa com quem ' + pri + ' mantinha relacionamento conflituoso.' : '';
      var desBefore = (f.desapareceuAntes && f.desapareceuAntes !== 'nao')
        ? pri + ' ja desapareceu anteriormente, ' + f.desapareceuAntes + '.'
        : pri + ' nunca havia desaparecido anteriormente.';
      var p4 = 'O comunicante informou que ' + pri + ' ' + (f.transtornoMental || 'nao apresenta historico conhecido de transtorno mental ou uso de substancias psicoativas') + '. Informou ainda que ' + desBefore + ' Quanto a situacao pessoal recente, ' + (f.conflitos || 'nao havia conflitos conhecidos') + '. Relatou que ' + (f.ameacas || 'nao havia relatos de ameacas ou violencia domestica') + '.' + intencao + suspeito;

      var meios = [];
      if (f.celular)            meios.push('celular: ' + f.celular);
      if (f.redesSociais)       meios.push('redes sociais: ' + f.redesSociais);
      if (f.veiculo)            meios.push('veiculo: ' + f.veiculo);
      if (f.locaisFrequentados) meios.push('locais frequentados: ' + f.locaisFrequentados);
      var p5 = meios.length ? 'Para fins de localizacao, foram fornecidas as seguintes informacoes: ' + meios.join('; ') + '.' : '';

      var pFinal = 'Diante do exposto, a Autoridade Policial determinou a lavratura do presente boletim de ocorrencia, adotando-se as providencias legais cabiveis, incluindo o lancamento ' + do_da + ' desaparecid' + o_a + ' nos sistemas policiais competentes (SIGO/SCC/BNMP) e a comunicacao ao Ministerio Publico.';

      return [p1, p2, p3, p4, p5, pFinal].filter(Boolean).join('\n\n');
    }
  },

};
