"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import Pagination from "@/shared/components/table/Pagination";
import { ClientTrainerPlanData } from "../interfaces/client";
import { Spinner } from "@/shared/components/ui/spinner";
import Link from "next/link";
import { DAYS_OF_WEEK } from "@/lib/enum";
import { Badge } from "@/shared/components/ui/badge";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { getMonthYear } from "@/lib/helpers/formatDate";
import { Mail, Phone } from "lucide-react";

type Props = {
  initialClients: ClientTrainerPlanData[];
  totalClients: number;
  trainerId: number;
};

const ROWS_PER_PAGE = 10;

export default function ClientList({
  initialClients,
  totalClients,
  trainerId,
}: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  // Debounce search input
  const debouncedSearch = useDebounce(search);

  const skip = (page - 1) * ROWS_PER_PAGE;
  // Fetch clients
  const { data, isLoading } = useQuery({
    queryKey: ["trainerClients", trainerId, page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        trainerId: trainerId.toString(),
        skip: skip.toString(),
        take: ROWS_PER_PAGE.toString(),
        search: debouncedSearch || "",
      });

      const response = await fetch(
        `/api/trainers/clients?${params.toString()}`
      );
      if (!response.ok) throw new Error("Error fetching clients");
      return response.json();
    },
    placeholderData: { clients: initialClients },
    staleTime: 1000 * 60 * 5,
  });

  const clients: ClientTrainerPlanData[] = data?.clients ?? [];

  return (
    <div className="shadow-xl rounded-xl py-10 px-6 flex flex-col gap-6 mt-8 border border-gray-200">
      <h2 className="text-xl font-semibold">Lista de clientes</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Buscar por nombre o correo electrónico"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Foto</TableHead>
              <TableHead className="text-center">Cliente</TableHead>
              <TableHead className="text-center">Contacto</TableHead>
              <TableHead className="text-center">
                Días de entrenamiento
              </TableHead>
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
          ) : clients.length > 0 ? (
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  {/* Photo */}
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Image
                        src={client.client.photo || "/logo.png"}
                        alt={client.client.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell className="text-center">
                    {client.client.name}
                    <span className="block text-gray-600">
                      Desde {getMonthYear(client.createdAt.toString())}
                    </span>
                  </TableCell>

                  {/* Email and Telephone */}
                  <TableCell className="text-center">
                    <span className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-3 w-3 " />
                      {client.client.email}
                    </span>
                    {client.client.telephone && (
                      <span className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-3 w-3 " />
                        {client.client.telephone}
                      </span>
                    )}
                  </TableCell>

                  {/* Days of week */}
                  <TableCell className="text-center">
                    <div className="flex justify-center flex-wrap gap-1">
                      {client.daysOfWeek.map((day) => (
                        <Badge
                          key={day}
                          variant={"outline"}
                          className="px-2 py-1 text-sm "
                        >
                          {DAYS_OF_WEEK[day] || day}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-white bg-orange-600 p-2 rounded-md"
                    >
                      Ver detalles
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

      <Pagination
        total={totalClients}
        page={page}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={setPage}
        rowsOnPage={clients.length}
      />
    </div>
  );
}
