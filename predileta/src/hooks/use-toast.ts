"use client";
import { useState, useCallback } from "react";

type ToastVariant = "default" | "destructive" | "success";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((l) => l([...currentToasts]));
}

export function toast(options: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const newToast: Toast = { id, ...options };
  currentToasts = [...currentToasts, newToast];
  notifyListeners();
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 4000);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(currentToasts);

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  useState(() => {
    const unsub = subscribe(setToasts);
    return unsub;
  });

  return { toasts, toast };
}
