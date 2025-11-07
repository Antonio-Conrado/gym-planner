"use client";
import { Role, Schedule, Trainer, User } from "@/app/generated/prisma";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { status } from "@/shared/interfaces/initialStateAction";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { DAYS_OF_WEEK } from "@/lib/enum";
import { useAppStore } from "@/store/useStore";

type Props = {
  client: Session | null;
  schedules: Schedule[];
  trainerId: Trainer["id"];
  trainerName: User["name"];
};
export default function RequestTraining({
  client,
  schedules,
  trainerId,
  trainerName,
}: Props) {
  const router = useRouter();
  const [activeReservation, setActiveReservation] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const setNotifications = useAppStore((state) => state.setNotifications);

  const handleRequest = async () => {
    if (!client) return router.push("/login");
    setActiveReservation(true);
  };

  const handleCreateReservation = async () => {
    if (!client) return router.push("/login");
    const response = await fetch("/api/clients/create-reservation-training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: client.user.id,
        clientName: client.user.name,
        trainerId,
        trainerName,
        daysOfWeek: selectedDays,
      }),
    });
    const reservation = await response.json();

    if (reservation.status === status.ERROR) {
      toast.warning(reservation.message);
    }
    if (reservation.status === status.COMPLETED) {
      setNotifications(); // Mark that there are new notifications so the NotificationsBell component updates its indicator
      toast.success(reservation.message);
    }
  };

  const isTrainer = client?.user?.role === Role.TRAINER;
  const showButton = !client || !isTrainer;

  return (
    <>
      {showButton && (
        <Button className="mx-auto" onClick={handleRequest}>
          Solicitar entrenamiento
        </Button>
      )}

      <AlertDialog open={activeReservation} onOpenChange={setActiveReservation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Selecciona los días de entrenamiento
            </AlertDialogTitle>
            <div>
              <p className="text-gray-600 text-sm">
                Selecciona los días que deseas entrenar con este entrenador. El
                entrenador recibirá una notificación para estar al tanto de tu
                solicitud.
              </p>

              <ToggleGroup
                type="multiple"
                variant="outline"
                value={selectedDays}
                onValueChange={setSelectedDays}
                spacing={5}
                className="flex w-full justify-center items-center  mt-5"
              >
                {schedules.map((schedule) => (
                  <ToggleGroupItem
                    value={schedule.dayOfWeek}
                    key={schedule.id}
                    className="data-[state=on]:bg-orange-200"
                  >
                    {DAYS_OF_WEEK[schedule.dayOfWeek]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateReservation}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
