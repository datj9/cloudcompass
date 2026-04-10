import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCloud, cloudMap } from "@/lib/content";
import type { CloudName, Topic } from "@/lib/content";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { ProgressBanner } from "@/components/ProgressBanner";

export function generateStaticParams() {
  return (Object.keys(cloudMap) as CloudName[]).map((c) => ({ cloud: c }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cloud: string }>;
}): Promise<Metadata> {
  const { cloud } = await params;
  const config = getCloud(cloud);
  if (!config) return {};
  return {
    title: `Learn ${config.displayName}`,
    description: config.description,
    openGraph: {
      title: `Learn ${config.displayName} — CloudCompass`,
      description: config.description,
    },
  };
}

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

export default async function CloudPage({
  params,
}: {
  params: Promise<{ cloud: string }>;
}) {
  const { cloud: cloudParam } = await params;
  const config = getCloud(cloudParam);
  if (!config) notFound();

  const totalTopics = config.modules.reduce((s, m) => s + m.topics.length, 0);
  const allTopicIds = config.modules.flatMap((m) => m.topics.map((t) => t.id));

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <main>
        {/* Breadcrumb */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 24px 0" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B" }}>
            <Link href="/learn" style={{ color: "#64748B", textDecoration: "none" }}>
              Learn
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: "#94A3B8", fontWeight: 500 }}>{config.displayName}</span>
          </nav>
        </div>

        {/* Header */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "32px 24px 48px",
          }}
        >
          <div
            style={{
              backgroundColor: config.bg,
              border: `1px solid ${config.border}`,
              borderRadius: "20px",
              padding: "40px",
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: "1 1 400px" }}>
              <div style={{ fontSize: "36px", fontWeight: 800, color: config.color, letterSpacing: "-1px", marginBottom: "4px" }}>
                {config.displayName}
              </div>
              <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "16px" }}>
                {config.tagline}
              </div>
              <p style={{ fontSize: "15px", color: "#CBD5E1", lineHeight: 1.7, maxWidth: "520px", marginBottom: "24px" }}>
                {config.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {config.strengths.map((s) => (
                  <span
                    key={s}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      padding: "5px 12px",
                      borderRadius: "8px",
                      backgroundColor: "#0F172A",
                      border: "1px solid #334155",
                      color: "#94A3B8",
                    }}
                  >
                    <CheckCircle2 size={11} color={config.color} />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {[
                { val: config.modules.length, label: "Modules" },
                { val: totalTopics, label: "Topics" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  style={{
                    padding: "20px 28px",
                    borderRadius: "12px",
                    backgroundColor: "#0F172A",
                    border: `1px solid ${config.border}`,
                    textAlign: "center",
                    minWidth: "100px",
                  }}
                >
                  <div style={{ fontSize: "32px", fontWeight: 800, color: config.color }}>{val}</div>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Progress */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <ProgressBanner topicIds={allTopicIds} color={config.color} />
        </section>

        {/* Modules */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 96px" }}>
          {config.modules.map((mod, mi) => (
            <div key={mod.id} style={{ marginBottom: "40px" }}>
              {/* Module header */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "6px",
                      backgroundColor: `${config.color}20`,
                      border: `1px solid ${config.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: config.color,
                      flexShrink: 0,
                    }}
                  >
                    {mi + 1}
                  </span>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.2px" }}>
                    {mod.title}
                  </h2>
                </div>
                <p style={{ fontSize: "13px", color: "#64748B", marginLeft: "34px" }}>{mod.desc}</p>
              </div>

              {/* Topics grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "12px",
                  marginLeft: "0",
                }}
              >
                {mod.topics.map((topic: Topic) => (
                  <Link
                    key={topic.id}
                    href={`/learn/${cloudParam}/${topic.id}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      padding: "20px 22px",
                      borderRadius: "12px",
                      border: "1px solid #334155",
                      backgroundColor: "#1B2336",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#F8FAFC", lineHeight: 1.4 }}>
                        {topic.title}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: "999px",
                          backgroundColor: levelBg[topic.level],
                          color: levelColor[topic.level],
                          flexShrink: 0,
                        }}
                      >
                        {topic.level}
                      </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.6 }}>{topic.summary}</p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#64748B" }}>
                        <Clock size={11} />
                        {topic.readTime}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: config.color }}>
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #334155", backgroundColor: "#1B2336", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ color: "#64748B", fontSize: "13px" }}>© 2025 CloudCompass. Built for engineers learning the cloud.</div>
      </footer>
    </div>
  );
}
