/* =============================================================================
   InclusiVR — visualizador do PDF das cartas (página App e Jogos)
   Sem JavaScript, as páginas aparecem numa fileira que se arrasta. Com JavaScript,
   mostra uma página por vez, com setas, miniaturas e o teclado (setas e Home/End).
   As páginas são imagens do próprio PDF; o PDF em si abre/baixa pelos botões.
   ============================================================================= */
(function () {
  'use strict';
  var el = document.querySelector('[data-pdfv]');
  if (!el) return;
  var lista = el.querySelector('.pdfv__paginas');
  var paginas = Array.prototype.slice.call(el.querySelectorAll('.pdfv__pagina'));
  if (!lista || paginas.length < 2) return;
  var atual = 0;

  var barra = document.createElement('div');
  barra.className = 'pdfv__barra';
  var ant = document.createElement('button');
  ant.type = 'button'; ant.className = 'pdfv__seta pdfv__seta--ant'; ant.setAttribute('aria-label', 'Página anterior');
  ant.innerHTML = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 5.5L8 12l6.5 6.5"/></svg>';
  var prox = document.createElement('button');
  prox.type = 'button'; prox.className = 'pdfv__seta pdfv__seta--prox'; prox.setAttribute('aria-label', 'Próxima página');
  prox.innerHTML = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.5 5.5L16 12l-6.5 6.5"/></svg>';
  var info = document.createElement('p');
  info.className = 'pdfv__info'; info.setAttribute('aria-live', 'polite');
  barra.appendChild(ant); barra.appendChild(info); barra.appendChild(prox);

  var minis = document.createElement('div');
  minis.className = 'pdfv__minis';
  var botoes = paginas.map(function (p, i) {
    var img = p.querySelector('img');
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pdfv__mini';
    b.setAttribute('aria-label', 'Ir para a página ' + (i + 1) + ': ' + p.getAttribute('data-legenda'));
    var m = document.createElement('img');
    m.src = img.getAttribute('data-mini') || img.src; m.alt = ''; m.width = 200; m.height = 283; m.decoding = 'async';
    b.appendChild(m);
    b.addEventListener('click', function () { ir(i, true); });
    minis.appendChild(b);
    return b;
  });

  function ir(n, foco) {
    atual = Math.max(0, Math.min(paginas.length - 1, n));
    paginas.forEach(function (p, i) { p.hidden = i !== atual; });
    botoes.forEach(function (b, i) { if (i === atual) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    var leg = paginas[atual].getAttribute('data-legenda');
    info.textContent = '';
    var a = document.createElement('strong'); a.textContent = 'Página ' + (atual + 1) + ' de ' + paginas.length;
    var b = document.createElement('span'); b.textContent = leg;
    info.appendChild(a); info.appendChild(b);
    ant.disabled = atual === 0; prox.disabled = atual === paginas.length - 1;
    /* clicar na página abre o PDF no navegador, já na página que está na tela */
    var link = paginas[atual].querySelector('a');
    if (link) {
      var h = link.getAttribute('data-pdf') || link.getAttribute('href').split('#')[0];
      link.setAttribute('data-pdf', h);
      link.href = h + '#page=' + (atual + 1);
      link.title = 'Clique para abrir o PDF no navegador';
    }
    if (foco) botoes[atual].focus({ preventScroll: true });
  }
  ant.addEventListener('click', function () { ir(atual - 1); });
  prox.addEventListener('click', function () { ir(atual + 1); });
  el.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { ir(atual + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { ir(atual - 1); e.preventDefault(); }
    else if (e.key === 'Home') { ir(0); e.preventDefault(); }
    else if (e.key === 'End') { ir(paginas.length - 1); e.preventDefault(); }
  });

  var dica = document.createElement('p');
  dica.className = 'pdfv__dica micro';
  dica.textContent = 'Clique na página para abrir o PDF no navegador.';
  el.insertBefore(barra, lista);
  el.appendChild(minis);
  el.appendChild(dica);
  el.classList.add('pdfv--js');
  paginas.forEach(function (p) { var a = p.querySelector('a'); if (a) a.tabIndex = 0; });
  ir(0);
  /* a tradução para o inglês (traducao.js) observa a página e traduz os textos desta barra sozinha */
})();
