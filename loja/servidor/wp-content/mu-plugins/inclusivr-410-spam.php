<?php
/**
 * Plugin Name: InclusiVR - limpeza de spam no Google
 * Description: Responde 410 (removido para sempre) aos enderecos criados pelo spam da invasao de 2026, para o Google tira-los do indice mais rapido. Criado em 22/11/2026. Pode ser apagado em meados de 2027.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

(function () {
	$uri   = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
	$path  = (string) parse_url( $uri, PHP_URL_PATH );
	$query = (string) parse_url( $uri, PHP_URL_QUERY );

	$spam = preg_match( '#^/20[0-9]{2}/#', $path )              // posts de cassino: /2026/10/11/...
		|| preg_match( '#^/(kaden|ajax)/#', $path )              // loja japonesa falsa
		|| ( preg_match( '#^/wp-[^/]*\.php$#', $path ) && strpos( $query, 'items/' ) === 0 ); // wp-*.php?items/F...

	if ( ! $spam ) { return; }

	if ( ! headers_sent() ) {
		header( 'HTTP/1.1 410 Gone', true, 410 );
		header( 'X-Robots-Tag: noindex' );
		header( 'Cache-Control: no-store' );
		header( 'Content-Type: text/html; charset=utf-8' );
	}
	echo '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Página removida</title></head><body><p>Esta página não existe mais. <a href="https://loja.inclusivr.com.br/">Ir para a Loja InclusiVR</a></p></body></html>';
	exit;
})();
