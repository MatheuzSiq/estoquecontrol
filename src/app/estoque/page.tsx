"use client";

import { useEffect, useState } from "react";
import InventoryCard from "@/components/estoque/EstoqueCard";
import InventoryToolbar from "@/components/estoque/EstoqueToolBar";
import { Providers } from "../providers";

interface InventoryItem {
  id: string;
  productCode: string;
  productDescription: string;
  lote: string;
  quantity: number;
  date: string;
  galpao: string;
  rua: string;
  posicao: string;
  nivel: string;
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filtered, setFiltered] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadInventory() {
    try {
      const res = await fetch("/api/estoque");
      const data = await res.json();
      setInventory(data);
      setFiltered(data);
    } catch (error) {
      console.error("Erro ao carregar inventário:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  function handleSearch(filters: {
    search?: string;
    galpao?: string;
    rua?: string;
    posicao?: string;
    nivel?: string;
    productCode?: string;
    productDescription?: string;
    lote?: string;
  }) {
    const result = inventory.filter((item) => {
      // Busca geral (código, descrição, lote, localização)
      const searchTerm = filters.search ? filters.search.toLowerCase() : "";
      const matchesSearch = filters.search
        ? item.productCode.toLowerCase().includes(searchTerm) ||
          item.productDescription.toLowerCase().includes(searchTerm) ||
          (item.lote && item.lote.toLowerCase().includes(searchTerm)) ||
          `${item.galpao} ${item.rua} ${item.posicao} ${item.nivel}`
            .toLowerCase()
            .includes(searchTerm)
        : true;

      const matchesGalpao = filters.galpao
        ? item.galpao.toLowerCase().includes(filters.galpao.toLowerCase())
        : true;

      const matchesRua = filters.rua
        ? item.rua.toLowerCase().includes(filters.rua.toLowerCase())
        : true;

      const matchesPosicao = filters.posicao
        ? item.posicao.toLowerCase().includes(filters.posicao.toLowerCase())
        : true;

      const matchesNivel = filters.nivel
        ? item.nivel.toLowerCase().includes(filters.nivel.toLowerCase())
        : true;

      const matchesProductCode = filters.productCode
        ? item.productCode
            .toLowerCase()
            .includes(filters.productCode.toLowerCase())
        : true;

      const matchesProductDescription = filters.productDescription
        ? item.productDescription
            .toLowerCase()
            .includes(filters.productDescription.toLowerCase())
        : true;

      const matchesLote = filters.lote
        ? item.lote &&
          item.lote.toLowerCase().includes(filters.lote.toLowerCase())
        : true;

      return (
        matchesSearch &&
        matchesGalpao &&
        matchesRua &&
        matchesPosicao &&
        matchesNivel &&
        matchesProductCode &&
        matchesProductDescription &&
        matchesLote
      );
    });

    setFiltered(result);
  }

  async function handleEdit(item: InventoryItem) {
    console.log("Editar:", item);
    // Implementar lógica de edição
  }

  async function handleDelete(item: InventoryItem) {
    if (!confirm(`Tem certeza que deseja excluir o item ${item.productCode}?`))
      return;

    try {
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadInventory();
        alert("Item excluído com sucesso!");
      } else {
        alert("Erro ao excluir");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar");
    }
  }

  return (
    <Providers>
      <div className="w-full max-w-7xl mx-auto bg-gray-800 p-4 md:p-8 rounded-xl shadow-lg">
        <h1 className="text-xl md:text-2xl font-semibold text-white mb-6 text-center md:text-left">
          Estoque
        </h1>

        <div className="mb-6">
          <InventoryToolbar onSearch={handleSearch} />
        </div>

        {loading && (
          <p className="text-gray-400 text-center py-10">Carregando...</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            Nenhum item encontrado no estoque. Tente ajustar os filtros ou
            adicione novos itens.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </Providers>
  );
}
