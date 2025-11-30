"use server";

import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import {
  rateTrainer,
  rateTrainerErrors,
  rateTrainerInitialValue,
  rateTrainerSchema,
} from "../schema/rateTrainerSchema";
import z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function RateTrainerAction(
  trainerId: number,
  slug: string,
  initialState: InitialState<rateTrainerErrors, rateTrainer>,
  formData: FormData
): Promise<InitialState<rateTrainerErrors, rateTrainer>> {
  const client = await auth();

  if (!client) {
    return {
      errors: {},
      message: "Debes iniciar sesión para calificar",
      status: status.ERROR,
    };
  }

  const fields = {
    rating: Number(formData.get("rating")),
    comment: String(formData.get("comment") ?? "").trim(),
    allowComment: formData.get("allowComment") === "true",
  };

  const validateFields = rateTrainerSchema.safeParse(fields);

  if (!validateFields.success) {
    const errors = z.flattenError(validateFields.error);
    return {
      errors: errors.fieldErrors,
      message: "",
      data: {
        rating: fields.rating,
        comment: fields.comment,
        allowComment: fields.allowComment,
      },
      status: status.PENDING,
    };
  }
  try {
    const { rating, comment } = validateFields.data;
    await prisma.trainerReview.create({
      data: {
        trainerId,
        clientId: +client.user.id,
        rating,
        comment: comment?.trim() === "" ? null : comment,
      },
    });

    // recalculate trainer rating and votesCount based on submitted reviews
    await prisma.$executeRaw`
      UPDATE "Trainer" t
      SET
        "rating" = sub.avg_rating,
        "votesCount" = sub.count_votes
      FROM (
        SELECT 
          "trainerId",
          AVG("rating")::float AS avg_rating,
          COUNT(*) AS count_votes
        FROM "TrainerReview"
        WHERE "trainerId" = ${trainerId}
        GROUP BY "trainerId"
      ) sub
      WHERE t.id = sub."trainerId";
    `;

    revalidatePath(`/trainers/${slug}`);
    return {
      errors: rateTrainerInitialValue,
      message: "¡Has calificado al entrenador exitosamente!",
      status: status.SUCCESS,
    };
  } catch (error) {
    return {
      errors: rateTrainerInitialValue,
      message:
        (error as Error)?.message ??
        "Ocurrio un error. Por favor intenta de nuevo",
      status: status.ERROR,
    };
  }
}
