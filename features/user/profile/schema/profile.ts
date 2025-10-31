import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().nonempty({ error: "El nombre es obligatorio" }),
  email: z.email({ error: "El email es inválido" }),
  telephone: z
    .string()
    .optional()
    .refine((val) => !val || /^[578]\d{7}$/.test(val), {
      message:
        "El teléfono debe comenzar con 5, 7 u 8 y tener exactamente 8 dígitos",
    })
    .nullable(),
});

export type profile = z.infer<typeof profileSchema>;

export const profileInitialState = {
  name: [],
  email: [],
  telephone: [],
};

export type profileErrors = {
  name?: string[];
  email?: string[];
  telephone?: string[];
};
