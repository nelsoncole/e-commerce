<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carrinhos', function (Blueprint $table) {
            $table->id();

            // Usuário que adicionou os itens
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            // Produto adicionado
            $table->foreignId('produto_id')
                  ->constrained('produtos')
                  ->cascadeOnDelete();

            $table->integer('quantidade')->default(1);
            $table->decimal('preco_unitario', 10, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carrinhos');
    }
};
