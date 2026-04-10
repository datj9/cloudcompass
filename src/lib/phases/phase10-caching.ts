// Inline type definitions (not imported from content.ts)
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

// ─── AWS ElastiCache ────────────────────────────────────────────────────────

export const elasticacheTopic: Topic = {
  id: "elasticache",
  title: "ElastiCache — Managed Redis & Memcached",
  level: "Intermediate",
  readTime: "11 min",
  category: "Caching",
  summary:
    "AWS ElastiCache provides fully managed in-memory data stores — Redis and Memcached — for sub-millisecond latency. Learn how to choose between engines, configure cluster mode, and implement common caching patterns like cache-aside and write-through.",
  gcpEquivalent: "Memorystore",
  azureEquivalent: "Azure Cache for Redis",
  sections: [
    {
      heading: "What is ElastiCache?",
      body:
        "**Amazon ElastiCache** is a fully managed in-memory caching service that supports two open-source engines: **Redis** and **Memcached**. Both deliver sub-millisecond read latency, but they serve different use cases.\n\n| Feature | Redis | Memcached |\n|---|---|---|\n| Data structures | Strings, hashes, lists, sets, sorted sets, streams | Simple key-value strings |\n| Persistence | Snapshots (RDB) and AOF | None |\n| Replication | Primary-replica with auto-failover | None |\n| Pub/Sub | Yes | No |\n| Lua scripting | Yes | No |\n| Multi-threaded | Single-threaded (I/O threads in 6.x+) | Multi-threaded |\n| Cluster mode | Hash-slot sharding across nodes | Consistent hashing via client |\n\nChoose **Redis** when you need persistence, replication, advanced data structures, or pub/sub. Choose **Memcached** when you need a simple, horizontally scalable cache with multi-threaded performance and no persistence requirements.",
    },
    {
      heading: "Cluster Mode — Redis Cluster vs Replication Group",
      body:
        "ElastiCache Redis offers two deployment topologies:\n\n**Replication Group (Cluster Mode Disabled)** — A single shard with one primary and up to five read replicas. All data fits in a single node. Automatic failover promotes a replica if the primary fails. Best for workloads under ~100 GB.\n\n**Cluster Mode Enabled** — Data is partitioned across up to 500 shards using 16,384 hash slots. Each shard has a primary and optional replicas. This mode supports online resharding (adding/removing shards without downtime), letting you scale both memory and write throughput horizontally. Use cluster mode when your dataset exceeds a single node's memory or when you need higher write capacity.",
      code: {
        lang: "bash",
        label: "Describe a replication group",
        snippet: `# List all replication groups
aws elasticache describe-replication-groups \\
  --query "ReplicationGroups[*].{Id:ReplicationGroupId,Status:Status,Cluster:ClusterEnabled}" \\
  --output table`,
      },
    },
    {
      heading: "Creating a Redis Cluster",
      body:
        "You can provision an ElastiCache Redis cluster with the AWS CLI. The example below creates a **cluster-mode-disabled** replication group with one primary and two replicas in a specific subnet group. Make sure you have a **subnet group** and **security group** that allows inbound TCP on port 6379 from your application's VPC.",
      code: {
        lang: "bash",
        label: "Create a Redis replication group via AWS CLI",
        snippet: `# Create a subnet group (use private subnets)
aws elasticache create-cache-subnet-group \\
  --cache-subnet-group-name my-redis-subnets \\
  --cache-subnet-group-description "Private subnets for Redis" \\
  --subnet-ids subnet-0a1b2c3d subnet-4e5f6a7b

# Create a replication group with 2 replicas
aws elasticache create-replication-group \\
  --replication-group-id my-app-cache \\
  --replication-group-description "Session and query cache" \\
  --engine redis \\
  --engine-version 7.1 \\
  --cache-node-type cache.r7g.large \\
  --num-cache-clusters 3 \\
  --cache-subnet-group-name my-redis-subnets \\
  --security-group-ids sg-0123456789abcdef0 \\
  --automatic-failover-enabled \\
  --multi-az-enabled \\
  --at-rest-encryption-enabled \\
  --transit-encryption-enabled

# Check status
aws elasticache describe-replication-groups \\
  --replication-group-id my-app-cache \\
  --query "ReplicationGroups[0].Status"`,
      },
    },
    {
      heading: "Caching Patterns",
      body:
        "The most common caching strategies are **cache-aside** (lazy loading) and **write-through**.\n\n**Cache-aside** — The application checks the cache first. On a miss it reads from the database, then populates the cache. This keeps the cache lean (only requested data is cached) but can result in stale data if the database is updated outside the cache path. Use a **TTL** to bound staleness.\n\n**Write-through** — Every write goes to both the cache and the database. Reads are always a cache hit for recently written data. The downside is higher write latency and caching data that may never be read. Combine with a TTL to evict unused keys.\n\n**TTL strategies** — Set short TTLs (seconds to minutes) for rapidly changing data such as leaderboards. Use longer TTLs (hours) for slowly changing reference data. Add jitter to TTLs to avoid cache stampede when many keys expire simultaneously.",
      code: {
        lang: "python",
        label: "Cache-aside pattern with redis-py",
        snippet: `import json
import redis
import boto3

# Connect to ElastiCache Redis (primary endpoint)
cache = redis.Redis(
    host="my-app-cache.abcdef.ng.0001.use1.cache.amazonaws.com",
    port=6379,
    ssl=True,
    decode_responses=True,
)

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Products")

TTL_SECONDS = 300  # 5-minute TTL


def get_product(product_id: str) -> dict:
    """Cache-aside: check cache first, fallback to DynamoDB."""
    cache_key = f"product:{product_id}"

    # 1. Try cache
    cached = cache.get(cache_key)
    if cached is not None:
        return json.loads(cached)

    # 2. Cache miss — read from database
    response = table.get_item(Key={"id": product_id})
    item = response.get("Item")
    if item is None:
        raise KeyError(f"Product {product_id} not found")

    # 3. Populate cache with TTL
    cache.setex(cache_key, TTL_SECONDS, json.dumps(item))
    return item


def invalidate_product(product_id: str) -> None:
    """Delete the cache entry when the product is updated."""
    cache.delete(f"product:{product_id}")`,
      },
    },
  ],
};

