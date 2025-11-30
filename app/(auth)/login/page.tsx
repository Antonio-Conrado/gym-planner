"use client";
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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { login, loginSchema } from "../../../features/auth/schemas/login";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { InputForm } from "@/shared/components/forms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn, type SignInResponse } from "next-auth/react";

export default function Page() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<login>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: login) => {
    // Sign in using NextAuth with Credentials
    const res: SignInResponse | undefined = await signIn("credentials", {
      redirect: false, // important to handle errors on the frontend
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      toast.error("Credenciales incorrectas");
    } else {
      toast.success("¡Inicio de sesión exitoso!");
      router.push("/profile");
    }
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <InputForm
                register={register}
                errors={errors}
                label="Email"
                placeholder="Ingresa tu email"
                name="email"
                type="email"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/reset-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <div className="text-red-500 text-sm">
                  {errors.password.message}{" "}
                </div>
              )}{" "}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 w-full mt-5">
          <div className="flex w-full gap-2">
            <Button type="submit" className="flex-1">
              Iniciar sesión
            </Button>

            <Button type="button" variant="outline" className="flex-1">
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>

          <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">o</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </CardFooter>
      </form>{" "}
      <Button
        variant="outline"
        className="w-4/5 mx-auto"
        onClick={() => signIn("google", { redirectTo: "/" })}
      >
        Iniciar sesión con Google
      </Button>
    </Card>
  );
}
