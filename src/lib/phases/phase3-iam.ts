interface TopicSection {
  heading: string;
  body: string;
  code?: { lang: string; label: string; snippet: string };
}

interface Topic {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  category: string;
  summary: string;
  sections: TopicSection[];
  awsEquivalent?: string;
  gcpEquivalent?: string;
  azureEquivalent?: string;
}

interface Module {
  id: string;
  title: string;
  desc: string;
  category: string;
  topics: Topic[];
}

export const gcpIamModule: Module = {
  id: "iam",
  title: "IAM & Security",
  desc: "Identities, roles, and access policies for GCP resources",
  category: "IAM & Security",
  topics: [
    {
      id: "gcp-iam",
      title: "Cloud IAM — Identity and Access Management",
      level: "Beginner",
      readTime: "10 min",
      category: "IAM & Security",
      summary:
        "GCP Cloud IAM lets you control who can do what on which resource. Every action in GCP is gated by an IAM policy that binds principals to roles on a resource.",
      awsEquivalent: "AWS IAM",
      azureEquivalent: "Azure RBAC / Entra ID",
      sections: [
        {
          heading: "How GCP IAM works",
          body: "GCP IAM is built around three concepts: **principals**, **roles**, and **policies**.\n\nA **principal** is an identity that can request access. There are four principal types:\n• **Google Account** — a personal `user@gmail.com` or Workspace account\n• **Service Account** — a non-human identity for workloads and applications\n• **Google Group** — a named collection of accounts; use groups to manage access at scale\n• **Domain** — all accounts in a Google Workspace or Cloud Identity domain\n\nA **role** is a named collection of permissions (e.g., `roles/storage.objectViewer`). A **policy** is a list of bindings that attach principals to roles on a specific resource. When a principal makes an API call, GCP checks the resource's policy — and those of its ancestors — to decide whether to allow it.",
        },
        {
          heading: "Role types",
          body: "GCP has three categories of roles:\n\n• **Primitive roles** — `roles/owner`, `roles/editor`, `roles/viewer`. These predate IAM and grant very broad permissions across all GCP services. Avoid these in production — they violate least-privilege.\n• **Predefined roles** — curated, service-specific roles such as `roles/storage.objectAdmin` or `roles/container.developer`. These are the recommended default; they are maintained by Google and updated as services evolve.\n• **Custom roles** — you define the exact set of permissions. Use these only when predefined roles are too broad or too narrow for your requirements.\n\nRecommendation: always start with a **predefined role** and reach for a custom role only when you need a tighter permission boundary.",
        },
        {
          heading: "Service Accounts",
          body: "A **service account** is a special principal used by applications, VMs, and jobs — not humans. GCP attaches a service account to a resource (e.g., a Compute Engine VM or a Cloud Run service), and code running on that resource automatically inherits its identity.\n\nThere are two ways a service account can authenticate outside GCP:\n• **Service account keys** — a JSON file containing a private key. Avoid these: keys are long-lived credentials that are easy to leak.\n• **Workload Identity Federation** — keyless auth; external workloads exchange a short-lived OIDC/SAML token for a GCP access token. Strongly preferred.\n\nYou can also **impersonate** a service account — let a human (or another SA) act as the SA without holding its key.",
          code: {
            lang: "bash",
            label: "Impersonate a service account",
            snippet: `# Impersonate a service account for a single gcloud command
gcloud storage ls gs://my-bucket \\
  --impersonate-service-account=my-sa@my-project.iam.gserviceaccount.com

# Or set impersonation for an entire gcloud session
gcloud config set auth/impersonate_service_account \\
  my-sa@my-project.iam.gserviceaccount.com

# Create a service account
gcloud iam service-accounts create my-workload-sa \\
  --display-name="My Workload SA" \\
  --project=my-project`,
          },
        },
        {
          heading: "Granting and revoking access",
          body: "IAM policies are attached to resources. You can set policies at the organisation, folder, project, or individual resource level. A binding at a higher level is inherited by all child resources — so a role granted at the project level applies to every resource in that project.\n\nUse `gcloud projects add-iam-policy-binding` to add a single binding without replacing the entire policy. For resource-level bindings (e.g., a single GCS bucket), use the resource-specific command.",
          code: {
            lang: "bash",
            label: "Grant and revoke IAM bindings",
            snippet: `# Grant a role at the project level
gcloud projects add-iam-policy-binding my-project \\
  --member="user:engineer@example.com" \\
  --role="roles/storage.objectViewer"

# Grant a role on a specific GCS bucket (resource-level)
gcloud storage buckets add-iam-policy-binding gs://my-bucket \\
  --member="serviceAccount:my-sa@my-project.iam.gserviceaccount.com" \\
  --role="roles/storage.objectAdmin"

# Revoke a role
gcloud projects remove-iam-policy-binding my-project \\
  --member="user:engineer@example.com" \\
  --role="roles/storage.objectViewer"

# View the current policy
gcloud projects get-iam-policy my-project --format=yaml`,
          },
        },
        {
          heading: "Workload Identity Federation",
          body: "**Workload Identity Federation** lets external workloads — running on AWS, GitHub Actions, Kubernetes, or any OIDC/SAML provider — authenticate to GCP **without a service account key**. The workload exchanges its own short-lived credential for a GCP access token via the Security Token Service (STS).\n\nThis is the recommended pattern for:\n• CI/CD pipelines (GitHub Actions, GitLab, CircleCI)\n• Workloads running on AWS or Azure\n• On-premises Kubernetes pods\n\nThe benefits over service account keys are significant: no long-lived secret to rotate or leak, shorter blast radius if a credential is compromised, and full audit trails in Cloud Audit Logs. For GKE workloads specifically, use the GKE-native **Workload Identity** feature, which binds a Kubernetes ServiceAccount directly to a GCP service account.",
        },
      ],
    },
  ],
};

