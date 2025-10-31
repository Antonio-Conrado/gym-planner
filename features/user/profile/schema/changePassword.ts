import * as z from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()

      .optional()
      .refine((val) => val === "", {
        error: "La contraseña actual es obligatoria",
      })
      .nullable(),
    password: z
      .string()
      .nonempty({ message: "La nueva contraseña es obligatoria" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "La contraseña debe tener al menos 6 caracteres, una letra, un número y un carácter especial"
      ),
    confirmPassword: z
      .string()
      .nonempty({ message: "Debes confirmar la contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type changePassword = z.infer<typeof changePasswordSchema>;

export const changePasswordInitialState = {
  currentPassword: [],
  password: [],
  confirmPassword: [],
};

export type changePasswordErrors = {
  currentPassword?: string[];
  password?: string[];
  confirmPassword?: string[];
};
