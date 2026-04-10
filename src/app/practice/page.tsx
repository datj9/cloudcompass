import Link from "next/link";
import Navbar from "@/components/Navbar";
import { labs } from "@/lib/content";
import {
  Zap,
  Clock,
  BarChart2,
  Terminal,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";

const levelColor: Record<string, string> = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

const levelBg: Record<string, string> = {
  Beginner: "rgba(34,197,94,0.1)",
  Intermediate: "rgba(245,158,11,0.1)",
  Advanced: "rgba(239,68,68,0.1)",
};

export default function PracticePage() {
  const freeLabs = labs.filter((l) => l.free);
  const premiumLabs = labs.filter((l) => !l.free);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px 96px" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#22C55E",
              marginBottom: "12px",
            }}
          >
            Hands-On Labs
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: "-0.8px",
              marginBottom: "16px",
            }}
          >
            Practice with real cloud tasks
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "16px", maxWidth: "560px" }}>
            Step-by-step labs that teach by doing. Each lab works across AWS, GCP, and Azure so you learn the pattern, not just one cloud.
          </p>
        </div>

        {/* Quick stats */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "48px",
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: Terminal, label: `${labs.length} Total labs` },
            { icon: CheckCircle2, label: `${freeLabs.length} Free labs` },
            { icon: BarChart2, label: "Beginner to Advanced" },
            { icon: Clock, label: "20–75 min each" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: "#1B2336",
                border: "1px solid #334155",
                fontSize: "13px",
                color: "#94A3B8",
              }}
            >
              <Icon size={14} color="#22C55E" />
              {label}
            </div>
          ))}
        </div>

        {/* Free Labs */}
        <div style={{ marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#F8FAFC",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={18} color="#22C55E" />
            Free Labs
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "16px",
            }}
          >
            {freeLabs.map((lab) => (
              <Link
                key={lab.id}
                href={`/practice/${lab.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  padding: "24px",
                  borderRadius: "14px",
                  border: "1px solid #334155",
                  backgroundColor: "#1B2336",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 9px",
                      borderRadius: "999px",
                      backgroundColor: levelBg[lab.level],
                      color: levelColor[lab.level],
                    }}
                  >
                    {lab.level}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      color: "#64748B",
                    }}
                  >
                    <Clock size={12} />
                    {lab.time}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#F8FAFC", marginBottom: "8px", lineHeight: 1.4 }}>
                    {lab.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.6 }}>{lab.desc}</p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {lab.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "11px",
                        padding: "2px 7px",
                        borderRadius: "5px",
                        backgroundColor: "#272F42",
                        color: "#94A3B8",
                        border: "1px solid #334155",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#22C55E",
                    marginTop: "auto",
                  }}
                >
                  Start lab <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Premium Labs */}
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#F8FAFC",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Lock size={18} color="#F59E0B" />
            Advanced Labs
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "16px",
            }}
          >
            {premiumLabs.map((lab) => (
              <div
                key={lab.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  padding: "24px",
                  borderRadius: "14px",
                  border: "1px solid #334155",
                  backgroundColor: "#1B2336",
                  opacity: 0.7,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Coming soon overlay badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(245,158,11,0.15)",
                    border: "1px solid rgba(245,158,11,0.3)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#F59E0B",
                  }}
                >
                  Coming soon
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 9px",
                      borderRadius: "999px",
                      backgroundColor: levelBg[lab.level],
                      color: levelColor[lab.level],
                    }}
                  >
                    {lab.level}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      color: "#64748B",
                      marginRight: "80px",
                    }}
                  >
                    <Clock size={12} />
                    {lab.time}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#F8FAFC", marginBottom: "8px", lineHeight: 1.4 }}>
                    {lab.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.6 }}>{lab.desc}</p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {lab.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "11px",
                        padding: "2px 7px",
                        borderRadius: "5px",
                        backgroundColor: "#272F42",
                        color: "#94A3B8",
                        border: "1px solid #334155",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid #334155",
          backgroundColor: "#1B2336",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#64748B", fontSize: "13px" }}>
          © 2025 CloudCompass. Built for engineers learning the cloud.
        </div>
      </footer>
    </div>
  );
}
