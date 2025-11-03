"use client";

import { Bell, Check, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotificationsAction } from "../action/getNotifications-action";
import { Notification } from "@/app/generated/prisma";
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
import { useAppStore } from "@/store/useStore";
import { status } from "@/shared/interfaces/initialStateAction";
import { markNotificationAsRead } from "../action/markNotificationAsRead";

export default function NotificationsBell({ userId }: { userId: number }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const hasNewNotifications = useAppStore((state) => state.hasNewNotifications);
  const clearNotifications = useAppStore((state) => state.clearNotifications);

  useEffect(() => {
    const load = async () => {
      const res = await getNotificationsAction(userId);
      if (res.status === status.SUCCESS && res.data) {
        setNotifications(res.data);
      }
    };
    load();
    clearNotifications(); // Reset the "new notifications" flag after fetching the latest ones
  }, [userId, hasNewNotifications, clearNotifications]);

  const handleMarkNotificationAsRead = async (id: number) => {
    const res = await markNotificationAsRead(id);
    if (res.status === status.SUCCESS) {
      // Temporarily mark as read in UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      // Remove after 500 ms
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 500);
    }
  };

  return (
    <div className="relative">
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {notifications.length}
        </span>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Bell className="w-6 h-6 text-gray-700 hover:cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72 max-h-80 overflow-auto p-2 mr-20">
          <DropdownMenuLabel className="font-semibold text-center text-gray-700">
            Notificaciones
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {notifications.length === 0 ? (
            <DropdownMenuItem className="text-gray-500 text-sm text-center">
              No tienes notificaciones
            </DropdownMenuItem>
          ) : (
            notifications.map((notification) => {
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
