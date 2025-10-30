import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-600 border-none">
            Contacto
          </Badge>
          <h2 className="text-gray-900 text-4xl sm:text-5xl mb-4">
            Visítanos o contáctanos
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Estamos aquí para ayudarte a comenzar tu transformación
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-xl mb-2">Ubicación</h3>
                    <p className="text-gray-600">
                      Managua, Nicaragua — Zona céntrica
                    </p>
                    <p className="text-gray-500 text-sm">
                      *Dirección referencial, texto pendiente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-xl mb-2">Teléfono</h3>
                    <p className="text-gray-600">+505 0000 0000</p>
                    <p className="text-gray-600">
                      Lun - Dom: 07:00 am - 06:00 pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-xl mb-2">Email</h3>
                    <p className="text-gray-600">info@gymplanner.com</p>
                    <p className="text-gray-600">soporte@gymplanner.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-xl mb-2">Horarios</h3>
                    <p className="text-gray-600">
                      Lunes - Sábado: 05:00 am - 22:00 pm
                    </p>
                    <p className="text-gray-600">
                      Domingo: 06:00 am - 12:00 md
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map (reference) */}
          <Card className="border-none shadow-lg overflow-hidden p-0">
            <div className="relative h-full min-h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.2144668350953!2d-86.26872902487063!3d12.13008408810676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f73f8f6a8e9c7f5%3A0xb5eb9af553d704a4!2sHyper%20Gym!5e0!3m2!1ses!2sni!4v1730280000000!5m2!1ses!2sni"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                  <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="text-gray-900 text-xl mb-2">Visítanos</h3>
                  <p className="text-gray-600 mb-4">
                    Zona central de Managua (ejemplo)
                  </p>
                  <Link
                    href="https://www.google.com/maps/place/Hyper+Gym/@12.130084,-86.268729,17z"
                    target="_blank"
                  >
                    <Button className="bg-linear-to-r from-orange-500 to-red-500">
                      Ver en Google Maps
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
