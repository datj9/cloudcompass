import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCert, getAllCerts, getDomain } from "@/lib/certifications";
import { DomainNav } from "@/components/DomainNav";
import { CodeBlock } from "@/components/CodeBlock";
import type { Metadata } from "next";
import { ChevronRight, Lightbulb, Target, BookOpen, ArrowRight } from "lucide-react";
import type { CertCloud } from "@/lib/certifications/types";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string; domainId: string }>;
}): Promise<Metadata> {
  const { certId, domainId } = await params;
  const cert = getCert(certId);
  const domain = cert ? getDomain(certId, domainId) : undefined;
  if (!cert || !domain) return {};
  return { title: `${domain.title} — ${cert.code}` };
}

export function generateStaticParams() {
  const params: { certId: string; domainId: string }[] = [];
  for (const cert of getAllCerts()) {
    for (const domain of cert.domains) {
      params.push({ certId: cert.id, domainId: domain.id });
    }
  }
  return params;
}

const cloudColor: Record<CertCloud, string> = {
  aws: "#FF9900",
  gcp: "#4285F4",
  azure: "#0078D4",
};

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "#F8FAFC" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          style={{
            background: "#272F42",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "13px",
            color: "#4ade80",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function BodyText({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {text.split("\n").map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={i} />;
        const isBullet =
          trimmed.startsWith("•") ||
          trimmed.startsWith("-") ||
          /^\|/.test(trimmed);
        return (
          <p
            key={i}
            style={{
              margin: 0,
              fontSize: "15px",
              color: "#CBD5E1",
              lineHeight: 1.8,
              paddingLeft: isBullet ? "4px" : "0",
            }}
          >
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default async function DomainStudyPage({
  params,
}: {
  params: Promise<{ certId: string; domainId: string }>;
}) {
  const { certId, domainId } = await params;
  const cert = getCert(certId);
  if (!cert) notFound();

  const domain = getDomain(certId, domainId);
  if (!domain) notFound();

  const idx = cert.domains.findIndex((d) => d.id === domainId);
  const prevDomain = idx > 0 ? cert.domains[idx - 1] : null;
  const nextDomain = idx < cert.domains.length - 1 ? cert.domains[idx + 1] : null;
  const cloudClr = cloudColor[cert.cloud];

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
          <Link
            href={`/certifications/${cert.id}`}
            style={{ color: "#64748B", textDecoration: "none" }}
          >
            {cert.code}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>{domain.title}</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
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
              {cert.code}
            </span>
            <span style={{ fontSize: "12px", color: "#64748B" }}>
              Domain {domain.order} &middot; {domain.weight}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: "-0.5px",
              marginBottom: "14px",
            }}
          >
            {domain.title}
          </h1>

          <div style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.7 }}>
            <BodyText text={domain.summary} />
          </div>
        </div>

        {/* Key Concepts Callout */}
        {domain.keyConceptsForExam.length > 0 && (
          <div
            style={{
              backgroundColor: "rgba(74,222,128,0.06)",
              border: "1px solid rgba(74,222,128,0.25)",
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
              <Lightbulb size={16} color="#4ade80" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#4ade80" }}>
                Key Concepts for the Exam
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {domain.keyConceptsForExam.map((concept, i) => (
                <li key={i} style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.7 }}>
                  {renderInline(concept)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exam Tips Callout */}
        {domain.examTips.length > 0 && (
          <div
            style={{
              backgroundColor: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "32px",
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
              <Target size={16} color="#F59E0B" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F59E0B" }}>
                Exam Tips
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {domain.examTips.map((tip, i) => (
                <li key={i} style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.7 }}>
                  {renderInline(tip)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content Sections */}
        {domain.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: "36px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#F8FAFC",
                marginBottom: "14px",
                letterSpacing: "-0.2px",
              }}
            >
              {section.heading}
            </h2>
            <BodyText text={section.body} />
            {section.code && (
              <div style={{ marginTop: "16px" }}>
                <CodeBlock
                  snippet={section.code.snippet}
                  lang={section.code.lang}
                  label={section.code.label}
                />
              </div>
            )}
          </div>
        ))}

        {/* Deep Dive Related Topics */}
        {domain.relatedTopics.length > 0 && (
          <div
            style={{
              backgroundColor: "#1B2336",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "32px",
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
              <BookOpen size={16} color="#4ade80" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFC" }}>
                Deep Dive — Related Topics
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {domain.relatedTopics.map((topic, i) => (
                <Link
                  key={i}
                  href={`/learn/${topic.cloud}/${topic.topicId}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#4ade80",
                    textDecoration: "none",
                  }}
                >
                  <ArrowRight size={13} />
                  {topic.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Take Quiz CTA */}
        <div
          style={{
            backgroundColor: "#1B2336",
            border: "1px solid rgba(74,222,128,0.25)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#F8FAFC", marginBottom: "8px" }}>
            Ready to test your knowledge?
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "18px" }}>
            {domain.quiz.length} questions &middot; Score 70%+ to mark domain complete
          </p>
          <Link
            href={`/certifications/${cert.id}/${domain.id}/quiz`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 22px",
              borderRadius: "8px",
              backgroundColor: "#22C55E",
              color: "#0F172A",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Take Quiz
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Domain Nav */}
        <DomainNav
          certId={cert.id}
          prevDomain={prevDomain ? { id: prevDomain.id, title: prevDomain.title } : null}
          nextDomain={nextDomain ? { id: nextDomain.id, title: nextDomain.title } : null}
        />
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
