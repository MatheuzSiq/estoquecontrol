"use client";

import { useState, useEffect } from "react";

interface EditModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => void;
}

export default function EditModal({
  item,
  isOpen,
  onClose,
  onSave,
}: EditModalProps) {
  const [formData, setFormData] = useState({
    galpao: "",
    rua: "",
    posicao: "",
    nivel: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        galpao: item.posicao?.rua?.galpao?.name || "",
        rua: item.posicao?.rua?.name || "",
        posicao: item.posicao?.posicao || "",
        nivel: item.nivel || "",
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Envia todos os dados para serem salvos
    await onSave(item.id, {
      galpao: formData.galpao,
      rua: formData.rua,
      posicao: formData.posicao,
      nivel: formData.nivel,
      posicaoId: item.posicao?.id, // ID da posição atual para referência
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          Editar Endereço
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Galpão
              </label>
              <input
                type="text"
                value={formData.galpao}
                onChange={(e) =>
                  setFormData({ ...formData, galpao: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Rua
              </label>
              <input
                type="text"
                value={formData.rua}
                onChange={(e) =>
                  setFormData({ ...formData, rua: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Posição
              </label>
              <input
                type="text"
                value={formData.posicao}
                onChange={(e) =>
                  setFormData({ ...formData, posicao: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nível
              </label>
              <input
                type="text"
                value={formData.nivel}
                onChange={(e) =>
                  setFormData({ ...formData, nivel: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
