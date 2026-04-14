import type { Certification } from "./types";

export const awsSoaC02: Certification = {
  id: "aws-soa-c02",
  title: "AWS SysOps Administrator Associate",
  code: "SOA-C02",
  cloud: "aws",
  level: "Associate",
  description:
    "Validate your ability to deploy, manage, and operate AWS workloads. Covers monitoring, automation, security, networking, and cost management.",
  examFormat: {
    questions: 65,
    duration: "180 minutes",
    passingScore: "720/1000",
    cost: "$150 USD",
  },
  domains: [
    // ─── Domain 1: Monitoring, Logging, and Remediation (20%) ───────────────
    {
      id: "domain-1",
      title: "Monitoring, Logging, and Remediation",
      weight: "20%",
      order: 1,
      summary:
        "This domain focuses on using CloudWatch, CloudTrail, and AWS Config to monitor AWS infrastructure and respond to operational events. You must understand how to create alarms, dashboards, log metric filters, and automated remediation workflows.\n\nExpect questions on CloudWatch Logs Insights queries, CloudWatch agent configuration on EC2, CloudTrail log analysis, and AWS Config rules with auto-remediation using SSM Automation. A solid understanding of EventBridge rules for triggering automated responses is essential.",
      keyConceptsForExam: [
        "**CloudWatch Metrics and Alarms** — metric namespaces, dimensions, alarm states (OK/ALARM/INSUFFICIENT_DATA), composite alarms",
        "**CloudWatch Logs** — log groups, log streams, metric filters, Logs Insights query syntax, subscription filters",
        "**CloudWatch Agent** — installing on EC2/on-premises, custom metrics, collectd, procstat plugin",
        "**AWS Config** — managed vs. custom rules, configuration recorder, delivery channel, conformance packs, auto-remediation with SSM",
        "**CloudTrail** — management events vs. data events, multi-region trails, log file integrity, CloudWatch Logs integration",
      ],
      examTips: [
        "CloudWatch agent is required to collect memory and disk utilization metrics — these are not available by default in EC2 metrics.",
        "AWS Config records resource configuration history; CloudTrail records API calls — know which service answers which question.",
        "For auto-remediation, AWS Config rules trigger SSM Automation documents — remember the flow: Config rule → EventBridge → SSM Automation.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "cloudwatch-deep-dive", title: "CloudWatch Deep Dive" },
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 — Elastic Compute Cloud" },
      ],
      sections: [
        {
          heading: "CloudWatch Monitoring Architecture",
          body: "CloudWatch collects metrics from AWS services automatically (basic monitoring every 5 minutes, detailed every 1 minute with additional cost). For custom metrics and in-guest data, install the **CloudWatch Agent** on EC2 or on-premises servers.\n\nCloudWatch Logs centralizes log ingestion. Use **metric filters** to extract numeric data from log lines and create alarms. **Logs Insights** provides a query language for ad-hoc analysis. **Subscription filters** forward logs in real time to Lambda, Kinesis Data Streams, or Kinesis Firehose for further processing.",
          code: {
            lang: "bash",
            label: "Install and configure CloudWatch Agent on EC2",
            snippet: `# Install agent
sudo yum install amazon-cloudwatch-agent -y

# Create config and start
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent`,
          },
        },
        {
          heading: "AWS Config Rules and Auto-Remediation",
          body: "AWS Config continuously evaluates resource configurations against desired-state rules. **Managed rules** are pre-built (e.g., `encrypted-volumes`, `restricted-ssh`). **Custom rules** use Lambda functions for complex evaluations.\n\nAuto-remediation links a Config rule to an **SSM Automation document**. When a resource is non-compliant, Config can automatically invoke the document to fix the issue — for example, stopping an EC2 instance with a public IP or encrypting an unencrypted EBS volume.",
        },
      ],
      quiz: [
        {
          id: "soa-d1-q1",
          question:
            "An EC2 instance's memory utilization is not appearing in CloudWatch Metrics. What is the MOST likely cause?",
          options: [
            "A) CloudWatch does not support memory metrics for EC2.",
            "B) The CloudWatch agent is not installed and configured on the instance.",
            "C) Detailed monitoring is not enabled on the instance.",
            "D) The IAM role attached to the instance lacks cloudwatch:PutMetricData permission.",
          ],
          correctIndex: 1,
          explanation:
            "Memory and disk utilization are in-guest metrics not collected by the EC2 hypervisor. The CloudWatch agent must be installed and configured to publish these custom metrics. Detailed monitoring (C) increases frequency for hypervisor-level metrics only, not memory. Option D would prevent publishing but the agent also needs to be installed first.",
        },
        {
          id: "soa-d1-q2",
          question:
            "A SysOps administrator wants to receive an alert when the number of 5XX errors in an application log exceeds 10 in a 5-minute period. What combination of services achieves this?",
          options: [
            "A) CloudTrail → CloudWatch Logs → SNS topic",
            "B) CloudWatch Logs metric filter → CloudWatch Alarm → SNS topic",
            "C) AWS Config rule → EventBridge → SNS topic",
            "D) CloudWatch Events → Lambda → CloudWatch Metrics",
          ],
          correctIndex: 1,
          explanation:
            "A CloudWatch Logs metric filter extracts the 5XX count from log data and creates a custom metric. A CloudWatch Alarm evaluates the metric and triggers an SNS notification when the threshold is breached. CloudTrail (A) captures API events, not application logs. AWS Config (C) evaluates resource configurations, not log patterns.",
        },
        {
          id: "soa-d1-q3",
          question:
            "Which CloudWatch Alarm state indicates that insufficient data has been received to evaluate the alarm condition?",
          options: [
            "A) OK",
            "B) ALARM",
            "C) INSUFFICIENT_DATA",
            "D) PENDING",
          ],
          correctIndex: 2,
          explanation:
            "INSUFFICIENT_DATA is the alarm state when there is not enough metric data to determine whether the threshold has been breached. This commonly occurs when a new alarm is created or when metrics stop flowing. OK means the metric is within the threshold; ALARM means the threshold has been breached.",
        },
        {
          id: "soa-d1-q4",
          question:
            "An administrator needs to ensure that all EBS volumes created in the account are encrypted. Which combination achieves continuous compliance with automatic remediation?",
          options: [
            "A) SCP denying ec2:CreateVolume without encryption parameter.",
            "B) AWS Config rule `encrypted-volumes` with SSM Automation document for auto-remediation.",
            "C) CloudTrail data event monitoring with Lambda to delete unencrypted volumes.",
            "D) IAM policy denying CreateVolume on all users.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Config `encrypted-volumes` detects non-compliant volumes, and SSM Automation can auto-remediate by creating an encrypted snapshot and replacing the volume. SCPs (A) are preventive and don't remediate existing volumes. CloudTrail with Lambda (C) is reactive but deleting volumes is destructive and risky.",
        },
        {
          id: "soa-d1-q5",
          question:
            "A company wants to analyze CloudWatch Logs data to find the top 10 IP addresses making requests to their application. Which tool should they use?",
          options: [
            "A) CloudWatch Metrics",
            "B) CloudWatch Logs Insights",
            "C) AWS CloudTrail Lake",
            "D) Amazon Athena",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Logs Insights provides a query language to analyze log data directly within CloudWatch. You can write queries to extract, filter, aggregate, and sort log data. CloudWatch Metrics (A) shows numeric data over time, not log content analysis. CloudTrail Lake (C) is for analyzing CloudTrail events.",
        },
        {
          id: "soa-d1-q6",
          question:
            "A CloudTrail trail is configured in us-east-1. The security team requires API activity from all regions to be captured. What must be done?",
          options: [
            "A) Create separate trails in each region.",
            "B) Enable the trail as a multi-region trail.",
            "C) Use AWS Config to capture cross-region API calls.",
            "D) Enable CloudWatch Logs integration for each region.",
          ],
          correctIndex: 1,
          explanation:
            "Enabling multi-region trail captures management events from all AWS regions and delivers them to a single S3 bucket. Creating individual trails per region (A) is unnecessary and more costly. AWS Config (C) records resource configurations, not API calls. CloudWatch Logs integration (D) is for log forwarding, not multi-region coverage.",
        },
        {
          id: "soa-d1-q7",
          question:
            "An application generates custom metrics. The SysOps administrator wants to create a single alarm that triggers only when BOTH CPU utilization is above 80% AND memory utilization is above 90%. What should they use?",
          options: [
            "A) A single CloudWatch Alarm with two metric conditions.",
            "B) A CloudWatch Composite Alarm combining two child alarms.",
            "C) An EventBridge rule matching both metrics.",
            "D) An AWS Config rule with two conditions.",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Composite Alarms allow you to combine multiple alarms using logical AND/OR operators. This reduces alarm noise by ensuring only meaningful combinations trigger notifications. A single CloudWatch Alarm (A) can only evaluate one metric. EventBridge (C) and Config (D) are not designed for metric threshold evaluation.",
        },
        {
          id: "soa-d1-q8",
          question:
            "Which AWS Config feature allows an administrator to package and deploy a set of Config rules across an entire AWS Organization?",
          options: [
            "A) Config Aggregator",
            "B) Conformance Packs",
            "C) Config Delivery Channel",
            "D) AWS Security Hub",
          ],
          correctIndex: 1,
          explanation:
            "Conformance Packs are collections of AWS Config rules and remediation actions that can be deployed across an organization from a single place. Config Aggregator (A) collects configuration and compliance data across accounts but doesn't deploy rules. Delivery Channel (C) specifies where Config data is delivered.",
        },
        {
          id: "soa-d1-q9",
          question:
            "A SysOps administrator wants to forward application logs from CloudWatch Logs to an Amazon OpenSearch Service domain in near-real-time for analysis. What is the correct approach?",
          options: [
            "A) Configure a CloudWatch Logs export task to OpenSearch.",
            "B) Create a CloudWatch Logs subscription filter that streams to Kinesis Data Firehose, which delivers to OpenSearch.",
            "C) Use AWS Glue to extract logs and load them into OpenSearch.",
            "D) Enable CloudTrail integration with OpenSearch.",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Logs subscription filters can stream log data in near-real-time to Kinesis Data Firehose, which natively integrates with OpenSearch Service. Export tasks (A) are batch operations and not real-time. AWS Glue (C) is for ETL batch processing. CloudTrail integration (D) is unrelated to application log forwarding.",
        },
        {
          id: "soa-d1-q10",
          question:
            "A company wants to verify the integrity of CloudTrail log files to ensure they have not been tampered with. Which feature should they enable?",
          options: [
            "A) CloudTrail Insights",
            "B) CloudTrail log file integrity validation",
            "C) S3 Object Lock on the CloudTrail bucket",
            "D) AWS Config managed rule `cloudtrail-enabled`",
          ],
          correctIndex: 1,
          explanation:
            "CloudTrail log file integrity validation creates a digest file for each hour of log delivery, digitally signed using SHA-256. You can use the AWS CLI to validate that log files have not been modified, deleted, or forged. CloudTrail Insights (A) detects unusual API activity patterns. S3 Object Lock (C) prevents deletion but doesn't verify integrity.",
        },
      ],
    },

    // ─── Domain 2: Reliability and Business Continuity (16%) ───────────────
    {
      id: "domain-2",
      title: "Reliability and Business Continuity",
      weight: "16%",
      order: 2,
      summary:
        "This domain covers ensuring high availability, fault tolerance, and disaster recovery of AWS workloads. Topics include RDS Multi-AZ, Elastic Load Balancing health checks, Auto Scaling policies, and backup strategies.\n\nExpect questions on RPO/RTO trade-offs, choosing between Multi-AZ vs. read replicas, ELB health check configuration, and AWS Backup. You must understand how Auto Scaling groups maintain desired capacity and respond to health check failures.",
      keyConceptsForExam: [
        "**RDS Multi-AZ** — synchronous standby replica in another AZ, automatic failover, no read traffic on standby",
        "**ELB Health Checks** — HTTP/HTTPS health checks, healthy/unhealthy threshold, deregistration delay",
        "**Auto Scaling Policies** — target tracking, step scaling, scheduled scaling, predictive scaling",
        "**AWS Backup** — centralized backup, backup vaults, backup plans, cross-account/cross-region backup",
        "**DR Strategies** — backup & restore, pilot light, warm standby, multi-site active-active and their RTO/RPO implications",
      ],
      examTips: [
        "RDS Multi-AZ standby cannot serve read traffic — for read scaling, use read replicas. This distinction is frequently tested.",
        "ELB deregistration delay allows in-flight requests to complete before an instance is deregistered — set lower values for faster scale-in.",
        "For RPO near-zero requirements, consider synchronous replication (Multi-AZ, Global Databases) over asynchronous (read replicas, cross-region).",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 — Elastic Compute Cloud" },
        { cloud: "aws", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
      ],
      sections: [
        {
          heading: "RDS High Availability and Failover",
          body: "RDS Multi-AZ deploys a synchronous standby replica in a different Availability Zone. In a failure event, AWS automatically promotes the standby within 60–120 seconds and updates the DNS CNAME — applications reconnect using the same endpoint.\n\n**Read replicas** use asynchronous replication and can be promoted to standalone instances during DR. They can be created in the same region, cross-region, or as Aurora global database secondaries. Unlike Multi-AZ standbys, read replicas can serve read traffic, reducing load on the primary.",
        },
        {
          heading: "Auto Scaling and ELB Health Checks",
          body: "Auto Scaling groups use health checks to determine instance health. When an instance fails an EC2 status check or ELB health check, the ASG terminates and replaces it. Configure **ELB health checks** on the ASG to leverage application-level health, not just EC2 instance checks.\n\n**Target tracking scaling** automatically adjusts capacity to maintain a target metric (e.g., 50% CPU). **Step scaling** triggers specific scaling actions at different threshold bands. **Predictive scaling** uses ML to forecast demand and pre-scales ahead of expected load spikes.",
        },
      ],
      quiz: [
        {
          id: "soa-d2-q1",
          question:
            "An RDS Multi-AZ deployment fails over to the standby. Which application change is required to reconnect?",
          options: [
            "A) Update the connection string to the new IP address of the standby.",
            "B) No change is required — the DNS endpoint is updated automatically.",
            "C) Switch to the read replica endpoint.",
            "D) Reboot the application to flush the DNS cache.",
          ],
          correctIndex: 1,
          explanation:
            "During an RDS Multi-AZ failover, AWS updates the DNS CNAME record to point to the new primary (former standby). Applications using the RDS endpoint (not a hardcoded IP) will reconnect automatically after the DNS TTL expires. No connection string change is needed.",
        },
        {
          id: "soa-d2-q2",
          question:
            "A company's RTO requirement is 1 hour and RPO is 4 hours for a non-critical workload. What is the MOST cost-effective DR strategy?",
          options: [
            "A) Multi-site active-active",
            "B) Warm standby",
            "C) Pilot light",
            "D) Backup and restore",
          ],
          correctIndex: 3,
          explanation:
            "Backup and restore is the lowest-cost DR strategy. With RPO of 4 hours (backups every 4 hours) and RTO of 1 hour (restore time), this approach meets the requirements. Multi-site (A) and warm standby (B) cost significantly more. Pilot light (C) maintains core services running but is more expensive than pure backup-restore.",
        },
        {
          id: "soa-d2-q3",
          question:
            "An Auto Scaling group uses only EC2 health checks. Instances with failing application health are not being replaced. What change should be made?",
          options: [
            "A) Add an ELB health check to the Auto Scaling group.",
            "B) Reduce the health check grace period.",
            "C) Enable CloudWatch detailed monitoring.",
            "D) Configure an SNS notification for instance unhealthy state.",
          ],
          correctIndex: 0,
          explanation:
            "EC2 health checks only detect hypervisor-level failures. To detect application-level failures, add ELB health checks to the ASG. When an instance fails the ELB health check, the ASG terminates and replaces it. Reducing the grace period (B) affects how quickly checks start after launch, not whether application health is checked.",
        },
        {
          id: "soa-d2-q4",
          question:
            "An administrator needs to automate daily snapshots of EBS volumes across multiple AWS accounts and retain them for 90 days. What is the BEST approach?",
          options: [
            "A) Write a Lambda function with a CloudWatch Events schedule in each account.",
            "B) Use AWS Backup with a cross-account backup plan and a 90-day retention lifecycle.",
            "C) Enable EC2 Instance Scheduler for all accounts.",
            "D) Configure EBS snapshot lifecycle policies individually in each account.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Backup provides centralized, policy-driven backup across accounts and services. A backup plan with a 90-day lifecycle rule automates retention. Cross-account backup copies can be configured via backup vaults. Lambda (A) and per-account snapshot policies (D) work but require more management overhead.",
        },
        {
          id: "soa-d2-q5",
          question:
            "A company hosts a stateless web application behind an ALB. During scale-in events, users experience errors because in-flight requests are terminated. What should be adjusted?",
          options: [
            "A) Increase the ALB idle timeout.",
            "B) Increase the deregistration delay on the target group.",
            "C) Enable sticky sessions on the target group.",
            "D) Configure a connection draining policy on the ASG.",
          ],
          correctIndex: 1,
          explanation:
            "The ALB deregistration delay (default 300 seconds) allows in-flight requests to complete before an instance is fully deregistered. Increasing this value gives more time for active connections to finish. Sticky sessions (C) would worsen scale-in by pinning users to instances. Increasing idle timeout (A) affects idle connections, not in-flight requests.",
        },
        {
          id: "soa-d2-q6",
          question:
            "An Aurora MySQL cluster must survive an entire AWS Region failure with minimal data loss. What feature should be configured?",
          options: [
            "A) Aurora Multi-AZ with 3 read replicas",
            "B) Aurora Global Database with a secondary region",
            "C) RDS automated backups with cross-region copy",
            "D) Aurora Serverless v2 with multi-region deployment",
          ],
          correctIndex: 1,
          explanation:
            "Aurora Global Database replicates data to a secondary region with typical replication lag under 1 second. In a regional failure, the secondary can be promoted to primary. Multi-AZ (A) only protects within a single region. Automated backups with cross-region copy (C) have much higher RPO (hours, not seconds).",
        },
        {
          id: "soa-d2-q7",
          question:
            "An Auto Scaling group is not launching new instances despite average CPU utilization exceeding the target tracking policy threshold. What is the MOST likely cause?",
          options: [
            "A) The maximum capacity of the ASG equals the current number of instances.",
            "B) Detailed monitoring is not enabled.",
            "C) The cooldown period for scale-out has not expired.",
            "D) The AMI used by the launch template is no longer available.",
          ],
          correctIndex: 0,
          explanation:
            "If the ASG maximum capacity equals the current instance count, Auto Scaling cannot launch additional instances. This is the most common reason for scaling not working despite high utilization. Target tracking respects the maximum capacity limit. The cooldown period (C) applies between scaling actions, not when already at max.",
        },
        {
          id: "soa-d2-q8",
          question:
            "An ELB target group health check is configured to check `/health` every 30 seconds. An instance responds with HTTP 500 to the health check. After how many failed checks does the ALB mark the instance as unhealthy with the default configuration?",
          options: [
            "A) 2 checks",
            "B) 3 checks",
            "C) 5 checks",
            "D) 10 checks",
          ],
          correctIndex: 1,
          explanation:
            "The default unhealthy threshold for ALB target groups is 3 consecutive failed health checks. After 3 failures (3 × 30 = 90 seconds with default settings), the instance is marked unhealthy and removed from rotation. The healthy threshold (to re-add an instance) is also 3 by default.",
        },
        {
          id: "soa-d2-q9",
          question:
            "A company wants to test the resilience of their application by randomly terminating EC2 instances in production. Which AWS service supports this practice?",
          options: [
            "A) AWS Fault Injection Simulator (FIS)",
            "B) AWS Systems Manager Automation",
            "C) Amazon Inspector",
            "D) AWS Trusted Advisor",
          ],
          correctIndex: 0,
          explanation:
            "AWS Fault Injection Simulator (FIS) is purpose-built for chaos engineering. It can inject faults including EC2 instance termination, CPU stress, network latency, and more. Systems Manager Automation (B) can terminate instances but is not designed for chaos engineering experiments. Inspector (C) is for vulnerability scanning.",
        },
        {
          id: "soa-d2-q10",
          question:
            "An administrator uses AWS Backup to create daily backups of an RDS instance. The backup completion notification is needed. What is the BEST approach?",
          options: [
            "A) Enable CloudTrail logging for AWS Backup API calls.",
            "B) Create an EventBridge rule for AWS Backup job state change events and route to SNS.",
            "C) Configure a CloudWatch Alarm on the backup duration metric.",
            "D) Use AWS Config to detect completed backup jobs.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Backup publishes job state change events to EventBridge. Creating an EventBridge rule that matches `BACKUP_JOB_COMPLETED` events and routes them to an SNS topic provides near-real-time notifications. CloudTrail (A) captures API calls but is not designed for operational notifications. CloudWatch (C) can alarm on metrics but not backup completion events directly.",
        },
      ],
    },

    // ─── Domain 3: Deployment, Provisioning, and Automation (18%) ───────────────
    {
      id: "domain-3",
      title: "Deployment, Provisioning, and Automation",
      weight: "18%",
      order: 3,
      summary:
        "This domain covers automating the deployment and management of AWS infrastructure. Key services include CloudFormation for IaC, AWS Systems Manager for operational tasks, and Elastic Beanstalk for application deployment.\n\nExpect questions on CloudFormation stack updates, change sets, drift detection, and stack policies. Systems Manager topics include Run Command, Patch Manager, Session Manager, and Parameter Store. You must understand deployment strategies like rolling, blue/green, and immutable.",
      keyConceptsForExam: [
        "**CloudFormation** — stack creation/update, change sets, rollback triggers, stack policies, cross-stack references via Outputs/Imports",
        "**Systems Manager Run Command** — run scripts on EC2 fleets without SSH, IAM permissions, command documents",
        "**Systems Manager Patch Manager** — patch baselines, patch groups, maintenance windows, compliance reporting",
        "**Parameter Store vs. Secrets Manager** — Parameter Store for config/non-secrets (free tier), Secrets Manager for rotation",
        "**Elastic Beanstalk deployment policies** — all-at-once, rolling, rolling with additional batch, immutable, traffic splitting",
      ],
      examTips: [
        "CloudFormation change sets let you preview changes before executing — use them to avoid unintended resource replacements.",
        "Systems Manager Session Manager provides shell access to EC2 instances without SSH keys or bastion hosts — no inbound port 22 needed.",
        "Elastic Beanstalk immutable deployments launch new instances in a new ASG, providing the safest rollback path for updates.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 — Elastic Compute Cloud" },
        { cloud: "aws", topicId: "iam-deep-dive", title: "IAM Deep Dive" },
      ],
      sections: [
        {
          heading: "CloudFormation Stack Management",
          body: "CloudFormation manages resources as a stack. **Change sets** preview how a stack update will modify resources before execution — critical for catching unintended replacements. **Stack policies** prevent specific resources from being updated or replaced.\n\n**Drift detection** identifies resources that have been manually modified outside CloudFormation. When drift is detected, you can either reconcile the template to match actual state or remediate the resource to match the template.\n\nFor multi-account/multi-region deployments, **StackSets** deploy stacks across accounts and regions from a central management account.",
          code: {
            lang: "bash",
            label: "Create and execute a CloudFormation change set",
            snippet: `# Create change set
aws cloudformation create-change-set \\
  --stack-name my-stack \\
  --change-set-name my-update \\
  --template-body file://updated-template.yaml \\
  --parameters ParameterKey=Env,ParameterValue=prod

# Review changes
aws cloudformation describe-change-set \\
  --stack-name my-stack \\
  --change-set-name my-update

# Execute after review
aws cloudformation execute-change-set \\
  --stack-name my-stack \\
  --change-set-name my-update`,
          },
        },
        {
          heading: "Systems Manager for Operational Automation",
          body: "**Run Command** executes scripts and commands on EC2 instances or on-premises servers using SSM documents. No SSH access or bastion host is required — only the SSM agent and IAM permissions.\n\n**Patch Manager** automates OS and application patching. Patch baselines define approved patches; patch groups tag instances to baselines; maintenance windows schedule patching operations.\n\n**Session Manager** provides secure browser-based and CLI shell access without inbound security group rules. Sessions are logged to CloudWatch Logs or S3 for auditing.",
        },
      ],
      quiz: [
        {
          id: "soa-d3-q1",
          question:
            "A CloudFormation update is about to replace an RDS database instance, which would cause data loss. What can prevent the update from proceeding?",
          options: [
            "A) Enable CloudFormation termination protection on the stack.",
            "B) Create a stack policy that prevents updates to the RDS resource.",
            "C) Use a change set and cancel it after reviewing the changes.",
            "D) Add a DeletionPolicy: Retain to the RDS resource.",
          ],
          correctIndex: 1,
          explanation:
            "A stack policy is a JSON document that defines which resources can be updated. Setting a Deny statement on the RDS resource prevents CloudFormation from replacing it. Termination protection (A) prevents stack deletion, not resource updates. DeletionPolicy: Retain (D) prevents deletion but not replacement during an update.",
        },
        {
          id: "soa-d3-q2",
          question:
            "An administrator needs to run a shell script on 500 EC2 instances simultaneously without SSH access. Which Systems Manager feature is appropriate?",
          options: [
            "A) Systems Manager Session Manager",
            "B) Systems Manager Run Command",
            "C) Systems Manager Automation",
            "D) Systems Manager State Manager",
          ],
          correctIndex: 1,
          explanation:
            "Run Command executes commands or scripts on a fleet of instances via SSM documents. It supports targeting by instance IDs, tags, or resource groups. No SSH or bastion host is needed. Session Manager (A) provides interactive shell sessions. Automation (C) orchestrates multi-step workflows, not one-time script execution.",
        },
        {
          id: "soa-d3-q3",
          question:
            "An Elastic Beanstalk deployment must update instances without reducing capacity below 100% during the deployment. Which deployment policy should be used?",
          options: [
            "A) All-at-once",
            "B) Rolling",
            "C) Rolling with additional batch",
            "D) Immutable",
          ],
          correctIndex: 2,
          explanation:
            "Rolling with additional batch launches a new batch of instances before updating existing ones, ensuring capacity never drops below 100%. Standard rolling (B) reduces capacity during updates. All-at-once (A) deploys to all instances simultaneously, causing downtime. Immutable (D) also maintains 100% capacity but is slower and costlier.",
        },
        {
          id: "soa-d3-q4",
          question:
            "A CloudFormation stack has drifted. A VPC security group rule was manually added outside of CloudFormation. What action should the administrator take?",
          options: [
            "A) Delete and recreate the stack.",
            "B) Update the CloudFormation template to include the manually added rule, then update the stack.",
            "C) Run drift detection again to auto-correct the drift.",
            "D) Use AWS Config to automatically remediate the drift.",
          ],
          correctIndex: 1,
          explanation:
            "After drift detection identifies the change, the correct response is to either: (1) update the template to match the actual resource and re-deploy, or (2) remediate the resource to match the template. CloudFormation drift detection is read-only — it detects but does not correct drift. AWS Config (D) can detect configuration changes but does not correct CloudFormation drift.",
        },
        {
          id: "soa-d3-q5",
          question:
            "Which Systems Manager feature automatically applies patches to EC2 instances based on a schedule and patch baseline?",
          options: [
            "A) Systems Manager Run Command with AWS-RunPatchBaseline document",
            "B) Systems Manager Patch Manager with a maintenance window",
            "C) AWS Config rule for patch compliance",
            "D) Amazon Inspector with automated remediation",
          ],
          correctIndex: 1,
          explanation:
            "Systems Manager Patch Manager, configured with maintenance windows and patch baselines, automates the patching schedule. Patch groups associate instances with specific baselines. The maintenance window triggers the patching operation at the defined schedule. Run Command (A) applies patches on-demand rather than scheduled.",
        },
        {
          id: "soa-d3-q6",
          question:
            "A CloudFormation stack references an S3 bucket name output from another stack. Which CloudFormation feature enables this cross-stack reference?",
          options: [
            "A) Stack parameters",
            "B) CloudFormation Exports and Fn::ImportValue",
            "C) CloudFormation Mappings",
            "D) CloudFormation Conditions",
          ],
          correctIndex: 1,
          explanation:
            "CloudFormation Outputs with an Export name make values available to other stacks. The consuming stack uses `Fn::ImportValue` to reference the exported value. Parameters (A) are for user-provided values at deploy time. Mappings (C) are for static lookup tables. Conditions (D) control resource creation based on parameter values.",
        },
        {
          id: "soa-d3-q7",
          question:
            "An administrator wants to deploy the same CloudFormation stack across 10 AWS accounts in an organization. What is the MOST efficient approach?",
          options: [
            "A) Copy the template to each account and deploy manually.",
            "B) Use CloudFormation StackSets from the management account.",
            "C) Use AWS CodePipeline with cross-account roles.",
            "D) Share the template via S3 and deploy via CLI in each account.",
          ],
          correctIndex: 1,
          explanation:
            "CloudFormation StackSets deploy stacks to multiple accounts and regions from a single management account. With AWS Organizations integration (SERVICE_MANAGED permissions), new accounts in the organization automatically receive the stack. This is far more scalable than per-account deployments.",
        },
        {
          id: "soa-d3-q8",
          question:
            "A company stores database passwords in Systems Manager Parameter Store as SecureString parameters. An application needs to retrieve these at runtime. What must the EC2 instance have?",
          options: [
            "A) An IAM role with ssm:GetParameter permission and access to the KMS key used for encryption.",
            "B) An EC2 key pair configured in the launch template.",
            "C) VPC endpoint for SSM and public internet access.",
            "D) AWS CLI version 2 installed on the instance.",
          ],
          correctIndex: 0,
          explanation:
            "SecureString parameters are encrypted with KMS. To retrieve them, the IAM role needs `ssm:GetParameter` (or `ssm:GetParameters`) permission and `kms:Decrypt` permission on the encrypting KMS key. EC2 key pairs (B) are for SSH access. A VPC endpoint for SSM is helpful but not strictly required if the instance has internet access.",
        },
        {
          id: "soa-d3-q9",
          question:
            "An administrator needs to provide shell access to EC2 instances in private subnets without opening port 22 or using a bastion host. Which solution meets this requirement?",
          options: [
            "A) AWS Systems Manager Session Manager",
            "B) EC2 Instance Connect",
            "C) AWS Direct Connect",
            "D) VPN with SSH tunneling",
          ],
          correctIndex: 0,
          explanation:
            "Session Manager provides browser-based and CLI shell access to EC2 instances using the SSM agent without requiring any inbound ports, bastion hosts, or SSH keys. Sessions can be logged for auditing. EC2 Instance Connect (B) still uses SSH (port 22). Direct Connect (C) is a dedicated network connection, not a shell access solution.",
        },
        {
          id: "soa-d3-q10",
          question:
            "A CloudFormation template creates an EC2 instance. After a failed stack update, the instance is in an error state. CloudFormation is attempting to roll back but the rollback also fails. What action should the administrator take?",
          options: [
            "A) Delete the stack and manually clean up resources.",
            "B) Use the ContinueUpdateRollback API to resume the rollback, skipping the failed resource if needed.",
            "C) Disable termination protection and re-attempt the update.",
            "D) Create a new stack with a different name.",
          ],
          correctIndex: 1,
          explanation:
            "When a CloudFormation rollback fails, the `ContinueUpdateRollback` API allows the rollback to resume. You can specify resources to skip if they cannot be rolled back. This returns the stack to a stable state. Deleting and recreating (A and D) may cause unnecessary data loss and configuration drift.",
        },
      ],
    },

    // ─── Domain 4: Security and Compliance (16%) ───────────────
    {
      id: "domain-4",
      title: "Security and Compliance",
      weight: "16%",
      order: 4,
      summary:
        "This domain tests knowledge of implementing security controls and maintaining compliance in AWS environments. Topics include IAM policy management, AWS Security Hub, GuardDuty, Macie, and AWS Config for compliance.\n\nExpect questions on the shared responsibility model, S3 bucket security configurations, VPC security controls, and implementing detective/preventive/responsive security controls. Understanding security service integrations is key.",
      keyConceptsForExam: [
        "**GuardDuty** — threat detection using ML, analyzes CloudTrail, VPC Flow Logs, DNS logs; findings trigger EventBridge",
        "**Security Hub** — aggregates findings from GuardDuty, Inspector, Macie, Config; ASFF standard; custom actions",
        "**Macie** — discovers and protects sensitive data in S3 using ML; PII, financial data detection",
        "**IAM Access Analyzer** — identifies resources shared with external entities; reachability analysis for policies",
        "**AWS Shield and WAF** — Shield Standard (free) vs. Advanced, WAF rules for SQL injection/XSS, rate limiting",
      ],
      examTips: [
        "GuardDuty does not need agents — it analyzes existing AWS logs (CloudTrail, VPC Flow Logs, DNS) without impacting your workloads.",
        "Security Hub findings use the AWS Security Finding Format (ASFF) — this standardizes findings from multiple services.",
        "IAM Access Analyzer identifies over-permissive policies — use it to enforce least-privilege by finding unused permissions.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "iam-deep-dive", title: "IAM Deep Dive" },
        { cloud: "aws", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
      ],
      sections: [
        {
          heading: "Threat Detection and Compliance Monitoring",
          body: "**Amazon GuardDuty** uses ML to analyze CloudTrail management and data events, VPC Flow Logs, and Route 53 DNS query logs to identify threats like compromised instances, reconnaissance activity, and cryptocurrency mining. GuardDuty findings trigger EventBridge rules for automated response.\n\n**AWS Security Hub** aggregates findings from GuardDuty, Amazon Inspector, Amazon Macie, AWS Config, and third-party tools into a single dashboard. Security Hub uses the **AWS Security Finding Format (ASFF)** as a standard. You can run security standards like CIS AWS Foundations Benchmark and AWS Foundational Security Best Practices.",
        },
        {
          heading: "S3 Security Controls",
          body: "S3 security involves multiple overlapping controls: bucket policies (resource-based), ACLs (legacy), IAM policies (identity-based), and Block Public Access settings. **Block Public Access** settings at the account level override any bucket or object ACL that would allow public access.\n\nFor sensitive data, enable **Amazon Macie** to automatically discover and classify S3 objects. Enable **S3 Object Lock** with WORM (Write Once Read Many) for regulatory compliance. Use **VPC endpoints** for S3 to keep data access within the AWS network.",
        },
      ],
      quiz: [
        {
          id: "soa-d4-q1",
          question:
            "Amazon GuardDuty has detected a finding for an EC2 instance communicating with a known cryptocurrency mining pool. What is the FIRST action the administrator should take?",
          options: [
            "A) Terminate the instance immediately.",
            "B) Isolate the instance by changing its security group to deny all traffic, then investigate.",
            "C) Disable GuardDuty to prevent false positives.",
            "D) Enable Amazon Inspector on the instance.",
          ],
          correctIndex: 1,
          explanation:
            "The first step is to isolate the potentially compromised instance to prevent further damage while preserving evidence for investigation. Changing the security group to deny all traffic achieves this without destroying the instance. Terminating immediately (A) destroys forensic evidence. Disabling GuardDuty (C) would remove threat detection capability.",
        },
        {
          id: "soa-d4-q2",
          question:
            "A company needs to identify all S3 buckets that are publicly accessible across the organization. Which combination of services provides this?",
          options: [
            "A) AWS Trusted Advisor and CloudTrail",
            "B) AWS Config with the `s3-bucket-public-read-prohibited` rule and Security Hub",
            "C) Amazon Macie and GuardDuty",
            "D) IAM Access Analyzer and CloudWatch",
          ],
          correctIndex: 1,
          explanation:
            "AWS Config rule `s3-bucket-public-read-prohibited` evaluates all S3 buckets and identifies non-compliant (publicly accessible) ones. Security Hub aggregates these findings organization-wide. IAM Access Analyzer (D) also identifies publicly accessible S3 buckets but through policy analysis. Macie (C) focuses on sensitive data, not public access configuration.",
        },
        {
          id: "soa-d4-q3",
          question:
            "Which AWS service uses ML to automatically discover and classify sensitive data such as PII stored in S3 buckets?",
          options: [
            "A) Amazon GuardDuty",
            "B) AWS Security Hub",
            "C) Amazon Macie",
            "D) Amazon Inspector",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Macie uses ML to automatically discover, classify, and protect sensitive data in S3. It identifies PII, financial data, credentials, and other sensitive information. GuardDuty (A) detects security threats. Security Hub (B) aggregates findings. Inspector (D) scans EC2 instances and container images for vulnerabilities.",
        },
        {
          id: "soa-d4-q4",
          question:
            "An administrator needs to automatically revoke any IAM user access key that has not been rotated in more than 90 days. What is the BEST approach?",
          options: [
            "A) AWS Config rule `access-keys-rotated` with SSM Automation remediation to deactivate old keys.",
            "B) CloudTrail monitoring with Lambda to delete old access keys.",
            "C) IAM password policy with a 90-day maximum age.",
            "D) Security Hub standard check for access key rotation.",
          ],
          correctIndex: 0,
          explanation:
            "AWS Config managed rule `access-keys-rotated` evaluates IAM user access keys and flags those not rotated within the specified interval. With auto-remediation via SSM Automation, old keys can be automatically deactivated. IAM password policy (C) applies to console passwords, not access keys.",
        },
        {
          id: "soa-d4-q5",
          question:
            "A company wants to prevent all new S3 buckets from being made public across the entire AWS Organization. What is the MOST efficient approach?",
          options: [
            "A) Apply S3 Block Public Access settings to each bucket manually.",
            "B) Use an SCP that denies s3:PutBucketPublicAccessBlock with a False value.",
            "C) Enable S3 Block Public Access at the account level in each account.",
            "D) Use AWS Config auto-remediation to remove public access from new buckets.",
          ],
          correctIndex: 2,
          explanation:
            "Enabling S3 Block Public Access at the account level prevents any bucket or object in that account from being made public, regardless of individual bucket settings. To apply this organization-wide efficiently, use AWS CloudFormation StackSets or an SCP to enforce account-level Block Public Access. Config auto-remediation (D) is reactive, not preventive.",
        },
        {
          id: "soa-d4-q6",
          question:
            "Which AWS service can identify whether an IAM role's trust policy allows external AWS accounts to assume it?",
          options: [
            "A) Amazon GuardDuty",
            "B) AWS IAM Access Analyzer",
            "C) AWS Security Hub",
            "D) Amazon Inspector",
          ],
          correctIndex: 1,
          explanation:
            "IAM Access Analyzer identifies resources (IAM roles, S3 buckets, KMS keys, etc.) that are shared with external principals outside the defined zone of trust (account or organization). It flags IAM roles with cross-account trust policies as findings. GuardDuty (A) detects threats from actual usage patterns, not policy analysis.",
        },
        {
          id: "soa-d4-q7",
          question:
            "A security team wants a single dashboard showing security findings from GuardDuty, Inspector, and Macie across all accounts in the organization. What should they use?",
          options: [
            "A) CloudWatch dashboards with cross-account metrics",
            "B) AWS Security Hub with AWS Organizations integration",
            "C) AWS Config conformance packs",
            "D) Amazon Detective",
          ],
          correctIndex: 1,
          explanation:
            "AWS Security Hub aggregates security findings from GuardDuty, Inspector, Macie, and other services using the AWS Security Finding Format. With AWS Organizations integration, it provides a single pane of glass across all accounts. Amazon Detective (D) is for investigating security incidents, not aggregating findings.",
        },
        {
          id: "soa-d4-q8",
          question:
            "A company is running an internet-facing web application and wants to protect against common web exploits including SQL injection and cross-site scripting. Which service should they use?",
          options: [
            "A) AWS Shield Standard",
            "B) Amazon GuardDuty",
            "C) AWS WAF",
            "D) VPC Network ACLs",
          ],
          correctIndex: 2,
          explanation:
            "AWS WAF provides web application firewall protection against SQL injection, XSS, and other OWASP Top 10 vulnerabilities. It can be attached to CloudFront, ALB, or API Gateway. Shield Standard (A) protects against DDoS attacks, not application-layer exploits. GuardDuty (B) detects threats from AWS-level logs, not HTTP request content.",
        },
        {
          id: "soa-d4-q9",
          question:
            "An EC2 instance has an attached IAM role with AdministratorAccess. The security team wants to know what permissions the instance is actually using. Which service provides this analysis?",
          options: [
            "A) AWS CloudTrail — review all API calls made by the instance role.",
            "B) IAM Access Advisor — view last accessed services for the role.",
            "C) AWS Config — review resource configuration changes.",
            "D) Amazon Inspector — scan the instance for vulnerabilities.",
          ],
          correctIndex: 1,
          explanation:
            "IAM Access Advisor shows which AWS services a principal has accessed and when, helping identify unused permissions. This supports the principle of least privilege by showing which permissions can be safely removed. CloudTrail (A) also captures API activity but requires manual analysis. Access Advisor provides the summary view needed for permission right-sizing.",
        },
        {
          id: "soa-d4-q10",
          question:
            "A CloudTrail trail is configured to log to an S3 bucket. A compliance team needs to ensure that log files cannot be deleted for 7 years. What combination achieves this?",
          options: [
            "A) Enable S3 Versioning on the CloudTrail bucket.",
            "B) Enable S3 Object Lock with Compliance mode and a 7-year retention period on the CloudTrail bucket.",
            "C) Apply an S3 lifecycle policy to archive logs to Glacier after 90 days.",
            "D) Enable MFA delete on the CloudTrail bucket.",
          ],
          correctIndex: 1,
          explanation:
            "S3 Object Lock in Compliance mode prevents objects from being deleted or overwritten during the retention period — not even the root user can override this. Versioning (A) prevents overwriting but does not prevent deletion of all versions. MFA delete (D) requires MFA for deleting specific versions but does not enforce a retention period.",
        },
      ],
    },

    // ─── Domain 5: Networking and Content Delivery (18%) ───────────────
    {
      id: "domain-5",
      title: "Networking and Content Delivery",
      weight: "18%",
      order: 5,
      summary:
        "This domain covers designing and troubleshooting AWS networking configurations. Topics include VPC architecture, Route 53 routing policies, CloudFront distributions, and Application Load Balancer configuration.\n\nExpect questions on VPC peering vs. Transit Gateway, Route 53 failover routing, CloudFront cache behaviors, and ALB listener rules. You must understand how to troubleshoot connectivity issues using VPC Flow Logs and Reachability Analyzer.",
      keyConceptsForExam: [
        "**VPC Peering vs. Transit Gateway** — peering is point-to-point non-transitive; Transit Gateway is hub-and-spoke transitive",
        "**Route 53 routing policies** — simple, weighted, latency-based, failover, geolocation, geoproximity, multivalue",
        "**CloudFront** — origins, behaviors, cache policies, origin access control (OAC) for S3, signed URLs/cookies",
        "**ALB Listener Rules** — host-based and path-based routing, redirect rules, fixed response, weighted target groups",
        "**VPC Flow Logs** — capture network traffic metadata, stored in CloudWatch Logs or S3, analyze connectivity",
      ],
      examTips: [
        "VPC peering does not support transitive routing — if VPC A peers with VPC B, and VPC B peers with VPC C, A cannot reach C through B.",
        "Route 53 failover routing requires health checks configured on the primary record — if the primary is unhealthy, traffic routes to the secondary.",
        "CloudFront Origin Access Control (OAC) replaces the older Origin Access Identity (OAI) for S3 origins — prefer OAC for new distributions.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
        { cloud: "aws", topicId: "cloudwatch-deep-dive", title: "CloudWatch Deep Dive" },
      ],
      sections: [
        {
          heading: "VPC Connectivity Options",
          body: "AWS provides several ways to connect VPCs: **VPC Peering** creates a direct network route between two VPCs (same or different accounts/regions). Peering is non-transitive — each pair requires a separate peering connection.\n\n**AWS Transit Gateway** acts as a regional hub, allowing any connected VPC or VPN to communicate with others. It supports routing tables for segmentation. For connecting on-premises networks, use **AWS Direct Connect** (dedicated private bandwidth) or **AWS Site-to-Site VPN** (encrypted IPSec tunnels over the internet).\n\n**VPC Reachability Analyzer** uses network path analysis to verify connectivity between resources without sending packets — useful for troubleshooting.",
        },
        {
          heading: "Route 53 and CloudFront",
          body: "Route 53 supports multiple **routing policies**: Simple (one record, one value), Weighted (percentage-based split), Latency-based (lowest latency region), Failover (primary/secondary), Geolocation (based on user's location), and Geoproximity (with bias).\n\nFor Route 53 failover, configure health checks on the primary endpoint. When the primary becomes unhealthy, Route 53 automatically serves the secondary record. This is the foundation of DNS-based disaster recovery.\n\n**CloudFront** accelerates content delivery by caching at edge locations. Use cache behaviors to route different URL patterns to different origins. Restrict S3 bucket access using **Origin Access Control (OAC)** so the bucket is never directly accessible.",
        },
      ],
      quiz: [
        {
          id: "soa-d5-q1",
          question:
            "A company has VPC A peered with VPC B, and VPC B peered with VPC C. Instances in VPC A cannot communicate with instances in VPC C. What is the cause?",
          options: [
            "A) VPC peering does not support cross-account connections.",
            "B) VPC peering is non-transitive — a direct peering between A and C is required.",
            "C) The route tables in VPC B are not configured correctly.",
            "D) Security groups in VPC C are blocking inbound traffic from VPC A.",
          ],
          correctIndex: 1,
          explanation:
            "VPC peering is non-transitive. Traffic cannot flow from VPC A through VPC B to reach VPC C — a direct peering connection between A and C is required. Even if route tables were configured to attempt transitive routing, AWS does not support it. Transit Gateway is the recommended solution for transitive routing.",
        },
        {
          id: "soa-d5-q2",
          question:
            "A company hosts a static website on S3 behind CloudFront. They want to ensure the S3 bucket cannot be accessed directly (only through CloudFront). What is the RECOMMENDED approach?",
          options: [
            "A) Enable S3 Block Public Access and use a bucket policy with an Origin Access Control (OAC) condition.",
            "B) Configure the S3 bucket as a website endpoint and use a custom CloudFront origin.",
            "C) Enable S3 Requester Pays and configure it in the CloudFront distribution.",
            "D) Use signed URLs for all CloudFront requests.",
          ],
          correctIndex: 0,
          explanation:
            "With Origin Access Control (OAC), CloudFront signs requests to S3 using SigV4. The S3 bucket policy allows only the CloudFront service principal. Enabling Block Public Access ensures no direct access is possible. Using a website endpoint (B) requires public access, which violates the requirement. Signed URLs (D) control who can access content but don't prevent direct S3 access.",
        },
        {
          id: "soa-d5-q3",
          question:
            "A Route 53 failover routing policy is configured with a primary record in us-east-1 and a secondary in eu-west-1. Users are still routed to the primary even though it is down. What is the MOST likely cause?",
          options: [
            "A) The secondary record does not have a health check configured.",
            "B) No health check is associated with the primary record.",
            "C) Route 53 does not support failover for non-alias records.",
            "D) The TTL on the primary record is too low.",
          ],
          correctIndex: 1,
          explanation:
            "Route 53 failover routing requires a health check associated with the primary record. Without a health check, Route 53 always considers the primary healthy and never fails over to the secondary. The secondary record's health check is optional. TTL being too low (D) would actually speed up failover, not prevent it.",
        },
        {
          id: "soa-d5-q4",
          question:
            "An ALB needs to route requests to `/api/*` to a different target group than all other requests. What feature enables this?",
          options: [
            "A) ALB host-based routing",
            "B) ALB path-based routing with listener rules",
            "C) ALB weighted target groups",
            "D) Route 53 latency-based routing",
          ],
          correctIndex: 1,
          explanation:
            "ALB listener rules support path-based routing, allowing specific URL paths (e.g., `/api/*`) to be routed to designated target groups. Host-based routing (A) routes based on the HTTP Host header (domain), not URL path. Weighted target groups (C) distribute traffic percentages, not by URL pattern.",
        },
        {
          id: "soa-d5-q5",
          question:
            "VPC Flow Logs show traffic reaching an EC2 instance (ACCEPT records) but the application is not responding. What is the MOST likely cause?",
          options: [
            "A) The security group is blocking the traffic.",
            "B) The traffic is reaching the instance but the application is not listening on the expected port.",
            "C) The NACL is blocking inbound traffic.",
            "D) The route table is missing a route to the destination.",
          ],
          correctIndex: 1,
          explanation:
            "ACCEPT records in VPC Flow Logs confirm that the network-level security controls (security groups and NACLs) allowed the traffic. Since traffic is reaching the instance, the issue is at the application layer — the application may not be running, not listening on the port, or crashing. Network-level blocks (A, C, D) would show REJECT records.",
        },
        {
          id: "soa-d5-q6",
          question:
            "A company needs to connect 20 VPCs across multiple AWS accounts so that all VPCs can communicate with each other and with an on-premises data center via a single VPN connection. What should they use?",
          options: [
            "A) VPC peering for all 20 VPCs and a separate VPN per VPC.",
            "B) AWS Transit Gateway with VPN attachment for the on-premises connection.",
            "C) AWS Direct Connect with a public virtual interface.",
            "D) AWS PrivateLink between all VPCs.",
          ],
          correctIndex: 1,
          explanation:
            "Transit Gateway serves as a regional hub connecting all VPCs and supporting a single VPN or Direct Connect attachment for on-premises connectivity. VPC peering (A) for 20 VPCs requires 190 peer connections and cannot share the VPN connection. PrivateLink (D) is for specific service endpoints, not general VPC-to-VPC routing.",
        },
        {
          id: "soa-d5-q7",
          question:
            "A CloudFront distribution serves content from an ALB origin. Content is being served stale even after updates. What is the FIRST action to take?",
          options: [
            "A) Increase the CloudFront TTL to force cache refresh.",
            "B) Create a CloudFront invalidation for the affected paths.",
            "C) Switch the origin from ALB to S3.",
            "D) Disable CloudFront caching entirely.",
          ],
          correctIndex: 1,
          explanation:
            "A CloudFront invalidation removes cached objects from edge locations before the TTL expires, forcing CloudFront to fetch fresh content from the origin on the next request. This is the standard approach for immediate cache busting. Increasing TTL (A) would make the problem worse by caching content longer.",
        },
        {
          id: "soa-d5-q8",
          question:
            "An application requires that users from specific countries are blocked from accessing content via CloudFront. What feature should be used?",
          options: [
            "A) Route 53 geolocation routing",
            "B) CloudFront geographic restrictions (geo-blocking)",
            "C) AWS WAF geo match conditions",
            "D) Both B and C are valid options",
          ],
          correctIndex: 3,
          explanation:
            "Both CloudFront geographic restrictions and AWS WAF geo match conditions can block traffic from specific countries. CloudFront geo-blocking is simpler to configure for country-based allow/deny lists. AWS WAF geo match conditions offer more flexibility, including combining with other rules. Route 53 geolocation (A) routes traffic to different origins but cannot block access entirely.",
        },
        {
          id: "soa-d5-q9",
          question:
            "An EC2 instance in a private subnet cannot reach an S3 bucket. VPC Flow Logs show no traffic to S3 from the instance. What is the MOST likely cause?",
          options: [
            "A) The S3 bucket policy is blocking access from the VPC.",
            "B) No route exists in the subnet's route table for S3 traffic — an S3 gateway endpoint or NAT Gateway is needed.",
            "C) The IAM role on the instance does not have S3 permissions.",
            "D) The security group on the instance blocks port 443 outbound.",
          ],
          correctIndex: 1,
          explanation:
            "If VPC Flow Logs show no traffic to S3, the traffic is not leaving the subnet — a routing issue. A private subnet needs either an S3 gateway endpoint (free, adds a route to the route table) or a NAT Gateway (for internet access) to reach S3. An IAM issue (C) would appear as Access Denied after the traffic reaches S3. A security group issue (D) would show REJECT in VPC Flow Logs.",
        },
        {
          id: "soa-d5-q10",
          question:
            "A company uses AWS Transit Gateway and wants to ensure that development VPCs cannot communicate with production VPCs while both can still reach the on-premises data center. What is the BEST approach?",
          options: [
            "A) Use separate Transit Gateways for dev and prod.",
            "B) Create separate route tables in the Transit Gateway for dev and prod VPC attachments.",
            "C) Use VPC peering between prod VPCs and a separate Transit Gateway for dev.",
            "D) Configure security groups on all instances to block cross-environment traffic.",
          ],
          correctIndex: 1,
          explanation:
            "Transit Gateway supports multiple route tables. By placing dev VPC attachments in one route table and prod VPC attachments in another, you can control which destinations each environment can reach. Both route tables can include routes to the on-premises VPN attachment. This is the Transit Gateway segmentation pattern.",
        },
      ],
    },

    // ─── Domain 6: Cost and Performance Optimization (12%) ───────────────
    {
      id: "domain-6",
      title: "Cost and Performance Optimization",
      weight: "12%",
      order: 6,
      summary:
        "This domain covers identifying cost-saving opportunities and improving performance of AWS workloads. Topics include Cost Explorer, AWS Budgets, Trusted Advisor, Compute Optimizer, and right-sizing recommendations.\n\nExpect questions on choosing between On-Demand, Reserved Instances, Savings Plans, and Spot Instances. You must understand S3 storage classes, CloudFront for performance optimization, and using Trusted Advisor recommendations.",
      keyConceptsForExam: [
        "**Savings Plans vs. Reserved Instances** — Savings Plans offer flexibility across instance families/regions; RIs are more rigid but offer larger discounts for specific configurations",
        "**Compute Optimizer** — ML-based right-sizing recommendations for EC2, Lambda, ECS, EBS, and Auto Scaling groups",
        "**S3 storage classes** — Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant/Flexible/Deep Archive",
        "**Spot Instances** — up to 90% cost savings, can be interrupted with 2-minute warning, suitable for fault-tolerant workloads",
        "**AWS Budgets** — cost and usage budgets with alerts, budget actions to automatically apply IAM policies or SCPs when thresholds are exceeded",
      ],
      examTips: [
        "Compute Optimizer provides right-sizing recommendations — look for it in questions about reducing over-provisioned resources.",
        "S3 Intelligent-Tiering automatically moves objects between access tiers with no retrieval fees — ideal when access patterns are unknown.",
        "AWS Budgets actions can automatically apply IAM policies or target SCP policies when budget thresholds are exceeded — this is a preventive cost control.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 — Elastic Compute Cloud" },
        { cloud: "aws", topicId: "s3-deep-dive", title: "S3 Deep Dive" },
      ],
      sections: [
        {
          heading: "Cost Visibility and Optimization Tools",
          body: "**AWS Cost Explorer** provides cost and usage visualization with filtering by service, account, tag, and time period. Use it to identify spending trends and anomalies. **AWS Budgets** sends alerts when spending exceeds thresholds and supports **budget actions** — automatically applying IAM policies or SCP policies to limit resource creation when budgets are breached.\n\n**AWS Trusted Advisor** checks your environment against AWS best practices across cost, performance, security, fault tolerance, and service limits. Key cost checks include idle EC2 instances, underutilized EBS volumes, and unassociated Elastic IPs. **AWS Compute Optimizer** uses ML to analyze CloudWatch metrics and recommend optimal instance types for EC2, Lambda, and ECS.",
        },
        {
          heading: "Purchasing Options and Storage Optimization",
          body: "Choose instance purchasing options based on workload characteristics: **On-Demand** for short-term or unpredictable workloads; **Savings Plans** (Compute or EC2 Instance) for flexible 1–3 year commitments; **Reserved Instances** for steady-state workloads with specific instance type/region needs; **Spot Instances** for fault-tolerant batch or stateless workloads.\n\nFor S3 cost optimization, use **lifecycle policies** to transition objects to cheaper storage classes over time. **S3 Intelligent-Tiering** automatically moves infrequently accessed objects to cheaper tiers without retrieval fees. Archive old data to **S3 Glacier Deep Archive** (lowest cost, 12-hour retrieval) for long-term compliance storage.",
        },
      ],
      quiz: [
        {
          id: "soa-d6-q1",
          question:
            "A company wants to reduce EC2 costs for a steady-state production workload running 24/7 for 3 years. The team wants maximum savings but can commit to a specific instance type and region. What purchasing option provides the highest discount?",
          options: [
            "A) Compute Savings Plans",
            "B) Standard Reserved Instances",
            "C) EC2 Instance Savings Plans",
            "D) Spot Instances",
          ],
          correctIndex: 1,
          explanation:
            "Standard Reserved Instances offer the highest discount (up to 72%) for a specific instance type, size, OS, and region with a 3-year term. They are less flexible than Savings Plans but provide the maximum savings for committed, stable workloads. Spot Instances (D) could save more but are not suitable for steady-state production workloads due to interruption risk.",
        },
        {
          id: "soa-d6-q2",
          question:
            "AWS Trusted Advisor reports several EC2 instances as having low CPU utilization over the past 14 days. What is the RECOMMENDED next step?",
          options: [
            "A) Immediately terminate the identified instances.",
            "B) Use AWS Compute Optimizer to get right-sizing recommendations and downsize or consolidate.",
            "C) Enable CloudWatch detailed monitoring on the instances.",
            "D) Convert the instances to Spot Instances.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Compute Optimizer provides detailed, ML-based right-sizing recommendations with projected cost savings and performance impact. After reviewing the recommendations, you can safely downsize instances that are consistently over-provisioned. Immediate termination (A) is risky without understanding the workload. Spot instances (D) may not be suitable if the workload requires availability.",
        },
        {
          id: "soa-d6-q3",
          question:
            "A company stores compliance documents in S3 that must be retained for 7 years but are rarely accessed after the first 90 days. Which lifecycle configuration minimizes cost?",
          options: [
            "A) Transition to S3 Standard-IA after 30 days, then delete after 7 years.",
            "B) Transition to S3 Standard-IA after 30 days, then to S3 Glacier Deep Archive after 90 days, with expiration after 7 years.",
            "C) Use S3 Intelligent-Tiering for all 7 years.",
            "D) Transition to S3 One Zone-IA after 90 days.",
          ],
          correctIndex: 1,
          explanation:
            "Transitioning to Standard-IA after 30 days reduces storage costs for infrequently accessed data. After 90 days (when documents are rarely accessed), moving to Glacier Deep Archive provides the lowest storage cost. Setting an expiration at 7 years automatically deletes objects to avoid unnecessary storage. One Zone-IA (D) lacks the redundancy required for compliance documents.",
        },
        {
          id: "soa-d6-q4",
          question:
            "A company wants to automatically stop all EC2 instances if monthly spending exceeds $10,000. What is the BEST approach?",
          options: [
            "A) Create a CloudWatch billing alarm that triggers a Lambda function to stop instances.",
            "B) Create an AWS Budget with a budget action that applies an IAM policy denying ec2:RunInstances when the threshold is exceeded.",
            "C) Use AWS Config rules to monitor cost and automatically stop instances.",
            "D) Configure Cost Explorer anomaly detection with an SNS notification.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Budgets actions can automatically apply IAM policies or SCPs when a cost threshold is breached. Setting a Deny policy for EC2 actions prevents new instances from launching. For stopping existing instances, the budget action can also target an SSM Automation document. Budget actions provide native, automatic cost enforcement.",
        },
        {
          id: "soa-d6-q5",
          question:
            "Which S3 storage class is MOST appropriate for data that is accessed unpredictably — sometimes frequently, sometimes rarely — where you want to avoid retrieval fees?",
          options: [
            "A) S3 Standard",
            "B) S3 Standard-IA",
            "C) S3 Intelligent-Tiering",
            "D) S3 Glacier Instant Retrieval",
          ],
          correctIndex: 2,
          explanation:
            "S3 Intelligent-Tiering automatically moves objects between frequent access, infrequent access, and archive tiers based on access patterns, with no retrieval fees. This is ideal for unpredictable access patterns. Standard-IA (B) charges retrieval fees and is best for predictably infrequent access. Standard (A) is most expensive for rarely accessed data.",
        },
        {
          id: "soa-d6-q6",
          question:
            "A company runs a batch processing job every night that takes 4 hours. The job is fault-tolerant and can be restarted from checkpoints. What instance purchasing option minimizes cost?",
          options: [
            "A) On-Demand Instances",
            "B) Reserved Instances",
            "C) Spot Instances with Spot Instance interruption handling",
            "D) Dedicated Hosts",
          ],
          correctIndex: 2,
          explanation:
            "Spot Instances can save up to 90% compared to On-Demand prices. For fault-tolerant, checkpointed batch jobs, Spot interruptions are manageable — the job simply resumes from the last checkpoint. Reserved Instances (B) require a commitment and don't save money for occasional workloads. Dedicated Hosts (D) are the most expensive option.",
        },
        {
          id: "soa-d6-q7",
          question:
            "A company has purchased 1-year Compute Savings Plans. They want to switch from c5.xlarge instances to c6g.xlarge (Graviton) instances in a different region. Will the Savings Plans discount still apply?",
          options: [
            "A) No — Compute Savings Plans are locked to specific instance types and regions.",
            "B) Yes — Compute Savings Plans apply across any EC2 instance family, region, and OS.",
            "C) Only if the instances are in us-east-1.",
            "D) Only for Linux instances.",
          ],
          correctIndex: 1,
          explanation:
            "Compute Savings Plans provide flexibility across instance families, sizes, regions, operating systems, and tenancy. They automatically apply to any eligible EC2 usage up to the committed spend amount. EC2 Instance Savings Plans are less flexible (locked to a specific instance family in a region). Standard Reserved Instances are the most rigid.",
        },
        {
          id: "soa-d6-q8",
          question:
            "Cost Explorer shows unexpectedly high CloudWatch Logs storage costs. What is the FIRST action to take?",
          options: [
            "A) Delete all CloudWatch Logs log groups.",
            "B) Review log groups for those without a retention policy and set appropriate retention periods.",
            "C) Export all logs to S3 and delete from CloudWatch.",
            "D) Switch to CloudTrail for all logging.",
          ],
          correctIndex: 1,
          explanation:
            "By default, CloudWatch Logs log groups never expire. Setting retention policies (e.g., 30, 90, or 365 days) on log groups automatically deletes old logs and reduces storage costs. Deleting all log groups (A) is destructive. Exporting to S3 (C) reduces costs but requires more management overhead.",
        },
        {
          id: "soa-d6-q9",
          question:
            "Which AWS service provides ML-powered recommendations to optimize Lambda function memory allocation based on historical invocation data?",
          options: [
            "A) AWS Trusted Advisor",
            "B) AWS Compute Optimizer",
            "C) AWS Cost Explorer",
            "D) CloudWatch Lambda Insights",
          ],
          correctIndex: 1,
          explanation:
            "AWS Compute Optimizer analyzes Lambda function invocation patterns and memory usage from CloudWatch metrics to recommend optimal memory settings. Right-sizing Lambda memory improves both cost (billed per GB-second) and performance (more memory = more CPU). Trusted Advisor (A) provides Lambda timeout checks but not memory right-sizing.",
        },
        {
          id: "soa-d6-q10",
          question:
            "A company has many Elastic IP addresses that are allocated but not associated with running instances. What cost impact does this have and how should it be addressed?",
          options: [
            "A) No cost — Elastic IPs are free regardless of association status.",
            "B) EIPs not associated with running instances incur hourly charges — release unused EIPs.",
            "C) EIPs incur costs only when associated with instances — keep them allocated for future use.",
            "D) EIPs cost the same as NAT Gateway data processing fees.",
          ],
          correctIndex: 1,
          explanation:
            "AWS charges for Elastic IP addresses that are allocated but not associated with a running instance (or associated with a stopped instance). The cost is small per hour but accumulates. Best practice is to release EIPs that are not in use. AWS Trusted Advisor flags unassociated EIPs as a cost optimization recommendation.",
        },
      ],
    },
  ],
};
