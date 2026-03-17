import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Vistoria Aí",
  description:
    "Artigos técnicos sobre patologia das construções, laudos, normas ABNT e manutenção predial para engenheiros e arquitetos.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "70vh" }}>
        {/* Header */}
        <div style={{ background: "#001bab", padding: "64px 6% 56px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                color: "#ffffff",
                marginBottom: 12,
              }}
            >
              Blog
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.65)",
                margin: 0,
              }}
            >
              Patologia das construções, laudos técnicos e normas ABNT.
            </p>
          </div>
        </div>

        {/* Articles */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 6%" }}>
          <div className="blog-grid">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-card-link"
              >
                <article className="blog-card">
                  {/* Thumbnail */}
                  <div
                    style={{
                      height: 140,
                      background: post.thumbnailColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 36 }}>📋</span>
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: "20px 22px 24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      flexGrow: 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="blog-tag">{post.tag}</span>
                      <span style={{ fontSize: 12, color: "#aaa" }}>
                        {post.data}
                      </span>
                    </div>
                    <h2
                      style={{
                        fontSize: 15.5,
                        fontWeight: 600,
                        color: "#111",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.4,
                        margin: 0,
                      }}
                    >
                      {post.titulo}
                    </h2>
                    <p
                      style={{
                        fontSize: 13.5,
                        color: "#606060",
                        lineHeight: 1.65,
                        margin: 0,
                        flexGrow: 1,
                      }}
                    >
                      {post.resumo}
                    </p>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#001bab",
                        fontWeight: 600,
                        marginTop: 4,
                      }}
                    >
                      Ler artigo →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .blog-card-link {
          text-decoration: none;
        }
        .blog-card {
          border: 1px solid #e4e4e0;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ffffff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .blog-card:hover {
          border-color: rgba(0,27,171,0.20);
          box-shadow: 0 4px 20px rgba(0,27,171,0.06);
        }
        .blog-tag {
          font-size: 11px;
          font-weight: 600;
          color: #001bab;
          background: rgba(0,27,171,0.07);
          border: 1px solid rgba(0,27,171,0.14);
          padding: 2px 10px;
          border-radius: 100px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
