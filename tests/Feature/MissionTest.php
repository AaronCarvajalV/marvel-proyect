<?php

namespace Tests\Feature;

use App\Models\Hero;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class MissionTest extends TestCase
{
    use RefreshDatabase;

    private User $adminUser;

    private User $consultaUser;

    private string $adminToken;

    private string $consultaToken;

    private Hero $hero;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::create([
            'nombre' => 'Nick Fury',
            'email' => 'admin@shield.gov',
            'password' => bcrypt('Admin1234!'),
            'rol' => 'ADMIN',
        ]);
        $this->adminToken = JWTAuth::fromUser($this->adminUser);

        $this->consultaUser = User::create([
            'nombre' => 'Phil Coulson',
            'email' => 'consulta@shield.gov',
            'password' => bcrypt('Consulta1234!'),
            'rol' => 'CONSULTA',
        ]);
        $this->consultaToken = JWTAuth::fromUser($this->consultaUser);

        $this->hero = Hero::create([
            'nombre' => 'Iron Man',
            'nombre_real' => 'Tony Stark',
            'poder_principal' => 'Armadura tecnológica',
            'nivel_poder' => 85,
            'estado' => 'ACTIVO',
        ]);
    }

    public function test_consulta_user_can_list_missions(): void
    {
        Mission::create([
            'titulo' => 'Defensa de Nueva York',
            'descripcion' => 'Contención alienígena',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-05-12',
            'nivel_peligro' => 'ALTO',
            'estado' => 'COMPLETADA',
            'superheroe_id' => $this->hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/misiones');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'titulo',
                        'descripcion',
                        'target_location_id',
                        'fecha',
                        'nivel_peligro',
                        'estado',
                        'superheroe_id',
                        'hero' => ['id', 'nombre'],
                    ],
                ],
            ]);
    }

    public function test_consulta_user_can_view_single_mission(): void
    {
        $mission = Mission::create([
            'titulo' => 'Infiltración en Hydra',
            'descripcion' => 'Extracción de planos',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-06-20',
            'nivel_peligro' => 'MEDIO',
            'estado' => 'COMPLETADA',
            'superheroe_id' => $this->hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson("/api/misiones/{$mission->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $mission->id,
                    'titulo' => 'Infiltración en Hydra',
                    'hero' => [
                        'id' => $this->hero->id,
                        'nombre' => 'Iron Man',
                    ],
                ],
            ]);
    }

    public function test_view_nonexistent_mission_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/misiones/9999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ]);
    }

    public function test_admin_can_create_mission_with_valid_hero(): void
    {
        $payload = [
            'titulo' => 'Rescate en Budapest',
            'descripcion' => 'Extracción sigilosa',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-09-05',
            'nivel_peligro' => 'MEDIO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $this->hero->id,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/misiones', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Misión creada exitosamente.',
                'data' => [
                    'titulo' => 'Rescate en Budapest',
                    'superheroe_id' => $this->hero->id,
                    'hero' => [
                        'id' => $this->hero->id,
                        'nombre' => 'Iron Man',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('missions', ['titulo' => 'Rescate en Budapest']);
    }

    public function test_create_mission_with_invalid_hero_returns_422(): void
    {
        $payload = [
            'titulo' => 'Misión Fallida',
            'descripcion' => 'Sin héroe válido',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-10-01',
            'nivel_peligro' => 'ALTO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => 99999, // Non existent hero
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/misiones', $payload);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['superheroe_id'],
            ]);
    }

    public function test_consulta_user_cannot_create_mission(): void
    {
        $payload = [
            'titulo' => 'Misión Restringida',
            'descripcion' => 'Acceso denegado',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-10-01',
            'nivel_peligro' => 'ALTO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $this->hero->id,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->postJson('/api/misiones', $payload);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_mission(): void
    {
        $mission = Mission::create([
            'titulo' => 'Anomalía Mística',
            'descripcion' => 'Fisuras en el multiverso',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-08-10',
            'nivel_peligro' => 'ALTO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $this->hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/misiones/{$mission->id}", [
                'estado' => 'EN_PROGRESO',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Misión actualizada exitosamente.',
                'data' => [
                    'id' => $mission->id,
                    'estado' => 'EN_PROGRESO',
                ],
            ]);
    }

    public function test_admin_can_delete_mission(): void
    {
        $mission = Mission::create([
            'titulo' => 'Misión a Borrar',
            'descripcion' => 'Temporal',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-08-10',
            'nivel_peligro' => 'BAJO',
            'estado' => 'COMPLETADA',
            'superheroe_id' => $this->hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/misiones/{$mission->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Misión eliminada exitosamente.',
            ]);

        $this->assertDatabaseMissing('missions', ['id' => $mission->id]);
    }

    public function test_unauthenticated_user_cannot_access_any_mission_endpoints(): void
    {
        $this->getJson('/api/misiones')->assertStatus(401);
        $this->getJson('/api/misiones/1')->assertStatus(401);
        $this->postJson('/api/misiones', [])->assertStatus(401);
        $this->putJson('/api/misiones/1', [])->assertStatus(401);
        $this->deleteJson('/api/misiones/1')->assertStatus(401);
    }

    public function test_consulta_user_cannot_update_mission_returns_403(): void
    {
        $mission = Mission::create([
            'titulo' => 'Misión Restringida',
            'descripcion' => 'Intento de update por consulta',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-08-10',
            'nivel_peligro' => 'ALTO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $this->hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->putJson("/api/misiones/{$mission->id}", [
                'estado' => 'COMPLETADA',
            ]);

        $response->assertStatus(403);
    }

    public function test_consulta_user_cannot_delete_mission_returns_403(): void
    {
        $mission = Mission::create([
            'titulo' => 'Misión Restringida Delete',
            'descripcion' => 'Intento de delete por consulta',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-08-10',
            'nivel_peligro' => 'ALTO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $this->hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->deleteJson("/api/misiones/{$mission->id}");

        $response->assertStatus(403);
    }

    public function test_admin_update_nonexistent_mission_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson('/api/misiones/99999', [
                'titulo' => 'Misión Fantasma',
            ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ]);
    }

    public function test_admin_delete_nonexistent_mission_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson('/api/misiones/99999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ]);
    }

    public function test_mission_validation_errors_on_create(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/misiones', [
                'titulo' => '',
                'fecha' => '15-08-2026', // wrong format (needs Y-m-d)
                'nivel_peligro' => 'EXTREMO', // invalid enum
                'estado' => 'ARCHIVADA', // invalid enum
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['titulo', 'descripcion', 'target_location_id', 'fecha', 'nivel_peligro', 'estado', 'superheroe_id'],
            ]);
    }

    public function test_admin_update_mission_validation_errors(): void
    {
        $mission = Mission::create([
            'titulo' => 'Misión Válida',
            'descripcion' => 'Inicial',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-08-10',
            'nivel_peligro' => 'MEDIO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $this->hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/misiones/{$mission->id}", [
                'superheroe_id' => 88888, // non-existent hero
                'fecha' => 'invalid-date',
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['superheroe_id', 'fecha'],
            ]);
    }
}
