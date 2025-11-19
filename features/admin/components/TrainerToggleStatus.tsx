"use client";
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
import { UserCheck, UserMinus } from "lucide-react";
import { useState } from "react";
import { toggleTrainerStatusAction } from "../action/toggleTrainerStatusAction";
import { status } from "@/shared/interfaces/initialStateAction";
import { toast } from "sonner";

type Props = {
  id: number;
  isActive: boolean;
};

export function TrainerToggleStatus({ id, isActive }: Props) {
  const [open, setOpen] = useState(false);
  console.log(isActive);
  const handleToggleStatus = async () => {
    const result = await toggleTrainerStatusAction(id, isActive);
    setOpen(false);
    if (result.status === status.COMPLETED) toast.success(result.message);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {isActive ? (
            <UserMinus className="text-red-600 w-4 h-4" />
          ) : (
            <UserCheck className="text-green-600 w-4 h-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {isActive ? "Desactivar entrenador" : "Reactivar entrenador"}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? "Esta acción desactivará al entrenador y no podrá iniciar sesión hasta que se reactive."
              : "Esta acción reactivará al entrenador y podrá acceder nuevamente a la plataforma."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={handleToggleStatus}
          >
            {isActive ? "Desactivar" : "Reactivar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
