"use client";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Users,
  Target,
  TrendingUp,
  Award,
  Flame,
  ArrowRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleStart = () => {
    if (!session?.user) {
      router.push("/login");
    } else {
      router.push("/#plans");
    }
  };

  const stats = [
    { icon: Users, value: "1,000+", label: "Miembros activos" },
    { icon: Award, value: "10+", label: "Entrenadores certificados" },
    { icon: Target, value: "95%", label: "Tasa de satisfacción" },
    { icon: TrendingUp, value: "10,000+", label: "Objetivos cumplidos" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1573858129038-6f98c3cb2ac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzYxODI0ODE5fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Gym Training"
          className="w-full h-full object-cover"
          height={1400}
          width={1400}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-6 bg-orange-500 hover:bg-orange-600 text-white border-none">
          <Flame className="w-4 h-4 mr-1" />
          Únete a más de 1000+ miembros
        </Badge>

        <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl mb-6 max-w-4xl mx-auto">
          Transforma tu cuerpo,{" "}
          <span className="bg-linear-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            eleva tu vida
          </span>
        </h1>

        <p className="text-gray-200 text-xl sm:text-2xl mb-10 max-w-2xl mx-auto">
          Entrena con los mejores profesionales, alcanza tus metas y descubre tu
          mejor versión
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8"
            onClick={handleStart}
          >
            Comenzar ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Link href="/trainers">
            <Button
              size="lg"
              variant="outline"
              className="border-white hover:text-gray-900 hover:bg-gray-300 text-lg px-8"
            >
              Ver entrenadores
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-linear-to-r from-orange-500 to-red-500 p-3 rounded-lg">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-white text-3xl mb-1">{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
