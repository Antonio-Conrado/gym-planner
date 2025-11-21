import prisma from "@/lib/prisma";

export async function fetchTotalIncomeByYear(year: number) {
  try {
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);

    // Get the total income for the entire year
    const totalIncomeRaw = await prisma.$queryRaw<{ total: number }[]>`
      SELECT COALESCE(SUM(paymentConcept.amount), 0) AS total
      FROM "public"."Payment" payment
      LEFT JOIN "public"."PaymentConcept" paymentConcept
        ON paymentConcept.id = payment."paymentConceptId"
      WHERE payment."paidAt" >= ${startOfYear}
        AND payment."paidAt" < ${startOfNextYear};
    `;

    return [
      {
        period: year,
        income: Number(totalIncomeRaw[0].total),
      },
    ];
  } catch {
    return null;
  }
}

export async function fetchIncomeByMonth(year: number) {
  try {
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);

    // Retrieve the total income per month for the specified year, including months with no payments
    const monthlyIncomeRaw = await prisma.$queryRaw<
      { month: number; period: string; income: number }[]
    >`
      WITH months AS (
        SELECT generate_series(0,11) AS month
      )
      SELECT
        months.month,
        TO_CHAR(${startOfYear}::date + (months.month || ' month')::interval, 'Mon') AS period,
        COALESCE(SUM(paymentConcept.amount), 0) AS income
      FROM months
      LEFT JOIN "public"."Payment" payment
        ON EXTRACT(MONTH FROM payment."paidAt")::int - 1 = months.month
        AND payment."paidAt" >= ${startOfYear}
        AND payment."paidAt" < ${startOfNextYear}
      LEFT JOIN "public"."PaymentConcept" paymentConcept
        ON paymentConcept.id = payment."paymentConceptId"
      GROUP BY months.month
      ORDER BY months.month;
    `;

    const formatter = new Intl.DateTimeFormat("es-ES", { month: "short" });

    const monthlyIncome = monthlyIncomeRaw.map((m) => ({
      period: formatter.format(new Date(year, m.month)), // convierte número a nombre del mes en español
      month: m.month,
      income: Number(m.income),
    }));

    return monthlyIncome;
  } catch {
    return null;
  }
}

export async function fetchIncomeByDay(year: number, month: number) {
  try {
    // month: 0 = January, 11 = December
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0); // Last day of the month

    // Raw query to get total income per day including days with no payments
    const dailyIncomeRaw = await prisma.$queryRaw<
      { day: number; income: number }[]
    >`
      WITH days AS (
        SELECT generate_series(1, ${new Date(
          year,
          month + 1,
          0
        ).getDate()}) AS day
      )
      SELECT
        days.day,
        TO_CHAR(${start}::date + (days.day - 1) * interval '1 day', 'DD') AS name,
        COALESCE(SUM(paymentConcept.amount), 0) AS income
      FROM days
      LEFT JOIN "public"."Payment" payment
        ON EXTRACT(DAY FROM payment."paidAt")::int = days.day
        AND payment."paidAt" >= ${start}
        AND payment."paidAt" < ${end}
      LEFT JOIN "public"."PaymentConcept" paymentConcept
        ON paymentConcept.id = payment."paymentConceptId"
      GROUP BY days.day
      ORDER BY days.day;
    `;

    const dailyIncome = dailyIncomeRaw.map((d) => ({
      period: Number(d.day),
      income: Number(d.income),
    }));

    return dailyIncome;
  } catch {
    return null;
  }
}
