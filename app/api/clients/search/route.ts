import { Role } from "@/app/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "unauthorized", message: "El usuario no está autenticado" },
      { status: 401 }
    );
  }

  //Role validation (clients only)
  if (session.user.role !== Role.ADMIN) {
    return NextResponse.json(
      {
        error: "prohibido",
        message:
          "Acceso denegado. Solo usuarios con rol administrador pueden acceder.",
      },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const value = searchParams.get("value");
  if (!value)
    return NextResponse.json(
      {
        error: "solicitud_invalida",
        message: "El valor de búsqueda es obligatorio",
      },
      { status: 400 }
    );

  const clients = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: value, mode: "insensitive" } },
        { email: { contains: value, mode: "insensitive" } },
      ],
      role: { notIn: [Role.TRAINER, Role.ADMIN] },
    },
    take: 10,
  });

  return NextResponse.json(clients);
}
