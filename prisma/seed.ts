import { PrismaClient } from "../app/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Abc123*", 10);

  // ================================
  // CATEGORIES
  // ================================
  await prisma.category.createMany({
    data: [
      { name: "CrossFit" },
      { name: "Weightlifting" },
      { name: "Yoga" },
      { name: "Cardio" },
    ],
  });

  // ================================
  // SPECIALITIES
  // ================================
  const crossfit = await prisma.speciality.create({
    data: { name: "CrossFit" },
  });
  const strength = await prisma.speciality.create({
    data: { name: "Entrenamiento de fuerza" },
  });

  // ================================
  // USERS
  // ================================
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      slug: "1-admin-user",
      email: "admin@gym.com",
      password: hashedPassword,
      role: "ADMIN",
      telephone: "88888888",
      photo: "https://i.pravatar.cc/150?img=1",
    },
  });

  const trainerUser1 = await prisma.user.create({
    data: {
      name: "Carlos López",
      slug: "2-carlos-lopez",
      email: "carlos@gym.com",
      password: hashedPassword,
      role: "TRAINER",
      telephone: "77777777",
      photo:
        "https://images.unsplash.com/photo-1696563996353-214a3690bb11?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
    },
  });

  const trainerUser2 = await prisma.user.create({
    data: {
      name: "María Fernández",
      slug: "3-maria-fernandez",
      email: "maria@gym.com",
      password: hashedPassword,
      role: "TRAINER",
      telephone: "87777777",
      photo:
        "https://images.unsplash.com/photo-1685811982522-46383318bc8d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    },
  });

  const clientWithTrainer = await prisma.user.create({
    data: {
      name: "Laura Gómez",
      slug: "4-laura-gomez",
      email: "laura@gym.com",
      password: hashedPassword,
      role: "CLIENT",
      telephone: "55555511",
      photo: "https://i.pravatar.cc/150?img=10",
    },
  });

  const clientFree = await prisma.user.create({
    data: {
      name: "Pedro Martínez",
      slug: "5-pedro-martinez",
      email: "pedro@gym.com",
      password: hashedPassword,
      role: "CLIENT",
      telephone: "55555522",
      photo: "https://i.pravatar.cc/150?img=11",
    },
  });

  // ================================
  // TRAINERS
  // ================================
  const trainer1 = await prisma.trainer.create({
    data: {
      userId: trainerUser1.id,
      specialityId: crossfit.id,
      biography:
        "Entrenador con más de 8 años de experiencia en fuerza y CrossFit.",
      rating: 4,
      votesCount: 4,
      status: true,
      schedules: {
        create: [
          {
            dayOfWeek: "MONDAY",
            startTime: new Date("2025-11-03T08:00:00Z"),
            endTime: new Date("2025-11-03T10:00:00Z"),
          },
          {
            dayOfWeek: "TUESDAY",
            startTime: new Date("2025-11-04T08:00:00Z"),
            endTime: new Date("2025-11-04T10:00:00Z"),
          },
          {
            dayOfWeek: "WEDNESDAY",
            startTime: new Date("2025-11-05T08:00:00Z"),
            endTime: new Date("2025-11-05T10:00:00Z"),
          },
          {
            dayOfWeek: "THURSDAY",
            startTime: new Date("2025-11-06T08:00:00Z"),
            endTime: new Date("2025-11-06T10:00:00Z"),
          },
          {
            dayOfWeek: "FRIDAY",
            startTime: new Date("2025-11-07T08:00:00Z"),
            endTime: new Date("2025-11-07T10:00:00Z"),
          },
        ],
      },
    },
  });

  const trainer2 = await prisma.trainer.create({
    data: {
      userId: trainerUser2.id,
      specialityId: strength.id,
      biography: "Entrenadora enfocada en fuerza y resistencia.",
      rating: 5,
      votesCount: 5,
      status: true,
      schedules: {
        create: [
          {
            dayOfWeek: "TUESDAY",
            startTime: new Date("2025-11-04T08:00:00Z"),
            endTime: new Date("2025-11-04T10:00:00Z"),
          },
          {
            dayOfWeek: "THURSDAY",
            startTime: new Date("2025-11-06T08:00:00Z"),
            endTime: new Date("2025-11-06T10:00:00Z"),
          },
          {
            dayOfWeek: "SATURDAY",
            startTime: new Date("2025-11-01T08:00:00Z"),
            endTime: new Date("2025-11-01T10:00:00Z"),
          },
        ],
      },
    },
  });

  // ================================
  // TRAINER REVIEWS
  // ================================
  await prisma.trainerReview.createMany({
    data: [
      // 🔹trainer1
      {
        trainerId: trainer1.id,
        clientId: clientWithTrainer.id,
        rating: 5,
        comment: "Excelente entrenador, muy atento y profesional.",
      },
      {
        trainerId: trainer1.id,
        clientId: clientFree.id,
        rating: 4,
        comment: "Muy buena rutina, aunque algo exigente al inicio.",
      },
      {
        trainerId: trainer1.id,
        clientId: clientWithTrainer.id,
        rating: 5,
        comment: "Se nota la experiencia, los entrenamientos son efectivos.",
      },

      // 🔹 trainer2
      {
        trainerId: trainer2.id,
        clientId: clientWithTrainer.id,
        rating: 5,
        comment: "Excelente guía, explica cada movimiento con detalle.",
      },
      {
        trainerId: trainer2.id,
        clientId: clientFree.id,
        rating: 4,
        comment:
          "Muy buena energía, aunque las sesiones podrían ser más largas.",
      },
      {
        trainerId: trainer2.id,
        clientId: clientWithTrainer.id,
        rating: 5,
        comment: "Resultados visibles desde la segunda semana.",
      },
    ],
  });

  // ================================
  // USER PROGRESS
  // ================================
  const userProgress = await prisma.userProgress.create({
    data: {
      userId: clientWithTrainer.id,
      weight: 65,
      height: 168,
      UserProgressHistory: {
        create: [
          {
            weight: 65,
            height: 168,
            chest: 90,
            waist: 70,
            hips: 95,
            biceps: 28,
            legs: 50,
            calf: 32,
            notes: "Progreso inicial",
          },
        ],
      },
      ProgressPhoto: {
        create: [{ url: ["https://i.pravatar.cc/300?img=12"] }],
      },
    },
  });

  // ================================
  // ROUTINES & EXERCISES
  // ================================
  const routine = await prisma.routine.create({
    data: {
      userProgressId: userProgress.id,
      trainerId: trainer1.id,
      name: "Rutina Fuerza Intermedia",
      description:
        "Entrenamiento 4 veces por semana con enfoque en fuerza y definición",
      goal: "Fuerza y definición muscular",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 28)),
      durationWeek: 4,
      RoutineExercise: {
        create: [
          // =======================
          // monday
          // =======================
          {
            name: "Press banca",
            muscle: "Pecho",
            sets: 4,
            reps: "8-10",
            daysOfWeek: "MONDAY",
            notes: "Mantener control en la bajada",
          },
          {
            name: "Press inclinado con mancuernas",
            muscle: "Pecho",
            sets: 3,
            reps: "10",
            daysOfWeek: "MONDAY",
            notes: "Evitar rebote",
          },
          {
            name: "Dominadas",
            muscle: "Espalda",
            sets: 4,
            reps: "8",
            daysOfWeek: "MONDAY",
            notes: "Usar agarre pronado",
          },
          {
            name: "Remo con barra",
            muscle: "Espalda",
            sets: 3,
            reps: "10",
            daysOfWeek: "MONDAY",
            notes: "Mantener espalda recta",
          },

          // =======================
          // tuesday
          // =======================
          {
            name: "Sentadillas",
            muscle: "Piernas",
            sets: 4,
            reps: "10",
            daysOfWeek: "TUESDAY",
            notes: "Profundidad completa",
          },
          {
            name: "Prensa inclinada",
            muscle: "Piernas",
            sets: 3,
            reps: "12",
            daysOfWeek: "TUESDAY",
            notes: "No bloquear rodillas",
          },
          {
            name: "Peso muerto rumano",
            muscle: "Isquiotibiales",
            sets: 3,
            reps: "10",
            daysOfWeek: "TUESDAY",
            notes: "Controlar bajada",
          },
          {
            name: "Extensión de piernas",
            muscle: "Cuádriceps",
            sets: 3,
            reps: "15",
            daysOfWeek: "TUESDAY",
            notes: "",
          },

          // =======================
          // wednesday
          // =======================
          {
            name: "Press militar con barra",
            muscle: "Hombros",
            sets: 4,
            reps: "8-10",
            daysOfWeek: "WEDNESDAY",
            notes: "No arquear la espalda",
          },
          {
            name: "Elevaciones laterales",
            muscle: "Hombros",
            sets: 3,
            reps: "15",
            daysOfWeek: "WEDNESDAY",
            notes: "Movimientos controlados",
          },
          {
            name: "Pájaros con mancuernas",
            muscle: "Hombros posteriores",
            sets: 3,
            reps: "12",
            daysOfWeek: "WEDNESDAY",
            notes: "",
          },
          {
            name: "Encogimientos con barra",
            muscle: "Trapecios",
            sets: 4,
            reps: "15",
            daysOfWeek: "WEDNESDAY",
            notes: "",
          },

          // =======================
          // thursday
          // =======================
          {
            name: "Curl bíceps con barra",
            muscle: "Bíceps",
            sets: 3,
            reps: "12",
            daysOfWeek: "THURSDAY",
            notes: "",
          },
          {
            name: "Curl martillo",
            muscle: "Bíceps",
            sets: 3,
            reps: "12",
            daysOfWeek: "THURSDAY",
            notes: "",
          },
          {
            name: "Extensiones en polea alta",
            muscle: "Tríceps",
            sets: 3,
            reps: "15",
            daysOfWeek: "THURSDAY",
            notes: "",
          },
          {
            name: "Fondos en paralelas",
            muscle: "Tríceps",
            sets: 3,
            reps: "10",
            daysOfWeek: "THURSDAY",
            notes: "Evitar sobreextender codos",
          },
        ],
      },
    },
  });

  // ================================
  // CLIENT TRAINER PLAN
  // ================================
  await prisma.clientTrainerPlan.create({
    data: {
      clientId: clientWithTrainer.id,
      trainerId: trainer1.id,
      daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"],
    },
  });

  // ================================
  // PAYMENTS
  // ================================
  await prisma.payment.createMany({
    data: [
      {
        userId: clientWithTrainer.id,
        amount: 60,
        method: "CARD",
        concept: "MONTH",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "COMPLETED",
        paidAt: new Date(),
      },
      {
        userId: clientFree.id,
        amount: 50,
        method: "CASH",
        concept: "MONTH",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "COMPLETED",
        paidAt: new Date(),
      },
    ],
  });

  // ================================
  // NOTIFICATIONS
  // ================================
  await prisma.notification.createMany({
    data: [
      {
        userId: trainer1.id,
        type: "TRAINING_REQUEST",
        message: `El cliente ${clientWithTrainer.name} seleccionó días de entrenamiento: Lunes, Miércoles, Viernes`,
        read: false,
      },
      {
        userId: clientWithTrainer.id,
        type: "GENERAL",
        message: `Has registrado tus días de entrenamiento con ${trainerUser1.name}: Lunes, Miércoles, Viernes.`,
        read: false,
      },
    ],
  });

  console.log("✅ Seed ejecutado correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Seed falló:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
