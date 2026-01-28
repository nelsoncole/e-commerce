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
        Schema::create('municipios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->foreignId('provincia_id')->constrained('provincias')->onDelete('cascade');
            $table->timestamps();
        });

        // Obtem os IDs das províncias pelo nome
        $provincias = DB::table('provincias')->pluck('id', 'nome');

        // Inserir municípios agrupados por província
        $municipios = [
            'Bengo' => ['Ambriz', 'Dande', 'Nambuangongo', 'Pango Aluquém', 'Dembos', 'Bula Atumba'],
            'Benguela' => ['Baía Farta', 'Balombo', 'Benguela', 'Bocoio', 'Caimbambo', 'Catumbela', 'Chongoroi', 'Cubal', 'Ganda', 'Lobito'],
            'Bié' => ['Andulo', 'Camacupa', 'Catabola', 'Chinguar', 'Chitembo', 'Cuemba', 'Cunhinga', 'Kuito', 'Nharea'],
            'Cabinda' => ['Belize', 'Buco-Zau', 'Cabinda', 'Cacongo'],
            'Cuando' => ['Cuito Cuanavale', 'Dima', 'Dirico', 'Luengue', 'Luiana', 'Mavinga', 'Mucusso', 'Rivungo', 'Xipundo'],
            'Cuanza Norte' => ['Ambaca', 'Banga', 'Bolongongo', 'Cambambe', 'Cazengo', 'Golungo Alto', 'Gonguembo', 'Lucala', 'Quiculungo', 'Samba Cajú'],
            'Cuanza Sul' => ['Amboim', 'Cassongue', 'Cela', 'Conda', 'Ebo', 'Libolo', 'Mussende', 'Porto Amboim', 'Quibala', 'Quilenda', 'Seles', 'Sumbe'],
            'Cubango' => ['Calai', 'Cuangar', 'Cuchi', 'Longa', 'Menongue', 'Nancova'],
            'Cunene' => ['Cahama', 'Cuanhama', 'Curoca', 'Cuvelai', 'Namacunde', 'Ombadja'],
            'Icolo e Bengo' => ['Bom Jesus do Cuanza', 'Cabiri', 'Caboledo', 'Calumbo', 'Catete', 'Quissama', 'Sequele'],
            'Huambo' => ['Bailundo', 'Cachiungo', 'Caála', 'Ekunha', 'Huambo', 'Longonjo', 'Londuimbali', 'Mungo', 'Chicala-Cholohanga', 'Tchindjenje', 'Ukuma'],
            'Huíla' => ['Caconda', 'Cacula', 'Caluquembe', 'Capelongo', 'Capunda Cavilongo', 'Chiange', 'Chibia', 'Chicomba', 'Chicungo', 'Chipindo', 'Chituto', 'Dongo', 'Galangue', 'Hoque', 'Humpata', 'Jamba', 'Lubango', 'Matala', 'Palanca', 'Quilengues', 'Quipungo', 'Viti-Vivali'],
            'Luanda' => ['Belas', 'Cacuaco', 'Cazenga', 'Luanda', 'Quilamba Quiaxi', 'Talatona', 'Viana'],
            'Lunda Norte' => ['Cambulo', 'Capenda-Camulemba', 'Caungula', 'Chitato', 'Cuango', 'Cuilo', 'Lóvua', 'Lubalo', 'Lucapa', 'Xá-Muteba'],
            'Lunda Sul' => ['Cacolo', 'Dala', 'Muconda', 'Saurimo'],
            'Malanje' => ['Cacuso', 'Calandula', 'Cambundi-Catembo', 'Cangandala', 'Caombo', 'Cuaba Nzoji', 'Luquembo', 'Malanje', 'Marimba', 'Massango', 'Mucari', 'Quela', 'Quirima'],
            'Moxico' => ['Alto Zambeze', 'Bundas', 'Camanongue', 'Léua', 'Luchazes', 'Moxico'],
            'Moxico Leste' => ['Caianda', 'Cameia', 'Cazombo', 'Lago-Dilolo', 'Lóvua do Zambeze', 'Luacano', 'Luau', 'Macondo', 'Nana Candundo'],
            'Namibe' => ['Bibala', 'Camucuio', 'Moçâmedes', 'Tômbua', 'Virei'],
            'Uíge' => ['Alto Cauale', 'Ambuila', 'Bembe', 'Buengas', 'Bungo', 'Damba', 'Milunga', 'Maquela do Zombo', 'Mucaba', 'Negage', 'Puri', 'Quimbele', 'Quipedro', 'Sanza Pombo', 'Songo', 'Uíge'],
            'Zaire' => ['Cuimba', 'Mbanza Kongo', 'Nóqui', 'Nzeto', 'Soyo', 'Tomboco'],
        ];

        // Inserir os dados
        foreach ($municipios as $provincia => $listaMunicipios) {
            $provinciaId = $provincias[$provincia] ?? null;
            if ($provinciaId) {
                foreach ($listaMunicipios as $municipio) {
                    DB::table('municipios')->insert([
                        'nome' => $municipio,
                        'provincia_id' => $provinciaId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('municipios');
    }
};
