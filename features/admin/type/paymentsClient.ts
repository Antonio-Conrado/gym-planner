import { Payment, PaymentConcept, User } from "@/app/generated/prisma";

export type PaymentsClient = Payment & {
  paymentConcept: {
    amount: PaymentConcept["amount"];
    concept: PaymentConcept["concept"];
  };
  user: {
    name: User["name"];
  };
};

export type PaymentsClientResponse = {
  payments: PaymentsClient[];
  totalPayments: number;
  totalPaid: number;
};
