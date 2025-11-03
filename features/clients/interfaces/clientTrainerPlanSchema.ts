import { z } from "zod";
import { DaysOfWeek } from "@/app/generated/prisma";

export const clientTrainerPlanSchema = z.object({
  daysOfWeek: z.array(z.enum(DaysOfWeek, { error: "Día inválido" }), {
    error: "Debes seleccionar al menos un día de la semana",
  }),
});
