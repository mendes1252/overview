import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
