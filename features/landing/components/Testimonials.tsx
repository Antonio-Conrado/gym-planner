import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { StarRating } from "@/shared/components/ui/StartRating";
import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      name: "María González",
      role: "Miembro desde 2024",
      rating: 5,
      text: "He perdido 15kg en 4 meses. Los entrenadores son increíbles y siempre están ahí para motivarte. ¡Mejor decisión de mi vida!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    },
    {
      name: "Carlos Ramírez",
      role: "Miembro desde 2023",
      rating: 5,
      text: "Las instalaciones son de primer nivel y el ambiente es muy motivador. He ganado masa muscular y mejorado mi salud general.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    },
    {
      name: "Ana Martínez",
      role: "Miembro desde 2024",
      rating: 5,
      text: "Las clases grupales son fantásticas. He conocido gente increíble y ahora el ejercicio es parte esencial de mi rutina diaria.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
  ];
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-600 border-none">
            Testimonios
          </Badge>
          <h2 className="text-gray-900 text-4xl sm:text-5xl mb-4">
            Lo que dicen nuestros miembros
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Historias reales de personas reales que han transformado sus vidas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                    height={100}
                    width={100}
                  />
                  <div>
                    <CardTitle className="text-lg text-gray-900">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </div>
                <StarRating rating={testimonial.rating} />
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 italic">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
