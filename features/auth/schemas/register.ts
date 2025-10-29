import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().nonempty({ error: "El nombre es obligatorio" }),
  email: z.email({ error: "El email es inválido" }),
  password: z
    .string()
    .nonempty({ error: "La contraseña es obligatoria" })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "La contraseña debe tener al menos 6 caracteres, una letra, un número y un carácter especial"
    ),
});

export type register = z.infer<typeof registerSchema>;

export const registerInitialState = {
  name: [],
  email: [],
  password: [],
};
export type registerErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
};
