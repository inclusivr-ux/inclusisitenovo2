<?php
/**
 * Plugin Name: InclusiVR Cupom no carrinho (loja)
 * Description: No carrinho da campanha (Black November), deixa o campo do cupom aberto, grande e logo abaixo do total, e mostra o preço final já com o desconto assim que o cupom é aplicado. A pessoa continua digitando o código. Para voltar ao carrinho de antes, apague este arquivo.
 * Version: 1.0.0
 * Author: InclusiVR
 *
 * Usa o campo de cupom do próprio WooCommerce (mesmas validações e mensagens): este arquivo só muda onde
 * ele fica, o tamanho e que já começa aberto. Não altera nenhum outro arquivo. Depende do inclusivr-visual.php
 * (campanha, cores e fontes) e some sozinho quando a campanha acaba.
 */
if (!defined('ABSPATH')) exit;

/* false = só aparece com ?cupom=previa no endereço do carrinho (para conferir antes). true = para todos. */
const IVC_PUBLICO = true;

function ivc_ativo(): bool
{
    return function_exists('ivl_ativo') && ivl_ativo()
        && function_exists('is_cart') && is_cart()
        && (IVC_PUBLICO || ($_GET['cupom'] ?? '') === 'previa')
        && ivl_campanha() !== null;
}

const IVC_CSS = <<<'CSS'
body.ivl-cupom-destaque .wp-block-woocommerce-cart-order-summary-block { display: flex; flex-direction: column; }
body.ivl-cupom-destaque .wp-block-woocommerce-cart-order-summary-coupon-form-block { order: 1; border-top: 0; padding: 0; margin: 16px 0 0; }
body.ivl-cupom-destaque .wc-block-components-totals-footer-item .wc-block-components-totals-item__value { font-size: 1.75rem; font-weight: 800; color: var(--noite); }
body.ivl-cupom-destaque .wc-block-components-totals-footer-item .wc-block-components-totals-item__description::after { content: "Produtos + entrega."; display: block; margin-top: 2px; font-size: .9rem; line-height: 1.35; color: var(--carvao); }
body.ivl-cupom-destaque .wc-block-cart__sidebar:has(.wc-block-components-totals-discount) .wc-block-components-totals-footer-item .wc-block-components-totals-item__description::after { content: "Preço final, já com o desconto do cupom."; color: var(--roxo-profundo); font-weight: 700; }
body.ivl-cupom-destaque .wc-block-components-totals-shipping .wc-block-components-totals-item__label::before { content: "Entrega: "; font-weight: 700; }
body.ivl-cupom-destaque .wc-block-components-totals-discount .wc-block-components-totals-item__value { font-weight: 800; color: var(--roxo-profundo); }
body.ivl-cupom-destaque .wc-block-components-totals-discount__coupon-list-item { text-transform: uppercase; font-weight: 700; }
body.ivl-cupom-destaque .wp-block-woocommerce-cart-order-summary-coupon-form-block:has([aria-expanded="true"]) { background: var(--orquidea-nevoa); border: 2px solid var(--roxo); border-radius: 14px; padding: 16px; }
body.ivl-cupom-destaque .wp-block-woocommerce-cart-order-summary-coupon-form-block:has([aria-expanded="true"])::before { content: "Tem um cupom de desconto?"; display: block; margin: 0 0 12px; font-family: var(--fonte-titulo); font-weight: 800; font-size: 1.15rem; line-height: 1.2; color: var(--noite); }
body.ivl-cupom-destaque .wp-block-woocommerce-cart-order-summary-coupon-form-block:has([aria-expanded="true"])::after { content: "Digite o código e aperte Aplicar. O preço final, já com o desconto, aparece no total acima, antes do pagamento."; display: block; margin-top: 12px; font-size: .92rem; line-height: 1.4; color: var(--carvao); }
body.ivl-cupom-destaque .wc-block-components-totals-coupon .wc-block-components-panel__button[aria-expanded="true"] { display: none; }
body.ivl-cupom-destaque .wc-block-components-totals-coupon__form { flex-direction: column; gap: 12px; }
body.ivl-cupom-destaque .wc-block-components-totals-coupon__input { width: 100%; margin: 0; flex: none; }
body.ivl-cupom-destaque .wc-block-components-totals-coupon__input input { height: 58px; font-size: 1.125rem; border-color: var(--roxo-profundo); }
body.ivl-cupom-destaque .wc-block-components-totals-coupon__button { width: 100%; min-height: 54px; }
body.ivl-cupom-aplicado .ivl-faixa__botao { display: none; }
CSS;

/* Abre o campo do cupom sozinho (sem rolar a tela e sem puxar o teclado do celular) e avisa o CSS quando o cupom da campanha já está aplicado. */
const IVC_JS = <<<'JS'
(function () {
  var CUPOM = '__CUPOM__', tentativas = 0, agendado = false;
  var RAIZ = '.wp-block-woocommerce-cart-order-summary-coupon-form-block';
  function aplicado() {
    var c = document.querySelectorAll('.wc-block-components-totals-discount__coupon-list-item');
    for (var i = 0; i < c.length; i++) if ((c[i].textContent || '').toLowerCase().indexOf(CUPOM) > -1) return true;
    return false;
  }
  function conferir() {
    agendado = false;
    var tem = aplicado();
    document.body.classList.toggle('ivl-cupom-aplicado', tem);
    var raiz = document.querySelector(RAIZ);
    var botao = raiz && raiz.querySelector('.wc-block-components-panel__button');
    if (!botao || botao.getAttribute('aria-expanded') !== 'false' || tem || tentativas >= 6) return;
    tentativas++;
    /* ao abrir, o WooCommerce põe o foco no campo: sem rolar a tela e sem deixar o foco (e o teclado) lá */
    var foco = HTMLElement.prototype.focus;
    var soltar = function () { var a = document.activeElement; if (a && a.tagName === 'INPUT' && raiz.contains(a)) a.blur(); };
    HTMLElement.prototype.focus = function () { return foco.call(this, { preventScroll: true }); };
    try { botao.click(); } finally {
      setTimeout(soltar, 0);
      setTimeout(function () { soltar(); HTMLElement.prototype.focus = foco; }, 300);
    }
  }
  function agendar() { if (!agendado) { agendado = true; setTimeout(conferir, 50); } }
  new MutationObserver(agendar).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-expanded'] });
  agendar();
})();
JS;

add_action('wp', function () {
    if (!ivc_ativo()) return;
    $cupom = strtolower(ivl_campanha()['cupom']);

    add_filter('body_class', function ($classes) {
        $classes[] = 'ivl-cupom-destaque';
        return $classes;
    });

    add_action('wp_enqueue_scripts', function () {
        wp_add_inline_style('inclusivr-visual', IVC_CSS);
    }, 101);

    add_action('wp_footer', function () use ($cupom) {
        echo '<script>' . str_replace('__CUPOM__', esc_js($cupom), IVC_JS) . '</script>';
    }, 6);
});
