import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCert, getAllCerts } from "@/lib/certifications";
import { ExamInfoCard } from "@/components/ExamInfoCard";
import type { Metadata } from "next";
import { ChevronRight, ArrowRight } from "lucide-react";
import type { CertCloud, CertLevel } from "@/lib/certifications/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string }>;
}): Promise<Metadata> {
  const { certId } = await params;
  const cert = getCert(certId);
  if (!cert) return {};
  return { title: `${cert.code} — ${cert.title}` };
}

export function generateStaticParams() {
  return getAllCerts().map((c) => ({ certId: c.id }));
}

const cloudColor: Record<CertCloud, string> = {
  aws: "#FF9900",
  gcp: "#4285F4",
  azure: "#0078D4",
};

const levelColor: Record<CertLevel, string> = {
  Associate: "#22C55E",
  Professional: "#F59E0B",
  Expert: "#EF4444",
};

export default async function CertOverviewPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const cert = getCert(certId);
  if (!cert) notFound();

  const cloudClr = cloudColor[cert.cloud];
  const levelClr = levelColor[cert.level];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px 96px" }}>
        {/* Breadcrumb */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#64748B",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          <Link href="/certifications" style={{ color: "#64748B", textDecoration: "none" }}>
            Certifications
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>{cert.code}</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "999px",
                backgroundColor: `${cloudClr}20`,
                color: cloudClr,
                border: `1px solid ${cloudClr}30`,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {cert.cloud.toUpperCase()}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "999px",
                backgroundColor: `${levelClr}18`,
                color: levelClr,
                border: `1px solid ${levelClr}30`,
              }}
            >
              {cert.level}
            </span>
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: cloudClr,
              letterSpacing: "0.06em",
              marginBottom: "8px",
            }}
          >
            {cert.code}
          </div>
          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 34px)",
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: "-0.5px",
              marginBottom: "14px",
            }}
          >
            {cert.title}
          </h1>
          <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.7, maxWidth: "640px" }}>
            {cert.description}
          </p>
        </div>

        {/* Exam Info */}
        <div style={{ marginBottom: "40px" }}>
          <ExamInfoCard
            questions={cert.examFormat.questions}
            duration={cert.examFormat.duration}
            passingScore={cert.examFormat.passingScore}
            cost={cert.examFormat.cost}
          />
        </div>

        {/* Domain List */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F8FAFC" }}>
              Study Domains
            </h2>
            <Link
              href={`/certifications/${cert.id}/dashboard`}
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#4ade80",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View dashboard
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {cert.domains.map((domain, idx) => (
              <Link
                key={domain.id}
                href={`/certifications/${cert.id}/${domain.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 20px",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                  backgroundColor: "#1B2336",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: `${cloudClr}18`,
                    border: `1px solid ${cloudClr}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: cloudClr,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#E2E8F0", marginBottom: "2px" }}>
                    {domain.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>
                    Weight: {domain.weight} &middot; {domain.quiz.length} quiz questions
                  </div>
                </div>
                <ArrowRight size={14} color="#475569" />
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        {cert.domains.length > 0 && (
          <Link
            href={`/certifications/${cert.id}/${cert.domains[0].id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "13px 26px",
              borderRadius: "10px",
              backgroundColor: "#22C55E",
              color: "#0F172A",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Start Domain 1
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

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
