import { Concept } from "@/app/generated/prisma";
import { startOfDay } from "date-fns";

export function calculateEndDate(startDate: Date, concept: Concept): Date {
  const end = startOfDay(startDate);

  switch (concept) {
    case Concept.DAY:
      end.setDate(end.getDate() + 1);
      break;
    case Concept.WEEK:
      end.setDate(end.getDate() + 7);
      break;
    case Concept.FORTNIGHT:
      end.setDate(end.getDate() + 14);
      break;
    case Concept.MONTH:
      end.setMonth(end.getMonth() + 1);
      break;
    case Concept.QUARTER:
      end.setMonth(end.getMonth() + 3);
      break;
    case Concept.SEMESTER:
      end.setMonth(end.getMonth() + 6);
      break;
    case Concept.YEAR:
      end.setFullYear(end.getFullYear() + 1);
      break;
    case Concept.OTHER:
      break;
  }
  return startOfDay(end);
}
