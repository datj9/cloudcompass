import type { Certification } from "./types";

export const awsSaaC03: Certification = {
  id: "aws-saa-c03",
  title: "AWS Solutions Architect Associate",
  code: "SAA-C03",
  cloud: "aws",
  level: "Associate",
  description:
    "Validate your ability to design distributed systems on AWS. Covers compute, storage, networking, databases, security, and cost optimization.",
  examFormat: {
    questions: 65,
    duration: "130 minutes",
    passingScore: "720/1000",
    cost: "$150 USD",
  },
  domains: [
    // ─── Domain 1: Design Secure Architectures (30%) ───────────────
    {
      id: "domain-1",
      title: "Design Secure Architectures",
      weight: "30%",
      order: 1,
      summary:
        "This domain tests your ability to design secure access to AWS resources, secure application tiers, and appropriate data-security controls. It carries the heaviest weight on the exam (30%), reflecting the fact that security underpins every architectural decision in the cloud.\n\nExpect scenario-based questions on **IAM policies**, **VPC network isolation**, **encryption at rest and in transit**, and **AWS Organizations** service-control policies. You must understand the **shared-responsibility model** and know which security controls are your responsibility versus those managed by AWS.\n\nKey services to master include IAM, AWS KMS, AWS Secrets Manager, AWS WAF, Amazon GuardDuty, AWS CloudTrail, and VPC security groups vs. network ACLs. Questions often combine multiple services — for example, securing an S3 bucket via bucket policies, encryption, and VPC endpoints simultaneously.",
      keyConceptsForExam: [
        "**IAM policies** — identity-based vs. resource-based, least-privilege principle, and policy evaluation logic",
        "**VPC security layers** — security groups (stateful) vs. network ACLs (stateless), public vs. private subnets",
        "**Encryption** — `AWS KMS` CMKs, envelope encryption, S3 SSE-S3 / SSE-KMS / SSE-C, EBS encryption",
        "**AWS Organizations & SCPs** — multi-account strategy, guardrails, and consolidated billing boundaries",
        "**AWS CloudTrail** — API-level auditing, management events vs. data events, log-file integrity validation",
        "**Secrets management** — `AWS Secrets Manager` vs. `SSM Parameter Store`, automatic rotation with Lambda",
        "**VPC endpoints** — gateway endpoints (S3, DynamoDB) vs. interface endpoints (PrivateLink), DNS resolution",
        "**Web application security** — `AWS WAF` rules, `AWS Shield` Standard vs. Advanced, CloudFront signed URLs",
      ],
      examTips: [
        "When a question says \"least privilege,\" eliminate any answer that grants broader permissions than necessary — this is by far the most tested IAM concept.",
        "If a scenario involves cross-account access, look for answers using IAM roles with `sts:AssumeRole` rather than sharing long-term credentials.",
        "Security groups and NACLs are tested together — remember that security groups are **stateful** (return traffic auto-allowed) while NACLs are **stateless** (you must allow both inbound and outbound explicitly).",
        "For encryption questions, know the difference between **SSE-S3**, **SSE-KMS** (audit trail via CloudTrail), and **SSE-C** (customer manages keys entirely).",
        "AWS WAF attaches to CloudFront, ALB, or API Gateway — never directly to EC2 instances.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "iam-deep-dive", title: "IAM Deep Dive" },
        {
          cloud: "aws",
          topicId: "vpc-basics",
          title: "VPC — Virtual Private Cloud",
        },
        { cloud: "aws", topicId: "s3-deep-dive", title: "S3 Deep Dive" },
      ],
      sections: [
        {
          heading: "IAM Policy Evaluation Logic",
          body: "AWS evaluates IAM policies using a specific order: **explicit deny → Organizations SCP → resource-based policy → identity-based policy → permissions boundary → session policy**. An explicit `Deny` in any of these always wins. Understanding this chain is critical for exam questions that present conflicting policies.\n\nFor cross-account access, resource-based policies can grant access directly, but identity-based policies in the requesting account must also allow the action (unless the resource policy grants access to a specific IAM principal, which acts as a trust delegation).\n\nAlways prefer **IAM roles** over long-term access keys. Roles provide temporary credentials via `sts:AssumeRole` and integrate with EC2 instance profiles, Lambda execution roles, and ECS task roles.",
          code: {
            lang: "json",
            label: "Least-privilege S3 policy example",
            snippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadSpecificBucket",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::my-app-data",
        "arn:aws:s3:::my-app-data/*"
      ]
    }
  ]
}`,
          },
        },
        {
          heading: "VPC Network Isolation Patterns",
          body: "A well-architected VPC uses **multiple layers of isolation**: public subnets for load balancers, private subnets for application servers, and isolated subnets (no internet route) for databases. Each subnet tier has its own route table and NACL.\n\n**VPC endpoints** eliminate the need for NAT Gateways when accessing AWS services. Gateway endpoints (free) serve S3 and DynamoDB. Interface endpoints (powered by AWS PrivateLink) serve most other AWS services and keep traffic within the AWS network.\n\nFor multi-VPC architectures, **AWS Transit Gateway** provides hub-and-spoke connectivity, replacing complex VPC-peering meshes. Combine this with **AWS RAM** (Resource Access Manager) to share subnets across accounts in an AWS Organization.",
        },
        {
          heading: "Encryption Strategies",
          body: "AWS provides encryption at rest for virtually every storage and database service. The exam tests your ability to choose the right key-management approach:\n\n- **AWS-managed keys (SSE-S3)**: simplest, no key management overhead, but no granular access control via key policies.\n- **Customer-managed KMS keys (SSE-KMS)**: provides an audit trail in CloudTrail, supports key rotation, allows key policies for fine-grained access.\n- **Customer-provided keys (SSE-C)**: you supply and manage the key material. AWS does not store your key.\n\nFor **data in transit**, always enforce TLS. Use ACM (AWS Certificate Manager) for free public certificates on ALB and CloudFront. For internal services, ACM Private CA issues private certificates.",
          code: {
            lang: "bash",
            label: "Enable default S3 bucket encryption with KMS",
            snippet: `aws s3api put-bucket-encryption \\
  --bucket my-app-data \\
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms",
        "KMSMasterKeyID": "alias/my-app-key"
      },
      "BucketKeyEnabled": true
    }]
  }'`,
          },
        },
      ],
      quiz: [
        {
          id: "saa-d1-q1",
          question:
            "A company wants to ensure that all objects uploaded to an S3 bucket are encrypted using a customer-managed KMS key. Which combination of actions should a solutions architect take? (Choose the BEST answer.)",
          options: [
            "A) Set a bucket policy that denies s3:PutObject requests lacking the x-amz-server-side-encryption: aws:kms header, and enable default bucket encryption with the KMS key.",
            "B) Enable S3 Transfer Acceleration and specify the KMS key ID in the acceleration configuration.",
            "C) Create an IAM policy that allows s3:PutObject only when the request includes SSE-S3 encryption.",
            "D) Enable S3 Versioning and configure cross-region replication with encryption.",
          ],
          correctIndex: 0,
          explanation:
            "A bucket policy denying unencrypted PutObject requests combined with default KMS encryption ensures every object is encrypted. SSE-S3 (option C) uses AWS-managed keys, not customer-managed. Transfer Acceleration (B) is about speed, not encryption. Versioning and CRR (D) are unrelated to enforcing encryption.",
        },
        {
          id: "saa-d1-q2",
          question:
            "An application running on EC2 instances in a private subnet needs to access an S3 bucket without traffic traversing the public internet. What is the MOST cost-effective solution?",
          options: [
            "A) Create a NAT Gateway in a public subnet and route S3 traffic through it.",
            "B) Create an S3 gateway endpoint and add a route to the private subnet's route table.",
            "C) Create an interface endpoint (PrivateLink) for S3 in the private subnet.",
            "D) Configure an internet gateway and assign Elastic IP addresses to the EC2 instances.",
          ],
          correctIndex: 1,
          explanation:
            "S3 gateway endpoints are free and do not incur data-processing charges, making them the most cost-effective option. NAT Gateways (A) work but cost per-GB. Interface endpoints (C) also work but have hourly and per-GB charges. Option D exposes instances to the internet, violating the private-subnet requirement.",
        },
        {
          id: "saa-d1-q3",
          question:
            "A company uses AWS Organizations with multiple accounts. The security team wants to prevent any account from launching EC2 instances outside of us-east-1 and eu-west-1. What should they use?",
          options: [
            "A) IAM policies attached to every user in each account.",
            "B) A Service Control Policy (SCP) on the organizational unit denying ec2:RunInstances unless the region condition matches.",
            "C) AWS Config rules that automatically terminate instances in unauthorized regions.",
            "D) VPC configurations that restrict instance launches to specific Availability Zones.",
          ],
          correctIndex: 1,
          explanation:
            "SCPs apply organization-wide guardrails regardless of IAM permissions in child accounts. They are the correct tool for restricting which regions can be used. IAM policies (A) would need to be applied and maintained in every account. AWS Config (C) is detective, not preventive — instances would launch before being terminated. VPCs (D) cannot restrict which regions are used.",
        },
        {
          id: "saa-d1-q4",
          question:
            "A solutions architect must enable encryption at rest for an existing, unencrypted RDS MySQL database. How can this be accomplished?",
          options: [
            "A) Modify the existing DB instance and enable encryption.",
            "B) Create an encrypted read replica, then promote it to a standalone instance.",
            "C) Create an encrypted snapshot of the existing instance, then restore a new instance from the encrypted snapshot.",
            "D) Enable Transparent Data Encryption (TDE) on the MySQL instance.",
          ],
          correctIndex: 2,
          explanation:
            "You cannot enable encryption on an existing unencrypted RDS instance directly (A is incorrect). The correct approach is to snapshot the instance, copy the snapshot with encryption enabled, and restore from the encrypted snapshot. You cannot create an encrypted read replica from an unencrypted source (B). TDE (D) is available for RDS Oracle and SQL Server, not MySQL.",
        },
        {
          id: "saa-d1-q5",
          question:
            "An application uses Amazon API Gateway and AWS Lambda. The security team requires that only authenticated users can invoke the API. Which approach provides authentication with the LEAST operational overhead?",
          options: [
            "A) Deploy a custom Lambda authorizer that validates JWT tokens against a third-party IdP.",
            "B) Use an Amazon Cognito user pool as an API Gateway authorizer.",
            "C) Require IAM authentication on the API Gateway and distribute access keys to users.",
            "D) Implement API key validation on every API method.",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Cognito user pools integrate natively with API Gateway as an authorizer, providing user sign-up/sign-in with minimal operational overhead. A custom Lambda authorizer (A) works but requires you to write and maintain the authorization logic. IAM auth with access keys (C) is inappropriate for end users. API keys (D) are for throttling and usage plans, not authentication.",
        },
        {
          id: "saa-d1-q6",
          question:
            "A company has enabled AWS CloudTrail in all regions. The security team wants to be alerted when someone disables CloudTrail logging. What is the BEST approach?",
          options: [
            "A) Create an Amazon CloudWatch Events (EventBridge) rule that matches the StopLogging API call and triggers an SNS notification.",
            "B) Enable CloudTrail Insights to detect unusual API activity.",
            "C) Write a Lambda function that polls CloudTrail logs every 5 minutes to check for StopLogging events.",
            "D) Use AWS Config to check that CloudTrail is enabled and remediate automatically.",
          ],
          correctIndex: 0,
          explanation:
            "EventBridge (CloudWatch Events) can match specific CloudTrail API calls in near real-time. A rule matching StopLogging triggers an SNS alert immediately. CloudTrail Insights (B) detects volume anomalies, not specific API calls. Polling (C) is not real-time and adds operational overhead. AWS Config (D) can detect drift but is slower than EventBridge for alerting.",
        },
        {
          id: "saa-d1-q7",
          question:
            "A developer needs to store database credentials used by a Lambda function. The credentials must be rotated automatically every 30 days. Which service should the solutions architect recommend?",
          options: [
            "A) AWS Systems Manager Parameter Store with Standard parameters.",
            "B) AWS Secrets Manager with automatic rotation enabled.",
            "C) Environment variables encrypted with a KMS key in the Lambda configuration.",
            "D) An encrypted S3 object that the Lambda function reads at startup.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Secrets Manager supports built-in automatic rotation for RDS, Redshift, and DocumentDB credentials, and custom rotation via Lambda for other secrets. Parameter Store (A) does not natively support automatic rotation. Lambda environment variables (C) are static and require redeployment to update. S3 (D) has no built-in rotation mechanism.",
        },
        {
          id: "saa-d1-q8",
          question:
            "A web application behind an Application Load Balancer is being targeted by a SQL injection attack. Which AWS service should be used to block these requests?",
          options: [
            "A) Amazon GuardDuty.",
            "B) AWS Shield Advanced.",
            "C) AWS WAF with a SQL injection match rule.",
            "D) Amazon Inspector.",
          ],
          correctIndex: 2,
          explanation:
            "AWS WAF can inspect HTTP requests and block SQL injection patterns using managed or custom rules attached to an ALB. GuardDuty (A) is a threat detection service that analyzes logs but does not block requests. Shield Advanced (B) protects against DDoS, not application-layer injection attacks. Inspector (C) scans EC2 instances and container images for vulnerabilities, not live traffic.",
        },
        {
          id: "saa-d1-q9",
          question:
            "A company requires all EBS volumes to be encrypted. How can a solutions architect enforce this across all EC2 instances in an AWS account?",
          options: [
            "A) Enable the \"Always encrypt new EBS volumes\" account-level setting in the EC2 console for each region.",
            "B) Create a Lambda function triggered by CloudTrail to encrypt any unencrypted volume after creation.",
            "C) Use AWS Config rules to detect unencrypted volumes and notify the security team.",
            "D) Set an SCP that denies ec2:CreateVolume unless the encrypted parameter is true.",
          ],
          correctIndex: 0,
          explanation:
            "The EBS default encryption setting is a per-region, account-level option that ensures all new EBS volumes and snapshots are encrypted automatically. This is preventive and requires no custom code. An SCP (D) could work but is more complex and only applies within AWS Organizations. Config (C) is detective, not preventive. Lambda (B) is reactive and adds operational overhead.",
        },
        {
          id: "saa-d1-q10",
          question:
            "An application team needs to grant a third-party SaaS provider access to objects in an S3 bucket. The SaaS provider has its own AWS account. What is the MOST secure approach?",
          options: [
            "A) Create an IAM user in your account with programmatic access and share the credentials with the provider.",
            "B) Make the S3 bucket public and share the bucket URL.",
            "C) Create an IAM role with a trust policy allowing the provider's AWS account, and grant the role access to the S3 bucket.",
            "D) Generate pre-signed URLs for each object and send them to the provider.",
          ],
          correctIndex: 2,
          explanation:
            "A cross-account IAM role with a trust policy is the most secure approach — it uses temporary credentials, can include an external ID condition, and follows the principle of least privilege. Sharing IAM user credentials (A) exposes long-term keys. A public bucket (B) exposes data to everyone. Pre-signed URLs (D) are time-limited and object-specific, making them impractical for ongoing access to many objects.",
        },
        {
          id: "saa-d1-q11",
          question:
            "A solutions architect is designing a multi-tier application. The web tier runs in public subnets and the database tier runs in private subnets. The database must NOT be accessible from the internet under any circumstances. Which configuration ensures this?",
          options: [
            "A) Place the database in a private subnet with no route to an internet gateway or NAT gateway, and configure security groups to allow only the web tier's security group.",
            "B) Place the database in a public subnet and use security groups to block all inbound traffic from the internet.",
            "C) Place the database in a private subnet with a NAT gateway and restrict security groups to the web tier.",
            "D) Use a network ACL on the database subnet to deny all inbound traffic from 0.0.0.0/0.",
          ],
          correctIndex: 0,
          explanation:
            "A private subnet with no route to the internet (no IGW, no NAT) combined with security groups referencing only the web-tier SG provides the strongest isolation. Public subnets (B) always have an IGW route, making internet access possible. A NAT gateway (C) provides outbound internet access, which the question excludes. NACLs (D) add defense-in-depth but don't prevent misconfigurations as effectively as removing routes entirely.",
        },
        {
          id: "saa-d1-q12",
          question:
            "An organization wants to centrally manage SSL/TLS certificates for its ALBs and CloudFront distributions. Which AWS service should the solutions architect use?",
          options: [
            "A) AWS Certificate Manager (ACM).",
            "B) AWS KMS.",
            "C) IAM server certificates.",
            "D) AWS Secrets Manager.",
          ],
          correctIndex: 0,
          explanation:
            "ACM provides free public SSL/TLS certificates with automatic renewal and native integration with ALB, CloudFront, and API Gateway. KMS (B) manages encryption keys, not SSL certificates. IAM server certificates (C) are a legacy approach that requires manual renewal. Secrets Manager (D) stores secrets but is not designed for certificate lifecycle management.",
        },
        {
          id: "saa-d1-q13",
          question:
            "A company's compliance team requires that all API calls in an AWS account be logged and that the log files be tamper-proof. Which configuration meets this requirement?",
          options: [
            "A) Enable CloudTrail with log-file integrity validation and deliver logs to an S3 bucket with Object Lock in compliance mode.",
            "B) Enable VPC Flow Logs and deliver them to CloudWatch Logs with a retention policy.",
            "C) Enable AWS Config recording and store configuration snapshots in S3.",
            "D) Enable CloudTrail and store logs in an EBS volume with encryption enabled.",
          ],
          correctIndex: 0,
          explanation:
            "CloudTrail with log-file integrity validation creates a digest file with hashes for tamper detection. S3 Object Lock in compliance mode prevents deletion or overwrite of logs for the retention period. VPC Flow Logs (B) capture network traffic, not API calls. Config (C) records resource configurations, not API calls. EBS (D) is not an appropriate or tamper-proof log destination.",
        },
        {
          id: "saa-d1-q14",
          question:
            "An application team is deploying a containerized microservice on Amazon ECS with Fargate. Each task needs to access a specific DynamoDB table. What is the MOST secure way to grant access?",
          options: [
            "A) Store AWS credentials as environment variables in the task definition.",
            "B) Assign an ECS task role with an IAM policy granting DynamoDB access to the specific table.",
            "C) Attach a DynamoDB VPC endpoint and rely on it for authorization.",
            "D) Use the EC2 instance profile of the underlying host.",
          ],
          correctIndex: 1,
          explanation:
            "ECS task roles provide temporary credentials scoped to each task, following the principle of least privilege. Environment variables with credentials (A) expose long-term keys and are a security anti-pattern. VPC endpoints (C) control network path but do not provide IAM authorization. Fargate (D) does not expose instance profiles — there is no underlying EC2 host you control.",
        },
        {
          id: "saa-d1-q15",
          question:
            "A company wants to detect potentially compromised EC2 instances, unauthorized access attempts, and malicious IP addresses across all of its AWS accounts. Which service provides this capability with the LEAST operational effort?",
          options: [
            "A) Amazon Macie.",
            "B) Amazon GuardDuty with multi-account management.",
            "C) AWS Security Hub without any other service.",
            "D) Amazon Detective.",
          ],
          correctIndex: 1,
          explanation:
            "Amazon GuardDuty uses machine learning to analyze CloudTrail, VPC Flow Logs, and DNS logs to detect threats like compromised instances and unauthorized access. Its multi-account feature in AWS Organizations makes it easy to enable across all accounts. Macie (A) focuses on sensitive data discovery in S3. Security Hub (C) aggregates findings from other services but does not perform its own threat detection. Detective (D) is used for post-incident investigation, not real-time detection.",
        },
      ],
    },

    // ─── Domain 2: Design Resilient Architectures (26%) ────────────
    {
      id: "domain-2",
      title: "Design Resilient Architectures",
      weight: "26%",
      order: 2,
      summary:
        "This domain evaluates your ability to design architectures that survive failures, scale automatically, and recover quickly. At 26% of the exam, it is the second-heaviest domain and focuses on choosing the right multi-tier, decoupled, and fault-tolerant patterns.\n\nKey themes include **multi-AZ deployments**, **auto-scaling strategies**, **loose coupling via queues and event-driven patterns**, and **disaster recovery approaches** (backup/restore, pilot light, warm standby, multi-site active-active). You must understand Recovery Time Objective (RTO) and Recovery Point Objective (RPO) tradeoffs.\n\nExpect questions about Amazon SQS, Amazon SNS, Amazon EventBridge, Elastic Load Balancing, Auto Scaling groups, multi-AZ RDS, Aurora global databases, and S3 cross-region replication. The exam rewards designs that eliminate single points of failure at every tier.",
      keyConceptsForExam: [
        "**Multi-AZ vs. multi-Region** — when to use each, cost vs. resilience tradeoffs",
        "**Elastic Load Balancing** — ALB (Layer 7) vs. NLB (Layer 4), health checks, cross-zone load balancing",
        "**Auto Scaling** — target tracking, step scaling, predictive scaling; launch templates vs. launch configurations",
        "**Decoupling patterns** — `Amazon SQS` standard vs. FIFO, dead-letter queues, visibility timeout",
        "**Disaster recovery** — backup/restore (hours), pilot light (minutes), warm standby (seconds), active-active (near-zero)",
        "**Data replication** — S3 cross-region replication, RDS Multi-AZ, Aurora read replicas, DynamoDB global tables",
        "**Event-driven architecture** — `Amazon EventBridge` rules, `SNS` fan-out, Step Functions orchestration",
        "**Stateless design** — externalize session state to ElastiCache or DynamoDB; treat instances as disposable",
      ],
      examTips: [
        "Whenever a question mentions \"high availability,\" look for answers that deploy across **multiple Availability Zones** — not just multiple instances in the same AZ.",
        "\"Decoupled\" is almost always the right answer when the question involves asynchronous processing or unpredictable traffic spikes — look for SQS.",
        "Know the four DR strategies and match them to RTO/RPO requirements: lower RTO = more cost. If the question says \"minutes,\" pilot light or warm standby; if \"near-zero,\" multi-site active-active.",
        "Auto Scaling questions often test whether you understand the difference between target tracking (preferred default) and step scaling (fine-grained control). Target tracking is the simpler, exam-preferred option.",
        "For stateful workloads, the exam favors externalizing state to ElastiCache (Redis) or DynamoDB over sticky sessions.",
      ],
      relatedTopics: [
        {
          cloud: "aws",
          topicId: "elb-deep-dive",
          title: "ELB Deep Dive",
        },
        {
          cloud: "aws",
          topicId: "ec2-basics",
          title: "EC2 — Elastic Compute Cloud",
        },
        {
          cloud: "aws",
          topicId: "rds-aurora",
          title: "RDS & Aurora",
        },
        {
          cloud: "aws",
          topicId: "route53-deep-dive",
          title: "Route 53 Deep Dive",
        },
      ],
      sections: [
        {
          heading: "Multi-AZ and Multi-Region Strategies",
          body: "**Multi-AZ** deploys resources across Availability Zones within a single Region, providing resilience against data-center failures with low-latency synchronous replication. Most managed services — RDS, ElastiCache, EFS — support multi-AZ with a single setting.\n\n**Multi-Region** protects against an entire Region outage but adds complexity: asynchronous replication, DNS failover via Route 53, and application-level conflict resolution for writes. Use multi-Region when regulatory requirements demand geographic separation, or when RPO/RTO require active-active.\n\nAurora Global Database provides cross-region read replicas with typically less than 1 second of replication lag. DynamoDB global tables offer multi-Region, multi-active replication with last-writer-wins conflict resolution. S3 Cross-Region Replication (CRR) replicates objects asynchronously and can replicate encrypted objects using customer-managed KMS keys.",
        },
        {
          heading: "Decoupling with SQS, SNS, and EventBridge",
          body: "Loose coupling is a foundational principle for resilient architectures. **Amazon SQS** queues buffer requests between producers and consumers, absorbing traffic spikes and allowing independent scaling of each tier.\n\n**Standard queues** offer at-least-once delivery with best-effort ordering and nearly unlimited throughput. **FIFO queues** guarantee exactly-once processing and strict ordering but are limited to 3,000 messages per second (with batching). Always configure a **dead-letter queue (DLQ)** to capture messages that fail processing after a configurable number of retries.\n\n**SNS** provides pub/sub fan-out — a single message can trigger multiple SQS queues, Lambda functions, or HTTP endpoints. **EventBridge** extends this with event buses, content-based filtering, schema discovery, and integration with 30+ SaaS sources. Use EventBridge as the default for new event-driven designs.",
          code: {
            lang: "yaml",
            label: "CloudFormation — SQS queue with DLQ",
            snippet: `Resources:
  MainQueue:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: orders-queue
      VisibilityTimeout: 60
      RedrivePolicy:
        deadLetterTargetArn: !GetAtt DeadLetterQueue.Arn
        maxReceiveCount: 3

  DeadLetterQueue:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: orders-dlq
      MessageRetentionPeriod: 1209600  # 14 days`,
          },
        },
        {
          heading: "Auto Scaling Best Practices",
          body: "**Auto Scaling groups (ASGs)** maintain a desired count of healthy EC2 instances and replace unhealthy ones automatically. For the exam, understand three scaling policy types:\n\n1. **Target tracking** — the simplest and most recommended. You set a target metric (e.g., average CPU at 50%) and ASG adjusts capacity to maintain it.\n2. **Step scaling** — adds or removes a specific number of instances when a CloudWatch alarm threshold is crossed. Useful when you need different responses at different thresholds.\n3. **Predictive scaling** — uses machine learning to forecast demand and pre-provisions capacity ahead of recurring patterns.\n\nAlways use **launch templates** (not legacy launch configurations) for features like mixed instance types, Spot integration, and versioning. Configure **health checks** at both the EC2 level and the ELB level to ensure unhealthy instances are replaced even if the OS is running but the application is not responding.",
        },
      ],
      quiz: [
        {
          id: "saa-d2-q1",
          question:
            "A web application runs on EC2 instances behind an Application Load Balancer in a single Availability Zone. The business requires 99.99% availability. What change should the solutions architect make FIRST?",
          options: [
            "A) Add more instances in the same Availability Zone.",
            "B) Deploy instances across at least two Availability Zones and configure the ALB to use both.",
            "C) Switch from ALB to Network Load Balancer.",
            "D) Enable auto-scaling within the single Availability Zone.",
          ],
          correctIndex: 1,
          explanation:
            "High availability requires eliminating single points of failure. A single AZ is a single point of failure. Deploying across multiple AZs protects against data-center-level failures. More instances in one AZ (A) does not protect against AZ failure. NLB (C) changes the protocol tier but not the AZ architecture. Auto-scaling (D) helps with capacity but doesn't address AZ failure.",
        },
        {
          id: "saa-d2-q2",
          question:
            "A company processes order messages that must be handled exactly once and in strict FIFO order. Which Amazon SQS configuration should the solutions architect use?",
          options: [
            "A) Standard queue with message deduplication enabled.",
            "B) FIFO queue with content-based deduplication and a message group ID.",
            "C) Standard queue with a dead-letter queue configured.",
            "D) FIFO queue without a message group ID.",
          ],
          correctIndex: 1,
          explanation:
            "FIFO queues guarantee exactly-once processing and ordered delivery. Content-based deduplication uses a SHA-256 hash of the message body to prevent duplicates. A message group ID is required for FIFO ordering. Standard queues (A, C) offer at-least-once delivery and best-effort ordering, not strict FIFO. A FIFO queue without a message group ID (D) will not maintain order within groups.",
        },
        {
          id: "saa-d2-q3",
          question:
            "An application stores session state on the EC2 instances themselves. When an instance is terminated by Auto Scaling, users lose their session. What is the BEST solution?",
          options: [
            "A) Enable ALB sticky sessions so users always return to the same instance.",
            "B) Store session state in Amazon ElastiCache for Redis with Multi-AZ enabled.",
            "C) Increase the minimum capacity of the Auto Scaling group to prevent scale-in.",
            "D) Use larger EC2 instances to reduce the need for Auto Scaling.",
          ],
          correctIndex: 1,
          explanation:
            "Externalizing session state to ElastiCache Redis makes the application stateless, allowing any instance to serve any user. Multi-AZ Redis provides high availability for the session store. Sticky sessions (A) still lose sessions if the instance terminates. Preventing scale-in (C) defeats the purpose of auto-scaling. Larger instances (D) don't solve the underlying statefulness problem.",
        },
        {
          id: "saa-d2-q4",
          question:
            "A company has an RTO of 1 hour and an RPO of 15 minutes for a critical database. Which disaster recovery strategy meets these requirements at the LOWEST cost?",
          options: [
            "A) Multi-site active-active with Aurora Global Database.",
            "B) Warm standby with a scaled-down replica in a secondary Region.",
            "C) Pilot light with automated snapshot restores and pre-configured infrastructure templates.",
            "D) Backup and restore from S3 cross-region replicated snapshots.",
          ],
          correctIndex: 2,
          explanation:
            "Pilot light keeps critical infrastructure (databases, configuration) running in the DR Region at minimal cost. Recovery takes minutes to scale up application servers, fitting the 1-hour RTO. RPO of 15 minutes is met via continuous replication. Active-active (A) and warm standby (B) exceed the requirements and cost more. Backup/restore (D) typically cannot meet a 1-hour RTO or 15-minute RPO because snapshot restoration takes longer.",
        },
        {
          id: "saa-d2-q5",
          question:
            "A solutions architect wants a single message published to an SNS topic to trigger processing in three independent SQS queues. What pattern should be used?",
          options: [
            "A) Publish the message to each SQS queue individually from the application.",
            "B) Create an SNS topic and subscribe all three SQS queues to it (fan-out pattern).",
            "C) Use Amazon EventBridge to route the message to each queue based on content filtering.",
            "D) Create a Step Functions workflow that sends the message to each queue sequentially.",
          ],
          correctIndex: 1,
          explanation:
            "The SNS-SQS fan-out pattern is the exam-standard approach: one publish triggers delivery to all subscribed queues in parallel. Publishing individually (A) adds application complexity and failure points. EventBridge (C) works but adds unnecessary complexity when all three queues need every message. Step Functions (D) adds sequential processing overhead and cost.",
        },
        {
          id: "saa-d2-q6",
          question:
            "An Auto Scaling group uses a launch template with On-Demand instances. During a traffic spike, the group cannot launch new instances because the instance type is capacity-constrained in the AZ. How should the architect solve this?",
          options: [
            "A) Switch to a larger instance type.",
            "B) Configure the ASG with mixed instance types using an allocation strategy across multiple AZs.",
            "C) Pre-purchase Reserved Instances for the instance type.",
            "D) Manually add instances from the AWS console during spikes.",
          ],
          correctIndex: 1,
          explanation:
            "Mixed instance types with multiple AZs spread capacity risk. If one instance type is unavailable in one AZ, the ASG can launch a different type or use a different AZ. A larger type (A) might also be constrained. Reserved Instances (C) guarantee pricing, not capacity. Manual intervention (D) is not scalable or automated.",
        },
        {
          id: "saa-d2-q7",
          question:
            "A company runs a stateless REST API on EC2 instances behind an ALB. They want to ensure the ALB only routes traffic to healthy instances. What should the architect configure?",
          options: [
            "A) ALB health checks pointing to a dedicated /health endpoint on each instance.",
            "B) CloudWatch alarms monitoring CPU utilization of each instance.",
            "C) Route 53 health checks for each instance's private IP.",
            "D) EC2 status checks configured in the Auto Scaling group.",
          ],
          correctIndex: 0,
          explanation:
            "ALB health checks test application-level health by sending HTTP requests to a health-check endpoint. Unhealthy targets are removed from the target group automatically. CloudWatch alarms (B) can trigger scaling but don't remove targets from the ALB. Route 53 (C) is for DNS-level health checks, typically using public IPs. EC2 status checks (D) verify the hypervisor and OS, not application health.",
        },
        {
          id: "saa-d2-q8",
          question:
            "A company needs to replicate an S3 bucket to a second Region for compliance purposes. The objects are encrypted with AWS KMS. What additional configuration is required for cross-region replication?",
          options: [
            "A) No additional configuration — S3 CRR handles encrypted objects automatically.",
            "B) Specify a KMS key in the destination Region in the replication configuration, and grant the replication role permission to decrypt with the source key and encrypt with the destination key.",
            "C) Disable encryption on the source bucket before enabling replication.",
            "D) Use SSE-S3 instead of SSE-KMS for replicated objects.",
          ],
          correctIndex: 1,
          explanation:
            "KMS-encrypted objects require explicit configuration for CRR: you must specify the destination-region KMS key and grant the replication IAM role kms:Decrypt on the source key and kms:Encrypt on the destination key. CRR does not handle KMS encryption automatically (A). Disabling encryption (C) violates security requirements. Changing to SSE-S3 (D) loses the KMS audit trail and key policy controls.",
        },
        {
          id: "saa-d2-q9",
          question:
            "A retail application experiences predictable traffic spikes every day at 9 AM. The Auto Scaling group currently uses target tracking based on CPU utilization, but instances take 5 minutes to become healthy. How can the architect ensure capacity is ready before the spike?",
          options: [
            "A) Decrease the health-check grace period to 1 minute.",
            "B) Enable predictive scaling on the Auto Scaling group.",
            "C) Set a scheduled scaling action to increase capacity at 8:55 AM daily.",
            "D) Both B and C are valid approaches.",
          ],
          correctIndex: 3,
          explanation:
            "Both predictive scaling and scheduled scaling address the need to pre-provision capacity before a known spike. Predictive scaling uses ML to forecast the pattern automatically; scheduled scaling uses a cron-like rule. Either or both can solve the problem. Decreasing the health-check grace period (A) could mark instances as unhealthy before they finish initialization, making things worse.",
        },
        {
          id: "saa-d2-q10",
          question:
            "A company uses Amazon Aurora MySQL as its primary database. They need a read replica in a different Region for low-latency reads from global users and as a DR target. Which feature should they use?",
          options: [
            "A) Aurora Read Replicas within the same Region.",
            "B) Aurora Global Database with secondary Regions.",
            "C) RDS cross-region read replicas.",
            "D) DynamoDB Global Tables.",
          ],
          correctIndex: 1,
          explanation:
            "Aurora Global Database provides cross-region read replicas with typically less than 1 second of replication lag and can promote a secondary region to primary in under a minute for DR. Same-region replicas (A) don't serve global users or DR. RDS cross-region replicas (C) exist for RDS but not Aurora specifically — Aurora Global Database is the correct Aurora feature. DynamoDB (D) is a different database engine.",
        },
        {
          id: "saa-d2-q11",
          question:
            "A processing pipeline uses an SQS queue. Some messages consistently fail and are returned to the queue, blocking other messages. What should the architect implement?",
          options: [
            "A) Increase the visibility timeout to give consumers more time.",
            "B) Configure a dead-letter queue (DLQ) with a maxReceiveCount of 3.",
            "C) Switch to an SNS topic instead of SQS.",
            "D) Delete the failing messages manually.",
          ],
          correctIndex: 1,
          explanation:
            "A dead-letter queue captures messages that fail processing after a specified number of attempts (maxReceiveCount). This prevents poison messages from blocking the main queue and allows separate investigation. Increasing visibility timeout (A) doesn't help if the message always fails. SNS (C) is pub/sub, not a queue. Manual deletion (D) is not automated or scalable.",
        },
        {
          id: "saa-d2-q12",
          question:
            "A solutions architect is designing a serverless application that must orchestrate multiple Lambda functions with branching logic, error handling, and retries. Which service is BEST suited?",
          options: [
            "A) Amazon SQS with multiple queues.",
            "B) AWS Step Functions with a Standard workflow.",
            "C) Amazon EventBridge with multiple rules.",
            "D) AWS Lambda Destinations.",
          ],
          correctIndex: 1,
          explanation:
            "Step Functions provides visual workflow orchestration with built-in support for branching (Choice state), parallel execution, error handling (Catch/Retry), and timeouts. SQS (A) provides queuing but not orchestration logic. EventBridge (C) routes events but does not manage workflow state. Lambda Destinations (D) handle success/failure routing for individual functions but lack full orchestration.",
        },
        {
          id: "saa-d2-q13",
          question:
            "An application must continue operating even if an entire AWS Region becomes unavailable. Which Route 53 routing policy enables automatic failover to a secondary Region?",
          options: [
            "A) Simple routing.",
            "B) Weighted routing with a 50/50 split.",
            "C) Failover routing with health checks on the primary Region endpoint.",
            "D) Latency-based routing.",
          ],
          correctIndex: 2,
          explanation:
            "Failover routing with health checks directs traffic to a primary endpoint and automatically routes to a secondary when the primary fails health checks. Simple routing (A) returns all records randomly. Weighted (B) splits traffic but doesn't account for health. Latency-based (D) routes to the lowest-latency Region but doesn't prioritize primary/secondary.",
        },
        {
          id: "saa-d2-q14",
          question:
            "A company uses EBS-backed EC2 instances. They want to automate the creation of snapshots for disaster recovery. What is the MOST operationally efficient approach?",
          options: [
            "A) Write a Lambda function triggered by a cron-scheduled EventBridge rule to create snapshots.",
            "B) Use Amazon Data Lifecycle Manager (DLM) to create an automated snapshot lifecycle policy.",
            "C) Manually create snapshots every week from the console.",
            "D) Use AWS Backup with a backup plan and resource assignment.",
          ],
          correctIndex: 3,
          explanation:
            "AWS Backup provides a centralized, policy-driven approach to automate backups across AWS services including EBS, RDS, EFS, and DynamoDB. It supports cross-region and cross-account backup copies. DLM (B) is also valid for EBS specifically, but AWS Backup is the more comprehensive and operationally efficient solution. Lambda (A) requires custom code maintenance. Manual (C) is error-prone and not scalable.",
        },
        {
          id: "saa-d2-q15",
          question:
            "A microservices application uses an ALB with path-based routing. The /api/* path routes to one target group and the /web/* path routes to another. A new /admin/* service is being added. How should the architect configure routing?",
          options: [
            "A) Create a new ALB for the admin service.",
            "B) Add a new path-based rule on the existing ALB listener routing /admin/* to a new target group.",
            "C) Use a Network Load Balancer for the admin service.",
            "D) Configure Route 53 weighted routing to distribute traffic across services.",
          ],
          correctIndex: 1,
          explanation:
            "ALB supports multiple path-based rules on a single listener, each routing to a different target group. Adding a new rule for /admin/* is the simplest and most cost-effective approach. A separate ALB (A) or NLB (C) adds unnecessary cost and complexity. Route 53 (D) routes at the DNS level and cannot do URL path-based routing.",
        },
      ],
    },

    // ─── Domain 3: Design High-Performing Architectures (24%) ──────
    {
      id: "domain-3",
      title: "Design High-Performing Architectures",
      weight: "24%",
      order: 3,
      summary:
        "This domain tests your ability to select the right compute, storage, database, and networking solutions to meet performance requirements. At 24% of the exam, it focuses on choosing services and configurations that maximize throughput, minimize latency, and scale efficiently.\n\nYou must understand the performance characteristics of different compute options (EC2 instance families, Lambda, ECS/Fargate, EKS), storage types (EBS gp3 vs. io2, S3 storage classes, EFS vs. FSx), and database engines (RDS, Aurora, DynamoDB, ElastiCache, Redshift). The exam tests whether you can match workload characteristics — read-heavy vs. write-heavy, consistent vs. bursty, latency-sensitive vs. throughput-optimized — to the right service.\n\nNetworking performance concepts include CloudFront edge caching, Global Accelerator for TCP/UDP acceleration, and placement groups for low-latency inter-instance communication. Know when to use each caching layer: CloudFront (edge), ElastiCache (application), and DAX (DynamoDB-specific).",
      keyConceptsForExam: [
        "**EC2 instance families** — compute-optimized (C-series), memory-optimized (R/X-series), storage-optimized (I/D-series), GPU (P/G-series)",
        "**EBS volume types** — `gp3` (baseline 3,000 IOPS), `io2` (up to 64,000 IOPS), `st1` (throughput-optimized HDD), `sc1` (cold HDD)",
        "**Caching layers** — CloudFront for static/dynamic content at the edge, `ElastiCache` Redis/Memcached for application-layer caching, `DAX` for DynamoDB",
        "**Database selection** — Aurora (relational, 5x MySQL throughput), DynamoDB (key-value, single-digit ms at any scale), Redshift (OLAP/warehouse)",
        "**S3 performance** — multi-part upload for large objects, S3 Transfer Acceleration, byte-range fetches for parallel downloads",
        "**Networking performance** — placement groups (cluster, spread, partition), Enhanced Networking (ENA), `Global Accelerator` vs. CloudFront",
        "**Lambda performance** — memory/CPU scaling, provisioned concurrency to eliminate cold starts, reserved concurrency limits",
        "**Read replicas** — Aurora (up to 15), RDS (up to 15 cross-region), ElastiCache (read scaling and HA)",
      ],
      examTips: [
        "When a question says \"millisecond latency for a key-value workload,\" the answer is almost always DynamoDB. If it adds \"microsecond latency,\" the answer is DynamoDB with DAX.",
        "For EBS, know that **gp3** is the default recommendation — it offers a configurable baseline of 3,000 IOPS and 125 MiB/s throughput regardless of volume size. Only use io2 for sustained high-IOPS workloads.",
        "CloudFront and Global Accelerator both improve performance for global users, but they differ: CloudFront caches content at edge locations (best for HTTP/S), while Global Accelerator routes TCP/UDP to optimal endpoints via the AWS backbone (best for non-cacheable or non-HTTP traffic).",
        "Questions about \"read-heavy\" workloads almost always have a caching answer — ElastiCache for database query results, CloudFront for content delivery.",
        "Lambda memory setting controls both RAM and proportional CPU allocation. Increasing memory can reduce execution time and even cost.",
      ],
      relatedTopics: [
        {
          cloud: "aws",
          topicId: "ec2-basics",
          title: "EC2 — Elastic Compute Cloud",
        },
        {
          cloud: "aws",
          topicId: "dynamodb-deep-dive",
          title: "DynamoDB Deep Dive",
        },
        {
          cloud: "aws",
          topicId: "lambda-in-depth",
          title: "Lambda In-Depth",
        },
        {
          cloud: "aws",
          topicId: "s3-deep-dive",
          title: "S3 Deep Dive",
        },
      ],
      sections: [
        {
          heading: "Choosing the Right Database",
          body: "The SAA-C03 exam frequently tests database selection based on workload characteristics. Here is a decision framework:\n\n- **Relational + complex queries + transactions**: Amazon Aurora (5x MySQL / 3x PostgreSQL throughput) or RDS. Aurora Serverless v2 scales automatically for variable workloads.\n- **Key-value + single-digit ms latency + unlimited scale**: Amazon DynamoDB. Add **DAX** for microsecond read latency. Use DynamoDB global tables for multi-region active-active.\n- **In-memory caching**: Amazon ElastiCache — use **Redis** for persistence, pub/sub, and sorted sets; use **Memcached** for simple, multi-threaded caching.\n- **Data warehouse / analytics (OLAP)**: Amazon Redshift with columnar storage and massively parallel processing. Use Redshift Spectrum to query S3 data directly.\n- **Document / flexible schema**: Amazon DocumentDB (MongoDB-compatible).\n- **Graph relationships**: Amazon Neptune.\n- **Time-series data**: Amazon Timestream.",
        },
        {
          heading: "EBS Volume Performance Tuning",
          body: "EBS volume selection directly affects application performance. The exam focuses on these volume types:\n\n**gp3 (General Purpose SSD)**: The default choice for most workloads. Provides a baseline of 3,000 IOPS and 125 MiB/s, both independently configurable up to 16,000 IOPS and 1,000 MiB/s. Unlike gp2, performance is not tied to volume size.\n\n**io2 Block Express**: For latency-sensitive, high-IOPS workloads like databases. Supports up to 64,000 IOPS and 4,000 MiB/s per volume with 99.999% durability. IOPS can be provisioned independently of volume size.\n\n**st1 (Throughput-Optimized HDD)**: For sequential workloads like big data, log processing, and data warehousing. Up to 500 MiB/s throughput. Cannot be used as a boot volume.\n\n**sc1 (Cold HDD)**: Lowest-cost option for infrequently accessed data. Up to 250 MiB/s. Cannot be used as a boot volume.",
          code: {
            lang: "bash",
            label: "Create a gp3 volume with custom IOPS and throughput",
            snippet: `aws ec2 create-volume \\
  --volume-type gp3 \\
  --size 500 \\
  --iops 10000 \\
  --throughput 400 \\
  --availability-zone us-east-1a`,
          },
        },
        {
          heading: "Caching Strategies for Performance",
          body: "Caching is the single most effective performance optimization, and the exam tests multiple caching layers:\n\n**Amazon CloudFront** caches content at 400+ edge locations worldwide. Use it for static assets, dynamic API responses (with short TTLs), and video streaming. Origin can be S3, ALB, EC2, or any HTTP endpoint. CloudFront Functions and Lambda@Edge allow request/response manipulation at the edge.\n\n**Amazon ElastiCache** provides in-memory caching at the application layer. **Redis** supports complex data structures, persistence, replication, and pub/sub — choose it for session stores and leaderboards. **Memcached** is simpler and multi-threaded — choose it for pure key-value caching with horizontal scaling.\n\n**DynamoDB Accelerator (DAX)** is a fully managed, in-memory cache specifically for DynamoDB. It provides microsecond read latency and is API-compatible with DynamoDB — applications require minimal code changes. DAX handles cache invalidation automatically.",
        },
      ],
      quiz: [
        {
          id: "saa-d3-q1",
          question:
            "A company is migrating an on-premises MySQL database to AWS. The database handles 50,000 read queries per second and 5,000 write queries per second. Which AWS database solution provides the BEST performance?",
          options: [
            "A) Amazon RDS MySQL Multi-AZ with a single read replica.",
            "B) Amazon Aurora MySQL with up to 15 Aurora Replicas and reader endpoint.",
            "C) Amazon DynamoDB with DAX.",
            "D) Amazon Redshift for both read and write operations.",
          ],
          correctIndex: 1,
          explanation:
            "Aurora MySQL provides 5x the throughput of standard MySQL and supports up to 15 read replicas sharing the same storage volume. The reader endpoint automatically load-balances read traffic. RDS MySQL (A) supports fewer replicas and lower throughput. DynamoDB (C) is not relational and would require a schema redesign. Redshift (D) is for analytical workloads, not OLTP.",
        },
        {
          id: "saa-d3-q2",
          question:
            "An application needs sub-millisecond read latency for a DynamoDB table that serves product catalog lookups. Which solution should the architect add?",
          options: [
            "A) ElastiCache for Redis as a write-through cache.",
            "B) DynamoDB Accelerator (DAX) in front of the DynamoDB table.",
            "C) DynamoDB global tables for multi-region reads.",
            "D) Increase the provisioned read capacity units (RCUs) on the table.",
          ],
          correctIndex: 1,
          explanation:
            "DAX provides microsecond read latency for DynamoDB with no application code changes (API-compatible). ElastiCache (A) requires application-level cache management. Global tables (C) reduce latency for multi-region access but don't provide microsecond latency. Increasing RCUs (D) prevents throttling but doesn't reduce per-read latency below DynamoDB's single-digit millisecond baseline.",
        },
        {
          id: "saa-d3-q3",
          question:
            "A data analytics team needs to run complex SQL queries across petabytes of structured data. The queries are long-running (minutes to hours) and join multiple large tables. Which service is BEST suited?",
          options: [
            "A) Amazon Aurora PostgreSQL.",
            "B) Amazon Redshift with columnar storage.",
            "C) Amazon DynamoDB.",
            "D) Amazon RDS MySQL with read replicas.",
          ],
          correctIndex: 1,
          explanation:
            "Redshift is designed for OLAP workloads — it uses columnar storage, massively parallel processing (MPP), and result caching to efficiently handle complex analytical queries over petabytes of data. Aurora (A) and RDS (D) are OLTP databases not optimized for petabyte-scale analytics. DynamoDB (C) is a key-value store that doesn't support complex SQL joins.",
        },
        {
          id: "saa-d3-q4",
          question:
            "An application uploads 10 GB files to S3. Uploads frequently fail at 80% due to network issues. What should the solutions architect recommend?",
          options: [
            "A) Enable S3 Transfer Acceleration.",
            "B) Use S3 multipart upload.",
            "C) Increase the application's upload timeout.",
            "D) Switch to EBS volumes for file storage.",
          ],
          correctIndex: 1,
          explanation:
            "Multipart upload splits a large file into parts that upload independently. If one part fails, only that part needs to be retried, not the entire file. AWS recommends multipart for objects over 100 MB. Transfer Acceleration (A) speeds up transfers but doesn't solve the failure/retry problem. Increasing timeout (C) doesn't fix partial-failure recovery. EBS (D) is block storage, not suitable for this use case.",
        },
        {
          id: "saa-d3-q5",
          question:
            "A gaming application requires single-digit microsecond latency for leaderboard operations that involve sorted sets and atomic increment operations. Which service should the architect choose?",
          options: [
            "A) Amazon DynamoDB with DAX.",
            "B) Amazon ElastiCache for Redis.",
            "C) Amazon ElastiCache for Memcached.",
            "D) Amazon Aurora with in-memory tables.",
          ],
          correctIndex: 1,
          explanation:
            "Redis natively supports sorted sets (ZADD, ZRANGEBYSCORE) and atomic operations (INCR) with microsecond latency. These data structures are ideal for leaderboards. DAX (A) provides microsecond reads but DynamoDB doesn't have native sorted-set semantics. Memcached (C) doesn't support sorted sets or persistence. Aurora (D) is relational and doesn't match in-memory performance for this use case.",
        },
        {
          id: "saa-d3-q6",
          question:
            "A company wants to improve global performance for their API, which is hosted on ALBs in us-east-1. The API responses are dynamic and cannot be cached. Which service should the architect use?",
          options: [
            "A) Amazon CloudFront with a short TTL of 0.",
            "B) AWS Global Accelerator.",
            "C) Route 53 latency-based routing to multiple regional deployments.",
            "D) S3 Transfer Acceleration.",
          ],
          correctIndex: 1,
          explanation:
            "Global Accelerator routes TCP traffic from users to the nearest AWS edge location, then over the AWS global backbone to the ALB endpoint. This reduces latency for non-cacheable, dynamic traffic. CloudFront with TTL=0 (A) would still pass through edge locations but adds overhead for dynamic content without caching benefit. Route 53 (C) requires deploying the API in multiple regions. S3 TA (D) is for S3 uploads only.",
        },
        {
          id: "saa-d3-q7",
          question:
            "A machine learning training workload requires maximum inter-instance network throughput between 8 GPU instances. Which EC2 placement group type should the architect use?",
          options: [
            "A) Spread placement group.",
            "B) Partition placement group.",
            "C) Cluster placement group.",
            "D) No placement group is needed — use Enhanced Networking.",
          ],
          correctIndex: 2,
          explanation:
            "Cluster placement groups place instances physically close together in the same AZ for the lowest possible network latency and highest throughput (up to 100 Gbps with EFA). Spread (A) maximizes availability by placing instances on distinct hardware. Partition (B) is for large distributed workloads like HDFS. Enhanced Networking (D) is important but a cluster placement group provides the additional benefit of physical proximity.",
        },
        {
          id: "saa-d3-q8",
          question:
            "An EC2 instance runs a database with random I/O patterns requiring 32,000 sustained IOPS. Which EBS volume type is MOST appropriate?",
          options: [
            "A) gp3 with IOPS provisioned to 16,000.",
            "B) io2 with 32,000 provisioned IOPS.",
            "C) st1 (Throughput Optimized HDD).",
            "D) gp2 with a 10 TiB volume.",
          ],
          correctIndex: 1,
          explanation:
            "io2 supports up to 64,000 IOPS per volume, making it the right choice for 32,000 sustained IOPS. gp3 (A) maxes out at 16,000 IOPS and cannot meet the requirement. st1 (C) is HDD-based and optimized for sequential throughput, not random IOPS. gp2 at 10 TiB (D) would provide 30,000 IOPS (3 IOPS/GB), still below the 32,000 requirement.",
        },
        {
          id: "saa-d3-q9",
          question:
            "A company serves a website with static assets (images, CSS, JS) from an S3 bucket. Users worldwide report slow load times. What is the MOST effective improvement?",
          options: [
            "A) Enable S3 Transfer Acceleration on the bucket.",
            "B) Place an Amazon CloudFront distribution in front of the S3 bucket.",
            "C) Move the S3 bucket to a Region closer to the majority of users.",
            "D) Enable S3 requester-pays to incentivize local caching by users.",
          ],
          correctIndex: 1,
          explanation:
            "CloudFront caches static assets at 400+ edge locations worldwide, dramatically reducing latency for global users. Subsequent requests are served from the nearest edge location, not the origin bucket. S3 TA (A) speeds up uploads, not downloads. Moving the bucket (C) helps nearby users but not global ones. Requester-pays (D) is a billing model, not a performance feature.",
        },
        {
          id: "saa-d3-q10",
          question:
            "A Lambda function processes events from an SQS queue. Under load, some invocations time out after the default 3-second timeout. What should the architect do FIRST?",
          options: [
            "A) Increase the Lambda function timeout to match the expected processing time.",
            "B) Increase the Lambda function memory allocation.",
            "C) Switch from SQS to SNS as the event source.",
            "D) Enable Lambda provisioned concurrency.",
          ],
          correctIndex: 0,
          explanation:
            "The default Lambda timeout is 3 seconds. If processing legitimately takes longer, increase the timeout (up to 15 minutes). Also ensure the SQS visibility timeout is at least 6x the Lambda timeout. Increasing memory (B) may help if the function is CPU-bound but the first step is to set an appropriate timeout. SNS (C) doesn't solve the timeout issue. Provisioned concurrency (D) addresses cold starts, not timeouts.",
        },
        {
          id: "saa-d3-q11",
          question:
            "A solutions architect needs to choose a storage solution for a Linux-based application that requires a shared POSIX-compliant file system accessed by 50 EC2 instances concurrently. Which service is BEST?",
          options: [
            "A) Amazon EBS with Multi-Attach.",
            "B) Amazon S3 mounted via s3fs.",
            "C) Amazon EFS (Elastic File System).",
            "D) Amazon FSx for Windows File Server.",
          ],
          correctIndex: 2,
          explanation:
            "EFS provides a POSIX-compliant, NFS-based file system that can be mounted by thousands of EC2 instances concurrently across AZs. EBS Multi-Attach (A) supports only up to 16 io1/io2 instances in the same AZ and requires cluster-aware filesystems. S3 via s3fs (B) is not truly POSIX-compliant and has consistency limitations. FSx for Windows (C) is SMB-based, not POSIX for Linux.",
        },
        {
          id: "saa-d3-q12",
          question:
            "An application processes 1,000 messages per second from a Kinesis Data Stream. Each message requires 200ms of processing. How many Lambda function invocations does Kinesis trigger if the stream has 10 shards?",
          options: [
            "A) 1,000 concurrent invocations (one per message).",
            "B) 10 concurrent invocations (one per shard) processing messages in batches.",
            "C) 1 invocation processing all messages sequentially.",
            "D) 100 concurrent invocations using enhanced fan-out.",
          ],
          correctIndex: 1,
          explanation:
            "Kinesis triggers one Lambda invocation per shard concurrently. Each invocation receives a batch of records from its shard. With 10 shards, there are 10 concurrent invocations. This is fundamental to Kinesis-Lambda integration. Enhanced fan-out (D) allows multiple consumers per shard but still follows the one-invocation-per-shard-per-consumer model.",
        },
        {
          id: "saa-d3-q13",
          question:
            "A company runs a high-performance computing (HPC) workload that requires instances to communicate with low latency and uses MPI. Which combination should the architect use?",
          options: [
            "A) C5 instances with Enhanced Networking in a spread placement group.",
            "B) R5 instances with EBS-optimized storage in a partition placement group.",
            "C) C5n instances with Elastic Fabric Adapter (EFA) in a cluster placement group.",
            "D) M5 instances with ENI in no placement group.",
          ],
          correctIndex: 2,
          explanation:
            "HPC with MPI requires the lowest possible network latency: C5n (compute-optimized with enhanced networking), EFA (bypasses the OS kernel for direct hardware communication), and cluster placement group (physical proximity). Spread (A) spreads instances apart, increasing latency. Partition (B) is for Hadoop/Cassandra. M5 without placement group (D) doesn't optimize for inter-instance communication.",
        },
        {
          id: "saa-d3-q14",
          question:
            "A mobile application uses API Gateway and Lambda to serve user profiles. During peak hours, users experience latency spikes from Lambda cold starts. How should the architect reduce cold-start latency?",
          options: [
            "A) Enable API Gateway caching for the profile endpoint.",
            "B) Provision Lambda concurrency for the profile function.",
            "C) Increase the Lambda function memory to 3 GB.",
            "D) Move the application to EC2 instances behind an ALB.",
          ],
          correctIndex: 1,
          explanation:
            "Provisioned concurrency keeps a specified number of Lambda execution environments initialized and ready to respond instantly, eliminating cold starts. API caching (A) helps for identical requests but user profiles vary per user. More memory (C) speeds up execution but doesn't eliminate cold start initialization. EC2 (D) solves cold starts but loses serverless benefits.",
        },
        {
          id: "saa-d3-q15",
          question:
            "A data lake stores 50 TB of Parquet files in S3. Analysts query this data using Amazon Athena, but queries are slow. What optimization should the architect recommend FIRST?",
          options: [
            "A) Convert files from Parquet to CSV for simpler parsing.",
            "B) Partition the data by commonly filtered columns (e.g., date, region) and use partition projection.",
            "C) Move the data to Amazon Redshift.",
            "D) Enable S3 Intelligent-Tiering on the data lake bucket.",
          ],
          correctIndex: 1,
          explanation:
            "Partitioning data by frequently filtered columns allows Athena to skip scanning irrelevant partitions, dramatically reducing query time and cost. Partition projection eliminates the need for an AWS Glue Crawler. Converting to CSV (A) would worsen performance — Parquet is already columnar and compressed. Redshift (C) works but is more costly and not necessary if Athena is optimized. Intelligent-Tiering (D) affects storage cost, not query performance.",
        },
      ],
    },

    // ─── Domain 4: Design Cost-Optimized Architectures (20%) ───────
    {
      id: "domain-4",
      title: "Design Cost-Optimized Architectures",
      weight: "20%",
      order: 4,
      summary:
        "This domain tests your ability to select cost-effective solutions that meet both technical and business requirements. At 20% of the exam, it focuses on understanding AWS pricing models, choosing the right purchasing options, and designing architectures that minimize waste.\n\nKey topics include **EC2 purchasing options** (On-Demand, Reserved, Savings Plans, Spot), **S3 storage classes** (Standard, IA, One-Zone IA, Glacier, Glacier Deep Archive), **right-sizing** compute and database resources, and **serverless vs. provisioned** cost comparisons. The exam expects you to calculate relative costs between different architecture options.\n\nExpect scenario-based questions where you must balance performance requirements against budget constraints. The correct answer is often the option that meets the requirement at the lowest cost — not the cheapest option overall, but the cheapest option that fully satisfies the scenario.",
      keyConceptsForExam: [
        "**EC2 purchasing options** — On-Demand, Reserved Instances (Standard vs. Convertible, 1-year vs. 3-year), Savings Plans (Compute vs. EC2), Spot Instances (up to 90% savings)",
        "**S3 storage classes** — lifecycle policies to transition objects: Standard → IA (30 days) → Glacier Instant/Flexible (90 days) → Deep Archive (180 days)",
        "**Serverless cost model** — Lambda charges per request + GB-second; API Gateway per request; DynamoDB on-demand vs. provisioned capacity",
        "**Right-sizing** — use AWS Compute Optimizer, CloudWatch metrics, and Cost Explorer to identify over-provisioned resources",
        "**Data transfer costs** — intra-AZ free, inter-AZ charged, inter-Region charged more; VPC endpoints avoid NAT Gateway data processing fees",
        "**Managed services vs. self-managed** — Aurora Serverless vs. always-on RDS, Fargate vs. EC2 for containers, S3 vs. EBS for storage",
        "**Reserved capacity** — RDS Reserved Instances, ElastiCache Reserved Nodes, DynamoDB reserved capacity, Redshift Reserved Nodes",
        "**Spot Instances** — fault-tolerant workloads (batch, CI/CD, stateless web), Spot Fleet, EC2 Auto Scaling mixed instances",
      ],
      examTips: [
        "If a question mentions a workload that can tolerate interruptions (batch processing, CI/CD, image rendering), Spot Instances are almost always part of the correct answer.",
        "For steady-state, predictable workloads running 24/7, look for Reserved Instances or Savings Plans — not On-Demand.",
        "S3 lifecycle policies are a frequent exam topic. Remember: IA requires 30-day minimum, Glacier Flexible retrieval is minutes to hours, Deep Archive is 12-48 hours.",
        "When comparing architectures, consider not just compute costs but also data transfer, storage, and operational overhead. A seemingly cheaper option may cost more when you add data transfer.",
        "\"Cost-optimized\" does NOT mean \"cheapest\" — it means the least expensive option that fully meets the stated requirements. Eliminate options that don't meet the functional requirements first, then compare costs.",
      ],
      relatedTopics: [
        {
          cloud: "aws",
          topicId: "ec2-basics",
          title: "EC2 — Elastic Compute Cloud",
        },
        { cloud: "aws", topicId: "s3-deep-dive", title: "S3 Deep Dive" },
        {
          cloud: "aws",
          topicId: "lambda-in-depth",
          title: "Lambda In-Depth",
        },
      ],
      sections: [
        {
          heading: "EC2 Purchasing Options Decision Framework",
          body: "Choosing the right EC2 purchasing option can reduce compute costs by up to 90%. Use this framework:\n\n- **On-Demand**: Default for short-term, unpredictable workloads. No commitment, no upfront cost, highest per-hour rate.\n- **Reserved Instances (RI)**: Up to 72% savings for 1- or 3-year commitments. **Standard RIs** offer the highest discount but cannot change instance family. **Convertible RIs** offer lower discount but allow changing instance family, OS, and tenancy.\n- **Savings Plans**: **Compute Savings Plans** (up to 66% savings) apply across EC2, Fargate, and Lambda regardless of instance family, Region, or OS. **EC2 Instance Savings Plans** (up to 72%) are locked to a specific instance family in a Region.\n- **Spot Instances**: Up to 90% savings for fault-tolerant workloads. Use with Auto Scaling groups and mixed-instance policies. Implement graceful handling of 2-minute interruption notices.\n\nA cost-optimized architecture often combines multiple purchasing options: RIs for baseline capacity, On-Demand for predictable bursts, and Spot for fault-tolerant or flexible workloads.",
          code: {
            lang: "json",
            label: "ASG mixed instances policy (On-Demand base + Spot)",
            snippet: `{
  "LaunchTemplate": {
    "LaunchTemplateSpecification": {
      "LaunchTemplateId": "lt-0abc123def456",
      "Version": "$Latest"
    },
    "Overrides": [
      { "InstanceType": "m5.large" },
      { "InstanceType": "m5a.large" },
      { "InstanceType": "m5d.large" },
      { "InstanceType": "m4.large" }
    ]
  },
  "InstancesDistribution": {
    "OnDemandBaseCapacity": 2,
    "OnDemandPercentageAboveBaseCapacity": 25,
    "SpotAllocationStrategy": "capacity-optimized"
  }
}`,
          },
        },
        {
          heading: "S3 Storage Class Optimization",
          body: "S3 offers multiple storage classes at different price points. The exam tests your ability to select the right class and configure lifecycle policies:\n\n| Storage Class | Use Case | Retrieval | Min Duration |\n|---|---|---|---|\n| **Standard** | Frequently accessed data | Instant | None |\n| **Intelligent-Tiering** | Unknown or changing access patterns | Instant | None |\n| **Standard-IA** | Infrequent access, rapid retrieval needed | Instant | 30 days |\n| **One Zone-IA** | Non-critical, infrequent data (re-creatable) | Instant | 30 days |\n| **Glacier Instant Retrieval** | Archive with millisecond access | Instant | 90 days |\n| **Glacier Flexible Retrieval** | Archive with minutes-to-hours access | 1-12 hours | 90 days |\n| **Glacier Deep Archive** | Long-term compliance archives | 12-48 hours | 180 days |\n\n**S3 Intelligent-Tiering** is ideal when access patterns are unknown — it automatically moves objects between tiers with no retrieval fees and no operational overhead. Use lifecycle policies to automate transitions for known access patterns.",
        },
        {
          heading: "Serverless Cost Optimization",
          body: "Serverless architectures eliminate idle-capacity costs because you pay only for actual usage. However, at high volumes, provisioned services may be cheaper. Understanding the crossover points is key:\n\n**AWS Lambda** charges $0.20 per 1 million requests plus $0.0000166667 per GB-second. For sporadic or bursty workloads, Lambda is dramatically cheaper than running EC2 instances 24/7. However, a Lambda function running continuously at high volume may cost more than a small Reserved Instance.\n\n**DynamoDB on-demand** charges per read/write request with no capacity planning. **Provisioned capacity** is cheaper for steady workloads and supports auto-scaling. The exam often presents scenarios where on-demand suits development/testing and provisioned suits production.\n\n**Fargate** eliminates EC2 instance management for containers but costs more per-vCPU than equivalent EC2. Use Fargate for variable workloads and EC2-backed ECS for steady-state container workloads.\n\nAWS Lambda, API Gateway, DynamoDB, and S3 together form the canonical serverless stack — exam questions about cost-effective architectures for variable or low-traffic workloads almost always point here.",
        },
      ],
      quiz: [
        {
          id: "saa-d4-q1",
          question:
            "A company runs a batch-processing workload every night that takes 4 hours to complete. The workload is fault-tolerant and can be restarted if interrupted. Which EC2 purchasing option provides the LOWEST cost?",
          options: [
            "A) On-Demand Instances.",
            "B) 1-year Standard Reserved Instances.",
            "C) Spot Instances.",
            "D) Dedicated Hosts.",
          ],
          correctIndex: 2,
          explanation:
            "Spot Instances offer up to 90% savings over On-Demand and are ideal for fault-tolerant batch workloads that can handle interruptions. On-Demand (A) is more expensive. Reserved Instances (B) require 1-3 year commitments and are meant for steady-state, not nightly batch jobs. Dedicated Hosts (D) are the most expensive option, meant for licensing requirements.",
        },
        {
          id: "saa-d4-q2",
          question:
            "A company stores 100 TB of log data in S3 Standard. The data is accessed frequently for the first 30 days, then rarely for the next 11 months, and must be retained for 7 years for compliance. What lifecycle policy minimizes cost?",
          options: [
            "A) Transition to S3 Standard-IA after 30 days, then to S3 Glacier Deep Archive after 365 days.",
            "B) Keep all data in S3 Standard for 7 years.",
            "C) Transition to S3 One Zone-IA after 30 days, then delete after 1 year.",
            "D) Transition to Glacier Flexible Retrieval after 30 days and delete after 7 years.",
          ],
          correctIndex: 0,
          explanation:
            "Standard-IA is cost-effective for infrequent access with instant retrieval (needed for the occasional queries in months 2-12). Glacier Deep Archive is the cheapest option for 7-year retention where retrieval is rarely needed. Keeping in Standard (B) wastes money on rarely accessed data. One Zone-IA (C) deletes after 1 year, violating the 7-year requirement. Glacier Flexible (D) after 30 days is too aggressive — IA is better for months 2-12 when occasional access is expected.",
        },
        {
          id: "saa-d4-q3",
          question:
            "A development team runs several EC2 instances for testing during business hours (8 AM to 6 PM, Monday to Friday). The instances are idle 76% of the week. What is the MOST cost-effective approach?",
          options: [
            "A) Purchase Reserved Instances for all test servers.",
            "B) Use On-Demand instances with scheduled start/stop via AWS Instance Scheduler.",
            "C) Use Spot Instances for all test servers.",
            "D) Leave instances running 24/7 but use smaller instance types.",
          ],
          correctIndex: 1,
          explanation:
            "Scheduling instances to run only during business hours eliminates 76% of compute cost. On-Demand is appropriate for non-production, unpredictable usage. Reserved Instances (A) require commitment and are wasteful if instances are stopped most of the time. Spot (C) might be interrupted during active use. Running 24/7 with smaller instances (D) still wastes 76% of uptime.",
        },
        {
          id: "saa-d4-q4",
          question:
            "A company has multiple AWS accounts and wants to consolidate billing to take advantage of volume discounts and share Reserved Instance benefits. Which service should they use?",
          options: [
            "A) AWS Budgets.",
            "B) AWS Organizations with consolidated billing.",
            "C) AWS Cost Explorer.",
            "D) AWS Trusted Advisor.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Organizations consolidates billing across all member accounts, enabling volume pricing tiers and RI sharing. AWS Budgets (A) sets spending alerts but doesn't consolidate billing. Cost Explorer (C) analyzes costs but doesn't consolidate. Trusted Advisor (D) provides optimization recommendations but doesn't manage billing.",
        },
        {
          id: "saa-d4-q5",
          question:
            "A solutions architect needs to choose between running a containerized application on ECS with Fargate vs. ECS with EC2. The application runs 24/7 with steady, predictable traffic. Which option is MORE cost-effective?",
          options: [
            "A) Fargate, because it eliminates instance management overhead.",
            "B) ECS on EC2 with Reserved Instances, because per-vCPU cost is lower for steady-state workloads.",
            "C) Fargate with Spot capacity for all tasks.",
            "D) ECS on EC2 with On-Demand instances.",
          ],
          correctIndex: 1,
          explanation:
            "For steady-state 24/7 workloads, EC2 with Reserved Instances provides lower per-vCPU cost than Fargate. Fargate (A) is simpler but more expensive per unit of compute for sustained workloads. Spot (C) with Fargate may interrupt tasks. On-Demand EC2 (D) is more expensive than RI for steady-state.",
        },
        {
          id: "saa-d4-q6",
          question:
            "A company wants to reduce data transfer costs. Their architecture sends 5 TB/month from EC2 instances in a private subnet to S3 through a NAT Gateway. What should the architect change?",
          options: [
            "A) Move EC2 instances to a public subnet to access S3 directly via the internet.",
            "B) Create an S3 gateway endpoint to eliminate NAT Gateway data processing charges.",
            "C) Enable S3 Transfer Acceleration for faster uploads.",
            "D) Compress all data before uploading to S3.",
          ],
          correctIndex: 1,
          explanation:
            "S3 gateway endpoints are free — they route S3 traffic directly through the VPC without traversing (or paying for) a NAT Gateway. NAT Gateway data processing charges are $0.045/GB, so 5 TB/month costs $225/month. Moving to public subnets (A) is a security anti-pattern. Transfer Acceleration (B) adds cost, not reduces it. Compression (D) reduces volume but doesn't address the fundamental routing cost.",
        },
        {
          id: "saa-d4-q7",
          question:
            "A startup builds a new API with unpredictable traffic. Some days there are 100 requests, other days 1 million. The team wants to minimize cost and operational overhead. Which architecture is MOST cost-effective?",
          options: [
            "A) EC2 instances behind an ALB with Auto Scaling.",
            "B) API Gateway with Lambda and DynamoDB on-demand.",
            "C) ECS Fargate with Application Auto Scaling.",
            "D) EC2 with Reserved Instances and RDS.",
          ],
          correctIndex: 1,
          explanation:
            "The serverless stack (API Gateway + Lambda + DynamoDB on-demand) scales to zero with no cost during idle periods and scales automatically to handle 1M+ requests. You pay only for what you use. EC2/ALB (A) incurs minimum costs for ALB and instances even during idle. Fargate (C) also has a minimum cost. EC2 with RIs (D) requires committed spend regardless of traffic.",
        },
        {
          id: "saa-d4-q8",
          question:
            "A company runs a steady-state production workload on m5.xlarge instances across three AWS Regions. They want maximum cost savings with flexibility to change instance sizes within the m5 family. Which option provides the BEST savings?",
          options: [
            "A) Standard Reserved Instances for m5.xlarge in each Region.",
            "B) Compute Savings Plan.",
            "C) EC2 Instance Savings Plan for the m5 family in each Region.",
            "D) Convertible Reserved Instances for m5.xlarge in each Region.",
          ],
          correctIndex: 2,
          explanation:
            "EC2 Instance Savings Plans offer up to 72% savings (highest discount after Standard RIs) and apply to any instance size within the committed family and Region. Standard RIs (A) are locked to a specific instance size. Compute Savings Plans (B) are more flexible (any family, any Region) but offer slightly less discount (~66%). Convertible RIs (D) offer lower discount than EC2 Instance Savings Plans.",
        },
        {
          id: "saa-d4-q9",
          question:
            "A company stores 50 TB of data in Amazon EBS gp2 volumes attached to EC2 instances used for nightly batch processing. The data is read-only input. What change would REDUCE storage costs?",
          options: [
            "A) Move data to S3 and use S3 as the input source for batch processing.",
            "B) Switch from gp2 to io2 volumes.",
            "C) Create EBS snapshots and delete the volumes, restoring before each batch run.",
            "D) Enable EBS encryption to reduce costs through compression.",
          ],
          correctIndex: 0,
          explanation:
            "S3 Standard costs ~$0.023/GB/month vs. EBS gp2 at ~$0.10/GB/month — a 77% savings for 50 TB of read-only data. io2 (B) is more expensive than gp2. Snapshot/restore (C) adds complexity and snapshot storage cost. EBS encryption (D) does not compress or reduce costs.",
        },
        {
          id: "saa-d4-q10",
          question:
            "A solutions architect notices that an RDS Multi-AZ MySQL instance consistently uses only 10% of its CPU and 20% of its memory. The instance type is db.r5.2xlarge. What should the architect recommend?",
          options: [
            "A) Switch to a db.r5.large instance to right-size the resource.",
            "B) Switch to Aurora Serverless v2 to scale automatically.",
            "C) Add read replicas to distribute the load.",
            "D) Do nothing — over-provisioning ensures headroom for traffic spikes.",
          ],
          correctIndex: 0,
          explanation:
            "Right-sizing from 2xlarge to large reduces costs by ~75% while still providing ample headroom (the current utilization would become ~40% CPU and ~80% memory on a large). Aurora Serverless (B) is cost-effective for variable workloads but may not save money for steady-state. Read replicas (C) are for scaling reads, not reducing costs on an under-utilized instance. Doing nothing (D) wastes money.",
        },
        {
          id: "saa-d4-q11",
          question:
            "A company has a fleet of 20 EC2 instances across multiple instance families (m5, c5, r5) in us-east-1 and eu-west-1. They run 24/7 and the company wants maximum flexibility to change instance types. Which savings option provides the BEST value?",
          options: [
            "A) Standard Reserved Instances for each instance type and Region.",
            "B) Compute Savings Plan with a 3-year term.",
            "C) EC2 Instance Savings Plans for each family in each Region.",
            "D) Spot Instances for all 20 instances.",
          ],
          correctIndex: 1,
          explanation:
            "Compute Savings Plans apply across any instance family, any Region, and even to Fargate/Lambda. With multiple families across two Regions, this provides the most flexibility while offering up to 66% savings. Standard RIs (A) lock to specific types. EC2 Instance Savings Plans (C) require separate commitments per family per Region. Spot (D) may interrupt production workloads running 24/7.",
        },
        {
          id: "saa-d4-q12",
          question:
            "An application generates 10,000 thumbnail images per hour from uploaded photos. Each thumbnail generation takes 2 seconds and requires 512 MB of memory. The workload is event-driven and triggered by S3 uploads. Which architecture is MOST cost-effective?",
          options: [
            "A) An EC2 instance running 24/7 polling the S3 bucket for new objects.",
            "B) A Lambda function triggered by S3 event notifications.",
            "C) An ECS Fargate task triggered by CloudWatch Events.",
            "D) An EC2 Auto Scaling group with minimum capacity of 2.",
          ],
          correctIndex: 1,
          explanation:
            "Lambda is ideal for this workload: event-driven, short-duration (2s), moderate memory (512 MB). Cost: 10,000 invocations × 2s × 512 MB = 10,000 GB-seconds/hour ≈ $0.17/hour. A t3.medium EC2 instance (A, D) running 24/7 costs ~$30/month regardless of utilization. Fargate (C) adds overhead for container spin-up and hourly charges.",
        },
        {
          id: "saa-d4-q13",
          question:
            "A company wants to identify over-provisioned EC2 instances and receive right-sizing recommendations. Which AWS service provides this capability?",
          options: [
            "A) AWS Cost Explorer with right-sizing recommendations.",
            "B) Amazon CloudWatch dashboards.",
            "C) AWS Budgets.",
            "D) AWS Personal Health Dashboard.",
          ],
          correctIndex: 0,
          explanation:
            "AWS Cost Explorer includes right-sizing recommendations that analyze CloudWatch metrics (CPU, memory, network) to suggest more cost-effective instance types. CloudWatch (B) shows metrics but doesn't make recommendations. Budgets (C) track spending against thresholds. Personal Health Dashboard (D) shows service health events.",
        },
        {
          id: "saa-d4-q14",
          question:
            "A company uses DynamoDB for a production application with consistent traffic of 5,000 reads/second and 1,000 writes/second during business hours. Traffic drops to near zero at night. Which capacity mode is MOST cost-effective?",
          options: [
            "A) On-demand capacity mode.",
            "B) Provisioned capacity with auto-scaling configured to match traffic patterns.",
            "C) Provisioned capacity set to peak levels 24/7.",
            "D) On-demand during the day, switch to provisioned at night.",
          ],
          correctIndex: 1,
          explanation:
            "Provisioned capacity with auto-scaling adjusts capacity up during business hours and down at night, matching the consistent-but-variable pattern at lower cost than on-demand. On-demand (A) is more expensive per request when traffic is predictable. Fixed provisioned (C) wastes capacity at night. You cannot switch modes more than once per day (D), making frequent switching impractical.",
        },
        {
          id: "saa-d4-q15",
          question:
            "A company wants to analyze 5 years of CloudTrail logs stored in S3 using SQL queries. The analysis runs once per quarter. Which query service is MOST cost-effective?",
          options: [
            "A) Amazon Redshift with a dc2.large cluster running continuously.",
            "B) Amazon Athena querying the S3 data directly.",
            "C) Amazon RDS PostgreSQL with the data imported quarterly.",
            "D) Amazon EMR with a persistent Hadoop cluster.",
          ],
          correctIndex: 1,
          explanation:
            "Athena is serverless and charges only for data scanned ($5/TB). For quarterly queries, you pay nothing between runs. Redshift (A) charges hourly even when idle between quarterly analyses. RDS (C) requires data import and hourly charges. EMR (D) charges for the cluster duration. For infrequent, ad-hoc queries over S3 data, Athena is the most cost-effective option.",
        },
      ],
    },
  ],
};
