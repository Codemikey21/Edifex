<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('worker_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('category')->nullable();
            $table->decimal('confidence', 3, 2)->nullable();
            $table->integer('years_experience')->default(0);
            $table->boolean('ai_extracted')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_skills');
    }
};
