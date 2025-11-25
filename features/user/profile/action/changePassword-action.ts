"use server";

import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import z from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  changePasswordErrors,
  changePasswordInitialState,
  changePasswordSchema,
} from "../schema/changePassword";

export async function changePasswordAction(
  id: number,
  initialState: InitialState<changePasswordErrors>,
  formData: FormData
): Promise<InitialState<changePasswordErrors>> {
  const hasPasswordValue = formData.get("hasPassword");
  const hasPassword = hasPasswordValue === "true";

  const validateFields = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    hasPassword,
  });

  if (!validateFields.success) {
    const errors = z.treeifyError(validateFields.error);
    return {
      message: "",
      errors: {
        currentPassword: errors.properties?.currentPassword?.errors,
        password: errors.properties?.password?.errors,
        confirmPassword: errors.properties?.confirmPassword?.errors,
      },
      status: status.PENDING,
    };
  }

  try {
    const { currentPassword, password } = validateFields.data;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("No se pudo encontrar al usuario");

    if (user.password && currentPassword) {
      const isValidCurrentPassword = bcrypt.compareSync(
        currentPassword,
        user.password
      );
      if (!isValidCurrentPassword)
        throw new Error(
          "La contraseña actual ingresada no es correcta. Por favor, verifica e inténtalo de nuevo."
        );
    }

    const newPassword = bcrypt.hashSync(password, 12);
    await prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
    return {
      message: "Contraseña actualizada correctamente",
      errors: changePasswordInitialState,
      status: status.SUCCESS,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: changePasswordInitialState,

      status: status.ERROR,
    };
  }
}
