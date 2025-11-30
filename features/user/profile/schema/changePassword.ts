import * as z from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: "El campo contraseña actual debe ser válido" })
      .optional()
      .nullable(),
    password: z
      .string({ error: "El campo nueva contraseña debe ser válido" })
      .nonempty({ message: "La nueva contraseña es obligatoria" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "La contraseña debe tener al menos 6 caracteres, una letra, un número y un carácter especial"
      ),
    confirmPassword: z
      .string({ error: "El campo confirmar contraseña debe ser válido" })
      .nonempty({ message: "Debes confirmar la contraseña" }),
    hasPassword: z.boolean(), //flag indicating if the user has a password
  })
  .refine(
    (data) => {
      if (data.hasPassword) {
        return !!data.currentPassword; // if the user has a password, currentPassword is required
      }
      return true; // if the user signed up with Google (no password), currentPassword is not required
    },
    {
      path: ["currentPassword"],
      message: "La contraseña actual es obligatoria",
    }
  )
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
