import db from '../db.server';
import { authenticate } from '../shopify.server';

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  const SHOP = shop.split('.')[0];

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.

  if (topic !== 'APP_UNINSTALLED')
    return new Response('Ignored', {
      status: 200,
    });

  

  await db.$transaction([
    db.session.deleteMany({ where: { shop } }),
    db.instagramAccount.deleteMany({ where: { shop: SHOP } }),
    db.instagramPost.deleteMany({ where: { shop: SHOP } }),
  ]);

  return new Response();
};
