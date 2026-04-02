import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";


type InventoryWithRelations = Prisma.InventoryGetPayload<{
  select: {
    id: true;
    lote: true;
    quantity: true;
    date: true;
    product: {
      select: {
        code: true;
        description: true;
      };
    };
    nivel: {
      select: {
        nivel: true;
        posicao: {
          select: {
            posicao: true;
            rua: {
              select: {
                name: true;
                galpao: {
                  select: {
                    name: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const galpao = searchParams.get("galpao") || "";
const rua = searchParams.get("rua") || "";
const posicao = searchParams.get("posicao") || "";
const nivel = searchParams.get("nivel") || "";
const productCode = searchParams.get("productCode") || "";
const productDescription = searchParams.get("productDescription") || "";
const lote = searchParams.get("lote") || "";

const where: any = {
  AND: [
    search
      ? {
          OR: [
            {
              product: {
                code: { contains: search, mode: "insensitive" },
              },
            },
            {
              product: {
                description: { contains: search, mode: "insensitive" },
              },
            },
            {
              lote: { contains: search, mode: "insensitive" },
            },
          ],
        }
      : {},

    productCode
      ? {
          product: {
            code: { contains: productCode, mode: "insensitive" },
          },
        }
      : {},

    productDescription
      ? {
          product: {
            description: {
              contains: productDescription,
              mode: "insensitive",
            },
          },
        }
      : {},

    lote
      ? {
          lote: { contains: lote, mode: "insensitive" },
        }
      : {},

    galpao
      ? {
          nivel: {
            posicao: {
              rua: {
                galpao: {
                  name: { contains: galpao, mode: "insensitive" },
                },
              },
            },
          },
        }
      : {},

    rua
      ? {
          nivel: {
            posicao: {
              rua: {
                name: { contains: rua, mode: "insensitive" },
              },
            },
          },
        }
      : {},

    posicao
      ? {
          nivel: {
            posicao: {
              posicao: Number(posicao),
            },
          },
        }
      : {},

    nivel
      ? {
          nivel: {
            nivel: Number(nivel),
          },
        }
      : {},
  ],
};

    const [inventory, total]: [InventoryWithRelations[], number] =
  await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          lote: true,
          quantity: true,
          date: true,

          product: {
            select: {
              code: true,
              description: true,
            },
          },

          nivel: {
            select: {
              nivel: true,
              posicao: {
                select: {
                  posicao: true,
                  rua: {
                    select: {
                      name: true,
                      galpao: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      }),

      prisma.inventory.count({ where }),
    ]);

    const formattedEstoque = inventory.map((item) => ({
      id: item.id,
      productCode: item.product?.code || "N/A",
      productDescription: item.product?.description || "N/A",
      lote: item.lote || "Sem lote",
      quantity: item.quantity,
      date: item.date,
      galpao: item.nivel?.posicao?.rua?.galpao?.name || "N/A",
      rua: item.nivel?.posicao?.rua?.name || "N/A",
      posicao: item.nivel?.posicao?.posicao || 0,
      nivel: item.nivel?.nivel || 0,
    }));

    return NextResponse.json({
      items: formattedEstoque,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estoque" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { productId, lote, quantity, nivelId, date } = data;

    console.log("Recebendo dados:", {
      productId,
      lote,
      quantity,
      nivelId,
      date,
    });

    // Verifica se o produto existe
    const product = await prisma.catalog.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 },
      );
    }

    // Verifica se o nível existe
    const nivel = await prisma.nivel.findUnique({
      where: { id: nivelId },
    });

    if (!nivel) {
      return NextResponse.json(
        { error: "Localização não encontrada" },
        { status: 404 },
      );
    }

    // Cria o item no inventory
    const newInventory = await prisma.inventory.create({
      data: {
        productId,
        lote: lote || null,
        quantity: parseFloat(quantity),
        nivelId,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        product: true,
        nivel: {
          include: {
            posicao: {
              include: {
                rua: {
                  include: {
                    galpao: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log("Item criado:", newInventory);

    return NextResponse.json({
      success: true,
      item: {
        id: newInventory.id,
        productCode: newInventory.product.code,
        productDescription: newInventory.product.description,
        lote: newInventory.lote,
        quantity: newInventory.quantity,
        date: newInventory.date,
        galpao: newInventory.nivel.posicao.rua.galpao.name,
        rua: newInventory.nivel.posicao.rua.name,
        posicao: newInventory.nivel.posicao.posicao,
        nivel: newInventory.nivel.nivel,
      },
    });
  } catch (error) {
    console.error("Erro ao criar item no estoque:", error);
    return NextResponse.json(
      { error: "Erro ao criar item no estoque" },
      { status: 500 },
    );
  }
}
