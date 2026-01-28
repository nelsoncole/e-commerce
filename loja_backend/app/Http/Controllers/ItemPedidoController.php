<?php

namespace App\Http\Controllers;

use App\Models\ItemPedido;
use Illuminate\Http\Request;

class ItemPedidoController extends Controller
{
    // Listar todos os itens de um pedido
    public function index($pedidoId)
    {
        $itens = ItemPedido::with('produto')->where('pedido_id', $pedidoId)->get();
        return response()->json($itens);
    }

    // Remover item de um pedido (se permitido)
    public function destroy($id)
    {
        $item = ItemPedido::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item removido com sucesso']);
    }
}
