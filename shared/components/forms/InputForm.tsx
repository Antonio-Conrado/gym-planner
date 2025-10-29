import { Input } from "@/shared/components/ui/input";
import { Label } from "../ui/label";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  type?: "text" | "email" | "number" | "date" | "password";
  name: Path<T>;
  placeholder: string;
  label: string;
  readonly?: boolean;
  disabled?: boolean;
};

export function InputForm<T extends FieldValues>({
  register,
  errors,
  type,
  name,
  placeholder,
  label,
  readonly = false,
  disabled = false,
}: Props<T>) {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type ?? "text"}
        placeholder={placeholder}
        className={errors[name] ? "border-red-500" : ""}
        readOnly={readonly}
        disabled={disabled}
        {...register(name)}
      />

      {errors[name]?.message && (
        <div className="text-red-500 text-sm">
          {errors[name]?.message as string}
        </div>
      )}
    </>
  );
}
