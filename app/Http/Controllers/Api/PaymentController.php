<?php
// filepath: app/Http/Controllers/Api/PaymentController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(StorePaymentRequest $request, Order $order)
    {
        if ($order->payment) {
            return response()->json([
                'message' => 'Order has already been paid'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $amount = $order->total;
            $paidAmount = $request->paid_amount;
            $change = $paidAmount - $amount;

            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => $request->payment_method,
                'amount' => $amount,
                'paid_amount' => $paidAmount,
                'change_amount' => $change,
                'transaction_ref' => $request->transaction_ref,
                'paid_by' => Auth::id(),
                'notes' => $request->notes,
            ]);

            $order->update(['status' => 'completed']);

            if ($order->table_id) {
                Table::find($order->table_id)->update(['status' => 'available']);
            }

            DB::commit();

            $payment->load(['order', 'cashier']);

            return response()->json([
                'message' => 'Payment processed successfully',
                'data' => $payment
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to process payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Payment $payment)
    {
        $payment->load(['order.orderItems.menuItem', 'cashier']);

        return response()->json([
            'message' => 'Payment retrieved successfully',
            'data' => $payment
        ]);
    }

    public function getByOrder(Order $order)
    {
        $payment = $order->payment;

        if (!$payment) {
            return response()->json([
                'message' => 'Payment not found for this order'
            ], 404);
        }

        $payment->load(['order.orderItems.menuItem', 'cashier']);

        return response()->json([
            'message' => 'Payment retrieved successfully',
            'data' => $payment
        ]);
    }
}