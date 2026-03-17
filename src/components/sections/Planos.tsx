"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { PLANOS } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";

function Checkmark() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        color: "#dba914",
        flexShrink: 0,
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      ✓
    </span>
  );
}

export default function Planos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="planos" style={{ background: "#f5f5f3", padding: "80px 6%" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "#111111",
              marginBottom: 12,
            }}
          >
            Planos simples, sem surpresas
          </h2>
          <p style={{ fontSize: 16, color: "#606060", maxWidth: 440, margin: "0 auto" }}>
            Comece grátis e migre para o plano profissional quando precisar de
            mais.
          </p>
        </div>

        {/* Plans grid */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
            maxWidth: 720,
            margin: "0 auto",
          }}
          className="planos-grid"
        >
          {PLANOS.map((plano) => (
            <motion.div
              key={plano.nome}
              variants={fadeUp}
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: "32px 28px",
                border: plano.destaque ? "2px solid #001bab" : "1px solid #e4e4e0",
                boxShadow: plano.destaque
                  ? "0 8px 40px rgba(0,27,171,0.12)"
                  : "none",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {/* Popular badge */}
              {plano.destaque && (
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#001bab",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 16px",
                    borderRadius: "0 0 8px 8px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Mais escolhido
                </div>
              )}

              {/* Plan header */}
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111",
                    marginBottom: 4,
                  }}
                >
                  {plano.nome}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#606060",
                    marginBottom: 16,
                    lineHeight: 1.5,
                  }}
                >
                  {plano.descricao}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span
                    style={{
                      fontSize: 38,
                      fontWeight: 700,
                      color: "#111111",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {plano.preco === 0 ? "Grátis" : `R$ ${plano.preco}`}
                  </span>
                  {plano.preco > 0 && (
                    <span style={{ fontSize: 14, color: "#aaa" }}>/mês</span>
                  )}
                </div>
              </div>

              {/* Items */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flexGrow: 1,
                }}
              >
                {plano.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 14,
                      color: "#444",
                      lineHeight: 1.5,
                    }}
                  >
                    <Checkmark />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div>
                <Link
                  href="#"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px 20px",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "background 0.15s, border-color 0.15s",
                    ...(plano.destaque
                      ? {
                          background: "#dba914",
                          color: "#ffffff",
                          border: "none",
                        }
                      : {
                          background: "transparent",
                          color: "#001bab",
                          border: "1.5px solid #001bab",
                        }),
                  }}
                  onMouseEnter={(e) => {
                    if (plano.destaque) {
                      e.currentTarget.style.background = "#b8900f";
                    } else {
                      e.currentTarget.style.background = "rgba(0,27,171,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plano.destaque) {
                      e.currentTarget.style.background = "#dba914";
                    } else {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {plano.cta}
                </Link>

                {plano.nota && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#cccccc",
                      textAlign: "center",
                      marginTop: 10,
                      marginBottom: 0,
                    }}
                  >
                    {plano.nota}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .planos-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
