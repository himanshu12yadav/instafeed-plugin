
import { authenticate } from "../shopify.server";
import db from "../db.server";

/**
 * Handles the APP_SUBSCRIPTIONS_UPDATE webhook from Shopify.
 * This is triggered for any change in a shop\'s subscription status.
 *
 * @param {object} request - The incoming HTTP request.
 * @returns {Response} A response object.
 */
export const action = async ({ request }) => {
  // 1. Authenticate the webhook and get the payload
  const { topic, shop, payload } = await authenticate.webhook(request);

  if (!shop) {
    // If the shop isn\'t in the webhook, we can\'t process it.

    return new Response("No shop domain provided", { status: 400 });
  }

  // 2. Ensure the topic is the one we expect
  if (topic !== "APP_SUBSCRIPTIONS_UPDATE") {
    throw new Response("Unhandled webhook topic", { status: 404 });
  }

  try {
    const { app_subscription } = payload;

    // 3. Find the subscription record in your database
    const existingSubscription = await db.subscription.findUnique({
      where: { shop },
    });

    const subscriptionData = {
      status: app_subscription.status,
      planId: app_subscription.name, // The name of the plan (e.g., "Premium Plan")
      shopifySubscriptionId: app_subscription.admin_graphql_api_id,
      trialEndsAt: app_subscription.trial_ends_on
        ? new Date(app_subscription.trial_ends_on)
        : null,
      renewsAt: app_subscription.current_period_end_at
        ? new Date(app_subscription.current_period_end_at)
        : null,
      endsAt: app_subscription.ends_on ? new Date(app_subscription.ends_on) : null,
    };

    if (existingSubscription) {
      // 4. If it exists, update it with the new data
      await db.subscription.update({
        where: { shop },
        data: subscriptionData,
      });

    } else {
      // 5. If not, create a new record (as a fallback)
      await db.subscription.create({
        data: {
          shop: shop,
          ...subscriptionData,
        },
      });
      
    }

    // 6. Return a 200 OK response to Shopify
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(
      `Error processing subscription update for ${shop}:`,
      error
    );
    // Return a 500 status to let Shopify know it failed and should be retried
    return new Response("Webhook processing failed", { status: 500 });
  }
};
