"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Galpao {
  id: string;
  name: string;
}

export default function SetEstrutura() {
  const router = useRouter();
  const [galpoes, setGalpoes] = useState<Galpao[]>([]);
  const [galpaoSelecionado, setGalpaoSelecionado] = useState("");

  const [modoMassa, setModoMassa] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Estado para controle do salvamento

  // Campos individuais
  const [rua, setRua] = useState("");
  const [posicao, setPosicao] = useState("");
  const [nivel, setNivel] = useState("");

  // Campos em massa
  const [ruaInicio, setRuaInicio] = useState("");
  const [ruaFim, setRuaFim] = useState("");
  const [posInicio, setPosInicio] = useState<number | "">("");
  const [posFim, setPosFim] = useState<number | "">("");
  const [nivelInicio, setNivelInicio] = useState("");
  const [nivelFim, setNivelFim] = useState("");

  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function fetchGalpoes() {
      try {
        const res = await fetch("/api/galpoes");
        const data = await res.json();
        setGalpoes(data);
        if (data.length > 0) setGalpaoSelecionado(data[0].id);
      } catch (err) {
        console.error("Erro ao buscar galpões:", err);
      }
    }

    fetchGalpoes();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMensagem("");
    setIsSaving(true); // Desabilita o botão e mostra "Salvando..."

    try {
      if (modoMassa) {
        // chama a API POST /api/estrutura com os campos corretos
        const response = await fetch("/api/estrutura", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            galpaoId: galpaoSelecionado,
            ruaInicio,
            ruaFim,
            posicaoInicio: Number(posInicio),
            posicaoFim: Number(posFim),
            nivelInicio,
            nivelFim,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setMensagem("Endereços salvos com sucesso!");
          // limpa campos
          setRuaInicio("");
          setRuaFim("");
          setPosInicio("");
          setPosFim("");
          setNivelInicio("");
          setNivelFim("");
        } else {
          setMensagem("Erro ao salvar endereços.");
        }
      } else {
        // modo individual: cria apenas 1 endereço via API
        const response = await fetch("/api/estrutura", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            galpaoId: galpaoSelecionado,
            ruaInicio: rua,
            ruaFim: rua,
            posicaoInicio: Number(posicao),
            posicaoFim: Number(posicao),
            nivelInicio: nivel,
            nivelFim: nivel,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setMensagem("Endereço salvo com sucesso!");
          setRua("");
          setPosicao("");
          setNivel("");
        } else {
          setMensagem("Erro ao salvar endereço.");
        }
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao salvar endereço(s).");
    } finally {
      setIsSaving(false); // Reabilita o botão após a operação
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Top buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Voltar
        </button>

        <button
          onClick={() => setModoMassa(!modoMassa)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {modoMassa ? "Formulário Individual" : "Adicionar em Massa"}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-white">
        {modoMassa ? "Adicionar Endereços em Massa" : "Criar Endereço"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-white mb-1 block">Galpão</label>
          <select
            value={galpaoSelecionado}
            onChange={(e) => setGalpaoSelecionado(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
            disabled={isSaving} // Desabilita durante o salvamento
          >
            {galpoes.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {!modoMassa ? (
          <>
            <div>
              <label className="text-white mb-1 block">Rua</label>
              <input
                placeholder="Rua"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
                disabled={isSaving} // Desabilita durante o salvamento
              />
            </div>

            <div>
              <label className="text-white mb-1 block">Posição</label>
              <input
                type="number"
                placeholder="1"
                value={posicao}
                onChange={(e) => setPosicao(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
                disabled={isSaving} // Desabilita durante o salvamento
              />
            </div>

            <div>
              <label className="text-white mb-1 block">Nível</label>
              <input
                placeholder="A"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
                disabled={isSaving} // Desabilita durante o salvamento
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-white mb-1 block">Rua: início</label>
              <input
                placeholder="A"
                value={ruaInicio}
                onChange={(e) => setRuaInicio(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
                disabled={isSaving} // Desabilita durante o salvamento
              />
            </div>

            <div>
              <label className="text-white mb-1 block">Rua: fim</label>
              <input
                placeholder="Z"
                value={ruaFim}
                onChange={(e) => setRuaFim(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
                disabled={isSaving} // Desabilita durante o salvamento
              />
            </div>

            <div>
              <label className="text-white mb-1 block">Posição: início</label>
              <input
                type="number"
                placeholder="1"
                value={posInicio}
                onChange={(e) => setPosInicio(Number(e.target.value))}
                className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
                disabled={isSaving} // Desabilita durante o salvamento
              />
            </div>

            <div>
              <label className="text-white mb-1 block">Posição: fim</label>
              <input
                type="number"
                placeholder="5"
                value={posFim}
                onChange={(e) => setPosFim(Number(e.target.value))}
                className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
                disabled={isSaving} // Desabilita durante o salvamento
              />
            </div>

            <div>
              <label className="text-white mb-1 block">Nível: início</label>
              <input
                placeholder="A"
                value={nivelInicio}
                onChange={(e) => setNivelInicio(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
                disabled={isSaving} // Desabilita durante o salvamento
              />
            </div>

            <div>
              <label className="text-white mb-1 block">Nível: fim</label>
              <input
                placeholder="D"
                value={nivelFim}
                onChange={(e) => setNivelFim(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
                disabled={isSaving} // Desabilita durante o salvamento
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium ${
            isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? "Salvando..." : "Salvar"}
        </button>
      </form>

      {mensagem && (
        <p className="mt-4 text-white bg-green-600 p-3 rounded-lg">
          {mensagem}
        </p>
      )}
    </div>
  );
}
