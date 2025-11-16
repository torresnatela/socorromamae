"use client";

import { useEffect, useState } from "react";

type HealthPayload = {
  status: "healthy" | "degraded";
  supabase?: string;
};

const HomePage = () => {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/health");
        const data = (await response.json()) as HealthPayload;
        setHealth(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Health check failed.");
      }
    };

    fetchHealth();
  }, []);

  return (
    <section style={{ padding: "3rem 1.5rem" }}>
      <div
        style={{
          margin: "0 auto",
          maxWidth: "720px",
          background: "#fff",
          borderRadius: "24px",
          padding: "2.5rem",
          boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem"
        }}
      >
        <header>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "0.75rem",
              color: "#059669",
              fontWeight: 600
            }}
          >
            Foundations
          </p>
          <h1 style={{ fontSize: "2.25rem", margin: "0.5rem 0" }}>
            Single workspace ready for MVC-style development
          </h1>
          <p style={{ color: "#475569" }}>
            Frontend and backend teams now share one simple Next.js project with Supabase
            connectivity so authentication features can evolve without extra tooling.
          </p>
        </header>

        <article
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.5rem",
            background: "#f8fafc"
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" }}>
            Supabase Health
          </p>
          <p style={{ fontSize: "2rem", fontWeight: 600, color: "#0f172a" }}>
            {health?.status ?? "Checking..."}
          </p>
          <p style={{ color: "#475569" }}>{health?.supabase ?? error ?? ""}</p>
        </article>

        <div>
          <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Environment Summary</p>
          <pre
            style={{
              marginTop: "0.5rem",
              padding: "1rem",
              background: "#0f172a",
              color: "#e2e8f0",
              borderRadius: "12px"
            }}
          >
{`NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "not set"}
Supabase client: browser + server-ready`}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
