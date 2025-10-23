<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    /**
     * Obtener todas las tareas del usuario
     */
    public function index(Request $request)
    {
        $query = Task::where('user_id', $request->user()->id)
            ->with(['priority', 'tags', 'attachments', 'collaborators']);

        // Filtros opcionales
        if ($request->has('is_completed')) {
            $query->where('is_completed', $request->boolean('is_completed'));
        }

        if ($request->has('priority_id')) {
            $query->where('priority_id', $request->priority_id);
        }

        if ($request->has('tag_id')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tags.id', $request->tag_id);
            });
        }

        if ($request->has('overdue') && $request->boolean('overdue')) {
            $query->overdue();
        }

        if ($request->has('due_today') && $request->boolean('due_today')) {
            $query->dueToday();
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $tasks = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $tasks
        ]);
    }

    /**
     * Crear tarea
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority_id' => 'nullable|exists:priorities,id',
            'due_date' => 'nullable|date',
            'reminder_date' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $task = Task::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'priority_id' => $validated['priority_id'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'reminder_date' => $validated['reminder_date'] ?? null,
        ]);

        // Sincronizar tags
        if (isset($validated['tags'])) {
            $task->tags()->sync($validated['tags']);
        }

        $task->load(['priority', 'tags', 'attachments']);

        return response()->json([
            'success' => true,
            'message' => 'Tarea creada exitosamente',
            'data' => $task
        ], 201);
    }

    /**
     * Mostrar una tarea específica
     */
    public function show(Request $request, Task $task)
    {
        // Verificar permisos
        if ($task->user_id !== $request->user()->id && 
            !$task->collaborators->contains($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver esta tarea'
            ], 403);
        }

        $task->load(['priority', 'tags', 'attachments', 'collaborators']);

        return response()->json([
            'success' => true,
            'data' => $task
        ]);
    }

    /**
     * Actualizar tarea
     */
    public function update(Request $request, Task $task)
    {
        // Verificar permisos
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para actualizar esta tarea'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority_id' => 'nullable|exists:priorities,id',
            'is_completed' => 'sometimes|boolean',
            'due_date' => 'nullable|date',
            'reminder_date' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        // Si se marca como completada, registrar fecha
        if (isset($validated['is_completed']) && $validated['is_completed']) {
            $validated['completed_at'] = now();
        } elseif (isset($validated['is_completed']) && !$validated['is_completed']) {
            $validated['completed_at'] = null;
        }

        $task->update($validated);

        // Sincronizar tags si se enviaron
        if (isset($validated['tags'])) {
            $task->tags()->sync($validated['tags']);
        }

        $task->load(['priority', 'tags', 'attachments']);

        return response()->json([
            'success' => true,
            'message' => 'Tarea actualizada exitosamente',
            'data' => $task
        ]);
    }

    /**
     * Eliminar tarea (soft delete)
     */
    public function destroy(Request $request, Task $task)
    {
        // Verificar permisos
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar esta tarea'
            ], 403);
        }

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tarea eliminada exitosamente'
        ]);
    }

    /**
     * Marcar/desmarcar tarea como completada
     */
    public function toggleComplete(Request $request, Task $task)
    {
        // Verificar permisos
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para modificar esta tarea'
            ], 403);
        }

        $task->is_completed = !$task->is_completed;
        $task->completed_at = $task->is_completed ? now() : null;
        $task->save();

        return response()->json([
            'success' => true,
            'message' => $task->is_completed ? 'Tarea completada' : 'Tarea marcada como pendiente',
            'data' => $task
        ]);
    }

    /**
     * Adjuntar archivo/enlace a tarea
     */
    public function addAttachment(Request $request, Task $task)
    {
        // Verificar permisos
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para modificar esta tarea'
            ], 403);
        }

        $validated = $request->validate([
            'type' => 'required|in:image,document,link',
            'file' => 'required_if:type,image,document|file|max:10240', // 10MB
            'url' => 'required_if:type,link|url',
            'name' => 'required|string|max:255',
        ]);

        $attachmentData = [
            'task_id' => $task->id,
            'type' => $validated['type'],
            'name' => $validated['name'],
        ];

        if ($validated['type'] === 'link') {
            $attachmentData['url'] = $validated['url'];
        } else {
            $file = $request->file('file');
            $path = $file->store('task-attachments', 'public');
            
            $attachmentData['path'] = $path;
            $attachmentData['mime_type'] = $file->getMimeType();
            $attachmentData['size'] = $file->getSize();
        }

        $attachment = TaskAttachment::create($attachmentData);

        return response()->json([
            'success' => true,
            'message' => 'Archivo adjuntado exitosamente',
            'data' => $attachment
        ], 201);
    }

    /**
     * Eliminar adjunto
     */
    public function removeAttachment(Request $request, Task $task, TaskAttachment $attachment)
    {
        // Verificar permisos
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para modificar esta tarea'
            ], 403);
        }

        // Verificar que el adjunto pertenece a la tarea
        if ($attachment->task_id !== $task->id) {
            return response()->json([
                'success' => false,
                'message' => 'El adjunto no pertenece a esta tarea'
            ], 404);
        }

        // Eliminar archivo físico si existe
        if ($attachment->path) {
            Storage::disk('public')->delete($attachment->path);
        }

        $attachment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Adjunto eliminado exitosamente'
        ]);
    }

    /**
     * Obtener estadísticas del usuario
     */
    public function statistics(Request $request)
    {
        $userId = $request->user()->id;

        $stats = [
            'total_tasks' => Task::where('user_id', $userId)->count(),
            'completed_tasks' => Task::where('user_id', $userId)->completed()->count(),
            'pending_tasks' => Task::where('user_id', $userId)->pending()->count(),
            'overdue_tasks' => Task::where('user_id', $userId)->overdue()->count(),
            'due_today' => Task::where('user_id', $userId)->dueToday()->count(),
        ];

        $stats['completion_rate'] = $stats['total_tasks'] > 0 
            ? round(($stats['completed_tasks'] / $stats['total_tasks']) * 100, 2) 
            : 0;

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}