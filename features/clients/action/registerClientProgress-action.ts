"use server";

import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import {
  clientProgressFormErrors,
  clientProgressFormSchema,
} from "../schema/clientProgress";
import { clientProgressFormInitialValues } from "./../schema/clientProgress";
import z from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function registerClientProgressAction(
  userProgressId: number,
  initialState: InitialState<clientProgressFormErrors>,
  formData: FormData
): Promise<InitialState<clientProgressFormErrors>> {
  const validateFields = clientProgressFormSchema.safeParse({
    weight: Number(formData.get("weight")),
    height: formData.get("height") ? Number(formData.get("height")) : null,
    chest: formData.get("chest") ? Number(formData.get("chest")) : null,
    waist: formData.get("waist") ? Number(formData.get("waist")) : null,
    hips: formData.get("hips") ? Number(formData.get("hips")) : null,
    biceps: formData.get("biceps") ? Number(formData.get("biceps")) : null,
    legs: formData.get("legs") ? Number(formData.get("legs")) : null,
    calf: formData.get("calf") ? Number(formData.get("calf")) : null,
    notes: formData.get("notes")?.toString() || null,
  });

  if (!validateFields.success) {
    const errorTree = z.treeifyError(validateFields.error);
    return {
      message: "",
      errors: {
        weight: errorTree.properties?.weight?.errors,
        height: errorTree.properties?.height?.errors,
        chest: errorTree.properties?.chest?.errors,
        waist: errorTree.properties?.waist?.errors,
        hips: errorTree.properties?.hips?.errors,
        biceps: errorTree.properties?.biceps?.errors,
        legs: errorTree.properties?.legs?.errors,
        calf: errorTree.properties?.calf?.errors,
        notes: errorTree.properties?.notes?.errors,
      },
      status: status.SUCCESS,
    };
  }
  try {
    const data = validateFields.data;

    let userProgress = await prisma.userProgress.findUnique({
      where: { userId: userProgressId },
    });

    if (!userProgress) {
      userProgress = await prisma.userProgress.create({
        data: { userId: userProgressId, weight: data.weight },
      });
    }

    await prisma.userProgressHistory.create({
      data: {
        userProgressId: userProgress.id,
        weight: data.weight,
        height: data.height,
        chest: data.chest,
        waist: data.waist,
        hips: data.hips,
        biceps: data.biceps,
        legs: data.legs,
        calf: data.calf,
        notes: data.notes,
      },
    });

    revalidatePath(`/clients/${userProgressId}`);

    return {
      message: "Progreso registrado correctamente",
      errors: clientProgressFormInitialValues,
      status: status.ERROR,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: clientProgressFormInitialValues,
      status: status.ERROR,
    };
  }
}
