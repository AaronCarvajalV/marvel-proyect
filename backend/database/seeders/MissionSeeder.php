<?php

namespace Database\Seeders;

use App\Models\Mission;
use App\Models\TargetLocation;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\Models\Hero;

class MissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = TargetLocation::all();
        if ($locations->isEmpty()) return;

        $missions = [
            [
                'id' => 1,
                'titulo' => 'Defensa de Nueva York ante invasión Chitauri',
                'descripcion' => 'Contención de invasión alienígena interdimensional y neutralización del portal espacial.',
                'fecha' => '2026-05-12',
                'nivel_peligro' => 'ALTO',
                'estado' => 'COMPLETADA',
                'superheroe_id' => 1,
            ],
            [
                'id' => 2,
                'titulo' => 'Infiltración en base clandestina de Hydra',
                'descripcion' => 'Extracción de planos de armamento secreto y neutralización de células durmientes.',
                'fecha' => '2026-06-20',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'COMPLETADA',
                'superheroe_id' => 2,
            ],
            [
                'id' => 3,
                'titulo' => 'Contención de anomalía mística en el Sanctum Sanctorum',
                'descripcion' => 'Sellado de fisuras en el multiverso que amenazan la integridad espacio-temporal.',
                'fecha' => '2026-08-10',
                'nivel_peligro' => 'ALTO',
                'estado' => 'EN_PROGRESO',
                'superheroe_id' => 7,
            ],
            [
                'id' => 4,
                'titulo' => 'Patrullaje urbano y desarme de red de contrabando Chitauri',
                'descripcion' => 'Desarticulación de banda delictiva local con armamento de plasma alienígena.',
                'fecha' => '2026-08-14',
                'nivel_peligro' => 'BAJO',
                'estado' => 'EN_PROGRESO',
                'superheroe_id' => 6,
            ],
            [
                'id' => 5,
                'titulo' => 'Neutralización de descontrol sísmico por criatura gamma',
                'descripcion' => 'Evacuación de civiles y contención no letal en zona desértica.',
                'fecha' => '2026-08-30',
                'nivel_peligro' => 'ALTO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => 5,
            ],
            [
                'id' => 6,
                'titulo' => 'Extracción de agente encubierto en Budapest',
                'descripcion' => 'Misión de rescate silencioso y eliminación de rastros de inteligencia hostil.',
                'fecha' => '2026-09-05',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => 4,
            ],
            [
                'id' => 7,
                'titulo' => 'Defensa de Wakanda',
                'descripcion' => 'Contención del ejército de Outriders y protección de la gema de la mente.',
                'fecha' => '2026-08-20',
                'nivel_peligro' => 'ALTO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => 11,
            ],
            [
                'id' => 8,
                'titulo' => 'Asalto al Helicarrier de S.H.I.E.L.D.',
                'descripcion' => 'Infiltración y hackeo de los sistemas del Helicarrier comprometido.',
                'fecha' => '2026-07-15',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'COMPLETADA',
                'superheroe_id' => 14,
            ],
            [
                'id' => 9,
                'titulo' => 'Rescate en el Reino Cuántico',
                'descripcion' => 'Extracción de tecnología miniaturizada y rescate de científicos perdidos.',
                'fecha' => '2026-08-25',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'EN_PROGRESO',
                'superheroe_id' => 15,
            ],
            [
                'id' => 10,
                'titulo' => 'Ataque de los Elfos Oscuros en Greenwich',
                'descripcion' => 'Detener la convergencia dimensional y al líder Malekith.',
                'fecha' => '2026-05-18',
                'nivel_peligro' => 'ALTO',
                'estado' => 'COMPLETADA',
                'superheroe_id' => 3,
            ],
            [
                'id' => 11,
                'titulo' => 'Infiltración en el cuartel de Kingpin',
                'descripcion' => 'Recopilación de evidencia contra el sindicato de crimen organizado en Hell\'s Kitchen.',
                'fecha' => '2026-08-12',
                'nivel_peligro' => 'BAJO',
                'estado' => 'EN_PROGRESO',
                'superheroe_id' => 22,
            ],
            [
                'id' => 12,
                'titulo' => 'Caza de laboratorios Weapon X clandestinos',
                'descripcion' => 'Localización y destrucción de instalaciones de experimentación mutante ilegales.',
                'fecha' => '2026-08-28',
                'nivel_peligro' => 'ALTO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => 20,
            ],
            [
                'id' => 13,
                'titulo' => 'Recuperación del cetro de Loki',
                'descripcion' => 'Búsqueda y extracción de un artefacto de alto poder robado por remanentes rebeldes.',
                'fecha' => '2026-04-10',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'COMPLETADA',
                'superheroe_id' => 9,
            ],
            [
                'id' => 14,
                'titulo' => 'Protección de la Gema del Poder en Xandar',
                'descripcion' => 'Defensa aérea y contención de las fuerzas invasoras de Ronan el Acusador.',
                'fecha' => '2026-03-05',
                'nivel_peligro' => 'ALTO',
                'estado' => 'COMPLETADA',
                'superheroe_id' => 17,
            ],
            [
                'id' => 15,
                'titulo' => 'Sabotaje de fábrica de Centinelas',
                'descripcion' => 'Destrucción de prototipos de robots cazadores de mutantes de Industrias Trask.',
                'fecha' => '2026-09-01',
                'nivel_peligro' => 'ALTO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => 21,
            ],
            [
                'id' => 16,
                'titulo' => 'Protección de red eléctrica global',
                'descripcion' => 'Neutralizar el virus Ultron que amenaza con hackear los sistemas de energía mundial.',
                'fecha' => '2026-08-16',
                'nivel_peligro' => 'ALTO',
                'estado' => 'EN_PROGRESO',
                'superheroe_id' => 12,
            ],
            [
                'id' => 17,
                'titulo' => 'Escolta aérea presidencial',
                'descripcion' => 'Defensa táctica del avión presidencial frente a drones terroristas armados.',
                'fecha' => '2026-08-22',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => 13,
            ],
            [
                'id' => 18,
                'titulo' => 'Detención del tráfico de sustancias Kree',
                'descripcion' => 'Incautación de cargamento espacial clandestino en los muelles de la costa oeste.',
                'fecha' => '2026-08-01',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'COMPLETADA',
                'superheroe_id' => 19,
            ],
            [
                'id' => 19,
                'titulo' => 'Rescate en la dimensión del caos',
                'descripcion' => 'Contención de anomalías energéticas y restauración de las líneas de magia.',
                'fecha' => '2026-08-19',
                'nivel_peligro' => 'ALTO',
                'estado' => 'EN_PROGRESO',
                'superheroe_id' => 8,
            ],
            [
                'id' => 20,
                'titulo' => 'Robo frustrado en Industrias Roxxon',
                'descripcion' => 'Detener infiltración nocturna de mercenarios de alta tecnología y asegurar la bóveda.',
                'fecha' => '2026-08-15',
                'nivel_peligro' => 'BAJO',
                'estado' => 'EN_PROGRESO',
                'superheroe_id' => 16,
            ],
        ];

        foreach ($missions as $missionData) {
            $missionData['target_location_id'] = $locations->random()->id;
            Mission::updateOrCreate(
                ['id' => $missionData['id']],
                $missionData
            );
        }
    }
}
