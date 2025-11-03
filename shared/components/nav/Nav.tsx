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
import NotificationsBell from "@/features/notifications/components/NotificationsBell";
import { navGroups, clientLinks, generalLinks } from "@/shared/data/navLinks";
import { Role } from "@/app/generated/prisma";

type Props = {
  session: Session | null;
};

export function Nav({ session }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Append role-specific dynamic links to the group, generating URLs with the user's ID
  const navGroupsWithDynamic = navGroups.map((group) => {
    if (group.title !== "Administrativo") return group;

    const updatedGroup = { ...group };

    if (session) {
      if (session.user.role === Role.CLIENT) {
        // Append admin links plus client-specific dynamic links using the session ID
        updatedGroup.links = [
          ...updatedGroup.links,
          ...clientLinks(Number(session.user.id)),
          ...generalLinks(Number(session.user.id), Role.CLIENT),
        ];
      } else if (session.user.role === Role.TRAINER) {
        // Append admin links plus trainer-specific dynamic links using the session ID
        updatedGroup.links = [
          ...updatedGroup.links,
          ...generalLinks(Number(session.user.id), Role.TRAINER),
        ];
      } else if (session.user.role === Role.ADMIN) {
        // Append admin links plus admin-specific dynamic links using the session ID
        updatedGroup.links = [
          ...updatedGroup.links,
          ...generalLinks(Number(session.user.id), Role.ADMIN),
        ];
      }
    }

    return updatedGroup;
  });

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
          <div className="hidden md:flex items-center justify-between w-fit gap-4 md:gap-8 lg:gap-12">
            {navGroupsWithDynamic.map((group) => {
              // Only show "Administrativo" group if there is an active session
              if (group.title === "Administrativo" && !session) return null;

              return (
                <NavigationMenu key={group.title}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="px-2 py-1 text-black">
                        {group.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-2">
                          {group.links.map((link) => {
                            // Validate role: only show the link if the user has the appropriate role
                            if (
                              link.roles &&
                              (!session ||
                                !session.user.role ||
                                !link.roles.includes(session.user.role))
                            ) {
                              return null;
                            }

                            return (
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
                            );
                          })}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              );
            })}
          </div>

          {/* Desktop User */}
          <div className="hidden md:flex items-center">
            {!session?.user ? (
              <Link href="/login">
                <Button>Iniciar sesión</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <NotificationsBell userId={Number(session.user.id)} />
                <UserAvatar session={session} isMobile={false} />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <div className="flex items-center gap-4">
              {session && (
                <NotificationsBell userId={Number(session.user.id)} />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="btn-gradient"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <div className="flex items-center gap-4">
                    <Menu className="w-6 h-6" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed w-full border-t border-gray-200 bg-white shadow-2xl z-50">
          <div className="px-4 py-3 space-y-2">
            {navGroupsWithDynamic.map((group) => {
              if (group.title === "Administrativo" && !session) return null;

              return (
                <div key={group.title}>
                  <p className="font-medium text-gray-600 mb-1">
                    {group.title}
                  </p>
                  {group.links.map((link) => {
                    if (
                      link.roles &&
                      (!session ||
                        !session.user.role ||
                        !link.roles.includes(session.user.role))
                    ) {
                      return null;
                    }

                    return (
                      <Link key={link.name} href={link.href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-gray-100 hover:text-gray-800"
                        >
                          {link.name}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              );
            })}

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
