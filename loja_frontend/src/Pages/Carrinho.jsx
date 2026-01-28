import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Menu from "../components/Menu";
import { STORAGE_URL } from "../config";
import { CarrinhoContext } from "../context/CarrinhoContext";

export default function Carrinho() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const [modalRemoverAberto, setModalRemoverAberto] = useState(false);
  const [itemParaRemover, setItemParaRemover] = useState(null);

  // 🔹 Pagamento
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState(null);
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  // 🔹 Alerta
  const [alerta, setAlerta] = useState({
    aberto: false,
    sucesso: true,
    mensagem: ""
  });

  const { atualizarCarrinho } = useContext(CarrinhoContext);

  // ------------------ Buscar carrinho ------------------
  const fetchCarrinho = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/carrinho", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItens(res.data);
      setItensSelecionados(res.data.map(i => i.id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarrinho();
  }, []);

  // ------------------ Atualizar quantidade ------------------
  const atualizarQuantidade = async (itemId, novaQtd) => {
    if (novaQtd < 1) return;
    try {
      setAtualizando(true);
      const token = localStorage.getItem("token");
      await axios.put(`/api/carrinho/${itemId}`, { quantidade: novaQtd }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItens(itens.map(i => i.id === itemId ? { ...i, quantidade: novaQtd } : i));
      await atualizarCarrinho();
    } finally {
      setAtualizando(false);
    }
  };

  // ------------------ Remover item ------------------
  const removerItem = async () => {
    if (!itemParaRemover) return;
    try {
      setAtualizando(true);
      const token = localStorage.getItem("token");
      await axios.delete(`/api/carrinho/${itemParaRemover.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItens(itens.filter(i => i.id !== itemParaRemover.id));
      setItensSelecionados(itensSelecionados.filter(id => id !== itemParaRemover.id));
      await atualizarCarrinho();
    } finally {
      setAtualizando(false);
      setModalRemoverAberto(false);
    }
  };

  // ------------------ Total ------------------
  const totalSelecionados = itens
    .filter(i => itensSelecionados.includes(i.id))
    .reduce((acc, item) => acc + item.quantidade * item.preco_unitario, 0);

  // ------------------ Finalizar compra ------------------
  const finalizarCompra = () => {
    if (itensSelecionados.length === 0) {
      setAlerta({
        aberto: true,
        sucesso: false,
        mensagem: "Selecione pelo menos um produto."
      });
      return;
    }
    setModalPagamentoAberto(true);
  };

  // ------------------ PAGAR ------------------
  const pagar = async () => {
    try {
      setLoadingPagamento(true);
      const token = localStorage.getItem("token");

      const itensPedido = itens
        .filter(i => itensSelecionados.includes(i.id))
        .map(i => ({
          produto_id: i.produto.id,
          quantidade: i.quantidade
        }));

      // 1️⃣ Criar pedido
      const pedidoRes = await axios.post(
        "/api/pedidos",
        { itens: itensPedido },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const pedido = pedidoRes.data;

      // 2️⃣ Criar pagamento
      await axios.post(
        "/api/pagamentos",
        {
          pedido_id: pedido.id,
          tipo_pagamento:
            metodoPagamento === "Multicaixa Express"
              ? "multicaixa_express"
              : "referencia",
          valor: pedido.total
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3️⃣ Limpar carrinho
      for (const id of itensSelecionados) {
        await axios.delete(`/api/carrinho/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await atualizarCarrinho();
      await fetchCarrinho();

      setAlerta({
        aberto: true,
        sucesso: true,
        mensagem: `Pedido #${pedido.id} criado com sucesso.\nTotal: Kz ${pedido.total.toLocaleString()}`
      });

      setModalPagamentoAberto(false);
      setMetodoPagamento(null);

    } catch (error) {
      console.error(error);
      setAlerta({
        aberto: true,
        sucesso: false,
        mensagem: "Erro ao finalizar compra."
      });
    } finally {
      setLoadingPagamento(false);
    }
  };

  if (loading) return <p className="p-6">Carregando carrinho...</p>;

  return (
    <div>
      <Menu />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Meu Carrinho</h1>

        {itens.map(item => (
          <div key={item.id} className="flex justify-between items-center border p-4 rounded mb-3">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={itensSelecionados.includes(item.id)}
                onChange={() =>
                  setItensSelecionados(
                    itensSelecionados.includes(item.id)
                      ? itensSelecionados.filter(id => id !== item.id)
                      : [...itensSelecionados, item.id]
                  )
                }
              />
              <img
                src={item.produto.imagens?.[0]
                  ? `${STORAGE_URL}/${item.produto.imagens[0].imagem}`
                  : "/placeholder.png"}
                className="w-20 h-20 rounded object-cover"
              />
              <div>
                <p className="font-semibold">{item.produto.nome}</p>
                <p>Kz {item.preco_unitario.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantidade}
                disabled={atualizando}
                onChange={e => atualizarQuantidade(item.id, Number(e.target.value))}
                className="w-16 border rounded px-2 py-1"
              />
              <p className="font-bold">
                Kz {(item.quantidade * item.preco_unitario).toLocaleString()}
              </p>
              <button
                onClick={() => {
                  setItemParaRemover(item);
                  setModalRemoverAberto(true);
                }}
                className="text-red-600 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end items-center gap-4 mt-6">
          <p className="text-xl font-bold">
            Total: Kz {totalSelecionados.toLocaleString()}
          </p>
          <button
            onClick={finalizarCompra}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500"
          >
            Finalizar Compra
          </button>
        </div>
      </div>

      {/* ------------------ Modal Pagamento ------------------ */}
      {modalPagamentoAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Método de pagamento</h2>

            <button
              onClick={() => setMetodoPagamento("Multicaixa Express")}
              className={`w-full mb-2 py-2 rounded ${
                metodoPagamento === "Multicaixa Express"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Multicaixa Express
            </button>

            <button
              onClick={() => setMetodoPagamento("Referência")}
              className={`w-full py-2 rounded ${
                metodoPagamento === "Referência"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Referência
            </button>

            {loadingPagamento && (
              <div className="mt-4 flex items-center gap-2">
                <div className="w-5 h-5 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Processando pagamento...</span>
              </div>
            )}

            <button
              onClick={pagar}
              disabled={!metodoPagamento || loadingPagamento}
              className="mt-4 w-full bg-blue-900 text-white py-2 rounded"
            >
              Confirmar Pagamento
            </button>
          </div>
        </div>
      )}

      {/* ------------------ Alerta ------------------ */}
      {alerta.aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className={`bg-white p-6 rounded w-96 border-t-4 ${
            alerta.sucesso ? "border-green-600" : "border-red-600"
          }`}>
            <h2 className="text-xl font-bold mb-3">
              {alerta.sucesso ? "Sucesso" : "Erro"}
            </h2>
            <p className="whitespace-pre-line mb-4">{alerta.mensagem}</p>
            <button
              onClick={() => setAlerta({ ...alerta, aberto: false })}
              className="w-full bg-blue-900 text-white py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ------------------ Modal Remover ------------------ */}
      {modalRemoverAberto && itemParaRemover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <p className="mb-4">
              Remover <strong>{itemParaRemover.produto.nome}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setModalRemoverAberto(false)}>Cancelar</button>
              <button onClick={removerItem} className="text-red-600">Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
