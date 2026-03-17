"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DEPOIMENTOS } from "@/lib/constants";
import { fadeUp, staggerFast } from "@/lib/animations";

export default function Depoimentos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ background: "#ffffff", padding: "80px 6%" }}>
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
            O que os profissionais dizem
          </h2>
          <p style={{ fontSize: 16, color: "#606060", maxWidth: 420, margin: "0 auto" }}>
            Engenheiros e arquitetos que já usam o Vistoria Aí no dia a dia.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          ref={ref}
          variants={staggerFast}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="depoimentos-grid"
        >
          {DEPOIMENTOS.map((d) => (
            <motion.div
              key={d.nome}
              variants={fadeUp}
              style={{
                border: "1px solid #e4e4e0",
                borderRadius: 14,
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              whileHover={{
                borderColor: "rgba(0,27,171,0.15)",
                boxShadow: "0 4px 20px rgba(0,27,171,0.05)",
              }}
            >
              {/* Stars */}
              <span
                style={{
                  fontSize: 14,
                  color: "#dba914",
                  letterSpacing: 2,
                }}
              >
                ★★★★★
              </span>

              {/* Quote */}
              <p
                style={{
                  fontSize: 14.5,
                  color: "#333",
                  lineHeight: 1.65,
                  margin: 0,
                  flexGrow: 1,
                }}
              >
                &ldquo;{d.texto}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#001bab",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {d.iniciais}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#111",
                      lineHeight: 1.3,
                    }}
                  >
                    {d.nome}
                  </div>
                  <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.3 }}>
                    {d.cargo}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .depoimentos-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .depoimentos-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
