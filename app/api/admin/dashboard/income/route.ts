import { Role } from "@/app/generated/prisma";
import {
  fetchIncomeByDay,
  fetchIncomeByMonth,
  fetchTotalIncomeByYear,
} from "@/features/admin/lib/dashboardPayments";

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Authenticate the user
  const session = await auth();

  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "no_autorizado", message: "El usuario no está autenticado" },
      { status: 401 }
    );
  }

  // Check if the user has the ADMIN role
  if (session.user.role !== Role.ADMIN) {
    return NextResponse.json(
      {
        error: "prohibido",
        message: "Acceso restringido solo a administradores",
      },
      { status: 403 }
    );
  }

  const currentYear = new Date().getFullYear();
  const url = new URL(request.url);
  const totalYearParam = url.searchParams.get("totalYear");
  const yearParam = url.searchParams.get("year");
  const monthParam = url.searchParams.get("month");

  const totalYear = totalYearParam ? Number(totalYearParam) : undefined;
  const year = yearParam ? Number(yearParam) : currentYear;
  const month = monthParam ? Number(monthParam) : undefined;

  if (totalYear !== undefined) {
    // If 'totalYear' is specified → fetch income **for the entire year**
    const yearlyData = await fetchTotalIncomeByYear(year);
    if (!yearlyData) return NextResponse.json([]);
    return NextResponse.json(yearlyData);
  } else if (month !== undefined) {
    // If 'month' is provided → fetch income **by day** for that month
    const dailyData = await fetchIncomeByDay(year, month);
    if (!dailyData) return NextResponse.json([]);
    return NextResponse.json(dailyData);
  } else {
    // If no month is provided → fetch income **by month** for the year
    const monthlyData = await fetchIncomeByMonth(year);
    if (!monthlyData) return NextResponse.json([]);
    return NextResponse.json(monthlyData);
  }
}
