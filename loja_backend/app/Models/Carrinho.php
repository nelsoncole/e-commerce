<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carrinho extends Model
{
    use HasFactory;

    protected $table = 'carrinhos';

    protected $fillable = [
        'user_id',
        'produto_id',
        'quantidade',
        'preco_unitario',
    ];

    // Relação com usuário
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relação com produto
    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }
}
