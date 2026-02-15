import { NextResponse } from "next/server";
import { stripeService } from "@/services/billing/stripe-service";
// Assuming Auth.js
// import { authOptions } from "@/lib/auth"; // Need to check where auth is

export async function POST(req: Request) {
  try {
    const { workspaceId } = await req.json();
    
    // In a real app, verify user belongs to workspace and has billing permissions
    // const session = await getServerSession(authOptions);
    // if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/dashboard/settings/billing`;

    const session = await stripeService.createPortalSession(workspaceId, returnUrl);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[BILLING_PORTAL_ERROR]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
