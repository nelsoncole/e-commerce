<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagamentos', function (Blueprint $table) {
            $table->id();

            // Relacionamento com pedido
            $table->foreignId('pedido_id')
                  ->constrained('pedidos')
                  ->cascadeOnDelete();

            // Tipo de pagamento: multicaixa, referência, cartão, etc.
            $table->enum('tipo_pagamento', ['multicaixa_express', 'referencia'])
                  ->default('referencia');

            // Referência do pagamento, caso necessário
            $table->string('referencia')->nullable();

            // Estado do pagamento: pendente, aprovado, recusado
            $table->enum('estado', ['pendente', 'aprovado', 'recusado'])
                  ->default('pendente');

            // Valor total pago
            $table->decimal('valor', 12, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagamentos');
    }
};
