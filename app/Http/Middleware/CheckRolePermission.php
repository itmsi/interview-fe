<?php

namespace App\Http\Middleware;

use Closure;

class CheckRolePermission
{
    public function handle($request, Closure $next, $permission)
    {
        if (! can($permission)) {
            return _403();
        }

        return $next($request);
    }
}
