"use client";
import { Concept, Payment, PaymentMethod, User } from "@/app/generated/prisma";
import { PAYMENT_METHOD } from "@/lib/enum";
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
import { CONCEPT } from "../../../lib/enum";
import { formatDateToDDMMYYYY } from "../../../lib/helpers/formatDate";
import Pagination from "@/shared/components/table/Pagination";
import { CONCEPT_COLORS } from "@/lib/colors";

type payment = Payment & {
  user: { name: User["name"] };
  paymentConcept: { concept: Concept; amount: number };
};

type Props = {
  initialData: payment[];
  paymentsTotal: number;
};

const ROWS_PER_PAGE = 10;
export default function PaymentHistory({ initialData, paymentsTotal }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  // Debounce search input
  const debouncedSearch = useDebounce(search);

  const skip = (page - 1) * ROWS_PER_PAGE;
  // Fetch payments
  const { data, isLoading } = useQuery({
    queryKey: ["paymentHistory", page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        skip: skip.toString(),
        take: ROWS_PER_PAGE.toString(),
        search: debouncedSearch || "",
      });

      const response = await fetch(
        `/api/admin/payment-history?${params.toString()}`
      );
      if (!response.ok)
        throw new Error("error al obtener el historial de pagos");

      return response.json();
    },
    placeholderData: { payments: initialData },
    staleTime: 1000 * 60 * 5,
  });

  const payments: payment[] = data?.payments ?? [];

  return (
    <div className="shadow-xl rounded-xl py-10 px-6 flex flex-col gap-6 mt-8 border border-gray-200">
      <h2 className="text-xl font-semibold">Listado de pagos</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Buscar cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Cliente</TableHead>
              <TableHead className="text-center">Método de pago</TableHead>
              <TableHead className="text-center">Concepto de pago</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-center">Fecha de pago</TableHead>
              <TableHead className="text-center">
                Período de entrenamiento
              </TableHead>
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
          ) : payments.length > 0 ? (
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50">
                  {/* Name */}
                  <TableCell className="text-center">
                    {payment.user.name}
                  </TableCell>

                  {/* method */}
                  <TableCell className="text-center">
                    {PAYMENT_METHOD[payment.method]}
                    {payment.method !== PaymentMethod.CASH && (
                      <span className="block text-gray-600">
                        referencia de pago: {payment.reference}
                      </span>
                    )}
                  </TableCell>

                  {/* concept */}
                  <TableCell className="text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-md text-white ${
                        CONCEPT_COLORS[payment.paymentConcept.concept]
                      }`}
                    >
                      {CONCEPT[payment.paymentConcept.concept]}
                    </span>
                  </TableCell>

                  {/* amount*/}
                  <TableCell className="text-center">
                    C$ {payment.price.toFixed(2)}
                  </TableCell>

                  {/* paid Date*/}
                  <TableCell className="text-center">
                    {formatDateToDDMMYYYY(payment.paidAt.toString())}
                  </TableCell>

                  {/* start Date and end Date*/}
                  <TableCell className="text-center">
                    {formatDateToDDMMYYYY(payment.startDate.toString())} -{" "}
                    {formatDateToDDMMYYYY(payment.endDate.toString())}
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

      <Pagination
        total={paymentsTotal}
        page={page}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={setPage}
        rowsOnPage={payments.length}
      />
    </div>
  );
}
