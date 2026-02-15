import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "pulse — Produtividade Intencional",
    short_name: "pulse",
    description:
      "Transforme sua produtividade com IA empatica. Gerencie tarefas, habitos e metas.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#1A1A2E",
    theme_color: "#1A1A2E",
    orientation: "portrait-primary",
    categories: ["productivity", "lifestyle", "utilities"],
    lang: "pt-BR",
    icons: [
      {
        src: "/pwa/icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/pwa/icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  };
}
