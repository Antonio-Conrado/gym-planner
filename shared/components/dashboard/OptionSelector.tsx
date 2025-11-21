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
  currentOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
}

export function OptionSelector({
  options,
  currentOption,
  setSelectedOption,
}: OptionSelectorProps) {
  return (
    <Select
      value={currentOption}
      onValueChange={(value) => setSelectedOption(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
