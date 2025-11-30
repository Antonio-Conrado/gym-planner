import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import prisma from "@/lib/prisma";
import ErrorAlert from "@/shared/components/alert/ErrorAlert";

type Props = {
  params: Promise<{ token: string }>;
};
export default async function Page({ params }: Props) {
  const { token } = await params;
  if (!token) {
    return (
      <ErrorAlert
        title="Acceso denegado"
        description="El token proporcionado no es válido."
        href="/login"
        linkValue="Iniciar sesión"
      />
    );
  }

  const user = await prisma.user.findUnique({
    where: { tokenResetPassword: token },
    select: { id: true, tokenResetPassword: true },
  });

  if (!user) {
    return (
      <ErrorAlert
        title="Token no válido"
        description="El enlace para restablecer tu contraseña es inválido o ya fue utilizado."
        href="/login"
        linkValue="Iniciar sesión"
      />
    );
  }

  return <ResetPasswordForm token={token} />;
}
