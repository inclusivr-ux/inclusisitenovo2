/* =============================================================================
   InclusiVR Analytics — coleta anônima de uso do site (própria, sem terceiros)
   - Um código aleatório por navegador (sem nome, e-mail, IP ou "impressão digital").
   - Sessão nova depois de 30 minutos sem atividade.
   - Tempo ativo: só conta com a página visível e com interação recente.
   - Eventos vão em pequenos lotes; se a rede falhar, ficam numa fila curta
     no navegador e são reenviados depois. Sem cookies.
   - Não coleta nada do que é digitado em formulários.
   - Respeita "Não rastrear"/GPC do navegador e a opção da página de privacidade.
   - Também roda na loja (loja.inclusivr.com.br): as sessões de lá ficam marcadas
     como "loja". Ao clicar num link do site para a loja, o código anônimo vai junto
     no fim do endereço (#iva_v=...), para ligar a visita do site à da loja; a loja
     tira esse pedaço do endereço na hora (plugin "InclusiVR Analytics" da loja).
   API pública (para os minijogos):
     InclusiVRAnalytics.gameStart(id) · gameComplete(id, dados) · gameExit(id) ·
     gameProgress(id, dados) · trackPage(id)
   ============================================================================= */
(function () {
  'use strict';
  var script = document.currentScript;
  var ENDPOINT = script ? new URL('../../analytics/api/collect.php', script.src).href : '/analytics/api/collect.php';
  var HOSTS = ['inclusivr.com.br', 'www.inclusivr.com.br', 'loja.inclusivr.com.br'];
  var LOJA = location.hostname === 'loja.inclusivr.com.br';
  var INATIVIDADE = 30 * 60 * 1000;      /* sessão nova após 30 min sem atividade */
  var OCIOSO = 60 * 1000;                /* sem interação há 60 s = não conta como tempo ativo */
  var PULSO = 5000;                      /* mede o tempo ativo a cada 5 s (só na memória) */
  var ENVIO = 30000;                     /* manda o tempo ativo acumulado no máximo a cada 30 s */
  var FILA_MAX = 200, LOTE_MAX = 40;
  var VISITANTE_DIAS = 395;              /* o código anônimo é trocado depois de ~13 meses */
  var P = 'iva:';

  var noop = function () {};
  var apiVazia = { gameStart: noop, gameComplete: noop, gameExit: noop, gameProgress: noop, trackPage: noop, ativo: false };

  /* ---------- armazenamento (com proteção para navegadores que bloqueiam) ---------- */
  var ls = (function () { try { var k = P + 't'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } })();
  var mem = {};
  function ler(k) { try { return ls ? ls.getItem(P + k) : mem[k] || null; } catch (e) { return null; } }
  function gravar(k, v) { try { if (ls) ls.setItem(P + k, v); else mem[k] = v; } catch (e) { /* cheio: segue sem guardar */ } }
  function apagar(k) { try { if (ls) ls.removeItem(P + k); delete mem[k]; } catch (e) {} }
  function lerJSON(k, pad) { try { var v = JSON.parse(ler(k)); return v === null || v === undefined ? pad : v; } catch (e) { return pad; } }

  /* ---------- quando NÃO coletar ---------- */
  var debug = /[?&]iva-debug=1/.test(location.search);
  function desligado() {
    if (HOSTS.indexOf(location.hostname) === -1 && !debug) return true;      /* prévias e cópias do site */
    if (navigator.webdriver && !debug) return true;                             /* robôs de teste */
    if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1') return true;
    if (ler('optout') === '1' || ler('naocontar') === '1') return true;
    return false;
  }
  /* ---------- página de privacidade: mostra o código e liga/desliga a medição ---------- */
  function painelPrivacidade() {
    var box = document.querySelector('[data-iva-privacidade]');
    if (!box) return;
    var v = lerJSON('v', null), off = ler('optout') === '1';
    box.textContent = '';
    var p1 = document.createElement('p');
    p1.textContent = off ? 'A medição está desligada neste navegador.' : 'A medição está ligada neste navegador.';
    box.appendChild(p1);
    if (v && v.id) {
      var p2 = document.createElement('p'); p2.appendChild(document.createTextNode('Seu código anônimo neste navegador:'));
      var c = document.createElement('code'); c.textContent = v.id; c.style.marginLeft = '.4em'; c.style.wordBreak = 'break-all';
      p2.appendChild(c); box.appendChild(p2);
      var p3 = document.createElement('p'); p3.className = 'pequeno texto-suave';
      p3.textContent = 'Para pedir que apaguemos os registros ligados a este código, envie o código para contato@inclusivr.com.br.';
      box.appendChild(p3);
    }
    var b = document.createElement('button'); b.type = 'button'; b.className = 'botao botao--contorno';
    b.textContent = off ? 'Ligar a medição' : 'Desligar a medição';
    b.addEventListener('click', function () {
      if (off) apagar('optout'); else { gravar('optout', '1'); apagar('q'); }
      location.reload();
    });
    box.appendChild(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', painelPrivacidade); else painelPrivacidade();

  /* ---------- link do site para a loja: leva o código anônimo (ou o "não contar") ---------- */
  function marcarLinkLoja(e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var u; try { u = new URL(a.href, location.href); } catch (er) { return; }
    if (u.hostname !== 'loja.inclusivr.com.br' || u.hostname === location.hostname) return;
    if (u.hash && !/^#iva_/.test(u.hash)) return;           /* o link já aponta para um trecho da página */
    var marca;
    if (ler('optout') === '1' || ler('naocontar') === '1') marca = 'iva_off=1';
    else { var v = lerJSON('v', null); if (!v || !v.id || desligado()) return; marca = 'iva_v=' + v.id; }
    a.href = u.href.split('#')[0] + '#' + marca;
  }
  document.addEventListener('click', marcarLinkLoja, true);
  document.addEventListener('auxclick', marcarLinkLoja, true);

  if (desligado()) { window.InclusiVRAnalytics = apiVazia; return; }

  /* ---------- identificadores ---------- */
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(b); else for (var i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }
  function visitante() {
    var v = lerJSON('v', null);
    if (!v || !v.id || Date.now() - (v.criado || 0) > VISITANTE_DIAS * 864e5) { v = { id: uuid(), criado: Date.now() }; gravar('v', JSON.stringify(v)); }
    return v.id;
  }
  var VID = visitante();
  painelPrivacidade();

  /* sessão compartilhada entre as abas do mesmo navegador */
  function sessao(atividade) {
    var s = lerJSON('s', null), agora = Date.now(), nova = false;
    if (!s || !s.id || agora - (s.ultimo || 0) > INATIVIDADE) { s = { id: uuid(), inicio: agora, ultimo: agora }; nova = true; }
    if (atividade || nova) { s.ultimo = agora; gravar('s', JSON.stringify(s)); }
    return { id: s.id, nova: nova };
  }

  /* ---------- nome da página: o caminho, sem barras nas pontas ---------- */
  var paginaFixa = script && script.getAttribute('data-pagina');
  function paginaAtual() {
    if (paginaFixa) return paginaFixa;
    var p = location.pathname.replace(/index\.html?$/, '').replace(/^\/+|\/+$/g, '').toLowerCase();
    p = p.replace(/[^a-z0-9/_-]/g, '');
    return ((LOJA ? 'loja/' : '') + (p || 'inicio')).slice(0, 80);
  }

  /* ---------- fila e envio ---------- */
  var fila = lerJSON('q', []);
  if (!Array.isArray(fila)) fila = [];
  var espera = 0, proximaTentativa = 0, enviando = false;

  /* de onde a pessoa chegou: só a categoria, nunca o endereço */
  function origemVisita() {
    var r; try { r = new URL(document.referrer); } catch (e) { return 'direto'; }
    var h = r.hostname.replace(/^www\./, '');
    if (r.hostname === location.hostname) return null;      /* veio de outra página daqui mesmo */
    if (h === 'inclusivr.com.br') return 'site';
    if (h === 'loja.inclusivr.com.br') return 'loja';
    if (/(^|\.)google\./.test(h)) return 'google';
    if (/(^|\.)(bing\.com|duckduckgo\.com|yahoo\.com|ecosia\.org|search\.brave\.com)$/.test(h)) return 'busca';
    if (/(^|\.)instagram\.com$/.test(h)) return 'instagram';
    if (/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(h)) return 'facebook';
    if (/(^|\.)(whatsapp\.com|wa\.me)$/.test(h)) return 'whatsapp';
    if (/(^|\.)(youtube\.com|youtu\.be)$/.test(h)) return 'youtube';
    if (/(^|\.)tiktok\.com$/.test(h)) return 'tiktok';
    if (/(^|\.)(linkedin\.com|lnkd\.in)$/.test(h)) return 'linkedin';
    if (/mercadopago|mercadolivre|mercadolibre|pagseguro|paypal|stripe|pagar\.me/.test(h)) return 'pagamento';
    return 'outro';
  }
  var primeiraCarga = true;
  function enfileirar(tipo, dados, atividade) {
    var s = sessao(atividade !== false);
    if (s.nova) {
      /* sessão nova: registra a página (e, se acabou de chegar, de onde veio) */
      var o = primeiraCarga ? origemVisita() : null, d0 = o ? { origem: o } : null;
      if (tipo === 'page_view') dados = d0; else adicionar('page_view', s.id, d0);
    }
    primeiraCarga = false;
    adicionar(tipo, s.id, dados);
  }
  function adicionar(tipo, sid, dados) {
    fila = lerJSON('q', fila);
    if (!Array.isArray(fila)) fila = [];
    var ev = { id: uuid(), s: sid, t: tipo, p: paginaAtual(), ts: Date.now() };
    if (dados) ev.d = dados;
    fila.push(ev);
    if (fila.length > FILA_MAX) fila = fila.slice(fila.length - FILA_MAX); /* fila curta: descarta os mais antigos */
    gravar('q', JSON.stringify(fila));
  }
  function remover(ids) {
    var mapa = {}; ids.forEach(function (i) { mapa[i] = 1; });
    fila = lerJSON('q', fila).filter(function (e) { return !mapa[e.id]; });
    gravar('q', JSON.stringify(fila));
  }
  function corpo(lote) { return JSON.stringify({ v: VID, agora: Date.now(), e: lote }); }

  function enviar(saindo) {
    fila = lerJSON('q', fila);
    if (!fila.length) return;
    var lote = fila.slice(0, LOTE_MAX), ids = lote.map(function (e) { return e.id; });
    if (saindo) {
      /* saindo da página: sendBeacon chega mesmo com a aba fechando */
      var ok = false;
      try { ok = navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([corpo(lote)], { type: 'text/plain;charset=UTF-8' })); } catch (e) { ok = false; }
      if (ok) remover(ids);
      return;
    }
    if (enviando || Date.now() < proximaTentativa) return;
    enviando = true;
    fetch(ENDPOINT, { method: 'POST', body: corpo(lote), keepalive: true, credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=UTF-8' } })
      .then(function (r) {
        enviando = false;
        if (r.ok || r.status === 202 || r.status === 400 || r.status === 413) {
          /* 400/413: lote com problema — descarta para não travar a fila */
          remover(ids); espera = 0;
          if (lerJSON('q', []).length) setTimeout(enviar, 300);
        } else falhou();
      })
      .catch(function () { enviando = false; falhou(); });
  }
  function falhou() {
    espera = Math.min(espera ? espera * 2 : 15000, 600000);
    proximaTentativa = Date.now() + espera;
  }

  /* ---------- tempo ativo ---------- */
  var ultimaInteracao = Date.now(), ultimoPulso = Date.now(), acumulado = 0, ultimoEnvio = Date.now();
  /* marca atividade na sessão; se ela tinha expirado (30 min parada), abre outra e registra a página */
  function garantirSessao() {
    var s = sessao(true);
    if (s.nova) { adicionar('page_view', s.id, null); enviar(); }
  }
  function interagiu() {
    var antes = ultimaInteracao;
    ultimaInteracao = Date.now();
    if (ultimaInteracao - antes > OCIOSO) garantirSessao();
  }
  var ultimoMovimento = 0;
  ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'].forEach(function (t) { window.addEventListener(t, interagiu, { passive: true, capture: true }); });
  window.addEventListener('pointermove', function () { var n = Date.now(); if (n - ultimoMovimento > 2000) { ultimoMovimento = n; interagiu(); } }, { passive: true });
  /* vídeos: os que tocam sozinhos e sem som (prévias do site) não contam; contam os que a
     pessoa pôs para tocar ou cujo som ligou */
  var ultimoToque = { t: 0, el: null };
  ['pointerdown', 'keydown'].forEach(function (t) { window.addEventListener(t, function (e) { ultimoToque = { t: Date.now(), el: e.target }; }, true); });
  /* a pessoa acabou de tocar/clicar no vídeo ou no botão dele? */
  function escolheu(v) {
    var el = ultimoToque.el, perto = v.parentElement && v.parentElement.parentElement;
    return Date.now() - ultimoToque.t < 1500 && !!el && el.nodeType === 1 && (el === v || (perto && perto.contains(el)));
  }
  function assistindo() {
    var vs = document.getElementsByTagName('video');
    for (var i = 0; i < vs.length; i++) if (!vs[i].paused && !vs[i].ended && (vs[i].__ivaEscolhido || !vs[i].muted)) return true;
    return false;
  }

  function pulso() {
    var agora = Date.now(), passou = Math.min(agora - ultimoPulso, PULSO * 2);
    ultimoPulso = agora;
    if (document.visibilityState === 'visible' && (agora - ultimaInteracao < OCIOSO || assistindo())) {
      acumulado += passou;
      garantirSessao();
    }
    if (agora - ultimoEnvio >= ENVIO) enviarAtivo();
  }
  function enviarAtivo(saindo) {
    var seg = Math.round(acumulado / 1000);
    ultimoEnvio = Date.now();
    if (seg >= 1) {
      acumulado -= seg * 1000;
      while (seg > 0) { var parte = Math.min(seg, 120); enfileirar('heartbeat', { seg: parte }, false); seg -= parte; }
      enviar(saindo);
    } else if (!saindo) enviar();
  }
  setInterval(pulso, PULSO);

  /* ---------- partidas dos minijogos ---------- */
  var partidas = {};                     /* partidas abertas nesta página */
  var PERSISTENTES = { 'animais-escondidos': 1 };   /* atravessa visitas e páginas */
  function chaveP(id) { return 'p:' + id; }
  function partidaAberta(id) {
    if (partidas[id]) return partidas[id];
    if (PERSISTENTES[id]) { var p = lerJSON(chaveP(id), null); if (p && p.id) return (partidas[id] = p); }
    return null;
  }
  function limparDados(d) {
    var r = {};
    if (!d || typeof d !== 'object') return r;
    ['jogadas', 'acertos', 'achados', 'rodadas', 'palavras', 'pares'].forEach(function (k) { if (typeof d[k] === 'number' && isFinite(d[k])) r[k] = Math.max(0, Math.round(d[k])); });
    if (typeof d.modo === 'string') r.modo = d.modo.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12);
    if (typeof d.motivo === 'string') r.motivo = d.motivo.toLowerCase().replace(/[^a-z-]/g, '').slice(0, 20);
    return r;
  }
  function gameStart(id) {
    if (typeof id !== 'string' || !/^[a-z0-9-]{1,40}$/.test(id)) return null;
    var p = partidaAberta(id);
    if (p) return p.id;                  /* já tem partida aberta: não duplica */
    p = { id: uuid(), inicio: Date.now() };
    partidas[id] = p;
    if (PERSISTENTES[id]) gravar(chaveP(id), JSON.stringify(p));
    enfileirar('game_start', { jogo: id, partida: p.id });
    enviar();
    return p.id;
  }
  function fechar(id, tipo, dados, saindo) {
    var p = partidaAberta(id);
    if (!p) return false;
    var d = limparDados(dados); d.jogo = id; d.partida = p.id;
    delete partidas[id];
    if (PERSISTENTES[id]) apagar(chaveP(id));
    enfileirar(tipo, d, !saindo);
    enviar(saindo);
    return true;
  }
  function gameComplete(id, dados) { return fechar(id, 'game_complete', dados); }
  function gameExit(id, dados) { return fechar(id, 'game_exit', dados); }
  function gameProgress(id, dados) {
    var p = partidaAberta(id);
    if (!p) return false;
    var d = limparDados(dados); d.jogo = id; d.partida = p.id;
    enfileirar('game_progress', d);
    enviar();
    return true;
  }
  function trackPage(nome) {
    if (typeof nome === 'string' && /^[a-z0-9/_-]{1,80}$/.test(nome)) paginaFixa = nome;
    enfileirar('page_view');
    enviar();
  }

  /* ---------- experiências: app de AR, loja, downloads, contato, vídeos ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var u; try { u = new URL(a.href, location.href); } catch (er) { return; }
    var rotulo = (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    var tipo = null, alvo = rotulo;
    if (/(^|\.)loja\.inclusivr\.com\.br$/.test(u.hostname)) { if (u.hostname !== location.hostname) tipo = 'loja'; else return; }
    else if (u.hostname === location.hostname && /^\/app\/?(index\.html)?$/.test(u.pathname)) tipo = 'app-ar';
    else if (/\.(pdf|zip)$/i.test(u.pathname)) { tipo = 'download'; alvo = u.pathname.split('/').pop(); }
    else if (/wa\.me|whatsapp|^mailto:/i.test(u.href)) { tipo = 'contato'; alvo = /^mailto:/i.test(u.href) ? 'e-mail' : 'WhatsApp'; }
    else if (/instagram\.com|tiktok\.com|youtube\.com|linkedin\.com/i.test(u.hostname)) { tipo = 'redes'; alvo = u.hostname.replace(/^www\./, ''); }
    if (!tipo) return;
    enfileirar('experiencia', { tipo: tipo, alvo: alvo });
    enviar(u.hostname !== location.hostname || tipo === 'app-ar');
  }, true);
  function contarVideo(v) {
    if (v.__ivaContado) return;
    v.__ivaContado = true;
    var src = (v.currentSrc || v.getAttribute('src') || '').split('/').pop().split('?')[0].replace(/\.(mp4|webm)$/i, '');
    enfileirar('experiencia', { tipo: 'video', alvo: src || 'vídeo' });
    enviar();
  }
  document.addEventListener('play', function (e) {
    var v = e.target;
    if (!v || v.tagName !== 'VIDEO') return;
    if (escolheu(v) || !v.muted) { v.__ivaEscolhido = true; interagiu(); contarVideo(v); }
  }, true);
  document.addEventListener('volumechange', function (e) {
    var v = e.target;
    if (v && v.tagName === 'VIDEO' && !v.muted && !v.paused) { v.__ivaEscolhido = true; interagiu(); contarVideo(v); }
  }, true);

  /* ---------- loja: produto colocado no carrinho ---------- */
  function noCarrinho(id) { if (id > 0) { enfileirar('loja', { acao: 'add_carrinho', produto: id }); enviar(true); } }
  if (LOJA) {
    document.addEventListener('submit', function (e) {
      var f = e.target;
      if (!f || !f.matches || !f.matches('form.cart')) return;
      var b = f.querySelector('[name="add-to-cart"]');
      noCarrinho(b ? parseInt(b.value, 10) : 0);
    }, true);
    document.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.add_to_cart_button[data-product_id]') : null;
      if (b && !b.closest('form.cart')) noCarrinho(parseInt(b.getAttribute('data-product_id'), 10));
    }, true);
  }

  /* ---------- saída da página ---------- */
  function saindo() {
    enviarAtivo(true);
    Object.keys(partidas).forEach(function (id) { if (!PERSISTENTES[id]) fechar(id, 'game_exit', { motivo: 'saiu' }, true); });
    enviar(true);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { enviarAtivo(true); enviar(true); }
    else { ultimoPulso = Date.now(); interagiu(); }
  });
  window.addEventListener('pagehide', saindo);

  window.InclusiVRAnalytics = { gameStart: gameStart, gameComplete: gameComplete, gameExit: gameExit, gameProgress: gameProgress, trackPage: trackPage, ativo: true, visitante: VID };

  /* primeira visualização da página */
  enfileirar('page_view');
  enviar();
})();
