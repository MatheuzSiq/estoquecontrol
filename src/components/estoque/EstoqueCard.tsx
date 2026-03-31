"use client";

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

interface InventoryCardProps {
  item: InventoryItem;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
}

export default function InventoryCard({
  item,
  onEdit,
  onDelete,
}: InventoryCardProps) {
  const endereco = `${item.rua}${item.posicao}${item.nivel}`;

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 flex flex-col gap-3">
      {/* Cabeçalho com código e descrição */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="text-white font-semibold text-md break-all">
            {item.productCode}
          </p>
          <p className="text-white font-semibold text-md break-all">
            Lote: {item.lote || "N/A"}
          </p>
          <span
            className={`text-sm px-2 py-1 rounded-full font-medium ${
              item.quantity > 0
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {item.quantity.toFixed(3)} unidades
          </span>
        </div>
        <div className="text-sm text-gray-300 flex items-center flex-wrap gap-x-4 gap-y-1 border-t border-gray-600 pt-2 mt-2">
          <p className="text-gray-300 text-sm">{item.productDescription}</p>
        </div>
      </div>

      {/* Informações do lote e data */}
      <div className="text-sm text-gray-300 flex items-center flex-wrap gap-x-3 gap-y-1 border-t border-gray-600 pt-2">
        <span>Data: {new Date(item.date).toLocaleDateString("pt-BR")}</span>
        <span>Endereço: {endereco}</span>
        <span>Galpão: {item.galpao}</span>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-600">
        <button
          onClick={() => onEdit?.(item)}
          className="text-yellow-400 hover:text-yellow-300 transition-colors p-1"
          aria-label="Editar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete?.(item)}
          className="text-red-400 hover:text-red-300 transition-colors p-1"
          aria-label="Excluir"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
