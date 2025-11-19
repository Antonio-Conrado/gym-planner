"use server";

import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import {
  paymentConceptErrors,
  paymentConceptInitialValues,
  paymentConceptSchema,
} from "../schema/paymentConceptShema";
import z from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePaymentConceptAction(
  id: number,
  initialState: InitialState<paymentConceptErrors>,
  formData: FormData
): Promise<InitialState<paymentConceptErrors>> {
  const amount = Number(formData.get("amount"));

  const validateFields = paymentConceptSchema.safeParse({ amount });
  if (!validateFields.success) {
    const errors = z.flattenError(validateFields.error);
    return {
      message: "Error",
      errors: errors.fieldErrors,
      status: status.CANCELED,
    };
  }

  try {
    await prisma.paymentConcept.update({
      where: { id },
      data: {
        amount,
      },
    });

    revalidatePath("/admin/catalogs");
    return {
      message: "El precio del concepto de pago se actualizó correctamente.",
      errors: paymentConceptInitialValues,
      status: status.COMPLETED,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: paymentConceptInitialValues,
      status: status.ERROR,
    };
  }
}
