"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STEPS } from "@/lib/constants";
import { fadeUp, staggerSlow } from "@/lib/animations";

export default function ComoFunciona() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="como-funciona"
      style={{ background: "#f5f5f3", padding: "80px 6%" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "#111111",
              marginBottom: 12,
            }}
          >
            Como funciona
          </h2>
          <p style={{ fontSize: 16, color: "#606060", maxWidth: 480, margin: "0 auto" }}>
            Do registro em campo ao laudo estruturado, em três etapas.
          </p>
        </div>

        {/* Steps */}
        <motion.div
          ref={ref}
          variants={staggerSlow}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            position: "relative",
          }}
          className="steps-grid"
        >
          {/* Connector line */}
          <div
            className="steps-connector"
            style={{
              position: "absolute",
              top: 26,
              left: "16.5%",
              right: "16.5%",
              height: 2,
              background: "#e4e4e0",
              zIndex: 0,
            }}
          />

          {STEPS.map((step) => (
            <motion.div
              key={step.numero}
              variants={fadeUp}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 20,
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: `2px solid #001bab`,
                  background: step.ativo ? "#001bab" : "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: step.ativo ? "#ffffff" : "#001bab",
                  }}
                >
                  {step.numero}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#111111",
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.titulo}
                </h3>
                <p style={{ fontSize: 14, color: "#606060", lineHeight: 1.65, margin: 0 }}>
                  {step.descricao}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .steps-connector {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
