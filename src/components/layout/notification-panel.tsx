"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  BellRing,
  Target,
  TrendingUp,
  CheckSquare,
  Brain,
  Flame,
  Award,
  Info,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePush } from "@/hooks/use-push";
import { formatDistanceToNow } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  data: string | null;
  createdAt: string;
}

const typeIcons: Record<string, React.ElementType> = {
  task_reminder: CheckSquare,
  habit_reminder: TrendingUp,
  goal_deadline: Target,
  report_ready: Brain,
  streak: Flame,
  achievement: Award,
  system: Info,
};

const typeColors: Record<string, string> = {
  task_reminder: "text-blue-400",
  habit_reminder: "text-emerald-400",
  goal_deadline: "text-amber-400",
  report_ready: "text-purple-400",
  streak: "text-orange-400",
  achievement: "text-yellow-400",
  system: "text-[#4A9FFF]",
};

export function NotificationPanel() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [testingSend, setTestingSend] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { permission, isSubscribed, loading: pushLoading, subscribe, unsubscribe } = usePush();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on open
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  // Poll unread count every 30s
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/notifications?unread=true");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount);
        }
      } catch {
        // silently fail
      }
    };

    poll();
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      toast({ title: "Erro ao marcar como lidas", variant: "destructive" });
    }
  };

  const markOneRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silently fail
    }
  };

  const sendTestPush = async () => {
    setTestingSend(true);
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Notificação de teste enviada!",
          description: `${data.push.sent} push(es) enviado(s).`,
        });
        fetchNotifications();
      } else {
        toast({ title: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro ao enviar teste", variant: "destructive" });
    } finally {
      setTestingSend(false);
    }
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) markOneRead(n.id);
    if (n.data) {
      try {
        const parsed = JSON.parse(n.data);
        if (parsed.url) {
          window.location.href = parsed.url;
        }
      } catch {
        // no url
      }
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full hover:bg-white/5 h-9 w-9"
        onClick={() => setOpen(!open)}
      >
        <Bell className="w-4.5 h-4.5 text-white/50" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#4A9FFF] rounded-full ring-2 ring-[#1A1A2E] text-[10px] font-medium text-white flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-12 w-[360px] sm:w-[400px] max-h-[480px] bg-[#1A1A2E] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-[#4A9FFF]" />
              <h3 className="font-medium text-white text-sm">Notificações</h3>
              {unreadCount > 0 && (
                <span className="bg-[#4A9FFF]/15 text-[#4A9FFF] text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllRead}
                  className="text-xs text-white/40 hover:text-white hover:bg-white/5 h-7 px-2 rounded-lg"
                >
                  <CheckCheck className="w-3.5 h-3.5 mr-1" />
                  Marcar lidas
                </Button>
              )}
            </div>
          </div>

          {/* Notification list */}
          <div className="overflow-y-auto max-h-[340px]">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-[#4A9FFF]" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-sm text-white/40 font-light">
                  Nenhuma notificação ainda
                </p>
                <p className="text-xs text-white/20 font-light mt-1">
                  Envie uma notificação de teste abaixo
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = typeIcons[n.type] || Info;
                const iconColor = typeColors[n.type] || "text-white/50";

                return (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-white/[0.03] border-b border-white/[0.03] last:border-b-0 ${
                      !n.read ? "bg-[#4A9FFF]/[0.03]" : ""
                    }`}
                  >
                    <div className={`mt-0.5 ${iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-snug ${
                            n.read ? "text-white/50 font-light" : "text-white font-medium"
                          }`}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="mt-1.5 w-2 h-2 bg-[#4A9FFF] rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-white/30 font-light mt-0.5 line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-white/20 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt))}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer — push toggle + test button */}
          <div className="px-4 py-3 border-t border-white/5 space-y-2">
            {/* Push subscription toggle */}
            {permission !== "unsupported" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellRing className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-xs text-white/50">
                    Notificações push
                  </span>
                </div>
                {permission === "denied" ? (
                  <span className="text-[10px] text-red-400">Bloqueadas no navegador</span>
                ) : (
                  <button
                    onClick={() => (isSubscribed ? unsubscribe() : subscribe())}
                    disabled={pushLoading}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      isSubscribed ? "bg-[#4A9FFF]" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        isSubscribed ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                )}
              </div>
            )}

            {/* Test push button */}
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestPush}
              disabled={testingSend || (!isSubscribed && permission !== "unsupported")}
              className="w-full gap-2 rounded-xl border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-9 text-xs"
            >
              {testingSend ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Enviar notificação de teste
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
