<?php
/**
 * Plugin Name: InclusiVR Analytics (loja)
 * Description: Coleta anônima de uso da loja para o painel InclusiVR Analytics (inclusivr.com.br/analytics). Sem cookies e sem dados pessoais. Respeita "Não rastrear"/GPC.
 * Version: 1.1.0
 * Author: InclusiVR
 *
 * Fica em wp-content/mu-plugins/ (sempre ativo, não aparece para desativar por engano).
 * Para tirar a coleta da loja: apague este arquivo.
 *
 * O que faz:
 * 1. Carrega o coletor do site (https://inclusivr.com.br/assets/js/inclusivr-analytics.js)
 *    com um nome simples para cada página (produto, carrinho, checkout, compra concluída...).
 *    O número do pedido nunca vai junto.
 * 2. Se a pessoa veio de um link do site com #iva_v=<código anônimo>, a loja passa a usar
 *    o mesmo código e tira esse pedaço do endereço antes de qualquer outro script ler.
 *    Com #iva_off=1 (a pessoa desligou a medição no site), desliga aqui também.
 * 3. Não mede quem está logado como gerente da loja (equipe).
 * 5. Página da equipe (inclusivr.com.br/analytics/equipe/): chega aqui com #iva_equipe=1
 *    (não contar este navegador) ou #iva_equipe=0 (voltar a contar), grava a marca e volta.
 * 4. Atalho [inclusivr_privacidade] para a página de privacidade: mostra o código anônimo
 *    e o botão de ligar/desligar a medição.
 */
if (!defined('ABSPATH')) exit;

function inclusivr_analytics_pagina(): string
{
    $wc = function_exists('is_woocommerce');
    if ($wc && function_exists('is_order_received_page') && is_order_received_page()) return 'loja/compra-concluida';
    if ($wc && function_exists('is_wc_endpoint_url') && is_wc_endpoint_url('order-pay')) return 'loja/pagamento';
    if ($wc && is_checkout()) return 'loja/checkout';
    if ($wc && is_cart()) return 'loja/carrinho';
    if ($wc && is_product()) {
        $slug = preg_replace('#[^a-z0-9_-]#', '', strtolower((string)get_post_field('post_name', get_queried_object_id())));
        return substr('loja/produto/' . ($slug ?: 'sem-nome'), 0, 80);
    }
    if ($wc && is_account_page()) return 'loja/minha-conta';
    if (is_front_page()) return 'loja/inicio';
    if ($wc && is_shop()) return 'loja/vitrine';
    if (is_search()) return 'loja/busca';
    if (is_404()) return 'loja/404';
    $p = strtolower(trim((string)parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/'));
    $p = preg_replace('#[^a-z0-9/_-]#', '', $p);
    $p = trim(preg_replace('#(^|/)\d+(?=/|$)#', '', $p), '/');   /* tira números (códigos) do caminho */
    return substr('loja/' . ($p !== '' ? $p : 'inicio'), 0, 80);
}

/* página da equipe: marca (ou desmarca) este navegador e volta para o site. Vale para todos, até para quem está logado. */
add_action('wp_head', function () {
    if (is_admin()) return;
    echo "<script>(function(){try{var m=location.hash.match(/^#iva_equipe=([01])$/);if(!m)return;"
       . "if(m[1]==='1'){localStorage.setItem('iva:naocontar','1');localStorage.removeItem('iva:q');localStorage.removeItem('iva:s')}"
       . "else{localStorage.removeItem('iva:naocontar');localStorage.removeItem('iva:optout')}"
       . "location.replace('https://inclusivr.com.br/analytics/equipe/?loja='+m[1])}catch(e){}})();</script>\n";
}, 0);

add_action('wp_head', function () {
    if (is_admin() || current_user_can('manage_woocommerce')) return;
    /* roda antes de tudo: adota o código anônimo vindo do site e limpa o endereço */
    echo "<script>(function(){try{var m=location.hash.match(/^#iva_(?:v=([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})|off=1)$/);if(!m)return;"
       . "if(m[1]){var a=null;try{a=JSON.parse(localStorage.getItem('iva:v'))}catch(e){}if(!a||a.id!==m[1]){localStorage.setItem('iva:v',JSON.stringify({id:m[1],criado:Date.now()}));localStorage.removeItem('iva:s')}}"
       . "else{localStorage.setItem('iva:optout','1');localStorage.removeItem('iva:q')}"
       . "history.replaceState(history.state,'',location.pathname+location.search)}catch(e){}})();</script>\n";
    echo '<script src="https://inclusivr.com.br/assets/js/inclusivr-analytics.js" data-pagina="' . esc_attr(inclusivr_analytics_pagina()) . '" defer></script>' . "\n";
}, 1);

add_shortcode('inclusivr_privacidade', function () {
    return '<div data-iva-privacidade><p>A medição anônima de uso desta loja aparece aqui quando o JavaScript está ligado.</p></div>';
});
