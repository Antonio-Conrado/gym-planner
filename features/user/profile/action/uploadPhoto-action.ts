"use server";

import { uploadImage } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { InitialStatePhoto } from "@/shared/components/forms/UploadPhotoForm";
import { status } from "@/shared/interfaces/initialStateAction";
import { revalidatePath } from "next/cache";

export async function uploadPhotoAction(
  id: number,
  inititalState: InitialStatePhoto,
  formData: FormData
) {
  const photo = formData.get("photo") as File;
  if (!photo)
    return {
      message: "No hay foto",
      status: status.ERROR,
    };

  try {
    const buffer = Buffer.from(await photo.arrayBuffer());

    // Upload the image to Cloudinary and get the public URL
    const url = await uploadImage(buffer, photo);

    // Save the uploaded image URL in the user's database record
    await prisma.user.update({ where: { id }, data: { photo: url } });

    revalidatePath("/profile");

    return {
      message: "Imagen subida exitosamente",
      status: status.COMPLETED,
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      status: status.ERROR,
    };
  }
}
