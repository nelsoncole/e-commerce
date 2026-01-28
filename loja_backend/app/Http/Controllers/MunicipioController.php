<?php

namespace App\Http\Controllers;

use App\Models\Municipio;
use Illuminate\Http\Request;

class MunicipioController extends Controller
{
    // Listar municípios, opcionalmente filtrando pela província
    public function index(Request $request)
    {
        $query = Municipio::query();

        if ($request->has('provincia_id')) {
            $query->where('provincia_id', $request->provincia_id);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $municipio = Municipio::findOrFail($id);
        return response()->json($municipio);
    }
}
