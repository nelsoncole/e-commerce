<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Buscar o país Angola
        $pais = DB::table('paises')->where('nome', 'Angola')->first();

        Schema::create('provincias', function (Blueprint $table) {
            $table->id();
            $table->string('nome')->unique();
            $table->unsignedBigInteger('pais_id'); // relação com pais
            $table->timestamps();

            $table->foreign('pais_id')->references('id')->on('paises')->onDelete('cascade');
        });

        // Inserir todas as províncias de Angola
        $provincias = [
            'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando',
            'Cuanza Norte', 'Cuanza Sul', 'Cubango', 'Cunene',
            'Icolo e Bengo', 'Huambo', 'Huíla', 'Luanda',
            'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
            'Moxico Leste', 'Namibe', 'Uíge', 'Zaire'
        ];

        $inserts = array_map(fn($nome) => [
            'nome' => $nome,
            'pais_id' => $pais->id,
            'created_at' => now(),
            'updated_at' => now(),
        ], $provincias);

        DB::table('provincias')->insert($inserts);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provincias');
    }
};
