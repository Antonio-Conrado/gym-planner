import InfoCard from "@/shared/components/dashboard/InfoCard";
import {
  Users,
  UserCheck,
  UserMinus,
  UserPlus,
  DollarSign,
} from "lucide-react";

type Props = {
  totalClientsCount: number;
  activeClientsCount: number;
  clientsWithTrainerCount: number;
  activeClientsWithoutTrainerCount: number;
  newClientsThisMonthCount: number;
  totalPaymentsIncome: number;
};

export default function DashboardCard({
  totalClientsCount,
  activeClientsCount,
  clientsWithTrainerCount,
  activeClientsWithoutTrainerCount,
  newClientsThisMonthCount,
  totalPaymentsIncome,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
      <InfoCard
        title="Clientes Totales"
        value={totalClientsCount.toString()}
        description="Todos los clientes registrados"
        icon={<Users className="w-6 h-6 text-blue-500" />}
      />
      <InfoCard
        title="Clientes Activos"
        value={activeClientsCount.toString()}
        description="Clientes con pagos activos"
        icon={<UserCheck className="w-6 h-6 text-green-500" />}
      />
      <InfoCard
        title="Clientes con Entrenador"
        value={clientsWithTrainerCount.toString()}
        description="Clientes activos asignados a un entrenador"
        icon={<UserPlus className="w-6 h-6 text-purple-500" />}
      />
      <InfoCard
        title="Clientes Activos Libres"
        value={activeClientsWithoutTrainerCount.toString()}
        description="Clientes activos sin entrenador"
        icon={<UserMinus className="w-6 h-6 text-orange-500" />}
      />
      <InfoCard
        title="Nuevos Clientes del Mes"
        value={newClientsThisMonthCount.toString()}
        description="Clientes registrados este mes"
        icon={<UserPlus className="w-6 h-6 text-teal-500" />}
      />
      <InfoCard
        title="Ingresos Totales"
        value={`C$ ${totalPaymentsIncome.toLocaleString()}`}
        description="Ingresos totales por pagos"
        icon={<DollarSign className="w-6 h-6 text-yellow-500" />}
      />
    </div>
  );
}
