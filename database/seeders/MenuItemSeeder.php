<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menuItems = [
            [
                'category_id' => 1,
                'name' => 'Fried Calamari',
                'description' => 'Crispy fried calamari served with marinara sauce',
                'price' => 8.99,
                'preparation_time' => 20
            ],
            [
                'category_id' => 2,
                'name' => 'Grilled Salmon',
                'description' => 'Fresh salmon fillet grilled to perfection with lemon butter sauce',
                'price' => 15.99,
                'preparation_time' => 25
            ],
            [
                'category_id' => 3,
                'name' => 'Cheesecake',
                'description' => 'Classic New York style cheesecake with a graham cracker crust',
                'price' => 6.50,
                'preparation_time' => 15
            ],
            [
                'category_id' => 4,
                'name' => 'Lemonade',
                'description' => 'Refreshing homemade lemonade',
                'price' => 2.99,
                'preparation_time' => 5
            ],
            [
                'category_id' => 5,
                'name' => 'Caesar Salad',
                'description' => 'Classic Caesar salad with croutons and parmesan cheese',
                'price' => 7.99,
                'preparation_time' => 10
            ],
            [
                'category_id' => 6,
                'name' => 'Chicken Soup',
                'description' => 'Warm and comforting chicken soup',
                'price' => 6.99,
                'preparation_time' => 15
            ],
            [
                'category_id' => 7,
                'name' => 'French Fries',
                'description' => 'Crispy golden french fries',
                'price' => 3.50,
                'preparation_time' => 10
            ],
            [
                'category_id' => 8,
                'name' => 'Chef\'s Special Pasta',
                'description' => 'Pasta dish prepared with the chef\'s special recipe',
                'price' => 12.99,
                'preparation_time' => 30
            ],
        ];

        foreach ($menuItems as $item) {
            MenuItem::create($item);
        }
    }
}
