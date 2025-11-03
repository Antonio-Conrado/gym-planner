import { create } from "zustand";
import {
  createNotificationSlice,
  NotificationState,
} from "./notificationsSlice";

type AppState = NotificationState;

export const useAppStore = create<AppState>()((...a) => ({
  ...createNotificationSlice(...a),
}));
