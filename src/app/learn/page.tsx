import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  BookOpen,
  Server,
  Database,
  Globe,
  Shield,
  Code2,
  TrendingUp,
  Clock,
  BarChart2,
  Lock,
} from "lucide-react";

const clouds = [
  {
    name: "AWS",
    color: "#FF9900",
    bg: "rgba(255,153,0,0.08)",
    border: "rgba(255,153,0,0.25)",
    desc: "Start from EC2 and S3, work your way to EKS, Lambda, and beyond.",
    modules: 14,
    labs: 22,
    level: "Beginner → Advanced",
  },
  {
    name: "GCP",
    color: "#4285F4",
    bg: "rgba(66,133,244,0.08)",
    border: "rgba(66,133,244,0.25)",
    desc: "Learn GCP's unique approach to compute, data, and machine learning.",
    modules: 11,
    labs: 18,
    level: "Beginner → Advanced",
  },
  {
    name: "Azure",
    color: "#0078D4",
    bg: "rgba(0,120,212,0.08)",
    border: "rgba(0,120,212,0.25)",
    desc: "Master Azure's services with deep Microsoft ecosystem integration.",
    modules: 12,
    labs: 19,
    level: "Beginner → Advanced",
  },
];

const categories = [
  { icon: Server, label: "Compute", count: 18, desc: "VMs, containers, and managed compute" },
  { icon: Database, label: "Storage & DB", count: 15, desc: "Object storage, SQL, NoSQL, caching" },
  { icon: Globe, label: "Networking", count: 12, desc: "VPCs, load balancers, CDN, DNS" },
  { icon: Shield, label: "IAM & Security", count: 14, desc: "Roles, policies, KMS, compliance" },
  { icon: Code2, label: "Serverless", count: 10, desc: "Functions, event-driven, queues" },
  { icon: TrendingUp, label: "Observability", count: 9, desc: "Logging, metrics, tracing, alerting" },
];

const recentTopics = [
  { title: "S3 vs GCS vs Azure Blob", cloud: "All", time: "8 min", level: "Beginner" },
  { title: "Kubernetes: EKS vs GKE vs AKS", cloud: "All", time: "15 min", level: "Intermediate" },
  { title: "IAM Roles deep dive — AWS", cloud: "AWS", time: "12 min", level: "Intermediate" },
  { title: "Cloud Run vs Lambda vs Azure Functions", cloud: "All", time: "10 min", level: "Beginner" },
  { title: "VPC peering and private networking", cloud: "All", time: "18 min", level: "Advanced" },
  { title: "BigQuery vs Redshift vs Synapse", cloud: "All", time: "14 min", level: "Intermediate" },
];

const levelColor: Record<string, string> = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

const cloudColor: Record<string, string> = {
  AWS: "#FF9900",
  GCP: "#4285F4",
  Azure: "#0078D4",
  All: "#22C55E",
};

export default function LearnPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <main>
        {/* Page Header */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "64px 24px 48px",
          }}
        >
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
            Learning Hub
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
            Choose your cloud, start learning
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "16px", maxWidth: "560px" }}>
            Structured paths for AWS, GCP, and Azure — from first concepts to production-ready skills.
          </p>
        </section>

        {/* Cloud Paths */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 64px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {clouds.map((cloud) => (
              <Link
                key={cloud.name}
                href={`/learn/${cloud.name.toLowerCase()}`}
                style={{
                  backgroundColor: cloud.bg,
                  border: `1px solid ${cloud.border}`,
                  borderRadius: "16px",
                  padding: "28px",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{ fontSize: "24px", fontWeight: 800, color: cloud.color, letterSpacing: "-0.5px" }}
                  >
                    {cloud.name}
                  </span>
                  <BookOpen size={18} color={cloud.color} />
                </div>

                <p style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.6 }}>{cloud.desc}</p>

                <div style={{ display: "flex", gap: "16px" }}>
                  {[
                    { val: cloud.modules, label: "Modules" },
                    { val: cloud.labs, label: "Labs" },
                  ].map(({ val, label }) => (
                    <div key={label}>
                      <div style={{ fontSize: "20px", fontWeight: 700, color: cloud.color }}>
                        {val}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: `1px solid ${cloud.border}`,
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#64748B" }}>{cloud.level}</span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: cloud.color,
                    }}
                  >
                    Start path <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        <section
          style={{
            borderTop: "1px solid #334155",
            borderBottom: "1px solid #334155",
            backgroundColor: "#1B2336",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 24px" }}>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#F8FAFC",
                marginBottom: "24px",
                letterSpacing: "-0.3px",
              }}
            >
              Browse by service category
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "12px",
              }}
            >
              {categories.map(({ icon: Icon, label, count, desc }) => (
                <Link
                  key={label}
                  href={`/learn?category=${label.toLowerCase().replace(" & ", "-")}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "18px 20px",
                    borderRadius: "12px",
                    border: "1px solid #334155",
                    backgroundColor: "#0F172A",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(34,197,94,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color="#22C55E" />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#F8FAFC" }}>{label}</span>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "1px 7px",
                          borderRadius: "999px",
                          backgroundColor: "rgba(34,197,94,0.1)",
                          color: "#22C55E",
                          fontWeight: 500,
                        }}
                      >
                        {count}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#64748B" }}>{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Topics */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 24px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.3px" }}>
              Popular topics
            </h2>
            <Link href="/learn?sort=popular" style={{ fontSize: "13px", color: "#22C55E", textDecoration: "none" }}>
              View all →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentTopics.map((topic) => (
              <Link
                key={topic.title}
                href={`/learn/${topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                  backgroundColor: "#1B2336",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <BookOpen size={16} color="#475569" />
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#E2E8F0" }}>
                    {topic.title}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      backgroundColor: `${cloudColor[topic.cloud]}15`,
                      color: cloudColor[topic.cloud],
                      border: `1px solid ${cloudColor[topic.cloud]}30`,
                    }}
                  >
                    {topic.cloud}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: levelColor[topic.level],
                    }}
                  >
                    {topic.level}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748B" }}>
                    <Clock size={12} />
                    {topic.time}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
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
