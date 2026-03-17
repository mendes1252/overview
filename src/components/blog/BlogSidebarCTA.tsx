"use client";

import Link from "next/link";

export default function BlogSidebarCTA() {
  return (
    <div
      style={{
        background: "#001bab",
        borderRadius: 16,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        Elabore laudos com mais agilidade
      </h3>
      <p
        style={{
          fontSize: 13.5,
          color: "rgba(255,255,255,0.65)",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Referências ABNT automáticas, análise de imagens e redação assistida.
        Teste gratuitamente.
      </p>
      <Link
        href="/#planos"
        style={{
          display: "block",
          textAlign: "center",
          background: "#dba914",
          color: "#ffffff",
          borderRadius: 8,
          padding: "12px 20px",
          fontSize: 14,
          fontWeight: 700,
          textDecoration: "none",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#b8900f")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#dba914")}
      >
        Começar grátis
      </Link>
      <p
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.30)",
          textAlign: "center",
          margin: 0,
        }}
      >
        1 laudo gratuito · sem cartão
      </p>
    </div>
  );
}
