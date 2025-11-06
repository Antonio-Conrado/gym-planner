"use client";

import { InputForm } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  routineForm,
  routineFormInitialValues,
  routineFormSchema,
} from "../../schema/clientRoutines";
import { CalendarInput } from "@/shared/components/forms/CalendarInput";
import { useState, useEffect, useActionState, startTransition } from "react";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { createClientRoutineAction } from "../../action/createClientRoutine-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  clientName: string;
  trainerId: number;
  userProgressId: number;
};

export function ClientRoutinesForm({
  clientName,
  trainerId,
  userProgressId,
}: Props) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const createClientRoutineWIthId = createClientRoutineAction.bind(
    null,
    userProgressId
  );
  const [state, formAction, pending] = useActionState(
    createClientRoutineWIthId,
    createInitialState(routineFormInitialValues)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    reset,
  } = useForm({
    resolver: zodResolver(routineFormSchema),
    defaultValues: {
      trainerId,
    },
  });

  // Validate dates and automatically set the durationWeek field
  useEffect(() => {
    if (!startDate || !endDate) return;
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInWeeks: number = Math.ceil(diffInMs / (1000 * 60 * 60 * 24 * 7));

    setValue("durationWeek", diffInWeeks.toString());
  }, [startDate, endDate, setValue, setError, clearErrors]);

  // Display success or error messages to the user based on the current action state
  useEffect(() => {
    if (state) {
      if (state.status === status.COMPLETED) {
        toast.success(state.message);
        reset();
        router.push(`/clients/routines/${state.data}`);
      }
      if (state.status === status.ERROR) toast.error(state.message);
    }
  }, [state, router, reset]);

  const onSubmit = (data: routineForm) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-800 hover:bg-gray-700">
          <Plus />
          Agregar rutina
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Rutina</DialogTitle>
          <DialogDescription>
            Define una rutina personalizada para {clientName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4">
            {/* name */}
            <InputForm
              register={register}
              errors={errors}
              name="name"
              label="Nombre de la rutina"
              placeholder="Ej: Hipertrofia tren superior"
            />

            {/* description */}
            <InputForm
              register={register}
              errors={errors}
              name="description"
              label="Descripción"
              placeholder="Breve descripción de la rutina"
            />

            {/* goal */}
            <InputForm
              register={register}
              errors={errors}
              name="goal"
              label="Objetivo"
              placeholder="Ej: Aumentar masa muscular"
            />

            {/* dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Fecha de inicio</Label>
                <CalendarInput
                  value={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setValue("startDate", date);
                  }}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Fecha de finalización</Label>
                <CalendarInput
                  value={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    setValue("endDate", date);
                  }}
                  disabled={!startDate}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* duration week */}
            <InputForm
              register={register}
              errors={errors}
              name="durationWeek"
              type="number"
              label="Duración (semanas)"
              placeholder="Calculado automáticamente"
              readonly
            />
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              Crear Rutina
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
