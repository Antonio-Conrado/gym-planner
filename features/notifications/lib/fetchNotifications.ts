import { Notification, NotificationType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { InitialState, status } from "@/shared/interfaces/initialStateAction";

type Notifications = {
  userId: number;
  type?: NotificationType;
  isRead?: boolean;
  take?: number;
  skip?: number;
};

export type NotificationsResponse = {
  data: Notification[];
  notificationsCount: number;
  unreadNotificationsCount: number;
};
export async function fetchNotifications({
  userId,
  type,
  isRead,
  take = 2,
  skip = 0,
}: Notifications): Promise<InitialState<[], NotificationsResponse>> {
  try {
    const data = await prisma.notification.findMany({
      where: {
        userId,
        read: isRead ?? undefined,
        ...(type !== undefined ? { type } : {}),
      },
      orderBy: { id: "desc" },
      take,
      skip,
    });

    const notificationsCount = await prisma.notification.count({
      where: { userId },
    });

    const unreadNotificationsCount = await prisma.notification.count({
      where: { userId, read: false },
    });
    return {
      message: "",
      status: status.SUCCESS,
      errors: [],
      data: { data, notificationsCount, unreadNotificationsCount },
    };
  } catch (error) {
    return {
      message:
        (error as Error)?.message ??
        "Ocurrió un error. Por favor intenta de nuevo.",
      errors: [],
      data: { data: [], notificationsCount: 0, unreadNotificationsCount: 0 },
      status: status.ERROR,
    };
  }
}
