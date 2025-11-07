"use client";
import { Role, Routine } from "@/app/generated/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ClientRoutineDetailForm } from "./RoutineDetailsForm";
import { RoutineExercise } from "../../../../app/generated/prisma/index";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { CircleAlert, Edit, Save, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { DAYS_OF_WEEK } from "@/lib/enum";
import { useState } from "react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export type ExerciseWithMeta = RoutineExercise & { isNew?: boolean };
type Props = {
  routine: Routine & {
    RoutineExercise: RoutineExercise[];
  };
  role: string | undefined;
};
export default function RoutineDetails({ routine, role }: Props) {
  const [exercises, setExercises] = useState<ExerciseWithMeta[]>(
    routine.RoutineExercise || []
  );

  // Group exercises by day
  const groupedExercises = exercises.reduce((groups, exercise) => {
    const dayName = exercise.daysOfWeek;

    if (!groups[dayName]) {
      groups[dayName] = [];
    }

    groups[dayName].push(exercise);
    return groups;
  }, {} as Record<string, ExerciseWithMeta[]>);

  const handleCancel = () => {
    setExercises((prev) => prev.filter((exercise) => !exercise.isNew));
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["routines"],
    mutationFn: async (newExercises: ExerciseWithMeta[]) => {
      const response = await fetch(
        `/api/clients/client-routines-exercises/${routine.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exercises: newExercises }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar los ejercicios");
      }

      return response.json();
    },

    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (success) => {
      toast.success(success.message);
      // Update the state to hide the "new" alert for exercises
      setExercises((prev) =>
        prev.map((exercise) =>
          exercise.isNew ? { ...exercise, isNew: false } : exercise
        )
      );
    },
  });

  const handleSubmit = () => {
    const newExercises = exercises.filter((exercise) => exercise.isNew);
    mutate(newExercises);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <CardTitle>Ejercicios por Día</CardTitle>
            <CardDescription>
              {exercises.length}{" "}
              {exercises.length > 1 ? "ejercicios" : "ejercicio"} en la rutina
            </CardDescription>
          </div>
          {role && role === Role.TRAINER && (
            <ClientRoutineDetailForm
              routineId={routine.id}
              setExercises={setExercises}
            />
          )}
        </div>
        {role && role === Role.TRAINER && (
          <>
            {exercises.some((exercise) => exercise.isNew) && (
              <div className="flex flex-col gap-3">
                <Alert className="bg-orange-50 mt-2">
                  <AlertDescription className="text-orange-800 flex items-center gap-4">
                    <CircleAlert />
                    {`Tienes cambios sin guardar en esta rutina. No olvides presionar "Guardar Cambios" para aplicarlos.`}
                  </AlertDescription>
                </Alert>
                <div className="flex flex-col md:flex-row gap-3">
                  <Button
                    className="w-40"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Descartar Cambios
                  </Button>
                  <Button
                    className="w-40"
                    onClick={handleSubmit}
                    disabled={isPending}
                  >
                    <Save />
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedExercises).map(([day, exercises]) => (
          <div key={day} className="mb-8">
            <div className="flex gap-4 items-center mb-2">
              <h3 className="text-lg font-semibold text-cyan-800">
                {DAYS_OF_WEEK[day as keyof typeof DAYS_OF_WEEK] ?? day}
              </h3>
              <div className="bg-cyan-100 text-cyan-800 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center justify-center">
                {exercises.length}{" "}
                {exercises.length > 1 ? "ejercicios" : "ejercicio"}
              </div>
            </div>

            <div className="space-y-4">
              {exercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  className={`${
                    exercise.isNew && "bg-orange-50 border-orange-400"
                  }  hover:shadow-md transition-all duration-200"`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="font-semibold text-gray-900 text-base">
                            {exercise.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {exercise.muscle}
                          </Badge>

                          {exercise.isNew && (
                            <Badge className="bg-orange-500">Nuevo</Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-700">
                          {exercise.sets} series × {exercise.reps} repeticiones
                        </p>
                      </div>

                      {role && role === Role.TRAINER && (
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="hover:bg-cyan-50"
                                  aria-label="Editar ejercicio"
                                >
                                  <Edit className="text-cyan-700" size={18} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Editar</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="hover:bg-red-50"
                                  aria-label="Eliminar ejercicio"
                                >
                                  <Trash className="text-red-700" size={18} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                Eliminar
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 text-sm italic">
                      {exercise.notes || "No hay notas"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
