import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { CONCEPT } from "@/lib/enum";
import { PaymentConcept } from "@/app/generated/prisma";
import { PaymentConceptForm } from "./PaymentConceptForm";

type Props = {
  paymentConcepts: PaymentConcept[];
};

export default function PaymentConcepts({ paymentConcepts }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle>Lista de concepto de pago</CardTitle>
            <CardDescription>
              Administra los conceptos de pago y sus precios.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            {paymentConcepts.length > 0 ? (
              <TableBody>
                {paymentConcepts.map((paymentConcept) => (
                  <TableRow key={paymentConcept.id}>
                    {/* concept */}
                    <TableCell>{CONCEPT[paymentConcept.concept]}</TableCell>
                    {/* price */}
                    <TableCell>C$ {paymentConcept.amount}</TableCell>
                    {/*actions */}
                    <TableCell>
                      <PaymentConceptForm defaultValue={paymentConcept} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
