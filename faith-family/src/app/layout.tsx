import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fé em Família",
  description: "Devocional diário para pais e filhos evangélicos",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
