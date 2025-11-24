import prisma from "@/lib/prisma";

export async function paymentsClients(skip = 0, take = 10, id: number) {
  try {
    const [payments, paymentsStats] = await Promise.all([
      prisma.payment.findMany({
        where: {
          userId: id,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          paymentConcept: {
            select: {
              concept: true,
              amount: true,
            },
          },
        },
        orderBy: { id: "desc" },
        take,
        skip,
      }),

      prisma.payment.aggregate({
        where: {
          userId: id,
        },
        _sum: {
          price: true,
        },
        _count: true,
      }),
    ]);

    return {
      payments,
      totalPayments: paymentsStats._count,
      totalPaid: paymentsStats._sum.price ?? 0,
    };
  } catch {
    return { payments: [], totalPayments: 0, totalPaid: 0 };
  }
}
