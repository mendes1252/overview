import { createClient } from "@/lib/supabase/server";
import { generateDevotional } from "@/lib/groq";
import { NextResponse } from "next/server";
import { getTodayDate } from "@/lib/utils";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { theme, childAge, date } = body as {
    theme?: string;
    childAge?: number;
    date?: string;
  };

  const targetDate = date ?? getTodayDate();

  // Check if devotional already exists for this date
  const { data: existing } = await supabase
    .from("devotionals")
    .select("*")
    .eq("date", targetDate)
    .single();

  if (existing) return NextResponse.json(existing);

  // Generate via Groq
  const generated = await generateDevotional(theme, childAge);

  const { data: devotional, error } = await supabase
    .from("devotionals")
    .insert({
      date: targetDate,
      verse: generated.verse,
      verse_reference: generated.verse_reference,
      parent_explanation: generated.parent_explanation,
      children_story: generated.children_story,
      questions: generated.questions,
      prayer: generated.prayer,
      theme: generated.theme,
      generated_by_ai: true,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(devotional);
}
