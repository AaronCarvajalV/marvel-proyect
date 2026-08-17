<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\MissionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Marvel Superheroes & Missions API Routes.
|
*/

// Public Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected Routes (Requires valid JWT via 'auth:api')
Route::middleware('auth:api')->group(function () {

    // Auth Profile & Session
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Superheroes (CRUD)
    Route::prefix('heroes')->group(function () {
        Route::get('/', [HeroController::class, 'index']);
        Route::get('/{id}', [HeroController::class, 'show']);

        // Mutations restricted to ADMIN
        Route::middleware('role:ADMIN')->group(function () {
            Route::post('/', [HeroController::class, 'store']);
            Route::put('/{id}', [HeroController::class, 'update']);
            Route::delete('/{id}', [HeroController::class, 'destroy']);
        });
    });

    // Missions (CRUD)
    Route::prefix('misiones')->group(function () {
        Route::get('/', [MissionController::class, 'index']);
        Route::get('/{id}', [MissionController::class, 'show']);

        // Mutations restricted to ADMIN
        Route::middleware('role:ADMIN')->group(function () {
            Route::post('/', [MissionController::class, 'store']);
            Route::put('/{id}', [MissionController::class, 'update']);
            Route::delete('/{id}', [MissionController::class, 'destroy']);
        });
    });

    // Target Locations (Read-only for now)
    Route::get('/target-locations', [\App\Http\Controllers\TargetLocationController::class, 'index']);
});
