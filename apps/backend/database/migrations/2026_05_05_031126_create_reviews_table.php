<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('service_jobs')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reviewee_id')->constrained('users')->onDelete('cascade');
            $table->decimal('rating', 2, 1);
            $table->text('comment')->nullable();
            $table->decimal('quality', 2, 1)->nullable();
            $table->decimal('punctuality', 2, 1)->nullable();
            $table->decimal('communication', 2, 1)->nullable();
            $table->decimal('professionalism', 2, 1)->nullable();
            $table->decimal('price', 2, 1)->nullable();
            $table->boolean('fraud_flagged')->default(false);
            $table->timestamps();

            $table->unique(['job_id', 'reviewer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
