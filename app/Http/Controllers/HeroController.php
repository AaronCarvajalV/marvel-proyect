<?php

namespace App\Http\Controllers;

use App\Models\Hero;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HeroController extends Controller
{
    /**
     * Display a listing of superheroes, with optional ?search= filter.
     */
    public function index(Request $request): JsonResponse
    {
        $heroes = Hero::withCount('missions')
            ->search($request->query('search'))
            ->get();

        return response()->json([
            'success' => true,
            'data' => $heroes,
        ], Response::HTTP_OK);
    }

    /**
     * Display the specified superhero with associated missions.
     */
    public function show(int $id): JsonResponse
    {
        $hero = Hero::with('missions')->find($id);

        if (! $hero) {
            return response()->json([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $hero,
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created superhero in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:heroes,nombre',
            'nombre_real' => 'required|string|max:255',
            'poder_principal' => 'required|string|max:255',
            'nivel_poder' => 'required|integer|min:1|max:100',
            'imagen_url' => 'nullable|url|max:500',
            'estado' => 'required|in:ACTIVO,INACTIVO',
        ]);

        $hero = Hero::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Superhéroe creado exitosamente.',
            'data' => $hero,
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified superhero in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $hero = Hero::find($id);

        if (! $hero) {
            return response()->json([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255|unique:heroes,nombre,'.$id,
            'nombre_real' => 'sometimes|required|string|max:255',
            'poder_principal' => 'sometimes|required|string|max:255',
            'nivel_poder' => 'sometimes|required|integer|min:1|max:100',
            'imagen_url' => 'nullable|url|max:500',
            'estado' => 'sometimes|required|in:ACTIVO,INACTIVO',
        ]);

        $hero->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Superhéroe actualizado exitosamente.',
            'data' => $hero->fresh(),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified superhero from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $hero = Hero::find($id);

        if (! $hero) {
            return response()->json([
                'success' => false,
                'message' => 'Superhéroe no encontrado con el ID especificado.',
            ], Response::HTTP_NOT_FOUND);
        }

        $hero->delete();

        return response()->json([
            'success' => true,
            'message' => 'Superhéroe eliminado exitosamente.',
        ], Response::HTTP_OK);
    }
}
