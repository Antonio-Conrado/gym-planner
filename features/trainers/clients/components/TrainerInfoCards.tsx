import InfoCard from "@/shared/components/dashboard/InfoCard";
import { Activity, Dumbbell, Users } from "lucide-react";

type Props = {
  totalClients: number | undefined;
  activeClients: number | undefined;
  totalRoutines: number | undefined;
};

export default async function TrainerInfoCards({
  totalClients,
  activeClients,
  totalRoutines,
}: Props) {
  const displayValue = (value?: number) => value?.toString() ?? "--";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <InfoCard
        title="Total Clientes"
        value={displayValue(totalClients)}
        description="Clientes registrados"
        icon={<Users />}
        cls="text-orange-500"
      />

      <InfoCard
        title="Clientes Activos"
        value={displayValue(activeClients)}
        description="Con plan o pago vigente"
        icon={<Activity />}
        cls="text-green-500"
      />

      <InfoCard
        title="Rutinas Asignadas"
        value={displayValue(totalRoutines)}
        description="Rutinas creadas por ti"
        icon={<Dumbbell />}
        cls="text-blue-500"
      />
    </div>
  );
}
