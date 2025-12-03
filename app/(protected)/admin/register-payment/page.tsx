import RegisterPaymentForm from "@/features/admin/components/RegisterPaymentForm";
import prisma from "@/lib/prisma";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default async function Page() {
  const paymentConcepts = await prisma.paymentConcept.findMany({
    where: {
      amount: {
        gt: 0,
      },
    },
  });

  return (
    <div className="py-6 px-6 min-h-[80vh]">
      <Card>
        <CardHeader>
          <CardTitle>Registro de pagos</CardTitle>
          <CardDescription>Registrar el pago de los clientes</CardDescription>
        </CardHeader>
        <RegisterPaymentForm paymentConcepts={paymentConcepts} />
      </Card>
    </div>
  );
}
