import { Role } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function fetchAdminClients(skip = 0, take = 10, search?: string) {
  try {
    const [clients, filteredClientsCount, clientsTotal] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: Role.CLIENT,
          ...(search
            ? {
                OR: [
                  {
                    name: { contains: search, mode: "insensitive" },
                  },
                ],
              }
            : {}),
        },

        select: {
          id: true,
          name: true,
          email: true,
          telephone: true,
          status: true,
          createdAt: true,
          ClientTrainerPlan: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              daysOfWeek: true,
              trainer: {
                select: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { id: "desc" },
        take,
        skip,
      }),
      prisma.user.count({
        where: {
          role: Role.CLIENT,
          ...(search
            ? {
                OR: [
                  {
                    name: { contains: search, mode: "insensitive" },
                  },
                ],
              }
            : {}),
        },
      }),
      prisma.user.count({
        where: {
          role: Role.CLIENT,
        },
      }),
    ]);

    return {
      clients,
      filteredClientsCount,
      clientsTotal,
    };
  } catch {
    return { clients: [], filteredClientsCount: 0, clientsTotal: 0 };
  }
}