// ─── GCP Memorystore ────────────────────────────────────────────────────────

export const memorystoreTopic: Topic = {
  id: "memorystore",
  title: "Memorystore — Managed Redis & Valkey",
  level: "Intermediate",
  readTime: "10 min",
  category: "Caching",
  summary:
    "GCP Memorystore provides fully managed Redis and Valkey instances that are VPC-native with automatic failover. Learn how to provision instances, connect from GKE and Cloud Run, and configure high availability with read replicas.",
  awsEquivalent: "ElastiCache",
  azureEquivalent: "Azure Cache for Redis",
  sections: [
    {
      heading: "What is Memorystore?",
      body:
        "**Memorystore** is Google Cloud's fully managed in-memory data store service. It supports two engines:\n\n**Redis** — The classic in-memory store with full Redis API compatibility. Available in **Basic** (single node, no SLA) and **Standard** (primary + replica with automatic failover and 99.9% SLA) tiers.\n\n**Valkey** — An open-source, Redis-compatible fork maintained by the Linux Foundation. Memorystore for Valkey supports **cluster mode** natively with hash-slot sharding across multiple nodes, automatic rebalancing, and zero-downtime scaling.\n\nBoth engines are **VPC-native** — instances get a private IP in your VPC and are not accessible from the public internet. This simplifies security because you control access through VPC firewall rules and IAM, with no need for SSH tunnels or IP allowlists.",
    },
    {
      heading: "Creating an Instance",
      body:
        "Use the `gcloud` CLI to create a Memorystore instance. The Standard tier provides high availability with automatic failover between zones. You specify the VPC network, region, memory size, and Redis version.",
      code: {
        lang: "bash",
        label: "Create a Memorystore Redis instance via gcloud CLI",
        snippet: `# Create a Standard-tier Redis instance (HA with auto-failover)
gcloud redis instances create my-app-cache \\
  --region=us-central1 \\
  --tier=standard \\
  --size=5 \\
  --redis-version=redis_7_2 \\
  --network=projects/my-project/global/networks/default \\
  --reserved-ip-range=redis-reserved \\
  --enable-auth \\
  --transit-encryption-mode=SERVER_AUTHENTICATION

# Verify the instance
gcloud redis instances describe my-app-cache \\
  --region=us-central1 \\
  --format="table(name,state,tier,memorySizeGb,host,port)"

# Create a Valkey instance with cluster mode
gcloud memorystore instances create my-valkey-cluster \\
  --region=us-central1 \\
  --engine=valkey \\
  --node-type=standard-small \\
  --shard-count=3 \\
  --replica-count=1 \\
  --network=projects/my-project/global/networks/default \\
  --transit-encryption=server-authentication`,
      },
    },
    {
      heading: "Connecting from GKE and Cloud Run",
      body:
        "Since Memorystore is VPC-native, **GKE** pods can connect directly using the instance's private IP — no special configuration needed as long as the GKE cluster is in the same VPC (or a peered VPC). For **Cloud Run**, you must configure a **VPC connector** because Cloud Run services run outside your VPC by default.\n\nThe connection pattern is the same as any Redis client — use the host and port from the instance metadata, plus the AUTH string if authentication is enabled.",
      code: {
        lang: "bash",
        label: "Configure Cloud Run VPC connector for Memorystore access",
        snippet: `# Create a Serverless VPC Access connector
gcloud compute networks vpc-access connectors create redis-connector \\
  --region=us-central1 \\
  --network=default \\
  --range=10.8.0.0/28 \\
  --min-instances=2 \\
  --max-instances=10

# Deploy Cloud Run service with VPC connector
gcloud run deploy my-api \\
  --image=gcr.io/my-project/my-api:latest \\
  --region=us-central1 \\
  --vpc-connector=redis-connector \\
  --set-env-vars="REDIS_HOST=10.0.0.3,REDIS_PORT=6379"

# Get the AUTH string for the instance
gcloud redis instances get-auth-string my-app-cache \\
  --region=us-central1`,
      },
    },
    {
      heading: "High Availability and Replicas",
      body:
        "For Memorystore Redis, the **Standard tier** deploys a primary node and a replica in a different zone. If the primary fails, Memorystore automatically promotes the replica within seconds — your application reconnects to the same IP address.\n\nFor Memorystore Valkey, high availability is built into the cluster topology. Each shard can have one or more replicas, and the cluster handles automatic failover at the shard level.\n\n**Read replicas** (Redis) can be added to offload read traffic from the primary. Replicas receive asynchronous updates and are useful for read-heavy workloads such as caching or analytics dashboards.\n\n**Best practices:**\n- Always use the Standard tier for production workloads.\n- Enable AUTH and transit encryption for security.\n- Monitor memory usage with Cloud Monitoring — set alerts at 80% to prevent evictions.\n- Use connection pooling in your application to avoid exhausting the connection limit.",
      code: {
        lang: "bash",
        label: "Add read replicas to an existing instance",
        snippet: `# Add 2 read replicas to an existing Standard-tier instance
gcloud redis instances update my-app-cache \\
  --region=us-central1 \\
  --read-replicas-mode=READ_REPLICAS_ENABLED \\
  --replica-count=2

# List replica endpoints
gcloud redis instances describe my-app-cache \\
  --region=us-central1 \\
  --format="table(readEndpoint,readEndpointPort)"`,
      },
    },
  ],
};

