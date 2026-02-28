import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { PWARegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "pulse — Produtividade Intencional",
  description: "Transforme sua produtividade com IA empatica. Nao faca mais, faca melhor. Gerencie tarefas, habitos e metas com inteligencia artificial.",
  keywords: ["produtividade", "gestao de tarefas", "habitos", "metas", "IA", "inteligencia artificial", "pulse"],
  authors: [{ name: "pulse" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "pulse",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "pulse — Produtividade Intencional",
    description: "Transforme sua produtividade com IA empatica. Nao faca mais, faca melhor.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1A2E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
          <SpeedInsights />
          <Analytics />
          <PWARegister />
        </Providers>
      </body>
    </html>
  );
}
