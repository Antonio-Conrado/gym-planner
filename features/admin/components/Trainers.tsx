import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Speciality, Trainer, User } from "@/app/generated/prisma";
import { TrainerToggleStatus } from "./TrainerToggleStatus";
import Link from "next/link";
import { Info } from "lucide-react";

type trainer = Trainer & {
  user: {
    name: User["name"];
    slug: User["slug"];
    email: User["email"];
    telephone: User["telephone"];
  };
  speciality: {
    name: Speciality["name"];
  };
};

type Props = {
  trainers: trainer[];
};

export default function Trainers({ trainers }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de entrenadores</CardTitle>
        <CardDescription>
          Gestiona los datos de los entrenadores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Biografía</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            {trainers.length > 0 ? (
              <TableBody>
                {trainers.map((trainer) => (
                  <TableRow key={trainer.id}>
                    {/* name */}
                    <TableCell>{trainer.user.name}</TableCell>

                    {/* contact */}
                    <TableCell>
                      {trainer.user.email}
                      <span className="block text-gray-700 ">
                        Tel: {trainer.user.telephone ?? "--"}
                      </span>
                    </TableCell>

                    {/* biography */}
                    <TableCell>
                      {trainer.biography
                        ? `${trainer.biography.slice(0, 35)}...`
                        : "---"}
                    </TableCell>

                    {/* speciality */}
                    <TableCell>
                      <Badge>{trainer.speciality.name}</Badge>
                    </TableCell>

                    {/* status */}
                    <TableCell>
                      {trainer.status === true ? "Disponible" : "No disponible"}
                    </TableCell>

                    <TableCell className="flex items-center gap-3">
                      <TrainerToggleStatus
                        id={trainer.id}
                        isActive={trainer.status}
                      />

                      <Link href={`/admin/trainers/${trainer.id}`}>
                        <Info className="text-cyan-700" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
