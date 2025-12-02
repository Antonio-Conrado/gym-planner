"use client";

import { Concept, PaymentConcept, Role } from "@/app/generated/prisma";
import { Button } from "@/shared/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = { plan: PaymentConcept };

export default function Checkout({ plan }: Props) {
  const session = useSession();
  const router = useRouter();

  const handleCheckout = async () => {
    if (session.status === "unauthenticated") {
      toast.warning("Debe iniciar sesión para continuar con el pago.");
      router.push("/login");
      return;
    }

    if (session.data && session.data.user.role !== Role.CLIENT) {
      toast.warning("Esta acción solo está disponible para clientes.");
      router.push("/#plans");
      return;
    }

    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.amount,
          paymentConceptId: plan.id,
          paymentConcept: plan.concept,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.message || "Error al crear sesión de pago";
        toast.error(message);
        return;
      }
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("No se pudo redirigir al pago");
      }
    } catch {
      toast.error("Hubo un error al iniciar el pago. Intenta de nuevo");
    }
  };

  return (
    <>
      <Button
        className={`w-full mt-6 ${
          plan.concept === Concept.MONTH || plan.concept === Concept.QUARTER
            ? "bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            : "bg-gray-900 hover:bg-gray-800"
        }`}
        size="lg"
        onClick={handleCheckout}
      >
        Comenzar ahora
      </Button>
    </>
  );
}
