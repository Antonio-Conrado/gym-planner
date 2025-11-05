import { UserProgressHistory } from "@/app/generated/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ClientCurrentProgressForm } from "./ClientCurrentProgressForm";
type Props = {
  currentProgress?: UserProgressHistory | null;
  userProgressId: number;
};

export default function ClientCurrentProgress({
  currentProgress,
  userProgressId,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Métricas actuales</CardTitle>
          <ClientCurrentProgressForm userProgressId={userProgressId} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-orange-100 p-2 rounded-md">
          <p className="text-gray-700 text-sm">Peso Actual:</p>
          <p>{currentProgress?.weight ?? "--"} Kg</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 list-none">
          {/* Chest */}
          <li className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md list-none">
            Pecho:{" "}
            <span className="text-gray-900">
              {currentProgress?.chest != null
                ? `${currentProgress.chest} cm`
                : "--"}
            </span>
          </li>

          {/* Waist */}
          <li className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md list-none">
            Cintura:{" "}
            <span className="text-gray-900">
              {currentProgress?.waist != null
                ? `${currentProgress.waist} cm`
                : "--"}
            </span>
          </li>

          {/* Hips */}
          <li className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md list-none">
            Cadera:{" "}
            <span className="text-gray-900">
              {currentProgress?.hips != null
                ? `${currentProgress.hips} cm`
                : "--"}
            </span>
          </li>

          {/* Biceps */}
          <li className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md list-none">
            Bíceps:{" "}
            <span className="text-gray-900">
              {currentProgress?.biceps != null
                ? `${currentProgress.biceps} cm`
                : "--"}
            </span>
          </li>

          {/* Legs */}
          <li className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md list-none">
            Piernas:{" "}
            <span className="text-gray-900">
              {currentProgress?.legs != null
                ? `${currentProgress.legs} cm`
                : "--"}
            </span>
          </li>

          {/* Calves */}
          <li className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md list-none">
            Pantorrillas:{" "}
            <span className="text-gray-900">
              {currentProgress?.calf != null
                ? `${currentProgress.calf} cm`
                : "--"}
            </span>
          </li>
        </div>
      </CardContent>
    </Card>
  );
}
