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
        Schema::create('enderecos', function (Blueprint $table) {
            $table->id();

            // Relacionamento com usuário
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            // Relacionamentos geográficos
            $table->foreignId('pais_id')
                  ->constrained('paises')
                  ->cascadeOnDelete();

            $table->foreignId('provincia_id')
                  ->constrained('provincias')
                  ->cascadeOnDelete();

            $table->foreignId('municipio_id')
                  ->constrained('municipios')
                  ->cascadeOnDelete();

            // Campos adicionais
            $table->string('bairro');
            $table->string('referencia')->nullable();
            $table->string('contacto');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enderecos');
    }
};
