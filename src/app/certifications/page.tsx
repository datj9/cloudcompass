import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAllCerts } from "@/lib/certifications";
import type { Metadata } from "next";
import { ArrowRight, Award, BookOpen } from "lucide-react";
import type { CertCloud } from "@/lib/certifications/types";

export const metadata: Metadata = {
  title: "Certification Prep",
};

const cloudConfig: Record<CertCloud, { label: string; color: string; bg: string; border: string }> = {
  aws: { label: "Amazon Web Services", color: "#FF9900", bg: "rgba(255,153,0,0.08)", border: "rgba(255,153,0,0.2)" },
  gcp: { label: "Google Cloud Platform", color: "#4285F4", bg: "rgba(66,133,244,0.08)", border: "rgba(66,133,244,0.2)" },
  azure: { label: "Microsoft Azure", color: "#0078D4", bg: "rgba(0,120,212,0.08)", border: "rgba(0,120,212,0.2)" },
};

const levelColor: Record<string, string> = {
  Associate: "#22C55E",
  Professional: "#F59E0B",
  Expert: "#EF4444",
};

const clouds: CertCloud[] = ["aws", "gcp", "azure"];

export default function CertificationsPage() {
  const allCerts = getAllCerts();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px 96px" }}>
        {/* Header */}
        <div style={{ marginBottom: "56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              borderRadius: "999px",
              border: "1px solid rgba(74,222,128,0.3)",
              backgroundColor: "rgba(74,222,128,0.08)",
              marginBottom: "20px",
            }}
          >
            <Award size={13} color="#4ade80" />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#4ade80",
              }}
            >
              Certification Prep
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.8px",
              color: "#F8FAFC",
              marginBottom: "16px",
            }}
          >
            Get Cloud Certified
          </h1>
          <p style={{ fontSize: "16px", color: "#94A3B8", maxWidth: "560px", lineHeight: 1.7 }}>
            Structured domain-by-domain prep for AWS, GCP, and Azure certifications. Study key concepts, review exam tips, and test yourself with quiz questions.
          </p>
        </div>

        {/* Cloud Sections */}
        {clouds.map((cloud) => {
          const certs = allCerts.filter((c) => c.cloud === cloud);
          if (certs.length === 0) return null;
          const cfg = cloudConfig[cloud];

          return (
            <section key={cloud} style={{ marginBottom: "56px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #334155",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: cfg.color,
                  }}
                />
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F8FAFC" }}>
                  {cfg.label}
                </h2>
                <span style={{ fontSize: "13px", color: "#64748B" }}>
                  {certs.length} certification{certs.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "16px",
                }}
              >
                {certs.map((cert) => {
                  const totalQuestions = cert.domains.reduce(
                    (sum, d) => sum + d.quiz.length,
                    0
                  );
                  return (
                    <Link
                      key={cert.id}
                      href={`/certifications/${cert.id}`}
                      style={{
                        display: "block",
                        padding: "24px",
                        borderRadius: "14px",
                        border: `1px solid ${cfg.border}`,
                        backgroundColor: cfg.bg,
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Badges */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "14px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: "999px",
                            backgroundColor: `${cfg.color}20`,
                            color: cfg.color,
                            border: `1px solid ${cfg.color}30`,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {cloud.toUpperCase()}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: "999px",
                            backgroundColor: `${levelColor[cert.level]}18`,
                            color: levelColor[cert.level],
                            border: `1px solid ${levelColor[cert.level]}30`,
                          }}
                        >
                          {cert.level}
                        </span>
                      </div>

                      {/* Title */}
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: cfg.color,
                          letterSpacing: "0.04em",
                          marginBottom: "6px",
                        }}
                      >
                        {cert.code}
                      </div>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#F8FAFC",
                          marginBottom: "10px",
                          lineHeight: 1.4,
                        }}
                      >
                        {cert.title}
                      </h3>

                      {/* Meta */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          fontSize: "12px",
                          color: "#64748B",
                          marginBottom: "20px",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <BookOpen size={12} />
                          {cert.domains.length} domains
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Award size={12} />
                          {totalQuestions} questions
                        </span>
                      </div>

                      {/* CTA */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: cfg.color,
                        }}
                      >
                        Start prep
                        <ArrowRight size={13} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
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
