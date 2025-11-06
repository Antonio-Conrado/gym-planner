import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { format } from "date-fns";

type CalendarInputProps = {
  value: Date | undefined;
  disabled?: boolean;
  onChange: (date: Date) => void;
};

export function CalendarInput({
  value,
  disabled = false,
  onChange,
}: CalendarInputProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full text-gray-500 font-normal text-sm"
        >
          {value ? format(value, "dd/MM/yyyy") : "Selecciona una fecha"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => date && onChange(date)}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
