"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        background: "#001bab",
        boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.08)" : "none",
      }}
      className="sticky top-0 z-50 transition-shadow duration-300"
    >
      <div
        style={{
          height: 64,
          padding: "0 6%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Link href="/" aria-label="Vistoria Aí — Início">
          <Image
            src="/logo-white.svg"
            alt="Vistoria Aí"
            width={160}
            height={30}
            style={{ height: 30, width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: "rgba(255,255,255,0.70)",
                fontSize: 14,
                fontWeight: 400,
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#ffffff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.70)")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="#planos"
            style={{
              background: "#dba914",
              color: "#ffffff",
              borderRadius: 6,
              padding: "9px 20px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#b8900f")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#dba914")
            }
          >
            Começar grátis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: "#fff",
              borderRadius: 2,
              transition: "transform 0.2s",
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: "#fff",
              borderRadius: 2,
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.2s",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: "#fff",
              borderRadius: 2,
              transition: "transform 0.2s",
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          style={{ background: "#001280", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div style={{ padding: "16px 6% 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: "rgba(255,255,255,0.80)",
                  fontSize: 15,
                  fontWeight: 400,
                  textDecoration: "none",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#planos"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-block",
                marginTop: 12,
                background: "#dba914",
                color: "#ffffff",
                borderRadius: 6,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Começar grátis
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
