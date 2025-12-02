"use client";

import { useState } from "react";
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
import { Input } from "@/shared/components/ui/input";
import { CalendarClock, X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Spinner } from "@/shared/components/ui/spinner";
import { DAYS_OF_WEEK } from "@/lib/enum";
import useTrainerSchedule from "../hooks/useTrainerSchedule";
import { updateTrainerScheduleAction } from "../action/updateTrainerSchedule-action";
import { status } from "@/shared/interfaces/initialStateAction";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { formatTimeForInput } from "@/lib/helpers/formatDate";

type Props = {
  trainerId: number;
};

export function TrainerScheduleForm({ trainerId }: Props) {
  const [open, setOpen] = useState(false);

  // Custom hook to fetch the trainer's schedule and manage the form state with days and times
  const { isLoading, schedule, handleChange, scheduleErrors, handleRemoveDay } =
    useTrainerSchedule({
      trainerId,
      open,
    });

  const queryClient = useQueryClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateTrainerScheduleAction(schedule);

    if (result.status === status.SUCCESS) {
      queryClient.invalidateQueries({
        queryKey: ["trainer-schedules", { trainerId }],
      });
      setOpen(false);
      toast.success(result.message);
    }
    if (result.status === status.ERROR) toast.error(result.message);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarClock className="text-cyan-700 hover:text-cyan-600" />
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Editar horarios</DialogTitle>
          <DialogDescription>
            Establece los horarios del entrenador
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            {schedule.map((item, idx) => {
              const errorObj = scheduleErrors.find((e) => e.id === item.id);

              return (
                <div key={item.dayOfWeek}>
                  <div className="flex flex-col md:flex-row items-center justify-around gap-3">
                    <Badge
                      className={`w-24 p-3 text-center text-sm ${
                        item.startTime
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      {DAYS_OF_WEEK[item.dayOfWeek]}
                    </Badge>

                    <div className="flex flex-col gap-1">
                      <div className="flex gap-6 justify-around items-center">
                        <div className="flex flex-col gap-2">
                          <Label>Hora de inicio</Label>
                          <Input
                            type="time"
                            value={formatTimeForInput(item.startTime)}
                            onChange={(e) =>
                              handleChange(idx, "startTime", e.target.value)
                            }
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label>Hora de Salida</Label>
                          <Input
                            type="time"
                            value={formatTimeForInput(item.endTime)}
                            onChange={(e) =>
                              handleChange(idx, "endTime", e.target.value)
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveDay(idx)}
                        >
                          <X />
                        </Button>
                      </div>

                      {/* Error message below both inputs */}
                      {errorObj?.startTimeError && (
                        <span className="text-red-500 text-sm text-wrap w-[90%] text-center">
                          {errorObj.startTimeError}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={scheduleErrors.some(
                  (e) => e.startTimeError || e.endTimeError
                )}
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
