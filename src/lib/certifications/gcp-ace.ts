import type { Certification } from "./types";

export const gcpAce: Certification = {
  id: "gcp-ace",
  title: "Google Cloud Associate Cloud Engineer",
  code: "ACE",
  cloud: "gcp",
  level: "Associate",
  description:
    "Validate your ability to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud. Covers core services including Compute Engine, GKE, Cloud Storage, VPC networking, and IAM.",
  examFormat: {
    questions: 50,
    duration: "120 minutes",
    passingScore: "~70%",
    cost: "$200 USD",
  },
  domains: [
    // ─── Domain 1: Setting Up a Cloud Solution Environment (20%) ───
    {
      id: "domain-1",
      title: "Setting Up a Cloud Solution Environment",
      weight: "20%",
      order: 1,
      summary:
        "This domain covers how to establish a well-structured Google Cloud environment from scratch. You must understand the **resource hierarchy** — organizations, folders, projects, and resources — and how policies and billing are inherited at each level. Proper project setup is the foundation of every GCP deployment.\n\nExpect questions on creating and configuring GCP projects, enabling APIs, setting up billing accounts, and linking them appropriately. You should know how to configure `gcloud` CLI, manage credentials, and establish Cloud Identity and Google Workspace connections for user management.\n\nThis domain also covers initial networking setup: creating VPC networks, configuring firewall rules, and setting up Cloud DNS. Understanding how to lay a solid foundation — before any workloads are deployed — is essential for this portion of the exam.",
      keyConceptsForExam: [
        "**Resource hierarchy** — Organization → Folders → Projects → Resources; policy inheritance flows downward",
        "**Projects** — billing unit, API enablement scope, and IAM boundary; every GCP resource lives inside a project",
        "**gcloud CLI** — `gcloud init`, `gcloud config set project`, `gcloud auth application-default login`",
        "**Billing accounts** — linked to one or more projects; budget alerts and cost exports to BigQuery",
        "**Cloud Identity / Workspace** — user and group management, Cloud Directory Sync for AD integration",
        "**IAM at hierarchy level** — roles bound at org, folder, or project; child policies cannot override parent denials with Allow",
        "**API enablement** — every GCP service API must be explicitly enabled per project before use",
        "**Cloud Shell** — browser-based shell with pre-authenticated `gcloud` and persistent 5 GB home directory",
      ],
      examTips: [
        "Resource hierarchy questions: remember that **IAM policy inheritance is additive** — a binding at the org level applies to all projects below it, and project-level bindings cannot revoke org-level grants.",
        "When a question asks how to organize projects for different environments (dev/staging/prod), the answer is usually **folders** with separate projects per environment and a shared VPC project.",
        "Billing account questions: only a **Billing Account Administrator** can link or unlink projects — not project owners by default.",
        "For `gcloud` commands, know the difference between `gcloud config set` (persistent) and inline flags like `--project` (one-time override).",
        "Cloud Shell provides a pre-authenticated environment — useful in exam scenarios where you need to run `gcloud` commands without setting up credentials.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "iam-overview", title: "IAM Overview" },
        { cloud: "gcp", topicId: "vpc-basics", title: "VPC Networking" },
        { cloud: "gcp", topicId: "gce-basics", title: "Compute Engine" },
      ],
      sections: [
        {
          heading: "GCP Resource Hierarchy",
          body: "Every GCP resource belongs to a **project**, and projects can be grouped into **folders**, which sit under an **organization**. IAM policies and Organization Policies applied at higher levels propagate down to all child resources.\n\nThe organization node maps to a Cloud Identity or Google Workspace domain. **Folders** are optional but recommended for large enterprises to group departments or environments. Each **project** has a unique ID, number, and name — the ID is immutable once set.\n\nBilling accounts are linked at the project level. Costs for all resources in a project roll up to the linked billing account. Use **Budget Alerts** to notify teams when spending approaches thresholds, and export billing data to BigQuery for detailed analysis.",
          code: {
            lang: "bash",
            label: "Create a new project and link a billing account",
            snippet: `# Create a new project
gcloud projects create my-app-prod \\
  --name="My App Production" \\
  --folder=123456789

# Link a billing account
gcloud beta billing projects link my-app-prod \\
  --billing-account=0X0X0X-0X0X0X-0X0X0X

# Set the project as the default for gcloud
gcloud config set project my-app-prod`,
          },
        },
        {
          heading: "Enabling APIs and Initial Configuration",
          body: "Before using any GCP service, its API must be enabled for the project. The **Compute Engine API**, **Kubernetes Engine API**, and **Cloud Storage API** are among the most common. You can enable APIs via the Console, `gcloud services enable`, or Terraform.\n\n**Service accounts** are the primary identity for applications and VMs. Each project gets a default Compute Engine service account, but best practice is to create dedicated service accounts with minimum required roles for each workload.\n\nInitial network setup includes creating **VPC networks** (auto mode for quick starts, custom mode for production), defining **subnets** per region, and setting **firewall rules** to control ingress and egress traffic.",
          code: {
            lang: "bash",
            label: "Enable APIs and create a service account",
            snippet: `# Enable required APIs
gcloud services enable compute.googleapis.com \\
  container.googleapis.com \\
  storage.googleapis.com \\
  --project=my-app-prod

# Create a dedicated service account
gcloud iam service-accounts create app-backend \\
  --display-name="App Backend Service Account" \\
  --project=my-app-prod

# Grant a role to the service account
gcloud projects add-iam-policy-binding my-app-prod \\
  --member="serviceAccount:app-backend@my-app-prod.iam.gserviceaccount.com" \\
  --role="roles/storage.objectViewer"`,
          },
        },
        {
          heading: "Cloud SDK and Authentication",
          body: "The `gcloud` CLI is the primary tool for interacting with GCP from the command line. It supports **user credentials** (for interactive use) and **service account credentials** (for automation). Application Default Credentials (ADC) allow libraries and tools to find credentials automatically.\n\nFor local development, run `gcloud auth application-default login` to generate credentials that libraries use. In production on GCP (Compute Engine, GKE, Cloud Run), the service account attached to the resource provides credentials automatically — no key files required.\n\n**Cloud Shell** is a fully managed, browser-based shell pre-loaded with `gcloud`, `kubectl`, `terraform`, and other tools. It authenticates automatically with your Google identity and includes a persistent 5 GB home directory.",
        },
      ],
      quiz: [
        {
          id: "ace-d1-q1",
          question:
            "A team needs to organize 50 GCP projects for three departments (Engineering, Finance, Operations), each with dev and prod environments. What is the BEST way to organize these projects?",
          options: [
            "A) Create all 50 projects directly under the organization with naming conventions to distinguish departments.",
            "B) Create folders for each department, with sub-folders for dev and prod, then place projects inside.",
            "C) Create a single project per department and use labels to distinguish environments.",
            "D) Create separate billing accounts per department and place projects inside each billing account.",
          ],
          correctIndex: 1,
          explanation:
            "Folders provide a hierarchical grouping mechanism that mirrors organizational structure. Using department-level folders with environment sub-folders allows IAM policies to be applied at the appropriate level, minimizing repetition. Labels (C) are metadata and don't affect IAM boundaries. Billing accounts (D) are for cost management, not project organization. Flat project lists (A) become unwieldy and don't support hierarchical IAM.",
        },
        {
          id: "ace-d1-q2",
          question:
            "A GCP project owner wants to give a contractor read-only access to Cloud Storage in their project. The contractor already has a Google account. What is the CORRECT approach?",
          options: [
            "A) Share the project's service account key file with the contractor.",
            "B) Grant the contractor's Google account the `roles/storage.objectViewer` role on the project.",
            "C) Create a new Google account for the contractor and share the password.",
            "D) Enable public access to the Cloud Storage bucket so the contractor can access it without authentication.",
          ],
          correctIndex: 1,
          explanation:
            "Granting a role to the contractor's existing Google account is the correct, least-privilege approach. Sharing service account keys (A) is a security anti-pattern — keys are long-lived and hard to rotate. Creating and sharing credentials (C) violates security policies. Public access (D) exposes data to everyone, not just the contractor.",
        },
        {
          id: "ace-d1-q3",
          question:
            "An organization wants to prevent any project within a specific folder from creating public IP addresses on VM instances. Which tool enforces this?",
          options: [
            "A) IAM roles applied to users in those projects.",
            "B) Firewall rules blocking outbound traffic.",
            "C) Organization Policy with the `constraints/compute.vmExternalIpAccess` constraint.",
            "D) VPC Service Controls around the folder's projects.",
          ],
          correctIndex: 2,
          explanation:
            "Organization Policies enforce resource configuration constraints across projects and folders. The `compute.vmExternalIpAccess` constraint restricts which VMs can have external IP addresses. IAM (A) controls who can perform actions but doesn't prevent the action itself via resource constraints. Firewall rules (B) filter traffic but don't prevent IP assignment. VPC Service Controls (D) protect API access, not VM IP configuration.",
        },
        {
          id: "ace-d1-q4",
          question:
            "A developer runs `gcloud compute instances list` and receives a PERMISSION_DENIED error, even though the project exists. What is the MOST likely cause?",
          options: [
            "A) The Compute Engine API has not been enabled for the project.",
            "B) The developer's account lacks the `roles/compute.viewer` role or equivalent.",
            "C) Both A and B could cause this error.",
            "D) The developer is using the wrong billing account.",
          ],
          correctIndex: 2,
          explanation:
            "Both a disabled API and insufficient IAM permissions can result in a PERMISSION_DENIED or similar error when running gcloud commands. If the Compute Engine API is not enabled, gcloud will return an error. If the API is enabled but the user lacks IAM permissions, they will also receive a denial. Always check both API enablement and IAM bindings when troubleshooting access issues.",
        },
        {
          id: "ace-d1-q5",
          question:
            "A company is setting up a new GCP organization. They want to receive alerts when monthly cloud spending exceeds $10,000. What should they configure?",
          options: [
            "A) A Cloud Monitoring alert policy on billing metrics.",
            "B) A Budget in the billing account with an alert threshold at $10,000.",
            "C) A Cloud Function that polls billing data every hour.",
            "D) A BigQuery scheduled query that sends email notifications.",
          ],
          correctIndex: 1,
          explanation:
            "Billing Budgets natively support threshold-based alerts via email and Pub/Sub notifications. They are the purpose-built, lowest-effort solution for cost alerts. Cloud Monitoring (A) can monitor GCP metrics but billing alert configuration is done through Budgets. Cloud Functions (C) and BigQuery scheduled queries (D) require custom development and are not the recommended approach.",
        },
        {
          id: "ace-d1-q6",
          question:
            "A GCP organization administrator wants to enforce that all new projects must have a billing account linked before any resources can be created. How should this be configured?",
          options: [
            "A) Set the `constraints/billing.disableProjectBillingModification` Organization Policy.",
            "B) Require billing account linkage via a custom approval workflow in Cloud Build.",
            "C) Configure the default quota for new projects to 0 until billing is confirmed.",
            "D) This is enforced automatically — projects cannot create billable resources without a billing account.",
          ],
          correctIndex: 3,
          explanation:
            "GCP automatically prevents creation of billable resources in projects that do not have an active billing account linked. This is platform-enforced behavior, not something that needs additional configuration. Organization Policies control other types of resource constraints. Understanding this default behavior is important for the exam.",
        },
        {
          id: "ace-d1-q7",
          question:
            "A team wants to run `gcloud` commands from a CI/CD pipeline without storing service account keys as files. What is the RECOMMENDED approach on GCP?",
          options: [
            "A) Store the service account key JSON in a CI/CD environment variable and use `gcloud auth activate-service-account`.",
            "B) Use Workload Identity Federation to allow the CI/CD provider's identity to impersonate a GCP service account.",
            "C) Create a shared user account for the CI/CD pipeline and store its credentials.",
            "D) Use the project's default Compute Engine service account credentials.",
          ],
          correctIndex: 1,
          explanation:
            "Workload Identity Federation allows external workloads (GitHub Actions, GitLab CI, etc.) to authenticate to GCP using their native identity tokens without needing to download and store service account keys. This eliminates the secret management burden and key rotation requirement. Storing keys (A) is functional but carries security risks. Shared user accounts (C) violate least-privilege and auditability principles.",
        },
        {
          id: "ace-d1-q8",
          question:
            "Which gcloud command correctly sets a default compute region and zone for all subsequent commands in the current configuration?",
          options: [
            "A) `gcloud config set compute/region us-central1` and `gcloud config set compute/zone us-central1-a`",
            "B) `gcloud init --region=us-central1 --zone=us-central1-a`",
            "C) `export GCLOUD_REGION=us-central1 && export GCLOUD_ZONE=us-central1-a`",
            "D) `gcloud defaults set --region=us-central1 --zone=us-central1-a`",
          ],
          correctIndex: 0,
          explanation:
            "`gcloud config set compute/region` and `gcloud config set compute/zone` persistently set the default region and zone for the active gcloud configuration. `gcloud init` (B) is an interactive wizard, not suitable for automation. Environment variables (C) are not the standard gcloud configuration mechanism. Option D is not a valid gcloud command.",
        },
        {
          id: "ace-d1-q9",
          question:
            "An organization has a shared VPC setup. Which project contains the VPC network resources (subnets, firewall rules, routes) in a Shared VPC configuration?",
          options: [
            "A) Each service project defines its own subnets within the shared VPC.",
            "B) The host project owns the VPC and shares subnets with service projects.",
            "C) The organization node owns the VPC and delegates it to all projects.",
            "D) A dedicated networking folder owns the VPC and projects attach to it.",
          ],
          correctIndex: 1,
          explanation:
            "In Shared VPC, the **host project** owns the VPC network, subnets, firewall rules, and routes. **Service projects** can use the host project's subnets to deploy resources but do not own the network infrastructure. This centralizes network management while allowing different teams to manage their own service projects. Organizations (C) and folders (D) cannot own VPC networks directly.",
        },
        {
          id: "ace-d1-q10",
          question:
            "A solutions team needs to audit all administrative actions taken in their GCP projects over the past 30 days. Where should they look?",
          options: [
            "A) Cloud Monitoring metrics dashboard.",
            "B) Cloud Audit Logs — specifically Admin Activity audit logs.",
            "C) VPC Flow Logs for all subnets.",
            "D) Cloud Trace for API call history.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Audit Logs record administrative actions in Admin Activity logs, which are always enabled and retained for 400 days. They capture who did what, when, and from where for all GCP API calls that modify resources. Cloud Monitoring (A) tracks metrics, not administrative actions. VPC Flow Logs (C) capture network traffic. Cloud Trace (D) tracks application request latency.",
        },
        {
          id: "ace-d1-q11",
          question:
            "A GCP project has the Editor basic role granted to all members of a team. The security team wants to restrict this without disrupting access. What is the RECOMMENDED approach?",
          options: [
            "A) Remove the Editor role and grant predefined roles corresponding to each team member's actual needs.",
            "B) Add a Deny policy that blocks specific permissions for team members.",
            "C) Move team members to a separate project with fewer permissions.",
            "D) Enable VPC Service Controls to limit which APIs team members can call.",
          ],
          correctIndex: 0,
          explanation:
            "Replacing broad basic roles (Owner, Editor, Viewer) with granular predefined roles is the recommended path to least privilege. This follows GCP IAM best practices and aligns with the exam's emphasis on principle of least privilege. Deny policies (B) are complex and new to GCP IAM. Moving to separate projects (C) is operationally disruptive. VPC Service Controls (D) protect against data exfiltration, not general IAM over-privilege.",
        },
        {
          id: "ace-d1-q12",
          question:
            "Which GCP resource is the primary billing unit and defines the scope for API enablement?",
          options: [
            "A) Organization",
            "B) Folder",
            "C) Project",
            "D) Resource",
          ],
          correctIndex: 2,
          explanation:
            "A **Project** is the fundamental unit of GCP — it is where billing is tracked, APIs are enabled, and resources are created. Each project has a unique ID and is linked to exactly one billing account at a time. Organizations and Folders are grouping constructs, not billing or API-scoping units.",
        },
        {
          id: "ace-d1-q13",
          question:
            "A company wants to use Cloud Identity to manage employee accounts but also sync with their on-premises Active Directory. What tool enables this?",
          options: [
            "A) Cloud Directory Sync (GCDS)",
            "B) Cloud Interconnect",
            "C) Apigee Identity Proxy",
            "D) Firebase Authentication",
          ],
          correctIndex: 0,
          explanation:
            "Google Cloud Directory Sync (GCDS) synchronizes users and groups from Microsoft Active Directory or LDAP to Cloud Identity or Google Workspace. Cloud Interconnect (B) provides network connectivity. Apigee (C) is an API management platform. Firebase Authentication (D) is for application user authentication, not enterprise directory synchronization.",
        },
        {
          id: "ace-d1-q14",
          question:
            "A developer accidentally deleted a GCP project. Within what time window can the project be recovered, and who can recover it?",
          options: [
            "A) 7 days; only Google Support can restore it.",
            "B) 30 days; the project owner or org admin can undelete it.",
            "C) 24 hours; the project creator can restore it via Cloud Console.",
            "D) Projects are permanently deleted immediately and cannot be recovered.",
          ],
          correctIndex: 1,
          explanation:
            "GCP enters a 30-day deletion pending state when a project is deleted. During this period, a project owner or organization admin can undelete the project via the Console or `gcloud projects undelete PROJECT_ID`. After 30 days, the project and all its resources are permanently deleted. Google Support is not required for this operation.",
        },
        {
          id: "ace-d1-q15",
          question:
            "An organization wants to centrally view and manage costs for all GCP projects across multiple billing accounts. What is the BEST approach?",
          options: [
            "A) Grant the Billing Account Viewer role to finance team members on each billing account.",
            "B) Export all billing data to a centralized BigQuery dataset and use Looker Studio for visualization.",
            "C) Use Cloud Monitoring dashboards to view billing metrics per project.",
            "D) Enable Cloud Asset Inventory to report on resource costs.",
          ],
          correctIndex: 1,
          explanation:
            "Exporting billing data to BigQuery is the GCP-recommended approach for detailed cost analysis and visualization across multiple billing accounts. Looker Studio (formerly Data Studio) can connect to BigQuery for dashboards. Billing Account Viewer (A) provides UI access but not centralized analysis capabilities. Cloud Monitoring (C) does not provide billing cost visibility. Cloud Asset Inventory (D) tracks resource configurations, not billing costs.",
        },
      ],
    },

    // ─── Domain 2: Planning and Configuring a Cloud Solution (20%) ──
    {
      id: "domain-2",
      title: "Planning and Configuring a Cloud Solution",
      weight: "20%",
      order: 2,
      summary:
        "This domain evaluates your ability to plan and configure compute, storage, networking, and data solutions on GCP. You must select the appropriate service for a given workload — knowing when to use Compute Engine vs. GKE vs. Cloud Run vs. App Engine, and which storage class or database fits the access pattern.\n\nExpect questions on pricing and cost estimation using the **Pricing Calculator**, capacity planning, choosing machine types, configuring load balancers, and planning network topology including Shared VPC and VPC peering. You should understand the tradeoffs between different storage options: Cloud Storage classes, Persistent Disk vs. Filestore, and managed databases.\n\nThis domain rewards candidates who can match business requirements to the right GCP services — understanding not just what services do, but when each is the right choice over alternatives.",
      keyConceptsForExam: [
        "**Compute options** — Compute Engine (IaaS), GKE (containers), Cloud Run (serverless containers), App Engine (PaaS), Cloud Functions (FaaS)",
        "**Machine types** — general-purpose (N2, E2), compute-optimized (C2), memory-optimized (M2), custom machine types",
        "**Cloud Storage classes** — Standard, Nearline (30-day), Coldline (90-day), Archive (365-day); retrieval costs vs. storage costs",
        "**Database selection** — Cloud SQL (relational), Cloud Spanner (globally distributed), Firestore (document), Bigtable (wide-column), Memorystore (cache)",
        "**Load balancing types** — Global HTTP(S), Regional TCP/UDP, Internal HTTP(S), Internal TCP/UDP; backends and health checks",
        "**Networking** — Shared VPC vs. VPC Peering, Cloud NAT, Cloud DNS, Cloud CDN, Cloud Interconnect vs. Cloud VPN",
        "**GCP Pricing Calculator** — estimating costs before deployment; committed use discounts vs. sustained use discounts",
        "**Preemptible / Spot VMs** — up to 91% cost savings; suitable for fault-tolerant, batch workloads",
      ],
      examTips: [
        "Service selection questions follow a pattern: **serverless (no infrastructure management) > managed (some control) > self-managed (full control)**. Choose the highest abstraction that meets the requirement.",
        "Cloud Storage class questions: match the minimum storage duration to the access frequency. Nearline = once/month, Coldline = once/quarter, Archive = once/year.",
        "When a question mentions 'global' or 'multi-region' traffic, look for **Global HTTP(S) Load Balancer** — it's the only option that distributes traffic across regions from a single anycast IP.",
        "Preemptible/Spot VMs can be terminated with 30-second notice — only correct for batch jobs, not stateful applications or databases.",
        "Cloud Spanner is correct when the requirement includes 'global', 'relational', 'strong consistency', and 'unlimited scale' in the same sentence.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "gce-basics", title: "Compute Engine" },
        { cloud: "gcp", topicId: "gke-basics", title: "Google Kubernetes Engine" },
        { cloud: "gcp", topicId: "cloud-storage-basics", title: "Cloud Storage" },
      ],
      sections: [
        {
          heading: "Choosing the Right Compute Service",
          body: "GCP offers a spectrum of compute services. **Compute Engine** provides full control over VMs with custom machine types, perfect for lift-and-shift migrations or workloads needing specific OS configurations. **GKE** manages Kubernetes clusters and is ideal for containerized microservices needing orchestration. **Cloud Run** runs containers serverlessly — no cluster management, scales to zero, billed per request.\n\n**App Engine** is a fully managed PaaS for web applications. Standard environment auto-scales to zero; Flexible environment runs in containers and supports custom runtimes. **Cloud Functions** executes individual event-driven functions with no server management.\n\nThe decision tree for the exam: if the question mentions Kubernetes or containers with full control → GKE. If it mentions 'serverless containers' or 'scale to zero' → Cloud Run. If it mentions 'event-driven' or 'trigger' → Cloud Functions. If it requires VM-level control → Compute Engine.",
          code: {
            lang: "bash",
            label: "Deploy a container to Cloud Run",
            snippet: `# Deploy a container image to Cloud Run (serverless)
gcloud run deploy my-service \\
  --image=gcr.io/my-app-prod/my-service:latest \\
  --region=us-central1 \\
  --platform=managed \\
  --allow-unauthenticated \\
  --memory=512Mi \\
  --concurrency=80`,
          },
        },
        {
          heading: "Storage and Database Selection",
          body: "GCP storage selection depends on data structure and access patterns. **Cloud Storage** is object storage for unstructured data — choose Standard for frequently accessed data, Nearline for monthly access, Coldline for quarterly access, and Archive for annual access (e.g., compliance archives).\n\nFor databases: **Cloud SQL** (MySQL, PostgreSQL, SQL Server) is the managed relational option for OLTP workloads. **Cloud Spanner** adds global distribution and horizontal scaling for relational data requiring 99.999% availability. **Firestore** is a serverless document database ideal for mobile/web apps. **Bigtable** handles high-throughput analytics and IoT data at petabyte scale. **Memorystore** provides managed Redis or Memcached for caching.\n\n**Persistent Disk** (SSD or HDD) is block storage attached to Compute Engine VMs. **Filestore** provides managed NFS file shares for workloads requiring shared file system access.",
        },
        {
          heading: "Network Planning and Load Balancing",
          body: "GCP's **Global HTTP(S) Load Balancer** distributes traffic across regions using a single anycast IP, with integrated Cloud CDN and Cloud Armor for DDoS protection. **Regional External TCP/UDP Load Balancer** handles non-HTTP protocols. **Internal Load Balancers** handle traffic within your VPC.\n\n**Cloud NAT** provides outbound internet access for VMs in private subnets without external IP addresses. **Cloud VPN** creates encrypted tunnels to on-premises networks (up to 3 Gbps). **Cloud Interconnect** provides dedicated physical connections (10/100 Gbps) for high-throughput, low-latency hybrid connectivity.\n\n**VPC Peering** connects two VPCs without transitive routing — each peering pair must be explicitly configured. **Shared VPC** centralizes network management in a host project, making it preferable for enterprise environments where network governance is important.",
          code: {
            lang: "bash",
            label: "Create a global HTTP(S) load balancer backend service",
            snippet: `# Create an instance group as backend
gcloud compute instance-groups managed create web-ig \\
  --template=web-template \\
  --size=3 \\
  --zone=us-central1-a

# Create a backend service
gcloud compute backend-services create web-backend \\
  --protocol=HTTP \\
  --health-checks=http-basic-check \\
  --global

# Add the instance group to the backend service
gcloud compute backend-services add-backend web-backend \\
  --instance-group=web-ig \\
  --instance-group-zone=us-central1-a \\
  --global`,
          },
        },
      ],
      quiz: [
        {
          id: "ace-d2-q1",
          question:
            "A startup wants to deploy a web API that handles variable traffic, scales to zero when idle, and requires no infrastructure management. Which GCP service is MOST appropriate?",
          options: [
            "A) Compute Engine with managed instance groups.",
            "B) Google Kubernetes Engine (GKE) Autopilot.",
            "C) Cloud Run.",
            "D) App Engine Flexible Environment.",
          ],
          correctIndex: 2,
          explanation:
            "Cloud Run runs containerized applications serverlessly, scales to zero automatically, and requires no infrastructure management. GKE Autopilot (B) manages nodes but still requires cluster-level configuration and doesn't scale to zero. Compute Engine (A) requires infrastructure management. App Engine Flexible (D) runs containers but has a minimum of one instance and doesn't scale to zero.",
        },
        {
          id: "ace-d2-q2",
          question:
            "A data archival system stores compliance documents that are accessed once a year for audits. Which Cloud Storage class minimizes storage cost?",
          options: [
            "A) Standard",
            "B) Nearline",
            "C) Coldline",
            "D) Archive",
          ],
          correctIndex: 3,
          explanation:
            "Archive storage has the lowest per-GB storage cost and is designed for data accessed at most once a year. It has a 365-day minimum storage duration and the highest retrieval cost, which is acceptable for annual audits. Nearline (B) is for monthly access, Coldline (C) for quarterly. Standard (A) has no retrieval cost but the highest storage cost.",
        },
        {
          id: "ace-d2-q3",
          question:
            "An application needs a relational database that can scale globally across multiple regions with strong consistency and five-nines availability. Which GCP database service should be used?",
          options: [
            "A) Cloud SQL with read replicas in multiple regions.",
            "B) Cloud Spanner.",
            "C) Firestore in Datastore mode.",
            "D) Bigtable with cross-region replication.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Spanner is the only GCP database offering globally distributed, strongly consistent relational data with 99.999% availability SLA. Cloud SQL (A) supports cross-region read replicas but the primary is single-region and failover is not automatic across regions. Firestore (C) is a document database, not relational. Bigtable (D) is a wide-column NoSQL store, not relational.",
        },
        {
          id: "ace-d2-q4",
          question:
            "A batch processing job runs 8 hours per day and is fault-tolerant — it can resume from a checkpoint if interrupted. Which compute option provides the GREATEST cost savings?",
          options: [
            "A) On-demand N2 standard instances.",
            "B) Committed use discount (1-year) on N2 instances.",
            "C) Spot VMs (preemptible).",
            "D) Custom machine types with sustained use discounts.",
          ],
          correctIndex: 2,
          explanation:
            "Spot VMs (formerly Preemptible VMs) offer up to 91% discount compared to on-demand pricing and are ideal for fault-tolerant batch workloads that can checkpoint and resume. Since the job can survive interruption, the preemption risk is acceptable. Committed use discounts (B) require 1 or 3 year commitments and don't match per-hour batch needs. Custom types with SUDs (D) offer smaller discounts.",
        },
        {
          id: "ace-d2-q5",
          question:
            "A global e-commerce platform needs to serve millions of users across North America, Europe, and Asia with sub-50ms latency. Which load balancing option should be used?",
          options: [
            "A) Regional External TCP/UDP Load Balancer in us-central1.",
            "B) Global HTTP(S) Load Balancer with backends in multiple regions.",
            "C) Internal HTTP(S) Load Balancer across VPC peering.",
            "D) Cloud DNS latency-based routing to regional load balancers.",
          ],
          correctIndex: 1,
          explanation:
            "The Global HTTP(S) Load Balancer uses a single anycast IP to route users to the nearest healthy backend region, minimizing latency. It integrates with Cloud CDN and Cloud Armor. A regional load balancer (A) only serves users in one region. Internal LB (C) is for private VPC traffic. DNS-based routing (D) has higher latency and doesn't provide true global load balancing.",
        },
        {
          id: "ace-d2-q6",
          question:
            "Which GCP network service provides outbound internet connectivity for VMs that do NOT have external IP addresses?",
          options: [
            "A) Cloud VPN",
            "B) Cloud Interconnect",
            "C) Cloud NAT",
            "D) Cloud Armor",
          ],
          correctIndex: 2,
          explanation:
            "Cloud NAT (Network Address Translation) enables VMs in private subnets (without external IPs) to make outbound connections to the internet. Cloud VPN (A) connects to on-premises networks via encrypted tunnels. Cloud Interconnect (B) provides dedicated physical connectivity to on-premises. Cloud Armor (D) is a DDoS protection and WAF service.",
        },
        {
          id: "ace-d2-q7",
          question:
            "An application requires shared file system access (NFS protocol) for multiple Compute Engine VMs in the same region. Which GCP storage solution should be used?",
          options: [
            "A) Cloud Storage with FUSE adapter.",
            "B) Persistent Disk in multi-writer mode.",
            "C) Filestore.",
            "D) Cloud SQL with file storage extensions.",
          ],
          correctIndex: 2,
          explanation:
            "Filestore provides managed NFS file shares that can be mounted by multiple Compute Engine VMs simultaneously. It is designed for shared file system workloads. Cloud Storage with FUSE (A) is possible but has higher latency and POSIX limitations. Persistent Disk multi-writer (B) supports up to 2 VMs but with restrictions. Cloud SQL (D) is a relational database, not file storage.",
        },
        {
          id: "ace-d2-q8",
          question:
            "A team wants to estimate the monthly cost of a new GCP deployment before provisioning any resources. What should they use?",
          options: [
            "A) Cloud Billing reports in the Console.",
            "B) GCP Pricing Calculator.",
            "C) Cloud Asset Inventory cost analysis.",
            "D) BigQuery billing export from an existing project.",
          ],
          correctIndex: 1,
          explanation:
            "The GCP Pricing Calculator allows you to configure services and quantities before deployment and receive an estimated monthly cost. Cloud Billing reports (A) show actual spend for existing resources. Cloud Asset Inventory (C) tracks what resources exist. BigQuery billing export (D) analyzes historical costs, not future estimates.",
        },
        {
          id: "ace-d2-q9",
          question:
            "Two GCP projects in the same organization need to share resources. One project has a sensitive production database. The network team wants centralized control of the VPC. What is the BEST solution?",
          options: [
            "A) VPC Peering between the two projects.",
            "B) Shared VPC with one project as the host.",
            "C) Create a VPN tunnel between the two VPCs.",
            "D) Use Cloud Interconnect to connect the two projects.",
          ],
          correctIndex: 1,
          explanation:
            "Shared VPC centralizes network resources (subnets, firewall rules) in a host project and allows service projects to use those subnets. This provides centralized network governance while allowing different teams to manage their service projects independently. VPC Peering (A) connects VPCs but each project still manages its own network. VPN (C) and Interconnect (D) are for connecting to external/on-premises networks.",
        },
        {
          id: "ace-d2-q10",
          question:
            "A mobile application backend uses Firestore. The development team wants an in-memory cache to reduce Firestore reads and lower costs. Which GCP service should they add?",
          options: [
            "A) Bigtable",
            "B) Cloud SQL",
            "C) Memorystore for Redis",
            "D) Cloud Storage",
          ],
          correctIndex: 2,
          explanation:
            "Memorystore for Redis is GCP's managed in-memory cache service, purpose-built for caching use cases. It reduces database read load and improves application response times. Bigtable (A) is a wide-column NoSQL database, not a cache. Cloud SQL (B) is relational database. Cloud Storage (D) is object storage with much higher latency than in-memory caching.",
        },
        {
          id: "ace-d2-q11",
          question:
            "A company is migrating on-premises workloads that require Windows Server licensing. They want to avoid purchasing new licenses. Which Compute Engine feature helps?",
          options: [
            "A) Custom machine types with reduced vCPU count.",
            "B) Sole-tenant nodes with BYOL (Bring Your Own License).",
            "C) Preemptible Windows VMs.",
            "D) Committed use discounts on Windows instances.",
          ],
          correctIndex: 1,
          explanation:
            "Sole-tenant nodes allow you to bring your existing Windows Server licenses (BYOL) to GCP through Microsoft License Mobility or dedicated physical servers, avoiding double-licensing costs. Custom machine types (A) reduce cost but still require GCP Windows licensing. Preemptible VMs (C) may not support BYOL scenarios. Committed use discounts (D) apply to CPU/RAM costs, not licensing.",
        },
        {
          id: "ace-d2-q12",
          question:
            "An IoT application collects millions of sensor readings per second and needs to store and analyze them. Which GCP database is MOST appropriate?",
          options: [
            "A) Cloud SQL",
            "B) Firestore",
            "C) Cloud Spanner",
            "D) Bigtable",
          ],
          correctIndex: 3,
          explanation:
            "Bigtable is designed for high-throughput, low-latency read/write operations on large volumes of structured data — ideal for IoT time-series data. It scales to petabytes with sub-10ms latency. Cloud SQL (A) and Spanner (C) are relational databases not optimized for high-volume time-series workloads. Firestore (B) is a document database suitable for mobile/web apps, not IoT sensor streams.",
        },
        {
          id: "ace-d2-q13",
          question:
            "A company wants to connect their on-premises data center to GCP with a dedicated 10 Gbps private connection. Which service should they use?",
          options: [
            "A) Cloud VPN with HA VPN configuration.",
            "B) Cloud Interconnect — Dedicated Interconnect.",
            "C) Cloud Interconnect — Partner Interconnect.",
            "D) Cloud VPN with static routing.",
          ],
          correctIndex: 1,
          explanation:
            "Dedicated Interconnect provides a direct physical connection between your on-premises network and GCP at 10 Gbps or 100 Gbps. It offers lower latency and more predictable performance than VPN. Partner Interconnect (C) is used when you connect through a service provider, not directly. Cloud VPN (A, D) is encrypted and limited to about 3 Gbps aggregate throughput.",
        },
        {
          id: "ace-d2-q14",
          question:
            "Which GCP load balancer type is appropriate for routing TCP traffic to backends within a single VPC, accessible only from internal resources?",
          options: [
            "A) Global HTTP(S) Load Balancer",
            "B) External Regional TCP/UDP Load Balancer",
            "C) Internal TCP/UDP Load Balancer",
            "D) Cloud CDN with regional backend",
          ],
          correctIndex: 2,
          explanation:
            "The Internal TCP/UDP Load Balancer distributes TCP/UDP traffic to backends within the same VPC network, accessible only from internal IPs. It is not accessible from the internet. Global HTTP(S) LB (A) is external and handles HTTP/HTTPS. External Regional TCP/UDP LB (B) is internet-facing. Cloud CDN (D) is a content delivery network, not a load balancer for internal services.",
        },
        {
          id: "ace-d2-q15",
          question:
            "A company uses Cloud SQL for their production database and wants to reduce latency for read-heavy reporting queries without affecting production traffic. What should they add?",
          options: [
            "A) A second Cloud SQL primary instance with synchronous replication.",
            "B) Cloud SQL read replicas in the same or different region.",
            "C) Bigtable as a read cache for Cloud SQL.",
            "D) Cloud CDN to cache database query results.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud SQL read replicas offload read traffic from the primary instance. Reporting queries can be directed to replicas, reducing latency and protecting production OLTP performance. A second primary (A) does not replicate automatically and is not for read scaling. Bigtable (C) is not designed to act as a cache for Cloud SQL. Cloud CDN (D) caches HTTP responses, not database query results.",
        },
      ],
    },

    // ─── Domain 3: Deploying and Implementing a Cloud Solution (25%) ─
    {
      id: "domain-3",
      title: "Deploying and Implementing a Cloud Solution",
      weight: "25%",
      order: 3,
      summary:
        "This is the heaviest domain on the ACE exam, focusing on hands-on deployment skills. You must know how to deploy and configure VMs, managed instance groups, GKE clusters, Cloud Run services, Cloud Functions, and networking components using `gcloud`, the Console, and Deployment Manager or Terraform.\n\nExpect questions on creating and managing Compute Engine instances (startup scripts, instance templates, managed instance groups with autoscaling), deploying containerized applications to GKE (creating clusters, deploying workloads with `kubectl`, configuring Ingress), and configuring storage buckets with lifecycle policies.\n\nThis domain also covers Cloud Build for CI/CD, deploying App Engine applications, and working with Cloud SQL and Cloud Storage. Hands-on experience with `gcloud` and `kubectl` commands is essential — many questions describe a task and ask which command achieves it.",
      keyConceptsForExam: [
        "**Compute Engine** — instance templates, managed instance groups, startup scripts, metadata, autoscaling policies",
        "**GKE** — cluster creation (`gcloud container clusters create`), `kubectl apply`, Deployments, Services, Ingress, Horizontal Pod Autoscaler",
        "**Cloud Run** — deploying from container registry, revision management, traffic splitting, environment variables",
        "**Cloud Functions** — trigger types (HTTP, Pub/Sub, Cloud Storage), runtime selection, environment variables",
        "**Cloud Storage** — bucket creation, object lifecycle rules, versioning, signed URLs, uniform bucket-level access",
        "**Cloud SQL** — instance creation, database initialization, private IP configuration, authorized networks",
        "**Cloud Build** — build triggers, `cloudbuild.yaml` structure, substitution variables, artifact storage",
        "**Deployment Manager / Terraform** — infrastructure as code for repeatable deployments",
      ],
      examTips: [
        "For Compute Engine questions, if the scenario involves 'automatically adding or removing instances based on load,' the answer involves **managed instance groups with autoscaling** — not manual instance management.",
        "GKE questions often test the difference between a `Deployment` (manages pods) and a `Service` (exposes pods). A `LoadBalancer` Service type creates an external IP; `ClusterIP` is internal only.",
        "Cloud Run `--allow-unauthenticated` flag is required to make a service publicly accessible. Without it, only authenticated callers can invoke the service.",
        "Cloud Storage lifecycle rules are the correct answer whenever a question mentions 'automatically move to cheaper storage after X days' or 'automatically delete after Y days'.",
        "Cloud Build triggers respond to `git push` events — connecting Cloud Source Repositories, GitHub, or GitLab repositories to automate builds and deployments.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "gke-basics", title: "Google Kubernetes Engine" },
        { cloud: "gcp", topicId: "gce-basics", title: "Compute Engine" },
        { cloud: "gcp", topicId: "cloud-storage-basics", title: "Cloud Storage" },
      ],
      sections: [
        {
          heading: "Compute Engine — Instance Groups and Autoscaling",
          body: "**Managed Instance Groups (MIGs)** maintain a set of identical VMs based on an instance template. They support autoscaling based on CPU utilization, HTTP load balancing capacity, Cloud Monitoring metrics, or Cloud Pub/Sub queue depth.\n\nInstance templates define the machine type, boot disk, network, startup script, and metadata for VMs in the group. Updating a MIG's template and performing a rolling update or canary deployment allows zero-downtime upgrades.\n\n**Startup scripts** run at VM boot time and can install software, configure applications, or pull secrets from Secret Manager. Metadata key-value pairs pass configuration to VMs at launch time. Health checks determine whether instances are healthy enough to receive traffic.",
          code: {
            lang: "bash",
            label: "Create an instance template and managed instance group",
            snippet: `# Create an instance template
gcloud compute instance-templates create web-template \\
  --machine-type=e2-medium \\
  --image-family=debian-12 \\
  --image-project=debian-cloud \\
  --metadata=startup-script='#!/bin/bash
apt-get update && apt-get install -y nginx
systemctl start nginx' \\
  --tags=http-server

# Create a managed instance group
gcloud compute instance-groups managed create web-mig \\
  --template=web-template \\
  --size=3 \\
  --region=us-central1

# Configure autoscaling
gcloud compute instance-groups managed set-autoscaling web-mig \\
  --region=us-central1 \\
  --min-num-replicas=2 \\
  --max-num-replicas=10 \\
  --target-cpu-utilization=0.7`,
          },
        },
        {
          heading: "GKE Cluster Deployment and Workload Management",
          body: "**GKE** provides managed Kubernetes clusters. **Standard mode** gives full control over node configuration; **Autopilot mode** manages nodes automatically and charges per-pod rather than per-node.\n\nAfter creating a cluster, authenticate `kubectl` using `gcloud container clusters get-credentials`. Deploy applications using `kubectl apply -f deployment.yaml`. A **Deployment** manages a set of pod replicas with rolling update support. A **Service** of type `LoadBalancer` creates an external IP via a GCP load balancer. An **Ingress** resource routes HTTP traffic to multiple services based on URL rules.\n\n**Horizontal Pod Autoscaler (HPA)** adjusts the number of pod replicas based on CPU or custom metrics. Combining HPA with cluster autoscaling (node auto-provisioning) provides full vertical and horizontal scaling.",
          code: {
            lang: "bash",
            label: "Create a GKE cluster and deploy a workload",
            snippet: `# Create a GKE cluster in Autopilot mode
gcloud container clusters create-auto my-cluster \\
  --region=us-central1 \\
  --project=my-app-prod

# Authenticate kubectl
gcloud container clusters get-credentials my-cluster \\
  --region=us-central1 \\
  --project=my-app-prod

# Deploy an application
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: gcr.io/my-app-prod/my-app:latest
        ports:
        - containerPort: 8080
EOF`,
          },
        },
        {
          heading: "Cloud Storage — Lifecycle and Access Configuration",
          body: "**Cloud Storage** buckets store objects (files) of any type. Key configuration options include **versioning** (preserve previous object versions), **lifecycle rules** (transition objects to cheaper storage classes or delete them after a specified age), and **uniform bucket-level access** (disable object-level ACLs, enforce IAM-only access).\n\nFor public static websites, Cloud Storage can serve objects directly via HTTP. **Signed URLs** provide time-limited, authenticated access to private objects without requiring the caller to have a Google account.\n\n**Transfer Service** imports data from other cloud providers or on-premises sources. **Storage Transfer** and `gsutil rsync` handle ongoing synchronization. Multi-region and dual-region buckets replicate data geographically for higher availability.",
          code: {
            lang: "bash",
            label: "Create a bucket with lifecycle rules",
            snippet: `# Create a multi-region bucket
gsutil mb -l US gs://my-app-data-prod

# Enable versioning
gsutil versioning set on gs://my-app-data-prod

# Apply lifecycle rule: move to Nearline after 30 days, delete after 365 days
cat > lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 30}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
EOF
gsutil lifecycle set lifecycle.json gs://my-app-data-prod`,
          },
        },
      ],
      quiz: [
        {
          id: "ace-d3-q1",
          question:
            "A web application runs on a managed instance group. Traffic is increasing and instances are reaching 85% CPU. The operations team wants instances to be added automatically when CPU exceeds 70%. What should be configured?",
          options: [
            "A) A Cloud Monitoring alert that triggers a Cloud Function to add instances.",
            "B) Autoscaling on the managed instance group with a CPU target of 70%.",
            "C) A cron job that checks CPU every 5 minutes and adjusts instance count.",
            "D) Increase the machine type of existing instances to handle more load.",
          ],
          correctIndex: 1,
          explanation:
            "MIG autoscaling natively supports CPU utilization targets — it adds or removes instances to maintain the target CPU utilization. This is the built-in, zero-code solution. Cloud Monitoring + Cloud Function (A) is possible but requires custom code and introduces latency. A cron job (C) is not real-time. Increasing machine type (D) requires stopping instances and does not scale automatically.",
        },
        {
          id: "ace-d3-q2",
          question:
            "A developer needs to connect `kubectl` to an existing GKE cluster named `prod-cluster` in `us-east1`. Which command achieves this?",
          options: [
            "A) `kubectl config use-context prod-cluster`",
            "B) `gcloud container clusters get-credentials prod-cluster --region=us-east1`",
            "C) `gcloud container clusters connect prod-cluster --zone=us-east1`",
            "D) `kubectl set-credentials --cluster=prod-cluster --region=us-east1`",
          ],
          correctIndex: 1,
          explanation:
            "`gcloud container clusters get-credentials` fetches cluster credentials and configures `kubectl` to connect to the specified GKE cluster. It automatically updates the kubeconfig file. Option A uses an existing context but doesn't retrieve credentials. Option C is not a valid gcloud command. Option D is not a valid kubectl command.",
        },
        {
          id: "ace-d3-q3",
          question:
            "A Cloud Storage bucket contains log files that should be deleted automatically after 90 days. What is the CORRECT approach?",
          options: [
            "A) Write a Cloud Function triggered daily to delete objects older than 90 days.",
            "B) Configure a lifecycle rule on the bucket to delete objects with age > 90.",
            "C) Enable versioning and set the number of versions to 90.",
            "D) Use Cloud Scheduler to run a gsutil script that deletes old files.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Storage lifecycle rules are the purpose-built feature for automatic object deletion or storage class transitions based on age, creation date, or other conditions. They require no custom code and are evaluated by GCP automatically. Cloud Functions (A), versioning (C), and Cloud Scheduler (D) are all more complex alternatives that add operational overhead.",
        },
        {
          id: "ace-d3-q4",
          question:
            "A team wants to deploy a containerized microservice to Cloud Run that should only be invoked by other Cloud Run services in the same project. How should the service be deployed?",
          options: [
            "A) Deploy with `--allow-unauthenticated` and use VPC firewall rules to restrict access.",
            "B) Deploy without `--allow-unauthenticated` and have invoking services present an identity token.",
            "C) Deploy to a private GKE cluster and use an internal load balancer.",
            "D) Configure Cloud Armor to block all external requests.",
          ],
          correctIndex: 1,
          explanation:
            "Deploying Cloud Run without `--allow-unauthenticated` requires callers to present a valid Google identity token with the `roles/run.invoker` permission. Other Cloud Run services can use their service account identity to obtain and attach tokens. This is the native, recommended approach. Firewall rules (A) don't apply to Cloud Run (serverless). GKE (C) adds unnecessary complexity. Cloud Armor (D) applies to load balancers, not Cloud Run directly.",
        },
        {
          id: "ace-d3-q5",
          question:
            "A Compute Engine VM needs to pull container images from Artifact Registry in the same project. What is the MINIMUM required IAM configuration?",
          options: [
            "A) Grant the VM's service account `roles/artifactregistry.reader`.",
            "B) Grant the VM's service account `roles/owner`.",
            "C) Make the Artifact Registry repository public.",
            "D) Create and download a service account key and configure Docker manually.",
          ],
          correctIndex: 0,
          explanation:
            "`roles/artifactregistry.reader` grants read-only access to pull container images from Artifact Registry, following the principle of least privilege. The VM uses its attached service account identity automatically. Owner role (B) is far too broad. Public repositories (C) expose images to everyone. Downloading a key (D) is an anti-pattern when the VM already has an attached service account.",
        },
        {
          id: "ace-d3-q6",
          question:
            "A GKE Deployment currently runs 3 replicas. Traffic has increased significantly and the team wants to scale to 10 replicas immediately. Which command achieves this?",
          options: [
            "A) `gcloud container clusters resize my-cluster --num-nodes=10`",
            "B) `kubectl scale deployment my-app --replicas=10`",
            "C) `kubectl autoscale deployment my-app --max=10`",
            "D) `gcloud container node-pools update my-pool --num-nodes=10`",
          ],
          correctIndex: 1,
          explanation:
            "`kubectl scale deployment my-app --replicas=10` immediately sets the desired replica count for the Deployment. `gcloud container clusters resize` (A) adjusts the number of nodes in the cluster, not pod replicas. `kubectl autoscale` (C) sets up a Horizontal Pod Autoscaler for automatic scaling, not an immediate manual scale. `gcloud container node-pools update` (D) also manages nodes, not pods.",
        },
        {
          id: "ace-d3-q7",
          question:
            "A Cloud Build pipeline builds a Docker image and needs to push it to Artifact Registry. Which IAM role should be granted to the Cloud Build service account?",
          options: [
            "A) `roles/artifactregistry.reader`",
            "B) `roles/artifactregistry.writer`",
            "C) `roles/artifactregistry.admin`",
            "D) `roles/storage.admin`",
          ],
          correctIndex: 1,
          explanation:
            "`roles/artifactregistry.writer` grants permission to push (write) images to Artifact Registry while still following least privilege — it does not grant delete or administrative permissions. Reader (A) only allows pulling. Admin (C) grants full control including deletion, which exceeds the required permissions. Storage Admin (D) applies to Cloud Storage buckets, not Artifact Registry.",
        },
        {
          id: "ace-d3-q8",
          question:
            "A team wants Cloud Build to automatically trigger a build whenever code is pushed to the `main` branch of their GitHub repository. What must be configured?",
          options: [
            "A) A Cloud Scheduler job that polls GitHub every 5 minutes.",
            "B) A Cloud Build trigger connected to the GitHub repository, filtered to the main branch.",
            "C) A GitHub Actions workflow that calls the Cloud Build API.",
            "D) A Pub/Sub subscription on GitHub push events.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Build triggers connect to source repositories (GitHub, GitLab, Cloud Source Repositories) and automatically start builds on specified events (push to branch, pull request, tag). This is the native, recommended CI/CD pattern. Cloud Scheduler polling (A) is not real-time and is unnecessarily complex. GitHub Actions calling Cloud Build (C) is a valid pattern but not the simplest approach. Pub/Sub (D) requires custom integration.",
        },
        {
          id: "ace-d3-q9",
          question:
            "A Cloud SQL instance should only accept connections from application servers in a specific VPC subnet, with no public internet access. How should this be configured?",
          options: [
            "A) Enable Public IP on the Cloud SQL instance and use authorized networks to whitelist the subnet CIDR.",
            "B) Enable Private IP on the Cloud SQL instance and configure VPC peering with the service networking API.",
            "C) Place the Cloud SQL instance in the same subnet as the application servers.",
            "D) Use Cloud VPN to tunnel from the application servers to the Cloud SQL instance.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud SQL Private IP assigns a private IP address within your VPC via VPC peering with the `servicenetworking.googleapis.com` API. This ensures no public internet exposure and allows application servers to connect over private RFC 1918 addresses. Public IP with authorized networks (A) still exposes the instance to the internet. Cloud SQL instances cannot be placed directly in user subnets (C). VPN (D) is for on-premises connectivity, not internal GCP traffic.",
        },
        {
          id: "ace-d3-q10",
          question:
            "A developer wants to provide a temporary, pre-authenticated link to a private Cloud Storage object for a customer to download for 24 hours. What should they use?",
          options: [
            "A) Make the object public and share the object URL.",
            "B) Grant the customer's Google account `roles/storage.objectViewer` temporarily.",
            "C) Generate a signed URL for the object with a 24-hour expiration.",
            "D) Create a Cloud CDN signed token for the object.",
          ],
          correctIndex: 2,
          explanation:
            "Signed URLs provide time-limited, authenticated access to Cloud Storage objects without requiring the recipient to have a Google account or IAM permissions. They are generated using a service account's private key or via the `signBlob` API. Making the object public (A) has no time limit. Granting IAM temporarily (B) requires manual revocation. Cloud CDN signed tokens (D) are for CDN-cached content, not general Cloud Storage access.",
        },
        {
          id: "ace-d3-q11",
          question:
            "A team needs to pass a database password to a Compute Engine VM at startup without hardcoding it in the instance template. What is the RECOMMENDED approach?",
          options: [
            "A) Store the password as an instance metadata value.",
            "B) Store the password in Secret Manager and retrieve it in the startup script using the VM's service account.",
            "C) Embed the password in the Docker image deployed to the VM.",
            "D) Set the password as an environment variable in the instance template.",
          ],
          correctIndex: 1,
          explanation:
            "Secret Manager is the GCP-recommended service for storing sensitive values like passwords, API keys, and certificates. The VM's service account can be granted `roles/secretmanager.secretAccessor` to retrieve secrets at startup. Metadata (A) is readable by anyone with access to the instance and is not encrypted for sensitive data. Embedding in images (C) creates a security anti-pattern. Environment variables in templates (D) are stored in plaintext.",
        },
        {
          id: "ace-d3-q12",
          question:
            "A GKE application needs to expose an HTTP service to external traffic and route requests to `/api/` to one Service and `/web/` to another. Which Kubernetes resource should be used?",
          options: [
            "A) Two separate LoadBalancer Services.",
            "B) A NodePort Service for each backend.",
            "C) An Ingress resource with path-based routing rules.",
            "D) A ClusterIP Service with Cloud Armor path filtering.",
          ],
          correctIndex: 2,
          explanation:
            "A Kubernetes Ingress resource provides HTTP(S) routing at Layer 7, allowing path-based and host-based routing rules to direct traffic to different backend Services from a single external IP. Two separate LoadBalancer Services (A) would create two external IPs. NodePort (B) exposes ports on nodes but doesn't provide path routing. ClusterIP (D) is internal only and Cloud Armor doesn't do Kubernetes path routing.",
        },
        {
          id: "ace-d3-q13",
          question:
            "An operations team wants to use infrastructure as code to deploy and manage GCP resources in a repeatable, version-controlled way. Which tools are supported on GCP? (Choose the BEST single answer.)",
          options: [
            "A) Cloud Deployment Manager only.",
            "B) Terraform only.",
            "C) Both Cloud Deployment Manager and Terraform are supported.",
            "D) Cloud Build YAML files as the only infrastructure-as-code option.",
          ],
          correctIndex: 2,
          explanation:
            "GCP supports both **Cloud Deployment Manager** (GCP-native IaC using YAML/Jinja2/Python) and **Terraform** (HashiCorp IaC with the Google provider). Terraform is widely used and recommended for multi-cloud environments. Cloud Build YAML defines CI/CD pipelines, not infrastructure. Both Deployment Manager and Terraform are valid choices and may appear in exam scenarios.",
        },
        {
          id: "ace-d3-q14",
          question:
            "A Cloud Function needs to process messages published to a Pub/Sub topic. Which trigger type should be configured?",
          options: [
            "A) HTTP trigger with the Pub/Sub topic URL as the endpoint.",
            "B) Cloud Storage trigger watching for new files in a bucket.",
            "C) Pub/Sub trigger subscribing to the specified topic.",
            "D) Cloud Scheduler trigger calling the function every minute.",
          ],
          correctIndex: 2,
          explanation:
            "Cloud Functions natively support Pub/Sub triggers — when a message is published to the specified topic, GCP automatically invokes the function with the message payload. HTTP triggers (A) require Pub/Sub to push to a URL, which is possible but the Pub/Sub trigger is simpler. Cloud Storage triggers (B) respond to object events. Cloud Scheduler (D) invokes functions on a time schedule, not on message events.",
        },
        {
          id: "ace-d3-q15",
          question:
            "A managed instance group is configured with a health check. An instance fails the health check three times consecutively. What action does the MIG take automatically?",
          options: [
            "A) The instance is marked unhealthy but continues to receive traffic.",
            "B) The MIG recreates the instance using the instance template.",
            "C) A Cloud Monitoring alert is sent but no automated action is taken.",
            "D) The instance is drained and removed, reducing the MIG size by one.",
          ],
          correctIndex: 1,
          explanation:
            "MIG autohealing automatically detects unhealthy instances (via failed health checks) and recreates them using the instance template to restore the desired state. This is the key self-healing capability of MIGs. The instance is not left running (A) or merely alerted on (C). The MIG maintains the desired instance count — it recreates, not removes, the instance (D is incorrect because the size is maintained).",
        },
      ],
    },

    // ─── Domain 4: Ensuring Successful Operation of a Cloud Solution (20%) ─
    {
      id: "domain-4",
      title: "Ensuring Successful Operation of a Cloud Solution",
      weight: "20%",
      order: 4,
      summary:
        "This domain covers monitoring, logging, and operating GCP resources effectively in production. You must know how to use **Cloud Monitoring** (formerly Stackdriver) to create dashboards, set alert policies, and define uptime checks. Understanding **Cloud Logging** — log sinks, log-based metrics, and log retention — is essential.\n\nExpect questions on managing Compute Engine instances (SSH access, resizing disks, taking snapshots), managing GKE workloads (`kubectl` operations, upgrading clusters), and configuring Cloud SQL backups and high availability. You should understand how to diagnose issues using logs and metrics.\n\nThis domain also tests knowledge of cost management: viewing billing reports, setting budgets, identifying cost optimization opportunities like rightsizing recommendations. Operations knowledge spans the full lifecycle from deployment through ongoing management and incident response.",
      keyConceptsForExam: [
        "**Cloud Monitoring** — metric alerts, uptime checks, dashboards, custom metrics from application code",
        "**Cloud Logging** — log sinks (BigQuery, Cloud Storage, Pub/Sub), log-based metrics, exclusion filters, retention periods",
        "**Cloud Trace and Cloud Profiler** — distributed tracing for latency analysis; profiling for CPU and memory optimization",
        "**GKE operations** — `kubectl get pods`, `kubectl logs`, `kubectl describe`, rolling updates, node pool upgrades",
        "**Compute Engine operations** — resizing persistent disks, snapshots, live migration, serial console access",
        "**Cloud SQL operations** — automated backups, point-in-time recovery, failover to standby replica, maintenance windows",
        "**Billing and cost management** — billing reports, cost breakdown by label, budget alerts, committed use discounts",
        "**Cloud Debugger / Error Reporting** — diagnosing application errors without stopping production; error tracking",
      ],
      examTips: [
        "Alert policy questions: **Cloud Monitoring** creates alerts based on metrics; **Cloud Logging** creates alerts based on log patterns. Know which to use for which scenario.",
        "Log sink destination determines retention: logs in **Cloud Storage** can be kept indefinitely; in **BigQuery** they can be queried with SQL; in **Pub/Sub** they can be forwarded to external systems in real time.",
        "For GKE troubleshooting questions: `kubectl describe pod` shows events and error messages; `kubectl logs pod-name` shows application stdout/stderr.",
        "Cloud SQL high availability (HA) creates a standby replica in another zone. Failover is automatic if the primary zone fails — this is different from read replicas.",
        "Persistent disk resizing: you can only **increase** disk size, not shrink it. After resizing the disk, you must also resize the partition and filesystem inside the OS.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "vpc-basics", title: "VPC Networking" },
        { cloud: "gcp", topicId: "gke-basics", title: "Google Kubernetes Engine" },
        { cloud: "gcp", topicId: "iam-overview", title: "IAM Overview" },
      ],
      sections: [
        {
          heading: "Cloud Monitoring and Alerting",
          body: "**Cloud Monitoring** collects metrics from GCP resources automatically and allows you to create custom metrics from application code. **Uptime checks** verify that public or internal endpoints are reachable. **Alert policies** trigger notifications via email, PagerDuty, Slack, or Pub/Sub when metrics exceed thresholds.\n\nOrganize monitoring with **dashboards** that combine charts for related metrics. Use **alerting policies** with multiple conditions and notification channels. For SLO-based monitoring, define **Service Level Objectives** and burn rate alerts to detect reliability degradation before SLOs are violated.\n\n**Cloud Logging** integrates with Monitoring to create **log-based metrics** — numeric counters or distributions derived from log entries. These metrics can then be used in alert policies like any other Cloud Monitoring metric.",
          code: {
            lang: "bash",
            label: "Create a Cloud Monitoring uptime check via gcloud",
            snippet: `# Create an HTTP uptime check
gcloud monitoring uptime-check-configs create http-check \\
  --display-name="Production API Health Check" \\
  --http-check-path="/healthz" \\
  --monitored-resource-type="uptime_url" \\
  --hostname="api.example.com" \\
  --period=60

# List existing uptime checks
gcloud monitoring uptime-check-configs list`,
          },
        },
        {
          heading: "Cloud Logging — Sinks and Retention",
          body: "**Cloud Logging** automatically captures logs from GCP services, VMs (via Logging agent), and applications. Logs are retained for different periods depending on log type: Admin Activity logs are retained 400 days; Data Access logs 30 days; system logs 30 days.\n\n**Log sinks** export logs to external destinations for longer retention or analysis: **Cloud Storage** (cheap long-term archival), **BigQuery** (SQL-based analysis), or **Pub/Sub** (real-time forwarding to SIEM or other systems).\n\n**Exclusion filters** reduce log volume and storage costs by discarding log entries that match specified criteria before storage. **Log-based metrics** extract numeric signals from log content — for example, counting 5xx errors to alert on error rate spikes.",
          code: {
            lang: "bash",
            label: "Create a log sink to Cloud Storage for audit logs",
            snippet: `# Create a log sink exporting Admin Activity logs to Cloud Storage
gcloud logging sinks create audit-archive \\
  storage.googleapis.com/my-audit-logs-bucket \\
  --log-filter='logName:"cloudaudit.googleapis.com%2Factivity"' \\
  --project=my-app-prod

# Grant the sink's writer identity access to the bucket
# (gcloud will output the writer identity after sink creation)
gsutil iam ch serviceAccount:SINK_WRITER@logging-XXXXX.iam.gserviceaccount.com:objectCreator \\
  gs://my-audit-logs-bucket`,
          },
        },
        {
          heading: "GKE and Compute Engine Operations",
          body: "For **GKE** operations, use `kubectl` to inspect workload health: `kubectl get pods` lists all pods with status; `kubectl describe pod POD_NAME` shows detailed events and conditions; `kubectl logs POD_NAME` streams stdout/stderr. For rolling updates, `kubectl set image deployment/my-app my-app=gcr.io/project/image:v2` triggers a rolling replacement of pods.\n\nFor **Compute Engine**, creating **snapshots** of persistent disks provides point-in-time backups. To resize a disk: `gcloud compute disks resize DISK_NAME --size=200GB` and then resize the partition/filesystem inside the OS. **Live migration** moves VMs between physical hosts during maintenance with no downtime.\n\nFor **Cloud SQL**, enabling **high availability** creates a synchronous standby in another zone. Enable **automated backups** and **binary logging** for point-in-time recovery. Scheduled maintenance windows control when GCP applies updates to the instance.",
        },
      ],
      quiz: [
        {
          id: "ace-d4-q1",
          question:
            "An operations team wants to be alerted when the CPU utilization of a Compute Engine instance exceeds 80% for more than 5 minutes. Where should this alert be configured?",
          options: [
            "A) Cloud Logging with a log-based metric filter for CPU events.",
            "B) Cloud Monitoring with an alert policy on the `compute.googleapis.com/instance/cpu/utilization` metric.",
            "C) Cloud Trace with a latency threshold alert.",
            "D) A Cloud Scheduler job that checks metrics via the API every 5 minutes.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Monitoring alert policies are the purpose-built solution for metric-based alerts. CPU utilization is a standard GCP metric available in Cloud Monitoring. Cloud Logging (A) captures log entries, not numeric metrics. Cloud Trace (C) measures request latency, not CPU. Cloud Scheduler polling (D) adds unnecessary complexity and latency.",
        },
        {
          id: "ace-d4-q2",
          question:
            "A security team requires that all Cloud Audit Logs be retained for 5 years for compliance. The default retention is 400 days. What is the BEST approach?",
          options: [
            "A) Change the Cloud Logging retention policy to 5 years (1825 days).",
            "B) Create a log sink to export Admin Activity logs to a Cloud Storage bucket with a retention policy of 5 years.",
            "C) Enable Cloud Logging Premium tier for extended retention.",
            "D) Copy logs manually to an archive bucket every month.",
          ],
          correctIndex: 1,
          explanation:
            "Log sinks to Cloud Storage can retain logs indefinitely with Object Lock for compliance. Cloud Storage costs less for long-term archival than Cloud Logging extended retention. Cloud Logging retention can be extended up to 3650 days (10 years) for some log types but a sink provides more flexibility and cost control. Option C is not a real GCP offering. Manual copying (D) is error-prone.",
        },
        {
          id: "ace-d4-q3",
          question:
            "A developer reports that a GKE pod is crashing repeatedly. Which kubectl command provides the most useful diagnostic information immediately?",
          options: [
            "A) `kubectl get pods`",
            "B) `kubectl describe pod POD_NAME`",
            "C) `kubectl delete pod POD_NAME`",
            "D) `kubectl apply -f deployment.yaml`",
          ],
          correctIndex: 1,
          explanation:
            "`kubectl describe pod` shows the pod's events, container states, restart count, last error messages, and resource-related issues like OOMKilled or ImagePullBackoff. `kubectl get pods` (A) only shows the pod status briefly. Deleting the pod (C) restarts it but doesn't diagnose the root cause. Reapplying the deployment (D) is not diagnostic.",
        },
        {
          id: "ace-d4-q4",
          question:
            "A Cloud SQL instance runs on a single zone. The team wants to protect against zone failure with automatic failover and minimal downtime. What should be enabled?",
          options: [
            "A) Cloud SQL read replicas in multiple zones.",
            "B) Cloud SQL high availability (HA) configuration.",
            "C) Cloud SQL cross-region replication.",
            "D) Cloud Spanner instead of Cloud SQL.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud SQL HA creates a synchronous standby instance in a different zone. If the primary zone fails, Cloud SQL automatically fails over to the standby, typically within 60 seconds. Read replicas (A) support read scaling and can be promoted manually but are not automatic failover. Cross-region replication (C) is for disaster recovery across regions, not zone-level HA. Switching to Spanner (D) is a significant migration, not an HA configuration.",
        },
        {
          id: "ace-d4-q5",
          question:
            "An application team wants to analyze their Cloud Logging logs using SQL queries over historical data. Which log sink destination should they configure?",
          options: [
            "A) Cloud Storage",
            "B) Pub/Sub",
            "C) BigQuery",
            "D) Cloud Monitoring",
          ],
          correctIndex: 2,
          explanation:
            "BigQuery is the correct destination for log sinks when the team needs to run SQL queries over historical log data. BigQuery supports complex analytical queries at scale. Cloud Storage (A) is for archival but requires downloading/parsing files for analysis. Pub/Sub (B) is for real-time streaming to external systems. Cloud Monitoring (D) is not a log sink destination.",
        },
        {
          id: "ace-d4-q6",
          question:
            "A Compute Engine instance's persistent disk is running out of space. The team needs to increase its size from 100 GB to 200 GB. What are the required steps?",
          options: [
            "A) Stop the VM, create a new 200 GB disk, copy data, then restart.",
            "B) Run `gcloud compute disks resize`, then resize the partition and filesystem inside the VM.",
            "C) Take a snapshot, restore to a 200 GB disk, and replace the instance.",
            "D) Persistent disk size cannot be changed after creation.",
          ],
          correctIndex: 1,
          explanation:
            "GCP supports online disk resizing — you can increase a persistent disk's size without stopping the VM using `gcloud compute disks resize`. After resizing the disk at the GCP level, you must also extend the partition and filesystem inside the OS (e.g., using `resize2fs` on Linux). Disk size can only be increased, not decreased.",
        },
        {
          id: "ace-d4-q7",
          question:
            "A team wants to track and alert on the number of HTTP 500 errors appearing in application logs. Which combination of Cloud Operations tools achieves this?",
          options: [
            "A) Cloud Trace metric extraction + Cloud Monitoring alert.",
            "B) Cloud Logging log-based metric + Cloud Monitoring alert policy.",
            "C) Cloud Error Reporting + Cloud Scheduler notification.",
            "D) BigQuery log export + Cloud Monitoring custom metric.",
          ],
          correctIndex: 1,
          explanation:
            "A log-based metric in Cloud Logging counts log entries matching a filter (e.g., `httpRequest.status>=500`). This metric appears in Cloud Monitoring and can be used in an alert policy. Cloud Trace (A) measures request latency, not error counts from logs. Cloud Error Reporting (C) aggregates errors but Cloud Scheduler is for scheduling, not alerting. BigQuery export (D) is for historical analysis, not real-time alerting.",
        },
        {
          id: "ace-d4-q8",
          question:
            "A team needs to SSH into a Compute Engine VM that has no external IP address. What is the RECOMMENDED approach?",
          options: [
            "A) Assign a temporary external IP to the VM, SSH, then remove the IP.",
            "B) Use Identity-Aware Proxy (IAP) TCP tunneling with `gcloud compute ssh`.",
            "C) Deploy a bastion host with an external IP and SSH through it.",
            "D) Use Cloud Shell with VPN to the internal network.",
          ],
          correctIndex: 1,
          explanation:
            "Identity-Aware Proxy (IAP) TCP tunneling allows `gcloud compute ssh` to connect to VMs without external IPs through an IAP-secured tunnel over HTTPS. This eliminates the need for a bastion host or external IP. Temporary IPs (A) create security exposure. A bastion host (C) is a valid approach but adds operational overhead. Cloud Shell VPN (D) is not a standard GCP pattern.",
        },
        {
          id: "ace-d4-q9",
          question:
            "An application deployed to GKE is experiencing slow response times. The team suspects a specific microservice has high latency. Which GCP tool should they use to identify the slow component?",
          options: [
            "A) Cloud Logging — search for slow log entries.",
            "B) Cloud Monitoring — check CPU metrics per pod.",
            "C) Cloud Trace — analyze distributed traces across microservices.",
            "D) Cloud Profiler — profile memory usage of each service.",
          ],
          correctIndex: 2,
          explanation:
            "Cloud Trace provides distributed tracing, showing the end-to-end latency of requests across multiple microservices. It identifies which service or component contributes most to latency. Cloud Logging (A) provides unstructured log data but not latency breakdowns. CPU metrics (B) identify compute-related bottlenecks, not latency sources. Cloud Profiler (D) identifies CPU/memory hotspots in code, not cross-service latency.",
        },
        {
          id: "ace-d4-q10",
          question:
            "A Cloud Run service is processing requests too slowly and the team suspects memory pressure. How can they increase the memory available to the service?",
          options: [
            "A) Create a new Cloud Run service with more memory and migrate traffic.",
            "B) Update the Cloud Run service revision with `--memory` flag to increase the memory limit.",
            "C) Deploy the service on GKE instead, where there are no memory limits.",
            "D) Enable Cloud Run autoscaling to add more instances.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Run service memory can be updated with `gcloud run services update SERVICE_NAME --memory=2Gi`. This deploys a new revision with the updated configuration. Creating a new service (A) is unnecessarily disruptive. GKE (C) does have memory limits per pod. Autoscaling (D) adds more instances but doesn't increase per-instance memory.",
        },
        {
          id: "ace-d4-q11",
          question:
            "An organization wants to identify which GCP projects are the highest cost contributors across their billing account. What is the EASIEST way to view this breakdown?",
          options: [
            "A) Cloud Asset Inventory — export all resources and calculate costs.",
            "B) Billing Reports in the Cloud Console — view cost breakdown by project.",
            "C) Write a BigQuery query against the billing export dataset.",
            "D) Cloud Monitoring — create a cost metric dashboard.",
          ],
          correctIndex: 1,
          explanation:
            "The Cloud Console Billing Reports page provides interactive cost breakdowns by project, service, label, and time period with no setup required. It is the fastest way to identify high-cost projects. Cloud Asset Inventory (A) tracks resources, not costs. BigQuery billing export (C) is more powerful but requires setup and query writing. Cloud Monitoring (D) does not provide billing cost data.",
        },
        {
          id: "ace-d4-q12",
          question:
            "A Compute Engine managed instance group needs to apply a new instance template to existing instances with zero downtime. Which update strategy should be used?",
          options: [
            "A) Delete all instances and let the MIG recreate them with the new template.",
            "B) Perform a rolling update with maxSurge=1 and maxUnavailable=0.",
            "C) Replace the MIG with a new one using the updated template.",
            "D) Manually update each instance's configuration one at a time.",
          ],
          correctIndex: 1,
          explanation:
            "A rolling update with `maxSurge=1` (one additional instance can be created) and `maxUnavailable=0` (no instance can be taken offline) ensures zero downtime by always maintaining the existing capacity while gradually replacing instances. Deleting all instances (A) causes downtime. Replacing the MIG (C) is disruptive. Manual updates (D) are error-prone and slow.",
        },
        {
          id: "ace-d4-q13",
          question:
            "A team wants to automatically receive recommendations to rightsize their Compute Engine VMs that are consistently underutilizing CPU. Where should they look?",
          options: [
            "A) Cloud Monitoring alerting policies.",
            "B) Recommender — VM rightsizing recommendations.",
            "C) Cloud Billing committed use discount analysis.",
            "D) Cloud Profiler CPU utilization reports.",
          ],
          correctIndex: 1,
          explanation:
            "GCP Recommender provides VM rightsizing recommendations based on historical usage patterns. It analyzes CPU and memory utilization and suggests moving to smaller or more appropriate machine types. Cloud Monitoring (A) alerts on conditions but doesn't provide rightsizing recommendations. Committed use discounts (C) are for cost optimization of sustained workloads. Cloud Profiler (D) analyzes application code performance.",
        },
        {
          id: "ace-d4-q14",
          question:
            "A Cloud SQL database needs to be restored to a specific point 6 hours ago due to accidental data deletion. What must be enabled on the Cloud SQL instance for this to be possible?",
          options: [
            "A) Automated backups only.",
            "B) Both automated backups and binary logging (point-in-time recovery).",
            "C) Cross-region replication with failover enabled.",
            "D) High availability (HA) configuration.",
          ],
          correctIndex: 1,
          explanation:
            "Point-in-time recovery (PITR) for Cloud SQL requires both **automated backups** (which provide recovery checkpoints) and **binary logging** (which records all transactions between backups). Together they allow recovery to any second within the backup retention window. Automated backups alone (A) only allow recovery to the backup timestamp. HA (D) and cross-region replication (C) provide availability, not point-in-time recovery.",
        },
        {
          id: "ace-d4-q15",
          question:
            "An operations team wants to monitor the availability of a public HTTPS endpoint and receive an alert if it becomes unreachable. Which Cloud Monitoring feature should they use?",
          options: [
            "A) A custom metric pushed from a Cloud Function that polls the endpoint.",
            "B) A Cloud Monitoring uptime check with an alert policy.",
            "C) VPC Flow Logs to detect failed connections.",
            "D) Cloud Trace to detect failed requests.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Monitoring uptime checks probe a URL from multiple global locations and report availability as a metric. An alert policy on the uptime check metric triggers notifications when the endpoint is unreachable. This is the built-in, purpose-designed feature for endpoint availability monitoring. A custom polling function (A) adds unnecessary operational overhead. VPC Flow Logs (C) capture network traffic within VPCs. Cloud Trace (D) analyzes distributed request latency.",
        },
      ],
    },

    // ─── Domain 5: Configuring Access and Security (15%) ────────────
    {
      id: "domain-5",
      title: "Configuring Access and Security",
      weight: "15%",
      order: 5,
      summary:
        "This domain focuses on GCP's IAM model and security controls. You must understand the three types of roles — **basic**, **predefined**, and **custom** — and when to use each. The exam tests your ability to grant minimum required permissions, manage service accounts, and configure organization policies.\n\nExpect questions on **service account** best practices (avoiding key downloads, using Workload Identity for GKE), **IAM conditions** for attribute-based access control, and **VPC Service Controls** for protecting sensitive data from exfiltration. You should understand how to audit access using Cloud Audit Logs.\n\nThis domain also covers **Secret Manager** for credential storage, **Cloud KMS** for encryption key management, and **Cloud Armor** for web application protection. Security concepts from the other domains are reinforced here with a focus on configuring controls rather than designing architectures.",
      keyConceptsForExam: [
        "**IAM roles** — basic (Owner/Editor/Viewer) vs. predefined (service-specific) vs. custom (user-defined); always prefer predefined over basic",
        "**Service accounts** — attached to VMs, GKE pods, Cloud Run services; avoid downloading JSON keys; use Workload Identity for GKE",
        "**Workload Identity** — allows GKE pods to impersonate GCP service accounts without key files",
        "**IAM conditions** — grant access only when specific attributes match (e.g., time of day, resource tag, IP range)",
        "**Organization Policy** — resource configuration constraints applied at org, folder, or project level",
        "**VPC Service Controls** — create security perimeters around GCP services to prevent data exfiltration",
        "**Secret Manager** — versioned secret storage with IAM-controlled access; automatic rotation integration",
        "**Cloud KMS** — customer-managed encryption keys (CMEK); key rings, key versions, rotation schedules",
      ],
      examTips: [
        "Always choose **predefined roles** over basic roles (Owner/Editor/Viewer) — the exam consistently rewards least-privilege answers.",
        "Service account key questions: if GCP-to-GCP communication is involved, **never recommend downloading a key** — use the attached service account or Workload Identity instead.",
        "Workload Identity is the GKE-specific answer for 'how to allow a pod to call GCP APIs without a service account key file.'",
        "Organization Policy vs. IAM: **IAM** controls who can do something; **Organization Policy** controls what can be done (regardless of who). They are complementary, not interchangeable.",
        "VPC Service Controls is the answer when a question mentions 'prevent data exfiltration' or 'restrict which GCP services can access a sensitive dataset.'",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "iam-overview", title: "IAM Overview" },
        { cloud: "gcp", topicId: "vpc-basics", title: "VPC Networking" },
        { cloud: "gcp", topicId: "gce-basics", title: "Compute Engine" },
      ],
      sections: [
        {
          heading: "IAM Role Types and Best Practices",
          body: "GCP IAM bindings associate a **principal** (user, service account, group, or domain) with a **role** (collection of permissions) on a **resource**. Three types of roles exist:\n\n- **Basic roles** (Owner, Editor, Viewer) are coarse-grained and grant broad permissions across all GCP services. They should be avoided in production environments.\n- **Predefined roles** are curated by Google for specific services (e.g., `roles/compute.instanceAdmin.v1`, `roles/storage.objectViewer`). They follow the principle of least privilege.\n- **Custom roles** allow you to define an exact set of permissions. Use when no predefined role matches your exact needs.\n\nBest practices: use **groups** rather than individual accounts in IAM bindings for easier management. Apply bindings at the **lowest resource level** possible (bucket, not project) to limit blast radius. Use **IAM conditions** for time-based or attribute-based access restrictions.",
          code: {
            lang: "bash",
            label: "Grant a predefined role and inspect IAM policy",
            snippet: `# Grant a predefined role to a user on a specific bucket
gsutil iam ch user:developer@example.com:roles/storage.objectViewer \\
  gs://my-app-data-prod

# Grant a role at the project level
gcloud projects add-iam-policy-binding my-app-prod \\
  --member="group:developers@example.com" \\
  --role="roles/compute.viewer"

# View the current IAM policy for a project
gcloud projects get-iam-policy my-app-prod \\
  --format=json`,
          },
        },
        {
          heading: "Service Accounts and Workload Identity",
          body: "**Service accounts** are non-human Google accounts used by applications, VMs, and GCP services to authenticate to GCP APIs. Best practices:\n\n- Create **dedicated service accounts** per application/workload — do not share service accounts.\n- Grant only the **minimum required roles** to each service account.\n- **Avoid downloading JSON keys** — use attached service accounts for Compute Engine, Cloud Run, and App Engine. For GKE, use Workload Identity.\n- **Workload Identity** binds a Kubernetes service account to a GCP service account, allowing pods to call GCP APIs without key files. It is the recommended approach for all GKE workloads.\n\nService account impersonation allows a user or service account to temporarily act as another service account using `roles/iam.serviceAccountTokenCreator` — useful for testing and limited-scope access.",
          code: {
            lang: "bash",
            label: "Configure Workload Identity for a GKE pod",
            snippet: `# Enable Workload Identity on a GKE cluster
gcloud container clusters update my-cluster \\
  --workload-pool=my-app-prod.svc.id.goog \\
  --region=us-central1

# Create a GCP service account
gcloud iam service-accounts create k8s-app-sa \\
  --project=my-app-prod

# Bind the Kubernetes SA to the GCP SA
gcloud iam service-accounts add-iam-policy-binding k8s-app-sa@my-app-prod.iam.gserviceaccount.com \\
  --role=roles/iam.workloadIdentityUser \\
  --member="serviceAccount:my-app-prod.svc.id.goog[default/my-ksa]"

# Annotate the Kubernetes service account
kubectl annotate serviceaccount my-ksa \\
  --namespace=default \\
  iam.gke.io/gcp-service-account=k8s-app-sa@my-app-prod.iam.gserviceaccount.com`,
          },
        },
        {
          heading: "Organization Policy and VPC Service Controls",
          body: "**Organization Policy** enforces resource configuration constraints regardless of IAM permissions. Common constraints include:\n- `constraints/compute.vmExternalIpAccess` — restrict which VMs can have external IPs\n- `constraints/iam.allowedPolicyMemberDomains` — restrict IAM bindings to specific domains\n- `constraints/compute.requireOsLogin` — require OS Login for all SSH access\n\n**VPC Service Controls** create security perimeters around GCP service APIs. Resources inside a perimeter can call each other, but services outside cannot access resources inside (preventing data exfiltration via compromised credentials). Use VPC SC for protecting BigQuery datasets, Cloud Storage buckets, and other sensitive data from exfiltration.\n\n**Cloud KMS** manages encryption keys as **key rings** containing **keys** with multiple **versions**. Enable **CMEK** (Customer-Managed Encryption Keys) to control which key encrypts BigQuery datasets, Cloud Storage buckets, and GKE secrets, with audit logs for every key usage.",
        },
      ],
      quiz: [
        {
          id: "ace-d5-q1",
          question:
            "A team member needs to list and view Compute Engine instances in a project but should NOT be able to start, stop, or modify them. Which role is MOST appropriate?",
          options: [
            "A) `roles/editor`",
            "B) `roles/compute.admin`",
            "C) `roles/compute.viewer`",
            "D) `roles/viewer`",
          ],
          correctIndex: 2,
          explanation:
            "`roles/compute.viewer` grants read-only access to Compute Engine resources — exactly the permissions needed to list and view instances. `roles/editor` (A) grants write access to all services. `roles/compute.admin` (B) grants full control over Compute Engine. `roles/viewer` (D) grants read-only access across all GCP services, which is broader than necessary.",
        },
        {
          id: "ace-d5-q2",
          question:
            "A GKE pod needs to read secrets from Secret Manager without downloading a service account key. What is the RECOMMENDED approach?",
          options: [
            "A) Mount the service account JSON key as a Kubernetes Secret and configure the Secret Manager client library to use it.",
            "B) Use Workload Identity to bind the pod's Kubernetes service account to a GCP service account with `roles/secretmanager.secretAccessor`.",
            "C) Store the Secret Manager secret value directly in a Kubernetes ConfigMap.",
            "D) Grant the GKE node pool's service account access to all secrets in the project.",
          ],
          correctIndex: 1,
          explanation:
            "Workload Identity is the GCP-recommended way to grant GKE pods access to GCP APIs without key files. The pod authenticates as a GCP service account using its Kubernetes service account identity. Downloading and mounting a key (A) is an anti-pattern. ConfigMaps (C) are unencrypted and should not store secrets. Granting the node pool SA broad access (D) violates least privilege — all pods on the node would inherit the access.",
        },
        {
          id: "ace-d5-q3",
          question:
            "An organization wants to prevent any IAM bindings from being created for users outside their company domain (@company.com). Which GCP control enforces this?",
          options: [
            "A) An IAM deny policy blocking external email addresses.",
            "B) Organization Policy with `constraints/iam.allowedPolicyMemberDomains`.",
            "C) A Cloud Function that monitors IAM changes and reverts unauthorized bindings.",
            "D) VPC Service Controls restricting API access.",
          ],
          correctIndex: 1,
          explanation:
            "The `constraints/iam.allowedPolicyMemberDomains` Organization Policy restricts which domains can be added to IAM policies across the organization. It prevents IAM bindings for users outside the allowed domains at the policy enforcement level. IAM deny policies (A) are granular but complex. A Cloud Function (C) is reactive, not preventive. VPC Service Controls (D) protect API access, not IAM binding restrictions.",
        },
        {
          id: "ace-d5-q4",
          question:
            "A company wants to ensure that Cloud Storage data in a sensitive project cannot be accessed from outside their VPC network, even with valid credentials. Which feature provides this protection?",
          options: [
            "A) Cloud Storage bucket-level access control (uniform bucket-level access).",
            "B) VPC Service Controls creating a service perimeter around the project.",
            "C) Cloud Armor WAF rules on the storage API endpoint.",
            "D) Private Google Access for subnets in the VPC.",
          ],
          correctIndex: 1,
          explanation:
            "VPC Service Controls create a security perimeter that restricts access to GCP service APIs (like Cloud Storage) to requests originating from within the perimeter, regardless of IAM credentials. Even with valid credentials, requests from outside the perimeter are denied. Uniform bucket-level access (A) enforces IAM-only access control but doesn't restrict based on network location. Cloud Armor (C) protects HTTP endpoints. Private Google Access (D) allows VMs without external IPs to reach Google APIs but doesn't restrict access from outside.",
        },
        {
          id: "ace-d5-q5",
          question:
            "A Cloud Run service needs read access to a single Cloud Storage bucket. What is the CORRECT minimum IAM configuration?",
          options: [
            "A) Grant the Cloud Run service's service account `roles/storage.admin` at the project level.",
            "B) Grant the Cloud Run service's service account `roles/storage.objectViewer` on the specific bucket.",
            "C) Make the bucket public so Cloud Run can read it without IAM configuration.",
            "D) Grant `roles/editor` to the Cloud Run service account at the project level.",
          ],
          correctIndex: 1,
          explanation:
            "`roles/storage.objectViewer` at the bucket level grants read-only access to objects in that specific bucket — the minimum necessary permissions. Granting at the project level (A, D) is too broad. Making the bucket public (C) exposes it to the internet without authentication, violating the principle of least privilege and exposing data to unauthorized access.",
        },
        {
          id: "ace-d5-q6",
          question:
            "A compliance team requires that all encryption keys for BigQuery and Cloud Storage use customer-managed keys and that key usage is audited. Which GCP service provides this?",
          options: [
            "A) Cloud Secret Manager with automatic key rotation.",
            "B) Cloud KMS with CMEK enabled on the services.",
            "C) Cloud HSM with dedicated hardware.",
            "D) Cloud Identity with key management policies.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud KMS provides Customer-Managed Encryption Keys (CMEK) that can be used to encrypt BigQuery datasets and Cloud Storage buckets. Every key usage generates an audit log entry in Cloud Audit Logs. Cloud Secret Manager (A) stores application secrets, not service encryption keys. Cloud HSM (C) is a hardware option for key storage but CMEK specifically covers the service integration requirement. Cloud Identity (D) manages user identities, not encryption keys.",
        },
        {
          id: "ace-d5-q7",
          question:
            "A developer needs to temporarily escalate their permissions to perform a specific maintenance task. What is the RECOMMENDED GCP approach?",
          options: [
            "A) Grant the developer the Owner role permanently.",
            "B) Use IAM conditions with a time-based condition to grant elevated permissions for a limited window.",
            "C) Have an admin perform the task on behalf of the developer.",
            "D) Create a shared admin account for the maintenance task.",
          ],
          correctIndex: 1,
          explanation:
            "IAM conditions allow time-based access grants — you can grant an elevated role with a condition that expires after a specific date/time. This follows the principle of least privilege (temporary elevation) without requiring permanent permission changes. Permanent Owner (A) violates least privilege. Having an admin perform the task (C) works but creates accountability issues. Shared accounts (D) violate audit trail requirements.",
        },
        {
          id: "ace-d5-q8",
          question:
            "A GCP project has the default Compute Engine service account with Editor role. A security review flags this as high risk. What is the RECOMMENDED remediation?",
          options: [
            "A) Delete the default service account.",
            "B) Remove the Editor role from the default service account; create dedicated service accounts with minimum required roles for each workload.",
            "C) Revoke all service account roles and use only user account authentication for VMs.",
            "D) Change the default service account to Viewer role.",
          ],
          correctIndex: 1,
          explanation:
            "The default Compute Engine service account with Editor role is a well-known security risk (over-privileged). The recommended remediation is to remove the broad Editor role and create dedicated, least-privilege service accounts per workload. Deleting the default SA (A) may break existing resources using it. VMs need service accounts, not user accounts (C). Viewer (D) may still be too broad and doesn't follow per-workload isolation.",
        },
        {
          id: "ace-d5-q9",
          question:
            "An organization wants all VMs in a specific folder to require OS Login for SSH access instead of SSH key metadata. Which control enforces this?",
          options: [
            "A) An IAM policy requiring the OS Login role for all users in the folder.",
            "B) Organization Policy with `constraints/compute.requireOsLogin` applied to the folder.",
            "C) A firewall rule blocking SSH on port 22 and redirecting to IAP.",
            "D) A startup script that disables SSH key-based authentication.",
          ],
          correctIndex: 1,
          explanation:
            "The `constraints/compute.requireOsLogin` Organization Policy constraint enforces OS Login for all VMs within the scope it's applied to. OS Login links SSH access to Google identities and their IAM roles, providing better auditability. An IAM policy (A) grants the OS Login role but doesn't prevent non-OS-Login access. Firewall rules (C) block traffic but don't enforce OS Login. Startup scripts (D) require custom code per VM.",
        },
        {
          id: "ace-d5-q10",
          question:
            "A security audit reveals that a service account has a downloaded JSON key that has been active for 18 months. What action should be taken immediately?",
          options: [
            "A) Rotate the key by generating a new key version.",
            "B) Disable and delete the existing key, then migrate to keyless authentication (attached service account or Workload Identity).",
            "C) Encrypt the key file using Cloud KMS.",
            "D) Move the key file to Secret Manager.",
          ],
          correctIndex: 1,
          explanation:
            "Long-lived service account keys are a security risk. The correct response is to disable and delete the compromised/old key and migrate to keyless authentication patterns. Rotation (A) creates a new key but still maintains the long-lived key anti-pattern. Encrypting (C) or moving (D) the key to Secret Manager keeps the key material in existence, which is the root risk.",
        },
        {
          id: "ace-d5-q11",
          question:
            "An application running on Compute Engine needs to call the BigQuery API. What is the MOST secure way to provide credentials?",
          options: [
            "A) Download a service account JSON key and set the GOOGLE_APPLICATION_CREDENTIALS environment variable.",
            "B) Attach a dedicated service account to the VM instance with the minimum required BigQuery roles.",
            "C) Hardcode the service account credentials in the application configuration file.",
            "D) Use the project's default service account with Editor role.",
          ],
          correctIndex: 1,
          explanation:
            "Attaching a dedicated service account to the VM provides credentials automatically through the metadata server — no key files required. The Application Default Credentials (ADC) mechanism picks up these credentials automatically. JSON key files (A) create long-lived secrets that must be managed. Hardcoded credentials (C) is a critical security anti-pattern. Default SA with Editor (D) is over-privileged.",
        },
        {
          id: "ace-d5-q12",
          question:
            "Which IAM principal type is used to grant access to all users who have a Google account?",
          options: [
            "A) `allUsers`",
            "B) `allAuthenticatedUsers`",
            "C) `domain:google.com`",
            "D) `group:everyone@googlegroups.com`",
          ],
          correctIndex: 1,
          explanation:
            "`allAuthenticatedUsers` grants access to any user authenticated with a Google account. `allUsers` (A) grants access to everyone including unauthenticated users — use this only for truly public resources. `domain:google.com` (C) would grant access to Google's own organization domain. There is no universal group (D) in Google Groups accessible this way.",
        },
        {
          id: "ace-d5-q13",
          question:
            "A team wants to grant a third-party vendor read-only access to a BigQuery dataset without creating a Google account for the vendor. What is the BEST approach?",
          options: [
            "A) Create a Google account for a vendor contact and grant dataset access.",
            "B) Use Workload Identity Federation to allow the vendor's AWS or Azure identity to access BigQuery.",
            "C) Make the BigQuery dataset publicly accessible.",
            "D) Share the project owner's credentials with the vendor.",
          ],
          correctIndex: 1,
          explanation:
            "Workload Identity Federation allows external identities (AWS, Azure, or OIDC providers) to authenticate to GCP without creating Google accounts or service account keys. The vendor uses their native identity to obtain temporary GCP credentials. Creating a Google account (A) is possible but requires account management overhead. Public access (C) exposes data to everyone. Sharing credentials (D) is a critical security violation.",
        },
        {
          id: "ace-d5-q14",
          question:
            "A company stores API keys in Compute Engine VM metadata. A security reviewer flags this as a risk. What is the RECOMMENDED alternative?",
          options: [
            "A) Store API keys in Cloud Storage bucket with restricted access.",
            "B) Store API keys in Secret Manager and access them via the VM's service account.",
            "C) Encrypt the metadata value using Cloud KMS before storing.",
            "D) Store API keys in a Cloud SQL database with encryption at rest.",
          ],
          correctIndex: 1,
          explanation:
            "Secret Manager is purpose-built for storing API keys, passwords, and other secrets with IAM-controlled access, versioning, and audit logging. The VM retrieves secrets at runtime using its attached service account identity — no key material needs to be embedded in VM configuration. Cloud Storage (A) is not designed for secret storage. Encrypting metadata (C) still stores sensitive data in metadata. Cloud SQL (D) is a database, not a secret store.",
        },
        {
          id: "ace-d5-q15",
          question:
            "A security team wants to review all failed authentication attempts and permission denied errors across their GCP organization. Where should they look?",
          options: [
            "A) Cloud Monitoring — set up an alert policy on authentication metrics.",
            "B) Cloud Audit Logs — Data Access logs for all services.",
            "C) Cloud Audit Logs — Admin Activity logs combined with VPC Flow Logs.",
            "D) Security Command Center — Findings for authentication anomalies.",
          ],
          correctIndex: 3,
          explanation:
            "Security Command Center (SCC) provides a centralized view of security findings across GCP, including authentication anomalies, permission denied events, and threat detections from services like Event Threat Detection. It is the most effective single place for reviewing security events at scale. Cloud Monitoring (A) tracks metrics. Admin Activity logs (C) track administrative actions, not authentication failures. Data Access logs (B) track data reads/writes.",
        },
      ],
    },
  ],
};
