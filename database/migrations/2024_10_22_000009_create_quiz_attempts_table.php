<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('attempt_number')->default(1);
            $table->unsignedDecimal('score', 5, 2)->default(0);
            $table->unsignedDecimal('max_score', 5, 2)->default(0);
            $table->unsignedDecimal('percentage', 5, 2)->default(0);
            $table->enum('status', ['in_progress', 'completed', 'passed', 'failed'])->default('in_progress');
            $table->boolean('is_passed')->default(false);
            $table->unsignedInteger('time_spent_seconds')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->unique(['quiz_id', 'user_id', 'attempt_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};
