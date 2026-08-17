<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\TargetLocation;
use Illuminate\Http\JsonResponse;

class TargetLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $locations = TargetLocation::orderBy('country')->orderBy('city')->get();
        
        return response()->json([
            'success' => true,
            'data' => $locations
        ]);
    }
}
