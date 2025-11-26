import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { trainerInformation } from "../type/clientsTrainer";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { Clock, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { DAYS_OF_WEEK } from "@/lib/enum";
import { Separator } from "@/shared/components/ui/separator";

type Props = {
  trainer: trainerInformation;
};

export default function TrainerInfoCard({ trainer }: Props) {
  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-800 font-normal">
          Información de contacto
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="flex items-start gap-4">
            {trainer.user.photo && (
              <Image
                src={trainer.user.photo}
                alt={trainer.user.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-orange-500"
              />
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-gray-800 font-medium text-lg mb-2">
                {trainer.user.name}
              </h3>

              <Badge variant="default" className="text-sm px-3">
                {trainer.speciality.name}
              </Badge>
            </div>
          </div>

          {/* contact */}
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 " />
              <span className="text-sm break-all">{trainer.user.email}</span>
            </div>

            {/* telephone */}
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{trainer.user.telephone ?? "--"}</span>
            </div>

            {/* status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Estado:</span>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                  trainer.user.status
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    trainer.user.status ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
                {trainer.user.status ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* schedule */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              Horarios del entrenador
            </span>
          </div>
          <div className="grid grid-col-1 md:grid-cols-2 gap-3 mt-2">
            {trainer.schedules.map((item, index) => (
              <Badge
                key={index}
                className="flex justify-between items-center p-3"
                variant={"secondary"}
              >
                <span>{DAYS_OF_WEEK[item.dayOfWeek]}: </span>
                {format(item.startTime.toString(), "HH:mm a")} -{" "}
                {format(item.endTime.toString(), "HH:mm a")}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
