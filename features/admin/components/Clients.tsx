"use client";
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
import { formatDateToDDMMYYYY } from "../../../lib/helpers/formatDate";
import Pagination from "@/shared/components/table/Pagination";
import { AdminClientsResponse } from "../type/adminClients";
import { Badge } from "@/shared/components/ui/badge";
import { DAYS_OF_WEEK } from "@/lib/enum";
import Link from "next/link";

const ROWS_PER_PAGE = 10;
export default function AdminClients() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  // Debounce search input
  const debouncedSearch = useDebounce(search);

  const skip = (page - 1) * ROWS_PER_PAGE;
  // Fetch payments
  const { data, isLoading } = useQuery<AdminClientsResponse>({
    queryKey: ["paymentHistory", page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        skip: skip.toString(),
        take: ROWS_PER_PAGE.toString(),
        search: debouncedSearch || "",
      });

      const response = await fetch(`/api/admin/clients/?${params.toString()}`);
      if (!response.ok)
        throw new Error("error al obtener el listado de clients");

      const clients = await response.json();
      return clients;
    },
    placeholderData: (prevData) => prevData,
    staleTime: 1000 * 60 * 5,
  });

  return (
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
              <TableHead className="text-center">Contacto</TableHead>
              <TableHead className="text-center">Entrenador a cargo</TableHead>
              <TableHead className="text-center">
                Días de entrenamiento
              </TableHead>
              <TableHead className="text-center">Fecha de registro</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
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
          ) : data && data.clients ? (
            <TableBody>
              {data.clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  {/* Name */}
                  <TableCell className="text-center">{client.name}</TableCell>

                  {/* contact */}
                  <TableCell className="text-center">
                    {client.email}
                    <span className="block text-gray-600">
                      Tél: {client.telephone ?? "--"}
                    </span>
                  </TableCell>

                  {/* trainer */}
                  <TableCell className="text-center">
                    {client.ClientTrainerPlan.length > 0 ? (
                      <>{client.ClientTrainerPlan[0].trainer.user.name}</>
                    ) : (
                      <span>Entrenamiento libre</span>
                    )}
                  </TableCell>

                  {/* days of week */}
                  <TableCell className="text-center">
                    {client.ClientTrainerPlan.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {client.ClientTrainerPlan[0].daysOfWeek.map((day) => (
                          <Badge
                            key={day}
                            variant="outline"
                            className="w-full sm:w-auto text-center "
                          >
                            {DAYS_OF_WEEK[day]}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span>Entrenamiento libre</span>
                    )}
                  </TableCell>

                  {/* createdAt*/}
                  <TableCell className="text-center">
                    {formatDateToDDMMYYYY(client.createdAt.toString())}
                  </TableCell>

                  {/* Status*/}
                  <TableCell className="text-center">
                    {client.status ? "Activo" : "Inactivo"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center">
                    <Link href={`/admin/user/payments/${client.id}`}>
                      <Badge className="rounded-sm"> Ver pagos</Badge>
                    </Link>
                  </TableCell>
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

      {data && data.clients && (
        <Pagination
          total={
            debouncedSearch ? data.filteredClientsCount : data.clientsTotal
          }
          page={page}
          rowsPerPage={ROWS_PER_PAGE}
          onPageChange={setPage}
          rowsOnPage={data.clients.length}
        />
      )}
    </div>
  );
}
