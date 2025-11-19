"use server";

import { status } from "@/shared/interfaces/initialStateAction";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTrainerStatusAction(
  id: number,
  currentStatus: boolean
) {
  console.log(currentStatus);
  try {
    await prisma.trainer.update({
      where: { id },
      data: {
        status: !currentStatus,
        deletedAt: !currentStatus ? null : new Date(),
      },
    });

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
