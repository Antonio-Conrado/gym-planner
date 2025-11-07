"use server";

import { status } from "@/shared/interfaces/initialStateAction";
import { routineFormInitialValues } from "../schema/clientRoutines";
import { routineDetailForm } from "../schema/clientRoutineDetail";

export async function createClientRoutineAction(
  routineId: number,
  exercises: routineDetailForm[]
) {
  console.log(exercises);
  try {
    return {
      message:
        "¡Rutina registrada correctamente! Has definido la información general. El siguiente paso es agregar los detalles de ejercicios, sets, repeticiones entre otros datos",

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

// "use server";

// import { status } from "@/shared/interfaces/initialStateAction";
// import prisma from "@/lib/prisma";
// import { routineDetailForm } from "../schema/clientRoutineDetail";

// type Response = {
//   message: string;
//   status: status;
// };

// export async function createRoutineDetailsAction(
//   routineId: number,
//   exercises: routineDetailForm[]
// ): Promise<Response> {
//   if (!exercises || exercises.length === 0) {
//     return {
//       message: "No hay ejercicios para guardar.",
//       status: status.ERROR,
//     };
//   }

//   try {
//     // Guardar todos los ejercicios en bloque
//     await prisma.routineExercise.createMany({
//       data: exercises.map((ex) => ({
//         routineId,
//         daysOfWeek: ex.daysOfWeek,
//         name: ex.name,
//         muscle: ex.muscle,
//         sets: ex.sets,
//         reps: ex.reps,
//         notes: ex.notes || null,
//       })),
//     });

//     return {
//       message: "Ejercicios guardados correctamente",
//       status: status.COMPLETED,
//     };
//   } catch (error) {
//     return {
//       message: (error as Error).message || "Error al guardar los ejercicios",
//       status: status.ERROR,
//     };
//   }
// }
