import type { User, Task, Habit, Goal, Category, Report, HabitLog, Subtask } from "@prisma/client";

// Extended types with relations
export type TaskWithRelations = Task & {
  category?: Category | null;
  subtasks: Subtask[];
};

export type HabitWithRelations = Habit & {
  category?: Category | null;
  logs: HabitLog[];
};

export type GoalWithRelations = Goal & {
  category?: Category | null;
};

export type UserWithRelations = User & {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  categories: Category[];
  reports: Report[];
};

// Form types
export interface TaskFormData {
  title: string;
  description?: string;
  categoryId?: string;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  estimatedTime?: number;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

export interface HabitFormData {
  name: string;
  categoryId?: string;
  frequency: "daily" | "weekdays" | "weekends" | "custom";
  targetDays?: number[];
  color?: string;
}

export interface GoalFormData {
  title: string;
  description?: string;
  categoryId?: string;
  type: "binary" | "quantifiable";
  period: "weekly" | "monthly" | "quarterly";
  targetValue?: number;
  unit?: string;
  startDate: Date;
  endDate: Date;
}

export interface CategoryFormData {
  name: string;
  color: string;
}

// Onboarding types
export interface OnboardingData {
  name: string;
  timezone: string;
  primaryGoal: string;
  weekStartsOn: number;
  reportTime: string;
  coachTone: "motivational" | "calm" | "direct" | "friendly";
}

// Dashboard types
export interface WeeklyStats {
  tasksCompleted: number;
  tasksTotal: number;
  habitsConsistency: number;
  goalsAchieved: number;
  goalsTotal: number;
}

export interface DashboardData {
  todayTasks: TaskWithRelations[];
  weeklyStats: WeeklyStats;
  habits: HabitWithRelations[];
  weeklyGoals: GoalWithRelations[];
  latestReport?: Report | null;
  nextReportDate: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Filter types
export interface TaskFilters {
  status?: string;
  priority?: string;
  categoryId?: string;
  search?: string;
  dateRange?: "today" | "week" | "overdue" | "all";
}

export interface HabitFilters {
  categoryId?: string;
  isArchived?: boolean;
}

export interface GoalFilters {
  period?: string;
  status?: string;
  categoryId?: string;
}

// Report types
export interface ReportData {
  summary: string;
  insights: string;
  recommendations: string;
  highlights: string;
}

// Auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
