import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductsClient } from "./products-client";

export const metadata = { title: "Produtos Afiliados" };

export default async function ProductsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return <ProductsClient />;
}
