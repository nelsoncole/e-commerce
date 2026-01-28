<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Policies\UserPolicy;
use App\Models\Produto;
use App\Policies\ProdutoPolicy;
use App\Models\Pedido;
use App\Policies\PedidoPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class, // para controlar criação, edição e exclusão de usuários
        Produto::class => ProdutoPolicy::class, // para controlar criação, edição e exclusão de produtos
        Pedido::class => PedidoPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Aqui você pode adicionar Gates globais se quiser
    }
}
