import RoutineDetails from "@/features/clients/client/components/RoutineDetails";
import prisma from "@/lib/prisma";
import ErrorAlert from "@/shared/components/alert/ErrorAlert";
import RedirectBack from "@/shared/components/nav/RedirectBack";

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: Props) {
  const param = await params;
  const id = Number(param.id);

  const routine = await prisma.routine.findUnique({
    where: { id },
    include: { RoutineExercise: true },
  });

  if (isNaN(id) || !id || !routine)
    return (
      <ErrorAlert
        title="Cliente no encontrado"
        description="El enlace que intentaste abrir no es válido o la rutina no existe."
        isRedirectBack={true}
      />
    );

  return (
    <div className="py-6 md:py-14 px-6 min-h-[80vh]">
      <div className="block md:relative md:bottom-12 mb-4 md:mb-0 w-52 ">
        <div className="md:fixed md:z-10">
          <RedirectBack />
        </div>
      </div>

      <RoutineDetails routine={routine} />
    </div>
  );
}
