import z from "zod";

export const rateTrainerSchema = z
  .object({
    rating: z
      .number({ error: "El rango de calificación es inválido" })
      .min(1, "La calificación mínima es 1")
      .max(5, "La calificación máxima es 5"),
    comment: z.string().nullable(),
    allowComment: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.allowComment && (!data.comment || data.comment.trim() === "")) {
      ctx.addIssue({
        path: ["comment"],
        message: "El comentario es obligatorio",
        code: "custom",
      });
    }
  });

export type rateTrainer = z.infer<typeof rateTrainerSchema>;

export const rateTrainerInitialValue = {
  rating: [],
  comment: [],
  allowComment: [],
};

export type rateTrainerErrors = {
  rating?: string[];
  comment?: string[];
  allowComment?: string[];
};
