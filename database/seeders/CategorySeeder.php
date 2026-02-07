<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Appetizers', 'description' => 'Starters to begin your meal'],
            ['name' => 'Main Courses', 'description' => 'Hearty and fulfilling main dishes'],
            ['name' => 'Desserts',  'description' => 'Sweet treats to end your meal'],
            ['name' => 'Beverages', 'description' => 'Refreshing drinks to accompany your food'],
            ['name' => 'Salads', 'description' => 'Fresh and healthy salad options'],
            ['name' => 'Soups', 'description' => 'Warm and comforting soups'],
            ['name' => 'Sides', 'description' => 'Complementary side dishes'],
            ['name' => 'Specials', 'description' => 'Chef\'s special dishes'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
