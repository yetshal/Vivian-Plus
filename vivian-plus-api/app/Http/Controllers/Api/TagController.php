<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Obtener todas las etiquetas del usuario
     */
    public function index(Request $request)
    {
        $tags = Tag::where('user_id', $request->user()->id)
            ->withCount('tasks')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tags
        ]);
    }

    /**
     * Crear etiqueta
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $tag = Tag::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'color' => $validated['color'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Etiqueta creada exitosamente',
            'data' => $tag
        ], 201);
    }

    /**
     * Actualizar etiqueta
     */
    public function update(Request $request, Tag $tag)
    {
        // Verificar que la etiqueta pertenece al usuario
        if ($tag->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para actualizar esta etiqueta'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'color' => 'sometimes|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $tag->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Etiqueta actualizada exitosamente',
            'data' => $tag
        ]);
    }

    /**
     * Eliminar etiqueta
     */
    public function destroy(Request $request, Tag $tag)
    {
        // Verificar que la etiqueta pertenece al usuario
        if ($tag->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar esta etiqueta'
            ], 403);
        }

        $tag->delete();

        return response()->json([
            'success' => true,
            'message' => 'Etiqueta eliminada exitosamente'
        ]);
    }
}