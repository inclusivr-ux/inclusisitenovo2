/* =============================================================================
   InclusiVR — animações e magia por ação
   - A abelha do livro é a única animação de personagem (pedido da equipe).
   - O holograma do topo da página inicial fica parado. Com
     recursos.aberturaTopo: true no config.js, volta a abertura (a mão se projeta,
     as órbitas abrem e o Seu Zé e a Maga Aia chegam, em menos de 4 s) e o brilho
     ao passar o mouse.
   - A abelha do livro (desenho do Igor) passa voando por algumas seções:
     cada voo dura até 5 s e são no máximo 3 por página.
   - Faíscas quadradas quando a pessoa age (formulário enviado, jogo vencido).
   - Mini-jogo: os 5 animais do livro escondidos pelo site. Quem acha os cinco
     ganha 10% de desconto (print da tela + 1 vez por CPF, conferido pela equipe).
     Durante a campanha (Black November), o prêmio leva ao cupom da campanha.
   Toda animação que começa sozinha dura até 5 s e para. Tudo desliga com
   "reduzir movimento" do aparelho.
   ============================================================================= */
(function () {
  'use strict';
  var IVR = window.InclusiVR || {};
  var C = IVR.config || window.INCLUSIVR_CONFIG || {};
  var R = C.recursos || {};
  var raiz = IVR.raiz || '';
  var html = document.documentElement;
  var $$ = IVR.$$ || function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var permitido = IVR.movimentoPermitido || function () { return true; };
  var guarda = IVR.guarda || { ler: function () { return null; }, gravar: function () {} };
  var CORES = ['#58e6e6', '#74d0d8', '#a6f3ee', '#31f5ff'];

  function aleatorio(min, max) { return min + Math.random() * (max - min); }
  function quandoVisivel(el, limiar, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting && en.intersectionRatio >= limiar) { obs.disconnect(); fn(); } });
    }, { threshold: [0, limiar] });
    obs.observe(el);
  }

  /* ---------- faíscas quadradas ---------- */
  function criarFaiscas(camada, n, op) {
    op = op || {};
    for (var i = 0; i < n; i++) {
      var f = document.createElement('i');
      f.className = 'faisca';
      f.style.left = aleatorio(op.xMin || 5, op.xMax || 95) + '%';
      f.style.top = aleatorio(op.yMin || 35, op.yMax || 95) + '%';
      f.style.setProperty('--tam', aleatorio(4, 10).toFixed(1) + 'px');
      f.style.setProperty('--dx', aleatorio(-40, 40).toFixed(0) + 'px');
      f.style.setProperty('--dy', aleatorio(-150, -60).toFixed(0) + 'px');
      f.style.setProperty('--giro', aleatorio(-180, 180).toFixed(0) + 'deg');
      f.style.setProperty('--atraso', ((op.atraso || 0) + aleatorio(0, op.espalhar || .5)).toFixed(2) + 's');
      f.style.setProperty('--dur', aleatorio(.9, 1.7).toFixed(2) + 's');
      f.style.setProperty('--cor', CORES[i % CORES.length]);
      camada.appendChild(f);
    }
  }
  IVR.faiscas = function (alvo, op) {
    if (!alvo || !permitido()) return;
    op = op || {};
    var r = alvo.getBoundingClientRect();
    var camada = document.createElement('div');
    camada.className = 'faiscas';
    camada.setAttribute('aria-hidden', 'true');
    camada.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;z-index:95';
    criarFaiscas(camada, op.quantidade || 12, op);
    document.body.appendChild(camada);
    setTimeout(function () { camada.remove(); }, 2600);
  };

  /* ---------- glitter flutuando nas imagens da Signária IA (pedido de 04/11) ----------
     Estrelinhas de 4 pontas que flutuam e brilham. Marque o contêiner com data-glitter.
     Com "reduzir movimento" elas ficam paradas (o CSS cuida disso). */
  $$('[data-glitter]').forEach(function (alvo) {
    /* No cartão largo (home e Quem somos) a camada cobre o cartão inteiro, não só a caixa da Aia e do celular:
       assim as estrelinhas ficam nos espaços vazios dos lados e do alto, e não em cima dos personagens. */
    var cartao = alvo.classList.contains('ia-capa--cartao') ? alvo.parentElement : null;
    var base = cartao || alvo;
    if (cartao) cartao.setAttribute('data-glitter-base', '');
    var camada = document.createElement('span');
    camada.className = 'glitter';
    camada.setAttribute('aria-hidden', 'true');
    var cores = ['#ffffff', '#dff7ff', '#31f5ff', '#e9c8ff', '#fff3a8'];
    var estrelas = [];
    var porLado = alvo.offsetWidth > 300 ? 3 : 2;
    var total = cartao ? 8 : porLado * 2;
    for (var i = 0; i < total; i++) {
      var e = document.createElement('i');
      e.style.setProperty('--t', aleatorio(7, 14).toFixed(1) + 'px');
      e.style.setProperty('--c', cores[i % cores.length]);
      e.style.setProperty('--dx', aleatorio(-8, 8).toFixed(0) + 'px');
      e.style.setProperty('--dy', aleatorio(-12, 6).toFixed(0) + 'px');
      e.style.setProperty('--d1', aleatorio(3.2, 6.5).toFixed(2) + 's');
      e.style.setProperty('--d2', aleatorio(2.2, 4.6).toFixed(2) + 's');
      e.style.setProperty('--a1', (-aleatorio(0, 5)).toFixed(2) + 's');
      e.style.setProperty('--a2', (-aleatorio(0, 4)).toFixed(2) + 's');
      estrelas.push(e);
      camada.appendChild(e);
    }
    function posicionar() {
      if (cartao) {
        var rb = base.getBoundingClientRect(), ra = alvo.getBoundingClientRect();
        if (!rb.width || !rb.height) return;
        /* faixas livres (em % do cartão): à esquerda, à direita e no alto da caixa dos personagens */
        var livreE = (ra.left - rb.left) / rb.width * 100, livreD = (rb.right - ra.right) / rb.width * 100;
        var topoY = (ra.top - rb.top) / rb.height * 100;
        var x0 = (ra.left - rb.left) / rb.width * 100, x1 = (ra.right - rb.left) / rb.width * 100;
        var temE = livreE >= 9, temD = livreD >= 9;
        estrelas.forEach(function (e, i) {
          var zona = i < 3 ? 'E' : (i < 6 ? 'D' : 'T');
          if ((zona === 'E' && !temE) || (zona === 'D' && !temD)) zona = 'T';
          var x, y;
          if (zona === 'E') { x = aleatorio(3, Math.max(4, livreE - 4)); y = 14 + (i % 3) * 22 + aleatorio(0, 12); }
          else if (zona === 'D') { x = aleatorio(100 - Math.max(4, livreD - 4) - 0, 100 - 3); y = 14 + ((i - 3) % 3) * 22 + aleatorio(0, 12); }
          else { x = aleatorio(x0 + (x1 - x0) * .22, x0 + (x1 - x0) * .78); y = Math.max(4, topoY + 3) + aleatorio(0, 11); }
          e.style.setProperty('--x', x.toFixed(1) + '%');
          e.style.setProperty('--y', y.toFixed(1) + '%');
        });
      } else {
        /* demais imagens: duas colunas perto das bordas (3 estrelas por lado, 2 nas caixas pequenas) */
        estrelas.forEach(function (e, i) {
          var lado = i % 2, fila = Math.floor(i / 2), faixaY = 70 / porLado;
          e.style.setProperty('--x', (lado ? aleatorio(83, 93) : aleatorio(7, 17)).toFixed(1) + '%');
          e.style.setProperty('--y', (15 + faixaY * (fila + (lado ? .35 : 0)) + aleatorio(0, faixaY * .55)).toFixed(1) + '%');
        });
      }
    }
    posicionar();
    base.appendChild(camada);
    if (cartao) {
      window.addEventListener('load', posicionar);
      var tRedim = null;
      window.addEventListener('resize', function () { clearTimeout(tRedim); tRedim = setTimeout(posicionar, 200); });
    }
  });

  /* entrada suave do texto do topo */
  requestAnimationFrame(function () { html.classList.add('pronto'); });

  /* ---------- o holograma do topo da página inicial ----------
     Parado por padrão (só a abelha se mexe no site). A abertura e o brilho voltam
     com recursos.aberturaTopo: true no config.js. */
  var holo = R.aberturaTopo === true ? document.querySelector('[data-holo]') : null;
  if (holo) {
    var camadaH = holo.querySelector('.holo__faiscas');
    var sats = $$('[data-holo-sat]', holo);
    var acabou = false, ultimoBrilho = 0, quadro = 0;
    var posSat = function (g, ang) {
      var t = ang * Math.PI / 180;
      var x = +g.getAttribute('data-cx') + +g.getAttribute('data-rx') * Math.cos(t);
      var y = +g.getAttribute('data-cy') + +g.getAttribute('data-ry') * Math.sin(t);
      g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
    };
    /* os satélites andam pela órbita (só na abertura e no brilho) e param no lugar de sempre.
       balanco: em vez de chegar, vão um pouco para trás e voltam (sem salto) */
    var andarSats = function (dur, balanco) {
      if (!sats.length || !permitido() || !window.requestAnimationFrame) return;
      cancelAnimationFrame(quadro);
      var t0 = null;
      var passo = function (agora) {
        if (t0 === null) t0 = agora;
        var k = Math.min(1, (agora - t0) / dur);
        var e = 1 - Math.pow(1 - k, 3);
        sats.forEach(function (g) {
          var ate = +g.getAttribute('data-ate'), de = +g.getAttribute('data-de');
          posSat(g, balanco ? ate + (de - ate) * balanco * Math.sin(Math.PI * k) : de + (ate - de) * e);
        });
        if (k < 1) quadro = requestAnimationFrame(passo);
      };
      quadro = requestAnimationFrame(passo);
    };
    var pararSats = function () { cancelAnimationFrame(quadro); sats.forEach(function (g) { posSat(g, +g.getAttribute('data-ate')); }); };
    var concluirHolo = function () {
      acabou = true;
      holo.classList.remove('holo--prep', 'holo--ativo');
    };
    var faiscasHolo = function (atraso) {
      if (!camadaH || !permitido()) return;
      camadaH.innerHTML = '';
      criarFaiscas(camadaH, 16, { atraso: atraso || 0, espalhar: 1, xMin: 8, xMax: 92, yMin: 40, yMax: 100 });
      setTimeout(function () { camadaH.innerHTML = ''; }, 3600);
    };
    if (permitido()) {
      holo.classList.add('holo--prep');
      var abrirHolo = function () {
        if (!permitido()) { concluirHolo(); pararSats(); return; }
        holo.classList.add('holo--ativo');
        andarSats(2600);
        faiscasHolo(1.2);
        setTimeout(concluirHolo, 3000);
      };
      var maoImg = holo.querySelector('.holo__mao picture img');
      var comecarH = function () { requestAnimationFrame(function () { setTimeout(abrirHolo, 120); }); };
      if (maoImg && !maoImg.complete) { maoImg.addEventListener('load', comecarH, { once: true }); maoImg.addEventListener('error', comecarH, { once: true }); setTimeout(function () { if (!acabou && !holo.classList.contains('holo--ativo')) abrirHolo(); }, 1800); }
      else comecarH();
    }
    /* passar o mouse ou tocar: um brilho atravessa a mão (curto, no máximo a cada 3 s) */
    var brilharHolo = function () {
      if (!acabou || !permitido() || Date.now() - ultimoBrilho < 3000) return;
      ultimoBrilho = Date.now();
      holo.classList.remove('holo--brilha'); void holo.offsetWidth;
      holo.classList.add('holo--brilha');
      andarSats(1200, .3);
      faiscasHolo(.15);
      setTimeout(function () { holo.classList.remove('holo--brilha'); }, 1400);
    };
    holo.addEventListener('mouseenter', brilharHolo);
    holo.addEventListener('click', brilharHolo);
    document.addEventListener('inclusivr:movimento', function (e) { if (!e.detail.permitido) { concluirHolo(); pararSats(); holo.classList.remove('holo--brilha'); } });
  }

  /* ---------- as esferas giram nas órbitas ao passar o mouse sobre o logo (pedido de 28/10) ----------
     Só enquanto o mouse está sobre a área do logo (no celular, um toque faz girar por 2 s).
     Cada esfera passa por trás da mão na metade de cima da órbita e pela frente na de baixo.
     Ao sair, elas desaceleram e voltam ao lugar de sempre. Com "reduzir movimento", nada gira.
     recursos.orbitasNoMouse: false desliga. */
  var holoGiro = R.orbitasNoMouse !== false ? document.querySelector('[data-holo]') : null;
  var palcoGiro = holoGiro && holoGiro.querySelector('.holo__palco');
  if (palcoGiro && window.requestAnimationFrame) {
    var svgAtras = holoGiro.querySelector('.holo__orbitas--atras');
    var svgFrente = holoGiro.querySelector('.holo__orbitas--frente');
    var VELOCIDADE = { a: 64, b: 50, c: 78 };   /* graus por segundo, um pouco diferentes para parecer natural */
    var esferas = $$('[data-holo-sat]', holoGiro).map(function (g) {
      var anel = g.parentNode.querySelector('.holo__anel');
      var letra = anel && /holo__anel--([abc])/.exec(anel.getAttribute('class') || '');
      letra = letra ? letra[1] : 'a';
      var grupoDe = function (svg) { var p = svg && svg.querySelector('.holo__anel--' + letra); return p ? p.parentNode : null; };
      return {
        g: g, grupoAtras: grupoDe(svgAtras), grupoFrente: grupoDe(svgFrente),
        cx: +g.getAttribute('data-cx'), cy: +g.getAttribute('data-cy'), rx: +g.getAttribute('data-rx'), ry: +g.getAttribute('data-ry'),
        repouso: +g.getAttribute('data-ate'), ang: +g.getAttribute('data-ate'), w: VELOCIDADE[letra] || 60
      };
    });
    var colocar = function (e) {
      var t = e.ang * Math.PI / 180;
      var x = e.cx + e.rx * Math.cos(t), y = e.cy + e.ry * Math.sin(t);
      e.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
      /* metade de cima da órbita (seno negativo) fica atrás da mão; a de baixo, na frente */
      var destino = Math.sin(t) < 0 ? e.grupoAtras : e.grupoFrente;
      if (destino && e.g.parentNode !== destino) destino.appendChild(e.g);
    };
    var estado = 'parado', ritmo = 0, ultimo = 0, quadroGiro = 0, fimToque = 0, assentar = null, visivelHolo = false;
    var passoGiro = function (agora) {
      var dt = ultimo ? Math.min(.05, (agora - ultimo) / 1000) : 0;
      ultimo = agora;
      if (estado === 'girando') {
        ritmo = Math.min(1, ritmo + dt * 2.2);   /* acelera em menos de meio segundo */
        if (fimToque && agora > fimToque) { fimToque = 0; soltar(); }
        esferas.forEach(function (e) { e.ang = (e.ang + e.w * ritmo * dt) % 360; colocar(e); });
      } else if (estado === 'assentando' && assentar) {
        var k = Math.min(1, (agora - assentar.t0) / assentar.dur);
        var suave = 1 - Math.pow(1 - k, 3);
        esferas.forEach(function (e, i) { e.ang = (assentar.de[i] + assentar.falta[i] * suave) % 360; colocar(e); });
        if (k >= 1) { estado = 'parado'; assentar = null; holoGiro.classList.remove('holo--girando'); }
      }
      if (estado === 'girando' && !visivelHolo) { ultimo = 0; quadroGiro = 0; }   /* fora da tela: não gasta processamento */
      else if (estado !== 'parado') quadroGiro = requestAnimationFrame(passoGiro);
      else { ultimo = 0; quadroGiro = 0; }
    };
    var podeGirar = function () {
      return permitido() && !holoGiro.classList.contains('holo--prep') && !holoGiro.classList.contains('holo--ativo');
    };
    var girar = function () {
      if (!podeGirar()) return;
      estado = 'girando';
      holoGiro.classList.add('holo--girando');
      if (!quadroGiro) quadroGiro = requestAnimationFrame(passoGiro);
    };
    var soltar = function () {
      if (estado !== 'girando') return;
      /* segue em frente até o lugar de repouso de cada esfera, desacelerando */
      var de = [], falta = [], maior = 0;
      esferas.forEach(function (e) {
        var f = ((e.repouso - e.ang) % 360 + 360) % 360;
        if (f < 40) f += 360;   /* sem freada brusca: dá mais uma volta curta */
        de.push(e.ang); falta.push(f);
        maior = Math.max(maior, f / e.w);
      });
      estado = 'assentando';
      assentar = { t0: performance.now(), dur: Math.min(2600, Math.max(900, maior * 1000 * 1.6)), de: de, falta: falta };
      if (!quadroGiro) quadroGiro = requestAnimationFrame(passoGiro);
    };
    /* pedido de 04/11: as esferas giram sempre (sem precisar do mouse), enquanto o holograma está na tela */
    var iniciarGiro = function () { if (visivelHolo && estado !== 'girando' || (visivelHolo && !quadroGiro)) { if (podeGirar()) girar(); } };
    if (window.IntersectionObserver) new IntersectionObserver(function (ents) { visivelHolo = ents[0].isIntersecting; iniciarGiro(); }, { threshold: .05 }).observe(holoGiro);
    else visivelHolo = true;
    setInterval(iniciarGiro, 1500);
    iniciarGiro();
    document.addEventListener('inclusivr:movimento', function (e) {
      if (e.detail.permitido) { iniciarGiro(); return; }
      cancelAnimationFrame(quadroGiro); quadroGiro = 0; ultimo = 0; estado = 'parado'; assentar = null;
      holoGiro.classList.remove('holo--girando');
      esferas.forEach(function (es) { es.ang = es.repouso; colocar(es); });
    });
  }

  /* ---------- cartas grátis (página do livro): o leque abre e fecha uma vez quando aparece ----------
     Ajuda a mostrar que as cartas são interativas (no computador, abrem também ao passar o mouse). Menos de 1,5 s. */
  $$('[data-leque]').forEach(function (leque) {
    if (!permitido()) return;
    quandoVisivel(leque, .6, function () {
      if (!permitido()) return;
      setTimeout(function () {
        leque.classList.add('leque--chama');
        setTimeout(function () { leque.classList.remove('leque--chama'); }, 900);
      }, 350);
    });
  });

  /* ---------- a abelha passeia por uma seção inteira (Por dentro do livro) ----------
     Entra pelo canto de cima, faz um zigue-zague pelo conteúdo e sai pelo canto de baixo.
     Só aparece quando a seção está na tela e o movimento é permitido. */
  var passeios = $$('[data-passeio-abelha]');
  if (passeios.length && R.abelha !== false && 'IntersectionObserver' in window) {
    /* Cada passeio tem o seu caminho (frações da largura e da altura da seção), a velocidade e a pausa entre uma volta e outra.
       "livro" (início, "Um livro para tocar, ver e sinalizar"): o desenho feito pelo Luciano, que entra e sai pela esquerda. */
    var CAMINHOS = {
      padrao: { pts: [[-.12, .04], [.12, .08], [.45, .06], [.80, .11], [.95, .21], [.80, .33], [.45, .35], [.15, .39], [.10, .49], [.40, .55], [.85, .57], [.95, .69], [.70, .79], [.35, .77], [.10, .85], [-.12, .96]], vel: .085, max: 26000, pausa: 1500 },
      livro: { pts: [[-.09, .17], [-.009, .21], [.026, .249], [.056, .275], [.1, .301], [.174, .337], [.255, .337], [.316, .324], [.41, .279], [.464, .249], [.511, .224], [.545, .217], [.575, .217], [.605, .253], [.619, .29], [.626, .365], [.632, .44], [.656, .545], [.686, .593], [.727, .631], [.801, .661], [.868, .659], [.926, .657], [.963, .683], [.966, .71], [.943, .739], [.909, .758], [.841, .777], [.767, .794], [.7, .797], [.639, .792], [.531, .763], [.423, .706], [.369, .668], [.336, .62], [.327, .582], [.343, .552], [.403, .507], [.45, .477], [.498, .425], [.525, .365], [.545, .298], [.546, .23], [.535, .174], [.498, .133], [.437, .107], [.356, .093], [.255, .082], [.181, .082], [.14, .09], [.117, .109], [.086, .144], [.056, .173], [-.04, .215], [-.14, .25]], vel: .12, max: 26000, pausa: 5000 }
    };

    /* "historia" (Quem somos, "Nossa história"): o desenho feito pelo Luciano. Entra pela esquerda, passa ao lado do título,
       dá as voltas no espaço vazio da direita (acima do urso) e sai pela direita. Só em telas largas. */
    CAMINHOS.historia = { pts: [[-.06, .13], [.06, .12], [.18, .13], [.32, .15], [.46, .17], [.58, .18], [.66, .24], [.67, .38], [.66, .52], [.68, .64], [.72, .72], [.77, .66], [.8, .52], [.79, .38], [.76, .26], [.78, .16], [.83, .12], [.88, .14], [.9, .2], [.86, .25], [.84, .19], [.88, .13], [.93, .2], [.97, .25], [1.03, .19], [1.1, .14]], vel: .1, max: 26000, pausa: 4000, minLargura: 900 };
    var curva = function (pts, n) {
      var out = [];
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        for (var k = 0; k < n; k++) {
          var t = k / n, t2 = t * t, t3 = t2 * t;
          out.push([
            .5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
            .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
          ]);
        }
      }
      out.push(pts[pts.length - 1]);
      return out;
    };
    passeios.forEach(function (faixa) {
      var secao = faixa.parentElement, voandoP = null, visivelP = false, fim = 0, vezes = 0;
      var cfg = CAMINHOS[faixa.getAttribute('data-passeio-abelha')] || CAMINHOS.padrao, CAMINHO = cfg.pts;
      var passear = function () {
        if (voandoP || !visivelP || !permitido() || document.hidden) return;
        if (Date.now() - fim < (vezes ? cfg.pausa : 1200)) return;
        var w = faixa.clientWidth, h = faixa.clientHeight;
        if (w < (cfg.minLargura || 200) || h < 300) return;
        vezes++;
        var ab = document.createElement('div');
        ab.className = 'abelha';
        ab.setAttribute('aria-hidden', 'true');
        ab.innerHTML = '<img class="abelha__asas" alt="" src="' + raiz + 'assets/img/personagens/abelha-asas.webp">' +
          '<img class="abelha__corpo" alt="" src="' + raiz + 'assets/img/personagens/abelha-corpo.webp">';
        faixa.appendChild(ab); voandoP = ab;
        var tam = ab.offsetWidth || 50;
        var pts = curva(CAMINHO, 10).map(function (p) { return [p[0] * w - tam / 2, p[1] * h - tam / 2]; });
        var comp = 0, i;
        for (i = 1; i < pts.length; i++) comp += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        var dur = Math.round(Math.min(cfg.max, Math.max(12000, comp / cfg.vel)));
        /* velocidade constante: refaz os pontos de 8 em 8 px ao longo do caminho (os pontos da curva ficam mais
           juntos em umas partes que em outras, e isso fazia a abelha acelerar e frear) */
        var uni = [pts[0]], falta = 8;
        for (i = 1; i < pts.length; i++) {
          var sx = pts[i][0] - pts[i - 1][0], sy = pts[i][1] - pts[i - 1][1], sl = Math.hypot(sx, sy), pos = 0;
          if (!sl) continue;
          while (sl - pos >= falta) {
            pos += falta;
            uni.push([pts[i - 1][0] + sx * pos / sl, pts[i - 1][1] + sy * pos / sl]);
            falta = 8;
          }
          falta -= sl - pos;
        }
        uni.push(pts[pts.length - 1]);
        /* sem tremida: só uma inclinação suave do corpo conforme sobe ou desce, e um balanço bem leve */
        var quadros = [], dir = 1, inc = 0, N = uni.length;
        for (i = 0; i < N; i++) {
          var p0 = uni[Math.max(0, i - 4)], p1 = uni[Math.min(N - 1, i + 4)];
          var ddx = p1[0] - p0[0], ddy = p1[1] - p0[1];
          if (Math.abs(ddx) > 6) dir = ddx > 0 ? -1 : 1;
          var alvo = Math.max(-16, Math.min(16, Math.atan2(ddy, Math.max(Math.abs(ddx), 8)) * 57.3 * .45)) * -dir;
          inc += (alvo - inc) * .12;
          quadros.push({ transform: 'translate(' + uni[i][0].toFixed(1) + 'px,' + (uni[i][1] + Math.sin(i * .09) * 2.5).toFixed(1) + 'px) rotate(' + inc.toFixed(1) + 'deg) scaleX(' + dir + ')' });
        }
        var anim = ab.animate(quadros, { duration: dur, easing: 'linear', fill: 'forwards' });
        anim.onfinish = function () { ab.remove(); if (voandoP === ab) voandoP = null; fim = Date.now(); setTimeout(passear, cfg.pausa + 100); };
      };
      new IntersectionObserver(function (ents) { visivelP = ents[0].isIntersecting; passear(); }, { threshold: .2 }).observe(secao);
      setInterval(passear, 700);
      var parar = function () { if (voandoP) { voandoP.remove(); voandoP = null; fim = Date.now(); } };
      document.addEventListener('inclusivr:movimento', function (e) { if (!e.detail.permitido) parar(); });
      document.addEventListener('visibilitychange', function () { if (document.hidden) parar(); });
    });
  }

  /* ---------- a abelha do livro voando ---------- */
  var faixas = $$('[data-abelha]');
  if (faixas.length && R.abelha !== false && 'IntersectionObserver' in window) {
    var voando = null, ultimoVoo = 0, voos = 0, MAX_VOOS = 3, INTERVALO = 9000;
    var visiveisAbelha = [];
    var obsA = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var k = visiveisAbelha.indexOf(en.target);
        if (en.isIntersecting && en.intersectionRatio >= .5) { if (k === -1) visiveisAbelha.push(en.target); }
        else if (k !== -1) visiveisAbelha.splice(k, 1);
      });
      tentarVoo();
    }, { threshold: [0, .5, 1] });
    faixas.forEach(function (f) { obsA.observe(f); });
    var tentarVoo = function () {
      if (voando || !permitido() || document.hidden || voos >= MAX_VOOS || !visiveisAbelha.length) return;
      if (Date.now() - ultimoVoo < (voos ? INTERVALO : 1800)) return;
      voar(visiveisAbelha[Math.floor(Math.random() * visiveisAbelha.length)]);
    };
    setInterval(tentarVoo, 1500);
    var voar = function (faixa) {
      voos++; ultimoVoo = Date.now();
      var largura = faixa.clientWidth, altura = faixa.clientHeight;
      if (largura < 200 || altura < 40) { voando = null; return; }
      var abelha = document.createElement('div');
      abelha.className = 'abelha';
      abelha.setAttribute('aria-hidden', 'true');
      abelha.innerHTML = '<img class="abelha__asas" alt="" src="' + raiz + 'assets/img/personagens/abelha-asas.webp">' +
        '<img class="abelha__corpo" alt="" src="' + raiz + 'assets/img/personagens/abelha-corpo.webp">';
      faixa.appendChild(abelha);
      voando = abelha;
      var tam = abelha.offsetWidth || 50;
      var praDireita = Math.random() < .55;
      var x0 = praDireita ? -tam - 10 : largura + 10, x1 = praDireita ? largura + 10 : -tam - 10;
      /* a faixa é o respiro do alto da seção: o voo fica todo dentro dela */
      var folga = Math.max(0, altura - tam * 1.05);
      var amp = Math.min(aleatorio(10, 22), folga / 3), ondas = aleatorio(1.6, 2.4);
      var yBase = Math.min(folga, Math.max(0, folga / 2 + aleatorio(-folga / 6, folga / 6)));
      var dur = Math.round(Math.min(4800, Math.max(3400, largura * 3.6)));
      var quadros = [];
      for (var i = 0; i <= 30; i++) {
        var t = i / 30;
        var x = x0 + (x1 - x0) * t;
        var y = Math.max(0, Math.min(folga, yBase + Math.sin(t * Math.PI * 2 * ondas) * amp));
        var incl = Math.cos(t * Math.PI * 2 * ondas) * 10;
        /* a abelha olha para onde voa: a arte original olha para a esquerda */
        quadros.push({ transform: 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + incl.toFixed(1) + 'deg) scaleX(' + (praDireita ? -1 : 1) + ')' });
      }
      var anim = abelha.animate(quadros, { duration: dur, easing: 'linear', fill: 'forwards' });
      anim.onfinish = function () { abelha.remove(); if (voando === abelha) voando = null; ultimoVoo = Date.now(); };
    };
    document.addEventListener('inclusivr:movimento', function (e) { if (!e.detail.permitido && voando) { voando.remove(); voando = null; } });
    document.addEventListener('visibilitychange', function () { if (document.hidden && voando) { voando.remove(); voando = null; } });
  }

  /* ---------- mini-jogo: os 5 animais escondidos ---------- */
  var ANIMAIS = {
    abelha: { nome: 'abelha', artigo: 'a', letra: 'A', lugar: 'na página inicial' },
    elefante: { nome: 'elefante', artigo: 'o', letra: 'E', lugar: 'na página inicial' },
    iguana: { nome: 'iguana', artigo: 'a', letra: 'I', lugar: 'na página do livro' },
    onca: { nome: 'onça', artigo: 'a', letra: 'O', lugar: 'na página do livro' },
    urso: { nome: 'urso', artigo: 'o', letra: 'U', lugar: 'na página de apps' }
  };
  var ORDEM = ['abelha', 'elefante', 'iguana', 'onca', 'urso'];
  var ligado = R.animaisEscondidos !== false;
  var escondidos = $$('[data-animal-escondido]');
  var caca = document.querySelector('[data-caca]');
  var achados = [];
  try { achados = JSON.parse(guarda.ler('inclusivr:animais') || '[]') || []; } catch (e) { achados = []; }
  achados = achados.filter(function (a) { return ORDEM.indexOf(a) !== -1; });
  var premioInfo = null;
  try { premioInfo = JSON.parse(guarda.ler('inclusivr:animais-premio') || 'null'); } catch (e) { premioInfo = null; }

  /* textos do prêmio: o que estiver entre *asteriscos* fica em destaque; {cupom} vira o código */
  var campP = IVR.campanhaAtiva && C.campanha ? C.campanha : null;
  var premioCamp = campP && (R.recompensaAnimais || {}).campanha ? (R.recompensaAnimais || {}).campanha : null;
  function textoCupom(t) { return String(t || '').split('{cupom}').join(campP && campP.cupom ? campP.cupom : ''); }
  function escrever(el, texto) {
    if (!el) return;
    el.textContent = '';
    textoCupom(texto).split('*').forEach(function (parte, i) {
      if (!parte) return;
      if (i % 2) { var b = document.createElement('strong'); b.textContent = parte; el.appendChild(b); }
      else el.appendChild(document.createTextNode(parte));
    });
  }
  function premioTexto(chave) {
    var P = R.recompensaAnimais || {};
    if (premioCamp && premioCamp[chave] !== undefined) return textoCupom(premioCamp[chave]);
    return P[chave] || '';
  }

  function atualizarCaca() {
    if (!caca) return;
    var n = achados.length;
    $$('[data-caca-animal]', caca).forEach(function (li) {
      var a = li.getAttribute('data-caca-animal');
      var ok = achados.indexOf(a) !== -1;
      li.classList.toggle('achado', ok);
      var s = li.querySelector('.visualmente-oculto');
      if (s) s.textContent = ANIMAIS[a].nome.charAt(0).toUpperCase() + ANIMAIS[a].nome.slice(1) + (ok ? ': encontrado' : ': ainda escondido');
    });
    var prog = caca.querySelector('[data-caca-progresso]');
    if (prog) prog.textContent = n === 0 ? 'Nenhum encontrado ainda.' : n === 5 ? 'Você encontrou todos!' : 'Você já encontrou ' + n + ' de 5.';
    var bt = caca.querySelector('[data-premio-abrir]');
    if (bt) bt.hidden = n < 5;
  }

  /* o prêmio: janela para tirar print e mandar para a equipe */
  var dialogo = null;
  function dataExibicao(iso) {
    try { var d = new Date(iso); return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return ''; }
  }
  function abrirPremio(gatilho) {
    var P = R.recompensaAnimais || {};
    var K = C.contato || {};
    if (!premioInfo) { premioInfo = { data: new Date().toISOString(), codigo: 'BICHOS-' + Math.random().toString(36).slice(2, 7).toUpperCase() }; guarda.gravar('inclusivr:animais-premio', JSON.stringify(premioInfo)); }
    if (typeof HTMLDialogElement === 'undefined') {
      IVR.aviso && IVR.aviso({ titulo: premioTexto('titulo') || 'Você encontrou os 5 animais!', texto: premioTexto('texto') + ' ' + premioTexto('instrucoes'), tempo: 15000 });
      return;
    }
    if (!dialogo) {
      dialogo = document.createElement('dialog');
      dialogo.className = 'premio';
      dialogo.setAttribute('aria-labelledby', 'premio-titulo');
      var cartas = ORDEM.map(function (a) { return '<img src="' + raiz + 'assets/img/cartas/animal-' + a + '.webp" alt="" width="300" height="440">'; }).join('');
      dialogo.innerHTML = '<div class="premio__miolo">' +
        '<button type="button" class="icone-botao premio__fechar" data-fechar aria-label="Fechar">' + ((IVR.ICONES || {}).fechar || '×') + '</button>' +
        '<p class="cartela cartela--rosa premio__selo">MISSÃO CUMPRIDA!</p>' +
        '<h2 id="premio-titulo"></h2>' +
        '<div class="premio__cartas" aria-hidden="true">' + cartas + '</div>' +
        '<p class="premio__desconto"></p>' +
        '<p class="premio__texto"></p>' +
        '<p class="premio__instrucoes"></p>' +
        '<p class="premio__codigo"><span>Código</span> <strong data-codigo></strong> <span data-data></span></p>' +
        '<div class="acoes"><a class="botao botao--roxo" data-premio-whats target="_blank" rel="noopener">Enviar pelo WhatsApp</a>' +
        '<a class="botao botao--roxo" data-premio-loja hidden>Comprar o livro</a>' +
        '<button type="button" class="botao botao--contorno" data-fechar>Fechar</button></div></div>';
      document.body.appendChild(dialogo);
      $$('[data-fechar]', dialogo).forEach(function (b) { b.addEventListener('click', function () { dialogo.close(); }); });
      dialogo.addEventListener('click', function (e) { if (e.target === dialogo) dialogo.close(); });
      dialogo.addEventListener('close', function () { if (dialogo.__gatilho && dialogo.__gatilho.focus) dialogo.__gatilho.focus(); });
    }
    dialogo.querySelector('#premio-titulo').textContent = premioTexto('titulo') || 'Você encontrou os 5 animais!';
    dialogo.querySelector('.premio__desconto').textContent = premioTexto('desconto') || '10% de desconto';
    dialogo.querySelector('.premio__texto').textContent = premioTexto('texto');
    dialogo.querySelector('.premio__instrucoes').textContent = premioTexto('instrucoes');
    var codigo = dialogo.querySelector('.premio__codigo');
    var wa = dialogo.querySelector('[data-premio-whats]');
    var loja = dialogo.querySelector('[data-premio-loja]');
    if (premioCamp) {
      /* em campanha: o cupom é o da campanha; não precisa de print nem de código */
      codigo.hidden = true; wa.hidden = true;
      loja.href = IVR.linkLoja ? IVR.linkLoja('livro', 'premio-animais') : '#';
      loja.hidden = false;
    } else {
      codigo.hidden = false; loja.hidden = true;
      dialogo.querySelector('[data-codigo]').textContent = premioInfo.codigo;
      dialogo.querySelector('[data-data]').textContent = dataExibicao(premioInfo.data);
      if (K.whatsapp) {
        wa.href = 'https://wa.me/' + K.whatsapp + '?text=' + encodeURIComponent((P.mensagemWhatsapp || '') + ' Código: ' + premioInfo.codigo);
        wa.hidden = false;
      } else wa.hidden = true;
    }
    dialogo.__gatilho = gatilho || document.activeElement;
    dialogo.showModal();
    if (permitido()) IVR.faiscas(dialogo.querySelector('.premio__cartas'), { quantidade: 26, espalhar: 1 });
  }
  IVR.abrirPremio = abrirPremio;

  if (ligado && (escondidos.length || caca)) {
    html.classList.add('animais-ativos');
    if (caca) {
      caca.hidden = false;
      var chamada = premioCamp ? premioCamp.chamada : (R.recompensaAnimais || {}).chamada;
      if (chamada) escrever(caca.querySelector('[data-caca-oferta]'), chamada);
      atualizarCaca();
      var btP = caca.querySelector('[data-premio-abrir]');
      if (btP) btP.addEventListener('click', function () { abrirPremio(btP); });
    }
    escondidos.forEach(function (b) {
      var a = b.getAttribute('data-animal-escondido');
      var rotular = function () { var inf = ANIMAIS[a]; if (inf) b.setAttribute('aria-label', 'Você já encontrou ' + inf.artigo + ' ' + inf.nome + '.'); };
      if (achados.indexOf(a) !== -1) { b.classList.add('encontrado'); rotular(); }
      /* quando aparece na tela pela primeira vez, o bichinho se mexe um pouco (fica mais fácil de achar) */
      if (achados.indexOf(a) === -1) {
        quandoVisivel(b, .9, function () {
          if (!permitido() || b.classList.contains('encontrado')) return;
          setTimeout(function () { b.classList.add('chama'); setTimeout(function () { b.classList.remove('chama'); }, 1700); }, 600);
        });
      }
      b.addEventListener('click', function () {
        var info = ANIMAIS[a];
        if (!info) return;
        var novo = achados.indexOf(a) === -1;
        if (novo) { achados.push(a); guarda.gravar('inclusivr:animais', JSON.stringify(achados)); }
        b.classList.add('encontrado');
        rotular();
        IVR.faiscas(b, { quantidade: 10 });
        atualizarCaca();
        var faltam = ORDEM.filter(function (x) { return achados.indexOf(x) === -1; });
        var dica = '';
        if (faltam.length) {
          var lugares = [];
          faltam.forEach(function (x) { if (lugares.indexOf(ANIMAIS[x].lugar) === -1) lugares.push(ANIMAIS[x].lugar); });
          dica = (faltam.length === 1 ? 'Falta 1 animal. ' : 'Faltam ' + faltam.length + ' animais. ') + 'Dica: procure ' + lugares.join(' e ') + '.';
        }
        if (IVR.aviso) IVR.aviso({
          titulo: 'Você encontrou ' + info.artigo + ' ' + info.nome + '!',
          texto: 'A runa da letra ' + info.letra + ' acendeu. ' + (faltam.length ? dica : 'Esse era o último!'),
          imagens: [raiz + 'assets/img/cartas/animal-' + a + '.webp'],
          tempo: 8000
        });
        if (!faltam.length && novo) setTimeout(function () { abrirPremio(b); }, 1400);
      });
    });
  }
})();


/* Logo do rodapé: aparece como holograma quando o rodapé chega na tela (uma vez). */
(function () {
  'use strict';
  var img = document.querySelector('.rodape__marca .marca-escura');
  if (!img || !img.parentNode) return;
  var caixa = document.createElement('span');
  caixa.className = 'holo-marca';
  img.parentNode.insertBefore(caixa, img);
  caixa.appendChild(img);
  var parado = document.documentElement.classList.contains('sem-movimento') ||
    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (parado || !('IntersectionObserver' in window)) { caixa.classList.add('holo-pronto'); return; }
  caixa.classList.add('holo-pronto');
  var alvo = document.querySelector('.rodape') || caixa;
  var io = new IntersectionObserver(function (e) {
    if (!e[0].isIntersecting) return;
    caixa.classList.add('holo-ativo');
    io.disconnect();
  }, { threshold: 0.35 });
  io.observe(alvo);
})();
