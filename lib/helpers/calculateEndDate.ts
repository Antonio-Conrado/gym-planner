import { Concept } from "@/app/generated/prisma";
import { startOfDay } from "date-fns";

export function calculateendDateDate(startDate: Date, concept: Concept): Date {
  const endDate = startOfDay(startDate);

  switch (concept) {
    case Concept.DAY:
      endDate.setDate(endDate.getDate() + 1);
      break;
    case Concept.WEEK:
      endDate.setDate(endDate.getDate() + 7);
      break;
    case Concept.FORTNIGHT:
      endDate.setDate(endDate.getDate() + 14);
      break;
    case Concept.MONTH:
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case Concept.QUARTER:
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case Concept.SEMESTER:
      endDate.setMonth(endDate.getMonth() + 6);
      break;
    case Concept.YEAR:
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    case Concept.OTHER:
      break;
  }
  return startOfDay(endDate);
}
