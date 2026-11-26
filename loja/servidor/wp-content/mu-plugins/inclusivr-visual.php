<?php
/**
 * Plugin Name: InclusiVR Visual (loja)
 * Description: Deixa a loja com a identidade do site inclusivr.com.br e destaca a campanha Black November (cupom IGOR). Não mexe no tema nem nos produtos: para voltar ao visual antigo, apague este arquivo.
 * Version: 1.0.0
 * Author: InclusiVR
 *
 * Fica em wp-content/mu-plugins/ (sempre ativo). Arquivos de apoio em mu-plugins/inclusivr-visual/
 * (loja.css, fontes e logo, copiados do site).
 *
 * Campanha: o preço "por" é calculado na hora a partir do preço do livro e do cupom cadastrados no
 * WooCommerce (nunca fica diferente do que o carrinho cobra). Tudo some sozinho depois do fim da
 * campanha, se o cupom for desativado ou se ele deixar de dar desconto.
 */
if (!defined('ABSPATH')) exit;

define('IVL_VERSAO', '1.0.6');
/* false = o visual novo só aparece com ?visual=previa no endereço (para conferir antes). */
define('IVL_PUBLICO', true);
const IVL_SITE = 'https://inclusivr.com.br/';
const IVL_CAMPANHA = [
    'nome'    => 'Black November',
    'cupom'   => 'IGOR',
    'produto' => 16,
    'inicio'  => '2026-11-01T00:00:00-03:00',
    'fim'     => '2026-11-30T23:59:59-03:00',
    'fim_txt' => '30 de novembro',
    'artista' => 'IGOR é o cupom do artista: quem compra com ele apoia o Igor Bucioli, o artista surdo que desenhou o livro.',
    'brinde'  => 'De presente: um marca-páginas exclusivo de Signária, assinado pelo Igor e pelo Luciano.',
];

function ivl_previa(): bool { return !IVL_PUBLICO && (($_GET['visual'] ?? '') === 'previa'); }
function ivl_ativo(): bool { return !is_admin() && (IVL_PUBLICO || ivl_previa()); }
/* mantém a prévia nos links que o próprio plugin cria */
function ivl_url(string $url): string { return ivl_previa() ? add_query_arg('visual', 'previa', $url) : $url; }

/* Campanha em vigor? Devolve preço "de", preço "por" e o cupom, calculados pelo WooCommerce. */
function ivl_campanha(): ?array
{
    static $c = false;
    if ($c !== false) return $c;
    $c = null;
    if (!function_exists('wc_get_product') || !class_exists('WC_Coupon')) return null;
    $agora = time();
    if ($agora < strtotime(IVL_CAMPANHA['inicio']) || $agora > strtotime(IVL_CAMPANHA['fim'])) return null;
    $cupom = new WC_Coupon(IVL_CAMPANHA['cupom']);
    if (!$cupom->get_id() || get_post_status($cupom->get_id()) !== 'publish') return null;
    $expira = $cupom->get_date_expires();
    if ($expira && $expira->getTimestamp() < $agora) return null;
    $produto = wc_get_product(IVL_CAMPANHA['produto']);
    if (!$produto || !$produto->is_purchasable()) return null;
    $de = (float)wc_get_price_to_display($produto);
    $valor = (float)$cupom->get_amount();
    $por = $cupom->get_discount_type() === 'percent' ? $de * (1 - $valor / 100) : $de - $valor;
    $por = round(max(0, $por), 2);
    if ($por >= $de) return null;
    return $c = ['de' => $de, 'por' => $por, 'cupom' => strtoupper($cupom->get_code()), 'produto' => $produto->get_id()];
}

function ivl_dinheiro(float $v): string { return 'R$ ' . number_format($v, 2, ',', '.'); }

function ivl_cupom_no_carrinho(array $c): bool
{
    return function_exists('WC') && WC()->cart && WC()->cart->has_discount(wc_format_coupon_code($c['cupom']));
}

/* ---------- links "comprar com o cupom" e "aplicar o cupom" ---------- */
add_action('wp_loaded', function () {
    $acao = $_GET['ivl'] ?? '';
    if (!in_array($acao, ['comprar', 'cupom'], true) || is_admin() || !function_exists('WC') || !WC()->cart) return;
    $c = ivl_campanha();
    if ($c) {
        if ($acao === 'comprar') {
            $tem = false;
            foreach (WC()->cart->get_cart() as $item) if ((int)$item['product_id'] === $c['produto']) $tem = true;
            if (!$tem) WC()->cart->add_to_cart($c['produto'], 1);
        }
        if (!WC()->cart->is_empty() && !ivl_cupom_no_carrinho($c)) WC()->cart->apply_coupon($c['cupom']);
    }
    $destino = $acao === 'comprar' ? wc_get_cart_url() : remove_query_arg('ivl');
    wp_safe_redirect(ivl_url($destino));
    exit;
}, 30);

