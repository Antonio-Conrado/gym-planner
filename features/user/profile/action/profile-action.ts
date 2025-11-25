"use server";

import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import {
  profileErrors,
  profileInitialState,
  profileSchema,
} from "../schema/profile";
import z from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function profileAction(
  initialState: InitialState<profileErrors>,
  formData: FormData
): Promise<InitialState<profileErrors>> {
  const validateFields = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
  });

  if (!validateFields.success) {
    const errors = z.treeifyError(validateFields.error);
    return {
      message: "",
      errors: {
        name: errors.properties?.name?.errors,
        email: errors.properties?.email?.errors,
        telephone: errors.properties?.telephone?.errors,
      },
      status: status.PENDING,
    };
  }

  try {
    const { name, email, telephone } = validateFields.data;

    await prisma.user.update({
      where: { email },
      data: { name, telephone: telephone ?? "" },
    });

    revalidatePath("/profile");

    return {
      message: "Perfil actualizado correctamente",
      errors: profileInitialState,
      status: status.SUCCESS,
    };
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      return {
        message: "El email está duplicado",
        errors: profileInitialState,
        status: status.ERROR,
      };
    }

    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: profileInitialState,
      status: status.ERROR,
    };
  }
}
