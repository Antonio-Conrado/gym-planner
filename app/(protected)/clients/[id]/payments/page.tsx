import PaymentsClient from "@/features/admin/components/PaymentsClient";
import ErrorAlert from "@/shared/components/alert/ErrorAlert";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const param = await params;
  const id = Number(param.id);

  if (isNaN(id) || !id)
    return (
      <ErrorAlert
        title="Los pagos del cliente no se encontraron"
        description="El enlace que intentaste abrir no es válido o no existe."
      />
    );

  return <div className="p-6">{<PaymentsClient id={id} />}</div>;
}
