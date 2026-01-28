<?php

use Illuminate\Support\Facades\Route;

// Todas as rotas são redirecionadas para o React
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');


