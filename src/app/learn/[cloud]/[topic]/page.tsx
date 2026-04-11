import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCloud, getTopic, cloudMap } from "@/lib/content";
import type { CloudName } from "@/lib/content";
import type { Metadata } from "next";
import { ChevronRight, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { MarkAsReadButton } from "@/components/MarkAsReadButton";
import { CodeBlock } from "@/components/CodeBlock";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cloud: string; topic: string }>;
}): Promise<Metadata> {
  const { cloud: cloudParam, topic: topicParam } = await params;
  const config = getCloud(cloudParam);
  if (!config) return {};
  const topic = getTopic(config, topicParam);
  if (!topic) return {};
  return {
    title: `${topic.title} (${config.displayName})`,
    description: topic.summary,
    openGraph: {
      title: `${topic.title} (${config.displayName}) — CloudCompass`,
      description: topic.summary,
    },
  };
}

export function generateStaticParams() {
  const params: { cloud: string; topic: string }[] = [];
  for (const cloud of Object.keys(cloudMap) as CloudName[]) {
    const config = cloudMap[cloud];
    for (const mod of config.modules) {
      for (const t of mod.topics) {
        params.push({ cloud, topic: t.id });
      }
    }
  }
  return params;
}

const levelColor: Record<string, string> = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

/** Render a string that may contain **bold** and `code` spans as React nodes */
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "#F8FAFC" }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} style={{ background: "#272F42", padding: "2px 6px", borderRadius: "4px", fontSize: "13px", color: "#4ade80", fontFamily: "var(--font-mono, monospace)" }}>
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
        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || /^\|/.test(trimmed);
        return (
          <p key={i} style={{ margin: 0, fontSize: "15px", color: "#CBD5E1", lineHeight: 1.8, paddingLeft: isBullet ? "4px" : "0" }}>
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ cloud: string; topic: string }>;
}) {
  const { cloud: cloudParam, topic: topicParam } = await params;
  const config = getCloud(cloudParam);
  if (!config) notFound();

  const topic = getTopic(config, topicParam);
  if (!topic) notFound();

  const allTopics = config.modules.flatMap((m) => m.topics);
  const idx = allTopics.findIndex((t) => t.id === topicParam);
  const prev = idx > 0 ? allTopics[idx - 1] : null;
  const next = idx < allTopics.length - 1 ? allTopics[idx + 1] : null;

  const equivalents = [
    topic.awsEquivalent && { cloud: "AWS", name: topic.awsEquivalent, color: "#FF9900", href: `/learn/aws` },
    topic.gcpEquivalent && { cloud: "GCP", name: topic.gcpEquivalent, color: "#4285F4", href: `/learn/gcp` },
    topic.azureEquivalent && { cloud: "Azure", name: topic.azureEquivalent, color: "#0078D4", href: `/learn/azure` },
  ].filter(Boolean).filter((e) => e && e.cloud.toLowerCase() !== cloudParam);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 24px 96px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B", marginBottom: "32px" }}>
          <Link href="/learn" style={{ color: "#64748B", textDecoration: "none" }}>Learn</Link>
          <ChevronRight size={14} />
          <Link href={`/learn/${cloudParam}`} style={{ color: "#64748B", textDecoration: "none" }}>{config.displayName}</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>{topic.title}</span>
        </nav>

        {/* Topic header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", backgroundColor: levelColor[topic.level] + "20", color: levelColor[topic.level] }}>
              {topic.level}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748B" }}>
              <Clock size={12} /> {topic.readTime}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px", backgroundColor: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
              {config.displayName}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: "14px", lineHeight: 1.2 }}>
            {topic.title}
          </h1>
          <p style={{ fontSize: "16px", color: "#94A3B8", lineHeight: 1.7 }}>{topic.summary}</p>
        </div>

        {/* Cross-cloud equivalents */}
        {equivalents.length > 0 && (
          <div style={{ backgroundColor: "#1B2336", border: "1px solid #334155", borderRadius: "10px", padding: "16px 20px", marginBottom: "40px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Equivalent service:</span>
            {equivalents.map((e) => e && (
              <Link key={e.cloud} href={e.href} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: e.color, padding: "4px 12px", borderRadius: "8px", backgroundColor: e.color + "12", border: `1px solid ${e.color}30`, textDecoration: "none" }}>
                {e.cloud}: {e.name}
              </Link>
            ))}
          </div>
        )}

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {topic.sections.map((section, i) => (
            <div key={i}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#F8FAFC", marginBottom: "14px", letterSpacing: "-0.2px" }}>
                {section.heading}
              </h2>
              <BodyText text={section.body} />
              {section.code && (
                <CodeBlock snippet={section.code.snippet} lang={section.code.lang} label={section.code.label} />
              )}
            </div>
          ))}
        </div>

        {/* Mark as read */}
        <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid #334155" }}>
          <MarkAsReadButton topicId={topic.id} />
        </div>

        {/* Prev / Next */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "24px" }}>
          {prev ? (
            <Link href={`/learn/${cloudParam}/${prev.id}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 18px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#1B2336", textDecoration: "none" }}>
              <ArrowLeft size={16} color="#94A3B8" />
              <div>
                <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "2px" }}>Previous</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>{prev.title}</div>
              </div>
            </Link>
          ) : <div />}
          {next && (
            <Link href={`/learn/${cloudParam}/${next.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", padding: "16px 18px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#1B2336", textDecoration: "none" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "2px" }}>Next</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>{next.title}</div>
              </div>
              <ArrowRight size={16} color="#94A3B8" />
            </Link>
          )}
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #334155", backgroundColor: "#1B2336", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ color: "#64748B", fontSize: "13px" }}>© 2025 CloudCompass. Built for engineers learning the cloud.</div>
      </footer>
    </div>
  );
}
