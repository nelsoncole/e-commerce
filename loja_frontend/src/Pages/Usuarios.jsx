import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from '../components/Menu';
import { FaEdit, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null);
  const [modalAberta, setModalAberta] = useState(false);
  const [resposta, setResposta] = useState(null); // { tipo: 'sucesso' | 'erro', mensagem: string }

  const navigate = useNavigate();

  // Buscar usuários
    useEffect(() => {
    async function fetchUsuarios() {
      try {
        const token = localStorage.getItem('token'); // pega token do login
        const response = await axios.get('/api/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsuarios(response.data);
      } catch (error) {
        console.error(error);

        // Pega a mensagem do servidor, se houver
        if (error.response && error.response.data && error.response.data.message) {
          setErro(error.response.data.message);
        } else {
          setErro('Erro ao carregar usuários.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, []);

  const abrirModal = (usuario) => {
    setUsuarioParaDeletar(usuario);
    setModalAberta(true);
  };

  const fecharModal = () => {
    setUsuarioParaDeletar(null);
    setModalAberta(false);
  };

  const handleDelete = async () => {
    if (!usuarioParaDeletar) return;

    fecharModal(); // fecha modal imediatamente

    try {
        const token = localStorage.getItem('token'); // pega token salvo no login
        const respostaServidor = await axios.delete(`/api/usuarios/${usuarioParaDeletar.id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setUsuarios(usuarios.filter(u => u.id !== usuarioParaDeletar.id));
        setResposta({ tipo: 'sucesso', mensagem: respostaServidor.data.message });
    } catch (error) {
        console.error(error);
        const mensagem = error.response?.data?.message || 'Erro ao deletar usuário';
        setResposta({ tipo: 'erro', mensagem });
    }

    setTimeout(() => setResposta(null), 4000);
  };



  if (loading) return <p className="p-6 text-gray-600">Carregando usuários...</p>;
  if (erro) return <p className="p-6 text-red-600">{erro}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Menu />

      <div className="p-6 max-w-7xl mx-auto">

        {/* Alertas */}
        {resposta && (
          <div
            className={`flex items-center gap-2 mb-6 px-4 py-3 rounded shadow
              ${resposta.tipo === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}
          >
            {resposta.tipo === 'sucesso' ? <FaCheckCircle /> : <FaExclamationCircle />}
            <span>{resposta.mensagem}</span>
          </div>
        )}

        <h1 className="text-2xl font-bold text-blue-900 mb-4">Usuários</h1>

        {usuarios.length === 0 ? (
          <p className="text-gray-500">Nenhum usuário encontrado.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{usuario.id}</td>
                    <td className="px-4 py-2">{usuario.name}</td>
                    <td className="px-4 py-2">{usuario.email}</td>
                    <td className="px-4 py-2 capitalize">{usuario.tipo}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/usuarios/${usuario.id}/editar`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        onClick={() => abrirModal(usuario)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <FaTrash /> Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmação */}
      {modalAberta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirmar Exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja deletar o usuário <span className="font-semibold">{usuarioParaDeletar.name}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Sim, deletar
              </button>
              <button
                onClick={fecharModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
