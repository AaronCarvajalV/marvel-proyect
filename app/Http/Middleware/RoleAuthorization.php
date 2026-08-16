<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleAuthorization
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ?string $requiredRole = null): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticado. Token ausente o inválido.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Check for specific required role if specified (e.g. 'role:ADMIN')
        if ($requiredRole && $user->rol !== $requiredRole) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso denegado. Se requiere rol '.$requiredRole.' para esta acción.',
            ], Response::HTTP_FORBIDDEN);
        }

        // If user role is CONSULTA, reject any mutating HTTP method (POST, PUT, PATCH, DELETE)
        if ($user->rol === 'CONSULTA' && ! in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'])) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso denegado. El rol CONSULTA solo tiene permisos de lectura.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
