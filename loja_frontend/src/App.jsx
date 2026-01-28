import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RotaProtegida from './components/RotaProtegida';
import { CarrinhoProvider } from './context/CarrinhoContext'; // Importa o provider

// Páginas públicas
import Home from './Pages/Home';
import Login from './Pages/Login';
import Cadastro from './Pages/Cadastro';
import Produtos from './Pages/Produtos';
import ProdutoDetalhe from './Pages/ProdutoDetalhe';

// Páginas protegidas (cliente)
import Perfil from './Pages/Perfil';
import Carrinho from './Pages/Carrinho';
import MeusPedidos from './Pages/MeusPedidos';
import CriarEndereco from './Pages/CriarEndereco';
import EditarEndereco from './Pages/EditarEndereco';

// Admin
import AdminDashboard from './Pages/AdminDashboard';
import Usuarios from './Pages/Usuarios';
import EditarUsuario from './Pages/EditarUsuario';

// Vendedor
import CriarProduto from './Pages/CriarProduto';
import EditarProduto from './Pages/EditarProduto';
import ProdutosVendedor from './Pages/ProdutosVendedor';
import PedidosVendedor from './Pages/PedidosVendedor';

import PaginaNaoEncontrada from './Pages/PaginaNaoEncontrada';

export default function App() {
  return (
    <CarrinhoProvider> {/* Toda a aplicação dentro do contexto */}
      <BrowserRouter>
        <Routes>

          {/* ================= ROTAS PÚBLICAS ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhe />} />

          {/* ================= ROTAS PROTEGIDAS (CLIENTE) ================= */}
          <Route
            path="/perfil"
            element={
              <RotaProtegida>
                <Perfil />
              </RotaProtegida>
            }
          />

          <Route
            path="/endereco/criar"
            element={
              <RotaProtegida>
                <CriarEndereco />
              </RotaProtegida>
            }
          />

          <Route
            path="/endereco/:id/editar"
            element={
              <RotaProtegida>
                <EditarEndereco />
              </RotaProtegida>
            }
          />

          <Route
            path="/carrinho"
            element={
              <RotaProtegida>
                <Carrinho />
              </RotaProtegida>
            }
          />

          <Route
            path="/meus-pedidos"
            element={
              <RotaProtegida>
                <MeusPedidos />
              </RotaProtegida>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <RotaProtegida>
                <AdminDashboard />
              </RotaProtegida>
            }
          />

          <Route
            path="/admin/usuarios"
            element={
              <RotaProtegida>
                <Usuarios />
              </RotaProtegida>
            }
          />

          <Route
            path="/admin/usuarios/:id/editar"
            element={
              <RotaProtegida>
                <EditarUsuario />
              </RotaProtegida>
            }
          />

          {/* ================= VENDEDOR ================= */}
          <Route
            path="/vendedor/produtos/criar"
            element={
              <RotaProtegida>
                <CriarProduto />
              </RotaProtegida>
            }
          />
          <Route
            path="/vendedor/produtos/:id/editar"
            element={
              <RotaProtegida>
                <EditarProduto />
              </RotaProtegida>
            }
          />

          <Route
            path="/vendedor/produtos"
            element={
              <RotaProtegida>
                <ProdutosVendedor />
              </RotaProtegida>
            }
          />

          <Route
            path="/vendedor/pedidos"
            element={
              <RotaProtegida>
                <PedidosVendedor />
              </RotaProtegida>
            }
          />

          {/* ================= 404 ================= */}
          <Route path="*" element={<PaginaNaoEncontrada />} />

        </Routes>
      </BrowserRouter>
    </CarrinhoProvider>
  );
}
