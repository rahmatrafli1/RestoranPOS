<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function logs()
    {
        return $this->hasMany(OrderLog::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePreparing($query)
    {
        return $query->where('status', 'preparing');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function calculateTotal()
    {
        $this->subtotal = $this->orderItems->sum('subtotal');
        
        $taxPercentage = Setting::where('setting_key', 'tax_percentage')->first()->setting_value ?? 10;
        $this->tax = $this->subtotal * ($taxPercentage / 100);
        
        $this->total = $this->subtotal + $this->tax - $this->discount;
        
        $this->save();
    }

    public function isPaid()
    {
        return $this->payment && $this->payment->payment_status === 'completed';
    }

    public function getFormattedTotalAttribute()
    {
        return '$' . number_format($this->total, 2);
    }
}
