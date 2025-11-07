import { Routine } from "@/app/generated/prisma";
import { formatDateToDDMMYYYY } from "@/lib/helpers/formatDate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type Props = {
  routine: Routine;
};

export default function RoutineDetailsCard({ routine }: Props) {
  return (
    <Card className="my-5">
      <CardHeader>
        <CardTitle>{routine.name}</CardTitle>
        <CardDescription>
          {routine.description ?? "No hay descripción"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-100 rounded-md p-3 flex flex-col gap-3">
          <p className="text-gray-700 text-sm">Objetivo</p>
          <p className="text-sm">
            {routine.goal || "No se definió un objetivo"}
          </p>
        </div>
        <div className="bg-gray-100 rounded-md p-3 flex flex-col gap-3">
          <p className="text-gray-700 text-sm">Duración de entrenamiento</p>
          <div className="text-sm flex flex-wrap gap-2">
            {routine.durationWeek}{" "}
            {routine.durationWeek > 1 ? "semanas" : "semana"}
          </div>
        </div>
        <div className="bg-gray-100 rounded-md p-3 flex flex-col gap-3">
          <p className="text-gray-700 text-sm">Fecha de inicio</p>
          <p className="text-sm">
            {formatDateToDDMMYYYY(routine.startDate.toString())}
          </p>
        </div>
        <div className="bg-gray-100 rounded-md p-3 flex flex-col gap-3">
          <p className="text-gray-700 text-sm">Fecha de finalización</p>
          <p className="text-sm">
            {formatDateToDDMMYYYY(routine.endDate.toString())}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
