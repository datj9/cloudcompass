import type { Certification } from "./types";

export const gcpPca: Certification = {
  id: "gcp-pca",
  title: "Google Cloud Professional Cloud Architect",
  code: "PCA",
  cloud: "gcp",
  level: "Professional",
  description:
    "Demonstrate ability to design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions on Google Cloud.",
  examFormat: {
    questions: 50,
    duration: "120 minutes",
    passingScore: "~70%",
    cost: "$200 USD",
  },
  domains: [
    // ─── Domain 1: Designing and Planning a Cloud Solution Architecture (24%) ───────────────
    {
      id: "domain-1",
      title: "Designing and Planning a Cloud Solution Architecture",
      weight: "24%",
      order: 1,
      summary:
        "The largest domain tests your ability to design end-to-end Google Cloud architectures that meet business and technical requirements. Topics include selecting appropriate compute, storage, networking, and data services, as well as designing for scalability, availability, and cost efficiency.\n\nExpect case study-based questions where you must select the correct GCP services for a given scenario. You must understand the GCP resource hierarchy (organization, folders, projects), and how to design multi-tier applications using GKE, Cloud Run, App Engine, and Compute Engine.",
      keyConceptsForExam: [
        "**GCP Resource Hierarchy** — Organization → Folders → Projects → Resources; IAM policies inherit downward",
        "**Compute options** — Compute Engine (IaaS), GKE (managed Kubernetes), Cloud Run (serverless containers), App Engine (PaaS), Cloud Functions (FaaS)",
        "**Storage options** — Cloud Storage (object), Persistent Disk (block), Filestore (NFS), Cloud SQL (relational), Cloud Spanner (globally distributed RDBMS), BigQuery (analytics)",
        "**Networking** — VPC networks, subnets (regional), Cloud Load Balancing (global/regional), Cloud CDN, Cloud Armor",
        "**High availability** — regional vs. zonal resources, managed instance groups, multi-region Cloud Storage, Cloud Spanner multi-region configs",
      ],
      examTips: [
        "Cloud Spanner is the go-to answer for globally distributed, strongly consistent relational databases — know its use cases vs. Cloud SQL.",
        "Preemptible/Spot VMs are suitable for batch workloads and can reduce cost significantly — but they can be terminated with 30-second notice.",
        "For the exam case studies (Dress4Win, Mountkirk Games, TerramEarth), know the business and technical requirements and map them to specific GCP services.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "gke-basics", title: "GKE — Google Kubernetes Engine" },
        { cloud: "gcp", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
      ],
      sections: [
        {
          heading: "Selecting the Right Compute Platform",
          body: "GCP offers a spectrum of compute services. **Compute Engine** provides full VM control — choose this for lift-and-shift, custom OS requirements, or GPU workloads. **GKE** is ideal for containerized microservices needing autoscaling and service mesh. **Cloud Run** runs containers serverlessly with automatic scaling to zero — best for HTTP-serving containers with variable traffic.\n\n**App Engine Standard** runs in a sandboxed environment with automatic scaling; Standard supports Python, Java, Go, Node.js, PHP, Ruby. **App Engine Flexible** runs custom containers in a managed VM environment. **Cloud Functions** is best for event-driven, short-lived, single-purpose functions.\n\nThe Architect exam tests whether you can match business requirements to the right compute tier based on operational overhead, cost, and technical constraints.",
        },
        {
          heading: "Storage and Database Selection",
          body: "Choosing the right storage service is a core architect skill. Decision framework:\n\n- **Cloud Storage**: Unstructured data, blobs, static web assets, backups. Use multi-regional for global availability.\n- **Cloud SQL**: Managed MySQL, PostgreSQL, SQL Server. Use for existing relational workloads needing managed service.\n- **Cloud Spanner**: Globally distributed, strongly consistent relational. Choose when Cloud SQL read replicas don't meet scale or global consistency needs.\n- **Firestore**: NoSQL document database for web/mobile apps needing real-time sync.\n- **Bigtable**: Wide-column NoSQL for time-series, IoT, and analytics at petabyte scale.\n- **BigQuery**: Serverless analytics data warehouse — not for OLTP workloads.",
        },
      ],
      quiz: [
        {
          id: "pca-d1-q1",
          question:
            "A financial services company needs a globally distributed relational database that guarantees external consistency (strong consistency across regions) for transaction processing. Which GCP service should they use?",
          options: [
            "A) Cloud SQL with read replicas in multiple regions.",
            "B) Cloud Spanner with a multi-region configuration.",
            "C) Firestore in Datastore mode with global replication.",
            "D) AlloyDB with cross-region replication.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Spanner is Google's globally distributed, externally consistent relational database. Multi-region configurations provide 99.999% availability SLA with strong consistency across regions. Cloud SQL (A) uses asynchronous replication to read replicas — it cannot guarantee strong consistency across regions. Firestore (C) is a NoSQL document database, unsuitable for complex relational transactions.",
        },
        {
          id: "pca-d1-q2",
          question:
            "A media company processes video uploads. The processing job is fault-tolerant, can be re-run, and needs to minimize compute cost. Which Compute Engine option is MOST appropriate?",
          options: [
            "A) Custom machine types with committed use discounts.",
            "B) Spot VMs (preemptible instances).",
            "C) Sole-tenant nodes.",
            "D) Shielded VMs.",
          ],
          correctIndex: 1,
          explanation:
            "Spot VMs (formerly preemptible VMs) offer up to 90% discount compared to standard on-demand pricing. They're ideal for fault-tolerant batch processing jobs that can be checkpointed and restarted. Committed use discounts (A) apply to sustained workloads, not savings for interruptible jobs. Sole-tenant nodes (C) are for compliance/licensing requirements. Shielded VMs (D) are for security hardening.",
        },
        {
          id: "pca-d1-q3",
          question:
            "A company wants to migrate a monolithic Java application to Google Cloud with minimal code changes and no infrastructure management. The application serves HTTP traffic. Which service best fits?",
          options: [
            "A) Compute Engine with a startup script to launch the JAR.",
            "B) App Engine Flexible environment with a custom Java runtime.",
            "C) Cloud Run with a containerized version of the application.",
            "D) GKE Autopilot with a Kubernetes Deployment.",
          ],
          correctIndex: 2,
          explanation:
            "Cloud Run provides a fully managed serverless environment for containerized applications with zero infrastructure management. Containerizing the Java app with Docker requires minimal code changes. Cloud Run handles scaling, TLS, and load balancing. App Engine Flexible (B) also works but has more infrastructure involvement. GKE Autopilot (D) requires Kubernetes knowledge and YAML manifests.",
        },
        {
          id: "pca-d1-q4",
          question:
            "A team needs to store user-generated images globally with low latency for users worldwide and high durability. Which Cloud Storage configuration should they use?",
          options: [
            "A) Standard storage class in a single region.",
            "B) Multi-Regional storage class (now Geo-redundant) in a multi-region location.",
            "C) Nearline storage class in multiple regions.",
            "D) Standard storage class with cross-region replication configured.",
          ],
          correctIndex: 1,
          explanation:
            "Multi-Regional (now called Standard with a multi-region location like `us`, `eu`, or `asia`) Cloud Storage stores data across multiple geographic locations within the region, providing high availability, 99.999999999% (11 nines) durability, and low-latency global access via Cloud CDN integration. Nearline (C) is for infrequently accessed data with retrieval costs.",
        },
        {
          id: "pca-d1-q5",
          question:
            "An application uses a Cloud SQL instance. Read traffic is causing high load on the primary. What is the recommended GCP solution to scale read capacity?",
          options: [
            "A) Upgrade to a larger Cloud SQL machine type.",
            "B) Add read replicas and configure the application to direct read queries to replica endpoints.",
            "C) Migrate to Cloud Spanner for automatic read scaling.",
            "D) Use Memorystore (Redis) as a read-through cache.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud SQL read replicas provide additional read capacity by replicating data asynchronously. Applications direct read queries to replica connection strings and write queries to the primary. Memorystore (D) reduces database load via caching but doesn't provide full SQL read capabilities for complex queries. Both B and D are valid approaches, but read replicas are the primary SQL scaling mechanism.",
        },
        {
          id: "pca-d1-q6",
          question:
            "A company's GCP organization has multiple departments, each requiring separate billing, access controls, and resource quotas. What is the recommended GCP resource hierarchy?",
          options: [
            "A) One project per department, all under the root organization.",
            "B) One folder per department under the organization, with projects inside each folder.",
            "C) One organization per department.",
            "D) All departments share a single project with IAM roles distinguishing access.",
          ],
          correctIndex: 1,
          explanation:
            "GCP folders provide a grouping layer between the organization and projects. Creating one folder per department enables department-level IAM policies, billing export, and organizational policy constraints. Projects under each folder inherit folder-level policies. Multiple organizations (C) would prevent centralized billing and policy management. Sharing a single project (D) makes cost attribution and access control complex.",
        },
        {
          id: "pca-d1-q7",
          question:
            "A company needs an analytics solution that can query petabytes of data without managing server infrastructure. The data is stored in Cloud Storage in Parquet format. Which service is MOST appropriate?",
          options: [
            "A) Cloud SQL with external data access.",
            "B) BigQuery with external tables over Cloud Storage.",
            "C) Dataproc with Spark SQL.",
            "D) Cloud Bigtable with analytics reads.",
          ],
          correctIndex: 1,
          explanation:
            "BigQuery is Google's serverless analytics data warehouse. External tables allow BigQuery to query Parquet files in Cloud Storage directly without importing data. BigQuery handles petabyte-scale queries automatically with no infrastructure management. Dataproc (C) is managed Spark/Hadoop but requires cluster management. Bigtable (D) is for NoSQL key-value access, not ad-hoc SQL analytics.",
        },
        {
          id: "pca-d1-q8",
          question:
            "A web application experiences traffic spikes during business hours and near-zero traffic overnight. Which architecture minimizes cost while handling peak traffic?",
          options: [
            "A) Large Compute Engine instance running 24/7.",
            "B) Cloud Run with automatic scaling, scaling to zero during low-traffic periods.",
            "C) GKE cluster with Cluster Autoscaler.",
            "D) App Engine Standard with manual scaling.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Run automatically scales to zero when there's no traffic, meaning no compute charges during overnight periods. It scales up instantly when traffic arrives. GKE with Cluster Autoscaler (C) scales nodes but typically doesn't scale to zero (there's a minimum node pool). App Engine Standard (D) also supports scale to zero but Cloud Run offers more flexibility for containerized apps.",
        },
        {
          id: "pca-d1-q9",
          question:
            "A company is designing a new application and wants to avoid vendor lock-in for their container orchestration layer. Which GCP service provides portability across cloud providers?",
          options: [
            "A) App Engine Flexible.",
            "B) Google Kubernetes Engine (GKE).",
            "C) Cloud Run.",
            "D) Anthos.",
          ],
          correctIndex: 3,
          explanation:
            "Anthos is Google's hybrid and multi-cloud platform built on Kubernetes. It allows running GKE clusters on-premises, on other clouds (AWS, Azure), and on GCP under a single management plane. This provides the highest portability — the same Kubernetes workloads run across environments. Standard GKE (B) runs only on GCP. Cloud Run (C) is GCP-specific.",
        },
        {
          id: "pca-d1-q10",
          question:
            "An architect needs to choose between Cloud Pub/Sub and Cloud Tasks for an async workflow where each message must be processed exactly once by a specific worker. Which should they choose?",
          options: [
            "A) Cloud Pub/Sub — it guarantees at-least-once delivery and exactly-once processing with deduplication.",
            "B) Cloud Tasks — it supports targeted, at-least-once task delivery with explicit routing to specific handlers.",
            "C) Cloud Pub/Sub with message ordering enabled.",
            "D) Cloud Dataflow for exactly-once streaming processing.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Tasks is designed for task queues with explicit routing — you specify the target handler (Cloud Run, App Engine, HTTP endpoint) for each task. It supports rate limiting, scheduling, and deduplication. Pub/Sub is a fan-out messaging system for topic-based subscriptions, not for routing specific tasks to specific workers. Cloud Tasks is the correct choice for job queues and explicit work distribution.",
        },
      ],
    },

    // ─── Domain 2: Managing and Provisioning Solution Infrastructure (15%) ───────────────
    {
      id: "domain-2",
      title: "Managing and Provisioning Solution Infrastructure",
      weight: "15%",
      order: 2,
      summary:
        "This domain covers deploying and managing GCP infrastructure using IaC tools and GCP-native deployment services. Topics include Cloud Deployment Manager, Terraform on GCP, Config Connector, and Cloud Build for infrastructure pipelines.\n\nExpect questions on configuring managed instance groups, autoscaling policies, and health checks. You must understand how to use organizational policies to enforce governance and how to configure VPC Service Controls for data perimeter enforcement.",
      keyConceptsForExam: [
        "**Terraform on GCP** — provider configuration, state backends (GCS), workspaces, Terraform Cloud integration",
        "**Config Connector** — Kubernetes operator that manages GCP resources as Kubernetes custom resources",
        "**Managed Instance Groups (MIGs)** — zonal vs. regional, autoscaling (CPU, LB capacity, custom metrics), rolling updates, stateful MIGs",
        "**Organizational Policies** — boolean constraints, list constraints, inheritance, resource tags for conditional policies",
        "**VPC Service Controls** — service perimeters around GCP APIs, access levels, ingress/egress rules",
      ],
      examTips: [
        "Regional MIGs distribute instances across multiple zones automatically — use them for zone-level resilience without manual configuration.",
        "VPC Service Controls create API perimeters around sensitive GCP services (BigQuery, Cloud Storage, KMS) to prevent data exfiltration.",
        "Organizational Policy constraints can be enforced at any level of the hierarchy and override project-level settings when set on folders/org.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
        { cloud: "gcp", topicId: "iam-overview", title: "IAM — Identity and Access Management" },
      ],
      sections: [
        {
          heading: "Infrastructure as Code on GCP",
          body: "**Terraform** is the most common IaC tool for GCP. The GCP provider manages resources across all GCP services. Store Terraform state in a Cloud Storage bucket for team collaboration and consistency.\n\n**Cloud Deployment Manager** is GCP's native IaC service using YAML/Jinja2 templates. It's simpler for GCP-only deployments but less feature-rich than Terraform.\n\n**Config Connector** allows managing GCP resources using Kubernetes manifests — useful for teams already using Kubernetes tooling. Resources are represented as Kubernetes Custom Resources and managed by the Kubernetes control plane.",
          code: {
            lang: "hcl",
            label: "Terraform GCS remote state backend",
            snippet: `terraform {
  backend "gcs" {
    bucket  = "my-company-tf-state"
    prefix  = "prod/network"
  }
}

provider "google" {
  project = var.project_id
  region  = "us-central1"
}`,
          },
        },
        {
          heading: "Managed Instance Groups and Autoscaling",
          body: "**Managed Instance Groups (MIGs)** manage identical VM instances using an instance template. Features include autoscaling, autohealing (replace unhealthy instances), and rolling updates.\n\n**Regional MIGs** distribute instances across all zones in a region, providing zone-level resilience. The autoscaler supports target CPU utilization, load balancer target utilization, and custom Cloud Monitoring metrics.\n\n**Autohealing** uses health checks to detect unhealthy instances and replace them automatically. Configure a health check path and initial delay (grace period) to avoid replacing instances that are still starting up.",
        },
      ],
      quiz: [
        {
          id: "pca-d2-q1",
          question:
            "A company needs to enforce that no Compute Engine VMs are created with public IP addresses across all projects in the organization. What is the recommended approach?",
          options: [
            "A) IAM deny policies on the compute.instances.create permission.",
            "B) Organizational Policy constraint `compute.vmExternalIpAccess` set to deny external IPs.",
            "C) VPC firewall rules blocking ingress to all VMs.",
            "D) Cloud Armor policy blocking external IP assignment.",
          ],
          correctIndex: 1,
          explanation:
            "The `compute.vmExternalIpAccess` Organizational Policy constraint can be set to deny (empty allowed values list) at the organization level, preventing any project from creating VMs with external IP addresses. This is a preventive control enforced by GCP, not a network-level block. IAM (A) controls who can create VMs but not the configuration of the VMs. Firewall rules (C) block traffic but don't prevent external IP assignment.",
        },
        {
          id: "pca-d2-q2",
          question:
            "A company's Compute Engine instances in a MIG are being terminated before application health checks are passing, causing rolling update failures. What should be adjusted?",
          options: [
            "A) Increase the maximum surge during rolling updates.",
            "B) Configure the autohealer with an initial delay that allows time for the application to start.",
            "C) Disable autohealing during rolling updates.",
            "D) Use a zonal MIG instead of a regional MIG.",
          ],
          correctIndex: 1,
          explanation:
            "The autohealer's initial delay (initial health check delay) prevents the autohealer from checking instance health during startup — it gives the instance time to boot, start the application, and reach a healthy state before health checks begin. Setting an appropriate initial delay (e.g., 300 seconds for a slow-starting app) prevents premature termination during rolling updates.",
        },
        {
          id: "pca-d2-q3",
          question:
            "A security team wants to prevent data exfiltration from BigQuery to external Cloud Storage buckets outside the organization. Which GCP feature achieves this?",
          options: [
            "A) BigQuery IAM policies restricting data exports.",
            "B) VPC Service Controls with a service perimeter around BigQuery and Cloud Storage.",
            "C) Organizational Policy denying storage.buckets.create outside the org.",
            "D) Cloud Armor WAF rules on the BigQuery API endpoint.",
          ],
          correctIndex: 1,
          explanation:
            "VPC Service Controls create a security perimeter around GCP APIs. With BigQuery and Cloud Storage inside the perimeter, data movement between them is only allowed within the perimeter (same organization). Data cannot be exported to Cloud Storage buckets outside the perimeter, preventing exfiltration. IAM policies (A) control who can export, not where data can go.",
        },
        {
          id: "pca-d2-q4",
          question:
            "A team uses Terraform to manage GCP resources. Multiple engineers work on the same infrastructure. What is the MOST important Terraform best practice for team collaboration?",
          options: [
            "A) Each engineer uses a local state file.",
            "B) Use a Cloud Storage bucket as the Terraform remote backend with state locking.",
            "C) Use separate Terraform workspaces for each engineer.",
            "D) Run Terraform only from a dedicated CI/CD pipeline.",
          ],
          correctIndex: 1,
          explanation:
            "A remote backend in Cloud Storage with state locking (using Cloud Storage object locking or Terraform Cloud) prevents concurrent state modifications that cause state corruption. Multiple engineers using local state files (A) would each have a different view of infrastructure, causing conflicts and drift. The remote backend with locking is the foundational team collaboration requirement for Terraform.",
        },
        {
          id: "pca-d2-q5",
          question:
            "A regional MIG in us-central1 has 6 instances. One zone becomes unavailable. How does the regional MIG respond?",
          options: [
            "A) All instances in the failed zone are replaced with instances in the remaining zones.",
            "B) The MIG marks all instances as unhealthy and waits for the zone to recover.",
            "C) The regional MIG automatically redistributes the target instance count across the remaining zones.",
            "D) The MIG scales down to the number of healthy instances.",
          ],
          correctIndex: 2,
          explanation:
            "Regional MIGs automatically rebalance instances across available zones when a zone becomes unavailable. The MIG maintains the target instance count by redistributing instances to the remaining healthy zones. This is the primary advantage of regional MIGs over zonal MIGs — automatic zone-level fault tolerance without manual intervention.",
        },
        {
          id: "pca-d2-q6",
          question:
            "A company wants to enforce that all Cloud Storage buckets in their organization have uniform bucket-level access enabled (disabling ACLs). What GCP feature enforces this?",
          options: [
            "A) Cloud Audit Logs monitoring with Lambda remediation.",
            "B) Organizational Policy constraint `storage.uniformBucketLevelAccess`.",
            "C) IAM conditions on storage.buckets.create.",
            "D) Cloud Asset Inventory with automated remediation.",
          ],
          correctIndex: 1,
          explanation:
            "The `storage.uniformBucketLevelAccess` Organizational Policy constraint, when enabled, requires all new and existing buckets in scope to use uniform bucket-level access (IAM-only access, no ACLs). Setting this at the organization level prevents any project from creating buckets with ACL-based access. This is the enforcement mechanism for the recommended Cloud Storage security posture.",
        },
        {
          id: "pca-d2-q7",
          question:
            "A Cloud Build pipeline deploys infrastructure using Terraform. The pipeline needs to create GCP resources in a production project. What identity should the Cloud Build service account use?",
          options: [
            "A) The default Compute Engine service account in the build project.",
            "B) A dedicated service account with the minimum IAM roles needed to create the required resources in the target project.",
            "C) The project owner service account in the production project.",
            "D) A user account with owner permissions.",
          ],
          correctIndex: 1,
          explanation:
            "Following the principle of least privilege, the Cloud Build service account should have only the IAM roles required for the specific resources it manages. In cross-project deployments, grant the service account the necessary roles in the target project (e.g., Compute Admin, Storage Admin). Project owner (C) grants excessive permissions. Default compute SA (A) is not designed for CI/CD automation.",
        },
        {
          id: "pca-d2-q8",
          question:
            "An organization wants to manage GCP resources using familiar Kubernetes-style YAML configuration files. Which GCP service enables this?",
          options: [
            "A) Anthos Config Management",
            "B) Config Connector",
            "C) Cloud Deployment Manager",
            "D) GKE Config Sync",
          ],
          correctIndex: 1,
          explanation:
            "Config Connector is a Kubernetes add-on that manages GCP resources as Kubernetes Custom Resource Definitions. Teams can create and manage Cloud Storage buckets, Cloud SQL instances, Pub/Sub topics, etc., using `kubectl apply` with YAML manifests. This is ideal for teams already using Kubernetes tooling. Anthos Config Management (A) handles Kubernetes configuration sync across clusters, not GCP resource provisioning.",
        },
        {
          id: "pca-d2-q9",
          question:
            "A company needs to perform a zero-downtime rolling update to a MIG. The new instance template has been verified in staging. What rolling update strategy should they use to replace 20% of instances at a time?",
          options: [
            "A) Canary update with 20% of instances on the new template.",
            "B) Rolling update with `maxSurge=0` and `maxUnavailable=20%`.",
            "C) Rolling update with `maxSurge=20%` and `maxUnavailable=0`.",
            "D) Recreate update policy.",
          ],
          correctIndex: 2,
          explanation:
            "For zero-downtime rolling updates, set `maxUnavailable=0` (no instances removed before new ones are ready) and `maxSurge=20%` (launch new instances before removing old ones). This ensures capacity is never reduced during the update. `maxUnavailable=20%` (B) would reduce capacity by 20% during the update, potentially causing degraded performance. Recreate (D) terminates all instances before creating new ones — causes downtime.",
        },
        {
          id: "pca-d2-q10",
          question:
            "A company uses Cloud Asset Inventory to monitor GCP resources. They want to be notified whenever a Compute Engine firewall rule is modified. What combination achieves this?",
          options: [
            "A) Cloud Monitoring alert on firewall metrics.",
            "B) Cloud Asset Inventory real-time feed exported to Pub/Sub, with a Cloud Function subscribing to notify on firewall changes.",
            "C) Cloud Audit Logs with a log sink to an SNS topic.",
            "D) VPC Flow Logs monitoring for configuration changes.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Asset Inventory real-time feeds publish resource change notifications to Pub/Sub whenever specified resources are created, updated, or deleted. A Cloud Function subscribed to the Pub/Sub topic can filter for firewall rule changes and send notifications. Cloud Audit Logs (C) also captures firewall changes but GCP doesn't have SNS — it would export to Cloud Logging → Pub/Sub → Cloud Functions for notification.",
        },
      ],
    },

    // ─── Domain 3: Designing for Security and Compliance (18%) ───────────────
    {
      id: "domain-3",
      title: "Designing for Security and Compliance",
      weight: "18%",
      order: 3,
      summary:
        "This domain covers implementing GCP security controls including IAM, service accounts, VPC security, data encryption, and compliance frameworks. Topics include Secret Manager, Cloud KMS, Binary Authorization, and security monitoring with Security Command Center.\n\nExpect questions on service account best practices, Workload Identity Federation, VPC Service Controls for data perimeters, and using Cloud Armor for application layer protection.",
      keyConceptsForExam: [
        "**Service accounts** — least-privilege service account per workload, Workload Identity for GKE, service account impersonation",
        "**Cloud KMS** — customer-managed encryption keys, key rings, key rotation, CMEK for GCP services",
        "**Secret Manager** — versioned secrets, rotation notifications, fine-grained IAM access (secretAccessor role)",
        "**Binary Authorization** — deploy-time security policy for container images in GKE; requires attestors and attestations",
        "**Security Command Center (SCC)** — threat detection, vulnerability findings, security posture management across GCP",
      ],
      examTips: [
        "Workload Identity is the recommended way to access GCP APIs from GKE — it eliminates the need for service account key files.",
        "Binary Authorization can block deployment of unsigned container images — use it with Cloud Build attestors for a secure supply chain.",
        "CMEK (Customer-Managed Encryption Keys) gives you control over encryption keys — you can revoke access to encrypted data by disabling the key.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "iam-overview", title: "IAM — Identity and Access Management" },
        { cloud: "gcp", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
      ],
      sections: [
        {
          heading: "Service Account Security",
          body: "Service accounts are identities for GCP resources (VMs, Cloud Functions, GKE pods). **Best practices**:\n\n1. **One service account per workload** — never share service accounts between applications.\n2. **Workload Identity for GKE** — maps Kubernetes service accounts to GCP service accounts, eliminating key file management.\n3. **Avoid downloadable keys** — service account keys are long-lived credentials and a security risk. Prefer instance metadata credentials or Workload Identity.\n4. **Grant at the resource level** — bind service accounts to specific resources (buckets, tables) rather than projects where possible.\n\n**Service account impersonation** allows one service account to act as another, enabling controlled delegation without sharing keys.",
          code: {
            lang: "bash",
            label: "Configure Workload Identity for GKE",
            snippet: `# Create a GCP service account
gcloud iam service-accounts create my-app-sa \\
  --project=my-project

# Grant GCS access to the service account
gcloud projects add-iam-policy-binding my-project \\
  --member="serviceAccount:my-app-sa@my-project.iam.gserviceaccount.com" \\
  --role="roles/storage.objectViewer"

# Allow the Kubernetes service account to impersonate the GCP service account
gcloud iam service-accounts add-iam-policy-binding \\
  my-app-sa@my-project.iam.gserviceaccount.com \\
  --role=roles/iam.workloadIdentityUser \\
  --member="serviceAccount:my-project.svc.id.goog[my-namespace/my-ksa]"`,
          },
        },
        {
          heading: "Encryption and Data Protection",
          body: "GCP encrypts all data at rest by default using Google-managed keys. For compliance or control requirements:\n\n- **Customer-Managed Encryption Keys (CMEK)**: Provide your own keys in Cloud KMS. GCP services (BigQuery, Cloud Storage, Pub/Sub, GKE) use your KMS key to encrypt data. Revoking the key denies GCP services access to the data.\n- **Customer-Supplied Encryption Keys (CSEK)**: Provide the key material directly — GCP never stores your key. Higher control but more management overhead.\n\n**Secret Manager** stores and manages application secrets (API keys, passwords, certificates) with versioning and IAM access control. Use the `secretmanager.versions.access` IAM permission (via `roles/secretmanager.secretAccessor`) to grant access.",
        },
      ],
      quiz: [
        {
          id: "pca-d3-q1",
          question:
            "A GKE application needs to read from Cloud Storage without using service account key files. What is the recommended approach?",
          options: [
            "A) Mount a service account key file as a Kubernetes Secret.",
            "B) Use Workload Identity to bind the Kubernetes service account to a GCP service account.",
            "C) Grant the GKE node service account Cloud Storage read permissions.",
            "D) Use the default Compute Engine service account in GKE nodes.",
          ],
          correctIndex: 1,
          explanation:
            "Workload Identity is the recommended approach for GKE applications to authenticate to GCP services. It binds a Kubernetes service account to a GCP service account using IAM, allowing pods to obtain GCP credentials from the metadata server without key files. Key files (A) are risky because they can be leaked. Granting node SA (C) violates least privilege — all pods on the node get the same access.",
        },
        {
          id: "pca-d3-q2",
          question:
            "A company needs to ensure that container images deployed to GKE have been scanned for vulnerabilities and signed by the security team. Which GCP feature enforces this?",
          options: [
            "A) Container Analysis with Artifact Registry.",
            "B) Binary Authorization with attestors and a GKE admission policy.",
            "C) Cloud Armor WAF rules for container deployments.",
            "D) Security Command Center container scanning.",
          ],
          correctIndex: 1,
          explanation:
            "Binary Authorization is a deploy-time security control for GKE. It requires container images to have attestations (digital signatures) from defined attestors (e.g., a vulnerability scanner attestor after successful scan, a QA attestor after testing). GKE admission policies block image deployment without required attestations. Container Analysis (A) provides scanning but doesn't enforce deployment gates.",
        },
        {
          id: "pca-d3-q3",
          question:
            "An organization requires that all encryption keys used for Cloud Storage buckets are under their control and can be revoked in case of a security incident. Which encryption option should they use?",
          options: [
            "A) Google-managed encryption keys (default).",
            "B) Customer-Managed Encryption Keys (CMEK) with Cloud KMS.",
            "C) Customer-Supplied Encryption Keys (CSEK).",
            "D) Server-Side Encryption with customer-provided algorithm.",
          ],
          correctIndex: 1,
          explanation:
            "CMEK with Cloud KMS gives the organization control over encryption keys while GCP manages the key usage. Revoking the KMS key or disabling the key version prevents GCP services from decrypting data, effectively cutting off access. Cloud KMS provides audit logs of key usage via Cloud Audit Logs. CSEK (C) also provides control but requires supplying the key material on every API call — much more operationally complex.",
        },
        {
          id: "pca-d3-q4",
          question:
            "A security analyst needs to view all IAM policy changes across all projects in the organization over the past 30 days. Which service provides this?",
          options: [
            "A) Cloud Monitoring with custom metric filters.",
            "B) Cloud Audit Logs — Admin Activity logs aggregated in a log sink to BigQuery.",
            "C) Security Command Center findings.",
            "D) Cloud Asset Inventory policy history.",
          ],
          correctIndex: 1,
          explanation:
            "IAM policy changes are recorded in Cloud Audit Logs as Admin Activity audit logs, which are enabled by default and cannot be disabled. Aggregating these logs from all projects using an organization-level log sink to BigQuery enables querying across all projects for the past 30 days. Security Command Center (C) provides security findings but not raw audit log queries.",
        },
        {
          id: "pca-d3-q5",
          question:
            "A company needs to prevent accidental deletion of production Cloud Storage buckets. What combination of controls provides the best protection?",
          options: [
            "A) IAM conditions that restrict bucket deletion to a specific time window.",
            "B) Object Versioning + Bucket Lock (retention policy) + IAM deny policy on storage.buckets.delete for developers.",
            "C) Cloud Monitoring alerts on bucket deletion API calls.",
            "D) Object Lifecycle rules to recover deleted objects.",
          ],
          correctIndex: 1,
          explanation:
            "A multi-layer approach: (1) Object Versioning preserves object history, (2) Bucket Lock with a retention policy prevents object deletion for the retention period and makes the bucket itself harder to delete, (3) IAM deny on developers' `storage.buckets.delete` permission prevents accidental bucket deletion. Monitoring (C) is detective after the fact. Lifecycle rules (D) manage object transitions, not protect against deletion.",
        },
        {
          id: "pca-d3-q6",
          question:
            "An application running on Cloud Run needs to access a Secret Manager secret. What IAM role should be granted to the Cloud Run service identity?",
          options: [
            "A) `roles/secretmanager.admin` on the project.",
            "B) `roles/secretmanager.secretAccessor` on the specific secret.",
            "C) `roles/secretmanager.viewer` on the project.",
            "D) `roles/owner` on the Secret Manager resource.",
          ],
          correctIndex: 1,
          explanation:
            "Following least privilege, grant `roles/secretmanager.secretAccessor` on the specific secret (not the project) to the Cloud Run service account. This allows the Cloud Run service to access only that specific secret's value, not view or manage all secrets. Granting at the project level (C, A, D) would allow access to all secrets in the project.",
        },
        {
          id: "pca-d3-q7",
          question:
            "A company's GKE cluster processes PCI-DSS regulated data. The cluster must ensure that all outbound API calls go only to approved GCP services within the security perimeter. Which feature provides this?",
          options: [
            "A) GKE Private Cluster with authorized networks.",
            "B) VPC Service Controls service perimeter with restricted.googleapis.com.",
            "C) Cloud Armor WAF rules on outbound traffic.",
            "D) GKE Network Policy (Calico) restricting egress.",
          ],
          correctIndex: 1,
          explanation:
            "VPC Service Controls with `restricted.googleapis.com` routes all GCP API calls through a restricted endpoint that enforces service perimeter policies. Only API calls to services within the perimeter are allowed — calls to external GCP projects or services outside the perimeter are blocked. GKE Network Policy (D) controls pod-to-pod/pod-to-service network traffic but not GCP API calls.",
        },
        {
          id: "pca-d3-q8",
          question:
            "Security Command Center reports that a Cloud Storage bucket containing sensitive data is publicly accessible. What is the immediate remediation?",
          options: [
            "A) Delete the bucket and recreate it with private access.",
            "B) Remove the `allUsers` and `allAuthenticatedUsers` IAM bindings from the bucket and enable uniform bucket-level access.",
            "C) Enable VPC Service Controls around the bucket.",
            "D) Enable Cloud Armor for the Cloud Storage endpoint.",
          ],
          correctIndex: 1,
          explanation:
            "Remove the IAM bindings that grant public access (`allUsers` and `allAuthenticatedUsers`) from the bucket. Additionally, enabling uniform bucket-level access (IAM-only mode) removes legacy ACLs that may also grant public access. VPC Service Controls (C) and Cloud Armor (D) operate at the network/API level and don't fix the fundamental IAM misconfiguration.",
        },
        {
          id: "pca-d3-q9",
          question:
            "A developer needs temporary elevated access to a production project to debug an incident. The company uses just-in-time access controls. Which GCP feature supports granting temporary IAM access?",
          options: [
            "A) IAM Conditions with date/time conditions.",
            "B) IAM Policy bindings that expire after 24 hours.",
            "C) Both A and B — IAM Conditions support time-bounded access.",
            "D) Organizational Policy time-based constraints.",
          ],
          correctIndex: 2,
          explanation:
            "GCP IAM Conditions support date/time conditions (`request.time < timestamp(...)`) that make IAM bindings effective only within a specified time window. This enables just-in-time access: grant a binding with a condition that expires after the required duration (e.g., 4 hours). After expiration, the binding no longer grants access without requiring manual revocation. Both approaches (using IAM conditions) are effectively the same mechanism.",
        },
        {
          id: "pca-d3-q10",
          question:
            "A company rotates Cloud KMS encryption keys every 90 days. Existing data encrypted with the previous key version must remain accessible. What does Cloud KMS do with previous key versions during rotation?",
          options: [
            "A) Previous key versions are automatically destroyed after rotation.",
            "B) Previous key versions are retained in Enabled state and can still decrypt existing data.",
            "C) Previous key versions are disabled and data must be re-encrypted.",
            "D) Previous key versions are exported to Cloud Storage for backup.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud KMS key rotation creates a new primary key version for encrypting new data but retains previous versions in Enabled state. Previous versions continue to decrypt data encrypted under them. Existing data does not need to be re-encrypted immediately — it remains accessible. Administrators can schedule old versions for destruction after confirming re-encryption is complete.",
        },
      ],
    },

    // ─── Domain 4: Analyzing and Optimizing Technical and Business Processes (18%) ───────────────
    {
      id: "domain-4",
      title: "Analyzing and Optimizing Technical and Business Processes",
      weight: "18%",
      order: 4,
      summary:
        "This domain covers aligning technical solutions with business requirements, optimizing costs, and improving operational processes. Topics include cost optimization strategies, capacity planning, SLO/SLA design, and continuous improvement through monitoring and testing.\n\nExpect questions that present business scenarios and ask you to identify the best technical solution considering cost, performance, and operational complexity trade-offs. You must understand GCP's pricing model for key services and how to optimize for cost without sacrificing reliability.",
      keyConceptsForExam: [
        "**GCP pricing** — sustained use discounts (automatic), committed use discounts (1-yr/3-yr), preemptible/Spot VMs, per-second billing",
        "**SLO and error budgets** — service level objectives, error budgets for managing reliability investments, SLI selection",
        "**Cloud Billing** — billing accounts, billing reports, budget alerts, cost allocation labels, billing export to BigQuery",
        "**Cost optimization** — rightsizing with recommenders, storage tiering, object lifecycle management, BigQuery slot reservations",
        "**Reliability testing** — load testing with Cloud Load Testing, chaos engineering, canary deployments for risk reduction",
      ],
      examTips: [
        "Sustained use discounts apply automatically to Compute Engine VMs — no commitment required. They max out at ~30% discount for full-month usage.",
        "BigQuery on-demand pricing charges per TB scanned — reduce costs by partitioning tables and clustering to minimize scanned data.",
        "Use GCP Recommender for automatic right-sizing recommendations on Compute Engine, Cloud SQL, and IAM policies.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "gke-basics", title: "GKE — Google Kubernetes Engine" },
        { cloud: "gcp", topicId: "cloud-storage", title: "Cloud Storage" },
      ],
      sections: [
        {
          heading: "Cost Optimization Strategies",
          body: "GCP provides multiple mechanisms to reduce compute costs:\n\n1. **Sustained Use Discounts**: Automatically applied to Compute Engine VMs running for more than 25% of a month. No action required — GCP applies the discount progressively.\n2. **Committed Use Discounts**: 1-year or 3-year commitments for specific vCPU and memory resources, offering up to 70% discount.\n3. **Preemptible/Spot VMs**: 60-91% discount for interruptible workloads.\n4. **Rightsizing**: Use GCP Recommender to identify oversized VMs.\n\nFor storage costs, use **Object Lifecycle Management** in Cloud Storage to automatically transition objects to cheaper storage classes (Nearline → Coldline → Archive) based on age or last access.",
        },
        {
          heading: "SLOs and Reliability Engineering",
          body: "**Service Level Objectives (SLOs)** define the target reliability level for a service (e.g., 99.9% availability). SLOs are measured by **Service Level Indicators (SLIs)** — specific metrics like request success rate, latency, or throughput.\n\nThe **error budget** is the allowable unreliability within the SLO period (e.g., 0.1% of requests can fail for a 99.9% SLO). When the error budget is exhausted, teams prioritize reliability over new features.\n\nGCP's **Cloud Monitoring** supports SLO monitoring with window-based and request-based SLIs. Configure alerting on error budget burn rate to proactively detect reliability regressions before the budget is fully consumed.",
        },
      ],
      quiz: [
        {
          id: "pca-d4-q1",
          question:
            "A company runs Compute Engine VMs 24/7 for 3 years with predictable resource requirements. Which pricing option provides the maximum discount?",
          options: [
            "A) Sustained use discounts (automatic).",
            "B) 3-year committed use discounts for specific vCPU and memory.",
            "C) Preemptible VMs with autoscaling.",
            "D) Per-second billing with rightsizing.",
          ],
          correctIndex: 1,
          explanation:
            "3-year committed use discounts (CUDs) provide up to 70% discount on vCPU and memory resources in exchange for a commitment. Sustained use discounts (A) are automatic but cap at ~30%. Preemptible VMs (C) provide the deepest individual discount (60-91%) but are not suitable for 24/7 steady-state workloads due to interruptions. CUDs are the best option for long-running predictable workloads.",
        },
        {
          id: "pca-d4-q2",
          question:
            "A BigQuery table has 10 TB of data but most queries only access the last 7 days. The table costs $50/TB scanned per query. How can scan costs be reduced?",
          options: [
            "A) Create a materialized view of the last 7 days.",
            "B) Partition the table by date and cluster by frequently filtered columns; queries with date filters scan only the relevant partitions.",
            "C) Export data older than 7 days to Cloud Storage.",
            "D) Use BigQuery reservations instead of on-demand pricing.",
          ],
          correctIndex: 1,
          explanation:
            "BigQuery table partitioning by date ensures that queries with date filters (`WHERE date >= CURRENT_DATE - 7`) only scan the relevant partitions (7 days of data) rather than the entire 10 TB table. This dramatically reduces query costs and improves performance. Clustering further prunes data within partitions. Materialized views (A) reduce query time but the underlying cost depends on scan size.",
        },
        {
          id: "pca-d4-q3",
          question:
            "A service has an SLO of 99.9% availability per month. In a 30-day month, how many minutes of downtime are allowed before the error budget is exhausted?",
          options: [
            "A) 14.4 minutes",
            "B) 43.2 minutes",
            "C) 4.3 hours",
            "D) 7.2 hours",
          ],
          correctIndex: 1,
          explanation:
            "99.9% availability means 0.1% downtime is allowed. In a 30-day month (30 × 24 × 60 = 43,200 minutes), 0.1% = 43.2 minutes of downtime allowed. This is the error budget. When the monthly error budget of 43.2 minutes is exhausted, the team should freeze new deployments and focus exclusively on reliability.",
        },
        {
          id: "pca-d4-q4",
          question:
            "A company has large amounts of Cloud Storage data. Objects older than 1 year are rarely accessed. What lifecycle rule minimizes storage cost while retaining the data?",
          options: [
            "A) Delete all objects older than 1 year.",
            "B) Transition objects to Archive storage class after 365 days.",
            "C) Transition objects to Nearline after 30 days, Coldline after 90 days, and Archive after 365 days.",
            "D) Enable Object Versioning and delete old versions after 1 year.",
          ],
          correctIndex: 2,
          explanation:
            "A multi-step lifecycle policy progressively moves objects to cheaper storage classes as they age. Standard → Nearline (30 days, $0.01/GB) → Coldline (90 days, $0.004/GB) → Archive (365 days, $0.0012/GB). Archive is the cheapest Cloud Storage class for data that is accessed at most once a year. The progressive transition maximizes cost savings at each age threshold.",
        },
        {
          id: "pca-d4-q5",
          question:
            "A new microservice has been developed. The team wants to release it to 5% of production traffic to validate it before full rollout. Which GCP deployment pattern supports this?",
          options: [
            "A) Blue/green deployment with DNS routing.",
            "B) Canary deployment using Cloud Run traffic splitting.",
            "C) A/B testing using Cloud Endpoints.",
            "D) Feature flags using Firebase Remote Config.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Run natively supports traffic splitting between revisions, allowing canary deployments where a specified percentage of traffic (e.g., 5%) goes to the new revision. This is configurable directly in the Cloud Run console or via `gcloud run services update-traffic`. Traffic splitting on Cloud Run is the simplest canary deployment mechanism on GCP for containerized services.",
        },
        {
          id: "pca-d4-q6",
          question:
            "An organization's Cloud Billing report shows unexpectedly high Cloud SQL costs. The GCP Recommender has flagged several instances as overprovisioned. What information does the Recommender provide?",
          options: [
            "A) Estimated cost for deleting the instance.",
            "B) Recommended machine type with projected cost savings and performance impact.",
            "C) Historical CPU usage charts.",
            "D) Current vs. committed use discount analysis.",
          ],
          correctIndex: 1,
          explanation:
            "GCP Recommender analyzes Cloud SQL instance performance metrics (CPU, memory, disk) and recommends specific machine type changes with projected monthly savings and estimated performance impact. This removes guesswork from rightsizing decisions. After reviewing the recommendation, applying it is a one-click or CLI operation.",
        },
        {
          id: "pca-d4-q7",
          question:
            "A company wants to allocate GCP costs accurately across 5 product teams that share a single GCP project. What is the recommended approach?",
          options: [
            "A) Estimate costs manually based on resource usage.",
            "B) Apply resource labels per team (e.g., `team: payments`) and use Billing Reports with label grouping.",
            "C) Create separate billing accounts per team.",
            "D) Use Cloud Monitoring dashboards to estimate costs.",
          ],
          correctIndex: 1,
          explanation:
            "GCP resource labels are key-value pairs that can be applied to most resources and appear in billing exports. Grouping billing data by labels allows accurate cost allocation per team without requiring separate projects or billing accounts. Export billing data to BigQuery for detailed label-based cost analysis. Separate billing accounts (C) would require separate projects and prevent resource sharing.",
        },
        {
          id: "pca-d4-q8",
          question:
            "A Cloud Spanner instance is running at low utilization (20% CPU) most of the time but spikes to 100% during month-end batch processing. What is the recommended capacity strategy?",
          options: [
            "A) Provision for peak load permanently.",
            "B) Use Cloud Spanner autoscaling to automatically adjust compute capacity based on utilization.",
            "C) Run batch jobs on a separate Spanner instance provisioned only during month-end.",
            "D) Add more nodes permanently to avoid any performance degradation.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Spanner supports autoscaling, which automatically adjusts the number of compute nodes based on CPU and storage utilization. This provides cost efficiency during low-utilization periods while automatically scaling up for month-end batch processing peaks. Permanent over-provisioning (A, D) is costly. Separate instance (C) adds complexity and data management overhead.",
        },
        {
          id: "pca-d4-q9",
          question:
            "A company wants to implement continuous compliance monitoring across all GCP projects. Which service provides automated policy compliance assessment and remediation recommendations?",
          options: [
            "A) Cloud Asset Inventory with manual audits.",
            "B) Security Command Center with Security Health Analytics.",
            "C) Cloud Logging with compliance filters.",
            "D) Forseti Security (open-source) on GKE.",
          ],
          correctIndex: 1,
          explanation:
            "Security Command Center's Security Health Analytics continuously scans GCP resources for misconfigurations and policy violations across all projects. It provides findings with remediation recommendations for issues like public buckets, firewall rules allowing all traffic, missing CMEK, etc. SCC integrates with organization-level visibility for centralized compliance monitoring.",
        },
        {
          id: "pca-d4-q10",
          question:
            "An engineer needs to identify which team is responsible for cost increases in a shared GCP project. The project was not consistently labeled. What tool provides retrospective insight?",
          options: [
            "A) Cloud Billing export to BigQuery with service dimension.",
            "B) Cloud Audit Logs to identify who created expensive resources.",
            "C) GCP Recommender for cost attribution.",
            "D) Cloud Monitoring dashboards.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Audit Logs record who (principal) created or modified resources. By querying Admin Activity logs in BigQuery (via log sink), you can identify which user/service account created the expensive resources and correlate with team ownership. This provides retrospective attribution when labels were not applied. For future cost attribution, immediately apply labels and enforce via Organizational Policy.",
        },
      ],
    },

    // ─── Domain 5: Managing Implementation (11%) ───────────────
    {
      id: "domain-5",
      title: "Managing Implementation",
      weight: "11%",
      order: 5,
      summary:
        "This domain covers the practical aspects of implementing and managing cloud projects including interacting with development teams, advising on best practices, and managing cloud migrations. Topics include migration strategies, API design, and implementing CI/CD pipelines using GCP services.\n\nExpect questions on advising development teams on GCP best practices, choosing the right Artifact Registry configuration, and designing API endpoints with Cloud Endpoints or Apigee.",
      keyConceptsForExam: [
        "**Migration strategies** — lift and shift, improve and move, rip and replace; Migrate to VMs vs. Migrate to Containers",
        "**Artifact Registry** — multi-format repository (Docker, Maven, npm, Python), VPC Service Controls integration, vulnerability scanning",
        "**Cloud Endpoints / Apigee** — API management, auth, rate limiting, Cloud Endpoints for simple APIs, Apigee for enterprise API management",
        "**Cloud Build** — CI/CD, build triggers, build steps, private pools, worker pools for VPC-connected builds",
        "**Cloud Deploy** — managed delivery pipelines, promotion workflows, rollback, target-specific deployment configs",
      ],
      examTips: [
        "Artifact Registry replaces Container Registry — use it for all new projects. It supports Docker, Maven, npm, pip, and apt.",
        "Cloud Deploy provides managed continuous delivery with promotion approval workflows between environments (dev → staging → prod).",
        "For API management with OAuth, quota, and developer portal needs, Apigee is the enterprise answer; Cloud Endpoints is simpler for GCP-native APIs.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "gke-basics", title: "GKE — Google Kubernetes Engine" },
        { cloud: "gcp", topicId: "iam-overview", title: "IAM — Identity and Access Management" },
      ],
      sections: [
        {
          heading: "GCP CI/CD Tools",
          body: "**Cloud Build** is GCP's managed CI/CD service. Build configurations are defined in `cloudbuild.yaml`, specifying a sequence of build steps using Docker containers. Cloud Build integrates with Cloud Source Repositories, GitHub, and Bitbucket.\n\n**Cloud Deploy** provides managed delivery pipelines for GKE and Cloud Run. It defines environments as targets in a pipeline, with promotion workflows (with optional manual approval) between targets. Rollbacks are one-click operations.\n\n**Artifact Registry** stores build artifacts (Docker images, Maven JARs, npm packages) with fine-grained IAM access. It integrates with Cloud Build for automatic pushing of built images.",
        },
        {
          heading: "Migration Strategies",
          body: "Google Cloud defines migration strategies along a spectrum:\n\n1. **Lift and Shift (Rehost)**: Move VMs as-is to Compute Engine using Migrate to Virtual Machines (formerly Velostrata). Fastest migration, no optimization.\n2. **Improve and Move (Replatform)**: Migrate with some modernization — for example, moving from VM-based MySQL to Cloud SQL.\n3. **Rip and Replace (Refactor)**: Rebuild the application for cloud-native services (Cloud Run, GKE, Cloud Spanner). Highest effort, maximum benefits.\n4. **Retain**: Keep on-premises for compliance or latency reasons.\n5. **Retire**: Decommission unused applications.",
        },
      ],
      quiz: [
        {
          id: "pca-d5-q1",
          question:
            "A company wants to migrate 200 existing VMs from an on-premises VMware environment to Google Cloud with minimal downtime and no code changes. Which migration approach should they use?",
          options: [
            "A) Manually recreate each VM on Compute Engine using golden AMIs.",
            "B) Use Google Cloud Migrate to Virtual Machines (formerly Velostrata) for automated lift-and-shift migration.",
            "C) Containerize all applications and deploy to GKE.",
            "D) Use Transfer Appliance to copy VM disk images to Cloud Storage.",
          ],
          correctIndex: 1,
          explanation:
            "Migrate to Virtual Machines automates the migration of VMware, Hyper-V, and AWS VM workloads to Compute Engine with minimal downtime. It continuously replicates data and performs a final cutover. This is the recommended lift-and-shift approach for bulk VM migration. Manual recreation (A) is time-consuming and error-prone for 200 VMs. Containerization (C) requires code changes and is a rip-and-replace strategy.",
        },
        {
          id: "pca-d5-q2",
          question:
            "A Cloud Build pipeline needs to build a Docker image from a private GitHub repository and push it to Artifact Registry. What must be configured?",
          options: [
            "A) SSH key pair stored in Cloud Build environment variables.",
            "B) A Cloud Build GitHub app connection or Cloud Build trigger connected to the GitHub repository.",
            "C) A service account with GitHub read permissions.",
            "D) A VPN connection between GCP and GitHub.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Build integrates with GitHub via the Cloud Build GitHub app, which provides secure OAuth-based access to repositories. Creating a build trigger connected to the GitHub repository through the app installation allows Cloud Build to clone private repositories without manual credential management. The Cloud Build service account needs Artifact Registry write permissions to push images.",
        },
        {
          id: "pca-d5-q3",
          question:
            "A company has three environments: dev, staging, and prod. They want automated deployment to dev on every commit, promotion to staging after automated tests pass, and promotion to prod with manual approval. Which GCP service provides this?",
          options: [
            "A) Cloud Build with separate pipelines per environment.",
            "B) Cloud Deploy with three targets and promotion workflows.",
            "C) Cloud Run with traffic splitting between revisions.",
            "D) Spinnaker on GKE.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Deploy is designed for this exact use case. A delivery pipeline defines targets (dev, staging, prod) and promotion workflows. Automated rollouts are triggered by Cloud Build, promotion approvals can be manual (required for prod), and rollbacks are one-click operations. Cloud Deploy maintains deployment history and provides rollback capabilities across all targets.",
        },
        {
          id: "pca-d5-q4",
          question:
            "A development team stores Docker images in both Container Registry and Artifact Registry. Security scanning is required for all images. Which service should they standardize on?",
          options: [
            "A) Continue using Container Registry for backward compatibility.",
            "B) Artifact Registry — it's the recommended successor with vulnerability scanning, VPC Service Controls, and multi-format support.",
            "C) Docker Hub with Google Cloud integration.",
            "D) Use both and configure scanning on Container Registry only.",
          ],
          correctIndex: 1,
          explanation:
            "Artifact Registry is the recommended successor to Container Registry. It supports multiple artifact formats (Docker, Maven, npm, pip, apt, yum), integrates with Cloud Build, supports VPC Service Controls for data perimeters, and includes built-in vulnerability scanning via Container Analysis. Container Registry (A) is in maintenance mode and will eventually be deprecated.",
        },
        {
          id: "pca-d5-q5",
          question:
            "A company needs to expose a GCP-hosted API with OAuth 2.0 authentication, API key management, and a developer portal for external partners. Which service is MOST appropriate?",
          options: [
            "A) Cloud Endpoints with Extensible Service Proxy (ESP).",
            "B) Apigee API Management.",
            "C) Cloud Armor with identity-aware proxy.",
            "D) Firebase Hosting with Cloud Functions.",
          ],
          correctIndex: 1,
          explanation:
            "Apigee is Google's enterprise API management platform providing OAuth 2.0/OIDC authentication, API key management, rate limiting, analytics, and a developer portal out of the box. Cloud Endpoints (A) is simpler and GCP-native but lacks a developer portal and advanced enterprise API management features. Apigee is the correct choice when external partner access with full lifecycle API management is required.",
        },
        {
          id: "pca-d5-q6",
          question:
            "A Cloud Build job needs to access internal services within a VPC (e.g., a private Artifact Registry or internal test environment). What configuration is required?",
          options: [
            "A) Configure Cloud Build to use a public IP that is whitelisted in the VPC firewall.",
            "B) Use a Cloud Build private pool (worker pool) connected to the VPC via VPC peering or Private Service Connect.",
            "C) Deploy a self-hosted Jenkins instance in the VPC.",
            "D) Use Identity-Aware Proxy to allow Cloud Build access to internal services.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Build private pools are isolated build environments in a VPC that you control. They connect to your VPC via private networking, allowing build steps to access private resources (internal test endpoints, private Artifact Registry, private Cloud SQL, etc.) without exposing them to the internet. The default Cloud Build workers run in Google-managed infrastructure and cannot access private VPC resources.",
        },
        {
          id: "pca-d5-q7",
          question:
            "A team is migrating a MySQL database from on-premises to Cloud SQL. They need minimal downtime and want to validate data integrity before cutover. What approach should they use?",
          options: [
            "A) Export to SQL dump, transfer to Cloud Storage, import to Cloud SQL.",
            "B) Use Database Migration Service (DMS) with continuous replication and validate before cutover.",
            "C) Use Dataflow to migrate data from on-premises MySQL to Cloud SQL.",
            "D) Manually copy data tables using mysqldump per table.",
          ],
          correctIndex: 1,
          explanation:
            "Google Cloud Database Migration Service (DMS) supports continuous replication from on-premises MySQL to Cloud SQL with minimal downtime. DMS replicates initial data and then continuously applies changes (using binlog replication). Teams can validate the Cloud SQL instance while production continues running on-premises, then perform a low-downtime cutover. SQL dump (A) requires downtime proportional to database size.",
        },
        {
          id: "pca-d5-q8",
          question:
            "A development team wants to follow GitOps practices for their GKE deployments. Configuration changes in a Git repository should automatically be applied to the cluster. Which GCP service enables this?",
          options: [
            "A) Cloud Build with a trigger on the repository.",
            "B) Anthos Config Management (ACM) with Config Sync.",
            "C) Cloud Deploy with Git source triggers.",
            "D) kubectl apply run from a scheduled Cloud Build job.",
          ],
          correctIndex: 1,
          explanation:
            "Anthos Config Management with Config Sync implements GitOps for GKE by continuously synchronizing the cluster state with a Git repository. Any commit to the repository automatically updates the cluster to match the desired state. Cloud Build (A) is pull-based CI — it builds and deploys on triggers but doesn't continuously enforce state like GitOps requires.",
        },
        {
          id: "pca-d5-q9",
          question:
            "A company needs to ensure their cloud architecture meets PCI-DSS requirements. What GCP service provides compliance posture assessments and remediation guidance?",
          options: [
            "A) Cloud Logging compliance templates.",
            "B) Security Command Center with the PCI DSS compliance standard assessment.",
            "C) Cloud Audit Logs with custom PCI compliance dashboards.",
            "D) Forseti Security scanning.",
          ],
          correctIndex: 1,
          explanation:
            "Security Command Center (SCC) in the Premium tier includes built-in compliance standards including PCI DSS, CIS Benchmarks, and others. SCC continuously evaluates GCP resources against compliance controls and provides findings with remediation guidance. The compliance dashboard shows overall compliance posture by standard. Forseti Security (D) is an open-source predecessor to SCC capabilities.",
        },
        {
          id: "pca-d5-q10",
          question:
            "A team's Cloud Build trigger runs on every push to any branch, causing excessive build costs. They want builds only on pushes to `main` and on pull requests. How should they configure Cloud Build triggers?",
          options: [
            "A) Add an `if` condition in the cloudbuild.yaml to skip builds on other branches.",
            "B) Configure separate triggers: one matching `main` branch with push event, another matching pull request events with regex filter.",
            "C) Use Cloud Scheduler to run builds only during business hours.",
            "D) Implement branch protection rules in GitHub to limit pushes.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Build triggers support branch regex filters and event type selection (push, pull request, tag). Creating two triggers — one for pushes to `main` branch and one for pull request events — provides the desired behavior. Trigger conditions are evaluated before the build starts, so only matching events consume build minutes. The cloudbuild.yaml approach (A) still starts the build and consumes resources before the check.",
        },
      ],
    },

    // ─── Domain 6: Ensuring Solution and Operations Reliability (14%) ───────────────
    {
      id: "domain-6",
      title: "Ensuring Solution and Operations Reliability",
      weight: "14%",
      order: 6,
      summary:
        "This domain covers implementing monitoring, alerting, and incident management for GCP workloads. Topics include Cloud Monitoring, Cloud Logging, Cloud Trace, and Cloud Profiler. You must understand how to design observability for distributed systems and respond to operational incidents.\n\nExpect questions on configuring SLO monitoring in Cloud Monitoring, creating effective alerting policies, using Cloud Trace for distributed tracing, and designing log-based metrics for custom monitoring.",
      keyConceptsForExam: [
        "**Cloud Monitoring** — metric types (gauge, delta, cumulative), alerting policies, notification channels, uptime checks, SLO monitoring",
        "**Cloud Logging** — log sinks (BigQuery, Cloud Storage, Pub/Sub), log exclusion filters, log-based metrics, Error Reporting",
        "**Cloud Trace** — distributed tracing for latency analysis, trace sampling, integration with Cloud Monitoring",
        "**Cloud Profiler** — continuous CPU and memory profiling, flame graphs for performance analysis",
        "**Google Cloud's operations suite** — unified observability across GKE, Cloud Run, App Engine, GCE",
      ],
      examTips: [
        "Cloud Monitoring SLO monitoring uses burn rate alerts — a high burn rate means the error budget will be exhausted soon, triggering early warning.",
        "Log-based metrics convert log entries matching a filter into Cloud Monitoring metrics — use for events that don't have native metrics.",
        "Cloud Error Reporting aggregates and deduplicates exceptions from App Engine, Cloud Functions, GKE, Cloud Run, and Compute Engine.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "gke-basics", title: "GKE — Google Kubernetes Engine" },
        { cloud: "gcp", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
      ],
      sections: [
        {
          heading: "Cloud Monitoring and Alerting",
          body: "Cloud Monitoring collects metrics from GCP services, custom applications, and third-party sources. **Alerting policies** define conditions under which notifications are sent. Alert conditions can be based on metric thresholds, absence of metric data, or log-based metrics.\n\n**SLO monitoring** in Cloud Monitoring lets you define SLIs and SLOs and monitors error budget consumption. **Burn rate alerts** trigger when the error budget is being consumed faster than the SLO allows — providing early warning before the budget is exhausted.\n\nFor distributed systems, use **uptime checks** to verify external endpoint availability from multiple global locations. Uptime check failures trigger immediate alerting.",
        },
        {
          heading: "Log Management and Distributed Tracing",
          body: "**Cloud Logging** aggregates logs from all GCP services. Use **log sinks** to export logs to BigQuery (for analysis), Cloud Storage (for archival), or Pub/Sub (for real-time processing). **Log exclusion filters** prevent high-volume, low-value logs from consuming logging quota.\n\n**Log-based metrics** convert log entries matching a filter expression into Cloud Monitoring metrics — useful for monitoring error counts, event frequencies, or custom application events that aren't available as native metrics.\n\n**Cloud Trace** collects distributed tracing data for analyzing request latency across microservices. It integrates with App Engine, GKE, and Cloud Run automatically, and requires SDK instrumentation for custom applications.",
        },
      ],
      quiz: [
        {
          id: "pca-d6-q1",
          question:
            "A Cloud Run service is experiencing intermittent latency spikes. Which GCP observability tool helps identify which specific function calls or downstream service calls are causing the slowdown?",
          options: [
            "A) Cloud Monitoring with latency metrics.",
            "B) Cloud Trace — view individual request traces and identify slow segments.",
            "C) Cloud Logging — filter for slow request log entries.",
            "D) Cloud Profiler — analyze CPU usage during latency spikes.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Trace provides distributed tracing, showing the complete request journey with timing for each component call. For a Cloud Run service, Cloud Trace automatically captures inter-service calls and can show which downstream API (Cloud SQL, Pub/Sub, external API) is causing latency. Cloud Monitoring metrics (A) show aggregate statistics, not individual request paths. Cloud Profiler (D) shows CPU usage patterns, not request-level latency.",
        },
        {
          id: "pca-d6-q2",
          question:
            "A company exports Cloud Logging logs to BigQuery. Log volume has become very high, and 80% of logs are low-priority debug logs from a specific service. What is the BEST way to reduce costs?",
          options: [
            "A) Upgrade to a higher tier Cloud Logging plan.",
            "B) Create a log exclusion filter for the debug logs to prevent them from being ingested into Cloud Logging.",
            "C) Set the log level to WARNING in the application to reduce debug log output.",
            "D) Delete logs from BigQuery regularly.",
          ],
          correctIndex: 1,
          explanation:
            "Log exclusion filters in Cloud Logging prevent specified log entries from being ingested into Cloud Logging, directly reducing logging costs. The filter matches log entries before ingestion, so excluded logs are never stored or counted against quota. Both B and C reduce log volume — C requires an application change, while B is a Cloud Logging configuration change with immediate effect on all sources.",
        },
        {
          id: "pca-d6-q3",
          question:
            "A GKE application logs exceptions with `severity=ERROR`. The team wants to count these errors and create an alert when the error rate exceeds 10 per minute. What is the correct approach?",
          options: [
            "A) Create a Cloud Monitoring alert on the `kubernetes.io/container/restart_count` metric.",
            "B) Create a Cloud Logging log-based metric counting log entries matching the error filter, then create an alerting policy on the metric.",
            "C) Use Cloud Error Reporting to count and alert on errors.",
            "D) Export logs to BigQuery and run scheduled queries.",
          ],
          correctIndex: 1,
          explanation:
            "Log-based metrics extract numeric data from log entries. Create a counter metric with a filter matching `severity=ERROR` and the specific resource. Then create an alerting policy on this metric with a threshold of 10 per minute. This is the standard Cloud Logging → Cloud Monitoring pipeline for log-based alerting. Error Reporting (C) aggregates errors but doesn't provide rate-based alerting as flexibly.",
        },
        {
          id: "pca-d6-q4",
          question:
            "A company needs to retain Cloud Logging logs for 7 years for compliance. The default Cloud Logging retention is 30 days. What should they configure?",
          options: [
            "A) Upgrade Cloud Logging retention to 7 years in the console.",
            "B) Create a log sink to a Cloud Storage bucket with a 7-year retention lock policy.",
            "C) Create a log sink to BigQuery with a 7-year table expiration policy.",
            "D) Configure Log Analytics in Cloud Logging for extended retention.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Logging's maximum configurable retention is 3650 days (~10 years) for the _Default log bucket, or you can export to Cloud Storage with retention policies. For compliance (tamper-evident retention), creating a log sink to Cloud Storage with a Bucket Lock (retention policy) enforces immutable retention for 7 years. BigQuery (C) also works but Cloud Storage with Bucket Lock is the standard compliance approach.",
        },
        {
          id: "pca-d6-q5",
          question:
            "A Cloud Monitoring SLO alert reports that the error budget will be exhausted in 2 hours at the current burn rate. What is the MOST appropriate immediate response?",
          options: [
            "A) Wait and monitor the situation for 30 minutes.",
            "B) Immediately investigate the cause of increased errors and engage the on-call incident response team.",
            "C) Increase the SLO target to give more error budget.",
            "D) Disable the alerting policy to stop the notifications.",
          ],
          correctIndex: 1,
          explanation:
            "A high burn rate alert means reliability is degrading quickly. The error budget will be exhausted within 2 hours, which means the SLO is at risk of being missed. This warrants immediate investigation and engagement of the incident response team. Waiting (A) wastes the remaining error budget. Changing the SLO (C) masks the problem rather than solving it.",
        },
        {
          id: "pca-d6-q6",
          question:
            "An App Engine application is throwing exceptions that are appearing in Cloud Logging. The team needs to automatically group similar errors and get notifications for new error types. Which service provides this?",
          options: [
            "A) Cloud Monitoring custom dashboards.",
            "B) Cloud Error Reporting — automatically groups exceptions and notifies on new error types.",
            "C) Cloud Trace error analysis.",
            "D) Log-based metrics with alert policies.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Error Reporting automatically analyzes exception stack traces, groups similar errors together, and provides a dashboard of error frequency over time. It integrates natively with App Engine, Cloud Functions, GKE, Cloud Run, and Compute Engine. It can notify teams when a new error type is detected. This deduplication and grouping is Cloud Error Reporting's core value proposition.",
        },
        {
          id: "pca-d6-q7",
          question:
            "A team needs to create a dashboard showing GKE pod restart counts, Cloud SQL query latency, and custom application error rates from Cloud Logging — all on a single pane of glass. Which GCP service provides this?",
          options: [
            "A) Separate Cloud Monitoring dashboards per service.",
            "B) Cloud Monitoring custom dashboards with widgets from multiple metric sources including log-based metrics.",
            "C) Looker Studio (Data Studio) with BigQuery exports.",
            "D) Grafana on GKE with Prometheus.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Monitoring custom dashboards can combine widgets from any Cloud Monitoring metric source — GKE system metrics, Cloud SQL metrics, and log-based metrics (created from Cloud Logging). This provides a single unified view without requiring external tools. Grafana (D) also works but adds operational overhead. For GCP-native monitoring, Cloud Monitoring dashboards are the recommended approach.",
        },
        {
          id: "pca-d6-q8",
          question:
            "Cloud Profiler is enabled for a Go application on GKE. The team identifies that a specific function consumes 40% of CPU. What is the primary action informed by this finding?",
          options: [
            "A) Scale the GKE cluster to add more nodes.",
            "B) Optimize the identified function's algorithm or data structures to reduce CPU usage.",
            "C) Switch from GKE to Compute Engine for better CPU performance.",
            "D) Enable CPU-optimized machine types in the GKE node pool.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Profiler's value is in identifying CPU and memory bottlenecks in application code, enabling targeted optimization. If a specific function consumes 40% of CPU, the correct response is to analyze and optimize that function (algorithm optimization, reducing redundant computation, better data structures). Scaling (A) adds cost but doesn't fix the underlying inefficiency. Profiler informs code-level optimizations, not infrastructure changes.",
        },
        {
          id: "pca-d6-q9",
          question:
            "A Cloud Run service receives traffic from multiple clients globally. The team wants uptime checks from multiple global locations with alerting if the service is unreachable from any location. What should they configure?",
          options: [
            "A) Cloud Monitoring custom metric uptime checks from a single region.",
            "B) Cloud Monitoring uptime checks for the Cloud Run service URL with global checker locations.",
            "C) Cloud Armor health checks on the Load Balancer.",
            "D) GKE readiness probes on the application pods.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Monitoring uptime checks verify that a URL is reachable from multiple global checker locations (US, Europe, Asia). If the service is unreachable from any configured number of locations, an alerting policy triggers. This provides multi-region synthetic monitoring for Cloud Run services. Cloud Armor (C) is a WAF service, not an uptime monitoring service.",
        },
        {
          id: "pca-d6-q10",
          question:
            "A company wants to forward all Cloud Audit Logs from all GCP projects to a centralized Cloud Logging project for security analysis. What is the correct configuration?",
          options: [
            "A) Configure log sinks in each individual project to the central project.",
            "B) Create an aggregated log sink at the Organization level that filters for audit logs and routes to the central project's log bucket.",
            "C) Use Cloud Asset Inventory to collect audit logs centrally.",
            "D) Enable Cloud Monitoring cross-project metrics sharing.",
          ],
          correctIndex: 1,
          explanation:
            "Organization-level aggregated log sinks in Cloud Logging can collect logs from all projects, folders, or the entire organization with a single sink configuration. The sink routes matching logs (e.g., `logName:(activity OR data_access)`) to a destination in the central project (Cloud Logging bucket, BigQuery, Cloud Storage, or Pub/Sub). This is far more scalable than per-project sinks and automatically includes new projects added to the organization.",
        },
      ],
    },
  ],
};
