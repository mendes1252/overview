"use client";

import Image from "next/image";
import Link from "next/link";

export default function CTAFinal() {
  return (
    <section
      style={{
        background: "#001bab",
        padding: "88px 6%",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <Image
            src="/logo-white.svg"
            alt="Vistoria Aí"
            width={171}
            height={32}
            style={{ height: 32, width: "auto", display: "inline-block" }}
          />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "#ffffff",
            marginBottom: 16,
            lineHeight: 1.15,
          }}
        >
          Seu próximo laudo começa aqui.
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.65)",
            marginBottom: 36,
            lineHeight: 1.6,
          }}
        >
          Teste gratuitamente. Sem cartão de crédito. Sem compromisso.
        </p>

        {/* CTA Button */}
        <Link
          href="#planos"
          style={{
            display: "inline-block",
            background: "#dba914",
            color: "#ffffff",
            borderRadius: 8,
            padding: "14px 36px",
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#b8900f")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#dba914")
          }
        >
          Começar grátis no Vistoria Aí
        </Link>

        {/* Sub-note */}
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            marginTop: 16,
            marginBottom: 0,
          }}
        >
          1 laudo completo gratuito · acesso imediato
        </p>
      </div>
    </section>
  );
}
