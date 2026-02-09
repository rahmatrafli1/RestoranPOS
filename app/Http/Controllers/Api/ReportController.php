<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function dashboard()
    {
        try {
            $today = Carbon::today();
            $yesterday = Carbon::yesterday();
            $thisMonth = Carbon::now()->startOfMonth();

            // Today's statistics
            $todaySales = Order::whereDate('created_at', $today)
                ->where('status', 'completed')
                ->sum('total');

            $todayOrders = Order::whereDate('created_at', $today)->count();

            // Yesterday's sales for comparison
            $yesterdaySales = Order::whereDate('created_at', $yesterday)
                ->where('status', 'completed')
                ->sum('total');

            // This month statistics
            $monthSales = Order::whereDate('created_at', '>=', $thisMonth)
                ->where('status', 'completed')
                ->sum('total');

            $monthOrders = Order::whereDate('created_at', '>=', $thisMonth)->count();

            // Calculate changes
            $salesChange = $yesterdaySales > 0
                ? round((($todaySales - $yesterdaySales) / $yesterdaySales) * 100, 2)
                : 0;

            // Pending orders
            $pendingOrders = Order::where('status', 'pending')->count();

            return response()->json([
                'message' => 'Dashboard data retrieved successfully',
                'data' => [
                    'today' => [
                        'sales' => $todaySales,
                        'orders' => $todayOrders,
                        'sales_change' => $salesChange,
                    ],
                    'month' => [
                        'sales' => $monthSales,
                        'orders' => $monthOrders,
                    ],
                    'pending_orders' => $pendingOrders,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get daily sales report
     */
    public function dailySales(Request $request)
    {
        try {
            $date = $request->get('date', Carbon::today()->toDateString());

            $orders = Order::with(['orderItems.menuItem', 'table', 'payment'])
                ->whereDate('created_at', $date)
                ->latest()
                ->get();

            $completedOrders = $orders->where('status', 'completed');

            $summary = [
                'total_sales' => $completedOrders->sum('total'),
                'total_orders' => $orders->count(),
                'completed_orders' => $completedOrders->count(),
                'cancelled_orders' => $orders->where('status', 'cancelled')->count(),
                'pending_orders' => $orders->where('status', 'pending')->count(),
                'average_order_value' => $completedOrders->count() > 0
                    ? round($completedOrders->sum('total') / $completedOrders->count(), 2)
                    : 0,
            ];

            return response()->json([
                'message' => 'Daily sales retrieved successfully',
                'data' => [
                    'summary' => $summary,
                    'orders' => $orders,
                    'date' => $date,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve daily sales',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales summary with statistics
     */
    public function salesSummary(Request $request)
    {
        try {
            // Determine date range
            $period = $request->get('period', 'today');
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            [$start, $end] = $this->getDateRange($period, $startDate, $endDate);

            // Get previous period for comparison
            $diff = $start->diffInDays($end);
            $prevStart = $start->copy()->subDays($diff + 1);
            $prevEnd = $start->copy()->subDay();

            // Current period orders
            $currentOrders = Order::whereBetween('created_at', [$start, $end])->get();
            $completedOrders = $currentOrders->where('status', 'completed');

            $totalSales = $completedOrders->sum('total');
            $totalOrders = $currentOrders->count();
            $completedCount = $completedOrders->count();
            $cancelledCount = $currentOrders->where('status', 'cancelled')->count();

            // Previous period stats for comparison
            $prevOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])
                ->where('status', 'completed')
                ->get();
            $prevSales = $prevOrders->sum('total');
            $prevOrderCount = $prevOrders->count();

            // Calculate changes
            $salesChange = $prevSales > 0
                ? round((($totalSales - $prevSales) / $prevSales) * 100, 2)
                : 0;

            $orderChange = $prevOrderCount > 0
                ? round((($completedCount - $prevOrderCount) / $prevOrderCount) * 100, 2)
                : 0;

            // Top products
            $topProducts = OrderItem::select(
                'menu_item_id',
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(subtotal) as total_revenue')
            )
                ->whereHas('order', function ($q) use ($start, $end) {
                    $q->whereBetween('created_at', [$start, $end])
                        ->where('status', 'completed');
                })
                ->with('menuItem')
                ->groupBy('menu_item_id')
                ->orderBy('total_revenue', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->menu_item_id,
                        'name' => $item->menuItem ? $item->menuItem->name : 'Unknown',
                        'quantity' => $item->total_quantity,
                        'revenue' => $item->total_revenue,
                    ];
                });

            // Sales by order type
            $salesByType = Order::select(
                'order_type',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total) as total')
            )
                ->whereBetween('created_at', [$start, $end])
                ->where('status', 'completed')
                ->groupBy('order_type')
                ->get()
                ->map(function ($item) use ($totalSales) {
                    return [
                        'type' => $item->order_type,
                        'count' => $item->count,
                        'total' => $item->total,
                        'percentage' => $totalSales > 0
                            ? round(($item->total / $totalSales) * 100, 2)
                            : 0,
                    ];
                });

            // Hourly statistics
            $hourlyStats = [];
            if ($period === 'today' || $start->isSameDay($end)) {
                $hourlyStats = Order::select(
                    DB::raw('HOUR(created_at) as hour'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw('SUM(total) as total')
                )
                    ->whereDate('created_at', $start)
                    ->where('status', 'completed')
                    ->groupBy(DB::raw('HOUR(created_at)'))
                    ->orderBy('hour')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'hour' => $item->hour,
                            'label' => sprintf('%02d:00', $item->hour),
                            'count' => $item->count,
                            'total' => $item->total,
                        ];
                    });
            }

            return response()->json([
                'message' => 'Sales summary retrieved successfully',
                'data' => [
                    'summary' => [
                        'total_sales' => $totalSales,
                        'total_orders' => $totalOrders,
                        'completed_orders' => $completedCount,
                        'cancelled_orders' => $cancelledCount,
                        'pending_orders' => $currentOrders->where('status', 'pending')->count(),
                        'average_order_value' => $completedCount > 0
                            ? round($totalSales / $completedCount, 2)
                            : 0,
                        'completion_rate' => $totalOrders > 0
                            ? round(($completedCount / $totalOrders) * 100, 2)
                            : 0,
                        'cancellation_rate' => $totalOrders > 0
                            ? round(($cancelledCount / $totalOrders) * 100, 2)
                            : 0,
                        'sales_change' => $salesChange,
                        'order_change' => $orderChange,
                    ],
                    'topProducts' => $topProducts,
                    'salesByType' => $salesByType,
                    'hourlyStats' => $hourlyStats,
                    'period' => [
                        'start' => $start->toDateString(),
                        'end' => $end->toDateString(),
                        'label' => $period,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve sales summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get popular items
     */
    public function popularItems(Request $request)
    {
        try {
            $limit = $request->get('limit', 10);
            $period = $request->get('period', 'all');

            $query = OrderItem::select(
                'menu_item_id',
                DB::raw('SUM(quantity) as total_sold'),
                DB::raw('SUM(subtotal) as revenue'),
                DB::raw('COUNT(DISTINCT order_id) as order_count')
            )
                ->whereHas('order', function ($q) use ($period) {
                    $q->where('status', 'completed');

                    if ($period !== 'all') {
                        [$start, $end] = $this->getDateRange($period);
                        $q->whereBetween('created_at', [$start, $end]);
                    }
                })
                ->with('menuItem.category')
                ->groupBy('menu_item_id')
                ->orderBy('total_sold', 'desc')
                ->limit($limit);

            $items = $query->get()->map(function ($item) {
                return [
                    'id' => $item->menu_item_id,
                    'name' => $item->menuItem ? $item->menuItem->name : 'Unknown',
                    'category' => $item->menuItem && $item->menuItem->category
                        ? $item->menuItem->category->name
                        : 'Unknown',
                    'total_sold' => $item->total_sold,
                    'revenue' => $item->revenue,
                    'order_count' => $item->order_count,
                    'average_price' => $item->total_sold > 0
                        ? round($item->revenue / $item->total_sold, 2)
                        : 0,
                ];
            });

            return response()->json([
                'message' => 'Popular items retrieved successfully',
                'data' => $items
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve popular items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales by category
     */
    public function salesByCategory(Request $request)
    {
        try {
            $period = $request->get('period', 'all');

            $query = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
                ->join('categories', 'menu_items.category_id', '=', 'categories.id')
                ->where('orders.status', 'completed');

            if ($period !== 'all') {
                [$start, $end] = $this->getDateRange($period);
                $query->whereBetween('orders.created_at', [$start, $end]);
            }

            $stats = $query->select(
                'categories.id',
                'categories.name',
                DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
                ->groupBy('categories.id', 'categories.name')
                ->orderBy('total_revenue', 'desc')
                ->get();

            $totalRevenue = $stats->sum('total_revenue');

            $stats = $stats->map(function ($item) use ($totalRevenue) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'order_count' => $item->order_count,
                    'total_quantity' => $item->total_quantity,
                    'total_revenue' => $item->total_revenue,
                    'percentage' => $totalRevenue > 0
                        ? round(($item->total_revenue / $totalRevenue) * 100, 2)
                        : 0,
                ];
            });

            return response()->json([
                'message' => 'Sales by category retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve sales by category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment methods statistics
     */
    public function paymentMethods(Request $request)
    {
        try {
            $period = $request->get('period', 'all');

            $query = Payment::select(
                'payment_method',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(amount) as total')
            );

            if ($period !== 'all') {
                [$start, $end] = $this->getDateRange($period);
                $query->whereBetween('created_at', [$start, $end]);
            }

            $stats = $query->groupBy('payment_method')->get();

            $totalAmount = $stats->sum('total');

            $stats = $stats->map(function ($item) use ($totalAmount) {
                return [
                    'method' => $item->payment_method,
                    'count' => $item->count,
                    'total' => $item->total,
                    'percentage' => $totalAmount > 0
                        ? round(($item->total / $totalAmount) * 100, 2)
                        : 0,
                ];
            });

            return response()->json([
                'message' => 'Payment methods statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve payment methods statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper: Get date range based on period
     */
    private function getDateRange($period, $startDate = null, $endDate = null)
    {
        switch ($period) {
            case 'today':
                return [Carbon::today()->startOfDay(), Carbon::now()];

            case 'yesterday':
                return [
                    Carbon::yesterday()->startOfDay(),
                    Carbon::yesterday()->endOfDay()
                ];

            case 'week':
                return [
                    Carbon::now()->startOfWeek(),
                    Carbon::now()->endOfWeek()
                ];

            case 'month':
                return [
                    Carbon::now()->startOfMonth(),
                    Carbon::now()->endOfMonth()
                ];

            case 'year':
                return [
                    Carbon::now()->startOfYear(),
                    Carbon::now()->endOfYear()
                ];

            case 'custom':
                if ($startDate && $endDate) {
                    return [
                        Carbon::parse($startDate)->startOfDay(),
                        Carbon::parse($endDate)->endOfDay()
                    ];
                }
                return [Carbon::today()->startOfDay(), Carbon::now()];

            default:
                return [Carbon::today()->startOfDay(), Carbon::now()];
        }
    }
}
