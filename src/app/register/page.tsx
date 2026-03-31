// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Erro ao registrar");
      }
    } catch (error) {
      setError("Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Criar Conta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white mb-1 block">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="text-white mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label className="text-white mb-1 block">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg w-full"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
