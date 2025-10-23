<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskCollaborator extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'user_id',
        'role',
    ];

    protected $casts = [
        'task_id' => 'integer',
        'user_id' => 'integer',
    ];

    // Relaciones
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}