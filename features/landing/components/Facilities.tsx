import { Dumbbell, Activity, ShowerHead, Lock } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Image from "next/image";

export default function Facilities() {
  const facilities = [
    {
      title: "Zona de Pesas",
      description: "Amplio espacio con máquinas y pesas libres",
      image:
        "https://images.unsplash.com/photo-1671970922029-0430d2ae122c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Dumbbell,
    },
    {
      title: "Área Cardio",
      description: "Caminadoras, bicicletas y elípticas modernas",
      image:
        "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Activity,
    },
    {
      title: "Vestuarios y Duchas",
      description: "Instalaciones limpias y cómodas para tu comodidad",
      image:
        "https://images.unsplash.com/photo-1711361234578-1845b58b20c0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
      icon: ShowerHead,
    },
    {
      title: "Lockers y Seguridad",
      description: "Guarda tus pertenencias con tranquilidad",
      image:
        "https://images.unsplash.com/photo-1527187162622-535b785f65f5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1109",
      icon: Lock,
    },
  ];

  return (
    <section id="facilities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-600 border-none">
            Instalaciones
          </Badge>
          <h2 className="text-gray-900 text-4xl sm:text-5xl font-bold mb-4">
            Todo lo que necesitas para entrenar
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Espacios cómodos, equipamiento moderno y el mejor ambiente para tus
            entrenamientos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility, index) => (
            <Card
              key={index}
              className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  height={500}
                  width={500}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white p-2 rounded-lg mb-2 shadow">
                    <facility.icon className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-gray-900">
                  {facility.title}
                </CardTitle>
                <CardDescription>{facility.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
