import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (code) {
      // Busca um produto específico pelo código
      const product = await prisma.catalog.findUnique({
        where: { code },
      });
      return NextResponse.json(product);
    }

    // Busca todos os produtos
    const products = await prisma.catalog.findMany({
      orderBy: { code: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 },
    );
  }
}
