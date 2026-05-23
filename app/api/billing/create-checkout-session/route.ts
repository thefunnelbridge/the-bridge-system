import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID_ENTERPRISE;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        error: "Stripe no está configurado. Agrega STRIPE_SECRET_KEY y STRIPE_PRICE_ID_ENTERPRISE en Vercel.",
      },
      { status: 501 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : undefined;
  const organizationName = typeof body.organizationName === "string" ? body.organizationName : "The Bridge System Enterprise";

  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("success_url", `${appUrl}/app/billing?status=success`);
  params.set("cancel_url", `${appUrl}/app/billing?status=cancelled`);
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("allow_promotion_codes", "true");
  params.set("metadata[product]", "the-bridge-system");
  params.set("metadata[organization_name]", organizationName);
  if (email) params.set("customer_email", email);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json({ error: data.error?.message ?? "Stripe Checkout no pudo iniciarse." }, { status: response.status });
  }

  return NextResponse.json({ url: data.url });
}
