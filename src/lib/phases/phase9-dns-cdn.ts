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

export const route53Topic: Topic = {
  id: "route53-cloudfront",
  title: "Route 53 & CloudFront — DNS and CDN",
  level: "Intermediate",
  readTime: "13 min",
  category: "DNS & CDN",
  summary:
    "Master AWS Route 53 for scalable DNS management — hosted zones, record types, health checks, and routing policies (simple, weighted, latency, failover) — paired with Amazon CloudFront, the global content delivery network that caches content at 400+ edge locations for low-latency delivery worldwide.",
  gcpEquivalent: "Cloud DNS + Cloud CDN",
  azureEquivalent: "Azure DNS + Front Door",
  sections: [
    {
      heading: "Route 53 Hosted Zones and Record Types",
      body:
        "**Route 53** is AWS's highly available, scalable DNS service named after TCP/UDP port 53. A **hosted zone** is a container for DNS records that belong to a single domain (e.g., `example.com`). Public hosted zones resolve queries from the internet; **private hosted zones** resolve queries only from associated VPCs. Route 53 supports all standard record types — **A** (IPv4), **AAAA** (IPv6), **CNAME** (alias to another name), **MX** (mail), **TXT** (verification/SPF), **NS**, and **SOA**. AWS also provides an **Alias** record type that is unique to Route 53: it maps a domain apex (`example.com`) directly to AWS resources (CloudFront distributions, ALBs, S3 website endpoints) without a CNAME — Alias queries are free and support zone apex records that standard CNAME cannot.",
      code: {
        lang: "bash",
        label: "Create a hosted zone and A record (AWS CLI)",
        snippet:
          `# Create a public hosted zone
ZONE_ID=$(aws route53 create-hosted-zone \\
  --name example.com \\
  --caller-reference "$(date +%s)" \\
  --query 'HostedZone.Id' --output text)

# Create an A record pointing to an ALB (Alias)
aws route53 change-resource-record-sets \\
  --hosted-zone-id "$ZONE_ID" \\
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "app.example.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z35SXDOTRQ7X7K",
          "DNSName": "my-alb-123456.us-east-1.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        }
      }
    }]
  }'`,
      },
    },
    {
      heading: "Routing Policies",
      body:
        "Route 53 offers multiple **routing policies** that control how DNS queries are answered. • **Simple routing** returns one or more values at random — suitable for a single resource with no health checks. • **Weighted routing** distributes traffic across multiple resources by assigning each record a numeric weight (e.g., 70/30 split for blue-green deployments). • **Latency-based routing** directs users to the AWS region with the lowest measured latency from their location — ideal for multi-region architectures. • **Failover routing** pairs a primary and secondary record; Route 53 automatically sends traffic to the secondary when a **health check** on the primary fails. • **Geolocation routing** maps traffic based on the user's geographic location (continent, country, or US state), useful for compliance or localized content. • **Multi-value answer** returns up to eight healthy records, acting as a basic DNS-level load balancer with health checking.",
    },
    {
      heading: "CloudFront Distributions",
      body:
        "**Amazon CloudFront** is a global CDN with 400+ Points of Presence (edge locations and regional edge caches). A **distribution** defines the origin (S3 bucket, ALB, API Gateway, or any HTTP server), **cache behaviors** that match URL path patterns (`/api/*`, `/static/*`), and settings like TTLs, compression, and viewer protocol policy. CloudFront supports **Origin Access Control (OAC)** to securely serve private S3 content without making the bucket public. **Cache invalidation** lets you purge cached objects on demand — use path patterns like `/images/*` to invalidate specific prefixes. For dynamic content, CloudFront still reduces latency via persistent connections to the origin and TLS session reuse at the edge.",
      code: {
        lang: "bash",
        label: "Create a CloudFront distribution for an S3 origin (AWS CLI)",
        snippet:
          `# Create a CloudFront distribution with S3 origin
aws cloudfront create-distribution \\
  --distribution-config '{
    "CallerReference": "my-dist-2024",
    "Origins": {
      "Quantity": 1,
      "Items": [{
        "Id": "S3Origin",
        "DomainName": "my-bucket.s3.us-east-1.amazonaws.com",
        "S3OriginConfig": { "OriginAccessIdentity": "" },
        "OriginAccessControlId": "E2QWRUHAPOMQZL"
      }]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3Origin",
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
      "Compress": true
    },
    "Enabled": true,
    "Comment": "Static site CDN"
  }'

# Invalidate cached objects
aws cloudfront create-invalidation \\
  --distribution-id E1A2B3C4D5E6F7 \\
  --paths "/index.html" "/static/*"`,
      },
    },
    {
      heading: "SSL/TLS with AWS Certificate Manager",
      body:
        "**AWS Certificate Manager (ACM)** provides free, auto-renewing SSL/TLS certificates for use with CloudFront, ALB, and API Gateway. For CloudFront, the certificate **must** be provisioned in `us-east-1` regardless of where your origin resides. ACM supports **DNS validation** (recommended — add a CNAME to your hosted zone and validation is automatic on renewal) and **email validation**. Once a certificate is issued, you attach it to your CloudFront distribution's **Alternate Domain Names (CNAMEs)** configuration. Combined with Route 53 Alias records, you get end-to-end HTTPS with zero manual certificate rotation.",
      code: {
        lang: "bash",
        label: "Request an ACM certificate with DNS validation (AWS CLI)",
        snippet:
          `# Request a certificate in us-east-1 (required for CloudFront)
CERT_ARN=$(aws acm request-certificate \\
  --region us-east-1 \\
  --domain-name "example.com" \\
  --subject-alternative-names "*.example.com" \\
  --validation-method DNS \\
  --query 'CertificateArn' --output text)

# Describe to get the CNAME validation record
aws acm describe-certificate \\
  --region us-east-1 \\
  --certificate-arn "$CERT_ARN" \\
  --query 'Certificate.DomainValidationOptions[0].ResourceRecord'`,
      },
    },
  ],
};

