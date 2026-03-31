import { signOut } from "next-auth/react";

export default function ProfileMenu() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-300 text-sm hidden sm:block">Usuário</span>

      <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">
        U
      </div>

      <button onClick={() => signOut()}>Sair</button>
    </div>
  );
}
