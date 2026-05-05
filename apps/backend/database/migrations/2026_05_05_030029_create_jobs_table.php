<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('worker_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->enum('status', [
                'draft', 'published', 'matched', 'in_progress', 'completed', 'cancelled', 'disputed'
            ])->default('draft');
            $table->json('required_skills')->nullable();
            // Ubicación
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('city')->nullable();
            $table->string('department')->nullable();
            $table->string('country')->default('CO');
            // Presupuesto
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            $table->decimal('agreed_amount', 10, 2)->nullable();
            $table->string('currency', 3)->default('COP');
            $table->enum('budget_type', ['fixed', 'hourly', 'daily', 'negotiable'])->default('negotiable');
            // Timeline
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('urgency', ['flexible', 'normal', 'urgent', 'emergency'])->default('normal');
            $table->integer('estimated_days')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_jobs');
    }
};
