export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateToDDMMYYYY(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getYear(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getMonth(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export function getDay(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export function getMonthYear(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getHour(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatTimeForInput(date: Date | null) {
  if (!date) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
