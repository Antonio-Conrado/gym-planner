import * as z from "zod";

export const trainerSchema = z.object({
  biography: z
    .string()
    .nonempty({ error: "La biografía es obligatoria" })
    .max(500, { error: "La descripción no puede superar 500 caracteres" }),
  specialityId: z.number({ error: "La especialidad es obligatoria" }),
});
export type TrainerFormData = z.infer<typeof trainerSchema>;

export const trainerInitialState = {
  biography: [],
  specialityId: [],
};

export type TrainerErrors = {
  biography?: string[];
  specialityId?: string[];
};
