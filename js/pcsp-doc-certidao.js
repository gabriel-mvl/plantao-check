// ── CERTIDÃO ─────────────────────────────────────────────────
// Arquivo isolado — depende de pcsp-doc.js estar carregado antes
PCSP_DOCS.certidao = {
  id: 'certidao',
  icone: '\u270d\ufe0f',
  titulo: 'Certid\u00e3o',
  subtitulo: 'Pol\u00edcia Civil do Estado de S\u00e3o Paulo',
  campos: [
    {
      id: 'tipo',
      label: 'Tipo de certid\u00e3o',
      type: 'select',
      options: [
        { value: 'recusa_interr',   label: 'Recusa — interrogat\u00f3rio e nota de culpa' },
        { value: 'recusa_dactilo',  label: 'Recusa — interrogat\u00f3rio, nota de culpa e coleta dactiloscópica' },
        { value: 'recusa_tco',      label: 'Recusa — Termo Circunstanciado de Ocorr\u00eancia' },
        { value: 'sem_advogado',    label: 'Aus\u00eancia de advogado constitu\u00eddo' },
        { value: 'medida_protetiva',label: 'Cumprimento de medida protetiva' },
        { value: 'livre',           label: 'Texto livre' },
      ],
    },
    { id: 'nomeEnvolvido',  label: 'Nome do(a) indiciado(a) / requerido(a)', placeholder: 'Nome completo', required: false },
    { id: 'numBO',          label: 'Número do BO', placeholder: 'Ex: 000001/2026', required: false },
    { id: 'numProcesso',    label: 'N\u00famero do processo (medida protetiva)', placeholder: 'Ex: 1234567-89.2026.8.26.0000', required: false },
    { id: 'textoLivre',     label: 'Texto livre da certid\u00e3o', placeholder: 'Descreva o conte\u00fado da certid\u00e3o...', type: 'textarea', required: false },
    { id: 'nomeEscrivao',   label: 'Nome completo do(a) escrivão(ã)', placeholder: 'Nome completo' },
  ],

  gerar: function(campos, u) {
    var S   = 'font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#000;';
    var J   = S + 'text-align:justify;line-height:1.8;';
    var nome = campos.nomeEnvolvido || '___________________________________';
    var num  = campos.numProcesso   || '___________________________________';
    var numBO = campos.numBO ? 'número ' + campos.numBO : '_______________';
    var tipo = campos.tipo;

    // Body text
    var corpo_texto;
    switch (tipo) {
      case 'recusa_interr':
        corpo_texto =
          'o(a) indiciado(a) <strong>' + nome + '</strong>, devidamente qualificado(a) nos autos do boletim de ocorr\u00eancia ' + numBO + ', ' +
          'foi cientificado(a) do teor de seu interrogat\u00f3rio e da respectiva nota de culpa, ' +
          'recusando-se a assinar ambos os documentos, o que fa\u00e7o constar para os devidos fins legais.';
        break;

      case 'recusa_dactilo':
        corpo_texto =
          'o(a) indiciado(a) <strong>' + nome + '</strong>, devidamente qualificado(a) nos autos do boletim de ocorr\u00eancia ' + numBO + ', ' +
          'foi cientificado(a) do teor de seu interrogat\u00f3rio e da respectiva nota de culpa, ' +
          'recusando-se a assinar ambos os documentos, bem como n\u00e3o permitiu a coleta de suas ' +
          'impress\u00f5es datiloscópicas para fins de legitima\u00e7\u00e3o, ' +
          'o que fa\u00e7o constar para os devidos fins legais.';
        break;

      case 'recusa_tco':
        corpo_texto =
          'o(a) autor(a) do fato <strong>' + nome + '</strong>, devidamente qualificado(a) nos autos do boletim de ocorr\u00eancia ' + numBO + ', ' +
          'foi cientificado(a) do teor do Termo Circunstanciado de Ocorr\u00eancia lavrado, ' +
          'recusando-se a assin\u00e1-lo, o que fa\u00e7o constar para os devidos fins legais.';
        break;

      case 'sem_advogado':
        corpo_texto =
          'at\u00e9 a presente data, n\u00e3o consta nos autos desta unidade policial a constitui\u00e7\u00e3o ' +
          'de advogado pelo(a) indiciado(a) <strong>' + nome + '</strong>, nem a nomea\u00e7\u00e3o de ' +
          'defensor dativo, o que fa\u00e7o constar para os devidos fins legais.';
        break;

      case 'medida_protetiva':
        corpo_texto =
          'a medida protetiva de urg\u00eancia deferida nos autos do processo n.\u00ba ' +
          '<strong>' + num + '</strong> foi devidamente comunicada ao(à) requerido(a) ' +
          '<strong>' + nome + '</strong>, o qual(a) foi cientificado(a) de seu teor e das ' +
          'consequ\u00eancias de seu descumprimento, o que fa\u00e7o constar para os devidos fins legais.';
        break;

      case 'livre':
        corpo_texto =
          (campos.textoLivre || '___________________________________') +
          ', o que fa\u00e7o constar para os devidos fins legais.';
        break;

      default:
        corpo_texto = '_______________________________';
    }

    // Date by extension
    var meses = ['janeiro','fevereiro','mar\u00e7o','abril','maio','junho',
                 'julho','agosto','setembro','outubro','novembro','dezembro'];
    var hoje  = new Date();
    var dataExtenso = hoje.getDate() + ' de ' + meses[hoje.getMonth()] + ' de ' + hoje.getFullYear();
    var cidade = (u && u.mun) ? u.mun : '_______________';
    var escrivao = campos.nomeEscrivao || '___________________________________';

    return (
      // Corpo
      '<div style="' + J + 'margin-bottom:3rem;text-indent:2.5rem">' +
        'Certifico, para os devidos fins, que ' + corpo_texto +
      '</div>' +

      // Fé pública
      '<div style="' + J + 'margin-bottom:3rem;text-indent:2.5rem">' +
        'O referido \u00e9 verdade e dou f\u00e9.' +
      '</div>' +

      // Cidade e data
      '<div style="text-align:right;' + S + 'margin-bottom:3.5rem">' +
        cidade + ', ' + dataExtenso + '.' +
      '</div>' +

      // Assinatura do requerido (apenas medida protetiva)
      (tipo === 'medida_protetiva'
        ? '<div style="text-align:center;' + S + 'margin-bottom:3rem">' +
            '<div style="border-top:1px solid #000;width:50%;margin:0 auto .4rem"></div>' +
            '<div>' + nome + '</div>' +
            '<div style="font-weight:bold">Requerido(a)</div>' +
          '</div>'
        : '') +

      // Assinatura do escrivão
      '<div style="text-align:center;' + S + '">' +
        '<div style="border-top:1px solid #000;width:50%;margin:0 auto .4rem"></div>' +
        '<div>' + escrivao + '</div>' +
        '<div style="font-weight:bold">Escriv\u00e3o(a) de Pol\u00edcia</div>' +
      '</div>'
    );
  },
};
