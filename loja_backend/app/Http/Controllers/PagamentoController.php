<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
use Illuminate\Http\Request;

class PagamentoController extends Controller
{
    // Listar todos os pagamentos
    public function index()
    {
        $pagamentos = Pagamento::with('pedido')->get();
        return response()->json($pagamentos);
    }

    // Mostrar pagamento específico
    public function show($id)
    {
        $pagamento = Pagamento::with('pedido')->findOrFail($id);
        return response()->json($pagamento);
    }

    // Criar um novo pagamento
    public function store(Request $request)
    {
        $request->validate([
            'pedido_id' => 'required|exists:pedidos,id',
            'tipo_pagamento' => 'required|in:multicaixa_express,referencia',
            'referencia' => 'nullable|string',
            'valor' => 'required|numeric|min:0',
        ]);

        $pagamento = Pagamento::create([
            'pedido_id' => $request->pedido_id,
            'tipo_pagamento' => $request->tipo_pagamento,
            'referencia' => $request->referencia,
            'valor' => $request->valor,
            'estado' => 'pendente', // estado inicial
        ]);

        return response()->json($pagamento, 201);
    }

    // Atualizar estado do pagamento (ex: aprovar ou recusar)
    public function update(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendente,aprovado,recusado',
        ]);

        $pagamento = Pagamento::findOrFail($id);
        $pagamento->estado = $request->estado;
        $pagamento->save();

        return response()->json($pagamento);
    }

    // Deletar pagamento
    public function destroy($id)
    {
        $pagamento = Pagamento::findOrFail($id);
        $pagamento->delete();

        return response()->json(['message' => 'Pagamento removido com sucesso']);
    }
}
