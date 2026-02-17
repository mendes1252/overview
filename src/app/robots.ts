import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pulso.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/termos", "/privacidade"],
        disallow: [
          "/dashboard",
          "/tarefas",
          "/habitos",
          "/metas",
          "/relatorios",
          "/configuracoes",
          "/onboarding",
          "/checkout",
          "/api/",
          "/pwa/",
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
