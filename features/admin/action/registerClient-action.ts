"use server";
import { InitialState, status } from "@/shared/interfaces/initialStateAction";
import {
  registerClientByAdminErrors,
  registerClientByAdminInitialState,
  registerClientByAdminSchema,
} from "../schema/registerClientByAdminSchema";
import z from "zod";
import { registerClientByAdmin } from "../schema/registerClientByAdminSchema";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/helpers/slugify";
import { DaysOfWeek, Role } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";

export async function registerClient(
  initialState: InitialState<
    registerClientByAdminErrors,
    registerClientByAdmin
  >,
  formData: FormData
): Promise<InitialState<registerClientByAdminErrors, registerClientByAdmin>> {
  const daysArray = formData.getAll("daysOfWeek") as string[];
  const wantsTrainerValue = formData.get("wantsTrainer") ? true : false;

  const fields = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() || null,
    telephone: formData.get("telephone")?.toString() || null,
    trainerId: formData.get("trainerId")?.toString() || null,
    daysOfWeek: daysArray.length ? daysArray.join(",") : null,
    wantsTrainer: wantsTrainerValue,
  };

  const validateFields = registerClientByAdminSchema.safeParse(fields);
  if (!validateFields.success) {
    const error = z.flattenError(validateFields.error);
    return {
      errors: error.fieldErrors,
      message: "",
      status: status.PENDING,
      data: fields,
    };
  }

  try {
    const { name, email, telephone, trainerId } = validateFields.data;

    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const finalUserEmail = await prisma.$transaction(async (prisma) => {
      const slugTemporary = `${slugify(name)}-${Date.now()}`;
      const newUser = await prisma.user.create({
        data: {
          name,
          slug: slugTemporary,
          email: email ?? `${slugTemporary}@gymPlanner.com`, // temporary email if none is provided
          role: Role.CLIENT,
          telephone,
          isFirstLogin: true,
          emailGeneratedByAdmin: email ? false : true,
          password: email ? null : hashedPassword,
        },
      });

      // Create final slug using user ID and name for unique
      const slug = `${newUser.id}-${slugify(name)}`;
      const finalEmail =
        email ?? `${newUser.id}-${slugify(name)}@gymPlanner.com`;

      await prisma.user.update({
        where: { id: newUser.id },
        data: { slug, email: finalEmail },
      });

      if (trainerId && validateFields.data.daysOfWeek) {
        await prisma.clientTrainerPlan.create({
          data: {
            trainerId: +trainerId,
            clientId: newUser.id,
            daysOfWeek: validateFields.data.daysOfWeek.split(
              ","
            ) as DaysOfWeek[],
          },
        });
      }
      return finalEmail;
    });

    return {
      errors: registerClientByAdminInitialState,
      message: "Se registró el cliente correctamente",
      data: {
        name: "",
        trainerId: null,
        email: null,
        daysOfWeek: null,
        telephone: null,
        wantsTrainer: undefined,

        generatedEmail: finalUserEmail,
        generatedPassword: tempPassword,
      },
      status: status.COMPLETED,
    };
  } catch (error) {
    return {
      errors: registerClientByAdminInitialState,
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      status: status.ERROR,
    };
  }
}
