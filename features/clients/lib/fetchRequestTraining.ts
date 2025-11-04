import prisma from "@/lib/prisma";
import { InitialState, status } from "@/shared/interfaces/initialStateAction";

export async function fetchRequestTraining(
  clientId: number
): Promise<InitialState<[]>> {
  try {
    const now = new Date();

    const plan = await prisma.payment.findFirst({
      where: {
        userId: clientId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    if (!plan)
      throw new Error(
        "No tienes un plan activo para solicitar entrenamiento. Por favor, selecciona un plan para continuar."
      );

    return {
      message: "",
      errors: [],
      status: status.COMPLETED,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: [],
      status: status.ERROR,
    };
  }
}
