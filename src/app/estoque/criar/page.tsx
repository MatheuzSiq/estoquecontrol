"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Endereco {
  id: string;
  galpao: string;
  rua: string;
  posicao: string;
  nivel: string;
}

interface Produto {
  id: string;
  code: string;
  description: string;
  unit: string;
}

export default function CriarItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Dados do formulário
  const [productCode, setProductCode] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [lote, setLote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [enderecoId, setEnderecoId] = useState("");

  // Listas
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecosFiltrados, setEnderecosFiltrados] = useState<Endereco[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [showEnderecoSuggestions, setShowEnderecoSuggestions] = useState(false);
  const [enderecoSearch, setEnderecoSearch] = useState("");

  // Carrega endereços e produtos
  useEffect(() => {
    loadEnderecos();
    loadProdutos();
  }, []);

  // Filtra endereços baseado na busca
  useEffect(() => {
    if (enderecoSearch) {
      const filtered = enderecos.filter(
        (e) =>
          `${e.rua}${e.posicao}${e.nivel}`
            .toLowerCase()
            .includes(enderecoSearch.toLowerCase()) ||
          `${e.rua}${e.posicao}${e.nivel}`
            .toLowerCase()
            .includes(enderecoSearch.toLowerCase()),
      );
      setEnderecosFiltrados(filtered);
    } else {
      setEnderecosFiltrados([]);
    }
  }, [enderecoSearch, enderecos]);

  async function loadEnderecos() {
    try {
      const res = await fetch("/api/estrutura");
      const data = await res.json();
      setEnderecos(data);
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
    }
  }

  async function loadProdutos() {
    try {
      const res = await fetch("/api/catalogo");
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  // Busca produto pelo código
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (productCode.length >= 2) {
        searchProduct(productCode);
      } else {
        setProductDescription("");
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [productCode]);

  async function searchProduct(code: string) {
    try {
      const res = await fetch(`/api/catalogo?code=${code}`);
      const product = await res.json();
      if (product) {
        setProductDescription(product.description);
      } else {
        setProductDescription("");
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      setProductDescription("");
    }
  }

  function handleProductCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProductCode(e.target.value);
    setShowProductSuggestions(true);
  }

  function selectProduct(product: Produto) {
    setProductCode(product.code);
    setProductDescription(product.description);
    setShowProductSuggestions(false);
  }

  function selectEndereco(endereco: Endereco) {
    setEnderecoId(endereco.id);
    setEnderecoSearch(`${endereco.rua}${endereco.posicao}${endereco.nivel}`);
    setShowEnderecoSuggestions(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Busca o produto pelo código
      const productRes = await fetch(`/api/catalogo?code=${productCode}`);
      const product = await productRes.json();

      if (!product) {
        alert("Produto não encontrado");
        setLoading(false);
        return;
      }

      // Cria o item no estoque
      const res = await fetch("/api/estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          lote: lote || null,
          quantity: parseFloat(quantity),
          nivelId: enderecoId,
          date: new Date(),
        }),
      });

      if (res.ok) {
        alert("Item criado com sucesso!");
        router.push("/");
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao criar item");
      }
    } catch (error) {
      console.error("Erro ao criar item:", error);
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  // Filtra produtos para sugestões
  const filteredProducts = produtos.filter(
    (p) =>
      p.code.toLowerCase().includes(productCode.toLowerCase()) ||
      p.description.toLowerCase().includes(productCode.toLowerCase()),
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
      <h1 className="text-xl md:text-2xl font-semibold text-white mb-6">
        Novo Item no Estoque
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Produto */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Código do Produto *
          </label>
          <input
            type="text"
            value={productCode}
            onChange={handleProductCodeChange}
            onFocus={() => setShowProductSuggestions(true)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />

          {showProductSuggestions &&
            productCode.length > 0 &&
            filteredProducts.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => selectProduct(product)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-600 text-white"
                  >
                    <span className="font-medium">{product.code}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      {product.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Descrição
          </label>
          <input
            type="text"
            value={productDescription}
            readOnly
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* Lote */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Lote
          </label>
          <input
            type="text"
            value={lote}
            onChange={(e) => setLote(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Opcional"
          />
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Quantidade *
          </label>
          <input
            type="number"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Localização */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Localização *
          </label>
          <input
            type="text"
            value={enderecoSearch}
            onChange={(e) => setEnderecoSearch(e.target.value)}
            onFocus={() => setShowEnderecoSuggestions(true)}
            placeholder="Endereço..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />

          {showEnderecoSuggestions &&
            enderecoSearch.length > 0 &&
            enderecosFiltrados.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {enderecosFiltrados.map((endereco) => (
                  <button
                    key={endereco.id}
                    type="button"
                    onClick={() => selectEndereco(endereco)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-600 text-white"
                  >
                    <span className="text-gray-400 text-sm ml-2">
                      {endereco.rua} - {endereco.posicao} - {endereco.nivel}
                    </span>
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
