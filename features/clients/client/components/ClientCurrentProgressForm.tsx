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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Plus } from "lucide-react";
import { registerClientProgressAction } from "../../action/registerClientProgress-action";
import { useActionState, useEffect } from "react";
import { clientProgressFormInitialValues } from "../../schema/clientProgress";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { AlertError } from "@/shared/components/forms";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function ClientCurrentProgressForm({
  userProgressId,
}: {
  userProgressId: number;
}) {
  const clientProgressWithId = registerClientProgressAction.bind(
    null,
    userProgressId
  );

  const queryClient = useQueryClient();
  const [state, formAction, pending] = useActionState(
    clientProgressWithId,
    createInitialState(clientProgressFormInitialValues)
  );

  useEffect(() => {
    if (state) {
      if (state.status === status.ERROR) toast.error(state.message);
      if (state.status === status.COMPLETED) toast.success(state.message);
    }
  }, [state, queryClient, userProgressId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-800 hover:bg-gray-700">
          <span>
            <Plus />
          </span>
          Registrar medidas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar nuevas medidas</DialogTitle>
          <DialogDescription>
            Agrega las medidas actuales del cliente
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} noValidate>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="chest">Altura (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                placeholder="Ej: 180"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="weight">Peso (Kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="Ej: 72.5"
              />
              {state.errors.weight && state.errors.weight.length > 0 && (
                <AlertError message={state.errors.weight} />
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="chest">Pecho (cm)</Label>
              <Input
                id="chest"
                name="chest"
                type="number"
                step="0.1"
                placeholder="Ej: 98"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="waist">Cintura (cm)</Label>
              <Input
                id="waist"
                name="waist"
                type="number"
                step="0.1"
                placeholder="Ej: 80"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="hips">Cadera (cm)</Label>
              <Input
                id="hips"
                name="hips"
                type="number"
                step="0.1"
                placeholder="Ej: 95"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="biceps">Bíceps (cm)</Label>
              <Input
                id="biceps"
                name="biceps"
                type="number"
                step="0.1"
                placeholder="Ej: 34"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="legs">Piernas (cm)</Label>
              <Input
                id="legs"
                name="legs"
                type="number"
                step="0.1"
                placeholder="Ej: 55"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="calf">Pantorrillas (cm)</Label>
              <Input
                id="calf"
                name="calf"
                type="number"
                step="0.1"
                placeholder="Ej: 36"
              />
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Escribe observaciones o detalles del progreso..."
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              Guardar medidas
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
