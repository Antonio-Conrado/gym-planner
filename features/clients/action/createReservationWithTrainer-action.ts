"use server";
import prisma from "@/lib/prisma";
import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import { clientTrainerPlanSchema } from "../interfaces/clientTrainerPlanSchema";
import { DAYS_OF_WEEK } from "@/lib/enum";
import { NotificationType } from "@/app/generated/prisma";

type Props = {
  clientId: number;
  clientName: string;
  trainerId: number;
  trainerName: string;
  daysOfWeek: string[];
};
export async function createReservationWithTrainerAction({
  clientId,
  clientName,
  trainerId,
  trainerName,
  daysOfWeek,
}: Props): Promise<InitialState<[]>> {
  const now = new Date();

  const validatedFields = clientTrainerPlanSchema.safeParse({
    clientId,
    trainerId,
    daysOfWeek,
  });

  try {
    if (!validatedFields.success) {
      throw new Error("Los días seleccionados no son válidos");
    }

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

    // Convert enum days to readable text in Spanish
    const selectedDaysText = validatedFields.data.daysOfWeek
      .map((day) => DAYS_OF_WEEK[day as keyof typeof DAYS_OF_WEEK])
      .join(", "); // "Lunes, Miércoles, Viernes. etc"

    const existingPlan = await prisma.clientTrainerPlan.findFirst({
      where: {
        clientId,
        trainerId,
      },
    });

    if (existingPlan) {
      throw new Error(
        "Ya tienes un plan activo con este entrenador. Si deseas modificar los días, comunícate con tu entrenador."
      );
    }

    await prisma.$transaction([
      prisma.clientTrainerPlan.create({
        data: {
          clientId,
          trainerId,
          daysOfWeek: validatedFields.data.daysOfWeek,
        },
      }),

      // Trainer notification
      prisma.notification.create({
        data: {
          userId: trainerId,
          type: NotificationType.TRAINING_REQUEST,
          message: `El cliente ${clientName} seleccionó los días de entrenamiento siguientes: ${selectedDaysText}`,
          read: false,
        },
      }),

      // Client notification
      prisma.notification.create({
        data: {
          userId: clientId,
          type: NotificationType.GENERAL,
          message: `Has registrado tus días de entrenamiento con ${trainerName}: ${selectedDaysText}. ¡Prepárate para tus sesiones!`,
          read: false,
        },
      }),
    ]);

    return {
      message:
        "¡Solicitud creada con éxito! El entrenador ha sido notificado de los días que seleccionaste.",
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
