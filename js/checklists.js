/* ============================================================
   PLANTÃO CHECK — Checklists Data
   Todos os tipos de ocorrência e seus itens
   ============================================================ */

const OCCURRENCES = [
  // ──────────────────────────────────────────────────────────
  {
    id: 'captura',
    icon: '🔍',
    name: 'Captura de Procurado',
    desc: 'Cumprimento de mandado de prisão',
    sections: [
      {
        id: 'verificacao',
        icon: '🔎',
        name: 'Verificação prévia',
        items: [
          {
            id: 'c1', label: 'Pesquisar se o indivíduo está procurado no DVC (Muralha / Detecta / Prodesp)',
            obs: 'Caminho: Consultas pré-definidas > Registro Criminal > Procurar mandados'
          },
          { id: 'c2', label: 'Consultar no SPJ se há BO dando baixa no mesmo mandado (verificar falha de comunicação)' },
          { id: 'c3', label: 'Pesquisar no BNMP (Banco Nacional de Mandados de Prisão) e imprimir o mandado', obs: 'Se não aparecer no BNMP: Google > "conferência documento digital TJ SP" > 1° grau > nº CNJ + código da Prodesp' },
          { id: 'c4', label: 'Confirmar identidade do capturado (LEAD — feito pelo investigador)' },
        ]
      },
      {
        id: 'bo',
        icon: '📄',
        name: 'Boletim de Ocorrência',
        items: [
          { id: 'c5', label: 'Abrir BO de captura', obs: 'Qualificação: condutor, capturado' },
          {
            id: 'c6', label: 'Redigir histórico do BO',
            template: 'historicoCaptura'
          },
          { id: 'c7', label: 'Auto de qualificação do preso' },
        ]
      },
      {
        id: 'pecas',
        icon: '📋',
        name: 'Peças da Captura',
        items: [
          { id: 'c8', label: 'Requisição de IML do preso', obs: 'Exame cautelar indireto — corpo de delito indireto' },
          { id: 'c9', label: 'Ofício de encaminhamento do preso (confirmar destino conforme regime/perfil)' },
          { id: 'c10', label: 'Juntar ficha clínica (anexo)' },
          { id: 'c11', label: 'Juntar mandado de prisão cumprido (com carimbo)' },
          { id: 'c12', label: 'Juntar DVC' },
          { id: 'c13', label: 'Juntar LEAD' },
        ]
      },
      {
        id: 'patua',
        icon: '🗂',
        name: 'Montar Patuá de Captura',
        items: [
          { id: 'c14', label: '3 vias do Ofício de encaminhamento de preso' },
          { id: 'c15', label: '1 via do BO' },
          { id: 'c16', label: '1 Auto de qualificação' },
          { id: 'c17', label: '1 via da Requisição de IML' },
          { id: 'c18', label: '1 via da Ficha clínica' },
          { id: 'c19', label: '1 DVC' },
          { id: 'c20', label: '1 LEAD' },
          { id: 'c21', label: '1 Mandado de prisão cumprido (com carimbo)' },
        ]
      },
      {
        id: 'comunicacoes',
        icon: '📧',
        name: 'Comunicações',
        items: [
          { id: 'c22', label: 'Enviar e-mail de comunicação de captura para os destinatários obrigatórios', obs: 'Documentos: cópia do BO, mandado cumprido, ficha clínica, req. IML, DVC' },
          { id: 'c23', label: 'Enviar e-mail para o IML (ficha clínica + requisição de IML) para exame indireto', obs: 'Não esqueça de juntar laudo ao expediente quando receber' },
          { id: 'c24', label: 'Verificar dia da audiência de custódia (semana = RAJ Sorocaba / FDS = Plantão de Itu via site TJSP)' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'flagrante_captura',
    icon: '⛓',
    name: 'Flagrante + Captura',
    desc: 'Quando há tanto flagrante delito quanto mandado a cumprir',
    sections: [
      {
        id: 'fc_bo',
        icon: '📄',
        name: 'Boletim de Ocorrência',
        items: [
          { id: 'fc1', label: 'Abrir BO único com natureza do flagrante + captura', obs: 'Cadastrar o indivíduo duas vezes: uma com RG e outra manualmente' },
        ]
      },
      {
        id: 'fc_oitivas',
        icon: '🎙',
        name: 'Oitivas',
        items: [
          { id: 'fc2', label: 'Depoimento do condutor' },
          { id: 'fc3', label: 'Depoimento da(s) testemunha(s)' },
          { id: 'fc4', label: 'Declarações da vítima' },
          { id: 'fc5', label: 'Interrogatório do preso + Vida pregressa + Auto de qualificação' },
        ]
      },
      {
        id: 'fc_pecas',
        icon: '📋',
        name: 'Peças do Flagrante + Captura',
        items: [
          { id: 'fc6', label: 'Auto de exibição e apreensão (objetos / dinheiro / droga / veículo)' },
          { id: 'fc7', label: 'Requisição de IC para objetos/drogas (perícia em carro e de local: pedir no sistema)' },
          { id: 'fc8', label: 'Nota de culpa (delegado)' },
          { id: 'fc9', label: 'Auto de Prisão em Flagrante (delegado)' },
          { id: 'fc10', label: 'BIC (no IPE)' },
          { id: 'fc11', label: 'Ofício de encaminhamento do preso (confirmar destino)' },
          { id: 'fc12', label: 'Requisição de IML do preso' },
          { id: 'fc13', label: 'Juntar ficha clínica' },
          { id: 'fc14', label: 'Juntar mandado de prisão cumprido' },
          { id: 'fc15', label: 'Juntar DVC' },
          { id: 'fc16', label: 'Comunicar captura via e-mail' },
        ]
      },
      {
        id: 'fc_patua',
        icon: '🗂',
        name: 'Montar Patuá',
        items: [
          { id: 'fc17', label: '3 vias do Ofício de encaminhamento' },
          { id: 'fc18', label: '1 BO' },
          { id: 'fc19', label: '1 Auto de Prisão em Flagrante' },
          { id: 'fc20', label: '1 Auto de qualificação' },
          { id: 'fc21', label: 'Interrogatório' },
          { id: 'fc22', label: 'Nota de culpa' },
          { id: 'fc23', label: 'Vida pregressa' },
          { id: 'fc24', label: 'BIC' },
          { id: 'fc25', label: '1 via da Requisição de IML (juntar laudo após)' },
          { id: 'fc26', label: '1 DVC' },
          { id: 'fc27', label: '1 LEAD' },
          { id: 'fc28', label: 'Mandado cumprido' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'flagrante_geral',
    icon: '🚨',
    name: 'Flagrante — Peças Gerais',
    desc: 'Checklist base para qualquer auto de prisão em flagrante',
    sections: [
      {
        id: 'fg_bo',
        icon: '📄',
        name: 'Boletim de Ocorrência',
        items: [
          { id: 'fg1', label: 'Abrir BO', alert: 'Selecionar "BO para flagrante" — não pode ser revertido após finalizado' },
        ]
      },
      {
        id: 'fg_oitivas',
        icon: '🎙',
        name: 'Oitivas',
        items: [
          { id: 'fg2', label: 'Termo de depoimento — condutor' },
          { id: 'fg3', label: 'Termo de depoimento — testemunhas' },
          { id: 'fg4', label: 'Termo de declarações — vítima' },
          { id: 'fg5', label: 'Interrogatório do preso + Vida pregressa (delegado)', obs: 'Escrivão deve preencher a vida pregressa' },
          { id: 'fg6', label: 'Auto de qualificação do preso' },
        ]
      },
      {
        id: 'fg_pecas',
        icon: '📋',
        name: 'Peças do Auto',
        items: [
          { id: 'fg7', label: 'Auto de Prisão em Flagrante (delegado)' },
          { id: 'fg8', label: 'Nota de culpa (delegado)' },
          { id: 'fg9', label: 'Auto de exibição e apreensão (se houver objetos)' },
          { id: 'fg10', label: 'Requisição de IML do preso (exame cautelar indireto)', obs: 'Enviar e-mail para o IML com ficha clínica + requisição assim que receber o preso' },
          { id: 'fg11', label: 'Juntar ficha clínica (anexo)' },
          { id: 'fg12', label: 'Juntar DVC' },
          { id: 'fg13', label: 'LEAD (confirmar resultado)' },
          { id: 'fg14', label: 'BIC (no IPE)' },
          { id: 'fg15', label: 'Ofício de encaminhamento do preso (verificar destino e DVC para crime sexual)' },
          { id: 'fg16', label: 'Requisição de perícia para objetos apreendidos (se necessário)' },
        ]
      },
      {
        id: 'fg_patua',
        icon: '🗂',
        name: 'Patuá do Preso',
        items: [
          { id: 'fg17', label: '3 cópias do ofício de encaminhamento do preso' },
          { id: 'fg18', label: '1 cópia do Auto de Prisão em Flagrante' },
          { id: 'fg19', label: '1 via do BO' },
          { id: 'fg20', label: '1 interrogatório + vida pregressa' },
          { id: 'fg21', label: '1 nota de culpa' },
          { id: 'fg22', label: '1 DVC' },
          { id: 'fg23', label: 'LEAD (resultado da confirmação)' },
          { id: 'fg24', label: 'Requisição de IML (juntar laudo após)' },
          { id: 'fg25', label: 'Ficha clínica' },
          { id: 'fg26', label: 'BIC' },
        ]
      },
      {
        id: 'fg_alerta',
        icon: '⚠',
        name: 'Antes de destinar o preso',
        items: [
          { id: 'fg27', label: 'Verificar DVC: o preso possui crime sexual?', alert: 'Se sim → cela separada + destino: CDP 2 de Sorocaba (independente da ocorrência)' },
          { id: 'fg28', label: 'Confirmar destino final conforme regime/perfil do preso' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'adulteracao_veiculo',
    icon: '🚗',
    name: 'Adulteração de Sinal de Veículo',
    desc: 'Chassi, placa ou motor adulterado/suprimido',
    sections: [
      {
        id: 'av_bo',
        icon: '📄',
        name: 'Boletim de Ocorrência',
        items: [
          { id: 'av1', label: 'Abrir BO' },
          { id: 'av2', label: 'Exibição e apreensão do veículo', obs: 'Cadastrar veículo como "objeto". No campo observação: VEICULO, MODELO, OSTENTANDO O EMPLACAMENTO XXXXX, apreendido com o lacre XXXXX' },
          { id: 'av3', label: 'Constar no histórico do BO: acionamento do guincho, número do protocolo, número do lacre, destino do veículo', tip: 'O lacre é colocado no câmbio ou no volante' },
        ]
      },
      {
        id: 'av_guincho',
        icon: '🏗',
        name: 'Guincho',
        items: [
          { id: 'av4', label: 'Acionar o guincho via WhatsApp para encaminhar ao Pátio Carvalho em Sorocaba/SP' },
          { id: 'av5', label: 'Anotar: hora/data do acionamento, hora/data da chegada e protocolo do guincho' },
          { id: 'av6', label: 'Juntar papeleta do guincho ao BO (anexo)' },
          {
            id: 'av7', label: 'Enviar e-mail de comunicação após finalizar o BO (anexar: cópia do BO, exibição e apreensão, papeleta do guincho)',
            template: 'emailGuincho'
          },
        ]
      },
      {
        id: 'av_pericia',
        icon: '🔬',
        name: 'Perícia',
        items: [
          { id: 'av8', label: 'Requisitar perícia do veículo no SPJ: IC-SOROCABA', obs: 'Natureza: metalográfico (adulteração de chassi/placa/motor) e/ou vistoria veicular para constatação de danos. Se veículo foi ao pátio, alterar o campo "local" para Pátio Carvalho.' },
        ]
      },
      {
        id: 'av_oitivas',
        icon: '🎙',
        name: 'Oitivas',
        items: [
          { id: 'av9', label: 'Termo de depoimento — condutor' },
          { id: 'av10', label: 'Termo de depoimento — testemunhas' },
          { id: 'av11', label: 'Termo de declarações — autor (quando liberado) / partes' },
          { id: 'av12', label: 'Interrogatório (quando indiciado — preencher vida pregressa)' },
        ]
      },
      {
        id: 'av_flagrante',
        icon: '⛓',
        name: 'Se houver flagrante',
        items: [
          { id: 'av13', label: 'Auto de Prisão em Flagrante (delegado)' },
          { id: 'av14', label: 'Nota de culpa (delegado)' },
          { id: 'av15', label: 'Requisição de IML do preso' },
          { id: 'av16', label: 'Juntar ficha clínica' },
          { id: 'av17', label: 'Ofício de encaminhamento do preso' },
          { id: 'av18', label: 'BIC' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'homicidio',
    icon: '💀',
    name: 'Homicídio / Tentativa de Homicídio',
    desc: 'Morte dolosa ou tentativa',
    sections: [
      {
        id: 'hom_bo',
        icon: '📄',
        name: 'Boletim de Ocorrência',
        items: [
          { id: 'h1', label: 'Abrir BO' },
          { id: 'h2', label: 'Acionar perícia de LOCAL no SPJ: IC-SOROCABA', obs: 'Colocar breve histórico, natureza do exame e objetivo. Constar guarnição PM/GCM presente no local e telefone de contato. Enviar WhatsApp confirmando recebimento do pedido.' },
        ]
      },
      {
        id: 'hom_oitivas',
        icon: '🎙',
        name: 'Oitivas',
        items: [
          { id: 'h3', label: 'Termo de depoimento — condutor' },
          { id: 'h4', label: 'Termo de depoimento — testemunhas' },
          { id: 'h5', label: 'Oitiva da vítima (quando possível)' },
          { id: 'h6', label: 'Declarações do autor (quando liberado)' },
          { id: 'h7', label: 'Interrogatório do preso + Vida pregressa (delegado)', obs: 'Escrivão deve preencher a vida pregressa' },
        ]
      },
      {
        id: 'hom_pecas',
        icon: '📋',
        name: 'Peças',
        items: [
          { id: 'h8', label: 'Auto de exibição e apreensão (se houver objetos)' },
          { id: 'h9', label: 'Auto de Prisão em Flagrante (delegado)' },
          { id: 'h10', label: 'Nota de culpa (delegado)' },
          { id: 'h11', label: 'Requisição de IML do preso (exame cautelar indireto)' },
          { id: 'h12', label: 'Juntar ficha clínica' },
          { id: 'h13', label: 'Ofício de encaminhamento do preso' },
          { id: 'h14', label: 'Requisição de IML da vítima', obs: 'Objetivo: exame necroscópico e toxicológico. Natureza: exame necroscópico e toxicológico.' },
          { id: 'h15', label: 'Requisição de perícia para objetos apreendidos (se necessário)' },
          { id: 'h16', label: 'BIC' },
        ]
      },
      {
        id: 'hom_comunicacoes',
        icon: '📧',
        name: 'Comunicações',
        items: [
          { id: 'h17', label: 'Enviar e-mail para o IML (ficha clínica + requisição para exame indireto)', alert: 'SEMPRE enviar e-mail para IML. Não esquecer de anexar a ficha clínica.' },
          { id: 'h18', label: 'Verificar necessidade de comunicar ocorrência de relevância', obs: 'Homicídios geralmente geram repercussão — avaliar com delegado' },
          { id: 'h19', label: 'Se vítima fatal: ligar para funerária municipal após pedido de perícia IC', obs: 'Funerárias: Itu ou Salto/SP conforme localidade' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'adolescente',
    icon: '👦',
    name: 'Ocorrência com Adolescente',
    desc: 'Apreensão de menor infrator',
    sections: [
      {
        id: 'adol_bo',
        icon: '📄',
        name: 'Boletim de Ocorrência',
        items: [
          { id: 'adol1', label: 'Abrir BO', alert: 'Destino: "Encaminhamento para Vara de Infância e Juventude" — EXCETO se houver flagrante com outro indiciado adulto (neste caso: "BO para flagrante")' },
          { id: 'adol2', label: 'Verificar se há curador disponível', obs: 'Adolescente infrator deve ser ouvido na presença de curador. Se necessário, acionar Conselho Tutelar.' },
          { id: 'adol3', label: 'Vítima menor de idade NÃO pode ser ouvida no plantão', alert: 'Deve ser ouvida via escuta especializada posteriormente.' },
        ]
      },
      {
        id: 'adol_pecas',
        icon: '📋',
        name: 'Peças',
        items: [
          { id: 'adol4', label: 'Depoimento do condutor' },
          { id: 'adol5', label: 'Depoimento da testemunha' },
          { id: 'adol6', label: 'Auto de apreensão de adolescente' },
          { id: 'adol7', label: 'Declarações do menor infrator (com presença de curador + assinatura)', obs: 'Verificar se delegado prefere o "Auto de Apreensão de Adolescente" (todas as partes no mesmo documento)' },
          { id: 'adol8', label: 'Termo de compromisso do ECA (se o adolescente for liberado)' },
          { id: 'adol9', label: 'Ofício de encaminhamento de menor infrator (se ficar apreendido)', obs: 'Destino: Fundação Casa' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'violencia_domestica',
    icon: '🏠',
    name: 'Violência Doméstica (Maria da Penha)',
    desc: 'Crimes contra a mulher no âmbito doméstico e familiar',
    sections: [
      {
        id: 'vd_bo',
        icon: '📄',
        name: 'Boletim de Ocorrência',
        items: [
          { id: 'vd1', label: 'Abrir BO' },
          { id: 'vd2', label: 'Depoimento do condutor' },
          { id: 'vd3', label: 'Depoimento da testemunha' },
          {
            id: 'vd4', label: 'Declarações da vítima',
            obs: 'Constar: deseja medidas protetivas? Quais? (afastamento do agressor, proibição de contato/aproximação). Autoriza fotografação das lesões? Deseja ser intimada via celular/e-mail?'
          },
        ]
      },
      {
        id: 'vd_pericia',
        icon: '🔬',
        name: 'Perícia e Apreensão',
        items: [
          { id: 'vd5', label: 'Auto de exibição e apreensão (se houver objeto, ex: faca)' },
          { id: 'vd6', label: 'Requisição de IC do objeto apreendido (se houver)' },
          { id: 'vd7', label: 'Requisição de IC de local (se necessário, ex: crime de dano)' },
          { id: 'vd8', label: 'Requisição de IML da vítima', obs: 'Objetivo: constatar lesões. Natureza: exame de corpo de delito.' },
          { id: 'vd9', label: 'Juntar fotos das lesões (anexo)' },
          { id: 'vd10', label: 'Juntar foto do objeto/arma apreendida (anexo)' },
        ]
      },
      {
        id: 'vd_medidas',
        icon: '🛡',
        name: 'Medidas Protetivas',
        items: [
          { id: 'vd11', label: 'Formulário nacional de risco de violência doméstica' },
          { id: 'vd12', label: 'Termo de pedido de concessão de medida protetiva' },
          { id: 'vd13', label: 'Ofício de encaminhamento de medida protetiva' },
        ]
      },
      {
        id: 'vd_flagrante',
        icon: '⛓',
        name: 'Se houver flagrante (autor preso)',
        items: [
          { id: 'vd14', label: 'Interrogatório do autor + Vida pregressa + Auto de qualificação' },
          { id: 'vd15', label: 'Nota de culpa (delegado)' },
          { id: 'vd16', label: 'Auto de Prisão em Flagrante (delegado)' },
          { id: 'vd17', label: 'Juntar DVC' },
          { id: 'vd18', label: 'LEAD' },
          { id: 'vd19', label: 'BIC' },
          { id: 'vd20', label: 'Requisição de IML do autor + Juntar ficha clínica' },
          { id: 'vd21', label: 'Enviar e-mail para IML (ficha clínica + requisição — da vítima E do autor)', alert: 'SEMPRE enviar e-mail para IML com ambas as requisições.' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'trafico',
    icon: '💊',
    name: 'Tráfico de Drogas',
    desc: 'Comércio ilícito de substâncias entorpecentes',
    sections: [
      {
        id: 'tr_bo',
        icon: '📄',
        name: 'Boletim de Ocorrência',
        items: [
          { id: 'tr1', label: 'Abrir BO' },
          { id: 'tr2', label: 'Auto de Prisão em Flagrante (delegado)' },
        ]
      },
      {
        id: 'tr_apreensao',
        icon: '📦',
        name: 'Apreensão',
        items: [
          { id: 'tr3', label: 'Auto de exibição e apreensão (drogas, veículos)' },
          { id: 'tr4', label: 'Auto de constatação da droga' },
          { id: 'tr5', label: 'Requisição de IC — substância entorpecente', obs: 'Objetivo: constatação de substância entorpecente. Natureza: químico toxicológico.' },
        ]
      },
      {
        id: 'tr_oitivas',
        icon: '🎙',
        name: 'Oitivas',
        items: [
          { id: 'tr6', label: 'Depoimento do condutor (com recibo do preso)' },
          { id: 'tr7', label: 'Depoimento da testemunha' },
          { id: 'tr8', label: 'Interrogatório do preso + Vida pregressa + Auto de qualificação' },
          { id: 'tr9', label: 'Termo de declarações (se menor de idade — com curador)' },
        ]
      },
      {
        id: 'tr_pecas',
        icon: '📋',
        name: 'Peças do Preso',
        items: [
          { id: 'tr10', label: 'Requisição de IML do preso' },
          { id: 'tr11', label: 'Nota de culpa (delegado)' },
          { id: 'tr12', label: 'DVC (anexo)' },
          { id: 'tr13', label: 'Ficha clínica (anexo)' },
          { id: 'tr14', label: 'LEAD' },
          { id: 'tr15', label: 'BIC (no IPE)' },
          { id: 'tr16', label: 'Ofício de encaminhamento do preso (verificar destino)' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'dano',
    icon: '🔨',
    name: 'Dano',
    desc: 'Apenas dano doloso',
    sections: [
      {
        id: 'dn_bo',
        icon: '📄',
        name: 'Boletim de Ocorrência',
        items: [
          { id: 'dn1', label: 'Abrir BO', obs: 'Apenas dano doloso — dano culposo não é crime.' },
        ]
      },
      {
        id: 'dn_oitivas',
        icon: '🎙',
        name: 'Oitivas',
        items: [
          { id: 'dn2', label: 'Depoimento do condutor' },
          { id: 'dn3', label: 'Depoimento da testemunha' },
          { id: 'dn4', label: 'Declarações da vítima', obs: 'Constar o prejuízo estimado na declaração da vítima.' },
        ]
      },
      {
        id: 'dn_pericia',
        icon: '🔬',
        name: 'Apreensão e Perícia',
        items: [
          { id: 'dn5', label: 'Auto de avaliação do dano' },
          { id: 'dn6', label: 'Requisição de perícia de local (no sistema)' },
          { id: 'dn7', label: 'Requisição de perícia do objeto' },
          { id: 'dn8', label: 'Auto de apreensão do objeto' },
        ]
      },
      {
        id: 'dn_flagrante',
        icon: '⛓',
        name: 'Se houver flagrante',
        items: [
          { id: 'dn9', label: 'Interrogatório do autor + Vida pregressa' },
          { id: 'dn10', label: 'Nota de culpa (delegado)' },
          { id: 'dn11', label: 'Auto de Prisão em Flagrante (delegado)' },
          { id: 'dn12', label: 'Ofício de encaminhamento do preso' },
          { id: 'dn13', label: 'Requisição de IML do preso' },
          { id: 'dn14', label: 'Juntar ficha clínica' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'embriaguez',
    icon: '🍺',
    name: 'Embriaguez ao Volante',
    desc: 'Art. 306 do CTB — infração penal',
    sections: [
      {
        id: 'emb_coleta_sangue',
        icon: '🩸',
        name: 'Situação 1 — Coleta de sangue',
        items: [
          { id: 'emb1', label: 'Fazer a autorização de coleta de sangue e coletar assinatura do conduzido' },
          { id: 'emb2', label: 'Entregar frasquinho + saco plástico para a PM levar à UPA' },
          { id: 'emb3', label: 'Cadastrar conduzido como investigado; PM como condutor e testemunha' },
          { id: 'emb4', label: 'Etiquetar o frasco (nome, RG, lacre, nº BO) e lacrar' },
          { id: 'emb5', label: 'Relacionar o sangue como objeto no BO' },
          { id: 'emb6', label: 'Exibição e apreensão do sangue coletado' },
          { id: 'emb7', label: 'Requisição de IML — objeto', obs: 'Objetivo: constatação de dosagem alcoólica. Natureza: exame químico toxicológico.' },
          { id: 'emb8', label: 'Termo de declarações do conduzido' },
        ]
      },
      {
        id: 'emb_bafometro',
        icon: '💨',
        name: 'Situação 2 — Etilômetro (bafômetro)',
        items: [
          { id: 'emb9', label: 'Todas as peças gerais do flagrante' },
          { id: 'emb10', label: 'Tirar cópia da nota do bafômetro e anexar' },
          { id: 'emb11', label: 'Lacrar o teste de etilômetro e fazer exibição e apreensão' },
          { id: 'emb12', label: 'Constar a fiança no histórico do BO (se aplicável)' },
          { id: 'emb13', label: 'Fazer "Termo de exibição de fiança" no SPJ (se houver fiança)', obs: 'Pegar assinatura do exibidor no documento e no livro de fiança. A fiança deve ser lacrada e relacionada em "objetos" no BO.' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'cadaver',
    icon: '⚰',
    name: 'Encontro de Cadáver',
    desc: 'Morte com causa indeterminada ou suspeita',
    sections: [
      {
        id: 'cad_bo',
        icon: '📄',
        name: 'Procedimentos',
        items: [
          { id: 'cad1', label: 'Abrir BO' },
          { id: 'cad2', label: 'Acionar perícia de LOCAL (IC-SOROCABA) no SPJ', obs: 'Colocar histórico, natureza e objetivo. Informar guarnição presente e contato. Confirmar recebimento via WhatsApp.' },
          { id: 'cad3', label: 'Ligar para a funerária municipal para retirar o corpo (após pedido de perícia)', alert: 'Só acionar a funerária APÓS requisitar a perícia.' },
          { id: 'cad4', label: 'Termo de depoimento — condutor e testemunha' },
          { id: 'cad5', label: 'Requisição de IML', obs: 'Objetivo: exame necroscópico e toxicológico. Natureza: necroscópico e toxicológico.' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'arma_fogo',
    icon: '🔫',
    name: 'Arma de Fogo (Posse/Porte/Disparo)',
    desc: 'Infrações relativas ao Estatuto do Desarmamento',
    sections: [
      {
        id: 'af_flagrante',
        icon: '⛓',
        name: 'Peças Gerais do Flagrante',
        items: [
          { id: 'af1', label: 'Todas as peças gerais do flagrante (ver checklist "Flagrante — Peças Gerais")' },
        ]
      },
      {
        id: 'af_pericia',
        icon: '🔬',
        name: 'Perícias Específicas',
        items: [
          { id: 'af2', label: 'Requisição de IC da arma — objeto', obs: 'Objetivo: descrição, fotografação, eficácia da arma e disparo recente. Natureza: balística forense.' },
          { id: 'af3', label: 'Requisição de IC — residográfico (para o suspeito)' },
          { id: 'af4', label: 'Requisição de perícia de local (se necessário)' },
          { id: 'af5', label: 'Lacrar a arma desmuniciada', obs: 'Munições em saquinho menor dentro do saco plástico com a arma.' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'morte_suspeita',
    icon: '❓',
    name: 'Morte Suspeita',
    desc: 'Morte com circunstâncias não esclarecidas',
    sections: [
      {
        id: 'ms_proc',
        icon: '📄',
        name: 'Procedimentos',
        items: [
          { id: 'ms1', label: 'Abrir BO' },
          { id: 'ms2', label: 'Requisição de IML', obs: 'Objetivo/Natureza: exame necroscópico e toxicológico.' },
          { id: 'ms3', label: 'Declarações do declarante' },
          { id: 'ms4', label: 'Juntar papel do hospital com ficha de atendimento (anexo)' },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────────────────
  {
    id: 'morte_natural',
    icon: '🕊',
    name: 'Morte Natural',
    desc: 'Óbito por causa natural confirmada',
    sections: [
      {
        id: 'mn_proc',
        icon: '📄',
        name: 'Procedimentos',
        items: [
          { id: 'mn1', label: 'Abrir BO' },
          { id: 'mn2', label: 'Requisição para SVO', obs: 'Alterar título para SVO. Exame: anatomatológico.' },
          { id: 'mn3', label: 'Declarações do declarante' },
          { id: 'mn4', label: 'Juntar papel do hospital com ficha de atendimento (anexo)' },
        ]
      },
    ]
  },
];

// ── REFERÊNCIAS ───────────────────────────────────────────────

const REFERENCIAS = {
  requisicoes: {
    title: '📋 Natureza e Objetivo das Requisições',
    content: `
      <table class="ref-table">
        <thead>
          <tr>
            <th>Ocorrência</th>
            <th>Tipo de Req.</th>
            <th>Objetivo</th>
            <th>Natureza do Exame</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Embriaguez ao volante (sangue)</td><td>IML — Objeto</td><td>Constatação de dosagem alcoólica</td><td>Químico toxicológico</td></tr>
          <tr><td>Preso em flagrante / captura</td><td>IML — Pessoa</td><td>Exame cautelar indireto</td><td>Corpo de delito indireto / Exame cautelar indireto</td></tr>
          <tr><td>Lesão corporal</td><td>IML — Pessoa</td><td>Constatar lesões</td><td>Exame de corpo de delito</td></tr>
          <tr><td>Estupro</td><td>IML — Pessoa</td><td>Constatação de violência sexual (exame sexológico)</td><td>Sexologia forense</td></tr>
          <tr><td>Drogas</td><td>IC — Substância entorpecente</td><td>Constatação de substância entorpecente</td><td>Químico toxicológico</td></tr>
          <tr><td>Veículo adulterado</td><td>Perícia no sistema</td><td>Vistoria, fotografação, descrição e/ou exame metalográfico</td><td>Metalográfico / Vistoria veicular</td></tr>
          <tr><td>Arma de fogo</td><td>IC — Objeto</td><td>Descrição, fotografação, eficácia e disparo recente</td><td>Balística forense</td></tr>
          <tr><td>Celular (tráfico)</td><td>IC — Objeto</td><td>Extração de dados relacionados a tráfico</td><td>Quebra de sigilo telemático (requer autorização judicial)</td></tr>
          <tr><td>Homicídio / Encontro de cadáver</td><td>IML — Pessoa</td><td>Exame necroscópico e toxicológico</td><td>Necroscópico e toxicológico</td></tr>
          <tr><td>Morte natural</td><td>SVO</td><td>—</td><td>Anatomatológico</td></tr>
          <tr><td>Faca apreendida</td><td>IC — Objeto</td><td>Descrição, fotografação, presença de substância hematóide</td><td>—</td></tr>
        </tbody>
      </table>
    `
  },
  orientacoes: {
    title: '📌 Orientações Gerais do Plantão',
    content: `
      <div class="ref-prose">
        <p><strong>Chegada da PM:</strong> Pegar todos os dados da ocorrência e fazer as pesquisas criminais do autor. Comunicar o delegado com todas as informações.</p>
        <p><strong>Vítima menor de idade:</strong> Não pode ser ouvida no plantão. Deve ser ouvida via escuta especializada posteriormente.</p>
        <p><strong>Adolescente infrator:</strong> Deve ser ouvido na presença de um curador. Caso não haja, acionar o Conselho Tutelar.</p>
        <p><strong>Finalização do BO:</strong> Sempre perguntar ao delegado se pode finalizar o BO antes de concluir.</p>
        <p><strong>Tipo de BO para flagrantes:</strong> Selecionar "BO para flagrante" — uma vez finalizado, não é possível reverter. O IPE é gerado automaticamente.</p>
        <p><strong>Acidentes de trânsito:</strong> A PM perguntará sobre possibilidade de aplicar resolução. Sempre passar a informação ao delegado para análise.</p>
        <p><strong>BO com situação "BO para registro":</strong> Não registrar nenhum BO nesta situação. Em caso de dúvida, consultar o delegado ou usar "apreciação do delegado titular".</p>
        <p><strong>Perícia de local no SPJ:</strong> Selecionar IC-SOROCABA. Preencher histórico, natureza do exame e guarnição presente com contato.</p>
        <p><strong>Destinação dos presos:</strong></p>
        <ul>
          <li>Pensão → Capela do Alto</li>
          <li>Regime fechado → CDP Sorocaba</li>
          <li>Preventiva → CDP Sorocaba</li>
          <li>Temporário → Capão Bonito</li>
          <li>Feminino → Votorantim</li>
          <li>Crimes sexuais → CDP 2 de Sorocaba</li>
          <li>Semi-aberto → CPP em Porto Feliz</li>
          <li>Adolescente → Fundação Casa</li>
          <li>Preso evadido → CDP Sorocaba</li>
        </ul>
        <p><strong>Antes de destinar o preso:</strong> Verificar no DVC se há crime sexual. Se sim → cela separada + CDP 2 de Sorocaba.</p>
        <p><strong>Acidente com vítima fatal / Encontro de cadáver:</strong> Ligar para a funerária municipal após realizar o pedido de perícia.</p>
        <p><strong>Ocorrências de relevância na mídia:</strong> Comunicar como Ocorrência de Relevância via Intranet ou e-mail institucional para Delpol Itu, Cepol Sorocaba e Cartório Central da Seccional de Sorocaba. Copiar e colar o BO completo no corpo da mensagem — não anexar.</p>
        <p><strong>Desaparecimento de pessoa:</strong> Incluir o máximo de dados: cor da pele, adornos, vestimenta, placa do veículo (se houver), fotos. Enviar para Cepol, DPM Itu e Delegacia de Homicídios de Sorocaba.</p>
        <p><strong>Audiência de custódia — captura:</strong> Segunda a sexta → comunicar RAJ Sorocaba. Finais de semana e feriados → verificar escrevente plantonista no site do TJSP e comunicar Mandados IIRGD e Capturas.</p>
      </div>
    `
  }
};
