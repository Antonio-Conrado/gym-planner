import { Role } from "@/app/generated/prisma";
import { paymentsClients } from "@/features/admin/lib/paymentsClient";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = Number((await params).id);
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
  if (!userId || isNaN(userId)) {
    return NextResponse.json(
      {
        error: "error",
        message: "El id para obtener los pagos del cliente es inválido",
      },
      { status: 401 }
    );
  }

  // Parse query parameters from the URL
  const { searchParams } = new URL(req.url);
  const skip = Number(searchParams.get("skip")) || 0;
  const take = Number(searchParams.get("take")) || 10;

  // Fetch clients for the trainer
  const paymentsClient = await paymentsClients(skip, take, userId);

  return NextResponse.json(paymentsClient);
}
