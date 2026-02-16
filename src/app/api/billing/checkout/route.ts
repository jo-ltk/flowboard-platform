
import { NextResponse } from "next/server";
import { stripeService } from "@/services/billing/stripe-service";
import { db } from "@/lib/db";

// Mock constant for demo purposes
const MOCK_USER_EMAIL = "demo@flowboard.ai";

export async function POST(req: Request) {
  try {
    // In a real app with next-auth configured:
    // import { getServerSession } from "next-auth/next";
    // import { authOptions } from "@/lib/auth";
    // const session = await getServerSession(authOptions);
    
    // For demo/mock mode as used in saas-guard.ts:
    const session = { user: { email: MOCK_USER_EMAIL, id: "mock-user-123" } };

    const { workspaceId, planType } = await req.json();

    if (!workspaceId || !planType) {
      return new NextResponse("Missing parameters", { status: 400 });
    }

    // Attempt to find real membership if workspaceId is cuid, 
    // otherwise if it's "ws-1" etc., we bypass for the demo
    const isMockId = workspaceId.startsWith("ws-");
    
    if (!isMockId) {
        const membership = await db.membership.findFirst({
          where: {
            workspaceId,
            user: { email: session.user.email },
            role: "OWNER",
          },
        });

        if (!membership) {
          // If not found in DB but it's a valid looking CUID, usually we'd forbid
          // but for this demo, let's allow "ws-1" style mock logic or try to find ANY owner
          const anyOwner = await db.membership.findFirst({
              where: { workspaceId, role: "OWNER" }
          });
          if (!anyOwner) {
              console.warn(`[BILLING] No owner found for workspace ${workspaceId}, but proceeding for demo.`);
          }
        }
    }

    let priceId = "";
    if (planType === "architect") {
      priceId = process.env.STRIPE_ARCHITECT_PRICE_ID!;
    } else if (planType === "enterprise") {
      priceId = process.env.STRIPE_ENTERPRISE_PRICE_ID!;
    } else if (planType === "starter") {
      // Typically starter is $0/free, but if they want to "upgrade" to it (e.g. from a past due state)
      // we can handle it or just return a mock success
      return NextResponse.json({ url: "/dashboard/billing?success=true" });
    } else {
      return new NextResponse("Invalid plan type", { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/dashboard/billing?success=true&upgraded=${planType}`;
    const cancelUrl = `${baseUrl}/dashboard/billing?canceled=true`;

    const checkoutSession = await stripeService.createCheckoutSession(
      workspaceId,
      priceId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[BILLING_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
