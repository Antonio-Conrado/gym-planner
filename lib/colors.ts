// src/lib/colors.ts

import {
  ROLE_ENUM,
  DAYS_OF_WEEK,
  STATUS_LIST,
  CONCEPT,
  PAYMENT_METHOD,
  NOTIFICATION_TYPE,
} from "@/lib/enum";

export const ROLE_COLORS: Record<keyof typeof ROLE_ENUM, string> = {
  CLIENT: "bg-blue-500",
  TRAINER: "bg-emerald-600",
  ADMIN: "bg-purple-600",
};

export const DAY_COLORS: Record<keyof typeof DAYS_OF_WEEK, string> = {
  MONDAY: "bg-cyan-500",
  TUESDAY: "bg-sky-500",
  WEDNESDAY: "bg-indigo-500",
  THURSDAY: "bg-green-500",
  FRIDAY: "bg-amber-500",
  SATURDAY: "bg-orange-500",
  SUNDAY: "bg-rose-500",
};

export const STATUS_COLORS: Record<keyof typeof STATUS_LIST, string> = {
  PENDING: "bg-yellow-500",
  CONFIRMED: "bg-blue-600",
  CANCELLED: "bg-red-600",
  MISSED: "bg-gray-500",
  COMPLETED: "bg-green-600",
  RESCHEDULED: "bg-purple-500",
};

export const CONCEPT_COLORS: Record<keyof typeof CONCEPT, string> = {
  DAY: "bg-cyan-500",
  WEEK: "bg-sky-500",
  FORTNIGHT: "bg-amber-600",
  MONTH: "bg-blue-600",
  QUARTER: "bg-teal-600",
  SEMESTER: "bg-indigo-600",
  YEAR: "bg-green-600",
  OTHER: "bg-gray-500",
};

export const PAYMENT_METHOD_COLORS: Record<
  keyof typeof PAYMENT_METHOD,
  string
> = {
  CASH: "bg-emerald-600",
  CARD: "bg-indigo-600",
  TRANSFER: "bg-cyan-600",
};

export const NOTIFICATION_COLORS: Record<
  keyof typeof NOTIFICATION_TYPE,
  string
> = {
  RESERVATION: "bg-blue-500",
  PAYMENT: "bg-green-600",
  PLAN_UPDATE: "bg-yellow-600",
  TRAINING_REQUEST: "bg-orange-600",
  CLIENT_TRAINING: "bg-cyan-600",
  TRAINER_MESSAGE: "bg-purple-600",
  GENERAL: "bg-gray-500",
};

export const defaultColors = [
  "#ff6b35",
  "#ffc107",
  "#4dd0e1",
  "#ff8a65",
  "#81c784",
  "#ff7043",
  "#64b5f6",
  "#ffd54f",
  "#ffab91",
];
