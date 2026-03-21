import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  BookOpen,
  GitCompare,
  Zap,
  CheckCircle2,
  Code2,
  Server,
  Database,
  Shield,
  Globe,
  TrendingUp,
  Star,
} from "lucide-react";

const clouds = [
  {
    name: "AWS",
    fullName: "Amazon Web Services",
    color: "#FF9900",
    bg: "rgba(255,153,0,0.08)",
    border: "rgba(255,153,0,0.2)",
    desc: "The largest cloud provider. Deep ecosystem of 200+ services.",
    tags: ["EC2", "S3", "Lambda", "RDS", "EKS"],
    badge: "Market Leader",
  },
  {
    name: "GCP",
    fullName: "Google Cloud Platform",
    color: "#4285F4",
    bg: "rgba(66,133,244,0.08)",
    border: "rgba(66,133,244,0.2)",
    desc: "Built on Google's infrastructure. Best for data, ML & Kubernetes.",
    tags: ["GKE", "BigQuery", "Cloud Run", "Pub/Sub", "Vertex AI"],
    badge: "Best for AI/ML",
  },
  {
    name: "Azure",
    fullName: "Microsoft Azure",
    color: "#0078D4",
    bg: "rgba(0,120,212,0.08)",
    border: "rgba(0,120,212,0.2)",
    desc: "Enterprise-grade cloud tightly integrated with Microsoft stack.",
    tags: ["AKS", "Blob Storage", "Azure Functions", "CosmosDB", "AD"],
    badge: "Enterprise First",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Structured Learning Paths",
    desc: "Concept-first guides organized by service category — compute, storage, networking, IAM, and more.",
  },
  {
    icon: GitCompare,
    title: "Side-by-Side Comparisons",
    desc: "Compare equivalent services across all three clouds. Understand mental models, naming differences, and trade-offs.",
  },
  {
    icon: Code2,
    title: "CLI & SDK Examples",
    desc: "Real-world code snippets for AWS CLI, gcloud, az CLI, Terraform, and language SDKs.",
  },
  {
    icon: Zap,
    title: "Hands-On Practice",
    desc: "Guided labs and challenges to practice deploying, configuring, and securing cloud resources.",
  },
  {
    icon: Shield,
    title: "Security & IAM Deep Dives",
    desc: "Learn identity management, policy models, and security best practices for each cloud.",
  },
  {
    icon: TrendingUp,
    title: "Migration Guides",
    desc: "Step-by-step patterns for migrating workloads between clouds or from on-premises.",
  },
];

const categories = [
  { icon: Server, label: "Compute" },
  { icon: Database, label: "Storage & DB" },
  { icon: Globe, label: "Networking" },
  { icon: Shield, label: "IAM & Security" },
  { icon: Code2, label: "Serverless" },
  { icon: TrendingUp, label: "Observability" },
];

