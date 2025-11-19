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
import { CONCEPT } from "@/lib/enum";
import { Pen } from "lucide-react";
import { Concept } from "@/app/generated/prisma";
import { updatePaymentConceptAction } from "../action/updatePaymentConcept-action";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { paymentConceptInitialValues } from "../schema/paymentConceptShema";
import { toast } from "sonner";
import { FormError } from "@/shared/components/forms/FormError";

type Props = {
  defaultValue: { id: number; concept: Concept; amount: number };
};

export function PaymentConceptForm({ defaultValue }: Props) {
  const [open, setOpen] = useState(false);
  const updatePaymentConceptWithId = updatePaymentConceptAction.bind(
    null,
    defaultValue.id
  );

  const [state, formAction, pending] = useActionState(
    updatePaymentConceptWithId,
    createInitialState(paymentConceptInitialValues)
  );

  const closeDialog = useEffectEvent(() => setOpen(false));
  useEffect(() => {
    if (state.status === status.ERROR) toast.error(state.message);
    if (state.status === status.COMPLETED) {
      toast.success(state.message);
      closeDialog();
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pen className="text-cyan-700 hover:text-cyan-600 hover:cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar concepto de pago</DialogTitle>
          <DialogDescription>
            Completa los datos del concepto y haz clic en guardar.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} noValidate>
          <div className="grid gap-4">
            {/* Concept */}
            <div className="grid gap-2">
              <Label htmlFor="concept">Concepto</Label>
              <Input
                id="concept"
                name="concept"
                min={0}
                defaultValue={CONCEPT[defaultValue.concept]}
                readOnly
              />
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount">Precio (C$)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={0}
                defaultValue={defaultValue.amount}
              />
              <FormError message={state.errors.amount} />
            </div>
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
