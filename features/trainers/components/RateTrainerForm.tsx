"use client";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { DialogClose, DialogFooter } from "@/shared/components/ui/dialog";
import { StarRating } from "@/shared/components/ui/StartRating";
import { RateTrainerAction } from "../action/rateTrainer-action";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { rateTrainerInitialValue } from "../schema/rateTrainerSchema";
import { FormError } from "@/shared/components/forms/FormError";
import { toast } from "sonner";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

type Props = {
  trainerId: number;
  slug: string;
  allowComment?: boolean;
};
export default function RateTrainerForm({
  trainerId,
  allowComment,
  slug,
}: Props) {
  const [stars, setStars] = useState(0);

  const rateTrainerWithId = RateTrainerAction.bind(null, trainerId, slug);
  const [state, formAction, isPending] = useActionState(
    rateTrainerWithId,
    createInitialState(rateTrainerInitialValue)
  );

  const resetStars = useEffectEvent(() => {
    setStars(0);
  });
  useEffect(() => {
    if (state) {
      if (state.status === status.COMPLETED) {
        toast.success(state.message);
        resetStars();
      }
      if (state.status === status.ERROR) toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <form action={formAction}>
        <div className="flex flex-col justify-center gap-4">
          <div className="grid gap-3">
            <Label>
              Selecciona tu calificación haciendo clic en una de las estrellas
            </Label>

            <StarRating rating={stars} setStarsRating={setStars} size="lg" />
            <input
              type="text"
              name="rating"
              className="hidden"
              value={stars}
              onChange={() => {}}
            />
            <FormError message={state.errors?.rating} />
          </div>

          {allowComment && (
            <>
              <input
                type="hidden"
                name="allowComment"
                value={allowComment ? "true" : "false"}
              />

              <div className="grid gap-3">
                <Label htmlFor="comment">Comentario</Label>
                <Textarea
                  placeholder="Escribe tu comentario"
                  name="comment"
                  defaultValue={state.data?.comment ?? ""}
                />
                <FormError message={state.errors?.comment} />
              </div>
            </>
          )}
        </div>
        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
