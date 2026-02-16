import Stripe from "stripe";
import { db } from "@/lib/db";
import { PLAN_CONFIGS, PlanType } from "@/types/workspace";

// Determine if we are in mock mode
const isMockMode = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.includes("mock");

// Only initialize Stripe if not in mock mode or if key is present (even if mock, to avoid crash if possible, but better to bypass)
let stripe: Stripe;

if (!process.env.STRIPE_SECRET_KEY) {
  if (!isMockMode) {
     throw new Error("STRIPE_SECRET_KEY is missing from env");
  }
} else {
    // Initialize with dummy key if mock, but real calls will be intercepted
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2026-01-28.clover" as any, 
    });
}

export { stripe };

export const stripeService = {
  /**
   * Create a Stripe customer for a workspace if it doesn't already have one
   */
  async createCustomerForWorkspace(workspaceId: string, email: string, name: string) {
    // MOCK MODE
    if (isMockMode) {
        console.log(`[MOCK] Creating customer for workspace ${workspaceId}`);
        const mockId = `cus_mock_${Date.now()}`;
        await db.workspace.update({
            where: { id: workspaceId },
            data: { stripeCustomerId: mockId },
        });
        return mockId;
    }

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { stripeCustomerId: true },
    });

    if (workspace?.stripeCustomerId) {
      return workspace.stripeCustomerId;
    }

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        workspaceId,
      },
    });

    await db.workspace.update({
      where: { id: workspaceId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  },

  /**
   * Create a Checkout Session for upgrading a workspace
   */
  async createCheckoutSession(workspaceId: string, priceId: string, successUrl: string, cancelUrl: string) {
    // MOCK MODE
    if (isMockMode) {
        console.log(`[MOCK] Creating checkout session for ${workspaceId} with price ${priceId}`);
        
        // IMMEDIATE DB UPDATE FOR DEMO
        // Allows the UI to update without webhooks
        let newPlan: PlanType = "starter";
        if (priceId === process.env.STRIPE_ARCHITECT_PRICE_ID) newPlan = "architect";
        if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) newPlan = "enterprise";

        const isMockWorkspace = workspaceId.startsWith("ws-");

        if (!isMockWorkspace) {
            try {
                await db.workspace.update({
                    where: { id: workspaceId },
                    data: {
                        planType: newPlan,
                        subscriptionStatus: "active",
                        subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
                        stripeSubscriptionId: `sub_mock_${Date.now()}`
                    }
                });
            } catch (e) {
                console.warn(`[MOCK] Could not update DB for workspace ${workspaceId}. This usually means it's a mock ID not in our real DB.`);
            }
        } else {
            console.log(`[MOCK] Skipping DB update for mock workspace ${workspaceId}`);
        }

        return {
            url: successUrl + `?session_id=cs_mock_${Date.now()}`,
            id: `cs_mock_${Date.now()}`
        } as any;
    }

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) throw new Error("Workspace not found");

    let customerId = workspace.stripeCustomerId;

    if (!customerId) {
      // Find owner email
      const owner = await db.membership.findFirst({
        where: { workspaceId, role: "OWNER" },
        include: { user: true },
      });
      
      if (!owner || !owner.user.email) throw new Error("Workspace owner email not found");
      
      customerId = await this.createCustomerForWorkspace(workspaceId, owner.user.email, workspace.name);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          workspaceId,
        },
      },
      metadata: {
        workspaceId,
      },
    });

    return session;
  },

  /**
   * Create a Customer Portal session for managing subscriptions
   */
  async createPortalSession(workspaceId: string, returnUrl: string) {
    // MOCK MODE
    if (isMockMode) {
        console.log(`[MOCK] Creating portal session for ${workspaceId}`);
        return {
            url: returnUrl, // Redirect back immediately
        } as any;
    }

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { stripeCustomerId: true },
    });

    if (!workspace?.stripeCustomerId) {
      throw new Error("No Stripe customer found for this workspace");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: workspace.stripeCustomerId,
      return_url: returnUrl,
    });

    return session;
  },

  /**
   * Sync logic for webhooks
   */
  async updateSubscriptionStatus(subscriptionId: string) {
    // MOCK MODE
    if (isMockMode) {
        // If we are in mock mode, we generally won't receive webhooks.
        // However, if we manually trigger this function, we need it to work.
        // For now, we will just return.
        return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const workspaceId = subscription.metadata.workspaceId;

    if (!workspaceId) {
      console.error("No workspaceId found in subscription metadata:", subscriptionId);
      return;
    }

    const status = subscription.status; // active, trialing, past_due, canceled
    
    // Map Stripe product/price to our planType if needed
    // For now we assume priceId mapping
    let planType: PlanType = "starter";
    
    const priceId = subscription.items.data[0].price.id;
    if (priceId === process.env.STRIPE_ARCHITECT_PRICE_ID) {
      planType = "architect";
    } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
      planType = "enterprise";
    }

    await db.workspace.update({
      where: { id: workspaceId },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: status,
        planType: planType,
        subscriptionEndsAt: new Date((subscription as any).current_period_end * 1000),
      },
    });
  },

  async cancelSubscription(workspaceId: string) {
     // MOCK MODE
    if (isMockMode) {
        console.log(`[MOCK] Canceling subscription for ${workspaceId}`);
        await db.workspace.update({
            where: { id: workspaceId },
            data: {
                subscriptionStatus: "canceled",
                subscriptionEndsAt: new Date(), // End immediately
                planType: "starter"
            }
        });
        return;
    }

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { stripeSubscriptionId: true },
    });

    if (workspace?.stripeSubscriptionId) {
      await stripe.subscriptions.update(workspace.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }
  },

  /**
   * Initialize a 14-day free trial for a new workspace
   */
  async initializeWorkspaceTrial(workspaceId: string) {
    const trialDays = 14;
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

    return await db.workspace.update({
      where: { id: workspaceId },
      data: {
        subscriptionStatus: "trialing",
        trialEndsAt: trialEndsAt,
        planType: "starter",
      },
    });
  }
};
