import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Steddi — Gestão Financeira para Franqueados",
  description:
    "Dashboard financeiro inteligente para franqueados brasileiros. Saiba quanto realmente sobra da sua franquia.",
  keywords: [
    "franquia",
    "gestao financeira",
    "dashboard",
    "franqueado",
    "breakeven",
    "DRE",
    "steddi",
  ],
  authors: [{ name: "Steddi" }],
  formatDetection: { telephone: false },
  openGraph: {
    title: "Steddi — Gestão Financeira para Franqueados",
    description: "Saiba quanto realmente sobra da sua franquia.",
    type: "website",
    siteName: "Steddi",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A5F",
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
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
