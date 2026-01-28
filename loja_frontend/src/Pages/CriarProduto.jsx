import React, { useState } from "react";
import axios from "axios";
import Menu from "../components/Menu";
import { useNavigate } from "react-router-dom";

export default function CriarProduto() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    stock: "",
  });

  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImagens(e) {
    const files = Array.from(e.target.files);

    if (files.length > 6) {
      setErro("Você pode enviar no máximo 6 imagens.");
      return;
    }

    setErro("");
    setImagens(files);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      /** 1️⃣ Criar produto */
      const produtoResponse = await axios.post(
        "/api/produtos",
        {
          nome: form.nome,
          descricao: form.descricao,
          preco: Number(form.preco),
          stock: Number(form.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const produtoId = produtoResponse.data.id;

      /** 2️⃣ Enviar imagens (uma por uma) */
      for (let i = 0; i < imagens.length; i++) {
        const formData = new FormData();
        formData.append("imagem", imagens[i]);
        formData.append("principal", i === 0); // primeira imagem é principal

        await axios.post(
          `/api/produtos/${produtoId}/imagens`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setSucesso("Produto criado com sucesso!");
      setForm({ nome: "", descricao: "", preco: "", stock: "" });
      setImagens([]);

      setTimeout(() => navigate("/vendedor/produtos"), 1500);
    } catch (error) {
      if (error.response?.data?.message) {
        setErro(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const mensagens = Object.values(error.response.data.errors)
          .flat()
          .join(" ");
        setErro(mensagens);
      } else {
        setErro("Erro ao criar produto.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Menu />

      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">
          Criar Produto
        </h1>

        {erro && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do produto
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Preço (Kz)
              </label>
              <input
                type="number"
                name="preco"
                value={form.preco}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          {/* 📷 Upload de imagens */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Imagens do produto (máx. 6)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagens}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              A primeira imagem será a principal
            </p>
          </div>

          {/* Preview */}
          {imagens.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {imagens.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="h-24 w-full object-cover rounded border"
                />
              ))}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Criar Produto"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/vendedor/produtos")}
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
