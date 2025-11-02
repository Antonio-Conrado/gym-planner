import { Trainer } from "@/app/generated/prisma";
import { formatDate } from "@/lib/helpers/formatDate";
import { getStarClasses } from "@/lib/helpers/getStarClasses";
import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Star } from "lucide-react";

type Props = {
  trainerId: Trainer["id"];
};

export default async function TrainerReviews({ trainerId }: Props) {
  const reviews = await prisma.trainerReview.findMany({
    where: { trainerId },
    include: {
      trainer: { select: { rating: true } },
      client: { select: { name: true } },
    },
    orderBy: { id: "asc" },
    take: 10,
    skip: 0,
  });

  return (
    <Card className="p-3 col-span-2">
      <CardHeader>
        <CardTitle>Reseña de clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.map((review, index) => {
          const starClasses = getStarClasses(Number(review.rating));

          return (
            <div key={review.id} className="mb-4">
              <div className="flex justify-between">
                <h3>{review.client.name}</h3>
                <p className="text-gray-500">
                  {formatDate(review.createdAt.toString())}
                </p>
              </div>

              <div className="flex mt-1">
                {starClasses.map((cls: string, i: number) => (
                  <Star key={i} className={`${cls} h-4`} />
                ))}
              </div>

              <p className="mt-1 text-gray-700 text-sm italic">
                {`"${review.comment ?? "No hay reseña"}"`}
              </p>

              {index !== reviews.length - 1 && <Separator className="my-2" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
