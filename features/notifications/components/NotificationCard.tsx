import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Notification } from "@/app/generated/prisma";
import { NOTIFICATION_ICONS, NOTIFICATION_TYPE } from "@/lib/enum";
import { Check, CheckCheck, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { NOTIFICATION_COLORS_ICON } from "@/lib/colors";
import { Button } from "@/shared/components/ui/button";
import { markNotificationAsRead } from "../action/markNotificationAsRead";
import { status } from "@/shared/interfaces/initialStateAction";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: number;
  notification: Notification;
};

export default function NotificationCard({ userId, notification }: Props) {
  const Icon =
    NOTIFICATION_ICONS[notification.type as keyof typeof NOTIFICATION_TYPE];

  const queryClient = useQueryClient();
  const handleMarkNotificationAsRead = async (id: number) => {
    const res = await markNotificationAsRead(id);
    if (res.status === status.SUCCESS) {
      // Refetch notifications
      const notificationsRes = await fetch(
        `/api/notifications/${userId}?isRead=false&take=2&skip=0`
      );
      const data = await notificationsRes.json();
      if (data.status === status.SUCCESS && data.data) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["notificationsNav"] });
      }
    }
  };

  return (
    <Card className="p-0">
      <CardHeader className="flex justify-end mr-10 t-10"></CardHeader>

      <CardContent className="grid grid-cols-[10%_90%] gap-4">
        <div className="flex justify-center items-center">
          <Icon
            className={`${
              NOTIFICATION_COLORS_ICON[notification.type]
            } w-10 h-10`}
          />
        </div>
        <div className=" flex  flex-col md:flex-row justify-between gap-4">
          <div>
            <p>{NOTIFICATION_TYPE[notification.type]}</p>
            <p className="text-gray-700 text-sm">{notification.message}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </div>
          </div>
          <div>
            {!notification.read ? (
              <Button
                variant={"outline"}
                size={"sm"}
                className=" mt-1"
                onClick={() => handleMarkNotificationAsRead(notification.id)}
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
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
