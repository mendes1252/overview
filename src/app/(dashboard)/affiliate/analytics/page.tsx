import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "./analytics-client";

export const metadata = { title: "Analytics — Afiliados" };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return <AnalyticsClient />;
}
