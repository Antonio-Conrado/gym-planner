import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Dumbbell } from "lucide-react";
import { ClientRoutinesForm } from "./ClientRoutinesForm";
import { auth } from "@/lib/auth";
import { Role } from "@/app/generated/prisma";

type Props = {
  userProgressId: number | null;
  clientName: string;
  hasRoutineHistory: boolean;
};

export default async function ClientRoutines({
  userProgressId,
  clientName,
  hasRoutineHistory,
}: Props) {
  const session = await auth();
  if (!session) return null;

  if (!userProgressId)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rutinas de entrenamiento</CardTitle>
          <CardDescription>Planes de ejercicios asignados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center items-center gap-3 mt-10">
            <Dumbbell className="h-20 w-20 text-gray-300" />
            <p className="text-gray-700 text-lg">
              No hay rutinas asignadas aún
            </p>
            <p className="text-gray-500 text-sm">
              Crea una registro de progreso para empezar a crear rutinas
            </p>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Rutinas de entrenamiento</CardTitle>
          <CardDescription>Planes de ejercicios asignados</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {session.user.role === Role.TRAINER && (
          <div>
            <CardContent>
              <div className="flex flex-col justify-center items-center gap-3">
                <Dumbbell className="h-20 w-20 text-gray-300" />
                <p className="text-gray-700 text-lg">
                  {!hasRoutineHistory && "No hay rutinas asignadas aún"}
                </p>
                <ClientRoutinesForm
                  clientName={clientName}
                  trainerId={Number(session.user.id)}
                  userProgressId={userProgressId}
                />
              </div>
            </CardContent>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
