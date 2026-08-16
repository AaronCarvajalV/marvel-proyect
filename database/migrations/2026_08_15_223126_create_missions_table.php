<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion');
            $table->string('ubicacion');
            $table->date('fecha');
            $table->enum('nivel_peligro', ['BAJO', 'MEDIO', 'ALTO'])->default('MEDIO');
            $table->enum('estado', ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'])->default('PENDIENTE');
            $table->foreignId('superheroe_id')->constrained('heroes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};
