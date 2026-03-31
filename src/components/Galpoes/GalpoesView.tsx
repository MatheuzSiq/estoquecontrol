"use client";

import { useEffect, useState } from "react";

interface Galpao {
  id: string;
  name: string;
  description: string;
}

export default function ListaGalpoes() {
  const [galpoes, setGalpoes] = useState<Galpao[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadGalpoes() {
    setLoading(true);

    const res = await fetch("/api/galpoes");
    const data = await res.json();

    setGalpoes(data);
    setLoading(false);
  }

  useEffect(() => {
    loadGalpoes();
  }, []);

  return (
    <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold text-white mb-6 text-center">
        Galpões
      </h1>

      {loading && <p className="text-center text-gray-400">Carregando...</p>}

      {!loading && galpoes.length === 0 && (
        <p className="text-center text-gray-400">Nenhum galpão cadastrado</p>
      )}

      <div className="flex flex-col gap-3">
        {galpoes.map((g) => (
          <div
            key={g.id}
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg"
          >
            <p className="text-white font-medium">{g.name}</p>

            <p className="text-gray-400 text-sm">{g.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
