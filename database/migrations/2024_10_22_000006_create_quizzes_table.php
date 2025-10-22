<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->enum('type', ['pre_test', 'post_test', 'exercise']);
            $table->text('description')->nullable();
            $table->unsignedInteger('time_limit_minutes')->nullable();
            $table->unsignedInteger('passing_score')->default(0);
            $table->unsignedTinyInteger('max_attempts')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['lesson_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
