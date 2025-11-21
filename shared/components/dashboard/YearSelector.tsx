import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface YearSelectorProps {
  years: number[];
  currentYear: number;
  setSelectedYear: Dispatch<SetStateAction<string>>;
}

export function YearSelector({
  years,
  currentYear,
  setSelectedYear,
}: YearSelectorProps) {
  return (
    <Select
      value={String(currentYear)}
      onValueChange={(value) => setSelectedYear(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
