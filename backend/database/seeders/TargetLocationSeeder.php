<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TargetLocation;

class TargetLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            // Fictional / Marvel Locations
            ['city' => 'Manhattan, NY', 'country' => 'United States', 'country_code' => 'US'],
            ['city' => 'Sokovia City', 'country' => 'Sokovia', 'country_code' => 'SK'],
            ['city' => 'Birnin Zana', 'country' => 'Wakanda', 'country_code' => 'WK'],
            ['city' => 'Madripoor', 'country' => 'Madripoor', 'country_code' => 'MP'],
            ['city' => 'Asgard City', 'country' => 'Asgard', 'country_code' => 'AS'],
            ['city' => 'Kamar-Taj', 'country' => 'Nepal', 'country_code' => 'NP'],
            ['city' => 'Genosha', 'country' => 'Genosha', 'country_code' => 'GN'],
            ['city' => 'Latveria', 'country' => 'Latveria', 'country_code' => 'LV'],
            
            // Global Cities
            ['city' => 'Tokyo', 'country' => 'Japan', 'country_code' => 'JP'],
            ['city' => 'London', 'country' => 'United Kingdom', 'country_code' => 'GB'],
            ['city' => 'Paris', 'country' => 'France', 'country_code' => 'FR'],
            ['city' => 'Berlin', 'country' => 'Germany', 'country_code' => 'DE'],
            ['city' => 'Madrid', 'country' => 'Spain', 'country_code' => 'ES'],
            ['city' => 'Rome', 'country' => 'Italy', 'country_code' => 'IT'],
            ['city' => 'Moscow', 'country' => 'Russia', 'country_code' => 'RU'],
            ['city' => 'Beijing', 'country' => 'China', 'country_code' => 'CN'],
            ['city' => 'Seoul', 'country' => 'South Korea', 'country_code' => 'KR'],
            ['city' => 'Sydney', 'country' => 'Australia', 'country_code' => 'AU'],
            ['city' => 'Toronto', 'country' => 'Canada', 'country_code' => 'CA'],
            ['city' => 'Mexico City', 'country' => 'Mexico', 'country_code' => 'MX'],
            ['city' => 'Buenos Aires', 'country' => 'Argentina', 'country_code' => 'AR'],
            ['city' => 'São Paulo', 'country' => 'Brazil', 'country_code' => 'BR'],
            ['city' => 'Rio de Janeiro', 'country' => 'Brazil', 'country_code' => 'BR'],
            ['city' => 'Cairo', 'country' => 'Egypt', 'country_code' => 'EG'],
            ['city' => 'Lagos', 'country' => 'Nigeria', 'country_code' => 'NG'],
            ['city' => 'Johannesburg', 'country' => 'South Africa', 'country_code' => 'ZA'],
            ['city' => 'Nairobi', 'country' => 'Kenya', 'country_code' => 'KE'],
            ['city' => 'Istanbul', 'country' => 'Turkey', 'country_code' => 'TR'],
            ['city' => 'Dubai', 'country' => 'United Arab Emirates', 'country_code' => 'AE'],
            ['city' => 'Mumbai', 'country' => 'India', 'country_code' => 'IN'],
            ['city' => 'New Delhi', 'country' => 'India', 'country_code' => 'IN'],
            ['city' => 'Singapore', 'country' => 'Singapore', 'country_code' => 'SG'],
            ['city' => 'Bangkok', 'country' => 'Thailand', 'country_code' => 'TH'],
            ['city' => 'Jakarta', 'country' => 'Indonesia', 'country_code' => 'ID'],
            ['city' => 'Manila', 'country' => 'Philippines', 'country_code' => 'PH'],
            ['city' => 'Los Angeles', 'country' => 'United States', 'country_code' => 'US'],
            ['city' => 'Chicago', 'country' => 'United States', 'country_code' => 'US'],
            ['city' => 'Houston', 'country' => 'United States', 'country_code' => 'US'],
            ['city' => 'Miami', 'country' => 'United States', 'country_code' => 'US'],
            ['city' => 'San Francisco', 'country' => 'United States', 'country_code' => 'US'],
            ['city' => 'Seattle', 'country' => 'United States', 'country_code' => 'US'],
            ['city' => 'Washington D.C.', 'country' => 'United States', 'country_code' => 'US'],
            ['city' => 'Bogotá', 'country' => 'Colombia', 'country_code' => 'CO'],
            ['city' => 'Lima', 'country' => 'Peru', 'country_code' => 'PE'],
            ['city' => 'Santiago', 'country' => 'Chile', 'country_code' => 'CL'],
            ['city' => 'Caracas', 'country' => 'Venezuela', 'country_code' => 'VE'],
            ['city' => 'Amsterdam', 'country' => 'Netherlands', 'country_code' => 'NL'],
            ['city' => 'Brussels', 'country' => 'Belgium', 'country_code' => 'BE'],
            ['city' => 'Vienna', 'country' => 'Austria', 'country_code' => 'AT'],
            ['city' => 'Zurich', 'country' => 'Switzerland', 'country_code' => 'CH'],
            ['city' => 'Stockholm', 'country' => 'Sweden', 'country_code' => 'SE'],
            ['city' => 'Oslo', 'country' => 'Norway', 'country_code' => 'NO'],
            ['city' => 'Copenhagen', 'country' => 'Denmark', 'country_code' => 'DK'],
            ['city' => 'Helsinki', 'country' => 'Finland', 'country_code' => 'FI'],
            ['city' => 'Warsaw', 'country' => 'Poland', 'country_code' => 'PL'],
            ['city' => 'Prague', 'country' => 'Czech Republic', 'country_code' => 'CZ'],
            ['city' => 'Budapest', 'country' => 'Hungary', 'country_code' => 'HU'],
            ['city' => 'Athens', 'country' => 'Greece', 'country_code' => 'GR'],
            ['city' => 'Lisbon', 'country' => 'Portugal', 'country_code' => 'PT'],
        ];

        foreach ($locations as $location) {
            TargetLocation::create($location);
        }
    }
}
