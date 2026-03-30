import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getLab, labs } from "@/lib/content";
import { ChevronRight, Clock, CheckCircle2, AlertTriangle, Lightbulb, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return labs.map((l) => ({ labId: l.id }));
}

const levelColor: Record<string, string> = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

export default async function LabPage({
  params,
}: {
  params: Promise<{ labId: string }>;
}) {
  const { labId } = await params;
  const lab = getLab(labId);
  if (!lab) notFound();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 24px 96px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B", marginBottom: "32px" }}>
          <Link href="/practice" style={{ color: "#64748B", textDecoration: "none" }}>Practice</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>{lab.title}</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", backgroundColor: levelColor[lab.level] + "20", color: levelColor[lab.level] }}>
              {lab.level}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748B" }}>
              <Clock size={12} /> {lab.time}
            </span>
            {lab.free && (
              <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px", backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.2)" }}>
                Free
              </span>
            )}
          </div>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: "14px", lineHeight: 1.2 }}>
            {lab.title}
          </h1>
          <p style={{ fontSize: "16px", color: "#94A3B8", lineHeight: 1.7, marginBottom: "20px" }}>{lab.intro}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(lab.tags ?? []).map((tag) => (
              <span key={tag} style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "6px", backgroundColor: "#272F42", color: "#94A3B8", border: "1px solid #334155" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        <div style={{ backgroundColor: "#1B2336", border: "1px solid #334155", borderRadius: "12px", padding: "20px 24px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFC", marginBottom: "12px" }}>Prerequisites</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            {lab.prerequisites.map((p) => (
              <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", color: "#94A3B8" }}>
                <CheckCircle2 size={15} color="#22C55E" style={{ flexShrink: 0, marginTop: "2px" }} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginBottom: "48px" }}>
          {lab.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "16px" }}>
              {/* Step number */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#22C55E" }}>
                  {i + 1}
                </div>
                {i < lab.steps.length - 1 && (
                  <div style={{ width: "2px", height: "calc(100% - 32px)", backgroundColor: "#334155", margin: "4px auto 0", minHeight: "20px" }} />
                )}
              </div>

              {/* Step content */}
              <div style={{ flex: 1, paddingBottom: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#F8FAFC", marginBottom: "10px" }}>{step.title}</h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.7, marginBottom: step.code ? "16px" : "0", whiteSpace: "pre-line" }}>{step.body}</p>

                {step.code && (
                  <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #334155" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", backgroundColor: "#272F42", borderBottom: "1px solid #334155" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#94A3B8" }}>{step.code.label}</span>
                      <span style={{ fontSize: "11px", color: "#475569", fontFamily: "monospace" }}>{step.code.lang}</span>
                    </div>
                    <pre style={{ margin: 0, padding: "20px", backgroundColor: "#0D1526", overflowX: "auto", fontSize: "13px", lineHeight: 1.7, color: "#CBD5E1", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
                      <code>{step.code.snippet}</code>
                    </pre>
                  </div>
                )}

                {step.tip && (
                  <div style={{ marginTop: "12px", display: "flex", gap: "10px", padding: "12px 16px", borderRadius: "8px", backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
                    <Lightbulb size={15} color="#22C55E" style={{ flexShrink: 0, marginTop: "1px" }} />
                    <p style={{ margin: 0, fontSize: "13px", color: "#94A3B8", lineHeight: 1.6 }}>{step.tip}</p>
                  </div>
                )}

                {step.warning && (
                  <div style={{ marginTop: "12px", display: "flex", gap: "10px", padding: "12px 16px", borderRadius: "8px", backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
                    <AlertTriangle size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: "1px" }} />
                    <p style={{ margin: 0, fontSize: "13px", color: "#94A3B8", lineHeight: 1.6 }}>{step.warning}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cleanup */}
        {lab.cleanup && (
          <div style={{ backgroundColor: "#1B2336", border: "1px solid #334155", borderRadius: "12px", padding: "20px 24px", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#F8FAFC", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={15} color="#F59E0B" /> Cleanup
            </h2>
            <pre style={{ margin: 0, fontSize: "13px", color: "#94A3B8", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace" }}>
              {lab.cleanup}
            </pre>
          </div>
        )}

        {/* Next steps */}
        {lab.nextSteps && lab.nextSteps.length > 0 && (
          <div style={{ backgroundColor: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "20px 24px", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#F8FAFC", marginBottom: "12px" }}>What to try next</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {lab.nextSteps.map((s) => (
                <li key={s} style={{ display: "flex", gap: "8px", fontSize: "14px", color: "#94A3B8" }}>
                  <span style={{ color: "#22C55E", flexShrink: 0 }}>→</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/practice" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to all labs
        </Link>
      </div>

      <footer style={{ borderTop: "1px solid #334155", backgroundColor: "#1B2336", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ color: "#64748B", fontSize: "13px" }}>© 2025 CloudCompass. Built for engineers learning the cloud.</div>
      </footer>
    </div>
  );
}
