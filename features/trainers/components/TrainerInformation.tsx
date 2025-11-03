import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Star } from "lucide-react";

import { Prisma } from "@/app/generated/prisma";
import { getStarClasses } from "@/lib/helpers/getStarClasses";
import { auth } from "@/lib/auth";
import RequestTraining from "./RequestTraining";

type TrainerWithDetails = Prisma.UserGetPayload<{
  include: {
    Trainer: {
      include: {
        speciality: true;
        schedules: true;
      };
    };
  };
}>;

type Props = {
  user: TrainerWithDetails;
};

export default async function TrainerInformation({ user }: Props) {
  if (!user.Trainer) return null;
  const client = await auth();

  const starClasses = getStarClasses(Number(user.Trainer?.rating));
  return (
    <Card key={user.id}>
      <CardHeader className="flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="relative">
          <Image
            src={user.photo ?? ""}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover ring-2 ring-gray-100"
            height={120}
            width={120}
          />
        </div>
      </CardHeader>

      <CardContent>
        {/* Information */}
        <div className=" flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 mt-1 flex-wrap">
            {/* Stars */}
            <div className="flex items-center gap-1">
              {starClasses.map((cls, i) => (
                <Star key={i} className={cls} />
              ))}
            </div>

            {/* Reviews */}
            <span className="text-gray-500 text-sm">
              ({user.Trainer.votesCount} reseñas)
            </span>

            {/* speciality */}
            <span className="bg-orange-600 text-white px-2 py-0.5 rounded-md text-sm mx-auto">
              {user.Trainer.speciality.name}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <RequestTraining
          client={client}
          schedules={user.Trainer.schedules}
          trainerId={user.Trainer.id}
          trainerName={user.name}
        />
      </CardFooter>
    </Card>
  );
}
