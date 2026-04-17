<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->string('ncert')->nullable()->after('marks');
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium')->after('ncert');
            $table->integer('year')->nullable()->after('difficulty');
            $table->enum('question_type', ['theory', 'numerical', 'diagram', 'assertion_reason', 'multiple_correct'])->default('theory')->after('year');
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['ncert', 'difficulty', 'year', 'question_type']);
        });
    }
};