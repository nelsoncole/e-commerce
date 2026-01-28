import React from "react";
import Menu from "../components/Menu";

export default function AdminDashboard() {
  return (
    <div>
      <Menu />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Painel do Admin/Vendedor</h1>
        <p>Resumo das vendas, produtos e pedidos.</p>
      </div>
    </div>
  );
}
