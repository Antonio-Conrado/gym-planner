import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "El email es inválido" }),
  password: z.string().nonempty({ error: "La contraseña es obligatoria" }),
});

export type login = z.infer<typeof loginSchema>;
