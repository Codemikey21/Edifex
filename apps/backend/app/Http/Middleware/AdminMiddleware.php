<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth('api')->check()) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        if (!auth('api')->user()->hasRole('admin')) {
            return response()->json(['message' => 'Acceso denegado. Se requiere rol admin'], 403);
        }

        return $next($request);
    }
}
