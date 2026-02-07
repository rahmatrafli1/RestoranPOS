<?php
// filepath: app/Http/Controllers/Api/ReportController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Get daily sales report.
     */
    public function dailySales(Request $request)
    {
        $date = $request->input('date', today());

        $report = Order::where('status', 'completed')
            ->whereDate('created_at', $date)
            ->selectRaw('
                DATE(created_at) as date,
                COUNT(*) as total_orders,
                SUM(subtotal) as subtotal,
                SUM(tax) as tax,
                SUM(discount) as discount,
                SUM(total) as total_sales,
                AVG(total) as avg_order_value
            ')
            ->groupBy('date')
            ->first();

        return response()->json([
            'message' => 'Daily sales report retrieved successfully',
            'data' => $report ?? [
                'date' => $date,
                'total_orders' => 0,
                'subtotal' => 0,
                'tax' => 0,
                'discount' => 0,
                'total_sales' => 0,
                'avg_order_value' => 0,
            ]
        ]);
    }

    /**
     * Get sales summary by date range.
     */
    public function salesSummary(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $report = Order::where('status', 'completed')
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->selectRaw('
                DATE(created_at) as date,
                COUNT(*) as total_orders,
                SUM(total) as total_sales
            ')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $summary = [
            'total_orders' => $report->sum('total_orders'),
            'total_sales' => $report->sum('total_sales'),
            'daily_breakdown' => $report,
        ];

        return response()->json([
            'message' => 'Sales summary retrieved successfully',
            'data' => $summary
        ]);
    }

    /**
     * Get popular menu items.
     */
    public function popularItems(Request $request)
    {
        $limit = $request->input('limit', 10);
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = OrderItem::select(
                'menu_items.id',
                'menu_items.name',
                'categories.name as category_name',
                DB::raw('COUNT(order_items.id) as order_count'),
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('categories', 'menu_items.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed');

        if ($startDate && $endDate) {
            $query->whereBetween('orders.created_at', [$startDate, $endDate]);
        }

        $popularItems = $query->groupBy('menu_items.id', 'menu_items.name', 'categories.name')
            ->orderByDesc('total_quantity')
            ->limit($limit)
            ->get();

        return response()->json([
            'message' => 'Popular items retrieved successfully',
            'data' => $popularItems
        ]);
    }

    /**
     * Get sales by category.
     */
    public function salesByCategory(Request $request)
    {
        $startDate = $request->input('start_date', today()->subDays(30));
        $endDate = $request->input('end_date', today());

        $report = OrderItem::select(
                'categories.name as category_name',
                DB::raw('COUNT(order_items.id) as total_items'),
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('categories', 'menu_items.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupBy('categories.name')
            ->orderByDesc('total_revenue')
            ->get();

        return response()->json([
            'message' => 'Sales by category retrieved successfully',
            'data' => $report
        ]);
    }

    /**
     * Get payment method summary.
     */
    public function paymentMethods(Request $request)
    {
        $startDate = $request->input('start_date', today()->subDays(30));
        $endDate = $request->input('end_date', today());

        $report = DB::table('payments')
            ->join('orders', 'payments.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->whereBetween('payments.paid_at', [$startDate, $endDate])
            ->select(
                'payments.payment_method',
                DB::raw('COUNT(*) as transaction_count'),
                DB::raw('SUM(payments.amount) as total_amount')
            )
            ->groupBy('payments.payment_method')
            ->get();

        return response()->json([
            'message' => 'Payment methods report retrieved successfully',
            'data' => $report
        ]);
    }

    /**
     * Get dashboard statistics.
     */
    public function dashboard()
    {
        $today = today();

        $stats = [
            'today' => [
                'total_orders' => Order::whereDate('created_at', $today)->count(),
                'total_sales' => Order::where('status', 'completed')
                    ->whereDate('created_at', $today)
                    ->sum('total'),
                'pending_orders' => Order::where('status', 'pending')
                    ->whereDate('created_at', $today)
                    ->count(),
            ],
            'this_month' => [
                'total_orders' => Order::whereMonth('created_at', $today->month)
                    ->whereYear('created_at', $today->year)
                    ->count(),
                'total_sales' => Order::where('status', 'completed')
                    ->whereMonth('created_at', $today->month)
                    ->whereYear('created_at', $today->year)
                    ->sum('total'),
            ],
            'tables' => [
                'available' => \App\Models\Table::where('status', 'available')->count(),
                'occupied' => \App\Models\Table::where('status', 'occupied')->count(),
            ],
            'menu_items' => [
                'total' => MenuItem::count(),
                'available' => MenuItem::where('is_available', true)->count(),
            ],
        ];

        return response()->json([
            'message' => 'Dashboard statistics retrieved successfully',
            'data' => $stats
        ]);
    }
}