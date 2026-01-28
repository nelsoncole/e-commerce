<?php

namespace App\Http\Controllers;
use Illuminate\Auth\Access\AuthorizationException;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Listar todos os usuários
    public function index()
    {
        // Apenas admins podem listar usuários
        try {
            $this->authorize('create', User::class); // verifica policy
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'Você não tem permissão para ver usuários.'
            ], 403);
        }
        
        $usuarios = User::all(); // traz todos os usuários
        return response()->json($usuarios);
    }

    // Mostrar um usuário específico
    public function show($id)
    {
        // Apenas admins podem listar usuários
        try{
            $this->authorize('create', User::class); // apenas admin
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'Você não tem permissão para ver usuários.'
            ], 403);
        }

        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado.'], 404);
        }

        return response()->json($usuario);
    }

    // Criar novo usuário
    public function store(Request $request)
    {
        try{
            $this->authorize('create', User::class); // apenas admin
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'Você não tem permissão para criar usuários.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'tipo' => 'required|in:admin,vendedor,cliente',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tipo' => $request->tipo,
            'nivel_acesso' => 1,
        ]);

        return response()->json([
            'message' => 'Usuário cadastrado com sucesso.',
            'user' => $user,
        ], 201);
    }

     // Criar novo usuário comum
    public function store_comum(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tipo' => 'cliente',
            'nivel_acesso' => 1,
        ]);

        return response()->json([
            'message' => 'Usuário cadastrado com sucesso.',
            'user' => $user,
        ], 201);
    }

    // Atualizar usuário
    public function update(Request $request, $id)
    {
        $usuario = User::findOrFail($id);
        try{
            $this->authorize('update', $usuario); // apenas admin
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'Você não tem permissão para editar este usuário.'
            ], 403);
        }

        $usuarioLogadoId = Auth::id();

        if ($usuarioLogadoId == $id) {
            return response()->json([
                'message' => 'Você não pode editar seus próprios dados.'
            ], 403);
        }

        $usuario = User::find($id);
        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado.'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required','email', Rule::unique('users')->ignore($usuario->id)],
            'tipo' => 'required|in:admin,vendedor,cliente',
        ]);

        $usuario->update($validated);

        return response()->json(['message' => 'Usuário atualizado com sucesso.', 'user' => $usuario]);
    }

    // Apagar usuário
    public function destroy($id)
    {
        $usuario = User::findOrFail($id);
        // apenas admin
        try {
            $this->authorize('delete', $usuario); // verifica policy
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'Você não tem permissão para apagar este usuário.'
            ], 403);
        }

        $usuarioLogadoId = Auth::id();

        if ($usuarioLogadoId == $id) {
            return response()->json([
                'message' => 'Você não pode apagar a si mesmo.'
            ], 403);
        }

        $usuario = User::findOrFail($id);
        $usuario->delete();

        return response()->json(['message' => 'Usuário removido com sucesso.']);
    }
}
