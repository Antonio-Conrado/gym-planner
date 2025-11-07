import z from "zod";
import { DaysOfWeek } from "@/app/generated/prisma";

export const routineDetailFormSchema = z.object({
  daysOfWeek: z.enum(DaysOfWeek, {
    error: "Debes seleccionar  un día de la semana",
  }),
  name: z
    .string()
    .nonempty({ error: "El nombre del ejercicio es obligatorio" }),
  muscle: z.string().nonempty({ error: "El grupo muscular es obligatorio" }),
  sets: z.coerce
    .number({ error: "Los sets son obligatorios" })
    .int()
    .min(1, { message: "Debe haber al menos 1 set" }),
  reps: z.string().nonempty({ error: "Las repeticiones son obligatorias" }),
  notes: z.string().optional().nullable(),
});

export type routineDetailForm = z.infer<typeof routineDetailFormSchema>;

export const routineDetailFormInitialErrors = {
  daysOfWeek: [],
  name: [],
  muscle: [],
  sets: [],
  reps: [],
  notes: [],
};

export type routineDetailFormErrors = {
  daysOfWeek?: string[];
  name?: string[];
  muscle?: string[];
  sets?: string[];
  reps?: string[];
  notes?: string[];
};
