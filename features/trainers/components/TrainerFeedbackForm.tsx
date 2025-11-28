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
import { useState } from "react";

type Props = {
  trainerId: number;
  slug: string;
};
export default function TrainerFeedbackForm({ trainerId, slug }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Calificar y dejar comentario</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Calificar entrenador</DialogTitle>
            <DialogDescription>
              Otorga una calificación con estrellas y deja un comentario sobre
              el desempeño del entrenador.
            </DialogDescription>
          </DialogHeader>
          <RateTrainerForm
            trainerId={trainerId}
            allowComment={true}
            slug={slug}
            setOpen={setOpen}
          />
        </DialogContent>
      </form>
    </Dialog>
  );
}
