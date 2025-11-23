import { Role } from "@/app/generated/prisma";
import { fetchAdminClients } from "@/features/admin/lib/fetchAdminClients";
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

  // Parse query parameters from the URL
  const { searchParams } = new URL(req.url);
  const skip = Number(searchParams.get("skip")) || 0;
  const take = Number(searchParams.get("take")) || 10;
  const search = searchParams.get("search") || undefined;

  // Fetch clients
  const clients = await fetchAdminClients(skip, take, search);

  return NextResponse.json(clients);
}
