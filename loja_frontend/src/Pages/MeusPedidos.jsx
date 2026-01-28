// src/pages/MeusPedidos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "../components/Menu";
import { STORAGE_URL } from "../config";

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar pedidos do usuário
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/pedidos_meus", { // <-- rota corrigida
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(res.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  if (loading) return <p className="p-6">Carregando pedidos...</p>;

  if (pedidos.length === 0)
    return (
      <div>
        <Menu />
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>
          <p>Você ainda não realizou nenhum pedido.</p>
        </div>
      </div>
    );

  return (
    <div>
      <Menu />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>

        {pedidos.map((pedido) => (
          <div key={pedido.id} className="border rounded shadow p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Pedido {pedido.id}</h2>
              <span
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  pedido.estado === "pendente"
                    ? "bg-yellow-200 text-yellow-800"
                    : pedido.estado === "pago"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {pedido.estado?.charAt(0).toUpperCase() + pedido.estado?.slice(1) || "Desconhecido"}
              </span>
            </div>

            <div className="space-y-2">
              {pedido.itens.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-2"
                >
                  <img
                    src={
                      item.produto?.imagens?.length > 0
                        ? `${STORAGE_URL}/${item.produto.imagens[0].imagem}`
                        : "/placeholder.png"
                    }
                    alt={item.produto?.nome || "Produto"}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.produto?.nome || "Produto"}</p>
                    <p className="text-gray-600">Quantidade: {item.quantidade}</p>
                  </div>
                  <p className="font-semibold">
                    Kz {(item.quantidade * item.preco_unitario).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4 font-bold text-lg">
              Total: Kz {pedido.total.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
