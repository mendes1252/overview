import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Vistoria Aí — Laudos Patológicos com IA",
  description:
    "Plataforma que engenheiros civis e arquitetos usam para elaborar laudos de patologia das construções com IA. Fundamentação ABNT automática, análise de imagens e redação assistida.",
  keywords: [
    "laudo patológico",
    "patologia das construções",
    "NBR",
    "engenheiro civil",
    "laudo técnico",
    "ABNT",
    "fissuras",
    "recuperação estrutural",
    "CAU",
    "CREA",
  ],
  authors: [{ name: "Vistoria Aí" }],
  openGraph: {
    title: "Vistoria Aí — Laudos Patológicos com IA",
    description:
      "Do diagnóstico ao laudo técnico com fundamentação ABNT. Agilidade e rigor para engenheiros civis e arquitetos.",
    url: "https://vistoriaai.com.br",
    siteName: "Vistoria Aí",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#001bab",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
