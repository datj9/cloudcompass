import { awsNetworkingModule, gcpNetworkingModule, azureNetworkingModule } from "./phases/phase1-networking";
import { awsObservabilityModule, gcpObservabilityModule, azureObservabilityModule } from "./phases/phase2-observability";
import { gcpIamModule, azureIamModule } from "./phases/phase3-iam";
import { dynamodbTopic, cloudSqlTopic, firestoreTopic, cosmosdbTopic } from "./phases/phase4-storage-db";
import { apiGatewayTopic, cloudFunctionsTopic } from "./phases/phase5-serverless";
import { vpcLab, observabilityLab, multiCloudLab } from "./phases/phase6-labs";

export type Level = "Beginner" | "Intermediate" | "Advanced";
export type CloudName = "aws" | "gcp" | "azure";

// ─── Topic ───────────────────────────────────────────────────────────────────

export interface TopicSection {
  heading: string;
  body: string;
  code?: { lang: string; label: string; snippet: string };
}

export interface Topic {
  id: string;
  title: string;
  level: Level;
  readTime: string;
  category: string;
  summary: string;
  sections: TopicSection[];
  awsEquivalent?: string;
  gcpEquivalent?: string;
  azureEquivalent?: string;
}

// ─── Module ──────────────────────────────────────────────────────────────────

export interface Module {
  id: string;
  title: string;
  desc: string;
  category: string;
  topics: Topic[];
}

// ─── Cloud Config ─────────────────────────────────────────────────────────────

export interface CloudConfig {
  name: CloudName;
  displayName: string;
  color: string;
  bg: string;
  border: string;
  tagline: string;
  description: string;
  strengths: string[];
  modules: Module[];
}

// ─────────────────────────────────────────────────────────────────────────────
// AWS
// ─────────────────────────────────────────────────────────────────────────────

