import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Salvar token e dados do usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(user));

      // Redirecionar para home
      navigate('/');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setErro(err.response?.data?.message || 'Credenciais inválidas');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">Login</h1>

        {erro && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded text-white font-semibold ${
              carregando ? 'bg-gray-400' : 'bg-blue-900 hover:bg-blue-700'
            }`}
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Não tem conta? <a href="/cadastro" className="text-blue-700 hover:underline">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
