import { Role } from "@/app/generated/prisma";
import { ExerciseWithMeta } from "@/features/clients/client/components/RoutineDetails";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ routineId: string }>;
};

export async function POST(request: Request, { params }: Props) {
  // Authenticate the user
  const session = await auth();

  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "no_autorizado", message: "El usuario no está autenticado" },
      { status: 401 }
    );
  }

  if (session.user.role !== Role.TRAINER) {
    return NextResponse.json(
      {
        error: "no_autorizado",
        message: "Solamente el entrenador puede asginar rutinas",
      },
      { status: 401 }
    );
  }

  const routineId = Number((await params).routineId);
  if (isNaN(routineId)) {
    return NextResponse.json(
      {
        error: "Id inválido",
        message: "El id de la rutina es inválido",
      },
      { status: 400 }
    );
  }

  const body = await request.json();
  const exercises: ExerciseWithMeta[] = body.exercises;

  await prisma.$transaction(async (prisma) => {
    await prisma.routineExercise.createMany({
      data: exercises.map((exercise) => ({
        routineId,
        name: exercise.name,
        muscle: exercise.muscle,
        sets: exercise.sets,
        reps: exercise.reps,
        notes: exercise.notes || null,
        daysOfWeek: exercise.daysOfWeek,
      })),
      skipDuplicates: true,
    });
  });

  return NextResponse.json({
    message: "Ejercicios guardados correctamente",
  });
}
