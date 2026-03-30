interface LabStep {
  title: string;
  body: string;
  code?: { lang: string; label: string; snippet: string };
}

interface Lab {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  cloud: string;
  category: string;
  description: string;
  prerequisites: string[];
  steps: LabStep[];
}

export const vpcLab: Lab = {
  id: "vpc-private-public",
  title: "Set Up a VPC with Public & Private Subnets",
  level: "Intermediate",
  duration: "45 min",
  cloud: "AWS",
  category: "Networking",
  description:
    "Set up a production-grade VPC with public and private subnets, NAT gateway, and a bastion host for secure SSH access.",
  prerequisites: [
    "AWS CLI configured",
    "Basic understanding of networking (CIDR)",
    "An AWS account",
  ],
  steps: [
    {
      title: "Create the VPC",
      body: "Create a new VPC with a /16 CIDR block, giving you 65,536 private IP addresses across all subnets. Enabling DNS hostnames allows instances to receive public DNS entries, which is required for services that rely on hostname-based resolution.",
      code: {
        lang: "bash",
        label: "Create VPC and enable DNS hostnames",
        snippet: `# Create the VPC
VPC_ID=$(aws ec2 create-vpc \\
  --cidr-block 10.0.0.0/16 \\
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=prod-vpc}]' \\
  --query 'Vpc.VpcId' \\
  --output text)

echo "VPC: $VPC_ID"

# Enable DNS hostnames (required for public DNS resolution)
aws ec2 modify-vpc-attribute \\
  --vpc-id $VPC_ID \\
  --enable-dns-hostnames

# Enable DNS support
aws ec2 modify-vpc-attribute \\
  --vpc-id $VPC_ID \\
  --enable-dns-support`,
      },
    },
    {
      title: "Create public subnets",
      body: "Create two public subnets in separate Availability Zones for high availability. Each subnet gets a /24 CIDR (256 addresses). Enabling auto-assign public IP ensures instances launched here receive a public IP without manual configuration.",
      code: {
        lang: "bash",
        label: "Create public subnets in two AZs",
        snippet: `REGION="us-east-1"

# Public subnet in AZ-a
PUB_SUBNET_A=$(aws ec2 create-subnet \\
  --vpc-id $VPC_ID \\
  --cidr-block 10.0.1.0/24 \\
  --availability-zone \${REGION}a \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=pub-subnet-a}]' \\
  --query 'Subnet.SubnetId' \\
  --output text)

# Public subnet in AZ-b
PUB_SUBNET_B=$(aws ec2 create-subnet \\
  --vpc-id $VPC_ID \\
  --cidr-block 10.0.2.0/24 \\
  --availability-zone \${REGION}b \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=pub-subnet-b}]' \\
  --query 'Subnet.SubnetId' \\
  --output text)

# Auto-assign public IPs in public subnets
aws ec2 modify-subnet-attribute --subnet-id $PUB_SUBNET_A --map-public-ip-on-launch
aws ec2 modify-subnet-attribute --subnet-id $PUB_SUBNET_B --map-public-ip-on-launch

echo "Public subnets: $PUB_SUBNET_A  $PUB_SUBNET_B"`,
      },
    },
    {
      title: "Create private subnets",
      body: "Create two private subnets in separate AZs for backend services and databases. These subnets use a higher octet (10.0.10.x, 10.0.11.x) to visually distinguish them from public subnets. Instances here will have no direct internet route — all outbound traffic will flow through the NAT Gateway created in a later step.",
      code: {
        lang: "bash",
        label: "Create private subnets in two AZs",
        snippet: `# Private subnet in AZ-a
PRIV_SUBNET_A=$(aws ec2 create-subnet \\
  --vpc-id $VPC_ID \\
  --cidr-block 10.0.10.0/24 \\
  --availability-zone \${REGION}a \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=priv-subnet-a}]' \\
  --query 'Subnet.SubnetId' \\
  --output text)

# Private subnet in AZ-b
PRIV_SUBNET_B=$(aws ec2 create-subnet \\
  --vpc-id $VPC_ID \\
  --cidr-block 10.0.11.0/24 \\
  --availability-zone \${REGION}b \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=priv-subnet-b}]' \\
  --query 'Subnet.SubnetId' \\
  --output text)

echo "Private subnets: $PRIV_SUBNET_A  $PRIV_SUBNET_B"`,
      },
    },
    {
      title: "Create and attach an Internet Gateway",
      body: "An Internet Gateway (IGW) is the VPC component that enables bidirectional communication between resources in public subnets and the internet. You must both create the IGW and explicitly attach it to your VPC — a detached IGW provides no routing.",
      code: {
        lang: "bash",
        label: "Create and attach Internet Gateway",
        snippet: `# Create the Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \\
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=prod-igw}]' \\
  --query 'InternetGateway.InternetGatewayId' \\
  --output text)

echo "IGW: $IGW_ID"

# Attach it to the VPC
aws ec2 attach-internet-gateway \\
  --internet-gateway-id $IGW_ID \\
  --vpc-id $VPC_ID`,
      },
    },
    {
      title: "Create the public route table and associate subnets",
      body: "A route table controls where traffic flows from a subnet. Create a dedicated public route table with a default route (0.0.0.0/0) pointing to the IGW, then associate both public subnets. Without this association, subnets fall back to the VPC's main route table, which has no internet route.",
      code: {
        lang: "bash",
        label: "Public route table with IGW default route",
        snippet: `# Create public route table
PUB_RT=$(aws ec2 create-route-table \\
  --vpc-id $VPC_ID \\
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=pub-rt}]' \\
  --query 'RouteTable.RouteTableId' \\
  --output text)

# Add default route to Internet Gateway
aws ec2 create-route \\
  --route-table-id $PUB_RT \\
  --destination-cidr-block 0.0.0.0/0 \\
  --gateway-id $IGW_ID

# Associate both public subnets
aws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id $PUB_SUBNET_A
aws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id $PUB_SUBNET_B

echo "Public route table $PUB_RT associated with both public subnets"`,
      },
    },
    {
      title: "Create a NAT Gateway with an Elastic IP",
      body: "A NAT Gateway allows instances in private subnets to initiate outbound internet requests (e.g., downloading packages) without being reachable from the internet. It must live in a public subnet and requires a static Elastic IP address. NAT Gateways are AZ-specific; for production, deploy one per AZ.",
      code: {
        lang: "bash",
        label: "Allocate Elastic IP and create NAT Gateway",
        snippet: `# Allocate an Elastic IP for the NAT Gateway
EIP_ALLOC=$(aws ec2 allocate-address \\
  --domain vpc \\
  --tag-specifications 'ResourceType=elastic-ip,Tags=[{Key=Name,Value=prod-nat-eip}]' \\
  --query 'AllocationId' \\
  --output text)

echo "EIP allocation: $EIP_ALLOC"

# Create NAT Gateway in the first public subnet
NAT_GW=$(aws ec2 create-nat-gateway \\
  --subnet-id $PUB_SUBNET_A \\
  --allocation-id $EIP_ALLOC \\
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=prod-nat}]' \\
  --query 'NatGateway.NatGatewayId' \\
  --output text)

echo "NAT Gateway: $NAT_GW"

# Wait until available before creating private routes
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GW
echo "NAT Gateway is available"`,
      },
    },
    {
      title: "Create the private route table and associate subnets",
      body: "Create a private route table with a default route pointing to the NAT Gateway, then associate both private subnets. Traffic destined for the internet from private instances will now flow: instance → private subnet → NAT Gateway (in public subnet) → Internet Gateway → internet. The return path is handled automatically.",
      code: {
        lang: "bash",
        label: "Private route table with NAT Gateway default route",
        snippet: `# Create private route table
PRIV_RT=$(aws ec2 create-route-table \\
  --vpc-id $VPC_ID \\
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=priv-rt}]' \\
  --query 'RouteTable.RouteTableId' \\
  --output text)

# Default route via NAT Gateway
aws ec2 create-route \\
  --route-table-id $PRIV_RT \\
  --destination-cidr-block 0.0.0.0/0 \\
  --nat-gateway-id $NAT_GW

# Associate both private subnets
aws ec2 associate-route-table --route-table-id $PRIV_RT --subnet-id $PRIV_SUBNET_A
aws ec2 associate-route-table --route-table-id $PRIV_RT --subnet-id $PRIV_SUBNET_B

echo "VPC setup complete. Summary:"
echo "  VPC:              $VPC_ID"
echo "  Public subnets:   $PUB_SUBNET_A  $PUB_SUBNET_B"
echo "  Private subnets:  $PRIV_SUBNET_A  $PRIV_SUBNET_B"
echo "  IGW:              $IGW_ID"
echo "  NAT Gateway:      $NAT_GW"`,
      },
    },
  ],
};

