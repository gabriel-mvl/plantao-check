/* ============================================================
   PLANTÃO CHECK — Quesitos Periciais (COMPLETO)
   Fonte: Manual de Quesitos — Polícia Civil SP
   ============================================================ */

const QUESITOS = [

  { id:'homicidio', crime:'Homicídio', artigo:'Art. 121 CP', icon:'💀',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Houve morte?','Qual a causa da morte?','Qual o instrumento ou meio que produziu a morte?','A morte foi produzida por veneno, fogo, explosivo, asfixia, tortura ou outro meio insidioso ou cruel, ou de que possa resultar perigo comum? (Resposta justificada)','Foi a morte ocasionada por lesão corporal anterior que, por sua sede, foi sua causa eficiente?'] },
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo? É possível apontar a hora exata de chegada dos profissionais de segurança pública ao local?','Houve socorro médico e quais disposições da cena do crime foram alteradas em função dos procedimentos médicos?','Quais as características do local examinado?','Quais as condições ambientais no momento da chegada ao local?','É possível identificar data e horário em que se deram os eventos?','É possível identificar o número de pessoas que participaram do evento?','É possível identificar como foi a dinâmica do evento? Em caso positivo, qual foi?','Foram encontrados no local objetos relacionados com a dinâmica do evento? Em caso positivo, quais?','Existem vestígios no local que possam indicar a autoria do delito? Em caso positivo, quais?','Na hipótese de existência de cadáver(es) no local, qual a descrição da(s) vítima(s) e sua(s) posição(ões) no ambiente? Quais as lesões encontradas quando do(s) exame(s) perinecroscópico(s)?','É possível identificar, pelo exame do local, o provável emprego de veneno, fogo, explosivo, asfixia, tortura ou outro meio insidioso ou cruel?'] },
      { nome:'IML — Exame de vítima de envenenamento (venefício)', itens:['Houve propinação de veneno por meio endógeno ou exógeno?','Qual o veneno ministrado à vítima?','O veneno ministrado foi de tal qualidade ou em dose que causasse a morte da vítima, ou que pudesse causá-la?','Não causando a morte, o veneno ministrado poderia produzir ou causar lesão corporal?','É possível identificar data e horário em que se deu o evento morte?'] },
    ],
    obs:'Observações: 1) Coletar material subungueal; 2) Requisitar Exame Toxicológico; 3) Coletar DNA e vestígios biológicos; 4) Levantamento de impressões digitopapilares (AFIS); 5) Requisitar exame anatomopatológico; 6) Requisitar croqui; 7) Requisitar fotografação dos ferimentos.',
  },

  { id:'feminicidio', crime:'Feminicídio', artigo:'Art. 121 §2º V CP', icon:'⚠',
    grupos:[
      { nome:'IC — Exame de local e perinecroscópico', itens:['Há indícios de autoria? Quais?','Há vestígios que evidenciem qualquer vínculo entre vítima e autor? Quais?','Como se deu a dinâmica dos fatos?','Há vestígios que indiquem que houve violência sexual contra a vítima, tentada ou consumada? Quais?','Há vestígios que indiquem que a vítima era submetida a exploração sexual ou de trabalho? Quais?','Há vestígios que indiquem que a vítima era mantida em cárcere privado? Quais?','Há vestígios que indiquem luta corporal entre vítima e agressor? Há lesões sugestivas de defesa da vítima? Quais?','Há vestígios que sugiram desproporção de forças entre o agressor e vítima, impossibilitando-a de qualquer defesa?','Há vestígios que indiquem que a vítima era submetida a relacionamento abusivo? Quais?','Há vestígios que indiquem exteriorização por parte do agressor de ódio, menosprezo ou discriminação à mulher? Quais?','Há vestígios indicativos de tortura, física ou psicológica? Quais?','Há vestígios de danos a bens e objetos, ou violência a animais domésticos, aptos a potencialmente causar sofrimento físico e/ou psicológico à vítima (violência simbólica)? Quais?'] },
      { nome:'IML — Exame da vítima', itens:['Há lesões antigas no corpo da vítima? Qual o tipo e instrumento causador? Quanto tempo têm as lesões?','A vítima está grávida? A gravidez é aparente?','Há vestígios de abortamento recente?','Há vestígios de violência sexual? Qual tipo? Antes ou depois da morte? A violência sexual contribuiu de alguma forma para a morte da vítima?','Há lesões que indiquem tortura ou sevícias de cunho sexual?','Há lesões sugestivas de defesa?','Há o uso de violência física excessiva, assim entendida aquela além da necessária para causar a morte?','Possui doença sexualmente transmissível? Qual?','Possui doença congênita ou adquirida que diminua a capacidade motora da vítima e diminua ou anule sua capacidade de defesa?','Se sofreu disparos de arma de fogo, qual o trajeto do(s) projétil(eis)? Qual(is) a(s) distância(s) do(s) disparo(s)?','O corpo estava vestido? Descrição das vestes em detalhes e fotografação.','Em caso de morte por asfixia, qual a modalidade? Quais os achados que corroboram tal diagnóstico?','Há lesões em couro cabeludo? Há área de alopecia ou evidência de arrancamento ou corte irregular dos cabelos?','A vítima apresenta implante de silicone? Em caso afirmativo, em quais regiões? Cirúrgico ou industrial?','Sendo a vítima de sexo biológico masculino, há características morfológicas femininas?','Há sinais de cirurgia genital? Descrever, em caso afirmativo.','Coleta de material genético do(s) feto(s), se a vítima estiver grávida.','Coleta de material genético da própria vítima.','Coleta de amostra biológica subungueal, anal, vaginal e oral; coleta de material biológico em pele, cabelo ou outro sítio, se houver.','Exame toxicológico e dosagem alcoólica.','Exame para constatação de lesões corporais em suspeitos, haja vista a possibilidade de terem sofrido lesões em eventual tentativa da vítima de se defender.'] },
    ],
  },

  { id:'suicidio', crime:'Suicídio', artigo:'', icon:'❓',
    grupos:[
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','É possível identificar data e horário em que se deram os eventos?','É possível identificar o número de pessoas que participaram do evento?','Quais vestígios relacionados ao fato foram coletados? Quais as suas disposições no ambiente?','Na hipótese de existência de cadáver(es) no local, qual a descrição da(s) vítima(s) e sua(s) posição(ões) no ambiente?','É possível apontar se houve auxílio, instigação ou induzimento à vítima?'] },
      { nome:'IML — Exame da vítima', itens:['Houve morte?','Qual a causa da morte?','Qual o instrumento ou meio que produziu a morte?','A morte foi produzida por veneno, fogo, explosivo, asfixia, tortura ou outro meio insidioso ou cruel? (Resposta justificada)','Foi a morte ocasionada por lesão corporal anterior que, por sua sede, foi sua causa eficiente?'] },
    ],
  },

  { id:'ossada', crime:'Encontro de Ossada', artigo:'', icon:'🦴',
    grupos:[
      { nome:'IML — Exame médico-legal', itens:['Encontra-se a ossada íntegra ou não?','A ossada encontra-se completa? Caso negativo, quais ossos foram localizados?','Trata-se de ossada humana?','Há sinais de morte violenta?','Tratando-se de local urbano ou rural, há ação de animais e roedores (lesões pós-morte)?','Há elementos que possibilitem determinar o sexo da vítima? Se sim, qual o sexo provável?'] },
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado? Trata-se de local ermo, com vegetação ou chão pirolado?','É possível identificar data e horário em que se deram os eventos?','Quais vestígios relacionados ao fato foram coletados? Quais as respectivas disposições no ambiente?'] },
      { nome:'DNA — Identificação de cadáveres', itens:['É possível estabelecer o vínculo genético familiar entre os materiais biológicos encaminhados (material de cadáver desconhecido e de possível familiar)?'] },
    ],
    obs:'Deve-se direcionar os familiares da provável vítima inicialmente para uma unidade do IML, onde serão feitas as triagens iniciais e as devidas coletas de materiais biológicos, mediante assinatura de termo de doação voluntária.',
  },

  { id:'infanticidio', crime:'Infanticídio', artigo:'Art. 123 CP', icon:'👶',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Houve morte?','Nasceu com vida?','Qual a causa?','Foi produzida por meio de veneno, fogo, explosivo, asfixia ou tortura, ou por outro meio insidioso ou cruel? (Resposta justificada)','A morte foi provocada por meios diretos ou indiretos?'] },
      { nome:'IML — Exame da autora', itens:['No momento do fato, encontrava-se a pericianda em estado puerperal?','Em caso positivo, qual o grau do puerpério e, se há sinais de patologia relacionada ao estado puerperal?','Caso a pericianda não apresente sinais de puerpério, é possível verificar se estava ela acometida de doença mental à época dos fatos?','Caso positivo, qual a doença?','A pericianda apresenta sinais de intoxicação exógena?'] },
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','Houve morte?','A morte ocorreu durante ou logo após o parto?','Qual instrumento ou meio que produziu a morte?','A morte foi produzida por meio de veneno, fogo, explosivo, asfixia, tortura ou por outro meio insidioso ou cruel?','Há no local vestígios que possam indicar alteração no estado psicológico/comportamental da mãe? Caso positivo, quais?'] },
    ],
  },

  { id:'feto', crime:'Encontro de Feto', artigo:'', icon:'🔍',
    grupos:[
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','Como foi encontrado o feto? Estava envolto em sacos ou recipientes?','Havia presença de cordão umbilical? Descrever tamanho, coloração e tipo de corte.','Havia placenta e sangue?','Existem outros objetos e/ou vestígios no local relacionados ao fato? Caso positivo, quais?','Existem no local vestígios que possam indicar a autoria do delito? Caso positivo, quais?','A análise dos vestígios permite indicar a tese de aborto espontâneo ou provocado? Resposta fundamentada.'] },
      { nome:'IML — Exame médico-legal', itens:['Há sinais de nascimento com vida?','É possível identificar o sexo e a idade gestacional do feto?','Havia presença de cordão umbilical? Descrever tamanho, coloração e tipo de corte.','Havia placenta e sangue?'] },
    ],
  },

  { id:'aborto', crime:'Aborto Provocado', artigo:'Arts. 124–127 CP', icon:'⚕',
    grupos:[
      { nome:'IML — Exame da vítima (Arts. 124–126)', itens:['Houve aborto?','Foi ele provocado?','Qual o meio de provocação?','Do aborto resultou para a examinada incapacidade para as ocupações habituais por mais de 30 dias ou perigo de vida, ou debilidade permanente de membro, sentido ou função, incapacidade permanente para o trabalho, ou enfermidade incurável, ou perda ou inutilização de membro, sentido ou função, ou deformidade permanente?','Era a provocação do aborto o único meio de salvar a vida da gestante?','É a gestante alienada ou débil mental?','Há indícios de gravidez e/ou parto recente?'] },
      { nome:'IML — Exame da vítima (Art. 126 parágrafo único)', itens:['A gestante é menor de 14 anos?','A gestante é alienada ou débil mental? Depende de exame psíquico.','Há lesão corporal ou qualquer outro vestígio indicando ter havido emprego de violência?'] },
      { nome:'IML — Exame cadavérico — aborto seguido de morte (Art. 127)', itens:['Houve morte?','Qual a sua causa?','Há sinais de gravidez da vítima?','Qual o agente ou instrumento que produziu a morte?','A morte da gestante sobreveio em consequência de aborto ou de meio empregado para provocá-lo?','Qual o meio empregado para provocação do aborto?','A morte foi precedida de provocação de aborto?'] },
    ],
  },

  { id:'lesao_corporal', crime:'Lesão Corporal', artigo:'Art. 129 CP', icon:'🩹',
    grupos:[
      { nome:'IML — Exame inicial da vítima', itens:['Houve ofensa à integridade corporal ou à saúde do examinando? (Resposta especificada)','Qual o instrumento ou meio que produziu a ofensa?','A ofensa foi produzida com emprego de veneno, fogo, explosivo, asfixia, tortura ou outro meio insidioso ou cruel? (Resposta justificada)','Da ofensa resultou incapacidade para as ocupações habituais por mais de 30 dias?','Da ofensa resultou debilidade permanente de membro, sentido ou função, incapacidade permanente para o trabalho, enfermidade incurável, perda ou inutilização de membro, sentido ou função, ou deformidade permanente? (Resposta justificada)'] },
      { nome:'IML — Lesão corporal grave (complementar)', itens:['Da ofensa, objeto do exame de corpo de delito anterior, resultou ao examinando incapacidade para as ocupações habituais por mais de 30 dias?','Dessa ofensa resultou perigo de vida, debilidade permanente de membro ou função, incapacidade permanente para o trabalho, enfermidade incurável, perda ou inutilização de membro, sentido ou função? (Resposta justificada)','Dessa ofensa resultou aceleração de parto ou aborto? (Resposta justificada)'] },
      { nome:'IML — Lesão gravíssima', itens:['Ocorreu incapacidade permanente para o trabalho?','A enfermidade é incurável?','Ocorreu perda ou inutilização de membro, sentido ou função?','Ocorreu deformidade permanente?','Ocorreu aceleração de parto?'] },
    ],
  },

  { id:'contagio_venereo', crime:'Perigo de Contágio Venéreo', artigo:'Art. 130 CP', icon:'🦠',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['O examinando está contagiado de moléstia venérea?','Qual a moléstia e onde está localizada?','O contágio resultou ou pode ter resultado de relações sexuais ou de qualquer ato libidinoso?','A moléstia é a mesma de que está contaminado o indiciado?'] },
      { nome:'IML — Exame do indiciado', itens:['O examinando é portador de moléstia venérea?','Qual essa moléstia e onde está localizada?','O examinando sabia ou devia saber que estava contaminado dessa moléstia?','A moléstia venérea de que é portador o examinando torna-o capaz de expor alguém a perigo, por meio de relações sexuais, ou de qualquer outro ato libidinoso? (Resposta justificada)'] },
    ],
  },

  { id:'contagio_molestia', crime:'Perigo de Contágio de Moléstia Grave', artigo:'Art. 131 CP', icon:'🦠',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['O examinando está contagiado de moléstia grave?','Qual a moléstia?','De que modo se teria produzido o contágio?','A moléstia é a mesma de que está contaminado o indiciado?'] },
      { nome:'IML — Exame do indiciado', itens:['O examinando está contaminado de moléstia grave?','Qual a moléstia?','É contagiosa essa moléstia?','O examinando devia saber que estava contaminado dessa moléstia?','O ato imputado ao paciente era capaz de produzir o contágio de outrem?'] },
    ],
  },

  { id:'perigo_vida', crime:'Perigo para a Vida ou Saúde de Outrem', artigo:'Art. 132 CP', icon:'⚠',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Qual o tipo de periclitação havida contra a vida ou saúde da vítima?','Qual o meio ou a causa que provocou essa periclitação?','Não sendo possível precisar a causa, qual a mais provável?','Da periclitação havida resultou comprometimento contra a vida, contra o patrimônio ou contra ambos os bens jurídicos?','O ato imputado ao agente expôs a vida ou a saúde do paciente a perigo direto e iminente? (Resposta justificada)','Qual foi este perigo? (Resposta justificada)'] },
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','Existem no local vestígios relacionados ao fato? Caso positivo, quais?','Existem vestígios no local que possam indicar a autoria do delito? Caso positivo, quais?'] },
    ],
  },

  { id:'abandono_incapaz', crime:'Abandono de Incapaz', artigo:'Art. 133 CP', icon:'👤',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['O examinando era, por qualquer motivo, incapaz de defender-se dos riscos resultantes do seu abandono?','Do abandono resultou lesão corporal de natureza grave? (Resposta justificada)','Do abandono resultou a morte do examinando?'] },
      { nome:'IC — Exame do local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','O local oferece condições mínimas de higiene e meios ao fim que se destina?','A vida ou a saúde do indivíduo foi exposta a perigo pela privação de alimentação ou cuidados indispensáveis?','A vida ou a saúde do indivíduo foi exposta a perigo, abuso de meios de correção ou disciplina?','Do fato resultou lesão corporal?','Existem no local vestígios que possam indicar a autoria do delito? Caso positivo, quais?'] },
    ],
    obs:'Em caso de morte, requisitar exame necroscópico.',
  },

  { id:'abandono_recem_nascido', crime:'Exposição ou Abandono de Recém-Nascido', artigo:'Art. 134 CP', icon:'👶',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['O examinando era recém-nascido ao tempo de sua exposição ou abandono? (Resposta justificada)','Dessa exposição ou abandono resultou lesão corporal de natureza grave? (Resposta especificada)','Dessa exposição ou abandono resultou a morte?'] },
    ],
  },

  { id:'omissao_socorro', crime:'Omissão de Socorro', artigo:'Art. 135 CP', icon:'🚑',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['O examinando era inválido ou estava ferido? (Resposta justificada)','Da omissão de assistência, ou de socorro, resultou lesão corporal de natureza grave? (Resposta justificada)','Da omissão de assistência, ou de socorro, resultou a morte? (Exame Necroscópico)','Era possível prestar assistência ao paciente sem risco pessoal?'] },
    ],
  },

  { id:'maus_tratos', crime:'Maus Tratos', artigo:'Art. 136 CP', icon:'🚨',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['A vida ou a saúde do examinando foi exposta a perigo pela privação de alimentação ou cuidados indispensáveis? (Resposta justificada)','A vida ou a saúde do examinando foi exposta a perigo pelo abuso de meios de correção ou de disciplina? (Resposta justificada)','Do fato resultou lesão corporal de natureza grave? (Resposta justificada)'] },
      { nome:'IC — Exame do local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','É possível identificar a data e o horário em que se deram os eventos?','É possível identificar o número de pessoas que participaram do evento?','É possível identificar como foi a dinâmica do evento? Em caso positivo, qual foi?','Foram encontrados no local objetos relacionados com a dinâmica do evento? Em caso positivo, quais?','Existem no local vestígios que possam indicar a autoria do delito? Caso positivo, quais?'] },
    ],
  },

  { id:'constrangimento', crime:'Constrangimento Ilegal', artigo:'Art. 146 CP', icon:'🔒',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Qual o tipo de violência física para a consecução do constrangimento?','Quais os vestígios materiais do evento relacionáveis com o constrangimento encontrados no local?'] },
      { nome:'IC — Exame de local', itens:['Há vestígio, indicando ter havido emprego de violência? (Resposta justificada)','Há vestígio indicando ter havido emprego de qualquer outro meio para reduzir a capacidade de resistência da vítima? (Resposta justificada)','Qual o meio empregado?'] },
    ],
  },

  { id:'sequestro', crime:'Sequestro e Cárcere Privado', artigo:'Art. 148 CP', icon:'⛓',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['O examinando apresenta sinal ou vestígio de grave sofrimento físico?','O examinando apresenta sinais de alteração psicológica?','Esse sofrimento resultou ou pode ter resultado de maus tratos em sequestro ou cárcere privado? (Resposta justificada)','Esse sofrimento resultou ou pode ter resultado da natureza da detenção em sequestro ou cárcere privado? (Resposta justificada)'] },
      { nome:'IC — Exame de local', itens:['Qual o tipo de local em que se encontrava(m) a(s) pessoa(s) sequestrada(s) ou mantida(s) em cárcere privado?','É possível estimar o lapso temporal em que a(s) pessoa(s) esteve(estiveram) privada(s) de sua liberdade? (Resposta justificada)','Há vestígios que indiquem a frequência/permanência de outras pessoas (vítimas/autores) no local?'] },
    ],
  },

  { id:'trabalho_escravo', crime:'Redução a Condição Análoga à de Escravo', artigo:'Art. 149 CP', icon:'⛓',
    grupos:[
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as condições do local examinado?','Houve redução da(s) pessoa(s) a condição análoga à de escravo?','Como foi consumada tal redução da liberdade individual?','Qual o tipo de trabalho imposto às vítimas?','Qual a salubridade e higiene do local?','Qual(is) a(s) condição(es) de saúde e higiene da(s) vítima(s)?','A vida ou a saúde do indivíduo foi exposta a perigo pela sujeição a trabalho excessivo ou inadequado?'] },
    ],
  },

  { id:'violacao_correspondencia', crime:'Violação de Correspondência', artigo:'Arts. 151–152 CP', icon:'✉',
    grupos:[
      { nome:'IC — Exame do objeto material', itens:['Houve devassamento de correspondência fechada?','Houve destruição de correspondência?','De que natureza era essa correspondência?'] },
      { nome:'IC — Sonegação ou destruição (Art. 151 §1º I)', itens:['No que consistiu, ou de que forma se processou, a violação ou sonegação da correspondência?','Como ocorreu a destruição da correspondência?','Qual o tipo de correspondência que foi violada, sonegada ou destruída?','A violação foi indevida, isto é, realizada por quem não de direito?'] },
      { nome:'IC — Violação de comunicação telegráfica/telefônica (Art. 151 II, III, IV)', itens:['No que consistiu, ou de que forma se processou, a violação ao serviço telegráfico, telefônico ou radioelétrico?','Decorrentes da violação, quais foram as consequências à(s) pessoa(s) física(s) ou jurídica(s) atingida(s)?'] },
    ],
  },

  { id:'estupro', crime:'Estupro', artigo:'Art. 213 CP', icon:'🔴',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Houve conjunção carnal ou prática de outro ato libidinoso?','Qual a data provável da conjunção carnal ou outro ato libidinoso?','Sendo positivo o 1º quesito, em que consistiu?','Apresenta lesão corporal?','Qual o meio empregado?','Da violência resultou para o(a) examinado(a) incapacidade para as ocupações habituais por mais de 30 dias, perigo de vida, debilidade permanente de membro, sentido ou função, aceleração do parto, incapacidade permanente para o trabalho, enfermidade incurável, perda ou inutilização de membro, sentido ou função, deformidade permanente ou aborto?','É o(a) examinado(a) enfermo(a) ou portador(a) de deficiência mental?','Houve qualquer outra causa que tivesse impossibilitado o(a) examinado(a) de reagir?'] },
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','É possível identificar como foi a dinâmica do evento? Em caso positivo, qual foi?','Foram encontrados no local objetos relacionados à dinâmica do evento? Em caso positivo, quais?','Existem vestígios no local que possam indicar a autoria do delito? Caso positivo, quais?','Existem objetos/peças/vestígios no local que apontem como facilitador para o autor cometer o crime ("isca")? Caso positivo, quais?'] },
      { nome:'Laboratório — Exames biológicos', itens:['Para suspeita de sêmen: Há presença de líquido seminal na peça submetida a análise?','Para suspeita de sêmen: É possível confrontar através da análise de DNA os perfis genéticos encontrados nas peças encaminhadas e o material de referência do suspeito?','Para suspeita de sangue: Há presença de sangue humano?','Para suspeita de sangue: É possível confrontar através da análise de DNA os perfis genéticos encontrados?','Para análise de pelos/cabelos: O material examinado tem característica de pelo/cabelo? Em caso positivo, trata-se de pelo humano?','Para análise de pelos/cabelos: É possível confrontar através da análise de DNA os perfis genéticos encontrados e o material de referência do suspeito?'] },
    ],
    obs:'Observação: analisar a possibilidade de requisitar exame toxicológico para a examinada.',
  },

  { id:'violencia_fraude', crime:'Violência Sexual Mediante Fraude / Assédio Sexual', artigo:'Arts. 215 e 216-A CP', icon:'🔴',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Houve prática de ato libidinoso?','Em que consistiu?','Qual o meio empregado?','A vítima é menor de 14 anos?','A vítima tem idade entre 14 e 18 anos?','A vítima é alienada ou débil mental? (Resposta justificada)','Houve qualquer outra causa que impossibilitou a vítima de oferecer resistência? (Resposta justificada)'] },
    ],
  },

  { id:'estupro_vulneravel', crime:'Estupro de Vulnerável', artigo:'Art. 217-A CP', icon:'🔴',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Houve conjunção carnal?','É virgem?','Há vestígio de desvirginamento?','Qual a data provável do desvirginamento?','Houve coito anal?','Qual a data provável do coito anal?','Há lesão corporal ou outro vestígio de violência e, no caso afirmativo, qual o meio empregado? (Resposta justificada)','Da violência resultou lesão corporal de natureza grave? (Resposta justificada)','Da violência resultou a morte da vítima?','A vítima é menor de 14 anos?','A vítima tem idade entre 14 e 18 anos?','A vítima é alienada ou débil mental? (Resposta justificada)','Houve qualquer outra causa que impossibilitou a vítima de oferecer resistência? (Resposta justificada)'] },
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','É possível identificar como foi a dinâmica do evento? Em caso positivo, qual foi?','Foram encontrados no local objetos relacionados à dinâmica do evento? Em caso positivo, quais?','Existem vestígios no local que possam indicar a autoria do delito? Caso positivo, quais?'] },
      { nome:'Laboratório — Exames biológicos', itens:['Para suspeita de sêmen: Há presença de líquido seminal na peça submetida a análise?','Para suspeita de sêmen: É possível confrontar através da análise de DNA os perfis genéticos encontrados?','Para suspeita de sangue: Há presença de sangue humano?','Para suspeita de sangue: É possível confrontar através da análise de DNA os perfis genéticos encontrados?','Para análise de pelos/cabelos: O material examinado tem característica de pelo/cabelo? Em caso positivo, trata-se de pelo humano?'] },
    ],
  },

  { id:'parto_suposto', crime:'Parto Suposto / Supressão de Estado Civil', artigo:'Art. 242 CP', icon:'👶',
    grupos:[
      { nome:'IML — Exame da vítima (criança)', itens:['A examinanda esteve grávida ou deu à luz recentemente?','Qual a data provável do parto?','Qual a idade da criança dada como filho(a) pela examinanda?'] },
      { nome:'IML — Exame da indiciada', itens:['A examinada está grávida, ou não?','A examinada esteve efetivamente grávida ou deu à luz recentemente?','A criança apresentada como filho(a) da examinanda nasceu a termo?','A criança apresentada como filho(a) da examinanda é ou parece ser própria ou alheia?'] },
    ],
  },

  { id:'furto_qualificado', crime:'Furto Qualificado', artigo:'Art. 155 §4º CP', icon:'🕵',
    grupos:[
      { nome:'IC — Exame de local', itens:['Qual a natureza do local examinado?','Qual o meio utilizado pelo indiciado para ter acesso ao local do crime: destruição ou rompimento de obstáculo, escalada, uso de chave falsa ou outro meio?','Existem, internamente, no local do crime, vestígios de destruição ou rompimento de obstáculo ou teria ocorrido escalada, uso de chave falsa ou outro meio tendente à subtração da coisa?','Em que época presume-se tenha ocorrido o fato criminoso?','Houve emprego de instrumento(s)? Em caso positivo, qual(is)?','Existem vestígios, marcas, objetos, documentos ou outros detalhes que venham a permitir a futura identificação do(s) autor(es)?'] },
      { nome:'IC — Furto de caixas eletrônicos', itens:['Houve escalada para ter acesso ao local? Qual o meio empregado?','Quais os sinais de destruição ou arrombamento de obstáculos externos de acesso ao local?','Os instrumentos utilizados foram ferramentas de precisão ou explosivos?','Quantas pessoas participaram? É possível identificá-las?','Qual a dinâmica do evento?'] },
      { nome:'IC — Furto de água, energia ou sinal de comunicação', itens:['Qual a natureza do local examinado?','Qual o artifício ou alteração em equipamento e/ou na rede da concessionária?'] },
      { nome:'IC — Furto de petróleo em dutos', itens:['Houve derivação clandestina de petróleo ou substância derivada? Caso positivo, especificar o tipo de derivação e descrever a técnica empregada.','É possível definir a natureza e o volume da substância subtraída?','Os dutos originais sofreram vandalismo, sabotagem ou furto? Descrever.','Houve incêndio e/ou explosão? Caso negativo, há o risco de incêndio e/ou explosão?','Houve dano ou ameaça de dano ao meio ambiente? Qual a extensão do dano?'] },
    ],
    obs:'Observações: 1) Coletar DNA nos materiais, ferramentas e petrechos utilizados; 2) Coleta de material papiloscópico — pesquisa AFIS.',
  },

  { id:'roubo', crime:'Roubo', artigo:'Art. 157 CP', icon:'🔫',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Há lesão corporal, ou outro vestígio, indicando ter havido emprego de violência contra o(a) examinando(a)? (Resposta justificada)','Há vestígios indicando ter havido emprego de qualquer outro meio para reduzir o(a) examinando(a) à impossibilidade de resistência?','Qual o meio ou instrumento empregado?','Da violência resultou lesão corporal de natureza grave? (Resposta justificada)','Da violência resultou morte?'] },
      { nome:'IC — Exame de local', itens:['Qual a natureza do local examinado?','Qual o meio usado para o acesso a esse local?','Há, internamente, vestígios de destruição ou rompimento de obstáculo?','Em que época se presume tenha ocorrido o fato?','Houve emprego de instrumento ou instrumentos? Quais?','Existiam vestígios, marcas, objetos, documentos ou outros que venham a permitir a futura identificação do autor ou autores?','É possível comprovar a ocorrência da subtração de bens?','É possível identificar o horário em que se deu o evento?','É possível identificar o número de pessoas que participaram do evento?','Para consecução do evento houve violência ou ameaça à vítima por meio de arma?','A violência empregada pelo agente deu causa a lesão corporal ou morte da vítima?','Durante o evento o agente manteve a vítima em seu poder, restringindo sua liberdade?','É possível identificar como foi a dinâmica do evento?'] },
    ],
  },

  { id:'extorsao', crime:'Extorsão', artigo:'Art. 158 CP', icon:'💰',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Há lesão corporal, ou outro vestígio, indicando ter havido emprego de violência contra o(a) examinando(a)?','Qual o meio ou instrumento empregado?','Da violência resultou lesão corporal de natureza grave? (Resposta justificada)','Da violência resultou morte?'] },
    ],
  },

  { id:'extorsao_sequestro', crime:'Extorsão Mediante Sequestro', artigo:'Art. 159 CP', icon:'💰',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Há lesão corporal, ou outro vestígio, indicando ter havido emprego de violência contra o examinando?','Qual o meio ou instrumento empregado?','Da violência resultou lesão corporal de natureza grave? (Resposta justificada)','Da violência resultou morte?'] },
      { nome:'IC — Exame de local', itens:['Qual o tipo de local em que se encontrava(m) a(s) pessoa(s) sequestrada(s)?','Qual o lapso temporal em que a(s) pessoa(s) esteve(estiveram) privada(s) de sua liberdade?','Há vestígios biológicos no local, passíveis de futura comparação de DNA?'] },
    ],
  },

  { id:'dano', crime:'Dano', artigo:'Art. 163 CP', icon:'🔨',
    grupos:[
      { nome:'IC — Exame de local', itens:['Houve destruição, inutilização ou deterioração da coisa submetida a exame? Qual a extensão do dano? (Resposta justificada)','Qual o meio e quais os instrumentos empregados?','Houve emprego de substância inflamável ou explosiva?'] },
      { nome:'IC — Dano qualificado', itens:['Qual a extensão dos danos produzidos pela ação criminosa?','Quais os objetos ou instrumentos que os produziram?'] },
    ],
  },

  { id:'violencia_domestica_quesitos', crime:'Violência Doméstica — Lesão Corporal', artigo:'Art. 129 §9º CP + Lei 11.340/06', icon:'🏠',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Houve ofensa à integridade corporal ou à saúde do examinando?','Qual o instrumento ou meio que produziu a ofensa?','Da ofensa resultou incapacidade para as ocupações habituais por mais de 30 dias?','Da ofensa resultou debilidade permanente de membro, sentido ou função?','O fato ocorreu em contexto de violência doméstica e familiar?'] },
      { nome:'IC — Exame de local', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','Existem vestígios de violência ou luta no local?','Existem objetos ou instrumentos relacionados ao fato? Quais?','Há vestígios indicativos de autoria?'] },
    ],
  },

  { id:'tortura', crime:'Tortura', artigo:'Lei 9.455/97', icon:'⚠',
    grupos:[
      { nome:'IML — Exame da vítima', itens:['Há elementos médico-legais que caracterizem a prática de tortura física? Se sim, quais são?','Há indícios clínicos que caracterizem a prática de tortura psíquica? Se sim, quais são? (Resposta justificada)','Há evidências médico-legais que sejam característicos, indicadores ou sugestivos de ocorrência de tortura contra o periciando que, no entanto, poderiam excepcionalmente ser produzidos por outra causa? (Resposta justificada)','Havendo tortura física ou psíquica, tal ato resultou lesão corporal de natureza grave ou gravíssima no periciando?','Havendo morte, há elementos médico-legais que caracterizem tortura com resultado morte?'] },
    ],
  },

  { id:'incendio', crime:'Incêndio', artigo:'Art. 250 CP', icon:'🔥',
    grupos:[
      { nome:'IC — Exame de local', itens:['Houve incêndio?','Onde o fogo teve início?','Qual a sua causa?','Não sendo possível precisar sua causa, qual a mais provável?','Qual o modo por que foi, ou parece ter sido produzido o incêndio?','Qual o material que o produziu?','Qual a natureza do edifício, construção ou das coisas incendiadas?','Do incêndio resultou perigo para a integridade física, para a vida ou para o patrimônio alheio?','Houve perigo a um número indeterminado de pessoas?','Houve vítima(s) de lesão corporal ou morte?','Existem eventuais vestígios de objeto(s), produto(s) químico(s) ou material(is) explosivos utilizados na ação criminosa?','Qual a extensão dos danos produzidos pelo incêndio?','Quais os efeitos ou os resultados do incêndio?'] },
    ],
  },

  { id:'explosao', crime:'Explosão / Gás Tóxico', artigo:'Arts. 251–253 CP', icon:'💥',
    grupos:[
      { nome:'IC — Exame de local — Explosão (Art. 251)', itens:['Houve explosão, arremesso ou colocação de engenho de dinamite ou de substância de efeito análogo? (Resposta justificada)','Onde ocorreu?','Qual a sua causa?','Da explosão resultou perigo para a integridade física, para a vida ou para o patrimônio de outrem?','Houve perigo a um número indeterminado de pessoas?','Houve vítima(s) de lesão corporal ou morte?','Houve danos materiais? (descrever)','Qual a natureza do material explosivo utilizado?'] },
      { nome:'IC — Exame de local — Gás tóxico/asfixiante (Arts. 252–253)', itens:['Houve uso de gás tóxico ou asfixiante?','Qual a sua natureza?','O uso desse gás expôs a perigo a vida, a integridade física ou o patrimônio de outrem?','Houve perigo a um número indeterminado de pessoas?','Houve vítima(s) de lesão corporal ou morte?','Houve danos materiais? Qual a sua extensão?'] },
      { nome:'IC — Exames laboratoriais', itens:['O material apresentado a exame constitui substância ou engenho explosivo, gás tóxico ou asfixiante? (Resposta justificada)','O material apresentado a exame é destinado à fabricação de substância ou engenho explosivo, gás tóxico ou asfixiante? (Resposta justificada)','O material oferece perigo a um número indeterminado de pessoas?'] },
    ],
  },

  { id:'inundacao_desabamento', crime:'Inundação / Desabamento / Desmoronamento', artigo:'Arts. 254–256 CP', icon:'🌊',
    grupos:[
      { nome:'IC — Inundação (Art. 254)', itens:['Houve inundação?','Qual o fato que a ocasionou?','Qual a natureza e utilidade do prédio inundado?','Quais os efeitos ou resultados produzidos pela inundação?','A inundação foi acidental, proposital ou resultou de imprudência, negligência ou imperícia? (Resposta justificada)','A inundação expôs a perigo a vida ou a integridade física de outrem? (Resposta justificada)','A inundação expôs a perigo o patrimônio de outrem? (Resposta justificada)','Qual a extensão do dano?','Houve vítima(s) de lesão corporal ou morte?'] },
      { nome:'IC — Desabamento/Desmoronamento (Art. 256)', itens:['Houve desabamento ou desmoronamento?','Qual a natureza da coisa desabada ou desmoronada?','O desabamento ou desmoronamento foi acidental, proposital ou resultou de imprudência, negligência ou imperícia? (Resposta justificada)','Esse desabamento ou desmoronamento expôs a perigo a integridade física, a vida ou o patrimônio de outrem?','Houve perigo a um número indeterminado de pessoas?','Houve vítima(s) de lesão corporal ou morte?','Qual a extensão do dano?'] },
    ],
  },

  { id:'adulteracao_veiculo_quesitos', crime:'Adulteração de Sinal de Veículo', artigo:'Art. 311 CP', icon:'🚘',
    grupos:[
      { nome:'IC — Exame de local', itens:['Houve adulteração ou remarcação do número de chassi ou qualquer sinal identificador do veículo automotor, de seu componente ou equipamento, previstos nas resoluções do CONTRAN?','Qual a identificação original do veículo?','Confrontando-se o número do chassi, do motor e dos agregados do veículo com os números constantes na ficha de montagem fornecida pelo fabricante (carta-laudo), é possível afirmar que o veículo examinado corresponde ao da carta-laudo? Por quê?'] },
    ],
  },

  { id:'falsificacao_documento', crime:'Falsificação de Documento / Moeda Falsa / Falsa Identidade', artigo:'Arts. 289–311 CP', icon:'📄',
    grupos:[
      { nome:'IC — Falsificação de documento (Arts. 297–298)', itens:['Qual o documento apresentado a exame?','O documento apresentado a exame é verdadeiro ou falso?','Sendo falso, em que consistiu a falsificação?','Sendo verdadeiro, foi alterado o documento?','Em que consistiu a alteração?'] },
      { nome:'IC — Exames grafotécnicos', itens:['É autêntica a assinatura lançada em nome do investigado no documento, tendo em vista os padrões de confronto fornecidos?','Em caso de falsidade, é possível determinar sua autoria considerando os padrões de confronto fornecidos?','Os dizeres manuscritos no documento emanaram do punho do investigado, que forneceu material gráfico para confronto?','Em caso negativo, é possível determinar sua autoria, considerando os outros padrões de confronto oferecidos?'] },
      { nome:'IC — Falsa identidade (Arts. 307–308)', itens:['Qual a natureza e características do material apresentado a exame?','Apresenta vestígios de ter sido retirada a fotografia de seu verdadeiro portador e aposta a fotografia que nela se vê, ou outros sinais de adulteração?','A cédula de identidade em exame, após ter sido alterada, foi replastificada, ou foi objeto de outros atos voltados a dissimular a falsificação constatada?'] },
      { nome:'IC — Moeda falsa (Art. 289)', itens:['O papel, a cédula ou moeda metálica apresentada a exame é, ou não, verdadeiro?','Qual o seu material, forma e peso?','Qual o seu valor nominal?','Qual o meio utilizado para a falsificação (cunhagem, fundição, galvanoplastia, impressão etc.)?','A falsificação foi operada por contrafação ou por alteração?','Quais os sinais que a diferenciam da verdadeira (material, cunho, emblema etc.)?','Pode a cédula ou moeda metálica examinada confundir-se no meio circulante comum com cédula ou moeda autêntica?'] },
    ],
  },

  { id:'homicidio_culposo_transito', crime:'Homicídio / Lesão Culposa no Trânsito', artigo:'Arts. 302–303 CTB', icon:'🚗',
    grupos:[
      { nome:'IC — Exame de local de acidente', itens:['Houve acidente? Se sim, qual a sua natureza?','É possível especificar a data e hora aproximada em que ocorreu o acidente?','O local encontrava-se preservado, alterado ou prejudicado? Se alterado, quais os motivos?','Quais as características do local quanto à topografia, leito carroçável, pavimentação, sinalização e iluminação?','Quais as condições climáticas na data e hora do fato?','Qual foi o número de veículo(s) envolvido(s)? Quais as características e o estado de conservação?','Algum defeito ou desgaste verificado no(s) veículo(s) pode ter concorrido para o acidente?','Há marcas pneumáticas de frenagem no local? Qual(is) é(são) suas extensões e sentidos? É possível precisar a velocidade?','Há cadáver(es) no local? Se sim, em que posição os corpos foram encontrados?','É possível identificar como se deu a dinâmica do evento? Quais foram as causas determinantes e/ou concorrentes?','É possível a elaboração de croqui detalhado do local do fato?'] },
      { nome:'IC — Vistoria de veículos', itens:['Quais as características do veículo examinado?','Esse veículo apresentava danos? Em caso afirmativo, onde se situavam? Quais as orientações desses danos?','Como se apresentavam seus sistemas de segurança para o tráfego (freios, direção, alarme e iluminação)?','Em que estado de conservação achavam-se os pneus desse veículo?'] },
      { nome:'IML — Embriaguez ao volante (Art. 306 CTB)', itens:['O periciando encontra-se sob a influência de álcool ou de outra substância psicoativa que determine dependência?','Em caso positivo, é possível apontar o tipo de droga e qual o efeito em seu organismo, bem como se causa dependência física ou psíquica?','Estando o periciando sob influência, encontra-se com sua capacidade psicomotora alterada para a condução de veículo automotor?','É possível afirmar que a influência de álcool ou outra substância foi o que alterou a capacidade psicomotora do examinado?','Qual o grau de embriaguez — se constatada — em que se encontrava o examinado na ocasião dos fatos?'] },
    ],
  },

  { id:'trafico_quesitos', crime:'Tráfico de Drogas — Exame da Substância', artigo:'Art. 33 Lei 11.343/06', icon:'💊',
    grupos:[
      { nome:'IC — Exame provisório da substância', itens:['Qual a natureza e quantidade da substância apresentada para exame? Qual o seu peso?','A substância apresentada é proscrita no Brasil, de acordo com a Portaria ANVISA nº 344/1998 e atualizações (RDC)?'] },
      { nome:'IC — Exame definitivo da substância', itens:['Qual a natureza e quantidade da substância apresentada para exame? Qual o seu peso?','A substância apresentada é proscrita no Brasil, de acordo com a Portaria ANVISA nº 344/1998?','Identificada a substância, pode ser ela utilizada como matéria-prima, insumo ou produto químico destinado à preparação de drogas?'] },
      { nome:'IC — Exame de local', itens:['O local encontra-se idôneo?','Qual a espécie de local em que se encontrava(m) o(s) material(is) localizado(s)?','O local é utilizado para cultivo, guarda ou depósito?','É possível quantificar o material encontrado?','No local há maquinário, aparelho ou instrumento destinado à fabricação ou preparação de drogas? Em caso positivo, quais?','É possível localizar impressões digitais no local ou nos maquinários/equipamentos localizados?'] },
      { nome:'IC — Exame de peças relacionadas', itens:['O material apresentado é comumente utilizado no preparo, na confecção de embalagem ou na pesagem de drogas para a prática do tráfico? Se sim, quantifique-os e descreva-os.'] },
    ],
  },

  { id:'arma_fogo_quesitos', crime:'Arma de Fogo — Exame Pericial', artigo:'Lei 10.826/03', icon:'🔫',
    grupos:[
      { nome:'IC — Exame de arma de fogo', itens:['Qual a natureza, dimensões, calibre e demais características da arma apresentada para exame?','Trata-se de arma de fogo? Em caso positivo, encontra-se carregada? Se sim, qual a natureza da munição?','A arma de fogo apresentada sofreu algum tipo de adulteração em suas características originais? Se sim, qual(is)?','Existem vestígios de supressão ou alteração da marca, numeração ou qualquer outro sinal de identificação?','É possível esclarecer qual a marca ou numeração da arma de fogo que foi removida?','A arma de fogo questionada é eficiente para produzir disparos?','No estado em que se encontra, poderia ter sido utilizada eficazmente para a realização de disparos?','A arma de fogo apresenta vestígios produzidos por disparos recentes?','A arma de fogo pode produzir tiro acidental? Em caso afirmativo, em que condição(ões)?'] },
      { nome:'IC — Simulacro, arma de pressão e airsoft', itens:['Qual a natureza, tipo, origem e forma de acionamento da arma submetida a exame?','A arma encontra-se apta para a realização de disparos?','Qual o grau de similaridade, a olho nu, ao ser comparada com arma de fogo de iguais características?','A arma é capaz de causar lesões ou de ser utilizada para ameaçar alguém?'] },
      { nome:'IC — Exame de munição', itens:['Quais as características (dimensões, calibre e outras) da munição examinada?','A munição é compatível com qual(is) arma(s) de fogo?','A munição é eficiente para produzir um tiro?','A munição é íntegra?','Houve percussão na espoleta?'] },
      { nome:'IC — Confronto balístico', itens:['Quais as características das peças examinadas?','De quais armas partiram os projéteis encaminhados para exame?','Por quais armas foram percutidos os estojos/cartuchos picotados encaminhados para exame?','No caso de não encaminhamento de armas de fogo, é possível estabelecer correlação com os projéteis/estojos encaminhados?'] },
      { nome:'IC — Residuográfico (resíduos de disparo)', itens:['Pesquisa de resíduos de disparo de arma de fogo.'] },
    ],
    obs:'Observação: a coleta do material residuográfico em pessoas vivas deve ocorrer, em média, em até quatro horas depois do disparo.',
  },

  { id:'eca_pornografia', crime:'ECA — Pornografia Infantil', artigo:'Arts. 240–243 ECA', icon:'👦',
    grupos:[
      { nome:'IC — Exame de objeto (Arts. 240–241-B)', itens:['Há, no material apreendido, fotografias ou imagens contendo pornografia ou cenas de sexo explícito envolvendo criança ou adolescente?','Em caso positivo, qual sua natureza, quantidade de arquivos localizados, bem como suas respectivas datas de criação e modificação?','É possível afirmar que houve divulgação do material pornográfico envolvendo crianças/adolescentes para outros por meio da internet?','É possível destacar os sítios de internet visitados pelo usuário? Há algum envolvendo pornografia ou cenas de sexo explícito com criança ou adolescente?','Havendo aplicativos ou softwares de mensagens eletrônicas ou acesso a redes sociais, é possível identificar registros e teores de comunicações envolvendo pornografia infantil?','Existe a possibilidade de recuperação de arquivos apagados do aparelho? Se sim, existe no conteúdo recuperado informações sobre armazenamento, publicação ou transmissão de imagens ou vídeos contendo pornografia infantil?'] },
      { nome:'IC — Montagem/adulteração (Art. 241-C)', itens:['Há algum elemento indicativo de adulteração, montagem ou modificação na fotografia/vídeo apresentado?','Em caso positivo, é possível verificar se houve disponibilização ou divulgação do arquivo por meio da internet?'] },
    ],
  },

  { id:'crimes_ambientais', crime:'Crimes Ambientais — Fauna e Flora', artigo:'Lei 9.605/98 — Arts. 29–61', icon:'🌿',
    grupos:[
      { nome:'IC — Exame de local (Fauna — Art. 29)', itens:['O local em que se deu a conduta, trata-se de unidade de conservação?','Em vista dos danos causados, é possível verificar o impedimento da procriação da fauna ou dano, destruição, modificação de ninho, abrigo ou criadouro natural?','O método ou instrumento utilizado é capaz de provocar destruição em massa? Qual sua potencialidade lesiva?','Houve a utilização de veneno, ou substância química na ação criminosa?','O animal submetido a exame é espécime da fauna silvestre, nativo ou em rota migratória?'] },
      { nome:'IC — Maus tratos a animais (Art. 32)', itens:['O animal submetido a exame é espécime da fauna silvestre, nativo ou em rota migratória?','O local da infração penal tem características de cárcere ou de local de confinamento?','Quais as condições de higiene, alimentação, trato e ferimento encontradas em relação ao animal? Há sinais de maus tratos?','Há sinais de que o animal, quando vivo, foi utilizado para realização de experiência dolorosa ou cruel?'] },
      { nome:'IC — Crimes contra a Flora (Arts. 38–53)', itens:['O local examinado pode ser considerado como floresta? Houve dano ou destruição?','Qual o tipo de vegetação danificada ou destruída?','O dano constatado permite comprovar o corte de árvores com separação do tronco da raiz?','O local examinado constitui Parque Nacional, Estadual, Municipal ou área de reserva ecológica?','No caso de incêndio, há indícios de ter sido provocado por conduta humana? Se sim, foi intencional ou decorrente de imprudência, negligência ou imperícia?','Em caso positivo, qual a extensão do dano?'] },
      { nome:'IC — Poluição (Art. 54)', itens:['É possível constatar, no caso concreto, a existência de dano ao meio ambiente?','Houve degradação, erosão ou esgotamento do solo? Se sim, qual o nível?','Qual a forma de manejo e a potencialidade lesiva das substâncias poluentes?','Houve ou há a possibilidade de resultar danos à saúde humana, ou que provoquem a mortandade de animais ou a destruição significativa da flora?'] },
    ],
  },

  { id:'autopsia', crime:'Autópsia — Exame Necroscópico', artigo:'Arts. 162–166 CPP', icon:'🏥',
    grupos:[
      { nome:'IML — Quesitos complementares sobre cadáveres', itens:['Qual o biotipo do cadáver?','É possível descrever sua altura, peso, cor da pele, cor dos olhos, tipo e cor dos cabelos?','O cadáver apresenta deformidades, cicatrizes e tatuagens?','É possível determinar-se a idade do cadáver através de radiografia do punho, cotovelo e osso pélvico?','Qual o número de dentes da hemi-arcada superior e inferior do cadáver?','É possível a colheita de impressões digitais do examinado, para fins de identificação futura?','Há no cadáver lesões corporais?','Em caso positivo, qual a sua natureza?','Há no cadáver lesões de defesa?','Em caso afirmativo, onde se localizam?','Qual a natureza dos instrumentos que produziram tais lesões?','É possível precisar a data e horário em que se deu o evento morte?'] },
    ],
  },

  { id:'afogamento', crime:'Local de Afogamento', artigo:'Arts. 6º VII e 169 CPP', icon:'🌊',
    grupos:[
      { nome:'IC — Exame de local de afogamento', itens:['Qual a localização da área relacionada ao fato?','Quais as dimensões, eventual diâmetro, perímetro e profundidade do poço, lago, represa, rio?','Qual a distância entre o local do afogamento (ou o local de encontro do cadáver) até o imóvel mais próximo?','Existe algum tipo de proteção junto às margens?','O local é de fácil acesso?','Existe possibilidade de elaborar-se um croqui do local?','Na hipótese de existência de cadáver no local, foram encontradas lesões quando do exame perinecroscópico?','Foram encontrados no local objetos e/ou vestígios relacionados à dinâmica do evento? Em caso positivo, quais?','É possível identificar a dinâmica do evento? Em caso positivo, qual foi?'] },
    ],
  },

  { id:'materiais_biologicos', crime:'Perícias em Materiais Biológicos', artigo:'Art. 170 CPP', icon:'🔬',
    grupos:[
      { nome:'IC — Exame de sangue', itens:['Quais são as características da(s) peça(s) examinada(s)?','Há nelas manchas de aspecto hematóide?','Há presença de sangue humano?','É possível confrontar através da análise de DNA os perfis genéticos encontrados nas peças encaminhadas e o material de referência do suspeito?'] },
      { nome:'IC — Exame de líquido seminal', itens:['Quais são as características da(s) peça(s) examinada(s)?','Há presença de líquido seminal na peça submetida a análise?','É possível confrontar através da análise de DNA os perfis genéticos encontrados e o material de referência do suspeito?'] },
      { nome:'IC — Exame de pelos, fibra vegetal e fibra sintética', itens:['O material examinado tem característica de pelos/cabelo? Em caso positivo, trata-se de pelo humano?','É possível confrontar através da análise de DNA os perfis genéticos encontrados e o material de referência do suspeito?'] },
    ],
    obs:'Observação: análise de DNA em pelos só é possível com mais de 10 pelos com bulbo.',
  },

  { id:'grafotecnicos', crime:'Exames Grafotécnicos e Mecanográficos', artigo:'Arts. 174–175 CPP', icon:'✍',
    grupos:[
      { nome:'IC — Exames grafotécnicos', itens:['É autêntica a assinatura lançada em nome do investigado no documento, tendo em vista os padrões de confronto fornecidos?','Em caso de falsidade, é possível determinar sua autoria considerando os padrões de confronto fornecidos?','Os dizeres manuscritos no documento emanaram do punho do investigado, que forneceu material gráfico para confronto?','Em caso negativo, é possível determinar sua autoria, considerando os outros padrões de confronto oferecidos?'] },
      { nome:'IC — Exames mecanográficos', itens:['O documento foi datilografado na máquina de escrever (ou impresso por meio da impressora) indicada, que produziu os padrões fornecidos?','O documento foi datilografado (ou impresso) no seu todo na mesma máquina?','Apresenta o documento desalinhamento datilográfico que indiquem não ter sido o seu texto datilografado numa só assentada?','A impressão de carimbo que figura no documento procedeu do carimbo que produziu as impressões colhidas como padrão?','O documento submetido a exame, sendo verdadeiro, foi alterado? Em que consistiu a alteração?'] },
    ],
  },

  { id:'audio_video', crime:'Exames de Áudio, Vídeo e Reconhecimento', artigo:'Art. 175 CPP', icon:'📹',
    grupos:[
      { nome:'IC — Edição de áudio e vídeo', itens:['As peças de exame apresentavam-se em condições físicas e operacionais satisfatórias para os exames? Se não, quais avarias constatadas?','Há registros armazenados nas mídias? Se sim, quais suas características gerais?','Há algum fator impeditivo ao prosseguimento da perícia (ausência de senhas, codecs ou aplicativos específicos, cabos, fontes, equipamentos proprietários)?','O exato trecho suspeito de adulteração apresentava indícios de manipulações por meio de inserções, cortes, regravações ou outros meios?','Os vestígios observados são suficientes para indicar a ocorrência de edição fraudulenta?'] },
      { nome:'IC — Comparação de fala, voz e linguagem', itens:['A mídia apresenta-se em condições físicas e operacionais satisfatórias para os exames?','Há registros armazenados nas mídias? Se sim, quais suas características gerais?','As amostras questionadas apresentam qualidade satisfatória para os exames?','É possível aferir o nível de verossimilhança entre as amostras padrão e questionada? Se sim, qual a probabilidade da voz apresentada nos registros sonoros questionados terem sido reproduzidos pelo locutor da fala padrão fornecida?'] },
      { nome:'IC — Conteúdo visual em mídias', itens:['A mídia apresenta-se em condições físicas satisfatórias para os exames?','Há material gravado na mídia? Se sim, quais suas características gerais?','O conteúdo apresenta boa inteligibilidade e/ou visualização? Se não, é possível melhorá-la?','Com base na dinâmica descrita no BO/Relatório de Investigação, é possível constatar vestígios da ocorrência do tipo penal em apuração?','Com base nos informes, é possível identificar totalmente ou parcialmente os veículos diretamente envolvidos nas ações (marca, modelo, cor, placas)?','Com base nos informes, é possível destacar os indivíduos diretamente envolvidos nas ações, inclusive tipos físicos, indumentárias, marcas ou tatuagens?'] },
    ],
  },

  { id:'informatica', crime:'Exames de Informática', artigo:'Art. 175 CPP', icon:'💻',
    grupos:[
      { nome:'IC — Exame em computadores, smartphones e mídias', itens:['Na peça encaminhada para exame, existem arquivos relacionados com a natureza criminal? Se sim, identificá-los e, se possível, imprimi-los.','Há registro(s) de produção do material questionado pelo dispositivo analisado? Quais?','Há registro(s) de compartilhamento desse material? Em caso positivo, há registros de identificação dos envolvidos?'] },
      { nome:'IC — Exame em celulares', itens:['Existem registros do(s) número(s) investigado(s) dentre as ligações recebidas/efetuadas pelo telefone celular encaminhado a exame?','Existem registros do(s) número(s) ou do(s) nome(s) investigado(s) na agenda do telefone celular encaminhado a exame?','Existem mensagens de texto que façam referência ao(s) número(s) ou nome(s) investigado(s)?','Existem mensagens de texto que façam referência ao fato investigado?'] },
      { nome:'IC — Exame em cartão magnético', itens:['Há dados constantes na tarja magnética do cartão?','É possível verificar se os dados na tarja magnética correspondem aos dados constantes no suporte físico do cartão?','É possível verificar se os dados constantes na tarja magnética apresentam estrutura similar aos dados encontrados em cartões bancários/crédito?'] },
      { nome:'IC — Equipamento para clonagem de cartão', itens:['O aparelho eletrônico apresenta alguma modificação ou inserção de dispositivo de forma artesanal?','O aparelho eletrônico apresenta leitor/gravador de tarjas magnéticas?','O aparelho eletrônico apresenta dispositivos destinados ao armazenamento ou transmissão de dados?','O aparelho eletrônico apresenta dispositivos destinados a capturar, armazenar ou transmitir dados de tarjas magnéticas ou inseridos pelo usuário?'] },
      { nome:'IC — Exame em sítios eletrônicos', itens:['Os arquivos de registros fornecidos apresentam na data e hora indicadas o acesso do endereço IP investigado ao servidor?','Nos arquivos de registros, identificar os endereços IPs que acessaram o servidor na data ou período questionado.'] },
    ],
    obs:'Não são recomendados quesitos genéricos. Delimitar sempre o escopo da perícia: tipo de arquivo de interesse, período, palavras-chave relacionadas à ocorrência. Não solicitar "qual o número habilitado no aparelho" (dado das operadoras) nem "extração genérica de dados".',
  },

  { id:'insanidade_mental', crime:'Incidente de Insanidade Mental do Acusado', artigo:'Arts. 149 §1º e 151 CPP', icon:'🧠',
    grupos:[
      { nome:'IML — Exame do indiciado', itens:['O examinando apresenta comprometimento de sua integridade mental?','Em caso positivo, tal comprometimento é total ou parcial?','Qual sua espécie ou gênero?','Desde que época o examinando apresenta tal comprometimento?','O examinando cometeu a infração penal em situação de imputabilidade, semi-imputabilidade ou inimputabilidade?'] },
    ],
  },

  { id:'acidente_trabalho', crime:'Acidente de Trabalho / Eletroplessão / Fulguração', artigo:'', icon:'⚙',
    grupos:[
      { nome:'IC — Local de acidente de trabalho', itens:['Qual a localização da área relacionada ao fato?','O local relacionado ao fato está idôneo?','Quais as características do local examinado?','Houve acidente de trabalho?','Como ocorreu?','Houve condição física insegura que propiciou o evento?','Em caso de existir condição física insegura, está ela relacionada com a não aplicação das normas técnicas e regulamentos de segurança do trabalho?','Na hipótese de existência de cadáver(es) no local, qual a descrição da(s) vítima(s) e sua(s) posição(ões) no ambiente?'] },
      { nome:'IC — Local de eletroplessão', itens:['Houve eletroplessão?','Como ocorreu?','Houve condição física insegura que propiciou o evento?','Estava ela relacionada com a não aplicação das normas técnicas e regulamentos de segurança do trabalho?'] },
      { nome:'IC — Local de fulguração', itens:['Houve fulguração?','Houve condição física insegura que propiciou o evento?','Estava ela relacionada com a não aplicação das normas técnicas e regulamentos de segurança do trabalho?'] },
    ],
  },

  { id:'contravencoes', crime:'Contravenções Penais', artigo:'LCP — Arts. 19, 38, 42, 50, 58, 62', icon:'📋',
    grupos:[
      { nome:'IC — Porte de arma branca (Art. 19 LCP)', itens:['Qual a natureza da peça submetida a exame?','Quais as suas dimensões e qual o seu peso?','No estado em que se encontra, podia ter sido utilizada eficazmente como instrumento de ataque ou defesa?','A arma submetida a exame apresenta manchas de sangue?','Em caso afirmativo, tem esse sangue características de sangue humano?'] },
      { nome:'IC — Jogo de azar (Art. 50 LCP)', itens:['Qual a espécie do objeto submetido a exame?','Esse objeto pode servir à prática de jogo de azar? (Resposta justificada)','A qual(is) jogo(s) o(s) objeto(s) está(ão) relacionado(s)?','Como é a dinâmica do jogo em questão?','Trata-se de jogo que depende da habilidade do jogador ou de questões aleatórias como sua sorte ou azar?','Quais as probabilidades de ganho ou perda verificadas?','No objeto examinado, existe chave, dispositivo ou outra forma de alterar as probabilidades de sucesso no jogo?','O material examinado apresenta possibilidade de operação remota, via internet ou outra tecnologia?'] },
      { nome:'IC — Jogo do bicho (Art. 58 D.L. 6.259/44)', itens:['Qual a natureza e características dos objetos apresentados a exame?','Podem esses objetos ser considerados como de jogo e, em caso afirmativo, a que espécie de jogo se destinam?','O jogo do bicho, pelo modo que é feito, pode ser considerado loteria ou rifa não autorizada?','Qual é o mecanismo do jogo do bicho ou do jogo constatado?','Os dispositivos eletrônicos, computadores, cartões de memória, Chip/SIM card de telefonia celular e telefones apreendidos foram utilizados na prática da infração penal?'] },
      { nome:'IML — Verificação de embriaguez (Art. 62 LCP)', itens:['O periciando apresenta sinais clínicos de embriaguez?','Em caso afirmativo, tais sinais permitem diagnosticar embriaguez ligeira, acentuada ou completa?','O periciando está embriagado pelo álcool ou por substância de efeitos análogos?','No estado em que se encontra, pode o mesmo colocar em risco a segurança própria ou alheia?','É possível concluir o grau de embriaguez na ocasião dos fatos?'] },
    ],
  },

  { id:'pericial_contabil', crime:'Exame Pericial Contábil', artigo:'', icon:'📊',
    grupos:[
      { nome:'IC — Quesitos gerais', itens:['Qual o valor do prejuízo causado à vítima?','Qual o período em que ocorreu(ram) a(s) irregularidade(s)?','Qual seria o modus operandi?','Podem os peritos prestar outros esclarecimentos úteis à elucidação do fato?'] },
      { nome:'IC — Incêndio fraudulento (Art. 250)', itens:['Qual o capital da firma?','O capital está integralizado?','Quando foi levantado o último balanço?','Pelo exame dos livros, podem os peritos determinar o valor do estoque de mercadoria que deveria existir no estabelecimento quando irrompeu o incêndio?','Qual o valor dos móveis e utensílios que existiam no estabelecimento, constantes da escrita da firma?','Acha-se o estabelecimento no seguro? Se positivo, qual ou quais são as companhias seguradoras?','Qual a situação econômico-financeira da firma?'] },
    ],
    obs:'Os quesitos devem ser objetivos, explícitos, enfocando de maneira específica a infração penal, questionando sobre os artifícios contábeis empregados para dissimular o fato ilícito praticado, bem como o modus operandi e o quantum obtido ardilosamente.',
  },

];
