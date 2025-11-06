"use server";

import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import {
  RoutineFormErrors,
  routineFormInitialValues,
  routineFormSchema,
} from "../schema/clientRoutines";
import z from "zod";
import prisma from "@/lib/prisma";

export async function createClientRoutineAction(
  userProgressId: number,
  initialState: InitialState<RoutineFormErrors, number>,
  formData: FormData
): Promise<InitialState<RoutineFormErrors, number>> {
  const validateFields = routineFormSchema.safeParse({
    trainerId: Number(formData.get("trainerId")),
    name: formData.get("name"),
    description: formData.get("description"),
    durationWeek: formData.get("durationWeek"),
    startDate: new Date(formData.get("startDate") as string),
    endDate: new Date(formData.get("endDate") as string),
    goal: formData.get("goal"),
  });

  if (!validateFields.success) {
    const errors = z.treeifyError(validateFields.error);
    return {
      message: "",
      errors: {
        name: errors.properties?.name?.errors,
        description: errors.properties?.description?.errors,
        goal: errors.properties?.goal?.errors,
        durationWeek: errors.properties?.durationWeek?.errors,
        startDate: errors.properties?.startDate?.errors,
        endDate: errors.properties?.endDate?.errors,
        trainerId: errors.properties?.trainerId?.errors,
      },
      status: status.ERROR,
    };
  }

  try {
    const {
      name,
      description,
      goal,
      durationWeek,
      startDate,
      endDate,
      trainerId,
    } = validateFields.data;

    const existingRoutine = await prisma.routine.findFirst({
      where: {
        userProgressId,
        AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
      },
    });

    if (existingRoutine) {
      throw new Error(
        "Ya existe una rutina en ese rango de fechas para este usuario."
      );
    }

    const routine = await prisma.routine.create({
      data: {
        userProgressId,
        trainerId,
        name,
        description,
        goal,
        durationWeek,
        startDate,
        endDate,
      },
    });

    return {
      message:
        "¡Rutina registrada correctamente! Has definido la información general. El siguiente paso es agregar los detalles de ejercicios, sets, repeticiones entre otros datos",
      data: routine.id,
      errors: routineFormInitialValues,
      status: status.COMPLETED,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: routineFormInitialValues,
      status: status.ERROR,
    };
  }
}
// function normalizeDate(date: Date) {
//   return new Date(date.getFullYear(), date.getMonth(), date.getDate());
// }
