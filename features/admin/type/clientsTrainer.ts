import {
  ClientTrainerPlan,
  Schedule,
  Speciality,
  User,
} from "@/app/generated/prisma";

export type trainerInformation = {
  speciality: {
    name: Speciality["name"];
  };
  user: {
    name: User["name"];
    status: boolean;
    email: User["email"];
    telephone: User["telephone"] | null;
    photo: string | null;
  };
  schedules: Schedule[];
};

export type ClientTrainer = ClientTrainerPlan & {
  client: {
    name: User["name"];
    email: User["email"];
    telephone: User["telephone"] | null;
    payments: {
      startDate: Date;
      endDate: Date;
    }[];
  };
};

export type ClientsTrainerResponse = {
  trainerClients: ClientTrainer[];
  totalTrainerClients: number;
  totalFilteredTrainerClients: number;
  totalActiveClientsWithPayment: number;
};