const stats = [
  { value: "200+", label: "Concepts covered" },
  { value: "3", label: "Cloud providers" },
  { value: "50+", label: "Hands-on labs" },
  { value: "Free", label: "Always free" },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <main>
        {/* Hero */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "96px 24px 80px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(34,197,94,0.3)",
              backgroundColor: "rgba(34,197,94,0.08)",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#22C55E",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#22C55E",
              }}
            >
              For Engineers, By Engineers
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "#F8FAFC",
              marginBottom: "24px",
              maxWidth: "900px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Navigate{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AWS
            </span>
            ,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4285F4 0%, #2563EB 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GCP
            </span>
            , and{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #0078D4 0%, #005FA3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Azure
            </span>{" "}
            with confidence
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#94A3B8",
              lineHeight: 1.7,
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}
          >
            The cloud learning platform built for engineers who need to work across
            all three major clouds — with structured guides, comparisons, and
            hands-on labs.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/learn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "10px",
                backgroundColor: "#22C55E",
                color: "#0F172A",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Start Learning
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/compare"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "10px",
                border: "1px solid #475569",
                color: "#F8FAFC",
                fontSize: "15px",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Compare Clouds
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginTop: "40px",
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <span style={{ marginLeft: "4px" }}>Used by 2,400+ engineers worldwide</span>
          </div>
        </section>

        {/* Stats Bar */}
        <section
          style={{
            borderTop: "1px solid #334155",
            borderBottom: "1px solid #334155",
            backgroundColor: "#1B2336",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "32px 24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "24px",
              textAlign: "center",
            }}
          >
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#22C55E",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cloud Cards */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
              Three Clouds, One Platform
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: "#F8FAFC",
              }}
            >
              Learn each cloud from the ground up
            </h2>
          </div>

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
                  display: "block",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "26px",
                      fontWeight: 800,
                      color: cloud.color,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {cloud.name}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "999px",
                      backgroundColor: `${cloud.color}20`,
                      color: cloud.color,
                      border: `1px solid ${cloud.color}30`,
                    }}
                  >
                    {cloud.badge}
                  </span>
                </div>

                <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "6px", fontWeight: 500 }}>
                  {cloud.fullName}
                </p>
                <p style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.6, marginBottom: "20px" }}>
                  {cloud.desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {cloud.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        backgroundColor: "#272F42",
                        color: "#94A3B8",
                        border: "1px solid #334155",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: cloud.color,
                  }}
                >
                  Explore {cloud.name}
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          style={{
            backgroundColor: "#1B2336",
            borderTop: "1px solid #334155",
            borderBottom: "1px solid #334155",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
                Everything You Need
              </p>
              <h2
                style={{
                  fontSize: "clamp(26px, 4vw, 38px)",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  color: "#F8FAFC",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                From zero to cloud-ready in one place
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    backgroundColor: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(34,197,94,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Icon size={20} color="#22C55E" />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#F8FAFC", marginBottom: "8px" }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Category */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.3px" }}>
              Browse by category
            </h2>
            <p style={{ color: "#94A3B8", marginTop: "12px", fontSize: "15px" }}>
              Explore concepts organized by cloud service domain
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
            }}
          >
            {categories.map(({ icon: Icon, label }) => (
              <Link
                key={label}
                href={`/learn?category=${label.toLowerCase().replace(" & ", "-")}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  padding: "24px 16px",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                  backgroundColor: "#1B2336",
                  textDecoration: "none",
                  color: "#94A3B8",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <Icon size={24} color="#22C55E" />
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ maxWidth: "1280px", margin: "0 auto 96px", padding: "0 24px" }}>
          <div
            style={{
              borderRadius: "20px",
              border: "1px solid rgba(34,197,94,0.2)",
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(66,133,244,0.06) 50%, rgba(255,153,0,0.06) 100%)",
              padding: "64px 48px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 40px)",
                fontWeight: 700,
                color: "#F8FAFC",
                letterSpacing: "-0.5px",
                marginBottom: "16px",
              }}
            >
              Ready to master all three clouds?
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "16px", maxWidth: "480px", margin: "0 auto 28px" }}>
              Join thousands of engineers who use CloudCompass to stay sharp across AWS, GCP, and Azure.
            </p>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
              {["Free forever", "No account needed", "Updated regularly"].map((item) => (
                <span
                  key={item}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#94A3B8",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    backgroundColor: "#1B2336",
                    border: "1px solid #334155",
                  }}
                >
                  <CheckCircle2 size={13} color="#22C55E" />
                  {item}
                </span>
              ))}
            </div>

            <Link
              href="/learn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 32px",
                borderRadius: "10px",
                backgroundColor: "#22C55E",
                color: "#0F172A",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Get Started — It&apos;s Free
              <ArrowRight size={16} />
            </Link>
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
        <div style={{ maxWidth: "1280px", margin: "0 auto", color: "#64748B", fontSize: "13px" }}>
          © 2025 CloudCompass. Built for engineers learning the cloud.
        </div>
      </footer>
    </div>
  );
}
