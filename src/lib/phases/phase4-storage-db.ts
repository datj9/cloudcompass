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

// ─── AWS: DynamoDB ────────────────────────────────────────────────────────────

export const dynamodbTopic: Topic = {
  id: "dynamodb-basics",
  title: "DynamoDB — Managed NoSQL",
  level: "Intermediate",
  readTime: "12 min",
  category: "Storage",
  summary:
    "DynamoDB is AWS's fully managed NoSQL database delivering single-digit millisecond latency at any scale. It supports both key-value and document data models and removes all infrastructure management overhead.",
  gcpEquivalent: "Firestore",
  azureEquivalent: "CosmosDB",
  sections: [
    {
      heading: "What is DynamoDB?",
      body:
        "**DynamoDB** is a fully managed, serverless NoSQL database service provided by AWS. It is built to handle **single-digit millisecond latency** at virtually unlimited scale — from a few requests per second to tens of millions. DynamoDB supports both **key-value** lookups and **document** storage, where items can contain nested JSON-like attributes. Because AWS manages all patching, replication, and hardware, you focus entirely on your data model and access patterns. DynamoDB is multi-AZ by default, meaning your data is automatically replicated across three Availability Zones for durability.",
    },
    {
      heading: "Data model",
      body:
        "DynamoDB stores data in **tables**, which contain **items** (analogous to rows). Each item is identified by a **primary key** consisting of a required **partition key** (hash key) and an optional **sort key** (range key). Items within the same partition key are stored together and can be sorted by the sort key, enabling efficient range queries. Beyond the primary key, items have **attributes** — schema-free fields that can vary per item. Critically, DynamoDB has **no joins** — you must model your data around your access patterns upfront rather than relying on relational queries.",
    },
    {
      heading: "GSIs and LSIs",
      body:
        "To query data by attributes other than the primary key, DynamoDB offers two types of secondary indexes. A **Global Secondary Index (GSI)** has a completely different partition key and optional sort key, enabling queries across the entire table by an alternate key. A **Local Secondary Index (LSI)** shares the same partition key as the base table but uses a different sort key, allowing alternate sort orders within a partition. Both index types replicate data, so they consume additional **storage and write capacity** — plan indexes carefully and only create them for known query patterns.",
    },
    {
      heading: "Read/Write capacity",
      body:
        "DynamoDB offers two capacity modes. **Provisioned mode** requires you to specify **Read Capacity Units (RCUs)** and **Write Capacity Units (WCUs)** in advance; one RCU = one strongly consistent read of up to 4 KB/s, one WCU = one write of up to 1 KB/s. **On-demand mode** scales automatically and charges per request — ideal for unpredictable traffic. Auto-scaling can adjust provisioned capacity within defined bounds. Choose provisioned with auto-scaling for steady or predictable workloads, and on-demand for spiky or new workloads.",
      code: {
        lang: "bash",
        label: "Create a DynamoDB table (AWS CLI)",
        snippet: `aws dynamodb create-table \\
  --table-name Orders \\
  --attribute-definitions \\
      AttributeName=customerId,AttributeType=S \\
      AttributeName=orderId,AttributeType=S \\
  --key-schema \\
      AttributeName=customerId,KeyType=HASH \\
      AttributeName=orderId,KeyType=RANGE \\
  --billing-mode PAY_PER_REQUEST \\
  --region us-east-1`,
      },
    },
    {
      heading: "Best practices",
      body:
        "• Use **single-table design** to store multiple entity types in one table, reducing operational overhead and enabling efficient access patterns with composite sort keys. • Avoid **hot partitions** by choosing a partition key with high cardinality (e.g., userId, orderId) — low-cardinality keys concentrate traffic and throttle throughput. • Use **TTL (Time-To-Live)** to automatically expire stale items without consuming write capacity. • Batch operations (`BatchGetItem`, `BatchWriteItem`) reduce round trips when processing multiple items. • Prefer **condition expressions** over read-modify-write cycles to prevent race conditions.",
      code: {
        lang: "bash",
        label: "Put and get an item (AWS CLI)",
        snippet: `# Write an item
aws dynamodb put-item \\
  --table-name Orders \\
  --item '{
    "customerId": {"S": "user-42"},
    "orderId":    {"S": "order-2024-001"},
    "total":      {"N": "99.99"},
    "ttl":        {"N": "1735689600"}
  }' \\
  --region us-east-1

# Read the item
aws dynamodb get-item \\
  --table-name Orders \\
  --key '{
    "customerId": {"S": "user-42"},
    "orderId":    {"S": "order-2024-001"}
  }' \\
  --region us-east-1`,
      },
    },
  ],
};

