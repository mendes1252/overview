import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PdvLayout } from "@/components/layout/pdv-layout";

export default async function PdvGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <PdvLayout userName={session.name} userRole={session.role}>
      {children}
    </PdvLayout>
  );
}
