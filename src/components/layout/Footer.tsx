"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "mailto:contato@vistoriaai.com.br" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#040e36" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 6% 28px",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 32,
            marginBottom: 32,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Image
              src="/logo-white.svg"
              alt="Vistoria Aí"
              width={128}
              height={24}
              style={{ height: 24, width: "auto" }}
            />
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.38)",
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              Soluções inteligentes para construção
            </p>
          </div>

          {/* Links */}
          <nav
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "center",
            }}
            aria-label="Links do rodapé"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.48)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.80)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.48)")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.20)",
              margin: 0,
            }}
          >
            © 2025 Vistoria Aí · Todos os direitos reservados
          </p>
          <Link
            href="https://linkedin.com/company/vistoriaai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.38)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.70)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.38)")
            }
          >
            LinkedIn →
          </Link>
        </div>
      </div>
    </footer>
  );
}
