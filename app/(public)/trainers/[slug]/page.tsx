import prisma from "@/lib/prisma";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

import { Role } from "@/app/generated/prisma";
import TrainerInformation from "@/features/trainers/components/TrainerInformation";
import TrainerSchedule from "@/features/trainers/components/TrainerSchedule";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import TrainerReviews from "@/features/trainers/components/TrainerReviews";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: { slug, role: Role.TRAINER },
    include: {
      Trainer: {
        include: {
          speciality: true,
          schedules: {
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
          },
        },
      },
    },
  });

  if (!user || !user.Trainer) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-gray-700 text-lg gap-4">
        <div className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-md w-60">
          <MoveLeft className="w-4" />
          <Link
            href={"/trainers"}
            className="font-semibold text-gray-700 text-sm "
          >
            Volver a entrenadores
          </Link>
        </div>
        <p>No se encontró información para este entrenador.</p>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-14 px-6 min-h-[80vh]">
      <div className="block md:relative md:bottom-12 mb-4 md:mb-0 w-52 ">
        <div className="md:fixed md:z-10">
          <div
            className="flex items-center gap-2 
                  p-2 rounded-md 
                  bg-white/70 hover:bg-gray-200 backdrop-blur-sm 
                  md:bg-transparent md:backdrop-blur-0
                  shadow-sm md:shadow-none"
          >
            <MoveLeft className="w-4" />
            <Link
              href={"/trainers"}
              className="font-semibold text-gray-700 text-sm"
            >
              Volver a entrenadores
            </Link>
          </div>
        </div>
      </div>

      {/* information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1">
          <div className="sticky top-31">
            <TrainerInformation user={user} />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="md:col-span-2 flex flex-col gap-5 mt-1">
          <Card>
            <CardHeader>
              <CardTitle>Sobre mí</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{user.Trainer.biography}</CardDescription>
            </CardContent>
          </Card>

          <TrainerSchedule schedules={user.Trainer.schedules} />
          <TrainerReviews trainerId={user.Trainer.id} />
        </div>
      </div>
    </div>
  );
}
