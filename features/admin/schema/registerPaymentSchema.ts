import { PaymentMethod } from "@/app/generated/prisma";
import z from "zod";

export const registerPaymentSchema = z
  .object({
    userId: z
      .number("El id del usuario es obligatorio")
      .min(1, "El cliente es obligatorio"),
    paymentConceptId: z
      .number("El id del concepto de pago es obligatorio")
      .min(1, "El concepto de pago es obligatorio"),
    method: z.enum(PaymentMethod, {
      error: "Selecciona un método de pago válido (efectivo o electrónico).",
    }),
    reference: z.string("").nullable(),
    startDate: z.date("La fecha debe ser válida"),
  })
  .superRefine((data, ctx) => {
    if (
      data.method === PaymentMethod.CARD ||
      (data.method === PaymentMethod.TRANSFER &&
        (!data.reference || data.reference.trim() === ""))
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["reference"],
        message:
          "Debes indicar el número o detalle de la transacción para transferencias o pagos con tarjeta.",
      });
    }
  });

export type registerPayment = z.infer<typeof registerPaymentSchema>;

export const registerPaymentInitialState: registerPaymentErrors = {
  userId: [],
  paymentConceptId: [],
  method: [],
  reference: [],
  startDate: [],
};

export type registerPaymentErrors = {
  userId?: string[];
  paymentConceptId?: string[];
  method?: string[];
  reference?: string[];
  startDate?: string[];
};