// ─── GCP: Cloud SQL ───────────────────────────────────────────────────────────

export const cloudSqlTopic: Topic = {
  id: "cloud-sql",
  title: "Cloud SQL — Managed Relational Database",
  level: "Beginner",
  readTime: "8 min",
  category: "Storage",
  summary:
    "Cloud SQL is Google Cloud's fully managed relational database service supporting PostgreSQL, MySQL, and SQL Server. It automates backups, patches, replication, and failover so you can focus on your application.",
  awsEquivalent: "RDS",
  azureEquivalent: "Azure SQL",
  sections: [
    {
      heading: "What is Cloud SQL?",
      body:
        "**Cloud SQL** is a fully managed relational database service on Google Cloud. It supports **PostgreSQL**, **MySQL**, and **SQL Server** — you choose the engine and version, and GCP handles the rest. Automated **backups** run daily, **binary logging** enables point-in-time recovery, and Google applies **security patches** without downtime windows. Cloud SQL instances run on dedicated VMs in your chosen region, and storage automatically grows as your data increases. It integrates natively with other GCP services such as Cloud Run, GKE, and BigQuery federation.",
    },
    {
      heading: "Creating an instance",
      body:
        "When creating a Cloud SQL instance you specify the **database engine** (PostgreSQL, MySQL, or SQL Server), **machine type** (shared-core for dev/test, dedicated-core for production), **region**, and **storage type** (SSD or HDD). SSD storage is strongly recommended for production due to lower latency. You can set a **maintenance window** to control when Google applies updates. The `gcloud sql instances create` command below creates a small PostgreSQL 15 instance suitable for development.",
      code: {
        lang: "bash",
        label: "Create a Cloud SQL instance (gcloud CLI)",
        snippet: `gcloud sql instances create my-postgres-instance \\
  --database-version=POSTGRES_15 \\
  --tier=db-g1-small \\
  --region=us-central1 \\
  --storage-type=SSD \\
  --storage-size=20GB \\
  --backup-start-time=03:00 \\
  --availability-type=ZONAL`,
      },
    },
    {
      heading: "High Availability & Read Replicas",
      body:
        "For production workloads set `--availability-type=REGIONAL` to enable **High Availability (HA)**. In HA mode Cloud SQL maintains a **standby instance** in a different zone within the same region and performs automatic failover in 20-60 seconds if the primary fails. **Read replicas** offload analytical or heavy read traffic from the primary; you can also create **cross-region replicas** for disaster recovery or serving users closer to another geography. Replicas use asynchronous replication, so there is a small lag during periods of high write volume.",
    },
    {
      heading: "Connecting securely",
      body:
        "• Use the **Cloud SQL Auth Proxy** for local development and GCE/GKE workloads — it handles IAM-based authentication and TLS without managing certificates manually. • For Cloud Run or App Engine, use the built-in **Cloud SQL connector** via the socket path. • In production, assign a **private IP** to your instance and access it from within a VPC, eliminating public internet exposure entirely. • Enforce **SSL/TLS** by setting `require_ssl = on` in the database flags so all connections are encrypted in transit. • Grant access using **IAM database authentication** (PostgreSQL/MySQL) instead of static passwords where possible.",
    },
  ],
};

