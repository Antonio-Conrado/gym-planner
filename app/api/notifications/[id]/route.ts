import { NotificationType } from "@/app/generated/prisma";
import { fetchNotifications } from "@/features/notifications/lib/fetchNotifications";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = Number((await params).id);

  // Authenticate the user
  const session = await auth();
  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "unauthorized", message: "El usuario no está autenticado" },
      { status: 401 }
    );
  }
  if (!userId || isNaN(userId)) {
    return NextResponse.json(
      {
        error: "error",
        message: "El id para obtener las notificaciones es inválido",
      },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const takeParam = searchParams.get("take");
  const skipParam = searchParams.get("skip");
  const typeParam = searchParams.get("typeNotifications");
  const isReadParam = searchParams.get("isRead");

  const take = takeParam ? Number(takeParam) : undefined;
  const skip = skipParam ? Number(skipParam) : undefined;
  const type = typeParam !== null ? (typeParam as NotificationType) : undefined;

  const isRead =
    isReadParam === null
      ? undefined
      : isReadParam === "true"
      ? true
      : isReadParam === "false"
      ? false
      : undefined;

  const notifications = await fetchNotifications({
    userId,
    type,
    isRead,
    take,
    skip,
  });

  return NextResponse.json(notifications);
}