export const azureIamModule: Module = {
  id: "iam",
  title: "IAM & Security",
  desc: "Identities, role assignments, and access policies for Azure resources",
  category: "IAM & Security",
  topics: [
    {
      id: "azure-iam",
      title: "Microsoft Entra ID & Azure RBAC",
      level: "Beginner",
      readTime: "10 min",
      category: "IAM & Security",
      summary:
        "Azure's identity and access model has two layers: Microsoft Entra ID manages identities (who you are), and Azure RBAC controls what those identities can do on Azure resources.",
      awsEquivalent: "AWS IAM",
      gcpEquivalent: "GCP Cloud IAM",
      sections: [
        {
          heading: "Microsoft Entra ID (Azure AD)",
          body: "**Microsoft Entra ID** (formerly Azure Active Directory) is Azure's cloud identity provider. It is the source of truth for every identity that accesses Azure or Microsoft 365.\n\nKey concepts:\n• **Tenant** — an isolated directory instance, tied to your organisation. Every Azure subscription belongs to exactly one tenant.\n• **Users** — human identities with a `user@yourdomain.com` UPN.\n• **Groups** — collections of users (and other groups). Assign roles to groups, not individuals, to reduce management overhead.\n• **Service Principals** — the application-level identity for a registered app or an automated workload. Similar to an IAM role in AWS or a service account in GCP.\n• **Managed Identities** — a special type of service principal whose lifecycle and credentials are managed entirely by Azure. No passwords or keys to manage.",
        },
        {
          heading: "Azure RBAC",
          body: "**Azure RBAC** (Role-Based Access Control) determines what a principal can do on Azure resources. Access is controlled by creating **role assignments** that bind a **security principal** (user, group, service principal, or managed identity) to a **role definition** at a specific **scope**.\n\nThe scope hierarchy flows from broad to narrow:\n• **Management Group** → **Subscription** → **Resource Group** → **Resource**\n\nA role assignment at a higher scope is inherited by all child scopes. Built-in roles cover most needs:\n• `Owner` — full access including the ability to delegate access\n• `Contributor` — full access to manage resources, but cannot grant access to others\n• `Reader` — read-only access across the scope\n\nFor fine-grained control, create a **custom role** with only the actions your workload needs.",
        },
        {
          heading: "Managed Identities",
          body: "A **managed identity** is the recommended way to authenticate Azure workloads to other Azure services — no secrets, no certificates, no rotation scripts.\n\nThere are two types:\n• **System-assigned** — tied to a single resource (e.g., one VM or App Service). Deleted automatically when the resource is deleted. Use for resources that have a single, unique identity.\n• **User-assigned** — a standalone identity resource that can be attached to one or more resources. Use when multiple resources share the same permissions, or when you need the identity to outlive any individual resource.\n\nPrefer managed identities over service principals with client secrets. Secrets expire, get leaked, and require rotation. Managed identities eliminate this entire class of problem.",
          code: {
            lang: "bash",
            label: "Assign a role to a managed identity",
            snippet: `# Enable a system-assigned managed identity on a VM
az vm identity assign \\
  --resource-group my-rg \\
  --name my-vm

# Get the principal ID of the managed identity
PRINCIPAL_ID=$(az vm show \\
  --resource-group my-rg \\
  --name my-vm \\
  --query identity.principalId \\
  --output tsv)

# Assign the Storage Blob Data Reader role to the identity
az role assignment create \\
  --assignee $PRINCIPAL_ID \\
  --role "Storage Blob Data Reader" \\
  --scope /subscriptions/<subscription-id>/resourceGroups/my-rg/providers/Microsoft.Storage/storageAccounts/myaccount`,
          },
        },
        {
          heading: "Role Assignments",
          body: "A **role assignment** is the mechanism that grants access. Every assignment links a principal, a role definition, and a scope. Removing the assignment immediately revokes access — there is no concept of a \"deny\" rule in basic RBAC (use **deny assignments** or **Azure Policy** for explicit denials).\n\nUse `az role assignment create` to grant access and `az role assignment list` to audit what is assigned at a given scope.",
          code: {
            lang: "bash",
            label: "Create and list role assignments",
            snippet: `# Assign Contributor to a user at the resource group scope
az role assignment create \\
  --assignee "engineer@example.com" \\
  --role "Contributor" \\
  --resource-group my-rg

# Assign a built-in role using its ID
az role assignment create \\
  --assignee "engineer@example.com" \\
  --role "acdd72a7-3385-48ef-bd42-f606fba81ae7" \\
  --scope /subscriptions/<subscription-id>

# List all role assignments at a resource group
az role assignment list \\
  --resource-group my-rg \\
  --output table

# Remove a role assignment
az role assignment delete \\
  --assignee "engineer@example.com" \\
  --role "Contributor" \\
  --resource-group my-rg`,
          },
        },
        {
          heading: "Conditional Access & PIM",
          body: "Beyond basic role assignments, Azure provides two powerful tools for hardening access:\n\n**Conditional Access** lets you enforce policies on authentication — for example, require MFA for all users accessing the Azure portal, block sign-ins from risky locations, or mandate a compliant device. Policies are evaluated at sign-in time and can block, challenge, or grant access based on signals like user location, device state, and risk score.\n\n**Privileged Identity Management (PIM)** implements **just-in-time access** for high-privilege roles. Instead of granting `Owner` or `Contributor` permanently, PIM requires users to explicitly activate a role for a bounded time window (e.g., 1 hour). Activation can require MFA, a business justification, and manager approval. PIM also generates an audit log of every activation, making it easy to answer \"who had admin access and when?\" PIM is available with a Microsoft Entra ID P2 licence.",
        },
      ],
    },
  ],
};
