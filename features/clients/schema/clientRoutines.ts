import z from "zod";

export const routineFormSchema = z
  .object({
    trainerId: z.number({ error: "El trainerId debe ser válido" }),
    name: z
      .string()
      .nonempty({ error: "El nombre de la rutina es obligatorio" }),
    description: z.string().nullable(),
    durationWeek: z
      .string()
      .nonempty({ error: "La semana de duración es obligatoria" })
      .transform((val) => Number(val))
      .refine((val) => val >= 1, {
        error: "La rutina debe tener mínimo una semana de duración",
      }),
    startDate: z.date({ error: "La rutina debe tener una fecha de comienzo" }),
    endDate: z.date({
      error: "La rutina debe tener una fecha de finalización",
    }),
    goal: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    const { startDate, endDate, durationWeek } = data;

    // 1. Validate that startDate is not greater than endDate
    if (startDate > endDate) {
      ctx.addIssue({
        path: ["startDate"],
        code: "custom",
        message:
          "La fecha de inicio no puede ser posterior a la fecha de finalización",
      });
      return; // do not continue with other validations
    }

    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInWeeks = diffInMs / (1000 * 60 * 60 * 24 * 7);

    const durationNumber = Number(durationWeek);

    // Minimum: at least 1 week
    if (durationNumber < 1) {
      ctx.addIssue({
        path: ["durationWeek"],
        code: "custom",
        message: "La rutina debe tener al menos una semana de duración",
      });
    }

    // Maximum: cannot exceed the actual date range
    if (durationNumber > Math.ceil(diffInWeeks)) {
      ctx.addIssue({
        path: ["durationWeek"],
        code: "custom",
        message:
          "La duración ingresada no puede superar el número de semanas entre la fecha de inicio y la fecha de fin",
      });
    }
  });

export type routineForm = z.infer<typeof routineFormSchema>;

export const routineFormInitialValues = {
  trainerId: [],
  name: [],
  description: [],
  durationWeek: [],
  startDate: [],
  endDate: [],
  goal: [],
};

export type RoutineFormErrors = {
  trainerId?: string[];
  name?: string[];
  description?: string[];
  durationWeek?: string[];
  startDate?: string[];
  endDate?: string[];
  goal?: string[];
};
