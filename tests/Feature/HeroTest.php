<?php

namespace Tests\Feature;

use App\Models\Hero;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class HeroTest extends TestCase
{
    use RefreshDatabase;

    private User $adminUser;

    private User $consultaUser;

    private string $adminToken;

    private string $consultaToken;

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
    }

    public function test_consulta_user_can_list_heroes(): void
    {
        Hero::create([
            'nombre' => 'Iron Man',
            'nombre_real' => 'Tony Stark',
            'poder_principal' => 'Armadura tecnológica',
            'nivel_poder' => 85,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'nombre', 'nombre_real', 'poder_principal', 'nivel_poder', 'estado', 'missions_count'],
                ],
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    ['nombre' => 'Iron Man'],
                ],
            ]);
    }

    public function test_heroes_can_be_filtered_by_search_term(): void
    {
        Hero::create([
            'nombre' => 'Thor',
            'nombre_real' => 'Thor Odinson',
            'poder_principal' => 'Control del trueno',
            'nivel_poder' => 95,
            'estado' => 'ACTIVO',
        ]);

        Hero::create([
            'nombre' => 'Hulk',
            'nombre_real' => 'Bruce Banner',
            'poder_principal' => 'Fuerza ilimitada',
            'nivel_poder' => 98,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes?search=Thor');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nombre', 'Thor');
    }

    public function test_consulta_user_can_view_single_hero_with_missions(): void
    {
        $hero = Hero::create([
            'nombre' => 'Spider-Man',
            'nombre_real' => 'Peter Parker',
            'poder_principal' => 'Sentido arácnido',
            'nivel_poder' => 80,
            'estado' => 'ACTIVO',
        ]);

        Mission::create([
            'titulo' => 'Patrullaje en Queens',
            'descripcion' => 'Patrullaje urbano',
            'ubicacion' => 'Queens, NY',
            'fecha' => '2026-08-14',
            'nivel_peligro' => 'BAJO',
            'estado' => 'EN_PROGRESO',
            'superheroe_id' => $hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson("/api/heroes/{$hero->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $hero->id,
                    'nombre' => 'Spider-Man',
                    'missions' => [
                        [
                            'titulo' => 'Patrullaje en Queens',
                        ],
                    ],
                ],
            ]);
    }

    public function test_view_nonexistent_hero_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes/9999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ]);
    }

    public function test_admin_can_create_hero(): void
    {
        $payload = [
            'nombre' => 'Doctor Strange',
            'nombre_real' => 'Stephen Strange',
            'poder_principal' => 'Artes místicas',
            'nivel_poder' => 92,
            'imagen_url' => 'https://cdn.marvel.com/strange.jpg',
            'estado' => 'ACTIVO',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Superhéroe creado exitosamente.',
                'data' => [
                    'nombre' => 'Doctor Strange',
                    'nivel_poder' => 92,
                ],
            ]);

        $this->assertDatabaseHas('heroes', ['nombre' => 'Doctor Strange']);
    }

    public function test_consulta_user_cannot_create_hero_returns_403(): void
    {
        $payload = [
            'nombre' => 'Scarlet Witch',
            'nombre_real' => 'Wanda Maximoff',
            'poder_principal' => 'Magia del caos',
            'nivel_poder' => 99,
            'estado' => 'ACTIVO',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->postJson('/api/heroes', $payload);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_hero_validation_rules(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => '',
                'nivel_poder' => 150, // max 100
                'estado' => 'INVALID_STATUS',
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['nombre', 'nombre_real', 'poder_principal', 'nivel_poder', 'estado'],
            ]);
    }

    public function test_admin_can_update_hero(): void
    {
        $hero = Hero::create([
            'nombre' => 'Thor',
            'nombre_real' => 'Thor Odinson',
            'poder_principal' => 'Trueno',
            'nivel_poder' => 90,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/heroes/{$hero->id}", [
                'nivel_poder' => 95,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Superhéroe actualizado exitosamente.',
                'data' => [
                    'id' => $hero->id,
                    'nivel_poder' => 95,
                ],
            ]);
    }

    public function test_consulta_user_cannot_update_hero(): void
    {
        $hero = Hero::create([
            'nombre' => 'Thor',
            'nombre_real' => 'Thor Odinson',
            'poder_principal' => 'Trueno',
            'nivel_poder' => 90,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->putJson("/api/heroes/{$hero->id}", [
                'nivel_poder' => 95,
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_delete_hero(): void
    {
        $hero = Hero::create([
            'nombre' => 'Loki',
            'nombre_real' => 'Loki Laufeyson',
            'poder_principal' => 'Ilusiones',
            'nivel_poder' => 88,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/heroes/{$hero->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Superhéroe eliminado exitosamente.',
            ]);

        $this->assertDatabaseMissing('heroes', ['id' => $hero->id]);
    }

    public function test_heroes_search_returns_empty_array_when_no_match_found(): void
    {
        Hero::create([
            'nombre' => 'Thor',
            'nombre_real' => 'Thor Odinson',
            'poder_principal' => 'Control del trueno',
            'nivel_poder' => 95,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes?search=Batman');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [],
            ])
            ->assertJsonCount(0, 'data');
    }

    public function test_heroes_search_matches_real_name_and_power(): void
    {
        Hero::create([
            'nombre' => 'Doctor Strange',
            'nombre_real' => 'Stephen Strange',
            'poder_principal' => 'Artes místicas y magia',
            'nivel_poder' => 92,
            'estado' => 'ACTIVO',
        ]);

        // Search by real name
        $response1 = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes?search=Stephen');

        $response1->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nombre', 'Doctor Strange');

        // Search by power
        $response2 = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes?search=magia');

        $response2->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nombre', 'Doctor Strange');
    }

    public function test_unauthenticated_user_cannot_access_any_hero_endpoints(): void
    {
        $this->getJson('/api/heroes')->assertStatus(401);
        $this->getJson('/api/heroes/1')->assertStatus(401);
        $this->postJson('/api/heroes', [])->assertStatus(401);
        $this->putJson('/api/heroes/1', [])->assertStatus(401);
        $this->deleteJson('/api/heroes/1')->assertStatus(401);
    }

    public function test_hero_creation_fails_with_duplicate_name(): void
    {
        Hero::create([
            'nombre' => 'Iron Man',
            'nombre_real' => 'Tony Stark',
            'poder_principal' => 'Armadura',
            'nivel_poder' => 85,
            'estado' => 'ACTIVO',
        ]);

        $payload = [
            'nombre' => 'Iron Man',
            'nombre_real' => 'Anthony Stark',
            'poder_principal' => 'Genio científico',
            'nivel_poder' => 88,
            'estado' => 'ACTIVO',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', $payload);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['nombre'],
            ]);
    }

    public function test_hero_creation_fails_with_out_of_bounds_power_level(): void
    {
        // Test power level = 0
        $responseMin = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Zero Hero',
                'nombre_real' => 'Zero',
                'poder_principal' => 'None',
                'nivel_poder' => 0,
                'estado' => 'ACTIVO',
            ]);

        $responseMin->assertStatus(422)
            ->assertJsonStructure(['errors' => ['nivel_poder']]);

        // Test power level = 101
        $responseMax = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Max Hero',
                'nombre_real' => 'Max',
                'poder_principal' => 'Infinite',
                'nivel_poder' => 101,
                'estado' => 'ACTIVO',
            ]);

        $responseMax->assertStatus(422)
            ->assertJsonStructure(['errors' => ['nivel_poder']]);
    }

    public function test_admin_update_nonexistent_hero_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson('/api/heroes/99999', [
                'nivel_poder' => 50,
            ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ]);
    }

    public function test_admin_delete_nonexistent_hero_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson('/api/heroes/99999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ]);
    }

    public function test_consulta_delete_nonexistent_hero_returns_403(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->deleteJson('/api/heroes/99999');

        $response->assertStatus(403);
    }

    public function test_admin_can_update_hero_keeping_same_name(): void
    {
        $hero = Hero::create([
            'nombre' => 'Black Widow',
            'nombre_real' => 'Natasha Romanoff',
            'poder_principal' => 'Espionaje y combate',
            'nivel_poder' => 75,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/heroes/{$hero->id}", [
                'nombre' => 'Black Widow',
                'nivel_poder' => 78,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $hero->id,
                    'nombre' => 'Black Widow',
                    'nivel_poder' => 78,
                ],
            ]);
    }

    public function test_deleting_hero_via_api_cascades_and_deletes_missions(): void
    {
        $hero = Hero::create([
            'nombre' => 'Hawkeye',
            'nombre_real' => 'Clint Barton',
            'poder_principal' => 'Puntería perfecta',
            'nivel_poder' => 70,
            'estado' => 'ACTIVO',
        ]);

        $mission = Mission::create([
            'titulo' => 'Vigilancia en Vormir',
            'descripcion' => 'Misión de reconocimiento',
            'ubicacion' => 'Vormir',
            'fecha' => '2026-08-15',
            'nivel_peligro' => 'ALTO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/heroes/{$hero->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('heroes', ['id' => $hero->id]);
        $this->assertDatabaseMissing('missions', ['id' => $mission->id]);
    }
}
