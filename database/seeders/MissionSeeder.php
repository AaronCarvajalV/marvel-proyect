<?php

namespace Database\Seeders;

use App\Models\Mission;
use Illuminate\Database\Seeder;

class MissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $missions = [
            [
                'id' => 1,
                'titulo' => 'Defensa de Nueva York ante invasión Chitauri',
                'descripcion' => 'Contención de invasión alienígena interdimensional y neutralización del portal espacial.',
                'ubicacion' => 'Manhattan, Nueva York',
                'fecha' => '2026-05-12',
                'nivel_peligro' => 'ALTO',
                'estado' => 'COMPLETADA',
                'superheroe_id' => 1, // Iron Man
            ],
            [
                'id' => 2,
                'titulo' => 'Infiltración en base clandestina de Hydra',
                'descripcion' => 'Extracción de planos de armamento secreto y neutralización de células durmientes.',
                'ubicacion' => 'Sokovia',
                'fecha' => '2026-06-20',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'COMPLETADA',
                'superheroe_id' => 2, // Capitán América
            ],
            [
                'id' => 3,
                'titulo' => 'Contención de anomalía mística en el Sanctum Sanctorum',
                'descripcion' => 'Sellado de fisuras en el multiverso que amenazan la integridad espacio-temporal.',
                'ubicacion' => 'Greenwich Village, NY',
                'fecha' => '2026-08-10',
                'nivel_peligro' => 'ALTO',
                'estado' => 'EN_PROGRESO',
                'superheroe_id' => 7, // Doctor Strange
            ],
            [
                'id' => 4,
                'titulo' => 'Patrullaje urbano y desarme de red de contrabando Chitauri',
                'descripcion' => 'Desarticulación de banda delictiva local con armamento de plasma alienígena.',
                'ubicacion' => 'Queens, Nueva York',
                'fecha' => '2026-08-14',
                'nivel_peligro' => 'BAJO',
                'estado' => 'EN_PROGRESO',
                'superheroe_id' => 6, // Spider-Man
            ],
            [
                'id' => 5,
                'titulo' => 'Neutralización de descontrol sísmico por criatura gamma',
                'descripcion' => 'Evacuación de civiles y contención no letal en zona desértica.',
                'ubicacion' => 'Nuevo México',
                'fecha' => '2026-08-30',
                'nivel_peligro' => 'ALTO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => 5, // Hulk
            ],
            [
                'id' => 6,
                'titulo' => 'Extracción de agente encubierto en Budapest',
                'descripcion' => 'Misión de rescate silencioso y eliminación de rastros de inteligencia hostil.',
                'ubicacion' => 'Budapest, Hungría',
                'fecha' => '2026-09-05',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => 4, // Black Widow
            ],
        ];

        foreach ($missions as $missionData) {
            Mission::updateOrCreate(
                ['id' => $missionData['id']],
                $missionData
            );
        }
    }
}
