import * as z from "zod";

export const sendResetPasswordTokenSchema = z.object({
  email: z.email({ error: "El email es inválido" }),
});

export type sendResetPasswordToken = z.infer<
  typeof sendResetPasswordTokenSchema
>;

export const sendResetPasswordTokenInitialState = {
  email: [],
};
export type sendResetPasswordTokenErrors = {
  email?: string[];
};
