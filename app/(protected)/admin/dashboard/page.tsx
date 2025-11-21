import DashboardCard from "@/features/admin/components/dashboard/DashboardCard";
import PieChartComponent from "@/features/admin/components/dashboard/PieChartComponent";
import TimePeriodBarChart from "@/features/admin/components/dashboard/TimePeriodBarChart";
import {
  fetchAvailableYears,
  fetchDashboardKPIs,
} from "@/features/admin/lib/dashboardKPIs";

export default async function Page() {
  const {
    totalClientsCount,
    activeClientsCount,
    clientsWithTrainerCount,
    activeClientsWithoutTrainerCount,
    newClientsThisMonthCount,
    totalPaymentsIncome,
    chartDataByConceptCount,
    chartDataByConceptIncome,
  } = await fetchDashboardKPIs();

  const { years, initialYear } = await fetchAvailableYears();

  return (
    <div className="p-6">
      <DashboardCard
        totalClientsCount={totalClientsCount}
        activeClientsCount={activeClientsCount}
        clientsWithTrainerCount={clientsWithTrainerCount}
        activeClientsWithoutTrainerCount={activeClientsWithoutTrainerCount}
        newClientsThisMonthCount={newClientsThisMonthCount}
        totalPaymentsIncome={totalPaymentsIncome}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
        <PieChartComponent
          data={chartDataByConceptCount}
          title="Distribución de membresías"
          itemLabelSingular="cliente"
          itemLabelPlural="clientes"
          description="Porcentaje por tipo de plan"
        />
        <PieChartComponent
          data={chartDataByConceptIncome}
          title="Ingresos generados por membresías"
          money={true}
          description="Ingresos por tipo de plan"
        />
      </div>

      <TimePeriodBarChart
        title="Ingresos de Gym Planner"
        description="Total de ingresos generados"
        years={years}
        currentYear={initialYear}
      />
    </div>
  );
}
