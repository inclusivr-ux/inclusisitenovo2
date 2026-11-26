# Loja da InclusiVR (loja.inclusivr.com.br): front-end

A loja é um WordPress com WooCommerce, num servidor separado do site. Esta pasta guarda a parte visual da loja que é da InclusiVR, para a equipe mudar o design aqui, ver o resultado na prévia e depois pedir ao Claude para conferir e publicar.

Prévia no GitHub Pages: https://inclusivr-ux.github.io/inclusisitenovo2/loja/

## O que tem aqui

| Pasta | O que é |
| --- | --- |
| `servidor/` | **Cópia exata** dos arquivos da InclusiVR no servidor da loja (mesmos bytes, conferidos por SHA-256). Cada arquivo vai para o mesmo caminho dentro da pasta da loja no servidor (`/home2/arktoo23/loja.inclusivr.com.br/`). |
| `index.html`, `produto/…`, `carrinho/`, `finalizar-compra/` | **Prévia estática** das 4 páginas principais: o HTML que a loja entrega, salvo como um visitante novo, com um livro no carrinho. |
| `ferramentas/atualizar-previa.py` | Script que gera a prévia de novo a partir da loja no ar. |

### Dentro de `servidor/wp-content/mu-plugins/`

- `inclusivr-visual.php`: cabeçalho, rodapé, faixa e caixa da campanha (Black November, cupom IGOR), etiqueta da vitrine e lembrete do cupom. As datas e os textos da campanha ficam na constante `IVL_CAMPANHA`, no começo do arquivo.
- `inclusivr-visual/loja.css`: todo o visual da loja (cores, fontes, botões, banner, carrinho, finalização). É o arquivo que mais vai mudar.
- `inclusivr-visual/img/`: banner (`banner-signaria.webp`) e logo do rodapé. `inclusivr-visual/fonts/`: as mesmas fontes do site.
- `inclusivr-cupom-carrinho.php`: campo do cupom em destaque no carrinho (só durante a campanha).
- `inclusivr-sem-cache-carrinho.php`: impede que o cache guarde carrinho, finalização e minha conta.
- `inclusivr-analytics.php`: carrega o coletor de estatísticas do site na loja.
- `inclusivr-410-spam.php`: responde "removido" aos endereços de spam da invasão de 2026 (pode sair em meados de 2027).

Fica de fora, de propósito: o tema (`ecommerce-landing-page`), o WooCommerce e os outros plugins (são de terceiros e não foram mudados), o `endurance-page-cache.php` (é da HostGator), os produtos, as imagens dos produtos e as configurações (ficam no banco de dados do WordPress).

## Como mudar o design

1. Crie um branch (ou edite direto, se for algo pequeno) e mude os arquivos de `servidor/`.
2. **Mudanças no `loja.css`, nas fontes ou nas imagens aparecem na prévia na hora**, porque as páginas da prévia usam esses arquivos daqui.
3. **Mudanças de HTML** (textos e blocos que vêm do `inclusivr-visual.php`, como a faixa, a caixa da campanha e o rodapé) **não aparecem sozinhas na prévia**: ela é uma foto da loja no ar, e o PHP só roda no servidor. Para testar uma ideia de HTML antes, dá para editar direto o `index.html` da página da prévia; depois o Claude passa a mudança para o PHP.
4. Faça o commit ou o merge e peça ao Claude: "confere as alterações da loja no GitHub e publica".

## Como o Claude publica (checklist)

1. Comparar cada arquivo de `servidor/` com o do servidor (tamanho e SHA-256, lidos pelo cPanel). Se o servidor tiver algo que não está aqui, parar e avisar: alguém mexeu direto no servidor.
2. Mostrar à equipe o que vai mudar e esperar o ok.
3. Fazer cópia de segurança de cada arquivo que vai mudar em `/home2/arktoo23/quarentena-loja-2026-11-17/` (fora do site público), com a data no nome.
4. Enviar os arquivos com os bytes exatos (API do cPanel, `Fileman/upload_files` com `overwrite=1`) e conferir o SHA-256 depois.
5. Se o `loja.css` mudou, subir o número de `IVL_VERSAO` no `inclusivr-visual.php` (é o que faz os navegadores baixarem o CSS novo) e trazer essa mudança para cá também.
6. Limpar o cache da loja: apagar as cópias em `wp-content/endurance-page-cache/` (início, loja e produtos).
7. Conferir a loja no ar, no computador e no celular, e rodar `ferramentas/atualizar-previa.py` para a prévia ficar igual à loja.

## Cuidados

- **Esta pasta não vai para o `public_html` do site.** Ao publicar o site, envie só os arquivos do site. Se `loja/` for parar lá por engano, o `.htaccess` desta pasta bloqueia tudo (o GitHub Pages ignora esse arquivo).
- O repositório é público. Nada desta pasta tem senha ou chave. Nunca traga para cá o `wp-config.php`, cópias do banco, pedidos ou dados de clientes.
- Os arquivos de `servidor/` são guardados sem conversão de quebra de linha (regra no `.gitattributes` da raiz), para continuarem idênticos aos do servidor.
- A prévia é uma foto: a faixa da Black November, os preços e o carrinho ficam como estavam no dia em que foi gerada (26/11/2026). Botões e formulários não fazem nada. As imagens dos produtos e o CSS do tema e do WooCommerce vêm da loja no ar.
- Para gerar a prévia de novo: `pip install playwright && playwright install chromium`, depois `python3 loja/ferramentas/atualizar-previa.py` na raiz do repositório. O script abre a loja como um visitante novo (sem login), por isso não pega dados de ninguém.
