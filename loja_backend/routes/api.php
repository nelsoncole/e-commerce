<?php

// php artisan serve
// php artisan schedule:work

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaisController;
use App\Http\Controllers\ProvinciaController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\ProdutoImagemController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ItemPedidoController;
use App\Http\Controllers\CarrinhoController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\EnderecoController;


Route::get('/paises', [PaisController::class, 'index']);
Route::get('/paises/{id}', [PaisController::class, 'show']);

Route::get('/provincias', [ProvinciaController::class, 'index']);
Route::get('/provincias/{id}', [ProvinciaController::class, 'show']);

Route::get('/municipios', [MunicipioController::class, 'index']);
Route::get('/municipios/{id}', [MunicipioController::class, 'show']);



Route::post('/cadastro', [UserController::class, 'store_comum']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/usuarios', [UserController::class, 'store']);
    Route::get('/usuarios', [UserController::class, 'index']);
    Route::get('/usuarios/{id}', [UserController::class, 'show']);
    Route::put('/usuarios/{id}', [UserController::class, 'update']);
    Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);
});


Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);



// ================== PRODUTOS ==================
// Listar todos os produtos
Route::get('/produtos', [ProdutoController::class, 'index']);
// Mostrar produto específico
Route::get('/produtos/{id}', [ProdutoController::class, 'show']);

// Rotas protegidas (apenas vendedores logados podem criar/editar/deletar)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/produtos', [ProdutoController::class, 'store']);
    Route::put('/produtos/{id}', [ProdutoController::class, 'update']);
    Route::delete('/produtos/{id}', [ProdutoController::class, 'destroy']);
    Route::get('/produtos_meus', [ProdutoController::class, 'meusProdutos']);

    // ================== IMAGENS ==================
    Route::post('/produtos/{produtoId}/imagens', [ProdutoImagemController::class, 'store']);
    Route::delete('/produtos/imagens/{id}', [ProdutoImagemController::class, 'destroy']);
});

// ================== PEDIDOS ==================
// Listar pedidos do usuário logado
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'show']);
    Route::get('/pedidos_meus', [PedidoController::class, 'meusPedidos']);

    Route::put('/pedidos/{id}', [PedidoController::class, 'update']);
    
    
    // ================== ITENS DE PEDIDO ==================
    Route::get('/pedidos/{pedidoId}/itens', [ItemPedidoController::class, 'index']);
    Route::delete('/pedidos/itens/{id}', [ItemPedidoController::class, 'destroy']);
});


// =================== CARRINHO ===============================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/carrinho', [CarrinhoController::class, 'index']);
    Route::post('/carrinho', [CarrinhoController::class, 'store']);
    Route::put('/carrinho/{id}', [CarrinhoController::class, 'update']);
    Route::delete('/carrinho/{id}', [CarrinhoController::class, 'destroy']);
});


// ================= Pagamento ============================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pagamentos', [PagamentoController::class, 'index']);
    Route::get('/pagamentos/{id}', [PagamentoController::class, 'show']);
    Route::post('/pagamentos', [PagamentoController::class, 'store']);
    Route::put('/pagamentos/{id}', [PagamentoController::class, 'update']);
    Route::delete('/pagamentos/{id}', [PagamentoController::class, 'destroy']);
});

// ================= ENDERECOS ===========================
// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/enderecos', [EnderecoController::class, 'index']);        // Listar todos endereços
    Route::get('/enderecos/{id}', [EnderecoController::class, 'show']);    // Mostrar endereço específico
    Route::post('/enderecos', [EnderecoController::class, 'store']);       // Criar endereço
    Route::put('/enderecos/{id}', [EnderecoController::class, 'update']);  // Atualizar endereço
    Route::delete('/enderecos/{id}', [EnderecoController::class, 'destroy']); // Deletar endereço
});