export const observabilityLab: Lab = {
  id: "observability-dashboard",
  title: "Set Up CloudWatch Dashboard & Alerts",
  level: "Beginner",
  duration: "30 min",
  cloud: "AWS",
  category: "Observability",
  description:
    "Create a CloudWatch dashboard for an EC2 instance, set up CPU and memory alarms, and configure SNS email notifications.",
  prerequisites: [
    "AWS CLI configured",
    "A running EC2 instance",
    "An email address for notifications",
  ],
  steps: [
    {
      title: "Create an SNS topic and subscribe your email",
      body: "SNS (Simple Notification Service) is the notification backbone for CloudWatch alarms. Create a standard topic and immediately subscribe your email address — SNS will send a confirmation email you must approve before alerts can be delivered.",
      code: {
        lang: "bash",
        label: "Create SNS topic and email subscription",
        snippet: `REGION="us-east-1"
EMAIL="you@example.com"

# Create an SNS topic
TOPIC_ARN=$(aws sns create-topic \\
  --name ec2-alerts \\
  --region $REGION \\
  --query 'TopicArn' \\
  --output text)

echo "Topic ARN: $TOPIC_ARN"

# Subscribe your email address
aws sns subscribe \\
  --topic-arn $TOPIC_ARN \\
  --protocol email \\
  --notification-endpoint $EMAIL \\
  --region $REGION`,
      },
    },
    {
      title: "Confirm the SNS email subscription",
      body: "AWS sends a confirmation email to your address with a link you must click before any notifications will be delivered. Check your inbox (and spam folder) for a message with subject 'AWS Notification - Subscription Confirmation'. After confirming, you can verify the subscription status via the CLI.",
      code: {
        lang: "bash",
        label: "Verify subscription status",
        snippet: `# List subscriptions for the topic — look for PendingConfirmation → Confirmed
aws sns list-subscriptions-by-topic \\
  --topic-arn $TOPIC_ARN \\
  --region $REGION \\
  --query 'Subscriptions[*].{Protocol:Protocol,Endpoint:Endpoint,SubscriptionArn:SubscriptionArn}' \\
  --output table`,
      },
    },
    {
      title: "Create a CPU utilisation alarm",
      body: "CloudWatch alarms evaluate a metric against a threshold over a rolling window. This alarm triggers when average CPU exceeds 80% for two consecutive 5-minute periods — requiring sustained high load rather than a single spike. The alarm transitions to ALARM state and immediately publishes to your SNS topic.",
      code: {
        lang: "bash",
        label: "CPU utilisation alarm (>80% for 2 × 5 min)",
        snippet: `INSTANCE_ID="i-0123456789abcdef0"   # Replace with your instance ID

aws cloudwatch put-metric-alarm \\
  --alarm-name "ec2-high-cpu" \\
  --alarm-description "CPU utilisation above 80% for 10 minutes" \\
  --metric-name CPUUtilization \\
  --namespace AWS/EC2 \\
  --dimensions Name=InstanceId,Value=$INSTANCE_ID \\
  --statistic Average \\
  --period 300 \\
  --evaluation-periods 2 \\
  --threshold 80 \\
  --comparison-operator GreaterThanThreshold \\
  --treat-missing-data notBreaching \\
  --alarm-actions $TOPIC_ARN \\
  --ok-actions $TOPIC_ARN \\
  --region $REGION

echo "CPU alarm created"`,
      },
    },
    {
      title: "Install the CloudWatch Agent for memory metrics",
      body: "EC2 does not publish memory metrics to CloudWatch by default — the hypervisor cannot observe guest OS memory usage. The unified CloudWatch Agent runs inside the instance, reads /proc/meminfo, and ships the data as a custom metric under the CWAgent namespace. Install and start it with the SSM parameter config shown below.",
      code: {
        lang: "bash",
        label: "Install and configure CloudWatch Agent via SSM",
        snippet: `# Install the agent using SSM Run Command (no SSH needed)
aws ssm send-command \\
  --instance-ids $INSTANCE_ID \\
  --document-name "AWS-ConfigureAWSPackage" \\
  --parameters '{"action":["Install"],"name":["AmazonCloudWatchAgent"]}' \\
  --region $REGION

# Write a minimal agent config to SSM Parameter Store
aws ssm put-parameter \\
  --name "/cloudwatch-agent/config" \\
  --type String \\
  --overwrite \\
  --value '{
    "metrics": {
      "append_dimensions": {
        "InstanceId": "\${aws:InstanceId}"
      },
      "metrics_collected": {
        "mem": {
          "measurement": ["mem_used_percent"],
          "metrics_collection_interval": 60
        }
      }
    }
  }' \\
  --region $REGION

# Start the agent with that config
aws ssm send-command \\
  --instance-ids $INSTANCE_ID \\
  --document-name "AmazonCloudWatch-ManageAgent" \\
  --parameters '{"action":["configure"],"optionalConfigurationSource":["ssm"],"optionalConfigurationLocation":["/cloudwatch-agent/config"],"optionalRestart":["yes"]}' \\
  --region $REGION`,
      },
    },
    {
      title: "Create a memory utilisation alarm",
      body: "Once the CloudWatch Agent has been running for at least one collection interval (60 seconds), the mem_used_percent metric will appear in the CWAgent namespace. This alarm fires when memory usage exceeds 85% for two consecutive minutes, giving you early warning before the instance starts swapping.",
      code: {
        lang: "bash",
        label: "Memory utilisation alarm (>85% for 2 × 1 min)",
        snippet: `aws cloudwatch put-metric-alarm \\
  --alarm-name "ec2-high-memory" \\
  --alarm-description "Memory utilisation above 85% for 2 minutes" \\
  --metric-name mem_used_percent \\
  --namespace CWAgent \\
  --dimensions Name=InstanceId,Value=$INSTANCE_ID \\
  --statistic Average \\
  --period 60 \\
  --evaluation-periods 2 \\
  --threshold 85 \\
  --comparison-operator GreaterThanThreshold \\
  --treat-missing-data notBreaching \\
  --alarm-actions $TOPIC_ARN \\
  --ok-actions $TOPIC_ARN \\
  --region $REGION

echo "Memory alarm created"`,
      },
    },
    {
      title: "Create a CloudWatch dashboard",
      body: "A CloudWatch dashboard gives you a single-pane view of your instance health. The JSON body below defines three widgets: CPU utilisation, memory utilisation, and network traffic. After running this command, open the AWS Console → CloudWatch → Dashboards to see your live metrics.",
      code: {
        lang: "bash",
        label: "Create dashboard with CPU, memory, and network widgets",
        snippet: `DASHBOARD_BODY=$(cat <<'EOF'
{
  "widgets": [
    {
      "type": "metric",
      "x": 0, "y": 0, "width": 8, "height": 6,
      "properties": {
        "title": "CPU Utilisation",
        "metrics": [
          ["AWS/EC2", "CPUUtilization", "InstanceId", "INSTANCE_ID_PLACEHOLDER"]
        ],
        "period": 60,
        "stat": "Average",
        "view": "timeSeries",
        "yAxis": { "left": { "min": 0, "max": 100 } },
        "annotations": {
          "horizontal": [{ "label": "Alarm threshold", "value": 80, "color": "#ff6961" }]
        }
      }
    },
    {
      "type": "metric",
      "x": 8, "y": 0, "width": 8, "height": 6,
      "properties": {
        "title": "Memory Utilisation",
        "metrics": [
          ["CWAgent", "mem_used_percent", "InstanceId", "INSTANCE_ID_PLACEHOLDER"]
        ],
        "period": 60,
        "stat": "Average",
        "view": "timeSeries",
        "yAxis": { "left": { "min": 0, "max": 100 } },
        "annotations": {
          "horizontal": [{ "label": "Alarm threshold", "value": 85, "color": "#ff6961" }]
        }
      }
    },
    {
      "type": "metric",
      "x": 16, "y": 0, "width": 8, "height": 6,
      "properties": {
        "title": "Network In/Out",
        "metrics": [
          ["AWS/EC2", "NetworkIn",  "InstanceId", "INSTANCE_ID_PLACEHOLDER", { "label": "In",  "color": "#2196F3" }],
          ["AWS/EC2", "NetworkOut", "InstanceId", "INSTANCE_ID_PLACEHOLDER", { "label": "Out", "color": "#FF9800" }]
        ],
        "period": 60,
        "stat": "Sum",
        "view": "timeSeries"
      }
    }
  ]
}
EOF
)

# Substitute the real instance ID
DASHBOARD_BODY="\${DASHBOARD_BODY//INSTANCE_ID_PLACEHOLDER/$INSTANCE_ID}"

aws cloudwatch put-dashboard \\
  --dashboard-name "EC2-Health-$INSTANCE_ID" \\
  --dashboard-body "$DASHBOARD_BODY" \\
  --region $REGION

echo "Dashboard created: https://\${REGION}.console.aws.amazon.com/cloudwatch/home#dashboards:name=EC2-Health-\${INSTANCE_ID}"`,
      },
    },
  ],
};

