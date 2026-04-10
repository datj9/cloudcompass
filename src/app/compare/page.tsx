import Navbar from "@/components/Navbar";
import { CheckCircle2, MinusCircle, AlertCircle } from "lucide-react";

type Support = "yes" | "partial" | "no";

interface CompareRow {
  feature: string;
  category: string;
  aws: string;
  gcp: string;
  azure: string;
  awsSupport: Support;
  gcpSupport: Support;
  azureSupport: Support;
}

const compareData: CompareRow[] = [
  // Compute
  {
    feature: "Virtual Machines",
    category: "Compute",
    aws: "EC2",
    gcp: "Compute Engine",
    azure: "Azure VMs",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Managed Kubernetes",
    category: "Compute",
    aws: "EKS",
    gcp: "GKE",
    azure: "AKS",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Serverless Functions",
    category: "Compute",
    aws: "Lambda",
    gcp: "Cloud Functions",
    azure: "Azure Functions",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Container-as-a-Service",
    category: "Compute",
    aws: "ECS / Fargate",
    gcp: "Cloud Run",
    azure: "Container Apps",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  // Storage
  {
    feature: "Object Storage",
    category: "Storage",
    aws: "S3",
    gcp: "Cloud Storage",
    azure: "Blob Storage",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Managed Relational DB",
    category: "Storage",
    aws: "RDS / Aurora",
    gcp: "Cloud SQL / AlloyDB",
    azure: "Azure SQL / PostgreSQL",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "NoSQL / Document DB",
    category: "Storage",
    aws: "DynamoDB",
    gcp: "Firestore / Bigtable",
    azure: "CosmosDB",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Data Warehouse",
    category: "Storage",
    aws: "Redshift",
    gcp: "BigQuery",
    azure: "Synapse Analytics",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  // Networking
  {
    feature: "Virtual Private Cloud",
    category: "Networking",
    aws: "VPC",
    gcp: "VPC",
    azure: "VNet",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "CDN",
    category: "Networking",
    aws: "CloudFront",
    gcp: "Cloud CDN",
    azure: "Azure CDN / Front Door",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Global Load Balancer",
    category: "Networking",
    aws: "ALB / NLB / GLB",
    gcp: "Cloud Load Balancing",
    azure: "Application Gateway",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  // IAM
  {
    feature: "Identity & Access Mgmt",
    category: "IAM & Security",
    aws: "IAM",
    gcp: "Cloud IAM",
    azure: "Azure AD / Entra ID",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Secrets Management",
    category: "IAM & Security",
    aws: "Secrets Manager",
    gcp: "Secret Manager",
    azure: "Key Vault",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Key Management",
    category: "IAM & Security",
    aws: "KMS",
    gcp: "Cloud KMS",
    azure: "Azure Key Vault HSM",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  // Observability
  {
    feature: "Centralized Logging",
    category: "Observability",
    aws: "CloudWatch Logs",
    gcp: "Cloud Logging",
    azure: "Azure Monitor Logs",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Distributed Tracing",
    category: "Observability",
    aws: "X-Ray",
    gcp: "Cloud Trace",
    azure: "Application Insights",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  // AI/ML
  {
    feature: "Managed ML Platform",
    category: "AI / ML",
    aws: "SageMaker",
    gcp: "Vertex AI",
    azure: "Azure ML",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Generative AI API",
    category: "AI / ML",
    aws: "Bedrock",
    gcp: "Vertex AI Gemini",
    azure: "Azure OpenAI Service",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  // Messaging
  {
    feature: "Message Queue",
    category: "Messaging",
    aws: "SQS",
    gcp: "Pub/Sub",
    azure: "Service Bus Queues",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Pub/Sub Notifications",
    category: "Messaging",
    aws: "SNS",
    gcp: "Pub/Sub",
    azure: "Event Grid",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Event Streaming",
    category: "Messaging",
    aws: "Kinesis / MSK",
    gcp: "Pub/Sub + Dataflow",
    azure: "Event Hubs",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  // CI/CD
  {
    feature: "CI/CD Pipeline",
    category: "CI/CD",
    aws: "CodePipeline + CodeBuild",
    gcp: "Cloud Build",
    azure: "Azure Pipelines",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Container Registry",
    category: "CI/CD",
    aws: "ECR",
    gcp: "Artifact Registry",
    azure: "ACR",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Infrastructure as Code",
    category: "CI/CD",
    aws: "CloudFormation / CDK",
    gcp: "Deployment Manager / Terraform",
    azure: "Bicep / ARM Templates",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  // DNS & CDN
  {
    feature: "Managed DNS",
    category: "DNS & CDN",
    aws: "Route 53",
    gcp: "Cloud DNS",
    azure: "Azure DNS",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "CDN / Edge Delivery",
    category: "DNS & CDN",
    aws: "CloudFront",
    gcp: "Cloud CDN",
    azure: "Front Door / Azure CDN",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Edge Functions",
    category: "DNS & CDN",
    aws: "Lambda@Edge / CloudFront Functions",
    gcp: "Cloud CDN (no edge compute)",
    azure: "Front Door Rules Engine",
    awsSupport: "yes",
    gcpSupport: "no",
    azureSupport: "partial",
  },
  // Caching
  {
    feature: "Managed Redis",
    category: "Caching",
    aws: "ElastiCache for Redis",
    gcp: "Memorystore for Redis",
    azure: "Azure Cache for Redis",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "yes",
  },
  {
    feature: "Managed Memcached",
    category: "Caching",
    aws: "ElastiCache for Memcached",
    gcp: "Memorystore for Memcached",
    azure: "—",
    awsSupport: "yes",
    gcpSupport: "yes",
    azureSupport: "no",
  },
];

const supportIcon = (s: Support) => {
  if (s === "yes") return <CheckCircle2 size={16} color="#22C55E" />;
  if (s === "partial") return <AlertCircle size={16} color="#F59E0B" />;
  return <MinusCircle size={16} color="#475569" />;
};

const categories = [...new Set(compareData.map((r) => r.category))];

export default function ComparePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px 96px" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
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
            Service Comparison
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
            AWS vs GCP vs Azure
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "16px", maxWidth: "560px" }}>
            Find the equivalent service across all three clouds. Same concept, different names, different trade-offs.
          </p>
        </div>

        {/* Cloud Header Banner */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px repeat(3, 1fr)",
            gap: "0",
            marginBottom: "24px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #334155",
          }}
        >
          <div style={{ backgroundColor: "#1B2336", padding: "20px 24px" }}>
            <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 500 }}>Service / Feature</span>
          </div>
          {[
            { name: "AWS", color: "#FF9900", bg: "rgba(255,153,0,0.08)" },
            { name: "GCP", color: "#4285F4", bg: "rgba(66,133,244,0.08)" },
            { name: "Azure", color: "#0078D4", bg: "rgba(0,120,212,0.08)" },
          ].map((c) => (
            <div
              key={c.name}
              style={{
                backgroundColor: c.bg,
                padding: "20px 24px",
                borderLeft: "1px solid #334155",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: 800, color: c.color, letterSpacing: "-0.3px" }}>
                {c.name}
              </span>
            </div>
          ))}
        </div>

        {/* Table by Category */}
        {categories.map((cat) => {
          const rows = compareData.filter((r) => r.category === cat);
          return (
            <div key={cat} style={{ marginBottom: "32px" }}>
              {/* Category label */}
              <div
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#272F42",
                  borderRadius: "8px 8px 0 0",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#94A3B8",
                  border: "1px solid #334155",
                  borderBottom: "none",
                }}
              >
                {cat}
              </div>

              {/* Rows */}
              <div
                style={{
                  border: "1px solid #334155",
                  borderRadius: "0 0 12px 12px",
                  overflow: "hidden",
                }}
              >
                {rows.map((row, i) => (
                  <div
                    key={row.feature}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "280px repeat(3, 1fr)",
                      borderTop: i > 0 ? "1px solid #1E293B" : "none",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    {/* Feature name */}
                    <div
                      style={{
                        padding: "16px 24px",
                        backgroundColor: "#1B2336",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#E2E8F0" }}>
                        {row.feature}
                      </span>
                    </div>

                    {/* AWS */}
                    <div
                      style={{
                        padding: "16px 20px",
                        backgroundColor: "#0F172A",
                        borderLeft: "1px solid #334155",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {supportIcon(row.awsSupport)}
                      <span style={{ fontSize: "13px", color: "#CBD5E1" }}>{row.aws}</span>
                    </div>

                    {/* GCP */}
                    <div
                      style={{
                        padding: "16px 20px",
                        backgroundColor: "#0F172A",
                        borderLeft: "1px solid #334155",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {supportIcon(row.gcpSupport)}
                      <span style={{ fontSize: "13px", color: "#CBD5E1" }}>{row.gcp}</span>
                    </div>

                    {/* Azure */}
                    <div
                      style={{
                        padding: "16px 20px",
                        backgroundColor: "#0F172A",
                        borderLeft: "1px solid #334155",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {supportIcon(row.azureSupport)}
                      <span style={{ fontSize: "13px", color: "#CBD5E1" }}>{row.azure}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "16px 20px",
            backgroundColor: "#1B2336",
            borderRadius: "10px",
            border: "1px solid #334155",
            marginTop: "8px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Legend:</span>
          {[
            { icon: <CheckCircle2 size={14} color="#22C55E" />, label: "Available" },
            { icon: <AlertCircle size={14} color="#F59E0B" />, label: "Partial / Preview" },
            { icon: <MinusCircle size={14} color="#475569" />, label: "Not available" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#94A3B8" }}
            >
              {icon}
              {label}
            </span>
          ))}
        </div>
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
