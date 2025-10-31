"use server";

import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import z from "zod";
import {
  TrainerErrors,
  trainerInitialState,
  trainerSchema,
} from "../schema/trainer";
import prisma from "@/lib/prisma";

export async function trainerAction(
  trainerId: number,
  initialState: InitialState<TrainerErrors>,
  formData: FormData
): Promise<InitialState<TrainerErrors>> {
  const validateFields = trainerSchema.safeParse({
    userId: Number(formData.get("userId")),
    biography: formData.get("biography"),
    specialityId: Number(formData.get("specialityId")),
  });

  if (!validateFields.success) {
    const errors = z.treeifyError(validateFields.error);
    return {
      message: "",
      errors: {
        biography: errors.properties?.biography?.errors,
        specialityId: errors.properties?.specialityId?.errors,
      },
      status: status.ERROR,
    };
  }

  try {
    const { biography, specialityId } = validateFields.data;

    await prisma.trainer.update({
      where: { id: trainerId },
      data: { biography, specialityId },
    });

    return {
      message: "Los datos del entrenador se actualizaron correctamente",
      errors: trainerInitialState,
      status: status.SUCCESS,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: trainerInitialState,
      status: status.ERROR,
    };
  }
}
