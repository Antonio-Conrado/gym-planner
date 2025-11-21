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
