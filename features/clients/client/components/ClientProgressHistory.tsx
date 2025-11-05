"use client";
import { UserProgressHistory } from "@/app/generated/prisma";
import { formatDate } from "@/lib/helpers/formatDate";
import Pagination from "@/shared/components/table/Pagination";
import { Badge } from "@/shared/components/ui/badge";
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
import { useEffect, useState } from "react";

type Props = {
  userProgressId: number;
  initialDataClientProgressHistory: UserProgressHistory[];
  totalClientProgressHistory: number;
};

const ROWS_PER_PAGE = 5;
export default function ClientProgressHistory({
  userProgressId,
  initialDataClientProgressHistory,
  totalClientProgressHistory,
}: Props) {
  const [page, setPage] = useState(1);
  const skip = (page - 1) * ROWS_PER_PAGE;

  const { data, isLoading } = useQuery({
    queryKey: ["clientProgressHistory", userProgressId, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        userProgressId: userProgressId.toString(),
        skip: skip.toString(),
        take: ROWS_PER_PAGE.toString(),
      });

      const response = await fetch(
        `/api/clients/client-progress-history?${params.toString()}`
      );
      if (!response.ok)
        throw new Error("Error al obtener el progreso del usuario");
      return response.json();
    },
    placeholderData: { userProgressHistory: initialDataClientProgressHistory },
    staleTime: 1000 * 60 * 5,
    enabled: !!page,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.setQueryData(["clientProgressHistory", userProgressId, 1], {
      userProgressHistory: initialDataClientProgressHistory,
    });
  }, [initialDataClientProgressHistory, queryClient, userProgressId]);

  const userProgressHistory: UserProgressHistory[] | [] =
    data.userProgressHistory ?? [];

  if (userProgressHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de medidas</CardTitle>
          <CardDescription>No hay registros aún.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de medidas</CardTitle>
        <CardDescription>Últimos registros de progreso</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {userProgressHistory.map((record) => (
              <div
                key={record.id}
                className="border border-gray-200 rounded-md p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {formatDate(record.recordedAt.toString())}
                    <span>{record.notes ?? "--"}</span>
                  </p>
                  <Badge variant="outline">{record.weight} kg</Badge>
                </div>

                {record.notes && (
                  <p className="text-gray-700 text-sm italic">{record.notes}</p>
                )}

                <ul className="grid grid-cols-2 gap-2">
                  {/* height */}
                  <li className="text-sm text-gray-700">
                    Altura:{" "}
                    <span className="text-gray-900">
                      {record.height != null ? `${record.height} cm` : "--"}
                    </span>
                  </li>

                  {/* Chest */}
                  <li className="text-sm text-gray-700">
                    Pecho:{" "}
                    <span className="text-gray-900">
                      {record.chest != null ? `${record.chest} cm` : "--"}
                    </span>
                  </li>

                  {/* Waist */}
                  <li className="text-sm text-gray-700">
                    Cintura:{" "}
                    <span className="text-gray-900">
                      {record.waist != null ? `${record.waist} cm` : "--"}
                    </span>
                  </li>

                  {/* Hips */}
                  <li className="text-sm text-gray-700">
                    Cadera:{" "}
                    <span className="text-gray-900">
                      {record.hips != null ? `${record.hips} cm` : "--"}
                    </span>
                  </li>

                  {/* Biceps */}
                  <li className="text-sm text-gray-700">
                    Bíceps:{" "}
                    <span className="text-gray-900">
                      {record.biceps != null ? `${record.biceps} cm` : "--"}
                    </span>
                  </li>

                  {/* Legs */}
                  <li className="text-sm text-gray-700">
                    Piernas:{" "}
                    <span className="text-gray-900">
                      {record.legs != null ? `${record.legs} cm` : "--"}
                    </span>
                  </li>

                  {/* Calves */}
                  <li className="text-sm text-gray-700">
                    Pantorrillas:{" "}
                    <span className="text-gray-900">
                      {record.calf != null ? `${record.calf} cm` : "--"}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-end">
        <Pagination
          total={totalClientProgressHistory}
          page={page}
          rowsPerPage={ROWS_PER_PAGE}
          onPageChange={setPage}
          rowsOnPage={userProgressHistory.length}
        />
      </CardFooter>
    </Card>
  );
}
