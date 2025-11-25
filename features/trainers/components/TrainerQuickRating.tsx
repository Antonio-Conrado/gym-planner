"use client";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import RateTrainerForm from "./RateTrainerForm";

type Props = {
  trainerId: number;
  slug: string;
};
export default function TrainerQuickRating({ trainerId, slug }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Calificar con estrellas</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Calificar entrenador</DialogTitle>
          <DialogDescription>
            Otorga una calificación rápida con estrellas al entrenador.
          </DialogDescription>
        </DialogHeader>
        <RateTrainerForm trainerId={trainerId} slug={slug} />
      </DialogContent>
    </Dialog>
  );
}