// ─── GCP: Firestore ───────────────────────────────────────────────────────────

export const firestoreTopic: Topic = {
  id: "firestore-basics",
  title: "Firestore — Serverless Document Database",
  level: "Beginner",
  readTime: "8 min",
  category: "Storage",
  summary:
    "Firestore is Google Cloud's serverless, scalable document database with real-time synchronization, offline support, and a flexible collection/document data model.",
  awsEquivalent: "DynamoDB",
  azureEquivalent: "CosmosDB",
  sections: [
    {
      heading: "What is Firestore?",
      body:
        "**Firestore** (formerly Cloud Firestore) is a fully serverless, horizontally scalable document database built for mobile, web, and server applications. It uses a **document/collection** data model where JSON-like documents are grouped into collections. Firestore supports **real-time listeners** that push data changes to connected clients instantly — ideal for chat apps, dashboards, and collaborative tools. It includes built-in **offline support** via client SDKs that cache data locally and sync when connectivity is restored. You pay per operation (reads, writes, deletes) with no servers to provision or scale.",
    },
    {
      heading: "Data model",
      body:
        "Data in Firestore is organized into **collections** containing **documents**. A document is a JSON-like object with a unique ID and a set of **fields** — strings, numbers, booleans, timestamps, arrays, maps, and references. Documents can contain **subcollections**, enabling hierarchical data structures (e.g., a `users` collection where each user document has a `posts` subcollection). Unlike SQL, Firestore has no fixed schema — each document in a collection can have different fields. Document size is capped at **1 MB**; large blobs should be stored in Cloud Storage instead.",
    },
    {
      heading: "Queries and indexes",
      body:
        "Firestore supports equality filters, range filters, and ordering on a single field out of the box. **Compound queries** that filter or order on multiple fields require a **composite index**, which you define in `firestore.indexes.json` and deploy with the Firebase CLI. Key limitations to be aware of: you cannot perform an `OR` query across different fields in a single request (use multiple queries and merge client-side), and `!=` and `not-in` operators have cardinality restrictions. Always check the Firestore console for index suggestions when a query fails with a missing index error.",
    },
    {
      heading: "Real-time listeners",
      body:
        "The `onSnapshot` method attaches a listener that fires every time the queried document or collection changes, delivering updates with sub-second latency. Use real-time listeners for features where freshness matters — live scoreboards, notifications, presence indicators. For data that only needs to be read once (e.g., on page load), use `getDoc` / `getDocs` to avoid holding open a persistent connection. Remember to **unsubscribe** from listeners (call the returned unsubscribe function) when a component unmounts to avoid memory leaks and unnecessary billing.",
      code: {
        lang: "javascript",
        label: "Real-time listener (Node.js / Firebase SDK v9+)",
        snippet: `import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, query, where } from "firebase/firestore";

const app = initializeApp({ projectId: "my-gcp-project" });
const db  = getFirestore(app);

// Listen for all orders belonging to a specific user
const ordersRef = collection(db, "orders");
const q = query(ordersRef, where("userId", "==", "user-42"));

const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added")    console.log("New order:",     change.doc.data());
    if (change.type === "modified") console.log("Updated order:", change.doc.data());
    if (change.type === "removed")  console.log("Removed order:", change.doc.id);
  });
});

// Call unsubscribe() to detach the listener when no longer needed`,
      },
    },
  ],
};

// ─── Azure: CosmosDB ──────────────────────────────────────────────────────────

