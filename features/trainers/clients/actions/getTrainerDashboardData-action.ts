"use server";

import prisma from "@/lib/prisma";

export async function getTrainerDashboardData(trainerId: number) {
  try {
    const [totalClients, activeClients, totalRoutines] =
      await prisma.$transaction([
        prisma.clientTrainerPlan.count({
          where: { trainerId },
        }),
        prisma.clientTrainerPlan.count({
          where: {
            trainerId,
            client: {
              payments: {
                some: {
                  startDate: { lte: new Date() },
                  endDate: { gte: new Date() },
                },
              },
            },
          },
        }),
        prisma.routine.count({
          where: { trainerId },
        }),
      ]);

    return {
      totalClients,
      activeClients,
      totalRoutines,
    };
  } catch {
    return {
      totalClients: undefined,
      activeClients: undefined,
      totalRoutines: undefined,
    };
  }
}
