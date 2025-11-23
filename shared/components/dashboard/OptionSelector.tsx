import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";

interface OptionSelectorProps {
  options: string[];
  currentOption: string | undefined;
  setSelectedOption: Dispatch<SetStateAction<string | undefined>>;
  allowAll?: boolean;
  label?: string;
  placeholder?: string;
}

export function OptionSelector({
  options,
  currentOption,
  setSelectedOption,
  allowAll,
  label,
  placeholder = "Seleccionar una opción",
}: OptionSelectorProps) {
  return (
    <Select
      value={currentOption}
      onValueChange={(value) =>
        setSelectedOption(value === label ? undefined : value)
      }
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value={label!}>-- {label} --</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option === "all" ? label : option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
