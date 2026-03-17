"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_ITEMS } from "@/lib/constants";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      style={{ background: "#f5f5f3", padding: "80px 6%" }}
    >
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
            Perguntas frequentes
          </h2>
          <p style={{ fontSize: 16, color: "#606060", maxWidth: 420, margin: "0 auto" }}>
            Tudo que você precisa saber antes de começar.
          </p>
        </div>

        {/* Accordion */}
        <div
          style={{
            maxWidth: 660,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={item.pergunta}
              style={{
                background: "#ffffff",
                borderRadius: 10,
                border: "1px solid #e4e4e0",
                overflow: "hidden",
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 22px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111111",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.4,
                  }}
                >
                  {item.pergunta}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{
                    fontSize: 16,
                    color: "#dba914",
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                >
                  ▼
                </motion.span>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        color: "#606060",
                        lineHeight: 1.7,
                        margin: 0,
                        padding: "0 22px 20px",
                        borderTop: "1px solid #e4e4e0",
                        paddingTop: 14,
                      }}
                    >
                      {item.resposta}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
