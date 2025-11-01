import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
          height={1200}
          width={1200}
        />
        <div className="absolute inset-0 bg-linear-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto ">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[130px] md:text-[180px] leading-none text-transparent bg-clip-text bg-linear-to-b from-orange-500 to-orange-600 opacity-90 select-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-12 space-y-4">
          <h2 className="text-white text-3xl md:text-5xl">
            Página no encontrada
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <Link
          href={"/"}
          className="inline-flex items-center gap-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50"
        >
          <Home className="w-5 h-5" />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
}
