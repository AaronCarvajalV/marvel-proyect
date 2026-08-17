<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EndpointRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_consulta_can_get_heroes_but_cannot_create()
    {
        $user = \App\Models\User::create([
            'nombre' => 'Phil Coulson',
            'email' => 'consulta@shield.gov',
            'password' => bcrypt('Consulta1234!'),
            'rol' => 'CONSULTA',
        ]);

        // 1. Login as CONSULTA
        $response = $this->postJson('/api/auth/login', [
            'email' => 'consulta@shield.gov',
            'password' => 'Consulta1234!',
        ]);
        $response->assertStatus(200);
        $token = $response->json('data.access_token');

        // 2. GET should succeed
        $getResp = $this->withToken($token)->getJson('/api/heroes');
        $getResp->dump()->assertStatus(200);

        // 3. POST should be forbidden
        $postResp = $this->withToken($token)->postJson('/api/heroes', [
            'nombre' => 'New Hero',
            'nombre_real' => 'New Identity',
            'poder_principal' => 'Testing',
            'nivel_poder' => 50,
            'imagen_url' => 'https://test.com',
            'estado' => 'ACTIVO'
        ]);
        $postResp->assertStatus(403);
    }
}
