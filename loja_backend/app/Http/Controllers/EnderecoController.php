<?php

namespace App\Http\Controllers;

use App\Models\Endereco;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnderecoController extends Controller
{
    // Listar endereços do usuário logado
    public function index()
    {
        $enderecos = Endereco::with('pais', 'provincia', 'municipio')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($enderecos);
    }

    // Mostrar endereço específico do usuário
    public function show($id)
    {
        $endereco = Endereco::with('pais', 'provincia', 'municipio')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json($endereco);
    }

    // Criar endereço
    public function store(Request $request)
    {
        $request->validate([
            'pais_id' => 'required|exists:paises,id',
            'provincia_id' => 'required|exists:provincias,id',
            'municipio_id' => 'required|exists:municipios,id',
            'bairro' => 'required|string|max:255',
            'referencia' => 'nullable|string|max:255',
            'contacto' => 'required|string|max:50',
        ]);

        $endereco = Endereco::create([
            'user_id' => Auth::id(),
            'pais_id' => $request->pais_id,
            'provincia_id' => $request->provincia_id,
            'municipio_id' => $request->municipio_id,
            'bairro' => $request->bairro,
            'referencia' => $request->referencia,
            'contacto' => $request->contacto,
        ]);

        return response()->json($endereco, 201);
    }

    // Atualizar endereço (somente dono)
    public function update(Request $request, $id)
    {
        $endereco = Endereco::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'pais_id' => 'sometimes|exists:paises,id',
            'provincia_id' => 'sometimes|exists:provincias,id',
            'municipio_id' => 'sometimes|exists:municipios,id',
            'bairro' => 'sometimes|string|max:255',
            'referencia' => 'nullable|string|max:255',
            'contacto' => 'sometimes|string|max:50',
        ]);

        $endereco->update($request->only([
            'pais_id',
            'provincia_id',
            'municipio_id',
            'bairro',
            'referencia',
            'contacto',
        ]));

        return response()->json($endereco);
    }

    // Deletar endereço (somente dono)
    public function destroy($id)
    {
        $endereco = Endereco::where('user_id', Auth::id())->findOrFail($id);
        $endereco->delete();

        return response()->json(['message' => 'Endereço deletado com sucesso']);
    }
}
