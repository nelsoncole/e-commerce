<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedidos';

    protected $fillable = [
        'user_id',
        'total',
        'estado',
    ];

    // Pedido pertence a um utilizador
    public function utilizador()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Pedido tem vários itens
    public function itens()
    {
        return $this->hasMany(ItemPedido::class);
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }

}
