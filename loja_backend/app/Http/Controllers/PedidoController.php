<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\ItemPedido;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    // Listar pedidos do utilizador logado
    /*public function index()
    {
        $pedidos = Pedido::with('itens.produto.imagens')->where('user_id', Auth::id())->get();
        return response()->json($pedidos);
    }*/

    public function index()
    {
        $vendedorId = Auth::id();

        $pedidos = Pedido::whereHas('itens.produto', function ($query) use ($vendedorId) {
            $query->where('user_id', $vendedorId); // só produtos do vendedor logado
        })
        ->with(['itens' => function ($q) use ($vendedorId) {
            $q->whereHas('produto', function ($q2) use ($vendedorId) {
                $q2->where('user_id', $vendedorId);
            })->with('produto.imagens');
        }])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($pedidos);
    }


    public function meusPedidos()
    {
        $pedidos = Pedido::with('itens.produto.imagens') // carrega itens e produtos relacionados
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pedidos);
    }

    // Criar pedido
    public function store(Request $request)
    {
        $request->validate([
            'itens' => 'required|array',
            'itens.*.produto_id' => 'required|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $total = 0;

            // Criar pedido
            $pedido = Pedido::create([
                'user_id' => Auth::id(),
                'total' => 0, // atualizado depois
                'estado' => 'pendente',
            ]);

            // Adicionar itens
            foreach ($request->itens as $item) {
                $produto = Produto::findOrFail($item['produto_id']);

                if ($produto->stock < $item['quantidade']) {
                    DB::rollBack();
                    return response()->json(['error' => "Produto {$produto->nome} sem stock suficiente"], 422);
                }

                ItemPedido::create([
                    'pedido_id' => $pedido->id,
                    'produto_id' => $produto->id,
                    'quantidade' => $item['quantidade'],
                    'preco_unitario' => $produto->preco,
                ]);

                // Atualizar stock
                $produto->decrement('stock', $item['quantidade']);
                $total += $produto->preco * $item['quantidade'];
            }

            $pedido->update(['total' => $total]);

            DB::commit();
            return response()->json($pedido->load('itens.produto'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Mostrar pedido
    public function show($id)
    {
        $pedido = Pedido::with('itens.produto')->where('user_id', Auth::id())->findOrFail($id);
        return response()->json($pedido);
    }

    // Atualizar estado do pedido (apenas vendedor do produto)
    public function update(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendente,pago,enviado,recebido,cancelado',
        ]);

        $pedido = Pedido::with('itens.produto')->findOrFail($id);

        // Verificar se o usuário é vendedor de algum dos produtos do pedido
        $vendedorId = Auth::id();
        $temProdutoDoUsuario = $pedido->itens->contains(function ($item) use ($vendedorId) {
            return $item->produto->user_id == $vendedorId;
        });

        if (!$temProdutoDoUsuario) {
            return response()->json(['error' => 'Não autorizado a atualizar este pedido'], 403);
        }

        $pedido->estado = $request->estado;
        $pedido->save();

        return response()->json($pedido);
    }

}
