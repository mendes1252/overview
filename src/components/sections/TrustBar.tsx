const metrics = [
  { valor: "+1.200", label: "laudos gerados" },
  { valor: "+380", label: "profissionais ativos" },
  { valor: "4.9★", label: "avaliação média" },
  { valor: "100%", label: "fundamentação ABNT" },
];

export default function TrustBar() {
  return (
    <section
      style={{
        background: "#f5f5f3",
        borderTop: "1px solid #e4e4e0",
        borderBottom: "1px solid #e4e4e0",
        padding: "20px 6%",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0,
        }}
      >
        {metrics.map((m, i) => (
          <div
            key={m.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "8px 40px",
              borderRight:
                i < metrics.length - 1 ? "1px solid #e4e4e0" : "none",
              gap: 2,
            }}
            className="trust-metric"
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#001bab",
                lineHeight: 1,
              }}
            >
              {m.valor}
            </span>
            <span
              style={{
                fontSize: 11.5,
                color: "#aaaaaa",
                letterSpacing: "0.01em",
              }}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .trust-metric {
            border-right: none !important;
            border-bottom: 1px solid #e4e4e0;
            width: 50%;
            padding: 12px 16px !important;
          }
          .trust-metric:nth-child(odd) {
            border-right: 1px solid #e4e4e0 !important;
          }
          .trust-metric:last-child, .trust-metric:nth-last-child(2):nth-child(odd) {
            border-bottom: none;
          }
        }
      `}</style>
    </section>
  );
}
