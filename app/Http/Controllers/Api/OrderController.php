<?php
// filepath: app/Http/Controllers/Api/OrderController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Http\Requests\Order\AddDiscountRequest;
use App\Http\Requests\Order\UpdateOrderItemStatusRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderLog;
use App\Models\Table;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['table', 'user', 'orderItems.menuItem']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('order_type')) {
            $query->where('order_type', $request->order_type);
        }

        if ($request->has('date')) {
            $query->whereDate('created_at', $request->date);
        }

        if ($request->has('today') && $request->today) {
            $query->whereDate('created_at', today());
        }

        $orders = $query->latest()->paginate(20);

        return response()->json([
            'message' => 'Orders successfully retrieved',
            'data' => $orders
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        try {
            DB::beginTransaction();

            $orderNumber = $this->generateOrderNumber();

            $order = Order::create([
                'order_number' => $orderNumber,
                'table_id' => $request->table_id,
                'user_id' => Auth::id(),
                'customer_name' => $request->customer_name,
                'order_type' => $request->order_type,
                'notes' => $request->notes,
            ]);

            foreach ($request->items as $item) {
                $menuItem = \App\Models\MenuItem::findOrFail($item['menu_item_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['quantity'],
                    'price' => $menuItem->price,
                    'subtotal' => $menuItem->price * $item['quantity'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            if ($request->table_id && $request->order_type === 'dine_in') {
                Table::find($request->table_id)->update(['status' => 'occupied']);
            }

            OrderLog::create([
                'order_id' => $order->id,
                'user_id' => Auth::id(),
                'action' => 'created',
                'new_value' => 'Order created',
            ]);

            // Tambahkan notifikasi order baru
            $tableInfo = $request->table_id ? "Table " . optional(Table::find($request->table_id))->table_number : "Takeaway";
            $itemCount = count($request->items);

            Notification::create([
                'user_id' => null, // Broadcast ke semua user
                'type' => 'order',
                'title' => 'New Order Received',
                'message' => "Order #{$orderNumber} has been placed for {$tableInfo} with {$itemCount} item(s)",
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $orderNumber,
                    'order_type' => $request->order_type,
                    'table_id' => $request->table_id,
                    'table_number' => optional(Table::find($request->table_id))->table_number,
                    'customer_name' => $request->customer_name,
                    'item_count' => $itemCount,
                ],
                'is_read' => false,
            ]);

            DB::commit();

            $order->load(['table', 'user', 'orderItems.menuItem']);

            return response()->json([
                'message' => 'Order successfully created',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Order $order)
    {
        $order->load(['table', 'user', 'orderItems.menuItem', 'payment']);

        return response()->json([
            'message' => 'Order successfully retrieved',
            'data' => $order
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $oldStatus = $order->status;
        $order->update(['status' => $request->status]);

        if (in_array($request->status, ['completed', 'cancelled']) && $order->table_id) {
            Table::find($order->table_id)->update(['status' => 'available']);
        }

        OrderLog::create([
            'order_id' => $order->id,
            'user_id' => Auth::id(),
            'action' => 'status_changed',
            'old_value' => $oldStatus,
            'new_value' => $request->status,
        ]);

        // Tambahkan notifikasi perubahan status order
        if ($request->status === 'ready') {
            Notification::create([
                'user_id' => null,
                'type' => 'order',
                'title' => 'Order Ready',
                'message' => "Order #{$order->order_number} is now ready to serve",
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $request->status,
                    'table_number' => optional($order->table)->table_number,
                ],
                'is_read' => false,
            ]);
        }

        return response()->json([
            'message' => 'Order status successfully updated',
            'data' => $order
        ]);
    }

    public function updateItemStatus(UpdateOrderItemStatusRequest $request, OrderItem $orderItem)
    {
        $orderItem->update(['status' => $request->status]);

        $order = $orderItem->order;
        $allReady = $order->orderItems()->where('status', '!=', 'ready')->count() === 0;

        if ($allReady && $order->status === 'preparing') {
            $order->update(['status' => 'ready']);
        }

        return response()->json([
            'message' => 'Order item status successfully updated',
            'data' => $orderItem
        ]);
    }

    public function addDiscount(AddDiscountRequest $request, Order $order)
    {
        $order->update(['discount' => $request->discount]);
        $order->calculateTotal();

        return response()->json([
            'message' => 'Discount successfully added',
            'data' => $order
        ]);
    }

    public function kitchen()
    {
        $orders = Order::with(['table', 'orderItems.menuItem'])
            ->whereIn('status', ['pending', 'preparing'])
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Kitchen orders successfully retrieved',
            'data' => $orders
        ]);
    }

    private function generateOrderNumber()
    {
        $date = now()->format('Ymd');
        $count = Order::whereDate('created_at', today())->count() + 1;

        return 'ORD' . $date . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
