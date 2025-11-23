import PaymentHistory from "@/features/admin/components/PaymentHistory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default async function Page() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Historial de pagos</CardTitle>
          <CardDescription>
            Visualiza todos los pagos realizados por tus clientes, revisando
            montos, conceptos de pagos y fechas.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-10">
          <PaymentHistory />
        </CardContent>
      </Card>
    </div>
  );
}
