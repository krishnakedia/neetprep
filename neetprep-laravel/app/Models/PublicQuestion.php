<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicQuestion extends Model
{
    protected $fillable = [
        'subject_id',
        'chapter_id',
        'topic_id',
        'question_text',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
        'explanation',
        'marks',
        'ncert',
        'difficulty',
        'year',
        'question_type',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'marks' => 'integer',
        'year' => 'integer'
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}