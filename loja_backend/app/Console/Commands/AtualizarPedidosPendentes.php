<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pedido;

class AtualizarPedidosPendentes extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'pedidos:atualizar-pendentes';

    /**
     * The console command description.
     */
    protected $description = 'Atualiza todos os pedidos pendentes para pagos automaticamente';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $pedidosPendentes = Pedido::where('estado', 'pendente')->get();

        foreach ($pedidosPendentes as $pedido) {
            $pedido->estado = 'pago';
            $pedido->save();
        }

        $this->info('Pedidos pendentes atualizados para pagos: ' . $pedidosPendentes->count());
    }
}
