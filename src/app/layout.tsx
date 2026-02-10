import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "pulse — Produtividade Intencional",
  description: "Transforme sua produtividade com IA empatica. Nao faca mais, faca melhor. Gerencie tarefas, habitos e metas com inteligencia artificial.",
  keywords: ["produtividade", "gestao de tarefas", "habitos", "metas", "IA", "inteligencia artificial", "pulse"],
  authors: [{ name: "pulse" }],
  openGraph: {
    title: "pulse — Produtividade Intencional",
    description: "Transforme sua produtividade com IA empatica. Nao faca mais, faca melhor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