export const multiCloudLab: Lab = {
  id: "multi-cloud-deploy",
  title: "Deploy a Container to AWS, GCP & Azure",
  level: "Advanced",
  duration: "60 min",
  cloud: "AWS / GCP / Azure",
  category: "Compute",
  description:
    "Build a simple Node.js Docker image and deploy it to AWS ECS Fargate, GCP Cloud Run, and Azure Container Apps — using the same image from a public registry.",
  prerequisites: [
    "Docker installed",
    "AWS, GCP, and Azure CLIs configured",
    "A Docker Hub account",
  ],
  steps: [
    {
      title: "Write a minimal Node.js HTTP server",
      body: "Create a self-contained Node.js application with no external dependencies and a Dockerfile that produces a lean production image. Using node:20-alpine keeps the image under 50 MB, which speeds up pushes and cold starts on all three platforms.",
      code: {
        lang: "bash",
        label: "app.js and Dockerfile",
        snippet: `mkdir cloudcompass-app && cd cloudcompass-app

# app.js — zero-dependency HTTP server
cat > app.js << 'EOF'
const http = require('http');

const PORT = process.env.PORT || 8080;
const CLOUD = process.env.CLOUD_PROVIDER || 'unknown';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Hello from CloudCompass!',
    provider: CLOUD,
    hostname: require('os').hostname(),
    timestamp: new Date().toISOString(),
  }));
});

server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT} (provider: \${CLOUD})\`);
});
EOF

# Dockerfile
cat > Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY app.js .
EXPOSE 8080
CMD ["node", "app.js"]
EOF`,
      },
    },
    {
      title: "Build and push the image to Docker Hub",
      body: "Build the image locally, tag it with your Docker Hub username, and push it so all three cloud platforms can pull it without additional authentication. A multi-platform build targeting linux/amd64 ensures compatibility with AWS Fargate and Azure Container Apps, which do not support ARM images by default.",
      code: {
        lang: "bash",
        label: "Build and push to Docker Hub",
        snippet: `DOCKERHUB_USER="yourdockerhubuser"   # Replace with your Docker Hub username
IMAGE_TAG="$DOCKERHUB_USER/cloudcompass-app:latest"

# Build for linux/amd64 (compatible with all three clouds)
docker buildx build \\
  --platform linux/amd64 \\
  --tag $IMAGE_TAG \\
  --push \\
  .

echo "Image pushed: $IMAGE_TAG"

# Verify it's accessible
docker pull $IMAGE_TAG`,
      },
    },
    {
      title: "Deploy to AWS ECS Fargate",
      body: "ECS Fargate runs containers without you managing EC2 instances. You create a cluster, register a task definition describing the container spec, then launch a service that keeps one running task. The task definition sets the vCPU and memory allocation that Fargate bills you for per second.",
      code: {
        lang: "bash",
        label: "ECS Fargate cluster, task definition, and service",
        snippet: `REGION="us-east-1"
IMAGE_TAG="yourdockerhubuser/cloudcompass-app:latest"

# 1. Create a cluster
aws ecs create-cluster \\
  --cluster-name cloudcompass \\
  --region $REGION

# 2. Register task definition (Fargate, 0.25 vCPU, 512 MB)
aws ecs register-task-definition \\
  --family cloudcompass-task \\
  --network-mode awsvpc \\
  --requires-compatibilities FARGATE \\
  --cpu 256 \\
  --memory 512 \\
  --container-definitions "[
    {
      \\"name\\": \\"app\\",
      \\"image\\": \\"$IMAGE_TAG\\",
      \\"portMappings\\": [{\\"containerPort\\": 8080, \\"protocol\\": \\"tcp\\"}],
      \\"environment\\": [{\\"name\\": \\"CLOUD_PROVIDER\\", \\"value\\": \\"AWS-Fargate\\"}],
      \\"logConfiguration\\": {
        \\"logDriver\\": \\"awslogs\\",
        \\"options\\": {
          \\"awslogs-group\\": \\"/ecs/cloudcompass\\",
          \\"awslogs-region\\": \\"$REGION\\",
          \\"awslogs-stream-prefix\\": \\"ecs\\"
        }
      }
    }
  ]" \\
  --region $REGION

# 3. Create a log group for the task
aws logs create-log-group --log-group-name /ecs/cloudcompass --region $REGION

# 4. Launch a service (replace subnet/sg with yours)
SUBNET_ID="subnet-xxxxxxxxxxxxxxxxx"
SG_ID="sg-xxxxxxxxxxxxxxxxx"

aws ecs create-service \\
  --cluster cloudcompass \\
  --service-name cloudcompass-svc \\
  --task-definition cloudcompass-task \\
  --desired-count 1 \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_ID],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \\
  --region $REGION`,
      },
    },
    {
      title: "Get the ECS public IP and test",
      body: "Fargate tasks are assigned a public IP directly on the ENI when launched in a public subnet with assignPublicIp=ENABLED. Query the running task to find the ENI, then describe the ENI to retrieve the public IP. The container binds to port 8080, so test with curl on that port.",
      code: {
        lang: "bash",
        label: "Retrieve task public IP and test with curl",
        snippet: `# Get the running task ARN
TASK_ARN=$(aws ecs list-tasks \\
  --cluster cloudcompass \\
  --service-name cloudcompass-svc \\
  --region $REGION \\
  --query 'taskArns[0]' \\
  --output text)

# Get the ENI attachment ID
ENI_ID=$(aws ecs describe-tasks \\
  --cluster cloudcompass \\
  --tasks $TASK_ARN \\
  --region $REGION \\
  --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" \\
  --output text)

# Get the public IP from the ENI
PUBLIC_IP=$(aws ec2 describe-network-interfaces \\
  --network-interface-ids $ENI_ID \\
  --region $REGION \\
  --query 'NetworkInterfaces[0].Association.PublicIp' \\
  --output text)

echo "ECS task public IP: $PUBLIC_IP"
curl http://$PUBLIC_IP:8080`,
      },
    },
    {
      title: "Deploy to GCP Cloud Run",
      body: "Cloud Run deploys a container and exposes it via a managed HTTPS URL in under a minute. It scales to zero when idle and charges only for request processing time — making it the cheapest option for low-traffic services. The --allow-unauthenticated flag makes the service publicly accessible.",
      code: {
        lang: "bash",
        label: "Deploy to Cloud Run",
        snippet: `GCP_PROJECT="your-gcp-project-id"   # Replace with your project ID
IMAGE_TAG="yourdockerhubuser/cloudcompass-app:latest"
GCP_REGION="us-central1"

# Deploy directly from Docker Hub
gcloud run deploy cloudcompass-app \\
  --image $IMAGE_TAG \\
  --project $GCP_PROJECT \\
  --region $GCP_REGION \\
  --platform managed \\
  --allow-unauthenticated \\
  --port 8080 \\
  --memory 256Mi \\
  --cpu 1 \\
  --min-instances 0 \\
  --max-instances 10 \\
  --set-env-vars CLOUD_PROVIDER=GCP-CloudRun`,
      },
    },
    {
      title: "Get the Cloud Run URL and test",
      body: "Cloud Run automatically provisions a stable HTTPS URL for the service. The URL is deterministic (based on service name, project, and region) and protected by Google-managed TLS. Test it with curl to confirm the deployment is live and returning the correct cloud provider in the response.",
      code: {
        lang: "bash",
        label: "Retrieve Cloud Run service URL and test",
        snippet: `# Get the service URL
CLOUD_RUN_URL=$(gcloud run services describe cloudcompass-app \\
  --project $GCP_PROJECT \\
  --region $GCP_REGION \\
  --format 'value(status.url)')

echo "Cloud Run URL: $CLOUD_RUN_URL"
curl $CLOUD_RUN_URL`,
      },
    },
    {
      title: "Deploy to Azure Container Apps",
      body: "Azure Container Apps is Azure's serverless container platform, built on Kubernetes but with a Cloud Run-like developer experience. It requires a Container Apps environment (a shared VNet and log analytics workspace) before you can deploy an app. The --ingress external flag exposes the app on a public HTTPS endpoint.",
      code: {
        lang: "bash",
        label: "Deploy to Azure Container Apps",
        snippet: `AZ_RG="cloudcompass-rg"
AZ_LOCATION="eastus"
AZ_ENV="cloudcompass-env"
IMAGE_TAG="yourdockerhubuser/cloudcompass-app:latest"

# Create resource group
az group create \\
  --name $AZ_RG \\
  --location $AZ_LOCATION

# Create Container Apps environment (includes Log Analytics)
az containerapp env create \\
  --name $AZ_ENV \\
  --resource-group $AZ_RG \\
  --location $AZ_LOCATION

# Deploy the container app
az containerapp create \\
  --name cloudcompass-app \\
  --resource-group $AZ_RG \\
  --environment $AZ_ENV \\
  --image $IMAGE_TAG \\
  --target-port 8080 \\
  --ingress external \\
  --cpu 0.25 \\
  --memory 0.5Gi \\
  --min-replicas 0 \\
  --max-replicas 10 \\
  --env-vars CLOUD_PROVIDER=Azure-ContainerApps \\
  --query properties.configuration.ingress.fqdn \\
  --output tsv`,
      },
    },
    {
      title: "Compare: pricing, cold starts, and scaling",
      body: "With the same container running on all three platforms, here is how they differ in practice. AWS Fargate bills per vCPU-second and memory-second even when idle (unless you scale the service to 0 manually); it has the most consistent low-latency starts for sustained traffic. GCP Cloud Run and Azure Container Apps both scale to zero automatically — Cloud Run cold starts are typically 200-400 ms for a small Node.js container, while Azure Container Apps cold starts can reach 1-3 seconds. Cloud Run pricing is request-based (free tier: 2M requests/month); Azure Container Apps bills per vCPU-second and memory-second only during active request processing. For scaling configuration: Cloud Run uses concurrency (default 80 requests per instance); ECS uses target tracking on CPU/memory; Azure Container Apps supports KEDA-based scalers including HTTP request rate and custom metrics.",
    },
  ],
};
