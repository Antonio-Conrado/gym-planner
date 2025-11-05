import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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

  // Parse query parameters from the URL
  const { searchParams } = new URL(req.url);
  const userProgressId = Number(searchParams.get("userProgressId"));
  const skip = Number(searchParams.get("skip")) || 0;
  const take = Number(searchParams.get("take")) || 10;

  // Validate required parameter
  if (!userProgressId) {
    return NextResponse.json(
      {
        error: "solicitud_invalida",
        message: "El parámetro 'userProgressId' es obligatorio",
      },
      { status: 400 }
    );
  }

  const userProgressHistory = await prisma.userProgressHistory.findMany({
    where: { userProgressId },
    orderBy: { recordedAt: "desc" },
    take,
    skip,
  });

  return NextResponse.json({ userProgressHistory });
}
