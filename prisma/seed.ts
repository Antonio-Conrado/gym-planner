import { Concept, DaysOfWeek, PrismaClient } from "../app/generated/prisma";
import bcrypt from "bcryptjs";

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
      email: "admin@gymplanner.com",
      password: hashedPassword,
      role: "ADMIN",
      telephone: "88888888",
      photo: "https://i.pravatar.cc/150?img=1",
      createdAt: new Date(2025, 5, 20, 11, 30, 0),
    },
  });

  const trainerUser1 = await prisma.user.create({
    data: {
      name: "Carlos López",
      slug: "2-carlos-lopez",
      email: "carlos@gymplanner.com",
      password: hashedPassword,
      role: "TRAINER",
      telephone: "77777777",
      photo:
        "https://images.unsplash.com/photo-1696563996353-214a3690bb11?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
      createdAt: new Date(2025, 5, 20, 11, 30, 0),
    },
  });

  const trainerUser2 = await prisma.user.create({
    data: {
      name: "María Fernández",
      slug: "3-maria-fernandez",
      email: "maria@gymplanner.com",
      password: hashedPassword,
      role: "TRAINER",
      telephone: "87777777",
      photo:
        "https://images.unsplash.com/photo-1685811982522-46383318bc8d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      createdAt: new Date(2025, 5, 20, 11, 30, 0),
    },
  });

  const clientWithTrainer = await prisma.user.create({
    data: {
      name: "Luis Gómez",
      slug: "Luis-gomez",
      email: "luis@gymplanner.com",
      password: hashedPassword,
      role: "CLIENT",
      telephone: "55555511",
      photo: "https://i.pravatar.cc/150?img=12",
      createdAt: new Date(2025, 5, 22, 8, 45, 0),
    },
  });

  const clientFree = await prisma.user.create({
    data: {
      name: "Pedro Martínez",
      slug: "5-pedro-martinez",
      email: "pedro@gymplanner.com",
      password: hashedPassword,
      role: "CLIENT",
      telephone: "55555522",
      photo: "https://i.pravatar.cc/150?img=11",
      createdAt: new Date(2025, 5, 25, 9, 15, 0),
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
            startTime: new Date(2025, 10, 3, 5, 0, 0),
            endTime: new Date(2025, 10, 3, 13, 0, 0),
          },
          {
            dayOfWeek: "TUESDAY",
            startTime: new Date(2025, 10, 4, 5, 0, 0),
            endTime: new Date(2025, 10, 4, 13, 0, 0),
          },
          {
            dayOfWeek: "WEDNESDAY",
            startTime: new Date(2025, 10, 5, 5, 0, 0),
            endTime: new Date(2025, 10, 5, 13, 0, 0),
          },
          {
            dayOfWeek: "THURSDAY",
            startTime: new Date(2025, 10, 6, 5, 0, 0),
            endTime: new Date(2025, 10, 6, 13, 0, 0),
          },
          {
            dayOfWeek: "FRIDAY",
            startTime: new Date(2025, 10, 7, 5, 0, 0),
            endTime: new Date(2025, 10, 7, 13, 0, 0),
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
            startTime: new Date(2025, 10, 4, 13, 0, 0),
            endTime: new Date(2025, 10, 4, 21, 0, 0),
          },
          {
            dayOfWeek: "THURSDAY",
            startTime: new Date(2025, 10, 6, 13, 0, 0),
            endTime: new Date(2025, 10, 6, 21, 0, 0),
          },
          {
            dayOfWeek: "SATURDAY",
            startTime: new Date(2025, 10, 1, 13, 0, 0),
            endTime: new Date(2025, 10, 1, 21, 0, 0),
          },
          {
            dayOfWeek: "SUNDAY",
            startTime: new Date(2025, 10, 1, 13, 0, 0),
            endTime: new Date(2025, 10, 1, 21, 0, 0),
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
  // ================================
  const userProgress = await prisma.userProgress.create({
    data: {
      userId: clientWithTrainer.id,
      weight: 65,
      height: 168,
      UserProgressHistory: {
        create: [
          {
            weight: 75,
            height: 180,
            chest: 100,
            waist: 82,
            hips: 98,
            biceps: 33,
            legs: 56,
            calf: 37,
            notes: "Progreso inicial",
            recordedAt: new Date(2025, 5, 22, 8, 45, 0), // Junio → 5
          },
          {
            weight: 76,
            height: 180,
            chest: 101,
            waist: 83,
            hips: 99,
            biceps: 34,
            legs: 57,
            calf: 37,
            notes: "Progreso después de 1 mes",
            recordedAt: new Date(2025, 6, 22, 8, 45, 0),
          },
          {
            weight: 77,
            height: 180,
            chest: 102,
            waist: 83,
            hips: 100,
            biceps: 34,
            legs: 57,
            calf: 38,
            notes: "Progreso después de 2 meses",
            recordedAt: new Date(2025, 7, 22, 8, 45, 0),
          },
          {
            weight: 78,
            height: 180,
            chest: 103,
            waist: 84,
            hips: 101,
            biceps: 35,
            legs: 58,
            calf: 38,
            notes: "Progreso después de 3 meses",
            recordedAt: new Date(2025, 8, 22, 8, 45, 0),
          },
          {
            weight: 79,
            height: 180,
            chest: 104,
            waist: 85,
            hips: 102,
            biceps: 35,
            legs: 58,
            calf: 39,
            notes: "Progreso después de 4 meses",
            recordedAt: new Date(2025, 9, 22, 8, 45, 0),
          },
        ],
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

  const baseFeatures = [
    "Acceso al gimnasio",
    "Zona de pesas y cardio",
    "Vestuarios y duchas",
    "Entrenador personal disponible (opcional)",
  ];

  const concepts = [
    {
      concept: Concept.DAY,
      amount: 50,
      description: "Pase diario",
      includedServices: baseFeatures,
    },
    {
      concept: Concept.WEEK,
      amount: 300,
      description: "Entrena toda la semana sin límites",
      includedServices: baseFeatures,
    },
    {
      concept: Concept.FORTNIGHT,
      amount: 500,
      description: "Entrena 15 días a tu ritmo",
      includedServices: baseFeatures,
    },
    {
      concept: Concept.MONTH,
      amount: 900,
      description: "La opción más conveniente para ti",
      includedServices: baseFeatures,
    },
    {
      concept: Concept.QUARTER,
      amount: 0,
      description: "Membresía trimestral",
      includedServices: baseFeatures,
    },
    {
      concept: Concept.SEMESTER,
      amount: 0,
      description: "Membresía semestral",
      includedServices: baseFeatures,
    },
    {
      concept: Concept.YEAR,
      amount: 0,
      description: "Membresía anual",
      includedServices: baseFeatures,
    },
    {
      concept: Concept.OTHER,
      amount: 0,
      description: "Pago adicional o personalizado",
      includedServices: ["Servicio personalizado"],
    },
  ];

  for (const item of concepts) {
    await prisma.paymentConcept.create({
      data: {
        amount: item.amount,
        concept: item.concept,
        description: item.description,
        includedServices: item.includedServices,
      },
    });
  }

  const monthConcept = await prisma.paymentConcept.findFirst({
    where: { concept: Concept.MONTH },
  });

  const fortnightConcept = await prisma.paymentConcept.findFirst({
    where: { concept: Concept.FORTNIGHT },
  });
  await prisma.payment.createMany({
    data: [
      {
        userId: clientWithTrainer.id,
        paymentConceptId: monthConcept!.id,
        method: "TRANSFER",
        price: 900,
        reference: "TRX-202506-001",
        startDate: new Date(2025, 5, 22, 8, 45, 0),
        endDate: new Date(2025, 6, 22, 8, 45, 0),
        status: "COMPLETED",
        paidAt: new Date(2025, 5, 22, 8, 45, 0),
        createdAt: new Date(2025, 5, 22, 8, 45, 0),
      },
      {
        userId: clientWithTrainer.id,
        paymentConceptId: monthConcept!.id,
        method: "TRANSFER",
        price: 900,
        reference: "TRX-202507-001",
        startDate: new Date(2025, 6, 22, 8, 45, 0),
        endDate: new Date(2025, 7, 22, 8, 45, 0),
        status: "COMPLETED",
        paidAt: new Date(2025, 6, 22, 8, 45, 0),
        createdAt: new Date(2025, 6, 22, 8, 45, 0),
      },
      {
        userId: clientWithTrainer.id,
        paymentConceptId: monthConcept!.id,
        method: "TRANSFER",
        price: 900,
        reference: "TRX-202508-001",
        startDate: new Date(2025, 7, 22, 8, 45, 0),
        endDate: new Date(2025, 8, 22, 8, 45, 0),
        status: "COMPLETED",
        paidAt: new Date(2025, 7, 22, 8, 45, 0),
        createdAt: new Date(2025, 7, 22, 8, 45, 0),
      },
      {
        userId: clientWithTrainer.id,
        paymentConceptId: monthConcept!.id,
        method: "TRANSFER",
        price: 900,
        reference: "TRX-202509-001",
        startDate: new Date(2025, 8, 22, 8, 45, 0),
        endDate: new Date(2025, 9, 22, 8, 45, 0),
        status: "COMPLETED",
        paidAt: new Date(2025, 8, 22, 8, 45, 0),
        createdAt: new Date(2025, 8, 22, 8, 45, 0),
      },
      {
        userId: clientWithTrainer.id,
        paymentConceptId: monthConcept!.id,
        method: "TRANSFER",
        price: 900,
        reference: "TRX-202510-001",
        startDate: new Date(2025, 9, 22, 8, 45, 0),
        endDate: new Date(2025, 10, 22, 8, 45, 0),
        status: "COMPLETED",
        paidAt: new Date(2025, 9, 22, 8, 45, 0),
        createdAt: new Date(2025, 9, 22, 8, 45, 0),
      },
      {
        userId: clientWithTrainer.id,
        paymentConceptId: monthConcept!.id,
        method: "TRANSFER",
        price: 900,
        reference: "TRX-202511-001",
        startDate: new Date(2025, 10, 22, 8, 45, 0),
        endDate: new Date(2025, 11, 22, 8, 45, 0),
        status: "COMPLETED",
        paidAt: new Date(2025, 10, 22, 8, 45, 0),
        createdAt: new Date(2025, 10, 22, 8, 45, 0),
      },

      {
        userId: clientFree.id,
        paymentConceptId: fortnightConcept!.id,
        method: "CASH",
        price: 500,
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
        userId: trainerUser1.id,
        type: "TRAINING_REQUEST",
        message: `El cliente ${clientWithTrainer.name} seleccionó días de entrenamiento: Lunes, Martes, Miércoles, Jueves`,
        read: false,
      },
      {
        userId: clientWithTrainer.id,
        type: "GENERAL",
        message: `Has registrado tus días de entrenamiento con ${trainerUser1.name}: Lunes, Martes, Miércoles, Jueves`,
        read: false,
      },
    ],
  });

  // ================================
  const additionalClientsData = [
    {
      name: "Ana Torres",
      email: "ana-5@gymplanner.com",
      telephone: "55555531",
    },
    {
      name: "Luis Montoya",
      email: "luis-6@gymplanner.com",
      telephone: "55555532",
    },
    {
      name: "Marta López",
      email: "marta-7@gymplanner.com",
      telephone: "55555533",
    },
    {
      name: "Jorge Díaz",
      email: "jorge-8@gymplanner.com",
      telephone: "55555534",
    },
    {
      name: "Sofía Ramírez",
      email: "sofia-9@gymplanner.com",
      telephone: "55555535",
    },
    {
      name: "Diego Morales",
      email: "diego-10@gymplanner.com",
      telephone: "55555536",
    },
    {
      name: "Carla Pérez",
      email: "carla-11@gymplanner.com",
      telephone: "55555537",
    },
    {
      name: "Andrés Vargas",
      email: "andres-12@gymplanner.com",
      telephone: "55555538",
    },
    {
      name: "Lucía Hernández",
      email: "lucia-13@gymplanner.com",
      telephone: "55555539",
    },
    {
      name: "Fernando Castro",
      email: "fernando-14@gymplanner.com",
      telephone: "55555540",
    },
    {
      name: "Isabel Molina",
      email: "isabel-15@gymplanner.com",
      telephone: "55555541",
    },
    {
      name: "Ricardo Salas",
      email: "ricardo-16@gymplanner.com",
      telephone: "55555542",
    },
    {
      name: "Valeria Jiménez",
      email: "valeria-17@gymplanner.com",
      telephone: "55555543",
    },
    {
      name: "Mario Aguilar",
      email: "mario-18@gymplanner.com",
      telephone: "55555544",
    },
    {
      name: "Patricia Rojas",
      email: "patricia-19@gymplanner.com",
      telephone: "55555545",
    },
    {
      name: "Sebastián Ortiz",
      email: "sebastian-20@gymplanner.com",
      telephone: "55555546",
    },
    {
      name: "Camila Fuentes",
      email: "camila-21@gymplanner.com",
      telephone: "55555547",
    },
    {
      name: "Javier Peña",
      email: "javier-22@gymplanner.com",
      telephone: "55555548",
    },
    {
      name: "Daniela Bravo",
      email: "daniela-23@gymplanner.com",
      telephone: "55555549",
    },
    {
      name: "Gabriel León",
      email: "gabriel-24@gymplanner.com",
      telephone: "55555550",
    },
  ];

  const additionalClients = [];
  let slugCounter = 6;

  for (const clientData of additionalClientsData) {
    const client = await prisma.user.create({
      data: {
        name: clientData.name,
        slug: `${slugCounter}-${clientData.name
          .toLowerCase()
          .replace(/ /g, "-")}`,
        email: clientData.email,
        password: hashedPassword,
        role: "CLIENT",
        telephone: clientData.telephone,
        photo: `https://i.pravatar.cc/150?img=${slugCounter + 10}`,
      },
    });
    additionalClients.push(client);
    slugCounter++;
  }
  // ================================
  // CLIENT TRAINER PLAN
  // ================================
  const daysOptions = [
    [
      DaysOfWeek.MONDAY,
      DaysOfWeek.TUESDAY,
      DaysOfWeek.WEDNESDAY,
      DaysOfWeek.THURSDAY,
      DaysOfWeek.FRIDAY,
    ],
    [DaysOfWeek.MONDAY, DaysOfWeek.WEDNESDAY, DaysOfWeek.FRIDAY],
    [
      DaysOfWeek.WEDNESDAY,
      DaysOfWeek.THURSDAY,
      DaysOfWeek.FRIDAY,
      DaysOfWeek.SATURDAY,
    ],
    [DaysOfWeek.TUESDAY, DaysOfWeek.THURSDAY, DaysOfWeek.SATURDAY],
  ];

  for (let i = 0; i < additionalClients.length; i++) {
    const client = additionalClients[i];
    const daysOfWeek = daysOptions[i % daysOptions.length];

    await prisma.clientTrainerPlan.create({
      data: {
        clientId: client.id,
        trainerId: trainer1.id,
        daysOfWeek,
      },
    });
  }

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
