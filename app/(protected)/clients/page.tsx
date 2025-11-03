import { Role } from "@/app/generated/prisma";
import TrainerInfoCards from "@/features/trainers/clients/components/TrainerInfoCards";
import { auth } from "@/lib/auth";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import Link from "next/link";

export default async function Page() {
  const trainer = await auth();
  if (!trainer || trainer.user.role !== Role.TRAINER) {
    return (
      <div className="min-h-screen flex justify-center items-center p-6">
        <Alert className="max-w-md w-full flex flex-col items-center">
          <AlertTitle className="text-xl font-semibold text-center">
            Acceso denegado
          </AlertTitle>
          <AlertDescription className="text-gray-700 mt-2 text-center">
            Lo sentimos, esta sección solo está disponible para entrenadores.
            <br />
            Si crees que es un error, contacta al administrador del gimnasio.
          </AlertDescription>

          <Link href="/" className="mt-4">
            <span className="inline-block w-40 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition text-center">
              Volver al inicio
            </span>
          </Link>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6 ">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Mis clientes
        </h1>
        <p className="text-gray-600">
          Gestiona y da seguimiento a tus clientes
        </p>
      </div>

      <TrainerInfoCards trainerId={Number(trainer.user.id)} />
    </div>
  );
}
