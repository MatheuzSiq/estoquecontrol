"use client";

import { useState } from "react";

interface Props {
  onSearch: (filters: {
    search?: string;
    galpao?: string;
    rua?: string;
    posicao?: string;
    nivel?: string;
  }) => void;
}

export default function EstruturaToolbar({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const [openFilters, setOpenFilters] = useState(false);

  const [filtroGalpao, setFiltroGalpao] = useState("");
  const [filtroRua, setFiltroRua] = useState("");
  const [filtroPosicao, setFiltroPosicao] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");

  function handleSearchChange(e: any) {
    setSearch(e.target.value);
  }

  function handleButtonSearch() {
    const filters: any = {};
    if (search.trim()) filters.search = search.trim();
    onSearch(filters);
  }

  // Nova função para lidar com a tecla Enter
  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleButtonSearch();
    }
  }

  function aplicarFiltros() {
    const filters: any = {};
    if (search.trim()) filters.search = search.trim();
    if (filtroGalpao.trim()) filters.galpao = filtroGalpao.trim();
    if (filtroRua.trim()) filters.rua = filtroRua.trim();
    if (filtroPosicao.trim()) filters.posicao = filtroPosicao.trim();
    if (filtroNivel.trim()) filters.nivel = filtroNivel.trim();

    onSearch(filters);
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Barra principal */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex w-full">
          <input
            placeholder="Buscar endereço..."
            value={search}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-700 text-white border border-gray-600 p-3 rounded-l-lg focus:outline-none"
          />
          <button
            onClick={handleButtonSearch}
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-r-lg flex items-center justify-center"
            style={{ width: "48px", height: "48px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setOpenFilters(!openFilters)}
          className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg border border-gray-600"
        >
          Filtros
        </button>

        <a
          href="/enderecos/criar"
          className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium text-center"
        >
          Novo
        </a>
      </div>

      {/* Filtros avançados */}
      {openFilters && (
        <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="text-white mb-1 block">Galpão</label>
            <input
              placeholder="Galpão"
              value={filtroGalpao}
              onChange={(e) => setFiltroGalpao(e.target.value)}
              className="bg-gray-800 border border-gray-600 p-2 rounded text-white w-full"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="text-white mb-1 block">Rua</label>
            <input
              placeholder="Rua"
              value={filtroRua}
              onChange={(e) => setFiltroRua(e.target.value)}
              className="bg-gray-800 border border-gray-600 p-2 rounded text-white w-full"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="text-white mb-1 block">Posição</label>
            <input
              placeholder="Posição"
              value={filtroPosicao}
              onChange={(e) => setFiltroPosicao(e.target.value)}
              className="bg-gray-800 border border-gray-600 p-2 rounded text-white w-full"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="text-white mb-1 block">Nível</label>
            <input
              placeholder="Nível"
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="bg-gray-800 border border-gray-600 p-2 rounded text-white w-full"
            />
          </div>

          <button
            onClick={aplicarFiltros}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}
