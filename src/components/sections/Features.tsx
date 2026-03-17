"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FEATURES } from "@/lib/constants";
import { fadeUp, staggerFast } from "@/lib/animations";

export default function Features() {
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
            Tudo que o laudo técnico precisa
          </h2>
          <p style={{ fontSize: 16, color: "#606060", maxWidth: 480, margin: "0 auto" }}>
            Ferramentas pensadas para quem trabalha com patologia de verdade.
          </p>
        </div>

        {/* Grid */}
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
          className="features-grid"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.titulo}
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
                borderColor: "#dba914",
                boxShadow: "0 4px 20px rgba(219,169,20,0.08)",
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
                {f.icon}
              </div>

              {/* Text */}
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111111",
                    marginBottom: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.titulo}
                </h3>
                <p style={{ fontSize: 13.5, color: "#606060", lineHeight: 1.65, margin: 0 }}>
                  {f.descricao}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
