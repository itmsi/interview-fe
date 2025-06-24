<?php

namespace App\Http\Middleware;

use Closure;
use Cookie;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (! $request->session()->has('lifetime')) {
            return redirect()->route('auth.logout');
        }
        if (! Cookie::get('access_token')) {
            if (! Cookie::get('refresh_token')) {
                return redirect()->route('auth.logout');
            } else {
                $refresh_token = Cookie::get('refresh_token');
                if (! $refresh_token) {
                    return redirect()->route('auth.logout');
                }
                refresh_cookie();
            }
        }

        return $next($request);
    }
}
