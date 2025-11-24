import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { PaymentsClient } from "../type/paymentsClient";
import { CONCEPT, PAYMENT_METHOD } from "@/lib/enum";
import { BadgeCent, CircleCheckBig, CreditCard } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import { formatDate } from "@/lib/helpers/formatDate";
type Props = {
  payment: PaymentsClient;
};

export default function PaymentClientCard({ payment }: Props) {
  return (
    <Card className="shadow-lg mx-5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CircleCheckBig className="h-4 w-5 text-green-500 " />
          {payment.user.name}
        </div>
        <CardDescription>
          {CONCEPT[payment.paymentConcept.concept]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="flex justify-between py-1">
          <span className="text-gray-700 font-medium">Monto</span>
          <span className="text-orange-500 font-semibold">
            C$ {payment.price}
          </span>
        </div>
        <Separator className="my-2" />
        {/* payment method */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {payment.method === "CASH" ? <BadgeCent /> : <CreditCard />}
            <span className="font-medium">Método de pago:</span>
            <span className="text-gray-700">
              {PAYMENT_METHOD[payment.method]}
            </span>
          </div>
          {payment.reference && (
            <p className="text-gray-600">Referencia: {payment.reference}</p>
          )}
          {/* paidAt */}
          <p className="text-gray-600">
            Pago realizado: {formatDate(payment.paidAt.toString())}
          </p>
          {/* start date - end date */}
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-gray-700 font-medium">
              Período de entrenamiento:
            </p>
            <div className="flex flex-col md:flex-row  gap-4 text-gray-600">
              <span>Inicio: {formatDate(payment.startDate.toString())}</span>
              <span>Fin: {formatDate(payment.endDate.toString())}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
