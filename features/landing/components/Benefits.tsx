import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CheckCircle2, Heart, Shield, Zap } from "lucide-react";
import Image from "next/image";

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-600 border-none">
            Nuestros clientes
          </Badge>
          <h2 className="text-gray-900 text-4xl sm:text-5xl mb-4">
            Historias de éxito reales
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Muchas personas han transformado sus vidas con Gym Planner
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1758875569414-120ebc62ada3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluZXIlMjBjbGllbnR8ZW58MXx8fHwxNzYxNzg1OTc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Cliente entrenando"
                    className="w-full h-64 object-cover rounded-lg"
                    width={500}
                    height={500}
                  />
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white border-none">
                    -18kg en 5 meses
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Plan personalizado de entrenamiento
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Seguimiento nutricional semanal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Motivación constante del equipo
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-l-4 border-l-orange-500 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-orange-500" />
                  <span className="text-orange-600">Salud cardiovascular</span>
                </div>
                <h3 className="text-gray-900 text-2xl mb-2">Mejora tu salud</h3>
                <p className="text-gray-600">
                  Nuestros programas están diseñados para mejorar tu salud
                  general, no solo tu apariencia física.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-red-500" />
                  <span className="text-red-600">Energía y vitalidad</span>
                </div>
                <h3 className="text-gray-900 text-2xl mb-2">
                  Aumenta tu energía
                </h3>
                <p className="text-gray-600">
                  Siente cómo tu nivel de energía se dispara y cómo mejora tu
                  rendimiento en todas las áreas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <span className="text-purple-600">
                    Prevención de lesiones
                  </span>
                </div>
                <h3 className="text-gray-900 text-2xl mb-2">Entrena seguro</h3>
                <p className="text-gray-600">
                  Técnicas correctas y supervisión profesional para evitar
                  lesiones y maximizar resultados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
