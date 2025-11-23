import prisma from "@/lib/prisma";

export async function fetchPaymentHistory(
  skip = 0,
  take = 10,
  search?: string
) {
  try {
    const [payments, filteredPaymentsCount, paymentsTotal] = await Promise.all([
      prisma.payment.findMany({
        where: {
          ...(search
            ? {
                OR: [
                  {
                    user: { name: { contains: search, mode: "insensitive" } },
                  },
                ],
              }
            : {}),
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
      prisma.payment.count({
        where: {
          ...(search
            ? {
                OR: [
                  {
                    user: { name: { contains: search, mode: "insensitive" } },
                  },
                ],
              }
            : {}),
        },
      }),
      prisma.payment.count(),
    ]);

    return {
      payments,
      filteredPaymentsCount,
      paymentsTotal,
    };
  } catch {
    return { payments: [], filteredPaymentsCount: 0, paymentsTotal: 0 };
  }
}
