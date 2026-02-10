import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "PULSO - Produtividade Inteligente",
  description: "Sistema de gestão de produtividade pessoal com IA integrada. Gerencie tarefas, hábitos e metas com relatórios inteligentes.",
  keywords: ["produtividade", "gestão de tarefas", "hábitos", "metas", "IA", "inteligência artificial"],
  authors: [{ name: "PULSO" }],
  openGraph: {
    title: "PULSO - Produtividade Inteligente",
    description: "Sistema de gestão de produtividade pessoal com IA integrada",
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
