import type { Certification } from "./types";

export const azureAz104: Certification = {
  id: "azure-az104",
  title: "Azure Administrator Associate",
  code: "AZ-104",
  cloud: "azure",
  level: "Associate",
  description:
    "Validate your ability to implement, manage, and monitor Azure environments. Covers identity, governance, storage, compute, networking, and monitoring.",
  examFormat: {
    questions: 50,
    duration: "100 minutes",
    passingScore: "700/1000",
    cost: "$165 USD",
  },
  domains: [
    // ─── Domain 1: Manage Azure Identities and Governance (20%) ────
    {
      id: "domain-1",
      title: "Manage Azure Identities and Governance",
      weight: "20%",
      order: 1,
      summary:
        "This domain covers managing Microsoft Entra ID (formerly Azure Active Directory), role-based access control (RBAC), subscriptions, and governance policies. At 20% of the exam, it establishes the identity and governance foundation that every Azure administrator must master.\n\nKey areas include creating and managing users and groups, assigning built-in and custom RBAC roles at various scopes (management group, subscription, resource group, resource), configuring Azure Policy for compliance enforcement, and understanding the Azure resource hierarchy: management groups → subscriptions → resource groups → resources.\n\nExpect scenario-based questions on **Conditional Access policies**, **managed identities** (system-assigned vs. user-assigned), **Privileged Identity Management (PIM)**, and **Microsoft Entra Connect** for hybrid identity. You must understand how to implement multi-factor authentication and self-service password reset.",
      keyConceptsForExam: [
        "**Microsoft Entra ID** — users, groups, service principals, managed identities, and tenant vs. subscription boundaries",
        "**Azure RBAC** — built-in roles (Owner, Contributor, Reader), custom roles, scope hierarchy, and deny assignments",
        "**Management groups and subscriptions** — organizing resources, applying policy at scale, and billing boundaries",
        "**Azure Policy** — policy definitions, initiatives, assignment scopes, compliance evaluation, and remediation tasks",
        "**Managed identities** — system-assigned (lifecycle tied to resource) vs. user-assigned (reusable across resources)",
        "**Conditional Access** — signal-based access policies combining user, device, location, and app conditions",
        "**Azure Blueprints / Deployment Stacks** — packaging RBAC, policies, and ARM templates for repeatable environments",
        "**Microsoft Entra Connect** — password hash sync, pass-through authentication, and federation with on-premises AD",
      ],
      examTips: [
        "Know the scope inheritance chain: permissions assigned at a higher scope (management group) propagate down. Deny assignments override Allow at any scope.",
        "Managed identities eliminate the need for credentials in code — system-assigned is simpler but tied to the resource; user-assigned can be shared across multiple resources.",
        "Azure Policy is **audit and enforce**, not just audit. Understand the `DeployIfNotExists` and `Modify` effects for remediation, not just `Deny` and `Audit`.",
        "Conditional Access requires Entra ID P1 or P2 — questions will often test whether you know the licensing tier needed.",
        "PIM provides just-in-time privileged access with approval workflows and time-bound assignments — distinguish it from static RBAC role assignments.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
        { cloud: "azure", topicId: "azure-vm-basics", title: "Azure Virtual Machines" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
      ],
      sections: [
        {
          heading: "Azure RBAC and Scope Hierarchy",
          body: "Azure RBAC controls who can do what on which resources. Roles are assigned at a **scope**: management group, subscription, resource group, or individual resource. Permissions inherit downward — a Contributor role at the subscription level grants Contributor access to all resource groups and resources within that subscription.\n\n**Built-in roles** cover most scenarios: Owner (full access + delegate), Contributor (full access, cannot delegate), Reader (read-only), and service-specific roles like `Storage Blob Data Contributor`. Custom roles allow you to combine specific actions when no built-in role fits.\n\nRBAC assignments use **security principals**: users, groups, service principals, or managed identities. Groups are preferred over individual assignments for scale. Use `az role assignment create` to assign roles programmatically.",
          code: {
            lang: "bash",
            label: "Assign a built-in RBAC role at resource group scope",
            snippet: `# Assign Contributor role to a user at resource group scope
az role assignment create \\
  --assignee user@contoso.com \\
  --role "Contributor" \\
  --scope "/subscriptions/<sub-id>/resourceGroups/myResourceGroup"

# List role assignments for a resource group
az role assignment list \\
  --resource-group myResourceGroup \\
  --output table`,
          },
        },
        {
          heading: "Azure Policy for Governance",
          body: "Azure Policy evaluates resources against defined rules and enforces compliance at scale. **Policy definitions** describe conditions and effects: `Deny` blocks non-compliant deployments, `Audit` flags them without blocking, `DeployIfNotExists` automatically deploys required configurations, and `Modify` adds or updates resource properties.\n\n**Initiatives** (policy sets) group multiple definitions for a compliance goal, such as the Azure Security Benchmark initiative. Policies are assigned at a scope and inherit to child scopes. **Exclusions** can carve out specific resources or resource groups.\n\nAfter assigning a `DeployIfNotExists` or `Modify` policy, use **remediation tasks** to bring existing non-compliant resources into compliance. New resources are evaluated on creation and update.",
        },
        {
          heading: "Managed Identities and Key Vault Integration",
          body: "Managed identities provide Azure services with an automatically managed identity in Entra ID, eliminating the need to store credentials. **System-assigned** identities are created with the resource and deleted when the resource is deleted. **User-assigned** identities are standalone resources that can be assigned to multiple services.\n\nA common pattern is granting a VM or App Service a managed identity, then assigning it a role on **Azure Key Vault** to retrieve secrets at runtime — no hardcoded credentials required. This satisfies security requirements for secret management with minimal operational overhead.",
          code: {
            lang: "bash",
            label: "Enable system-assigned managed identity and grant Key Vault access",
            snippet: `# Enable system-assigned identity on a VM
az vm identity assign \\
  --name myVM \\
  --resource-group myResourceGroup

# Get the principal ID of the managed identity
PRINCIPAL_ID=$(az vm show \\
  --name myVM \\
  --resource-group myResourceGroup \\
  --query identity.principalId -o tsv)

# Grant the VM identity access to read Key Vault secrets
az keyvault set-policy \\
  --name myKeyVault \\
  --object-id $PRINCIPAL_ID \\
  --secret-permissions get list`,
          },
        },
      ],
      quiz: [
        {
          id: "az104-d1-q1",
          question:
            "A company wants to ensure that only resources in approved Azure regions can be deployed across all subscriptions in a management group. What is the MOST efficient approach?",
          options: [
            "A) Assign a Deny RBAC role at the management group scope restricting all create operations.",
            "B) Create an Azure Policy with the Deny effect on the management group that restricts allowed locations.",
            "C) Configure Conditional Access policies on each subscription to block deployments to unapproved regions.",
            "D) Add resource locks to each subscription preventing resource creation outside approved regions.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Policy with the Deny effect and an `allowedLocations` condition applied at the management group scope propagates to all child subscriptions and resource groups. RBAC (A) controls who can act, not where resources can be deployed. Conditional Access (C) governs user authentication, not resource deployment locations. Resource locks (D) prevent modification/deletion but cannot restrict where resources are created.",
        },
        {
          id: "az104-d1-q2",
          question:
            "A developer needs an Azure Function to access secrets stored in Azure Key Vault without storing credentials. What is the RECOMMENDED approach?",
          options: [
            "A) Store the Key Vault access key in the Function's application settings.",
            "B) Create a service principal, store its client secret in the Function app, and use it to authenticate.",
            "C) Enable a system-assigned managed identity on the Function app and grant it Key Vault Secrets User role.",
            "D) Generate a SAS token for the Key Vault and embed it in the Function code.",
          ],
          correctIndex: 2,
          explanation:
            "A system-assigned managed identity provides the Function app with an Entra ID identity that Azure manages. Granting the Key Vault Secrets User role on Key Vault allows the Function to retrieve secrets with no stored credentials. Storing access keys (A) or client secrets (B) creates credential management overhead and security risk. Key Vault does not support SAS tokens (D).",
        },
        {
          id: "az104-d1-q3",
          question:
            "An administrator needs to grant a user temporary elevated access to manage Azure resources for 4 hours without permanently assigning the Owner role. Which feature should they use?",
          options: [
            "A) Assign the Owner role directly and revoke it after 4 hours.",
            "B) Use Azure AD Privileged Identity Management (PIM) to configure an eligible Owner role assignment with a 4-hour activation window.",
            "C) Create a custom RBAC role that automatically expires after 4 hours.",
            "D) Use Conditional Access to restrict the Owner role to business hours only.",
          ],
          correctIndex: 1,
          explanation:
            "PIM provides just-in-time privileged access — the user activates the eligible assignment when needed (up to the configured maximum duration) and the elevated access expires automatically. Manual assignment and revocation (A) is error-prone. RBAC roles do not support automatic expiry (C). Conditional Access (D) controls authentication conditions, not role scope or duration.",
        },
        {
          id: "az104-d1-q4",
          question:
            "A company has Azure subscriptions under a management group. They need to apply a set of policies, RBAC assignments, and ARM templates consistently to every new subscription. What should they use?",
          options: [
            "A) Azure Resource Manager templates deployed manually to each subscription.",
            "B) Azure Blueprints or Deployment Stacks to package policies, roles, and templates as a single deployable artifact.",
            "C) Azure DevOps pipelines that run ARM deployments for each subscription.",
            "D) Azure Policy initiatives assigned at the management group scope.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Blueprints (and the newer Deployment Stacks) package RBAC assignments, policy assignments, and ARM templates together as a versioned, deployable artifact that can be assigned to subscriptions at scale. ARM templates alone (A) cover infrastructure but not RBAC and policy. DevOps pipelines (C) can achieve this but require custom automation. Policy initiatives (D) cover policies but not RBAC or ARM templates.",
        },
        {
          id: "az104-d1-q5",
          question:
            "A user-assigned managed identity is attached to five Azure VMs. The identity needs to be granted read access to a storage account. How many role assignments are required?",
          options: [
            "A) Five — one role assignment per VM.",
            "B) One — assign the role to the user-assigned managed identity; all five VMs inherit the access.",
            "C) Five — one role assignment per system-assigned identity on each VM.",
            "D) Zero — managed identities automatically have access to all resources in the same resource group.",
          ],
          correctIndex: 1,
          explanation:
            "A user-assigned managed identity is an independent resource. Assigning a role to the identity once grants that access to every resource (all five VMs) that uses it. This is the key advantage of user-assigned over system-assigned identities for shared scenarios. System-assigned identities (C) would require five separate assignments. Managed identities do not have implicit access to any resources (D).",
        },
        {
          id: "az104-d1-q6",
          question:
            "An Azure administrator runs `az role assignment list --resource-group rg-prod` and sees a user has the Contributor role. The user reports they cannot delete a resource in that group. What is the MOST likely reason?",
          options: [
            "A) The Contributor role does not include delete permissions.",
            "B) A resource lock (CanNotDelete or ReadOnly) has been applied to the resource or resource group.",
            "C) The user's Conditional Access policy blocks delete operations.",
            "D) The subscription has a spending limit that prevents resource deletion.",
          ],
          correctIndex: 1,
          explanation:
            "Resource locks override RBAC — even Owners and Contributors cannot delete a resource if a `CanNotDelete` lock is applied. The Contributor role does include delete permissions (A is incorrect). Conditional Access governs authentication, not individual resource operations (C). Subscription spending limits affect billing, not delete operations (D).",
        },
        {
          id: "az104-d1-q7",
          question:
            "A company's compliance policy requires that all Azure resources must have a 'CostCenter' tag. Resources without this tag should be flagged for remediation. Which Azure Policy effect should be used?",
          options: [
            "A) Deny — block creation of any resource missing the CostCenter tag.",
            "B) Audit — flag non-compliant resources without blocking creation.",
            "C) Modify — automatically add a default CostCenter tag to resources that are missing it.",
            "D) DeployIfNotExists — deploy a tagging extension to non-compliant resources.",
          ],
          correctIndex: 2,
          explanation:
            "The `Modify` effect automatically adds or updates tags on resources during create or update operations, ensuring compliance without blocking deployments. `Deny` (A) would block resource creation, which may not be desired. `Audit` (B) flags but does not remediate. `DeployIfNotExists` (D) is used for deploying associated resources (like diagnostic settings), not for tag management.",
        },
        {
          id: "az104-d1-q8",
          question:
            "What is the difference between a Microsoft Entra ID tenant and an Azure subscription?",
          options: [
            "A) A tenant is a billing boundary; a subscription is an identity directory.",
            "B) A tenant is an Entra ID identity directory; a subscription is a billing and resource boundary that trusts one tenant.",
            "C) They are the same concept — every tenant automatically contains one subscription.",
            "D) A subscription contains multiple tenants for multi-region deployments.",
          ],
          correctIndex: 1,
          explanation:
            "A Microsoft Entra ID tenant is the identity directory (users, groups, apps). An Azure subscription is the billing and resource deployment boundary — it trusts exactly one Entra ID tenant for authentication. Multiple subscriptions can trust the same tenant. They are distinct concepts (C is incorrect). Subscriptions do not contain tenants (D).",
        },
        {
          id: "az104-d1-q9",
          question:
            "A hybrid organization uses on-premises Active Directory. Users must be able to sign in to Azure resources using their on-premises AD credentials without their passwords being stored in Entra ID. Which synchronization method should be used?",
          options: [
            "A) Password Hash Synchronization — hash passwords in Entra ID for cloud authentication.",
            "B) Pass-Through Authentication — validate passwords directly against on-premises AD in real time.",
            "C) Active Directory Federation Services (AD FS) — federate with a third-party IdP.",
            "D) Azure AD B2C — create a consumer identity directory separate from corporate AD.",
          ],
          correctIndex: 1,
          explanation:
            "Pass-Through Authentication (PTA) validates user passwords directly against on-premises Active Directory in real time, without storing any password hash in Entra ID. Password Hash Sync (A) stores a hash of passwords in the cloud, which the question explicitly excludes. AD FS (C) provides federation but requires on-premises infrastructure. Azure AD B2C (D) is for consumer-facing applications, not corporate identity.",
        },
        {
          id: "az104-d1-q10",
          question:
            "An administrator needs to review all RBAC assignments across an entire Azure subscription, including inherited assignments from management groups. Which command provides this view?",
          options: [
            "A) `az role assignment list --subscription <sub-id>`",
            "B) `az ad user list --subscription <sub-id>`",
            "C) `az policy assignment list --subscription <sub-id>`",
            "D) `az role definition list --subscription <sub-id>`",
          ],
          correctIndex: 0,
          explanation:
            "`az role assignment list --subscription <sub-id>` lists all role assignments at the subscription scope, including those inherited from management groups above. `az ad user list` (B) lists Entra ID users, not assignments. `az policy assignment list` (C) lists policy assignments, not RBAC. `az role definition list` (D) lists available role definitions, not who has been assigned what.",
        },
        {
          id: "az104-d1-q11",
          question:
            "A company wants to enforce MFA for all administrators signing in from outside the corporate network. Which Azure feature implements this with the LEAST configuration overhead?",
          options: [
            "A) Per-user MFA settings in Entra ID for each administrator account.",
            "B) A Conditional Access policy requiring MFA when the sign-in location is outside named locations.",
            "C) Azure AD Identity Protection risk-based policies triggered by risky sign-ins.",
            "D) Security defaults in Entra ID that enable MFA for all users automatically.",
          ],
          correctIndex: 1,
          explanation:
            "A Conditional Access policy combining an admin role condition with a named location exclusion (corporate network) enforces MFA precisely for the stated scenario with granular control. Per-user MFA (A) requires configuring each account individually. Identity Protection (C) requires Entra ID P2 and responds to detected risk, not location. Security defaults (D) enforce MFA broadly but cannot be customized by location.",
        },
        {
          id: "az104-d1-q12",
          question:
            "When an Azure Policy with the Deny effect is assigned at the management group level, which resources does it affect?",
          options: [
            "A) Only resources in the management group's root resource group.",
            "B) All resources in all subscriptions and resource groups within the management group hierarchy.",
            "C) Only resources created after the policy assignment date.",
            "D) Only resources in subscriptions directly under the management group, not nested management groups.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Policy assignments at a management group scope apply to all subscriptions and resource groups within that management group, including nested management groups and their subscriptions. Existing non-compliant resources are flagged (not blocked retroactively unless a remediation task runs), and all new deployments are blocked. The policy is not limited to a specific resource group (A), a date cutoff (C, new resources are blocked; existing are only flagged), or direct children only (D).",
        },
        {
          id: "az104-d1-q13",
          question:
            "A company acquires another organization and needs to invite the acquired company's users to collaborate on Azure resources without merging their Entra ID tenants. Which feature enables this?",
          options: [
            "A) Create new accounts in your tenant for each acquired user.",
            "B) Use Microsoft Entra B2B collaboration to invite external users as guest accounts.",
            "C) Configure Entra Connect to sync the acquired company's on-premises AD.",
            "D) Create a new subscription under the same tenant for the acquired company.",
          ],
          correctIndex: 1,
          explanation:
            "Entra B2B collaboration allows you to invite external users from other organizations as guest accounts in your tenant. They authenticate with their home organization credentials and access resources you grant them. Creating new accounts (A) forces users to manage separate credentials. Entra Connect (C) synchronizes on-premises AD, which requires access to their infrastructure. A new subscription (D) creates a billing boundary but does not solve cross-tenant identity.",
        },
        {
          id: "az104-d1-q14",
          question:
            "An organization needs to track which administrator deleted a resource group last week. Where is this information available?",
          options: [
            "A) Azure Monitor Metrics — check the resource deletion metric.",
            "B) Azure Activity Log — filter by the resource group and Delete operation.",
            "C) Microsoft Defender for Cloud — review the security incidents dashboard.",
            "D) Azure Resource Graph — query deleted resources by timestamp.",
          ],
          correctIndex: 1,
          explanation:
            "The Azure Activity Log records all control-plane operations (create, update, delete) on Azure resources, including who performed the action and when. Filtering by resource group and operation type `Delete` reveals the administrator and timestamp. Azure Monitor Metrics (A) track performance data, not audit events. Defender for Cloud (C) focuses on security recommendations and alerts. Azure Resource Graph (D) queries live resources, not historical deletion events.",
        },
        {
          id: "az104-d1-q15",
          question:
            "A subscription Owner wants to prevent other administrators from accidentally deleting a critical production resource group while still allowing normal resource management within it. What should they apply?",
          options: [
            "A) A ReadOnly lock on the resource group.",
            "B) A CanNotDelete lock on the resource group.",
            "C) Remove the Delete permission from all Contributor role assignments in the resource group.",
            "D) Enable soft delete on the resource group via Azure Policy.",
          ],
          correctIndex: 1,
          explanation:
            "A `CanNotDelete` lock prevents deletion of the resource group and its resources, while allowing read and write operations to continue normally. A `ReadOnly` lock (A) prevents all modifications, not just deletion — this would block normal resource management. RBAC does not have a granular 'remove Delete' option for Contributors (C), and modifying built-in roles is not possible. Resource groups do not support soft delete (D).",
        },
      ],
    },

    // ─── Domain 2: Implement and Manage Storage (15%) ────────────────
    {
      id: "domain-2",
      title: "Implement and Manage Storage",
      weight: "15%",
      order: 2,
      summary:
        "This domain tests your ability to create and configure Azure Storage accounts, manage blobs, files, queues, and tables, and implement appropriate access controls and redundancy configurations. Storage is foundational to nearly every Azure workload.\n\nKey topics include choosing the right **redundancy tier** (LRS, ZRS, GRS, GZRS, RA-GRS), configuring **lifecycle management policies** to tier or delete blobs automatically, managing access via **SAS tokens**, **stored access policies**, and **Azure AD RBAC** on storage containers. Azure Files provides managed SMB and NFS shares for hybrid and cloud-native scenarios.\n\nExpect questions on **Azure File Sync** for hybrid file sharing, **storage firewall and private endpoints** for network isolation, blob **access tiers** (Hot, Cool, Cold, Archive), and immutability policies (WORM) for compliance.",
      keyConceptsForExam: [
        "**Storage account types** — general-purpose v2, Blob Storage, Azure Data Lake Storage Gen2, Premium (block blobs, file shares, page blobs)",
        "**Redundancy options** — LRS (3 copies in one datacenter), ZRS (3 AZs), GRS (paired region), GZRS (ZRS + GRS), RA-GRS/RA-GZRS (read access to secondary)",
        "**Blob access tiers** — Hot (frequent), Cool (infrequent, 30-day min), Cold (rare, 90-day min), Archive (offline, 180-day min, rehydration required)",
        "**Access control** — shared key, SAS tokens (account/service/user delegation), stored access policies, Entra ID RBAC (preferred)",
        "**Azure File Sync** — extend on-premises file servers with cloud tiering; sync agent, storage sync service, sync group",
        "**Lifecycle management** — automate tiering and deletion with rules based on last modified or access time",
        "**Network security** — storage firewalls, virtual network service endpoints, private endpoints, trusted Microsoft services",
        "**Immutability** — time-based retention policies and legal holds for WORM (write-once, read-many) compliance",
      ],
      examTips: [
        "Archive tier blobs must be rehydrated to Hot or Cool before they can be read — this takes hours. Know the priority options: Standard (up to 15 hours) vs. High (under 1 hour, higher cost).",
        "User delegation SAS tokens are signed with Entra ID credentials, not the storage account key — they are more secure and the recommended choice when possible.",
        "ZRS protects against datacenter failures but not regional failures; GRS protects against regional failures but not datacenter failures. GZRS provides both.",
        "Azure File Sync cloud tiering stores a stub locally and moves data to Azure Files — free up on-premises disk space while keeping namespace accessible.",
        "Stored access policies allow you to revoke SAS tokens before expiry — critical for security incident response. Ad-hoc SAS tokens cannot be revoked without rotating the storage account key.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
      ],
      sections: [
        {
          heading: "Storage Redundancy and Replication",
          body: "Azure Storage replication protects data against hardware failures, datacenter outages, and regional disasters. The right choice depends on your RTO, RPO, and cost requirements:\n\n- **LRS**: 3 copies within a single datacenter. Cheapest, but no protection against datacenter failure.\n- **ZRS**: 3 copies across 3 Availability Zones in the same region. Protects against datacenter failure.\n- **GRS**: LRS in primary region + asynchronous replication to a secondary region. Protects against regional failure, but secondary is read-only only during failover.\n- **GZRS**: ZRS in primary region + GRS replication to secondary. Best balance of resilience.\n- **RA-GRS / RA-GZRS**: Same as GRS/GZRS but with read access to secondary endpoint at all times.\n\nAccount failover is available for GRS/GZRS accounts — you can initiate a failover that promotes the secondary region to primary.",
          code: {
            lang: "bash",
            label: "Create a storage account with GZRS redundancy",
            snippet: `az storage account create \\
  --name mystorageaccount \\
  --resource-group myResourceGroup \\
  --location eastus \\
  --sku Standard_GZRS \\
  --kind StorageV2 \\
  --access-tier Hot`,
          },
        },
        {
          heading: "Blob Lifecycle Management",
          body: "Lifecycle management policies automatically tier or delete blobs based on age or last access time, reducing storage costs without manual intervention. Rules are defined in JSON and applied at the storage account or container level.\n\nA typical policy might move blobs from **Hot** to **Cool** after 30 days of no access, to **Cold** after 90 days, to **Archive** after 180 days, and delete them after 365 days. Each tier transition must respect the minimum retention days for the source tier.\n\nFor version-enabled accounts, you can apply separate rules to **current versions** and **previous versions**, allowing automatic cleanup of old blob versions.",
          code: {
            lang: "bash",
            label: "Apply a lifecycle policy to tier blobs automatically",
            snippet: `az storage account management-policy create \\
  --account-name mystorageaccount \\
  --resource-group myResourceGroup \\
  --policy '{
    "rules": [{
      "name": "tiering-rule",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {"blobTypes": ["blockBlob"]},
        "actions": {
          "baseBlob": {
            "tierToCool": {"daysAfterLastAccessTimeGreaterThan": 30},
            "tierToArchive": {"daysAfterLastAccessTimeGreaterThan": 180},
            "delete": {"daysAfterLastAccessTimeGreaterThan": 365}
          }
        }
      }
    }]
  }'`,
          },
        },
        {
          heading: "Storage Access Control",
          body: "Azure Storage supports multiple access control mechanisms, each with different security tradeoffs:\n\n- **Shared key**: Full account access using the storage account key. Use only for server-side applications where the key can be stored securely.\n- **SAS tokens**: Time-limited, scoped access tokens. Account SAS grants access to service operations; Service SAS grants access to specific resources; **User Delegation SAS** is signed with Entra ID credentials (preferred — no storage key needed).\n- **Stored access policies**: Policies attached to a container that SAS tokens can reference. Allows revoking access by modifying the policy, even for already-issued SAS tokens.\n- **Entra ID RBAC**: Assign built-in roles like `Storage Blob Data Contributor` to users or managed identities. This is the most secure and auditable approach.\n\nMicrosoft recommends disabling shared key access and using Entra ID RBAC and user delegation SAS wherever possible.",
        },
      ],
      quiz: [
        {
          id: "az104-d2-q1",
          question:
            "A company needs Azure Blob Storage that remains readable from a secondary region even when the primary region is fully available. Which redundancy option should they choose?",
          options: [
            "A) GRS — geo-redundant storage with secondary failover.",
            "B) RA-GRS — read-access geo-redundant storage with an always-readable secondary endpoint.",
            "C) ZRS — zone-redundant storage across three availability zones.",
            "D) LRS — locally redundant storage with three local copies.",
          ],
          correctIndex: 1,
          explanation:
            "RA-GRS provides an always-readable secondary endpoint even when the primary region is healthy. Standard GRS (A) replicates to a secondary region, but the secondary is only accessible during a failover event. ZRS (C) protects against datacenter failure within a region but has no secondary region. LRS (D) provides no redundancy beyond a single datacenter.",
        },
        {
          id: "az104-d2-q2",
          question:
            "An application stored blobs in Archive tier. A user urgently needs to access one of those blobs. What must be done first?",
          options: [
            "A) Delete the blob and re-upload it to Hot tier.",
            "B) Change the blob's access tier to Hot or Cool (rehydrate it) and wait for the process to complete.",
            "C) Copy the blob to a different storage account — it becomes instantly readable.",
            "D) Enable read access on the Archive tier through the Azure portal.",
          ],
          correctIndex: 1,
          explanation:
            "Archive tier blobs are stored offline and must be rehydrated by changing the access tier to Hot or Cool before they can be read. Standard rehydration can take up to 15 hours; High Priority rehydration takes under 1 hour for blobs under 10 GB. Deleting and re-uploading (A) would require having the data elsewhere. Copying (C) still requires rehydration on the source. Archive blobs cannot be made directly readable (D).",
        },
        {
          id: "az104-d2-q3",
          question:
            "A company issues SAS tokens to external partners for time-limited access to Azure Blob Storage. A security incident requires immediately revoking access for one partner's SAS token before it expires. What is the FASTEST approach if stored access policies were NOT used?",
          options: [
            "A) Delete the container the partner had access to.",
            "B) Rotate the storage account key used to sign the SAS token.",
            "C) Update the SAS token's expiry time to a past date.",
            "D) Remove the partner's IP from the storage firewall.",
          ],
          correctIndex: 1,
          explanation:
            "Ad-hoc SAS tokens (not backed by a stored access policy) are cryptographically signed with the storage account key. Rotating that key immediately invalidates all SAS tokens signed with it. Deleting the container (A) destroys data, not just access. SAS tokens are immutable once issued — you cannot modify their expiry (C). IP-based firewall rules (D) can block access but only if the SAS token specified an IP restriction.",
        },
        {
          id: "az104-d2-q4",
          question:
            "An on-premises file server has 20 TB of data. Users need to access files locally with low latency, but the company wants to reduce on-premises storage costs by moving cold data to Azure. Which solution should be used?",
          options: [
            "A) Azure Blob Storage with lifecycle management policies.",
            "B) Azure File Sync with cloud tiering enabled.",
            "C) Azure Data Box to migrate files to Azure Files.",
            "D) Azure Backup to archive the file server data.",
          ],
          correctIndex: 1,
          explanation:
            "Azure File Sync with cloud tiering stores frequently accessed files locally and automatically moves cold files to Azure Files, replacing them with lightweight stubs. Users access all files through the existing UNC path — the sync agent fetches tiered files transparently on demand. Blob Storage (A) is not a file server replacement. Data Box (C) performs one-time migration, not ongoing tiering. Azure Backup (D) creates recovery copies but does not provide file access.",
        },
        {
          id: "az104-d2-q5",
          question:
            "A financial institution must ensure that audit log blobs in a storage account cannot be modified or deleted for 7 years to meet regulatory requirements. Which configuration achieves this?",
          options: [
            "A) Apply a CanNotDelete resource lock to the storage account.",
            "B) Enable blob versioning and set retention policies to 7 years.",
            "C) Configure a time-based immutability policy (WORM) with a 7-year retention period on the container.",
            "D) Set the container access level to Private and restrict RBAC roles.",
          ],
          correctIndex: 2,
          explanation:
            "A time-based retention policy (WORM — Write Once, Read Many) in compliance mode prevents any modification or deletion of blobs for the retention duration, even by subscription owners. This meets regulatory immutability requirements. A CanNotDelete lock (A) prevents deletion but allows overwrites. Versioning (B) preserves history but does not prevent deletion of all versions. RBAC restrictions (D) can be bypassed by privileged administrators.",
        },
        {
          id: "az104-d2-q6",
          question:
            "A company wants to restrict access to their storage account so that only resources within a specific Azure virtual network can connect. Which feature should they configure?",
          options: [
            "A) Storage account shared access signatures with IP restriction.",
            "B) Virtual network service endpoints or private endpoints on the storage account firewall.",
            "C) Azure Front Door with origin restrictions.",
            "D) Storage account customer-managed keys (CMK) with Key Vault.",
          ],
          correctIndex: 1,
          explanation:
            "Storage firewall rules combined with virtual network service endpoints (or private endpoints) restrict storage account access to traffic originating from specified VNets. Service endpoints route traffic through the Azure backbone; private endpoints assign a private IP in the VNet. SAS IP restrictions (A) limit by IP range but cannot enforce VNet membership. Azure Front Door (C) is a CDN/load balancer, not a storage firewall. CMK (D) is an encryption feature, not a network access control.",
        },
        {
          id: "az104-d2-q7",
          question:
            "Which Azure Storage service should be used to host an SMB file share accessible from both Azure VMs and on-premises Windows servers?",
          options: [
            "A) Azure Blob Storage with a shared access policy.",
            "B) Azure Queue Storage for shared message passing.",
            "C) Azure Files with an SMB file share.",
            "D) Azure Table Storage with entity-based access.",
          ],
          correctIndex: 2,
          explanation:
            "Azure Files provides fully managed SMB and NFS file shares accessible from Azure VMs and on-premises machines (via VPN or ExpressRoute, or directly over port 445). Blob Storage (A) uses HTTP/HTTPS REST, not SMB. Queue Storage (B) is for messaging, not file sharing. Table Storage (D) is a NoSQL key-value store.",
        },
        {
          id: "az104-d2-q8",
          question:
            "An administrator needs to generate a SAS token that is more secure than an account-key-signed SAS. Which SAS type should they use?",
          options: [
            "A) Account SAS — uses the storage account key but has broader scope.",
            "B) Service SAS — scoped to a specific service but still signed with account key.",
            "C) User Delegation SAS — signed with Entra ID credentials, not the storage account key.",
            "D) Stored access policy — defines the SAS parameters server-side.",
          ],
          correctIndex: 2,
          explanation:
            "A User Delegation SAS is signed using Entra ID credentials obtained via `az storage blob generate-sas --auth-mode login`. It does not require the storage account key, so key exposure is not a risk. Account SAS (A) and Service SAS (B) are both signed with the storage account key. A stored access policy (D) is not a SAS type itself — it is a server-side policy that a SAS token can reference, but the SAS still needs to be signed with account key or Entra ID credentials.",
        },
        {
          id: "az104-d2-q9",
          question:
            "A company stores log files in Azure Blob Storage. After 30 days, logs are rarely accessed. After 180 days, they are never accessed but must be retained for 2 years. What is the MOST cost-effective tier strategy?",
          options: [
            "A) Keep all logs in Hot tier for simplicity.",
            "B) Move to Cool at 30 days, Archive at 180 days, delete at 730 days.",
            "C) Move to Archive at 30 days, delete at 180 days.",
            "D) Move to Cool at 30 days and delete at 180 days.",
          ],
          correctIndex: 1,
          explanation:
            "A lifecycle policy that transitions to Cool at 30 days (reducing storage cost for rarely accessed data), then to Archive at 180 days (lowest cost for data that will not be accessed), and deletes at 730 days (2 years) meets all requirements at minimum cost. Keeping in Hot (A) is wasteful. Archiving at 30 days (C) may be too aggressive and incurs early deletion penalties if the Cool minimum (30 days) is not observed. Deleting at 180 days (D) violates the 2-year retention requirement.",
        },
        {
          id: "az104-d2-q10",
          question:
            "A developer accidentally deletes an important blob. The storage account has blob soft delete enabled with a 14-day retention period. How can the blob be recovered?",
          options: [
            "A) The blob is permanently deleted and cannot be recovered.",
            "B) Use the Azure portal or CLI to undelete the blob within the 14-day retention window.",
            "C) Restore from the most recent Azure Backup snapshot.",
            "D) Contact Microsoft support to restore the blob from Azure's internal backups.",
          ],
          correctIndex: 1,
          explanation:
            "With blob soft delete enabled, deleted blobs are retained for the configured retention period (14 days here) and can be undeleted via the portal (`az storage blob undelete`) or SDK. After the retention period, the blob is permanently purged. Azure Backup (C) is a separate service for VM and database backups, not blob-level recovery. Microsoft support (D) does not provide access to customer data for restoration.",
        },
        {
          id: "az104-d2-q11",
          question:
            "What is the minimum number of days a blob must remain in Cool tier before it can be deleted without incurring an early deletion penalty?",
          options: [
            "A) 0 days — no minimum retention period for Cool tier.",
            "B) 30 days.",
            "C) 90 days.",
            "D) 180 days.",
          ],
          correctIndex: 1,
          explanation:
            "Cool tier has a minimum retention period of 30 days. Deleting or moving a blob out of Cool tier before 30 days incurs an early deletion fee for the remaining days. Cold tier has a 90-day minimum, and Archive tier has a 180-day minimum. Hot tier has no minimum retention period.",
        },
        {
          id: "az104-d2-q12",
          question:
            "An administrator needs to copy 500 TB of data from on-premises to Azure Blob Storage over a 1 Gbps internet connection. The transfer must complete within 2 weeks. Which service should they use?",
          options: [
            "A) `azcopy` over the internet connection.",
            "B) Azure Import/Export service with physical disks shipped to a Microsoft datacenter.",
            "C) Azure Data Box to physically ship the data.",
            "D) ExpressRoute with a 10 Gbps circuit.",
          ],
          correctIndex: 2,
          explanation:
            "500 TB over 1 Gbps would take approximately 45+ days even at full line rate. Azure Data Box (80 TB device) or Data Box Heavy (770 TB) physically ships data to a Microsoft datacenter for ingestion, completing within the 2-week window. Azure Import/Export (B) also ships physical disks but requires customers to supply disks and is more complex. `azcopy` (A) cannot complete in time. ExpressRoute (D) increases bandwidth but provisioning takes weeks and 10 Gbps for 500 TB would still take 4+ days.",
        },
        {
          id: "az104-d2-q13",
          question:
            "A storage account firewall is configured to deny all access by default. An Azure Function needs to access Blob Storage. The Function is not in a VNet. How should access be granted without opening the firewall to the internet?",
          options: [
            "A) Add the Function's outbound IP address to the storage firewall allowlist.",
            "B) Enable the 'Allow trusted Microsoft services' exception on the storage firewall and use managed identity.",
            "C) Disable the storage firewall temporarily during Function execution.",
            "D) Use a SAS token with an IP restriction matching the Function's IP.",
          ],
          correctIndex: 1,
          explanation:
            "The 'Allow trusted Microsoft services' exception permits specific Azure services (including Azure Functions with managed identities) to bypass the storage firewall. Combined with a managed identity and RBAC role assignment on the storage account, this provides secure access without opening the firewall. Functions' outbound IPs (A) can change and are not reliable. Disabling the firewall (C) eliminates the security control. SAS tokens with IP restrictions (D) still require the IP to be allowed through the firewall.",
        },
        {
          id: "az104-d2-q14",
          question:
            "Which Azure storage redundancy option provides protection against an entire Azure region becoming unavailable, while also protecting against a zone failure within the primary region?",
          options: [
            "A) ZRS — Zone-Redundant Storage.",
            "B) GRS — Geo-Redundant Storage.",
            "C) GZRS — Geo-Zone-Redundant Storage.",
            "D) LRS — Locally Redundant Storage.",
          ],
          correctIndex: 2,
          explanation:
            "GZRS combines ZRS in the primary region (protection against zone failure) with geo-replication to a secondary region (protection against regional failure). ZRS (A) only protects against zone failures. GRS (B) protects against regional failure but uses LRS in the primary region (no zone protection). LRS (D) provides no zone or regional protection.",
        },
        {
          id: "az104-d2-q15",
          question:
            "An Azure administrator wants to monitor all read, write, and delete operations on a storage account for security auditing. Which diagnostic setting should they enable?",
          options: [
            "A) Azure Monitor Metrics for the storage account.",
            "B) Storage Analytics logging (or Azure Monitor resource logs) for all storage services.",
            "C) Azure Security Center continuous export.",
            "D) Activity Log alerts for the storage account.",
          ],
          correctIndex: 1,
          explanation:
            "Storage Analytics logging (now surfaced as Azure Monitor resource logs for storage) records detailed request-level logs for Blob, Queue, Table, and File operations, including read, write, and delete with caller IP and authentication type. Azure Monitor Metrics (A) provide aggregate performance data, not per-request auditing. Security Center (C) focuses on security recommendations. Activity Log (D) records control-plane operations (creating/deleting the storage account), not data-plane read/write/delete operations.",
        },
      ],
    },

    // ─── Domain 3: Deploy and Manage Azure Compute Resources (20%) ──
    {
      id: "domain-3",
      title: "Deploy and Manage Azure Compute Resources",
      weight: "20%",
      order: 3,
      summary:
        "This domain covers deploying and managing virtual machines, containers, and serverless compute on Azure. At 20% of the exam, it tests hands-on skills across the full compute lifecycle: provisioning, sizing, scaling, availability, and cost management.\n\nKey topics include VM deployment (images, sizes, managed disks, extensions), **availability sets** vs. **Availability Zones** vs. **Virtual Machine Scale Sets (VMSS)**, Azure App Service plans, **Azure Kubernetes Service (AKS)**, and **Azure Container Instances (ACI)**. ARM templates and Bicep are frequently tested for declarative deployments.\n\nExpect questions on configuring VM backup, disaster recovery with **Azure Site Recovery**, auto-scaling rules for VMSS, App Service deployment slots, and the difference between IaaS, PaaS, and serverless tradeoffs on Azure.",
      keyConceptsForExam: [
        "**VM availability** — availability sets (fault domains + update domains), Availability Zones (physical datacenter isolation), and VMSS for scale + availability",
        "**Managed disks** — disk types (Ultra, Premium SSD, Standard SSD, Standard HDD), sizing, performance tiers, snapshots, and shared disks",
        "**Azure App Service** — plans (Free, Shared, Basic, Standard, Premium, Isolated), deployment slots, autoscale, and custom domains/TLS",
        "**Azure Container Instances** — quick serverless containers without orchestration; use cases vs. AKS",
        "**Azure Kubernetes Service (AKS)** — node pools, cluster autoscaler, managed identity integration, Azure CNI vs. kubenet",
        "**ARM templates and Bicep** — declarative IaC, parameters, variables, modules, and deployment modes (complete vs. incremental)",
        "**Azure Site Recovery** — disaster recovery for VMs to a secondary region; replication, failover, failback",
        "**Azure Backup** — backup policies, recovery services vault, instant restore, cross-region restore",
      ],
      examTips: [
        "Availability sets protect against hardware failures (fault domains) and planned maintenance (update domains) within a single datacenter. Availability Zones protect against entire datacenter failures. VMSS spans zones for both scale and zone resilience.",
        "App Service deployment slots allow zero-downtime deployments — swap staging to production after testing. Settings can be 'slot-sticky' or swap with the slot.",
        "Azure Site Recovery provides continuous replication — the RPO is measured in seconds. Know the difference between a test failover (non-disruptive) and a planned/unplanned failover.",
        "Ultra Disk is only available in specific regions and zones and requires a VM that supports ultra disks — it is not universally available like Premium SSD.",
        "Spot VMs are significantly cheaper but can be evicted with 30 seconds notice. Use them for fault-tolerant, interruptible workloads like batch processing.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-vm-basics", title: "Azure Virtual Machines" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
      ],
      sections: [
        {
          heading: "VM Availability Architecture",
          body: "Choosing the right availability configuration is critical for SLA and resilience:\n\n- **Availability Sets**: Group VMs across fault domains (separate power/network hardware) and update domains (staggered maintenance). SLA: 99.95%. Single datacenter only.\n- **Availability Zones**: Deploy VMs to physically separate datacenters (zones) within a region. SLA: 99.99%. Protects against datacenter failure.\n- **Virtual Machine Scale Sets (VMSS)**: Automatically scale VM count based on demand. Can be deployed across zones for resilience + elasticity. Use the **Flexible orchestration mode** for most new deployments.\n\nFor maximum resilience, combine VMSS with Availability Zones. Use **proximity placement groups** when low latency between VMs is critical.",
          code: {
            lang: "bash",
            label: "Create a zone-redundant VM Scale Set",
            snippet: `az vmss create \\
  --name myScaleSet \\
  --resource-group myResourceGroup \\
  --image Ubuntu2204 \\
  --vm-sku Standard_D2s_v5 \\
  --instance-count 3 \\
  --zones 1 2 3 \\
  --orchestration-mode Flexible \\
  --admin-username azureuser \\
  --generate-ssh-keys`,
          },
        },
        {
          heading: "App Service Deployment Slots",
          body: "Azure App Service deployment slots enable zero-downtime deployments and A/B testing. Each App Service plan at Standard tier or above supports additional slots (staging, QA, canary).\n\n**Swap operation**: traffic routing switches between slots atomically. Warm-up requests are sent to the new slot before the swap completes. **Slot-sticky settings** (connection strings, app settings marked as slot-specific) do not swap — they stay with the slot.\n\nUse the `az webapp deployment slot swap` command or the portal to perform swaps. For canary releases, use **traffic routing rules** to send a percentage of traffic to a non-production slot before a full swap.",
          code: {
            lang: "bash",
            label: "Create a staging slot and deploy to it",
            snippet: `# Create staging slot
az webapp deployment slot create \\
  --name myWebApp \\
  --resource-group myResourceGroup \\
  --slot staging

# Deploy to staging slot
az webapp deploy \\
  --name myWebApp \\
  --resource-group myResourceGroup \\
  --slot staging \\
  --src-path ./app.zip

# Swap staging to production (zero-downtime)
az webapp deployment slot swap \\
  --name myWebApp \\
  --resource-group myResourceGroup \\
  --slot staging \\
  --target-slot production`,
          },
        },
        {
          heading: "Azure Backup and Site Recovery",
          body: "**Azure Backup** protects VMs, Azure Files shares, SQL databases, and more. It stores backups in a **Recovery Services Vault** (or Backup Vault). Backup policies define frequency and retention. **Instant restore** allows fast recovery from recent snapshots stored locally before being transferred to the vault.\n\n**Azure Site Recovery (ASR)** provides disaster recovery by continuously replicating VMs to a secondary Azure region. Key concepts:\n- **Replication policy**: defines RPO (recovery point objective — default 24 hours, configurable to minutes)\n- **Test failover**: validates recovery without impacting production\n- **Planned failover**: graceful migration with no data loss\n- **Unplanned failover**: emergency failover during a regional outage\n- **Failback**: return operations to the primary region after recovery\n\nASR can also replicate on-premises VMware or Hyper-V VMs to Azure.",
        },
      ],
      quiz: [
        {
          id: "az104-d3-q1",
          question:
            "A company runs critical VMs that must withstand an entire Azure datacenter failure with a 99.99% SLA. What configuration should they use?",
          options: [
            "A) Deploy VMs in an availability set with 3 fault domains.",
            "B) Deploy VMs across Availability Zones in the same region.",
            "C) Deploy VMs with Premium SSD managed disks.",
            "D) Enable Azure Site Recovery with replication to a secondary region.",
          ],
          correctIndex: 1,
          explanation:
            "Availability Zones place VMs in physically separate datacenters within a region, providing 99.99% SLA and protection against datacenter failure. Availability sets (A) protect against hardware and maintenance events within a single datacenter (99.95% SLA) but not datacenter failure. Premium SSD (C) improves disk performance but not VM availability. Azure Site Recovery (D) provides cross-region disaster recovery but is a DR solution, not a HA configuration within a region.",
        },
        {
          id: "az104-d3-q2",
          question:
            "A developer wants to run a containerized application on Azure for a short duration without managing any infrastructure or orchestration. Which service is MOST appropriate?",
          options: [
            "A) Azure Kubernetes Service (AKS) with a single-node cluster.",
            "B) Azure Container Instances (ACI) with a container group.",
            "C) Azure App Service with a custom Docker container.",
            "D) Azure Virtual Machine with Docker installed.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Container Instances provides serverless containers that start in seconds with no infrastructure management or orchestration layer. It is ideal for short-running, burst, or simple container workloads. AKS (A) requires cluster provisioning and management overhead. App Service (C) works for web apps but requires a plan and is more suited to long-running services. A VM with Docker (D) requires full infrastructure management.",
        },
        {
          id: "az104-d3-q3",
          question:
            "An App Service web app is experiencing performance issues during peak hours. The team wants traffic to automatically scale out to additional instances. Which App Service plan tier is the MINIMUM required for autoscale?",
          options: [
            "A) Free (F1) — autoscale is available on all tiers.",
            "B) Basic (B1) — supports manual scaling only.",
            "C) Standard (S1) — supports autoscale rules based on metrics.",
            "D) Premium (P1v3) — required for any scaling beyond 1 instance.",
          ],
          correctIndex: 2,
          explanation:
            "Autoscale (rule-based automatic scaling) for App Service requires the Standard tier or higher. Basic tier (B) supports manual scaling to a fixed instance count. Free and Shared tiers (A) do not support scaling at all. Premium (D) supports autoscale but is not the minimum — Standard is sufficient.",
        },
        {
          id: "az104-d3-q4",
          question:
            "A company uses Azure Backup to protect production VMs. A VM was accidentally deleted. What is the FIRST step to restore the VM?",
          options: [
            "A) Re-create the VM from the original marketplace image.",
            "B) Open a support ticket with Microsoft to restore the VM.",
            "C) Go to the Recovery Services Vault, find the VM's backup item, and initiate a restore operation.",
            "D) Use Azure Site Recovery to failover to the secondary region.",
          ],
          correctIndex: 2,
          explanation:
            "Azure Backup stores VM recovery points in the Recovery Services Vault. To restore, navigate to the vault, select the backup item for the deleted VM, choose a recovery point, and restore (to a new VM or original location). This is a self-service operation. Microsoft support (B) cannot access customer data. ASR (D) is for cross-region DR, not backup restoration.",
        },
        {
          id: "az104-d3-q5",
          question:
            "A team deploys Azure infrastructure using ARM templates. After updating a template and redeploying, they notice a resource that was manually added to the resource group is gone. Which deployment mode caused this?",
          options: [
            "A) Incremental mode — adds new resources without removing existing ones.",
            "B) Complete mode — deletes resources in the resource group not defined in the template.",
            "C) Validate mode — this mode deletes non-compliant resources.",
            "D) What-if mode — previews changes including deletion of unmanaged resources.",
          ],
          correctIndex: 1,
          explanation:
            "ARM template `Complete` mode compares the template to the resource group and deletes any resources in the group that are not defined in the template. `Incremental` mode (A) only adds or updates resources — it never deletes existing resources not in the template. `Validate` mode (C) validates the template syntax and parameter values without making changes. `What-if` mode (D) previews changes without applying them.",
        },
        {
          id: "az104-d3-q6",
          question:
            "A company needs to test a DR plan for their Azure VMs without impacting production workloads. Which Azure Site Recovery operation should they use?",
          options: [
            "A) Planned failover — triggers a graceful migration to the secondary region.",
            "B) Unplanned failover — simulates a disaster scenario.",
            "C) Test failover — validates DR readiness in an isolated network without production impact.",
            "D) Failback — returns workloads to the primary region.",
          ],
          correctIndex: 2,
          explanation:
            "ASR Test Failover spins up VMs in the secondary region using a replica disk, within an isolated virtual network, allowing full DR validation without affecting production. Planned failover (A) involves a graceful production migration. Unplanned failover (B) is for actual disaster response and may involve data loss. Failback (D) moves workloads back to the primary region after a failover.",
        },
        {
          id: "az104-d3-q7",
          question:
            "A Virtual Machine Scale Set needs to automatically add instances when CPU usage exceeds 75% and remove instances when it drops below 25%. Where should these rules be configured?",
          options: [
            "A) In the VM's OS-level auto-scaling configuration.",
            "B) In the VMSS autoscale settings with custom scale-out and scale-in rules based on CPU metrics.",
            "C) In Azure Monitor alerts with action groups that call the Azure REST API.",
            "D) In an Azure Automation runbook scheduled to run every 5 minutes.",
          ],
          correctIndex: 1,
          explanation:
            "VMSS autoscale settings support custom rules based on Azure Monitor metrics (like CPU percentage). You define scale-out rules (add instances when CPU > 75%) and scale-in rules (remove instances when CPU < 25%) with cooldown periods. OS-level scaling (A) is not an Azure feature. Monitor alerts with action groups (C) can trigger webhooks but is more complex than built-in VMSS autoscale. Automation runbooks (D) are a viable but unnecessarily complex approach.",
        },
        {
          id: "az104-d3-q8",
          question:
            "Which managed disk type provides the highest IOPS and lowest latency for I/O-intensive database workloads on Azure VMs?",
          options: [
            "A) Standard HDD — best for dev/test workloads.",
            "B) Standard SSD — balanced price and performance.",
            "C) Premium SSD — production workloads requiring consistent performance.",
            "D) Ultra Disk — sub-millisecond latency and highest configurable IOPS.",
          ],
          correctIndex: 3,
          explanation:
            "Ultra Disk offers the highest performance with configurable IOPS (up to 160,000) and throughput, with sub-millisecond latency. It is designed for the most demanding I/O-intensive workloads like SAP HANA or top-tier SQL databases. Premium SSD (C) is suitable for most production databases but cannot match Ultra Disk's performance. Standard SSD (B) and Standard HDD (A) are for lower-performance requirements.",
        },
        {
          id: "az104-d3-q9",
          question:
            "A company wants to run batch processing jobs on Azure VMs at the lowest possible cost. The jobs can be interrupted and restarted without data loss. Which VM purchasing option should they use?",
          options: [
            "A) On-demand VMs — pay as you go with no interruption risk.",
            "B) Reserved VM Instances — commit to 1 or 3 years for a discount.",
            "C) Azure Spot VMs — use excess Azure capacity at up to 90% discount, with eviction risk.",
            "D) Dedicated hosts — physical servers exclusively for your VMs.",
          ],
          correctIndex: 2,
          explanation:
            "Azure Spot VMs use surplus Azure capacity at up to 90% discount but can be evicted with 30 seconds notice when Azure needs the capacity back. They are ideal for fault-tolerant, interruptible batch workloads. On-demand (A) is more expensive but uninterruptible. Reserved instances (B) provide discounts for steady-state workloads with committed usage. Dedicated hosts (D) are the most expensive option, for compliance/isolation requirements.",
        },
        {
          id: "az104-d3-q10",
          question:
            "An administrator needs to run a custom script on 50 existing Azure VMs to install a monitoring agent. What is the MOST efficient method?",
          options: [
            "A) RDP/SSH into each VM and run the script manually.",
            "B) Use Azure VM extensions (Custom Script Extension) deployed via Azure Policy or ARM template to all VMs.",
            "C) Create a new VM image with the agent pre-installed and re-deploy all VMs.",
            "D) Use Azure Automation DSC to enforce the desired state on all VMs.",
          ],
          correctIndex: 1,
          explanation:
            "The Custom Script Extension downloads and runs scripts on VMs without requiring RDP/SSH. Deploying it via Azure Policy (`DeployIfNotExists`) or an ARM template ensures all 50 VMs receive the script efficiently. Manual access (A) is not scalable. Re-imaging (C) is disruptive and requires VM replacement. Azure Automation DSC (D) is a valid approach but is more complex to set up for a one-time script deployment.",
        },
        {
          id: "az104-d3-q11",
          question:
            "What is the key difference between Azure Container Instances (ACI) and Azure Kubernetes Service (AKS)?",
          options: [
            "A) ACI supports Docker images; AKS only supports custom images.",
            "B) ACI is serverless with no cluster management; AKS provides full container orchestration with auto-scaling, service discovery, and rolling updates.",
            "C) AKS is cheaper than ACI for all workload sizes.",
            "D) ACI requires a virtual network; AKS can run without networking configuration.",
          ],
          correctIndex: 1,
          explanation:
            "ACI is a serverless offering for running individual containers or simple multi-container groups without managing infrastructure. AKS provides full Kubernetes orchestration — scheduling, auto-scaling, health management, rolling updates, service mesh integration, and more. Both support Docker images (A). AKS node VMs incur costs making it more expensive than ACI for simple, short-running workloads (C). ACI can run in a VNet optionally (D).",
        },
        {
          id: "az104-d3-q12",
          question:
            "A company needs to deploy the same Azure infrastructure across 10 different environments (dev, staging, prod, etc.) consistently. Which approach provides the BEST repeatability and version control?",
          options: [
            "A) Deploy each environment manually through the Azure portal.",
            "B) Use Bicep templates stored in a git repository and deployed via CI/CD pipelines.",
            "C) Clone the production resource group for each new environment.",
            "D) Use Azure Cost Management templates to replicate environments.",
          ],
          correctIndex: 1,
          explanation:
            "Bicep (or ARM templates) stored in source control and deployed via CI/CD pipelines provide declarative, repeatable, version-controlled infrastructure deployments. Changes are tracked, reviewed, and tested before applying. Manual portal deployments (A) are error-prone and not repeatable. Resource group cloning (C) is not a native Azure feature. Azure Cost Management (D) is for cost analysis and budgets, not infrastructure deployment.",
        },
        {
          id: "az104-d3-q13",
          question:
            "An App Service application settings value must be different in staging vs. production slots and must NOT swap when a slot swap occurs. How should this setting be configured?",
          options: [
            "A) Store the setting in Azure Key Vault and reference it in both slots.",
            "B) Mark the app setting as a deployment slot setting (slot-sticky) in the App Service configuration.",
            "C) Create separate App Service plans for staging and production.",
            "D) Use environment variables set at the OS level inside the container.",
          ],
          correctIndex: 1,
          explanation:
            "Deployment slot settings (marked as slot-sticky) remain with the slot during a swap — the staging slot's value stays in staging and the production slot's value stays in production, even after swapping the code. Key Vault references (A) can be used to store values but do not prevent them from swapping unless also marked slot-sticky. Separate plans (C) are unnecessary and more expensive. OS-level environment variables (D) would also swap with the container.",
        },
        {
          id: "az104-d3-q14",
          question:
            "What is the Recovery Point Objective (RPO) that Azure Site Recovery can achieve for Azure-to-Azure VM replication?",
          options: [
            "A) RPO of 24 hours — snapshots are taken once per day.",
            "B) RPO of 1 hour — replication occurs hourly.",
            "C) RPO as low as seconds — continuous replication with crash-consistent recovery points every 5 minutes.",
            "D) RPO of 0 — synchronous replication guarantees no data loss.",
          ],
          correctIndex: 2,
          explanation:
            "Azure Site Recovery provides continuous replication with crash-consistent recovery points every 5 minutes and app-consistent recovery points configurable from 1 hour to 12 hours. This results in a very low RPO measured in minutes or seconds. Replication is asynchronous, so a guaranteed RPO of 0 (D) is not possible. The 24-hour (A) and 1-hour (B) figures do not reflect ASR's continuous replication capability.",
        },
        {
          id: "az104-d3-q15",
          question:
            "A VM is running in West US. An administrator wants to take a point-in-time snapshot of the OS disk and use it to create a new VM. What is the correct sequence?",
          options: [
            "A) Create a VM snapshot → Create a managed disk from the snapshot → Create a VM from the managed disk.",
            "B) Create a VM image → Deploy a new VM from the image.",
            "C) Export the VHD to a storage account → Download it → Upload to a new region.",
            "D) Use Azure Site Recovery to replicate the VM and then failover.",
          ],
          correctIndex: 0,
          explanation:
            "The correct sequence is: (1) create a snapshot of the managed disk, (2) create a new managed disk from that snapshot, (3) create a new VM using the disk as the OS disk. This is the standard process for cloning or restoring a VM from a disk snapshot. Creating a VM image (B) captures the full image including generalizing (sysprep), which is for deploying many identical VMs, not a point-in-time restore. VHD export (C) is complex and slow. ASR (D) is for cross-region DR, not point-in-time snapshots.",
        },
      ],
    },

    // ─── Domain 4: Implement and Manage Virtual Networking (15%) ────
    {
      id: "domain-4",
      title: "Implement and Manage Virtual Networking",
      weight: "15%",
      order: 4,
      summary:
        "This domain covers designing and managing Azure virtual networks, including subnets, network security groups, routing, DNS, VPN gateways, ExpressRoute, and load balancing. Networking is the connective tissue of every Azure architecture.\n\nKey topics include **VNet peering** (regional and global), **Azure Bastion** for secure VM access, **Azure Firewall** and **Network Security Groups (NSGs)**, **User Defined Routes (UDRs)** for custom routing, **Azure VPN Gateway** for site-to-site and point-to-site VPNs, **Azure ExpressRoute** for private connectivity, and Azure load balancers (**Azure Load Balancer**, **Application Gateway**, **Azure Front Door**).\n\nExpect questions on when to use each load balancer type, how NSG rule evaluation works, the difference between VNet peering and VPN gateway, and how private DNS zones enable name resolution within VNets.",
      keyConceptsForExam: [
        "**VNet peering** — non-transitive by default; global peering spans regions; requires non-overlapping address spaces",
        "**NSG rules** — allow/deny by priority (100–4096), stateful, applied to subnet or NIC; default rules cannot be deleted",
        "**User Defined Routes (UDRs)** — override system routes; used to force traffic through NVAs or Azure Firewall",
        "**Azure Bastion** — browser-based RDP/SSH to VMs without public IPs or open ports, deployed in AzureBastionSubnet",
        "**VPN Gateway** — site-to-site (on-premises to Azure), point-to-site (client VPN), VNet-to-VNet; requires GatewaySubnet",
        "**ExpressRoute** — private, dedicated connectivity bypassing the internet; higher bandwidth and reliability than VPN",
        "**Load balancers** — Azure Load Balancer (L4, internal/public), Application Gateway (L7, WAF, SSL offload), Azure Front Door (global L7, CDN)",
        "**Private DNS zones** — custom DNS resolution within VNets; auto-registration of VM DNS records",
      ],
      examTips: [
        "VNet peering is NOT transitive — if VNet A is peered with VNet B, and VNet B is peered with VNet C, A cannot reach C. Use Azure Virtual WAN or a hub-and-spoke with gateway transit for transitive routing.",
        "NSG rules are evaluated in priority order (lowest number = highest priority). Explicitly deny rules can override broader allow rules if given a lower number.",
        "Azure Bastion requires a dedicated subnet named exactly `AzureBastionSubnet` with at least a /26 address space.",
        "ExpressRoute does NOT traverse the public internet. VPN Gateway does (encrypted). For compliance scenarios requiring private connectivity, ExpressRoute is always the answer.",
        "Application Gateway is regional; Azure Front Door is global. Use Front Door for multi-region traffic distribution, WAF at the edge, and CDN capabilities.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
        { cloud: "azure", topicId: "azure-vm-basics", title: "Azure Virtual Machines" },
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
      ],
      sections: [
        {
          heading: "Network Security Groups and Traffic Flow",
          body: "NSGs are stateful firewalls applied to subnets or individual VM NICs. Rules define priority, source/destination (IP, CIDR, service tag, or application security group), port, protocol, and allow/deny action. Lower priority numbers are evaluated first.\n\n**Default rules** in every NSG allow all inbound traffic within the VNet and all outbound traffic to the internet (rules 65000–65500). A rule with priority < 65000 can override these defaults.\n\n**Service tags** (e.g., `AzureLoadBalancer`, `Internet`, `VirtualNetwork`) represent groups of Azure service IP ranges, reducing the need to manage IP lists. **Application Security Groups (ASGs)** allow grouping VMs logically and referencing the group in NSG rules instead of IP addresses.\n\nWhen an NSG is applied to both a subnet and a NIC, both are evaluated — inbound traffic passes the subnet NSG first, then the NIC NSG; outbound traffic passes the NIC NSG first, then the subnet NSG.",
          code: {
            lang: "bash",
            label: "Create an NSG rule to allow HTTPS traffic from the internet",
            snippet: `az network nsg rule create \\
  --resource-group myResourceGroup \\
  --nsg-name myNSG \\
  --name Allow-HTTPS-Inbound \\
  --priority 100 \\
  --direction Inbound \\
  --source-address-prefixes Internet \\
  --destination-port-ranges 443 \\
  --protocol Tcp \\
  --access Allow`,
          },
        },
        {
          heading: "VNet Peering and Hub-Spoke Topology",
          body: "VNet peering connects two virtual networks with low-latency, high-bandwidth links using the Microsoft backbone — no gateways or public internet required. Peering is non-transitive by default.\n\nThe **hub-spoke topology** places shared services (firewall, DNS, VPN/ExpressRoute gateway) in a hub VNet, with spoke VNets for individual workloads. To enable spoke-to-spoke communication through the hub:\n1. Deploy Azure Firewall or an NVA in the hub.\n2. Enable **gateway transit** on the hub peering and **use remote gateway** on spoke peerings — this allows spoke VNets to use the hub's VPN/ExpressRoute gateway.\n3. Create UDRs in spoke subnets routing 0.0.0.0/0 to the hub firewall's private IP.\n\n**Azure Virtual WAN** provides a managed hub-and-spoke with built-in routing, simplifying large-scale deployments.",
        },
        {
          heading: "Azure Load Balancer Types",
          body: "Choosing the right load balancer depends on the OSI layer, scope, and features required:\n\n| Service | Layer | Scope | Key Features |\n|---|---|---|---|\n| Azure Load Balancer | L4 (TCP/UDP) | Regional | HA ports, internal/external, zone-redundant |\n| Application Gateway | L7 (HTTP/S) | Regional | URL-based routing, WAF, SSL termination, session affinity |\n| Azure Front Door | L7 (HTTP/S) | Global | CDN, WAF, multi-region failover, latency-based routing |\n| Traffic Manager | DNS | Global | DNS-based routing, geographics, priority, weighted |\n\nFor exam questions: if the requirement is HTTP/HTTPS with WAF and you need **regional** load balancing, choose **Application Gateway**. If you need **global** HTTP load balancing, choose **Azure Front Door**. For non-HTTP or internal load balancing, choose **Azure Load Balancer**.",
        },
      ],
      quiz: [
        {
          id: "az104-d4-q1",
          question:
            "Three VNets (A, B, C) are configured with peering: A↔B and B↔C. Can VNet A communicate with VNet C?",
          options: [
            "A) Yes — peering is transitive, so A can reach C through B.",
            "B) No — VNet peering is non-transitive. A direct A↔C peering or a routing solution (like Azure Virtual WAN) is required.",
            "C) Yes — if B's NSG allows traffic from A to C.",
            "D) No — peering only supports two VNets maximum.",
          ],
          correctIndex: 1,
          explanation:
            "Azure VNet peering is non-transitive by default. A↔B and B↔C peerings exist, but traffic from A cannot transit through B to reach C without additional configuration (direct A↔C peering, Azure Virtual WAN, or a hub NVA/firewall with UDRs). NSG rules (C) cannot override the non-transitive peering limitation. VNet peering supports any number of peerings per VNet (D).",
        },
        {
          id: "az104-d4-q2",
          question:
            "A company needs secure browser-based RDP access to Windows VMs in a private subnet without assigning public IP addresses or opening RDP port 3389 to the internet. Which Azure service enables this?",
          options: [
            "A) Azure VPN Gateway with point-to-site VPN.",
            "B) Azure Bastion deployed in the AzureBastionSubnet.",
            "C) Azure Firewall with a DNAT rule for RDP traffic.",
            "D) A jump box (VM) with a public IP in the same VNet.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Bastion provides browser-based RDP and SSH to VMs using the Azure portal over TLS 443, without public IPs or open RDP/SSH ports. It is deployed in a dedicated AzureBastionSubnet. VPN Gateway (A) provides VPN access but requires a VPN client installed on the user's machine. Azure Firewall DNAT (C) would require opening port 3389 externally. A jump box (D) requires a public IP and an open port, which violates the requirement.",
        },
        {
          id: "az104-d4-q3",
          question:
            "A company requires a private, dedicated connection from their on-premises datacenter to Azure with consistent bandwidth, low latency, and no internet traversal. Which connectivity option should they choose?",
          options: [
            "A) Azure VPN Gateway with a site-to-site VPN over the internet.",
            "B) Azure ExpressRoute through a connectivity provider.",
            "C) Azure VNet peering between on-premises and Azure VNets.",
            "D) Azure Bastion for on-premises to cloud connectivity.",
          ],
          correctIndex: 1,
          explanation:
            "Azure ExpressRoute provides a private, dedicated circuit through a connectivity provider that does not traverse the public internet, offering consistent bandwidth (50 Mbps to 100 Gbps) and guaranteed SLAs. VPN Gateway (A) uses the internet and is subject to internet variability. VNet peering (C) only connects Azure VNets, not on-premises networks. Azure Bastion (D) is for VM access, not network connectivity.",
        },
        {
          id: "az104-d4-q4",
          question:
            "An NSG has a rule with priority 100 that denies all inbound traffic from the internet. Another rule with priority 200 allows HTTPS (port 443) from the internet. What is the effective behavior?",
          options: [
            "A) HTTPS traffic is allowed — allow rules take precedence over deny rules.",
            "B) All inbound internet traffic, including HTTPS, is denied — the priority 100 deny rule is evaluated first.",
            "C) Both rules conflict; Azure applies the default allow rule.",
            "D) The rules are evaluated in parallel; the most specific rule wins.",
          ],
          correctIndex: 1,
          explanation:
            "NSG rules are processed in priority order, lowest number first. The priority 100 Deny rule is evaluated before the priority 200 Allow rule. Since the Deny rule at priority 100 matches all internet inbound traffic (including HTTPS), it denies the traffic before rule 200 is reached. There is no concept of 'allow overrides deny' in NSG evaluation — it is strictly first-match based on priority.",
        },
        {
          id: "az104-d4-q5",
          question:
            "A company wants all outbound internet traffic from VMs in a VNet to flow through Azure Firewall for inspection and logging. How should this be configured?",
          options: [
            "A) Configure an NSG rule on each subnet blocking direct internet access.",
            "B) Deploy Azure Firewall in a hub VNet and create a User Defined Route (UDR) in the VM subnets routing 0.0.0.0/0 to the firewall's private IP.",
            "C) Enable forced tunneling on the VPN Gateway to redirect all traffic to on-premises.",
            "D) Configure the VM's network interface to use Azure Firewall as its default gateway.",
          ],
          correctIndex: 1,
          explanation:
            "A UDR with a 0.0.0.0/0 route pointing to Azure Firewall's private IP forces all outbound internet traffic from the VM subnets through the firewall for inspection. NSG rules (A) can block traffic but cannot redirect it through an inspection point. Forced tunneling (C) redirects traffic to on-premises, not Azure Firewall. Network interface default gateways (D) are set by Azure automatically and cannot be manually overridden this way.",
        },
        {
          id: "az104-d4-q6",
          question:
            "An organization needs to distribute HTTPS traffic to multiple backend web servers based on the URL path (/api/* to one farm, /images/* to another). Which Azure service should they use?",
          options: [
            "A) Azure Load Balancer with a load balancing rule.",
            "B) Azure Application Gateway with path-based routing rules.",
            "C) Azure Traffic Manager with a weighted routing policy.",
            "D) Azure DNS with round-robin A records.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Application Gateway is an L7 load balancer that supports URL path-based routing, allowing different backend pools for different URL paths. Azure Load Balancer (A) operates at L4 and routes based on IP/port, not URL path. Traffic Manager (C) is a DNS-based global load balancer, not an HTTP path router. Azure DNS round-robin (D) provides basic load balancing but cannot route by URL path.",
        },
        {
          id: "az104-d4-q7",
          question:
            "Two VNets need to communicate. VNet-A is in East US (address space 10.1.0.0/16) and VNet-B is in West Europe (address space 10.2.0.0/16). Which type of VNet peering connects them?",
          options: [
            "A) Regional VNet peering — same region required.",
            "B) Global VNet peering — connects VNets across different Azure regions.",
            "C) VPN Gateway — VNet peering does not support cross-region.",
            "D) ExpressRoute Global Reach — required for cross-region VNet communication.",
          ],
          correctIndex: 1,
          explanation:
            "Global VNet peering connects VNets across different Azure regions using the Microsoft backbone network. The address spaces must not overlap (they don't — 10.1.0.0/16 and 10.2.0.0/16). Regional peering (A) is limited to VNets in the same region. VPN Gateway (C) is a valid alternative but is not required — global peering is simpler and faster. ExpressRoute Global Reach (D) connects on-premises networks, not Azure VNets.",
        },
        {
          id: "az104-d4-q8",
          question:
            "What is the minimum subnet size required for Azure Bastion deployment?",
          options: [
            "A) /29 — provides 3 usable host addresses.",
            "B) /27 — provides 27 usable host addresses.",
            "C) /26 — minimum required for Azure Bastion.",
            "D) /24 — standard subnet size for all Azure services.",
          ],
          correctIndex: 2,
          explanation:
            "Azure Bastion requires a dedicated subnet named `AzureBastionSubnet` with a minimum size of /26 (64 addresses). Microsoft recommends /26 or larger to accommodate scaling. /29 (A) and /27 (B) are too small. /24 (D) works but is larger than the minimum requirement.",
        },
        {
          id: "az104-d4-q9",
          question:
            "A company needs Azure VMs to resolve custom DNS names (e.g., `db.internal.contoso.com`) within their VNet without deploying DNS servers. Which Azure feature supports this?",
          options: [
            "A) Azure Public DNS zones — host public DNS records.",
            "B) Azure Private DNS zones — linked to VNets for private name resolution.",
            "C) VNet-level DNS settings pointing to Azure-provided DNS (168.63.129.16).",
            "D) Custom DNS configured on each VM's network interface.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Private DNS zones provide DNS name resolution within VNets for custom domain names. A private zone linked to a VNet allows VMs to resolve custom records (A, CNAME, etc.) without deploying DNS servers. Auto-registration can automatically create A records for VMs. Public DNS zones (A) are for internet-facing domains. Azure-provided DNS (C) resolves Azure-assigned names but not custom names. Per-NIC DNS (D) requires maintaining DNS settings on each VM.",
        },
        {
          id: "az104-d4-q10",
          question:
            "A company wants to inspect and filter all traffic between subnets within a VNet (east-west traffic) in addition to internet-bound traffic. Which Azure service should be used?",
          options: [
            "A) Network Security Groups applied to each subnet.",
            "B) Azure Firewall with UDRs routing inter-subnet traffic through the firewall.",
            "C) Application Gateway with WAF in the VNet.",
            "D) Azure DDoS Protection Plan on the VNet.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Firewall, combined with UDRs on each subnet routing to the firewall's private IP for both internet (0.0.0.0/0) and inter-subnet (specific CIDRs) traffic, provides centralized inspection and logging. NSGs (A) can allow/deny traffic but cannot deep-packet inspect or provide FQDN-based filtering. Application Gateway (C) is an HTTP load balancer, not a network-level traffic inspection tool. DDoS Protection (D) protects against volumetric attacks, not east-west filtering.",
        },
        {
          id: "az104-d4-q11",
          question:
            "What is the purpose of the GatewaySubnet in an Azure VNet?",
          options: [
            "A) It hosts Azure Bastion for secure VM access.",
            "B) It is a reserved subnet required by Azure VPN Gateway and ExpressRoute Gateway deployments.",
            "C) It provides outbound internet access for private subnets via NAT.",
            "D) It is where Azure Firewall must be deployed.",
          ],
          correctIndex: 1,
          explanation:
            "The `GatewaySubnet` is a dedicated subnet with the exact name required by Azure VPN Gateway and ExpressRoute Gateway. It cannot be used for VMs or other resources. Azure Bastion (A) requires `AzureBastionSubnet`. NAT gateways (C) can be applied to any subnet. Azure Firewall (D) requires `AzureFirewallSubnet`.",
        },
        {
          id: "az104-d4-q12",
          question:
            "An application generates traffic to multiple Azure PaaS services (Azure SQL, Storage, Key Vault) from VMs in a private subnet. The company wants this traffic to stay on the Microsoft network and never traverse the public internet. Which feature should be used for each service?",
          options: [
            "A) Service endpoints — route traffic through the Microsoft backbone using the service's public endpoint.",
            "B) Private endpoints — assign a private IP from the VNet to each service, keeping all traffic within the VNet.",
            "C) VNet peering to the service's VNet.",
            "D) ExpressRoute to route PaaS service traffic through the private circuit.",
          ],
          correctIndex: 1,
          explanation:
            "Private endpoints assign a private IP address from the VNet to a PaaS service, ensuring all traffic from VMs to the service uses private IP addresses within the VNet — never the public endpoint. Service endpoints (A) route traffic through the Microsoft backbone but traffic still exits the VNet to the service's public endpoint. VNet peering (C) is for VNet-to-VNet, not VNet-to-PaaS. ExpressRoute (D) routes on-premises traffic; VMs in Azure VNets access PaaS via private endpoints.",
        },
        {
          id: "az104-d4-q13",
          question:
            "A company needs to connect employees working from home to Azure resources using a VPN that authenticates with their Entra ID credentials. Which VPN type should they configure?",
          options: [
            "A) Site-to-site VPN — connects an on-premises network to Azure.",
            "B) Point-to-site VPN with OpenVPN protocol and Entra ID authentication.",
            "C) ExpressRoute with Microsoft Entra Integration.",
            "D) VNet peering with the employee's home network.",
          ],
          correctIndex: 1,
          explanation:
            "Point-to-site VPN with the OpenVPN protocol supports Entra ID authentication, allowing individual remote users to connect to Azure VNets using their corporate credentials. Site-to-site VPN (A) connects entire networks, not individual client devices. ExpressRoute (C) is a dedicated private circuit, not a remote access VPN. VNet peering (D) cannot extend to home networks.",
        },
        {
          id: "az104-d4-q14",
          question:
            "A global e-commerce company needs to route users to the nearest Azure region based on latency, with automatic failover if one region becomes unavailable. Which Azure service should they use?",
          options: [
            "A) Azure Load Balancer — distribute traffic across backend VMs.",
            "B) Azure Application Gateway — URL-path routing with WAF.",
            "C) Azure Front Door — global L7 load balancing with latency-based routing and failover.",
            "D) Azure Traffic Manager — DNS-based global load balancing with performance routing.",
          ],
          correctIndex: 2,
          explanation:
            "Azure Front Door provides global anycast-based L7 load balancing with latency-based routing, automatic failover, WAF, and CDN capabilities — ideal for global e-commerce. Traffic Manager (D) is also a global routing option but works at the DNS level (L3/4) with DNS TTL delays for failover; it is not HTTP-aware. Azure Load Balancer (A) is regional. Application Gateway (B) is regional.",
        },
        {
          id: "az104-d4-q15",
          question:
            "An administrator needs to check why a VM cannot connect to another VM in a different subnet. Which Azure Network Watcher tool should they use?",
          options: [
            "A) Azure Monitor metrics — check network throughput.",
            "B) NSG Flow Logs — review historical traffic patterns.",
            "C) Network Watcher IP flow verify — test whether a specific flow is allowed or denied by NSG rules.",
            "D) Azure Advisor — get recommendations for network optimization.",
          ],
          correctIndex: 2,
          explanation:
            "Network Watcher's **IP flow verify** tool tests whether a specific traffic flow (source IP, destination IP, port, protocol, direction) is allowed or denied by the NSG rules applied to a VM's NIC or subnet, and identifies which rule is responsible. This is the most direct tool for diagnosing NSG-related connectivity issues. NSG Flow Logs (B) provide historical data but require analysis. Azure Monitor metrics (A) and Azure Advisor (D) do not provide connectivity troubleshooting.",
        },
      ],
    },

    // ─── Domain 5: Monitor and Maintain Azure Resources (10%) ───────
    {
      id: "domain-5",
      title: "Monitor and Maintain Azure Resources",
      weight: "10%",
      order: 5,
      summary:
        "This domain covers monitoring Azure resources, configuring alerts, analyzing logs, and maintaining resource health. While the smallest domain at 10%, it tests practical skills that administrators use daily to ensure service reliability.\n\nKey services include **Azure Monitor** (metrics, logs, alerts, action groups), **Log Analytics workspaces**, **Azure Monitor Insights** (VM Insights, Container Insights, Application Insights), **Azure Service Health**, **Azure Advisor**, and **Azure Cost Management**. Understanding the data flow from resources to Azure Monitor and how to query logs using **Kusto Query Language (KQL)** is essential.\n\nExpect questions on configuring diagnostic settings to route resource logs to Log Analytics, creating metric alerts with dynamic thresholds, setting up action groups for notifications, and using Azure Advisor for cost and security recommendations.",
      keyConceptsForExam: [
        "**Azure Monitor** — central platform collecting metrics (numeric time-series) and logs (structured data) from all Azure resources",
        "**Diagnostic settings** — configure per-resource to route platform logs and metrics to Log Analytics, Storage, Event Hub, or Partner solutions",
        "**Log Analytics workspace** — central log repository; Kusto Query Language (KQL) used for querying; retention configurable to 730 days",
        "**Azure Monitor alerts** — metric alerts (static or dynamic thresholds), log search alerts (KQL queries), activity log alerts",
        "**Action groups** — define notification channels (email, SMS, push, voice, webhook, ITSM, Logic App, Automation Runbook) triggered by alerts",
        "**Azure Service Health** — service issues, planned maintenance, and health advisories affecting your Azure resources",
        "**Azure Advisor** — personalized recommendations for cost, security, reliability, performance, and operational excellence",
        "**Azure Cost Management** — budgets, cost analysis, cost alerts, and optimization recommendations",
      ],
      examTips: [
        "Diagnostic settings must be configured per resource — they are not inherited. Use Azure Policy with `DeployIfNotExists` to automatically configure diagnostic settings for new resources.",
        "Metric alerts fire when a metric crosses a threshold. Log search alerts run a KQL query on a schedule and alert when results match a condition. Activity log alerts fire on specific Azure control-plane events.",
        "Azure Service Health is different from Azure Monitor Resource Health — Service Health reports on Azure-wide platform issues; Resource Health reports on the health of your specific resource instances.",
        "KQL basics for the exam: `AzureActivity | where OperationName == 'Delete' | summarize count() by Caller` — know how to filter (`where`), project columns (`project`), and aggregate (`summarize`).",
        "Azure Advisor recommendations are free. Acting on cost recommendations (right-sizing VMs, purchasing reserved instances) often provides the largest savings.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-vm-basics", title: "Azure Virtual Machines" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
      ],
      sections: [
        {
          heading: "Azure Monitor Data Flow",
          body: "Azure Monitor collects data from multiple sources and routes it to various destinations:\n\n**Sources**: Azure resources (platform metrics/logs), Azure Activity Log (subscription-level events), guest OS (agents), applications (Application Insights SDK), custom sources (REST API).\n\n**Destinations**: Log Analytics workspace (for KQL queries and long-term retention), Azure Storage (for archiving), Event Hub (for streaming to SIEM or external tools), Azure Monitor metrics store (for real-time charting and alerting).\n\n**Diagnostic settings** control what is sent where for each resource. Not all resource logs are sent by default — you must explicitly configure diagnostic settings. Use Azure Policy (`DeployIfNotExists`) to enforce diagnostic settings across all resources at scale.",
          code: {
            lang: "bash",
            label: "Configure diagnostic settings to send VM logs to Log Analytics",
            snippet: `az monitor diagnostic-settings create \\
  --name vm-diagnostics \\
  --resource /subscriptions/<sub>/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM \\
  --workspace /subscriptions/<sub>/resourceGroups/myRG/providers/Microsoft.OperationalInsights/workspaces/myWorkspace \\
  --metrics '[{"category": "AllMetrics", "enabled": true}]' \\
  --logs '[{"categoryGroup": "allLogs", "enabled": true}]'`,
          },
        },
        {
          heading: "Alerts and Action Groups",
          body: "Azure Monitor alerts notify teams and trigger automated responses when monitored conditions are met:\n\n- **Metric alerts**: Fire when a metric (CPU %, memory, request count) crosses a static or dynamic threshold. Near real-time evaluation.\n- **Log search alerts**: Run a KQL query against Log Analytics on a schedule (every 1–60 minutes). Alert when query results meet a condition (e.g., error count > 10).\n- **Activity log alerts**: Fire on specific Azure control-plane events (e.g., VM deleted, NSG modified, policy assignment created).\n\n**Action groups** define what happens when an alert fires: email/SMS/voice notifications, webhook calls (to ITSM tools), Azure Logic App triggers, Automation Runbook execution, or ITSM integration. Multiple alerts can share the same action group.",
        },
        {
          heading: "Kusto Query Language (KQL) Basics",
          body: "Log Analytics uses KQL to query structured log data. Key operators for the AZ-104 exam:\n\n- `where` — filter rows: `AzureActivity | where OperationName contains 'Delete'`\n- `project` — select columns: `| project TimeGenerated, Caller, OperationName`\n- `summarize` — aggregate: `| summarize count() by Caller, bin(TimeGenerated, 1h)`\n- `order by` — sort results: `| order by TimeGenerated desc`\n- `extend` — add computed columns: `| extend DurationSec = Duration / 1000`\n\nCommon tables: `AzureActivity` (Activity Log), `Heartbeat` (VM agent health), `SecurityEvent` (Windows security events), `Syslog` (Linux syslog), `AzureDiagnostics` (resource-specific logs).",
          code: {
            lang: "bash",
            label: "KQL query — find all delete operations in the last 24 hours",
            snippet: `// Query in Log Analytics workspace
AzureActivity
| where TimeGenerated > ago(24h)
| where OperationNameValue endswith "/delete"
| project TimeGenerated, Caller, ResourceGroup, Resource, OperationNameValue, ActivityStatusValue
| order by TimeGenerated desc`,
          },
        },
      ],
      quiz: [
        {
          id: "az104-d5-q1",
          question:
            "An administrator wants to receive an email alert when a VM's CPU usage exceeds 90% for more than 5 minutes. What components are needed?",
          options: [
            "A) Azure Service Health alert + notification rule.",
            "B) Azure Monitor metric alert with CPU threshold + action group with email notification.",
            "C) Log Analytics scheduled query alert + Azure Automation runbook.",
            "D) Azure Advisor recommendation + Azure Policy auto-remediation.",
          ],
          correctIndex: 1,
          explanation:
            "A metric alert monitors the CPU Percentage metric for the VM and fires when it exceeds 90% for the evaluation window (5 minutes). The action group defines the email notification. Service Health (A) covers Azure platform issues, not VM-level metrics. Log Analytics query (C) can work but is more complex and has higher latency than metric alerts. Azure Advisor (D) provides recommendations, not real-time performance alerts.",
        },
        {
          id: "az104-d5-q2",
          question:
            "A company needs Azure resource logs from all resources in a subscription to be centrally collected for security analysis using KQL. What must be configured on each resource?",
          options: [
            "A) Azure Monitor Metrics — export all metrics to a central dashboard.",
            "B) Diagnostic settings routing resource logs to a Log Analytics workspace.",
            "C) Activity Log alerts for each resource type.",
            "D) Azure Defender for Cloud continuous export.",
          ],
          correctIndex: 1,
          explanation:
            "Diagnostic settings must be configured per resource to route platform logs (resource logs) to a Log Analytics workspace, where they can be queried with KQL. Azure Monitor Metrics (A) are for numeric performance data, not structured logs. Activity Log alerts (C) cover control-plane events, not resource-level logs. Defender for Cloud continuous export (D) exports security findings, not all resource logs.",
        },
        {
          id: "az104-d5-q3",
          question:
            "Azure Service Health is alerting about a planned maintenance event affecting VMs in East US. An administrator wants to be notified automatically for any future planned maintenance events. What should they configure?",
          options: [
            "A) An Azure Monitor metric alert on VM availability.",
            "B) An Activity Log alert for Service Health notifications filtered to Planned Maintenance.",
            "C) A Log Analytics query that checks for maintenance events every hour.",
            "D) An Azure Advisor alert for reliability recommendations.",
          ],
          correctIndex: 1,
          explanation:
            "Activity Log alerts can be configured specifically for Azure Service Health events, filtered by event type (Service Issues, Planned Maintenance, Health Advisories), region, and service. This provides proactive notification about planned maintenance. Metric alerts (A) measure resource performance, not planned maintenance. Log Analytics queries (C) do not surface Service Health events easily. Advisor (D) provides optimization recommendations, not event notifications.",
        },
        {
          id: "az104-d5-q4",
          question:
            "A KQL query returns too many results. An administrator wants to filter the `AzureActivity` table to show only failed operations. Which KQL clause achieves this?",
          options: [
            "A) `AzureActivity | select ActivityStatusValue == 'Failed'`",
            "B) `AzureActivity | where ActivityStatusValue == 'Failed'`",
            "C) `AzureActivity | filter ActivityStatusValue = 'Failed'`",
            "D) `AzureActivity | search ActivityStatusValue:Failed`",
          ],
          correctIndex: 1,
          explanation:
            "KQL uses the `where` operator to filter rows: `AzureActivity | where ActivityStatusValue == 'Failed'`. The `select` keyword (A) is from SQL and is not valid KQL. The `filter` keyword (C) is not a KQL operator. The `search` operator (D) performs free-text search across all columns and is less efficient than `where` for exact field matching.",
        },
        {
          id: "az104-d5-q5",
          question:
            "An administrator wants to ensure that all new Azure VMs automatically have diagnostic settings configured to send logs to a Log Analytics workspace. What is the MOST scalable approach?",
          options: [
            "A) Configure diagnostic settings manually when each VM is deployed.",
            "B) Create an Azure Policy with a DeployIfNotExists effect that configures diagnostic settings on VMs.",
            "C) Create an Azure Automation runbook that runs daily to check and configure diagnostic settings.",
            "D) Use Azure Blueprints to apply diagnostic settings during subscription provisioning.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Policy with `DeployIfNotExists` effect automatically deploys the diagnostic settings resource when a VM is created or updated without the settings configured. This is a scalable, policy-driven approach that requires no manual intervention. Manual configuration (A) is not scalable. An Automation runbook (C) is reactive (daily) rather than real-time. Blueprints (D) apply at provisioning time but do not handle VMs created later.",
        },
        {
          id: "az104-d5-q6",
          question:
            "What is the difference between Azure Monitor Resource Health and Azure Service Health?",
          options: [
            "A) They are the same service with different names.",
            "B) Resource Health reports on the health of your specific resource instances; Service Health reports on Azure-wide platform issues and planned maintenance.",
            "C) Resource Health tracks billing anomalies; Service Health tracks performance metrics.",
            "D) Service Health is only available to enterprise customers; Resource Health is available to all.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Service Health provides information about Azure platform-wide service issues, planned maintenance events, and health advisories that may affect your subscriptions. Azure Monitor Resource Health reports the current health status of your specific resource instances (e.g., 'is this specific VM available?'). They are distinct services serving different monitoring purposes.",
        },
        {
          id: "az104-d5-q7",
          question:
            "An action group is configured with an email notification and an Azure Logic App webhook. When an alert fires, what happens?",
          options: [
            "A) Only email is sent — action groups process one action at a time.",
            "B) Both the email and the Logic App webhook are triggered simultaneously.",
            "C) The Logic App runs first; email is sent only if the Logic App fails.",
            "D) Email and webhook are sent sequentially with a 5-minute delay between them.",
          ],
          correctIndex: 1,
          explanation:
            "Action groups trigger all configured actions simultaneously when an alert fires. Email, SMS, webhooks, Logic Apps, and Automation Runbooks all execute in parallel. There is no sequential ordering or conditional triggering between actions within the same action group.",
        },
        {
          id: "az104-d5-q8",
          question:
            "A company wants to set a monthly budget of $5,000 for a subscription and receive an email alert when spending reaches 80% of the budget. Which Azure service handles this?",
          options: [
            "A) Azure Advisor — cost recommendations.",
            "B) Azure Cost Management — create a budget with cost alert thresholds.",
            "C) Azure Monitor metric alert on subscription spend.",
            "D) Azure Policy — deny resources when budget is exceeded.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Cost Management allows you to create budgets with alert thresholds (e.g., 80% of $5,000 = $4,000). When spending reaches the threshold, email notifications are sent to configured recipients. Azure Advisor (A) provides cost optimization recommendations but does not manage budgets. Azure Monitor (C) does not have a native subscription spend metric for alerting. Azure Policy (D) cannot deny resources based on cost thresholds.",
        },
        {
          id: "az104-d5-q9",
          question:
            "An administrator needs to view a count of all delete operations performed in a subscription over the past 7 days, grouped by the user who performed them. Which query correctly achieves this in Log Analytics?",
          options: [
            "A) `AzureActivity | where OperationName contains 'delete' | count by Caller`",
            "B) `AzureActivity | where TimeGenerated > ago(7d) and OperationNameValue endswith '/delete' | summarize DeleteCount=count() by Caller`",
            "C) `ActivityLog | filter last 7 days | group by Caller where action=delete`",
            "D) `SELECT COUNT(*) FROM AzureActivity WHERE Action='delete' GROUP BY Caller`",
          ],
          correctIndex: 1,
          explanation:
            "The correct KQL query uses `where` to filter by time (`ago(7d)`) and operation (`endswith '/delete'`), then `summarize count()` grouped by `Caller`. Option A uses `count by` which is not valid KQL syntax. Option C uses SQL-like syntax that is not KQL. Option D is SQL, which is not supported in Log Analytics.",
        },
        {
          id: "az104-d5-q10",
          question:
            "Azure Advisor shows a recommendation to right-size several underutilized VMs. What does acting on this recommendation involve?",
          options: [
            "A) Azure Advisor automatically resizes the VMs without any administrator action.",
            "B) The administrator reviews the recommendation, evaluates the suggested smaller VM SKU, and manually resizes the VMs after validation.",
            "C) Azure Policy automatically enforces the right-sizing recommendation on all VMs.",
            "D) The recommendation is informational only and cannot be acted upon through Azure.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Advisor provides recommendations with suggested actions, but the administrator must review and act on them manually. Advisor identifies underutilized VMs based on CPU and memory usage patterns and suggests smaller SKUs. Some recommendations can be acted on directly from the Advisor portal, but the action still requires administrator confirmation. Advisor does not automatically make changes (A). Azure Policy (C) enforces compliance rules, not Advisor recommendations.",
        },
        {
          id: "az104-d5-q11",
          question:
            "Which Log Analytics table contains heartbeat signals from Azure Monitor Agent installed on VMs, used to verify VM connectivity to the workspace?",
          options: [
            "A) `AzureActivity` — Azure control-plane events.",
            "B) `Heartbeat` — agent heartbeat signals every minute.",
            "C) `SecurityEvent` — Windows security audit events.",
            "D) `AzureDiagnostics` — resource-specific diagnostic logs.",
          ],
          correctIndex: 1,
          explanation:
            "The `Heartbeat` table receives a record every minute from Azure Monitor Agent (or Log Analytics agent), confirming the VM is online and connected to the workspace. A `Heartbeat | summarize LastHeartbeat=max(TimeGenerated) by Computer` query quickly identifies offline VMs. `AzureActivity` (A) is for Azure ARM operations. `SecurityEvent` (C) is for Windows security logs. `AzureDiagnostics` (D) is for resource platform logs.",
        },
        {
          id: "az104-d5-q12",
          question:
            "An administrator receives an Azure Monitor alert that a Log Analytics query is returning errors. The query searches for logs older than 3 years. What is the MOST likely cause?",
          options: [
            "A) KQL does not support queries on logs older than 90 days.",
            "B) The Log Analytics workspace retention period is set to less than 3 years (730 days max interactive, additional archival possible).",
            "C) Log Analytics does not store logs beyond 30 days.",
            "D) Logs older than 1 year are automatically moved to Azure Blob Storage.",
          ],
          correctIndex: 1,
          explanation:
            "Log Analytics workspace retention is configurable up to 730 days (2 years) for interactive queries. For longer retention, Azure Monitor Logs archive tier extends retention up to 12 years, but archived logs require restore operations before querying. If the workspace is set to less than 3 years and no archive is configured, logs older than the retention period are deleted. KQL has no inherent time limit (A is wrong). 30-day and 90-day limits (C) are not defaults.",
        },
        {
          id: "az104-d5-q13",
          question:
            "A company wants to monitor the availability of a web application endpoint from multiple global locations and alert when the response time exceeds 2 seconds. Which Azure Monitor feature should they use?",
          options: [
            "A) Azure Service Health — monitor Azure platform availability.",
            "B) Application Insights availability tests — synthetic monitoring from global probe locations.",
            "C) Azure Monitor metric alert on HTTP response time from VMs.",
            "D) Network Watcher connection monitor — test connectivity between Azure resources.",
          ],
          correctIndex: 1,
          explanation:
            "Application Insights availability tests (URL ping tests or multi-step web tests) run synthetic requests from Azure-hosted probe locations worldwide and alert when availability drops or response time exceeds a threshold. Service Health (A) monitors Azure platform health, not application endpoints. VM metric alerts (C) monitor the server side, not external endpoint availability. Network Watcher connection monitor (D) tests connectivity between Azure resources, not external endpoints.",
        },
        {
          id: "az104-d5-q14",
          question:
            "What is the default retention period for the Azure Activity Log?",
          options: [
            "A) 30 days.",
            "B) 90 days.",
            "C) 180 days.",
            "D) 365 days.",
          ],
          correctIndex: 1,
          explanation:
            "The Azure Activity Log retains events for 90 days by default. To retain Activity Log data longer, configure a diagnostic setting to export it to a Log Analytics workspace (up to 730 days interactive, or archival), Azure Storage (indefinite), or Event Hub (for streaming). 30 days (A), 180 days (C), and 365 days (D) are not the default.",
        },
        {
          id: "az104-d5-q15",
          question:
            "An administrator wants to automatically restart a VM when it becomes unresponsive, triggered by an Azure Monitor alert. Which action group action type enables this?",
          options: [
            "A) Email/SMS notification — alerts the on-call team to restart manually.",
            "B) Azure Automation Runbook — executes a runbook that restarts the VM programmatically.",
            "C) ITSM connection — creates a ticket in the IT service management system.",
            "D) Logic App — triggers a Logic App workflow to send a Teams message.",
          ],
          correctIndex: 1,
          explanation:
            "An Azure Automation Runbook action in an action group can execute PowerShell or Python scripts that interact with Azure APIs, including `az vm restart`. This enables fully automated remediation. Email/SMS (A) requires human intervention. ITSM (C) creates a ticket for manual follow-up. Logic App (D) is useful for notifications and workflow automation but is more complex for a simple VM restart than a targeted Runbook.",
        },
      ],
    },
  ],
};
