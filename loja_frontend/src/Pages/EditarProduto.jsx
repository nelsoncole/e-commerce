// src/pages/EditarProduto.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";

export default function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    stock: "",
  });
  const [alerta, setAlerta] = useState(null); // { tipo: 'success' | 'error', msg: string }

  const token = localStorage.getItem("token");

  // Função para mostrar alerta
  const mostrarAlerta = (msg, tipo = "success", duracao = 3000) => {
    setAlerta({ msg, tipo });
    setTimeout(() => setAlerta(null), duracao);
  };

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/produtos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduto(res.data);
        setForm({
          nome: res.data.nome || "",
          descricao: res.data.descricao || "",
          preco: res.data.preco || "",
          stock: res.data.stock || "",
        });
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        mostrarAlerta("Erro ao carregar produto.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/produtos/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mostrarAlerta("Produto atualizado com sucesso!", "success");
      setTimeout(() => navigate("/vendedor/produtos"), 1000);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      mostrarAlerta("Erro ao atualizar produto.", "error");
    }
  };

  if (loading) return <p className="p-6">Carregando produto...</p>;
  if (!produto) return <p className="p-6">Produto não encontrado.</p>;

  return (
    <div>
      <Menu />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6 relative">
        <h1 className="text-2xl font-bold mb-4">Editar Produto</h1>

        {/* ALERTA */}
        {alerta && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              alerta.tipo === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {alerta.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Preço (Kz)</label>
            <input
              type="number"
              name="preco"
              value={form.preco}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Estoque</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
