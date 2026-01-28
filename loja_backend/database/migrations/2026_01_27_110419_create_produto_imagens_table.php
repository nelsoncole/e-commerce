<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produto_imagens', function (Blueprint $table) {
            $table->id();

            $table->foreignId('produto_id')
                  ->constrained('produtos')
                  ->cascadeOnDelete();

            $table->string('imagem'); // caminho ou nome do ficheiro

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produto_imagens');
    }
};
