<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('public_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('chapter_id')->nullable()->constrained('chapters')->onDelete('set null');
            $table->foreignId('topic_id')->nullable()->constrained('topics')->onDelete('set null');
            $table->text('question_text');
            $table->text('option_a');
            $table->text('option_b');
            $table->text('option_c');
            $table->text('option_d');
            $table->enum('correct_answer', ['A', 'B', 'C', 'D']);
            $table->text('explanation')->nullable();
            $table->integer('marks')->default(1);
            $table->enum('ncert', ['yes', 'no'])->default('no');
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->integer('year')->nullable();
            $table->string('question_type')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('public_questions');
    }
};