// ─── Azure Cache for Redis ──────────────────────────────────────────────────

export const azureCacheTopic: Topic = {
  id: "azure-cache-redis",
  title: "Azure Cache for Redis",
  level: "Intermediate",
  readTime: "10 min",
  category: "Caching",
  summary:
    "Azure Cache for Redis offers four tiers — Basic, Standard, Premium, and Enterprise — to cover everything from dev/test to mission-critical workloads with active geo-replication. Learn how to provision a cache, configure persistence, and apply best practices for connection pooling and key management.",
  awsEquivalent: "ElastiCache",
  gcpEquivalent: "Memorystore",
  sections: [
    {
      heading: "What is Azure Cache for Redis?",
      body:
        "**Azure Cache for Redis** is a fully managed in-memory data store based on Redis. It provides four tiers, each adding capabilities:\n\n| Tier | SLA | Replication | Max Size | Key Features |\n|---|---|---|---|---|\n| **Basic** | None | No | 53 GB | Single node, dev/test only |\n| **Standard** | 99.9% | Primary + replica | 53 GB | HA with auto-failover |\n| **Premium** | 99.9% | Primary + replicas | 120 GB | Persistence (RDB/AOF), clustering, VNet injection, geo-replication (passive) |\n| **Enterprise** | 99.999% | Active-active | 2 TB+ | RediSearch, RedisJSON, RedisTimeSeries, active geo-replication |\n\nThe **Standard** tier is the baseline for production. Choose **Premium** when you need data persistence, VNet isolation, or sharding beyond a single node. Choose **Enterprise** for active-active geo-replication across regions or Redis module support.",
    },
    {
      heading: "Creating a Cache",
      body:
        "Use the Azure CLI to create an Azure Cache for Redis instance. The example below creates a **Standard C1** cache (1 GB, primary + replica) with TLS enforced. For Premium or Enterprise tiers, additional parameters control clustering, persistence, and VNet settings.",
      code: {
        lang: "bash",
        label: "Create an Azure Cache for Redis instance via az CLI",
        snippet: `# Create a resource group
az group create \\
  --name rg-caching \\
  --location eastus

# Create a Standard C1 cache (1 GB, HA with replica)
az redis create \\
  --name my-app-cache \\
  --resource-group rg-caching \\
  --location eastus \\
  --sku Standard \\
  --vm-size C1 \\
  --minimum-tls-version 1.2 \\
  --redis-version 6

# Retrieve the primary access key
az redis list-keys \\
  --name my-app-cache \\
  --resource-group rg-caching \\
  --query "primaryKey" -o tsv

# Create a Premium P1 cache with clustering (3 shards)
az redis create \\
  --name my-premium-cache \\
  --resource-group rg-caching \\
  --location eastus \\
  --sku Premium \\
  --vm-size P1 \\
  --shard-count 3 \\
  --minimum-tls-version 1.2`,
      },
    },
    {
      heading: "Data Persistence and Geo-Replication",
      body:
        "The **Premium** tier supports two persistence models:\n\n**RDB snapshots** — Point-in-time snapshots saved to Azure Storage at configurable intervals (every 15, 30, or 60 minutes). Best for disaster recovery where some data loss is acceptable.\n\n**AOF (Append-Only File)** — Logs every write operation for near-zero data loss. Higher storage cost and slight performance overhead compared to RDB.\n\n**Passive geo-replication** (Premium) links a primary cache in one region to a secondary cache in another. The secondary is read-only and receives asynchronous updates. Failover is manual.\n\n**Active geo-replication** (Enterprise) enables read-write access in all linked regions with conflict resolution. This is ideal for globally distributed applications where each region needs local write latency.",
      code: {
        lang: "bash",
        label: "Enable RDB persistence and geo-replication",
        snippet: `# Enable RDB persistence on a Premium cache (snapshot every 15 min)
az redis update \\
  --name my-premium-cache \\
  --resource-group rg-caching \\
  --set "redisConfiguration.rdb-backup-enabled=true" \\
  --set "redisConfiguration.rdb-backup-frequency=15" \\
  --set "redisConfiguration.rdb-storage-connection-string=<storage-connection-string>"

# Create a geo-replication link (Premium passive)
az redis server-link create \\
  --name my-premium-cache \\
  --resource-group rg-caching \\
  --server-to-link /subscriptions/<sub-id>/resourceGroups/rg-dr/providers/Microsoft.Cache/redis/my-dr-cache \\
  --replication-role Secondary`,
      },
    },
    {
      heading: "Best Practices",
      body:
        "**Connection pooling** — Redis connections are expensive to establish. Use a connection pool (most client libraries support this) and reuse connections across requests. For Node.js, `ioredis` creates a pool by default. For .NET, `StackExchange.Redis` uses a `ConnectionMultiplexer` that should be a singleton.\n\n**Key expiry** — Always set a TTL on cache keys to prevent unbounded memory growth. Use `EXPIRE` or `SETEX` for explicit TTLs. For session data, align TTLs with session timeout. Add random jitter (e.g., base TTL ± 10%) to prevent thundering-herd evictions.\n\n**Key naming** — Use a consistent naming convention with colons as separators, e.g. `user:12345:profile`. Prefix keys by service or domain to avoid collisions in shared caches.\n\n**Monitoring** — Enable Azure Monitor diagnostics to track `cache hits`, `cache misses`, `connected clients`, `server load`, and `used memory`. Set alerts when server load exceeds 80% or evictions spike.",
      code: {
        lang: "typescript",
        label: "Connection pooling and cache-aside in Node.js with ioredis",
        snippet: `import Redis from "ioredis";

// Singleton connection — ioredis manages internal pooling
const redis = new Redis({
  host: "my-app-cache.redis.cache.windows.net",
  port: 6380,
  password: process.env.REDIS_ACCESS_KEY,
  tls: { servername: "my-app-cache.redis.cache.windows.net" },
  retryStrategy(times: number) {
    return Math.min(times * 200, 5000);
  },
  maxRetriesPerRequest: 3,
});

const TTL_SECONDS = 600; // 10 minutes

async function getUserProfile(userId: string): Promise<Record<string, unknown>> {
  const cacheKey = \`user:\${userId}:profile\`;

  // 1. Try cache
  const cached = await redis.get(cacheKey);
  if (cached !== null) {
    return JSON.parse(cached);
  }

  // 2. Cache miss — fetch from database
  const profile = await fetchProfileFromDb(userId);

  // 3. Populate cache with TTL + jitter
  const jitter = Math.floor(Math.random() * 60);
  await redis.setex(cacheKey, TTL_SECONDS + jitter, JSON.stringify(profile));

  return profile;
}

async function fetchProfileFromDb(userId: string): Promise<Record<string, unknown>> {
  // Replace with actual database query
  return { id: userId, name: "Example User" };
}`,
      },
    },
  ],
};

// ─── Caching Module ─────────────────────────────────────────────────────────

export const cachingModule: Module = {
  id: "caching",
  title: "Caching",
  desc: "Deploy and operate managed in-memory caches across AWS ElastiCache, GCP Memorystore, and Azure Cache for Redis.",
  category: "Caching",
  topics: [elasticacheTopic, memorystoreTopic, azureCacheTopic],
};
