"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Dumbbell, Menu, X } from "lucide-react";
import UserAvatar from "./userAvatar";
import Link from "next/link";
import { Session } from "next-auth";

type Props = {
  session: Session | null;
};

export function Nav({ session }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: "Inicio", href: "/#home" },
    { name: "Beneficios", href: "/#benefits" },
    { name: "Instalaciones", href: "/#facilities" },
    { name: "Planes", href: "/#plans" },
    { name: "Testimonios", href: "/#testimonials" },
    { name: "Contacto / Ubicación", href: "/#contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div className="bg-linear-to-r from-orange-500 to-red-500 p-2 rounded-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg">
              Gym Planner
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-gray-100 hover:text-orange-500"
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop User */}
          <div className="hidden md:flex items-center">
            {!session?.user ? (
              <Link href="/login">
                <Button>Iniciar sesión</Button>
              </Link>
            ) : (
              <UserAvatar session={session} isMobile={false} />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="btn-gradient"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-gray-100 hover:text-orange-500"
                >
                  {link.name}
                </Button>
              </Link>
            ))}

            {!session?.user ? (
              <Link href="/login">
                <Button className="w-full">Iniciar sesión</Button>
              </Link>
            ) : (
              <UserAvatar session={session} isMobile={true} />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
