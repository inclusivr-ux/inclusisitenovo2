<?php
/**
 * Plugin Name: InclusiVR carrinho e finalização sem cache de página
 * Description: O Endurance Page Cache só deixa de guardar endereços com "cart" ou "checkout" no nome, e na loja eles são /carrinho/, /finalizar-compra/ e /minha-conta/. Sem esta exceção, a página do carrinho de um cliente (com o cupom e o total dele) podia ser entregue a outro visitante. Para voltar atrás, apague este arquivo.
 * Version: 1.0.0
 * Author: InclusiVR
 */
if (!defined('ABSPATH')) exit;

add_filter('epc_exempt_uri_contains', function ($itens) {
    return array_merge((array) $itens, ['carrinho', 'finalizar-compra', 'minha-conta']);
});
