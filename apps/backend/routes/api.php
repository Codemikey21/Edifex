<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WorkerController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Rutas públicas de autenticación
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    // Rutas públicas del marketplace
    Route::get('jobs',                 [JobController::class, 'index']);
    Route::get('jobs/{id}',            [JobController::class, 'show']);
    Route::get('workers/{id}/reviews', [ReviewController::class, 'workerReviews']);

    // Rutas protegidas con JWT
    Route::middleware('auth:api')->group(function () {

        // Auth
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me',      [AuthController::class, 'me']);

        // Operario
        Route::prefix('worker')->group(function () {
            Route::get('profile',         [WorkerController::class, 'getProfile']);
            Route::post('profile',        [WorkerController::class, 'createOrUpdateProfile']);
            Route::post('skills',         [WorkerController::class, 'addSkill']);
            Route::post('certifications', [WorkerController::class, 'addCertification']);
            Route::post('cv',             [WorkerController::class, 'uploadCV']);
        });

        // Jobs
        Route::prefix('jobs')->group(function () {
            Route::post('/',            [JobController::class, 'store']);
            Route::get('my-jobs',       [JobController::class, 'myJobs']);
            Route::patch('{id}/status', [JobController::class, 'updateStatus']);
        });

        // Reviews
        Route::post('reviews', [ReviewController::class, 'store']);

        // Chat
        Route::prefix('chat')->group(function () {
            Route::get('conversations',               [ChatController::class, 'getConversations']);
            Route::post('conversations',              [ChatController::class, 'createConversation']);
            Route::get('conversations/{id}/messages', [ChatController::class, 'getMessages']);
            Route::post('messages',                   [ChatController::class, 'sendMessage']);
        });

        // Admin
        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('dashboard',                    [AdminController::class, 'dashboard']);
            Route::get('workers',                      [AdminController::class, 'listWorkers']);
            Route::patch('workers/{id}/approve',       [AdminController::class, 'approveWorker']);
            Route::patch('workers/{id}/suspend',       [AdminController::class, 'suspendWorker']);
            Route::get('users',                        [AdminController::class, 'listUsers']);
            Route::patch('users/{id}/suspend',         [AdminController::class, 'suspendUser']);
            Route::get('jobs',                         [AdminController::class, 'listJobs']);
            Route::get('reviews/flagged',              [AdminController::class, 'flaggedReviews']);
        });

    });

});
