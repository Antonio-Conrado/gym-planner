"use server";
import z from "zod";
import bcrypt from "bcrypt";
import { InitialState, status } from "@/shared/interfaces/initialStateAction";

import prisma from "@/lib/prisma";
import {
  registerErrors,
  registerInitialState,
  registerSchema,
} from "../schemas/register";

export async function registerAction(
  initialState: InitialState<registerErrors>,
  formData: FormData
) {
  const validateFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    const errorTree = z.treeifyError(validateFields.error);
    return {
      message: "",
      errors: {
        name: errorTree.properties?.name?.errors,
        email: errorTree.properties?.email?.errors,
        password: errorTree.properties?.password?.errors,
      },
      status: status.ERROR,
    };
  }

  try {
    const { name, email, password } = validateFields.data;
    const hashPassword = bcrypt.hashSync(password, 12);

    await prisma.user.create({
      data: { name, email, password: hashPassword },
    });

    return {
      message: "Usuario registrado correctamente",
      errors: registerInitialState,
      status: status.SUCCESS,
    };
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      return {
        message: "El email está duplicado",
        errors: registerInitialState,
        status: status.ERROR,
      };
    }

    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: registerInitialState,
      status: status.ERROR,
    };
  }
}
