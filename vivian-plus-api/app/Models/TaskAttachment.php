<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'type',
        'name',
        'path',
        'url',
        'mime_type',
        'size',
    ];

    protected $casts = [
        'task_id' => 'integer',
        'size' => 'integer',
    ];

    // Relaciones
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    // Accessors
    public function getFullUrlAttribute()
    {
        if ($this->type === 'link') {
            return $this->url;
        }
        
        return $this->path ? asset('storage/' . $this->path) : null;
    }
}