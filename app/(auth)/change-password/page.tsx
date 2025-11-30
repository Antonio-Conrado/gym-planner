import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import ErrorAlert from "@/shared/components/alert/ErrorAlert";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return (
      <ErrorAlert
        title="No hay sesión"
        description="Debes iniciar sesión"
        href="/login"
        linkValue="Iniciar sesión"
      />
    );
  }

  return <ResetPasswordForm userId={+session.user.id} />;
}
