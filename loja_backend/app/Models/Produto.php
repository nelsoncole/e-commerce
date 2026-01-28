<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $table = 'produtos';

    protected $fillable = [
        'nome',
        'descricao',
        'preco',
        'stock',
        'user_id',
    ];

    // Produto pertence a um vendedor (user)
    public function vendedor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Produto tem várias imagens (máx. 6)
    public function imagens()
    {
        return $this->hasMany(ProdutoImagem::class);
    }

    // Imagem principal do produto
    public function imagemPrincipal()
    {
        return $this->hasOne(ProdutoImagem::class)->where('principal', true);
    }

    // Produto pode estar em vários itens de pedido
    public function itensPedido()
    {
        return $this->hasMany(ItemPedido::class);
    }
}
