// src/pages/MeusProdutos.jsx
import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import axios from "axios";
import { Link } from "react-router-dom";
import { STORAGE_URL } from "../config";

export default function MeusProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Buscar produtos do usuário logado
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/produtos_meus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(res.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      alert("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Deletar produto
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      await axios.delete(`/api/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(produtos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto.");
    }
  };

  if (loading) return <p className="p-6">Carregando produtos...</p>;

  if (produtos.length === 0)
    return (
      <div>
        <Menu />
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Meus Produtos</h1>
          <p>Você ainda não tem produtos cadastrados.</p>
          <Link
            to="/vendedor/produtos/criar"
            className="mt-4 inline-block bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Criar Produto
          </Link>
        </div>
      </div>
    );

  return (
    <div>
      <Menu />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Meus Produtos</h1>
          <Link
            to="/vendedor/produtos/criar"
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Criar Produto
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <div key={produto.id} className="border rounded shadow p-4 bg-white">
              <img
                src={
                  produto.imagens?.length > 0
                    ? `${STORAGE_URL}/${produto.imagens[0].imagem}`
                    : "/placeholder.png"
                }
                alt={produto.nome}
                className="w-full h-40 object-contain rounded mb-2 bg-gray-100"
              />
              <h2 className="font-semibold text-lg">{produto.nome}</h2>
              <p className="text-gray-600">Kz {produto.preco.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Estoque: {produto.stock}</p>

              <div className="mt-2 flex justify-between">
                <Link
                  to={`/vendedor/produtos/${produto.id}/editar`}
                  className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(produto.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 text-sm"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
