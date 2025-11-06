import { Role, UserProgressHistory } from "@/app/generated/prisma";
import ClientCurrentProgress from "@/features/clients/client/components/ClientCurrentProgress";
import ClientInfoCard from "@/features/clients/client/components/ClientInfoCard";
import ClientProgressHistory from "@/features/clients/client/components/ClientProgressHistory";
import ClientProgressPhotos from "@/features/clients/client/components/ClientProgressPhotos";
import ClientRoutines from "@/features/clients/client/components/ClientRoutines";

import prisma from "@/lib/prisma";
import ErrorAlert from "@/shared/components/alert/ErrorAlert";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: number }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const client = await prisma.user.findUnique({
    where: { id: Number(id), role: Role.CLIENT },
    include: {
      progress: { select: { id: true } },
      ClientTrainerPlan: true,
    },
  });

  if (isNaN(id) || !id || !client)
    return (
      <ErrorAlert
        title="Cliente no encontrado"
        description="El enlace que intentaste abrir no es válido o el cliente no existe."
        href="/clients"
        linkValue="Volver a clientes"
      />
    );

  // Extract all training days from every trainer plan and flatten into a single array
  const trainingDays = client.ClientTrainerPlan.flatMap(
    (plan) => plan.daysOfWeek || []
  ).filter((day, index, self) => self.indexOf(day) === index); // Remove duplicate days by keeping only the first occurrence of each day

  // Fetch the data if the client already has registered progress measurements.
  let clientProgressHistory: UserProgressHistory[] = [];
  let totalClientProgressHistory = 0;

  if (client.progress) {
    [clientProgressHistory, totalClientProgressHistory] = await Promise.all([
      prisma.userProgressHistory.findMany({
        where: { userProgressId: client.progress.id },
        orderBy: { recordedAt: "desc" },
        take: 5,
        skip: 0,
      }),
      prisma.userProgressHistory.count({
        where: { userProgressId: client.progress.id },
      }),
    ]);
  }
  return (
    <div className="py-6 md:py-14 px-6 min-h-[80vh] flex flex-col gap-5">
      <div className="block md:relative md:bottom-12 mb-4 md:mb-0 w-52 ">
        <div className="md:fixed md:z-10">
          <div
            className="flex items-center gap-2 
                  p-2 rounded-md 
                  bg-white/70 hover:bg-gray-200 backdrop-blur-sm 
                  md:bg-transparent md:backdrop-blur-0
                  shadow-sm md:shadow-none"
          >
            <MoveLeft className="w-4" />
            <Link
              href={"/clients"}
              className="font-semibold text-gray-700 text-sm"
            >
              Volver a clientes
            </Link>
          </div>
        </div>
      </div>

      <ClientInfoCard
        name={client.name}
        photo={client.photo}
        email={client.email}
        telephone={client.telephone}
        createdAt={client.createdAt}
        totalSessions={3}
        lastSession={client.createdAt}
        trainingDays={trainingDays}
      />

      <Tabs defaultValue="clientCurrentProgress">
        <TabsList className="w-full">
          <TabsTrigger value="clientCurrentProgress">Progreso</TabsTrigger>
          <TabsTrigger value="routines">Rutinas</TabsTrigger>
          <TabsTrigger value="photos">Fotos</TabsTrigger>
        </TabsList>

        <TabsContent value="clientCurrentProgress">
          <ClientCurrentProgress
            currentProgress={clientProgressHistory[0] ?? null}
            userProgressId={client.id}
          />

          <div className="mt-5">
            {client.progress ? (
              <ClientProgressHistory
                userProgressId={client.progress.id}
                initialDataClientProgressHistory={clientProgressHistory}
                totalClientProgressHistory={totalClientProgressHistory}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Historial de medidas</CardTitle>
                  <CardDescription>No hay registros aún.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="routines">
          <ClientRoutines
            userProgressId={client.progress?.id ?? null}
            clientName={client.name}
          />
        </TabsContent>
        <TabsContent value="photos">
          <ClientProgressPhotos userProgressId={client.progress?.id ?? null} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
