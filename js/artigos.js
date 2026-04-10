/* ============================================================
   PLANTÃO CHECK — Jurisprudência e Referência Legal
   Artigos mais usados no plantão policial
   ============================================================ */

const ARTIGOS = [

  // ── FLAGRANTE E PRISÃO ────────────────────────────────────
  {
    id: 'flagrante',
    icon: '⛓',
    nome: 'Flagrante e Prisão em Geral',
    subtitulo: 'CPP — Arts. 301 a 310',
    itens: [
      {
        artigo: 'Art. 301 CPP',
        titulo: 'Quem pode prender em flagrante',
        texto: 'Qualquer do povo poderá e as autoridades policiais e seus agentes deverão prender quem quer que seja encontrado em flagrante delito.',
      },
      {
        artigo: 'Art. 302 CPP',
        titulo: 'Situações de flagrante',
        texto: 'Considera-se em flagrante delito quem: I — está cometendo a infração penal; II — acaba de cometê-la; III — é perseguido, logo após, pela autoridade, pelo ofendido ou por qualquer pessoa, em situação que faça presumir ser autor da infração; IV — é encontrado, logo depois, com instrumentos, armas, objetos ou papéis que façam presumir ser ele autor da infração.',
      },
      {
        artigo: 'Art. 303 CPP',
        titulo: 'Flagrante nas infrações permanentes',
        texto: 'Nas infrações permanentes, entende-se o agente em flagrante delito enquanto não cessar a permanência.',
      },
      {
        artigo: 'Art. 304 CPP',
        titulo: 'Lavratura do auto de prisão em flagrante',
        texto: 'Apresentado o preso à autoridade competente, ouvirá esta o condutor e colherá, se possível, a assinatura de duas testemunhas que hajam presenciado ou verificado a infração, e a seguir interrogará o acusado sobre a imputação que lhe é feita, colhendo, após cada oitiva, as respectivas assinaturas, lavrando, afinal, o auto.',
        destaque: true,
      },
      {
        artigo: 'Art. 306 CPP',
        titulo: 'Comunicação da prisão em flagrante',
        texto: 'A prisão de qualquer pessoa e o local onde se encontre serão comunicados imediatamente ao juiz competente, ao Ministério Público e à família do preso ou à pessoa por ele indicada. §1º Em até 24 horas após a realização da prisão, será encaminhado ao juiz competente o auto de prisão em flagrante.',
        destaque: true,
      },
      {
        artigo: 'Art. 310 CPP',
        titulo: 'Audiência de custódia',
        texto: 'Após receber o auto de prisão em flagrante, no prazo máximo de 24 horas após a realização da prisão, o juiz deverá promover audiência de custódia com a presença do acusado, seu advogado constituído ou membro da Defensoria Pública e o membro do Ministério Público.',
        destaque: true,
      },
    ]
  },

  // ── PRISÃO PREVENTIVA E TEMPORÁRIA ───────────────────────
  {
    id: 'preventiva',
    icon: '🔒',
    nome: 'Prisão Preventiva e Temporária',
    subtitulo: 'CPP arts. 311–316 + Lei 7.960/89',
    itens: [
      {
        artigo: 'Art. 311 CPP',
        titulo: 'Cabimento da preventiva',
        texto: 'Em qualquer fase da investigação policial ou do processo penal, caberá a prisão preventiva decretada pelo juiz, a requerimento do Ministério Público, do querelante ou do assistente, ou por representação da autoridade policial.',
      },
      {
        artigo: 'Art. 312 CPP',
        titulo: 'Requisitos da preventiva',
        texto: 'A prisão preventiva poderá ser decretada como garantia da ordem pública, da ordem econômica, por conveniência da instrução criminal ou para assegurar a aplicação da lei penal, quando houver prova da existência do crime e indício suficiente de autoria e de perigo gerado pelo estado de liberdade do imputado.',
        destaque: true,
      },
      {
        artigo: 'Art. 313 CPP',
        titulo: 'Cabimento nos crimes dolosos',
        texto: 'Nos termos do art. 312 deste Código, será admitida a decretação da prisão preventiva: I — nos crimes dolosos punidos com pena privativa de liberdade máxima superior a 4 (quatro) anos; II — se tiver sido condenado por outro crime doloso, em sentença transitada em julgado; III — se o crime envolver violência doméstica e familiar contra a mulher, criança, adolescente, idoso, enfermo ou pessoa com deficiência.',
      },
      {
        artigo: 'Art. 1º Lei 7.960/89',
        titulo: 'Prisão temporária — cabimento',
        texto: 'Caberá prisão temporária: I — quando imprescindível para as investigações do inquérito policial; II — quando o indiciado não tiver residência fixa ou não fornecer elementos necessários ao esclarecimento de sua identidade; III — quando houver fundadas razões de autoria ou participação do indiciado em crimes como: homicídio doloso, sequestro, roubo, extorsão, estupro, latrocínio, epidemia com resultado morte, envenenamento de água, tráfico de entorpecentes e outros.',
      },
      {
        artigo: 'Art. 2º Lei 7.960/89',
        titulo: 'Prazo da temporária',
        texto: 'A prisão temporária será decretada pelo juiz, em face da representação da autoridade policial ou de requerimento do MP, e terá o prazo de 5 dias, prorrogável por igual período em caso de extrema e comprovada necessidade. Para crimes hediondos e equiparados: 30 dias, prorrogável por mais 30.',
        destaque: true,
      },
    ]
  },

  // ── CRIMES SEXUAIS ────────────────────────────────────────
  {
    id: 'crimes_sexuais',
    icon: '⚠',
    nome: 'Crimes Sexuais',
    subtitulo: 'CP arts. 213–234-C + Lei 12.015/2009',
    destaque_categoria: true,
    itens: [
      {
        artigo: 'Art. 213 CP',
        titulo: 'Estupro',
        texto: 'Constranger alguém, mediante violência ou grave ameaça, a ter conjunção carnal ou a praticar ou permitir que com ele se pratique outro ato libidinoso. Pena: reclusão, de 6 a 10 anos. §1º Se da conduta resulta lesão corporal de natureza grave ou se a vítima é menor de 18 ou maior de 14 anos: pena de 8 a 12 anos. §2º Se da conduta resulta morte: pena de 12 a 30 anos.',
        destaque: true,
      },
      {
        artigo: 'Art. 217-A CP',
        titulo: 'Estupro de vulnerável',
        texto: 'Ter conjunção carnal ou praticar outro ato libidinoso com menor de 14 anos. Pena: reclusão, de 8 a 15 anos. §1º Incorre na mesma pena quem pratica essas ações com alguém que, por enfermidade ou deficiência mental, não tem o necessário discernimento para a prática do ato, ou que, por qualquer outra causa, não pode oferecer resistência.',
        destaque: true,
      },
      {
        artigo: 'Art. 218 CP',
        titulo: 'Corrupção de menores',
        texto: 'Induzir alguém menor de 14 anos a satisfazer a lascívia de outrem. Pena: reclusão, de 2 a 5 anos.',
      },
      {
        artigo: 'Art. 218-A CP',
        titulo: 'Satisfação de lascívia mediante presença de criança',
        texto: 'Praticar, na presença de alguém menor de 14 anos, ou induzi-lo a presenciar, conjunção carnal ou outro ato libidinoso, a fim de satisfazer lascívia própria ou de outrem. Pena: reclusão, de 2 a 4 anos.',
      },
      {
        artigo: 'Art. 218-B CP',
        titulo: 'Favorecimento da prostituição ou exploração sexual de vulnerável',
        texto: 'Submeter, induzir ou atrair à prostituição ou outra forma de exploração sexual alguém menor de 18 anos ou que, por enfermidade ou deficiência mental, não tem o necessário discernimento. Pena: reclusão, de 4 a 10 anos.',
      },
      {
        artigo: 'Art. 225 CP',
        titulo: 'Ação penal nos crimes sexuais',
        texto: 'Nos crimes definidos nos Capítulos I e II deste Título, procede-se mediante ação penal pública incondicionada. (Redação dada pela Lei 13.718/2018 — todos os crimes sexuais são agora de ação penal pública incondicionada.)',
        destaque: true,
      },
      {
        artigo: 'Art. 234-A CP',
        titulo: 'Causas de aumento nos crimes sexuais',
        texto: 'Nos crimes previstos neste Título a pena é aumentada: I — de metade, se o crime for cometido com o concurso de 2 ou mais pessoas; II — de um sexto até a metade, se o agente transmitir à vitima doença sexualmente transmissível de que sabe ou deveria saber ser portador; III — de metade, se o crime é praticado com o emprego de violência de natureza grave; IV — de 1/3, se o crime é praticado contra menor de 18 ou em situação de vulnerabilidade.',
      },
      {
        artigo: 'Art. 1º Lei 12.015/2009',
        titulo: 'Marco legal — crimes contra dignidade sexual',
        texto: 'A Lei 12.015/2009 unificou os crimes de atentado violento ao pudor e estupro no art. 213 CP, criou o estupro de vulnerável (art. 217-A) e transformou todos os crimes sexuais em ação penal pública incondicionada. Ponto prático: não é mais necessário representação da vítima — a autoridade policial deve agir de ofício.',
        destaque: true,
      },
      {
        artigo: 'Obs. operacional',
        titulo: 'Destinação do preso por crime sexual',
        texto: 'Preso com crime sexual (independente da natureza da ocorrência atual) deve: (1) ser colocado em cela separada dos demais presos; (2) ser encaminhado ao CDP específico para crimes sexuais. Verificar SEMPRE o DVC antes de destinar qualquer preso.',
        destaque: true,
      },
    ]
  },

  // ── VIOLÊNCIA DOMÉSTICA ───────────────────────────────────
  {
    id: 'maria_da_penha',
    icon: '🏠',
    nome: 'Violência Doméstica — Lei Maria da Penha',
    subtitulo: 'Lei 11.340/2006 — Arts. 5–24',
    itens: [
      {
        artigo: 'Art. 5º Lei 11.340/06',
        titulo: 'Conceito de violência doméstica',
        texto: 'Configura violência doméstica e familiar contra a mulher qualquer ação ou omissão baseada no gênero que lhe cause morte, lesão, sofrimento físico, sexual ou psicológico e dano moral ou patrimonial: I — no âmbito da unidade doméstica; II — no âmbito da família; III — em qualquer relação íntima de afeto, independentemente de coabitação.',
      },
      {
        artigo: 'Art. 7º Lei 11.340/06',
        titulo: 'Formas de violência doméstica',
        texto: 'São formas de violência doméstica: I — violência física; II — violência psicológica; III — violência sexual; IV — violência patrimonial (subtração, destruição de bens); V — violência moral (calúnia, difamação, injúria).',
      },
      {
        artigo: 'Art. 12 Lei 11.340/06',
        titulo: 'Obrigações da autoridade policial',
        texto: 'Em todos os casos de violência doméstica, a autoridade policial deverá: I — garantir proteção policial, quando necessário; II — encaminhar a ofendida ao hospital ou posto de saúde e ao IML; III — fornecer transporte para a ofendida e seus dependentes; IV — acompanhar a ofendida para assegurar a retirada de seus pertences do local.',
        destaque: true,
      },
      {
        artigo: 'Art. 16 Lei 11.340/06',
        titulo: 'Renúncia à representação',
        texto: 'Nas ações penais públicas condicionadas à representação, só será admitida a renúncia à representação perante o juiz, em audiência especialmente designada com tal finalidade, antes do recebimento da denúncia e ouvido o Ministério Público.',
      },
      {
        artigo: 'Art. 20 Lei 11.340/06',
        titulo: 'Prisão preventiva no âmbito doméstico',
        texto: 'Em qualquer fase do inquérito policial ou da instrução criminal, caberá a prisão preventiva do agressor, decretada pelo juiz, de ofício, a requerimento do MP ou mediante representação da autoridade policial.',
        destaque: true,
      },
      {
        artigo: 'Art. 22 Lei 11.340/06',
        titulo: 'Medidas protetivas de urgência ao agressor',
        texto: 'Constatada a prática de violência doméstica, o juiz poderá aplicar: I — suspensão da posse ou restrição do porte de armas; II — afastamento do lar, domicílio ou local de convivência com a ofendida; III — proibição de determinadas condutas (aproximação, contato, frequentar lugares); IV — restrição ou suspensão de visitas aos dependentes menores; V — prestação de alimentos provisionais.',
        destaque: true,
      },
      {
        artigo: 'Art. 24 Lei 11.340/06',
        titulo: 'Medidas protetivas patrimoniais',
        texto: 'Para a proteção patrimonial dos bens da sociedade conjugal ou daqueles de propriedade particular da mulher, o juiz poderá determinar: I — restituição de bens indevidamente subtraídos; II — proibição temporária para a celebração de atos e contratos de compra, venda e locação de propriedade em comum; III — suspensão das procurações conferidas pela ofendida ao agressor.',
      },
    ]
  },

  // ── TRÁFICO DE DROGAS ─────────────────────────────────────
  {
    id: 'trafico_drogas',
    icon: '💊',
    nome: 'Tráfico de Drogas',
    subtitulo: 'Lei 11.343/2006 — Arts. 28, 33–40',
    itens: [
      {
        artigo: 'Art. 28 Lei 11.343/06',
        titulo: 'Porte para uso pessoal',
        texto: 'Quem adquirir, guardar, tiver em depósito, transportar ou trouxer consigo, para consumo pessoal, drogas sem autorização ou em desacordo com determinação legal ou regulamentar será submetido a: I — advertência; II — prestação de serviços à comunidade; III — medida educativa. Obs.: não há prisão em flagrante pelo art. 28 — apenas lavratura de TCO.',
        destaque: true,
      },
      {
        artigo: 'Art. 33 Lei 11.343/06',
        titulo: 'Tráfico de drogas',
        texto: 'Importar, exportar, remeter, preparar, produzir, fabricar, adquirir, vender, expor à venda, oferecer, ter em depósito, transportar, trazer consigo, guardar, prescrever, ministrar, entregar a consumo ou fornecer drogas, ainda que gratuitamente, sem autorização ou em desacordo com determinação legal ou regulamentar. Pena: reclusão de 5 a 15 anos e pagamento de dias-multa.',
        destaque: true,
      },
      {
        artigo: 'Art. 33 §4º Lei 11.343/06',
        titulo: 'Tráfico privilegiado',
        texto: 'Nos delitos definidos no caput, as penas poderão ser reduzidas de 1/6 a 2/3, desde que o agente seja primário, de bons antecedentes, não se dedique às atividades criminosas nem integre organização criminosa.',
      },
      {
        artigo: 'Art. 35 Lei 11.343/06',
        titulo: 'Associação para o tráfico',
        texto: 'Associarem-se duas ou mais pessoas para o fim de praticar, reiteradamente ou não, qualquer dos delitos previstos nos arts. 33 caput e §1º e 34. Pena: reclusão, de 3 a 10 anos.',
      },
      {
        artigo: 'Art. 40 Lei 11.343/06',
        titulo: 'Causas de aumento',
        texto: 'As penas previstas nos arts. 33 a 37 são aumentadas de 1/6 a 2/3 quando: I — natureza, procedência da substância e circunstâncias do fato evidenciarem transnacionalidade; II — o agente praticar o crime com violência, grave ameaça, emprego de arma de fogo; III — em locais com restrição de capacidade — nas imediações de estabelecimentos de ensino, hospitais, sedes de entidades estudantis, sociais, culturais, recreativas, esportivas ou beneficentes, locais de trabalho coletivo, recintos onde se realizem espetáculos ou diversões de qualquer natureza, naves ou aeronaves, embarcações ou veículos de qualquer natureza; IV — em locais de detenção; V — em unidades militares; VI — nas condições de maior vulnerabilidade.',
      },
      {
        artigo: 'Art. 44 Lei 11.343/06',
        titulo: 'Tráfico — crime inafiançável e insuscetível de graça',
        texto: 'Os crimes previstos nos arts. 33, caput e §1º, e 34 a 37 desta Lei são inafiançáveis e insuscetíveis de sursis, graça, indulto, anistia e liberdade provisória, vedada a conversão de suas penas em restritivas de direitos.',
        destaque: true,
      },
    ]
  },

  // ── ESTATUTO DO DESARMAMENTO ──────────────────────────────
  {
    id: 'armas',
    icon: '🔫',
    nome: 'Armas de Fogo — Estatuto do Desarmamento',
    subtitulo: 'Lei 10.826/2003 — Arts. 12–17',
    itens: [
      {
        artigo: 'Art. 12 Lei 10.826/03',
        titulo: 'Posse irregular de arma de fogo de uso permitido',
        texto: 'Possuir ou manter sob sua guarda arma de fogo, acessório ou munição, de uso permitido, em desacordo com determinação legal ou regulamentar, no interior de sua residência ou dependência desta, ou, ainda, no seu local de trabalho, desde que seja o titular ou o responsável legal do estabelecimento ou empresa. Pena: detenção, de 1 a 3 anos, e multa.',
      },
      {
        artigo: 'Art. 14 Lei 10.826/03',
        titulo: 'Porte ilegal de arma de fogo de uso permitido',
        texto: 'Portar, deter, adquirir, fornecer, receber, ter em depósito, transportar, ceder, ainda que gratuitamente, emprestar, remeter, empregar, manter sob guarda ou ocultar arma de fogo, acessório ou munição, de uso permitido, sem autorização e em desacordo com determinação legal ou regulamentar. Pena: reclusão, de 2 a 4 anos, e multa.',
        destaque: true,
      },
      {
        artigo: 'Art. 15 Lei 10.826/03',
        titulo: 'Disparo de arma de fogo',
        texto: 'Disparar arma de fogo ou acionar munição em lugar habitado ou em suas adjacências, em via pública ou em direção a ela, desde que essa conduta não tenha como finalidade a prática de outro crime. Pena: reclusão, de 2 a 4 anos, e multa.',
        destaque: true,
      },
      {
        artigo: 'Art. 16 Lei 10.826/03',
        titulo: 'Porte de arma de uso restrito',
        texto: 'Possuir, deter, portar, adquirir, fornecer, receber, ter em depósito, transportar, ceder, emprestar, remeter, empregar, manter sob guarda ou ocultar arma de fogo, acessório ou munição de uso restrito, sem autorização e em desacordo com determinação legal ou regulamentar. Pena: reclusão, de 3 a 6 anos, e multa.',
        destaque: true,
      },
      {
        artigo: 'Art. 17 Lei 10.826/03',
        titulo: 'Comércio ilegal de arma de fogo',
        texto: 'Adquirir, alugar, receber, transportar, conduzir, ocultar, ter em depósito, desmontar, montar, remontar, adulterar, modificar ou fazer funcionar, sem autorização, qualquer arma de fogo. Pena: reclusão, de 6 a 12 anos, e multa.',
      },
    ]
  },

  // ── ECA — ATO INFRACIONAL ─────────────────────────────────
  {
    id: 'eca',
    icon: '👦',
    nome: 'ECA — Ato Infracional',
    subtitulo: 'Lei 8.069/90 — Arts. 103–109, 171–190',
    itens: [
      {
        artigo: 'Art. 103 ECA',
        titulo: 'Conceito de ato infracional',
        texto: 'Considera-se ato infracional a conduta descrita como crime ou contravenção penal.',
      },
      {
        artigo: 'Art. 106 ECA',
        titulo: 'Apreensão do adolescente',
        texto: 'Nenhum adolescente será privado de sua liberdade senão em flagrante de ato infracional ou por ordem escrita e fundamentada da autoridade judiciária competente.',
        destaque: true,
      },
      {
        artigo: 'Art. 107 ECA',
        titulo: 'Apresentação imediata',
        texto: 'A apreensão de qualquer adolescente e o local onde se encontra recolhido serão incontinenti comunicados à autoridade judiciária competente e à família do apreendido ou à pessoa por ele indicada.',
      },
      {
        artigo: 'Art. 108 ECA',
        titulo: 'Internação provisória',
        texto: 'A internação, antes da sentença, pode ser determinada pelo prazo máximo de 45 dias. Parágrafo único: a decisão deverá ser fundamentada e basear-se em indícios suficientes de autoria e materialidade, demonstrada a necessidade imperiosa da medida.',
      },
      {
        artigo: 'Art. 171 ECA',
        titulo: 'Curador na oitiva',
        texto: 'O adolescente apreendido por força de ordem judicial será, desde logo, encaminhado à autoridade judiciária. Nos casos de flagrante, a autoridade policial deverá: I — lavrar auto de apreensão; II — ouvir as testemunhas e o adolescente; III — proceder a reconhecimento de pessoas e coisas; IV — registrar eventuais lesões; V — providenciar as providências legais.',
        destaque: true,
      },
      {
        artigo: 'Art. 172 ECA',
        titulo: 'Comunicação ao responsável',
        texto: 'O adolescente apreendido em flagrante de ato infracional será, desde logo, liberado pela autoridade policial, mediante termo de compromisso e responsabilidade de seus pais ou responsável, quando se tratar de ato infracional cometido mediante violência ou grave ameaça à pessoa; nos demais casos é facultativa a internação provisória.',
      },
      {
        artigo: 'Art. 174 ECA',
        titulo: 'Oitiva com curador',
        texto: 'Comparecendo qualquer dos pais ou responsável, o adolescente será prontamente liberado pela autoridade policial, sob termo de compromisso e responsabilidade de sua apresentação ao representante do Ministério Público, no mesmo dia ou, sendo impossível, no primeiro dia útil imediato, exceto quando a infração for cometida com violência ou grave ameaça à pessoa.',
      },
    ]
  },

  // ── CRIMES DE TRÂNSITO ────────────────────────────────────
  {
    id: 'transito',
    icon: '🚗',
    nome: 'Crimes de Trânsito',
    subtitulo: 'CTB — Arts. 291–312',
    itens: [
      {
        artigo: 'Art. 291 CTB',
        titulo: 'Aplicabilidade do CPP',
        texto: 'Aos crimes cometidos na direção de veículos automotores, previstos neste Código, aplicam-se as normas gerais do Código Penal e do Código de Processo Penal, se este Código não dispuser de modo diverso, bem como a Lei 9.099/95, nos crimes de menor potencial ofensivo.',
      },
      {
        artigo: 'Art. 302 CTB',
        titulo: 'Homicídio culposo na direção de veículo',
        texto: 'Praticar homicídio culposo na direção de veículo automotor. Pena: detenção, de 2 a 4 anos. §1º Aumenta-se a pena de 1/3 à metade se o agente: I — não possuir habilitação; II — praticá-la em faixa de pedestres ou calçada; III — deixar de prestar socorro, quando possível fazê-lo; IV — no exercício de sua profissão ou atividade, estiver conduzindo veículo de transporte de passageiros.',
        destaque: true,
      },
      {
        artigo: 'Art. 303 CTB',
        titulo: 'Lesão corporal culposa na direção de veículo',
        texto: 'Praticar lesão corporal culposa na direção de veículo automotor. Pena: detenção, de 6 meses a 2 anos e suspensão ou proibição de se obter a permissão ou a habilitação para dirigir veículo automotor.',
      },
      {
        artigo: 'Art. 306 CTB',
        titulo: 'Embriaguez ao volante',
        texto: 'Conduzir veículo automotor com capacidade psicomotora alterada em razão da influência de álcool ou de outra substância psicoativa que determine dependência. §1º: Pena: detenção, de 6 meses a 3 anos, multa e suspensão ou proibição de se obter a permissão ou a habilitação. §2º: A penalidade prevista no §1º será aplicada ao motorista que se recusar a se submeter a qualquer dos procedimentos previstos.',
        destaque: true,
      },
      {
        artigo: 'Art. 308 CTB',
        titulo: 'Participação em racha',
        texto: 'Participar, na direção de veículo automotor, em via pública, de corrida, disputa ou competição automobilística não autorizada. Pena: detenção, de 6 meses a 3 anos, multa e suspensão ou proibição de se obter a permissão ou a habilitação. §2º: Se da prática da infração resultar lesão corporal de natureza grave: pena de reclusão, de 3 a 6 anos; se resultar morte: reclusão de 5 a 10 anos.',
      },
      {
        artigo: 'Art. 312 CTB',
        titulo: 'Fraude processual em acidente',
        texto: 'Inovar artificiosamente, na ocorrência de acidente de trânsito com vítima, o estado de lugar, de coisa ou de pessoa, a fim de induzir a erro o agente policial, o perito, ou juiz. Pena: detenção, de 6 meses a 1 ano, ou multa.',
      },
    ]
  },

  // ── OUTROS CRIMES FREQUENTES NO PLANTÃO ──────────────────
  {
    id: 'outros',
    icon: '📜',
    nome: 'Outros Crimes Frequentes',
    subtitulo: 'CP — Roubo, Furto, Lesão, Homicídio, Dano',
    itens: [
      {
        artigo: 'Art. 121 CP',
        titulo: 'Homicídio doloso',
        texto: 'Matar alguém. Pena: reclusão, de 6 a 20 anos. Qualificadoras mais comuns: motivo torpe (+), meio cruel (+), recurso que dificulte defesa (+), feminicídio (+). Privilégio: motivo de relevante valor moral ou logo após injusta provocação — redução de 1/6 a 1/3.',
        destaque: true,
      },
      {
        artigo: 'Art. 129 CP',
        titulo: 'Lesão corporal',
        texto: 'Ofender a integridade corporal ou a saúde de outrem. Pena: detenção, de 3 meses a 1 ano (leve). Grave: reclusão de 1 a 5 anos (incapacidade para ocupações por mais de 30 dias, perigo de vida, debilidade permanente). Gravíssima: reclusão de 2 a 8 anos (incapacidade permanente, deformidade permanente, perda ou inutilização de membro, sentido ou função). Seguida de morte: reclusão de 4 a 12 anos.',
      },
      {
        artigo: 'Art. 155 CP',
        titulo: 'Furto',
        texto: 'Subtrair, para si ou para outrem, coisa alheia móvel. Pena: reclusão, de 1 a 4 anos, e multa. §4º: Furto qualificado — com destruição de obstáculo, abuso de confiança, fraude, escalada, destreza, concurso de 2 ou mais pessoas — reclusão de 2 a 8 anos.',
      },
      {
        artigo: 'Art. 157 CP',
        titulo: 'Roubo',
        texto: 'Subtrair coisa móvel alheia, para si ou para outrem, mediante grave ameaça ou violência à pessoa. Pena: reclusão, de 4 a 10 anos, e multa. §2º: Roubo qualificado — arma, concurso de agentes, veículo automotor — reclusão de 5½ a 13 anos. §3º: Se da violência resultar lesão grave: 7 a 18 anos; se resultar morte (latrocínio): 20 a 30 anos.',
        destaque: true,
      },
      {
        artigo: 'Art. 163 CP',
        titulo: 'Dano',
        texto: 'Destruir, inutilizar ou deteriorar coisa alheia. Pena: detenção, de 1 a 6 meses, ou multa. Dano qualificado (§ único): emprego de substância inflamável ou explosiva, concurso de 2 ou mais pessoas, motivo egoístico ou prejuízo considerável — detenção, de 6 meses a 3 anos, e multa. Atenção: dano culposo não é crime.',
        destaque: true,
      },
      {
        artigo: 'Art. 168 CP',
        titulo: 'Apropriação indébita',
        texto: 'Apropriar-se de coisa alheia móvel, de que tem a posse ou a detenção. Pena: reclusão, de 1 a 4 anos, e multa.',
      },
      {
        artigo: 'Art. 171 CP',
        titulo: 'Estelionato',
        texto: 'Obter, para si ou para outrem, vantagem ilícita, em prejuízo alheio, induzindo ou mantendo alguém em erro, mediante artifício, ardil, ou qualquer outro meio fraudulento. Pena: reclusão, de 1 a 5 anos, e multa. Obs.: ação penal pública condicionada à representação, salvo vítima idosa, menor de 18 anos, vulnerável ou quando praticado contra entidade pública.',
      },
    ]
  },
];