export const cosmosdbTopic: Topic = {
  id: "cosmosdb-basics",
  title: "CosmosDB — Multi-Model Global Database",
  level: "Intermediate",
  readTime: "10 min",
  category: "Storage",
  summary:
    "Azure CosmosDB is a globally distributed, multi-model database service with a 99.999% SLA. It supports multiple APIs (Core SQL, MongoDB, Cassandra, Table, Gremlin) and offers five tunable consistency levels.",
  awsEquivalent: "DynamoDB",
  gcpEquivalent: "Firestore",
  sections: [
    {
      heading: "What is CosmosDB?",
      body:
        "**Azure CosmosDB** is Microsoft's globally distributed, multi-model database service. Unlike most databases that commit to a single data model, CosmosDB supports five APIs in a single service: **Core (SQL)** for document queries, **MongoDB** for compatibility with existing Mongo apps, **Cassandra** for wide-column workloads, **Table** as a drop-in for Azure Table Storage, and **Gremlin** for graph data. All APIs share the same underlying engine, global distribution, and operational guarantees. CosmosDB offers a **99.999% availability SLA** for multi-region accounts with multi-region writes, making it suitable for mission-critical, globally distributed applications.",
    },
    {
      heading: "Consistency levels",
      body:
        "CosmosDB exposes **five consistency levels** that let you trade latency and availability for data accuracy. From strongest to weakest: **Strong** — linearizable reads, highest latency, requires synchronous replication; **Bounded Staleness** — reads lag behind writes by at most N versions or T seconds; **Session** (default) — read-your-own-writes guarantee within a client session, good balance for most apps; **Consistent Prefix** — reads never see out-of-order writes but may be stale; **Eventual** — lowest latency, highest throughput, no ordering guarantees. Choose Session for most OLTP workloads and Eventual for analytics or non-critical reads.",
    },
    {
      heading: "Partition key design",
      body:
        "CosmosDB distributes data across **logical partitions** identified by a partition key value, and groups logical partitions into **physical partitions** managed by the service. A single physical partition holds up to **50 GB** of data and 10,000 RU/s. Choosing a good partition key is the single most important design decision: prefer keys with **high cardinality** (e.g., `userId`, `deviceId`) to spread load evenly. A bad partition key (e.g., a boolean `isActive`) creates hot partitions that throttle your throughput. **Cross-partition queries** are supported but cost more RUs, so structure queries to target a single partition whenever possible.",
    },
    {
      heading: "Request Units (RUs)",
      body:
        "CosmosDB uses **Request Units (RU/s)** as a unified currency for all database operations regardless of API. A read of a 1 KB document costs approximately 1 RU; writes cost roughly 5 RUs; complex queries cost more. You provision RU/s at the database or container level. **Provisioned throughput** with **autoscale** scales between 10% and 100% of your maximum RU/s automatically. **Serverless** mode (no provisioning) suits development, testing, and sporadic workloads — you pay per operation. Use the Azure Portal's **Metrics** blade to monitor consumed RUs and adjust capacity before hitting throttling (HTTP 429).",
    },
    {
      heading: "Global distribution",
      body:
        "Adding a region to a CosmosDB account takes only a few seconds and requires no application changes — the SDK automatically routes reads to the nearest region. With **multi-region writes** enabled, any region accepts writes, reducing write latency for globally distributed users. When multiple regions write to the same item simultaneously, CosmosDB uses **conflict resolution** policies: Last-Write-Wins (based on a timestamp or custom path) or a custom conflict-resolution stored procedure. The Azure CLI snippet below adds a second write region to an existing account.",
      code: {
        lang: "bash",
        label: "Add a write region to a CosmosDB account (az CLI)",
        snippet: `# Enable multi-region writes and add West Europe as a second write region
az cosmosdb update \\
  --name my-cosmos-account \\
  --resource-group my-rg \\
  --enable-multiple-write-locations true \\
  --locations regionName=eastus  failoverPriority=0 isZoneRedundant=true \\
             regionName=westeurope failoverPriority=1 isZoneRedundant=true

# Verify the updated locations
az cosmosdb show \\
  --name my-cosmos-account \\
  --resource-group my-rg \\
  --query "locations[].{Region:locationName, Priority:failoverPriority}" \\
  --output table`,
      },
    },
  ],
};
