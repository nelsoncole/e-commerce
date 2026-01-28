<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determina se o usuário pode criar outro usuário.
     */
    public function create(User $user)
    {
        return $user->tipo === 'admin';
    }

    /**
     * Determina se o usuário pode atualizar outro usuário.
     */
    public function update(User $user, User $model)
    {
        return $user->tipo === 'admin';
    }

    /**
     * Determina se o usuário pode deletar outro usuário.
     */
    public function delete(User $user, User $model)
    {
        return $user->tipo === 'admin';
    }
}
