<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('worker_certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('issuer')->nullable();
            $table->year('year')->nullable();
            $table->string('document_url')->nullable();
            $table->boolean('verified')->default(false);
            $table->boolean('ai_verified')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_certifications');
    }
};
