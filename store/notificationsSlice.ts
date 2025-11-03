import { StateCreator } from "zustand";

export type NotificationState = {
  hasNewNotifications: boolean;
  setNotifications: () => void;
  clearNotifications: () => void;
};

export const createNotificationSlice: StateCreator<NotificationState> = (
  set
) => ({
  hasNewNotifications: false,
  setNotifications: () => set({ hasNewNotifications: true }),
  clearNotifications: () => set({ hasNewNotifications: false }),
});
