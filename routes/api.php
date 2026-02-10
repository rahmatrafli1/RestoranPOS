<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UserController;

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

    // Users (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::get('users/statistics', [UserController::class, 'statistics']);
        Route::get('users/roles', [UserController::class, 'getRoles']);
        Route::get('users/search', [UserController::class, 'search']);
        Route::get('users/check-username', [UserController::class, 'checkUsername']);
        Route::post('users', [UserController::class, 'store']);
        Route::get('users/{id}', [UserController::class, 'show']);
        Route::put('users/{id}', [UserController::class, 'update']);
        Route::delete('users/{id}', [UserController::class, 'destroy']);
        Route::put('users/{id}/status', [UserController::class, 'updateStatus']);
        Route::put('users/{id}/activate', [UserController::class, 'activate']);
        Route::put('users/{id}/deactivate', [UserController::class, 'deactivate']);
        Route::put('users/{id}/reset-password', [UserController::class, 'resetPassword']);
        Route::post('users/bulk-delete', [UserController::class, 'bulkDelete']);
        Route::put('users/bulk-update', [UserController::class, 'bulkUpdate']);
    });

    // Categories (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('categories', CategoryController::class);
    });

    Route::middleware('role:cashier,waiter')->group(function () {
        Route::get('categories', [CategoryController::class, 'index']);
        Route::get('categories/{category}', [CategoryController::class, 'show']);
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
    Route::middleware('role:admin,cashier,waiter')->group(function () {
        Route::get('tables', [TableController::class, 'index']);
        Route::get('tables/available', [TableController::class, 'available']);
        Route::get('tables/{table}', [TableController::class, 'show']);
    });

    Route::middleware('role:admin,cashier,waiter')->group(function () {
        Route::post('tables', [TableController::class, 'store']);
        Route::put('tables/{table}', [TableController::class, 'update']);
        Route::delete('tables/{table}', [TableController::class, 'destroy']);
    });

    // Orders
    Route::middleware('role:admin,cashier,waiter')->group(function () {
        Route::get('orders', [OrderController::class, 'index']);
        Route::post('orders', [OrderController::class, 'store']);
        Route::get('orders/{order}', [OrderController::class, 'show']);
        Route::put('orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::post('orders/{order}/discount', [OrderController::class, 'addDiscount']);
    });

    // Kitchen (Dapur can access)
    Route::middleware('role:admin,chef,waiter')->group(function () {
        Route::get('orders/kitchen/display', [OrderController::class, 'kitchen']);
        Route::put('order-items/{orderItem}/status', [OrderController::class, 'updateItemStatus']);
    });

    // Payments (Kasir only)
    Route::middleware('role:admin,cashier')->group(function () {
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

    // Notifications (All authenticated users can access)
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::delete('/', [NotificationController::class, 'clearAll']);
    });
});
