<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'chapter_id',
        'title',
        'description',
        'duration',
        'total_marks',
        'passing_marks',
        'is_active'
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'duration' => 'integer',
            'total_marks' => 'integer',
            'passing_marks' => 'integer',
        ];
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'exam_topic');
    }

    public function attempts()
    {
        return $this->hasMany(ExamAttempt::class);
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(\App\Models\User::class, 'exam_user')->withPivot('is_assigned', 'assigned_at');
    }

    public function getQuestionCountAttribute()
    {
        return $this->questions()->count();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