export const gcpDnsCdnTopic: Topic = {
  id: "gcp-dns-cdn",
  title: "Cloud DNS & Cloud CDN — Global Edge",
  level: "Intermediate",
  readTime: "11 min",
  category: "DNS & CDN",
  summary:
    "Explore Google Cloud DNS for highly available, low-latency managed DNS with DNSSEC support, and Cloud CDN for globally distributed caching integrated directly with Google Cloud Load Balancing — serving content from edge locations close to your users.",
  awsEquivalent: "Route 53 + CloudFront",
  azureEquivalent: "Azure DNS + Front Door",
  sections: [
    {
      heading: "Cloud DNS Managed Zones",
      body:
        "**Cloud DNS** is Google's fully managed, authoritative DNS service running on the same infrastructure as Google's own DNS. A **managed zone** holds DNS records for a single DNS domain. **Public zones** serve records to the internet; **private zones** resolve only within specified VPC networks — useful for internal service discovery (e.g., `db.internal.example.com`). Cloud DNS guarantees 100% availability SLA. Record types include **A**, **AAAA**, **CNAME**, **MX**, **TXT**, **SRV**, **NS**, and **SOA**. Changes propagate globally within seconds thanks to Google's anycast network.",
      code: {
        lang: "bash",
        label: "Create a managed zone and DNS records (gcloud CLI)",
        snippet:
          `# Create a public managed zone
gcloud dns managed-zones create my-zone \\
  --dns-name="example.com." \\
  --description="Production DNS zone" \\
  --visibility=public

# Start a transaction to add records atomically
gcloud dns record-sets transaction start --zone=my-zone

# Add an A record
gcloud dns record-sets transaction add "203.0.113.10" \\
  --zone=my-zone \\
  --name="app.example.com." \\
  --type=A \\
  --ttl=300

# Add a CNAME record
gcloud dns record-sets transaction add "app.example.com." \\
  --zone=my-zone \\
  --name="www.example.com." \\
  --type=CNAME \\
  --ttl=300

# Execute the transaction
gcloud dns record-sets transaction execute --zone=my-zone`,
      },
    },
    {
      heading: "DNSSEC",
      body:
        "**DNSSEC** (Domain Name System Security Extensions) protects against DNS spoofing and cache poisoning by cryptographically signing DNS responses. Cloud DNS supports **managed DNSSEC** — Google automatically generates and rotates the Zone Signing Key (ZSK) and Key Signing Key (KSK). You enable DNSSEC on the managed zone and then register the **DS record** with your domain registrar to complete the chain of trust. Cloud DNS handles all key rollovers transparently. DNSSEC is critical for domains handling financial transactions, authentication flows, or any scenario where DNS integrity is paramount.",
      code: {
        lang: "bash",
        label: "Enable DNSSEC on a managed zone (gcloud CLI)",
        snippet:
          `# Enable DNSSEC on an existing zone
gcloud dns managed-zones update my-zone \\
  --dnssec-state=on

# Retrieve the DS record to register with your domain registrar
gcloud dns dns-keys list --zone=my-zone \\
  --filter="type=keySigning" \\
  --format="value(ds_record())"`,
      },
    },
    {
      heading: "Cloud CDN with Load Balancing",
      body:
        "**Cloud CDN** is tightly integrated with **Google Cloud Load Balancing** — you enable it per **backend service** or **backend bucket** rather than creating a separate distribution resource. When enabled, responses from your backends are cached at Google's 180+ edge locations. Cloud CDN supports three **cache modes**: `CACHE_ALL_STATIC` (caches common static content types automatically), `USE_ORIGIN_HEADERS` (respects `Cache-Control` headers from your origin), and `FORCE_CACHE_ALL` (caches all responses regardless of headers, useful for static-only backends). **Cache keys** can be customized to include or exclude query strings, HTTP headers, and cookies for fine-grained cache segmentation.",
      code: {
        lang: "bash",
        label: "Enable Cloud CDN on a backend service (gcloud CLI)",
        snippet:
          `# Enable Cloud CDN on an existing backend service
gcloud compute backend-services update my-backend-svc \\
  --global \\
  --enable-cdn \\
  --cache-mode=CACHE_ALL_STATIC

# Invalidate cached content by URL path
gcloud compute url-maps invalidate-cdn-cache my-url-map \\
  --path="/static/*"

# View CDN cache hit/miss metrics
gcloud monitoring metrics list \\
  --filter='metric.type="loadbalancing.googleapis.com/https/backend_request_count"'`,
      },
    },
    {
      heading: "Signed URLs and Signed Cookies",
      body:
        "Cloud CDN supports **signed URLs** and **signed cookies** to restrict access to cached content. A signed URL includes a cryptographic signature with an expiration time — only users with a valid signed URL can access the resource. Signed cookies work similarly but apply to all requests from a browser session, making them suitable for streaming media or gated content with many assets. You create a **signing key** on the backend service or backend bucket and use it to generate signatures. This is the GCP equivalent of CloudFront signed URLs and is essential for paid content, private media, or any scenario requiring authentication at the CDN edge.",
    },
  ],
};

