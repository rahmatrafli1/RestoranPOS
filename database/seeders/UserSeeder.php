<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'username' => 'admin',
                'password' => Hash::make('admin123'),
                'full_name' => 'Administrator',
                'role_id' => 1
            ],
            [
                'username' => 'cashier1',
                'password' => Hash::make('cashier123'),
                'full_name' => 'Cashier One',
                'role_id' => 2
            ],
            [
                'username' => 'cashier2',
                'password' => Hash::make('cashier123'),
                'full_name' => 'Cashier Two',
                'role_id' => 2
            ],
            [
                'username' => 'waiter1',
                'password' => Hash::make('waiter123'),
                'full_name' => 'Waiter One',
                'role_id' => 3
            ],
            [
                'username' => 'waiter2',
                'password' => Hash::make('waiter123'),
                'full_name' => 'Waiter Two',
                'role_id' => 3
            ],
            [
                'username' => 'chef1',
                'password' => Hash::make('chef123'),
                'full_name' => 'Chef One',
                'role_id' => 4
            ],
            [
                'username' => 'chef2',
                'password' => Hash::make('chef123'),
                'full_name' => 'Chef Two',
                'role_id' => 4
            ],
            [
                'username' => 'guest1',
                'password' => Hash::make('guest123'),
                'full_name' => 'Guest One',
                'role_id' => 5
            ],
            [
                'username' => 'guest2',
                'password' => Hash::make('guest123'),
                'full_name' => 'Guest Two',
                'role_id' => 5
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
