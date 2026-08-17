<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Admin User
        User::updateOrCreate(
            ['email' => 'admin@shield.gov'],
            [
                'nombre' => 'Nick Fury',
                'password' => Hash::make('Admin1234!'),
                'rol' => 'ADMIN',
            ]
        );

        // 2. Consulta User
        User::updateOrCreate(
            ['email' => 'consulta@shield.gov'],
            [
                'nombre' => 'Agente Phil Coulson',
                'password' => Hash::make('Consulta1234!'),
                'rol' => 'CONSULTA',
            ]
        );
    }
}
