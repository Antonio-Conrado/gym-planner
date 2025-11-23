"use client";

import { Bell, Check, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { NOTIFICATION_TYPE } from "@/lib/enum";
import { NOTIFICATION_COLORS } from "@/lib/colors";
import { status } from "@/shared/interfaces/initialStateAction";
import { markNotificationAsRead } from "../action/markNotificationAsRead";
import Link from "next/link";
import { NotificationsResponse } from "../lib/fetchNotifications";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function NotificationsBell({ userId }: { userId: number }) {
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery<NotificationsResponse>({
    queryKey: ["notificationsNav"],
    queryFn: async () => {
      const res = await fetch(`/api/notifications/${userId}/?isRead=false`);
      const result = await res.json();
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const handleMarkNotificationAsRead = async (id: number) => {
    const res = await markNotificationAsRead(id);
    if (res.status === status.SUCCESS) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.setQueryData<NotificationsResponse>(
        ["notificationsNav"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((n) => n.id !== id),
            notificationsCount: oldData.notificationsCount - 1,
            unreadNotificationsCount: oldData.unreadNotificationsCount - 1,
          };
        }
      );
    }
  };

  if (notifications)
    return (
      <div className="relative">
        {notifications.unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.unreadNotificationsCount}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Bell className="w-6 h-6 text-gray-700 hover:cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-72 max-h-80 overflow-auto p-2 mr-5 md:mr-20">
            <DropdownMenuLabel className="font-semibold text-center text-gray-700">
              Notificaciones
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {notifications.unreadNotificationsCount === 0 ? (
              <DropdownMenuItem className="text-gray-500 text-sm text-center">
                No tienes notificaciones
              </DropdownMenuItem>
            ) : (
              notifications.data.map((notification) => {
                const colorClass =
                  NOTIFICATION_COLORS[
                    notification.type as keyof typeof NOTIFICATION_TYPE
                  ] || "bg-gray-500";

                return (
                  <div key={notification.id} className="my-3">
                    <div className="flex justify-between items-center gap-2">
                      <span
                        className={`text-xs text-white px-2 py-1 rounded-md ${colorClass}`}
                      >
                        {NOTIFICATION_TYPE[notification.type]}
                      </span>
                      {notification.relatedId && (
                        <Button
                          variant="ghost"
                          className="text-xs text-blue-600 hover:text-blue-800 hover:bg-transparent"
                        >
                          Ver más detalles
                        </Button>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm mt-1">
                      {notification.message}
                    </p>

                    {!notification.read ? (
                      <Button
                        variant={"outline"}
                        size={"sm"}
                        className=" mt-1"
                        onClick={() =>
                          handleMarkNotificationAsRead(notification.id)
                        }
                      >
                        <Check className="text-gray-600 " />
                        Marcar como leído
                      </Button>
                    ) : (
                      <Button
                        className="bg-green-600 hover:bg-green-600 mt-1"
                        size={"sm"}
                      >
                        <CheckCheck />
                        leído
                      </Button>
                    )}

                    <Separator className="mt-3" />
                  </div>
                );
              })
            )}
            {notifications.unreadNotificationsCount > 10 && (
              <div className="flex justify-end">
                <Link
                  href={`/notifications/${userId}`}
                  className="bg-orange-600 hover:bg-orange-500  text-white text-sm  rounded-md p-1 hover:cursor-pointer mb-1"
                >
                  Ver todas las notificaciones
                </Link>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
}
