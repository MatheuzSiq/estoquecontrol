import { NextResponse } from "next/server";
import { createEstrutura } from "@/services/estrutura/createEstrutura";
import { getEstrutura } from "@/services/estrutura/getEstrutura";

export async function GET() {
  const estrutura = await getEstrutura();

  return NextResponse.json(estrutura);
}

export async function POST(req: Request) {
  const data = await req.json();

  await createEstrutura(data);

  return NextResponse.json({ success: true });
}

