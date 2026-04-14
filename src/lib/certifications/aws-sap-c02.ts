import type { Certification } from "./types";

export const awsSapC02: Certification = {
  id: "aws-sap-c02",
  title: "AWS Solutions Architect Professional",
  code: "SAP-C02",
  cloud: "aws",
  level: "Professional",
  description:
    "Validate advanced skills in designing complex, distributed systems on AWS. This Professional-level exam requires deep understanding of multi-account architectures, hybrid connectivity, cost optimization at scale, and the ability to evaluate multiple valid architectural trade-offs.",
  examFormat: {
    questions: 75,
    duration: "180 minutes",
    passingScore: "750/1000",
    cost: "$300 USD",
  },
  domains: [
    // ─── Domain 1: Design Solutions for Organizational Complexity (26%) ───
    {
      id: "domain-1",
      title: "Design Solutions for Organizational Complexity",
      weight: "26%",
      order: 1,
      summary:
        "This domain tests your ability to architect solutions that span multiple AWS accounts, business units, and geographic regions. At the Professional level, you must go beyond single-account design and address the governance, networking, security, and compliance challenges that arise at enterprise scale.\n\nExpect deep questions on **AWS Organizations**, **AWS Control Tower**, **Service Control Policies (SCPs)**, and strategies for delegating administrative control without sacrificing security guardrails. You will also need to understand how to federate identities from on-premises directories into AWS using **AWS IAM Identity Center** (formerly SSO) and how to enforce compliance across hundreds of accounts simultaneously.\n\nHybrid network design is a core competency in this domain. Questions test your ability to choose and combine **AWS Direct Connect**, **Site-to-Site VPN**, **AWS Transit Gateway**, and **AWS PrivateLink** for large-scale, fault-tolerant connectivity. You must weigh cost, bandwidth, latency, and redundancy trade-offs across multiple valid architectures.",
      keyConceptsForExam: [
        "**AWS Organizations & SCPs** — hierarchical OU structure, SCP inheritance, allow-list vs. deny-list SCP strategy, delegated administrator accounts",
        "**AWS Control Tower** — landing zone, account factory, guardrails (preventive vs. detective), customizations for Control Tower (CfCT)",
        "**AWS IAM Identity Center** — SCIM provisioning, permission sets, attribute-based access control (ABAC), integration with external IdPs (Okta, Azure AD)",
        "**Multi-account networking** — Transit Gateway route tables, VPN attachments, Direct Connect Gateways, Resource Access Manager (AWS RAM) subnet sharing",
        "**AWS Direct Connect** — dedicated vs. hosted connections, virtual interfaces (private, public, transit), LAG (Link Aggregation Group) for redundancy",
        "**Cross-account service access** — resource-based policies vs. role assumption, AWS RAM for sharing resources, VPC endpoint policies",
        "**Compliance at scale** — AWS Config aggregators, Security Hub with cross-account findings, AWS Audit Manager evidence collection",
        "**Cost governance** — AWS Cost Anomaly Detection, Budgets with Actions, Savings Plans vs. Reserved Instances at organization level",
      ],
      examTips: [
        "For multi-account network connectivity questions, Transit Gateway almost always beats VPC peering for three or more VPCs — VPC peering does not support transitive routing.",
        "Distinguish SCP effects carefully: SCPs restrict what **principals in member accounts** can do, but they do not grant permissions. The management account itself is not restricted by SCPs.",
        "When a scenario involves hundreds of accounts needing consistent baseline configuration (logging, guardrails, security tooling), the answer is almost always **AWS Control Tower** with account factory automation.",
        "Direct Connect questions often test redundancy: a single Direct Connect is not HA — pair with a Site-to-Site VPN or a second Direct Connect in a different facility for failover.",
        "ABAC (attribute-based access control) using tags is the preferred scalable approach when questions ask how to manage permissions for large numbers of roles or users without creating many individual policies.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
        { cloud: "aws", topicId: "iam-deep-dive", title: "IAM Deep Dive" },
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 Fundamentals" },
      ],
      sections: [
        {
          heading: "Multi-Account Architecture with AWS Organizations",
          body: "Enterprise AWS deployments use a **multi-account strategy** to achieve strong blast-radius isolation, granular billing visibility, and independent security boundaries. AWS Organizations provides the hierarchical structure: a **management (root) account** contains **organizational units (OUs)** that group member accounts by business function, environment, or compliance requirement.\n\n**Service Control Policies (SCPs)** are the primary governance tool. They operate as permission guardrails — even an account root user cannot perform actions that an SCP denies. The two SCP strategies are: **allow-list** (start with a `FullAWSAccess` managed policy, then attach restrictive SCPs to OUs) and **deny-list** (attach a `FullAWSAccess` SCP, then add explicit denies). Deny-list is more common because it requires less ongoing maintenance as AWS releases new services.\n\n**AWS Control Tower** automates the landing zone: it creates the management account structure, enables CloudTrail and AWS Config in all regions, sets up centralized logging accounts, and deploys guardrails. The **Account Factory** (backed by Service Catalog) provisions new accounts with a consistent baseline, dramatically reducing the time to onboard a new team.",
          code: {
            lang: "json",
            label: "SCP: Restrict to approved regions only",
            snippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyNonApprovedRegions",
      "Effect": "Deny",
      "NotAction": [
        "cloudfront:*", "iam:*", "route53:*", "support:*",
        "sts:AssumeRole", "organizations:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": ["us-east-1", "eu-west-1"]
        }
      }
    }
  ]
}`,
          },
        },
        {
          heading: "Hybrid Connectivity: Direct Connect and Transit Gateway",
          body: "Large organizations connect on-premises environments to AWS using **AWS Direct Connect** for consistent, low-latency bandwidth, combined with **AWS Transit Gateway** (TGW) as a regional hub for thousands of VPCs.\n\nA **Direct Connect Gateway** (DXGW) allows a single Direct Connect connection to reach VPCs in multiple AWS regions through TGW attachments — eliminating the need for one Direct Connect per region. For redundancy, AWS recommends two Direct Connect connections from separate on-premises routers to separate Direct Connect locations, optionally backed by a Site-to-Site VPN as tertiary failover.\n\n**TGW route tables** enable sophisticated routing: you can isolate VPCs (e.g., prevent dev from reaching prod) by placing them in different route tables with selective route propagation. **AWS PrivateLink** complements this by allowing SaaS services or shared-services VPCs to expose individual endpoints without full VPC peering — traffic never crosses the public internet and the consumer VPC CIDR ranges need not be unique.",
        },
        {
          heading: "Identity Federation at Enterprise Scale",
          body: "**AWS IAM Identity Center** (formerly SSO) is the recommended solution for centralizing human identity access across all accounts in an AWS Organization. It integrates with external identity providers via **SAML 2.0** and **SCIM** (for automated user/group provisioning from Okta, Azure AD, or on-premises Active Directory).\n\n**Permission sets** in IAM Identity Center are reusable collections of IAM policies that are deployed as roles into each member account. A permission set called `ReadOnlyAccess` automatically creates an IAM role in every account it is assigned to, with a trust policy pointing back to IAM Identity Center.\n\n**ABAC (Attribute-Based Access Control)** scales identity management by tagging principals with attributes (e.g., `Department=Finance`) and writing IAM policies that reference `aws:PrincipalTag` conditions. This lets one policy rule govern access for an entire team without listing individual ARNs, making onboarding and offboarding trivial.",
        },
      ],
      quiz: [
        {
          id: "sap-d1-q1",
          question:
            "A large enterprise uses AWS Organizations with 200 accounts. The security team wants to prevent all member accounts from disabling AWS CloudTrail, even by account administrators. The management account must retain full control. Which approach achieves this with the LEAST operational overhead?",
          options: [
            "A) Create an IAM policy in each account that denies cloudtrail:StopLogging and cloudtrail:DeleteTrail, and attach it to all IAM users and roles.",
            "B) Attach an SCP to the root OU that denies cloudtrail:StopLogging and cloudtrail:DeleteTrail, exempting the management account.",
            "C) Use AWS Config with a managed rule to detect disabled CloudTrail and trigger an automatic remediation Lambda in each account.",
            "D) Deploy a CloudWatch Events rule in each account that re-enables CloudTrail whenever it is stopped.",
          ],
          correctIndex: 1,
          explanation:
            "An SCP attached to the root OU enforces the restriction across all 200 accounts without any per-account setup. SCPs apply to all principals in member accounts — even root users. The management account is never subject to SCPs, so it retains full control. Option A requires maintaining policies across 200 accounts. Options C and D are reactive, meaning CloudTrail can be briefly disabled before remediation fires.",
        },
        {
          id: "sap-d1-q2",
          question:
            "A company has a Direct Connect connection to us-east-1. They are expanding to eu-west-1 and ap-southeast-1 and want VPCs in all three regions to access the on-premises network without provisioning additional Direct Connect connections. Which architecture achieves this?",
          options: [
            "A) Peer the VPCs across regions and configure BGP routing through the existing Direct Connect.",
            "B) Attach a Direct Connect Gateway to a Transit Gateway in each region and associate the DXGW with all three Transit Gateways.",
            "C) Create Site-to-Site VPNs from the VPCs in eu-west-1 and ap-southeast-1 and route traffic to us-east-1 via VPC peering, then through Direct Connect.",
            "D) Deploy AWS Global Accelerator endpoints in each region to route traffic through the Direct Connect connection.",
          ],
          correctIndex: 1,
          explanation:
            "A Direct Connect Gateway (DXGW) can connect to Transit Gateways in multiple regions, allowing a single Direct Connect to reach VPCs globally. VPC peering (A) is not transitive and cannot bridge Direct Connect across regions. Option C creates a hairpin through us-east-1, adding latency and creating a single point of failure. Global Accelerator (D) is for internet traffic optimization, not Direct Connect routing.",
        },
        {
          id: "sap-d1-q3",
          question:
            "A company wants to allow a third-party auditor to access specific S3 buckets across 50 AWS accounts. The auditor uses their own AWS account. The solution must not require managing long-term credentials and must restrict access to only the designated buckets. Which approach is MOST secure and scalable?",
          options: [
            "A) Create an IAM user in each of the 50 accounts and share the access keys with the auditor.",
            "B) Make all required S3 buckets public and share the bucket URLs with the auditor.",
            "C) Create an IAM role in each of the 50 accounts with a trust policy for the auditor's account and a permission policy scoped to the specific S3 buckets. Use AWS Organizations to deploy the roles via CloudFormation StackSets.",
            "D) Use S3 presigned URLs generated for each object and batch-send them to the auditor daily.",
          ],
          correctIndex: 2,
          explanation:
            "Cross-account IAM roles with temporary credentials are the secure, scalable solution. CloudFormation StackSets with service-managed deployment deploys the role to all 50 accounts automatically with consistent configuration. IAM users (A) use long-term credentials and don't scale. Public buckets (B) expose data to everyone. Presigned URLs (D) are impractical for ongoing, multi-object access across 50 accounts.",
        },
        {
          id: "sap-d1-q4",
          question:
            "An organization is implementing ABAC for its AWS environment. Engineers are tagged with `Team=DataEngineering` in IAM Identity Center. They need S3 access only to buckets tagged `Team=DataEngineering`. Which IAM policy condition enables this without listing individual bucket ARNs?",
          options: [
            "A) `aws:ResourceTag/Team` equals `aws:PrincipalTag/Team`",
            "B) `s3:prefix` equals the principal's team name",
            "C) `aws:RequestTag/Team` equals `DataEngineering`",
            "D) `iam:ResourceTag/Team` equals `DataEngineering`",
          ],
          correctIndex: 0,
          explanation:
            "The condition `aws:ResourceTag/Team` equals `aws:PrincipalTag/Team` compares the resource tag to the caller's principal tag dynamically, allowing one policy to work for all teams. `s3:prefix` (B) is an S3-specific condition for key prefixes, not tags. `aws:RequestTag` (C) checks tags being applied in a request, not the existing resource tag. `iam:ResourceTag` (D) is for IAM resources, not S3.",
        },
        {
          id: "sap-d1-q5",
          question:
            "A company runs workloads in three AWS accounts: Production, Staging, and Shared Services. The Shared Services VPC hosts a central DNS resolver and internal tooling. All three VPCs must reach Shared Services, but Production and Staging must NOT be able to reach each other. How should Transit Gateway route tables be configured?",
          options: [
            "A) Create one route table for all three VPCs and use NACLs to block traffic between Production and Staging.",
            "B) Create two route tables: one that propagates all VPC routes (for Shared Services), and one that only propagates the Shared Services VPC route (for Production and Staging).",
            "C) Use VPC peering between each VPC and Shared Services, and do not peer Production to Staging.",
            "D) Enable blackhole routes in the default TGW route table for the Production and Staging CIDR blocks.",
          ],
          correctIndex: 1,
          explanation:
            "Separate TGW route tables achieve the isolation. The Shared Services attachment uses a route table with routes to all three VPCs (full mesh). Production and Staging attachments use a route table that only has a route to Shared Services — they cannot reach each other. Option A puts control in NACLs, which are harder to manage at scale. Option C with VPC peering works but doesn't scale and doesn't prevent Production-Staging communication through future peerings. Option D with blackhole routes is complex and fragile.",
        },
        {
          id: "sap-d1-q6",
          question:
            "A multinational company needs its 300 AWS accounts to have a consistent security baseline: CloudTrail in all regions, Security Hub enabled, and a specific Config recorder configuration. New accounts must receive this baseline automatically. Which solution requires the LEAST manual effort to maintain?",
          options: [
            "A) Use CloudFormation StackSets with self-managed permissions, targeting each account manually.",
            "B) Deploy AWS Control Tower with customizations (CfCT) that apply CloudFormation templates to new accounts via the Account Factory pipeline.",
            "C) Write a Lambda function triggered by Organizations account creation events that applies the baseline to each new account.",
            "D) Use AWS Systems Manager State Manager documents deployed across all accounts via the Automation runbook.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Control Tower with Customizations for Control Tower (CfCT) provides a fully automated pipeline: Account Factory provisions new accounts, and the CfCT pipeline automatically applies CloudFormation templates and SCPs. This requires zero manual intervention for new accounts. StackSets with self-managed permissions (A) require manually adding each account. Lambda (C) requires building and maintaining the automation. State Manager (D) is for OS-level configuration, not account-level AWS service configuration.",
        },
        {
          id: "sap-d1-q7",
          question:
            "A company uses AWS Cost Explorer and notices that Reserved Instance (RI) utilization is only 45% across the organization. They have purchased RIs in individual accounts. What structural change would MOST improve RI utilization?",
          options: [
            "A) Convert all Standard RIs to Convertible RIs so they can be exchanged for different instance types.",
            "B) Enable RI sharing at the AWS Organizations management account level so unused RIs in one account can be applied to matching usage in other accounts.",
            "C) Purchase additional RIs to increase the total pool and improve statistical coverage.",
            "D) Move all workloads to the account that owns the most RIs.",
          ],
          correctIndex: 1,
          explanation:
            "RI sharing (enabled via the management account's billing settings) allows unused reservations in any member account to automatically apply to eligible usage in other accounts within the organization. This is the most direct fix for low RI utilization without purchasing more or consolidating workloads. Converting to Convertible RIs (A) adds flexibility but doesn't fix utilization caused by fragmentation across accounts. Buying more RIs (C) worsens utilization. Consolidating workloads (D) is operationally disruptive and defeats the purpose of account isolation.",
        },
        {
          id: "sap-d1-q8",
          question:
            "A solutions architect is designing a hub-and-spoke network where 50 spoke VPCs must access a centralized egress point for outbound internet traffic, without allowing direct internet access from the spoke VPCs. What is the RECOMMENDED AWS architecture?",
          options: [
            "A) Deploy an internet gateway in every spoke VPC and use NACLs to restrict which subnets can use it.",
            "B) Create a centralized egress VPC with a NAT Gateway and internet gateway, attach all VPCs to a Transit Gateway, and configure spoke VPC route tables to send 0.0.0.0/0 through TGW to the egress VPC.",
            "C) Use AWS PrivateLink to route all spoke VPC outbound traffic through a central endpoint.",
            "D) Configure VPC peering from all 50 spoke VPCs directly to the egress VPC.",
          ],
          correctIndex: 1,
          explanation:
            "A centralized egress pattern with TGW is the AWS-recommended architecture for this use case. Spoke VPCs have no internet gateway; their default route points to TGW, which forwards to the egress VPC containing the NAT Gateway and internet gateway. This provides centralized traffic inspection, logging, and control. Option A gives every VPC direct internet access. PrivateLink (C) is for accessing specific AWS or customer services, not general outbound internet egress. VPC peering (D) doesn't scale — 50 peering connections from each VPC and peering is not transitive.",
        },
        {
          id: "sap-d1-q9",
          question:
            "An organization uses AWS IAM Identity Center with Okta as the external IdP. When an engineer leaves the company, their Okta account is deactivated. Which additional AWS configuration ensures the engineer's access is revoked within minutes across all 200 AWS accounts?",
          options: [
            "A) Manually delete the IAM roles in each AWS account that correspond to the engineer's permission sets.",
            "B) Enable SCIM provisioning from Okta to IAM Identity Center so user deactivations in Okta are automatically synchronized to IAM Identity Center.",
            "C) Set a short session duration (15 minutes) on all permission sets so credentials expire quickly.",
            "D) Configure CloudTrail to detect the engineer's API calls and trigger a Lambda function to deny all their requests.",
          ],
          correctIndex: 1,
          explanation:
            "SCIM (System for Cross-domain Identity Management) provisioning automatically synchronizes user lifecycle events from Okta to IAM Identity Center — deactivation in Okta propagates within minutes. Manual role deletion (A) requires touching 200 accounts. Short session duration (C) reduces the window but doesn't revoke existing sessions and doesn't scale as a security control. CloudTrail-based Lambda (D) is reactive, complex, and prone to race conditions.",
        },
        {
          id: "sap-d1-q10",
          question:
            "A company wants to share a centrally managed Amazon VPC subnet with multiple AWS accounts in its organization so that those accounts can launch resources directly into the subnet. Which AWS feature enables this?",
          options: [
            "A) VPC peering between the central account and each member account.",
            "B) AWS Transit Gateway attachments from each member account to the central VPC.",
            "C) AWS Resource Access Manager (RAM) to share the subnet from the central account to the member accounts.",
            "D) Creating a copy of the VPC in each member account using CloudFormation.",
          ],
          correctIndex: 2,
          explanation:
            "AWS RAM (Resource Access Manager) allows the VPC owner to share subnets with specific accounts or with the entire organization. Member accounts can then launch resources (EC2, RDS, etc.) directly into the shared subnet without needing their own VPC. VPC peering (A) connects separate VPCs but doesn't allow cross-account resource deployment into a shared subnet. Transit Gateway (B) also connects separate VPCs. Copying the VPC (D) defeats the purpose of sharing infrastructure.",
        },
        {
          id: "sap-d1-q11",
          question:
            "A company is evaluating whether to use Savings Plans or Reserved Instances for its mixed EC2 workload across multiple AWS regions and multiple instance families. The workload usage varies month-to-month. Which commitment type provides the MOST flexibility?",
          options: [
            "A) Standard Reserved Instances — they offer the highest discount and can be sold on the Reserved Instance Marketplace.",
            "B) Convertible Reserved Instances — they allow instance family and OS changes but are region-locked.",
            "C) Compute Savings Plans — they apply automatically to any EC2 usage, Fargate, and Lambda across all regions and instance families.",
            "D) EC2 Instance Savings Plans — they apply to a specific instance family in a specific region but offer a higher discount than Compute Savings Plans.",
          ],
          correctIndex: 2,
          explanation:
            "Compute Savings Plans offer the most flexibility: they automatically apply to any EC2 instance type, size, OS, tenancy, and region, as well as Fargate and Lambda. This is ideal for variable, mixed workloads. Standard RIs (A) are the least flexible — tied to specific instance type, region, and OS. Convertible RIs (B) allow more changes but are still region-locked. EC2 Instance Savings Plans (D) are more flexible than Standard RIs but still tied to a specific instance family and region.",
        },
        {
          id: "sap-d1-q12",
          question:
            "A security team is running AWS Config across 150 accounts and needs to view compliance results in a single dashboard. Which configuration achieves centralized visibility with the LEAST custom development?",
          options: [
            "A) Build a Lambda function in each account that exports Config compliance data to a central DynamoDB table.",
            "B) Configure an AWS Config aggregator in the management account to collect compliance data from all accounts and regions.",
            "C) Use AWS Systems Manager Explorer with a multi-account configuration to view Config data.",
            "D) Enable AWS Security Hub and configure a custom action that exports Config findings to a central S3 bucket.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Config aggregators collect compliance data from multiple accounts and regions into a single aggregator account, providing a unified view without custom code. The aggregator integrates natively with AWS Organizations so new accounts are picked up automatically. Lambda + DynamoDB (A) requires substantial custom development. Systems Manager Explorer (C) provides operational data, not Config compliance aggregation. Security Hub (D) aggregates security findings, not Config compliance rules.",
        },
        {
          id: "sap-d1-q13",
          question:
            "An architect is designing a Direct Connect solution for a company with strict requirement of no downtime. They have a single 1 Gbps dedicated Direct Connect connection. What is the MINIMUM change that achieves high availability?",
          options: [
            "A) Add a second 1 Gbps port on the same Direct Connect device at the same Direct Connect location.",
            "B) Provision a second dedicated Direct Connect connection at a DIFFERENT Direct Connect location, using BGP to fail over automatically.",
            "C) Enable Link Aggregation Group (LAG) on the existing connection to add redundant ports.",
            "D) Add a hosted Direct Connect connection at the same facility as the existing connection.",
          ],
          correctIndex: 1,
          explanation:
            "True HA requires two Direct Connect connections at geographically separate Direct Connect locations to eliminate single points of failure at both the device and facility level. A second port at the same location (A) protects against port failure but not facility outage. LAG (C) bonds multiple ports at the same location — still a single point of failure for the location. A hosted connection at the same facility (D) doesn't protect against facility-level outage.",
        },
        {
          id: "sap-d1-q14",
          question:
            "A company has a requirement that no AWS account in the organization can have a public S3 bucket. Existing accounts must be checked and new accounts must be blocked from the start. Which combination of controls achieves BOTH requirements?",
          options: [
            "A) An SCP that denies s3:PutBucketAcl and an AWS Config rule that checks S3 bucket public access settings.",
            "B) Enable S3 Block Public Access at the organization level via the S3 console, and configure an AWS Config rule to detect any non-compliant bucket and auto-remediate with SSM Automation.",
            "C) Write a Lambda function that runs nightly to check all buckets across all accounts and block any public bucket.",
            "D) Require all teams to use S3 bucket policies that explicitly deny public access.",
          ],
          correctIndex: 1,
          explanation:
            "S3 Block Public Access at the organization level (via the management account) is a preventive control applied to all accounts, including new ones provisioned in the future. The AWS Config rule with auto-remediation handles any existing non-compliant buckets. An SCP blocking PutBucketAcl (A) is partial — it doesn't cover bucket policies that grant public access. Lambda nightly (C) is not real-time. Bucket policies (D) are per-bucket and rely on teams to implement correctly.",
        },
        {
          id: "sap-d1-q15",
          question:
            "A global company needs to deploy identical infrastructure to 20 AWS regions, across 5 accounts, whenever a new application version is released. The infrastructure is defined in CloudFormation. The deployment must be orchestrated centrally. Which service meets this requirement?",
          options: [
            "A) AWS CodePipeline with a deploy action targeting each account-region combination sequentially.",
            "B) AWS CloudFormation StackSets with service-managed permissions and AWS Organizations integration.",
            "C) AWS Systems Manager Automation runbooks that call CloudFormation APIs in each account.",
            "D) A Jenkins CI/CD pipeline that uses assumed IAM roles to deploy CloudFormation stacks in each account.",
          ],
          correctIndex: 1,
          explanation:
            "CloudFormation StackSets with service-managed permissions is built specifically for this: it deploys stacks to multiple accounts and regions from a single operation, with automatic rollout controls (failure tolerance, concurrency). New accounts added to the OU can automatically receive the stack. CodePipeline (A) can work but requires per-account-region stages, creating enormous pipeline complexity. Systems Manager (C) and Jenkins (D) require significant custom orchestration code.",
        },
      ],
    },
    // ─── Domain 2: Design for New Solutions (29%) ──────────────────────
    {
      id: "domain-2",
      title: "Design for New Solutions",
      weight: "29%",
      order: 2,
      summary:
        "This domain—the highest-weighted at 29%—evaluates your ability to design complex, greenfield architectures that meet business and technical requirements. At the Professional level, this means going beyond picking the right service; you must evaluate multiple architecturally valid approaches and justify why one is superior given specific constraints.\n\nExpect long, multi-paragraph scenarios describing a business problem, and answer choices that are all technically feasible but differ in scalability, operational burden, cost, and resilience. Topics include **event-driven architectures**, **serverless design**, **data lake patterns**, **microservices**, **caching strategies**, **disaster recovery**, and **high-performance computing**.\n\nYou must be fluent in the **Well-Architected Framework** pillars and know how to apply them. The exam frequently tests trade-offs between **Active-Active vs. Active-Passive DR**, **RTO/RPO targets**, **fan-out messaging patterns**, and the right use of managed services over self-managed alternatives.",
      keyConceptsForExam: [
        "**Disaster recovery patterns** — Backup & Restore, Pilot Light, Warm Standby, Multi-Site Active-Active; RTO/RPO trade-offs and cost implications",
        "**Event-driven architecture** — `Amazon EventBridge` rules and event buses, `SNS` fan-out with `SQS` queues, `Kinesis Data Streams` for ordered, high-throughput events",
        "**Serverless architecture** — `Lambda` scaling, concurrency limits, provisioned concurrency for latency-sensitive workloads, Step Functions for orchestration",
        "**Caching strategies** — `ElastiCache` (Redis vs. Memcached), `DAX` for DynamoDB, `CloudFront` cache behaviors, cache invalidation patterns",
        "**Data lake design** — `S3` as raw/curated/enriched zones, `AWS Glue` for ETL and data catalog, `Athena` for query, `Lake Formation` for column-level security",
        "**Microservices patterns** — `API Gateway` + Lambda, `ECS`/`EKS` service mesh, `App Mesh`, service discovery, circuit breaker via `Application Load Balancer` health checks",
        "**High-performance computing** — `EC2` placement groups (cluster, spread, partition), `EFA` (Elastic Fabric Adapter), `AWS Batch` for job scheduling",
        "**Database selection** — RDS/Aurora for relational, DynamoDB for key-value/document, Redshift for analytical, Neptune for graph, ElastiSearch/OpenSearch for full-text search",
      ],
      examTips: [
        "When an RTO requirement is in seconds and RPO is near-zero, the answer is Multi-Site Active-Active. For hours-level RTO with minimal cost, it's Pilot Light. Memorize the four DR patterns and their cost/time trade-offs.",
        "Fan-out pattern: SNS topic distributes to multiple SQS queues. This decouples producers from consumers and allows each queue to have independent processing, retry, and DLQ configurations.",
        "For questions involving ordered, real-time streaming data that must be replayed, the answer involves Kinesis Data Streams (not SQS, which has no ordering guarantee outside of FIFO queues).",
        "DynamoDB Global Tables provide Active-Active multi-region replication with eventual consistency. If strong consistency is required, a single-region DynamoDB or Aurora Global Database (read from primary) is needed.",
        "Step Functions Standard workflows offer an audit trail and support long-running workflows (up to 1 year). Express workflows are higher throughput but don't provide execution history — choose based on audit requirements.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "lambda-in-depth", title: "Lambda In-Depth" },
        { cloud: "aws", topicId: "dynamodb-deep-dive", title: "DynamoDB Deep Dive" },
        { cloud: "aws", topicId: "rds-aurora", title: "RDS & Aurora" },
      ],
      sections: [
        {
          heading: "Disaster Recovery Architecture Patterns",
          body: "AWS supports four DR strategies that form a spectrum from lowest cost/highest RTO to highest cost/lowest RTO:\n\n**1. Backup & Restore**: Data is backed up to S3/Glacier. In a disaster, you restore from backup. RTO: hours. RPO: hours. Cost: lowest. Use for non-critical workloads.\n\n**2. Pilot Light**: A minimal version of the environment runs in the DR region (e.g., RDS replication running, AMIs ready, DNS not yet switched). Scale up and switch DNS in a disaster. RTO: 10s of minutes. RPO: minutes.\n\n**3. Warm Standby**: A fully functional but scaled-down version runs in the DR region. Switch traffic immediately. RTO: minutes. RPO: seconds.\n\n**4. Multi-Site Active-Active**: Full production capacity runs in both regions simultaneously. Route 53 with latency-based or weighted routing distributes traffic. RTO: seconds (automatic failover). RPO: near-zero. Cost: highest.\n\nFor database replication, **Aurora Global Database** supports a primary region and up to 5 secondary read regions with < 1 second replication lag. Promotion to a new primary takes under 1 minute — far faster than a Warm Standby RDS setup.",
          code: {
            lang: "yaml",
            label: "Route 53 health check for Active-Active failover",
            snippet: `# Health check for primary region endpoint
HealthCheck:
  Type: AWS::Route53::HealthCheck
  Properties:
    HealthCheckConfig:
      Type: HTTPS
      FullyQualifiedDomainName: api.us-east-1.example.com
      Port: 443
      RequestInterval: 10
      FailureThreshold: 2

# Latency-based routing record
PrimaryRecord:
  Type: AWS::Route53::RecordSet
  Properties:
    HealthCheckId: !Ref HealthCheck
    SetIdentifier: us-east-1
    Region: us-east-1
    Failover: PRIMARY`,
          },
        },
        {
          heading: "Event-Driven and Serverless Architecture",
          body: "Professional-level questions test your ability to design event-driven systems that handle **backpressure**, **ordering**, **deduplication**, and **fan-out** correctly.\n\n**Kinesis Data Streams** is preferred over SQS when: (1) ordering within a shard matters, (2) multiple consumer applications need to read the same data independently, or (3) you need to replay events. Each shard handles 1 MB/s write and 2 MB/s read. Use **Enhanced Fan-Out** for dedicated throughput per consumer (2 MB/s per consumer per shard).\n\n**SNS → SQS fan-out** decouples a single event from multiple independent processing pipelines. Each SQS queue has its own `VisibilityTimeout`, `MessageRetentionPeriod`, and Dead-Letter Queue — allowing different retry policies per consumer.\n\n**AWS Step Functions** orchestrates multi-step serverless workflows with built-in error handling, parallel branches, and wait states. Use **Standard** workflows for audit trails (max 1 year). Use **Express** workflows for high-volume, short-duration workflows (max 5 minutes, up to 100,000 executions/second).",
        },
        {
          heading: "Data Lake Architecture on AWS",
          body: "A modern data lake on AWS uses **Amazon S3** as the central storage layer, organized into zones: **raw** (ingested data as-is), **curated** (cleansed and standardized), and **enriched** (transformed for analytics).\n\n**AWS Glue** provides: a **Data Catalog** (central metadata repository compatible with Hive), **Glue ETL jobs** (Spark-based transformations), and **Glue DataBrew** (visual data preparation). The Glue Catalog integrates with Athena, Redshift Spectrum, and EMR.\n\n**AWS Lake Formation** adds a governance layer on top of S3 and the Glue Catalog. It provides **column-level and row-level security** via LF-Tags, eliminating the need to manage complex S3 bucket policies for data access control. Analysts query via **Athena** using standard SQL — Lake Formation intercepts and enforces permissions transparently.\n\nFor real-time ingestion, **Kinesis Data Firehose** delivers streaming data to S3 with optional Lambda transformation and Parquet/ORC format conversion — reducing query costs in Athena.",
        },
      ],
      quiz: [
        {
          id: "sap-d2-q1",
          question:
            "A financial services company has an RTO of 5 minutes and an RPO of 30 seconds for its core transaction database. The database is currently Amazon Aurora MySQL in us-east-1. Which architecture BEST meets these requirements?",
          options: [
            "A) Enable automated backups with 1-hour retention and restore from the latest snapshot in a disaster.",
            "B) Deploy an Aurora read replica in eu-west-1 and manually promote it when us-east-1 fails.",
            "C) Use Aurora Global Database with a secondary cluster in eu-west-1 configured for managed failover.",
            "D) Deploy Aurora in us-east-1 with Multi-AZ enabled; this satisfies both RTO and RPO requirements.",
          ],
          correctIndex: 2,
          explanation:
            "Aurora Global Database with managed failover achieves RPO < 1 second (cross-region replication lag) and RTO < 1 minute — both within the requirements. Backup & Restore (A) has RTO of hours. Manual promotion of a read replica (B) meets the RPO but the manual step means RTO exceeds 5 minutes. Multi-AZ Aurora (D) provides AZ-level HA within one region but doesn't protect against a regional failure.",
        },
        {
          id: "sap-d2-q2",
          question:
            "An e-commerce platform processes order events. Multiple downstream services (inventory, billing, shipping) must all process each order event independently, with different retry policies per service. Orders must be processed in the sequence they are created. Which architecture achieves this?",
          options: [
            "A) Publish events to a single SQS Standard queue; all services poll the same queue.",
            "B) Use an SNS topic with SQS FIFO queue subscriptions for each downstream service.",
            "C) Use Kinesis Data Streams with one shard per service, using the order ID as the partition key.",
            "D) Store events in DynamoDB Streams and trigger separate Lambda functions per service.",
          ],
          correctIndex: 1,
          explanation:
            "SNS fan-out to SQS FIFO queues: SNS delivers each event to all subscribed queues (fan-out), each queue preserves order (FIFO), and each service has its own queue with independent retry/DLQ configuration. A single SQS queue (A) can't fan-out — one consumer would consume the message preventing others from processing it. Kinesis with one shard per service (C) doesn't provide fan-out — each service would compete for records. DynamoDB Streams (D) has a 24-hour retention limit and limited fan-out capability.",
        },
        {
          id: "sap-d2-q3",
          question:
            "A media company runs a video transcoding pipeline that converts uploaded videos into 5 different resolutions. Each transcoding job takes 10-30 minutes. Jobs can be prioritized (standard or expedited). The system must handle bursts of 500 concurrent jobs. Which architecture is MOST appropriate?",
          options: [
            "A) Use EC2 Auto Scaling with SQS queues (one per priority level) to scale transcoding workers.",
            "B) Use AWS Lambda with a 15-minute timeout configured for each transcoding task.",
            "C) Use AWS Fargate tasks triggered by EventBridge Scheduler at 5-minute intervals.",
            "D) Use AWS Step Functions Express Workflow to orchestrate the transcoding across Lambda functions.",
          ],
          correctIndex: 0,
          explanation:
            "EC2 Auto Scaling driven by SQS queue depth metrics handles long-running (10-30 min) jobs that exceed Lambda's 15-minute limit. Separate queues per priority allow workers to preferentially drain the expedited queue first. Lambda (B) cannot run jobs longer than 15 minutes. Fargate triggered on a schedule (C) doesn't respond to job arrival bursts. Step Functions Express Workflows (D) max out at 5 minutes per execution and are not designed for compute-intensive long-running tasks.",
        },
        {
          id: "sap-d2-q4",
          question:
            "A company wants to implement a data lake on AWS. Raw data from 20 sources is ingested into S3. Data analysts use Athena for ad-hoc queries. The security team requires that analysts can only see data relevant to their department, including column-level restrictions on sensitive fields. Which governance approach meets this requirement with the LEAST operational overhead?",
          options: [
            "A) Create separate S3 buckets per department with IAM policies restricting access by department.",
            "B) Use AWS Lake Formation with LF-Tags to define column-level and row-level access policies centrally.",
            "C) Configure S3 bucket policies with condition keys referencing the analyst's IAM tags.",
            "D) Create Athena workgroups per department and use encrypted query results stored in separate buckets.",
          ],
          correctIndex: 1,
          explanation:
            "Lake Formation provides centralized, fine-grained access control including column-level security through LF-Tags, applied transparently when analysts use Athena. It requires no changes to the S3 bucket policy structure and scales across hundreds of tables. Separate S3 buckets per department (A) is operationally complex — each new dataset requires new bucket policies. S3 bucket policies with IAM tags (C) work for object-level but not column-level restrictions. Athena workgroups (D) isolate query costs but don't enforce data access restrictions.",
        },
        {
          id: "sap-d2-q5",
          question:
            "A startup is building a global API with users in North America, Europe, and Asia. The API calls a Lambda function that queries a DynamoDB table. The primary requirement is the lowest possible read latency globally. Writes are infrequent. Which architecture achieves this?",
          options: [
            "A) Deploy Lambda and DynamoDB in us-east-1. Use CloudFront to cache API responses at edge locations.",
            "B) Enable DynamoDB Global Tables in all three regions. Deploy Lambda in each region. Use Route 53 latency-based routing to the nearest regional API Gateway.",
            "C) Deploy Lambda and DynamoDB in us-east-1. Use API Gateway edge-optimized endpoints.",
            "D) Use DynamoDB Accelerator (DAX) in us-east-1 to cache reads, and CloudFront for the API layer.",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB Global Tables with regional Lambda deployments and Route 53 latency routing delivers the lowest read latency: users hit the nearest region where DynamoDB provides single-digit millisecond reads. CloudFront caching (A) works for cacheable responses but introduces cache staleness challenges and doesn't help with non-cacheable reads. Edge-optimized API Gateway (C) optimizes the API routing but the database is still in us-east-1 — Asia and Europe users still have high database latency. DAX in us-east-1 (D) improves cache hits in us-east-1 but doesn't reduce cross-region latency.",
        },
        {
          id: "sap-d2-q6",
          question:
            "A company runs a microservices application on Amazon ECS. One service experiences intermittent failures, causing cascading failures in dependent services because they keep sending requests to the failing service. Which pattern resolves this with the LEAST code changes?",
          options: [
            "A) Implement exponential backoff and jitter in all calling services.",
            "B) Place an Application Load Balancer in front of the failing service with a custom error page.",
            "C) Use AWS App Mesh with a circuit breaker policy configured on the virtual node for the failing service.",
            "D) Deploy Amazon API Gateway in front of every microservice with throttling limits.",
          ],
          correctIndex: 2,
          explanation:
            "AWS App Mesh with circuit breaker (outlier detection) is a service-mesh-level control that requires no code changes in the application — it's configured at the infrastructure level. When App Mesh detects a service is failing (based on consecutive 5xx errors), it temporarily removes it from the load-balancing pool. Exponential backoff (A) reduces the rate of failed calls but doesn't stop calling a known-bad service. An ALB error page (B) doesn't prevent the cascade. API Gateway throttling (D) controls inbound rate but doesn't implement circuit breaker behavior.",
        },
        {
          id: "sap-d2-q7",
          question:
            "A high-performance computing (HPC) workload runs MPI-based simulations requiring nodes to communicate with each other at extremely low latency and high bandwidth. Which EC2 configuration provides the BEST inter-node network performance?",
          options: [
            "A) C5n instances in a spread placement group with enhanced networking enabled.",
            "B) Hpc6a instances in a cluster placement group with Elastic Fabric Adapter (EFA) enabled.",
            "C) R6i instances with SR-IOV and jumbo frames configured across multiple Availability Zones.",
            "D) M6i instances in a partition placement group with 25 Gbps networking.",
          ],
          correctIndex: 1,
          explanation:
            "EFA (Elastic Fabric Adapter) provides OS-bypass networking for MPI workloads, enabling direct hardware-level communication that achieves microsecond latency — required for tightly-coupled HPC simulations. Cluster placement groups place instances physically close together in the same AZ, maximizing bandwidth. Spread placement groups (A) distribute instances across hardware — the opposite of what HPC needs. Standard SR-IOV across multiple AZs (C) has higher latency than intra-AZ EFA. M6i with partition placement (D) is designed for distributed applications needing fault isolation, not HPC communication.",
        },
        {
          id: "sap-d2-q8",
          question:
            "A company needs to process 1 million IoT sensor readings per minute. Each reading is 1 KB. Downstream, three different analytics applications need to independently process the stream. Data must be available for reprocessing for 7 days. Which ingestion architecture meets these requirements?",
          options: [
            "A) Ingest into SQS and have three consumers poll the queue. Increase message retention to 7 days.",
            "B) Ingest into Kinesis Data Streams with sufficient shards and 7-day retention. Three consumers use Enhanced Fan-Out for dedicated throughput.",
            "C) Ingest into SNS and subscribe three SQS queues. Set SQS retention to 7 days.",
            "D) Write directly to S3 using Kinesis Firehose and trigger three Lambda functions via S3 event notifications.",
          ],
          correctIndex: 1,
          explanation:
            "1 million readings/minute × 1 KB = ~16.7 MB/s ingestion. Kinesis Data Streams with enough shards (each handles 1 MB/s write) handles this throughput. 7-day retention allows replay. Enhanced Fan-Out gives each of the three consumers a dedicated 2 MB/s per shard — preventing consumers from competing for bandwidth. SQS (A) doesn't support fan-out from a single queue. SNS → SQS (C) supports fan-out but SQS max retention is 14 days and this pattern doesn't support replay — once a message is consumed from SQS, it's gone. Firehose to S3 (D) adds minutes of latency (buffering interval) which may not satisfy real-time processing needs.",
        },
        {
          id: "sap-d2-q9",
          question:
            "A company's DynamoDB table has a single partition key of `userId`. An analytics team needs to run queries that filter by `country` and `signupDate`, which are attributes in the item. How should this be designed to support efficient queries without creating a hot partition?",
          options: [
            "A) Perform a DynamoDB Scan with a FilterExpression on `country` and `signupDate`.",
            "B) Create a Global Secondary Index (GSI) with `country` as the partition key and `signupDate` as the sort key.",
            "C) Create a Local Secondary Index (LSI) with `signupDate` as the sort key.",
            "D) Export the DynamoDB table to S3 daily and query with Athena.",
          ],
          correctIndex: 1,
          explanation:
            "A GSI with `country` as the partition key and `signupDate` as the sort key allows efficient queries like 'all users from UK who signed up in the last 30 days.' If `country` has too few distinct values (hot partition), consider a write-sharding strategy by appending a suffix. A Scan (A) reads the entire table — extremely expensive at scale. An LSI (C) must share the same partition key as the base table (`userId`), so it can't partition by `country`. Daily Athena exports (D) add operational complexity and don't support real-time queries.",
        },
        {
          id: "sap-d2-q10",
          question:
            "A company runs a multi-step order processing workflow using AWS Lambda functions. Each step must complete before the next starts, the workflow can take up to 24 hours (e.g., waiting for supplier confirmation), and every state transition must be auditable. Which orchestration approach is CORRECT?",
          options: [
            "A) Use SQS queues to chain Lambda functions; each function sends a message to the next queue when done.",
            "B) Use Step Functions Express Workflows with a callback pattern for the long-running steps.",
            "C) Use Step Functions Standard Workflows with `waitForTaskToken` for steps that require external callbacks.",
            "D) Use Amazon EventBridge Pipes to connect Lambda functions in sequence.",
          ],
          correctIndex: 2,
          explanation:
            "Step Functions Standard Workflows: (1) can run for up to 1 year, (2) support `waitForTaskToken` which pauses execution until an external system calls `SendTaskSuccess` — perfect for waiting for supplier confirmation, and (3) provide a full execution history for audit. Express Workflows (B) max out at 5 minutes — far too short for a 24-hour workflow. SQS chaining (A) doesn't provide a visual workflow, has no built-in timeout, and creates complex retry logic. EventBridge Pipes (D) connect event sources to targets but don't support long-running stateful workflows.",
        },
        {
          id: "sap-d2-q11",
          question:
            "A company wants to offer private API access to its services to other AWS customers (B2B SaaS). The customers' applications run in their own VPCs. The solution must not require VPC peering or sharing credentials. Which AWS feature enables this?",
          options: [
            "A) VPC peering between the SaaS provider VPC and each customer VPC.",
            "B) AWS PrivateLink: create a VPC endpoint service (NLB-backed) in the provider account; customers create Interface VPC Endpoints in their VPCs.",
            "C) Create an API Gateway with a private endpoint type and share the ARN with customers.",
            "D) Deploy a transit Gateway and invite customers to attach their VPCs to it.",
          ],
          correctIndex: 1,
          explanation:
            "AWS PrivateLink (VPC endpoint services) is the canonical solution for B2B SaaS on AWS. The provider exposes a service behind an NLB; customers create an Interface VPC Endpoint in their own VPC. Traffic never leaves AWS's network, no CIDR conflicts, no peering needed, and no credentials are shared. VPC peering (A) requires non-overlapping CIDRs and doesn't scale to many customers. Private API Gateway (C) requires customers to configure a VPC endpoint but is more complex to manage at scale. Transit Gateway (D) connects VPCs at the network level — overkill and requires BGP/routing coordination.",
        },
        {
          id: "sap-d2-q12",
          question:
            "A company is designing a read-heavy application on Amazon Aurora MySQL. The primary instance is at 85% CPU during peak load. Which approach BEST improves performance with the LEAST disruption?",
          options: [
            "A) Upgrade the primary instance to a larger instance class to handle more reads.",
            "B) Add Aurora read replicas and update the application to send read queries to the reader endpoint.",
            "C) Enable Aurora Auto Scaling for read replicas and configure the application to use the reader endpoint.",
            "D) Migrate to a Multi-AZ RDS deployment to distribute read load across the standby.",
          ],
          correctIndex: 2,
          explanation:
            "Aurora Auto Scaling automatically adds and removes read replicas based on CPU or connection metrics. The Aurora reader endpoint load-balances connections across all read replicas. This scales horizontally with no application downtime. Adding a fixed number of read replicas (B) is correct in concept but doesn't auto-scale for variable load. Upgrading the primary (A) scales vertically but is disruptive (requires a failover restart) and doesn't scale horizontally. RDS Multi-AZ standby (D) is for HA, not read scaling — the standby does not accept read traffic.",
        },
        {
          id: "sap-d2-q13",
          question:
            "A company processes millions of transactions daily. Each transaction record is 4 KB. The transactions must be queryable for 7 years for regulatory compliance. Queries are date-range based, infrequent, and acceptable to take several seconds. Which storage strategy is MOST cost-effective?",
          options: [
            "A) Store all transactions in DynamoDB with TTL disabled.",
            "B) Store transactions in RDS Aurora; use snapshots for long-term retention.",
            "C) Write transactions to S3 in Parquet format partitioned by date. Use S3 Intelligent-Tiering and query with Athena.",
            "D) Store transactions in Redshift and use Redshift Spectrum for queries older than 1 year.",
          ],
          correctIndex: 2,
          explanation:
            "S3 with Parquet + Athena is highly cost-effective for this pattern: Parquet columnar format dramatically reduces query data scanned (lowering Athena costs), date partitioning speeds up date-range queries, and S3 Intelligent-Tiering automatically moves infrequently accessed data to cheaper tiers (including Glacier for 7-year retention). DynamoDB (A) is expensive at millions of 4 KB records and is not optimized for range scans. Aurora snapshots (B) require restoration to query older data. Redshift (D) is a powerful analytics database but far more expensive than S3+Athena for infrequently queried archival data.",
        },
        {
          id: "sap-d2-q14",
          question:
            "A company deploys a new feature but needs to test it with only 5% of production traffic while the remaining 95% use the existing version. Both versions must be able to roll back instantly. Which approach achieves this with the LEAST infrastructure duplication?",
          options: [
            "A) Use Route 53 weighted routing with two separate ALBs and two separate Auto Scaling groups.",
            "B) Use an Application Load Balancer with two target groups and configure weighted target group routing (5% new, 95% old).",
            "C) Deploy two separate ECS services and use a CloudFront distribution to split traffic by percentage.",
            "D) Use AWS CodeDeploy Blue/Green deployment with a 5% traffic shift configured.",
          ],
          correctIndex: 1,
          explanation:
            "ALB weighted target groups allow traffic splitting at the load balancer level with a single ALB — no duplicate infrastructure. Adjusting the weights is instant (no DNS TTL delay) and the rollback is simply changing the weight back to 100% old. Route 53 weighted routing (A) works but has DNS TTL propagation delay (not 'instant' rollback). CloudFront + two services (C) adds unnecessary complexity and CDN caching can prevent immediate traffic split accuracy. CodeDeploy Blue/Green (D) works but requires DNS or load balancer switching, not a simple weight adjustment.",
        },
        {
          id: "sap-d2-q15",
          question:
            "A company runs a machine learning training pipeline on EC2 GPU instances (p3.16xlarge). Training jobs run for 4-8 hours and are fault-tolerant (checkpoints saved to S3 every 30 minutes). Cost optimization is the primary concern. Which purchasing strategy MOST reduces cost?",
          options: [
            "A) Purchase Reserved Instances for the p3.16xlarge instance type.",
            "B) Use EC2 Spot Instances with a Spot Fleet configured to use multiple instance types and Availability Zones, with checkpoint-based fault tolerance.",
            "C) Use On-Demand instances and stop them manually when training completes.",
            "D) Use EC2 Savings Plans covering p3.16xlarge in the specific region.",
          ],
          correctIndex: 1,
          explanation:
            "Spot Instances for fault-tolerant, checkpoint-based ML training is a well-established cost optimization: Spot can save 70-90% vs. On-Demand. Checkpointing every 30 minutes means at most 30 minutes of work is lost if interrupted. A Spot Fleet with multiple instance types and AZs reduces interruption probability. Reserved Instances (A) and Savings Plans (D) reduce cost (up to 72%) but still cost more than Spot and require 1-3 year commitments. On-Demand manual stop (C) is the most expensive option with no automation.",
        },
      ],
    },
    // ─── Domain 3: Continuous Improvement for Existing Solutions (25%) ─
    {
      id: "domain-3",
      title: "Continuous Improvement for Existing Solutions",
      weight: "25%",
      order: 3,
      summary:
        "This domain tests your ability to evaluate an existing architecture and improve it incrementally. Unlike design-from-scratch questions, these scenarios present a running system with a specific problem — high cost, operational burden, performance bottleneck, or reliability issue — and ask what change would most improve the situation.\n\nKey themes include **Well-Architected Framework reviews**, **cost optimization**, **operational excellence** (automation, observability, runbook elimination), **reliability improvements** (fault tolerance, self-healing), and **performance tuning** (scaling, caching, query optimization). You must be comfortable reading architecture diagrams and identifying the specific single point of failure or inefficiency.\n\nProfessional-level questions in this domain often present solutions that are all correct but differ in how much they improve the situation. You must identify the answer that provides the **greatest improvement per unit of operational complexity added**.",
      keyConceptsForExam: [
        "**Well-Architected tool** — workload reviews, improvement plans, high-risk issues (HRIs) vs. medium-risk issues (MRIs)",
        "**Cost optimization** — right-sizing with Compute Optimizer, eliminating idle resources, S3 storage class analysis, Trusted Advisor recommendations",
        "**Operational excellence** — replacing manual runbooks with SSM Automation, self-healing with Auto Scaling lifecycle hooks, centralized observability with CloudWatch Container Insights",
        "**Reliability** — eliminating single points of failure, increasing fault tolerance, chaos engineering, adding health checks and automatic failover",
        "**Performance improvement** — query optimization, read replicas, ElastiCache, CloudFront, S3 Transfer Acceleration, Global Accelerator",
        "**Observability** — CloudWatch Logs Insights, X-Ray distributed tracing, Contributor Insights, anomaly detection on metrics",
        "**Database optimization** — Aurora Serverless for variable workloads, DynamoDB auto-scaling, RDS Proxy for connection pooling",
        "**Security posture improvement** — enabling AWS Security Hub, GuardDuty, Macie for S3 data classification, Inspector v2 for container scanning",
      ],
      examTips: [
        "When a scenario says 'the operations team spends hours running manual runbooks during incidents,' the answer almost always involves AWS Systems Manager Automation or EventBridge-triggered Lambda for auto-remediation.",
        "RDS Proxy is the answer for Lambda functions that open too many database connections — Lambda scales to thousands of concurrent executions, each opening a DB connection, which exhausts RDS connection limits.",
        "AWS Compute Optimizer recommends right-sizing for EC2, Lambda, ECS, and EBS volumes based on actual CloudWatch utilization data — use it when 'over-provisioned' or 'right-sizing' is mentioned.",
        "AWS Trusted Advisor and AWS Cost Explorer's cost recommendations are useful but Compute Optimizer provides more granular, machine-learning-based recommendations for individual resources.",
        "For improving observability on a distributed application, the answer is AWS X-Ray for distributed tracing combined with CloudWatch ServiceLens — it correlates traces, metrics, and logs in one view.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "cloudwatch-deep-dive", title: "CloudWatch Deep Dive" },
        { cloud: "aws", topicId: "rds-aurora", title: "RDS & Aurora" },
        { cloud: "aws", topicId: "s3-deep-dive", title: "S3 Deep Dive" },
      ],
      sections: [
        {
          heading: "Operational Excellence: Automation and Self-Healing",
          body: "The Well-Architected Operational Excellence pillar prioritizes **automating responses to operational events** over manual intervention. Key patterns:\n\n**AWS Systems Manager Automation** runs multi-step runbooks (defined in YAML/JSON) that can reboot instances, create snapshots, update AMIs, or call APIs — triggered by EventBridge, CloudWatch alarms, or on a schedule. This replaces manual runbooks and eliminates human error during incidents.\n\n**Auto Scaling lifecycle hooks** allow custom actions when instances launch or terminate. Use `EC2_INSTANCE_LAUNCHING` hooks to run configuration scripts and wait for them to complete before the instance receives traffic. Use `EC2_INSTANCE_TERMINATING` hooks to drain connections and back up state before the instance is terminated.\n\n**AWS Systems Manager Session Manager** eliminates bastion hosts — it provides browser-based shell access to EC2 instances via the SSM Agent without opening port 22 or managing SSH keys. This reduces the attack surface and eliminates the operational overhead of bastion host patching.",
          code: {
            lang: "yaml",
            label: "SSM Automation: Restart EC2 and verify health",
            snippet: `description: Safely restart an EC2 instance and verify health
schemaVersion: "0.3"
parameters:
  InstanceId:
    type: String
mainSteps:
  - name: StopInstance
    action: aws:changeInstanceState
    inputs:
      InstanceIds: ["{{ InstanceId }}"]
      DesiredState: stopped
  - name: StartInstance
    action: aws:changeInstanceState
    inputs:
      InstanceIds: ["{{ InstanceId }}"]
      DesiredState: running
  - name: WaitForSSM
    action: aws:waitForAwsResourceProperty
    inputs:
      Service: ssm
      Api: DescribeInstanceInformation
      PropertySelector: "$.InstanceInformationList[0].PingStatus"
      DesiredValues: ["Online"]`,
          },
        },
        {
          heading: "Cost Optimization Strategies",
          body: "Cost optimization at the Professional level requires combining multiple signals and tools:\n\n**AWS Compute Optimizer** analyzes CloudWatch metrics and recommends right-sizing for EC2 instances, Lambda memory settings, ECS on Fargate task sizing, and EBS volume types. It identifies over-provisioned resources that are common after initial deployments.\n\n**S3 Storage Class Analysis** monitors S3 object access patterns and identifies objects that haven't been accessed for 30+ days — recommending a lifecycle policy to move them to S3-Infrequent Access or Glacier. A single lifecycle policy with transition rules can dramatically reduce S3 costs for large buckets.\n\n**AWS Cost Anomaly Detection** uses machine learning to identify unusual spending patterns and alerts via SNS — catching runaway costs from misconfigured autoscaling or forgotten resources before they appear on the monthly bill.\n\nFor database costs: **Aurora Serverless v2** scales capacity in fine-grained increments (0.5 ACU steps) and can scale to zero when idle, making it cost-effective for development environments or variable-traffic applications. For intermittently accessed databases, this can reduce costs by 80% vs. a fixed-capacity instance.",
        },
        {
          heading: "Improving Reliability: Eliminating Single Points of Failure",
          body: "A Professional-level architect must be able to read an architecture and identify hidden SPOFs:\n\n- **Single-AZ resources**: RDS without Multi-AZ, ElastiCache without replication, EC2 without ASG — all are SPOFs.\n- **NAT Gateway**: A single NAT Gateway is a regional SPOF — deploy one per AZ.\n- **Bastion hosts**: A single bastion host blocks SSH access if it fails — replace with SSM Session Manager.\n- **Single Direct Connect**: A single physical connection is a SPOF — add a second connection at a different location.\n\n**Health checks** are a critical reliability mechanism. ALB health checks automatically deregister unhealthy instances. Route 53 health checks trigger DNS failover. CloudWatch alarms can trigger Auto Scaling policies to replace failed instances.\n\n**Chaos engineering** (using AWS Fault Injection Service) proactively tests fault tolerance by injecting failures (terminating instances, injecting API errors, degrading network) in a controlled way — validating that the system actually recovers as designed.",
        },
      ],
      quiz: [
        {
          id: "sap-d3-q1",
          question:
            "A company runs a Lambda-based API that queries an Amazon RDS PostgreSQL database. As Lambda concurrency increases during peak hours, the database reports 'too many connections' errors and becomes unresponsive. What is the MOST effective solution?",
          options: [
            "A) Increase the RDS instance class to a larger size with more available connections.",
            "B) Configure Lambda Reserved Concurrency to limit the number of simultaneous Lambda executions.",
            "C) Place Amazon RDS Proxy between Lambda and RDS to pool and reuse database connections.",
            "D) Convert the Lambda function to an ECS service with a fixed number of tasks to control connection counts.",
          ],
          correctIndex: 2,
          explanation:
            "RDS Proxy maintains a warm connection pool to RDS and multiplexes thousands of Lambda connections into a small number of database connections — resolving the 'too many connections' issue without limiting Lambda concurrency or changing the database size. Increasing the RDS instance class (A) raises the connection limit slightly but doesn't solve the fundamental mismatch between serverless concurrency and database connections. Reserved concurrency (B) solves the symptom by throttling Lambda, degrading API performance. Migrating to ECS (D) eliminates the serverless benefits and adds operational overhead.",
        },
        {
          id: "sap-d3-q2",
          question:
            "An engineering team notices that their Auto Scaling group frequently launches instances that fail application health checks 5 minutes after launch. The instance is terminated by the ASG and replaced, but the new instance also fails. Which investigation step should the architect recommend FIRST?",
          options: [
            "A) Increase the ALB health check interval to 5 minutes to give instances more time to start.",
            "B) Review CloudWatch Logs and EC2 System Logs for the failing instances during the boot phase to identify the root cause.",
            "C) Increase the instance type to a larger size to give the application more resources.",
            "D) Enable detailed monitoring on the Auto Scaling group to get more granular metrics.",
          ],
          correctIndex: 1,
          explanation:
            "Investigating CloudWatch Logs and EC2 system logs identifies the root cause — a configuration error, failed dependency, or startup script failure. The cycle of launch → fail → terminate → repeat suggests the issue is systematic, not capacity-related. Increasing the health check interval (A) masks the problem by allowing a longer window before detection. Upsizing the instance (C) may not help if the failure is a missing dependency. Detailed monitoring (D) provides metrics but doesn't diagnose application-level failures.",
        },
        {
          id: "sap-d3-q3",
          question:
            "A company's S3 buckets contain 500 TB of data. Analysis shows that 70% of objects have not been accessed in over 90 days. The company pays for S3 Standard storage. Which change MOST reduces storage costs with the LEAST operational overhead?",
          options: [
            "A) Manually identify infrequently accessed objects and move them to S3 Glacier using the CLI.",
            "B) Enable S3 Intelligent-Tiering on the entire bucket — it automatically moves objects between tiers based on access patterns.",
            "C) Configure an S3 lifecycle policy to transition objects to S3 Standard-IA after 30 days and S3 Glacier Instant Retrieval after 90 days.",
            "D) Configure S3 Replication to copy objects to a cheaper storage account.",
          ],
          correctIndex: 2,
          explanation:
            "A lifecycle policy with explicit transitions to S3-IA at 30 days and Glacier at 90 days provides the greatest cost reduction for a known access pattern (70% not accessed in 90 days). S3 Glacier is ~80% cheaper than Standard. Intelligent-Tiering (B) is excellent for unknown patterns but incurs a per-object monitoring fee (~$0.0025/1000 objects) and doesn't move objects to Glacier — only to Standard-IA and Archive tiers (which require opt-in). Manual CLI operations (A) are not scalable for 500 TB. S3 Replication (D) copies data, doubling storage costs.",
        },
        {
          id: "sap-d3-q4",
          question:
            "A company's microservices application running on ECS experiences intermittent latency spikes that are hard to diagnose because logs from individual services show no errors. Which observability improvement would MOST help diagnose the root cause?",
          options: [
            "A) Enable VPC Flow Logs and analyze network traffic patterns.",
            "B) Enable AWS X-Ray tracing across all ECS services and use CloudWatch ServiceLens to correlate traces with metrics and logs.",
            "C) Increase CloudWatch Log retention to 1 year to have more historical data.",
            "D) Deploy a synthetic monitoring canary using CloudWatch Synthetics to measure end-to-end response time.",
          ],
          correctIndex: 1,
          explanation:
            "AWS X-Ray distributed tracing follows requests across all service boundaries, making it possible to identify which service or external dependency introduces latency — even when individual service logs show no errors. ServiceLens correlates traces, metrics, and logs in a single view. VPC Flow Logs (A) show network connectivity, not application latency. Longer log retention (C) doesn't help diagnose a current issue. Synthetic monitoring (D) detects that latency exists but doesn't identify which service is responsible.",
        },
        {
          id: "sap-d3-q5",
          question:
            "An operations team manages 500 EC2 instances across 10 AWS accounts. When a critical CVE is announced, they must patch all instances within 24 hours. Currently, they SSH into each instance manually. Which AWS service should replace this process?",
          options: [
            "A) AWS OpsWorks Stacks with Chef recipes for patch management.",
            "B) AWS Systems Manager Patch Manager with a maintenance window and patch baseline, using Resource Data Sync to aggregate compliance across accounts.",
            "C) AWS Inspector v2 to scan instances and provide a patching report.",
            "D) CloudFormation StackSets to deploy a patch script as a UserData update to all instances.",
          ],
          correctIndex: 1,
          explanation:
            "SSM Patch Manager applies patches to all managed instances across accounts using maintenance windows, with a patch baseline defining which patches are approved. Resource Data Sync aggregates patch compliance data from all accounts into a central S3 bucket/dashboard. No SSH access required. OpsWorks (A) works but is more complex and legacy. Inspector (C) identifies vulnerabilities but doesn't patch — it's a detection tool. CloudFormation UserData updates (D) require instance replacement to apply, not in-place patching, which is disruptive.",
        },
        {
          id: "sap-d3-q6",
          question:
            "A company uses Amazon CloudFront to serve a web application. An analysis of CloudFront access logs reveals that 60% of cache misses are for the same set of 20 URLs (homepage, product listing pages) that change only once per day. What change MOST reduces origin load?",
          options: [
            "A) Enable CloudFront origin shield to add a caching layer between edge locations and the origin.",
            "B) Implement Lambda@Edge to cache responses in DynamoDB and serve them from the nearest region.",
            "C) Increase the CloudFront TTL for those specific cache behaviors to 24 hours and implement cache invalidation on content updates.",
            "D) Move the origin to a multi-region active-active setup to distribute origin requests.",
          ],
          correctIndex: 2,
          explanation:
            "Increasing TTL to 24 hours for those 20 URLs means CloudFront serves them from cache for the full day, reducing origin requests for those paths to near-zero. Cache invalidation ensures staleness when content actually changes. This is the most direct fix: the problem is that TTL is too short for content that changes once daily. Origin Shield (A) helps reduce cache misses across edge POPs but doesn't fix the fundamental issue of too-short TTL. Lambda@Edge caching to DynamoDB (B) adds complexity without addressing the root cause. Multi-region origin (D) distributes origin load but doesn't reduce cache misses.",
        },
        {
          id: "sap-d3-q7",
          question:
            "A company runs Amazon Redshift for analytics. The cluster is idle 14 hours per day (nights and weekends) but remains running at full cost. Queries during business hours require maximum performance. Which change reduces costs while maintaining daytime performance?",
          options: [
            "A) Use Redshift Serverless instead of a provisioned cluster — it scales to zero when idle.",
            "B) Schedule a Lambda function to pause the Redshift cluster at night and resume it in the morning using the Redshift API.",
            "C) Enable Redshift Auto Scaling to automatically reduce node count when utilization drops.",
            "D) Migrate the analytics workload to Athena, which charges only for queries run.",
          ],
          correctIndex: 1,
          explanation:
            "Scheduled pause/resume of a provisioned Redshift cluster using the Redshift API (or Redshift's built-in scheduler) stops billing for the 14 idle hours while preserving the cluster configuration and data. Redshift Serverless (A) is an excellent option but the question specifies that daytime queries require maximum (provisioned) performance — Serverless may not match the performance of a tuned provisioned cluster with specific node types. Redshift Auto Scaling (C) adjusts concurrency scaling but doesn't reduce cost for idle periods. Migrating to Athena (D) is a significant architectural change with different performance characteristics.",
        },
        {
          id: "sap-d3-q8",
          question:
            "A company's application uses Amazon SQS as a buffer between a producer service and a consumer service running on EC2. During sudden traffic spikes, the SQS queue depth grows to millions of messages. The consumer Auto Scaling group takes 10 minutes to scale out. Which combination of changes MOST reduces message processing lag?",
          options: [
            "A) Switch from SQS Standard to FIFO queues and increase the consumer's batch size.",
            "B) Pre-scale the consumer ASG proactively using a scheduled scaling action, and configure a CloudWatch alarm on queue depth to trigger ASG scale-out.",
            "C) Increase the SQS message retention period to ensure messages aren't lost during slow processing.",
            "D) Deploy the consumer as a Lambda function triggered by SQS — Lambda scales instantly to process messages.",
          ],
          correctIndex: 3,
          explanation:
            "Lambda triggered by SQS scales from 0 to thousands of concurrent executions in seconds (limited by Lambda concurrency limits), eliminating the 10-minute ASG scale-out delay. If the consumer processing logic is compatible with Lambda's 15-minute timeout, this is the most effective change. Pre-scaling (B) helps for predictable traffic but doesn't handle unexpected spikes. FIFO queues (A) reduce throughput (3,000 messages/second vs. nearly unlimited for Standard) — the wrong direction for a throughput problem. Increasing retention (C) prevents message loss but doesn't reduce lag.",
        },
        {
          id: "sap-d3-q9",
          question:
            "A company's NAT Gateway costs have increased by 400% after deploying a new service that transfers large amounts of data to S3. How should the architect reduce this cost?",
          options: [
            "A) Replace the NAT Gateway with a NAT instance (smaller EC2 instance) to reduce the per-GB processing fee.",
            "B) Create an S3 gateway endpoint in the VPC and update the route table of the subnets used by the new service to route S3 traffic through the endpoint instead of the NAT Gateway.",
            "C) Enable S3 Transfer Acceleration on the S3 bucket to reduce the amount of data processed by the NAT Gateway.",
            "D) Move the new service to a public subnet so it can access S3 directly without a NAT Gateway.",
          ],
          correctIndex: 1,
          explanation:
            "S3 gateway VPC endpoints are free and route S3 traffic directly within the AWS network — bypassing the NAT Gateway entirely and eliminating both the per-GB NAT processing charge and the data transfer charge. This is a classic cost optimization pattern. NAT instances (A) have lower per-GB costs but add operational overhead and are still not free. S3 Transfer Acceleration (C) speeds up uploads over public internet but doesn't remove traffic from the NAT Gateway. Moving to a public subnet (D) requires an Elastic IP and changes the security posture of the service.",
        },
        {
          id: "sap-d3-q10",
          question:
            "A company's Aurora MySQL cluster shows high CPU utilization on the writer instance, with most of the load from SELECT queries issued by reporting jobs. The writer has 5 read replicas that are at 10% CPU utilization. What is the cause and fix?",
          options: [
            "A) The reporting jobs are connecting to the cluster endpoint (which always routes to the writer). Fix: Update the reporting jobs to use the reader endpoint.",
            "B) The writer has insufficient connections for the reporting load. Fix: Increase the `max_connections` parameter.",
            "C) The read replicas are not replicating fast enough. Fix: Enable Aurora parallel replication.",
            "D) The reporting jobs are causing table locks. Fix: Enable optimistic locking in the application.",
          ],
          correctIndex: 0,
          explanation:
            "The Aurora cluster endpoint always routes to the writer instance. If reporting jobs are using the cluster endpoint (not the reader endpoint), all their SELECT queries hit the writer — which explains why the writer is at high CPU while readers are at 10%. Updating the JDBC connection string in the reporting jobs to use the Aurora reader endpoint distributes reads across the 5 existing read replicas instantly. This is a configuration fix requiring no infrastructure changes. Options B, C, and D address different problems not described in the scenario.",
        },
        {
          id: "sap-d3-q11",
          question:
            "A company wants to identify which EC2 instances are over-provisioned and right-size them. Which AWS tool provides the MOST accurate, ML-based recommendation based on actual usage patterns?",
          options: [
            "A) AWS Trusted Advisor's cost optimization checks.",
            "B) AWS Cost Explorer's Reserved Instance recommendations.",
            "C) AWS Compute Optimizer analyzing 14 days of CloudWatch metrics.",
            "D) AWS Systems Manager Inventory reporting on installed applications.",
          ],
          correctIndex: 2,
          explanation:
            "AWS Compute Optimizer uses machine learning to analyze CloudWatch utilization metrics (CPU, memory, network, disk) over a 14-day window and provides specific right-sizing recommendations for EC2, Lambda, ECS on Fargate, and EBS volumes. Trusted Advisor (A) provides high-level cost checks but less granular ML-based recommendations. Cost Explorer's RI recommendations (B) focus on purchasing strategy, not instance right-sizing. SSM Inventory (D) catalogs software but doesn't analyze resource utilization.",
        },
        {
          id: "sap-d3-q12",
          question:
            "A company receives a security finding from AWS GuardDuty indicating that an EC2 instance is communicating with a known cryptocurrency mining pool. What should the solutions architect do FIRST?",
          options: [
            "A) Terminate the EC2 instance immediately to stop the threat.",
            "B) Isolate the instance by moving it to a quarantine security group with no inbound or outbound rules, take a memory dump and EBS snapshot for forensics, then investigate the root cause.",
            "C) Detach the EC2 instance from the Auto Scaling group and run an Inspector scan.",
            "D) Restore the instance from the most recent golden AMI without investigating the root cause.",
          ],
          correctIndex: 1,
          explanation:
            "The correct incident response procedure: isolate (quarantine security group) to stop active threat communication without destroying evidence, then capture forensic artifacts (memory dump, EBS snapshot) before any remediation. Terminating immediately (A) destroys forensic evidence needed to understand the attack vector. Detaching from ASG and running Inspector (C) is incomplete — Inspector finds known vulnerabilities but won't identify the active compromise mechanism. Restoring from AMI (D) removes the instance without understanding how it was compromised, leaving the attack vector open.",
        },
        {
          id: "sap-d3-q13",
          question:
            "A company's DynamoDB table has an on-demand capacity mode and incurs high costs during business hours. Analysis shows that traffic is highly predictable: low from 12am-7am, high from 8am-6pm, and moderate from 6pm-12am. Which change MOST reduces cost?",
          options: [
            "A) Enable DynamoDB Auto Scaling with provisioned capacity mode and set min/max read and write capacity units.",
            "B) Use DynamoDB on-demand capacity but enable DAX to reduce the number of read requests reaching DynamoDB.",
            "C) Switch to provisioned capacity with DynamoDB Auto Scaling, and use scheduled scaling to pre-warm capacity before business hours.",
            "D) Export the DynamoDB table to S3 during off-peak hours and serve reads from S3.",
          ],
          correctIndex: 2,
          explanation:
            "Provisioned capacity is significantly cheaper than on-demand for predictable, sustained traffic. DynamoDB Auto Scaling adjusts capacity based on actual utilization. Adding scheduled scaling pre-warms capacity before 8am, avoiding the auto-scaling lag that could cause throttling during rapid traffic ramp-up. On-demand (A, B) charges per request and is more expensive for predictable high traffic. DAX (B) reduces DynamoDB reads but adds infrastructure cost. S3 export for reads (D) is architecturally inappropriate — S3 doesn't support DynamoDB query semantics.",
        },
        {
          id: "sap-d3-q14",
          question:
            "A company wants to improve the security posture of its 50 AWS accounts. Currently they have no centralized view of security findings. Which combination provides the BROADEST centralized security visibility with the LEAST setup effort?",
          options: [
            "A) Enable AWS Config in all accounts and create a Config aggregator in the security account.",
            "B) Enable AWS Security Hub in all accounts with AWS Organizations integration and designate a delegated administrator account. Enable AWS GuardDuty and Amazon Inspector v2 with Organizations auto-enable.",
            "C) Deploy a third-party SIEM in the security account and configure CloudWatch Logs shipping from all accounts.",
            "D) Enable AWS CloudTrail in all accounts and ship logs to a centralized S3 bucket for analysis.",
          ],
          correctIndex: 1,
          explanation:
            "Security Hub with Organizations integration provides a single-pane view of findings from GuardDuty (threat detection), Inspector (vulnerability management), Macie (S3 data sensitivity), Config (compliance), and IAM Access Analyzer — automatically aggregating across all member accounts. The delegated admin auto-enables new accounts. Organizations auto-enable for GuardDuty and Inspector means any new account immediately gets threat detection without manual steps. Config aggregator (A) covers compliance only. Third-party SIEM (C) requires significant setup and log forwarding infrastructure. CloudTrail (D) is API auditing, not security finding aggregation.",
        },
        {
          id: "sap-d3-q15",
          question:
            "A company's application deployment process requires manual approval at multiple stages, a specific change-freeze window notification to multiple teams, and post-deployment smoke tests. Currently this is documented in a wiki and executed manually. Which AWS service best automates this entire workflow?",
          options: [
            "A) AWS CodeBuild with a buildspec.yml that calls approval scripts.",
            "B) AWS CodePipeline with manual approval actions, SNS notifications for change-freeze alerts, and a CodeBuild stage for smoke tests.",
            "C) AWS Systems Manager Change Manager with an approval workflow, SNS notifications, and Automation runbooks for smoke tests.",
            "D) AWS Step Functions that orchestrate CodeBuild jobs for each deployment stage.",
          ],
          correctIndex: 2,
          explanation:
            "AWS Systems Manager Change Manager is specifically designed for governed, approval-based operational changes: it enforces approval workflows with multiple approvers, sends notifications, integrates with AWS Organizations for cross-account governance, and runs SSM Automation runbooks for automated pre/post-change tasks (including smoke tests). This replaces wiki-based manual processes. CodePipeline (B) handles CI/CD pipelines with approval gates but is not designed for operational change management with change-freeze windows. CodeBuild (A) is a build service, not an orchestration tool. Step Functions (D) would require significant custom development to replicate Change Manager's built-in governance features.",
        },
      ],
    },
    // ─── Domain 4: Accelerate Workload Migration and Modernization (20%) ─
    {
      id: "domain-4",
      title: "Accelerate Workload Migration and Modernization",
      weight: "20%",
      order: 4,
      summary:
        "This domain covers strategies and tools for migrating existing on-premises or legacy workloads to AWS, and modernizing them after migration. At the Professional level, you must know the **6 Rs of migration** (Rehost, Replatform, Refactor, Repurchase, Retire, Retain) and when to apply each based on business constraints, time-to-value, and technical debt considerations.\n\nKey topics include **AWS Migration Hub** for tracking migrations, **AWS Application Migration Service (MGN)** for lift-and-shift, **AWS Database Migration Service (DMS)** for database migrations, **AWS DataSync** and **AWS Snow Family** for large-scale data transfer, and **AWS Schema Conversion Tool (SCT)** for heterogeneous database migrations.\n\nModernization topics include containerization strategies using **Amazon ECS** and **EKS**, migrating monoliths to microservices, adopting serverless with Lambda, and using **AWS App2Container** to containerize Java and .NET applications without code changes.",
      keyConceptsForExam: [
        "**6 Rs of migration** — Rehost (lift-and-shift), Replatform (lift-tinker-shift), Refactor (re-architect), Repurchase, Retire, Retain — when to use each",
        "**AWS Application Migration Service (MGN)** — agent-based continuous block replication, cutover process, test instances, recovery point objective near-zero",
        "**AWS DMS** — homogeneous vs. heterogeneous migrations, CDC (change data capture) for minimal downtime, full-load vs. ongoing replication tasks",
        "**AWS SCT** — converts schema and stored procedures between different database engines (Oracle to PostgreSQL, SQL Server to Aurora), generates assessment report",
        "**Data transfer tools** — `AWS DataSync` for NFS/SMB/HDFS transfers, `AWS Snowball Edge` for 80 TB physical transfer, `AWS Snowmobile` for exabyte-scale transfers",
        "**App2Container** — containerizes Java and .NET apps running on EC2 or on-premises Windows/Linux, generates ECS task definitions or EKS manifests",
        "**VMware Cloud on AWS** — extends VMware environments to AWS without refactoring, enables live migration of vSphere VMs",
        "**Migration Hub Strategy Recommendations** — analyzes application dependencies, recommends migration strategy per application, identifies refactoring opportunities",
      ],
      examTips: [
        "Rehost (lift-and-shift using MGN) is always fastest time-to-cloud but leaves technical debt. Refactor provides the most cloud-native benefits but takes the longest. The exam tests whether you can match the right R to a business scenario.",
        "DMS supports CDC (Change Data Capture) for live database migration — this minimizes downtime by replicating ongoing changes while the bulk migration runs, then cutting over when the target is caught up.",
        "For migrating large databases (multi-TB), the answer often involves a physical transfer component (Snowball) to seed the target, followed by DMS CDC to sync the delta — not DMS alone, which would take too long.",
        "AWS Schema Conversion Tool (SCT) is a separate download (desktop application or EC2-hosted) that generates an assessment report showing what percentage of schema objects convert automatically vs. require manual effort.",
        "VMware Cloud on AWS is the answer when a company uses VMware vSphere on-premises and needs to migrate without any application changes or OS-level refactoring — it extends the VMware SDDC to AWS.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 Fundamentals" },
        { cloud: "aws", topicId: "rds-aurora", title: "RDS & Aurora" },
        { cloud: "aws", topicId: "s3-deep-dive", title: "S3 Deep Dive" },
      ],
      sections: [
        {
          heading: "The 6 Rs: Choosing the Right Migration Strategy",
          body: "The 6 Rs framework maps each application to the migration approach that best balances time-to-cloud, cost, and modernization benefit:\n\n**Rehost** (lift-and-shift): Migrate as-is using AWS MGN. No code changes. Fast. Best for: applications that need to move quickly, or where the business case doesn't justify refactoring.\n\n**Replatform** (lift-tinker-shift): Make targeted improvements without changing core architecture. Example: migrate MySQL to Aurora MySQL, or migrate a Tomcat server to Elastic Beanstalk. Improves operational efficiency with minimal code changes.\n\n**Refactor** (re-architect): Fully redesign using cloud-native services. Example: break a monolith into microservices on ECS + Lambda + DynamoDB. Highest modernization value, but highest effort and risk.\n\n**Repurchase**: Replace with a SaaS product. Example: move from self-hosted CRM to Salesforce, or from on-premises email to Microsoft 365.\n\n**Retire**: Decommission applications that are no longer needed. Typically 10-20% of applications in a migration portfolio.\n\n**Retain**: Keep on-premises temporarily (regulatory compliance, recently upgraded hardware, pending refresh). Revisit after 1-2 years.",
          code: {
            lang: "bash",
            label: "AWS MGN: Install replication agent on source server",
            snippet: `# Download and install MGN agent on source Linux server
wget -O ./aws-replication-installer-init.py \
  https://aws-application-migration-service-<region>.s3.amazonaws.com/\
latest/linux/aws-replication-installer-init.py

sudo python3 aws-replication-installer-init.py \
  --region us-east-1 \
  --aws-access-key-id AKIAIOSFODNN7EXAMPLE \
  --aws-secret-access-key wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY \
  --no-prompt`,
          },
        },
        {
          heading: "Database Migration with DMS and SCT",
          body: "**AWS Database Migration Service (DMS)** supports two types of migrations:\n\n**Homogeneous**: Same engine, different infrastructure (MySQL on-premises → RDS MySQL). Schema is compatible; DMS migrates data directly. Use **full-load** + **CDC** for near-zero downtime.\n\n**Heterogeneous**: Different engines (Oracle → Aurora PostgreSQL). Requires two steps: (1) **AWS Schema Conversion Tool (SCT)** converts schema and code objects, generating a report showing automatic vs. manual conversion percentage. (2) DMS migrates data after schema is converted.\n\n**CDC (Change Data Capture)** is the key to minimal downtime: DMS starts a full-load task to copy existing data, then automatically switches to CDC to replicate ongoing changes (using the source database's transaction log). When the target is nearly caught up, you perform the cutover — a brief maintenance window where you point the application to the new database.\n\nFor very large databases (multi-TB), use **AWS Snowball Edge** to perform the initial bulk transfer of data (exported as CSV or Parquet to Snowball, then imported to RDS), and then use DMS CDC to sync only the delta since the export — dramatically reducing DMS replication time.",
        },
        {
          heading: "Modernization: Containerization and Serverless Migration",
          body: "After lifting-and-shifting applications to AWS, the next phase often involves modernization:\n\n**AWS App2Container (A2C)** analyzes running Java (Tomcat) and .NET (IIS) applications — either on EC2 or on-premises — and generates Docker images and deployment artifacts (ECS task definitions, EKS Helm charts, CloudFormation templates). This enables containerization without code changes, as a stepping stone to microservices.\n\n**Strangler Fig pattern** for monolith-to-microservices: Incrementally extract functionality from a monolith into separate microservices, routing traffic to the new service via an API Gateway or load balancer. The monolith continues running until all features are extracted. This avoids big-bang rewrites.\n\n**Serverless migration** applies when: the application has variable, spiky traffic patterns; the business wants to eliminate server management; or individual functions can be extracted from a monolith. AWS Lambda's 15-minute timeout limits its use for long-running batch processes — use AWS Fargate or AWS Batch for those.",
        },
      ],
      quiz: [
        {
          id: "sap-d4-q1",
          question:
            "A company has 200 on-premises servers running a mix of Linux and Windows workloads. The business goal is to migrate to AWS within 3 months with minimal risk. Most applications have not been modified in 5 years and the team lacks cloud-native expertise. Which migration strategy should the solutions architect recommend?",
          options: [
            "A) Refactor all applications into microservices running on ECS before migrating.",
            "B) Rehost all applications using AWS Application Migration Service (MGN) for a lift-and-shift migration.",
            "C) Repurchase all applications with equivalent SaaS products.",
            "D) Replatform all applications to use managed AWS services like Elastic Beanstalk.",
          ],
          correctIndex: 1,
          explanation:
            "Rehost (lift-and-shift) with AWS MGN is the right strategy for the given constraints: 3-month timeline, 200 servers, team without cloud-native expertise, and legacy applications. MGN replicates servers continuously and performs cutover with minimal downtime. Refactoring (A) takes months to years per application. Repurchasing (C) works for some applications but not a diverse mixed workload. Replatforming (D) requires more application knowledge and effort than lift-and-shift.",
        },
        {
          id: "sap-d4-q2",
          question:
            "A company is migrating an Oracle database (8 TB) to Amazon Aurora PostgreSQL. The database is in active production use and must remain available during migration with less than 2 hours of downtime for cutover. Which combination of tools and steps achieves this?",
          options: [
            "A) Use AWS DMS full-load task to copy all data to Aurora PostgreSQL in one operation, then cut over.",
            "B) Use AWS SCT to convert the schema and code, then use DMS with a full-load + CDC task to continuously replicate changes. Cut over when the target is caught up.",
            "C) Take a database export (Data Pump), ship the export file to S3 using Snowball, import into Aurora, and cut over.",
            "D) Use AWS Database Conversion Service to automatically migrate both schema and data in a single automated process.",
          ],
          correctIndex: 1,
          explanation:
            "Oracle to Aurora PostgreSQL is a heterogeneous migration: SCT converts schema (DDL, stored procedures, triggers) and generates an assessment report. DMS full-load + CDC migrates data while the source remains live, with CDC continuously replicating changes. The cutover window is only the time needed to stop the source application, wait for CDC to replicate the final transactions, and switch the application connection string — typically under 30 minutes. A full-load only (A) has no CDC, so all changes during migration are lost. Snowball export (C) provides initial bulk data but has no mechanism for ongoing sync. Option D does not exist as described.",
        },
        {
          id: "sap-d4-q3",
          question:
            "A company needs to transfer 2 PB of historical archive data from an on-premises data center to S3. The network connection is a 1 Gbps internet line shared with production traffic. Which transfer approach is MOST time-efficient?",
          options: [
            "A) Use AWS DataSync over the existing internet connection to transfer data directly to S3.",
            "B) Order multiple AWS Snowball Edge Storage Optimized devices (80 TB each), load data locally, ship to AWS.",
            "C) Set up a 10 Gbps AWS Direct Connect connection to transfer data in parallel.",
            "D) Use S3 multipart upload with parallel threads to maximize utilization of the internet connection.",
          ],
          correctIndex: 1,
          explanation:
            "2 PB over a 1 Gbps line (shared, so effective throughput < 1 Gbps) would take years. Snowball Edge: 2 PB ÷ 80 TB per device = 25 devices, each taking ~1 week to ship, load, ship back, and ingest. Physical transfer of 25 devices in parallel can complete in weeks vs. years over the network. DataSync (A) over the internet is limited by the shared 1 Gbps connection. Setting up Direct Connect (C) takes 4-8 weeks to provision and a 10 Gbps line would still take ~18 days for 2 PB at full speed. Multipart upload (D) still uses the shared internet connection.",
        },
        {
          id: "sap-d4-q4",
          question:
            "A company uses VMware vSphere on-premises for 500 VMs. They want to migrate to AWS but cannot make any application or OS-level changes due to licensing constraints and lack of source code. They want to move quickly. Which migration path is MOST appropriate?",
          options: [
            "A) Install the AWS MGN replication agent on all 500 VMs and perform a lift-and-shift migration.",
            "B) Use VMware Cloud on AWS to extend the vSphere environment to AWS, then use vMotion to live-migrate VMs.",
            "C) Export each VM as an OVF and import it using AWS VM Import/Export.",
            "D) Use AWS DataSync to sync the VM disk files to S3, then convert them to AMIs.",
          ],
          correctIndex: 1,
          explanation:
            "VMware Cloud on AWS extends the on-premises VMware SDDC to AWS without any application or OS changes — VMs run on the same vSphere/vSAN/NSX stack. vMotion enables live migration of running VMs with zero downtime. No agents, no format conversion. MGN (A) works for most OS types but requires installing an agent on each VM. VM Import/Export (C) requires shutting down each VM to export it — significant downtime for 500 VMs. DataSync (D) is for file/object data transfer, not VM disk image conversion.",
        },
        {
          id: "sap-d4-q5",
          question:
            "A company has a Java EE monolith running on Tomcat on-premises. They want to containerize it without rewriting the application code, as a first step toward a microservices future. Which tool should they use?",
          options: [
            "A) Manually write a Dockerfile that installs Tomcat and copies the WAR file.",
            "B) Use AWS App2Container to analyze the running Tomcat application and generate Docker images and ECS/EKS deployment manifests.",
            "C) Use AWS Elastic Beanstalk with the Java/Tomcat platform, which automatically containerizes the WAR file.",
            "D) Use AWS CodeBuild to build a Docker image from the source code repository.",
          ],
          correctIndex: 1,
          explanation:
            "AWS App2Container specifically analyzes running Java (Tomcat, JBoss) and .NET (IIS) applications — either on EC2 or on-premises — and generates Docker container images and deployment manifests (ECS task definitions, EKS Helm charts) without code changes. This automates what would otherwise be manual Dockerfile authoring. Manual Dockerfile (A) works but doesn't capture runtime configuration automatically. Elastic Beanstalk (C) is PaaS, not containerization — it doesn't produce a Docker image for use on ECS/EKS. CodeBuild (D) requires a proper Dockerfile and build configuration.",
        },
        {
          id: "sap-d4-q6",
          question:
            "A company wants to gradually migrate from a monolithic e-commerce application to microservices. The team wants to extract the `search` feature first, without rewriting the entire application or causing user-facing disruption. Which architectural pattern enables this?",
          options: [
            "A) Deploy the new search microservice and perform a big-bang cutover, redirecting all search traffic at once.",
            "B) Use the Strangler Fig pattern: deploy the search microservice, route search API calls through an API Gateway to the new service, while all other calls continue to the monolith.",
            "C) Refactor the entire monolith into microservices simultaneously over a 6-month sprint.",
            "D) Create a copy of the monolith and remove all non-search functionality.",
          ],
          correctIndex: 1,
          explanation:
            "The Strangler Fig pattern is the canonical approach for incremental monolith decomposition. An API Gateway (or reverse proxy) routes specific requests (e.g., `/search/*`) to the new microservice while all other requests continue to the monolith. Over time, more features are extracted. Big-bang cutover (A) is high-risk. Full parallel refactor (C) is a 'big rewrite' approach that carries high failure risk. Copying the monolith and removing features (D) creates a maintenance burden — you'd be maintaining two monoliths.",
        },
        {
          id: "sap-d4-q7",
          question:
            "During a database migration assessment, the AWS Schema Conversion Tool reports that 35% of Oracle stored procedures cannot be automatically converted to PostgreSQL. What is the RECOMMENDED next step?",
          options: [
            "A) Abandon the migration to Aurora PostgreSQL and migrate to Amazon RDS for Oracle instead.",
            "B) Review the SCT assessment report to understand the conversion issues, manually rewrite the unconvertible objects, and use DMS for data migration.",
            "C) Use AWS DMS to migrate the stored procedures directly without SCT conversion.",
            "D) Enable SCT auto-remediation to automatically fix the remaining 35% using machine learning.",
          ],
          correctIndex: 1,
          explanation:
            "SCT's assessment report details exactly which objects couldn't be converted and why. Manual rewriting of the 35% unconvertible objects is the expected next step in a heterogeneous migration — this is normal and expected for complex Oracle-to-PostgreSQL migrations. RDS Oracle (A) would avoid the conversion but means staying on Oracle licensing. DMS (C) migrates data, not code objects — stored procedures must be converted separately via SCT or manually. There is no SCT auto-remediation feature (D).",
        },
        {
          id: "sap-d4-q8",
          question:
            "A company is migrating 500 on-premises servers to AWS. They want a centralized dashboard to track migration progress, group servers by application, and monitor each server's replication status across multiple migration tools (MGN, DMS). Which AWS service provides this?",
          options: [
            "A) AWS Systems Manager Fleet Manager.",
            "B) AWS Migration Hub with application grouping and progress tracking across integrated migration tools.",
            "C) Amazon CloudWatch with custom dashboards ingesting metrics from migration agents.",
            "D) AWS Service Catalog with migration portfolios.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Migration Hub provides a centralized view of migration progress across AWS and partner migration tools (MGN, DMS, CloudEndure). You can group servers into applications, track replication status, and monitor cutover progress — all from a single dashboard. Fleet Manager (A) manages EC2 instances post-migration, not migration tracking. CloudWatch (C) requires custom metric ingestion from migration agents and significant setup. Service Catalog (D) manages IT service offerings, not migration tracking.",
        },
        {
          id: "sap-d4-q9",
          question:
            "A company wants to move from self-hosted Elasticsearch on EC2 to a managed service, with zero application code changes (the application uses the standard Elasticsearch REST API). Which AWS migration path requires the LEAST code change?",
          options: [
            "A) Migrate to Amazon DynamoDB and rewrite queries to use DynamoDB Query syntax.",
            "B) Migrate to Amazon OpenSearch Service (successor to Amazon Elasticsearch Service) — the API is compatible with open-source Elasticsearch.",
            "C) Migrate to Amazon Redshift and use SQL for search queries.",
            "D) Migrate to Amazon Kendra for intelligent search.",
          ],
          correctIndex: 1,
          explanation:
            "Amazon OpenSearch Service is the direct managed successor to Amazon Elasticsearch Service and maintains API compatibility with open-source Elasticsearch — applications using standard Elasticsearch REST APIs require no code changes. DynamoDB (A) requires query rewrites. Redshift (C) uses SQL, not the Elasticsearch API. Kendra (D) is a managed intelligent search service for unstructured documents, not a drop-in Elasticsearch replacement.",
        },
        {
          id: "sap-d4-q10",
          question:
            "A media company has 500 TB of video content stored on on-premises NAS (NFS protocol). They want to migrate this to S3 and keep the on-premises NFS share in sync during a 6-month transition period. Which AWS service should they use?",
          options: [
            "A) AWS Snowball Edge for initial transfer, then S3 sync via CLI for ongoing sync.",
            "B) AWS DataSync for initial transfer and ongoing scheduled synchronization from NFS to S3.",
            "C) AWS Transfer Family to provide an NFS endpoint that writes to S3.",
            "D) AWS Storage Gateway File Gateway to mirror the NFS share to S3.",
          ],
          correctIndex: 1,
          explanation:
            "AWS DataSync is built exactly for this: it can perform an initial bulk transfer from on-premises NFS to S3, then run scheduled tasks to sync only changed files — maintaining ongoing synchronization during the transition period. It handles bandwidth throttling, data integrity verification, and scheduled runs. S3 CLI sync (A) is functional but lacks enterprise features like bandwidth scheduling, task management, and verification. Transfer Family (C) provides an NFS endpoint for clients but is not designed for NAS migration. Storage Gateway File Gateway (D) creates an S3-backed file share but doesn't replicate an existing NFS share to S3.",
        },
        {
          id: "sap-d4-q11",
          question:
            "A company completes a Rehost migration of 200 servers to AWS. Immediately after migration, they want to identify which applications should be modernized next and in what order. Which AWS tool analyzes the migrated environment and provides strategic recommendations?",
          options: [
            "A) AWS Compute Optimizer — to identify right-sizing opportunities for the migrated EC2 instances.",
            "B) AWS Migration Hub Strategy Recommendations — to analyze application dependencies and recommend modernization strategies.",
            "C) AWS Trusted Advisor — to review cost optimization and security findings for the migrated workloads.",
            "D) AWS Well-Architected Tool — to evaluate each application against the Well-Architected Framework pillars.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Migration Hub Strategy Recommendations specifically analyzes migrated applications (via a collector that discovers application details), maps dependencies, and recommends one of the 7 Rs for each application — prioritizing based on business value and technical feasibility. This is the post-migration modernization planning tool. Compute Optimizer (A) is for right-sizing, not strategic modernization planning. Trusted Advisor (C) provides cost and security checks, not modernization strategy. Well-Architected Tool (D) evaluates architectural best practices but doesn't recommend modernization strategy per application.",
        },
        {
          id: "sap-d4-q12",
          question:
            "A company is migrating a SQL Server database (3 TB) to Amazon Aurora MySQL. During the DMS full-load phase, the migration is running at only 50 GB/hour due to DMS replication instance resource constraints. The migration window is 72 hours. At this rate it will take 60 hours just for full-load, leaving insufficient time for CDC. What should the architect do?",
          options: [
            "A) Increase the DMS replication instance to a larger instance class to improve throughput.",
            "B) Split the migration into multiple DMS tasks, each covering a subset of tables, running in parallel.",
            "C) Both A and B: upgrade the replication instance and parallelize tasks across multiple tables.",
            "D) Export the SQL Server database using backup files, restore to Aurora MySQL manually, then start DMS CDC only.",
          ],
          correctIndex: 2,
          explanation:
            "Both optimizations together provide maximum throughput improvement: a larger DMS replication instance has more CPU and memory for data processing, while splitting into parallel tasks allows multiple tables to migrate concurrently. Combined, these can increase throughput several times. Upgrading alone (A) helps but parallelization provides additional gains. Parallelization alone (B) is constrained by the replication instance bottleneck. Manual backup-restore (D) from SQL Server to Aurora MySQL requires format conversion — SQL Server backup format is not directly compatible with MySQL.",
        },
        {
          id: "sap-d4-q13",
          question:
            "A company is evaluating whether to migrate their on-premises Hadoop HDFS cluster (200 TB) to AWS. The data science team runs Spark jobs. The company wants to minimize licensing and operational overhead while maintaining Spark capability. Which AWS architecture is RECOMMENDED?",
          options: [
            "A) Migrate HDFS to Amazon EFS and run Spark on a self-managed EC2 cluster.",
            "B) Migrate data to Amazon S3, use Amazon EMR with Spark for processing, and use S3 as the persistent data lake.",
            "C) Migrate HDFS to Amazon FSx for Lustre and run Spark on ECS.",
            "D) Use AWS Glue with Spark for processing, storing data in DynamoDB.",
          ],
          correctIndex: 1,
          explanation:
            "S3 as the data lake + Amazon EMR for managed Spark is the standard AWS pattern for Hadoop/HDFS migrations. EMR manages Spark cluster lifecycle, auto-scaling, and AWS integration. S3 decouples storage from compute — clusters can be shut down when not in use (pay-per-use). EFS (A) is NFS-based and not optimized for Hadoop-scale analytics. FSx for Lustre (C) is for HPC workloads requiring POSIX-compliant high-performance parallel storage. Glue (D) is a managed Spark/ETL service but DynamoDB is not appropriate for large-scale analytics data lake storage.",
        },
        {
          id: "sap-d4-q14",
          question:
            "A company performs a migration portfolio assessment and finds that 15% of their 500 applications are redundant or unused, 30% can be replaced by SaaS solutions, 40% should be lifted-and-shifted, and 15% need refactoring. In what order should they proceed to minimize migration risk and maximize early wins?",
          options: [
            "A) Start with refactoring (15%) to establish cloud-native patterns, then migrate the rest.",
            "B) Retire the unused applications (15%), Repurchase with SaaS (30%), then Rehost (40%), and tackle Refactor (15%) last.",
            "C) Rehost all 500 applications simultaneously, then refactor and repurchase in the second phase.",
            "D) Start with Repurchase (30%), then Refactor (15%), then Rehost (40%), and Retire (15%) last.",
          ],
          correctIndex: 1,
          explanation:
            "The recommended migration sequencing: (1) Retire — eliminating 75 applications immediately reduces the migration scope and costs. (2) Repurchase — moving 150 apps to SaaS is typically fast with minimal risk. (3) Rehost — the bulk of migrations can proceed with low risk using MGN. (4) Refactor — tackle the complex re-architecture work last with the team now having AWS experience. Starting with Refactor (A) delays any cloud benefit and requires the most expertise. Rehosting all 500 simultaneously (C) is operationally risky and wastes effort on applications that should be retired or repurchased. Option D deprioritizes retiring idle applications, wasting migration effort.",
        },
        {
          id: "sap-d4-q15",
          question:
            "After migrating a web application to AWS (EC2 + RDS), the team notices that response times are 40% higher than on-premises despite equivalent instance sizes. CloudWatch shows CPU and memory are not saturated. Which investigation should the architect perform FIRST?",
          options: [
            "A) Increase the EC2 instance type to reduce processing time.",
            "B) Enable X-Ray tracing and analyze where latency is introduced — specifically check for cross-AZ traffic between the EC2 instances and RDS, and verify the EC2 instances and RDS are in the same AZ.",
            "C) Enable CloudFront in front of the application to cache responses.",
            "D) Upgrade the RDS instance class to improve database performance.",
          ],
          correctIndex: 1,
          explanation:
            "X-Ray distributed tracing will reveal exactly where the 40% latency is added. A very common post-migration issue is cross-AZ latency: if EC2 instances are in one AZ and RDS is in another AZ, every database query incurs cross-AZ network latency (typically 1-3 ms per call, which accumulates across many queries). The immediate investigation step is to trace and profile before spending on infrastructure upgrades. Increasing instance size (A) doesn't address latency from network or configuration issues. CloudFront (C) helps cacheable responses but doesn't fix database latency. Upgrading RDS (D) may not help if CPU/memory aren't saturated.",
        },
      ],
    },
  ],
};
