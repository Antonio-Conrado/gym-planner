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
import { NotificationsResponse } from "../lib/fetchNotifications";
import NotificationCard from "./NotificationCard";
import { Spinner } from "@/shared/components/ui/spinner";
import { OptionSelector } from "@/shared/components/dashboard/OptionSelector";
import { NOTIFICATION_TYPE } from "@/lib/enum";

const ROWS_PER_PAGE = 10;
export default function Notifications({ id }: { id: number }) {
  const [page, setPage] = useState(1);
  const [readFilter, setReadFilter] = useState<string | undefined>("all");
  const [typeFilter, setTypeFilter] = useState<string | undefined>("all");

  const skip = (page - 1) * ROWS_PER_PAGE;
  const { data: notifications, isLoading } = useQuery<NotificationsResponse>({
    queryKey: ["notifications", page, skip, readFilter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        take: ROWS_PER_PAGE.toString(),
        skip: skip.toString(),
      });

      const isReadParam =
        readFilter === "Leídos"
          ? "true"
          : readFilter === "No leídos"
          ? "false"
          : undefined;

      if (isReadParam !== undefined) {
        params.append("isRead", isReadParam);
      }

      if (typeFilter !== undefined && typeFilter !== "all") {
        const NOTIFICATION_TYPE_REVERSE = Object.fromEntries(
          Object.entries(NOTIFICATION_TYPE).map(([key, value]) => [value, key])
        );

        params.append(
          "typeNotifications",
          NOTIFICATION_TYPE_REVERSE[typeFilter]
        );
      }

      const res = await fetch(`/api/notifications/${id}/?${params}`);
      const result = await res.json();
      return result.data;
    },
    enabled: !!page || !!readFilter || !!typeFilter,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  if (notifications)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Todas las notificaciones</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <OptionSelector
                  options={["all", "Leídos", "No leídos"]}
                  currentOption={readFilter}
                  setSelectedOption={setReadFilter}
                  label="Ver todas las notificaciones"
                />
                <OptionSelector
                  options={["all", ...Object.values(NOTIFICATION_TYPE)]}
                  currentOption={typeFilter}
                  setSelectedOption={setTypeFilter}
                  label="Filtrar por tipo de notificación"
                />
              </div>
              <div className="flex flex-col gap-4">
                {notifications.data.length == 0 ? (
                  <p className="text-center text-gray-600">
                    No se encontraron resultados
                  </p>
                ) : (
                  <>
                    {notifications.data.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        userId={id}
                        notification={notification}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Pagination
            total={notifications.notificationsCount}
            page={page}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={setPage}
            rowsOnPage={notifications.data.length}
          />
        </CardFooter>
      </Card>
    );
}
