import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from '../components/Menu';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { STORAGE_URL } from '../config';

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await axios.get('/api/produtos'); // sua API retorna lista de produtos
        setProdutos(resposta.data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setErro(error);
        setProdutos([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, []);

  if (carregando) return <p className="p-6 text-gray-600">Carregando produtos...</p>;
  if (erro) return <p className="p-6 text-red-600">Erro ao carregar produtos: {erro.message}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Menu />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Produtos em Destaque</h1>
        <p className="text-gray-600 mb-6">
          Confira nossos produtos mais populares e ofertas especiais.
        </p>

        {produtos.length === 0 ? (
          <p className="text-gray-500">Nenhum produto disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <Link 
                key={produto.id}
                to={`/produtos/${produto.id}`}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <div className="w-full h-48 rounded mb-2 bg-gray-100 flex items-center justify-center">
                  <img
                    src={
                      produto.imagens?.[0]?.imagem
                        ? `${STORAGE_URL}/${produto.imagens[0].imagem}`
                        : 'https://via.placeholder.com/300'
                    }
                    alt={produto.nome}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h2 className="font-semibold">{produto.nome}</h2>
                <p className="text-blue-800 font-bold">Kz {produto.preco.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
