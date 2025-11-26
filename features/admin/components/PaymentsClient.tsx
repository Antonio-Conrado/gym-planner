"use client";

import Pagination from "@/shared/components/table/Pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import { PaymentsClientResponse } from "../type/paymentsClient";
import PaymentClientCard from "./PaymentClientCard";

const ROWS_PER_PAGE = 10;
export default function PaymentsClient({ id }: { id: number }) {
  const [page, setPage] = useState(1);

  const skip = (page - 1) * ROWS_PER_PAGE;
  const { data, isLoading } = useQuery<PaymentsClientResponse>({
    queryKey: ["paymentsClient", page, skip],
    queryFn: async () => {
      const params = new URLSearchParams({
        take: ROWS_PER_PAGE.toString(),
        skip: skip.toString(),
      });

      const res = await fetch(`/api/admin/payments-client/${id}/?${params}`);
      const result = await res.json();
      console.log(result);
      return result;
    },
    enabled: !!page,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todas los pagos realizados</CardTitle>
        <CardDescription>
          Total pagado:{" "}
          <span className="font-semibold text-orange-600">
            C${data?.totalPaid ? data.totalPaid.toFixed(0) : 0}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data?.payments && data.payments.length > 0 ? (
              <>
                {data.payments.map((payment) => (
                  <div key={payment.id}>
                    <PaymentClientCard payment={payment} />
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center text-gray-600">
                No hay pagos registrados.
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {data?.payments && (
          <Pagination
            total={data.totalPayments}
            page={page}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={setPage}
            rowsOnPage={data.payments.length}
          />
        )}
      </CardFooter>
    </Card>
  );
}
