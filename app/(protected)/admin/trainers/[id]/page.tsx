import Trainer from "@/features/admin/components/Trainer";
import prisma from "@/lib/prisma";
import ErrorAlert from "@/shared/components/alert/ErrorAlert";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const param = await params;
  const id = Number(param.id);

  const trainerInformation = await prisma.trainer.findUnique({
    where: {
      id,
    },
    select: {
      user: {
        select: {
          name: true,
          email: true,
          telephone: true,
          photo: true,
          status: true,
        },
      },
      speciality: {
        select: { name: true },
      },
      schedules: true,
    },
  });
  if (isNaN(id) || !id || !trainerInformation)
    return (
      <ErrorAlert
        title="La información del entrenador no se encontró"
        description="El enlace que intentaste abrir no es válido o no existe."
      />
    );

  return (
    <div className="p-6">
      <Trainer trainerInformation={trainerInformation} trainerId={id} />
    </div>
  );
}
