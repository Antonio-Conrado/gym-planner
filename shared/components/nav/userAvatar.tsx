"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface UserAvatarProps {
  session: Session | null;
  isMobile: boolean;
  setMobileMenuOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function UserAvatar({
  session,
  isMobile,
  setMobileMenuOpen,
}: UserAvatarProps) {
  if (!session?.user) return null;

  const { name, email, image } = session.user;

  if (isMobile) {
    //  mobile
    return (
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="w-9 h-9">
            <AvatarImage src={image || undefined} />
            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm">{name}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start">
          <Link
            href={"/profile"}
            onClick={() => {
              setMobileMenuOpen!(false);
            }}
          >
            Mi Perfil
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full flex justify-start"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Cerrar Sesión
        </Button>
      </div>
    );
  }

  //  desktop
  return (
    <div className="flex justify-center items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar className="w-9 h-9">
              <AvatarImage src={image || undefined} />
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div>
              <div>{name}</div>
              <div className="text-xs text-gray-500">{email}</div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={"/profile"}>
            <DropdownMenuItem
              className="
          hover:cursor-pointer"
            >
              Mi Perfil
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
          hover:cursor-pointer"
          >
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
