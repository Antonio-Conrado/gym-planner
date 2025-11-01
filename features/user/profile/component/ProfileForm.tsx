"use client";

import { User } from "@/app/generated/prisma";
import { formatDate } from "@/lib/helpers/formatDate";
import { InputForm } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profile, profileInitialState, profileSchema } from "../schema/profile";
import { profileAction } from "../action/profile-action";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { toast } from "sonner";

type Props = {
  user: {
    name: User["name"];
    email: User["email"];
    telephone: User["telephone"];
    createdAt: User["createdAt"];
  };
};
export default function ProfileForm({ user }: Props) {
  const [state, formAction, pending] = useActionState(
    profileAction,
    createInitialState(profileInitialState)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        telephone: user.telephone,
      });
    }
  }, [reset, user]);

  const onSubmit = (data: profile) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status === status.ERROR) toast.error(state.message);

    if (state.status === status.SUCCESS) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-medium text-gray-700">Perfil</h3>
        <p className="text-gray-600 text-sm">
          Realiza cambios en tu perfil aquí. Haz clic en guardar cuando hayas
          terminado.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <InputForm
              register={register}
              errors={errors}
              label="Nombre"
              placeholder=""
              name="name"
            />
          </div>
          <div className="grid gap-2">
            <InputForm
              register={register}
              errors={errors}
              label="Correo electrónico"
              placeholder=""
              name="email"
              readonly={true}
            />
          </div>
          <div className="grid gap-2">
            <InputForm
              register={register}
              errors={errors}
              label="Teléfono"
              placeholder=""
              name="telephone"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="createdAt"> Fecha de creación</Label>
            <Input
              defaultValue={formatDate(user.createdAt.toString())}
              readOnly
            />
          </div>
        </div>
        <Button type="submit" className="mt-4 w-40" disabled={pending}>
          Guardar Cambios
        </Button>{" "}
      </form>
    </div>
  );
}
