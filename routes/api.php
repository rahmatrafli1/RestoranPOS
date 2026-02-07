<?php
// filepath: routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Categories (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('categories', CategoryController::class);
    });

    // Menu Items (Admin only for CUD, All for Read)
    Route::get('menu-items', [MenuItemController::class, 'index']);
    Route::get('menu-items/{menuItem}', [MenuItemController::class, 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::post('menu-items', [MenuItemController::class, 'store']);
        Route::put('menu-items/{menuItem}', [MenuItemController::class, 'update']);
        Route::delete('menu-items/{menuItem}', [MenuItemController::class, 'destroy']);
        Route::post('menu-items/{menuItem}/toggle-availability', [MenuItemController::class, 'toggleAvailability']);
    });

    // Tables (Admin only for CUD, Kasir can read)
    Route::middleware('role:admin,kasir')->group(function () {
        Route::get('tables', [TableController::class, 'index']);
        Route::get('tables/available', [TableController::class, 'available']);
        Route::get('tables/{table}', [TableController::class, 'show']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::post('tables', [TableController::class, 'store']);
        Route::put('tables/{table}', [TableController::class, 'update']);
        Route::delete('tables/{table}', [TableController::class, 'destroy']);
    });

    // Orders
    Route::middleware('role:admin,kasir')->group(function () {
        Route::get('orders', [OrderController::class, 'index']);
        Route::post('orders', [OrderController::class, 'store']);
        Route::get('orders/{order}', [OrderController::class, 'show']);
        Route::put('orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::post('orders/{order}/discount', [OrderController::class, 'addDiscount']);
    });

    // Kitchen (Dapur can access)
    Route::middleware('role:admin,dapur')->group(function () {
        Route::get('orders/kitchen/display', [OrderController::class, 'kitchen']);
        Route::put('order-items/{orderItem}/status', [OrderController::class, 'updateItemStatus']);
    });

    // Payments (Kasir only)
    Route::middleware('role:admin,kasir')->group(function () {
        Route::post('orders/{order}/payment', [PaymentController::class, 'store']);
        Route::get('payments/{payment}', [PaymentController::class, 'show']);
        Route::get('orders/{order}/payment', [PaymentController::class, 'getByOrder']);
    });

    // Reports (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('reports/dashboard', [ReportController::class, 'dashboard']);
        Route::get('reports/daily-sales', [ReportController::class, 'dailySales']);
        Route::get('reports/sales-summary', [ReportController::class, 'salesSummary']);
        Route::get('reports/popular-items', [ReportController::class, 'popularItems']);
        Route::get('reports/sales-by-category', [ReportController::class, 'salesByCategory']);
        Route::get('reports/payment-methods', [ReportController::class, 'paymentMethods']);
    });
});
