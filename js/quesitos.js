/* ============================================================
   PLANTÃO CHECK — Quesitos Periciais
   Fonte: Manual de Quesitos — Polícia Civil SP
   ============================================================ */

const QUESITOS = [

  {
    id: 'homicidio',
    crime: 'Homicídio',
    artigo: 'Art. 121 CP',
    icon: '💀',
    grupos: [
      {
        nome: 'IML — Exame da vítima',
        itens: [
          'Houve morte?',
          'Qual a causa da morte?',
          'Qual o instrumento ou meio que produziu a morte?',
          'A morte foi produzida por veneno, fogo, explosivo, asfixia, tortura ou outro meio insidioso ou cruel, ou de que possa resultar perigo comum? (Resposta justificada)',
          'Foi a morte ocasionada por lesão corporal anterior que, por sua sede, foi sua causa eficiente?',
        ]
      },
      {
        nome: 'IC — Exame de local',
        itens: [
          'Qual a localização da área relacionada ao fato?',
          'O local relacionado ao fato está idôneo? É possível apontar a hora exata de chegada dos profissionais de segurança pública ao local?',
          'Houve socorro médico e quais disposições da cena do crime foram alteradas em função dos procedimentos médicos?',
          'Quais as características do local examinado?',
          'Quais as condições ambientais no momento da chegada ao local?',
          'É possível identificar data e horário em que se deram os eventos?',
          'É possível identificar o número de pessoas que participaram do evento?',
          'É possível identificar como foi a dinâmica do evento? Em caso positivo, qual foi?',
          'Foram encontrados no local objetos relacionados com a dinâmica do evento? Em caso positivo, quais?',
          'Existem vestígios no local que possam indicar a autoria do delito? Em caso positivo, quais?',
          'Na hipótese de existência de cadáver(es) no local, qual a descrição da(s) vítima(s) e sua(s) posição(ões) no ambiente? Quais as lesões encontradas quando do(s) exame(s) perinecroscópico(s)?',
          'É possível identificar, pelo exame do local, o provável emprego de veneno, fogo, explosivo, asfixia, tortura ou outro meio insidioso ou cruel?',
        ]
      },
    ],
    obs: 'Observações: 1) Coletar material subungueal; 2) Requisitar Exame Toxicológico; 3) Coletar DNA e vestígios biológicos; 4) Levantamento de impressões digitopapilares (AFIS); 5) Requisitar exame anatomopatológico; 6) Requisitar croqui; 7) Requisitar fotografação dos ferimentos.',
  },

  {
    id: 'feminicidio',
    crime: 'Feminicídio',
    artigo: 'Art. 121 §2º V CP',
    icon: '⚠',
    grupos: [
      {
        nome: 'IC — Exame de local e perinecroscópico',
        itens: [
          'Há indícios de autoria? Quais?',
          'Há vestígios que evidenciem qualquer vínculo entre vítima e autor? Quais?',
          'Como se deu a dinâmica dos fatos?',
          'Há vestígios que indiquem que houve violência sexual contra a vítima, tentada ou consumada? Quais?',
          'Há vestígios que indiquem que a vítima era submetida a exploração sexual ou de trabalho? Quais?',
          'Há vestígios que indiquem que a vítima era mantida em cárcere privado? Quais?',
          'Há vestígios que indiquem luta corporal entre vítima e agressor? Há lesões sugestivas de defesa da vítima? Quais?',
          'Há vestígios que sugiram desproporção de forças entre o agressor e vítima, impossibilitando-a de qualquer defesa?',
          'Há vestígios que indiquem que a vítima era submetida a relacionamento abusivo? Quais?',
          'Há vestígios que indiquem exteriorização por parte do agressor de ódio, menosprezo ou discriminação à mulher? Quais?',
          'Há vestígios indicativos de tortura, física ou psicológica? Quais?',
          'Há vestígios de danos a bens e objetos, ou violência a animais domésticos, aptos a potencialmente causar sofrimento físico e/ou psicológico à vítima (violência simbólica)? Quais?',
        ]
      },
      {
        nome: 'IML — Exame da vítima',
        itens: [
          'Há lesões antigas no corpo da vítima? Qual o tipo e instrumento causador? Quanto tempo têm as lesões?',
          'A vítima está grávida? A gravidez é aparente?',
          'Há vestígios de abortamento recente?',
          'Há vestígios de violência sexual? Qual tipo? Antes ou depois da morte? A violência sexual contribuiu de alguma forma para a morte da vítima?',
          'Há lesões que indiquem tortura ou sevícias de cunho sexual?',
          'Há lesões sugestivas de defesa?',
          'Há o uso de violência física excessiva, assim entendida aquela além da necessária para causar a morte?',
          'Possui doença sexualmente transmissível? Qual?',
          'O corpo estava vestido? Descrição das vestes em detalhes e fotografação.',
          'Em caso de morte por asfixia, qual a modalidade? Quais os achados que corroboram tal diagnóstico?',
          'Há lesões em couro cabeludo? Há área de alopecia ou evidência de arrancamento ou corte irregular dos cabelos?',
          'Coleta de material genético da própria vítima.',
          'Coleta de amostra biológica subungueal, anal, vaginal e oral; coleta de material biológico em pele, cabelo ou outro sítio, se houver.',
          'Exame toxicológico e dosagem alcoólica.',
        ]
      },
    ],
  },

  {
    id: 'lesao_corporal',
    crime: 'Lesão Corporal',
    artigo: 'Art. 129 CP',
    icon: '🩹',
    grupos: [
      {
        nome: 'IML — Exame inicial da vítima',
        itens: [
          'Houve ofensa à integridade corporal ou à saúde do examinando? (Resposta especificada)',
          'Qual o instrumento ou meio que produziu a ofensa?',
          'A ofensa foi produzida com emprego de veneno, fogo, explosivo, asfixia, tortura ou outro meio insidioso ou cruel? (Resposta justificada)',
          'Da ofensa resultou incapacidade para as ocupações habituais por mais de 30 dias?',
          'Da ofensa resultou debilidade permanente de membro, sentido ou função, incapacidade permanente para o trabalho, enfermidade incurável, perda ou inutilização de membro, sentido ou função, ou deformidade permanente? (Resposta justificada)',
        ]
      },
      {
        nome: 'IML — Lesão corporal grave (complementar)',
        itens: [
          'Da ofensa, objeto do exame de corpo de delito anterior, resultou ao examinando incapacidade para as ocupações habituais por mais de 30 dias?',
          'Dessa ofensa resultou perigo de vida, debilidade permanente de membro ou função, incapacidade permanente para o trabalho, enfermidade incurável, perda ou inutilização de membro, sentido ou função, ou debilidade permanente? (Resposta justificada)',
          'Dessa ofensa resultou aceleração de parto ou aborto? (Resposta justificada)',
        ]
      },
      {
        nome: 'IML — Lesão gravíssima',
        itens: [
          'Ocorreu incapacidade permanente para o trabalho?',
          'A enfermidade é incurável?',
          'Ocorreu perda ou inutilização de membro, sentido ou função?',
          'Ocorreu deformidade permanente?',
          'Ocorreu aceleração de parto?',
        ]
      },
    ],
  },

  {
    id: 'estupro',
    crime: 'Estupro',
    artigo: 'Art. 213 CP',
    icon: '🔴',
    grupos: [
      {
        nome: 'IML — Exame da vítima',
        itens: [
          'Houve conjunção carnal ou prática de outro ato libidinoso?',
          'Qual a data provável da conjunção carnal ou outro ato libidinoso?',
          'Sendo positivo o 1º quesito, em que consistiu?',
          'Apresenta lesão corporal?',
          'Qual o meio empregado?',
          'Da violência resultou para o(a) examinado(a) incapacidade para as ocupações habituais por mais de 30 dias, perigo de vida, debilidade permanente de membro, sentido ou função, aceleração do parto, incapacidade permanente para o trabalho, enfermidade incurável, perda ou inutilização de membro, sentido ou função, deformidade permanente ou aborto?',
          'É o(a) examinado(a) enfermo(a) ou portador(a) de deficiência mental?',
          'Houve qualquer outra causa que tivesse impossibilitado o(a) examinado(a) de reagir?',
        ]
      },
      {
        nome: 'IC — Exame de local',
        itens: [
          'Qual a localização da área relacionada ao fato?',
          'O local relacionado ao fato está idôneo?',
          'Quais as características do local examinado?',
          'É possível identificar como foi a dinâmica do evento? Em caso positivo, qual foi?',
          'Foram encontrados no local objetos relacionados à dinâmica do evento? Em caso positivo, quais?',
          'Existem vestígios no local que possam indicar a autoria do delito? Caso positivo, quais?',
          'Existem objetos/peças/vestígios no local que apontem como facilitador para o autor cometer o crime ("isca")? Caso positivo, quais?',
        ]
      },
      {
        nome: 'Laboratório — Exames biológicos',
        itens: [
          'Para suspeita de sêmen: Há presença de líquido seminal na peça submetida a análise?',
          'Para suspeita de sêmen: É possível confrontar através da análise de DNA os perfis genéticos encontrados nas peças encaminhadas e o material de referência do suspeito?',
          'Para suspeita de sangue: Há presença de sangue humano?',
          'Para suspeita de sangue: É possível confrontar através da análise de DNA os perfis genéticos encontrados?',
          'Para análise de pelos/cabelos: O material examinado tem característica de pelo/cabelo? Em caso positivo, trata-se de pelo humano?',
        ]
      },
    ],
    obs: 'Observação: analisar a possibilidade de requisitar exame toxicológico para a examinada.',
  },

  {
    id: 'estupro_vulneravel',
    crime: 'Estupro de Vulnerável',
    artigo: 'Art. 217-A CP',
    icon: '🔴',
    grupos: [
      {
        nome: 'IML — Exame da vítima',
        itens: [
          'Houve conjunção carnal?',
          'É virgem?',
          'Há vestígio de desvirginamento?',
          'Qual a data provável do desvirginamento?',
          'Houve coito anal?',
          'Qual a data provável do coito anal?',
          'Há lesão corporal ou outro vestígio de violência e, no caso afirmativo, qual o meio empregado? (Resposta justificada)',
          'Da violência resultou lesão corporal de natureza grave? (Resposta justificada)',
          'Da violência resultou a morte da vítima?',
          'A vítima é menor de 14 anos?',
          'A vítima tem idade entre 14 e 18 anos?',
          'A vítima é alienada ou débil mental? (Resposta justificada)',
          'Houve qualquer outra causa que impossibilitou a vítima de oferecer resistência? (Resposta justificada)',
        ]
      },
      {
        nome: 'IC — Exame de local',
        itens: [
          'Qual a localização da área relacionada ao fato?',
          'O local relacionado ao fato está idôneo?',
          'Quais as características do local examinado?',
          'É possível identificar como foi a dinâmica do evento? Em caso positivo, qual foi?',
          'Foram encontrados no local objetos relacionados à dinâmica do evento? Em caso positivo, quais?',
          'Existem vestígios no local que possam indicar a autoria do delito? Caso positivo, quais?',
        ]
      },
    ],
  },

  {
    id: 'roubo',
    crime: 'Roubo',
    artigo: 'Art. 157 CP',
    icon: '🔫',
    grupos: [
      {
        nome: 'IML — Exame da vítima',
        itens: [
          'Há lesão corporal, ou outro vestígio, indicando ter havido emprego de violência contra o(a) examinando(a)? (Resposta justificada)',
          'Há vestígios indicando ter havido emprego de qualquer outro meio para reduzir o(a) examinando(a) à impossibilidade de resistência?',
          'Qual o meio ou instrumento empregado?',
          'Da violência resultou lesão corporal de natureza grave? (Resposta justificada)',
          'Da violência resultou morte?',
        ]
      },
      {
        nome: 'IC — Exame de local',
        itens: [
          'Qual a natureza do local examinado?',
          'Qual o meio usado para o acesso a esse local: com destruição ou rompimento de obstáculo, ou mediante escalada, uso de chave falsa ou outro?',
          'Há, internamente, vestígios de destruição ou rompimento de obstáculo?',
          'Em que época se presume tenha ocorrido o fato?',
          'Houve emprego de instrumento ou instrumentos? Quais?',
          'Existiam vestígios, marcas, objetos, documentos ou outros que venham a permitir a futura identificação do autor ou autores?',
          'É possível comprovar a ocorrência da subtração de bens?',
          'É possível identificar o horário em que se deu o evento?',
          'É possível identificar o número de pessoas que participaram do evento?',
          'Para consecução do evento houve violência ou ameaça à vítima por meio de arma?',
          'A violência empregada pelo agente deu causa a lesão corporal ou morte da vítima?',
          'Durante o evento o agente manteve a vítima em seu poder, restringindo sua liberdade?',
          'É possível identificar como foi a dinâmica do evento?',
        ]
      },
    ],
  },

  {
    id: 'furto_qualificado',
    crime: 'Furto Qualificado',
    artigo: 'Art. 155 §4º CP',
    icon: '🕵',
    grupos: [
      {
        nome: 'IC — Exame de local (opção principal)',
        itens: [
          'Qual a natureza do local examinado?',
          'Qual o meio utilizado pelo indiciado para ter acesso ao local do crime: destruição ou rompimento de obstáculo, escalada, uso de chave falsa ou outro meio?',
          'Existem, internamente, no local do crime, vestígios de destruição ou rompimento de obstáculo ou teria ocorrido escalada, uso de chave falsa ou outro meio tendente à subtração da coisa?',
          'Em que época presume-se tenha ocorrido o fato criminoso?',
          'Houve emprego de instrumento(s)? Em caso positivo, qual(is)?',
          'Existem vestígios, marcas, objetos, documentos ou outros detalhes que venham a permitir a futura identificação do(s) autor(es)?',
        ]
      },
    ],
    obs: 'Observações: 1) Coletar DNA nos materiais, ferramentas e petrechos utilizados; 2) Coleta de material papiloscópico — pesquisa AFIS.',
  },

  {
    id: 'dano',
    crime: 'Dano',
    artigo: 'Art. 163 CP',
    icon: '🔨',
    grupos: [
      {
        nome: 'IC — Exame de local',
        itens: [
          'Houve destruição, inutilização ou deterioração da coisa submetida a exame? Qual a extensão do dano? (Resposta justificada)',
          'Qual o meio e quais os instrumentos empregados?',
          'Houve emprego de substância inflamável ou explosiva?',
        ]
      },
      {
        nome: 'IC — Dano qualificado',
        itens: [
          'Qual a extensão dos danos produzidos pela ação criminosa?',
          'Quais os objetos ou instrumentos que os produziram?',
        ]
      },
    ],
  },

  {
    id: 'homicidio_culposo_transito',
    crime: 'Homicídio / Lesão Culposa no Trânsito',
    artigo: 'Arts. 302–303 CTB',
    icon: '🚗',
    grupos: [
      {
        nome: 'IC — Exame de local de acidente',
        itens: [
          'Houve acidente? Se sim, qual a sua natureza?',
          'É possível especificar a data e hora aproximada em que ocorreu o acidente?',
          'O local encontrava-se preservado, alterado ou prejudicado? Se alterado, quais os motivos?',
          'Quais as características do local quanto à topografia, leito carroçável, pavimentação, sinalização e iluminação?',
          'Quais as condições climáticas na data e hora do fato?',
          'Qual foi o número de veículo(s) envolvido(s)? Quais as características e o estado de conservação?',
          'Algum defeito ou desgaste verificado no(s) veículo(s) pode ter concorrido para o acidente?',
          'Há marcas pneumáticas de frenagem no local ou em seus arredores? Quais as extensões e sentidos? É possível precisar a velocidade?',
          'Há cadáver(es) no local? Se sim, em que posição os corpos foram encontrados?',
          'É possível identificar como se deu a dinâmica do evento? Quais foram as causas determinantes e/ou concorrentes?',
          'É possível a elaboração de croqui detalhado do local do fato?',
        ]
      },
      {
        nome: 'IC — Vistoria de veículos',
        itens: [
          'Quais as características do veículo examinado?',
          'Esse veículo apresentava danos? Em caso afirmativo, onde se situavam? Quais as orientações desses danos?',
          'Como se apresentavam seus sistemas de segurança para o tráfego (freios, direção, alarme e iluminação)?',
          'Em que estado de conservação achavam-se os pneus desse veículo?',
        ]
      },
      {
        nome: 'IML — Embriaguez ao volante (Art. 306 CTB)',
        itens: [
          'O periciando encontra-se sob a influência de álcool ou de outra substância psicoativa que determine dependência?',
          'Em caso positivo, é possível apontar o tipo de droga e qual o efeito em seu organismo, bem como se causa dependência física ou psíquica?',
          'Estando o periciando sob influência, encontra-se com sua capacidade psicomotora alterada para a condução de veículo automotor?',
          'É possível afirmar que a influência de álcool ou outra substância foi o que alterou a capacidade psicomotora do examinado?',
          'Qual o grau de embriaguez — se constatada — em que se encontrava o examinado na ocasião dos fatos?',
        ]
      },
    ],
  },

  {
    id: 'adulteracao_veiculo_quesitos',
    crime: 'Adulteração de Sinal de Veículo',
    artigo: 'Art. 311 CP',
    icon: '🚘',
    grupos: [
      {
        nome: 'IC — Exame de local',
        itens: [
          'Houve adulteração ou remarcação do número de chassi ou qualquer sinal identificador do veículo automotor, de seu componente ou equipamento, previstos nas resoluções do CONTRAN?',
          'Qual a identificação original do veículo?',
          'Confrontando-se o número do chassi, do motor e dos agregados do veículo com os números constantes na ficha de montagem fornecida pelo fabricante (carta-laudo), é possível afirmar que o veículo examinado corresponde ao da carta-laudo? Por quê?',
        ]
      },
    ],
  },

  {
    id: 'trafico_quesitos',
    crime: 'Tráfico de Drogas — Exame da Substância',
    artigo: 'Art. 33 Lei 11.343/06',
    icon: '💊',
    grupos: [
      {
        nome: 'IC — Exame provisório da substância',
        itens: [
          'Qual a natureza e quantidade da substância apresentada para exame? Qual o seu peso?',
          'A substância apresentada é proscrita no Brasil, de acordo com a Portaria ANVISA nº 344/1998 e atualizações (RDC)? Caso a resposta seja negativa, é possível identificá-la?',
        ]
      },
      {
        nome: 'IC — Exame definitivo da substância',
        itens: [
          'Qual a natureza e quantidade da substância apresentada para exame? Qual o seu peso?',
          'A substância apresentada é proscrita no Brasil, de acordo com a Portaria ANVISA nº 344/1998 e atualizações (RDC)?',
          'Identificada a substância, pode ser ela utilizada como matéria-prima, insumo ou produto químico destinado à preparação de drogas?',
        ]
      },
      {
        nome: 'IC — Exame de local',
        itens: [
          'O local encontra-se idôneo?',
          'Qual a espécie de local em que se encontrava(m) o(s) material(is) localizado(s)?',
          'O local é utilizado para cultivo, guarda ou depósito?',
          'É possível quantificar o material encontrado?',
          'No local há maquinário, aparelho ou instrumento destinado à fabricação ou preparação de drogas? Em caso positivo, quais?',
        ]
      },
    ],
  },

  {
    id: 'arma_fogo_quesitos',
    crime: 'Arma de Fogo — Exame Pericial',
    artigo: 'Lei 10.826/03',
    icon: '🔫',
    grupos: [
      {
        nome: 'IC — Exame de arma de fogo',
        itens: [
          'Qual a natureza, dimensões, calibre e demais características da arma apresentada para exame?',
          'Trata-se de arma de fogo? Em caso positivo, encontra-se carregada? Se sim, qual a natureza da munição?',
          'A arma de fogo apresentada sofreu algum tipo de adulteração em suas características originais? Se sim, qual(is)?',
          'Existem vestígios de supressão ou alteração da marca, numeração ou qualquer outro sinal de identificação? Se sim, onde estão localizados?',
          'É possível esclarecer qual a marca ou numeração da arma de fogo que foi removida?',
          'A arma de fogo questionada é eficiente para produzir disparos?',
          'No estado em que se encontra, poderia ter sido utilizada eficazmente para a realização de disparos?',
          'A arma de fogo apresenta vestígios produzidos por disparos recentes?',
        ]
      },
      {
        nome: 'IC — Exame de munição',
        itens: [
          'Quais as características (dimensões, calibre e outras) da munição examinada?',
          'A munição é compatível com qual(is) arma(s) de fogo?',
          'A munição é eficiente para produzir um tiro?',
          'A munição é íntegra?',
          'Houve percussão na espoleta?',
        ]
      },
      {
        nome: 'IC — Confronto balístico',
        itens: [
          'Quais as características das peças examinadas?',
          'De quais armas partiram os projéteis encaminhados para exame?',
          'Por quais armas foram percutidos os estojos/cartuchos picotados encaminhados para exame?',
          'No caso de não encaminhamento de armas de fogo, é possível estabelecer correlação com os projéteis/estojos encaminhados?',
        ]
      },
      {
        nome: 'IC — Residuográfico (resíduos de disparo)',
        itens: [
          'Pesquisa de resíduos de disparo de arma de fogo.',
        ]
      },
    ],
    obs: 'Observação: estudos mostram que a coleta do material residuográfico em pessoas vivas deve ocorrer em até quatro horas depois do disparo.',
  },

  {
    id: 'suicidio',
    crime: 'Suicídio',
    artigo: '',
    icon: '❓',
    grupos: [
      {
        nome: 'IC — Exame de local',
        itens: [
          'Qual a localização da área relacionada ao fato?',
          'O local relacionado ao fato está idôneo?',
          'Quais as características do local examinado?',
          'É possível identificar data e horário em que se deram os eventos?',
          'É possível identificar o número de pessoas que participaram do evento?',
          'Quais vestígios relacionados ao fato foram coletados? Quais as suas disposições no ambiente?',
          'Na hipótese de existência de cadáver(es) no local, qual a descrição da(s) vítima(s) e sua(s) posição(ões) no ambiente?',
          'É possível apontar se houve auxílio, instigação ou induzimento à vítima?',
        ]
      },
      {
        nome: 'IML — Exame da vítima',
        itens: [
          'Houve morte?',
          'Qual a causa da morte?',
          'Qual o instrumento ou meio que produziu a morte?',
          'A morte foi produzida por veneno, fogo, explosivo, asfixia, tortura ou outro meio insidioso ou cruel? (Resposta justificada)',
          'Foi a morte ocasionada por lesão corporal anterior que, por sua sede, foi sua causa eficiente?',
        ]
      },
    ],
  },

  {
    id: 'violencia_domestica_quesitos',
    crime: 'Violência Doméstica — Lesão Corporal',
    artigo: 'Art. 129 §9º CP + Lei 11.340/06',
    icon: '🏠',
    grupos: [
      {
        nome: 'IML — Exame da vítima',
        itens: [
          'Houve ofensa à integridade corporal ou à saúde do examinando?',
          'Qual o instrumento ou meio que produziu a ofensa?',
          'Da ofensa resultou incapacidade para as ocupações habituais por mais de 30 dias?',
          'Da ofensa resultou debilidade permanente de membro, sentido ou função?',
          'O fato ocorreu em contexto de violência doméstica e familiar?',
        ]
      },
      {
        nome: 'IC — Exame de local',
        itens: [
          'Qual a localização da área relacionada ao fato?',
          'O local relacionado ao fato está idôneo?',
          'Quais as características do local examinado?',
          'Existem vestígios de violência ou luta no local?',
          'Existem objetos ou instrumentos relacionados ao fato? Quais?',
          'Há vestígios indicativos de autoria?',
        ]
      },
    ],
  },

  {
    id: 'incendio',
    crime: 'Incêndio',
    artigo: 'Art. 250 CP',
    icon: '🔥',
    grupos: [
      {
        nome: 'IC — Exame de local',
        itens: [
          'Houve incêndio?',
          'Onde o fogo teve início?',
          'Qual a sua causa?',
          'Não sendo possível precisar sua causa, qual a mais provável?',
          'Qual o modo por que foi, ou parece ter sido produzido o incêndio?',
          'Qual o material que o produziu?',
          'Qual a natureza do edifício, construção ou das coisas incendiadas?',
          'Do incêndio resultou perigo para a integridade física, para a vida ou para o patrimônio alheio?',
          'Houve perigo a um número indeterminado de pessoas?',
          'Houve vítima(s) de lesão corporal ou morte?',
          'Existem eventuais vestígios de objeto(s), produto(s) químico(s) ou material(is) explosivos utilizados na ação criminosa?',
          'Qual a extensão dos danos produzidos pelo incêndio?',
        ]
      },
    ],
  },

  {
    id: 'autópsia',
    crime: 'Autópsia — Exame Necroscópico',
    artigo: 'Arts. 162–166 CPP',
    icon: '🏥',
    grupos: [
      {
        nome: 'IML — Quesitos complementares sobre cadáveres',
        itens: [
          'Qual o biotipo do cadáver?',
          'É possível descrever sua altura, peso, cor da pele, cor dos olhos, tipo e cor dos cabelos?',
          'O cadáver apresenta deformidades, cicatrizes e tatuagens?',
          'É possível determinar-se a idade do cadáver através de radiografia do punho, cotovelo e osso pélvico?',
          'Qual o número de dentes da hemi-arcada superior e inferior do cadáver?',
          'É possível a colheita de impressões digitais do examinado, para fins de identificação futura?',
          'Há no cadáver lesões corporais?',
          'Em caso positivo, qual a sua natureza?',
          'Há no cadáver lesões de defesa?',
          'Em caso afirmativo, onde se localizam?',
          'Qual a natureza dos instrumentos que produziram tais lesões?',
          'É possível precisar a data e horário em que se deu o evento morte?',
        ]
      },
    ],
  },

  {
    id: 'falsificacao_documento',
    crime: 'Falsificação de Documento',
    artigo: 'Arts. 297–298 CP',
    icon: '📄',
    grupos: [
      {
        nome: 'IC — Exame do objeto material',
        itens: [
          'Qual o documento apresentado a exame?',
          'O documento apresentado a exame é verdadeiro ou falso?',
          'Sendo falso, em que consistiu a falsificação?',
          'Sendo verdadeiro, foi alterado o documento?',
          'Em que consistiu a alteração?',
        ]
      },
      {
        nome: 'IC — Exames grafotécnicos',
        itens: [
          'É autêntica a assinatura lançada em nome do investigado no documento, tendo em vista os padrões de confronto fornecidos?',
          'Em caso de falsidade, é possível determinar sua autoria considerando os padrões de confronto fornecidos?',
          'Os dizeres manuscritos no documento emanaram do punho do investigado, que forneceu material gráfico para confronto?',
        ]
      },
    ],
  },

  {
    id: 'informatica',
    crime: 'Exames de Informática',
    artigo: 'Art. 175 CPP',
    icon: '💻',
    grupos: [
      {
        nome: 'IC — Exame em computadores, smartphones e mídias',
        itens: [
          'Na peça encaminhada para exame, existem arquivos relacionados com a natureza criminal? Se sim, identificá-los e, se possível, imprimi-los.',
          'Há registro(s) de produção do material questionado pelo dispositivo analisado? Quais?',
          'Há registro(s) de compartilhamento desse material? Em caso positivo, há registros de identificação dos envolvidos?',
        ]
      },
      {
        nome: 'IC — Exame em celulares',
        itens: [
          'Existem registros do(s) número(s) investigado(s) dentre as ligações recebidas/efetuadas pelo telefone celular encaminhado a exame?',
          'Existem registros do(s) número(s) ou do(s) nome(s) na agenda do telefone celular encaminhado a exame?',
          'Existem mensagens de texto que façam referência ao(s) número(s) ou nome(s) investigado(s)?',
          'Existem mensagens de texto que façam referência ao fato investigado? (Explicitar o fato na requisição)',
        ]
      },
    ],
    obs: 'Não são recomendados quesitos genéricos. Delimitar sempre o escopo da perícia: tipo de arquivo de interesse, período e palavras-chave relacionadas à ocorrência.',
  },

];
