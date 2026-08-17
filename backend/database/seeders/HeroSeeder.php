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
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/346-iron-man.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 2,
                'nombre' => 'Capitán América',
                'nombre_real' => 'Steve Rogers',
                'poder_principal' => 'Fuerza sobrehumana, agilidad táctica y escudo de vibranium indestructible',
                'nivel_poder' => 75,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/149-captain-america.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 3,
                'nombre' => 'Thor',
                'nombre_real' => 'Thor Odinson',
                'poder_principal' => 'Control del trueno, fuerza asgardiana divina y manipulación del Mjölnir',
                'nivel_poder' => 95,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 4,
                'nombre' => 'Black Widow',
                'nombre_real' => 'Natasha Romanoff',
                'poder_principal' => 'Maestría en espionaje internacional, artes marciales letales y sigilo táctico',
                'nivel_poder' => 65,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/107-black-widow.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 5,
                'nombre' => 'Hulk',
                'nombre_real' => 'Bruce Banner',
                'poder_principal' => 'Fuerza física colosal ilimitada proporcional a la ira y regeneración celular',
                'nivel_poder' => 98,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/332-hulk.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 6,
                'nombre' => 'Spider-Man',
                'nombre_real' => 'Peter Parker',
                'poder_principal' => 'Sentido arácnido premonitorio, reflejos superhumanos y lanzamiento de telarañas',
                'nivel_poder' => 80,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 7,
                'nombre' => 'Doctor Strange',
                'nombre_real' => 'Stephen Strange',
                'poder_principal' => 'Magia de las Artes Místicas, manipulación de dimensiones y energía astral',
                'nivel_poder' => 92,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/226-doctor-strange.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 8,
                'nombre' => 'Scarlet Witch',
                'nombre_real' => 'Wanda Maximoff',
                'poder_principal' => 'Magia del caos, alteración de la realidad y telequinesis molecular masiva',
                'nivel_poder' => 99,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/579-scarlet-witch.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 9,
                'nombre' => 'Hawkeye',
                'nombre_real' => 'Clint Barton',
                'poder_principal' => 'Puntería perfecta, maestría en arquería táctica y combate cuerpo a cuerpo',
                'nivel_poder' => 68,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/313-hawkeye.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 10,
                'nombre' => 'Loki',
                'nombre_real' => 'Loki Laufeyson',
                'poder_principal' => 'Manipulación mental, proyecciones ilusorias y magia de engaño asgardiana',
                'nivel_poder' => 88,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/414-loki.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 11,
                'nombre' => 'Black Panther',
                'nombre_real' => "T'Challa",
                'poder_principal' => 'Agilidad e intelecto superior, traje de vibranium y fuerza del Dios Pantera',
                'nivel_poder' => 87,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/106-black-panther.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 12,
                'nombre' => 'Vision',
                'nombre_real' => 'Visión',
                'poder_principal' => 'Inteligencia artificial cuántica, manipulación de densidad y rayo de gema mental',
                'nivel_poder' => 94,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/697-vision.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 13,
                'nombre' => 'Falcon',
                'nombre_real' => 'Sam Wilson',
                'poder_principal' => 'Vuelo táctico con alas mecánicas de alta tecnología y combate aéreo',
                'nivel_poder' => 72,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/251-falcon.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 14,
                'nombre' => 'Winter Soldier',
                'nombre_real' => 'Bucky Barnes',
                'poder_principal' => 'Brazo biónico de vibranium, fuerza física aumentada y entrenamiento militar de élite',
                'nivel_poder' => 78,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/714-winter-soldier.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 15,
                'nombre' => 'Ant-Man',
                'nombre_real' => 'Scott Lang',
                'poder_principal' => 'Reducción y aumento de tamaño corporal por partículas Pym, control de hormigas',
                'nivel_poder' => 73,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/30-ant-man.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 16,
                'nombre' => 'Wasp',
                'nombre_real' => 'Hope van Dyne',
                'poder_principal' => 'Vuelo con alas bio-sintéticas, disparos de aguijones de plasma y cambio de tamaño',
                'nivel_poder' => 74,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/708-wasp.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 17,
                'nombre' => 'Star-Lord',
                'nombre_real' => 'Peter Quill',
                'poder_principal' => 'Estrategia de combate espacial, uso de blásters duales elementales y botas propulsoras',
                'nivel_poder' => 70,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/630-star-lord.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 18,
                'nombre' => 'Groot',
                'nombre_real' => 'Groot',
                'poder_principal' => 'Fisiología floral autoregenerativa, estiramiento de extremidades y fuerza colosal',
                'nivel_poder' => 83,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/303-groot.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 19,
                'nombre' => 'Capitana Marvel',
                'nombre_real' => 'Carol Danvers',
                'poder_principal' => 'Fisiología híbrida Kree, absorción y proyección de energía cósmica y vuelo supersónico',
                'nivel_poder' => 97,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/156-captain-marvel.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 20,
                'nombre' => 'Wolverine',
                'nombre_real' => 'Logan',
                'poder_principal' => 'Factor de curación regenerativo extremo, sentidos agudizados y garras de adamantium retractiles',
                'nivel_poder' => 88,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/717-wolverine.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 21,
                'nombre' => 'Deadpool',
                'nombre_real' => 'Wade Wilson',
                'poder_principal' => 'Regeneración mutante acelerada inmortal, maestría en armas y autoconsciencia de cuarta pared',
                'nivel_poder' => 85,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/213-deadpool.jpg',
                'estado' => 'ACTIVO',
            ],
            [
                'id' => 22,
                'nombre' => 'Daredevil',
                'nombre_real' => 'Matt Murdock',
                'poder_principal' => 'Sentidos superdesarrollados (ecolocalización), reflejos sobrehumanos y artes marciales ninja',
                'nivel_poder' => 69,
                'imagen_url' => 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/201-daredevil.jpg',
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
