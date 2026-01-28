import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Buscar endereço do usuário
  useEffect(() => {
    const fetchEndereco = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/enderecos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Considerando que o usuário tem apenas um endereço
        setEndereco(res.data[0] || null);
      } catch (error) {
        console.error("Erro ao carregar endereço:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEndereco();
  }, [token]);

  if (loading) return <p className="p-6">Carregando perfil...</p>;

  return (
    <div>
      <Menu />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6 space-y-4">
        <h1 className="text-2xl font-bold">Perfil do Usuário</h1>
        <p><strong>Nome:</strong> {usuario.name}</p>
        <p><strong>Email:</strong> {usuario.email}</p>

        {/* Endereço */}
        {endereco ? (
          <div className="border p-4 rounded bg-gray-50">
            <h2 className="font-semibold text-lg mb-2">Endereço</h2>
            <p><strong>País:</strong> {endereco.pais?.nome}</p>
            <p><strong>Província:</strong> {endereco.provincia?.nome}</p>
            <p><strong>Município:</strong> {endereco.municipio?.nome}</p>
            <p><strong>Bairro:</strong> {endereco.bairro}</p>
            {endereco.referencia && <p><strong>Referência:</strong> {endereco.referencia}</p>}
            <p><strong>Contacto:</strong> {endereco.contacto}</p>

            <button
              onClick={() => navigate(`/endereco/${endereco.id}/editar`)}
              className="mt-2 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
            >
              Editar Endereço
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/endereco/criar")}
            className="mt-4 bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Adicionar Endereço
          </button>
        )}
      </div>
    </div>
  );
}
