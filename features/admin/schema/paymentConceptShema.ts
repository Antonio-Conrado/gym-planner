import z from "zod";

export const paymentConceptSchema = z.object({
  amount: z
    .number("El precio del concepto de pago debe ser válido")
    .min(1, "El precio del concepto de pago debe ser válido"),
  description: z.string().nonempty("La descripción es obligatoria"),
  includedServices: z
    .array(z.string().nonempty("Cada servicio no puede estar vacío"))
    .nonempty("Debe agregar al menos un servicio"),
});

export type paymentConcept = z.infer<typeof paymentConceptSchema>;

export const paymentConceptInitialValues: paymentConceptErrors = {
  amount: [],
  description: [],
  includedServices: [],
};

export type paymentConceptErrors = {
  amount?: string[];
  description?: string[];
  includedServices?: string[];
};
