<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\ProdutoImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProdutoController extends Controller
{
    // Listar todos os produtos
    public function index()
    {
        $produtos = Produto::with('imagens', 'vendedor')->get();
        return response()->json($produtos);
    }

    // Mostrar um produto específico
    public function show($id)
    {
        $produto = Produto::with('imagens', 'vendedor')->findOrFail($id);
        return response()->json($produto);
    }

    public function meusProdutos()
    {
        $produtos = Produto::with('imagens')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($produtos);
    }

    // Criar produto
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:150',
            'descricao' => 'nullable|string',
            'preco' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $produto = Produto::create([
            'nome' => $request->nome,
            'descricao' => $request->descricao,
            'preco' => $request->preco,
            'stock' => $request->stock,
            'user_id' => Auth::id(), // vendedor logado
        ]);

        return response()->json($produto, 201);
    }

    // Atualizar produto
    public function update(Request $request, $id)
    {
        $produto = Produto::findOrFail($id);

        $this->authorize('update', $produto); // verificar permissão

        $produto->update($request->only(['nome','descricao','preco','stock']));
        return response()->json($produto);
    }

    // Deletar produto
    public function destroy($id)
    {
        $produto = Produto::findOrFail($id);
        $this->authorize('delete', $produto); // verificar permissão
        $produto->delete();

        return response()->json(['message' => 'Produto deletado com sucesso']);
    }
}
