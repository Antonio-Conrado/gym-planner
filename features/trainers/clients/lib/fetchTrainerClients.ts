import prisma from "@/lib/prisma";

export async function fetchTrainerClients(
  trainerId: number,
  skip = 0,
  take = 10,
  search?: string
) {
  const clients = await prisma.clientTrainerPlan.findMany({
    where: {
      trainerId,
      ...(search
        ? {
            OR: [
              { client: { name: { contains: search, mode: "insensitive" } } },
              { client: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      client: {
        select: {
          name: true,
          photo: true,
          email: true,
          telephone: true,
        },
      },
    },
    skip,
    take,
  });

  return { clients };
}
