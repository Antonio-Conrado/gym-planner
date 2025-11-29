import { DaysOfWeek, Role } from "@/app/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(req: Request) {
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

  const today = format(new Date(), "EEEE").toUpperCase() as DaysOfWeek;

  const trainersAvailable = await prisma.trainer.findMany({
    where: {
      status: true,
      schedules: {
        some: {
          dayOfWeek: today,
        },
      },
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return NextResponse.json(trainersAvailable);
}
