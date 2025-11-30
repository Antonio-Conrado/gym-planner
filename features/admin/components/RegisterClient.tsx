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
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { registerClient } from "../action/registerClient-action";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { registerClientByAdminInitialState } from "../schema/registerClientByAdminSchema";
import { toast } from "sonner";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { FormError } from "@/shared/components/forms/FormError";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Spinner } from "@/shared/components/ui/spinner";
import { DAYS_OF_WEEK, WEEK_DAYS } from "@/lib/enum";
import ShowGeneratedClientCredentials from "./ShowGeneratedClientCredentials";

export type GeneratedClientCredentials = {
  email: string;
  password: string;
} | null;

type trainersAvailable = {
  user: {
    name: string;
    email: string;
  };
  id: number;
};

export function RegisterClient() {
  const [open, setOpen] = useState(false);
  const [wantsTrainer, setWantsTrainer] = useState(false);
  const [showInformationDialog, setShowInformationDialog] = useState(false);
  const [generatedInformation, setGeneratedInformation] =
    useState<GeneratedClientCredentials>(null);

  const [state, formAction, isPending] = useActionState(
    registerClient,
    createInitialState(registerClientByAdminInitialState)
  );

  const { data: trainers, isLoading } = useQuery<trainersAvailable[]>({
    queryKey: ["trainers-available"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/trainers/available`);
      const data = await res.json();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: wantsTrainer,
  });

  const closeDialog = useEffectEvent(() => {
    setOpen(false);
  });
  const toggleWantsTrainer = useEffectEvent((value: boolean) => {
    setWantsTrainer(value);
  });

  const showInformationModal = useEffectEvent(
    (showInformation: boolean, information: GeneratedClientCredentials) => {
      setShowInformationDialog(showInformation);
      if (information) {
        setGeneratedInformation({
          email: information.email,
          password: information.password,
        });
      }
    }
  );

  useEffect(() => {
    if (state) {
      if (state.status === status.SUCCESS) {
        closeDialog();
        toast.success(state.message);
        if (state.data?.generatedPassword && state.data.generatedEmail) {
          showInformationModal(true, {
            email: state.data.generatedEmail,
            password: state.data.generatedPassword,
          });
        }
      }
      if (state.status === status.ERROR) toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (state) {
      if (state.status === status.PENDING) {
        if (wantsTrainer) toggleWantsTrainer(true); // Keep the trainer selection visible while the form is pending and the user wants a trainer.
      }
    }
  }, [state, wantsTrainer]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-gray-800 hover:bg-gray-700 hover:cursor-pointer text-white hover:text-white"
          >
            Crear nuevo cliente
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo cliente</DialogTitle>
            <DialogDescription>
              Ingresa los datos del cliente en el formulario a continuación para
              registrarlo.
            </DialogDescription>
            <p className="text-gray-600 text-sm">
              * Si el cliente no tiene correo, se generará uno con una
              contraseña temporal que debe entregarse al cliente para iniciar
              sesión.
            </p>
          </DialogHeader>
          <form action={formAction} noValidate>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nombre </Label>
                <Input
                  name="name"
                  placeholder="Escribe el nombre"
                  defaultValue={state.data?.name}
                />
                <FormError message={state.errors.name} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Email (opcional) </Label>
                <Input
                  name="email"
                  placeholder="Escribe el email"
                  defaultValue={state.data?.email ?? ""}
                />
                <FormError message={state.errors.email} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="telephone">Teléfono (opcional) </Label>
                <Input
                  name="telephone"
                  placeholder="Ingrese el número de teléfono"
                  defaultValue={state.data?.telephone ?? ""}
                />
                <FormError message={state.errors.telephone} />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="wantsTrainer">¿Desea entrenador?</Label>
                <Checkbox
                  id="wantsTrainer"
                  type="button"
                  name="wantsTrainer"
                  className="border-gray-700"
                  checked={wantsTrainer}
                  onCheckedChange={(checked) =>
                    setWantsTrainer(checked === true)
                  }
                />

                {!wantsTrainer && (
                  <span className="text-sm text-gray-700">
                    Si no selecciona, se asignará entrenamiento libre.
                  </span>
                )}
                {wantsTrainer && (
                  <FormError message={state.errors.wantsTrainer} />
                )}
              </div>

              {wantsTrainer && (
                <>
                  {isLoading ? (
                    <Spinner />
                  ) : trainers && trainers.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="trainerId">Seleccionar entrenador</Label>
                      <Select name="trainerId">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Elige un entrenador" />
                        </SelectTrigger>
                        <SelectContent>
                          {trainers.map((trainer) => (
                            <SelectItem
                              key={trainer.id}
                              value={trainer.id.toString()}
                            >
                              {trainer.user.name} - {trainer.user.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormError message={state.errors.trainerId} />
                    </div>
                  ) : (
                    <span className="text-sm">
                      No hay entrenadores disponibles
                    </span>
                  )}
                </>
              )}

              {wantsTrainer && trainers && (
                <div className="grid gap-3">
                  <Label>Días de entrenamiento</Label>
                  <div className="grid grid-rows-2 grid-cols-3 gap-3">
                    {WEEK_DAYS.map((day) => (
                      <Label key={day}>
                        <input
                          type="checkbox"
                          value={day ?? ""}
                          defaultChecked={state.data?.daysOfWeek?.includes(day)}
                          name="daysOfWeek"
                        />
                        {DAYS_OF_WEEK[day]}
                      </Label>
                    ))}
                  </div>

                  <FormError message={state.errors.daysOfWeek} />
                </div>
              )}
            </div>

            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Crear nuevo cliente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {setShowInformationDialog && (
        <ShowGeneratedClientCredentials
          showInformationDialog={showInformationDialog}
          generatedInformation={generatedInformation}
          setShowInformationDialog={setShowInformationDialog}
          setGeneratedInformation={setGeneratedInformation}
        />
      )}
    </>
  );
}
