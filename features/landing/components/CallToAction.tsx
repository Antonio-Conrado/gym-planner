"use client";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CallToAction() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleStart = () => {
    if (!session?.user) {
      router.push("/login");
    } else {
      router.push("/#plans");
    }
  };
  return (
    <section className="py-24 bg-linear-to-r from-orange-500 to-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-white text-4xl sm:text-5xl mb-6">
          ¿Listo para transformar tu vida?
        </h2>
        <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
          Únete a miles de personas que ya están logrando sus objetivos con Gym
          Planner
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-orange-100 text-lg px-8 shadow-md"
            onClick={handleStart}
          >
            Comenzar ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>{" "}
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
      </div>
    </section>
  );
}
