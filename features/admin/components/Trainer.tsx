"use client";
import Pagination from "@/shared/components/table/Pagination";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ClientsTrainerResponse,
  trainerInformation,
} from "../type/clientsTrainer";
import { Badge } from "@/shared/components/ui/badge";
import { DAYS_OF_WEEK } from "@/lib/enum";
import InfoCard from "@/shared/components/dashboard/InfoCard";
import Link from "next/link";
import TrainerInfoCard from "./TrainerInfoCard";
import { BicepsFlexed, MoveLeft, Users } from "lucide-react";

type Props = {
  trainerId: number;
  trainerInformation: trainerInformation;
};

const ROWS_PER_PAGE = 10;
export default function Trainer({ trainerId, trainerInformation }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  // Debounce search input
  const debouncedSearch = useDebounce(search);

  const skip = (page - 1) * ROWS_PER_PAGE;
  const { data, isLoading } = useQuery<ClientsTrainerResponse>({
    queryKey: ["clientsTrainer", { trainerId, page, debouncedSearch }],
    queryFn: async () => {
      const params = new URLSearchParams({
        take: ROWS_PER_PAGE.toString(),
        skip: skip.toString(),
        search: debouncedSearch || "",
      });

      const res = await fetch(
        `/api/admin/trainers/${trainerId}/clients?${params}`
      );
      const data = await res.json();
      return data;
    },
    placeholderData: (prevData) => prevData,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading)
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );

  if (data)
    return (
      <div>
        <div className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-2 rounded-md w-60 mb-5">
          <MoveLeft className="w-4 text-white" />
          <Link href={"/admin/catalogs"} className=" text-white  ">
            Volver a entrenadores
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <TrainerInfoCard trainer={trainerInformation} />
          </div>
          <div className="col-span-2 md:col-span-1 flex flex-col gap-6  justify-between">
            <InfoCard
              title={
                data.totalTrainerClients === 1
                  ? "Solicitud de entrenamiento"
                  : "Solicitudes de entrenamiento"
              }
              description={
                data.totalTrainerClients === 1
                  ? "Cliente que solicitó entrenar"
                  : "Clientes que solicitaron entrenar"
              }
              icon={<Users />}
              value={data.totalTrainerClients.toString()}
              cls={"text-cyan-600"}
            />

            <InfoCard
              title={
                data.totalActiveClientsWithPayment === 1
                  ? "Cliente activo con pago"
                  : "Clientes activos con pago"
              }
              description={
                data.totalActiveClientsWithPayment === 1
                  ? "Cliente con un plan vigente y habilitado para entrenar"
                  : "Clientes con un plan vigente y habilitados para entrenar"
              }
              icon={<BicepsFlexed />}
              value={data.totalActiveClientsWithPayment.toString()}
              cls={"text-gray-800"}
            />
          </div>
        </div>

        <div className="shadow-xl rounded-xl py-10 px-6 flex flex-col gap-6 mt-8 border border-gray-200">
          <h2 className="text-xl font-semibold">Listado de clientes</h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Input
              placeholder="Buscar cliente"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Cliente</TableHead>
                  <TableHead className="text-center">
                    Contacto del cliente
                  </TableHead>
                  <TableHead className="text-center">
                    Días de entrenamiento
                  </TableHead>
                  <TableHead className="text-center">Pago activo</TableHead>
                  <TableHead className="text-center"></TableHead>
                </TableRow>
              </TableHeader>

              {isLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="h-24">
                      <div className="flex justify-center items-center">
                        <Spinner />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : data && data.trainerClients.length > 0 ? (
                <TableBody>
                  {data.trainerClients.map((plan) => (
                    <TableRow key={plan.id} className="hover:bg-gray-50">
                      {/* Name */}
                      <TableCell className="text-center">
                        {plan.client.name}
                      </TableCell>

                      {/* contact */}
                      <TableCell className="text-center">
                        {plan.client.email}
                        <span className="block text-gray-600">
                          Tel: {plan.client.telephone ?? "--"}
                        </span>
                      </TableCell>

                      {/* day */}
                      <TableCell className="text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {plan.daysOfWeek.map((day) => (
                            <Badge
                              key={day}
                              variant={"outline"}
                              className="w-full sm:w-auto text-center "
                            >
                              {DAYS_OF_WEEK[day]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {plan.client.payments.length > 0 ? (
                          <span className="text-green-700">Sí</span>
                        ) : (
                          <span className="text-red-700">No</span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center"></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </div>

          {data && data.trainerClients && (
            <Pagination
              total={
                debouncedSearch
                  ? data.totalFilteredTrainerClients
                  : data.totalTrainerClients
              }
              page={page}
              rowsPerPage={ROWS_PER_PAGE}
              onPageChange={setPage}
              rowsOnPage={data.trainerClients.length}
            />
          )}
        </div>
      </div>
    );
}
