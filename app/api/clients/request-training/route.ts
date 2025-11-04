import { Role } from "@/app/generated/prisma";
import { fetchRequestTraining } from "@/features/clients/lib/fetchRequestTraining";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Authenticate the user
  const session = await auth();
  console.log(session);

  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "unauthorized", message: "El usuario no está autenticado" },
      { status: 401 }
    );
  }

  // Check if the user has the TRAINER role
  if (session.user.role !== Role.CLIENT) {
    return NextResponse.json(
      {
        error: "prohibido",
        message:
          "Acceso denegado. Solo usuarios con rol cliente pueden acceder.",
      },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const clientId = Number(searchParams.get("clientId"));
  if (!clientId) {
    return NextResponse.json(
      {
        error: "solicitud_invalida",
        message: "El parámetro 'clientId' es requerido.",
      },
      { status: 400 }
    );
  }

  const trainingRequest = await fetchRequestTraining(clientId);
  return NextResponse.json(trainingRequest);
}
