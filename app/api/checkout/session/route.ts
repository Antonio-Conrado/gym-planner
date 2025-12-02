import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { Role } from "@/app/generated/prisma";

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const authenticatedUser = await auth();

    // Check if the user is authenticated
    if (!authenticatedUser || !authenticatedUser.user) {
      return NextResponse.json(
        {
          error: "no_autorizado",
          message: "Debes iniciar sesión para realizar esta acción.",
        },
        { status: 401 }
      );
    }

    if (authenticatedUser.user.role !== Role.CLIENT) {
      return NextResponse.json(
        {
          error: "no_autorizado",
          message:
            "Solo los usuarios con rol de cliente pueden realizar pagos.",
        },
        { status: 403 }
      );
    }

    const { amount, paymentConceptId, paymentConcept } = await req.json();

    // TODO: Replace this fixed exchange rate with the official NIO/USD rate from BCN
    const USD_EXCHANGE_RATE = 36.62;
    // Convert Córdoba → USD → cents
    const amountInCents = Math.round((amount / USD_EXCHANGE_RATE) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Gym Planner" },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: authenticatedUser.user.email!,
      metadata: {
        paymentConceptId: String(paymentConceptId),
        paymentConcept: paymentConcept,
      },
      success_url: `${req.headers.get("origin")}/clients/${
        authenticatedUser.user.id
      }/payments`,
      cancel_url: `${req.headers.get("origin")}/#plans`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Hubo un error al procesar el pago" },
      { status: 500 }
    );
  }
}
