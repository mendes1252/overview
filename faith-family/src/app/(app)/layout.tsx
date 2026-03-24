import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TabNav from "@/components/TabNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if family exists
  const { data: family } = await supabase
    .from("families")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!family) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col">
      {/* App header */}
      <header className="bg-[#1e3a8a] text-white px-4 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-playfair">✝️ Fé em Família</h1>
            <p className="text-blue-200 text-xs mt-0.5">Crescendo juntos na fé</p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-blue-200 hover:text-white text-xs border border-blue-400 rounded-lg px-3 py-1.5 transition"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-lg mx-auto w-full pb-24">
        {children}
      </main>

      {/* Bottom tab navigation */}
      <TabNav />
    </div>
  );
}
