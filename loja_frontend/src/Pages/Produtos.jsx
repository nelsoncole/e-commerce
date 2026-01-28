import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Menu from "../components/Menu";
import { STORAGE_URL } from '../config';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  useEffect(() => {
    axios.get("/api/produtos").then(res => setProdutos(res.data));
  }, []);

  return (
    <div>
      <Menu />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Todos os Produtos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produtos.map(p => (
            <Link
              key={p.id}
              to={`/produtos/${p.id}`}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <div className="w-full h-48 rounded mb-2 bg-gray-100 flex items-center justify-center">
                <img
                  src={p.imagens?.[0]?.imagem ? `${STORAGE_URL}/${p.imagens[0].imagem}` : "/placeholder.png"}
                  alt={p.nome}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h2 className="font-semibold">{p.nome}</h2>
              <p className="text-blue-800 font-bold">Kz {p.preco.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
