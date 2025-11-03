"use server";

import prisma from "@/lib/prisma";
import { InitialState, status } from "@/shared/interfaces/initialStateAction";

export async function markNotificationAsRead(
  id: number
): Promise<InitialState<[]>> {
  try {
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return {
      message: "La notificación fue marcada como leída correctamente.",
      status: status.SUCCESS,
      errors: [],
    };
  } catch {
    return {
      message:
        "No se pudo marcar la notificación como leída. Inténtalo nuevamente.",
      errors: [],
      status: status.ERROR,
    };
  }
}
