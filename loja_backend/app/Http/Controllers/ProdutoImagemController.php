<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\ProdutoImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProdutoImagemController extends Controller
{
    // Upload de imagens
    public function store(Request $request, $produtoId)
    {
        $produto = Produto::findOrFail($produtoId);

        // Validar limite de 6 imagens
        if ($produto->imagens()->count() >= 6) {
            return response()->json(['error' => 'Máximo de 6 imagens permitido'], 422);
        }

        $request->validate([
            'imagem' => 'required|image|max:4096', // max 4MB
        ]);

        $path = $request->file('imagem')->store('produtos', 'public');

        $imagem = ProdutoImagem::create([
            'produto_id' => $produto->id,
            'imagem' => $path,
        ]);

        return response()->json($imagem, 201);
    }

    // Remover imagem
    public function destroy($id)
    {
        $imagem = ProdutoImagem::findOrFail($id);
        Storage::disk('public')->delete($imagem->imagem);
        $imagem->delete();

        return response()->json(['message' => 'Imagem deletada com sucesso']);
    }
}
