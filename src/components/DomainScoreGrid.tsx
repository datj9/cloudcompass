"use client";

import Link from "next/link";
import type { CertDomain, QuizResult } from "@/lib/certifications/types";
import { ConfidenceRating } from "./ConfidenceRating";

interface DomainScoreGridProps {
  certId: string;
  domains: CertDomain[];
  quizResults: Record<string, QuizResult>;
  confidence: Record<string, number>;
  completedDomains: string[];
  onConfidenceChange: (domainId: string, level: number) => void;
}

function scoreColor(score: number, total: number): string {
  if (total === 0) return "#475569";
  const pct = (score / total) * 100;
  if (pct >= 80) return "#22C55E";
  if (pct >= 60) return "#F59E0B";
  return "#EF4444";
}

export function DomainScoreGrid({ certId, domains, quizResults, confidence, completedDomains, onConfidenceChange }: DomainScoreGridProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {domains.map((domain) => {
        const result = quizResults[domain.id];
        const conf = confidence[domain.id] ?? 0;
        const completed = completedDomains.includes(domain.id);
        const color = result ? scoreColor(result.score, result.total) : "#475569";

        return (
          <div key={domain.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: "10px", border: `1px solid ${completed ? "rgba(74,222,128,0.3)" : "#334155"}`, backgroundColor: completed ? "rgba(74,222,128,0.05)" : "#1B2336", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ flex: "1 1 200px" }}>
              <Link href={`/certifications/${certId}/${domain.id}`} style={{ fontSize: "14px", fontWeight: 600, color: "#E2E8F0", textDecoration: "none" }}>{domain.title}</Link>
              <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>Weight: {domain.weight}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", minWidth: "60px" }}>
                {result ? (
                  <>
                    <div style={{ fontSize: "16px", fontWeight: 700, color }}>{result.score}/{result.total}</div>
                    <div style={{ fontSize: "10px", color: "#64748B" }}>{new Date(result.lastAttempt).toLocaleDateString()}</div>
                  </>
                ) : (
                  <div style={{ fontSize: "12px", color: "#475569" }}>No quiz</div>
                )}
              </div>
              <ConfidenceRating value={conf} onChange={(l) => onConfidenceChange(domain.id, l)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
