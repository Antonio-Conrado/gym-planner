import { DaysOfWeek } from "@/app/generated/prisma";
import {
  Calendar,
  DollarSign,
  UserPlus,
  Users,
  MessageSquare,
  Bell,
  CheckCircle,
} from "lucide-react";

export enum ROLE_ENUM {
  CLIENT = "Cliente",
  TRAINER = "Entrenador",
  ADMIN = "Administrador",
}

export enum DAYS_OF_WEEK {
  MONDAY = "Lunes",
  TUESDAY = "Martes",
  WEDNESDAY = "Miércoles",
  THURSDAY = "Jueves",
  FRIDAY = "Viernes",
  SATURDAY = "Sábado",
  SUNDAY = "Domingo",
}

export const WEEK_DAYS: DaysOfWeek[] = [
  DaysOfWeek.MONDAY,
  DaysOfWeek.TUESDAY,
  DaysOfWeek.WEDNESDAY,
  DaysOfWeek.THURSDAY,
  DaysOfWeek.FRIDAY,
  DaysOfWeek.SATURDAY,
  DaysOfWeek.SUNDAY,
];

export enum STATUS_LIST {
  PENDING = "Pendiente",
  CONFIRMED = "Confirmado",
  CANCELLED = "Cancelado",
  MISSED = "No asistido",
  COMPLETED = "Completado",
  RESCHEDULED = "Reprogramado",
}

export enum CONCEPT {
  DAY = "Pase diario",
  WEEK = "Pase semanal",
  MONTH = "Membresía mensual",
  FORTNIGHT = "Membresía quincenal",
  QUARTER = "Membresía trimestral",
  SEMESTER = "Membresía semestral",
  YEAR = "Membresía anual",
  OTHER = "Otro",
}

export enum PAYMENT_METHOD {
  CASH = "Efectivo",
  CARD = "Tarjeta",
  TRANSFER = "Transferencia",
}

export enum NOTIFICATION_TYPE {
  RESERVATION = "Reserva",
  PAYMENT = "Pago",
  PLAN_UPDATE = "Actualización de plan",
  TRAINING_REQUEST = "Solicitud de entrenamiento",
  CLIENT_TRAINING = "Cliente entrenando",
  TRAINER_MESSAGE = "Mensaje del entrenador",
  GENERAL = "General",
}
export const NOTIFICATION_ICONS: Record<
  keyof typeof NOTIFICATION_TYPE,
  React.ElementType
> = {
  RESERVATION: Calendar,
  PAYMENT: DollarSign,
  PLAN_UPDATE: CheckCircle,
  TRAINING_REQUEST: UserPlus,
  CLIENT_TRAINING: Users,
  TRAINER_MESSAGE: MessageSquare,
  GENERAL: Bell,
};

export enum MONTHS {
  JANUARY = "Enero",
  FEBRUARY = "Febrero",
  MARCH = "Marzo",
  APRIL = "Abril",
  MAY = "Mayo",
  JUNE = "Junio",
  JULY = "Julio",
  AUGUST = "Agosto",
  SEPTEMBER = "Septiembre",
  OCTOBER = "Octubre",
  NOVEMBER = "Noviembre",
  DECEMBER = "Diciembre",
}
