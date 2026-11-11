/* InclusiVR - Libras com a Maga Aia. three.js (MIT), @pixiv/three-vrm (MIT). */
import{b as we}from"./chunks/chunk-H65V5AAG.js";var ye=`:root {
--ivl-noite: var(--noite, #100448);
--ivl-indigo: var(--indigo, #280eaa);
--ivl-roxo: var(--roxo, #ac2fed);
--ivl-roxo-profundo: var(--roxo-profundo, #5515a0);
--ivl-aqua: var(--aqua, #31f5ff);
--ivl-lima: var(--lima, #cfd736);
--ivl-branco: #ffffff;
--ivl-nevoa: #c9c2ee;
--ivl-brilho: var(--brilho-aqua, 0 0 16px 2px #31f5ff80);
--ivl-fonte-rotulo: var(--fonte-rotulo, Outfit, system-ui, sans-serif);
--ivl-fonte-texto: var(--fonte-texto, Lexend, system-ui, sans-serif);
--ivl-curva: var(--curva, cubic-bezier(.2, .8, .2, 1));
--ivl-w: clamp(320px, 27vw, 420px);
--ivl-h: 0px;
}
.ivl-lancador {
position: fixed; right: max(16px, env(safe-area-inset-right, 0px)); bottom: calc(16px + env(safe-area-inset-bottom, 0px));
z-index: 70; display: inline-flex; align-items: center; gap: 8px;
min-height: 52px; padding: 0 18px 0 14px; border-radius: 9999px; border: 2px solid var(--ivl-aqua);
background: var(--ivl-noite); color: var(--ivl-branco); cursor: pointer;
font: 800 1rem/1 var(--ivl-fonte-rotulo); letter-spacing: .04em; text-transform: uppercase;
box-shadow: 0 8px 24px #10044866; transition: box-shadow .2s var(--ivl-curva), transform .2s var(--ivl-curva);
}
.ivl-lancador:hover { box-shadow: var(--ivl-brilho), 0 8px 24px #10044866; transform: translateY(-2px); }
.ivl-lancador:focus-visible { outline: 3px solid var(--ivl-aqua); outline-offset: 3px; }
.ivl-lancador svg { width: 28px; height: 28px; flex: none; }
.ivl-lancador .ivl-aia-mini { width: 34px; height: 34px; border-radius: 50%; background: var(--ivl-roxo-profundo); display: grid; place-items: center; }
html.ivl-ativo .ivl-lancador { display: none; }
@media (max-width: 1023px) { html.ivl-barra .ivl-lancador { bottom: calc(84px + env(safe-area-inset-bottom, 0px)); } }
html.ivl-ativo .ivl-bloco { cursor: pointer; border-radius: 8px; transition: background-color .2s, box-shadow .2s; }
html.ivl-ativo .ivl-bloco:hover { box-shadow: 0 0 0 6px #31f5ff26; background-color: #31f5ff14; }
.ivl-lendo { outline: 3px solid var(--ivl-aqua) !important; outline-offset: 8px; border-radius: 10px; box-shadow: 0 0 0 8px #31f5ff1f; transition: outline-color .3s; }
.ivl-doca {
position: fixed; z-index: 70; display: flex; flex-direction: column;
background: radial-gradient(120% 70% at 50% 28%, #3a1d9a 0%, var(--ivl-noite) 62%); color: var(--ivl-branco);
font: 400 .9375rem/1.4 var(--ivl-fonte-texto); box-shadow: -6px 0 30px #10044840;
}
.ivl-doca[hidden] { display: none; }
.ivl-doca button { font-family: var(--ivl-fonte-rotulo); }
.ivl-topo { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px 6px 16px; }
.ivl-nome { display: flex; flex-direction: column; line-height: 1.1; min-width: 0; }
.ivl-tit { font: 800 1rem/1 var(--ivl-fonte-rotulo); letter-spacing: .08em; text-transform: uppercase; color: var(--ivl-aqua); }
.ivl-sub { font-size: .8125rem; color: var(--ivl-nevoa); }
.ivl-acoes-topo { display: flex; gap: 6px; }
.ivl-ib {
min-width: 40px; height: 40px; padding: 0 10px; border-radius: 9999px; border: 2px solid #ffffff40;
background: transparent; color: var(--ivl-branco); cursor: pointer; font: 700 .875rem/1 var(--ivl-fonte-rotulo);
display: inline-grid; place-items: center;
}
.ivl-ib:hover { border-color: var(--ivl-aqua); }
.ivl-ib:focus-visible, .ivl-bt:focus-visible, .ivl-doca input:focus-visible { outline: 3px solid var(--ivl-aqua); outline-offset: 2px; }
.ivl-ib[aria-pressed="false"] { opacity: .6; }
.ivl-ib svg { width: 20px; height: 20px; }
.ivl-palco { position: relative; flex: 1 1 auto; min-height: 0; }
.ivl-palco canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; }
.ivl-poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; object-position: 50% 50%; opacity: .9; transition: opacity .5s; pointer-events: none; }
.ivl-poster.ivl-some { opacity: 0; }
.ivl-carga { position: absolute; left: 0; right: 0; bottom: 0; display: grid; place-items: center; text-align: center; padding: 16px 16px 20px; color: var(--ivl-branco); font-size: .9375rem; background: linear-gradient(transparent, #100448e6 45%); }
.ivl-carga p { margin: 0; text-shadow: 0 1px 3px #100448; }
.ivl-carga[hidden] { display: none; }
.ivl-carga svg { display: none; }
.ivl-barra-carga { width: 160px; height: 6px; border-radius: 3px; background: #ffffff26; overflow: hidden; margin: 10px auto 0; }
.ivl-barra-carga i { display: block; height: 100%; width: 0; background: var(--ivl-aqua); transition: width .2s; }
@keyframes ivl-pulso { 50% { transform: scale(1.08); opacity: .7; } }
.ivl-legenda { padding: 4px 16px 0; min-height: 3.2em; }
.ivl-legenda[hidden] { display: none; }
.ivl-bloco-tit { display: none; margin: 0 0 4px; font: 700 .75rem/1.2 var(--ivl-fonte-rotulo); letter-spacing: .06em; text-transform: uppercase; color: var(--ivl-nevoa); }
.ivl-glosa { margin: 0 0 4px; display: flex; flex-wrap: wrap; gap: 4px 6px; font: 700 .8125rem/1.3 var(--ivl-fonte-rotulo); letter-spacing: .02em; }
.ivl-glosa span { padding: 2px 7px; border-radius: 6px; background: #ffffff14; color: #e9e4ff; transition: background .15s, color .15s; }
.ivl-glosa span.ivl-agora { background: var(--ivl-aqua); color: var(--ivl-noite); }
.ivl-glosa span.ivl-soletra { font-style: italic; }
.ivl-glosa b { font-weight: inherit; }
.ivl-glosa span.ivl-agora b.ivl-letra { background: #fff; border-radius: 3px; box-shadow: 0 0 0 2px #fff; }
.ivl-pt { margin: 0; color: var(--ivl-nevoa); font-size: .875rem; }
.ivl-controles { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 10px 12px 4px; }
.ivl-bt {
width: 48px; height: 48px; border-radius: 50%; border: 2px solid #ffffff40; background: transparent; color: var(--ivl-branco);
display: grid; place-items: center; cursor: pointer;
}
.ivl-bt:hover:not(:disabled) { border-color: var(--ivl-aqua); box-shadow: var(--ivl-brilho); }
.ivl-bt:disabled { opacity: .35; cursor: default; }
.ivl-bt svg { width: 22px; height: 22px; }
.ivl-bt.ivl-principal { width: 58px; height: 58px; background: var(--ivl-aqua); color: var(--ivl-noite); border-color: var(--ivl-aqua); }
.ivl-bt.ivl-principal svg { width: 26px; height: 26px; }
.ivl-rodape { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 12px; padding: 6px 16px 12px; }
.ivl-acompanhar { display: inline-flex; align-items: center; gap: 8px; font-size: .875rem; cursor: pointer; }
.ivl-tudo { display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 14px 0 10px; border-radius: 9999px; border: 2px solid var(--ivl-aqua); background: transparent; color: var(--ivl-branco); font: 700 .875rem/1 var(--ivl-fonte-rotulo); cursor: pointer; }
.ivl-tudo svg { width: 20px; height: 20px; }
.ivl-tudo[aria-pressed="true"] { background: var(--ivl-aqua); color: var(--ivl-noite); }
.ivl-tudo:focus-visible { outline: 3px solid var(--ivl-aqua); outline-offset: 2px; }
.ivl-acompanhar input { width: 20px; height: 20px; accent-color: var(--ivl-aqua); }
.ivl-nota { margin: 0; font-size: .75rem; color: var(--ivl-nevoa); }
.ivl-aviso { margin: 0; padding: 8px 16px; font-size: .875rem; color: var(--ivl-lima); }
.ivl-aviso[hidden] { display: none; }
.ivl-beta {
display: inline-block; flex: none; padding: 3px 7px; border-radius: 9999px; background: var(--ivl-lima); color: var(--ivl-noite);
font: 800 .6875rem/1 var(--ivl-fonte-rotulo); letter-spacing: .08em; text-transform: uppercase; white-space: nowrap;
}
.ivl-lancador .ivl-beta { padding: 3px 6px; font-size: .625rem; }
.ivl-nota b { color: var(--ivl-lima); font-weight: 700; }
@media (min-width: 1280px), (min-width: 1024px) and (orientation: landscape) {
.ivl-doca { top: 0; right: 0; bottom: 0; width: var(--ivl-w); }
html.ivl-ativo body { margin-right: var(--ivl-w) !important; }
html.ivl-ativo .janela-libras { right: calc(var(--ivl-w) + 16px); }
.ivl-palco { flex: 0 1 auto; height: calc(var(--ivl-w) * 1.3); max-height: 64vh; min-height: 240px; }
.ivl-lado { display: contents; }
.ivl-legenda { flex: none; }
.ivl-topo { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; grid-template-areas: "tit beta acoes" "sub sub acoes"; column-gap: 8px; row-gap: 3px; }
.ivl-nome { display: contents; }
.ivl-tit { grid-area: tit; align-self: end; }
.ivl-sub { grid-area: sub; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ivl-topo .ivl-beta { grid-area: beta; justify-self: start; align-self: end; }
.ivl-acoes-topo { grid-area: acoes; }
}
@media (min-width: 1280px) and (max-height: 899px), (min-width: 1024px) and (max-width: 1279px) and (orientation: landscape) {
.ivl-glosa { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; position: relative; }
.ivl-glosa::-webkit-scrollbar { display: none; }
.ivl-glosa span { flex: none; }
.ivl-pt { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
}
@media (min-width: 1024px) and (max-width: 1279px) and (orientation: landscape) {
.ivl-doca { top: var(--ivl-topo, 0px); z-index: 49; box-shadow: -6px 6px 30px #10044840; }
html.ivl-ativo .ivl-cab { margin-right: calc(-1 * var(--ivl-w)) !important; }
}
@media (min-width: 1280px) and (max-width: 1699px) {
html.ivl-ativo .topo__acoes .topo__comprar { display: none; }
html.ivl-ativo .topo__menu a { padding: 0 9px; font-size: .96rem; }
html.ivl-ativo .topo__barra { gap: 16px; }
}
@media (max-width: 1279px) and (orientation: portrait), (max-width: 1023px) and (orientation: landscape) {
.ivl-doca { display: grid; gap: 6px; }
.ivl-topo, .ivl-acoes-topo, .ivl-lado, .ivl-rodape { display: contents; }
.ivl-nome, .ivl-acompanhar { display: none; }
.ivl-palco { grid-area: palco; }
.ivl-beta { grid-area: beta; align-self: center; justify-self: start; margin: 0; padding: 3px 5px; letter-spacing: .06em; }
.ivl-vel { grid-area: vel; padding: 0 7px; font-size: .75rem; }
.ivl-leg { grid-area: leg; }
.ivl-fechar { grid-area: fechar; }
.ivl-legenda, .ivl-aviso, .ivl-nota { grid-area: legenda; align-self: center; min-width: 0; padding: 0; }
.ivl-legenda { min-height: 0; }
.ivl-glosa { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 0 2px; padding: 1px 0; position: relative; }
.ivl-glosa::-webkit-scrollbar { display: none; }
.ivl-glosa span { flex: none; }
.ivl-pt { font-size: .8125rem; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ivl-aviso { font-size: .8125rem; line-height: 1.35; }
.ivl-nota { display: none; font-size: .75rem; line-height: 1.35; }
.ivl-doca.ivl-ociosa .ivl-legenda, .ivl-doca.ivl-avisando .ivl-legenda { display: none; }
.ivl-doca.ivl-ociosa:not(.ivl-avisando) .ivl-nota { display: block; }
.ivl-controles { grid-area: controles; gap: 4px; padding: 0; justify-content: flex-start; }
.ivl-bt { flex: none; width: 42px; height: 42px; }
.ivl-bt.ivl-principal { width: 50px; height: 50px; }
.ivl-tudo { grid-area: tudo; justify-self: start; min-height: 40px; padding: 0 12px 0 8px; font-size: .8125rem; }
.ivl-barra-carga { width: min(160px, 80%); }
html.ivl-ativo .barra-compra { display: none; }
}
@media (max-width: 1279px) and (orientation: portrait) {
:root { --ivl-ph: clamp(170px, calc(42vh - 124px), 270px); }
.ivl-doca {
left: 0; right: 0; bottom: 0; box-shadow: 0 -6px 30px #10044840;
grid-template-columns: clamp(calc(var(--ivl-ph) * .78), calc(100% - 200px), calc(var(--ivl-ph) * .95)) minmax(0, 1fr) auto auto auto;
column-gap: 4px;
grid-template-rows: minmax(0, 1fr) auto minmax(4.2rem, auto) auto auto minmax(0, 1fr);
grid-template-areas:
"palco . . . ."
"palco beta vel leg fechar"
"palco legenda legenda legenda legenda"
"palco controles controles controles controles"
"palco tudo tudo tudo tudo"
"palco . . . .";
padding: 0 max(8px, env(safe-area-inset-right, 0px)) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
}
.ivl-palco { min-height: var(--ivl-ph); }
html.ivl-ativo body { padding-bottom: var(--ivl-h) !important; }
html.ivl-ativo { scroll-padding-bottom: var(--ivl-h); }
}
@media (min-width: 600px) and (max-width: 1279px) and (orientation: portrait) {
.ivl-pt { -webkit-line-clamp: 3; }
}
@media (max-width: 359px) and (orientation: portrait) {
.ivl-bt { width: 36px; height: 36px; }
.ivl-bt.ivl-principal { width: 44px; height: 44px; }
.ivl-ib { min-width: 36px; height: 36px; }
.ivl-vel { padding: 0 4px; }
}
@media (max-width: 1023px) and (orientation: landscape) {
:root { --ivl-w: clamp(316px, 38vw, 350px); }
.ivl-doca {
top: 0; right: 0; bottom: 0; width: var(--ivl-w);
grid-template-columns: auto minmax(0, 1fr) auto auto;
grid-template-rows: auto minmax(0, 1fr) minmax(3.8rem, auto) auto;
grid-template-areas:
"beta tudo tudo fechar"
"palco palco palco palco"
"legenda legenda legenda legenda"
"controles controles vel leg";
padding: 6px max(8px, env(safe-area-inset-right, 0px)) max(6px, env(safe-area-inset-bottom, 0px)) 8px;
}
.ivl-tudo { justify-self: start; }
.ivl-bt { width: 40px; height: 40px; }
.ivl-bt.ivl-principal { width: 46px; height: 46px; }
html.ivl-ativo body { margin-right: var(--ivl-w) !important; }
html.ivl-ativo .janela-libras { right: calc(var(--ivl-w) + 16px); }
}
@media (prefers-reduced-motion: reduce) {
.ivl-lancador, .ivl-lancador:hover { transition: none; transform: none; }
.ivl-carga svg { animation: none; }
}
@media print { .ivl-lancador, .ivl-doca { display: none !important; } }`;var R=(l,o="")=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"${o}>${l}</svg>`,k={mao:R('<path d="M8 12.5V6.2a1.4 1.4 0 0 1 2.8 0v5.3"/><path d="M10.8 11.5V4.6a1.4 1.4 0 0 1 2.8 0v6.9"/><path d="M13.6 11.5V5.6a1.4 1.4 0 0 1 2.8 0v7.2"/><path d="M16.4 12.4V9a1.4 1.4 0 0 1 2.8 0v5.2a7 7 0 0 1-7 7h-.6a6.2 6.2 0 0 1-5-2.6l-2.4-3.4a1.5 1.5 0 0 1 2.4-1.8L8 14.2"/><path d="M3.2 7.6c.4-1.4 1.2-2.6 2.3-3.4"/><path d="M20.8 4.6c.6.7 1 1.5 1.2 2.4"/>'),tocar:R('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>'),pausar:R('<path d="M8 5.5v13M16 5.5v13" stroke-width="3"/>'),repetir:R('<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>'),anterior:R('<path d="M6 6v12"/><path d="M18 6.5v11L9.5 12z" fill="currentColor"/>'),proximo:R('<path d="M18 6v12"/><path d="M6 6.5v11l8.5-5.5z" fill="currentColor"/>'),fechar:R('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),livro:R('<path d="M12 6.5c-1.8-1.3-4.4-1.9-8-1.8v12.6c3.6-.1 6.2.5 8 1.8 1.8-1.3 4.4-1.9 8-1.8V4.7c-3.6-.1-6.2.5-8 1.8z"/><path d="M12 6.5v12.6"/>'),legenda:R('<rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="M7 14h4M13 14h4M7 10.5h10"/>')};var U=[{v:.8,rotulo:"Lento"},{v:1,rotulo:"Normal"},{v:1.2,rotulo:"R\xE1pido"}],ue="Vers\xE3o beta: o plugin est\xE1 em melhoria e os sinais est\xE3o em revis\xE3o",z={ler(l,o){try{let c=localStorage.getItem("ivl-"+l);return c===null?o:JSON.parse(c)}catch{return o}},gravar(l,o){try{localStorage.setItem("ivl-"+l,JSON.stringify(o))}catch{}}};function Le(l,o={}){let c=document.createElement("aside");c.className="ivl-doca",c.hidden=!0,c.setAttribute("aria-label","Libras com a Maga Aia (vers\xE3o beta)"),c.innerHTML=`
    <div class="ivl-topo">
      <div class="ivl-nome"><span class="ivl-tit">Libras</span><span class="ivl-sub">com a Maga Aia</span></div>
      <span class="ivl-beta" title="${ue}">beta</span>
      <div class="ivl-acoes-topo">
        <button type="button" class="ivl-ib ivl-vel" aria-label="Velocidade dos sinais"></button>
        <button type="button" class="ivl-ib ivl-leg" aria-label="Mostrar a legenda">${k.legenda}</button>
        <button type="button" class="ivl-ib ivl-fechar" aria-label="Fechar a Libras">${k.fechar}</button>
      </div>
    </div>
    <div class="ivl-palco">
      <img class="ivl-poster" alt="" decoding="async">
      <canvas role="img" aria-label="A Maga Aia sinalizando em Libras"></canvas>
      <div class="ivl-carga"><div>${k.mao}<p class="ivl-carga-txt">A Aia est\xE1 chegando\u2026</p><div class="ivl-barra-carga"><i></i></div></div></div>
    </div>
    <div class="ivl-lado">
      <div class="ivl-legenda">
        <p class="ivl-bloco-tit"></p>
        <p class="ivl-glosa" aria-hidden="true"></p>
        <p class="ivl-pt"></p>
      </div>
      <p class="ivl-aviso" role="status" hidden></p>
      <div class="ivl-controles">
        <button type="button" class="ivl-bt ivl-ant" aria-label="Trecho anterior">${k.anterior}</button>
        <button type="button" class="ivl-bt ivl-principal ivl-play" aria-label="Sinalizar">${k.tocar}</button>
        <button type="button" class="ivl-bt ivl-rep" aria-label="Repetir">${k.repetir}</button>
        <button type="button" class="ivl-bt ivl-prox" aria-label="Pr\xF3ximo trecho">${k.proximo}</button>
      </div>
    </div>
    <div class="ivl-rodape">
      <button type="button" class="ivl-tudo" aria-pressed="false">${k.livro}<span>Ler a p\xE1gina toda</span></button>
      <label class="ivl-acompanhar"><input type="checkbox" class="ivl-seg"> Acompanhar a rolagem</label>
      <p class="ivl-nota"><b>Vers\xE3o beta:</b> o plugin est\xE1 em melhoria e os sinais est\xE3o em revis\xE3o. Selecione ou toque num texto da p\xE1gina para ver em Libras.</p>
    </div>`,document.body.appendChild(c);let s=t=>c.querySelector(t),f=s("canvas"),O=s(".ivl-carga"),M=s(".ivl-carga-txt"),I=s(".ivl-barra-carga i"),w=s(".ivl-glosa"),A=s(".ivl-pt"),Y=s(".ivl-bloco-tit"),N=s(".ivl-legenda"),ne=s(".ivl-aviso"),y=s(".ivl-play"),G=s(".ivl-ant"),J=s(".ivl-prox"),ee=s(".ivl-rep"),te=s(".ivl-vel"),ae=s(".ivl-leg"),H=s(".ivl-seg"),B=s(".ivl-tudo"),V=s(".ivl-poster"),d=null,D=null,le=!1,q=null,_=0;async function se(t,h){let u=await fetch(t);if(!u.ok)throw new Error(t+" -> "+u.status);let p=u.headers.get("content-encoding")&&h||Number(u.headers.get("content-length"))||0;if(!u.body||!p){let K=await u.arrayBuffer();return _=1,K}let v=u.body.getReader(),C=[],L=0;for(;;){let{done:K,value:xe}=await v.read();if(K)break;C.push(xe),L+=xe.length,_=Math.min(.99,L/p),I.style.width=Math.round(_*100)+"%"}let S=new Uint8Array(L),be=0;for(let K of C)S.set(K,be),be+=K.length;return _=1,S.buffer}function oe(){if(q)return q;for(let t of["basis_transcoder.js","basis_transcoder.wasm"])fetch(l.transcoder+t).catch(()=>null);q={modulo:import("./chunks/tocador-3AMAEPAD.js"),sinais:fetch(l.sinais).then(t=>t.json()),modelo:se(l.modelo,l.tamanhoModelo)};for(let t of Object.values(q))t.catch(()=>null);return q}let g=null,x=null,j=!1,e=[],i=[],r=[],b=-1,E=null,n=z.ler("vel",1),m=z.ler("legenda",!0);function $(){let t=U[n]||U[1];te.textContent=t.rotulo,te.setAttribute("aria-label","Velocidade dos sinais: "+t.rotulo),d&&(d.velocidade=t.v)}te.addEventListener("click",()=>{n=(n+1)%U.length,z.gravar("vel",n),$()});function W(){N.hidden=!m,ae.setAttribute("aria-pressed",String(m))}ae.addEventListener("click",()=>{m=!m,z.gravar("legenda",m),W()}),$(),W(),H.checked=!!z.ler("acompanhar",!1),B.addEventListener("click",()=>o.aoLerTudo&&o.aoLerTudo(B.getAttribute("aria-pressed")!=="true")),H.addEventListener("change",()=>{z.gravar("acompanhar",H.checked),o.aoAcompanhar&&o.aoAcompanhar(H.checked)});function F(){return d?Promise.resolve(d):D||(O.hidden=!1,D=(async()=>{try{let t=oe(),[{criarTocador:h},u,p]=await Promise.all([t.modulo,t.sinais,t.modelo]);return d=await h({canvas:f,modelo:p,transcoder:l.transcoder,sinais:u,quadro:"doca",velocidade:(U[n]||U[1]).v,aoQuadro:Ce,aquecer:!0,motor:l.motor==="classico"?"classico":"fluido"}),d.velocidade=(U[n]||U[1]).v,d.aoTerminar=v=>{v===x&&(x=null,ce(-1),ie(),o.aoTerminarBloco&&o.aoTerminarBloco(g))},O.hidden=!0,V.classList.add("ivl-some"),Q(),d}catch(t){throw le=!0,console.error("[Libras] a Aia n\xE3o carregou:",t),M.textContent="N\xE3o foi poss\xEDvel mostrar a Aia em 3D neste navegador.",I.parentNode.hidden=!0,t}})(),D)}function Q(){let t=0,h=0,u=!1;f.addEventListener("pointerdown",v=>{u=!0,t=v.clientX,h=v.clientY,f.setPointerCapture(v.pointerId)}),f.addEventListener("pointermove",v=>{u&&(d.palco.girar(v.clientX-t,v.clientY-h),t=v.clientX,h=v.clientY)});let p=()=>{u=!1};f.addEventListener("pointerup",p),f.addEventListener("pointercancel",p),f.addEventListener("dblclick",()=>d.palco.centralizar())}function he(t,h){if(Y.textContent=t?t.titulo:"",A.textContent=t?t.pt:"",w.textContent="",e=[],i=[],r=[],b=-1,E=null,!h||!d)return;let u=d.biblioteca;h.itens.forEach((p,v)=>{if(!p.id)return;let C=u[p.id];if(C&&C.letra&&p.soletrado){let L=e[e.length-1];if(L&&L.soletrado===p.soletrado&&i[v-1]===e.length-1&&L.n<L.letras.length){r[v]=L.n++,i[v]=e.length-1;return}let S=Array.from(p.soletrado.normalize("NFC"));e.push({txt:S.join("-"),soletrado:p.soletrado,letras:S,n:1}),r[v]=0}else e.push({txt:C&&C.glosa||p.id});i[v]=e.length-1});for(let p of e){let v=document.createElement("span");p.soletrado&&(v.className="ivl-soletra"),p.soletrado&&p.n===p.letras.length?p.els=p.letras.map((C,L)=>{L&&v.append("-");let S=document.createElement("b");return S.textContent=C,v.append(S),S}):v.textContent=p.txt,w.appendChild(v),p.el=v}}function ce(t,h){let u=e[t],p=u&&u.els&&h!==void 0?u.els[h]:null;if(t===b&&p===E)return;t!==b&&(e[b]&&e[b].el.classList.remove("ivl-agora"),b=t,u&&u.el.classList.add("ivl-agora")),E&&E.classList.remove("ivl-letra"),E=p,p&&p.classList.add("ivl-letra");let v=p||u&&u.el;if(v&&w.scrollWidth>w.clientWidth+2){let C=w.getBoundingClientRect(),L=v.getBoundingClientRect(),S=C.width-L.width;w.scrollTo({left:Math.max(0,w.scrollLeft+L.left-C.left-Math.max(0,S/2)),behavior:"smooth"})}}function Ce(){if(!x||!d)return;let t=d.atual();t&&t.i>=0&&i[t.i]!==void 0&&ce(i[t.i],r[t.i])}function ie(){let t=!!x&&d&&!d.pausado;y.innerHTML=t?k.pausar:k.tocar,y.setAttribute("aria-label",t?"Pausar":x?"Continuar":"Sinalizar"),de(),o.aoEstado&&o.aoEstado({bloco:g,tocando:!!x,pausado:!!(d&&d.pausado)})}function de(){c.classList.toggle("ivl-ociosa",!x&&(!g||g.id==="boas-vindas"))}function pe(t){ne.textContent=t||"",ne.hidden=!t,c.classList.toggle("ivl-avisando",!!t)}let T;function ge(){(T===void 0||T&&!T.isConnected)&&(T=[...document.querySelectorAll('header, [role="banner"]')].find(t=>!t.closest(".ivl-doca")&&/^(sticky|fixed)$/.test(getComputedStyle(t).position))||null,T&&getComputedStyle(T).position==="sticky"&&T.classList.add("ivl-cab"),T&&"ResizeObserver"in window&&new ResizeObserver(ge).observe(T)),document.documentElement.style.setProperty("--ivl-topo",(T?T.offsetHeight:0)+"px")}y.addEventListener("click",()=>{if(x&&d){d.pausado?d.continuar():d.pausar(),ie();return}g&&ve.tocar(g)}),ee.addEventListener("click",()=>{g&&ve.tocar(g)}),G.addEventListener("click",()=>o.aoAnterior&&o.aoAnterior()),J.addEventListener("click",()=>o.aoProximo&&o.aoProximo()),s(".ivl-fechar").addEventListener("click",()=>o.aoFechar&&o.aoFechar()),c.addEventListener("keydown",t=>{t.key==="Escape"&&o.aoFechar&&o.aoFechar()}),"ResizeObserver"in window&&new ResizeObserver(()=>{document.documentElement.style.setProperty("--ivl-h",(c.hidden?0:c.offsetHeight)+"px")}).observe(c);let ve={el:c,get aberta(){return!c.hidden},get tocador(){return d},baixar:oe,get bloco(){return g},get tocando(){return!!x||j},get acompanhar(){return H.checked},abrir(){return V.src||(V.src=l.poster),I.style.width=Math.round(_*100)+"%",c.hidden=!1,document.documentElement.classList.add("ivl-ativo"),ge(),de(),document.documentElement.style.setProperty("--ivl-h",c.offsetHeight+"px"),d&&d.palco.continuar(),F().catch(()=>null)},fechar(){d&&(d.parar(),d.palco.pausar()),x=null,ce(-1),ie(),c.hidden=!0,document.documentElement.classList.remove("ivl-ativo"),document.documentElement.style.setProperty("--ivl-h","0px")},focar(){y.focus()},navegacao(t,h){G.disabled=!t,J.disabled=!h},marcarLerTudo(t){B.setAttribute("aria-pressed",String(!!t)),B.querySelector("span").textContent=t?"Parar a leitura":"Ler a p\xE1gina toda"},mostrar(t){g=t,pe(""),d&&t?he(t,l.lerRoteiro(t.glosa,d.biblioteca)):(Y.textContent=t?t.titulo:"",A.textContent=t?t.pt:"",w.textContent=""),de()},avisar(t){pe(t)},async tocar(t){g=t,pe(""),j=!0,Y.textContent=t.titulo,A.textContent=t.pt,de();let h;try{h=await F()}catch{j=!1;return}if(g!==t)return;j=!1;let u=l.lerRoteiro(t.glosa,h.biblioteca);he(t,u),x=null,x=h.tocar(u.itens,{marcas:u.marcas}),ie(),o.aoComecar&&o.aoComecar(t)},parar(){d&&d.parar(),x=null,j=!1,ce(-1),ie()}};return ve}var X=new URL(".",import.meta.url).href,Ee=[...document.querySelectorAll("script[src]")].find(l=>l.src===import.meta.url),Z=Ee?Ee.dataset:{},P=Object.assign({modelo:X+"modelos/MagaAia_web.vrm",transcoder:X+"basis/",sinais:X+"dados/sinais.json",poster:X+"modelos/aia_poster.webp",roteiros:X+"roteiros/",roteiro:null,motor:"fluido"},Z.modelo?{modelo:new URL(Z.modelo,X).href}:{},Z.roteiro?{roteiro:Z.roteiro}:{},Z.motor?{motor:Z.motor}:{},window.InclusiVRLibras||{});P.lerRoteiro=we;!P.tamanhoModelo&&P.modelo===X+"modelos/MagaAia_web.vrm"&&(P.tamanhoModelo=4353668);var a={blocos:[],i:-1,fila:null,selecao:[],visiveis:new Map,lerTudo:!1};async function Te(){try{let l=P.roteiro;if(!l){let s=await(await fetch(P.roteiros+"indice.json")).json(),f=location.pathname.replace(/index[.]html?$/,""),O=s.find(M=>M.caminhos.some(I=>I!=="/"&&f.endsWith(I)))||s.find(M=>M.caminhos.includes("/"));l=O&&O.arquivo}if(!l)return null;let[o,c]=await Promise.all([fetch(P.roteiros+l+".json").then(s=>s.json()),fetch(P.roteiros+"comum.json").then(s=>s.ok?s.json():null).catch(()=>null)]);return c&&(o.blocos=o.blocos.concat(c.blocos)),o}catch{return null}}function Se(){let l=document.createElement("style");l.id="ivl-estilo",l.textContent=ye,document.head.appendChild(l)}function Oe(l,o,c){let s=document.createElement("button");return s.type="button",s.className=l,s.innerHTML=o,c&&s.setAttribute("aria-label",c),s}var fe=l=>(l||"").replace(/\s+/g," ").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""),ke=l=>fe(l).replace(/[^a-z0-9]+/g,""),ze="h1,h2,h3,h4,h5,p,li,blockquote,figcaption,dt,dd,td,th,label,summary,.cartela,[data-libras]",Ie='nav,[aria-hidden="true"],.ivl-doca,.ivl-lancador';function Me(l){return l.closest("[hidden]")?!1:(l.closest("details:not([open])")||l).getClientRects().length>0}var me=()=>/^en\b/i.test(document.documentElement.lang||""),re=null;function Ne(l){let o=me()&&window.INCLUSIVR_EN&&window.INCLUSIVR_EN.textos;if(!o)return l.textContent;if(!re){re=new Map;for(let[f,O]of Object.entries(o)){let M=fe(O);re.set(M,re.has(M)?null:f)}}let c="",s=document.createTreeWalker(l,NodeFilter.SHOW_TEXT);for(let f=s.nextNode();f;f=s.nextNode())c+=" "+(re.get(fe(f.nodeValue))||f.nodeValue);return c}var qe="Esta p\xE1gina ainda n\xE3o tem tradu\xE7\xE3o em Libras. Ela est\xE1 sendo preparada pela equipe.",_e="A Libras est\xE1 na vers\xE3o em portugu\xEAs do site. Toque em PT. / Libras (Brazilian Sign Language) is on the Portuguese version of this site.";async function Ae(){Se();let l=await Te(),o=Le(P,{aoFechar:x,aoAnterior:()=>y(a.i-1,!0),aoProximo:()=>y(a.i+1,!0),aoAcompanhar:e=>{e&&D()},aoLerTudo:e=>ee(e),aoComecar:e=>J(e),aoEstado:({tocando:e})=>{!e&&!a.lerTudo&&J(null)},aoTerminarBloco:()=>{if(a.lerTudo){a.i<a.blocos.length-1?y(a.i+1,!0):ee(!1);return}if(a.selecao.length){let e=a.selecao.shift();y(a.blocos.indexOf(e));return}if(a.fila&&a.fila!==a.blocos[a.i]){let e=a.fila;a.fila=null,y(a.blocos.indexOf(e))}}});o.el.setAttribute("translate","no");let c=Oe("ivl-lancador",`<span class="ivl-aia-mini">${k.mao}</span><span>Libras</span><span class="ivl-beta" aria-hidden="true">beta</span>`,"Abrir a Libras (vers\xE3o beta): a Maga Aia sinaliza esta p\xE1gina");c.title=ue,c.setAttribute("translate","no"),document.body.appendChild(c),c.addEventListener("click",()=>g(!0));for(let e of["pointerenter","focus","touchstart"])c.addEventListener(e,()=>o.baixar(),{passive:!0,once:!0});let s=null,f=new Map,O=[],M=0;for(let e of l&&l.blocos||[]){if(e.id==="boas-vindas"){s=Object.assign({},e,{els:[],alvo:null});continue}if(e.seletor){O.push(e);continue}let i=ke(e.pt);i&&(f.has(i)||f.set(i,[]),f.get(i).push(e),M=Math.max(M,e.pt.length))}let I=new WeakMap,w=new Map,A=!0;function Y(e,i){let r=I.get(i);return(!r||r.fonte!==e)&&(r=Object.assign({},e,{fonte:e,els:[i],alvo:i}),I.set(i,r)),r}function N(){A=!1;let e=new Map,i=me()&&!(window.INCLUSIVR_EN&&window.INCLUSIVR_EN.textos);if(f.size&&!i)for(let n of document.querySelectorAll(ze)){if(n.textContent.length>M*2+40)continue;let m=ke(Ne(n));!f.has(m)||n.closest(Ie)||(e.has(m)||e.set(m,[]),e.get(m).push(n))}let r=[];for(let[n,m]of e){let $=m.filter(F=>!m.some(Q=>Q!==F&&F.contains(Q))&&Me(F)),W=f.get(n);$.forEach((F,Q)=>r.push(Y(W[Math.min(Q,W.length-1)],F)))}for(let n of O)for(let m of[].concat(n.seletor))for(let $ of document.querySelectorAll(m))Me($)&&!r.some(W=>W.alvo===$)&&r.push(Y(n,$));r.sort((n,m)=>n===m?0:n.alvo.compareDocumentPosition(m.alvo)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);let b=a.blocos[a.i],E=new Map(r.map(n=>[n.alvo,n]));for(let n of w.keys())E.has(n)||(n.classList.remove("ivl-bloco"),V&&V.unobserve(n),a.visiveis.delete(n));for(let n of E.keys())w.has(n)||(n.classList.add("ivl-bloco"),V&&V.observe(n));if(w=E,a.blocos=r,b){let n=r.indexOf(b);a.i=n>=0?n:Math.min(a.i,r.length-1)}a.selecao=a.selecao.filter(n=>w.get(n.alvo)===n),a.fila&&w.get(a.fila.alvo)!==a.fila&&(a.fila=null),o.aberta&&a.i>=0&&o.navegacao(a.i>0,a.i<r.length-1)}function ne(e){for(let i=e;i&&i!==document.body;i=i.parentElement){let r=w.get(i);if(r)return r}return null}function y(e,i=!1){if(e<0||e>=a.blocos.length)return;a.i=e,a.fila=null,o.navegacao(e>0,e<a.blocos.length-1);let r=a.blocos[e],b=r.alvo.closest("details:not([open])");b&&!r.alvo.closest("summary")&&(b.open=!0),i&&r.alvo.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"}),o.tocar(r)}let G=[];function J(e){for(let i of G)i.classList.remove("ivl-lendo");G=e&&e.els||[];for(let i of G)i.classList.add("ivl-lendo")}function ee(e){a.lerTudo=!!e,o.marcarLerTudo(a.lerTudo),a.lerTudo?(a.selecao=[],y(0,!0)):o.parar()}function te(){let e=getSelection();if(!e||e.isCollapsed||!e.rangeCount)return[];let i=e.getRangeAt(0);return a.blocos.filter(r=>r.els.some(b=>i.intersectsNode(b)))}let ae=0,H=()=>{clearTimeout(ae),ae=setTimeout(()=>{if(!o.aberta)return;let e=getSelection();if(!e||e.isCollapsed||String(e).trim().length<2||e.anchorNode&&e.anchorNode.parentElement?.closest(".ivl-doca"))return;A&&N();let i=te();if(!i.length){o.avisar("Este trecho ainda n\xE3o tem tradu\xE7\xE3o em Libras. A equipe est\xE1 preparando.");return}a.lerTudo=!1,o.marcarLerTudo(!1),y(a.blocos.indexOf(i[0])),a.selecao=i.slice(1)},450)};document.addEventListener("selectionchange",H),document.addEventListener("click",e=>{if(!o.aberta||e.target.closest('a,button,input,select,textarea,label,summary,[role="button"],.ivl-doca,.ivl-lancador'))return;let i=getSelection();if(i&&!i.isCollapsed)return;A&&N();let r=ne(e.target);r&&(a.lerTudo=!1,a.selecao=[],o.marcarLerTudo(!1),y(a.blocos.indexOf(r)))});let B=0,V="IntersectionObserver"in window?new IntersectionObserver(e=>{for(let i of e)a.visiveis.set(i.target,i.intersectionRatio);clearTimeout(B),B=setTimeout(D,700)},{threshold:[0,.25,.5,.75,1]}):null;function d(e){let i=innerHeight*.45,r=null,b=1/0;for(let E of a.blocos){let n=E.alvo.getBoundingClientRect();if(e?Math.min(n.bottom,innerHeight)-Math.max(n.top,0)<Math.min(n.height,innerHeight)*.5||!n.height:(a.visiveis.get(E.alvo)||0)<.5)continue;let m=Math.abs((n.top+n.bottom)/2-i);m<b&&(b=m,r=E)}return r}function D(){if(!o.aberta||!o.acompanhar||a.lerTudo||!a.blocos.length)return;let e=d(!1);!e||e===a.blocos[a.i]||e===a.fila||(o.tocando?a.fila=e:y(a.blocos.indexOf(e)))}let le=0;function q(){A=!0,o.aberta&&(clearTimeout(le),le=setTimeout(N,300))}let _="MutationObserver"in window?new MutationObserver(e=>{for(let i of e){let r=i.target.nodeType===1?i.target:i.target.parentElement;if(!(r&&r.closest(".ivl-doca,.ivl-lancador"))){q();return}}}):null,se=e=>{_&&(e?_.observe(document.documentElement,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["hidden","open","lang"]}):(_.disconnect(),A=!0))};document.addEventListener("inclusivr:idioma",q);let oe=innerWidth;addEventListener("resize",()=>{innerWidth!==oe&&(oe=innerWidth,q())},{passive:!0});function g(e){if(o.aberta)return;if(A&&N(),se(!0),o.abrir(),z.gravar("aberta",!0),e&&o.focar(),!a.blocos.length){o.avisar(me()?_e:qe),o.navegacao(!1,!1);return}if(!e)return;let i=!1;try{i=!sessionStorage.getItem("ivl-ola"),sessionStorage.setItem("ivl-ola","1")}catch{i=!0}if(a.i=-1,i&&s)o.navegacao(!1,!0),o.tocar(s);else if(D(),a.i<0){let r=d(!0)||a.blocos[0];a.i=a.blocos.indexOf(r),o.mostrar(r),o.navegacao(a.i>0,a.i<a.blocos.length-1)}}function x(){a.lerTudo=!1,o.marcarLerTudo(!1),o.fechar(),J(null),a.fila=null,se(!1),z.gravar("aberta",!1),c.focus()}let j=document.querySelector(".barra-compra");if(j){let e=()=>document.documentElement.classList.toggle("ivl-barra",j.classList.contains("visivel"));new MutationObserver(e).observe(j,{attributes:!0,attributeFilter:["class"]}),e()}window.InclusiVRLibras=Object.defineProperties(window.InclusiVRLibras||{},Object.getOwnPropertyDescriptors({abrir:()=>g(!0),fechar:x,tocar:e=>{A&&N();let i=a.blocos.findIndex(r=>r.id===e);i>=0&&(g(!1),y(i,!0))},lerTudo:()=>{g(!1),ee(!0)},procurar:()=>(N(),a.blocos.length),get blocos(){return A&&N(),a.blocos.map(e=>({id:e.id,pt:e.pt,achado:!!e.alvo}))},doca:o})),z.ler("aberta",!1)&&g(!0)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ae):Ae();
