// src/pages/PedidosVendedor.jsx
import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import axios from "axios";
import { STORAGE_URL } from "../config";

export default function PedidosVendedor() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Buscar pedidos do vendedor
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/pedidos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(res.data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      alert("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Alterar estado do pedido
  const handleEstadoChange = async (pedidoId, novoEstado) => {
    try {
      await axios.put(
        `/api/pedidos/${pedidoId}`,
        { estado: novoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId ? { ...p, estado: novoEstado } : p
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar estado:", error);
      alert("Erro ao atualizar estado do pedido.");
    }
  };

  if (loading) return <p className="p-6">Carregando pedidos...</p>;

  if (pedidos.length === 0)
    return (
      <div>
        <Menu />
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
          <p>Você ainda não possui pedidos relacionados aos seus produtos.</p>
        </div>
      </div>
    );

  return (
    <div>
      <Menu />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Pedidos do Vendedor</h1>

        {pedidos.map((pedido) => {
          // Checar se algum produto está sem stock
          const semStock = pedido.itens.some(
            (item) => item.produto.stock < item.quantidade
          );

          return (
            <div
              key={pedido.id}
              className="border rounded shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Pedido {pedido.id}</h2>
                <p className="font-semibold">
                  Estado:{" "}
                  <span className={`capitalize ${pedido.estado === "pago" ? "text-green-600" : pedido.estado === "pendente" ? "text-yellow-600" : pedido.estado === "cancelado" ? "text-red-600" : "text-blue-600"}`}>
                    {pedido.estado}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                {pedido.itens.map((item) => (
                  <div
                    key={item.produto.id}
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
                      <p className="font-semibold">{item.produto.nome}</p>
                      <p className="text-gray-600">
                        Quantidade: {item.quantidade}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Estoque atual: {item.produto.stock}
                      </p>
                    </div>
                    <p className="font-semibold">
                      Kz {(item.quantidade * item.preco_unitario).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="font-bold text-lg">
                  Total: Kz {pedido.total.toLocaleString()}
                </div>

                <div className="flex gap-2">
                  {/* Botões estratégicos */}
                  {pedido.estado === "pago" && !semStock && (
                    <button
                      onClick={() => handleEstadoChange(pedido.id, "enviado")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Enviar Produto
                    </button>
                  )}
                  {pedido.estado === "pago" && semStock && (
                    <button
                      onClick={() => handleEstadoChange(pedido.id, "cancelado")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                    >
                      Reembolsar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
