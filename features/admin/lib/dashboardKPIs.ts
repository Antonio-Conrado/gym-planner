import { Role } from "@/app/generated/prisma";
import { CONCEPT } from "@/lib/enum";
import prisma from "@/lib/prisma";

async function fetchClientCounts() {
  const today = new Date();

  const [
    totalClientsCount,
    activeClientsCount,
    clientsWithTrainerCount,
    activeClientsWithoutTrainerCount,
    newClientsThisMonthCount,
  ] = await Promise.all([
    // Total registered clients
    prisma.user.count({ where: { role: Role.CLIENT } }),

    // Active clients with current payments
    prisma.user.count({
      where: {
        role: Role.CLIENT,
        payments: {
          some: { startDate: { lte: today }, endDate: { gte: today } },
        },
      },
    }),

    // Active clients with a trainer plan
    prisma.user.count({
      where: {
        role: Role.CLIENT,
        payments: {
          some: { startDate: { lte: today }, endDate: { gte: today } },
        },
        ClientTrainerPlan: { some: {} },
      },
    }),

    // Active clients without a trainer plan (free clients)
    prisma.user.count({
      where: {
        role: Role.CLIENT,
        payments: {
          some: { startDate: { lte: today }, endDate: { gte: today } },
        },
        ClientTrainerPlan: { none: {} },
      },
    }),

    // New clients registered this month
    prisma.user.count({
      where: {
        role: Role.CLIENT,
        createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
      },
    }),
  ]);

  return {
    totalClientsCount,
    activeClientsCount,
    clientsWithTrainerCount,
    activeClientsWithoutTrainerCount,
    newClientsThisMonthCount,
  };
}

async function fetchPayments() {
  try {
    // Calculate the total income (sum of all payment prices) and the total number of payments
    const payments = await prisma.payment.aggregate({
      _sum: { price: true },
      _count: { id: true },
    });
    // total income from all payments
    const totalPaymentsIncome = payments._sum.price ?? 0;

    // Count total number of payments
    const totalPaymentsCount = payments._count.id ?? 0;

    // Return payments list along with total income and count
    return { payments, totalPaymentsIncome, totalPaymentsCount };
  } catch {
    return { payments: null, totalPaymentsIncome: 0, totalPaymentsCount: 0 };
  }
}

async function generatePaymentsChartData() {
  try {
    const rawData = await prisma.$queryRaw<
      {
        conceptId: number;
        name: string;
        count: bigint;
        percentage: string;
      }[]
    >`
      SELECT
        concept.id AS "conceptId",
        concept.concept AS "name",
        COUNT(payment.id) AS "count",
        CASE
          WHEN (SELECT COUNT(*) FROM "public"."Payment") > 0
          THEN (COUNT(payment.id) * 100.0 / (SELECT COUNT(*) FROM "public"."Payment"))
          ELSE 0
        END AS "percentage"
      FROM "public"."PaymentConcept" concept
      LEFT JOIN "public"."Payment" payment 
        ON payment."paymentConceptId" = concept.id
      GROUP BY concept.id, concept.concept
      ORDER BY concept.id;
    `;

    const chartData = rawData.map((item) => ({
      conceptId: Number(item.conceptId),
      name: CONCEPT[item.name as keyof typeof CONCEPT],
      count: Number(item.count),
      percentage: Number(item.percentage),
    }));

    return chartData;
  } catch {
    return [];
  }
}

export async function generateMembershipIncomeChartData() {
  try {
    const rawData = await prisma.$queryRaw<
      {
        conceptId: number;
        name: string;
        total: number;
        percentage: number;
      }[]
    >`
      WITH total_income AS (
        SELECT COALESCE(SUM(price), 0) AS total
        FROM "public"."Payment"
      )
      SELECT
        concept.id AS "conceptId",
        concept.concept AS "name",
        COALESCE(SUM(payment.price), 0) AS total,
        CASE
          WHEN (SELECT total FROM total_income) > 0
          THEN (COALESCE(SUM(payment.price), 0) * 100.0 / (SELECT total FROM total_income))
          ELSE 0
        END AS "percentage"
      FROM "public"."PaymentConcept" concept
      LEFT JOIN "public"."Payment" payment
        ON payment."paymentConceptId" = concept.id
      GROUP BY concept.id, concept.concept
      ORDER BY concept.id
      ;
    `;

    const chartData = rawData.map((item) => ({
      conceptId: Number(item.conceptId),
      name: CONCEPT[item.name as keyof typeof CONCEPT],
      count: Number(item.total), // total income of that membership
      percentage: Number(item.percentage), // percentage relative to the total
    }));

    return chartData;
  } catch {
    return [];
  }
}

//* Main function to fetch all dashboard KPIs
export async function fetchDashboardKPIs() {
  try {
    // Fetch counts of clients (total, active, with/without trainer, new this month)
    const clientCounts = await fetchClientCounts();

    //Fetch all payments and calculate total income and total number of payments
    const { totalPaymentsIncome, totalPaymentsCount } = await fetchPayments();

    // Chart showing the number of payments per concept
    const chartDataByConceptCount = await generatePaymentsChartData();

    // Chart showing total income grouped by membership/payment concept
    const chartDataByConceptIncome = await generateMembershipIncomeChartData();

    // Return combined dashboard data
    return {
      ...clientCounts,
      totalPaymentsIncome,
      totalPaymentsCount,
      chartDataByConceptCount,
      chartDataByConceptIncome,
    };
  } catch {
    return {
      totalClientsCount: 0,
      activeClientsCount: 0,
      clientsWithTrainerCount: 0,
      activeClientsWithoutTrainerCount: 0,
      newClientsThisMonthCount: 0,
      totalPaymentsIncome: 0,
      chartDataByConceptCount: [],
      chartDataByConceptIncome: [],
    };
  }
}

//* Fetch all years in which payments exist, for use in the bar chart
export async function fetchAvailableYears() {
  const currentYear = new Date().getFullYear();
  try {
    // Fetch all unique years from payments, sorted descending (latest year first)
    const yearsRaw = await prisma.$queryRaw<{ year: number }[]>`
      SELECT DISTINCT EXTRACT(YEAR FROM "paidAt")::int AS year
      FROM "public"."Payment"
      ORDER BY year DESC;
    `;

    const years = yearsRaw.map((y) => y.year);
    const initialYear = years.includes(currentYear)
      ? currentYear
      : years[0] || currentYear;

    return {
      years,
      initialYear,
    };
  } catch {
    return { years: [], initialYear: 0 };
  }
}
