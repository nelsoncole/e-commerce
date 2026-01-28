// src/pages/ProdutoDetalhe.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Menu from "../components/Menu";
import { STORAGE_URL } from "../config";
import { CarrinhoContext } from "../context/CarrinhoContext";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [indiceImagem, setIndiceImagem] = useState(0);

  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState(null);

  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const [loadingCarrinho, setLoadingCarrinho] = useState(false);
  const [feedbackCarrinho, setFeedbackCarrinho] = useState("");

  // Contexto do carrinho
  const { atualizarCarrinho } = useContext(CarrinhoContext);

  const [loadingPagamento, setLoadingPagamento] = useState(false);

  const [alertaPagamento, setAlertaPagamento] = useState({
    aberto: false,
    sucesso: true,
    mensagem: ""
  });


  // Carregar produto
  useEffect(() => {
    axios.get(`/api/produtos/${id}`).then(res => {
      setProduto(res.data);
      setIndiceImagem(0);
      setQuantidade(1);
    });
  }, [id]);

  if (!produto) return <p className="p-6">Carregando...</p>;

  const totalImagens = produto.imagens?.length || 0;
  const imagemAtual = totalImagens > 0
    ? `${STORAGE_URL}/${produto.imagens[indiceImagem].imagem}`
    : "/placeholder.png";

  const trocarImagem = (direcao) => {
    if (totalImagens <= 1) return;
    setIndiceImagem((direcao === "next")
      ? (indiceImagem + 1) % totalImagens
      : (indiceImagem - 1 + totalImagens) % totalImagens
    );
  };

  // ------------------ Pagamento ------------------
  const abrirModalPagamento = () => setModalPagamentoAberto(true);
  const fecharModalPagamento = () => {
    setModalPagamentoAberto(false);
    setMetodoPagamento(null);
  };

  // Finalizar compra e criar pagamento
  const pagar = async () => {
    if (!metodoPagamento) return;

    try {
      setLoadingPagamento(true);
      const token = localStorage.getItem("token");

      // 1 Criar pedido
      const pedidoRes = await axios.post(
        "/api/pedidos",
        {
          itens: [{ produto_id: produto.id, quantidade }]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const pedido = pedidoRes.data;

      // 2️ Criar pagamento
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

      // ALERTA DE SUCESSO
      setAlertaPagamento({
        aberto: true,
        sucesso: true,
        mensagem: `Pedido #${pedido.id} criado com sucesso.\nTotal: Kz ${pedido.total.toLocaleString()}`
      });

      await atualizarCarrinho();
      fecharModalPagamento();

    } catch (error) {
      console.error(error);

      // ALERTA DE ERRO
      setAlertaPagamento({
        aberto: true,
        sucesso: false,
        mensagem: "Erro ao finalizar pedido ou criar pagamento."
      });
    } finally {
      setLoadingPagamento(false);
    }
  };


  // ------------------ Carrinho ------------------
  const abrirModalCarrinho = () => setModalCarrinhoAberto(true);
  const fecharModalCarrinho = () => {
    setModalCarrinhoAberto(false);
    setQuantidade(1);
  };

  const adicionarAoCarrinho = async () => {
    if (quantidade < 1) {
      setFeedbackCarrinho("Quantidade inválida.");
      return;
    }

    try {
      setLoadingCarrinho(true);
      const token = localStorage.getItem("token");

      // Envia para API
      await axios.post(
        '/api/carrinho',
        { produto_id: produto.id, quantidade },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza o contexto do carrinho (Menu atualiza automaticamente)
      await atualizarCarrinho();

      setFeedbackCarrinho(`Produto adicionado ao carrinho: ${quantidade} unidade(s).`);
      setTimeout(() => {
        setFeedbackCarrinho("");
        fecharModalCarrinho();
      }, 1500);
    } catch (error) {
      console.error(error);
      setFeedbackCarrinho("Erro ao adicionar ao carrinho. Tente novamente.");
      setTimeout(() => setFeedbackCarrinho(""), 2500);
    } finally {
      setLoadingCarrinho(false);
    }
  };

  // ------------------ Handle Quantidade ------------------
  const handleQuantidadeChange = (value) => {
    if (value < 1) value = 1;
    if (value > produto.stock) value = produto.stock;
    setQuantidade(value);
  };

  return (
    <div>
      <Menu />

      <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Esquerda */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{produto.nome}</h1>
            <p className="text-gray-700">{produto.descricao}</p>
            <p className="text-blue-800 font-bold text-2xl">Kz {produto.preco.toLocaleString()}</p>
          </div>

          {/* Centro: carrossel */}
          <div className="relative w-full h-96 bg-gray-100 rounded flex items-center justify-center">
            <img
              src={imagemAtual}
              alt={produto.nome}
              className="max-h-full max-w-full object-contain rounded"
            />
            {totalImagens > 1 && (
              <>
                <button
                  onClick={() => trocarImagem("prev")}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white shadow p-3 rounded-full hover:bg-gray-100 transition text-2xl font-bold"
                >
                  ❮
                </button>
                <button
                  onClick={() => trocarImagem("next")}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white shadow p-3 rounded-full hover:bg-gray-100 transition text-2xl font-bold"
                >
                  ❯
                </button>
              </>
            )}
          </div>

          {/* Direita: ações */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={abrirModalPagamento}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-500 transition font-semibold"
            >
              Comprar Agora
            </button>
            <button
              onClick={abrirModalCarrinho}
              className="bg-blue-900 text-white px-6 py-3 rounded hover:bg-blue-800 transition font-semibold"
            >
              Adicionar ao Carrinho
            </button>
          </div>

        </div>
      </div>

      {/* ------------------ Modal Pagamento ------------------ */}
      {modalPagamentoAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6 relative">

            <button
              onClick={fecharModalPagamento}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Escolha o método de pagamento</h2>

            <label className="block mb-2">
              Quantidade:
              <input
                type="number"
                min={1}
                max={produto.stock}
                value={quantidade}
                onChange={(e) => handleQuantidadeChange(Number(e.target.value))}
                className="w-full mt-1 border rounded px-2 py-1"
              />
            </label>

            <p className="mb-4">
              Total:
              <span className="font-semibold">
                {" "}Kz {(produto.preco * quantidade).toLocaleString()}
              </span>
            </p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setMetodoPagamento("Multicaixa Express")}
                className={`px-4 py-2 rounded border ${
                  metodoPagamento === "Multicaixa Express"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                Multicaixa Express
              </button>

              <button
                onClick={() => setMetodoPagamento("Referência")}
                className={`px-4 py-2 rounded border ${
                  metodoPagamento === "Referência"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                Referência
              </button>
            </div>

            {/* 🔄 PROGRESS BAR */}
            {loadingPagamento && (
              <div className="mt-4 flex items-center gap-3">
                <div className="w-5 h-5 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">
                  Processando pagamento...
                </span>
              </div>
            )}

            <button
              onClick={pagar}
              disabled={!metodoPagamento || loadingPagamento}
              className="mt-4 w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition disabled:opacity-50"
            >
              Confirmar Pagamento
            </button>
          </div>
        </div>
      )}

      {/* ------------------ Modal Carrinho ------------------ */}
      {modalCarrinhoAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-80 p-6 relative">
            <button
              onClick={fecharModalCarrinho}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Adicionar ao Carrinho</h2>

            <label className="block mb-2">
              Quantidade:
              <input
                type="number"
                min={1}
                max={produto.stock}
                value={quantidade}
                onChange={(e) => handleQuantidadeChange(Number(e.target.value))}
                className="w-full mt-1 border rounded px-2 py-1"
              />
            </label>

            <button
              onClick={adicionarAoCarrinho}
              disabled={loadingCarrinho}
              className="mt-4 w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loadingCarrinho ? "Adicionando..." : "Concluir"}
            </button>

            {feedbackCarrinho && (
              <p className="mt-3 p-2 bg-green-100 text-green-700 rounded border border-green-300">
                {feedbackCarrinho}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* ------------------ Alerta Pagamento ------------------ */}
      {alertaPagamento.aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            className={`bg-white w-96 p-6 rounded shadow-lg border-t-4 ${
              alertaPagamento.sucesso
                ? "border-green-600"
                : "border-red-600"
            }`}
          >
            <h2 className="text-xl font-bold mb-3">
              {alertaPagamento.sucesso ? "Pagamento iniciado" : "Erro no pagamento"}
            </h2>

            <p className="mb-4 whitespace-pre-line">
              {alertaPagamento.mensagem}
            </p>

            <button
              onClick={() =>
                setAlertaPagamento({ ...alertaPagamento, aberto: false })
              }
              className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
