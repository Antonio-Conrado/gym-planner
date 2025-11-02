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
