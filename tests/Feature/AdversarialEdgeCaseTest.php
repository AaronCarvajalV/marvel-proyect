<?php

namespace Tests\Feature;

use App\Models\Hero;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class AdversarialEdgeCaseTest extends TestCase
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
            'nombre' => 'Director Fury',
            'email' => 'admin@shield.gov',
            'password' => bcrypt('Admin1234!'),
            'rol' => 'ADMIN',
        ]);
        $this->adminToken = JWTAuth::fromUser($this->adminUser);

        $this->consultaUser = User::create([
            'nombre' => 'Agent Coulson',
            'email' => 'consulta@shield.gov',
            'password' => bcrypt('Consulta1234!'),
            'rol' => 'CONSULTA',
        ]);
        $this->consultaToken = JWTAuth::fromUser($this->consultaUser);
    }

    /**
     * 1. BOUNDARY CONDITIONS: POWER LEVEL (0, 1, 100, 101, negative, float)
     */
    public function test_power_level_boundary_1_is_accepted(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Min Power Hero',
                'nombre_real' => 'John Doe',
                'poder_principal' => 'Basic punch',
                'nivel_poder' => 1, // Valid Lower Boundary
                'estado' => 'ACTIVO',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.nivel_poder', 1);

        $this->assertDatabaseHas('heroes', ['nombre' => 'Min Power Hero', 'nivel_poder' => 1]);
    }

    public function test_power_level_boundary_100_is_accepted(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Max Power Hero',
                'nombre_real' => 'Cosmic Being',
                'poder_principal' => 'Omnipotence',
                'nivel_poder' => 100, // Valid Upper Boundary
                'estado' => 'ACTIVO',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.nivel_poder', 100);

        $this->assertDatabaseHas('heroes', ['nombre' => 'Max Power Hero', 'nivel_poder' => 100]);
    }

    public function test_power_level_boundary_0_is_rejected(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Zero Power Hero',
                'nombre_real' => 'Nobody',
                'poder_principal' => 'Nothing',
                'nivel_poder' => 0, // Below min (invalid)
                'estado' => 'ACTIVO',
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['nivel_poder']]);
    }

    public function test_power_level_boundary_101_is_rejected(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Over 100 Power Hero',
                'nombre_real' => 'God',
                'poder_principal' => 'Too powerful',
                'nivel_poder' => 101, // Above max (invalid)
                'estado' => 'ACTIVO',
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['nivel_poder']]);
    }

    public function test_power_level_negative_and_string_are_rejected(): void
    {
        $negResponse = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Negative Hero',
                'nombre_real' => 'Neg',
                'poder_principal' => 'Negative',
                'nivel_poder' => -50,
                'estado' => 'ACTIVO',
            ]);

        $negResponse->assertStatus(422)
            ->assertJsonStructure(['errors' => ['nivel_poder']]);

        $strResponse = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'String Hero',
                'nombre_real' => 'Str',
                'poder_principal' => 'String',
                'nivel_poder' => 'SUPER',
                'estado' => 'ACTIVO',
            ]);

        $strResponse->assertStatus(422)
            ->assertJsonStructure(['errors' => ['nivel_poder']]);
    }

    /**
     * 2. DUPLICATE CONSTRAINTS (EMAIL, HERO NAME CREATE, HERO NAME UPDATE)
     */
    public function test_registration_duplicate_email_fails(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'nombre' => 'Imposter Fury',
            'email' => 'admin@shield.gov', // Already exists
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['email']]);
    }

    public function test_hero_duplicate_name_on_create_fails(): void
    {
        Hero::create([
            'nombre' => 'Thor',
            'nombre_real' => 'Thor Odinson',
            'poder_principal' => 'Trueno',
            'nivel_poder' => 95,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Thor', // Duplicate
                'nombre_real' => 'Another Thor',
                'poder_principal' => 'Lightning',
                'nivel_poder' => 90,
                'estado' => 'ACTIVO',
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['nombre']]);
    }

    public function test_hero_duplicate_name_on_update_with_another_heroes_name_fails(): void
    {
        $hero1 = Hero::create([
            'nombre' => 'Iron Man',
            'nombre_real' => 'Tony Stark',
            'poder_principal' => 'Armor',
            'nivel_poder' => 85,
            'estado' => 'ACTIVO',
        ]);

        $hero2 = Hero::create([
            'nombre' => 'War Machine',
            'nombre_real' => 'James Rhodes',
            'poder_principal' => 'Heavy Armor',
            'nivel_poder' => 80,
            'estado' => 'ACTIVO',
        ]);

        // Try to update hero2's name to hero1's name
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/heroes/{$hero2->id}", [
                'nombre' => 'Iron Man',
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['nombre']]);
    }

    public function test_hero_update_retaining_own_name_succeeds(): void
    {
        $hero = Hero::create([
            'nombre' => 'Hulk',
            'nombre_real' => 'Bruce Banner',
            'poder_principal' => 'Smash',
            'nivel_poder' => 98,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/heroes/{$hero->id}", [
                'nombre' => 'Hulk',
                'nivel_poder' => 99,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.nivel_poder', 99)
            ->assertJsonPath('data.nombre', 'Hulk');
    }

    /**
     * 3. FOREIGN KEY CONSTRAINTS & CASCADE DELETIONS
     */
    public function test_cannot_create_mission_with_nonexistent_hero_fk(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/misiones', [
                'titulo' => 'Orphan Mission',
                'descripcion' => 'Should fail due to invalid FK',
                'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
                'fecha' => '2026-10-10',
                'nivel_peligro' => 'MEDIO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => 88888,
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['superheroe_id']]);
    }

    public function test_cannot_update_mission_with_nonexistent_hero_fk(): void
    {
        $hero = Hero::create([
            'nombre' => 'Captain America',
            'nombre_real' => 'Steve Rogers',
            'poder_principal' => 'Shield',
            'nivel_poder' => 75,
            'estado' => 'ACTIVO',
        ]);

        $mission = Mission::create([
            'titulo' => 'Valid Mission',
            'descripcion' => 'Initial',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-10-10',
            'nivel_peligro' => 'MEDIO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/misiones/{$mission->id}", [
                'superheroe_id' => 77777,
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['superheroe_id']]);
    }

    public function test_hero_deletion_cascades_and_deletes_all_associated_missions(): void
    {
        $hero = Hero::create([
            'nombre' => 'Doctor Strange',
            'nombre_real' => 'Stephen Strange',
            'poder_principal' => 'Mystic Arts',
            'nivel_poder' => 92,
            'estado' => 'ACTIVO',
        ]);

        $mission1 = Mission::create([
            'titulo' => 'Mystic Mission 1',
            'descripcion' => 'Seal rift 1',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-10-01',
            'nivel_peligro' => 'ALTO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $hero->id,
        ]);

        $mission2 = Mission::create([
            'titulo' => 'Mystic Mission 2',
            'descripcion' => 'Seal rift 2',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-10-02',
            'nivel_peligro' => 'ALTO',
            'estado' => 'EN_PROGRESO',
            'superheroe_id' => $hero->id,
        ]);

        $this->assertEquals(2, Mission::where('superheroe_id', $hero->id)->count());

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/heroes/{$hero->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('heroes', ['id' => $hero->id]);
        $this->assertDatabaseMissing('missions', ['id' => $mission1->id]);
        $this->assertDatabaseMissing('missions', ['id' => $mission2->id]);
        $this->assertEquals(0, Mission::where('superheroe_id', $hero->id)->count());
    }

    /**
     * 4. CONSULTA ROLE WRITE ATTEMPTS STRICTLY BLOCKED (POST, PUT, DELETE FOR HEROES AND MISSIONS)
     */
    public function test_consulta_cannot_post_hero(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Consulta Hero',
                'nombre_real' => 'Real Name',
                'poder_principal' => 'Power',
                'nivel_poder' => 50,
                'estado' => 'ACTIVO',
            ]);

        $response->assertStatus(403);
    }

    public function test_consulta_cannot_put_hero(): void
    {
        $hero = Hero::create([
            'nombre' => 'Scarlet Witch',
            'nombre_real' => 'Wanda Maximoff',
            'poder_principal' => 'Chaos Magic',
            'nivel_poder' => 99,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->putJson("/api/heroes/{$hero->id}", [
                'nivel_poder' => 100,
            ]);

        $response->assertStatus(403);
    }

    public function test_consulta_cannot_delete_hero(): void
    {
        $hero = Hero::create([
            'nombre' => 'Hawkeye',
            'nombre_real' => 'Clint Barton',
            'poder_principal' => 'Archery',
            'nivel_poder' => 70,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->deleteJson("/api/heroes/{$hero->id}");

        $response->assertStatus(403);
    }

    public function test_consulta_cannot_post_mission(): void
    {
        $hero = Hero::create([
            'nombre' => 'Ant-Man',
            'nombre_real' => 'Scott Lang',
            'poder_principal' => 'Quantum size manipulation',
            'nivel_poder' => 75,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->postJson('/api/misiones', [
                'titulo' => 'Consulta Mission',
                'descripcion' => 'Blocked',
                'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
                'fecha' => '2026-11-01',
                'nivel_peligro' => 'BAJO',
                'estado' => 'PENDIENTE',
                'superheroe_id' => $hero->id,
            ]);

        $response->assertStatus(403);
    }

    public function test_consulta_cannot_put_mission(): void
    {
        $hero = Hero::create([
            'nombre' => 'Wasp',
            'nombre_real' => 'Hope van Dyne',
            'poder_principal' => 'Flight and blasters',
            'nivel_poder' => 75,
            'estado' => 'ACTIVO',
        ]);

        $mission = Mission::create([
            'titulo' => 'Micro Mission',
            'descripcion' => 'Desc',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-11-01',
            'nivel_peligro' => 'BAJO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->putJson("/api/misiones/{$mission->id}", [
                'estado' => 'COMPLETADA',
            ]);

        $response->assertStatus(403);
    }

    public function test_consulta_cannot_delete_mission(): void
    {
        $hero = Hero::create([
            'nombre' => 'Falcon',
            'nombre_real' => 'Sam Wilson',
            'poder_principal' => 'Wings',
            'nivel_poder' => 75,
            'estado' => 'ACTIVO',
        ]);

        $mission = Mission::create([
            'titulo' => 'Aerial Recon',
            'descripcion' => 'Recon',
            'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
            'fecha' => '2026-11-01',
            'nivel_peligro' => 'BAJO',
            'estado' => 'PENDIENTE',
            'superheroe_id' => $hero->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->deleteJson("/api/misiones/{$mission->id}");

        $response->assertStatus(403);
    }

    /**
     * 5. INVALID IDS AND 404 ERROR HANDLING
     */
    public function test_get_nonexistent_hero_id_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes/999999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ]);
    }

    public function test_put_nonexistent_hero_id_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson('/api/heroes/999999', [
                'nivel_poder' => 50,
            ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ]);
    }

    public function test_delete_nonexistent_hero_id_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson('/api/heroes/999999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ]);
    }

    public function test_get_nonexistent_mission_id_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/misiones/999999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ]);
    }

    public function test_put_nonexistent_mission_id_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson('/api/misiones/999999', [
                'estado' => 'COMPLETADA',
            ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ]);
    }

    public function test_delete_nonexistent_mission_id_returns_404(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson('/api/misiones/999999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ]);
    }

    public function test_large_out_of_range_numeric_id_returns_404(): void
    {
        $heroResponse = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes/2147483647');

        $heroResponse->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ]);

        $missionResponse = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/misiones/2147483647');

        $missionResponse->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ]);
    }



    /**
     * 6. ENUM VALUE VALIDATION AND SEARCH EDGE CASES
     */
    public function test_hero_invalid_enum_estado_rejected(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/heroes', [
                'nombre' => 'Enum Hero',
                'nombre_real' => 'Enum Real',
                'poder_principal' => 'Enum Power',
                'nivel_poder' => 50,
                'estado' => 'DESCONOCIDO', // Invalid enum
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['estado']]);
    }

    public function test_mission_invalid_enums_rejected(): void
    {
        $hero = Hero::create([
            'nombre' => 'Vision',
            'nombre_real' => 'Synthezoid',
            'poder_principal' => 'Mind Stone',
            'nivel_poder' => 95,
            'estado' => 'ACTIVO',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/misiones', [
                'titulo' => 'Bad Enum Mission',
                'descripcion' => 'Testing enums',
                'target_location_id' => \App\Models\TargetLocation::factory()->create()->id,
                'fecha' => '2026-12-01',
                'nivel_peligro' => 'EXTREMO', // Invalid enum
                'estado' => 'CANCELADA', // Invalid enum
                'superheroe_id' => $hero->id,
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['nivel_peligro', 'estado']]);
    }

    public function test_search_with_sql_injection_and_wildcards_is_safe(): void
    {
        Hero::create([
            'nombre' => 'Thor',
            'nombre_real' => 'Thor Odinson',
            'poder_principal' => 'Trueno',
            'nivel_poder' => 95,
            'estado' => 'ACTIVO',
        ]);

        // SQL injection probe
        $sqlInjectionResponse = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes?search=' . urlencode("' OR 1=1 --"));

        $sqlInjectionResponse->assertStatus(200)
            ->assertJsonCount(0, 'data');

        // Wildcard probe %
        $wildcardResponse = $this->withHeader('Authorization', "Bearer {$this->consultaToken}")
            ->getJson('/api/heroes?search=%25');

        $wildcardResponse->assertStatus(200);
    }
}
