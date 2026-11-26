#!/usr/bin/env python3
"""
Atualiza a prévia estática da loja (pasta loja/ deste repositório).

Abre a loja de verdade (loja.inclusivr.com.br) como um visitante novo, sem login e sem
cookies, põe o livro no carrinho, espera cada página terminar de montar e salva o HTML
já montado. Depois:
  - tira todos os scripts (a prévia não compra, não mede e não chama a loja);
  - aponta o loja.css, as fontes e as imagens do plugin para a cópia em loja/servidor/,
    então mudar o loja.css deste repositório muda a prévia na hora;
  - troca os links entre as páginas da loja pelos da prévia;
  - desliga os formulários e apaga valores de campos ocultos (códigos de segurança).

Uso (precisa de Python 3 e Playwright com Chromium):
    pip install playwright && playwright install chromium
    python3 loja/ferramentas/atualizar-previa.py

As imagens dos produtos, o CSS do tema e o do WooCommerce continuam vindo da loja no ar.
"""
import asyncio
import pathlib
import re

from playwright.async_api import async_playwright

LOJA = "https://loja.inclusivr.com.br/"
PLUGIN = LOJA + "wp-content/mu-plugins/inclusivr-visual/"
RAIZ = pathlib.Path(__file__).resolve().parent.parent  # pasta loja/

# endereço na loja -> pasta da prévia (dentro de loja/)
PAGINAS = {
    "": "",
    "produto/livro-sinalizaacao-animais-em-voga/": "produto/livro-sinalizaacao-animais-em-voga/",
    "carrinho/": "carrinho/",
    "finalizar-compra/": "finalizar-compra/",
}
LINKS_EXTRA = {"loja/": "", "?ivl=comprar": "carrinho/", "?ivl=cupom": "carrinho/"}

AVISO = (
    '<div class="ivl-previa-aviso" role="note" style="position:fixed;right:12px;bottom:12px;z-index:99999;'
    'background:#100448;color:#fff;font:600 13px/1.3 Lexend,Axiforma,system-ui,sans-serif;padding:8px 12px;'
    'border-radius:10px;box-shadow:0 0 12px 2px #31f5ff80;max-width:260px">'
    "Prévia estática da loja. Botões e formulários não funcionam aqui.</div>"
)
CSS_PREVIA = (
    "<style id=\"ivl-previa\">"
    ".wow{visibility:visible!important;animation:none!important}"
    ".woocommerce-product-gallery{opacity:1!important}"
    ".woocommerce-product-gallery .flex-viewport{height:auto!important}"
    ".woocommerce-product-gallery__wrapper{transform:none!important;width:auto!important}"
    ".woocommerce-product-gallery__image{width:100%!important;float:none!important;margin:0!important}"
    ".woocommerce-product-gallery__image:not(:first-child){display:none!important}"
    ".woocommerce-product-gallery .zoomImg{display:none!important}"
    ".scrollup{display:none!important}"
    "</style>"
)


def limpar(html: str, destino: str) -> str:
    sobe = "../" * destino.count("/")  # caminho de volta até loja/

    # scripts, iframes e pré-carregamentos de script: fora
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.S | re.I)
    html = re.sub(r"<noscript\b[^>]*>.*?</noscript>", "", html, flags=re.S | re.I)
    html = re.sub(r"<iframe\b[^>]*>.*?</iframe>", "", html, flags=re.S | re.I)
    html = re.sub(r"<link\b[^>]*rel=\"(?:modulepreload|preload|prefetch|dns-prefetch|preconnect|alternate|EditURI|https://api\.w\.org/|shortlink|canonical|pingback)\"[^>]*>", "", html, flags=re.I)
    html = re.sub(r"\son[a-z]+=\"[^\"]*\"", "", html)  # atributos onclick etc. que o WordPress põe

    # campos ocultos: sem valores (códigos de segurança e sessão)
    html = re.sub(r"(<input\b[^>]*type=\"hidden\"[^>]*?)\svalue=\"[^\"]*\"", r'\1 value=""', html, flags=re.I)
    # formulários: não enviam para lugar nenhum
    html = re.sub(r"(<form\b[^>]*?)\saction=\"[^\"]*\"", r'\1 action="#"', html, flags=re.I)
    html = re.sub(r"<form\b", '<form onsubmit="return false"', html, flags=re.I)

    # ícones do tema (Font Awesome 7.0.0): a loja não libera as fontes para outros endereços,
    # então a prévia usa a mesma versão vinda de um CDN público
    html = re.sub(
        r'href="' + re.escape(LOJA) + r'wp-content/themes/ecommerce-landing-page/assets/css/fontawesome-all\.css[^"]*"',
        'href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.0.0/css/all.min.css"', html)

    # arquivos do plugin -> cópia do repositório
    html = html.replace(PLUGIN, sobe + "servidor/wp-content/mu-plugins/inclusivr-visual/")
    # links entre as páginas da prévia
    for de, para in sorted({**{k: v for k, v in LINKS_EXTRA.items()}, **PAGINAS}.items(), key=lambda kv: -len(kv[0])):
        alvo = sobe + para if (sobe + para) else "./"
        html = re.sub(r'href="' + re.escape(LOJA + de) + r'(?:#[^"]*)?"', 'href="' + alvo + '"', html)

    # não indexar a prévia; aviso e ajustes de prévia
    html = re.sub(r"<meta\b[^>]*name=\"robots\"[^>]*>", "", html, flags=re.I)
    html = re.sub(r"(<head\b[^>]*>)", r'\1<meta name="robots" content="noindex, nofollow">', html, count=1, flags=re.I)
    html = re.sub(r"(</head>)", CSS_PREVIA + r"\1", html, count=1, flags=re.I)
    html = re.sub(r"(</body>)", AVISO + r"\1", html, count=1, flags=re.I)
    return html


async def main():
    async with async_playwright() as p:
        nav = await p.chromium.launch()
        ctx = await nav.new_context(viewport={"width": 1366, "height": 900}, locale="pt-BR")
        pg = await ctx.new_page()
        for caminho, destino in PAGINAS.items():
            if caminho == "carrinho/":
                await pg.goto(LOJA + "?add-to-cart=16", wait_until="networkidle")
            await pg.goto(LOJA + caminho, wait_until="networkidle")
            await pg.wait_for_timeout(2500)
            await pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await pg.wait_for_timeout(800)
            html = "<!DOCTYPE html>\n" + await pg.evaluate("document.documentElement.outerHTML")
            pasta = RAIZ / destino
            pasta.mkdir(parents=True, exist_ok=True)
            (pasta / "index.html").write_text(limpar(html, destino), encoding="utf-8")
            print("ok", destino or "(início da loja)")
        await nav.close()


if __name__ == "__main__":
    asyncio.run(main())
