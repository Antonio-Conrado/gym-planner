import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Star } from "lucide-react";

export default async function Page() {
  const trainers = await prisma.trainer.findMany({
    include: {
      speciality: true,
      user: {
        select: {
          name: true,
          slug: true,
          photo: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (!trainers.length) {
    return (
      <div className="flex justify-center items-center  min-h-[60vh] text-gray-700 text-lg">
        No hay entrenadores disponibles en este momento.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 mt-5 mb-10">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Encuentra tu entrenador ideal
        </h1>
        <p className="text-gray-600">
          Explora nuestro equipo de profesionales certificados.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer) => (
          <Card
            key={trainer.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="flex flex-col md:flex-row justify-center items-center gap-4">
              {/* Avatar */}
              <div className="relative ">
                <Image
                  src={
                    "https://images.unsplash.com/photo-1696563996353-214a3690bb11?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687"
                  }
                  alt={trainer.user.name}
                  className="w-28 h-28 rounded-full object-cover ring-2 ring-gray-100"
                  height={120}
                  width={120}
                />
              </div>

              {/* Information */}
              <div className="flex-1 flex flex-col justify-center">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {trainer.user.name}
                </CardTitle>

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 mt-1 flex-wrap">
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(Number(trainer.rating))
                            ? "fill-orange-500 text-orange-500"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Reviews */}
                  <span className="text-gray-500 text-sm">
                    ({trainer.votesCount} reseñas)
                  </span>

                  {/* speciality */}
                  <span className="bg-orange-600 text-white px-2 py-0.5 rounded-md text-sm">
                    {trainer.speciality.name}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Separator className="my-2" />
              <p className="text-gray-700 text-sm leading-relaxed">
                {trainer.biography || "Este entrenador aún no tiene biografía."}
              </p>
            </CardContent>

            <CardFooter>
              <Link
                href={`/trainers/${trainer.user.slug}`}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 w-full rounded-md text-center transition-colors"
              >
                Ver más detalles
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
