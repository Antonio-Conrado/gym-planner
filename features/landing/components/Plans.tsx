import { Concept, Role } from "@/app/generated/prisma";
import Checkout from "@/features/stripe/components/Checkout";
import { auth } from "@/lib/auth";
import { CONCEPT } from "@/lib/enum";
import prisma from "@/lib/prisma";
import { Badge } from "@/shared/components/ui/badge";

import {
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default async function Plans() {
  const session = await auth();
  const plans = await prisma.paymentConcept.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <section id="plans" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-600 border-none">
            Membresías
          </Badge>
          <h2 className="text-gray-900 text-4xl sm:text-5xl font-bold mb-4">
            Elige tu plan ideal
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Sin contratos. Sin complicaciones. Entrena cuando quieras.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans
            .filter((plan) => plan.amount > 0)
            .map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 ${
                  plan.concept === Concept.MONTH ||
                  plan.concept === Concept.QUARTER
                    ? "border-orange-500 shadow-xl scale-105"
                    : "border-gray-200 shadow-md"
                } hover:shadow-xl transition-all duration-300`}
              >
                {(plan.concept === Concept.MONTH ||
                  plan.concept === Concept.QUARTER) && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-linear-to-r from-orange-500 to-red-500 text-white border-none px-4 py-1">
                      Más popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-semibold text-gray-900 ">
                    {CONCEPT[plan.concept]}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-gray-900">
                      C$ {plan.amount}
                    </span>
                    <span className="text-gray-600 ml-2">
                      / {CONCEPT[plan.concept]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <div className="flex-1 space-y-3">
                    {plan.includedServices.map((service, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                  {(!session || session.user.role === Role.CLIENT) && (
                    <Checkout plan={plan} />
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
