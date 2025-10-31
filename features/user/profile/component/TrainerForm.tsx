"use client";

import { Speciality, Trainer } from "@/app/generated/prisma";
import { Button } from "@/shared/components/ui/button";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { toast } from "sonner";
import {
  TrainerFormData,
  trainerInitialState,
  trainerSchema,
} from "../schema/trainer";
import { trainerAction } from "../action/trainer-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";

type Props = {
  trainer: Trainer;
  speciality: Speciality[];
};

export default function TrainerForm({ trainer, speciality }: Props) {
  const trainerWithId = trainerAction.bind(null, trainer.id);
  const [state, formAction, pending] = useActionState(
    trainerWithId,
    createInitialState(trainerInitialState)
  );

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(trainerSchema),
  });

  useEffect(() => {
    if (trainer) {
      reset({
        biography: trainer.biography,
      });
    }
  }, [reset, trainer]);

  const onSubmit = (data: TrainerFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status === status.ERROR) toast.error(state.message);

    if (state.status === status.SUCCESS) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-medium text-gray-700">Perfil</h3>
        <p className="text-gray-600 text-sm">
          Realiza cambios en tu perfil aquí. Haz clic en guardar cuando hayas
          terminado.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-6">
          {/* biography */}
          <div className="grid gap-2">
            <Label htmlFor="biography">Biografía</Label>
            <Controller
              name="biography"
              control={control}
              defaultValue={trainer.biography || ""}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="biography"
                  placeholder="Escribe tu biografía aquí..."
                  className="w-full"
                />
              )}
            />
            {errors.biography && (
              <p className="text-red-500 text-sm">{errors.biography.message}</p>
            )}
          </div>

          {/* speciality */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Especialidad
            </label>
            <Controller
              control={control}
              name="specialityId"
              defaultValue={trainer.specialityId}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {speciality.map((spec) => (
                      <SelectItem key={spec.id} value={String(spec.id)}>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.specialityId && (
              <p className="text-red-500 text-sm">
                {errors.specialityId.message}
              </p>
            )}
          </div>
        </div>
        <Button type="submit" className="mt-4 w-40" disabled={pending}>
          Guardar Cambios
        </Button>
      </form>
    </div>
  );
}
