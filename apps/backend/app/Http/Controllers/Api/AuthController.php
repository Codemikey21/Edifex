<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|in:client,worker',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        $user->assignRole($request->role);

        $token = JWTAuth::fromUser($user);

        $role = $user->getRoleNames()->first() ?? $user->role;
        $userData = array_merge($user->toArray(), ['role' => $role]);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user'    => $userData,
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales incorrectas',
            ], 401);
        }

        $user = auth('api')->user();
        $role = $user->getRoleNames()->first() ?? $user->role;
        $userData = array_merge($user->toArray(), ['role' => $role]);

        return response()->json([
            'message' => 'Login exitoso',
            'token'   => $token,
            'user'    => $userData,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }

    public function me(): JsonResponse
    {
        $user = auth('api')->user();
        $role = $user->getRoleNames()->first() ?? $user->role;
        $userData = array_merge($user->toArray(), ['role' => $role]);

        return response()->json([
            'user' => $userData,
        ]);
    }
}
