<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained()->nullOnDelete();
            $table->string('metric_key');
            $table->unsignedDecimal('numeric_value', 8, 2)->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('recorded_at')->useCurrent();
            $table->timestamps();
            $table->unique(['user_id', 'lesson_id', 'metric_key', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_metrics');
    }
};
