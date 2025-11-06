import { formatDate } from "@/lib/helpers/formatDate";
import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import Image from "next/image";

type Props = {
  userProgressId: number | null;
};

export default async function ClientProgressPhotos({ userProgressId }: Props) {
  if (!userProgressId)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fotos de progreso</CardTitle>
          <CardDescription>No hay registros aún.</CardDescription>
        </CardHeader>
      </Card>
    );

  const photos = await prisma.progressPhoto.findMany({
    where: { userProgressId },
    orderBy: { id: "desc" },
    take: 5,
    skip: 0,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fotos de progreso</CardTitle>
        <CardDescription>Registro visual de la transformación</CardDescription>
      </CardHeader>

      <CardContent>
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 justify-items-center mx-auto">
                {photo.url.map((url, index) => (
                  <Image
                    key={index}
                    src={url ?? "/logo.png"}
                    alt={url}
                    height={300}
                    width={300}
                    className="object-fit rounded-lg"
                  />
                ))}
              </div>

              <p className="mt-2 text-gray-700">
                {formatDate(photo.createdAt.toString())}
              </p>

              <Separator className="mt-4" />
            </div>
          ))
        ) : (
          <p className="text-gray-700 mt-2">No hay registros aún.</p>
        )}
      </CardContent>
    </Card>
  );
}
