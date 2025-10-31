"use client";

import { useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { InputForm } from "@/shared/components/forms";
import { useActionState } from "react";
import { toast } from "sonner";
import {
  changePasswordSchema,
  changePassword,
  changePasswordInitialState,
} from "../schema/changePassword";
import { changePasswordAction } from "../action/changePassword-action";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";

type Props = {
  userId: number;
  hasPassword: boolean;
};

export default function ChangePasswordForm({ userId, hasPassword }: Props) {
  const changePasswordWithId = changePasswordAction.bind(null, userId);
  const [state, formAction, pending] = useActionState(
    changePasswordWithId,
    createInitialState(changePasswordInitialState)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<changePassword>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: changePassword) => {
    console.log(data);
    const formData = new FormData();
    Object.entries({ ...data, userId }).forEach(([key, value]) => {
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
      reset();
    }
  }, [state, reset]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-medium text-gray-700">
          {" "}
          {hasPassword ? "Cambiar Contraseña" : "Establecer Contraseña"}
        </h3>
        <p className="text-gray-600 text-sm">
          Aquí puedes{" "}
          {hasPassword ? "cambiar tu contraseña" : "establecer tu contraseña"}.
          Asegúrate de guardar los cambios al finalizar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-6">
          {hasPassword && (
            <div className="grid gap-2">
              <InputForm
                register={register}
                errors={errors}
                label="Contraseña actual"
                placeholder="Ingresa tu contraseña actual"
                name="currentPassword"
                type="password"
              />
            </div>
          )}

          <div className="grid gap-2">
            <InputForm
              register={register}
              errors={errors}
              label="Nueva contraseña"
              placeholder="Ingresa la nueva contraseña"
              name="password"
              type="password"
            />
          </div>

          <div className="grid gap-2">
            <InputForm
              register={register}
              errors={errors}
              label="Confirmar contraseña"
              placeholder="Repite la nueva contraseña"
              name="confirmPassword"
              type="password"
            />
          </div>
        </div>
        <Button type="submit" className="mt-4 w-40" disabled={pending}>
          {hasPassword ? "Cambiar contraseña" : "Establecer contraseña"}
        </Button>
      </form>
    </div>
  );
}
