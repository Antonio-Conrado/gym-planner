import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function Plans() {
  const plans = [
    {
      name: "Día",
      price: "2",
      period: "día",
      description: "Ideal para entrenar por un día",
      features: [
        "Acceso al gimnasio",
        "Zona de pesas y cardio",
        "Vestuarios y duchas",
        "Entrenador personal disponible (opcional)",
      ],
      popular: false,
    },
    {
      name: "Semana",
      price: "10",
      period: "semana",
      description: "Entrena toda la semana sin límites",
      features: [
        "Acceso al gimnasio",
        "Zona de pesas y cardio",
        "Vestuarios y duchas",
        "Entrenador personal disponible (opcional)",
      ],
      popular: false,
    },
    {
      name: "Quincena",
      price: "18",
      period: "quincena",
      description: "Entrena 15 días a tu ritmo",
      features: [
        "Acceso al gimnasio",
        "Zona de pesas y cardio",
        "Vestuarios y duchas",
        "Entrenador personal disponible (opcional)",
      ],
      popular: false,
    },
    {
      name: "Mes",
      price: "30",
      period: "mes",
      description: "La opción más conveniente para ti",
      features: [
        "Acceso al gimnasio",
        "Zona de pesas y cardio",
        "Vestuarios y duchas",
        "Entrenador personal disponible (opcional)",
      ],
      popular: true,
    },
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-2 ${
                plan.popular
                  ? "border-orange-500 shadow-xl scale-105"
                  : "border-gray-200 shadow-md"
              } hover:shadow-xl transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-linear-to-r from-orange-500 to-red-500 text-white border-none px-4 py-1">
                    Más popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/ {plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                <Button
                  className={`w-full mt-6 ${
                    plan.popular
                      ? "bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  size="lg"
                >
                  Comenzar ahora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
