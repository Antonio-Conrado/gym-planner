"use client";
import { Routine } from "@/app/generated/prisma";
import { formatDateToDDMMYYYY } from "@/lib/helpers/formatDate";
import Pagination from "@/shared/components/table/Pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Spinner } from "@/shared/components/ui/spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Calendar, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  userProgressId: number;
  initialDataClientRoutinesHistory: Routine[];
  totalClientRoutinesHistory: number;
};

const ROWS_PER_PAGE = 5;
export default function ClientRoutinesHistory({
  userProgressId,
  initialDataClientRoutinesHistory,
  totalClientRoutinesHistory,
}: Props) {
  const [page, setPage] = useState(1);
  const skip = (page - 1) * ROWS_PER_PAGE;

  const { data, isLoading } = useQuery({
    queryKey: ["clientRoutinesHistory", userProgressId, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        userProgressId: userProgressId.toString(),
        skip: skip.toString(),
        take: ROWS_PER_PAGE.toString(),
      });

      const response = await fetch(
        `/api/clients/client-routines-history?${params.toString()}`
      );
      if (!response.ok)
        throw new Error("Error al obtener el historial de rutinas del usuario");
      return response.json();
    },
    placeholderData: { clientRoutineHistory: initialDataClientRoutinesHistory },
    staleTime: 1000 * 60 * 5,
    enabled: !!page,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.setQueryData(["clientRoutinesHistory", userProgressId, 1], {
      clientRoutineHistory: initialDataClientRoutinesHistory,
    });
  }, [initialDataClientRoutinesHistory, queryClient, userProgressId]);

  const clientRoutineHistory: Routine[] | [] = data.clientRoutineHistory ?? [];

  if (clientRoutineHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <CardTitle>Historial de rutinas</CardTitle>
            <CardDescription>No hay registros aún.</CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de rutinas</CardTitle>
        <CardDescription>Últimos registros de rutinas</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {clientRoutineHistory.map((routine) => (
              <Card key={routine.id} className="border">
                <CardHeader>
                  <CardTitle>{routine.name}</CardTitle>

                  <CardDescription>
                    {routine.description || "No hay descripción establecida"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-3">
                  <div className="text-gray-700 text-sm flex gap-2">
                    <Trophy className="h-4 w-4" />
                    <p> {routine.goal || "No se definió un objetivo"}</p>
                  </div>
                  <div className="text-gray-700 text-sm flex gap-2">
                    <Calendar className="h-4 w-4" />
                    <p>
                      {formatDateToDDMMYYYY(routine.startDate.toString()) +
                        "-" +
                        formatDateToDDMMYYYY(routine.endDate.toString())}
                    </p>
                  </div>
                  <div className="text-gray-700 text-sm flex gap-2">
                    <Clock className="h-4 w-4" />
                    <p>
                      {routine.durationWeek}{" "}
                      {routine.durationWeek > 1 ? "semanas" : "semana"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Link
                    href={`/clients/routines/${routine.id}`}
                    className="bg-orange-600 hover:bg-orange-500 hover:cursor-pointer p-2 rounded-md text-white flex gap-2"
                  >
                    Ver más detalles
                    <ArrowRight />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-end">
        <Pagination
          total={totalClientRoutinesHistory}
          page={page}
          rowsPerPage={ROWS_PER_PAGE}
          onPageChange={setPage}
          rowsOnPage={clientRoutineHistory.length}
        />
      </CardFooter>
    </Card>
  );
}
