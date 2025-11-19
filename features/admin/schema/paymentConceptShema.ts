import z from "zod";

export const paymentConceptSchema = z.object({
  amount: z
    .number("El precio del concepto de pago debe ser válido")
    .min(1, "El precio del concepto de pago debe ser válido"),
});

export type paymentConcept = z.infer<typeof paymentConceptSchema>;

export const paymentConceptInitialValues: paymentConceptErrors = {
  amount: [],
};

export type paymentConceptErrors = {
  amount?: string[];
};
