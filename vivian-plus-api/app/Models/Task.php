<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'priority_id',
        'title',
        'description',
        'is_completed',
        'completed_at',
        'due_date',
        'reminder_date',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'priority_id' => 'integer',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
        'due_date' => 'datetime',
        'reminder_date' => 'datetime',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function priority()
    {
        return $this->belongsTo(Priority::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'task_tag')
            ->withTimestamps();
    }

    public function attachments()
    {
        return $this->hasMany(TaskAttachment::class);
    }

    public function collaborators()
    {
        return $this->belongsToMany(User::class, 'task_collaborators')
            ->withPivot('role')
            ->withTimestamps();
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_completed', false);
    }

    public function scopeDueToday($query)
    {
        return $query->whereDate('due_date', today());
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->where('is_completed', false);
    }
}