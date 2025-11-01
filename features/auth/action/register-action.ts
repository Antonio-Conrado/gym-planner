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
import { slugify } from "@/lib/helpers/slugify";

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

    await prisma.$transaction(async (prisma) => {
      const slugTemporary = `${slugify(name)}-${Date.now()}`;
      const newUser = await prisma.user.create({
        data: { name, slug: slugTemporary, email, password: hashPassword },
      });

      // Create final slug using user ID and name for unique, SEO-friendly URL
      const slug = `${newUser.id}-${slugify(name)}`;

      return prisma.user.update({
        where: { id: newUser.id },
        data: { slug },
      });
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
