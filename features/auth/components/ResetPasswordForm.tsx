"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "../action/resetPassword-action";
import { changePasswordInitialState } from "@/features/user/profile/schema/changePassword";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { FormError } from "@/shared/components/forms/FormError";

type Props = {
  userId?: number;
  token?: string;
};

export default function ResetPasswordForm({ userId, token }: Props) {
  const router = useRouter();

  const resetPasswordWithUserId = resetPasswordAction.bind(null, {
    userId,
    token,
  });
  const [state, formAction, pending] = useActionState(
    resetPasswordWithUserId,
    createInitialState(changePasswordInitialState)
  );

  useEffect(() => {
    if (state) {
      if (state.status === status.ERROR) {
        toast.error(state.message);
      }
      if (state.status === status.SUCCESS) {
        toast.success(state.message);
        router.push("/login");
      }
      console.log(state);
    }
  }, [state, router, token]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">
          {token
            ? "Restablece tu contraseña"
            : "Cambia tu contraseña por motivos de seguridad"}
        </CardTitle>
        <CardDescription>
          {token
            ? "Restablece tu contraseña para volver a acceder a tu cuenta de forma segura."
            : "Por motivos de seguridad, crea una contraseña personal para reemplazar la generada por el administrador."}
        </CardDescription>
      </CardHeader>

      <form action={formAction} noValidate>
        <CardContent>
          <div className="grid gap-6">
            {userId && (
              <div className="grid gap-3">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Ingresa tu contraseña actual"
                />
                <FormError message={state.errors.currentPassword} />
              </div>
            )}
            <input
              type="hidden"
              name="hasPassword"
              value={userId ? "true" : "false"}
            />

            <div className="grid gap-3">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                name="password"
                type="password"
                placeholder="Ingresa tu nueva contraseña"
              />
              <FormError message={state.errors.password} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirma tu nueva contraseña"
              />
              <FormError message={state.errors.confirmPassword} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col justify-center gap-2 w-full mt-5">
          <Button type="submit" className="w-full" disabled={pending}>
            Guardar Cambios
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
