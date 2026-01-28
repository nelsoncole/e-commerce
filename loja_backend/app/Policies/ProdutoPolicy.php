<?php

namespace App\Policies;

use App\Models\Produto;
use App\Models\User;

class ProdutoPolicy
{
    // Criar produto → admin e vendedor
    public function create(User $user)
    {
        return in_array($user->tipo, ['admin', 'vendedor']);
    }

    // Atualizar produto
    public function update(User $user, Produto $produto)
    {
        // Admin pode tudo
        if ($user->tipo === 'admin') {
            return true;
        }

        // Vendedor só edita o próprio produto
        return $user->tipo === 'vendedor'
            && $produto->user_id === $user->id;
    }

    // Apagar produto
    public function delete(User $user, Produto $produto)
    {
        // Admin pode apagar qualquer produto
        if ($user->tipo === 'admin') {
            return true;
        }

        // Vendedor só apaga o próprio produto
        return $user->tipo === 'vendedor'
            && $produto->user_id === $user->id;
    }
}
