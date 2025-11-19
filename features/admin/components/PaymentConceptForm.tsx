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
import { Pen, Trash } from "lucide-react";
import { PaymentConcept } from "@/app/generated/prisma";
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
  defaultValue: PaymentConcept;
};

export function PaymentConceptForm({ defaultValue }: Props) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<string[]>(
    defaultValue.includedServices
  );
  // form
  const updatePaymentConceptWithId = updatePaymentConceptAction.bind(
    null,
    defaultValue.id
  );

  const [state, formAction, pending] = useActionState(
    updatePaymentConceptWithId,
    createInitialState(paymentConceptInitialValues)
  );

  // Manage included services in local state before saving to the database
  const handleAddService = () => setServices([...services, ""]);
  const handleChangeService = (index: number, value: string) => {
    const updated = [...services];
    updated[index] = value;
    setServices(updated);
  };
  const handleRemoveService = (index: number) => {
    const updated = services.filter((_, i) => i !== index);
    setServices(updated);
  };

  // Close dialog when the form is successfully submitted
  const closeDialog = useEffectEvent(() => {
    setServices(defaultValue.includedServices);
    setOpen(false);
  });
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
                defaultValue={CONCEPT[defaultValue.concept]}
                readOnly
              />
            </div>

            {/* description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                defaultValue={defaultValue.description}
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

            {/* Included Services */}
            <div className="grid gap-2">
              <Label>Servicios incluidos</Label>
              {services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    name="includedServices"
                    value={service}
                    onChange={(e) => handleChangeService(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveService(index)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddService}
              >
                Agregar servicio
              </Button>
            </div>
            <FormError message={state.errors.includedServices} />
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
