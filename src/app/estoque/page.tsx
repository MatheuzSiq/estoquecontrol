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
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<any>({});

  async function loadInventory(page = 1, filters: any = {}) {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "12",
        ...filters,
      });
  
      const res = await fetch(`/api/estoque?${query.toString()}`);
      const data = await res.json();
  
      setInventory(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // 🔁 Sempre que página ou busca mudar
  useEffect(() => {
    loadInventory(page, filters);
  }, [page, filters]);

  // 🔍 Busca agora vai pro backend
  function handleSearch(newFilters: any) {
    setPage(1);
    setFilters(newFilters);
  }

  async function handleEdit(item: InventoryItem) {
    console.log("Editar:", item);
  }

  async function handleDelete(item: InventoryItem) {
    if (!confirm(`Tem certeza que deseja excluir o item ${item.productCode}?`))
      return;

    try {
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadInventory(page, search);
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

        {!loading && inventory.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            Nenhum item encontrado no estoque.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {inventory.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* 🔥 PAGINAÇÃO */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-white">
            Página {page} de {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </Providers>
  );
}
