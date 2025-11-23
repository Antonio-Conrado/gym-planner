import Notifications from "@/features/notifications/components/Notifications";
import ErrorAlert from "@/shared/components/alert/ErrorAlert";

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: Props) {
  const param = await params;
  const id = Number(param.id);

  if (isNaN(id) || !id) {
    return (
      <ErrorAlert
        title="Página de notificaciones no encontrada"
        description="El enlace que intentaste abrir no es válido o no existe."
        isRedirectBack={true}
      />
    );
  }

  return (
    <div className="p-6">
      <Notifications id={id} />
    </div>
  );
}
