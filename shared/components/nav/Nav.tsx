"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Dumbbell, Menu, X } from "lucide-react";
import { useIsMobile } from "@/shared/hooks/use-mobile"; // ✅ Importa tu hook
import UserAvatar from "./userAvatar";
import Link from "next/link";
import { Session } from "next-auth";

type Props = {
  session: Session | null;
};

export function Nav({ session }: Props) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: "Inicio", href: "#home" },
    { name: "Instalaciones", href: "#facilities" },
    { name: "Planes", href: "#plans" },
    { name: "Testimonios", href: "#testimonials" },
    { name: "Contacto / Ubicación", href: "#contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-evenly items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div className="bg-linear-to-r from-orange-500 to-red-500 p-2 rounded-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Gym Planner</span>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  className="hover:bg-gray-100 hover:text-orange-500"
                  variant="ghost"
                  onClick={() => alert(`Ir a ${link.name}`)}
                >
                  {link.name}
                </Button>
              ))}
            </div>
          )}

          {/* User Dropdown (desktop) */}
          {!isMobile &&
            (!session?.user ? (
              <Link href="/login">
                <Button>Iniciar sesión</Button>
              </Link>
            ) : (
              <UserAvatar session={session} isMobile={isMobile} />
            ))}

          {/* Mobile Menu Button */}
          {isMobile && (
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
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                className="w-full justify-start hover:bg-gray-100 hover:text-orange-500"
                onClick={() => {
                  alert(`Ir a ${link.name}`);
                  setMobileMenuOpen(false);
                }}
              >
                {link.name}
              </Button>
            ))}

            {!session?.user ? (
              <Link href="/login">
                <Button>Iniciar sesión</Button>
              </Link>
            ) : (
              <UserAvatar session={session} isMobile={isMobile} />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
