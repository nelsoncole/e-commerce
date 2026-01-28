<?php

namespace App\Policies;

use App\Models\Pedido;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PedidoPolicy
{
    use HandlesAuthorization;

    /**
     * Verifica se o usuário pode atualizar o estado do pedido
     */
    public function updateEstado(User $user, Pedido $pedido)
    {
        // Usuário pode atualizar se for vendedor de algum produto do pedido
        return $pedido->itens->contains(function ($item) use ($user) {
            return $item->produto->user_id === $user->id;
        });
    }
}
