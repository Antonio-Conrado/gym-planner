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
  //admin
  await prisma.user.create({
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
      photo: "https://i.pravatar.cc/150?img=2",
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
      photo: "https://i.pravatar.cc/150?img=3",
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      name: "Juan Pérez",
      slug: "4-juan-perez",
      email: "juan@gym.com",
      password: hashedPassword,
      role: "CLIENT",
      telephone: "55555555",
      photo: "https://i.pravatar.cc/150?img=4",
    },
  });

  // ================================
  // TRAINERS
  // ================================
  const trainer1 = await prisma.trainer.create({
    data: {
      userId: trainerUser1.id,
      specialityId: crossfit.id,
      rating: 4,
      votesCount: 4,
      biography:
        "Entrenador con más de 8 años de experiencia en fuerza, acondicionamiento físico y CrossFit. Especializado en programas personalizados para clientes de todos los niveles.",
      status: true,
      schedules: {
        create: [
          {
            dayOfWeek: "MONDAY",
            startTime: new Date("2025-11-03T08:00:00Z"),
            endTime: new Date("2025-11-03T10:00:00Z"),
          },
          {
            dayOfWeek: "WEDNESDAY",
            startTime: new Date("2025-11-05T08:00:00Z"),
            endTime: new Date("2025-11-05T10:00:00Z"),
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

  await prisma.trainer.create({
    data: {
      userId: trainerUser2.id,
      specialityId: strength.id,
      biography:
        "Entrenadora enfocada en fuerza y resistencia, con programas diseñados para mejorar la musculatura y la condición física general.",
      rating: 5,
      votesCount: 5,
      status: true,
      schedules: {
        create: [
          {
            dayOfWeek: "TUESDAY",
            startTime: new Date("2025-11-04T10:00:00Z"),
            endTime: new Date("2025-11-04T12:00:00Z"),
          },
          {
            dayOfWeek: "THURSDAY",
            startTime: new Date("2025-11-06T14:00:00Z"),
            endTime: new Date("2025-11-06T16:00:00Z"),
          },
        ],
      },
    },
  });

  // ================================
  // TRAINER REVIEWS
  // ================================
  await prisma.trainerReview.create({
    data: {
      trainerId: trainer1.id,
      clientId: clientUser.id,
      rating: 5,
      comment: "Excelente entrenador, clases muy motivadoras y efectivas.",
    },
  });

  // ================================
  // RESERVATIONS
  // ================================
  const firstSchedule = await prisma.schedule.findFirst({
    where: { trainerId: trainer1.id },
  });
  if (firstSchedule) {
    const reservation = await prisma.reservation.create({
      data: {
        clientId: clientUser.id,
        trainerId: trainer1.id,
        scheduleId: firstSchedule.id,
        status: "CONFIRMED",
        notes: "Primera clase de prueba",
      },
    });

    await prisma.reservationHistory.create({
      data: {
        reservationId: reservation.id,
        oldStatus: "PENDING",
        newStatus: "CONFIRMED",
        notes: "Confirmada por el entrenador",
        changedByRole: "TRAINER",
      },
    });
  }

  // ================================
  // USER PROGRESS
  // ================================
  await prisma.userProgress.create({
    data: {
      userId: clientUser.id,
      weight: 72.5,
      height: 175,
      chest: 95,
      waist: 82,
      hips: 97,
      biceps: 30,
      legs: 55,
      calf: 35,
      notes: "Inicio del programa de fuerza",
      photos: { create: [{ url: "https://i.pravatar.cc/300?img=12" }] },
      routines: {
        create: [
          {
            name: "Rutina de Fuerza Inicial",
            description: "Entrenamiento de cuerpo completo 3 veces por semana",
          },
        ],
      },
    },
  });

  // ================================
  // PAYMENTS
  // ================================
  await prisma.payment.create({
    data: {
      userId: clientUser.id,
      amount: 50.0,
      method: "CASH",
      concept: "MONTH",
    },
  });

  console.log("✅ Seed executed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
