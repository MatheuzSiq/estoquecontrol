// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Função para criar o Prisma Client com adapter
const createPrismaClient = () => {
  // Verifica se está em produção e tem DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está definida");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Configurações para Vercel (evita timeouts)
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
