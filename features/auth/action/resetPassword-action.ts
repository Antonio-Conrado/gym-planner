"use server";

import {
  changePassword,
  changePasswordErrors,
  changePasswordInitialState,
  changePasswordSchema,
} from "@/features/user/profile/schema/changePassword";
import prisma from "@/lib/prisma";
import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import z from "zod";

type Params = {
  userId?: number;
  token?: string;
};
export async function resetPasswordAction(
  params: Params,
  initialState: InitialState<changePasswordErrors, changePassword>,
  formData: FormData
): Promise<InitialState<changePasswordErrors, changePassword>> {
  const cookieStore = await cookies();

  const validateFields = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword") ?? null,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    hasPassword: formData.get("hasPassword") === "true",
  });

  if (!validateFields.success) {
    const errors = z.flattenError(validateFields.error);
    return {
      message: "",
      status: status.PENDING,
      errors: errors.fieldErrors,
    };
  }

  try {
    const { userId, token } = params;
    const { currentPassword, password } = validateFields.data;
    const newPassword = bcrypt.hashSync(password, 12);

    if (userId && currentPassword) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("Usuario no encontrado");

      const isValidPassword = bcrypt.compareSync(
        currentPassword,
        user.password!
      );
      if (!isValidPassword)
        return {
          message: "",
          errors: {
            ...changePasswordInitialState,
            currentPassword: ["La contraseña actual no coincide"],
          },
          status: status.SCHEMAERROR,
        };

      const isSamePassword = bcrypt.compareSync(password, user.password!);

      if (isSamePassword) {
        return {
          message: "",
          errors: {
            ...changePasswordInitialState,
            password: ["La nueva contraseña debe ser diferente a la anterior"],
          },
          status: status.SCHEMAERROR,
        };
      }
      if (user.isFirstLogin) {
        //change password in the db
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: newPassword,
            isFirstLogin: false,
          },
        });
      } else if (user.passwordGeneratedByAdmin) {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: newPassword,
            passwordGeneratedByAdmin: false,
          },
        });
      }

      //invalidate cookies
      cookieStore.delete("authjs.session-token");
      cookieStore.delete("authjs.csrf-token");
      cookieStore.delete("authjs.callback-url");
    } else if (token) {
      const isTokenValid = await prisma.user.findUnique({
        where: { tokenResetPassword: token },
      });

      if (!isTokenValid)
        throw new Error("Token para restablecer contraseña no es válido");

      await prisma.user.update({
        where: {
          tokenResetPassword: token,
        },
        data: {
          password: newPassword,
          tokenResetPassword: null,
        },
      });
    }

    const messageResponse = token
      ? "Tu contraseña ha sido restablecida correctamente. Por favor, inicia sesión con tu nueva contraseña."
      : "Tu contraseña ha sido cambiada exitosamente. Por favor, inicia sesión nuevamente para confirmar el cambio.";

    return {
      message: messageResponse,
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