export const azureDnsFrontDoorTopic: Topic = {
  id: "azure-dns-frontdoor",
  title: "Azure DNS & Front Door — Global Delivery",
  level: "Intermediate",
  readTime: "12 min",
  category: "DNS & CDN",
  summary:
    "Learn Azure DNS for reliable, high-performance domain hosting with private DNS zones for internal resolution, and Azure Front Door — the unified global load balancer, CDN, and WAF service that accelerates and protects web applications at Microsoft's global edge network.",
  awsEquivalent: "Route 53 + CloudFront",
  gcpEquivalent: "Cloud DNS + Cloud CDN",
  sections: [
    {
      heading: "Azure DNS Zones and Record Sets",
      body:
        "**Azure DNS** hosts your DNS domains on Azure's global anycast network of name servers. A **DNS zone** represents a domain (e.g., `example.com`) and contains **record sets** — collections of records with the same name and type. Azure DNS supports **A**, **AAAA**, **CNAME**, **MX**, **TXT**, **SRV**, **NS**, **SOA**, and **CAA** records. It also provides **Alias record sets** that point directly to Azure resources (public IP, Front Door, Traffic Manager) — similar to Route 53 Alias records, they resolve at query time and automatically track IP changes. Azure DNS offers 100% availability SLA and sub-second propagation across its four name server pools.",
      code: {
        lang: "bash",
        label: "Create a DNS zone and records (az CLI)",
        snippet:
          `# Create a DNS zone
az network dns zone create \\
  --resource-group my-rg \\
  --name example.com

# Add an A record set
az network dns record-set a add-record \\
  --resource-group my-rg \\
  --zone-name example.com \\
  --record-set-name app \\
  --ipv4-address 203.0.113.10 \\
  --ttl 300

# Add an Alias record pointing to a Front Door endpoint
az network dns record-set a create \\
  --resource-group my-rg \\
  --zone-name example.com \\
  --name www \\
  --target-resource "/subscriptions/{sub-id}/resourceGroups/my-rg/providers/Microsoft.Cdn/profiles/my-frontdoor/afdEndpoints/my-endpoint"`,
      },
    },
    {
      heading: "Private DNS Zones",
      body:
        "**Azure Private DNS** provides name resolution within your virtual networks without the need to run custom DNS servers. A **private DNS zone** (e.g., `internal.example.com`) is linked to one or more VNets, and VMs in those networks can resolve records in the zone automatically. **Auto-registration** is a powerful feature: when enabled on a VNet link, Azure automatically creates and removes A records as VMs are provisioned or deleted — no manual record management needed. This is ideal for microservice architectures where services need to discover each other by name (e.g., `api.internal.example.com`, `cache.internal.example.com`). Private zones also support **split-horizon DNS** — the same domain name resolves differently depending on whether the query originates from inside or outside the VNet.",
      code: {
        lang: "bash",
        label: "Create a private DNS zone with auto-registration (az CLI)",
        snippet:
          `# Create a private DNS zone
az network private-dns zone create \\
  --resource-group my-rg \\
  --name internal.example.com

# Link the private zone to a VNet with auto-registration
az network private-dns link vnet create \\
  --resource-group my-rg \\
  --zone-name internal.example.com \\
  --name my-vnet-link \\
  --virtual-network my-vnet \\
  --registration-enabled true

# Manually add a record for a shared service
az network private-dns record-set a add-record \\
  --resource-group my-rg \\
  --zone-name internal.example.com \\
  --record-set-name db \\
  --ipv4-address 10.0.1.50`,
      },
    },
    {
      heading: "Front Door — Origins, Routes, and Caching",
      body:
        "**Azure Front Door** (Standard/Premium tier) is a global, cloud-native application delivery service that combines **CDN**, **global load balancing**, **SSL offloading**, and **WAF** in a single resource. Key concepts: • **Origin groups** define one or more backends (App Services, VMs, Storage, any public endpoint) with health probes and load balancing settings. • **Origins** within a group have a priority and weight for failover and traffic splitting. • **Routes** map incoming hostnames and URL paths to origin groups — you can apply caching rules, URL rewrites, and header modifications per route. Caching on Front Door stores content at Microsoft's edge (190+ POPs) and supports **cache key customization** by query string, request headers, or protocol. Front Door also supports **compression** and **response timeout** configuration per route.",
      code: {
        lang: "bash",
        label: "Create a Front Door profile with origin and route (az CLI)",
        snippet:
          `# Create a Front Door profile (Standard tier)
az afd profile create \\
  --resource-group my-rg \\
  --profile-name my-frontdoor \\
  --sku Standard_AzureFrontDoor

# Create an endpoint
az afd endpoint create \\
  --resource-group my-rg \\
  --profile-name my-frontdoor \\
  --endpoint-name my-endpoint \\
  --enabled-state Enabled

# Create an origin group with health probe
az afd origin-group create \\
  --resource-group my-rg \\
  --profile-name my-frontdoor \\
  --origin-group-name my-origins \\
  --probe-request-type GET \\
  --probe-protocol Https \\
  --probe-interval-in-seconds 30 \\
  --probe-path "/health"

# Add an origin (App Service)
az afd origin create \\
  --resource-group my-rg \\
  --profile-name my-frontdoor \\
  --origin-group-name my-origins \\
  --origin-name my-app \\
  --host-name myapp.azurewebsites.net \\
  --origin-host-header myapp.azurewebsites.net \\
  --http-port 80 \\
  --https-port 443 \\
  --priority 1 \\
  --weight 1000`,
      },
    },
    {
      heading: "Front Door WAF Policies",
      body:
        "Azure Front Door Premium integrates **Web Application Firewall (WAF)** policies that inspect incoming traffic at the edge before it reaches your origin. A WAF policy contains **managed rule sets** (Microsoft-curated rules covering OWASP Top 10 threats like SQL injection, XSS, and remote code execution) and **custom rules** (your own conditions based on IP, geo, request body, headers, or query strings). Rules can **block**, **allow**, **log**, or **redirect** matching traffic. Rate limiting rules throttle excessive requests per IP — critical for DDoS mitigation and abuse prevention. WAF logs integrate with **Azure Monitor** and **Log Analytics** for real-time visibility into blocked threats and traffic patterns.",
      code: {
        lang: "bash",
        label: "Create a WAF policy and associate with Front Door (az CLI)",
        snippet:
          `# Create a WAF policy with managed rules
az network front-door waf-policy create \\
  --resource-group my-rg \\
  --name my-waf-policy \\
  --sku Premium_AzureFrontDoor \\
  --mode Prevention

# Add a rate limit custom rule (max 100 req/min per IP)
az network front-door waf-policy rule create \\
  --resource-group my-rg \\
  --policy-name my-waf-policy \\
  --name rate-limit-rule \\
  --priority 100 \\
  --rule-type RateLimitRule \\
  --rate-limit-threshold 100 \\
  --rate-limit-duration-in-minutes 1 \\
  --action Block \\
  --defer

# Associate WAF policy with the Front Door security policy
az afd security-policy create \\
  --resource-group my-rg \\
  --profile-name my-frontdoor \\
  --security-policy-name my-sec-policy \\
  --waf-policy "/subscriptions/{sub-id}/resourceGroups/my-rg/providers/Microsoft.Network/FrontDoorWebApplicationFirewallPolicies/my-waf-policy" \\
  --domains "/subscriptions/{sub-id}/resourceGroups/my-rg/providers/Microsoft.Cdn/profiles/my-frontdoor/afdEndpoints/my-endpoint"`,
      },
    },
  ],
};
