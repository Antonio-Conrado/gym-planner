import { fetchNotifications } from "@/features/notifications/lib/fetchNotifications";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Authenticate the user
  const session = await auth();

  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "unauthorized", message: "El usuario no está autenticado" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const userId = Number(searchParams.get("userId"));
  if (!userId) {
    return NextResponse.json(
      {
        error: "solicitud_invalida",
        message: "El parámetro 'userId' es requerido.",
      },
      { status: 400 }
    );
  }

  const notifications = await fetchNotifications(userId);
  return NextResponse.json(notifications);
}
