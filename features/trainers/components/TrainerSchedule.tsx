import { Schedule } from "@/app/generated/prisma";
import { DAYS_OF_WEEK, WEEK_DAYS } from "@/lib/enum";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

type Props = {
  schedules: Schedule[];
};

export default function TrainerSchedule({ schedules }: Props) {
  return (
    <Card className="p-3 col-span-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calendar className="text-orange-500" />
          <CardTitle>Horario Disponible</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {schedules
          .sort(
            (a, b) =>
              WEEK_DAYS.indexOf(a.dayOfWeek) - WEEK_DAYS.indexOf(b.dayOfWeek)
          )
          .map(
            (schedule, index) =>
              schedule.startTime &&
              schedule.endTime && (
                <div key={schedule.id}>
                  <h2 className="text-orange-600">
                    {DAYS_OF_WEEK[schedule.dayOfWeek]}
                  </h2>

                  <ul className="flex gap-2 py-3">
                    <li className="border p-2 w-28 text-center rounded-lg">
                      {format(schedule.startTime.toString(), "HH:mm a")}
                    </li>
                    <li className="border p-2 w-28 text-center rounded-lg">
                      {format(schedule.endTime.toString(), "HH:mm a")}
                    </li>
                  </ul>

                  {index !== schedules.length - 1 && <Separator />}
                </div>
              )
          )}
      </CardContent>
    </Card>
  );
}
