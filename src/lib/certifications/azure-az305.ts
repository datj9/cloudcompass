import type { Certification } from "./types";

export const azureAz305: Certification = {
  id: "azure-az305",
  title: "Azure Solutions Architect Expert",
  code: "AZ-305",
  cloud: "azure",
  level: "Expert",
  description:
    "Validate your expert-level ability to design cloud and hybrid solutions on Azure. Covers identity and governance, data storage, business continuity, and infrastructure architecture at scale.",
  examFormat: {
    questions: 50,
    duration: "100 minutes",
    passingScore: "700/1000",
    cost: "$165 USD",
  },
  domains: [
    // ─── Domain 1: Design Identity, Governance, and Monitoring (25%) ─
    {
      id: "domain-1",
      title: "Design Identity, Governance, and Monitoring Solutions",
      weight: "25%",
      order: 1,
      summary:
        "This domain covers designing enterprise-scale identity architectures, governance frameworks, and monitoring strategies. An expert architect must translate business requirements into scalable, secure identity and governance designs that span multiple subscriptions and management groups.\n\nKey areas include designing **Microsoft Entra ID** topologies for hybrid and multi-cloud environments, architecting **Azure AD B2C** for external customer identities, designing multi-subscription governance with **Azure Policy**, **management groups**, and **Azure Blueprints**. Monitoring design covers selecting the right combination of **Azure Monitor**, **Log Analytics**, **Application Insights**, and **Microsoft Sentinel** for security operations.\n\nExpect scenario-based questions where you must choose between design alternatives, justify governance hierarchy decisions, and select appropriate monitoring tools based on operational requirements and cost constraints.",
      keyConceptsForExam: [
        "**Management group hierarchy** — 6 levels deep maximum; root management group; design for policy inheritance and delegation",
        "**Landing zone architecture** — enterprise-scale Azure landing zones; platform subscriptions (connectivity, identity, management) vs. application landing zones",
        "**Hybrid identity** — Entra Connect for AD sync; PTA vs. password hash sync vs. federation; Entra Connect Cloud Sync for simpler scenarios",
        "**Conditional Access design** — named locations, compliance policies, sign-in risk policies; continuous access evaluation (CAE)",
        "**Microsoft Sentinel** — cloud-native SIEM/SOAR; data connectors; analytics rules; playbooks (Logic Apps) for automated response",
        "**Azure Monitor Workbooks** — interactive dashboards for operational insights; shared across teams",
        "**Cost management design** — subscription design for cost allocation; management groups for chargeback; Azure Cost Management budgets and alerts",
        "**Identity governance** — access reviews, entitlement management, lifecycle workflows in Entra ID Governance (P2)",
      ],
      examTips: [
        "Landing zone design questions ask you to recommend subscription organization. Application teams get individual subscriptions; platform services (hub networking, identity, management) get dedicated platform subscriptions.",
        "Microsoft Sentinel is the right answer for questions about SIEM, security incident response, and threat hunting at enterprise scale — not Azure Monitor alone.",
        "For hybrid identity, recommend Entra Connect Cloud Sync when the on-premises AD is simple (no custom attributes, writeback not needed). Recommend the full Entra Connect sync agent for complex AD forests with password writeback.",
        "Conditional Access 'require compliant device' requires Intune enrollment or hybrid Entra join — factor in device management when designing Conditional Access.",
        "When designing monitoring at enterprise scale, centralize logs in a single Log Analytics workspace per environment (prod/non-prod), with workspace-level access control for team isolation.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
        { cloud: "azure", topicId: "azure-vm-basics", title: "Azure Virtual Machines" },
      ],
      sections: [
        {
          heading: "Enterprise Landing Zone Design",
          body: "An Azure landing zone is a well-architected environment that enables application migration, modernization, and innovation at enterprise scale. The **management group hierarchy** is the backbone:\n\n- **Root Management Group**: Apply foundational policies (deny public IPs on core services, require encryption, restrict regions).\n- **Platform Management Group**: Contains subscriptions for shared services — Connectivity (hub VNet, ExpressRoute, VPN), Identity (domain controllers, Entra Connect), and Management (Log Analytics, Azure Monitor, Policy).\n- **Landing Zones Management Group**: Contains application team subscriptions, further subdivided by environment (Corp for internal apps, Online for internet-facing) or business unit.\n- **Sandbox Management Group**: For experimentation — fewer restrictions, isolated from production connectivity.\n- **Decommissioned**: Subscriptions being retired.\n\nPolicies applied at higher management groups cascade down. Use **Azure Policy initiatives** aligned with frameworks (CIS, NIST, Azure Security Benchmark) at the platform level, with team-specific overrides at the application management group level.",
          code: {
            lang: "bash",
            label: "Create management group hierarchy",
            snippet: `# Create platform management group under root
az account management-group create \\
  --name "Platform" \\
  --display-name "Platform" \\
  --parent-id "Root"

# Create connectivity subscription under platform
az account management-group subscription add \\
  --name "Platform" \\
  --subscription "connectivity-subscription-id"

# Assign policy at platform level (inherits to all subscriptions)
az policy assignment create \\
  --name "require-tags" \\
  --policy "require-tag-values" \\
  --scope "/providers/Microsoft.Management/managementGroups/Platform"`,
          },
        },
        {
          heading: "Hybrid Identity Architecture",
          body: "Designing hybrid identity requires selecting the right synchronization mechanism based on the organization's requirements:\n\n**Entra Connect (full sync agent)**:\n- Supports complex multi-forest AD topologies\n- Password writeback, device writeback, group writeback\n- Custom attribute synchronization\n- Suitable for organizations requiring full hybrid functionality\n\n**Entra Connect Cloud Sync** (newer, simpler):\n- Lightweight agent installed on multiple AD servers for high availability\n- Supports multi-forest but limited attribute customization\n- Does not support all writeback scenarios\n- Preferred for new deployments where full sync is not required\n\n**Authentication methods comparison**:\n- **Password Hash Sync (PHS)**: Hash synchronized to Entra ID — authentication in cloud. Works even if on-premises is down. Enables leaked credential detection via Identity Protection.\n- **Pass-Through Authentication (PTA)**: Passwords validated on-premises in real time. On-premises AD must be available. No password hash in cloud.\n- **Federation (AD FS)**: Entra ID redirects auth to on-premises AD FS. Maximum control but highest operational overhead.",
        },
        {
          heading: "Microsoft Sentinel Architecture",
          body: "Microsoft Sentinel is Azure's cloud-native SIEM (Security Information and Event Management) and SOAR (Security Orchestration, Automation, and Response) platform.\n\n**Architecture components**:\n- **Log Analytics Workspace**: Sentinel is built on top of a Log Analytics workspace. All ingested data is queryable with KQL.\n- **Data connectors**: Built-in connectors for Microsoft services (Entra ID, Microsoft 365 Defender, Defender for Cloud), common third-party SIEMs, and custom CEF/Syslog sources.\n- **Analytics rules**: KQL-based scheduled queries that generate security incidents when conditions are met. Includes Microsoft Threat Intelligence rules.\n- **Incidents**: Aggregated alerts with investigation timeline and entity mapping.\n- **Playbooks**: Logic Apps triggered by incidents for automated response (isolate VM, block IP, notify SOC team via Teams).\n- **Workbooks**: Interactive dashboards for security operations center (SOC) teams.\n\n**Workspace design**: Use a dedicated Log Analytics workspace for Sentinel (separate from operational monitoring) to control access, costs, and data retention independently.",
        },
      ],
      quiz: [
        {
          id: "az305-d1-q1",
          question:
            "An enterprise is designing their Azure management group hierarchy. The CISO requires that no subscription in the organization can deploy resources to unapproved Azure regions. Where should this Azure Policy be assigned for maximum coverage with minimum management effort?",
          options: [
            "A) Assign to each subscription individually as subscriptions are created.",
            "B) Assign to the Root Management Group so it applies to all management groups and subscriptions in the tenant.",
            "C) Assign to each resource group within production subscriptions.",
            "D) Use a Conditional Access policy to block resource creation in unapproved regions.",
          ],
          correctIndex: 1,
          explanation:
            "Assigning the allowed-locations policy to the Root Management Group ensures it applies to every subscription and resource group in the entire tenant, including new ones added in the future. Individual subscription assignment (A) requires manual assignment per subscription and misses new subscriptions. Resource group assignment (C) is too granular and also misses new resource groups. Conditional Access (D) governs authentication, not resource deployment.",
        },
        {
          id: "az305-d1-q2",
          question:
            "A company is migrating from on-premises Active Directory to Azure. They require that user passwords are validated by the on-premises AD domain controllers in real time, and no password hashes should be stored in Entra ID. Which hybrid identity method should the architect recommend?",
          options: [
            "A) Password Hash Synchronization (PHS) — synchronizes password hashes to Entra ID.",
            "B) Pass-Through Authentication (PTA) — validates passwords against on-premises AD in real time.",
            "C) AD FS Federation — redirects all authentication to on-premises AD FS servers.",
            "D) Entra ID Connect Cloud Sync — replaces on-premises AD with cloud identity.",
          ],
          correctIndex: 1,
          explanation:
            "Pass-Through Authentication validates passwords directly against on-premises domain controllers in real time without storing any password hash in Entra ID. This meets both requirements. PHS (A) explicitly stores password hashes in Entra ID. AD FS (C) provides the same control but with significantly higher infrastructure overhead. Entra Connect Cloud Sync (D) is a synchronization tool, not an authentication method — it can be paired with PHS or PTA.",
        },
        {
          id: "az305-d1-q3",
          question:
            "An enterprise needs a solution for security event monitoring, threat detection, and automated incident response across 50 Azure subscriptions and on-premises servers. What should the architect design?",
          options: [
            "A) Azure Monitor with Log Analytics workspaces in each subscription.",
            "B) Microsoft Sentinel with a centralized Log Analytics workspace, data connectors for all sources, analytics rules, and Logic App playbooks.",
            "C) Microsoft Defender for Cloud with custom email alerts to the security team.",
            "D) Azure Monitor workbooks with KQL dashboards for the SOC team.",
          ],
          correctIndex: 1,
          explanation:
            "Microsoft Sentinel is a cloud-native SIEM/SOAR designed for exactly this scenario — centralized security monitoring across many subscriptions and hybrid environments, with built-in analytics rules for threat detection and playbooks (Logic Apps) for automated incident response. Azure Monitor (A) is an operational monitoring platform, not a SIEM. Defender for Cloud (C) provides security posture management and threat detection but is not a full SIEM/SOAR. Workbooks (D) are dashboards, not detection/response systems.",
        },
        {
          id: "az305-d1-q4",
          question:
            "A company has users in three separate Active Directory forests that need to authenticate to Azure resources. Which Entra Connect topology supports synchronizing users from multiple forests to a single Entra ID tenant?",
          options: [
            "A) One Entra Connect sync agent per forest, each connected to a separate Entra ID tenant.",
            "B) Multiple Entra Connect sync agents, all connected to the same Entra ID tenant — multi-forest single tenant topology.",
            "C) Entra Connect Cloud Sync deployed in each forest — supported for multi-forest to single tenant.",
            "D) Entra B2B collaboration — invite users from each forest's tenant as guest users.",
          ],
          correctIndex: 1,
          explanation:
            "Entra Connect supports multiple-forest topologies where multiple sync agents (one per forest or one for multiple forests) synchronize all user objects to a single Entra ID tenant. This is the standard enterprise multi-forest hybrid identity pattern. Separate tenants per forest (A) would require B2B collaboration for cross-tenant access. Entra Connect Cloud Sync (C) does support multi-forest but with more limited customization than the full sync agent. B2B (D) is for external organization collaboration, not internal multi-forest consolidation.",
        },
        {
          id: "az305-d1-q5",
          question:
            "An architect is designing access governance for a company where 500 contractors join and leave quarterly. Each contractor needs access to specific Azure resources during their engagement. Which Entra ID Governance feature automates contractor access lifecycle?",
          options: [
            "A) Conditional Access policies — enforce MFA for all contractor accounts.",
            "B) Entitlement Management — create access packages with policies for contractor request, approval, and time-limited assignment.",
            "C) Privileged Identity Management (PIM) — configure eligible role assignments for contractors.",
            "D) Azure RBAC groups — assign contractors to a resource group Contributor role.",
          ],
          correctIndex: 1,
          explanation:
            "Entitlement Management (part of Entra ID Governance) allows creating **access packages** that bundle the resources (apps, groups, SharePoint sites, Azure roles) a contractor needs. Policies define who can request access, who approves it, and how long it lasts — with automatic expiration and removal. This automates the entire contractor access lifecycle. Conditional Access (A) governs how users authenticate, not what resources they can access. PIM (C) is for privileged role management. Static RBAC groups (D) require manual lifecycle management.",
        },
        {
          id: "az305-d1-q6",
          question:
            "A company wants to centralize Azure resource logs from 20 subscriptions into a single Log Analytics workspace for the security operations team. Which approach should the architect recommend?",
          options: [
            "A) Create 20 separate Log Analytics workspaces and query each individually.",
            "B) Use Azure Monitor cross-workspace queries to query all 20 workspaces simultaneously.",
            "C) Configure diagnostic settings in each subscription to send logs to a centralized Log Analytics workspace, using Azure Policy to enforce compliance.",
            "D) Use Azure Event Hub to stream logs from all subscriptions to a SIEM.",
          ],
          correctIndex: 2,
          explanation:
            "A centralized Log Analytics workspace with diagnostic settings configured in each subscription via Azure Policy (`DeployIfNotExists`) is the recommended pattern for enterprise-scale log centralization. It provides a single query surface, unified access control, and consistent retention policies. 20 separate workspaces (A) fragment the data. Cross-workspace queries (B) work for cross-workspace scenarios but are more complex than a single centralized workspace. Event Hub (D) streaming to a SIEM is valid for third-party SIEM but not for Azure-native Log Analytics.",
        },
        {
          id: "az305-d1-q7",
          question:
            "An organization requires that all Azure Virtual Machines must report their compliance status and have missing OS security patches automatically remediated. Which combination of Azure services achieves this?",
          options: [
            "A) Azure Monitor alerts for VM CPU metrics + Azure Automation runbooks.",
            "B) Microsoft Defender for Servers + Azure Update Manager with automatic assessment and patching schedules.",
            "C) Azure Policy audit rules + manual monthly patching windows.",
            "D) Azure Site Recovery with regular replication tests to verify VM health.",
          ],
          correctIndex: 1,
          explanation:
            "Microsoft Defender for Servers provides security vulnerability assessment (including missing patches) and Microsoft Defender for Cloud shows compliance status. Azure Update Manager provides automatic patch assessment and scheduled maintenance windows for automated patching. Together they fulfill both requirements. Azure Monitor CPU alerts (A) are unrelated to patch compliance. Manual patching (C) is not automated. Site Recovery (D) is for DR, not patch management.",
        },
        {
          id: "az305-d1-q8",
          question:
            "A financial services company must demonstrate that all administrative actions performed in Azure are logged, tamper-proof, and retained for 7 years. What combination of services achieves this?",
          options: [
            "A) Azure Activity Log with 90-day default retention.",
            "B) Azure Activity Log exported via diagnostic settings to a Log Analytics workspace with a 7-year archive policy, and to Azure Storage with immutability (WORM) enabled.",
            "C) Microsoft Sentinel with a 7-year retention policy on the underlying Log Analytics workspace.",
            "D) Azure Monitor Metrics retained in a storage account for 7 years.",
          ],
          correctIndex: 1,
          explanation:
            "The Activity Log captures all control-plane operations. Exporting it to Log Analytics (with archive tier extending up to 12 years) and to an immutable Azure Storage account (WORM — write-once, read-many compliance mode) provides both long-term queryable retention and tamper-proof archival. The default 90-day retention (A) is insufficient. Sentinel (C) can retain logs but does not provide the tamper-proof WORM storage guarantee. Metrics (D) capture numeric data, not audit event logs.",
        },
        {
          id: "az305-d1-q9",
          question:
            "Which Azure landing zone subscription should host the hub virtual network, ExpressRoute gateway, and Azure Firewall for an enterprise hub-and-spoke topology?",
          options: [
            "A) The Management subscription — it hosts all shared platform services.",
            "B) The Connectivity subscription — dedicated to hub networking and WAN connectivity.",
            "C) Each application team's subscription — to avoid a single point of failure.",
            "D) The Identity subscription — networking and identity are co-located for security.",
          ],
          correctIndex: 1,
          explanation:
            "The Azure landing zone framework designates a dedicated **Connectivity** subscription for hub networking infrastructure: the hub VNet, ExpressRoute/VPN gateways, Azure Firewall, and DNS servers. This isolation provides clear ownership, cost attribution, and access control for platform networking. The Management subscription (A) hosts monitoring and management tools (Log Analytics, Azure Monitor). Identity (D) hosts domain controllers and Entra Connect. Co-locating networking in app subscriptions (C) creates governance complexity.",
        },
        {
          id: "az305-d1-q10",
          question:
            "A company needs to review whether external guest users in their Entra ID tenant still require access to Azure resources every 90 days. Which Entra ID feature automates this process?",
          options: [
            "A) Microsoft Entra PIM — configure time-bound role assignments for guest users.",
            "B) Entra ID Access Reviews — schedule recurring reviews where resource owners confirm or revoke guest access.",
            "C) Conditional Access — deny guest access after 90 days automatically.",
            "D) Azure RBAC custom role — include an expiry condition in the role definition.",
          ],
          correctIndex: 1,
          explanation:
            "Entra ID Access Reviews (part of Entra ID Governance) allow scheduling recurring reviews of group memberships or role assignments. Reviewers (resource owners or the guests themselves) confirm or revoke access within the review period. When a review expires, unused access can be automatically removed. PIM (A) manages privileged role activation timelines, not periodic access reviews. Conditional Access (C) enforces authentication conditions, not access expiry based on time. RBAC role definitions (D) cannot include time-based expiry conditions.",
        },
        {
          id: "az305-d1-q11",
          question:
            "What is the maximum depth of a management group hierarchy in Azure (including the Root Management Group and subscriptions)?",
          options: [
            "A) 3 levels.",
            "B) 6 levels.",
            "C) 10 levels.",
            "D) Unlimited.",
          ],
          correctIndex: 1,
          explanation:
            "Azure supports up to 6 levels of management group depth below the Root Management Group, plus the subscriptions at the bottom — making the full hierarchy 7 tiers deep (Root + 6 management group levels + subscriptions). For most enterprises, 3–4 levels of management groups are sufficient. Exceeding 6 management group levels is not possible.",
        },
        {
          id: "az305-d1-q12",
          question:
            "An architect needs to recommend a monitoring solution for an Azure Kubernetes Service (AKS) cluster that provides container-level CPU and memory metrics, pod failure alerts, and log analysis from container stdout/stderr. Which Azure Monitor feature is MOST appropriate?",
          options: [
            "A) Azure Monitor VM Insights — designed for virtual machine monitoring.",
            "B) Container Insights — AKS-specific monitoring with container metrics, pod health, and log collection.",
            "C) Application Insights — application performance monitoring for code-level telemetry.",
            "D) Azure Monitor Network Insights — network-level monitoring for AKS egress.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Monitor Container Insights provides AKS-specific monitoring: node and pod CPU/memory metrics, pod health status, container log collection (stdout/stderr to Log Analytics), and pre-built Kubernetes workbooks. VM Insights (A) is for virtual machines, not containers. Application Insights (C) monitors application code performance, not infrastructure. Network Insights (D) covers network-level monitoring.",
        },
        {
          id: "az305-d1-q13",
          question:
            "A Conditional Access policy is configured to require MFA for all users. A new policy is added requiring compliant devices. A user authenticates from a compliant device without MFA. Is access granted?",
          options: [
            "A) Yes — the compliant device policy is satisfied, overriding the MFA requirement.",
            "B) No — both policies apply; the user must satisfy both MFA and device compliance requirements.",
            "C) Yes — Conditional Access applies the least restrictive matching policy.",
            "D) No — Conditional Access denies access when multiple policies conflict.",
          ],
          correctIndex: 1,
          explanation:
            "Conditional Access applies all matching policies — they are additive, not alternative. If two policies match a user sign-in, the user must satisfy all requirements from all matching policies. Requiring MFA AND a compliant device means both must be met simultaneously. Conditional Access does not apply the least restrictive policy (C) or deny when policies exist (D) — it requires all applicable policy conditions to be met.",
        },
        {
          id: "az305-d1-q14",
          question:
            "An enterprise architect is designing the Azure subscription model. Development teams need isolated environments with some autonomy to provision resources, but all subscriptions must comply with centralized security policies. What model best supports this?",
          options: [
            "A) One large subscription shared by all teams, with RBAC roles for isolation.",
            "B) Individual subscriptions per team or application, organized under management groups with centralized policies and delegated RBAC for team autonomy.",
            "C) Separate Entra ID tenants per team to provide maximum isolation.",
            "D) Resource groups within a single subscription, one per team.",
          ],
          correctIndex: 1,
          explanation:
            "Individual subscriptions per team, organized under management groups with centralized policies (from management groups) and delegated RBAC (for team autonomy within their subscription), is the recommended enterprise model. This provides subscription-level isolation, billing clarity, and policy inheritance. A single shared subscription (A) creates governance complexity. Separate tenants (C) make cross-team collaboration and centralized management very difficult. Resource groups (D) provide isolation but within the same subscription — they share limits and billing.",
        },
        {
          id: "az305-d1-q15",
          question:
            "A Microsoft Sentinel incident is created when a suspicious login is detected. The security team wants to automatically isolate the affected VM and notify the SOC via Microsoft Teams. Which Sentinel feature implements this automated response?",
          options: [
            "A) Analytics rules — define detection logic and severity.",
            "B) Automation rules and Playbooks (Logic Apps) — trigger automated response workflows on incident creation.",
            "C) Workbooks — interactive dashboards for the SOC team.",
            "D) Data connectors — ingest logs from the affected systems.",
          ],
          correctIndex: 1,
          explanation:
            "Microsoft Sentinel Automation rules trigger when incidents are created, updated, or closed. They can run **Playbooks** (Logic Apps) that perform automated actions: isolating VMs (via Azure Automation or REST API), posting to Teams, creating ServiceNow tickets, or blocking IPs. Analytics rules (A) detect threats and create alerts/incidents. Workbooks (C) provide visualization. Data connectors (D) ingest data — none of these perform automated response.",
        },
      ],
    },

    // ─── Domain 2: Design Data Storage Solutions (25%) ───────────────
    {
      id: "domain-2",
      title: "Design Data Storage Solutions",
      weight: "25%",
      order: 2,
      summary:
        "This domain tests your ability to design data storage architectures for relational databases, NoSQL databases, data analytics platforms, and unstructured storage. An expert architect must select the right storage service based on workload characteristics, consistency requirements, scalability needs, and cost.\n\nKey areas include designing solutions with **Azure SQL Database**, **Azure SQL Managed Instance**, **Azure Cosmos DB** (with global distribution), **Azure Database for PostgreSQL/MySQL**, **Azure Synapse Analytics**, **Azure Data Lake Storage Gen2**, **Azure Databricks**, and **Azure Blob Storage** for various access patterns.\n\nExpect scenario-based questions that test your ability to justify storage choices based on latency requirements, query patterns, consistency models, replication needs, and migration strategies. The exam often presents a legacy on-premises system that must be migrated with specific requirements.",
      keyConceptsForExam: [
        "**Azure SQL Database vs. SQL Managed Instance** — SQL DB: PaaS, hyperscale, serverless; SQL MI: near-full SQL Server compatibility, VNet-native, for lift-and-shift",
        "**Cosmos DB global distribution** — multi-region write (multi-master), consistency levels, SLA for availability and latency",
        "**Azure Synapse Analytics** — unified analytics platform; dedicated SQL pool for DW; serverless SQL pool; Spark pools; Synapse Link for real-time analytics",
        "**ADLS Gen2** — hierarchical namespace; POSIX-style ACLs; optimized for big data analytics; integrates with Spark, Databricks, Synapse",
        "**Hot/Warm/Cold data tiering** — active data in SQL/Cosmos DB; historical data in ADLS Gen2 + Synapse; archived data in Blob Archive tier",
        "**Database migration strategies** — Azure Database Migration Service (DMS); Migrate (schema + data); Replicate (ongoing sync); Cutover",
        "**Read replicas and geo-replication** — Azure SQL Active Geo-Replication; Cosmos DB multi-region read replicas; PostgreSQL Flexible Server read replicas",
        "**Data encryption** — Transparent Data Encryption (TDE), Always Encrypted (column-level), Azure Defender for SQL (threat detection)",
      ],
      examTips: [
        "SQL Managed Instance is the answer for 'lift-and-shift SQL Server migration' questions — it supports SQL Agent, CLR, cross-database queries, linked servers, and native VNet deployment that SQL Database does not.",
        "Cosmos DB multi-master (multi-region writes) allows writes to any region with automatic conflict resolution — the tradeoff is that Strong consistency is not available with multi-master across regions.",
        "Azure Synapse Link provides near-real-time analytical queries on Cosmos DB operational data without ETL pipelines — zero impact on transactional workloads.",
        "ADLS Gen2 requires a storage account with hierarchical namespace enabled — this cannot be enabled after account creation, so it must be a design decision upfront.",
        "For large-scale data migrations, Azure Database Migration Service (DMS) handles schema conversion, data migration, and cutover with minimal downtime via change data capture (CDC).",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
        { cloud: "azure", topicId: "azure-vm-basics", title: "Azure Virtual Machines" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
      ],
      sections: [
        {
          heading: "Choosing the Right Azure Database Service",
          body: "Selecting the right database service requires matching the workload requirements to the service capabilities:\n\n| Requirement | Recommended Service |\n|---|---|\n| Lift-and-shift SQL Server (SQL Agent, CLR, linked servers) | **Azure SQL Managed Instance** |\n| New cloud-native relational app, hyperscale, serverless | **Azure SQL Database** |\n| Global distribution, NoSQL, variable schema | **Azure Cosmos DB** |\n| Open-source PostgreSQL, managed PaaS | **Azure Database for PostgreSQL Flexible Server** |\n| Open-source MySQL, managed PaaS | **Azure Database for MySQL Flexible Server** |\n| Enterprise data warehouse, BI/reporting at scale | **Azure Synapse Analytics (dedicated SQL pool)** |\n| Ad-hoc analytics on files in ADLS Gen2 | **Azure Synapse serverless SQL pool** |\n| Big data processing, ML feature engineering | **Azure Databricks or Synapse Spark** |\n\nA common pattern is OLTP data in SQL Database or Cosmos DB, historical/analytical data in Synapse Analytics via regular export or Synapse Link.",
          code: {
            lang: "bash",
            label: "Create Azure SQL Managed Instance",
            snippet: `# SQL MI requires a dedicated subnet
az sql mi create \\
  --name myManagedInstance \\
  --resource-group myResourceGroup \\
  --location eastus \\
  --admin-user sqladmin \\
  --admin-password 'P@ssw0rd123!' \\
  --subnet "/subscriptions/<sub>/resourceGroups/myRG/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/mi-subnet" \\
  --sku-name GP_Gen5 \\
  --vcores 8 \\
  --storage-size 256`,
          },
        },
        {
          heading: "Cosmos DB Global Distribution Design",
          body: "Azure Cosmos DB provides turnkey global distribution — replicate data to any Azure region with a single API call. Key design decisions:\n\n**Single-region write (default)**: Writes go to the primary region and are asynchronously replicated to read regions. Consistency levels from Strong to Eventual control the read-write tradeoff.\n\n**Multi-region writes (multi-master)**: Any replica can accept writes. Conflict resolution uses last-write-wins (by timestamp) or custom conflict resolution procedures. Note: Strong consistency is NOT available with multi-region writes.\n\n**Consistency level selection for global distribution**:\n- **Session** (default): Read-your-own-writes within a session. Best for most applications.\n- **Bounded Staleness**: Data lags by at most K versions or T seconds. Good for global leader-board or live scoring.\n- **Eventual**: Highest throughput and availability. Acceptable for non-critical social/media feeds.\n- **Strong**: Linearizable. Only available with single write region.\n\nFor RPO=0, use multi-region writes. For lowest cost, use session consistency with a single write region and geo-redundant read replicas.",
        },
        {
          heading: "Analytics Architecture — Synapse and Data Lake",
          body: "A modern analytics architecture separates operational (OLTP) and analytical (OLAP) workloads:\n\n**Data ingestion tier**: Raw data lands in **Azure Data Lake Storage Gen2** (ADLS Gen2) in the bronze/raw layer. Sources include Azure Data Factory pipelines, Event Hub Capture, IoT Hub routing, and Synapse pipelines.\n\n**Processing tier**: **Azure Databricks** or **Azure Synapse Spark** pools process and transform data (bronze → silver → gold layers). Delta Lake format provides ACID transactions on ADLS Gen2.\n\n**Serving tier**: Curated data in **Azure Synapse Analytics dedicated SQL pools** for BI and reporting. **Power BI** connects to Synapse for visualization.\n\n**Real-time analytics**: **Azure Synapse Link for Cosmos DB** enables near-real-time analytical queries on operational Cosmos DB data using Synapse Spark or serverless SQL — no ETL required, zero impact on transactional performance.\n\nADLS Gen2 requires **hierarchical namespace** enabled at account creation — this enables directory-level operations and POSIX ACLs required for big data frameworks (Spark, Hive, Hadoop).",
        },
      ],
      quiz: [
        {
          id: "az305-d2-q1",
          question:
            "A company is migrating a legacy SQL Server application to Azure. The application uses SQL Server Agent jobs, CLR stored procedures, cross-database queries, and linked servers. Which Azure service should the architect recommend?",
          options: [
            "A) Azure SQL Database — PaaS, serverless, and hyperscale options.",
            "B) Azure SQL Managed Instance — near-full SQL Server compatibility including SQL Agent and CLR.",
            "C) SQL Server on Azure VM — full control over SQL Server installation.",
            "D) Azure Database for PostgreSQL — open-source alternative to SQL Server.",
          ],
          correctIndex: 1,
          explanation:
            "Azure SQL Managed Instance provides near-complete SQL Server engine compatibility, including SQL Server Agent, CLR, cross-database queries, and linked servers. SQL Database (A) does not support these features. SQL Server on VM (C) also works but requires full infrastructure management — SQL MI provides the compatibility with PaaS benefits. PostgreSQL (D) would require application code changes.",
        },
        {
          id: "az305-d2-q2",
          question:
            "A global e-commerce application uses Azure Cosmos DB. The product catalog must be available for read in all regions with lowest possible latency. Orders must reflect the latest data immediately after being placed. Which design balances these requirements?",
          options: [
            "A) Single-region write with Strong consistency — ensures all reads reflect latest data everywhere.",
            "B) Multi-region writes for the order container (Session consistency) and read replicas for the product catalog container (Session consistency).",
            "C) Separate containers: multi-region write for orders with Session consistency; product catalog with Bounded Staleness and read replicas in all regions.",
            "D) Event sourcing — store orders in Service Bus and sync to Cosmos DB asynchronously.",
          ],
          correctIndex: 2,
          explanation:
            "Separate containers with different configurations is idiomatic Cosmos DB design. Orders need immediate consistency — Session consistency with multi-region write (or single write + read-your-own-writes via session token) ensures the user sees their order immediately. Product catalog changes are infrequent — Bounded Staleness with read replicas in all regions provides low-latency catalog reads with acceptable consistency lag. Strong consistency across all regions (A) penalizes write latency. Service Bus (D) adds unnecessary complexity.",
        },
        {
          id: "az305-d2-q3",
          question:
            "An architect needs to design a data analytics solution where data scientists can run ad-hoc SQL queries against files stored in Azure Data Lake Storage Gen2 without provisioning dedicated compute. Which service enables this?",
          options: [
            "A) Azure Synapse Analytics dedicated SQL pool — provision compute for all queries.",
            "B) Azure Synapse Analytics serverless SQL pool — query ADLS Gen2 files on-demand with T-SQL.",
            "C) Azure Databricks — requires a cluster for all SQL queries.",
            "D) Azure SQL Database with PolyBase — federated queries to ADLS Gen2.",
          ],
          correctIndex: 1,
          explanation:
            "Synapse serverless SQL pool executes T-SQL queries directly against files in ADLS Gen2 (Parquet, CSV, JSON, Delta) using `OPENROWSET` or external tables — with no dedicated compute to provision or manage. You pay per TB of data scanned. Dedicated SQL pool (A) requires pre-provisioned DWUs. Databricks (C) also requires a cluster. SQL Database PolyBase (D) requires dedicated SQL Database compute.",
        },
        {
          id: "az305-d2-q4",
          question:
            "A company must encrypt specific columns (credit card numbers, SSNs) in Azure SQL Database so that the database engine itself cannot read the plaintext values — only the application can decrypt them. Which feature should be used?",
          options: [
            "A) Transparent Data Encryption (TDE) — encrypts the entire database at rest.",
            "B) Always Encrypted — client-side column encryption where only the application holds the keys.",
            "C) Dynamic Data Masking — masks sensitive columns for non-privileged users.",
            "D) Azure SQL Ledger — provides a tamper-evident audit trail for data changes.",
          ],
          correctIndex: 1,
          explanation:
            "Always Encrypted performs column-level encryption on the client side (in the application driver) — the SQL engine only ever sees encrypted ciphertext. Even database administrators cannot read plaintext values. TDE (A) encrypts data at rest at the storage level, but the SQL engine decrypts it for queries — DBAs can read all data. Dynamic Data Masking (C) masks data in query results but the database still stores and can query plaintext. SQL Ledger (D) is an audit feature, not encryption.",
        },
        {
          id: "az305-d2-q5",
          question:
            "An organization wants real-time analytical queries on their Azure Cosmos DB operational data for business intelligence without impacting production transaction performance. Which feature achieves this?",
          options: [
            "A) Cosmos DB read replicas — offload analytical queries to read-only replicas.",
            "B) Azure Synapse Link for Cosmos DB — automatically syncs data to an analytical store queryable by Synapse Spark/SQL.",
            "C) Azure Data Factory — schedule nightly ETL to copy Cosmos DB data to Synapse.",
            "D) Azure Stream Analytics — stream Cosmos DB change feed to Power BI.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Synapse Link for Cosmos DB creates an analytical store (column-oriented format) that is automatically and continuously synchronized from the transactional store. Synapse Spark and serverless SQL can query the analytical store with zero impact on Cosmos DB's transactional performance. Read replicas (A) are for transactional reads, not optimized for analytical queries. Data Factory ETL (C) is not real-time — nightly batch. Stream Analytics (D) can stream to Power BI but adds pipeline complexity.",
        },
        {
          id: "az305-d2-q6",
          question:
            "A company needs to migrate a 10 TB on-premises SQL Server database to Azure SQL Database with minimal downtime (maximum 2 hours of cutover). Which migration approach should the architect recommend?",
          options: [
            "A) Azure Database Migration Service in offline mode — take the database offline, migrate, bring Azure DB online.",
            "B) Azure Database Migration Service in online mode — continuously sync changes using change data capture (CDC) until cutover.",
            "C) SQL Server backup/restore — backup to Azure Storage, restore to Azure SQL Database.",
            "D) Linked server replication — replicate data in real time from on-premises to Azure.",
          ],
          correctIndex: 1,
          explanation:
            "Azure DMS online mode uses Change Data Capture (CDC) to continuously replicate changes from on-premises SQL Server to Azure SQL Database while the source remains online. After the initial load completes and replication catches up, a minimal cutover window (minutes) is needed. Offline mode (A) requires the database to be offline for the entire migration duration — unacceptable for a 10 TB database. Backup/restore (C) also requires offline time. Linked server replication (D) is complex to configure and not a supported DMS migration path.",
        },
        {
          id: "az305-d2-q7",
          question:
            "An architect is designing an ADLS Gen2 storage account. A data scientist requests the ability to apply POSIX-style ACLs at the directory level for fine-grained access control. What must be configured on the storage account?",
          options: [
            "A) Enable the 'Allow public access' setting on the storage account.",
            "B) Enable the 'Hierarchical Namespace' (HNS) feature at account creation.",
            "C) Configure Shared Access Signatures (SAS) with directory-level scoping.",
            "D) Enable Azure AD authentication on the storage account.",
          ],
          correctIndex: 1,
          explanation:
            "Hierarchical Namespace (HNS) enables the directory and file system semantics (POSIX ACLs, atomic directory operations) that make a Blob Storage account a true ADLS Gen2 account. HNS must be enabled at account creation — it cannot be retroactively enabled. Public access (A) and SAS tokens (C) are for anonymous/delegated access, not POSIX ACLs. Entra ID authentication (D) is required to use ACLs but is not the feature that enables directory-level ACLs.",
        },
        {
          id: "az305-d2-q8",
          question:
            "A company's Azure SQL Database contains sensitive PII data. The database should block connections from unexpected IP addresses and detect SQL injection attempts. Which Azure features address these requirements?",
          options: [
            "A) Azure SQL Database firewall rules + Microsoft Defender for SQL (Advanced Threat Protection).",
            "B) Azure Active Directory authentication + Always Encrypted.",
            "C) TDE + Dynamic Data Masking for all sensitive columns.",
            "D) Private endpoints + SQL audit log.",
          ],
          correctIndex: 0,
          explanation:
            "Server-level firewall rules (or private endpoints) restrict which IP addresses or VNets can connect. Microsoft Defender for SQL (Advanced Threat Protection) detects anomalous activities including SQL injection attempts, unusual login patterns, and potential data exfiltration — sending alerts to Azure Security Center. Entra ID auth + Always Encrypted (B) address identity and column-level encryption, not IP restriction or injection detection. TDE + masking (C) address at-rest encryption and masking. Private endpoints + audit logs (D) provide network control and logging but not active threat detection.",
        },
        {
          id: "az305-d2-q9",
          question:
            "An architect is designing a Cosmos DB schema for a social media application where users can have millions of followers. Each follow relationship is stored as an item with `followerId` as the partition key. What problem does this design create?",
          options: [
            "A) Items within the same partition cannot be queried together.",
            "B) Celebrities with millions of followers create a hot partition — a single logical partition receives a disproportionate number of reads.",
            "C) The partition key should be numeric, not a string value.",
            "D) Cosmos DB limits each partition key to 10,000 items maximum.",
          ],
          correctIndex: 1,
          explanation:
            "When a celebrity is followed by millions of users, all those follow relationships with `followerId` = celebrity's ID land in the same logical partition. This creates a hot partition that receives the vast majority of read traffic, severely limiting throughput. Solutions include using a synthetic partition key (e.g., `followerId + shardSuffix`) for read-heavy scenarios or redesigning the data model. Partition keys can be strings (C). Cosmos DB supports up to 20 GB per logical partition, not 10,000 items (D).",
        },
        {
          id: "az305-d2-q10",
          question:
            "A company needs to run reporting queries against a SQL Server database without impacting OLTP performance. Which Azure SQL Database feature offloads read queries to a secondary?",
          options: [
            "A) Azure SQL Database Hyperscale — high-scale read replicas.",
            "B) Azure SQL Database Active Geo-Replication — use a secondary as a readable replica for reporting.",
            "C) Azure SQL Database elastic pools — share resources between databases.",
            "D) SQL Database Serverless — automatically pause during low activity.",
          ],
          correctIndex: 1,
          explanation:
            "Active Geo-Replication creates up to four readable secondary databases in the same or different regions. Reporting queries can be directed to the secondary endpoint, offloading the primary. Azure SQL Hyperscale (A) supports up to four high-scale named replicas for read scale-out within the same region. Elastic pools (C) share compute across databases, not for read offloading. Serverless (D) is a compute tier with auto-pause, not a replication feature.",
        },
        {
          id: "az305-d2-q11",
          question:
            "A company stores 500 TB of video files in Azure Blob Storage. Videos older than 1 year are accessed once every 3 months for compliance reviews. Videos older than 5 years are almost never accessed. What lifecycle configuration minimizes cost?",
          options: [
            "A) Hot tier for all videos — simplest configuration.",
            "B) Hot tier for new videos → Cool after 30 days → Cold after 365 days → Archive after 1,825 days (5 years).",
            "C) Archive all videos immediately — cheapest tier.",
            "D) Cool tier for all videos — balanced cost and access.",
          ],
          correctIndex: 1,
          explanation:
            "A lifecycle policy that progressively tiers data minimizes cost while meeting access requirements. Videos older than 1 year (accessed quarterly) are well-suited for Cold tier (low access cost for infrequent reads). Videos older than 5 years that are almost never accessed belong in Archive (lowest storage cost but requires rehydration to read). Hot tier for everything (A) is expensive. Immediate archive (C) means videos accessed quarterly would need costly frequent rehydration. Cool only (D) is not optimized for the long-tail infrequent access pattern.",
        },
        {
          id: "az305-d2-q12",
          question:
            "Which Cosmos DB consistency level provides the lowest write latency and highest write throughput, suitable for a non-critical social media activity feed where users can see slightly outdated data?",
          options: [
            "A) Strong — all replicas reflect the latest write.",
            "B) Session — read-your-own-writes within a session.",
            "C) Bounded Staleness — data is at most K versions behind.",
            "D) Eventual — highest throughput; reads may return slightly stale data.",
          ],
          correctIndex: 3,
          explanation:
            "Eventual consistency provides the highest write throughput and lowest latency because writes are acknowledged immediately and propagated asynchronously. Reads may return slightly stale data — acceptable for social media activity feeds where exact ordering is not critical. Strong (A) has the highest write latency and lowest throughput (not suitable for high-volume social feeds). Session (B) and Bounded Staleness (C) offer more consistency guarantees at some cost to throughput.",
        },
        {
          id: "az305-d2-q13",
          question:
            "An enterprise architect needs to design a solution where multiple Azure Data Factory pipelines can share the same Integration Runtime (IR) compute for data movement. Which IR type supports sharing across multiple ADF instances?",
          options: [
            "A) Azure Integration Runtime — cloud-native, managed by Microsoft, cannot be shared.",
            "B) Self-hosted Integration Runtime (SHIR) — can be shared across multiple ADF instances in the same tenant.",
            "C) Azure-SSIS Integration Runtime — for running SSIS packages, cannot be shared.",
            "D) Managed Virtual Network IR — shared by default across all ADF instances.",
          ],
          correctIndex: 1,
          explanation:
            "Self-hosted Integration Runtime (SHIR) can be shared across multiple Data Factory instances within the same tenant. A SHIR installed on on-premises or VNet-connected machines can be linked to additional ADF instances, allowing them to use the same compute for data movement without installing additional agents. Azure IR (A) and Azure-SSIS IR (C) are managed by Microsoft per ADF instance and cannot be shared. Managed VNet IR (D) provides a managed, isolated network environment but is not shared across ADF instances.",
        },
        {
          id: "az305-d2-q14",
          question:
            "A company requires that Azure SQL Database backups be retained for 10 years for regulatory compliance. What is the MAXIMUM long-term retention period supported by Azure SQL Database LTR?",
          options: [
            "A) 35 days — maximum point-in-time restore window.",
            "B) 1 year — maximum for standard retention.",
            "C) 10 years — maximum for Long-Term Retention (LTR) policy.",
            "D) 7 years — maximum for LTR in most Azure regions.",
          ],
          correctIndex: 2,
          explanation:
            "Azure SQL Database Long-Term Retention (LTR) supports weekly, monthly, and yearly backup retention policies with a maximum of **10 years** for yearly backups. This is explicitly supported for regulatory compliance scenarios. The standard PITR window is 1–35 days. LTR uses Azure Blob Storage for the retained backups. The 7-year figure (D) is not accurate for Azure SQL Database LTR.",
        },
        {
          id: "az305-d2-q15",
          question:
            "What is the key architectural advantage of Azure Data Lake Storage Gen2 over Azure Blob Storage (without hierarchical namespace) for big data analytics workloads?",
          options: [
            "A) ADLS Gen2 supports more storage capacity than standard Blob Storage.",
            "B) ADLS Gen2 provides hierarchical namespace with POSIX ACLs, atomic directory operations, and optimized drivers for Spark/Hadoop, significantly improving analytics performance.",
            "C) ADLS Gen2 uses a faster storage medium (NVMe SSD) than standard Blob Storage.",
            "D) ADLS Gen2 supports automatic tiering between Hot, Cool, and Archive tiers.",
          ],
          correctIndex: 1,
          explanation:
            "ADLS Gen2's hierarchical namespace enables true directories with POSIX-style ACLs, atomic rename operations, and an optimized Hadoop-compatible driver (ABFS). This provides significantly better performance for big data frameworks (Spark, Hadoop, Hive) that perform many small file operations and require directory-level access control. Storage capacity (A) and tiering (D) are the same in standard Blob Storage and ADLS Gen2. Storage medium (C) is not differentiated between them.",
        },
      ],
    },

    // ─── Domain 3: Design Business Continuity Solutions (25%) ────────
    {
      id: "domain-3",
      title: "Design Business Continuity Solutions",
      weight: "25%",
      order: 3,
      summary:
        "This domain covers designing high availability, disaster recovery, and backup strategies for Azure workloads. An expert architect must translate business Recovery Time Objective (RTO) and Recovery Point Objective (RPO) requirements into specific Azure service configurations and topologies.\n\nKey areas include designing HA architectures with **Availability Zones**, **Azure Site Recovery** for DR, **Azure Backup** vaults and policies, geo-redundant database configurations, and **Azure Traffic Manager** / **Azure Front Door** for global traffic distribution and failover. The architect must also design for application-level resiliency using circuit breakers, retry patterns, and health probes.\n\nExpect questions that present RTO/RPO requirements and ask you to select the appropriate architecture. Know the cost-resiliency tradeoff for each DR tier: backup/restore (hours), pilot light (minutes), warm standby (seconds), and active-active (near-zero).",
      keyConceptsForExam: [
        "**RTO vs. RPO** — RTO: how long until service is restored; RPO: how much data can be lost; lower values require more expensive architectures",
        "**Availability Zones** — physically separate datacenters; 99.99% SLA for zone-redundant services; protect against datacenter failure",
        "**Azure Site Recovery** — replicate VMs to secondary region; RPO in seconds; test failover for DR drills; failback after recovery",
        "**Azure Backup** — VM backup, SQL backup, file share backup; Recovery Services Vault; MARS agent for on-premises; Cross-region restore",
        "**Geo-redundant databases** — Azure SQL Active Geo-Replication, Cosmos DB multi-region, Azure Cache for Redis geo-replication",
        "**Azure Traffic Manager** — DNS-based global load balancing; failover, performance, weighted, geographic, multivalue routing",
        "**Azure Front Door** — global L7 anycast load balancing; health probes; failover; WAF; CDN — faster failover than Traffic Manager",
        "**App resiliency patterns** — retry with exponential backoff, circuit breaker, bulkhead, health endpoint monitoring, queue-based load leveling",
      ],
      examTips: [
        "For active-active multi-region architectures, Azure Front Door provides faster failover than Traffic Manager because it uses anycast and health probes rather than DNS TTL-based routing.",
        "Azure Backup Vault (for newer services like AKS, Blobs, PostgreSQL) is different from Recovery Services Vault (for VMs, SQL in VM, Azure File Shares). Know which vault each service uses.",
        "Availability Sets protect against hardware and planned maintenance within a single datacenter (99.95% SLA). Availability Zones protect against datacenter failure (99.99% SLA). For maximum HA, use both across-zone deployment.",
        "Cosmos DB multi-region writes enable RPO ≈ 0 for write operations in a multi-region active-active configuration — the strongest DR story for a NoSQL database.",
        "Azure Site Recovery's test failover creates a copy of the VM in an isolated network — it validates the DR plan without impacting production and is a best-practice DR drill mechanism.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-vm-basics", title: "Azure Virtual Machines" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
      ],
      sections: [
        {
          heading: "Disaster Recovery Tiers and Cost-RTO Tradeoffs",
          body: "Business continuity architecture selection depends on RTO and RPO requirements balanced against cost:\n\n| DR Tier | RTO | RPO | Cost | Azure Pattern |\n|---|---|---|---|---|\n| **Backup/Restore** | Hours | Hours | Lowest | Azure Backup vault; restore from backup on failure |\n| **Pilot Light** | Minutes | Minutes | Low | Minimal secondary region with DNS failover; scale up on DR activation |\n| **Warm Standby** | Seconds–Minutes | Seconds | Medium | Reduced-capacity secondary region, always running; Traffic Manager failover |\n| **Active-Active** | Near-zero | Near-zero | Highest | Full-capacity in both regions; Azure Front Door; Cosmos DB multi-master |\n\nThe AZ-305 exam frequently tests matching business requirements to the appropriate tier. Key clues:\n- \"Several hours of downtime acceptable\" → Backup/Restore\n- \"30-minute RTO\" → Pilot Light or Warm Standby\n- \"Less than 1 minute RTO, no data loss\" → Active-Active\n- \"24/7 global e-commerce\" → Active-Active with Azure Front Door",
        },
        {
          heading: "Azure Site Recovery for VM Disaster Recovery",
          body: "Azure Site Recovery (ASR) provides orchestrated disaster recovery for Azure VMs, VMware, and Hyper-V workloads.\n\n**Azure-to-Azure VM replication**:\n1. Enable replication on a VM — ASR installs the mobility service agent and begins replicating disks to a Recovery Services Vault in the target region.\n2. ASR creates a **replica disk** in the target region (crash-consistent every 5 minutes; app-consistent at configurable intervals).\n3. In a disaster, **initiate failover** — ASR creates a new VM in the target region from the latest recovery point.\n4. After the primary region recovers, **re-protect** the failover VM to start replicating back.\n5. **Failback** to the primary region when ready.\n\n**Recovery plans** group multiple VMs and define failover order, parallel vs. sequential execution, and custom Azure Automation runbooks (e.g., update DNS, reconfigure load balancers). Recovery plans enable one-click DR orchestration.\n\nBest practice: Run **test failovers** quarterly to an isolated virtual network to validate DR plans without impacting production.",
          code: {
            lang: "bash",
            label: "Enable Azure Site Recovery replication for a VM",
            snippet: `# Enable ASR replication for a VM to secondary region
az vm disaster-recovery enable \\
  --resource-group myPrimaryRG \\
  --name myVM \\
  --recovery-resource-group mySecondaryRG \\
  --recovery-vault-id "/subscriptions/<sub>/resourceGroups/myRG/providers/Microsoft.RecoveryServices/vaults/myVault" \\
  --target-zone 2

# Trigger a test failover (non-disruptive)
az recoveryservices site-recovery replication-protected-item planned-failover \\
  --vault-name myVault \\
  --resource-group myRG \\
  --failover-direction RecoveryToPrimary`,
          },
        },
        {
          heading: "Multi-Region Active-Active Architecture",
          body: "An active-active architecture runs full-capacity workloads in two or more Azure regions simultaneously, providing near-zero RTO and RPO.\n\n**Traffic distribution**: Azure Front Door or Traffic Manager routes users to the nearest healthy region. Front Door uses anycast for faster failover (health probe failure detected in seconds); Traffic Manager relies on DNS TTL (minutes for propagation).\n\n**Data tier**: Multi-region writes require a data store that supports multi-master replication:\n- **Cosmos DB multi-master**: Write to any region, automatic conflict resolution.\n- **Azure SQL Database Active Geo-Replication**: Secondary is readable but primary handles writes. Failover requires promotion — not true active-active for writes.\n- **Azure Cache for Redis geo-replication**: Secondary is read-only.\n\n**Stateless app tier**: Application servers in both regions are stateless — all state in the data tier. This enables any region to handle any user without session affinity.\n\n**Consistency tradeoffs**: Active-active introduces eventual consistency across regions. Application design must handle scenarios where a user's recent write is not yet visible to another region's read.",
        },
      ],
      quiz: [
        {
          id: "az305-d3-q1",
          question:
            "A healthcare application requires an RTO of less than 5 minutes and RPO of near-zero for its database. The application runs in East US. Which architecture meets these requirements?",
          options: [
            "A) Azure SQL Database with weekly backups restored to a new server on failure.",
            "B) Azure SQL Database with Active Geo-Replication to West US and automatic failover group.",
            "C) Azure SQL Database with Point-In-Time Restore (PITR) to 35-day retention.",
            "D) SQL Server on Azure VM with ASR replication to West US.",
          ],
          correctIndex: 1,
          explanation:
            "Active Geo-Replication maintains a secondary database in West US with near-synchronous replication (RPO of seconds). An automatic failover group provides automatic failover with a configurable grace period (typically under 5 minutes). RPO and RTO both meet the requirements. Weekly backup restore (A) would take hours (RTO violation). PITR (C) is for data recovery, not active DR with fast failover. SQL Server on VM with ASR (D) could work but has higher complexity and management overhead.",
        },
        {
          id: "az305-d3-q2",
          question:
            "A company requires quarterly disaster recovery drills for their Azure VMs without disrupting production services. Which ASR feature enables this?",
          options: [
            "A) Planned failover — gracefully migrate VMs to the secondary region.",
            "B) Test failover — create VM replicas in an isolated network for validation without impacting production.",
            "C) Unplanned failover — simulate a disaster and recover from the latest checkpoint.",
            "D) Re-protect — reverse replication direction after a failover.",
          ],
          correctIndex: 1,
          explanation:
            "ASR Test Failover spins up VM replicas from replica disks in a test virtual network, completely isolated from production. The DR plan can be validated — RTO measured, recovery point verified, application tested — and then the test VMs are cleaned up. No production impact occurs. Planned failover (A) moves production workloads to the secondary region. Unplanned failover (C) is for actual disasters. Re-protect (D) reverses replication after a failover.",
        },
        {
          id: "az305-d3-q3",
          question:
            "A global SaaS application must route users to the nearest available region and automatically failover if a region's health check fails. Azure Front Door vs. Azure Traffic Manager — which provides faster failover and why?",
          options: [
            "A) Traffic Manager — DNS-based routing with lower latency than HTTP-based routing.",
            "B) Azure Front Door — uses anycast and real-time health probes; failover happens in seconds without waiting for DNS TTL propagation.",
            "C) They provide identical failover speeds — both use health probes with the same detection time.",
            "D) Traffic Manager — provides more granular health probe configuration.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Front Door uses Microsoft's anycast global network and HTTP/HTTPS health probes. When a backend fails, Front Door redirects traffic at the network edge in seconds. Traffic Manager is DNS-based — after health probe failure, DNS responses change, but clients with cached DNS responses continue using the failed endpoint until their DNS TTL expires (default 30–300 seconds). Front Door provides significantly faster failover for HTTP workloads.",
        },
        {
          id: "az305-d3-q4",
          question:
            "A company hosts VMs in two Availability Zones in East US. What does this protect against, and what does it NOT protect against?",
          options: [
            "A) Protects against hardware failure; does NOT protect against an entire Azure region failure.",
            "B) Protects against regional outages; does NOT protect against AZ-level failures.",
            "C) Protects against both AZ and regional failures; no additional protection needed.",
            "D) Protects against network latency; does NOT protect against hardware failures.",
          ],
          correctIndex: 0,
          explanation:
            "Availability Zones provide redundancy across physically separate datacenters within a single region, protecting against datacenter (AZ) failure and hardware failures within a datacenter. However, if the entire East US region experiences an outage (rare but possible), both AZs in East US would be affected. For regional failure protection, cross-region replication (ASR, geo-replicated databases, Front Door failover) is required.",
        },
        {
          id: "az305-d3-q5",
          question:
            "An architect is designing backup retention for Azure Virtual Machines. The policy must retain daily backups for 30 days, weekly backups for 12 weeks, monthly backups for 12 months, and yearly backups for 5 years. Which Azure service stores these backups?",
          options: [
            "A) Azure Storage Account with lifecycle management policies.",
            "B) Recovery Services Vault with a backup policy defining daily, weekly, monthly, and yearly retention.",
            "C) Azure Backup Vault — for VM backups with long-term retention.",
            "D) Azure Site Recovery Vault — stores VM recovery points with configurable retention.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Backup for VMs uses the **Recovery Services Vault** with backup policies that support granular retention schedules: daily, weekly, monthly, and yearly recovery points with configurable retention periods. Azure Storage (A) can store exported backups but is not the native backup store. Azure Backup Vault (C) is a newer vault type for Blobs, AKS, and PostgreSQL — not for VMs. Site Recovery Vault (D) is for replication/DR, not long-term backup retention.",
        },
        {
          id: "az305-d3-q6",
          question:
            "A company's mission-critical application has an SLA requirement of 99.99% uptime. The application runs on Azure VMs. Which deployment configuration achieves the 99.99% compute SLA?",
          options: [
            "A) Deploy multiple VMs in an Availability Set — 99.95% SLA.",
            "B) Deploy multiple VMs across Availability Zones — 99.99% SLA.",
            "C) Deploy a single VM with Premium SSD storage — 99.9% SLA.",
            "D) Deploy VMs in two separate Azure regions with Traffic Manager — exceeds 99.99%.",
          ],
          correctIndex: 1,
          explanation:
            "Azure provides a 99.99% SLA for VMs deployed across multiple Availability Zones. Availability Sets (A) provide 99.95% SLA (protects against hardware and maintenance, not AZ failure). A single VM with Premium SSD (C) provides 99.9% SLA. Two-region deployment (D) provides higher resilience but the SLA calculation is more complex and depends on the multi-region architecture — Availability Zones is the specific answer for 99.99%.",
        },
        {
          id: "az305-d3-q7",
          question:
            "An organization needs to ensure Azure Blob Storage data is recoverable for up to 30 days after accidental deletion or overwrite. Which features should be configured?",
          options: [
            "A) Geo-redundant storage (GRS) — secondary region protects against deletion.",
            "B) Blob soft delete (30-day retention) and blob versioning — deleted blobs are retained and previous versions are preserved.",
            "C) CanNotDelete resource lock on the storage account.",
            "D) Azure Backup for Blob Storage with 30-day policy.",
          ],
          correctIndex: 1,
          explanation:
            "Blob soft delete retains deleted blobs for the configured period (30 days) and allows undeleting them. Blob versioning automatically preserves previous versions on every write, allowing restore of any version. Together they protect against both deletion and overwrite. GRS (A) replicates data but does not protect against deletion — the delete replicates too. CanNotDelete lock (C) prevents deletion but also prevents legitimate management operations. Azure Backup for Blob Storage (D) also works but is a separate paid service; soft delete + versioning is the native, cost-effective solution.",
        },
        {
          id: "az305-d3-q8",
          question:
            "A company uses Azure Traffic Manager for global load balancing. During a regional outage, how long might it take for end users to fail over to the healthy region?",
          options: [
            "A) Immediately — Traffic Manager provides real-time failover.",
            "B) Up to several minutes — depends on DNS TTL settings and client DNS caching.",
            "C) Up to 1 hour — Traffic Manager health probes run every 30 minutes.",
            "D) Requires manual intervention — Traffic Manager does not auto-failover.",
          ],
          correctIndex: 1,
          explanation:
            "Traffic Manager is DNS-based — after detecting endpoint failure (health probe interval + failure tolerance threshold), it updates DNS responses to point to the healthy endpoint. However, end users with cached DNS responses will continue using the failed endpoint until their local TTL expires (Traffic Manager's minimum TTL is 0 seconds, but real-world DNS caching means 30–300 seconds or more). Azure Front Door provides faster failover using anycast, with no DNS TTL dependency.",
        },
        {
          id: "az305-d3-q9",
          question:
            "An architect needs to design the recovery process for an Azure SQL Database that was accidentally dropped by an administrator. What is the FASTEST recovery mechanism?",
          options: [
            "A) Restore from a weekly backup using Long-Term Retention.",
            "B) Use Point-In-Time Restore (PITR) to recover the database to just before the accidental drop.",
            "C) Re-create the database from the application's schema scripts and reload data.",
            "D) Activate the geo-replication secondary as the new primary.",
          ],
          correctIndex: 1,
          explanation:
            "Point-In-Time Restore (PITR) is the fastest recovery for accidental drops — it restores the database to any point within the retention window (up to 35 days) from continuous automatic backups. The restore creates a new database within minutes. LTR (A) is for long-term compliance retention and is not faster than PITR for recent accidents. Re-creating from scripts (C) is slow and may lose data. Geo-replication failover (D) promotes the secondary, but the drop would have replicated there too.",
        },
        {
          id: "az305-d3-q10",
          question:
            "A Cosmos DB account uses multi-region writes with three regions (East US, West Europe, Southeast Asia). A write conflict occurs because two regions update the same item simultaneously. Which conflict resolution mode is configured by default?",
          options: [
            "A) Custom merge procedures — developer-defined conflict resolution logic.",
            "B) Last-Write-Wins (LWW) — the write with the highest `_ts` (timestamp) value wins.",
            "C) First-Write-Wins — the earliest write is preserved.",
            "D) Manual resolution — conflicts are queued for administrator review.",
          ],
          correctIndex: 1,
          explanation:
            "Cosmos DB's default conflict resolution policy for multi-region writes is **Last-Write-Wins (LWW)** using the `_ts` server timestamp. The write with the highest timestamp value wins. Developers can configure a custom property for LWW or implement custom stored procedures for merge-based conflict resolution. There is no first-write-wins policy (C) in Cosmos DB. Manual resolution (D) is not available — all conflicts are automatically resolved.",
        },
        {
          id: "az305-d3-q11",
          question:
            "A company requires cross-region restore for Azure VM backups. A production VM in East US needs to be restored to West US after a regional failure. Which Recovery Services Vault feature enables this?",
          options: [
            "A) Vault geo-redundant storage — stores backup data in the paired region.",
            "B) Cross-Region Restore (CRR) — explicitly restore a VM backup to a different region.",
            "C) Azure Site Recovery — replicate VMs to the secondary region.",
            "D) Zone-redundant storage — stores backups across zones in the same region.",
          ],
          correctIndex: 1,
          explanation:
            "Cross-Region Restore (CRR) is a Recovery Services Vault feature that enables restoring Azure VM backups to the secondary paired region. It requires the vault to use Geo-Redundant Storage (GRS) or GZRS. CRR is an explicit restore operation — it is different from ASR which provides ongoing replication. The vault GRS setting (A) replicates backup data to the secondary region, which is a prerequisite for CRR but is not the restore feature itself. ASR (C) is continuous replication for DR, not backup restore.",
        },
        {
          id: "az305-d3-q12",
          question:
            "What should an architect configure to ensure an Azure App Service web app automatically routes traffic to a secondary region when the primary region's health check fails?",
          options: [
            "A) Configure Azure DNS with a CNAME record pointing to the secondary region.",
            "B) Use Azure Traffic Manager with failover routing method — primary endpoint with automatic failover to secondary.",
            "C) Deploy the app to a second App Service and manually update DNS on failure.",
            "D) Enable App Service auto-heal rules to restart the app on health check failure.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Traffic Manager with the **Priority** (failover) routing method monitors the primary endpoint health and automatically routes traffic to the secondary endpoint when the primary fails. DNS updates happen automatically based on health probe results. Azure DNS CNAME (A) is static and requires manual updates. Manual DNS updates (C) increase RTO. App Service auto-heal (D) restarts the app within the same region — it does not provide cross-region failover.",
        },
        {
          id: "az305-d3-q13",
          question:
            "A company wants to implement a circuit breaker pattern in their microservices architecture on Azure. When a downstream service is failing, the circuit should open and return a cached or default response without attempting the call. Which Azure service or SDK supports implementing this pattern?",
          options: [
            "A) Azure Service Bus dead-letter queue — catch failed messages and return defaults.",
            "B) Azure API Management with caching policies — return cached responses when the backend is unavailable.",
            "C) Application-level circuit breaker using Polly (for .NET) or Resilience4j (for Java), optionally integrated with Azure App Configuration for dynamic threshold configuration.",
            "D) Azure Front Door health probes — stop routing requests to failed backends.",
          ],
          correctIndex: 2,
          explanation:
            "Circuit breaker is an application-level resilience pattern implemented in code using libraries like **Polly** (.NET), **Resilience4j** (Java), or similar. These libraries maintain state (Closed, Open, Half-Open) and implement the fallback logic. Azure App Configuration can provide dynamic threshold configuration. APIM caching (B) caches responses but does not implement circuit breaker state logic. Service Bus DLQ (A) handles messaging failures. Azure Front Door health probes (D) route traffic but do not implement application-level fallback responses.",
        },
        {
          id: "az305-d3-q14",
          question:
            "A mission-critical application has zero tolerance for data loss (RPO = 0) and requires RTO < 1 minute. The application uses Azure SQL Database. Which architecture achieves these requirements?",
          options: [
            "A) Azure SQL Database with weekly full backups and daily differential backups.",
            "B) Azure SQL Database Hyperscale with a named replica in the same region.",
            "C) Azure SQL Database with Active Geo-Replication and automatic failover group — RPO in seconds, RTO < 1 minute for automatic failover.",
            "D) Azure SQL Managed Instance with SQL Server log shipping to a secondary.",
          ],
          correctIndex: 2,
          explanation:
            "Active Geo-Replication maintains a near-synchronous secondary (RPO typically < 5 seconds). Automatic failover groups provide an automatic failover policy with a configurable grace period (minimum 1 second). This can achieve sub-minute RTO with near-zero RPO. Weekly backups (A) provide RPO of hours. Hyperscale named replicas (B) are for read scale-out in the same region, not cross-region DR. SQL MI log shipping (D) has higher RPO and RTO than geo-replication.",
        },
        {
          id: "az305-d3-q15",
          question:
            "A company has a Recovery Services Vault storing VM backups. A ransomware attack encrypts all VMs and attempts to delete their backups. What Azure Backup feature prevents the ransomware from deleting backup data?",
          options: [
            "A) Geo-redundant storage — backups are replicated to a secondary region.",
            "B) Soft delete — deleted backup data is retained for 14 days and can be recovered.",
            "C) Resource lock on the vault — prevents deletion of the vault but not backup items.",
            "D) Immutable vault — backup data cannot be deleted or shortened by any user for the retention period.",
          ],
          correctIndex: 3,
          explanation:
            "Azure Backup **Immutable Vault** prevents modification, shortening, or deletion of backup data for the configured retention period — even by subscription owners or Microsoft. This is the strongest protection against ransomware attempting to eliminate backups. Soft delete (B) provides a 14-day recovery window but a sophisticated attacker with sufficient access could disable soft delete and then delete backups. GRS (A) replicates data but does not prevent deletion (the delete replicates). Resource locks (C) protect the vault resource but not the backup items within it.",
        },
      ],
    },

    // ─── Domain 4: Design Infrastructure Solutions (25%) ─────────────
    {
      id: "domain-4",
      title: "Design Infrastructure Solutions",
      weight: "25%",
      order: 4,
      summary:
        "This domain covers designing compute, networking, application deployment, and migration infrastructure on Azure. An expert architect must design scalable, cost-efficient, and secure infrastructure solutions from requirements, selecting the right compute tier and networking topology for each workload.\n\nKey areas include designing compute solutions (VMs, VMSS, App Service, AKS, Azure Batch), hub-spoke and Virtual WAN networking topologies, hybrid connectivity (ExpressRoute, VPN), application migration strategies (6 Rs: Rehost, Refactor, Rearchitect, Rebuild, Replace, Retire), and Azure landing zone infrastructure for enterprise scale.\n\nExpect scenario-based questions where you must design multi-tier application architectures, justify compute choices based on workload characteristics, and select the appropriate network topology for enterprise-scale connectivity.",
      keyConceptsForExam: [
        "**Compute selection** — IaaS (VM) vs. PaaS (App Service, AKS) vs. serverless (Functions, Container Apps) based on control, management overhead, and cost",
        "**AKS architecture** — node pools (system + user), cluster autoscaler, Azure CNI vs. kubenet, managed identity, private cluster",
        "**Azure Batch** — large-scale HPC and batch compute; job scheduling; auto-scaling pools; low-priority VMs for cost reduction",
        "**Hub-spoke networking** — centralized shared services (firewall, DNS, VPN/ER) in hub; workload VNets as spokes; peering + UDRs for routing",
        "**Azure Virtual WAN** — managed hub-and-spoke; transit routing; branch office connectivity; Standard tier for transitive connectivity",
        "**ExpressRoute circuits** — Global Reach for on-premises to on-premises through Azure backbone; FastPath for improved latency",
        "**Migration strategies (6 Rs)** — Rehost (lift-and-shift), Refactor (PaaS migration), Rearchitect (modernize), Rebuild (rewrite), Replace (SaaS), Retire",
        "**Azure Migrate** — discovery, assessment, and migration of on-premises workloads; Server Migration, Database Migration, App Service Migration",
      ],
      examTips: [
        "Hub-spoke with Azure Firewall is the exam-preferred answer for enterprise network topology — not multiple VNet peering meshes. Centralizing security controls in the hub reduces management overhead.",
        "Azure Virtual WAN Standard tier provides transitive connectivity between branches and spokes without UDRs — recommended over custom hub-spoke for large-scale multi-branch deployments.",
        "For AKS, Azure CNI assigns real VNet IP addresses to pods (supports network policies and direct pod access from on-premises). Kubenet uses NAT and has IP limitations but uses fewer VNet IPs.",
        "Azure Batch is the answer for HPC, rendering, financial modeling, and other massively parallel workloads that run on thousands of VMs simultaneously.",
        "When a question says 'lift-and-shift with minimal code changes,' the answer is Rehost (Azure Migrate to VM). 'Minimal effort to take advantage of cloud managed services' = Refactor (to App Service or SQL MI).",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-vm-basics", title: "Azure Virtual Machines" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
      ],
      sections: [
        {
          heading: "Enterprise Network Topology Design",
          body: "Azure enterprise network architectures follow two main patterns:\n\n**Hub-Spoke with Azure Firewall** (manual hub-spoke):\n- **Hub VNet**: Azure Firewall (or NVA), VPN/ExpressRoute Gateway, Azure Bastion, DNS resolver.\n- **Spoke VNets**: Application workloads, peered to hub. Traffic flows to/from spoke through the hub firewall via UDRs.\n- **Pros**: Full control, customizable. **Cons**: Requires UDRs for each spoke subnet; spoke-to-spoke traffic must go through hub; management scales linearly.\n\n**Azure Virtual WAN** (managed hub):\n- Microsoft-managed hub provides automatic transit routing between branches, spokes, and ExpressRoute/VPN.\n- Standard tier enables any-to-any (hub-to-hub, spoke-to-spoke, branch-to-spoke) transitive connectivity.\n- **Pros**: No UDRs required; scales automatically; built-in routing policies. **Cons**: Less customization than custom hub; cannot deploy custom NVAs in hub (use integrated NVA partners).\n\nFor new enterprise deployments with many branches and sites, Virtual WAN Standard is the recommended architecture. For organizations needing custom routing logic or NVAs not supported by Virtual WAN, manual hub-spoke with Azure Firewall is preferred.",
          code: {
            lang: "bash",
            label: "Create a hub VNet and peer a spoke VNet",
            snippet: `# Create hub VNet
az network vnet create \\
  --name hub-vnet \\
  --resource-group connectivity-rg \\
  --address-prefix 10.0.0.0/16 \\
  --location eastus

# Create spoke VNet
az network vnet create \\
  --name spoke-app-vnet \\
  --resource-group app-rg \\
  --address-prefix 10.1.0.0/16 \\
  --location eastus

# Peer hub to spoke (enable gateway transit)
az network vnet peering create \\
  --name hub-to-spoke \\
  --resource-group connectivity-rg \\
  --vnet-name hub-vnet \\
  --remote-vnet spoke-app-vnet \\
  --allow-forwarded-traffic true \\
  --allow-gateway-transit true

# Peer spoke to hub (use remote gateway)
az network vnet peering create \\
  --name spoke-to-hub \\
  --resource-group app-rg \\
  --vnet-name spoke-app-vnet \\
  --remote-vnet hub-vnet \\
  --allow-forwarded-traffic true \\
  --use-remote-gateways true`,
          },
        },
        {
          heading: "AKS Architecture Design",
          body: "Designing an Azure Kubernetes Service cluster requires several key decisions:\n\n**Node pools**: Every AKS cluster has a **system node pool** (runs Kubernetes system pods like CoreDNS, metrics-server) and optionally **user node pools** for workloads. System pools require specific VM SKUs (D-series recommended). Separate workloads into dedicated node pools with taints/tolerations for isolation.\n\n**Networking**: \n- **Azure CNI**: Each pod gets a real VNet IP address. Supports Kubernetes Network Policies, allows direct communication from on-premises to pod IPs. Requires more VNet IP space.\n- **kubenet**: Pods use a private IP range; nodes NAT pod traffic. Fewer VNet IPs needed but no direct pod access and limited network policy support.\n- **Azure CNI Overlay** (newer): Pods get private IPs from an overlay network; only node IPs use VNet space. Best of both.\n\n**Security**: Enable **private cluster** for AKS API server — the Kubernetes API is only accessible from within the VNet. Use **managed identity** for the cluster and kubelet (no service principal credentials). Enable **Microsoft Defender for Containers** for runtime threat detection.\n\n**Scaling**: Cluster Autoscaler automatically adds/removes nodes based on pending pods. KEDA (via Azure Container Apps add-on or KEDA operator) provides event-driven pod scaling.",
        },
        {
          heading: "Migration Strategy Selection",
          body: "The **6 Rs** framework guides cloud migration decisions:\n\n- **Rehost** (lift-and-shift): Move VMs to Azure with no code changes. Use **Azure Migrate** (Server Migration). Fastest, lowest transformation, least cloud benefit. Suitable for: legacy workloads, EOL OS.\n- **Refactor** (lift-and-shift to PaaS): Move to managed services with minimal code changes. E.g., SQL Server → Azure SQL MI; IIS app → App Service. Use: **Azure Migrate App Service Migration** for web apps.\n- **Rearchitect**: Significantly modify the application to leverage cloud-native capabilities. E.g., monolith → microservices on AKS. Higher transformation effort, maximum cloud benefit.\n- **Rebuild**: Rewrite the application from scratch using cloud-native architecture. Highest effort, maximum value for strategic applications.\n- **Replace**: Replace the application with a SaaS solution (e.g., replace custom CRM with Salesforce). Reduces ongoing maintenance.\n- **Retire**: Decommission applications that are no longer needed. Reduces costs.\n\n**Azure Migrate** provides discovery (installed agent or agentless), TCO assessment (comparing on-premises vs. Azure costs), and migration tooling for each strategy.",
        },
      ],
      quiz: [
        {
          id: "az305-d4-q1",
          question:
            "An enterprise has 50 branch offices connected to their headquarters. They need all branches, the headquarters, and multiple Azure spoke VNets to communicate with each other with minimal routing configuration. Which Azure networking solution should the architect recommend?",
          options: [
            "A) Hub-spoke topology with 50 VNet peerings and manual UDRs for each spoke.",
            "B) Azure Virtual WAN Standard tier — managed hub with automatic transitive routing for branches and spokes.",
            "C) Full mesh VNet peering between all spokes and the hub.",
            "D) Multiple ExpressRoute circuits, one per branch.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Virtual WAN Standard provides managed transitive routing — branches (connected via S2S VPN or ExpressRoute) and spoke VNets can all communicate through the managed hub without manual UDR configuration. It scales automatically as new branches or spokes are added. Manual hub-spoke (A) requires UDRs per spoke subnet, which becomes complex at 50 branches. Full mesh (C) does not support on-premises branches. Individual ExpressRoute per branch (D) is prohibitively expensive.",
        },
        {
          id: "az305-d4-q2",
          question:
            "A research organization needs to run a computational fluid dynamics simulation that requires 10,000 CPU cores simultaneously for 6 hours. What Azure compute service is designed for this workload?",
          options: [
            "A) Azure App Service with Premium plan scaled to maximum instances.",
            "B) Azure Virtual Machine Scale Sets — scale to 10,000 instances manually.",
            "C) Azure Batch — designed for large-scale HPC and parallel batch workloads.",
            "D) Azure Kubernetes Service with 1,000 nodes in the cluster.",
          ],
          correctIndex: 2,
          explanation:
            "Azure Batch is specifically designed for large-scale HPC, scientific computing, and parallel batch processing. It manages pool creation, job scheduling, task distribution, and automatic scaling across thousands of VMs. Low-priority VMs reduce cost for fault-tolerant HPC workloads. App Service (A) is for web applications. VMSS (B) can scale large but lacks HPC job scheduling. AKS (D) is for containerized microservices, not traditional HPC job scheduling.",
        },
        {
          id: "az305-d4-q3",
          question:
            "A company wants to migrate their on-premises web applications to Azure with the least application changes, while taking advantage of managed PaaS services for reduced operational overhead. Which migration strategy and Azure service should they use?",
          options: [
            "A) Rehost — use Azure Migrate to move IIS VMs to Azure VMs.",
            "B) Refactor — use Azure Migrate App Service Migration to move IIS apps to Azure App Service.",
            "C) Rearchitect — redesign as containerized microservices on AKS.",
            "D) Rebuild — rewrite applications in cloud-native frameworks.",
          ],
          correctIndex: 1,
          explanation:
            "Refactoring to Azure App Service requires minimal code changes (configuration updates, dependency adjustments) while eliminating IIS and Windows Server infrastructure management. The Azure Migrate App Service Migration assistant automates the assessment and migration. Rehosting to VMs (A) reduces operational benefit compared to PaaS. Rearchitecting (C) and rebuilding (D) require significant development effort — not suitable for the 'least changes' requirement.",
        },
        {
          id: "az305-d4-q4",
          question:
            "An AKS cluster must allow pods to be accessed directly from on-premises systems using pod IP addresses (no NAT required). Which networking plugin should be selected?",
          options: [
            "A) kubenet — assigns pods to a private overlay network with NAT.",
            "B) Azure CNI — assigns real VNet IP addresses to pods, enabling direct pod access.",
            "C) Calico — provides network policies but uses the same IP space as kubenet.",
            "D) Azure CNI Overlay — assigns overlay IPs to pods, still requires NAT for on-premises access.",
          ],
          correctIndex: 1,
          explanation:
            "Azure CNI assigns each pod a real IP address from the VNet subnet. These IPs are routable from on-premises (via ExpressRoute or VPN) without NAT, enabling direct pod communication. kubenet (A) uses NAT — on-premises systems cannot reach pod IPs directly. Calico (C) is a network policy engine that works with kubenet or Azure CNI. Azure CNI Overlay (D) uses private overlay IPs not routable from on-premises.",
        },
        {
          id: "az305-d4-q5",
          question:
            "An architect needs to design connectivity between two on-premises datacenters that are both connected to Azure via ExpressRoute. Traffic between the two datacenters should route through the Azure ExpressRoute backbone without leaving the Microsoft network. Which ExpressRoute feature enables this?",
          options: [
            "A) ExpressRoute FastPath — bypasses the gateway for improved data plane performance.",
            "B) ExpressRoute Global Reach — connects multiple on-premises networks through the Microsoft global network.",
            "C) ExpressRoute Direct — provides direct connectivity to Microsoft peering locations.",
            "D) ExpressRoute Premium — extends circuit connectivity to all Azure regions globally.",
          ],
          correctIndex: 1,
          explanation:
            "ExpressRoute Global Reach creates a logical connection between two ExpressRoute circuits, enabling on-premises-to-on-premises traffic to flow through the Microsoft global backbone. This eliminates the need to route datacenter-to-datacenter traffic over the public internet. FastPath (A) improves data plane latency between on-premises and Azure VNet. ExpressRoute Direct (C) is a connectivity option (10G/100G circuits). Premium (D) extends circuit geographical scope.",
        },
        {
          id: "az305-d4-q6",
          question:
            "A company runs batch processing workloads that can tolerate VM interruptions and restart from checkpoints. They want to minimize compute costs. Which VM purchasing model minimizes cost for this workload?",
          options: [
            "A) On-demand VMs — standard pay-per-use pricing.",
            "B) Reserved VM Instances (1-year) — commitment discount.",
            "C) Azure Spot VMs — use excess Azure capacity at up to 90% discount, with eviction risk.",
            "D) Dedicated Hosts — physical servers dedicated to your organization.",
          ],
          correctIndex: 2,
          explanation:
            "Azure Spot VMs use surplus Azure capacity at up to 90% discount. The eviction risk is acceptable for batch workloads that can checkpoint and restart. Azure Batch natively supports low-priority (Spot) VMs in pools with automatic re-queuing of interrupted tasks. On-demand (A) is full-price. Reserved instances (B) provide discounts but require commitment — suitable for steady-state, not variable batch workloads. Dedicated hosts (D) are the most expensive option for compliance/isolation needs.",
        },
        {
          id: "az305-d4-q7",
          question:
            "A company wants to build a microservices application on AKS that automatically scales based on the number of messages in an Azure Service Bus queue. Which AKS feature or add-on provides this capability?",
          options: [
            "A) Kubernetes Horizontal Pod Autoscaler (HPA) based on CPU metrics.",
            "B) Cluster Autoscaler — adds nodes when pods cannot be scheduled.",
            "C) KEDA (Kubernetes Event-Driven Autoscaling) — scales pods based on external event sources like Service Bus queue depth.",
            "D) Azure Monitor Container Insights autoscaling recommendations.",
          ],
          correctIndex: 2,
          explanation:
            "KEDA (Kubernetes Event-Driven Autoscaling) is an AKS add-on that scales deployments based on external event sources, including Azure Service Bus queue message count, Event Hub consumer lag, Storage Queue depth, and many other sources. HPA (A) only scales on CPU/memory metrics. Cluster Autoscaler (B) scales nodes (not pods) when pods are pending. Container Insights (D) provides recommendations but does not automatically scale workloads.",
        },
        {
          id: "az305-d4-q8",
          question:
            "An enterprise network uses a hub-spoke topology. The security team requires that all traffic between spoke VNets (east-west traffic) passes through Azure Firewall in the hub for inspection. How should the routing be configured?",
          options: [
            "A) Configure NSG rules on each spoke subnet to deny direct spoke-to-spoke traffic.",
            "B) Create User Defined Routes (UDRs) in each spoke subnet routing inter-spoke traffic (via hub) to Azure Firewall's private IP as the next hop.",
            "C) Enable global peering between all spoke VNets directly — they will route through the hub automatically.",
            "D) Configure Azure Front Door to route spoke-to-spoke traffic through the hub.",
          ],
          correctIndex: 1,
          explanation:
            "UDRs on spoke subnets override system routes and force inter-spoke traffic through the Azure Firewall in the hub. For example, a UDR on spoke-A's subnets with destination `10.0.0.0/8` (covering all Azure space) with next hop = Azure Firewall private IP routes all inter-spoke traffic through the firewall. NSGs (A) can block but not redirect traffic for inspection. VNet peering (C) is non-transitive by default — spoke-to-spoke traffic does not automatically route through the hub. Azure Front Door (D) is for HTTP load balancing.",
        },
        {
          id: "az305-d4-q9",
          question:
            "A company has a private AKS cluster. Developer CI/CD pipelines need to deploy updates to the cluster. The cluster's API server is not publicly accessible. How should CI/CD pipeline access be designed?",
          options: [
            "A) Temporarily enable public API server access during deployments and disable it after.",
            "B) Deploy the CI/CD agent (Azure DevOps agent or GitHub Actions runner) in the VNet where the private cluster's API server is accessible.",
            "C) Use Azure Bastion to tunnel kubectl commands to the cluster.",
            "D) Configure the AKS cluster with an Authorized IP range that includes the CI/CD pipeline's IP.",
          ],
          correctIndex: 1,
          explanation:
            "Self-hosted CI/CD agents (Azure DevOps private agents, GitHub Actions self-hosted runners) deployed within the VNet (or a peered VNet) that has access to the private API server endpoint can communicate with the cluster. This is the standard design for CI/CD with private AKS clusters. Temporarily enabling public access (A) creates a recurring security exposure. Azure Bastion (C) is for VM access, not kubectl automation. Authorized IP ranges (D) are for restricting public access, not enabling private access — a private cluster has no public endpoint.",
        },
        {
          id: "az305-d4-q10",
          question:
            "An organization needs to assess which of their 500 on-premises VMs are suitable for migration to Azure and estimate the Azure cost. Which Azure service provides this capability?",
          options: [
            "A) Azure Cost Management — analyze current Azure spending.",
            "B) Azure Migrate — discover and assess on-premises infrastructure for Azure migration readiness and cost estimation.",
            "C) Azure Advisor — provide recommendations for existing Azure resources.",
            "D) Microsoft Defender for Cloud — identify vulnerable on-premises systems.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Migrate provides: (1) **Discovery** — agentless or agent-based inventory of on-premises VMs (VMware, Hyper-V, physical), (2) **Assessment** — readiness analysis, right-sizing recommendations, and estimated Azure monthly costs, (3) **Migration** — guided tools for rehosting VMs, databases, and web apps. Azure Cost Management (A) analyzes existing Azure spend. Azure Advisor (C) provides recommendations for existing Azure resources. Defender for Cloud (D) focuses on security posture.",
        },
        {
          id: "az305-d4-q11",
          question:
            "A company wants to run Windows containers on Azure Kubernetes Service. Which AKS node pool OS type should they use for Windows workloads?",
          options: [
            "A) Linux node pool with Wine compatibility layer.",
            "B) Windows node pool — AKS supports Windows Server nodes in user node pools.",
            "C) Azure Container Instances for Windows containers — AKS does not support Windows.",
            "D) Azure App Service with Windows containers — more appropriate than AKS.",
          ],
          correctIndex: 1,
          explanation:
            "AKS supports Windows Server node pools for running Windows containers. The system node pool must be Linux (Kubernetes system pods run on Linux), but additional **user node pools** can be Windows Server. Windows pods are scheduled on Windows nodes via node selectors and taints. AKS does support Windows containers (C is wrong). App Service Windows containers (D) work but AKS is appropriate when orchestration, scaling, and microservices features are needed.",
        },
        {
          id: "az305-d4-q12",
          question:
            "A company's application uses a 3-tier architecture (web, app, database). All three tiers must be deployed across Availability Zones. The web tier is exposed to the internet. Which load balancers should the architect deploy?",
          options: [
            "A) A single Azure Load Balancer (public) for all three tiers.",
            "B) A zone-redundant Application Gateway (public, L7) for the web tier and a zone-redundant internal Azure Load Balancer (L4) between the app and database tiers.",
            "C) Azure Traffic Manager for the web tier and Azure Load Balancer for the app tier.",
            "D) Azure Front Door for all tiers — single global entry point.",
          ],
          correctIndex: 1,
          explanation:
            "A zone-redundant Application Gateway provides L7 (HTTP/HTTPS) load balancing for internet-facing web traffic with WAF capabilities. An internal zone-redundant Azure Load Balancer distributes traffic between app and database tiers within the VNet. Both are deployed across Availability Zones for resilience. A single public load balancer (A) does not provide L7 routing or internal tier isolation. Traffic Manager (C) is DNS-based and not suited for internal tier routing. Azure Front Door (D) is global, not suitable for internal tier communication.",
        },
        {
          id: "az305-d4-q13",
          question:
            "A company connects to Azure via two ExpressRoute circuits (primary and secondary) from their headquarters. They want to ensure that if the primary circuit fails, traffic automatically uses the secondary circuit. How should the circuits be configured in the Virtual Network Gateway?",
          options: [
            "A) Create two separate VNet Gateways, one per ExpressRoute circuit.",
            "B) Add both ExpressRoute circuits as connections to the same ExpressRoute Virtual Network Gateway — the gateway uses both circuits and fails over automatically.",
            "C) Use Traffic Manager with ExpressRoute endpoints for DNS-based failover.",
            "D) Configure BGP AS path prepending on the primary circuit to prefer secondary by default.",
          ],
          correctIndex: 1,
          explanation:
            "An ExpressRoute Virtual Network Gateway supports multiple circuit connections. Adding both circuits to the same gateway provides automatic path selection and failover — if the primary circuit fails, traffic uses the secondary. Microsoft and your network provider handle BGP routing for automatic failover. Two separate gateways (A) would require two different VNet address spaces. Traffic Manager (C) is for application-layer routing, not ExpressRoute circuit selection. BGP prepending (D) is a technique to prefer one path over another, but the question asks about automatic failover configuration.",
        },
        {
          id: "az305-d4-q14",
          question:
            "Which Azure service should an architect recommend for running containerized workloads that need Dapr for microservice communication patterns and KEDA-based auto-scaling, without the complexity of managing Kubernetes?",
          options: [
            "A) Azure Kubernetes Service (AKS) — full Kubernetes control.",
            "B) Azure Container Apps — serverless containers with built-in Dapr and KEDA integration.",
            "C) Azure Container Instances — serverless containers without orchestration.",
            "D) Azure App Service for Containers — managed PaaS for containerized web apps.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Container Apps provides serverless containers with built-in Dapr (for service discovery, pub/sub, state management) and KEDA (for event-driven autoscaling) — without the operational complexity of managing Kubernetes control planes and node pools. AKS (A) provides full Kubernetes control but requires more operational management. ACI (C) runs individual containers without orchestration, Dapr, or KEDA. App Service (D) is for web apps and APIs without Dapr/KEDA integration.",
        },
        {
          id: "az305-d4-q15",
          question:
            "An architect is designing the compute tier for an application that processes image uploads. Image processing is CPU-intensive and can run in parallel, but the processing time varies from 1 second to 10 minutes. Traffic is unpredictable — bursts of thousands of images, then periods of low activity. Which compute approach is MOST cost-effective?",
          options: [
            "A) Reserved VM Instances pre-provisioned for peak load — always available.",
            "B) Azure Functions on Consumption plan triggered by Storage Queue messages — scales to zero when idle, scales out on demand.",
            "C) Azure App Service Standard plan with manual scaling rules.",
            "D) A dedicated VM for image processing running 24/7.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Functions on the Consumption plan scales from zero to thousands of instances on demand, billing only for execution time and requests. For variable, unpredictable workloads with idle periods, this is the most cost-effective model. Queue-triggered functions naturally handle parallel processing of image messages. Reserved instances (A) and dedicated VMs (D) cost money even when idle — not cost-effective for unpredictable traffic. App Service manual scaling (C) requires anticipating demand and still runs instances during idle periods.",
        },
      ],
    },
  ],
};
