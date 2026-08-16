<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_successfully(): void
    {
        $payload = [
            'nombre' => 'Nick Fury',
            'email' => 'director@shield.gov',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'rol' => 'ADMIN',
        ];

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'nombre', 'email', 'rol', 'created_at'],
                    'access_token',
                    'token_type',
                    'expires_in',
                ],
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'nombre' => 'Nick Fury',
                        'email' => 'director@shield.gov',
                        'rol' => 'ADMIN',
                    ],
                    'token_type' => 'bearer',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'director@shield.gov',
            'rol' => 'ADMIN',
        ]);
    }

    public function test_registration_validation_errors(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'nombre' => '',
            'email' => 'invalid-email',
            'password' => 'short',
            'password_confirmation' => 'mismatch',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['nombre', 'email', 'password'],
            ])
            ->assertJson(['success' => false]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        User::create([
            'nombre' => 'Phil Coulson',
            'email' => 'coulson@shield.gov',
            'password' => bcrypt('Consulta1234!'),
            'rol' => 'CONSULTA',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'coulson@shield.gov',
            'password' => 'Consulta1234!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'nombre', 'email', 'rol'],
                    'access_token',
                    'token_type',
                    'expires_in',
                ],
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'email' => 'coulson@shield.gov',
                        'rol' => 'CONSULTA',
                    ],
                ],
            ]);
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        User::create([
            'nombre' => 'Phil Coulson',
            'email' => 'coulson@shield.gov',
            'password' => bcrypt('Consulta1234!'),
            'rol' => 'CONSULTA',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'coulson@shield.gov',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Credenciales inválidas. Verifique su email y contraseña.',
            ]);
    }

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::create([
            'nombre' => 'Nick Fury',
            'email' => 'director@shield.gov',
            'password' => bcrypt('Admin1234!'),
            'rol' => 'ADMIN',
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'nombre' => 'Nick Fury',
                    'email' => 'director@shield.gov',
                    'rol' => 'ADMIN',
                ],
            ]);
    }

    public function test_unauthenticated_request_to_me_returns_401(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_registration_fails_when_email_is_already_taken(): void
    {
        User::create([
            'nombre' => 'Existing User',
            'email' => 'existing@shield.gov',
            'password' => bcrypt('Password123!'),
            'rol' => 'CONSULTA',
        ]);

        $response = $this->postJson('/api/auth/register', [
            'nombre' => 'New User',
            'email' => 'existing@shield.gov',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['email'],
            ]);
    }

    public function test_registration_fails_with_invalid_role_value(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'nombre' => 'Invalid Role User',
            'email' => 'invalidrole@shield.gov',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'rol' => 'SUPERUSER',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['rol'],
            ]);
    }

    public function test_registration_defaults_role_to_consulta_when_omitted(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'nombre' => 'Default Role User',
            'email' => 'defaultrole@shield.gov',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.user.rol', 'CONSULTA');

        $this->assertDatabaseHas('users', [
            'email' => 'defaultrole@shield.gov',
            'rol' => 'CONSULTA',
        ]);
    }

    public function test_login_fails_for_non_existent_email(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'ghost@shield.gov',
            'password' => 'SomePassword123!',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Credenciales inválidas. Verifique su email y contraseña.',
            ]);
    }

    public function test_login_validation_errors_when_fields_missing(): void
    {
        $response = $this->postJson('/api/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['email', 'password'],
            ]);
    }

    public function test_unauthenticated_request_with_malformed_token_returns_401(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer malformed.invalid.token')
            ->getJson('/api/auth/me');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_user_can_logout_and_invalidate_token(): void
    {
        $user = User::create([
            'nombre' => 'Nick Fury',
            'email' => 'director@shield.gov',
            'password' => bcrypt('Admin1234!'),
            'rol' => 'ADMIN',
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Sesión cerrada e invalidación de token completada.',
            ]);

        // Attempting to use the invalidated token must return 401
        $meResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/auth/me');

        $meResponse->assertStatus(401);
    }
}
