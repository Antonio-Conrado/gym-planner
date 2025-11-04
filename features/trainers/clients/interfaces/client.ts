import { ClientTrainerPlan } from "@/app/generated/prisma";
export type ClientTrainerPlanData = ClientTrainerPlan & {
  client: {
    name: string;
    photo: string | null;
    email: string;
    telephone: string | null;
  };
};
