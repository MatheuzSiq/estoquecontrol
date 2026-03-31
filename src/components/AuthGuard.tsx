// components/AuthGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/login", "/register"];

  useEffect(() => {
    if (status !== "loading" && !session && !publicRoutes.includes(pathname)) {
      router.push("/login");
    }
  }, [status, session, router, pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  // Se for rota pública, mostra sem proteção
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Se não estiver autenticado, não mostra nada
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
