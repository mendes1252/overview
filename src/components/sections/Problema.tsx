"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { PROBLEMAS } from "@/lib/constants";
import { fadeUp, staggerFast } from "@/lib/animations";

export default function Problema() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      style={{
        background: "#ffffff",
        padding: "80px 6%",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section header */}
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
            O processo atual toma tempo demais
          </h2>
          <p style={{ fontSize: 16, color: "#606060", maxWidth: 520, margin: "0 auto" }}>
            Profissionais habilitados perdem horas em trabalho repetitivo que
            deveria ser automatizado.
          </p>
        </div>

        {/* Cards grid */}
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
          className="problema-grid"
        >
          {PROBLEMAS.map((p) => (
            <motion.div
              key={p.titulo}
              variants={fadeUp}
              style={{
                border: "1px solid #e4e4e0",
                borderRadius: 14,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                transition: "border-color 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              whileHover={{
                borderColor: "rgba(0,27,171,0.20)",
                boxShadow: "0 4px 20px rgba(0,27,171,0.06)",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "rgba(0,27,171,0.07)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                {p.icon}
              </div>

              {/* Text */}
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#111111",
                    marginBottom: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.titulo}
                </h3>
                <p style={{ fontSize: 14, color: "#606060", lineHeight: 1.65, margin: 0 }}>
                  {p.descricao}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .problema-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .problema-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
