"use client";

import sendResetPasswordTokenAction from "@/features/auth/action/sendResetPasswordTokenAction-action";
import { sendResetPasswordTokenInitialState } from "@/features/auth/schemas/sendResetTokenPasswordSchema";
import { FormError } from "@/shared/components/forms/FormError";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    sendResetPasswordTokenAction,
    createInitialState(sendResetPasswordTokenInitialState)
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
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Restablecer contraseña</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña de manera segura.
        </CardDescription>
      </CardHeader>
      <form action={formAction} noValidate>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                placeholder="Ingresa tu correo electrónico"
              />
              <FormError message={state.errors.email} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col justify-center gap-2 w-full mt-5">
          <Button type="submit" className="w-full" disabled={isPending}>
            Enviar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
