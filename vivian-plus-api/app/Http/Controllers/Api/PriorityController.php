<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Priority;

class PriorityController extends Controller
{
    /**
     * Obtener todas las prioridades
     */
    public function index()
    {
        $priorities = Priority::orderBy('level')->get();

        return response()->json([
            'success' => true,
            'data' => $priorities
        ]);
    }
}