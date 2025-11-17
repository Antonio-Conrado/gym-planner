"use client";
import { Label } from "@/shared/components/ui/label";
import { SearchUser } from "./SearchUser";
import { Input } from "@/shared/components/ui/input";
import { CardFooter, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { PaymentConcept, PaymentMethod } from "@/app/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CONCEPT, PAYMENT_METHOD } from "@/lib/enum";
import { FormError } from "@/shared/components/forms/FormError";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { format } from "date-fns";
import { RegisterClient } from "./RegisterClient";
import useRegisterPayment from "../hooks/useRegisterPayment";

type Props = {
  paymentConcepts: PaymentConcept[];
};

// Today's date, used to disable past dates in the calendar
const today = new Date();
today.setHours(0, 0, 0, 0);

export default function RegisterPaymentForm({ paymentConcepts }: Props) {
  const {
    state,
    formAction,
    pending,
    selectedPaymentConcept,
    setSelectedPaymentConcept,
    selectedMethod,
    setSelectedMethod,
    startDate,
    setStartDate,
    endDate,
    paidAmount,
    setPaidAmount,
    selectedClient,
    setSelectedClient,
    changeAmount,
  } = useRegisterPayment();

  return (
    <div>
      <div className="flex justify-start md:justify-end px-4 pb-4">
        <RegisterClient />
      </div>
      <form action={formAction} noValidate>
        <CardContent className="grid gap-6 px-4">
          <div className="grid gap-3 ">
            <Label>Cliente</Label>
            <SearchUser
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
            />
            <FormError message={state?.errors.userId} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            {/* payment concept */}
            <div className="grid gap-3">
              <Label htmlFor="paymentConceptId">Concepto de pago</Label>
              <Select
                name="paymentConceptId"
                value={
                  selectedPaymentConcept?.id
                    ? String(selectedPaymentConcept.id)
                    : ""
                }
                onValueChange={(value) => {
                  const concept =
                    paymentConcepts.find((pc) => pc.id === Number(value)) ??
                    null;
                  setSelectedPaymentConcept(concept);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un concepto de pago" />
                </SelectTrigger>
                <SelectContent>
                  {paymentConcepts.map((paymentConcept) => (
                    <SelectItem
                      key={paymentConcept.id}
                      value={String(paymentConcept.id)}
                    >
                      {CONCEPT[paymentConcept.concept]} - C$
                      {paymentConcept.amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormError message={state?.errors.paymentConceptId} />
            </div>

            {/* payment method */}
            <div className="grid gap-3">
              <Label htmlFor="method">Método de pago</Label>
              <Select
                name="method"
                value={selectedMethod || ""}
                onValueChange={(value) =>
                  setSelectedMethod(value as PaymentMethod)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un método de pago" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PaymentMethod).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {PAYMENT_METHOD[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormError message={state?.errors.method} />
            </div>

            {selectedMethod !== PaymentMethod.CASH && (
              <div className="grid gap-3">
                <Label>Referencia de pago</Label>
                <Input
                  name="reference"
                  defaultValue={state.data?.reference ?? ""}
                />
                <FormError message={state?.errors.reference} />
              </div>
            )}

            {/* start date */}
            <div className="grid gap-3">
              <Label>Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-gray-500 font-normal text-sm text-left"
                  >
                    {startDate
                      ? format(startDate, "dd/MM/yyyy")
                      : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    disabled={(date) => date < today}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* end date */}
            <div className="grid gap-3">
              <Label>Fecha de finalización</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-gray-500 font-normal text-sm text-left whitespace-normal "
                  >
                    {endDate
                      ? format(endDate, "dd/MM/yyyy")
                      : "Fecha de finalización calculada automáticamente"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} disabled={true} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-3">
              <Label>Monto Ingresado</Label>
              <Input
                defaultValue={0}
                onChange={(e) => setPaidAmount(+e.target.value)}
                type="number"
              />
              {selectedPaymentConcept &&
                paidAmount > 0 &&
                paidAmount < selectedPaymentConcept?.amount && (
                  <FormError message={["El monto ingresado no es válido"]} />
                )}
            </div>

            <div className="grid gap-3">
              <Label>Monto Devuelto</Label>
              <Input value={changeAmount} readOnly />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-4">
          <Button type="submit" disabled={pending || paidAmount <= 0}>
            Registrar pago
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
