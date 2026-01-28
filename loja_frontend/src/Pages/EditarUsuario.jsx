import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../components/Menu';

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    name: '',
    email: '',
    tipo: 'cliente',
  });
  const [carregando, setCarregando] = useState(true);
  const [resposta, setResposta] = useState(null); // mensagem do servidor
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = localStorage.getItem('token');
        const respostaServidor = await axios.get(`/api/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(respostaServidor.data);
      } catch (error) {
        console.error(error);
        setErro('Erro ao carregar usuário.');
      } finally {
        setCarregando(false);
      }
    }
    carregarUsuario();
  }, [id]);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const respostaServidor = await axios.put(`/api/usuarios/${id}`, usuario, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResposta({ tipo: 'sucesso', mensagem: respostaServidor.data.message });
      setTimeout(() => navigate('/admin/usuarios'), 4000); // volta à lista após 4s
    } catch (error) {
      console.error(error);
      const mensagem = error.response?.data?.message || 'Erro ao atualizar usuário';
      setResposta({ tipo: 'erro', mensagem });
    }
  };

  if (carregando) return <p className="p-6 text-gray-600">Carregando usuário...</p>;
  if (erro) return <p className="p-6 text-red-600">{erro}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Menu />

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Editar Usuário</h1>

        {resposta && (
          <div
            className={`mb-4 p-4 rounded ${
              resposta.tipo === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {resposta.mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={usuario.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Tipo</label>
            <select
              name="tipo"
              value={usuario.tipo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="cliente">Cliente</option>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          >
            Atualizar Usuário
          </button>
        </form>
      </div>
    </div>
  );
}
