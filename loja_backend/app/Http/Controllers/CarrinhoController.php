<?php

namespace App\Http\Controllers;

use App\Models\Carrinho;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CarrinhoController extends Controller
{
    // Listar itens do carrinho do usuário logado
    public function index()
    {
        $carrinho = Carrinho::with('produto.imagens')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($carrinho);
    }


    // Adicionar item ao carrinho
    public function store(Request $request)
    {
        $request->validate([
            'produto_id' => 'required|exists:produtos,id',
            'quantidade' => 'required|integer|min:1',
        ]);

        $produto = Produto::findOrFail($request->produto_id);

        // Verifica se já existe no carrinho
        $item = Carrinho::where('user_id', Auth::id())
                        ->where('produto_id', $produto->id)
                        ->first();

        if ($item) {
            // Atualiza a quantidade
            $item->quantidade += $request->quantidade;
            $item->save();
        } else {
            // Cria novo item
            $item = Carrinho::create([
                'user_id' => Auth::id(),
                'produto_id' => $produto->id,
                'quantidade' => $request->quantidade,
                'preco_unitario' => $produto->preco,
            ]);
        }

        return response()->json($item, 201);
    }

    // Atualizar quantidade de um item do carrinho
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantidade' => 'required|integer|min:1',
        ]);

        $item = Carrinho::where('user_id', Auth::id())->findOrFail($id);
        $item->quantidade = $request->quantidade;
        $item->save();

        return response()->json($item);
    }

    // Remover item do carrinho
    public function destroy($id)
    {
        $item = Carrinho::where('user_id', Auth::id())->findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item removido do carrinho com sucesso']);
    }
}
