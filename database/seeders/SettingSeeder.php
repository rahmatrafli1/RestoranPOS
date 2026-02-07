<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['setting_key' => 'tax_rate', 'setting_value' => '10', 'description' => 'Tax rate percentage'],
            ['setting_key' => 'currency', 'setting_value' => 'USD', 'description' => 'Currency code'],
            ['setting_key' => 'restaurant_name', 'setting_value' => 'My Restaurant', 'description' => 'Name of the restaurant'],
            ['setting_key' => 'restaurant_address', 'setting_value' => '123 Main St, City, Country', 'description' => 'Address of the restaurant'],
            ['setting_key' => 'restaurant_phone', 'setting_value' => '+1234567890', 'description' => 'Contact phone number of the restaurant'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
