"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const leftVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const rightVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: 0.12 },
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Hero() {
  return (
    <section
      style={{
        padding: "96px 6% 88px",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "55% 45%",
          gap: 48,
          alignItems: "center",
          minHeight: 580,
        }}
        className="hero-grid"
      >
        {/* Left column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(0,27,171,0.07)",
                color: "#001bab",
                border: "1px solid rgba(0,27,171,0.14)",
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ fontSize: 8 }}>●</span>
              Plataforma de patologia das construções
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontSize: "clamp(34px, 4.2vw, 54px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              color: "#111111",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Laudos patológicos com{" "}
            <em style={{ color: "#001bab" }}>mais agilidade</em> e fundamento
            técnico.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 17,
              color: "#606060",
              maxWidth: 440,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            A plataforma que engenheiros civis e arquitetos usam para elaborar
            laudos com IA — do diagnóstico às referências normativas ABNT.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}
          >
            <Link
              href="#planos"
              style={{
                display: "inline-block",
                background: "#001bab",
                color: "#ffffff",
                borderRadius: 8,
                padding: "12px 28px",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#001280")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#001bab")
              }
            >
              Começar grátis
            </Link>
            <Link
              href="#como-funciona"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "#606060",
                border: "1px solid #e4e4e0",
                borderRadius: 8,
                padding: "12px 28px",
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#001bab";
                e.currentTarget.style.color = "#001bab";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e4e4e0";
                e.currentTarget.style.color = "#606060";
              }}
            >
              Como funciona
            </Link>
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 12.5,
              color: "#aaaaaa",
              margin: 0,
            }}
          >
            ✓ 1 laudo completo sem custo · sem cartão de crédito
          </motion.p>
        </motion.div>

        {/* Right column — mockup */}
        <motion.div
          variants={rightVariants}
          initial="hidden"
          animate="visible"
          style={{
            background: "linear-gradient(135deg, #f0f4ff, #e8eeff)",
            borderRadius: 16,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Laudo card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: "20px 22px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* Card header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
                Laudo #0042 — Fachada Norte
              </span>
              <span
                style={{
                  background: "rgba(219,169,20,0.12)",
                  color: "#b8900f",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 100,
                }}
              >
                Em análise
              </span>
            </div>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12.5, color: "#444", lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600 }}>• Patologia:</span> Fissuras
                horizontais em alvenaria de vedação, espessura 0,2–0,5mm,
                extensão ≈ 3,4m.
              </div>
              <div style={{ fontSize: 12.5, color: "#444", lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600 }}>• Causa provável:</span>{" "}
                Movimentação higroscópica e retração da argamassa de
                assentamento.
              </div>
              <div style={{ fontSize: 12.5, color: "#444", lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600 }}>• Gravidade:</span> Moderada
                — monitoramento semestral.
              </div>
            </div>

            {/* Norms */}
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#aaa",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Normas referenciadas
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["NBR 6118", "NBR 15575", "NBR 16747", "NBR 9575"].map(
                  (nbr) => (
                    <span
                      key={nbr}
                      style={{
                        background: "rgba(0,27,171,0.07)",
                        color: "#001bab",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 9px",
                        borderRadius: 4,
                        border: "1px solid rgba(0,27,171,0.14)",
                      }}
                    >
                      {nbr}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Status card */}
          <div
            style={{
              background: "#001bab",
              borderRadius: 10,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>📋</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
                Laudo pronto para exportar
              </span>
            </div>
            <span
              style={{
                background: "rgba(34,197,94,0.2)",
                color: "#4ade80",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 100,
              }}
            >
              Concluído
            </span>
          </div>
        </motion.div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            min-height: unset !important;
          }
        }
      `}</style>
    </section>
  );
}
