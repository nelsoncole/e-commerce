<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pagamento extends Model
{
    use HasFactory;

    protected $table = 'pagamentos';

    protected $fillable = [
        'pedido_id',
        'tipo_pagamento',
        'referencia',
        'estado',
        'valor',
    ];

    // Relação com o pedido
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }
}
