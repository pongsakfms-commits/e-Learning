<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_metric_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dashboard_metric_id')->constrained()->cascadeOnDelete();
            $table->unsignedDecimal('previous_value', 8, 2)->nullable();
            $table->unsignedDecimal('new_value', 8, 2)->nullable();
            $table->string('change_reason')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('changed_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_metric_logs');
    }
};
