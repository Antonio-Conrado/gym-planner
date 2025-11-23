import { ClientTrainerPlan } from "@/app/generated/prisma";
export type ClientTrainerPlanData = ClientTrainerPlan & {
  client: {
    name: string;
    photo: string | null;
    email: string;
    telephone: string | null;
  };
};

export type ClientQueryResponse = {
  clients: ClientTrainerPlanData[];
  totalClients: number;
};
