import React, { useState, useEffect } from "react";
import Menu from "../components/Menu";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CriarEndereco() {
  const [form, setForm] = useState({
    pais_id: "",
    provincia_id: "",
    municipio_id: "",
    bairro: "",
    referencia: "",
    contacto: "",
  });

  const [paises, setPaises] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [alerta, setAlerta] = useState({ tipo: "", mensagem: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ======================
  // Carregar países
  // ======================
  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const res = await axios.get("/api/paises", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaises(res.data);
      } catch (err) {
        console.error("Erro ao carregar países:", err);
        setAlerta({ tipo: "erro", mensagem: "Erro ao carregar países." });
      }
    };
    fetchPaises();
  }, [token]);

  // ======================
  // Carregar províncias do país selecionado
  // ======================
  useEffect(() => {
    if (!form.pais_id) {
      setProvincias([]);
      setMunicipios([]);
      return;
    }

    const fetchProvincias = async () => {
      try {
        const res = await axios.get(`/api/provincias?pais_id=${form.pais_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProvincias(res.data);
      } catch (err) {
        console.error("Erro ao carregar províncias:", err);
        setAlerta({ tipo: "erro", mensagem: "Erro ao carregar províncias." });
      }
    };
    fetchProvincias();
  }, [form.pais_id, token]);

  // ======================
  // Carregar municípios da província selecionada
  // ======================
  useEffect(() => {
    if (!form.provincia_id) {
      setMunicipios([]);
      return;
    }

    const fetchMunicipios = async () => {
      try {
        const res = await axios.get(`/api/municipios?provincia_id=${form.provincia_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMunicipios(res.data);
      } catch (err) {
        console.error("Erro ao carregar municípios:", err);
        setAlerta({ tipo: "erro", mensagem: "Erro ao carregar municípios." });
      }
    };
    fetchMunicipios();
  }, [form.provincia_id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Resetar dependentes
    if (e.target.name === "pais_id") {
      setForm((prev) => ({ ...prev, provincia_id: "", municipio_id: "" }));
    }
    if (e.target.name === "provincia_id") {
      setForm((prev) => ({ ...prev, municipio_id: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/enderecos", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerta({ tipo: "sucesso", mensagem: "Endereço criado com sucesso!" });
      setTimeout(() => navigate("/perfil"), 2000); // redireciona após 2s
    } catch (err) {
      console.error("Erro ao criar endereço:", err);
      setAlerta({ tipo: "erro", mensagem: "Erro ao criar endereço." });
    }
  };

  return (
    <div>
      <Menu />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
        <h1 className="text-2xl font-bold mb-4">Adicionar Endereço</h1>

        {/* ALERTA */}
        {alerta.mensagem && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              alerta.tipo === "sucesso"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {alerta.mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* País */}
          <div>
            <label className="block font-semibold mb-1">País</label>
            <select
              name="pais_id"
              value={form.pais_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Selecione o país</option>
              {paises.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Província */}
          <div>
            <label className="block font-semibold mb-1">Província</label>
            <select
              name="provincia_id"
              value={form.provincia_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              disabled={!form.pais_id}
            >
              <option value="">Selecione a província</option>
              {provincias.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Município */}
          <div>
            <label className="block font-semibold mb-1">Município</label>
            <select
              name="municipio_id"
              value={form.municipio_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              disabled={!form.provincia_id}
            >
              <option value="">Selecione o município</option>
              {municipios.map((mun) => (
                <option key={mun.id} value={mun.id}>
                  {mun.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Bairro */}
          <div>
            <label className="block font-semibold mb-1">Bairro</label>
            <input
              type="text"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Referência */}
          <div>
            <label className="block font-semibold mb-1">Referência</label>
            <input
              type="text"
              name="referencia"
              value={form.referencia}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Contacto */}
          <div>
            <label className="block font-semibold mb-1">Contacto</label>
            <input
              type="text"
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Salvar Endereço
          </button>
        </form>
      </div>
    </div>
  );
}
