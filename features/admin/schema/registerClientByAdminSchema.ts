import * as z from "zod";

export const registerClientByAdminSchema = z
  .object({
    name: z.string().nonempty({ error: "El nombre es obligatorio" }),
    email: z.string().optional().nullable(),
    telephone: z.string().optional().nullable(),
    trainerId: z.string().nullable(),
    daysOfWeek: z.string().nullable(),
    wantsTrainer: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "El email es inválido",
      });
    }
    if (data.telephone && !/^[578]\d{7}$/.test(data.telephone.trim())) {
      ctx.addIssue({
        code: "custom",
        path: ["telephone"],
        message:
          "El teléfono debe comenzar con 5, 7 u 8 y tener exactamente 8 dígitos",
      });
    }

    if (data.trainerId) {
      const days = data.daysOfWeek?.split(",") || [];
      if (days.length === 0 || (days.length === 1 && days[0] === "")) {
        ctx.addIssue({
          code: "custom",
          path: ["daysOfWeek"],
          message: "Debe seleccionar al menos un día de entrenamiento",
        });
      }
    }
    if (data.daysOfWeek && !data.trainerId) {
      ctx.addIssue({
        code: "custom",
        path: ["trainerId"],
        message:
          "Si selecciona días de entrenamiento debe seleccionar un entrenador",
      });
    }

    if (data.wantsTrainer === true && !data.trainerId) {
      ctx.addIssue({
        code: "custom",
        path: ["wantsTrainer"],
        message: "Debe seleccionar un entrenador si desea uno",
      });
    }
  });

export type registerClientByAdmin = z.infer<typeof registerClientByAdminSchema>;

export const registerClientByAdminInitialState = {
  name: [],
  email: [],
  telephone: [],
  trainerId: [],
  daysOfWeek: [],
  wantsTrainer: [],
};
export type registerClientByAdminErrors = {
  name?: string[];
  email?: string[];
  telephone?: string[];
  trainerId?: string[];
  daysOfWeek?: string[];
  wantsTrainer?: string[];
};
