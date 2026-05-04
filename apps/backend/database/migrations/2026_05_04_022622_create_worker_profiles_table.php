<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('worker_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'active', 'suspended', 'banned'])->default('pending');
            $table->text('bio')->nullable();
            $table->json('categories')->nullable();
            $table->integer('experience_years')->default(0);
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->decimal('daily_rate', 10, 2)->nullable();
            $table->string('currency', 3)->default('COP');
            $table->string('cv_url')->nullable();
            $table->decimal('ai_score', 5, 2)->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->integer('total_jobs_completed')->default(0);
            $table->boolean('verified')->default(false);
            // Geolocalización
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('city')->nullable();
            $table->string('department')->nullable();
            $table->string('country')->default('CO');
            // Disponibilidad
            $table->boolean('is_available')->default(true);
            $table->json('working_days')->nullable();
            $table->time('working_hours_start')->nullable();
            $table->time('working_hours_end')->nullable();
            $table->integer('max_travel_radius_km')->default(25);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_profiles');
    }
};