export const awsContent: CloudConfig = {
  name: "aws",
  displayName: "AWS",
  color: "#FF9900",
  bg: "rgba(255,153,0,0.08)",
  border: "rgba(255,153,0,0.25)",
  tagline: "Amazon Web Services",
  description:
    "The world's most comprehensive cloud platform. AWS pioneered cloud computing and offers 200+ fully featured services from data centers globally.",
  strengths: ["Largest service catalogue", "Mature ecosystem & community", "Best-in-class managed services", "Strong serverless story"],
  modules: [
    {
      id: "compute",
      title: "Compute",
      desc: "Virtual machines, containers, and serverless execution",
      category: "Compute",
      topics: [
        {
          id: "ec2-basics",
          title: "EC2 — Elastic Compute Cloud",
          level: "Beginner",
          readTime: "10 min",
          category: "Compute",
          summary: "EC2 gives you resizable virtual machines in the cloud. You choose the OS, instance type, and networking — and pay per second of use.",
          gcpEquivalent: "Compute Engine",
          azureEquivalent: "Azure VMs",
          sections: [
            {
              heading: "What is EC2?",
              body: "EC2 (Elastic Compute Cloud) is AWS's virtual machine service. An EC2 instance is a VM running in AWS's infrastructure. You pick a hardware profile (instance type), an OS image (AMI), and a network placement. Within 60 seconds you have a running server.\n\nEC2 is the foundation of most AWS architectures — even higher-level services like EKS and ECS run EC2 under the hood.",
            },
            {
              heading: "Instance types",
              body: "Instance types define CPU, memory, network, and storage characteristics. They follow a naming pattern:\n\n• **t4g.medium** — t = burstable, 4 = generation, g = Graviton (ARM), medium = size\n• **m7i.4xlarge** — m = general purpose, 7 = gen 7, i = Intel\n• **c7g.2xlarge** — c = compute-optimised\n• **r6g.large** — r = memory-optimised\n\nFor most web workloads, start with **t3.medium** or **t4g.medium** (Graviton is ~20% cheaper with similar performance).",
            },
            {
              heading: "Launch your first instance (CLI)",
              body: "The fastest way to launch an EC2 instance is the AWS CLI. You need an AMI ID, instance type, key pair, and security group.",
              code: {
                lang: "bash",
                label: "Launch EC2 instance",
                snippet: `# Get the latest Amazon Linux 2023 AMI
AMI=$(aws ssm get-parameter \\
  --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \\
  --query Parameter.Value --output text)

# Launch instance
aws ec2 run-instances \\
  --image-id $AMI \\
  --instance-type t3.micro \\
  --key-name my-key-pair \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-0123456789abcdef0 \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-server}]' \\
  --query 'Instances[0].InstanceId' --output text`,
              },
            },
            {
              heading: "Security Groups",
              body: "Security groups act as stateful firewalls at the instance level. A security group has inbound and outbound rules that filter traffic by protocol, port, and source/destination.\n\nKey rules:\n• **Stateful** — if you allow inbound port 80, the return traffic is automatically allowed\n• **Default deny** — all inbound traffic is denied unless you add a rule\n• **Multiple SGs** — an instance can have up to 5 security groups; rules are unioned",
              code: {
                lang: "bash",
                label: "Create security group",
                snippet: `# Create security group
SG=$(aws ec2 create-security-group \\
  --group-name web-sg \\
  --description "Allow HTTP and SSH" \\
  --vpc-id vpc-0123456789abcdef0 \\
  --query GroupId --output text)

# Allow SSH (port 22) and HTTP (port 80)
aws ec2 authorize-security-group-ingress \\
  --group-id $SG \\
  --ip-permissions \\
    IpProtocol=tcp,FromPort=22,ToPort=22,IpRanges=[{CidrIp=0.0.0.0/0}] \\
    IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}]`,
              },
            },
            {
              heading: "Pricing tips",
              body: "EC2 pricing has three main modes:\n\n• **On-Demand** — pay per second, no commitment. Use for unpredictable workloads.\n• **Reserved Instances** — 1 or 3 year commitment, up to 72% discount. Use for steady-state production.\n• **Spot Instances** — bid on spare capacity, up to 90% discount. Instances can be interrupted with 2 min notice. Use for batch, CI/CD, or fault-tolerant workloads.",
            },
          ],
        },
        {
          id: "lambda-basics",
          title: "Lambda — Serverless Functions",
          level: "Beginner",
          readTime: "8 min",
          category: "Compute",
          summary: "Lambda runs your code in response to events — HTTP requests, S3 uploads, DynamoDB changes — with zero server management and sub-second billing.",
          gcpEquivalent: "Cloud Functions",
          azureEquivalent: "Azure Functions",
          sections: [
            {
              heading: "What is Lambda?",
              body: "Lambda is AWS's serverless compute service. You upload code (a function), define a trigger, and AWS runs it on demand. You pay only for the compute time consumed — billed in 1ms increments.\n\nLambda supports Node.js, Python, Go, Java, Ruby, .NET, and custom runtimes. Functions run in isolated, ephemeral environments — no persistent state between invocations.",
            },
            {
              heading: "Write and deploy a function",
              body: "A Lambda function is a handler that receives an event and context object. The return value becomes the response.",
              code: {
                lang: "typescript",
                label: "Lambda handler (Node.js)",
                snippet: `// handler.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const name = event.queryStringParameters?.name ?? "World";
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: \`Hello, \${name}!\` }),
  };
};`,
              },
            },
            {
              heading: "Deploy via CLI",
              body: "Package and deploy a Lambda function using the AWS CLI.",
              code: {
                lang: "bash",
                label: "Deploy Lambda function",
                snippet: `# Package
zip function.zip index.js

# Create function
aws lambda create-function \\
  --function-name hello-world \\
  --runtime nodejs22.x \\
  --role arn:aws:iam::123456789:role/lambda-execution-role \\
  --handler index.handler \\
  --zip-file fileb://function.zip

# Invoke
aws lambda invoke \\
  --function-name hello-world \\
  --payload '{"queryStringParameters":{"name":"Engineer"}}' \\
  response.json && cat response.json`,
              },
            },
            {
              heading: "Cold starts and performance",
              body: "A cold start happens when Lambda initialises a new execution environment. It adds 100ms–1s latency.\n\n**Minimise cold starts:**\n• Keep deployment package small (<10MB)\n• Use **Provisioned Concurrency** for latency-sensitive functions\n• Avoid heavy initialisation in the handler — move it outside\n• Use ARM (Graviton2) runtime — ~20% cheaper and often faster\n• Use SnapStart for Java functions",
            },
          ],
        },
        {
          id: "eks-basics",
          title: "EKS — Managed Kubernetes",
          level: "Intermediate",
          readTime: "14 min",
          category: "Compute",
          summary: "EKS is AWS's managed Kubernetes service. AWS runs the control plane; you manage the worker nodes via node groups or Fargate.",
          gcpEquivalent: "GKE",
          azureEquivalent: "AKS",
          sections: [
            {
              heading: "EKS architecture",
              body: "EKS separates the **control plane** (etcd, kube-apiserver, kube-scheduler) — managed and HA by AWS — from **data plane** (worker nodes) — managed by you.\n\nYou have two data plane options:\n• **Managed Node Groups** — EC2 instances AWS manages patching/scaling for\n• **Fargate profiles** — fully serverless; AWS runs each Pod in its own isolated micro-VM",
            },
            {
              heading: "Create a cluster",
              body: "Use eksctl — the official CLI — to create clusters declaratively.",
              code: {
                lang: "yaml",
                label: "cluster.yaml",
                snippet: `apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: my-cluster
  region: ap-southeast-1
  version: "1.31"

managedNodeGroups:
  - name: ng-general
    instanceType: t3.medium
    minSize: 1
    maxSize: 5
    desiredCapacity: 2
    privateNetworking: true
    iam:
      withAddonPolicies:
        autoScaler: true
        albIngress: true
        cloudWatch: true`,
              },
            },
            {
              heading: "Deploy to EKS",
              body: "Once the cluster is running, deploy workloads with standard kubectl.",
              code: {
                lang: "bash",
                label: "Deploy app to EKS",
                snippet: `# Update kubeconfig
aws eks update-kubeconfig --region ap-southeast-1 --name my-cluster

# Apply manifests
kubectl apply -f deployment.yaml

# Check pods
kubectl get pods -n default

# Expose via LoadBalancer (creates an AWS NLB)
kubectl expose deployment my-app \\
  --type=LoadBalancer \\
  --port=80 --target-port=3000`,
              },
            },
          ],
        },
        apiGatewayTopic as unknown as Topic,
      ],
    },
    {
      id: "storage",
      title: "Storage",
      desc: "Object storage, databases, and caching",
      category: "Storage",
      topics: [
        {
          id: "s3-basics",
          title: "S3 — Simple Storage Service",
          level: "Beginner",
          readTime: "9 min",
          category: "Storage",
          summary: "S3 is the gold standard for object storage — infinitely scalable, 11 nines durability, and the backbone of countless AWS architectures.",
          gcpEquivalent: "Cloud Storage",
          azureEquivalent: "Azure Blob Storage",
          sections: [
            {
              heading: "Core concepts",
              body: "S3 organises data into **buckets** (containers with a globally unique name) and **objects** (files with metadata). Objects can be up to 5TB. There are no directories — only key prefixes that look like paths.\n\nS3 is **eventually consistent** for overwrites and deletes, but **strongly consistent** for new object PUTs (since Dec 2020).",
            },
            {
              heading: "Common operations",
              body: "The AWS CLI makes it easy to interact with S3 using familiar file-system semantics.",
              code: {
                lang: "bash",
                label: "S3 CLI operations",
                snippet: `# Create a bucket
aws s3api create-bucket \\
  --bucket my-unique-bucket-name \\
  --region ap-southeast-1 \\
  --create-bucket-configuration LocationConstraint=ap-southeast-1

# Upload a file
aws s3 cp ./index.html s3://my-unique-bucket-name/

# Sync a directory
aws s3 sync ./dist s3://my-unique-bucket-name/app/ --delete

# List objects
aws s3 ls s3://my-unique-bucket-name/ --recursive --human-readable

# Set lifecycle rule (archive to Glacier after 90 days)
aws s3api put-bucket-lifecycle-configuration \\
  --bucket my-unique-bucket-name \\
  --lifecycle-configuration file://lifecycle.json`,
              },
            },
            {
              heading: "Storage classes",
              body: "S3 has 7 storage classes optimised for different access patterns:\n\n| Class | Use case | Retrieval |\n|---|---|---|\n| S3 Standard | Frequently accessed | Instant |\n| S3 Intelligent-Tiering | Unknown/changing access | Instant |\n| S3 Standard-IA | Infrequent access | Instant |\n| S3 One Zone-IA | Infrequent, single AZ | Instant |\n| S3 Glacier Instant | Archive, ms retrieval | Instant |\n| S3 Glacier Flexible | Archive, mins–hours | Minutes–hours |\n| S3 Glacier Deep Archive | Long-term archive | 12 hours |\n\nUse **Lifecycle policies** to automatically transition objects between classes.",
            },
          ],
        },
        {
          id: "rds-basics",
          title: "RDS & Aurora — Managed Relational DB",
          level: "Intermediate",
          readTime: "11 min",
          category: "Storage",
          summary: "RDS manages PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server. Aurora is AWS's cloud-native engine with up to 5× MySQL performance.",
          gcpEquivalent: "Cloud SQL / AlloyDB",
          azureEquivalent: "Azure Database for PostgreSQL / SQL",
          sections: [
            {
              heading: "RDS vs Aurora",
              body: "**RDS** runs standard open-source engines on managed EC2 with automated backups, patching, and Multi-AZ failover.\n\n**Aurora** is a cloud-native rewrite that separates storage (shared, auto-growing log-structured volume) from compute. Benefits over RDS:\n• 5× MySQL / 3× PostgreSQL throughput\n• Storage auto-grows in 10GB increments up to 128TB\n• Up to 15 read replicas with <10ms replica lag\n• Sub-10s failover (vs 60–120s for RDS Multi-AZ)\n• **Aurora Serverless v2** — scales compute in 0.5 ACU increments with zero cold start",
            },
            {
              heading: "Launch Aurora PostgreSQL",
              body: "Create a minimal Aurora Serverless v2 cluster using the CLI.",
              code: {
                lang: "bash",
                label: "Create Aurora Serverless v2 cluster",
                snippet: `# Create subnet group
aws rds create-db-subnet-group \\
  --db-subnet-group-name my-subnet-group \\
  --db-subnet-group-description "My Aurora subnets" \\
  --subnet-ids subnet-aaa subnet-bbb

# Create Aurora Serverless v2 cluster
aws rds create-db-cluster \\
  --db-cluster-identifier my-aurora-cluster \\
  --engine aurora-postgresql \\
  --engine-version 16.2 \\
  --master-username admin \\
  --master-user-password "$(openssl rand -base64 20)" \\
  --db-subnet-group-name my-subnet-group \\
  --serverless-v2-scaling-configuration MinCapacity=0.5,MaxCapacity=16 \\
  --enable-cloudwatch-logs-exports postgresql

# Add an instance
aws rds create-db-instance \\
  --db-instance-identifier my-aurora-instance \\
  --db-cluster-identifier my-aurora-cluster \\
  --db-instance-class db.serverless \\
  --engine aurora-postgresql`,
              },
            },
          ],
        },
        dynamodbTopic as unknown as Topic,
      ],
    },
    {
      id: "iam",
      title: "IAM & Security",
      desc: "Identity, access management, and secrets",
      category: "IAM & Security",
      topics: [
        {
          id: "iam-basics",
          title: "IAM — Identity and Access Management",
          level: "Beginner",
          readTime: "12 min",
          category: "IAM & Security",
          summary: "IAM controls who (identity) can do what (actions) on which AWS resources (resources) under what conditions — the foundation of secure AWS architecture.",
          gcpEquivalent: "Cloud IAM",
          azureEquivalent: "Azure Entra ID / RBAC",
          sections: [
            {
              heading: "The IAM model",
              body: "IAM has four core concepts:\n\n• **Users** — long-term identities for humans (prefer SSO via IAM Identity Center instead)\n• **Groups** — collections of users; attach policies to groups, not individual users\n• **Roles** — temporary identities assumed by services, EC2, Lambda, or cross-account access\n• **Policies** — JSON documents that allow or deny specific actions on specific resources\n\n**Prefer roles over users** for everything programmatic. Roles issue temporary credentials (STS tokens) which automatically expire.",
            },
            {
              heading: "Write a least-privilege policy",
              body: "Follow the principle of least privilege — grant only the permissions needed for the specific task.",
              code: {
                lang: "json",
                label: "Least-privilege S3 policy",
                snippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListSpecificBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::my-app-bucket",
      "Condition": {
        "StringLike": { "s3:prefix": ["uploads/*"] }
      }
    },
    {
      "Sid": "ReadWriteUploads",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::my-app-bucket/uploads/*"
    }
  ]
}`,
              },
            },
            {
              heading: "IAM Roles for EC2 and Lambda",
              body: "Attach an IAM role to EC2 or Lambda instead of hardcoding credentials. The SDK automatically uses the instance metadata service (IMDS) to fetch temporary credentials.",
              code: {
                lang: "bash",
                label: "Create and attach execution role",
                snippet: `# Create role with trust policy for Lambda
aws iam create-role \\
  --role-name my-lambda-role \\
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":{"Service":"lambda.amazonaws.com"},
      "Action":"sts:AssumeRole"
    }]
  }'

# Attach managed policy for CloudWatch Logs
aws iam attach-role-policy \\
  --role-name my-lambda-role \\
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole`,
              },
            },
          ],
        },
      ],
    },
    awsNetworkingModule as unknown as Module,
    awsObservabilityModule as unknown as Module,
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// GCP
// ─────────────────────────────────────────────────────────────────────────────

export const gcpContent: CloudConfig = {
  name: "gcp",
  displayName: "GCP",
  color: "#4285F4",
  bg: "rgba(66,133,244,0.08)",
  border: "rgba(66,133,244,0.25)",
  tagline: "Google Cloud Platform",
  description:
    "Built on the same infrastructure Google uses internally. GCP excels at data analytics, machine learning, and Kubernetes (which Google invented).",
  strengths: ["Kubernetes-native (GKE is the gold standard)", "BigQuery for analytics at scale", "Best-in-class networking (Premium Tier)", "Vertex AI & Gemini APIs"],
  modules: [
    {
      id: "compute",
      title: "Compute",
      desc: "VMs, GKE, and serverless runtimes",
      category: "Compute",
      topics: [
        {
          id: "compute-engine",
          title: "Compute Engine — Virtual Machines",
          level: "Beginner",
          readTime: "9 min",
          category: "Compute",
          summary: "Compute Engine provides high-performance VMs with per-second billing, custom machine types, and live migration during host maintenance.",
          awsEquivalent: "EC2",
          azureEquivalent: "Azure VMs",
          sections: [
            {
              heading: "What is Compute Engine?",
              body: "Compute Engine (GCE) is GCP's VM service. GCE instances run on Google's custom hardware and are connected by Google's global network.\n\nKey differentiators vs AWS EC2:\n• **Custom machine types** — specify exact vCPU/RAM without predefined tiers\n• **Sole-tenant nodes** — run VMs on dedicated physical servers\n• **Live migration** — VMs migrate to healthy hosts without downtime during maintenance\n• **Sustained use discounts** — automatic discounts for VMs running >25% of a month",
            },
            {
              heading: "Create a VM",
              body: "Use gcloud CLI to create a VM with a startup script.",
              code: {
                lang: "bash",
                label: "Create Compute Engine VM",
                snippet: `# Create a VM
gcloud compute instances create my-vm \\
  --zone=asia-southeast1-a \\
  --machine-type=e2-medium \\
  --image-family=debian-12 \\
  --image-project=debian-cloud \\
  --boot-disk-size=20GB \\
  --tags=http-server \\
  --metadata=startup-script='#!/bin/bash
    apt-get update
    apt-get install -y nginx
    systemctl start nginx'

# Allow HTTP traffic (firewall rule)
gcloud compute firewall-rules create allow-http \\
  --allow=tcp:80 \\
  --target-tags=http-server \\
  --description="Allow HTTP"

# SSH into the VM
gcloud compute ssh my-vm --zone=asia-southeast1-a`,
              },
            },
            {
              heading: "Machine families",
              body: "GCP machine families:\n\n• **E2** — cost-optimised, shared-core, good for dev/test\n• **N2/N2D** — balanced general purpose (Intel/AMD)\n• **C3** — compute-optimised for CPU-intensive workloads\n• **M3** — memory-optimised for SAP HANA, in-memory DBs\n• **A3** — accelerator-optimised with H100 GPUs\n• **T2D** — Tau, AMD EPYC for scale-out workloads\n\n**Custom types**: `custom-4-8192` = 4 vCPUs, 8GB RAM. You can also add extended memory beyond the standard ratio.",
            },
          ],
        },
        {
          id: "cloud-run",
          title: "Cloud Run — Serverless Containers",
          level: "Beginner",
          readTime: "10 min",
          category: "Compute",
          summary: "Cloud Run runs stateless containers on demand. Zero configuration, scales to zero, and charges only when handling requests.",
          awsEquivalent: "ECS Fargate + API Gateway",
          azureEquivalent: "Azure Container Apps",
          sections: [
            {
              heading: "What is Cloud Run?",
              body: "Cloud Run is GCP's fully managed serverless container platform. You bring a Docker image; Cloud Run handles scaling, load balancing, TLS, and traffic splitting.\n\nCloud Run differs from Lambda in that it runs **any containerised app** — no language constraints, longer timeouts (60 min), and larger memory (32GB). It's the fastest path from a Dockerfile to a public HTTPS endpoint.",
            },
            {
              heading: "Deploy a container",
              body: "Build, push, and deploy a container to Cloud Run in one command.",
              code: {
                lang: "bash",
                label: "Deploy to Cloud Run",
                snippet: `# Build and push to Artifact Registry
gcloud auth configure-docker asia-southeast1-docker.pkg.dev

docker build -t asia-southeast1-docker.pkg.dev/my-project/my-repo/my-app:latest .
docker push asia-southeast1-docker.pkg.dev/my-project/my-repo/my-app:latest

# Deploy to Cloud Run
gcloud run deploy my-app \\
  --image=asia-southeast1-docker.pkg.dev/my-project/my-repo/my-app:latest \\
  --region=asia-southeast1 \\
  --platform=managed \\
  --allow-unauthenticated \\
  --memory=512Mi \\
  --cpu=1 \\
  --min-instances=0 \\
  --max-instances=100 \\
  --port=8080`,
              },
            },
            {
              heading: "Traffic splitting for zero-downtime deploys",
              body: "Cloud Run supports traffic splitting between revisions — great for canary deployments.",
              code: {
                lang: "bash",
                label: "Canary deployment",
                snippet: `# Deploy new revision without traffic
gcloud run deploy my-app \\
  --image=.../my-app:v2 \\
  --no-traffic \\
  --tag=canary

# Split traffic: 90% stable, 10% canary
gcloud run services update-traffic my-app \\
  --region=asia-southeast1 \\
  --to-revisions=LATEST=10,my-app-stable=90`,
              },
            },
          ],
        },
        {
          id: "gke-basics",
          title: "GKE — Google Kubernetes Engine",
          level: "Intermediate",
          readTime: "13 min",
          category: "Compute",
          summary: "GKE is the managed Kubernetes service that invented Kubernetes. It offers Autopilot (fully managed nodes) and Standard modes.",
          awsEquivalent: "EKS",
          azureEquivalent: "AKS",
          sections: [
            {
              heading: "GKE Autopilot vs Standard",
              body: "GKE comes in two modes:\n\n**Autopilot** (recommended)\n• Google manages nodes, scaling, security hardening\n• Pay per Pod CPU/memory, not per node\n• Automatic node provisioning per Pod request\n• Hardened by default (no privileged Pods, root containers blocked)\n\n**Standard**\n• You manage node pools and VM types\n• More flexibility for custom configs, GPU nodes\n• Pay per node regardless of Pod usage",
            },
            {
              heading: "Create an Autopilot cluster",
              body: "Create a GKE Autopilot cluster — the simplest path to production Kubernetes.",
              code: {
                lang: "bash",
                label: "Create GKE Autopilot cluster",
                snippet: `# Create cluster
gcloud container clusters create-auto my-cluster \\
  --region=asia-southeast1 \\
  --release-channel=regular

# Get credentials
gcloud container clusters get-credentials my-cluster \\
  --region=asia-southeast1

# Deploy a workload
kubectl create deployment hello \\
  --image=us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0

# Expose it
kubectl expose deployment hello \\
  --type=LoadBalancer \\
  --port=80 --target-port=8080

# Watch for external IP
kubectl get service hello --watch`,
              },
            },
          ],
        },
        cloudFunctionsTopic as unknown as Topic,
      ],
    },
    {
      id: "storage",
      title: "Storage & Data",
      desc: "Object storage, SQL, BigQuery, and Pub/Sub",
      category: "Storage",
      topics: [
        {
          id: "cloud-storage",
          title: "Cloud Storage — Object Storage",
          level: "Beginner",
          readTime: "8 min",
          category: "Storage",
          summary: "Cloud Storage is GCP's unified object storage — from hot data to archive, with consistent APIs, strong consistency, and global edge points of presence.",
          awsEquivalent: "S3",
          azureEquivalent: "Azure Blob Storage",
          sections: [
            {
              heading: "Buckets and objects",
              body: "Cloud Storage organises data in **buckets** (globally named containers) and **objects** (files with metadata). Buckets have a storage class and location type:\n\n• **Single region** — lowest latency, lowest cost, data in one region\n• **Dual-region** — high availability, two specific regions\n• **Multi-region** — global distribution (US, EU, ASIA)\n\nStorage classes:\n• **Standard** — frequently accessed\n• **Nearline** — accessed ~once/month\n• **Coldline** — accessed ~once/quarter\n• **Archive** — accessed ~once/year",
            },
            {
              heading: "gsutil operations",
              body: "gsutil is the CLI for Cloud Storage. It uses familiar Unix-like syntax.",
              code: {
                lang: "bash",
                label: "Cloud Storage CLI",
                snippet: `# Create a bucket
gsutil mb -l asia-southeast1 gs://my-unique-bucket/

# Upload a file
gsutil cp ./index.html gs://my-unique-bucket/

# Sync directory
gsutil -m rsync -r -d ./dist gs://my-unique-bucket/app/

# Make publicly readable
gsutil iam ch allUsers:objectViewer gs://my-unique-bucket/

# Set lifecycle rule (delete after 30 days)
cat > lifecycle.json << 'EOF'
{
  "rule": [{
    "action": {"type": "Delete"},
    "condition": {"age": 30}
  }]
}
EOF
gsutil lifecycle set lifecycle.json gs://my-unique-bucket/`,
              },
            },
          ],
        },
        {
          id: "bigquery-basics",
          title: "BigQuery — Serverless Data Warehouse",
          level: "Intermediate",
          readTime: "12 min",
          category: "Storage",
          summary: "BigQuery is Google's fully managed, serverless data warehouse. Query petabytes of data with standard SQL — no infrastructure to manage.",
          awsEquivalent: "Redshift / Athena",
          azureEquivalent: "Azure Synapse Analytics",
          sections: [
            {
              heading: "What makes BigQuery unique?",
              body: "BigQuery separates storage from compute, so you pay for data stored (~$0.02/GB/month) and data scanned (~$5/TB). Its columnar storage and Dremel execution engine can scan terabytes in seconds.\n\n**Key features:**\n• **Serverless** — no clusters to manage\n• **Standard SQL** — no proprietary query language\n• **Streaming inserts** — data available for query within seconds\n• **ML in SQL** — BQML lets you train models directly in BigQuery\n• **Omni** — query data in AWS S3 or Azure Blob from BigQuery",
            },
            {
              heading: "Run your first query",
              body: "Query a public dataset to get started immediately.",
              code: {
                lang: "sql",
                label: "BigQuery SQL example",
                snippet: `-- Query public GitHub data (1+ TB dataset, ~1s response)
SELECT
  repo_name,
  COUNT(*) AS commits,
  COUNT(DISTINCT author.email) AS contributors
FROM
  \`bigquery-public-data.github_repos.commits\`,
  UNNEST(repo_name) AS repo_name
WHERE
  DATE(committer.date) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY 1
ORDER BY commits DESC
LIMIT 20;`,
              },
            },
            {
              heading: "Load data into BigQuery",
              body: "Load from GCS, stream records, or use the Storage Write API for high-throughput ingestion.",
              code: {
                lang: "bash",
                label: "Load CSV from GCS",
                snippet: `# Load CSV file from Cloud Storage
bq load \\
  --source_format=CSV \\
  --skip_leading_rows=1 \\
  --autodetect \\
  my_dataset.my_table \\
  gs://my-bucket/data/*.csv

# Create table from query result
bq query \\
  --destination_table=my_dataset.summary \\
  --use_legacy_sql=false \\
  'SELECT country, SUM(sales) as total FROM my_dataset.orders GROUP BY 1'`,
              },
            },
          ],
        },
        cloudSqlTopic as unknown as Topic,
        firestoreTopic as unknown as Topic,
      ],
    },
    gcpNetworkingModule as unknown as Module,
    gcpObservabilityModule as unknown as Module,
    gcpIamModule as unknown as Module,
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Azure
// ─────────────────────────────────────────────────────────────────────────────

export const azureContent: CloudConfig = {
  name: "azure",
  displayName: "Azure",
  color: "#0078D4",
  bg: "rgba(0,120,212,0.08)",
  border: "rgba(0,120,212,0.25)",
  tagline: "Microsoft Azure",
  description:
    "The enterprise cloud of choice, deeply integrated with Microsoft's software ecosystem — Active Directory, Office 365, .NET, and Windows Server.",
  strengths: ["Deep Microsoft ecosystem integration", "Best Entra ID (AAD) for enterprise identity", "Hybrid cloud with Azure Arc", "Azure OpenAI Service"],
  modules: [
    {
      id: "compute",
      title: "Compute",
      desc: "VMs, AKS, and Azure Functions",
      category: "Compute",
      topics: [
        {
          id: "azure-vms",
          title: "Azure Virtual Machines",
          level: "Beginner",
          readTime: "9 min",
          category: "Compute",
          summary: "Azure VMs provide on-demand, scalable compute with a wide range of VM sizes, Windows/Linux support, and tight integration with Azure networking.",
          awsEquivalent: "EC2",
          gcpEquivalent: "Compute Engine",
          sections: [
            {
              heading: "Azure VM concepts",
              body: "Azure organises resources into **Resource Groups** — a logical container for all related resources (VMs, disks, networking). This is Azure's fundamental difference from AWS (which uses tags + accounts).\n\n**Key concepts:**\n• **Availability Sets** — spread VMs across fault domains within a datacenter\n• **Availability Zones** — spread VMs across independent datacenters within a region\n• **VM Scale Sets** — auto-scaling group of identical VMs\n• **Spot VMs** — unused capacity at up to 90% discount (equivalent to AWS Spot)",
            },
            {
              heading: "Create a VM with az CLI",
              body: "The az CLI creates a VM along with all required resources in one command.",
              code: {
                lang: "bash",
                label: "Create Azure VM",
                snippet: `# Create resource group
az group create \\
  --name my-rg \\
  --location southeastasia

# Create VM (creates NIC, NSG, public IP automatically)
az vm create \\
  --resource-group my-rg \\
  --name my-vm \\
  --image Ubuntu2204 \\
  --size Standard_B2s \\
  --admin-username azureuser \\
  --generate-ssh-keys \\
  --public-ip-sku Standard

# Open port 80
az vm open-port \\
  --port 80 \\
  --resource-group my-rg \\
  --name my-vm

# SSH in
az ssh vm --resource-group my-rg --name my-vm`,
              },
            },
            {
              heading: "VM size families",
              body: "Azure VM sizes follow a pattern: `Standard_[family][version][features]_[vCPUs][memory]`\n\n• **B-series** — burstable, low cost (Standard_B2s)\n• **D-series** — general purpose (Standard_D4s_v5)\n• **F-series** — compute-optimised (Standard_F8s_v2)\n• **E-series** — memory-optimised (Standard_E16s_v5)\n• **N-series** — GPU (Standard_NC6s_v3 with V100)\n• **L-series** — storage-optimised with NVMe",
            },
          ],
        },
        {
          id: "aks-basics",
          title: "AKS — Azure Kubernetes Service",
          level: "Intermediate",
          readTime: "13 min",
          category: "Compute",
          summary: "AKS is Azure's managed Kubernetes service with tight Azure AD integration, Azure CNI networking, and the Azure Policy add-on for governance.",
          awsEquivalent: "EKS",
          gcpEquivalent: "GKE",
          sections: [
            {
              heading: "AKS architecture",
              body: "AKS manages the Kubernetes control plane at no cost — you only pay for the agent (worker) nodes.\n\n**AKS features:**\n• **Workload Identity** — Pods use Azure AD identities (no static secrets)\n• **Azure CNI** — Pods get VNet IP addresses (no overlay network)\n• **Node auto-provisioner** — Karpenter-based for fast, right-sized node provisioning\n• **Azure Policy** — enforce guardrails (block privileged Pods, enforce resource limits)\n• **GitOps with Flux** — built-in Flux extension for GitOps workflows",
            },
            {
              heading: "Create an AKS cluster",
              body: "Create an AKS cluster with the Azure CNI and workload identity enabled.",
              code: {
                lang: "bash",
                label: "Create AKS cluster",
                snippet: `# Create resource group
az group create --name my-aks-rg --location southeastasia

# Create cluster
az aks create \\
  --resource-group my-aks-rg \\
  --name my-cluster \\
  --node-count 2 \\
  --node-vm-size Standard_D4s_v5 \\
  --network-plugin azure \\
  --enable-oidc-issuer \\
  --enable-workload-identity \\
  --enable-cluster-autoscaler \\
  --min-count 1 --max-count 10 \\
  --generate-ssh-keys

# Get credentials
az aks get-credentials \\
  --resource-group my-aks-rg \\
  --name my-cluster

# Verify
kubectl get nodes`,
              },
            },
          ],
        },
        {
          id: "azure-functions",
          title: "Azure Functions — Serverless",
          level: "Beginner",
          readTime: "9 min",
          category: "Compute",
          summary: "Azure Functions is a serverless compute service that lets you run event-driven code without managing infrastructure, with deep Azure service integration.",
          awsEquivalent: "Lambda",
          gcpEquivalent: "Cloud Functions",
          sections: [
            {
              heading: "Triggers and bindings",
              body: "Azure Functions uses a **triggers and bindings** model that declaratively connects functions to external services — no SDK boilerplate needed.\n\n**Trigger types:** HTTP, Timer (cron), Blob Storage, Queue Storage, Service Bus, Event Hubs, CosmosDB change feed, Event Grid\n\n**Binding directions:** input (read data in), output (write data out)\n\nThis is more powerful than Lambda's event source model — a single function can read from a Queue (trigger), read an Azure SQL record (input binding), and write to Blob Storage (output binding) — all declared in `function.json`.",
            },
            {
              heading: "HTTP-triggered function",
              body: "Create an HTTP-triggered function in TypeScript.",
              code: {
                lang: "typescript",
                label: "Azure Function (TypeScript)",
                snippet: `import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function httpTrigger(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Processing request:", request.url);

  const name = request.query.get("name") ?? "World";

  return {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: \`Hello, \${name}!\` }),
  };
}

app.http("httpTrigger", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: httpTrigger,
});`,
              },
            },
            {
              heading: "Deploy with Azure CLI",
              body: "Deploy a function app with a consumption plan (scale to zero, pay-per-execution).",
              code: {
                lang: "bash",
                label: "Deploy Azure Function",
                snippet: `# Create storage account (required for Functions)
az storage account create \\
  --name mystorageacct$RANDOM \\
  --resource-group my-rg \\
  --sku Standard_LRS

# Create function app
az functionapp create \\
  --resource-group my-rg \\
  --consumption-plan-location southeastasia \\
  --runtime node \\
  --runtime-version 20 \\
  --functions-version 4 \\
  --name my-func-app-$RANDOM \\
  --storage-account mystorageacct

# Deploy code
func azure functionapp publish my-func-app`,
              },
            },
          ],
        },
      ],
    },
    {
      id: "storage",
      title: "Storage",
      desc: "Blob storage, databases, and CosmosDB",
      category: "Storage",
      topics: [
        {
          id: "blob-storage",
          title: "Azure Blob Storage",
          level: "Beginner",
          readTime: "8 min",
          category: "Storage",
          summary: "Azure Blob Storage is Microsoft's object storage for unstructured data — optimised for images, videos, backups, and big data workloads.",
          awsEquivalent: "S3",
          gcpEquivalent: "Cloud Storage",
          sections: [
            {
              heading: "Storage hierarchy",
              body: "Azure Blob Storage uses a three-level hierarchy:\n\n1. **Storage Account** — top-level namespace (globally unique name)\n2. **Container** — equivalent to an S3 bucket\n3. **Blob** — the actual object\n\n**Blob types:**\n• **Block blobs** — for files and binary data (most common)\n• **Append blobs** — optimised for append-only operations like logging\n• **Page blobs** — for Azure VM disks (random read/write)\n\n**Access tiers (per blob or container):**\n• Hot — frequent access\n• Cool — infrequent access (stored 30+ days)\n• Cold — rarely accessed (stored 90+ days)\n• Archive — offline, rehydration required (stored 180+ days)",
            },
            {
              heading: "Operations with az CLI",
              body: "Upload and manage blobs using the Azure CLI.",
              code: {
                lang: "bash",
                label: "Blob Storage CLI operations",
                snippet: `# Create storage account
az storage account create \\
  --name mystorageaccount \\
  --resource-group my-rg \\
  --sku Standard_LRS \\
  --kind StorageV2 \\
  --access-tier Hot

# Get connection string
CONN=$(az storage account show-connection-string \\
  --name mystorageaccount --resource-group my-rg -o tsv)

# Create container
az storage container create \\
  --name my-container \\
  --connection-string $CONN

# Upload file
az storage blob upload \\
  --container-name my-container \\
  --name index.html \\
  --file ./index.html \\
  --connection-string $CONN

# List blobs
az storage blob list \\
  --container-name my-container \\
  --connection-string $CONN --output table`,
              },
            },
          ],
        },
        cosmosdbTopic as unknown as Topic,
      ],
    },
    azureNetworkingModule as unknown as Module,
    azureObservabilityModule as unknown as Module,
    azureIamModule as unknown as Module,
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Labs
// ─────────────────────────────────────────────────────────────────────────────

export interface LabStep {
  title: string;
  body: string;
  code?: { lang: string; label: string; snippet: string };
  tip?: string;
  warning?: string;
}

export interface Lab {
  id: string;
  title: string;
  desc: string;
  level: Level;
  time: string;
  tags: string[];
  free: boolean;
  intro: string;
  prerequisites: string[];
  steps: LabStep[];
  cleanup?: string;
  nextSteps?: string[];
}

export const labs: Lab[] = [
  {
    id: "deploy-static-site",
    title: "Deploy a static site to object storage",
    desc: "Host a static website on S3, GCS, or Azure Blob with public access and CDN.",
    level: "Beginner",
    time: "20 min",
    tags: ["S3", "GCS", "Blob", "CDN"],
    free: true,
    intro:
      "In this lab you'll host a static website using object storage — the cheapest and most scalable way to serve static assets. We'll walk through all three clouds step by step.",
    prerequisites: [
      "AWS CLI, gcloud CLI, or az CLI installed and authenticated",
      "A static website (HTML/CSS/JS) ready to upload — or use the sample provided",
    ],
    steps: [
      {
        title: "Create a sample site",
        body: "Create a minimal HTML file to deploy.",
        code: {
          lang: "bash",
          label: "Create index.html",
          snippet: `mkdir my-site && cd my-site
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>CloudCompass Lab</title></head>
<body>
  <h1>Hello from the cloud!</h1>
  <p>Deployed via object storage.</p>
</body>
</html>
EOF`,
        },
      },
      {
        title: "AWS: Create and configure S3 bucket",
        body: "Create an S3 bucket with static website hosting enabled.",
        code: {
          lang: "bash",
          label: "S3 static site setup",
          snippet: `BUCKET="my-static-site-$(openssl rand -hex 4)"
REGION="ap-southeast-1"

# Create bucket
aws s3api create-bucket \\
  --bucket $BUCKET \\
  --region $REGION \\
  --create-bucket-configuration LocationConstraint=$REGION

# Enable static website hosting
aws s3api put-bucket-website \\
  --bucket $BUCKET \\
  --website-configuration '{
    "IndexDocument":{"Suffix":"index.html"},
    "ErrorDocument":{"Key":"404.html"}
  }'

# Allow public read
aws s3api put-bucket-policy --bucket $BUCKET --policy "{
  \\"Version\\":\\"2012-10-17\\",
  \\"Statement\\":[{
    \\"Effect\\":\\"Allow\\",
    \\"Principal\\":\\"*\\",
    \\"Action\\":\\"s3:GetObject\\",
    \\"Resource\\":\\"arn:aws:s3:::$BUCKET/*\\"
  }]
}"

# Disable block public access
aws s3api put-public-access-block \\
  --bucket $BUCKET \\
  --public-access-block-configuration \\
    BlockPublicAcls=false,IgnorePublicAcls=false,\\
    BlockPublicPolicy=false,RestrictPublicBuckets=false

# Upload files
aws s3 sync ./my-site s3://$BUCKET/

echo "URL: http://$BUCKET.s3-website-$REGION.amazonaws.com"`,
        },
        tip: "The S3 website endpoint is HTTP only. For HTTPS, put a CloudFront distribution in front.",
      },
      {
        title: "GCP: Create and configure a Cloud Storage bucket",
        body: "Create a GCS bucket and enable static website serving.",
        code: {
          lang: "bash",
          label: "GCS static site setup",
          snippet: `BUCKET="my-static-site-$(openssl rand -hex 4)"
PROJECT=$(gcloud config get-value project)

# Create bucket
gsutil mb -l asia-southeast1 gs://$BUCKET/

# Make publicly readable
gsutil iam ch allUsers:objectViewer gs://$BUCKET/

# Set website config
gsutil web set -m index.html -e 404.html gs://$BUCKET/

# Upload files
gsutil -m cp -r ./my-site/* gs://$BUCKET/

echo "URL: http://storage.googleapis.com/$BUCKET/index.html"`,
        },
        tip: "For a custom domain with HTTPS, use Cloud Load Balancing with a Cloud CDN backend bucket.",
      },
      {
        title: "Azure: Create Blob Storage with static website",
        body: "Enable the static website feature on an Azure Storage Account.",
        code: {
          lang: "bash",
          label: "Azure Blob static site setup",
          snippet: `RG="my-static-site-rg"
ACCOUNT="mystaticsite$(openssl rand -hex 4)"

# Create resource group
az group create --name $RG --location southeastasia

# Create storage account
az storage account create \\
  --name $ACCOUNT \\
  --resource-group $RG \\
  --sku Standard_LRS \\
  --kind StorageV2

# Enable static website
az storage blob service-properties update \\
  --account-name $ACCOUNT \\
  --static-website \\
  --index-document index.html \\
  --404-document 404.html

# Upload files (to the $web container)
az storage blob upload-batch \\
  --account-name $ACCOUNT \\
  --source ./my-site \\
  --destination '$web'

# Get the URL
az storage account show \\
  --name $ACCOUNT \\
  --resource-group $RG \\
  --query "primaryEndpoints.web" -o tsv`,
        },
      },
      {
        title: "Verify your deployment",
        body: "Open the URL printed in the previous step in your browser. You should see the HTML page you uploaded.\n\nYou can also verify from the command line.",
        code: {
          lang: "bash",
          label: "Test the endpoint",
          snippet: `# Replace with your actual URL
curl -I https://your-bucket-url/index.html`,
        },
      },
    ],
    cleanup: "Delete the bucket/storage account to avoid ongoing storage charges:\n\n```bash\n# AWS\naws s3 rb s3://$BUCKET --force\n\n# GCP\ngsutil rm -r gs://$BUCKET/\n\n# Azure\naz group delete --name $RG --yes\n```",
    nextSteps: [
      "Add a CDN (CloudFront / Cloud CDN / Azure CDN) in front for HTTPS and edge caching",
      "Set up a CI/CD pipeline to auto-deploy on git push",
      "Configure a custom domain with DNS",
    ],
  },
  {
    id: "iam-least-privilege",
    title: "IAM: Implement least-privilege access",
    desc: "Create roles, attach policies, and verify access boundaries across clouds.",
    level: "Intermediate",
    time: "35 min",
    tags: ["IAM", "Roles", "Policies", "Security"],
    free: true,
    intro:
      "Least-privilege access is the most important security principle in cloud. In this lab, you'll create a service account / role with the minimum permissions needed to read from object storage — and verify that write access is denied.",
    prerequisites: [
      "AWS CLI, gcloud CLI, or az CLI installed and authenticated",
      "An existing S3 bucket / GCS bucket / Azure Storage account (or create one from the previous lab)",
    ],
    steps: [
      {
        title: "AWS: Create a least-privilege IAM role",
        body: "Create an IAM role that allows reading from one specific S3 bucket — and nothing else.",
        code: {
          lang: "bash",
          label: "AWS least-privilege role",
          snippet: `BUCKET="your-bucket-name"
ROLE_NAME="s3-readonly-role"

# Create role (trust policy allows EC2 to assume it)
aws iam create-role \\
  --role-name $ROLE_NAME \\
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":{"Service":"ec2.amazonaws.com"},
      "Action":"sts:AssumeRole"
    }]
  }'

# Create least-privilege policy
aws iam create-policy \\
  --policy-name s3-readonly-policy \\
  --policy-document "{
    \\"Version\\":\\"2012-10-17\\",
    \\"Statement\\":[{
      \\"Effect\\":\\"Allow\\",
      \\"Action\\":[\\"s3:GetObject\\",\\"s3:ListBucket\\"],
      \\"Resource\\":[
        \\"arn:aws:s3:::$BUCKET\\",
        \\"arn:aws:s3:::$BUCKET/*\\"
      ]
    }]
  }"

# Attach policy to role
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws iam attach-role-policy \\
  --role-name $ROLE_NAME \\
  --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/s3-readonly-policy`,
        },
        tip: "Use `aws iam simulate-principal-policy` to test whether a role is allowed or denied specific actions before deploying.",
      },
      {
        title: "GCP: Create a custom IAM role",
        body: "Create a custom GCP role with only the permissions needed to read from a Cloud Storage bucket.",
        code: {
          lang: "bash",
          label: "GCP custom IAM role",
          snippet: `PROJECT=$(gcloud config get-value project)
BUCKET="your-bucket-name"
SA_NAME="storage-reader-sa"

# Create service account
gcloud iam service-accounts create $SA_NAME \\
  --display-name="Storage Reader" \\
  --project=$PROJECT

SA_EMAIL="$SA_NAME@$PROJECT.iam.gserviceaccount.com"

# Grant storage.objectViewer on the specific bucket only
gsutil iam ch serviceAccount:$SA_EMAIL:objectViewer gs://$BUCKET/

# Verify (should show the binding)
gsutil iam get gs://$BUCKET/

# Test: generate access token and try listing objects
gcloud auth print-access-token --impersonate-service-account=$SA_EMAIL`,
        },
        warning: "Granting roles at the project level instead of the resource level is a common over-privilege mistake. Always scope to the narrowest resource.",
      },
      {
        title: "Azure: Create a custom RBAC role",
        body: "Create a custom Azure role definition with only blob read permissions, then assign it to a managed identity.",
        code: {
          lang: "bash",
          label: "Azure custom RBAC role",
          snippet: `RG="my-rg"
ACCOUNT="mystorageaccount"
SUBSCRIPTION=$(az account show --query id -o tsv)

# Create custom role definition
cat > custom-role.json << EOF
{
  "Name": "Storage Blob Reader Scoped",
  "Description": "Read blobs from a specific container",
  "Actions": [],
  "DataActions": [
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/$SUBSCRIPTION/resourceGroups/$RG"
  ]
}
EOF

az role definition create --role-definition custom-role.json

# Create managed identity
az identity create --name blob-reader-identity --resource-group $RG
IDENTITY_ID=$(az identity show --name blob-reader-identity \\
  --resource-group $RG --query principalId -o tsv)

# Assign role to identity scoped to the storage account
SCOPE="/subscriptions/$SUBSCRIPTION/resourceGroups/$RG/providers/Microsoft.Storage/storageAccounts/$ACCOUNT"
az role assignment create \\
  --assignee $IDENTITY_ID \\
  --role "Storage Blob Reader Scoped" \\
  --scope $SCOPE`,
        },
      },
      {
        title: "Verify access boundaries",
        body: "Test that the role can read but cannot write — confirming least-privilege is enforced.",
        code: {
          lang: "bash",
          label: "Test with AWS IAM policy simulator",
          snippet: `# AWS: Simulate allowed action (should return allowed)
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::$ACCOUNT_ID:role/s3-readonly-role \\
  --action-names s3:GetObject \\
  --resource-arns "arn:aws:s3:::$BUCKET/test.txt"

# Simulate denied action (should return implicitDeny)
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::$ACCOUNT_ID:role/s3-readonly-role \\
  --action-names s3:PutObject \\
  --resource-arns "arn:aws:s3:::$BUCKET/test.txt"`,
        },
        tip: "Always test both the allowed path AND the denied path. A role that can't do what it needs is just as broken as one that can do too much.",
      },
    ],
    cleanup:
      "```bash\n# AWS\naws iam detach-role-policy --role-name s3-readonly-role --policy-arn ...\naws iam delete-role --role-name s3-readonly-role\n\n# GCP\ngcloud iam service-accounts delete $SA_EMAIL\n\n# Azure\naz identity delete --name blob-reader-identity --resource-group $RG\naz role definition delete --name 'Storage Blob Reader Scoped'\n```",
    nextSteps: [
      "Explore AWS Service Control Policies (SCPs) for org-wide guardrails",
      "Learn GCP's Organization Policy constraints",
      "Set up Azure Policy for automated compliance checks",
    ],
  },
  {
    id: "deploy-container-k8s",
    title: "Deploy a containerised app to Kubernetes",
    desc: "Build a Docker image and deploy to EKS, GKE, or AKS with a LoadBalancer service.",
    level: "Intermediate",
    time: "45 min",
    tags: ["EKS", "GKE", "AKS", "Docker"],
    free: true,
    intro:
      "Kubernetes is the lingua franca of container orchestration across all three clouds. In this lab, you'll containerise a simple Node.js app, push it to a container registry, and deploy it to a Kubernetes cluster with a public load balancer.",
    prerequisites: [
      "Docker installed and running",
      "kubectl installed",
      "A Kubernetes cluster (EKS, GKE, or AKS) — see the respective Learn paths for setup",
      "Access to a container registry (ECR, Artifact Registry, or ACR)",
    ],
    steps: [
      {
        title: "Create a sample app",
        body: "Create a minimal Node.js HTTP server.",
        code: {
          lang: "bash",
          label: "Create app files",
          snippet: `mkdir k8s-app && cd k8s-app

# app.js
cat > app.js << 'EOF'
const http = require("http");
const PORT = process.env.PORT || 8080;
const CLOUD = process.env.CLOUD_PROVIDER || "unknown";

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    message: "Hello from Kubernetes!",
    cloud: CLOUD,
    hostname: require("os").hostname(),
  }));
}).listen(PORT, () => console.log(\`Listening on :\${PORT}\`));
EOF

# Dockerfile
cat > Dockerfile << 'EOF'
FROM node:22-alpine
WORKDIR /app
COPY app.js .
EXPOSE 8080
CMD ["node", "app.js"]
EOF`,
        },
      },
      {
        title: "Build and push the container image",
        body: "Build the Docker image and push to the cloud-native registry for your target cluster.",
        code: {
          lang: "bash",
          label: "Build and push (choose your cloud)",
          snippet: `# ── AWS ECR ────────────────────────────────────────────
REGION="ap-southeast-1"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
ECR="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com"

aws ecr create-repository --repository-name k8s-app --region $REGION
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR

docker build -t $ECR/k8s-app:v1 .
docker push $ECR/k8s-app:v1

# ── GCP Artifact Registry ──────────────────────────────
PROJECT=$(gcloud config get-value project)
gcloud artifacts repositories create k8s-app \\
  --repository-format=docker --location=asia-southeast1

gcloud auth configure-docker asia-southeast1-docker.pkg.dev
AR="asia-southeast1-docker.pkg.dev/$PROJECT/k8s-app"

docker build -t $AR/app:v1 .
docker push $AR/app:v1

# ── Azure ACR ─────────────────────────────────────────
ACR="myregistry$(openssl rand -hex 3)"
az acr create --name $ACR --resource-group my-aks-rg --sku Basic

az acr login --name $ACR
docker build -t $ACR.azurecr.io/k8s-app:v1 .
docker push $ACR.azurecr.io/k8s-app:v1`,
        },
      },
      {
        title: "Write Kubernetes manifests",
        body: "Create a Deployment and a Service. These manifests work on any cluster — EKS, GKE, or AKS.",
        code: {
          lang: "yaml",
          label: "deployment.yaml",
          snippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-app
  labels:
    app: k8s-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: k8s-app
  template:
    metadata:
      labels:
        app: k8s-app
    spec:
      containers:
        - name: app
          image: <YOUR_IMAGE_URI>:v1   # replace with ECR / AR / ACR URI
          ports:
            - containerPort: 8080
          env:
            - name: CLOUD_PROVIDER
              value: "aws"             # change to gcp or azure
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "256Mi"
          readinessProbe:
            httpGet:
              path: /
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: k8s-app-svc
spec:
  selector:
    app: k8s-app
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 8080`,
        },
        tip: "Always set resource requests and limits. Without them, a noisy pod can starve other workloads on the same node.",
      },
      {
        title: "Deploy and verify",
        body: "Apply the manifests and watch the Pods come up.",
        code: {
          lang: "bash",
          label: "Deploy and verify",
          snippet: `# Apply manifests
kubectl apply -f deployment.yaml

# Watch Pods start
kubectl get pods -w

# Wait for external IP
kubectl get service k8s-app-svc --watch

# Once EXTERNAL-IP is assigned, test the endpoint
EXTERNAL_IP=$(kubectl get svc k8s-app-svc -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl http://$EXTERNAL_IP/

# Check logs
kubectl logs -l app=k8s-app --tail=20

# Scale to 5 replicas
kubectl scale deployment k8s-app --replicas=5`,
        },
      },
      {
        title: "Roll out a new version",
        body: "Update the image tag and roll out a new version with zero downtime.",
        code: {
          lang: "bash",
          label: "Rolling update",
          snippet: `# Build and push v2
docker build -t <YOUR_REGISTRY>/k8s-app:v2 .
docker push <YOUR_REGISTRY>/k8s-app:v2

# Update the image (triggers rolling update)
kubectl set image deployment/k8s-app app=<YOUR_REGISTRY>/k8s-app:v2

# Watch rollout
kubectl rollout status deployment/k8s-app

# If something goes wrong, rollback
kubectl rollout undo deployment/k8s-app`,
        },
      },
    ],
    cleanup:
      "```bash\nkubectl delete -f deployment.yaml\n# Delete your cluster if created for this lab\n```",
    nextSteps: [
      "Add an Ingress controller (AWS Load Balancer Controller / GKE Gateway / AKS Application Gateway)",
      "Configure Horizontal Pod Autoscaler (HPA) based on CPU/RPS",
      "Set up monitoring with Prometheus and Grafana",
    ],
  },
  {
    id: "serverless-api",
    title: "Build a serverless REST API",
    desc: "Create an HTTP endpoint using Lambda + API Gateway, Cloud Functions, or Azure Functions.",
    level: "Beginner",
    time: "30 min",
    tags: ["Lambda", "API Gateway", "Cloud Functions"],
    free: true,
    intro:
      "Serverless functions are the fastest way to expose an HTTP API — no servers, no containers, no scaling config. In this lab, you'll build a simple REST endpoint that returns JSON, deployed on all three clouds.",
    prerequisites: [
      "AWS CLI, gcloud CLI, or az CLI installed and authenticated",
      "Node.js 20+ installed",
      "AWS SAM CLI (optional, for local testing) or Azure Functions Core Tools",
    ],
    steps: [
      {
        title: "AWS: Lambda + API Gateway",
        body: "Create a Lambda function and expose it via an HTTP API Gateway.",
        code: {
          lang: "bash",
          label: "Deploy Lambda HTTP API",
          snippet: `# Create handler
mkdir lambda-api && cd lambda-api
cat > index.mjs << 'EOF'
export const handler = async (event) => {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  if (method === "GET" && path === "/hello") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello from Lambda!", cloud: "aws" }),
    };
  }
  return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
};
EOF

zip function.zip index.mjs

# Create IAM role for Lambda
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws iam create-role \\
  --role-name lambda-http-role \\
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
aws iam attach-role-policy \\
  --role-name lambda-http-role \\
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

sleep 10  # Wait for role propagation

# Create Lambda function
aws lambda create-function \\
  --function-name hello-api \\
  --runtime nodejs22.x \\
  --handler index.handler \\
  --role arn:aws:iam::$ACCOUNT:role/lambda-http-role \\
  --zip-file fileb://function.zip

# Create HTTP API Gateway
API_ID=$(aws apigatewayv2 create-api \\
  --name hello-api \\
  --protocol-type HTTP \\
  --query ApiId --output text)

# Create Lambda integration
FUNC_ARN=$(aws lambda get-function --function-name hello-api --query Configuration.FunctionArn --output text)
INTEG_ID=$(aws apigatewayv2 create-integration \\
  --api-id $API_ID \\
  --integration-type AWS_PROXY \\
  --integration-uri $FUNC_ARN \\
  --payload-format-version 2.0 \\
  --query IntegrationId --output text)

# Add route and deploy
aws apigatewayv2 create-route --api-id $API_ID --route-key "GET /hello" --target integrations/$INTEG_ID
aws apigatewayv2 create-stage --api-id $API_ID --stage-name '$default' --auto-deploy

# Allow API Gateway to invoke Lambda
aws lambda add-permission \\
  --function-name hello-api \\
  --statement-id api-invoke \\
  --action lambda:InvokeFunction \\
  --principal apigateway.amazonaws.com

echo "URL: https://$API_ID.execute-api.ap-southeast-1.amazonaws.com/hello"`,
        },
      },
      {
        title: "GCP: Cloud Functions HTTP trigger",
        body: "Deploy an HTTP-triggered Cloud Function (2nd gen) using Cloud Run under the hood.",
        code: {
          lang: "bash",
          label: "Deploy GCP Cloud Function",
          snippet: `mkdir gcp-function && cd gcp-function
cat > index.js << 'EOF'
const functions = require("@google-cloud/functions-framework");

functions.http("helloApi", (req, res) => {
  res.json({ message: "Hello from Cloud Functions!", cloud: "gcp" });
});
EOF

cat > package.json << 'EOF'
{
  "name": "hello-api",
  "dependencies": {
    "@google-cloud/functions-framework": "^3.0.0"
  }
}
EOF

# Deploy
gcloud functions deploy hello-api \\
  --gen2 \\
  --runtime=nodejs20 \\
  --region=asia-southeast1 \\
  --source=. \\
  --entry-point=helloApi \\
  --trigger-http \\
  --allow-unauthenticated

# Get URL
gcloud functions describe hello-api \\
  --region=asia-southeast1 \\
  --gen2 \\
  --format="value(serviceConfig.uri)"`,
        },
      },
      {
        title: "Azure: HTTP-triggered Function App",
        body: "Create and deploy an Azure Functions app with an HTTP trigger.",
        code: {
          lang: "bash",
          label: "Deploy Azure Function App",
          snippet: `# Init project with Azure Functions Core Tools
npm install -g azure-functions-core-tools@4 --unsafe-perm
func init azure-function-api --typescript
cd azure-function-api

# Create HTTP trigger
func new --name HelloApi --template "HTTP trigger" --authlevel anonymous

# Edit src/functions/HelloApi.ts
cat > src/functions/HelloApi.ts << 'EOF'
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
export async function HelloApi(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  return { status: 200, jsonBody: { message: "Hello from Azure Functions!", cloud: "azure" } };
}
app.http("HelloApi", { methods: ["GET"], authLevel: "anonymous", handler: HelloApi });
EOF

# Create Azure resources and deploy
RG="func-api-rg"
STORAGE="funcstore$(openssl rand -hex 3)"
FUNCAPP="hello-api-$(openssl rand -hex 3)"

az group create --name $RG --location southeastasia
az storage account create --name $STORAGE --resource-group $RG --sku Standard_LRS
az functionapp create \\
  --resource-group $RG \\
  --consumption-plan-location southeastasia \\
  --runtime node --runtime-version 20 \\
  --functions-version 4 \\
  --name $FUNCAPP \\
  --storage-account $STORAGE

npm run build
func azure functionapp publish $FUNCAPP
echo "URL: https://$FUNCAPP.azurewebsites.net/api/HelloApi"`,
        },
      },
      {
        title: "Test all three endpoints",
        body: "Verify each deployment returns the expected JSON response.",
        code: {
          lang: "bash",
          label: "Test endpoints",
          snippet: `# AWS
curl https://YOUR_API_ID.execute-api.ap-southeast-1.amazonaws.com/hello

# GCP
curl https://asia-southeast1-YOUR_PROJECT.cloudfunctions.net/hello-api

# Azure
curl https://YOUR_FUNCAPP.azurewebsites.net/api/HelloApi

# Expected response from each:
# {"message":"Hello from ...!","cloud":"aws|gcp|azure"}`,
        },
      },
    ],
    cleanup:
      "```bash\n# AWS\naws lambda delete-function --function-name hello-api\naws apigatewayv2 delete-api --api-id $API_ID\n\n# GCP\ngcloud functions delete hello-api --region=asia-southeast1 --gen2\n\n# Azure\naz group delete --name func-api-rg --yes\n```",
    nextSteps: [
      "Add request validation and error handling to the function",
      "Connect to a database (DynamoDB / Firestore / CosmosDB)",
      "Protect the endpoint with API keys or JWT authentication",
    ],
  },
  {
    id: "cloudwatch-alerts",
    title: "Set up monitoring and alerting",
    desc: "Create dashboards, metric alarms, and notification channels across clouds.",
    level: "Intermediate",
    time: "30 min",
    tags: ["CloudWatch", "Cloud Monitoring", "Azure Monitor"],
    free: true,
    intro:
      "Observability is non-negotiable in production. In this lab, you'll set up metric-based alarms that send notifications when CPU usage exceeds a threshold — the same pattern used for latency, error rates, and any custom metric.",
    prerequisites: [
      "A running EC2 instance, GCE VM, or Azure VM (or adapt to Lambda/Cloud Run/Azure Functions)",
      "An email address for alert notifications",
    ],
    steps: [
      {
        title: "AWS: CloudWatch alarm + SNS notification",
        body: "Create a CloudWatch alarm on EC2 CPU utilisation and send an alert via SNS email.",
        code: {
          lang: "bash",
          label: "CloudWatch alarm",
          snippet: `INSTANCE_ID="i-0123456789abcdef0"  # your EC2 instance
EMAIL="you@example.com"
REGION="ap-southeast-1"

# Create SNS topic
TOPIC_ARN=$(aws sns create-topic --name ec2-alerts --query TopicArn --output text)

# Subscribe email
aws sns subscribe \\
  --topic-arn $TOPIC_ARN \\
  --protocol email \\
  --notification-endpoint $EMAIL

echo "Check $EMAIL and confirm the subscription before continuing."

# Create CloudWatch alarm: CPU > 80% for 2 consecutive 5-min periods
aws cloudwatch put-metric-alarm \\
  --alarm-name "high-cpu-$INSTANCE_ID" \\
  --alarm-description "Alert when CPU > 80% for 10 minutes" \\
  --namespace AWS/EC2 \\
  --metric-name CPUUtilization \\
  --dimensions Name=InstanceId,Value=$INSTANCE_ID \\
  --statistic Average \\
  --period 300 \\
  --evaluation-periods 2 \\
  --threshold 80 \\
  --comparison-operator GreaterThanThreshold \\
  --alarm-actions $TOPIC_ARN \\
  --ok-actions $TOPIC_ARN

# View alarm state
aws cloudwatch describe-alarms \\
  --alarm-names "high-cpu-$INSTANCE_ID" \\
  --query 'MetricAlarms[0].StateValue'`,
        },
        tip: "Set both --alarm-actions (fires when threshold breached) and --ok-actions (fires when alarm recovers). Recovery notifications reduce alert fatigue.",
      },
      {
        title: "GCP: Cloud Monitoring alerting policy",
        body: "Create a GCP alerting policy with an email notification channel.",
        code: {
          lang: "bash",
          label: "GCP alerting policy",
          snippet: `PROJECT=$(gcloud config get-value project)
EMAIL="you@example.com"
INSTANCE_ID="your-instance-id"
ZONE="asia-southeast1-a"

# Create notification channel
CHANNEL=$(gcloud alpha monitoring channels create \\
  --display-name="Email Alerts" \\
  --type=email \\
  --channel-labels=email_address=$EMAIL \\
  --format="value(name)")

# Create alerting policy (CPU > 80%)
cat > alert-policy.json << EOF
{
  "displayName": "High CPU - $INSTANCE_ID",
  "conditions": [{
    "displayName": "CPU > 80%",
    "conditionThreshold": {
      "filter": "metric.type=\\"compute.googleapis.com/instance/cpu/utilization\\" AND resource.labels.instance_id=\\"$INSTANCE_ID\\"",
      "aggregations": [{"alignmentPeriod": "300s","perSeriesAligner": "ALIGN_MEAN"}],
      "comparison": "COMPARISON_GT",
      "thresholdValue": 0.8,
      "duration": "300s"
    }
  }],
  "notificationChannels": ["$CHANNEL"],
  "alertStrategy": {"autoClose": "604800s"}
}
EOF

gcloud alpha monitoring policies create --policy-from-file=alert-policy.json`,
        },
      },
      {
        title: "Azure: Metric alert rule",
        body: "Create an Azure Monitor alert rule for VM CPU with an action group for email notifications.",
        code: {
          lang: "bash",
          label: "Azure Monitor alert",
          snippet: `RG="my-rg"
VM_NAME="my-vm"
EMAIL="you@example.com"
VM_ID=$(az vm show --resource-group $RG --name $VM_NAME --query id -o tsv)

# Create action group (notification destination)
az monitor action-group create \\
  --name my-action-group \\
  --resource-group $RG \\
  --short-name myag \\
  --action email admin $EMAIL

ACTION_GROUP=$(az monitor action-group show \\
  --name my-action-group --resource-group $RG --query id -o tsv)

# Create metric alert: CPU > 80% over 5 min
az monitor metrics alert create \\
  --name "high-cpu-$VM_NAME" \\
  --resource-group $RG \\
  --scopes $VM_ID \\
  --condition "avg Percentage CPU > 80" \\
  --window-size 5m \\
  --evaluation-frequency 1m \\
  --action $ACTION_GROUP \\
  --description "Alert when CPU exceeds 80%"`,
        },
      },
    ],
    cleanup:
      "```bash\n# AWS\naws cloudwatch delete-alarms --alarm-names high-cpu-$INSTANCE_ID\naws sns delete-topic --topic-arn $TOPIC_ARN\n\n# GCP\ngcloud alpha monitoring policies delete POLICY_ID\n\n# Azure\naz monitor metrics alert delete --name high-cpu-$VM_NAME --resource-group $RG\n```",
    nextSteps: [
      "Create a dashboard to visualise multiple metrics in one view",
      "Set up log-based alerts for application errors",
      "Explore PagerDuty or OpsGenie integration for on-call routing",
    ],
  },
  ...[vpcLab, observabilityLab, multiCloudLab].map((l) => ({
    ...l,
    desc: (l as unknown as { description: string }).description,
    time: (l as unknown as { duration: string }).duration,
    tags: [(l as unknown as { cloud: string }).cloud, (l as unknown as { category: string }).category].filter(Boolean),
    free: true,
    intro: (l as unknown as { description: string }).description,
  })) as unknown as Lab[],
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export const cloudMap: Record<CloudName, CloudConfig> = {
  aws: awsContent,
  gcp: gcpContent,
  azure: azureContent,
};

export function getCloud(cloud: string): CloudConfig | undefined {
  return cloudMap[cloud as CloudName];
}

export function getTopic(cloud: CloudConfig, topicId: string): Topic | undefined {
  for (const mod of cloud.modules) {
    const topic = mod.topics.find((t) => t.id === topicId);
    if (topic) return topic;
  }
}

export function getLab(labId: string): Lab | undefined {
  return labs.find((l) => l.id === labId);
}
