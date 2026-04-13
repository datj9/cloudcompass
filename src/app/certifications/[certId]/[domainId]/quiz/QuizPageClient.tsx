"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { QuizRunner } from "@/components/QuizRunner";
import { useCertProgress } from "@/hooks/useCertProgress";
import type { QuizQuestion, QuizResult } from "@/lib/certifications/types";
import { ChevronRight } from "lucide-react";

interface QuizPageClientProps {
  certId: string;
  domainId: string;
  certCode: string;
  domainTitle: string;
  questions: QuizQuestion[];
}

export function QuizPageClient({
  certId,
  domainId,
  certCode,
  domainTitle,
  questions,
}: QuizPageClientProps) {
  const { saveQuizResult, markDomainComplete } = useCertProgress(certId);

  const handleComplete = (result: QuizResult) => {
    saveQuizResult(domainId, result);
    if (result.score / result.total >= 0.7) {
      markDomainComplete(domainId);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 24px 96px" }}>
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
          <Link
            href={`/certifications/${certId}/${domainId}`}
            style={{ color: "#64748B", textDecoration: "none" }}
          >
            {domainTitle}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>Quiz</span>
        </nav>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#F8FAFC",
            marginBottom: "8px",
          }}
        >
          {domainTitle} — Quiz
        </h1>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "32px" }}>
          {questions.length} questions · Score 70%+ to mark domain complete
        </p>
        <QuizRunner questions={questions} onComplete={handleComplete} />
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
