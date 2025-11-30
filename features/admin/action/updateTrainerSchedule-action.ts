"use server";

import { Schedule } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { status } from "@/shared/interfaces/initialStateAction";

export async function updateTrainerScheduleAction(schedules: Schedule[]) {
  try {
    if (schedules.length <= 0)
      throw new Error("La lista de horario no es válida");

    schedules.map(async (schedule) => {
      if (schedule.id > 0) {
        await prisma.schedule.update({
          where: { id: schedule.id },
          data: {
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          },
        });
      }

      if (schedule.id <= 0 && (schedule.startTime || schedule.endTime)) {
        await prisma.schedule.create({
          data: {
            trainerId: schedule.trainerId,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          },
        });
      }
    });

    return {
      message: "Horario actualizado correctamente",
      error: [],
      status: status.SUCCESS,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      error: [],
      status: status.ERROR,
    };
  }
}
