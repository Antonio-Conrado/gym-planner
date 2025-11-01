"use client";

import * as React from "react";
import Link from "next/link";
import { Dumbbell, Menu, X } from "lucide-react";
import UserAvatar from "./userAvatar";
import { Button } from "@/shared/components/ui/button";
import { Session } from "next-auth";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/shared/components/ui/navigation-menu";

type Props = {
  session: Session | null;
};

export function Nav({ session }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navGroups = [
    {
      title: "General",
      links: [
        { name: "Inicio", href: "/#home" },
        { name: "Beneficios", href: "/#benefits" },
        { name: "Instalaciones", href: "/#facilities" },
      ],
    },
    {
      title: "Servicios",
      links: [
        { name: "Planes", href: "/#plans" },
        { name: "Entrenadores", href: "/trainers" },
      ],
    },
    {
      title: "Otros",
      links: [
        { name: "Testimonios", href: "/#testimonials" },
        { name: "Contacto / Ubicación", href: "/#contact" },
      ],
    },
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
            <Link href={"/"} className="font-semibold text-gray-900 text-lg">
              Gym Planner
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between w-1/4 gap-4 ">
            {navGroups.map((group) => (
              <NavigationMenu key={group.title}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-2 py-1 text-black">
                      {group.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-2 ">
                        {group.links.map((link) => (
                          <li key={link.name}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={link.href}
                                className="flex w-full p-2 rounded-md hover:bg-gray-200 transition hover:text-gray-800"
                              >
                                {link.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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
        <div className="md:hidden fixed w-full border-t border-gray-200 bg-white  shadow-2xl z-50">
          <div className="px-4 py-3 space-y-2">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="font-medium text-gray-600 mb-1">{group.title}</p>
                {group.links.map((link) => (
                  <Link key={link.name} href={link.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-gray-100 hover:text-gray-800 "
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </div>
            ))}

            {!session?.user ? (
              <Link href="/login">
                <Button className="w-full mt-2">Iniciar sesión</Button>
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
