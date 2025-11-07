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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import {
  routineDetailForm,
  routineDetailFormSchema,
} from "../../schema/clientRoutineDetail";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { DAYS_OF_WEEK } from "@/lib/enum";
import { DaysOfWeek } from "@/app/generated/prisma";
import { ExerciseWithMeta } from "./RoutineDetails";

type Props = {
  routineId: number;
  setExercises: Dispatch<SetStateAction<ExerciseWithMeta[]>>;
};

export function ClientRoutineDetailForm({ routineId, setExercises }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },

    reset,
    control,
  } = useForm({
    resolver: zodResolver(routineDetailFormSchema),
  });

  const onSubmit = (data: routineDetailForm) => {
    // Add the new exercise to state to immediately display it in the routine history.
    // Mark it as "new" so the user can review changes and save them in a single request
    // to avoid multiple server calls.
    const generateId = () => Date.now() + Math.random();
    const newExercise: ExerciseWithMeta = {
      ...data,
      id: generateId(),
      routineId,
      notes: data.notes || null,
      isNew: true,
    };

    setExercises((prev) => [...prev, newExercise]);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-800 hover:bg-gray-700">
          <Plus />
          Agregar ejercicio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Agregar ejercicio</DialogTitle>
          <DialogDescription>
            Añade un nuevo ejercicio a la rutina
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-3">
            {/* day of week */}
            <Label>Día de la semana</Label>
            <div className="w-full">
              <Controller
                name="daysOfWeek"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un día" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {Object.values(DaysOfWeek).map((day) => (
                        <SelectItem key={day} value={day}>
                          {DAYS_OF_WEEK[day]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.daysOfWeek?.message && (
                <p className="text-red-500 text-sm mt-3">
                  {errors.daysOfWeek.message}
                </p>
              )}
            </div>

            {/* name */}
            <InputForm
              register={register}
              errors={errors}
              name="name"
              label="Nombre de la rutina"
              placeholder="Ej: Hipertrofia tren superior"
            />

            {/* muscle */}
            <InputForm
              register={register}
              errors={errors}
              name="muscle"
              label="Músculo objetivo"
              placeholder="Ej: Pecho"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="grid gap-3">
                {/* sets */}
                <InputForm
                  register={register}
                  errors={errors}
                  name="sets"
                  label="Series"
                  type="number"
                  placeholder="Ej: 4"
                />
              </div>

              <div className="grid gap-3">
                {/* reps */}
                <InputForm
                  register={register}
                  errors={errors}
                  name="reps"
                  label="Repeticiones"
                  placeholder="Ej: 8-10 repeticiones o 1 minuto"
                />
              </div>
            </div>

            {/* notes */}
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    placeholder="Añade notas sobre el ejercicio"
                    {...field}
                    value={field.value ?? ""}
                  />
                </div>
              )}
            />
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Agregar ejercicio</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
