"use server";

import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import {
  registerPayment,
  registerPaymentErrors,
  registerPaymentSchema,
} from "../schema/registerPaymentSchema";
import z from "zod";
import {
  Concept,
  NotificationType,
  PaymentMethod,
} from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { calculateEndDate } from "@/lib/helpers/calculateEndDate";

export default async function registerPaymentAction(
  paymentConcept: string | undefined,
  paymentConceptAmount: number | undefined,
  initialState: InitialState<registerPaymentErrors, registerPayment>,
  formData: FormData
): Promise<InitialState<registerPaymentErrors, registerPayment>> {
  const startDateValue = formData.get("startDate")?.toString();
  const startDate = startDateValue ? new Date(startDateValue) : new Date();

  const fields: registerPayment = {
    userId: Number(formData.get("userId")),
    paymentConceptId: Number(formData.get("paymentConceptId")),
    method: (formData.get("method") as PaymentMethod) ?? "",
    reference: formData.get("reference")
      ? String(formData.get("reference"))
      : null,
    startDate,
  };

  const validateFields = registerPaymentSchema.safeParse(fields);

  if (!validateFields.success) {
    const errors = z.flattenError(validateFields.error);
    return {
      errors: errors.fieldErrors,
      message: "",
      status: status.CANCELED,
      data: fields,
    };
  }

  try {
    const { userId, paymentConceptId, method, reference } = validateFields.data;

    if (!paymentConcept || !paymentConceptAmount) {
      throw new Error("Debes seleccionar un concepto de pago.");
    }

    const endDate = calculateEndDate(
      validateFields.data.startDate,
      paymentConcept as Concept
    );

    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        AND: [{ startDate: { lte: endDate } }, { endDate: { gte: startDate } }],
      },
    });

    if (existingPayment) {
      throw new Error(
        "Este usuario ya tiene un pago en el rango de fecha seleccionado."
      );
    }

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          userId,
          paymentConceptId,
          price: paymentConceptAmount,
          method,
          reference,
          paidAt: new Date(),
          startDate: validateFields.data.startDate,
          endDate,
        },
      }),
      prisma.notification.create({
        data: {
          userId,
          type: NotificationType.PAYMENT,
          message: `Tu pago fue registrado correctamente del ${startDate.toLocaleDateString()} al ${endDate.toLocaleDateString()}.`,
        },
      }),
    ]);

    return {
      errors: {},
      message: "Pago registrado correctamente.",
      status: status.COMPLETED,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: {},
      status: status.ERROR,
    };
  }
}
