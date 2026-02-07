<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
    ];

   protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Roles::class, 'role_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'paid_by');
    }

    public function orderLogs()
    {
        return $this->hasMany(OrderLog::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByRole($query, $roleName)
    {
        return $query->whereHas('role', function ($q) use ($roleName) {
            $q->where('name', $roleName);
        });
    }

    public function isAdmin()
    {
        return $this->role && $this->role->name === 'admin';
    }

    public function isCashier()
    {
        return $this->role && $this->role->name === 'cashier';
    }

    public function isWaiter()
    {
        return $this->role && $this->role->name === 'waiter';
    }

    public function isChef()
    {
        return $this->role && $this->role->name === 'chef';
    }
}
