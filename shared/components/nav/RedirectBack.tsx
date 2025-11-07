"use client";

import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function RedirectBack() {
  const router = useRouter();

  const handleRedirect = () => {
    router.back();
  };
  return (
    <Button
      className="bg-gray-800 hover:bg-gray-700 mt-1"
      onClick={handleRedirect}
    >
      <MoveLeft className="w-4" />
      Volver
    </Button>
  );
}
