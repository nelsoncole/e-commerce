import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Menu from "../components/Menu";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    try {
      const response = await axios.post("/api/cadastro", { name: nome, email, password: senha });
      setSucesso("Cadastro realizado com sucesso! Redirecionando para login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Erro ao cadastrar usuário");
    }
  };

  return (
    <div>
      <Menu />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleCadastro} className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Cadastro</h1>

          {erro && <p className="text-red-600 mb-4">{erro}</p>}
          {sucesso && <p className="text-green-600 mb-4">{sucesso}</p>}

          <input
            type="text"
            placeholder="Nome completo"
            className="w-full p-2 mb-4 border rounded"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 mb-4 border rounded"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-700">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
