<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pais extends Model
{
    use HasFactory;

    // Define explicitamente o nome da tabela
    protected $table = 'paises';

    // Relacionamento: um país tem muitas províncias
    public function provincias()
    {
        return $this->hasMany(Provincia::class);
    }
}
