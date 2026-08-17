<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MissionController extends Controller
{
    /**
     * Display a listing of missions with assigned superheroes.
     */
    public function index(): JsonResponse
    {
        $missions = Mission::with('hero', 'targetLocation')->get();

        return response()->json([
            'success' => true,
            'data' => $missions,
        ], Response::HTTP_OK);
    }

    /**
     * Display the specified mission with assigned superhero details.
     */
    public function show(int $id): JsonResponse
    {
        $mission = Mission::with('hero', 'targetLocation')->find($id);

        if (! $mission) {
            return response()->json([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $mission,
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created mission in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'target_location_id' => 'required|integer|exists:target_locations,id',
            'fecha' => 'required|date|date_format:Y-m-d',
            'nivel_peligro' => 'required|in:BAJO,MEDIO,ALTO',
            'estado' => 'required|in:PENDIENTE,EN_PROGRESO,COMPLETADA',
            'superheroe_id' => 'required|integer|exists:heroes,id',
        ], [
            'superheroe_id.exists' => 'El superhéroe seleccionado no es válido o no existe.',
            'target_location_id.exists' => 'La ubicación seleccionada no es válida o no existe.',
        ]);

        $mission = Mission::create($validated);
        $mission->load('hero', 'targetLocation');

        return response()->json([
            'success' => true,
            'message' => 'Misión creada exitosamente.',
            'data' => $mission,
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified mission in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $mission = Mission::find($id);

        if (! $mission) {
            return response()->json([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|required|string',
            'target_location_id' => 'sometimes|required|integer|exists:target_locations,id',
            'fecha' => 'sometimes|required|date|date_format:Y-m-d',
            'nivel_peligro' => 'sometimes|required|in:BAJO,MEDIO,ALTO',
            'estado' => 'sometimes|required|in:PENDIENTE,EN_PROGRESO,COMPLETADA',
            'superheroe_id' => 'sometimes|required|integer|exists:heroes,id',
        ], [
            'superheroe_id.exists' => 'El superhéroe seleccionado no es válido o no existe.',
            'target_location_id.exists' => 'La ubicación seleccionada no es válida o no existe.',
        ]);

        $mission->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Misión actualizada exitosamente.',
            'data' => $mission->fresh('hero', 'targetLocation'),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified mission from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $mission = Mission::find($id);

        if (! $mission) {
            return response()->json([
                'success' => false,
                'message' => 'Misión no encontrada con el ID especificado.',
            ], Response::HTTP_NOT_FOUND);
        }

        $mission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Misión eliminada exitosamente.',
        ], Response::HTTP_OK);
    }
}
