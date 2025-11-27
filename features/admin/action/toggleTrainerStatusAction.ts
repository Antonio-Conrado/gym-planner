"use server";

import { status } from "@/shared/interfaces/initialStateAction";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTrainerStatusAction(
  id: number,
  currentStatus: boolean
) {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!trainer || !trainer.userId) throw new Error("El entrenador no existe");

    await prisma.trainer.update({
      where: { id },
      data: {
        status: !currentStatus,
        deletedAt: !currentStatus ? null : new Date(),
      },
    });

    await prisma.$transaction([
      prisma.trainer.update({
        where: { id },
        data: {
          status: !currentStatus,
          deletedAt: !currentStatus ? new Date() : null,
        },
      }),

      prisma.user.update({
        where: { id: trainer.userId },
        data: {
          status: !currentStatus,
          deletedAt: !currentStatus ? new Date() : null,
        },
      }),
    ]);

    revalidatePath("/admin/catalogs");

    return {
      message: currentStatus
        ? "El entrenador fue desactivado correctamente."
        : "El entrenador fue reactivado correctamente.",
      errors: {},
      status: status.COMPLETED,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: {},
      status: status.ERROR,
    };
  }
}
