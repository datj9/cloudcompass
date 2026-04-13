"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CertProgressBar } from "@/components/CertProgressBar";
import { DomainScoreGrid } from "@/components/DomainScoreGrid";
import { useCertProgress } from "@/hooks/useCertProgress";
import type { CertDomain, CertCloud } from "@/lib/certifications/types";
import { ChevronRight, AlertTriangle, ArrowRight } from "lucide-react";

interface DashboardClientProps {
  certId: string;
  certCode: string;
  certTitle: string;
  certCloud: CertCloud;
  domains: CertDomain[];
}

const cloudColor: Record<CertCloud, string> = {
  aws: "#FF9900",
  gcp: "#4285F4",
  azure: "#0078D4",
};

export function DashboardClient({
  certId,
  certCode,
  certTitle,
  certCloud,
  domains,
}: DashboardClientProps) {
  const { progress, completedCount, setConfidence, getQuizResult } =
    useCertProgress(certId);
  const cloudClr = cloudColor[certCloud];

  // Compute exam readiness: average quiz score across completed quizzes
  const domainScores = domains.map((d) => {
    const result = progress.quizResults[d.id];
    if (!result) return null;
    return Math.round((result.score / result.total) * 100);
  });
  const scoredDomains = domainScores.filter((s): s is number => s !== null);
  const examReadiness =
    scoredDomains.length > 0
      ? Math.round(scoredDomains.reduce((a, b) => a + b, 0) / scoredDomains.length)
      : 0;

  const weakDomains = domains.filter((d) => {
    const result = progress.quizResults[d.id];
    if (!result) return false;
    return result.score / result.total < 0.7;
  });

  const needReviewCount = weakDomains.length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px 96px" }}>
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
          <Link
            href={`/certifications/${certId}`}
            style={{ color: "#64748B", textDecoration: "none" }}
          >
            {certCode}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>Dashboard</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "13px",
              color: cloudClr,
              fontWeight: 600,
              letterSpacing: "0.04em",
              marginBottom: "6px",
            }}
          >
            {certCode}
          </div>
          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 30px)",
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: "-0.5px",
              marginBottom: "4px",
            }}
          >
            {certCode} — Your Progress
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B" }}>{certTitle}</p>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          {/* Exam Readiness */}
          <div
            style={{
              backgroundColor: "#1B2336",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: examReadiness >= 70 ? "#22C55E" : examReadiness >= 50 ? "#F59E0B" : "#EF4444",
                letterSpacing: "-1px",
                marginBottom: "4px",
              }}
            >
              {examReadiness}%
            </div>
            <div style={{ fontSize: "12px", color: "#64748B" }}>Exam Readiness</div>
          </div>

          {/* Domains Complete */}
          <div
            style={{
              backgroundColor: "#1B2336",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#4ade80",
                letterSpacing: "-1px",
                marginBottom: "4px",
              }}
            >
              {completedCount}/{domains.length}
            </div>
            <div style={{ fontSize: "12px", color: "#64748B" }}>Domains Complete</div>
          </div>

          {/* Need Review */}
          <div
            style={{
              backgroundColor: "#1B2336",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: needReviewCount > 0 ? "#F59E0B" : "#4ade80",
                letterSpacing: "-1px",
                marginBottom: "4px",
              }}
            >
              {needReviewCount}
            </div>
            <div style={{ fontSize: "12px", color: "#64748B" }}>Need Review</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            backgroundColor: "#1B2336",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "24px",
          }}
        >
          <CertProgressBar completed={completedCount} total={domains.length} />
        </div>

        {/* Areas to Review */}
        {weakDomains.length > 0 && (
          <div
            style={{
              backgroundColor: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <AlertTriangle size={16} color="#F59E0B" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F59E0B" }}>
                Areas to Review
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {weakDomains.map((domain) => {
                const result = progress.quizResults[domain.id];
                const pct = result
                  ? Math.round((result.score / result.total) * 100)
                  : 0;
                return (
                  <Link
                    key={domain.id}
                    href={`/certifications/${certId}/${domain.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      fontSize: "14px",
                      color: "#E2E8F0",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <ArrowRight size={13} color="#F59E0B" />
                      {domain.title}
                    </span>
                    <span style={{ fontSize: "12px", color: "#F59E0B", fontWeight: 600 }}>
                      {pct}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Domain Breakdown */}
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#F8FAFC",
              marginBottom: "16px",
            }}
          >
            Domain Breakdown
          </h2>
          <DomainScoreGrid
            certId={certId}
            domains={domains}
            quizResults={progress.quizResults}
            confidence={progress.confidence}
            completedDomains={progress.completedDomains}
            onConfidenceChange={setConfidence}
          />
        </div>
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
