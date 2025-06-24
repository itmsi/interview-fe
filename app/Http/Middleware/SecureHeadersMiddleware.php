<?php

/**
 * SecureHeadersMiddleware.
 */

namespace App\Http\Middleware;

use Closure;

/**
 * SecureHeadersMiddleware.
 */
class SecureHeadersMiddleware
{
    private $unwantedHeaderList = ['X-Powered-By', 'Server'];

    public function handle($request, Closure $next)
    {
        $this->removeUnwantedHeaders($this->unwantedHeaderList);
        $response = $next($request);
        $response->headers->set('Expect-CT', 'max-age:86400, enforce');
        $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');
        $response->headers->set('Content-Security-Policy', "script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://fonts.googleapis.com/  'unsafe-eval' 'unsafe-inline' *.jsdelivr.net; object-src 'self';");
        $response->headers->set('Permissions-Policy', 'autoplay=(self), camera=(), encrypted-media=(self), fullscreen=(), geolocation=(self), gyroscope=(self), magnetometer=(), microphone=(), midi=(), payment=(), sync-xhr=(self), usb=()');
        $response->headers->set('Referrer-Policy', 'no-referrer');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }

    private function removeUnwantedHeaders($headerList)
    {
        foreach ($headerList as $header) {
            header_remove($header);
        }
    }
}
