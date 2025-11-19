import PaymentHistory from "@/features/admin/components/PaymentHistory";
import { fetchPaymentHistory } from "@/features/admin/lib/payment";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default async function Page() {
  const { payments, paymentsTotal } = await fetchPaymentHistory();
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
          {payments && payments.length > 0 ? (
            <PaymentHistory
              initialData={payments}
              paymentsTotal={paymentsTotal}
            />
          ) : (
            <p className="text-gray-700">
              No se pudo cargar el historial de pagos en este momento. Por
              favor, intenta nuevamente más tarde.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
