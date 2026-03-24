export interface Family {
  id: string;
  name: string;
  photo_url: string | null;
  owner_id: string;
  created_at: string;
}

export interface Child {
  id: string;
  family_id: string;
  name: string;
  age: number;
  avatar_emoji: string;
  points: number;
  level: number;
}

export interface Devotional {
  id: string;
  date: string; // YYYY-MM-DD
  verse: string;
  verse_reference: string;
  parent_explanation: string;
  children_story: string;
  questions: string[];
  prayer: string;
  theme: string;
  generated_by_ai: boolean;
}

export interface DevotionalCompletion {
  id: string;
  family_id: string;
  devotional_id: string;
  completed_at: string;
  points_earned: number;
}

export interface FamilyStreak {
  id: string;
  family_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

export interface GameScore {
  id: string;
  family_id: string;
  child_id: string | null;
  game_type: "quiz" | "memory" | "ark_adventure";
  score: number;
  max_score: number;
  completed_at: string;
}

export interface Flashcard {
  id: string;
  verse: string;
  reference: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface FlashcardProgress {
  id: string;
  family_id: string;
  flashcard_id: string;
  mastered: boolean;
  review_count: number;
  last_reviewed: string | null;
}

export interface DiaryEntry {
  id: string;
  family_id: string;
  title: string;
  description: string;
  emoji: string;
  entry_date: string;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_emoji: string;
  condition_type: string;
  condition_value: number;
}

export interface FamilyBadge {
  id: string;
  family_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: "trialing" | "active" | "canceled" | "past_due";
  plan: "free" | "monthly" | "annual";
  stripe_subscription_id: string | null;
  trial_ends_at: string | null;
  created_at: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  hero: string;
}
