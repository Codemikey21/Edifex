<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WorkerController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Rutas públicas de autenticación
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    // Rutas protegidas con JWT
    Route::middleware('auth:api')->group(function () {

        // Auth
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me',      [AuthController::class, 'me']);

        // Operario
        Route::prefix('worker')->group(function () {
            Route::get('profile',              [WorkerController::class, 'getProfile']);
            Route::post('profile',             [WorkerController::class, 'createOrUpdateProfile']);
            Route::post('skills',              [WorkerController::class, 'addSkill']);
            Route::post('certifications',      [WorkerController::class, 'addCertification']);
            Route::post('cv',                  [WorkerController::class, 'uploadCV']);
        });

    });

});
