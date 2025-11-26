import prisma from "@/lib/prisma";
import { ClientsTrainerResponse } from "../type/clientsTrainer";

export async function getClientsByTrainer(
  take = 10,
  skip = 0,
  trainerId: number,
  search?: string
): Promise<ClientsTrainerResponse> {
  const today = new Date();
  try {
    const [
      trainerClients,
      totalTrainerClients,
      totalFilteredTrainerClients,
      totalActiveClientsWithPayment,
    ] = await Promise.all([
      prisma.clientTrainerPlan.findMany({
        where: {
          trainerId,
          ...(search
            ? {
                OR: [
                  {
                    client: { name: { contains: search, mode: "insensitive" } },
                  },
                  {
                    client: {
                      email: { contains: search, mode: "insensitive" },
                    },
                  },
                ],
              }
            : {}),
        },
        include: {
          client: {
            select: {
              name: true,
              telephone: true,
              email: true,
              payments: {
                where: {
                  status: "COMPLETED",
                  startDate: { lte: today },
                  endDate: { gte: today },
                },
                select: {
                  startDate: true,
                  endDate: true,
                },
                orderBy: { endDate: "desc" },
                take: 1,
              },
            },
          },
        },
        orderBy: { id: "desc" },
        take,
        skip,
      }),

      prisma.clientTrainerPlan.count({
        where: {
          trainerId,
        },
      }),

      prisma.clientTrainerPlan.count({
        where: {
          trainerId,
          ...(search
            ? {
                OR: [
                  {
                    client: { name: { contains: search, mode: "insensitive" } },
                  },
                  {
                    client: {
                      email: { contains: search, mode: "insensitive" },
                    },
                  },
                ],
              }
            : {}),
        },
      }),

      prisma.clientTrainerPlan.count({
        where: {
          trainerId,
          client: {
            payments: {
              some: {
                status: "COMPLETED",
                startDate: { lte: today },
                endDate: { gte: today },
              },
            },
          },
        },
      }),
    ]);

    return {
      trainerClients,
      totalTrainerClients,
      totalFilteredTrainerClients,
      totalActiveClientsWithPayment,
    };
  } catch {
    return {
      trainerClients: [],
      totalTrainerClients: 0,
      totalFilteredTrainerClients: 0,
      totalActiveClientsWithPayment: 0,
    };
  }
}
