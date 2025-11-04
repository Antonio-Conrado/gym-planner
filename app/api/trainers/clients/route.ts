import { Role } from "@/app/generated/prisma";
import { fetchTrainerClients } from "@/features/trainers/clients/lib/fetchTrainerClients";
import { auth } from "@/lib/auth";
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

  // Check if the user has the TRAINER role
  if (session.user.role !== Role.TRAINER) {
    return NextResponse.json(
      { error: "prohibido", message: "Acceso restringido solo a entrenadores" },
      { status: 403 }
    );
  }

  // Parse query parameters from the URL
  const { searchParams } = new URL(req.url);
  const trainerId = Number(searchParams.get("trainerId"));
  const skip = Number(searchParams.get("skip")) || 0;
  const take = Number(searchParams.get("take")) || 10;
  const search = searchParams.get("search") || undefined;

  // Validate required parameter
  if (!trainerId) {
    return NextResponse.json(
      {
        error: "solicitud_invalida",
        message: "El parámetro 'trainerId' es obligatorio",
      },
      { status: 400 }
    );
  }

  // Fetch clients for the trainer
  const clients = await fetchTrainerClients(trainerId, skip, take, search);

  return NextResponse.json(clients);
}
