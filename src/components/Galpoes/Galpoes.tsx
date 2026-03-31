"use client";

import { useState } from "react";

export default function Galpoes() {
  const [loading, setLoading] = useState(false);
  const [galpao, setGalpao] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    await fetch("/api/galpoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        galpao: form.get("galpao"),
        description: `Galpão ${form.get("galpao")}`,
      }),
    });

    setLoading(false);
    alert("Galpão criado!");
    e.target.reset();
    setGalpao("");
  }

  return (
    <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold text-white mb-6 text-center">
        Criar Galpão
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="galpao"
          placeholder="Nome do galpão"
          className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg"
          value={galpao}
          onChange={(e) => setGalpao(e.target.value)}
        />

        <input
          name="description"
          className="bg-gray-700 text-gray-400 border border-gray-600 p-3 rounded-lg"
          value={`Galpão ${galpao}`}
          readOnly
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium"
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar Galpão"}
        </button>
      </form>
    </div>
  );
}
