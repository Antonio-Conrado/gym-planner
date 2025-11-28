import { Schedule } from "@/app/generated/prisma";
import { WEEK_DAYS } from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useEffectEvent, useState } from "react";

type ScheduleError = {
  id: number;
  startTimeError?: string;
  endTimeError?: string;
};

type Props = {
  trainerId: number;
  open: boolean;
};

export default function useTrainerSchedule({ trainerId, open }: Props) {
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleError[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  // Load the trainer's schedules from the server
  const { data, isLoading } = useQuery<Schedule[]>({
    queryKey: ["trainer-schedules", { trainerId }],
    queryFn: async () => {
      const res = await fetch(`/api/admin/trainers/${trainerId}/schedules`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al cargar horarios");
      }
      const data: Schedule[] = await res.json();
      return data;
    },
    enabled: open, // Only run the query when the dialog  is open
  });

  // Sets the schedule state with all 7 days once data is loaded
  const setInitialWeekSchedule = useEffectEvent((merged: Schedule[]) => {
    setSchedule(merged);
  });

  // Build a full week schedule once `data` is loaded.
  // Use existing schedule if available, otherwise use null
  useEffect(() => {
    if (data) {
      const fullWeek: Schedule[] = WEEK_DAYS.map((day, index) => {
        const workDay = data.find((d) => d.dayOfWeek === day);

        return {
          trainerId,
          id: workDay ? workDay.id : -index - 1,
          dayOfWeek: day,
          startTime: workDay?.startTime ? new Date(workDay.startTime) : null,
          endTime: workDay?.endTime ? new Date(workDay.endTime) : null,
          createdAt: workDay?.createdAt
            ? new Date(workDay.createdAt)
            : new Date(),
          updatedAt: workDay?.updatedAt
            ? new Date(workDay.updatedAt)
            : new Date(),
        };
      });

      setInitialWeekSchedule(fullWeek);
    }
  }, [data, trainerId]);

  const validateTime = (scheduleCopy: Schedule[], index: number) => {
    const { startTime, endTime } = scheduleCopy[index];
    const errorsCopy = [...scheduleErrors];

    // Get existing error for this item or create a new one
    const errorObj: ScheduleError = errorsCopy.find(
      (error) => error.id === scheduleCopy[index].id
    ) || {
      id: scheduleCopy[index].id,
    };

    if (startTime === null || endTime === null) {
      // If only one time is set, show an error
      errorObj.startTimeError = "Ambas horas deben estar seleccionadas";
    } else if (startTime >= endTime) {
      // If both times exist but startTime is after or equal to endTime
      errorObj.startTimeError =
        "La hora de inicio no puede ser mayor o igual a la hora de salida";
    } else {
      // All times are valid
      errorObj.startTimeError = undefined;
    }

    // Update or add the error in the array
    const idxError = errorsCopy.findIndex(
      (error) => error.id === scheduleCopy[index].id
    );
    if (idxError >= 0) errorsCopy[idxError] = errorObj;
    else errorsCopy.push(errorObj);

    // Save the updated errors
    setScheduleErrors(errorsCopy);
  };

  // Update the start or end time for a specific day in the schedule
  const handleChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const copy = [...schedule]; // Make a copy of the current schedule state
    const [hours, minutes] = value.split(":").map(Number); // Split the input "HH:mm" into hours and minutes
    const date = copy[index][field] ? new Date(copy[index][field]) : new Date(); // Use existing date if it exists, otherwise create a new Date object
    date.setHours(hours, minutes, 0, 0); // Set the hours and minutes on the date
    copy[index][field] = date; // Update the specific field in the copied array
    setSchedule(copy); // Update the schedule state with the modified array

    // Validate the updated time
    validateTime(copy, index);
  };

  const handleRemoveDay = (index: number) => {
    // Create a copy of the schedule and set the times of the selected day to null
    const newSchedule = schedule.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          startTime: null,
          endTime: null,
        };
      }
      return item;
    });

    // Update the schedule state
    setSchedule(newSchedule);

    // remove any errors for this day
    setScheduleErrors((prev) =>
      prev.map((error) =>
        error.id === schedule[index].id
          ? { ...error, startTimeError: undefined, endTimeError: undefined }
          : error
      )
    );
  };

  return {
    isLoading,
    schedule,
    handleChange,
    scheduleErrors,
    handleRemoveDay,
  };
}
