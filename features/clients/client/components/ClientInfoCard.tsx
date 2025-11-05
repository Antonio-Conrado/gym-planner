import { DaysOfWeek } from "@/app/generated/prisma";
import { DAYS_OF_WEEK } from "@/lib/enum";
import { formatDate, formatDateToDDMMYYYY } from "@/lib/helpers/formatDate";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Calendar, Mail, Phone } from "lucide-react";
import Image from "next/image";

type Props = {
  name: string;
  photo: string | null;
  email: string;
  telephone: string | null;
  createdAt: Date;
  totalSessions: number;
  lastSession: Date;
  trainingDays: DaysOfWeek[];
};

export default function ClientInfoCard({
  name,
  photo,
  email,
  telephone,
  createdAt,
  totalSessions,
  lastSession,
  trainingDays,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center justify-center">
            <Image
              src={photo ?? "/logo.png"}
              alt={name}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          </div>
          <div className="col-span-2">
            <CardTitle>{name}</CardTitle>

            <div className="flex flex-col gap-3 text-gray-700">
              <p className="flex items-center gap-3">
                <span>
                  <Mail className="h-4 w-4" />
                </span>
                {email}
              </p>
              <p className="flex items-center gap-3">
                <span>
                  <Phone className="h-4 w-4" />
                </span>
                {telephone ?? "--"}
              </p>
              <p className="flex items-center gap-3">
                <span>
                  <Calendar className="h-4 w-4" />
                </span>
                Cliente desde {formatDate(createdAt.toString())}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-3 gap-4">
        <div className="bg-gray-100 rounded-md p-3 flex flex-col gap-3">
          <p className="text-gray-700 text-sm">Total de sesiones realizadas</p>
          <p className="text-lg">{totalSessions}</p>
        </div>

        <div className="bg-gray-100 rounded-md p-3 flex flex-col gap-3">
          <p className="text-gray-700 text-sm">Ultima sesión realizada</p>
          <p className="text-sm">
            {formatDateToDDMMYYYY(lastSession.toString())}
          </p>
        </div>

        <div className="bg-gray-100 rounded-md p-3 flex flex-col gap-3">
          <p className="text-gray-700 text-sm">Días de entrenamiento</p>
          <div className="text-sm flex flex-wrap gap-2">
            {trainingDays.map((day) => (
              <Badge key={day} variant={"outline"}>
                {DAYS_OF_WEEK[day]}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
