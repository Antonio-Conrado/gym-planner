import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";

export const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

interface MonthSelectorProps {
  currentMonth: string | undefined;
  setSelectedMonth: Dispatch<SetStateAction<string | undefined>>;
}

export function MonthSelector({
  currentMonth,
  setSelectedMonth,
}: MonthSelectorProps) {
  return (
    <Select
      value={currentMonth ?? undefined}
      onValueChange={(value) =>
        setSelectedMonth(value === "all" ? undefined : value)
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="-- Selecciona un mes --" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"all"}>-- Todos los meses --</SelectItem>
        {months.map((month, index) => (
          <SelectItem key={month} value={String(index)}>
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
