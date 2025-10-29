"use client";
import { startTransition, useActionState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  createInitialState,
  status,
} from "@/shared/interfaces/initialStateAction";
import { login } from "../../../features/auth/schemas/login";
import { useForm } from "react-hook-form";
import { AlertError, InputForm } from "@/shared/components/forms";
import {
  register,
  registerInitialState,
  registerSchema,
} from "@/features/auth/schemas/register";
import { registerAction } from "@/features/auth/action/register-action";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    registerAction,
    createInitialState(registerInitialState)
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<register>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: login) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.status === status.ERROR) {
      toast.error(state.message);
    }
    if (state.status === status.SUCCESS) {
      toast.success(state.message);
      router.push("/login");
      reset();
    }
  }, [state, reset, router]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Registrarse</CardTitle>
        <CardDescription>
          Ingresa tus datos personales para crear tu cuenta
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <InputForm
                register={register}
                errors={errors}
                label="Nombre"
                placeholder="Ingresa tu nombre"
                name="name"
                type="text"
              />
              {state.errors?.name && <AlertError message={state.errors.name} />}
            </div>
            <div className="grid gap-2">
              <InputForm
                register={register}
                errors={errors}
                label="Correo electrónico"
                placeholder="Ingresa tu correo electrónico"
                name="email"
                type="email"
              />
              {state.errors?.email && (
                <AlertError message={state.errors.email} />
              )}
            </div>
            <div className="grid gap-2">
              <InputForm
                register={register}
                errors={errors}
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                name="password"
                type="password"
              />
              {state.errors?.password && (
                <AlertError message={state.errors.password} />
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col justify-center gap-2 w-full mt-5">
          <Button type="submit" className="w-full" disabled={pending}>
            Registrarse
          </Button>

          <Link href={"/login"} className="text-gray-800 text-sm ">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
