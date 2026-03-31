"use client";

import { useEffect, useState } from "react";
import EstruturaCard from "./EstruturaCard";
import EstruturaToolbar from "./EstruturaToolBar";
import EditModal from "./EditModal";

export default function EstruturaList() {
  const [estrutura, setEstrutura] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadEstrutura() {
    const res = await fetch("/api/estrutura");
    const data = await res.json();
    setEstrutura(data);
    setFiltered(data);
  }

  useEffect(() => {
    loadEstrutura();
  }, []);

  function handleSearch(filters: {
    search?: string;
    galpao?: string;
    rua?: string;
    posicao?: string;
    nivel?: string;
  }) {
    const result = estrutura.filter((item) => {
      // Remove os traços do endereço para comparação
      const enderecoCompleto = `${item.rua || ""}${item.posicao || ""}${item.nivel || ""}`;

      // Remove traços do termo de busca também
      const searchTerm = filters.search ? filters.search.replace(/-/g, "") : "";

      const matchesSearch = filters.search
        ? enderecoCompleto.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesGalpao = filters.galpao
        ? String(item.galpao || "")
            .toLowerCase()
            .includes(filters.galpao.toLowerCase())
        : true;

      const matchesRua = filters.rua
        ? String(item.rua || "")
            .toLowerCase()
            .includes(filters.rua.toLowerCase())
        : true;

      const matchesPosicao = filters.posicao
        ? String(item.posicao || "")
            .toLowerCase()
            .includes(filters.posicao.toLowerCase())
        : true;

      const matchesNivel = filters.nivel
        ? String(item.nivel || "")
            .toLowerCase()
            .includes(filters.nivel.toLowerCase())
        : true;

      return (
        matchesSearch &&
        matchesGalpao &&
        matchesRua &&
        matchesPosicao &&
        matchesNivel
      );
    });

    setFiltered(result);
  }

  async function handleEdit(item: any) {
    try {
      console.log("Buscando item:", item.id);

      const res = await fetch(`/api/estrutura/${item.id}`);

      console.log("Status:", res.status);

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const text = await res.text();
      console.log("Resposta:", text);

      if (!text) {
        throw new Error("Resposta vazia");
      }

      const fullItem = JSON.parse(text);
      setEditingItem(fullItem);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erro detalhado:", error);
      alert("Erro ao carregar dados para edição. Verifique o console.");
    }
  }

  async function handleSaveEdit(id: string, data: any) {
    try {
      const res = await fetch(`/api/estrutura/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await loadEstrutura();
        setIsModalOpen(false);
        setEditingItem(null);
        alert("Editado com sucesso!");
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao editar");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar");
    }
  }

  async function handleDelete(item: any) {
    if (!confirm("Tem certeza?")) return;

    try {
      const res = await fetch(`/api/estrutura/${item.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadEstrutura();
        alert("Excluído com sucesso!");
      } else {
        alert("Erro ao excluir");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar");
    }
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto bg-gray-800 p-4 md:p-8 rounded-xl shadow-lg">
        <h1 className="text-xl md:text-2xl font-semibold text-white mb-6 text-center md:text-left">
          Estrutura
        </h1>

        <div className="mb-6">
          <EstruturaToolbar onSearch={handleSearch} />
        </div>

        {filtered.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            Nenhum endereço encontrado
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <EstruturaCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <EditModal
        item={editingItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
      />
    </>
  );
}
