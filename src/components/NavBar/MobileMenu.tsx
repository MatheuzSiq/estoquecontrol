"use client";

import NavLinks from "./NavLinks";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function MobileMenu({ open, setOpen }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* sidebar */}
      <div className="relative bg-gray-800 w-64 h-full p-6 border-r border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-semibold">Menu</h2>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <NavLinks />
      </div>
    </div>
  );
}