add_action('wp', function () {
    if (!ivl_ativo()) return;

    add_action('wp_enqueue_scripts', function () {
        wp_enqueue_style('inclusivr-visual', WPMU_PLUGIN_URL . '/inclusivr-visual/loja.css', [], IVL_VERSAO);
    }, 100);

    add_filter('body_class', function ($classes) {
        $classes[] = 'ivl-visual';
        if (ivl_campanha()) $classes[] = 'ivl-campanha';
        return $classes;
    });

    /* "Site InclusiVR" no começo do menu */
    add_filter('woocommerce_single_product_carousel_options', function ($o) {
        $o['directionNav'] = true;
        $o['prevText'] = 'Imagem anterior';
        $o['nextText'] = 'Próxima imagem';
        return $o;
    });
        add_filter('wp_nav_menu_items', function ($itens, $args) {
        if (($args->theme_location ?? '') !== 'primary') return $itens;
        return '<li class="menu-item ivl-menu-site"><a href="' . esc_url(IVL_SITE) . '">Site InclusiVR</a></li>' . $itens;
    }, 10, 2);

    /* página do livro: bloco da campanha logo abaixo do preço */
    add_action('woocommerce_single_product_summary', function () {
        $c = ivl_campanha();
        global $product;
        if (!$c || !$product || $product->get_id() !== $c['produto']) return;
        echo '<div class="ivl-oferta">'
            . '<p class="ivl-oferta__selo">' . esc_html(IVL_CAMPANHA['nome']) . '</p>'
            . '<p class="ivl-oferta__preco"><del><span class="screen-reader-text">De </span>' . esc_html(ivl_dinheiro($c['de'])) . '</del> '
            . '<span class="ivl-oferta__por"><span class="screen-reader-text">por </span>' . esc_html(ivl_dinheiro($c['por'])) . '</span> '
            . '<span class="ivl-oferta__com">com o cupom <strong class="ivl-cupom">' . esc_html($c['cupom']) . '</strong></span></p>'
            . '<p class="ivl-oferta__nota">Até ' . esc_html(IVL_CAMPANHA['fim_txt']) . '. O desconto entra no carrinho, onde também se calcula o frete. ' . esc_html(IVL_CAMPANHA['artista']) . '</p>'
            . (IVL_CAMPANHA['brinde'] !== '' ? '<p class="ivl-oferta__brinde">' . esc_html(IVL_CAMPANHA['brinde']) . '</p>' : '')
            . '<a class="ivl-botao ivl-botao--lima" href="' . esc_url(ivl_url(add_query_arg('ivl', 'comprar', home_url('/')))) . '">Comprar com o cupom ' . esc_html($c['cupom']) . '</a>'
            . '</div>';
    }, 11);

    /* vitrine: etiqueta embaixo do preço */
    add_action('woocommerce_after_shop_loop_item_title', function () {
        $c = ivl_campanha();
        global $product;
        if (!$c || !$product || $product->get_id() !== $c['produto']) return;
        echo '<p class="ivl-etiqueta">' . esc_html(ivl_dinheiro($c['por'])) . ' com o cupom <strong>' . esc_html($c['cupom']) . '</strong></p>';
    }, 11);

    /* carrinho e finalização: lembrete do cupom */
    $lembrete = function () {
        $c = ivl_campanha();
        if (!$c || !function_exists('WC') || !WC()->cart || WC()->cart->is_empty()) return;
        if (ivl_cupom_no_carrinho($c)) {
            echo '<div class="ivl-lembrete ivl-lembrete--ok" role="status"><p><strong>Cupom ' . esc_html($c['cupom']) . ' aplicado.</strong> O desconto da ' . esc_html(IVL_CAMPANHA['nome']) . ' já está no total.</p></div>';
            return;
        }
        echo '<div class="ivl-lembrete"><p><span class="ivl-lembrete__selo">' . esc_html(IVL_CAMPANHA['nome']) . '</span> Com o cupom <strong class="ivl-cupom">' . esc_html($c['cupom']) . '</strong>, o livro sai por <strong>' . esc_html(ivl_dinheiro($c['por'])) . '</strong>.</p>'
            . '<a class="ivl-botao ivl-botao--lima ivl-botao--sm" href="' . esc_url(ivl_url(add_query_arg('ivl', 'cupom'))) . '">Aplicar o cupom ' . esc_html($c['cupom']) . '</a></div>';
    };
    add_action('woocommerce_before_cart', $lembrete, 5);
    add_action('woocommerce_before_checkout_form', $lembrete, 5);

    /* faixa da campanha (vai para o topo da página) e rodapé da InclusiVR */
    add_action('wp_footer', function () {
        $c = ivl_campanha();
        if ($c) {
            $aplicado = ivl_cupom_no_carrinho($c);
            $no_carrinho = function_exists('is_cart') && (is_cart() || is_checkout());
            echo '<div class="ivl-faixa" id="ivl-faixa" role="region" aria-label="Promoção ' . esc_attr(IVL_CAMPANHA['nome']) . '"><div class="ivl-faixa__dentro">'
                . '<span class="ivl-faixa__selo">' . esc_html(IVL_CAMPANHA['nome']) . '</span>'
                . ($aplicado
                    ? '<p class="ivl-faixa__texto">Cupom <strong class="ivl-cupom">' . esc_html($c['cupom']) . '</strong> aplicado: o livro SinalizaAção sai por <strong>' . esc_html(ivl_dinheiro($c['por'])) . '</strong> (mais o frete).</p>'
                    : '<p class="ivl-faixa__texto">Com o cupom <strong class="ivl-cupom">' . esc_html($c['cupom']) . '</strong>, o livro SinalizaAção sai de <del>' . esc_html(ivl_dinheiro($c['de'])) . '</del> por <strong>' . esc_html(ivl_dinheiro($c['por'])) . '</strong> até ' . esc_html(IVL_CAMPANHA['fim_txt']) . '.</p>');
            if (!$aplicado) {
                echo $no_carrinho
                    ? '<a class="ivl-faixa__botao" href="' . esc_url(ivl_url(add_query_arg('ivl', 'cupom'))) . '">Aplicar o cupom</a>'
                    : '<a class="ivl-faixa__botao" href="' . esc_url(ivl_url(add_query_arg('ivl', 'comprar', home_url('/')))) . '">Comprar com o cupom</a>';
            }
            echo '</div></div>'
                . '<script>(function(){var f=document.getElementById("ivl-faixa");if(f&&document.body)document.body.insertBefore(f,document.body.firstChild);})();</script>';
        }
        $logo = WPMU_PLUGIN_URL . '/inclusivr-visual/img/';
        $loja = home_url('/');
        echo '<div class="ivl-rodape"><div class="ivl-rodape__dentro">'
            . '<div class="ivl-rodape__marca"><a href="' . esc_url(IVL_SITE) . '"><picture><source type="image/webp" srcset="' . esc_url($logo . 'inclusivr-branco-ciano-horizontal-120.webp') . ' 1x, ' . esc_url($logo . 'inclusivr-branco-ciano-horizontal-180.webp') . ' 1.5x">'
            . '<img src="' . esc_url($logo . 'inclusivr-branco-ciano-horizontal-120.png') . '" width="218" height="60" alt="InclusiVR, site da empresa" loading="lazy"></picture></a>'
            . '<p>Conectando mundos por meio das línguas de sinais e tecnologia.</p></div>'
            . '<nav class="ivl-rodape__col" aria-label="Loja"><p class="ivl-rodape__titulo">Loja</p><ul>'
            . '<li><a href="' . esc_url($loja) . '">Início da loja</a></li>'
            . '<li><a href="' . esc_url(wc_get_cart_url()) . '">Carrinho</a></li>'
            . '<li><a href="' . esc_url(wc_get_page_permalink('myaccount')) . '">Minha conta</a></li>'
            . '<li><a href="' . esc_url($loja . 'rastrear-encomenda/') . '">Rastrear encomenda</a></li>'
            . '<li><a href="' . esc_url($loja . 'reembolso_devolucoes/') . '">Trocas e devoluções</a></li></ul></nav>'
            . '<nav class="ivl-rodape__col" aria-label="InclusiVR"><p class="ivl-rodape__titulo">InclusiVR</p><ul>'
            . '<li><a href="' . esc_url(IVL_SITE) . '">Site InclusiVR</a></li>'
            . '<li><a href="' . esc_url(IVL_SITE . 'sinalizaacao/') . '">Livro SinalizaAção</a></li>'
            . '<li><a href="' . esc_url(IVL_SITE . 'apps/') . '">App e Jogos</a></li>'
            . '<li><a href="' . esc_url(IVL_SITE . 'quem-somos/') . '">Quem somos</a></li>'
            . '<li><a href="' . esc_url(IVL_SITE . 'privacidade/') . '">Privacidade</a></li></ul></nav>'
            . '<div class="ivl-rodape__col"><p class="ivl-rodape__titulo">Contato</p><ul>'
            . '<li><a href="mailto:contato@inclusivr.com.br">contato@inclusivr.com.br</a></li>'
            . '<li><a href="https://wa.me/5516994002335">WhatsApp (16) 99400-2335</a></li>'
            . '<li><a href="https://www.instagram.com/inclusivr/">Instagram @inclusivr</a></li></ul></div>'
            . '</div><div class="ivl-rodape__base"><p>© ' . esc_html(wp_date('Y')) . ' InclusiVR LTDA · CNPJ 63.821.106/0001-76</p><p>Ilustrações do artista surdo Igor Bucioli · Feito por muitas mãos.</p></div></div>';
    }, 5);
});
