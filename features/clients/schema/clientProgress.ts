import { z } from "zod";

export const clientProgressFormSchema = z.object({
  weight: z
    .number({
      error: "El peso es obligatorio",
    })
    .positive("El peso debe ser mayor que cero"),
  height: z.number().nullable().optional(),
  chest: z.number().nullable().optional(),
  waist: z.number().nullable().optional(),
  hips: z.number().nullable().optional(),
  biceps: z.number().nullable().optional(),
  legs: z.number().nullable().optional(),
  calf: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type clientProgressForm = z.infer<typeof clientProgressFormSchema>;

export const clientProgressFormInitialValues = {
  weight: [],
  height: [],
  chest: [],
  waist: [],
  hips: [],
  biceps: [],
  legs: [],
  calf: [],
  notes: [],
};

export type clientProgressFormErrors = {
  weight?: string[];
  height?: string[];
  chest?: string[];
  waist?: string[];
  hips?: string[];
  biceps?: string[];
  legs?: string[];
  calf?: string[];
  notes?: string[];
};
