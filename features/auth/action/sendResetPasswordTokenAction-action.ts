"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { v4 as uuid } from "uuid";
import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import {
  sendResetPasswordToken,
  sendResetPasswordTokenErrors,
  sendResetPasswordTokenInitialState,
  sendResetPasswordTokenSchema,
} from "../schemas/sendResetTokenPasswordSchema";
import { sendForgotPasswordMail } from "@/lib/nodemailer";

export default async function sendResetPasswordTokenAction(
  initialState: InitialState<
    sendResetPasswordTokenErrors,
    sendResetPasswordToken
  >,
  formData: FormData
): Promise<InitialState<sendResetPasswordTokenErrors, sendResetPasswordToken>> {
  const validateField = sendResetPasswordTokenSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validateField.success) {
    const error = z.flattenError(validateField.error);
    return {
      message: "",
      errors: error.fieldErrors,
      status: status.SCHEMAERROR,
    };
  }
  try {
    const { email } = validateField.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("El usuario no existe");
    const tokenUUID = uuid();

    await prisma.user.update({
      where: { email },
      data: {
        tokenResetPassword: tokenUUID,
      },
    });

    const result = await sendForgotPasswordMail(email, {
      name: user.name,
      email: user.email,
      resetPasswordToken: tokenUUID,
    });
    if (!result.success) throw new Error(result.message);

    return {
      message:
        "Se ha enviado un correo con instrucciones para restablecer su contraseña",
      errors: sendResetPasswordTokenInitialState,
      status: status.SUCCESS,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: sendResetPasswordTokenInitialState,
      status: status.ERROR,
    };
  }
}
