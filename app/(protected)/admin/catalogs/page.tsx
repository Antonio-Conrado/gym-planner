import PaymentConcepts from "@/features/admin/components/PaymentConcepts";
import Trainers from "@/features/admin/components/Trainers";
import prisma from "@/lib/prisma";

async function fetchTrainersAndPaymentConcept() {
  try {
    const [trainers, paymentConcept] = await Promise.all([
      await prisma.trainer.findMany({
        include: {
          user: {
            select: {
              name: true,
              slug: true,
              email: true,
              telephone: true,
            },
          },
          speciality: {
            select: { name: true },
          },
        },
        orderBy: { id: "asc" },
      }),
      await prisma.paymentConcept.findMany({
        orderBy: { id: "asc" },
      }),
    ]);
    return {
      trainers,
      paymentConcept,
    };
  } catch {
    return {
      trainers: [],
      paymentConcept: [],
    };
  }
}

export default async function Page() {
  const { trainers, paymentConcept } = await fetchTrainersAndPaymentConcept();

  return (
    <div className="p-6 flex flex-col gap-6">
      <Trainers trainers={trainers} />
      <PaymentConcepts paymentConcepts={paymentConcept} />
    </div>
  );
}
