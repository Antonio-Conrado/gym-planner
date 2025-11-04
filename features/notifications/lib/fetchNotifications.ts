import { Notification } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { InitialState, status } from "@/shared/interfaces/initialStateAction";

export async function fetchNotifications(
  userId: number
): Promise<InitialState<[], Notification[]>> {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { id: "desc" },
    });

    return {
      message: "",
      status: status.SUCCESS,
      errors: [],
      data: notifications,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: [],
      data: [],
      status: status.ERROR,
    };
  }
}
