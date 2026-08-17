<?php

namespace Database\Factories;

use App\Models\TargetLocation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TargetLocation>
 */
class TargetLocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'city' => fake()->city(),
            'country' => fake()->country(),
            'country_code' => fake()->countryCode(),
        ];
    }
}
