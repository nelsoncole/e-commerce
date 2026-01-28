// src/context/CarrinhoContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [itensCarrinho, setItensCarrinho] = useState(0);
  const token = localStorage.getItem("token");

  // Função para atualizar a quantidade de itens do carrinho
  const atualizarCarrinho = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/carrinho", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Número de produtos diferentes
      setItensCarrinho(res.data.length);
    } catch (error) {
      console.error("Erro ao atualizar carrinho:", error);
    }
  };

  // Carregar inicialmente
  useEffect(() => {
    atualizarCarrinho();
  }, [token]);

  return (
    <CarrinhoContext.Provider value={{ itensCarrinho, atualizarCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  );
}
