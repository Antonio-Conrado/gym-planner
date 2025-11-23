import { DaysOfWeek } from "@/app/generated/prisma";

export type AdminClient = {
  id: number;
  name: string;
  email: string;
  telephone: string | null;
  status: boolean;
  createdAt: Date;
  ClientTrainerPlan: {
    trainer: {
      user: {
        name: string;
      };
    };
    daysOfWeek: DaysOfWeek[];
  }[];
};

export type AdminClientsResponse = {
  clients: AdminClient[];
  filteredClientsCount: number;
  clientsTotal: number;
};
