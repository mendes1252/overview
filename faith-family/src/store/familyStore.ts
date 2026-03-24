import { create } from "zustand";
import type { Family, Child, FamilyStreak, FamilyBadge } from "@/types";

interface FamilyState {
  family: Family | null;
  children: Child[];
  streak: FamilyStreak | null;
  badges: FamilyBadge[];
  setFamily: (family: Family | null) => void;
  setChildren: (children: Child[]) => void;
  setStreak: (streak: FamilyStreak | null) => void;
  setBadges: (badges: FamilyBadge[]) => void;
  addPoints: (childId: string, points: number) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  family: null,
  children: [],
  streak: null,
  badges: [],
  setFamily: (family) => set({ family }),
  setChildren: (children) => set({ children }),
  setStreak: (streak) => set({ streak }),
  setBadges: (badges) => set({ badges }),
  addPoints: (childId, points) =>
    set((state) => ({
      children: state.children.map((c) =>
        c.id === childId ? { ...c, points: c.points + points } : c
      ),
    })),
}));
