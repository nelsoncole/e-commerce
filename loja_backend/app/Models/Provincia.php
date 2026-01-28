<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provincia extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'pais_id'];

    // Relação com país
    public function pais()
    {
        return $this->belongsTo(Pais::class);
    }

    // Relação com municípios
    public function municipios()
    {
        return $this->hasMany(Municipio::class);
    }
}
