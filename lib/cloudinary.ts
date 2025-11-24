import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const MAX_SIZE = 5 * 1024 * 1024;
export async function uploadImage(
  buffer: Buffer,
  photo: File
): Promise<string> {
  if (photo.type && !photo.type.startsWith("image/")) {
    throw new Error("Solo se permiten archivos de imagen");
  }

  if (photo.size > MAX_SIZE) {
    throw new Error("La imagen no puede superar los 5 MB");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: uuid() },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}
