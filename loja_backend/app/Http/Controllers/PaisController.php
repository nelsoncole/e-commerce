<?php

namespace App\Http\Controllers;

use App\Models\Pais;
use Illuminate\Http\Request;

class PaisController extends Controller
{
    public function index()
    {
        return response()->json(Pais::with('provincias.municipios')->get());
    }

    public function show($id)
    {
        $pais = Pais::with('provincias.municipios')->findOrFail($id);
        return response()->json($pais);
    }
}
