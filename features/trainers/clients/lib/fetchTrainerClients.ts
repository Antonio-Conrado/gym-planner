import prisma from "@/lib/prisma";

export async function fetchTrainerClients(
  trainerId: number,
  skip = 0,
  take = 10,
  search?: string
) {
  try {
    const clients = await prisma.clientTrainerPlan.findMany({
      where: {
        trainerId,
        ...(search
          ? {
              OR: [
                { client: { name: { contains: search, mode: "insensitive" } } },
                {
                  client: { email: { contains: search, mode: "insensitive" } },
                },
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
    const totalClients = await prisma.clientTrainerPlan.count({
      where: {
        trainerId,
        ...(search
          ? {
              OR: [
                { client: { name: { contains: search, mode: "insensitive" } } },
                {
                  client: { email: { contains: search, mode: "insensitive" } },
                },
              ],
            }
          : {}),
      },
    });

    return { clients, totalClients };
  } catch {
    return {
      clients: [],
      totalClients: 0,
    };
  }
}
