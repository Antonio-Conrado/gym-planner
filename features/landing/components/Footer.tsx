import { Button } from "@/shared/components/ui/button";
import { Dumbbell, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-linear-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">
                Gym Planner
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Tu compañero en el camino hacia una vida más saludable y activa.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Instagram className="w-5 h-5" />
                </Button>
              </Link>
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/trainers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Entrenadores
                </Link>
              </li>
              <li>
                <Link
                  href="/plans"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Planes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info (opcional o puede quedar vacío por ahora) */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Contáctanos</h3>
            <p className="text-gray-400">info@gymplanner.com</p>
            <p className="text-gray-400">+505 0000 0000</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Gym Planner. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
