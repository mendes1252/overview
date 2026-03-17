import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogSidebarCTA from "@/components/blog/BlogSidebarCTA";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.titulo} — Vistoria Aí`,
    description: post.resumo,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const lines = post.conteudo.split("\n");

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "70vh" }}>
        {/* Article header */}
        <div style={{ background: "#001bab", padding: "56px 6% 48px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.80)",
                  background: "rgba(255,255,255,0.15)",
                  padding: "3px 12px",
                  borderRadius: 100,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {post.tag}
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.50)" }}>
                {post.data}
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(24px, 3.5vw, 38px)",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {post.titulo}
            </h1>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="article-layout">
          {/* Article content */}
          <article>
            {/* Resumo */}
            <p
              style={{
                fontSize: 17,
                color: "#444",
                lineHeight: 1.75,
                marginBottom: 32,
                paddingBottom: 24,
                borderBottom: "1px solid #e4e4e0",
                fontWeight: 500,
              }}
            >
              {post.resumo}
            </p>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {lines.map((line, i) => {
                if (line.startsWith("# ")) {
                  return null;
                } else if (line.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        color: "#111",
                        letterSpacing: "-0.02em",
                        marginTop: 24,
                        marginBottom: 4,
                      }}
                    >
                      {line.replace("## ", "")}
                    </h2>
                  );
                } else if (line.startsWith("### ")) {
                  return (
                    <h3
                      key={i}
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: "#222",
                        letterSpacing: "-0.015em",
                        marginTop: 16,
                        marginBottom: 2,
                      }}
                    >
                      {line.replace("### ", "")}
                    </h3>
                  );
                } else if (line.startsWith("- ")) {
                  return (
                    <li
                      key={i}
                      style={{
                        fontSize: 15,
                        color: "#444",
                        lineHeight: 1.7,
                        marginLeft: 20,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: line
                          .replace("- ", "")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  );
                } else if (
                  line.startsWith("*") &&
                  line.endsWith("*") &&
                  line.length > 2
                ) {
                  return (
                    <p
                      key={i}
                      style={{
                        fontSize: 13,
                        color: "#aaa",
                        fontStyle: "italic",
                        marginTop: 16,
                      }}
                    >
                      {line.replace(/\*/g, "")}
                    </p>
                  );
                } else if (line.trim() === "") {
                  return null;
                } else {
                  return (
                    <p
                      key={i}
                      style={{
                        fontSize: 15.5,
                        color: "#444",
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: line.replace(
                          /\*\*(.*?)\*\*/g,
                          "<strong>$1</strong>"
                        ),
                      }}
                    />
                  );
                }
              })}
            </div>

            {/* Back link */}
            <div
              style={{
                marginTop: 48,
                paddingTop: 24,
                borderTop: "1px solid #e4e4e0",
              }}
            >
              <Link
                href="/blog"
                style={{
                  fontSize: 14,
                  color: "#001bab",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                ← Voltar ao blog
              </Link>
            </div>
          </article>

          {/* Sticky sidebar */}
          <aside style={{ position: "sticky", top: 88 }}>
            <BlogSidebarCTA />
          </aside>
        </div>
      </main>
      <Footer />

      <style>{`
        .article-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 6%;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .article-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
