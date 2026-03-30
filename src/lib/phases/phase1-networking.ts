export interface TopicSection {
  heading: string;
  body: string;
  code?: { lang: string; label: string; snippet: string };
}
export interface Topic {
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
export interface Module {
  id: string;
  title: string;
  desc: string;
  category: string;
  topics: Topic[];
}

export const awsNetworkingModule: Module = {
  id: "networking",
  title: "Networking",
  desc: "Core AWS networking concepts: VPCs, subnets, gateways, and security controls.",
  category: "Networking",
  topics: [
    {
      id: "vpc-basics",
      title: "VPC — Virtual Private Cloud",
      level: "Beginner",
      readTime: "12 min",
      category: "Networking",
      summary:
        "Learn how AWS VPCs let you carve out an isolated network inside the AWS cloud, control traffic flow with subnets and route tables, and expose or protect resources using internet gateways, NAT, security groups, and NACLs.",
      gcpEquivalent: "VPC Networks",
      azureEquivalent: "Azure Virtual Network",
      sections: [
        {
          heading: "What is a VPC?",
          body:
            "A **Virtual Private Cloud (VPC)** is a logically isolated network you define inside AWS. You specify an **IPv4 CIDR block** (e.g., `10.0.0.0/16`) that determines the pool of private IP addresses available to your resources. Every AWS account comes with a **default VPC** in each region so you can launch instances immediately without any setup — but production workloads should use a custom VPC for tighter control. A VPC is **region-scoped**: it spans all Availability Zones in that region but does not extend across regions.",
        },
        {
          heading: "Subnets",
          body:
            "A **subnet** is a slice of your VPC CIDR placed inside a single **Availability Zone (AZ)**. • **Public subnets** have a route to an Internet Gateway, so resources with a public IP can send and receive traffic from the internet. • **Private subnets** have no direct internet route, keeping backend services and databases off the public internet. Each subnet is associated with a **route table** that determines where traffic is forwarded — the route table is the key distinction between public and private.",
        },
        {
          heading: "Internet Gateway & NAT",
          body:
            "An **Internet Gateway (IGW)** is attached to the VPC and enables two-way internet communication for resources in public subnets. Resources in private subnets can initiate outbound internet traffic (e.g., to download packages) through a **NAT Gateway**, which is a managed, highly available service you deploy into a public subnet. The NAT Gateway masquerades the private IP as its own Elastic IP, so responses return correctly — but inbound connections from the internet are blocked.",
          code: {
            lang: "bash",
            label: "Create a NAT Gateway (AWS CLI)",
            snippet:
              `# Allocate an Elastic IP
ALLOC_ID=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)

# Create NAT Gateway in the public subnet
aws ec2 create-nat-gateway \\
  --subnet-id subnet-0abc1234def56789a \\
  --allocation-id "$ALLOC_ID" \\
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=my-nat-gw}]'

# Add route in private subnet's route table
aws ec2 create-route \\
  --route-table-id rtb-0abc1234def56789b \\
  --destination-cidr-block 0.0.0.0/0 \\
  --nat-gateway-id nat-0abc1234def56789c`,
          },
        },
        {
          heading: "Security Groups vs NACLs",
          body:
            "AWS gives you two firewall layers. • **Security Groups** are **stateful** — if you allow inbound traffic, the return traffic is automatically permitted regardless of outbound rules. They are attached to individual resources (EC2 instances, RDS, load balancers). • **Network ACLs (NACLs)** are **stateless** — you must explicitly allow both inbound and outbound traffic, including ephemeral ports. NACLs are attached to subnets and evaluated in numbered rule order. In practice, use security groups as your primary control and NACLs as a coarse subnet-level backstop (e.g., to block a known malicious CIDR).",
        },
        {
          heading: "VPC Peering & PrivateLink",
          body:
            "When you need two VPCs to communicate privately you have two main options. **VPC Peering** creates a direct, non-transitive connection between two VPCs (same or different accounts/regions) — traffic stays on the AWS backbone but you must manage route tables and security group rules on both sides. **AWS PrivateLink** exposes a service behind a **Network Load Balancer** as a private endpoint; consumers connect via an **Interface VPC Endpoint** without any route table changes and without the CIDRs needing to be unique. PrivateLink is the preferred pattern when a service has many consumers or when you want to avoid overlapping CIDR conflicts.",
        },
      ],
    },
  ],
};

export const gcpNetworkingModule: Module = {
  id: "networking",
  title: "Networking",
  desc: "Core GCP networking concepts: global VPCs, subnets, firewall rules, and outbound NAT.",
  category: "Networking",
  topics: [
    {
      id: "gcp-vpc",
      title: "VPC Networks — Google Cloud Networking",
      level: "Beginner",
      readTime: "10 min",
      category: "Networking",
      summary:
        "Understand how GCP's globally-scoped VPC differs from AWS and Azure, how subnets and firewall rules work, and how Cloud NAT provides outbound internet access for private VMs.",
      awsEquivalent: "AWS VPC",
      azureEquivalent: "Azure VNet",
      sections: [
        {
          heading: "What is a GCP VPC?",
          body:
            "A **VPC network** in Google Cloud is a **global resource** — unlike AWS or Azure, a single GCP VPC spans all regions without any peering or gateway setup between them. This means VMs in `us-central1` and `europe-west1` can communicate over internal IPs as long as firewall rules permit it. GCP offers two creation modes: **auto mode** automatically creates one subnet per region with predefined CIDRs (convenient for learning, not recommended for production), and **custom mode** where you define every subnet's region and CIDR explicitly.",
        },
        {
          heading: "Subnets and Regions",
          body:
            "Despite the VPC being global, **subnets are regional** — each subnet lives in one region and you choose its primary **IPv4 CIDR** (e.g., `10.10.0.0/24`). VMs placed in that region inherit an internal IP from the subnet's range. GCP also supports **secondary IP ranges** on a subnet, which are used by GKE to assign pod and service IPs without consuming addresses from the primary range. You can expand a subnet's CIDR non-disruptively as long as the new range is a superset of the current one.",
        },
        {
          heading: "Firewall Rules",
          body:
            "GCP firewall rules are **VPC-level**, not instance-level — every rule applies to all VMs in the VPC unless scoped by a **target tag** or **target service account**. Rules have a **priority** (0–65535; lower number wins) and specify direction (`ingress` or `egress`), protocol, and ports. • Using **network tags** (e.g., `allow-ssh`) lets you apply rules to a subset of VMs by tagging them at creation. • **Service account targeting** is more secure because tags can be self-assigned, whereas service accounts are controlled by IAM.",
          code: {
            lang: "bash",
            label: "Create a firewall rule (gcloud CLI)",
            snippet:
              `# Allow SSH from your IP to any VM tagged "allow-ssh"
gcloud compute firewall-rules create allow-ssh-from-office \\
  --network=my-vpc \\
  --direction=INGRESS \\
  --priority=1000 \\
  --action=ALLOW \\
  --rules=tcp:22 \\
  --source-ranges=203.0.113.42/32 \\
  --target-tags=allow-ssh

# Deny all other ingress at lower priority (higher number)
gcloud compute firewall-rules create deny-all-ingress \\
  --network=my-vpc \\
  --direction=INGRESS \\
  --priority=65534 \\
  --action=DENY \\
  --rules=all`,
          },
        },
        {
          heading: "Cloud NAT & Cloud Router",
          body:
            "VMs without an **external IP** cannot reach the internet by default. **Cloud NAT** is a fully managed, software-defined NAT service that lets private VMs initiate outbound connections without exposing them inbound. It requires a **Cloud Router** in the same region, which provides the BGP control plane that Cloud NAT uses to advertise routes. Cloud NAT is highly available, scales automatically, and does not require any proxy VMs to manage.",
          code: {
            lang: "bash",
            label: "Set up Cloud NAT (gcloud CLI)",
            snippet:
              `# Create a Cloud Router
gcloud compute routers create my-router \\
  --network=my-vpc \\
  --region=us-central1

# Attach Cloud NAT to the router
gcloud compute routers nats create my-nat \\
  --router=my-router \\
  --region=us-central1 \\
  --auto-allocate-nat-external-ips \\
  --nat-all-subnet-ip-ranges`,
          },
        },
      ],
    },
  ],
};

export const azureNetworkingModule: Module = {
  id: "networking",
  title: "Networking",
  desc: "Core Azure networking concepts: VNets, NSGs, public IPs, NAT Gateway, and VNet peering.",
  category: "Networking",
  topics: [
    {
      id: "azure-vnet",
      title: "Azure Virtual Network (VNet)",
      level: "Beginner",
      readTime: "10 min",
      category: "Networking",
      summary:
        "Learn how Azure Virtual Networks provide isolated networking for your cloud resources, how Network Security Groups control traffic, how public IPs and NAT Gateway handle internet connectivity, and how VNet peering connects networks.",
      awsEquivalent: "AWS VPC",
      gcpEquivalent: "GCP VPC Networks",
      sections: [
        {
          heading: "What is Azure VNet?",
          body:
            "An **Azure Virtual Network (VNet)** is the fundamental networking building block in Azure — it's the private network space where your Azure resources communicate with each other, the internet, and on-premises networks. You define one or more **address spaces** (e.g., `10.0.0.0/16`) and divide them into **subnets** for logical separation. A VNet is scoped to a **resource group** and a single **region**; it does not span regions automatically. Some Azure services (like Azure Bastion or Application Gateway) require dedicated subnets, so plan your CIDR ranges with room to grow.",
        },
        {
          heading: "Network Security Groups (NSGs)",
          body:
            "A **Network Security Group (NSG)** is a stateful firewall you attach to a subnet or a specific network interface (NIC). Rules have a **priority** (100–4096; lower wins) and define allowed or denied traffic by source/destination IP, port, and protocol. Azure pre-populates NSGs with default rules that allow VNet-internal traffic and Azure Load Balancer health probes while denying all other inbound internet traffic.",
          code: {
            lang: "bash",
            label: "Create an NSG and add a rule (az CLI)",
            snippet:
              `# Create the NSG
az network nsg create \\
  --resource-group my-rg \\
  --name my-nsg \\
  --location eastus

# Allow SSH inbound from a specific IP
az network nsg rule create \\
  --resource-group my-rg \\
  --nsg-name my-nsg \\
  --name allow-ssh \\
  --priority 300 \\
  --direction Inbound \\
  --access Allow \\
  --protocol Tcp \\
  --source-address-prefixes 203.0.113.42/32 \\
  --destination-port-ranges 22

# Associate the NSG with a subnet
az network vnet subnet update \\
  --resource-group my-rg \\
  --vnet-name my-vnet \\
  --name my-subnet \\
  --network-security-group my-nsg`,
          },
        },
        {
          heading: "Public IPs and NAT Gateway",
          body:
            "Azure offers two public IP **SKUs**: **Basic** (open by default, no zone redundancy — avoid for new deployments) and **Standard** (secure by default, zone-redundant, required for most modern services). Public IPs can be **static** (reserved for your subscription even when the resource is stopped) or **dynamic** (released on deallocation). For outbound-only internet access from private VMs, **Azure NAT Gateway** provides a dedicated, scalable outbound SNAT solution — it replaces relying on the default SNAT behavior of load balancers, which has limited port capacity.",
        },
        {
          heading: "VNet Peering",
          body:
            "**VNet peering** connects two VNets so their resources communicate over the Azure backbone with low latency and no public internet exposure. **Regional peering** connects VNets in the same Azure region; **global peering** connects VNets across different regions. Both require non-overlapping address spaces. An important limitation: VNet peering is **non-transitive** — if VNet A peers with VNet B and VNet B peers with VNet C, VMs in A cannot reach VMs in C unless you also create an A–C peering or route traffic through a hub (e.g., Azure Virtual WAN or a firewall NVA in VNet B).",
        },
      ],
    },
  ],
};
