"use client";

import { useState, useEffect, useCallback } from "react";

type PushPermission = "default" | "granted" | "denied" | "unsupported";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePush() {
  const [permission, setPermission] = useState<PushPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission as PushPermission);

    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    });
  }, []);

  const subscribe = useCallback(async (): Promise<{ ok: boolean; reason?: string }> => {
    if (permission === "unsupported") return { ok: false, reason: "Seu navegador não suporta notificações push." };
    setLoading(true);

    try {
      const result = await Notification.requestPermission();
      setPermission(result as PushPermission);

      if (result !== "granted") {
        setLoading(false);
        return { ok: false, reason: "Permissão de notificação negada." };
      }

      const reg = await navigator.serviceWorker.ready;

      // Fetch VAPID key from server (process.env is only available at build time)
      const vapidRes = await fetch("/api/push/vapid-key");
      if (!vapidRes.ok) {
        setLoading(false);
        return { ok: false, reason: "Chave VAPID não configurada no servidor." };
      }
      const { publicKey: vapidKey } = await vapidRes.json();

      // Check if there's already a subscription
      let subscription = await reg.pushManager.getSubscription();

      if (!subscription) {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
        });
      }

      const subJson = subscription.toJSON();

      // Save subscription to server
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys?.p256dh,
            auth: subJson.keys?.auth,
          },
        }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        setLoading(false);
        return { ok: true };
      }

      const errData = await res.json().catch(() => ({}));
      setLoading(false);
      return { ok: false, reason: errData.error || "Erro ao salvar subscription no servidor." };
    } catch (error) {
      console.error("Push subscription error:", error);
      setLoading(false);
      return { ok: false, reason: `Erro: ${error instanceof Error ? error.message : "Falha desconhecida"}` };
    }
  }, [permission]);

  const unsubscribe = useCallback(async () => {
    setLoading(true);

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();

      if (subscription) {
        // Remove from server
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
    } catch (error) {
      console.error("Push unsubscribe error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { permission, isSubscribed, loading, subscribe, unsubscribe };
}
