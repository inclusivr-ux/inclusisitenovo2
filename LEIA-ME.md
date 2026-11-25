# Site da InclusiVR (inclusivr.com.br)

Código do site principal. O que está no `public_html` do servidor (HostGator) é igual a este repositório, com as exceções listadas abaixo. O repositório também serve de prévia no GitHub Pages.

## Como publicar sem estragar nada

- Envie só os arquivos que mudaram, ou envie tudo por cima sem apagar o que já está lá. Não esvazie o `public_html` antes: algumas pastas só existem no servidor (lista abaixo).
- O servidor grava os arquivos com a quebra de linha do Windows (CRLF); aqui é LF. O site funciona igual. Para comparar o servidor com o repositório, ignore essa diferença.
- HTML não fica em cache; CSS fica 1 dia e JS fica 1 hora (regra do `.htaccess`). Depois de mudar CSS ou JS, quem já visitou o site pode ver a versão antiga por algum tempo.
- O `.htaccess` daqui é o mesmo do servidor, inclusive o trecho que o cPanel gera sozinho (versão do PHP). Se a versão do PHP mudar no cPanel, atualize esse trecho aqui também.

## O que só existe no servidor

- `app/`: app de AR do livro (projeto do JLeo, com repositório próprio).
- `analytics/` (painel e API de estatísticas, em PHP) e a pasta privada `inclusivr-analytics/`, que fica ao lado do `public_html`, fora do site, com a configuração (senha do banco), as sessões e as cópias de segurança. Esses arquivos ainda não estão neste repositório.
- `.well-known/` e `cgi-bin/`: criadas pelo cPanel (certificado HTTPS).
- Não apagar `googlef81de6f1d73c4ae7.html`: é a verificação do site no Google Search Console.
- Arquivos e pastas ocultos (`.git`, backups do `.htaccess` etc.) nunca são entregues ao público: o `.htaccess` responde "não encontrado". Só a `.well-known` fica liberada.

## Estatísticas de uso (analytics)

- `assets/js/inclusivr-analytics.js` é o coletor. Ele só mede nos endereços oficiais (inclusivr.com.br e a loja), nunca em prévias ou cópias do site, e respeita o botão de desligar, o "Não rastrear" e o Controle Global de Privacidade.
- Cada página carrega o coletor com uma linha `<script src=".../inclusivr-analytics.js" defer>`. Página nova precisa dessa linha, senão não entra nas estatísticas.
- `jogos.js` e `animacoes.js` avisam o início, o fim e o abandono de cada partida.
- O texto sobre as estatísticas está em `privacidade/index.html` (e a tradução em `assets/js/traducao-en.js`).
