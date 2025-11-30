"use server";

import { status } from "@/shared/interfaces/initialStateAction";
import { routineFormInitialValues } from "../schema/clientRoutines";
import { routineDetailForm } from "../schema/clientRoutineDetail";

export async function createClientRoutineAction(
  routineId: number,
  exercises: routineDetailForm[]
) {
  try {
    return {
      message:
        "¡Rutina registrada correctamente! Has definido la información general. El siguiente paso es agregar los detalles de ejercicios, sets, repeticiones entre otros datos",

      errors: routineFormInitialValues,
      status: status.SUCCESS,
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
