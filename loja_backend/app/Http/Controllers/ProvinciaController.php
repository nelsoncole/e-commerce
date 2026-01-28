<?php

namespace App\Http\Controllers;

use App\Models\Provincia;
use Illuminate\Http\Request;

class ProvinciaController extends Controller
{
    // Listar províncias, opcionalmente filtrando pelo país
    public function index(Request $request)
    {
        $query = Provincia::query();

        if ($request->has('pais_id')) {
            $query->where('pais_id', $request->pais_id);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $provincia = Provincia::with('municipios')->findOrFail($id);
        return response()->json($provincia);
    }
}
