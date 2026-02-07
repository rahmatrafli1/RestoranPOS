<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tables = [
            ['table_number' => 1, 'capacity' => 4, 'status' => 'available', 'location' => 'indoor'],
            ['table_number' => 2, 'capacity' => 2, 'status' => 'available', 'location' => 'indoor'],
            ['table_number' => 3, 'capacity' => 6, 'status' => 'available', 'location' => 'indoor'],
            ['table_number' => 4, 'capacity' => 4, 'status' => 'available', 'location' => 'indoor'],
            ['table_number' => 5, 'capacity' => 2, 'status' => 'available', 'location' => 'indoor'],
            ['table_number' => 6, 'capacity' => 8, 'status' => 'available', 'location' => 'indoor'],
            ['table_number' => 7, 'capacity' => 4, 'status' => 'available', 'location' => 'outdoor'],
            ['table_number' => 8, 'capacity' => 2, 'status' => 'available', 'location' => 'outdoor'],
            ['table_number' => 9, 'capacity' => 6, 'status' => 'available', 'location' => 'outdoor'],
            ['table_number' => 10, 'capacity' => 4, 'status' => 'available', 'location' => 'outdoor'],
        ];

        foreach ($tables as $table) {
            Table::create($table);
        }
    }
}
