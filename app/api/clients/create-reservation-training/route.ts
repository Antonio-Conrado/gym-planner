// app/api/clients/create-reservation-training/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/app/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DAYS_OF_WEEK } from "@/lib/enum";
import { NotificationType } from "@/app/generated/prisma";

export async function POST(request: NextRequest) {
  // Authenticate the user
  const session = await auth();
  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "unauthorized", message: "El usuario no está autenticado" },
      { status: 401 }
    );
  }

  //Role validation (clients only)
  if (session.user.role !== Role.CLIENT) {
    return NextResponse.json(
      {
        error: "prohibido",
        message:
          "Acceso denegado. Solo usuarios con rol cliente pueden acceder.",
      },
      { status: 403 }
    );
  }

  try {
    const { trainerId, daysOfWeek, trainerName } = await request.json();
    const clientId = Number(session.user.id);
    const clientName = session.user.name;

    if (!trainerId || !daysOfWeek?.length || !trainerName) {
      return NextResponse.json(
        { message: "Datos incompletos", status: "ERROR" },
        { status: 400 }
      );
    }

    if (!daysOfWeek.every((day: string) => day in DAYS_OF_WEEK)) {
      return NextResponse.json(
        { message: "Los días seleccionados no son válidos", status: "ERROR" },
        { status: 400 }
      );
    }

    const now = new Date();

    const plan = await prisma.payment.findFirst({
      where: {
        userId: clientId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    const selectedDaysText = daysOfWeek
      .map((day: string) => DAYS_OF_WEEK[day as keyof typeof DAYS_OF_WEEK])
      .join(", ");

    const existingPlan = await prisma.clientTrainerPlan.findFirst({
      where: { clientId: clientId, trainerId },
    });

    if (existingPlan) {
      return NextResponse.json({
        message:
          "Ya tienes un plan activo con este entrenador. Si deseas modificar los días, comunícate con tu entrenador.",
        status: "ERROR",
      });
    }

    const clientNotificationMessage = plan
      ? `Has registrado tus días de entrenamiento con ${trainerName}: ${selectedDaysText}. ¡Prepárate para tus sesiones!`
      : `Has registrado tus días de entrenamiento con ${trainerName}: ${selectedDaysText}. ¡Prepárate para tus sesiones! Aún no tienes un plan activo, así que puedes adquirir uno en línea o dirigirte al gimnasio para realizar el pago en persona.`;

    await prisma.$transaction([
      prisma.clientTrainerPlan.create({
        data: { clientId, trainerId, daysOfWeek },
      }),
      prisma.notification.create({
        data: {
          userId: trainerId,
          type: NotificationType.TRAINING_REQUEST,
          message: `El cliente ${clientName} seleccionó los días: ${selectedDaysText}`,
          read: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId: clientId,
          type: NotificationType.GENERAL,
          message: clientNotificationMessage,
          read: false,
        },
      }),
    ]);

    return NextResponse.json({
      message:
        "¡Solicitud creada con éxito! El entrenador ha sido notificado de los días que seleccionaste.",
      status: "COMPLETED",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error)?.message ?? "Ocurrió un error",
        status: "ERROR",
      },
      { status: 500 }
    );
  }
}
