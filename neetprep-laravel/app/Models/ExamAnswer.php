<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_attempt_id',
        'question_id',
        'selected_answer',
        'is_correct',
        'marks_obtained'
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
            'marks_obtained' => 'integer',
        ];
    }

    public function examAttempt()
    {
        return $this->belongsTo(ExamAttempt::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
