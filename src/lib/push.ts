import webpush from "web-push";
import { prisma } from "./prisma";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:pulse@pulse.app";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  notificationId?: string;
  actions?: Array<{ action: string; title: string }>;
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(payload)
        );
      } catch (error: unknown) {
        // If subscription is expired/invalid, remove it
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          ((error as { statusCode: number }).statusCode === 410 ||
            (error as { statusCode: number }).statusCode === 404)
        ) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        }
        throw error;
      }
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { sent, failed, total: subscriptions.length };
}

export async function createNotificationAndPush(
  userId: string,
  params: {
    type: string;
    title: string;
    body: string;
    url?: string;
    data?: Record<string, unknown>;
  }
) {
  // Create in-app notification
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: params.type,
      title: params.title,
      body: params.body,
      data: params.data ? JSON.stringify(params.data) : null,
    },
  });

  // Send push notification
  const pushResult = await sendPushToUser(userId, {
    title: params.title,
    body: params.body,
    url: params.url || "/dashboard",
    notificationId: notification.id,
    tag: params.type,
  });

  return { notification, pushResult };
}
