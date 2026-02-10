<?php

namespace Database\Seeders;

use App\Models\Roles;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // buat seeder roles
        $roles = [
            ['name' => 'admin'],
            ['name' => 'cashier'],
            ['name' => 'waiter'],
            ['name' => 'chef'],
            ['name' => 'guest']
        ];

        foreach ($roles as $role) {
            Roles::create($role);
        }
    }
}
