<?php

namespace App\Helpers;

use App\Models\Order;
use Carbon\Carbon;

class OrderHelper
{
    public static function generateOrderNumber()
    {
        $datePart = Carbon::now()->format('Ymd');
        $latestOrder = Order::whereDate('created_at', Carbon::today())
            ->orderBy('id', 'desc')
            ->first();

        if ($latestOrder) {
            $lastOrderNumber = intval(substr($latestOrder->order_number, -4));
            $newOrderNumber = str_pad($lastOrderNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newOrderNumber = '0001';
        }

        return 'ORD-' . $datePart . '-' . $newOrderNumber;
    }
}