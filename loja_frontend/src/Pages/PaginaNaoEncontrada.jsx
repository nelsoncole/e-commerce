import React from "react";
import { Link } from "react-router-dom";

export default function PaginaNaoEncontrada() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="mb-4">Página não encontrada.</p>
      <Link to="/" className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700">Voltar para Home</Link>
    </div>
  );
}
