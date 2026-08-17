<?php

namespace Database\Seeders;

use App\Models\Hero;
use Illuminate\Database\Seeder;

class HeroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $heroes = [
            [
                'id' => 1,
                'nombre' => 'Iron Man',
                'nombre_real' => 'Tony Stark',
                'poder_principal' => 'Ingeniería avanzada, armadura tecnológica propulsada por reactor Arc',
                'nivel_poder' => 85,
                'imagen_url' => 'https://cdn.marvel.com/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 2,
                'nombre' => 'Capitán América',
                'nombre_real' => 'Steve Rogers',
                'poder_principal' => 'Fuerza sobrehumana, agilidad táctica y escudo de vibranium indestructible',
                'nivel_poder' => 75,
                'imagen_url' => 'https://cdn.marvel.com/u/prod/marvel/i/mg/3/50/537ba56d31087.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 3,
                'nombre' => 'Thor',
                'nombre_real' => 'Thor Odinson',
                'poder_principal' => 'Control del trueno, fuerza asgardiana divina y manipulación del Mjölnir',
                'nivel_poder' => 95,
                'imagen_url' => 'https://cdn.marvel.com/u/prod/marvel/i/mg/d/d0/5269657a74350.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 4,
                'nombre' => 'Black Widow',
                'nombre_real' => 'Natasha Romanoff',
                'poder_principal' => 'Maestría en espionaje internacional, artes marciales letales y sigilo táctico',
                'nivel_poder' => 65,
                'imagen_url' => 'https://cdn.marvel.com/u/prod/marvel/i/mg/f/30/50febb4945a96.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 5,
                'nombre' => 'Hulk',
                'nombre_real' => 'Bruce Banner',
                'poder_principal' => 'Fuerza física colosal ilimitada proporcional a la ira y regeneración celular',
                'nivel_poder' => 98,
                'imagen_url' => 'https://cdn.marvel.com/u/prod/marvel/i/mg/5/a0/538615caaa73d.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 6,
                'nombre' => 'Spider-Man',
                'nombre_real' => 'Peter Parker',
                'poder_principal' => 'Sentido arácnido premonitorio, reflejos superhumanos y lanzamiento de telarañas',
                'nivel_poder' => 80,
                'imagen_url' => 'https://cdn.marvel.com/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 7,
                'nombre' => 'Doctor Strange',
                'nombre_real' => 'Stephen Strange',
                'poder_principal' => 'Magia de las Artes Místicas, manipulación de dimensiones y energía astral',
                'nivel_poder' => 92,
                'imagen_url' => 'https://cdn.marvel.com/u/prod/marvel/i/mg/5/f0/5261a80a2e814.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 8,
                'nombre' => 'Scarlet Witch',
                'nombre_real' => 'Wanda Maximoff',
                'poder_principal' => 'Magia del caos, alteración de la realidad y telequinesis molecular masiva',
                'nivel_poder' => 99,
                'imagen_url' => 'https://cdn.marvel.com/u/prod/marvel/i/mg/6/70/5261a7d7c394b.jpg',
                'estado' => 'ACTIVO',
            ],
        ];

        foreach ($heroes as $heroData) {
            Hero::updateOrCreate(
                ['id' => $heroData['id']],
                $heroData
            );
        }
    }
}
