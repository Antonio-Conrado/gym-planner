import { Role } from "@/app/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ trainerId: string }> }
) {
  const trainerId = Number((await params).trainerId);
  // Authenticate the user
  const session = await auth();

  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "no_autorizado", message: "El usuario no está autenticado" },
      { status: 401 }
    );
  }

  // Check if the user has the ADMIN role
  if (session.user.role !== Role.ADMIN) {
    return NextResponse.json(
      {
        error: "prohibido",
        message: "Acceso restringido solo a administradores",
      },
      { status: 403 }
    );
  }
  if (!trainerId || isNaN(trainerId)) {
    return NextResponse.json(
      {
        error: "error",
        message: "El id para obtener los datos del entrenador es inválido",
      },
      { status: 401 }
    );
  }

  const schedules = await prisma.schedule.findMany({ where: { trainerId } });
  return NextResponse.json(schedules);
}
