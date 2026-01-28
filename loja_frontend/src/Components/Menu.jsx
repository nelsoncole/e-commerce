// src/components/Menu.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaSignOutAlt, FaShoppingCart, FaHome, FaBoxOpen,
  FaListAlt, FaUsers, FaPlus
} from 'react-icons/fa';
import axios from 'axios';

export default function Menu() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuAdminAberto, setMenuAdminAberto] = useState(false);
  const [menuVendedorAberto, setMenuVendedorAberto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [pedidosPendentes, setPedidosPendentes] = useState(0);
  const [vendasPendentes, setVendasPendentes] = useState(0);

  const { itensCarrinho } = useContext(CarrinhoContext);
  const menuRef = useRef();
  const menuAdminRef = useRef();
  const menuVendedorRef = useRef();
  const navigate = useNavigate();

  const autenticado = !!localStorage.getItem('token');
  const token = localStorage.getItem('token');

  // Carregar usuário
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      try { setUsuario(JSON.parse(usuarioSalvo)); } catch { setUsuario(null); }
    }
  }, []);

  // Atualização automática de notificações
  useEffect(() => {
    if (!autenticado) return;

    const fetchNotificacoes = async () => {
      try {
        const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));

        // ==========================
        // Meus Pedidos (cliente)
        // ==========================
        const meusPedidosRes = await axios.get('/api/pedidos_meus', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const pendentesUsuario = meusPedidosRes.data.filter(
          p => p.estado !== 'finalizado'
        ).length;
        setPedidosPendentes(pendentesUsuario);

        // ==========================
        // Vendas (vendedor)
        // ==========================
        if (usuarioSalvo?.tipo === 'vendedor') {
          const vendasRes = await axios.get('/api/pedidos', {
            headers: { Authorization: `Bearer ${token}` }
          });

          let pendentes = 0;
          vendasRes.data.forEach(pedido => {
            if (pedido.estado === 'pago') {
              pedido.itens.forEach(item => {
                if (item.produto.user_id === usuarioSalvo.id) {
                  pendentes++;
                }
              });
            }
          });
          setVendasPendentes(pendentes);
        }

      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      }
    };

    fetchNotificacoes();
    const interval = setInterval(fetchNotificacoes, 10000);
    return () => clearInterval(interval);

  }, [autenticado, token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const toggleMenu = () => setMenuAberto(!menuAberto);
  const toggleMenuAdmin = () => setMenuAdminAberto(!menuAdminAberto);
  const toggleMenuVendedor = () => setMenuVendedorAberto(!menuVendedorAberto);

  const setupClickOutside = (ref, setter) => (event) => {
    if (ref.current && !ref.current.contains(event.target)) setter(false);
  };

  useEffect(() => {
    if (menuAberto) document.addEventListener("mousedown", setupClickOutside(menuRef, setMenuAberto));
    return () => document.removeEventListener("mousedown", setupClickOutside(menuRef, setMenuAberto));
  }, [menuAberto]);

  useEffect(() => {
    if (menuAdminAberto) document.addEventListener("mousedown", setupClickOutside(menuAdminRef, setMenuAdminAberto));
    return () => document.removeEventListener("mousedown", setupClickOutside(menuAdminRef, setMenuAdminAberto));
  }, [menuAdminAberto]);

  useEffect(() => {
    if (menuVendedorAberto) document.addEventListener("mousedown", setupClickOutside(menuVendedorRef, setMenuVendedorAberto));
    return () => document.removeEventListener("mousedown", setupClickOutside(menuVendedorRef, setMenuVendedorAberto));
  }, [menuVendedorAberto]);

  const nome = usuario?.name || "Usuário";
  const tipo = usuario?.tipo || null;

  return (
    <>
      {/* Header */}
      <header className="bg-blue-900 text-white shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-2 text-lg font-bold">
            <FaHome />
            <a href="/" className="hover:underline">Loja Online</a>
          </div>

          <div className="flex items-center gap-5">
            {autenticado ? (
              <div className="relative" ref={menuRef}>
                <button onClick={toggleMenu} className="flex items-center gap-2 focus:outline-none">
                  <FaUser /> <span>{nome}</span> <span>▾</span>
                </button>
                {menuAberto && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg p-2 z-10">
                    <a href="/perfil" className="flex items-center gap-2 p-2 hover:bg-gray-100">
                      <FaUser /> Perfil
                    </a>
                    <button onClick={handleLogout} className="flex items-center gap-2 p-2 hover:bg-gray-100 w-full text-left">
                      <FaSignOutAlt /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login" className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition">
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-blue-800 text-white shadow">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 px-6 py-2 text-sm">
          <a href="/" className="inline-flex items-center gap-2 hover:text-yellow-300">
            <FaHome /> Início
          </a>
          <a href="/produtos" className="inline-flex items-center gap-2 hover:text-yellow-300">
            <FaBoxOpen /> Produtos
          </a>

          {/* Carrinho */}
          <div className="relative inline-flex items-center">
            <a href="/carrinho" className="inline-flex items-center gap-2 hover:text-yellow-300">
              <FaShoppingCart /> Carrinho
            </a>
            {itensCarrinho > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itensCarrinho}
              </span>
            )}
          </div>

          {/* Meus Pedidos */}
          <div className="relative inline-flex items-center">
            <a href="/meus-pedidos" className="inline-flex items-center gap-2 hover:text-yellow-300">
              <FaListAlt /> Meus Pedidos
            </a>
            {pedidosPendentes > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {pedidosPendentes}
              </span>
            )}
          </div>

          {/* Menu Vendedor */}
          {tipo === 'vendedor' && (
            <div className="relative" ref={menuVendedorRef}>
              <button onClick={toggleMenuVendedor} className="inline-flex items-center gap-2 hover:text-yellow-300 relative">
                <FaUsers /> Vendas ▾
                {vendasPendentes > 0 && (
                  <span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {vendasPendentes}
                  </span>
                )}
              </button>
              {menuVendedorAberto && (
                <div className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg p-4 z-20">
                  <ul className="space-y-2">
                    <li>
                      <a href="/vendedor/produtos/criar" className="flex items-center gap-2 hover:underline text-blue-700">
                        <FaPlus /> Criar Produto
                      </a>
                    </li>
                    <li>
                      <a href="/vendedor/produtos" className="flex items-center gap-2 hover:underline text-blue-700">
                        <FaBoxOpen /> Meus Produtos
                      </a>
                    </li>
                    <li className="relative">
                      <a href="/vendedor/pedidos" className="flex items-center gap-2 hover:underline text-blue-700">
                        <FaListAlt /> Pedidos
                      </a>
                      {vendasPendentes > 0 && (
                        <span className="absolute -top-2 -right-0 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {vendasPendentes}
                        </span>
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Menu Admin */}
          {tipo === 'admin' && (
            <div className="relative" ref={menuAdminRef}>
              <button onClick={toggleMenuAdmin} className="inline-flex items-center gap-2 hover:text-yellow-300">
                <FaUsers /> Administração ▾
              </button>
              {menuAdminAberto && (
                <div className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg p-4 z-20">
                  <ul className="space-y-2">
                    <li><a href="/admin/produtos" className="flex items-center gap-2 hover:underline text-blue-700"><FaBoxOpen /> Produtos</a></li>
                    <li><a href="/vendedor/produtos/criar" className="flex items-center gap-2 hover:underline text-blue-700"><FaPlus /> Criar Produto</a></li>
                    <li><a href="/admin/pedidos" className="flex items-center gap-2 hover:underline text-blue-700"><FaListAlt /> Pedidos</a></li>
                    <li><a href="/admin/usuarios" className="flex items-center gap-2 hover:underline text-blue-700"><FaUsers /> Usuários</a></li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
