import { Concept } from "@/app/generated/prisma";
import { calculateEndDate } from "@/lib/helpers/calculateEndDate";
import prisma from "@/lib/prisma";
import { startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo verificar la solicitud de Stripe. Revisa la firma del webhook.",
      },
      { status: 400 }
    );
  }

  // TODO: Replace this fixed exchange rate with the official NIO/USD rate from BCN
  const USD_EXCHANGE_RATE = 36.62;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session || !session.metadata) {
      return NextResponse.json(
        {
          error:
            "No se pudo procesar la sesión de pago: datos de la sesión incompletos o metadata ausente.",
        },
        { status: 400 }
      );
    }

    // Retrieve the user's email from the Stripe session to get user data from the database
    const email = session.customer_email;

    // Parse the payment concept ID from the session metadata
    const paymentConceptId = parseInt(session.metadata.paymentConceptId);

    // Calculate the end date of the payment based on the selected concept
    const endDate = calculateEndDate(
      new Date(),
      session.metadata.paymentConcept as Concept
    );

    if (!email) {
      return NextResponse.json(
        {
          error: "Usuario no identificado",
          message:
            "No se encontró el correo electrónico en la sesión de Stripe",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Usuario no encontrado",
          message:
            "El usuario con ese correo electrónico no existe en la base de datos",
        },
        { status: 400 }
      );
    }
    const now = new Date();
    // Save the payment in the database
    await prisma.payment.create({
      data: {
        userId: user.id,
        paymentConceptId,
        method: "CARD",
        price: (session.amount_total! / 100) * USD_EXCHANGE_RATE, // Stripe sends amount in cents, convert to local currency
        reference: session.id,
        startDate: startOfDay(now),
        endDate,
        status: "COMPLETED",
        paidAt: startOfDay(now),
      },
    });
  }

  return NextResponse.json({ received: true });
}
