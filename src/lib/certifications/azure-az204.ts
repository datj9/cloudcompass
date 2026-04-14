import type { Certification } from "./types";

export const azureAz204: Certification = {
  id: "azure-az204",
  title: "Azure Developer Associate",
  code: "AZ-204",
  cloud: "azure",
  level: "Associate",
  description:
    "Validate your ability to design, build, test, and maintain cloud applications and services on Azure. Covers compute, storage, security, monitoring, and Azure service integration.",
  examFormat: {
    questions: 50,
    duration: "100 minutes",
    passingScore: "700/1000",
    cost: "$165 USD",
  },
  domains: [
    // ─── Domain 1: Develop Azure Compute Solutions (25%) ────────────
    {
      id: "domain-1",
      title: "Develop Azure Compute Solutions",
      weight: "25%",
      order: 1,
      summary:
        "This domain is the heaviest on the exam at 25% and tests your ability to implement solutions using Azure's compute offerings: Azure App Service, Azure Functions, Azure Container Registry, and Azure Container Apps. Developers must understand how to configure, deploy, and scale applications on these platforms.\n\nKey areas include configuring App Service settings (connection strings, app settings, custom domains, SSL), implementing **Azure Functions** with various trigger types (HTTP, Timer, Blob, Queue, Event Hub, Service Bus), containerizing applications with Docker, pushing to **Azure Container Registry (ACR)**, and deploying to **Azure Container Apps** with Dapr and KEDA auto-scaling.\n\nExpect code-level questions — the exam tests actual SDK usage, configuration syntax, and ARM/Bicep patterns for compute resources. Know the differences between **consumption plan**, **Flex Consumption plan**, and **Dedicated/Premium plans** for Azure Functions.",
      keyConceptsForExam: [
        "**Azure App Service** — web apps, API apps, WebJobs; deployment methods (ZIP deploy, GitHub Actions, slots); scaling; custom domains",
        "**Azure Functions triggers and bindings** — HTTP, Timer (`0 * * * * *` cron), Blob, Queue, Event Hub, Service Bus, Cosmos DB; input and output bindings reduce boilerplate code",
        "**Durable Functions** — orchestrator, activity, entity, and client functions; patterns: function chaining, fan-out/fan-in, async HTTP polling, monitor, human interaction",
        "**Azure Container Registry (ACR)** — build and store Docker images; geo-replication, tasks, managed identity authentication",
        "**Azure Container Apps** — serverless containers with KEDA-based auto-scaling, Dapr integration, ingress configuration, revisions",
        "**App Service plans** — Free, Basic, Standard, Premium, Isolated; Always On setting; WebJob continuous vs. triggered",
        "**Azure Functions hosting plans** — Consumption (serverless, cold starts), Flex Consumption (private networking + serverless), Premium (no cold start), Dedicated (App Service plan)",
        "**Deployment slots** — zero-downtime swap; slot-sticky settings; traffic routing for A/B testing",
      ],
      examTips: [
        "Durable Functions orchestrators must be deterministic — no random, DateTime.Now, or direct I/O calls inside orchestrator functions. Use activity functions for all non-deterministic work.",
        "Azure Functions Consumption plan scales to zero (cold start risk) and is billed per execution. Premium plan pre-warms instances (no cold start) and supports VNet integration. Know which scenarios require Premium.",
        "ACR tasks can build Docker images directly in Azure from source code — you do not need Docker installed locally. `az acr build` is the key command.",
        "Container Apps revisions allow gradual traffic splitting between versions — useful for canary deployments without Kubernetes complexity.",
        "HTTP trigger functions return `HttpResponseMessage` (or `IActionResult` in isolated model) — understand the difference between the in-process and isolated worker models for .NET.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
        { cloud: "azure", topicId: "azure-vm-basics", title: "Azure Virtual Machines" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
      ],
      sections: [
        {
          heading: "Azure Functions Triggers and Bindings",
          body: "Azure Functions uses a **trigger** (what invokes the function) and optional **input/output bindings** (declarative data connections) defined in `function.json` or as attributes in code. Bindings eliminate boilerplate code for reading from and writing to Azure services.\n\nCommon triggers:\n- **HTTP trigger**: REST endpoint, configurable auth levels (`anonymous`, `function`, `admin`)\n- **Timer trigger**: Cron expression (`0 */5 * * * *` = every 5 minutes, 6-field format)\n- **Blob trigger**: Fires when a blob is created/modified in a container\n- **Queue trigger**: Processes messages from Azure Storage Queue\n- **Service Bus trigger**: Processes messages from Service Bus queues or topics\n- **Event Hub trigger**: High-throughput event stream processing\n\nOutput bindings write results to a service (e.g., `[Blob(\"output/{name}\")]`) without explicit SDK calls in the function body.",
          code: {
            lang: "csharp",
            label: "Azure Function with Queue trigger and Blob output binding",
            snippet: `[Function("ProcessUpload")]
public static async Task Run(
    [QueueTrigger("uploads", Connection = "StorageConnection")] string blobName,
    [BlobInput("source/{queueTrigger}", Connection = "StorageConnection")] Stream sourceBlob,
    [BlobOutput("processed/{queueTrigger}", Connection = "StorageConnection")] Stream outputBlob,
    FunctionContext context)
{
    var logger = context.GetLogger("ProcessUpload");
    logger.LogInformation($"Processing blob: {blobName}");
    await sourceBlob.CopyToAsync(outputBlob);
}`,
          },
        },
        {
          heading: "Durable Functions Patterns",
          body: "Durable Functions extends Azure Functions with stateful workflows using three function types:\n\n- **Orchestrator function**: Coordinates the workflow. Must be deterministic — use `context.CurrentUtcDateTime` instead of `DateTime.UtcNow`, and call activities instead of doing I/O directly.\n- **Activity function**: Performs the actual work (calling APIs, processing data). Can be non-deterministic.\n- **Client function**: Starts orchestrations (any trigger type).\n\nKey patterns:\n- **Function chaining**: Sequential activities where each result is input to the next.\n- **Fan-out/fan-in**: Launch multiple activities in parallel (`Task.WhenAll`), then aggregate results.\n- **Async HTTP polling**: Client starts orchestration, gets a status URL to poll — built-in with Durable Functions HTTP management API.\n- **Monitor**: Polling loop that checks a condition and waits using `context.CreateTimer`.\n- **Human interaction**: Use `WaitForExternalEvent` to pause until a human approves/rejects.",
          code: {
            lang: "csharp",
            label: "Durable Functions fan-out/fan-in pattern",
            snippet: `[Function("Orchestrator_FanOut")]
public static async Task<List<string>> RunOrchestrator(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var items = await context.CallActivityAsync<string[]>("GetItems", null);

    // Fan-out: run all activities in parallel
    var tasks = items.Select(item =>
        context.CallActivityAsync<string>("ProcessItem", item));

    // Fan-in: wait for all to complete
    var results = await Task.WhenAll(tasks);
    return results.ToList();
}`,
          },
        },
        {
          heading: "Azure Container Registry and Container Apps",
          body: "**Azure Container Registry (ACR)** is a managed Docker registry for storing and building container images. Key capabilities:\n- `az acr build` builds images directly in Azure from a Dockerfile — no local Docker daemon needed.\n- ACR Tasks automate image builds on code commit or base image updates.\n- Managed identity authentication eliminates the need for admin credentials when pulling images from App Service, Container Apps, or AKS.\n\n**Azure Container Apps** provides serverless containers with automatic scaling via KEDA (Kubernetes Event-Driven Autoscaling). Key concepts:\n- **Revisions**: Immutable snapshots of the container app. Traffic can be split across revisions for canary deployments.\n- **Ingress**: HTTP/HTTPS traffic routing; external (internet-facing) or internal (VNet only).\n- **Scale rules**: HTTP concurrency, Azure Queue message count, CPU/memory, or any KEDA-supported scaler.\n- **Dapr**: Optional distributed application runtime for service discovery, pub/sub, and state management.",
          code: {
            lang: "bash",
            label: "Build and deploy a container to Azure Container Apps",
            snippet: `# Build image in ACR (no local Docker required)
az acr build \\
  --registry myACR \\
  --image myapp:v1 \\
  .

# Deploy to Container Apps
az containerapp create \\
  --name myapp \\
  --resource-group myRG \\
  --environment myContainerEnv \\
  --image myACR.azurecr.io/myapp:v1 \\
  --registry-server myACR.azurecr.io \\
  --min-replicas 1 \\
  --max-replicas 10 \\
  --ingress external \\
  --target-port 8080`,
          },
        },
      ],
      quiz: [
        {
          id: "az204-d1-q1",
          question:
            "An Azure Function Timer trigger is configured with the cron expression `0 0 8 * * 1-5`. When does it fire?",
          options: [
            "A) Every 8 minutes on weekdays.",
            "B) At 8:00 AM UTC every Monday through Friday.",
            "C) At 8:00 AM UTC every day of the week.",
            "D) Every hour, 8 times per day on weekdays.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Functions uses a 6-field NCRONTAB expression: `{second} {minute} {hour} {day} {month} {day-of-week}`. `0 0 8 * * 1-5` means: second=0, minute=0, hour=8, any day-of-month, any month, Monday–Friday (1–5). This fires at exactly 8:00:00 AM UTC on weekdays.",
        },
        {
          id: "az204-d1-q2",
          question:
            "A Durable Functions orchestrator must wait for a human approval event before proceeding. Which Durable Functions API should it use?",
          options: [
            "A) `context.CallActivityAsync('WaitForApproval')`",
            "B) `await Task.Delay(TimeSpan.FromDays(1))`",
            "C) `await context.WaitForExternalEvent<bool>('ApprovalReceived')`",
            "D) `context.SetCustomStatus('Waiting')`",
          ],
          correctIndex: 2,
          explanation:
            "`WaitForExternalEvent` pauses the orchestration until an external event with the specified name is raised (via the Durable Functions client API). This is the canonical pattern for human interaction in Durable Functions. Calling an activity (A) does not pause and wait for external input. `Task.Delay` (B) is non-deterministic and must not be used in orchestrators. `SetCustomStatus` (C) only updates the status string, it does not pause execution.",
        },
        {
          id: "az204-d1-q3",
          question:
            "A developer needs to deploy a web app to Azure App Service with zero downtime. Changes must be validated in a staging environment before going live. Which feature should be used?",
          options: [
            "A) Deploy directly to production and monitor error rates.",
            "B) Use deployment slots — deploy to staging, validate, then swap to production.",
            "C) Create a second App Service in a different region and use Traffic Manager.",
            "D) Use Blue-Green deployment with two separate App Service plans.",
          ],
          correctIndex: 1,
          explanation:
            "Deployment slots allow deploying to a staging slot, validating the deployment, and then performing a zero-downtime swap to production. The swap warms up the staging instances before redirecting traffic. Deploying directly (A) risks production outages. Traffic Manager (C) and separate App Service plans (D) achieve similar results but are more complex and expensive than built-in slots.",
        },
        {
          id: "az204-d1-q4",
          question:
            "An Azure Function on the Consumption plan experiences cold starts causing latency issues for latency-sensitive API requests. What is the RECOMMENDED solution?",
          options: [
            "A) Increase the function timeout in `host.json`.",
            "B) Move the function to the Premium plan, which keeps pre-warmed instances ready.",
            "C) Enable Always On in the function app configuration.",
            "D) Reduce the function code size to decrease initialization time.",
          ],
          correctIndex: 1,
          explanation:
            "The Azure Functions Premium plan maintains pre-warmed instances that are always ready to execute, eliminating cold starts. The Consumption plan scales to zero when idle, causing cold starts on the first invocation after idle. Always On (C) is an App Service setting that applies to Dedicated plans, not Consumption. Timeout (A) and code size (D) do not address the root cause of cold starts.",
        },
        {
          id: "az204-d1-q5",
          question:
            "A developer wants to build a Docker image from a Dockerfile in their current directory and push it to an Azure Container Registry named `myRegistry` without installing Docker locally. Which command achieves this?",
          options: [
            "A) `docker build -t myRegistry.azurecr.io/myapp:v1 . && docker push myRegistry.azurecr.io/myapp:v1`",
            "B) `az acr build --registry myRegistry --image myapp:v1 .`",
            "C) `az container create --image myapp:v1 --registry myRegistry`",
            "D) `az acr import --name myRegistry --source myapp:v1`",
          ],
          correctIndex: 1,
          explanation:
            "`az acr build` sends the build context to ACR, builds the image in the cloud using ACR Tasks, and pushes the result — no local Docker installation required. The `docker` commands (A) require Docker installed locally. `az container create` (C) deploys a container instance, not builds an image. `az acr import` (D) copies an existing image from another registry.",
        },
        {
          id: "az204-d1-q6",
          question:
            "In Azure Container Apps, what is a revision and why is it important for deployments?",
          options: [
            "A) A revision is a billing cycle for container compute usage.",
            "B) A revision is an immutable snapshot of the container app version; traffic can be split across revisions for canary deployments.",
            "C) A revision is a backup copy of the container image in ACR.",
            "D) A revision is a configuration snapshot stored in Azure Key Vault.",
          ],
          correctIndex: 1,
          explanation:
            "Each deployment to a Container App creates a new revision — an immutable snapshot of the app configuration and container image. Multiple revisions can be active simultaneously with controlled traffic splitting (e.g., 90% to stable, 10% to canary). This enables safe rollout strategies. Revisions are not billing units (A), image backups (C), or Key Vault snapshots (D).",
        },
        {
          id: "az204-d1-q7",
          question:
            "A developer implements a Durable Functions orchestrator that calls `DateTime.UtcNow` to record timestamps. A code reviewer flags this as a problem. Why?",
          options: [
            "A) `DateTime.UtcNow` is deprecated in .NET; use `DateTimeOffset.UtcNow` instead.",
            "B) Orchestrator functions must be deterministic; `DateTime.UtcNow` returns different values on replay, causing inconsistency.",
            "C) `DateTime.UtcNow` is not supported in Azure Functions isolated worker model.",
            "D) Using `DateTime.UtcNow` causes excessive memory usage in long-running orchestrations.",
          ],
          correctIndex: 1,
          explanation:
            "Durable Functions orchestrators are replayed from the beginning when resuming — all non-deterministic calls must return the same value on replay. `DateTime.UtcNow` returns a different value each time, breaking replay consistency. Use `context.CurrentUtcDateTime` instead, which returns the same deterministic value during replay. This is not a deprecation issue (A), an isolated model limitation (C), or a memory concern (D).",
        },
        {
          id: "az204-d1-q8",
          question:
            "An App Service web app needs to connect to a SQL database. The connection string must be different in staging and production slots. How should this be configured?",
          options: [
            "A) Store the connection string in `appsettings.json` and deploy different files per environment.",
            "B) Configure the connection string in App Service configuration and mark it as a deployment slot setting.",
            "C) Store the connection string in Azure Key Vault with separate secrets per environment.",
            "D) Set the connection string as an OS-level environment variable in the container.",
          ],
          correctIndex: 1,
          explanation:
            "Marking a connection string as a deployment slot setting (slot-sticky) ensures it stays with the slot during swaps — the staging slot uses the staging database and production uses the production database. `appsettings.json` (A) is bundled in the deployment artifact and swaps with the code. Key Vault references (C) can work but require separate secret versions per environment and do not prevent the setting from swapping unless also marked slot-sticky. OS environment variables (D) swap with the container.",
        },
        {
          id: "az204-d1-q9",
          question:
            "Which Azure Functions hosting plan supports VNet integration AND scales to zero when idle?",
          options: [
            "A) Consumption plan — serverless, no VNet support.",
            "B) Flex Consumption plan — serverless scaling with VNet integration support.",
            "C) Premium plan — VNet integration but does not scale to zero.",
            "D) Dedicated (App Service) plan — VNet integration but no serverless scaling.",
          ],
          correctIndex: 1,
          explanation:
            "The Flex Consumption plan combines the serverless (scale-to-zero) model of the Consumption plan with VNet integration support — previously only available on Premium. The standard Consumption plan (A) does not support VNet integration. Premium (C) supports VNet but maintains pre-warmed instances (does not scale to zero). Dedicated (D) supports VNet but requires manual or auto-scaling configuration.",
        },
        {
          id: "az204-d1-q10",
          question:
            "A developer implements an Azure Function that should process each message in an Azure Storage Queue exactly once. The function uses a Queue trigger. What happens if the function throws an exception while processing a message?",
          options: [
            "A) The message is immediately deleted from the queue and logged as failed.",
            "B) The message becomes visible again after the visibility timeout expires and is retried up to the configured maximum delivery count before being moved to the poison queue.",
            "C) The exception is swallowed and the message is deleted automatically.",
            "D) The function is permanently disabled until manually re-enabled.",
          ],
          correctIndex: 1,
          explanation:
            "When a Queue trigger function throws an exception, the message's visibility timeout resets and it becomes visible for reprocessing. After a configurable number of retries (default 5), the message is moved to the `{queue-name}-poison` queue for dead-letter handling. The function is not disabled (D) and messages are not immediately deleted on failure (A/C).",
        },
        {
          id: "az204-d1-q11",
          question:
            "A developer wants to authenticate Azure Container Apps to pull images from Azure Container Registry without storing credentials. What is the RECOMMENDED approach?",
          options: [
            "A) Enable ACR admin user and store username/password as Container Apps secrets.",
            "B) Use a managed identity on the Container App and grant it the AcrPull role on the ACR.",
            "C) Make the ACR repository public.",
            "D) Generate a service principal with AcrPull role and store its credentials in Key Vault.",
          ],
          correctIndex: 1,
          explanation:
            "A managed identity assigned to the Container App, with the `AcrPull` RBAC role on the ACR, allows credential-free image pulls using the Azure identity system. Admin user credentials (A) are long-term credentials that must be stored and rotated. Public repositories (C) eliminate authentication but expose the image. A service principal (D) works but requires credential management — managed identity is simpler and more secure.",
        },
        {
          id: "az204-d1-q12",
          question:
            "An App Service application needs to access an environment-specific secret (e.g., an API key). The secret should not be stored in the app's configuration or source code. What is the BEST approach?",
          options: [
            "A) Store the secret in `appsettings.json` and encrypt the file.",
            "B) Use an App Service Key Vault reference — configure the app setting value as `@Microsoft.KeyVault(SecretUri=...)`.",
            "C) Store the secret as a plain-text app setting in the App Service configuration.",
            "D) Hard-code the secret in the application startup code.",
          ],
          correctIndex: 1,
          explanation:
            "App Service Key Vault references allow app settings and connection strings to reference Key Vault secrets using the `@Microsoft.KeyVault(...)` syntax. The App Service fetches the secret value at runtime using its managed identity, without exposing the secret in configuration. Encrypted files (A) still require managing the encryption key. Plain-text app settings (C) are visible in the portal and CLI. Hard-coding (D) is a critical security anti-pattern.",
        },
        {
          id: "az204-d1-q13",
          question:
            "What is the purpose of WebJobs in Azure App Service?",
          options: [
            "A) WebJobs are a type of deployment slot for background processes.",
            "B) WebJobs run background tasks (scripts or programs) within an App Service web app context.",
            "C) WebJobs are serverless functions triggered by HTTP requests.",
            "D) WebJobs provide scheduled autoscaling rules for App Service plans.",
          ],
          correctIndex: 1,
          explanation:
            "WebJobs run background programs or scripts (batch files, PowerShell, Python, etc.) within the same App Service plan as a web app. They can be continuous (always running) or triggered (scheduled via cron or on-demand). For new development, Azure Functions is generally preferred over WebJobs, but WebJobs remain relevant for migrating existing applications.",
        },
        {
          id: "az204-d1-q14",
          question:
            "A developer is building a Container App with a custom scale rule based on the number of messages in an Azure Service Bus queue. Which scaling technology does Azure Container Apps use under the hood?",
          options: [
            "A) Horizontal Pod Autoscaler (HPA) based on CPU and memory only.",
            "B) KEDA (Kubernetes Event-Driven Autoscaling) with event source scalers.",
            "C) Azure Autoscale based on Azure Monitor metrics.",
            "D) Dapr sidecar process that manages scaling decisions.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Container Apps uses KEDA (Kubernetes Event-Driven Autoscaling) internally to scale based on event sources including Azure Service Bus message count, Storage Queue depth, Event Hub consumer lag, HTTP concurrency, and many more KEDA scalers. HPA (A) only supports CPU/memory. Azure Autoscale (C) is for App Service and VM Scale Sets. Dapr (D) is for service-to-service communication and pub/sub, not scaling decisions.",
        },
        {
          id: "az204-d1-q15",
          question:
            "A developer needs to implement a workflow where multiple reports are generated in parallel and then combined into a single summary. Which Durable Functions pattern should be used?",
          options: [
            "A) Function chaining — sequential execution of activities.",
            "B) Monitor pattern — polling a condition until it's met.",
            "C) Fan-out/fan-in — launch multiple activities in parallel, then aggregate results.",
            "D) Async HTTP polling — client polls for orchestration status.",
          ],
          correctIndex: 2,
          explanation:
            "Fan-out/fan-in launches multiple activity functions in parallel using `Task.WhenAll`, waits for all to complete, and then aggregates the results. This is exactly suited for generating multiple reports in parallel and combining them. Function chaining (A) runs activities sequentially. Monitor (B) polls until a condition is true. Async HTTP polling (D) is a client interaction pattern for long-running orchestrations.",
        },
      ],
    },

    // ─── Domain 2: Develop for Azure Storage (15%) ──────────────────
    {
      id: "domain-2",
      title: "Develop for Azure Storage",
      weight: "15%",
      order: 2,
      summary:
        "This domain tests your ability to interact with Azure Storage services programmatically using the Azure SDKs. Developers must know how to work with **Blob Storage** (upload, download, manage metadata, set access tiers, use leases), **Azure Cosmos DB** (CRUD operations, consistency levels, partitioning, change feed), and **Azure Cache for Redis** (caching patterns, eviction policies, connection management).\n\nKey SDK knowledge includes the `BlobServiceClient`, `BlobContainerClient`, and `BlobClient` hierarchy for Blob Storage, and the `CosmosClient` with `Database` and `Container` objects for Cosmos DB. The exam tests SDK usage in C# and Python.\n\nExpect questions on choosing the right Cosmos DB consistency level for a given scenario, understanding partition key design for scalability, and implementing cache-aside patterns with Azure Cache for Redis.",
      keyConceptsForExam: [
        "**Blob Storage SDK** — `BlobServiceClient` → `BlobContainerClient` → `BlobClient`; upload/download streams; metadata; access tiers; SAS generation",
        "**Blob leases** — acquire exclusive write lock on a blob or container; used for distributed coordination; `LeaseClient`",
        "**Azure Cosmos DB** — NoSQL, globally distributed; APIs: Core (SQL), MongoDB, Cassandra, Gremlin, Table",
        "**Cosmos DB consistency levels** — Strong → Bounded Staleness → Session → Consistent Prefix → Eventual (stronger = lower throughput)",
        "**Cosmos DB partitioning** — partition key determines data distribution; choose high-cardinality keys that distribute reads/writes evenly",
        "**Cosmos DB change feed** — ordered stream of changes to items in a container; used for event sourcing, real-time processing, and triggers",
        "**Azure Cache for Redis** — distributed in-memory cache; eviction policies (LRU, LFU, allkeys-random); connection pooling with `ConnectionMultiplexer`",
        "**Cache-aside pattern** — check cache first; on miss, fetch from database, store in cache, return; invalidate on write",
      ],
      examTips: [
        "Cosmos DB Session consistency is the most commonly recommended default — it provides read-your-own-write guarantees within a session, balancing consistency and performance.",
        "Partition key choice is critical — avoid hot partitions. A partition key with high cardinality (many distinct values) distributes load evenly. Never use a field with very few distinct values (e.g., boolean) as a partition key.",
        "Blob leases must be acquired before exclusive operations and released explicitly. If the client crashes, leases expire automatically after the configured timeout (15–60 seconds or infinite).",
        "Azure Cache for Redis `ConnectionMultiplexer` is thread-safe and should be created once and reused (static/singleton) — not created per request.",
        "Cosmos DB change feed does not capture deletes by default (unless using soft-delete pattern). It captures inserts and updates in the order they occur within a partition.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
      ],
      sections: [
        {
          heading: "Azure Blob Storage SDK",
          body: "The Azure Blob Storage SDK follows a client hierarchy: `BlobServiceClient` (account level) → `BlobContainerClient` (container level) → `BlobClient` (individual blob). Each level provides operations appropriate to that scope.\n\nAuthentication options: connection string, `StorageSharedKeyCredential`, `DefaultAzureCredential` (managed identity in production — preferred). `DefaultAzureCredential` automatically uses managed identity in Azure and developer credentials locally.\n\nKey operations:\n- `BlobClient.UploadAsync(stream)` — upload blob content\n- `BlobClient.DownloadStreamingAsync()` — download blob as stream\n- `BlobClient.SetMetadataAsync(dict)` — set custom metadata key-value pairs\n- `BlobClient.SetAccessTierAsync(AccessTier.Cool)` — change access tier\n- `BlobContainerClient.GetBlobsAsync()` — list blobs with prefix filtering",
          code: {
            lang: "csharp",
            label: "Upload a blob using managed identity (DefaultAzureCredential)",
            snippet: `using Azure.Identity;
using Azure.Storage.Blobs;

// DefaultAzureCredential uses managed identity in Azure, dev credentials locally
var credential = new DefaultAzureCredential();
var serviceClient = new BlobServiceClient(
    new Uri("https://mystorageaccount.blob.core.windows.net"),
    credential);

var containerClient = serviceClient.GetBlobContainerClient("uploads");
var blobClient = containerClient.GetBlobClient("documents/report.pdf");

await using var stream = File.OpenRead("report.pdf");
await blobClient.UploadAsync(stream, overwrite: true);

// Set metadata
var metadata = new Dictionary<string, string> { { "author", "alice" } };
await blobClient.SetMetadataAsync(metadata);`,
          },
        },
        {
          heading: "Azure Cosmos DB SDK and Partitioning",
          body: "The Cosmos DB SDK for .NET uses `CosmosClient` → `Database` → `Container` → `Item`. Always use a singleton `CosmosClient` — it manages connection pooling internally.\n\n**Partition key design** is the most important architectural decision for Cosmos DB:\n- High cardinality (many distinct values) ensures even data distribution.\n- Choose a property that appears in most queries to enable efficient partition-targeted reads.\n- Avoid hot partitions (e.g., using `userId` for a social app where celebrities have millions of items).\n- Synthetic partition keys combine multiple fields for better distribution.\n\n**Request Units (RUs)**: every operation costs RUs. Point reads (1 RU per 1KB) are cheapest. Cross-partition queries are expensive. Configure throughput at database (shared) or container (dedicated) level.\n\n**Change feed**: process changes using the Change Feed Processor (recommended) or the pull model. Enables event-driven architectures and real-time analytics.",
          code: {
            lang: "csharp",
            label: "Cosmos DB CRUD operations with SDK",
            snippet: `var client = new CosmosClient(connectionString,
    new CosmosClientOptions { ConnectionMode = ConnectionMode.Direct });

var container = client.GetContainer("myDatabase", "orders");

// Create item
var order = new Order { Id = "ord-123", CustomerId = "cust-456", Total = 99.99 };
await container.CreateItemAsync(order, new PartitionKey(order.CustomerId));

// Point read (cheapest operation — specify id + partition key)
var response = await container.ReadItemAsync<Order>(
    "ord-123", new PartitionKey("cust-456"));

// Query with partition key filter (single partition = efficient)
var query = new QueryDefinition(
    "SELECT * FROM c WHERE c.customerId = @customerId")
    .WithParameter("@customerId", "cust-456");
var iterator = container.GetItemQueryIterator<Order>(query);
while (iterator.HasMoreResults)
{
    var page = await iterator.ReadNextAsync();
    foreach (var item in page) { /* process */ }
}`,
          },
        },
        {
          heading: "Cache-Aside Pattern with Azure Cache for Redis",
          body: "The **cache-aside** (lazy loading) pattern is the most common caching strategy:\n1. Application checks the cache for the requested data.\n2. **Cache hit**: return data from cache.\n3. **Cache miss**: fetch data from the primary store (database), store it in cache with a TTL, return data.\n4. On **write**: update the database and invalidate (delete) the cache entry.\n\nThis pattern keeps the cache consistent with the database without complex synchronization. The TTL prevents stale data from persisting indefinitely.\n\n`ConnectionMultiplexer` from the StackExchange.Redis library must be created **once** (as a singleton) and reused. Creating it per request causes connection pool exhaustion and application errors.",
          code: {
            lang: "csharp",
            label: "Cache-aside pattern with Redis",
            snippet: `// Singleton ConnectionMultiplexer (registered in DI as singleton)
private readonly IDatabase _cache;
private readonly IOrderRepository _db;

public async Task<Order?> GetOrderAsync(string orderId)
{
    var cacheKey = $"order:{orderId}";

    // Check cache first
    var cached = await _cache.StringGetAsync(cacheKey);
    if (cached.HasValue)
        return JsonSerializer.Deserialize<Order>(cached!);

    // Cache miss — fetch from database
    var order = await _db.GetByIdAsync(orderId);
    if (order != null)
    {
        // Store in cache with 15-minute TTL
        await _cache.StringSetAsync(
            cacheKey,
            JsonSerializer.Serialize(order),
            TimeSpan.FromMinutes(15));
    }
    return order;
}`,
          },
        },
      ],
      quiz: [
        {
          id: "az204-d2-q1",
          question:
            "A developer needs to prevent concurrent writes to the same blob from multiple processes. Which Azure Blob Storage feature should they use?",
          options: [
            "A) Blob versioning — each write creates a new version.",
            "B) Blob leases — acquire an exclusive write lock before modifying the blob.",
            "C) Blob snapshots — create a read-only snapshot before writing.",
            "D) Conditional access tags — set an ETag condition on the write request.",
          ],
          correctIndex: 1,
          explanation:
            "Blob leases provide a distributed lock mechanism. A process acquires a lease on a blob, performs its write, and releases the lease. Other processes attempting to write without the lease ID receive an error. Versioning (A) records history but does not prevent concurrent writes. Snapshots (C) are read-only point-in-time copies. ETag conditions (D) provide optimistic concurrency (fail if modified since last read) but do not provide an exclusive lock.",
        },
        {
          id: "az204-d2-q2",
          question:
            "A developer needs to choose a Cosmos DB consistency level that guarantees reads always reflect the most recently committed writes, even across replicas. Which level should they choose?",
          options: [
            "A) Eventual consistency — highest throughput, no ordering guarantees.",
            "B) Session consistency — read-your-own-writes within a session.",
            "C) Bounded Staleness — data is at most N versions behind.",
            "D) Strong consistency — reads reflect the most recent committed write.",
          ],
          correctIndex: 3,
          explanation:
            "Strong consistency guarantees that reads always return the most recent committed write across all replicas — equivalent to a linearizable system. This comes at the cost of higher latency and lower throughput, as reads must wait for replication. Eventual (A) provides no ordering guarantee. Session (B) ensures read-your-own-writes only within a client session. Bounded Staleness (C) allows some lag.",
        },
        {
          id: "az204-d2-q3",
          question:
            "An e-commerce application uses Cosmos DB. A developer is designing the partition key for an `Orders` container. Which partition key is the BEST choice for scalability?",
          options: [
            "A) `orderStatus` — values are 'pending', 'shipped', 'delivered', 'cancelled'.",
            "B) `customerId` — each customer has a unique ID; orders are frequently queried by customer.",
            "C) `orderId` — every order has a unique ID.",
            "D) `region` — orders are grouped by geographic region (10 regions total).",
          ],
          correctIndex: 1,
          explanation:
            "`customerId` provides high cardinality (many distinct customers) and enables efficient queries filtered by customer (single-partition queries). `orderStatus` (A) has only 4 values — severe hot partitioning. `orderId` (C) has the highest cardinality but queries by customer (a common access pattern) would be cross-partition scans. `region` (D) has only 10 values — also hot partitioning risk.",
        },
        {
          id: "az204-d2-q4",
          question:
            "A developer creates a new `ConnectionMultiplexer` on every Redis cache request in an ASP.NET Core application. Users report the application crashes under load. What is the cause?",
          options: [
            "A) `ConnectionMultiplexer` does not support async operations.",
            "B) Creating a new `ConnectionMultiplexer` per request exhausts the TCP connection pool and Redis server connections.",
            "C) `ConnectionMultiplexer` is not thread-safe and must be locked before use.",
            "D) Azure Cache for Redis limits each account to 10 total connections.",
          ],
          correctIndex: 1,
          explanation:
            "`ConnectionMultiplexer` maintains a pool of TCP connections to Redis. Creating a new instance per request opens a new connection each time, quickly exhausting available ports and Redis server connection limits. It must be created once and shared (registered as a singleton in DI). It IS thread-safe (C is incorrect). Connection limits per account are much higher than 10 (D).",
        },
        {
          id: "az204-d2-q5",
          question:
            "A developer wants to list all blobs in a container that have the prefix `reports/2024/`. Which SDK method should they use?",
          options: [
            "A) `containerClient.GetBlobClient(\"reports/2024/\")`",
            "B) `containerClient.GetBlobsAsync(prefix: \"reports/2024/\")`",
            "C) `serviceClient.GetBlobContainersAsync(prefix: \"reports/2024/\")`",
            "D) `blobClient.GetPropertiesAsync()` for each blob in the container",
          ],
          correctIndex: 1,
          explanation:
            "`GetBlobsAsync(prefix: ...)` returns an `AsyncPageable<BlobItem>` listing all blobs whose names start with the specified prefix, efficiently without downloading blob content. `GetBlobClient` (A) creates a client for a specific blob path, not a list. `GetBlobContainersAsync` (C) lists containers at the account level. Getting properties for each blob (D) requires knowing blob names first.",
        },
        {
          id: "az204-d2-q6",
          question:
            "A developer needs to track all changes (inserts and updates) to items in a Cosmos DB container in real time for downstream event processing. Which feature should they use?",
          options: [
            "A) Cosmos DB Time-to-Live (TTL) events — triggered when items expire.",
            "B) Azure Event Hub — publish Cosmos DB items to an event stream.",
            "C) Cosmos DB change feed — ordered stream of changes processed by the Change Feed Processor.",
            "D) Azure Service Bus topic subscriptions — subscribe to Cosmos DB change notifications.",
          ],
          correctIndex: 2,
          explanation:
            "Cosmos DB change feed provides an ordered, persistent log of all inserts and updates within a container. The Change Feed Processor library handles distributed processing, checkpointing, and partition-level ordering automatically. It is the native, recommended solution for event-driven processing of Cosmos DB changes. TTL (A) handles item expiration, not arbitrary change tracking. Event Hub and Service Bus (B, D) are messaging services — Cosmos DB does not natively publish to them without custom code.",
        },
        {
          id: "az204-d2-q7",
          question:
            "A developer generates a SAS token for a blob container that expires in 1 hour. After 30 minutes, a security incident requires immediate revocation. What is the FASTEST approach if the SAS was NOT backed by a stored access policy?",
          options: [
            "A) Delete the SAS token from Azure Key Vault.",
            "B) Rotate the storage account key used to sign the SAS — immediately invalidating all SAS tokens signed with that key.",
            "C) Set the container access level to private.",
            "D) Update the SAS token's expiry to a past timestamp.",
          ],
          correctIndex: 1,
          explanation:
            "Ad-hoc SAS tokens are cryptographically signed with a storage account key. Rotating the signing key immediately invalidates all SAS tokens signed with it. SAS tokens are not stored in Key Vault (A) — they are computed, not stored. Setting the container to private (C) only prevents anonymous access, not SAS-authenticated access. Issued SAS tokens are immutable — their expiry cannot be updated (D).",
        },
        {
          id: "az204-d2-q8",
          question:
            "What is the most cost-efficient operation in Azure Cosmos DB?",
          options: [
            "A) Cross-partition query scanning all documents.",
            "B) Point read using both item ID and partition key.",
            "C) SQL query with no partition key filter.",
            "D) Bulk import using the bulk executor library.",
          ],
          correctIndex: 1,
          explanation:
            "A point read (`ReadItemAsync(id, partitionKey)`) is the cheapest operation — 1 RU per 1 KB of data read, regardless of collection size. It directly addresses a single item by ID and partition key. Cross-partition queries (A and C) fan out to all partitions and can consume hundreds of RUs. Bulk import (D) is efficient for throughput but each item still consumes RUs.",
        },
        {
          id: "az204-d2-q9",
          question:
            "A developer wants to use `DefaultAzureCredential` to authenticate to Azure Blob Storage. What is the PRIMARY benefit of this approach?",
          options: [
            "A) It uses the storage account access key automatically, simplifying configuration.",
            "B) It automatically selects the best available credential — managed identity in Azure, developer credentials locally — without code changes.",
            "C) It generates SAS tokens automatically for each request.",
            "D) It bypasses Entra ID authentication for faster performance.",
          ],
          correctIndex: 1,
          explanation:
            "`DefaultAzureCredential` tries a chain of credential providers: managed identity (when running in Azure), Azure CLI credentials, Visual Studio credentials, and others. This allows the same code to work both locally (using developer credentials) and in production (using managed identity) without any code changes or stored secrets. It does not use the account key (A), generate SAS tokens (C), or bypass Entra ID (D).",
        },
        {
          id: "az204-d2-q10",
          question:
            "A developer implements the cache-aside pattern. When should the application invalidate (delete) the cache entry?",
          options: [
            "A) After every read operation to ensure freshness.",
            "B) When the underlying data in the database is updated or deleted.",
            "C) After the TTL expires automatically — no explicit invalidation needed.",
            "D) Only when the application restarts.",
          ],
          correctIndex: 1,
          explanation:
            "In the cache-aside pattern, the application explicitly invalidates (deletes) the cache entry when the underlying data changes (update or delete). This ensures subsequent reads fetch fresh data from the database and repopulate the cache. Invalidating on every read (A) defeats the purpose of caching. TTL (C) provides a safety net but relying solely on TTL means stale data can persist until expiry. Restart-only invalidation (D) is too infrequent for production systems.",
        },
        {
          id: "az204-d2-q11",
          question:
            "Which Cosmos DB consistency level provides read-your-own-writes guarantees within the same client session, balancing consistency and performance for most applications?",
          options: [
            "A) Eventual — best performance, no read-your-own-writes guarantee.",
            "B) Consistent Prefix — reads never see out-of-order writes.",
            "C) Session — read-your-own-writes within a session; default and most widely recommended.",
            "D) Strong — all replicas return the latest committed write.",
          ],
          correctIndex: 2,
          explanation:
            "Session consistency is the default for Cosmos DB and the most commonly recommended level. Within a client session, reads always reflect writes from that session (read-your-own-writes). This provides a natural developer experience without the throughput penalty of Strong consistency. Eventual (A) offers no such guarantee. Consistent Prefix (B) prevents out-of-order reads but does not guarantee read-your-own-writes. Strong (D) is the highest consistency at the highest cost.",
        },
        {
          id: "az204-d2-q12",
          question:
            "A developer configures a blob's access tier programmatically after uploading. Which SDK method changes a blob from Hot to Archive tier?",
          options: [
            "A) `blobClient.SetPropertiesAsync(new BlobHttpHeaders { ContentType = \"archive\" })`",
            "B) `blobClient.SetAccessTierAsync(AccessTier.Archive)`",
            "C) `containerClient.SetAccessPolicyAsync(PublicAccessType.None)`",
            "D) `blobClient.CreateSnapshotAsync()` then delete the original.",
          ],
          correctIndex: 1,
          explanation:
            "`SetAccessTierAsync(AccessTier.Archive)` directly changes the blob's access tier to Archive. `SetPropertiesAsync` (A) sets HTTP metadata like content type, not access tier. `SetAccessPolicyAsync` (C) configures container-level public access, not blob access tier. Creating a snapshot and deleting (D) preserves data but does not change the tier and destroys the original.",
        },
        {
          id: "az204-d2-q13",
          question:
            "A developer needs to generate metadata about a blob (content type, size, last modified date) without downloading the blob content. Which SDK method should they use?",
          options: [
            "A) `blobClient.DownloadContentAsync()`",
            "B) `blobClient.GetPropertiesAsync()`",
            "C) `containerClient.GetBlobsAsync()`",
            "D) `blobClient.OpenReadAsync()`",
          ],
          correctIndex: 1,
          explanation:
            "`GetPropertiesAsync()` returns a `BlobProperties` object containing content type, content length, ETag, last modified date, metadata, and access tier — without downloading blob content (a HEAD HTTP request). `DownloadContentAsync` (A) and `OpenReadAsync` (D) download the blob content. `GetBlobsAsync` (C) lists blobs in a container with basic properties but requires iterating.",
        },
        {
          id: "az204-d2-q14",
          question:
            "Why should developers avoid using an auto-incrementing integer as a Cosmos DB partition key?",
          options: [
            "A) Cosmos DB does not support integer partition keys.",
            "B) Sequential integer values cause a hot partition — all writes go to the partition with the latest value.",
            "C) Integer partition keys prevent cross-partition queries.",
            "D) Auto-incrementing integers are not unique enough to serve as partition keys.",
          ],
          correctIndex: 1,
          explanation:
            "Sequential partition keys (like auto-incrementing integers or timestamps) create a 'hot partition' problem — all new writes go to the partition holding the current highest value, while older partitions sit idle. This defeats horizontal scaling. Cosmos DB supports integer partition keys (A is wrong). Cross-partition query behavior (C) is not affected by data type. Auto-incrementing integers are unique (D is wrong).",
        },
        {
          id: "az204-d2-q15",
          question:
            "A developer wants to store user session data in Azure Cache for Redis with an expiration of 20 minutes. Which Redis command (via the SDK) achieves this?",
          options: [
            "A) `database.StringSetAsync(key, value)` with no expiry.",
            "B) `database.StringSetAsync(key, value, TimeSpan.FromMinutes(20))`",
            "C) `database.KeyExpireAsync(key, TimeSpan.FromMinutes(20))` after setting the value.",
            "D) Both B and C are valid approaches.",
          ],
          correctIndex: 3,
          explanation:
            "Both options B and C correctly set a 20-minute expiry. `StringSetAsync` with the `expiry` parameter sets the value and TTL atomically in a single command (preferred). `KeyExpireAsync` sets the TTL on an existing key (requires two operations). Setting without expiry (A) creates a persistent key that never expires — session data would accumulate indefinitely. Both B and C are correct approaches, making D the right answer.",
        },
      ],
    },

    // ─── Domain 3: Implement Azure Security (20%) ──────────────────
    {
      id: "domain-3",
      title: "Implement Azure Security",
      weight: "20%",
      order: 3,
      summary:
        "This domain tests your ability to implement security features in Azure applications: authentication and authorization using **Microsoft Identity Platform (MSAL)**, secret management with **Azure Key Vault**, and secure application configurations. At 20% of the exam, security is deeply integrated with every other domain.\n\nKey areas include implementing OAuth 2.0 and OpenID Connect flows, acquiring tokens using MSAL, configuring **Managed Identities** for service-to-service authentication, storing and retrieving secrets and certificates from Key Vault using the Azure SDK, and configuring **App Configuration** for centralized feature flags and settings.\n\nExpect questions on understanding the Microsoft Identity Platform app registration concepts (app ID, client secret, redirect URI, scopes), the difference between delegated permissions (acting as a user) and application permissions (daemon/background), and secure patterns for accessing Key Vault from code.",
      keyConceptsForExam: [
        "**Microsoft Identity Platform** — Entra ID as the IdP; OAuth 2.0 authorization code flow for web apps; client credentials flow for daemons",
        "**MSAL (Microsoft Authentication Library)** — `PublicClientApplication` for interactive flows; `ConfidentialClientApplication` for server-side and daemon apps",
        "**Delegated vs. application permissions** — delegated: app acts on behalf of a signed-in user; application: app acts as itself (no user context)",
        "**Managed identities** — system-assigned and user-assigned; `DefaultAzureCredential` uses managed identity automatically in Azure",
        "**Azure Key Vault** — stores secrets, keys, and certificates; `SecretClient`, `KeyClient`, `CertificateClient` SDKs; access policies vs. RBAC",
        "**Key Vault references** — App Service and Azure Functions can reference Key Vault secrets as `@Microsoft.KeyVault(...)` in configuration",
        "**Azure App Configuration** — centralized configuration and feature flags; integrates with Key Vault references; push/pull model",
        "**Shared Access Signatures (SAS)** — user delegation SAS (signed with Entra ID) preferred over account-key-signed SAS",
      ],
      examTips: [
        "Know the difference between Authorization Code flow (interactive user sign-in, web apps) and Client Credentials flow (daemon apps, background services with no user). The exam tests both.",
        "MSAL token cache is in-memory by default — for web apps with multiple instances, use a distributed token cache (Redis or SQL) to avoid forcing re-authentication on every request to a different instance.",
        "Key Vault RBAC is now preferred over access policies for new implementations. `Key Vault Secrets User` role grants read access to secrets; `Key Vault Secrets Officer` grants full management.",
        "When a managed identity is used with `DefaultAzureCredential`, no credentials are stored anywhere — the `SecretClient` automatically uses the identity assigned to the compute resource.",
        "App Configuration feature flags allow gradual rollout and A/B testing without code deployments — the exam tests understanding of feature flag filters (percentage, targeting, time-window).",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
      ],
      sections: [
        {
          heading: "Microsoft Identity Platform and MSAL",
          body: "The Microsoft Identity Platform uses Entra ID as the identity provider, implementing OAuth 2.0 and OpenID Connect standards. Developers use **MSAL** (Microsoft Authentication Library) to acquire tokens.\n\n**Key OAuth 2.0 flows for the exam**:\n- **Authorization Code Flow** (with PKCE): Used by web apps and SPAs for interactive user sign-in. The user authenticates in a browser, gets an authorization code, which the app exchanges for an access token.\n- **Client Credentials Flow**: Used by daemon apps and background services that run without a user. The app authenticates with its own identity (client ID + secret or certificate).\n- **On-Behalf-Of (OBO) Flow**: A middle-tier API receives a token from the client and exchanges it for a new token to call a downstream API on behalf of the original user.\n\nTokens include an **access token** (for API calls), **ID token** (user identity claims), and **refresh token** (for token renewal without re-authentication).",
          code: {
            lang: "csharp",
            label: "MSAL client credentials flow for daemon app",
            snippet: `var app = ConfidentialClientApplicationBuilder
    .Create(clientId)
    .WithClientSecret(clientSecret)
    .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
    .Build();

// Request token for the downstream API
var result = await app.AcquireTokenForClient(
    new[] { "https://graph.microsoft.com/.default" })
    .ExecuteAsync();

// Use the access token
var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", result.AccessToken);`,
          },
        },
        {
          heading: "Azure Key Vault SDK Integration",
          body: "The Azure Key Vault SDK provides three clients for the three resource types:\n- `SecretClient` — for secrets (connection strings, API keys, passwords)\n- `KeyClient` — for cryptographic keys (RSA, EC); perform encrypt/decrypt/sign operations without key material leaving the vault\n- `CertificateClient` — for X.509 certificates with automatic renewal\n\nAuthentication follows the same `DefaultAzureCredential` pattern — in production, the managed identity of the compute resource is used automatically.\n\n**Access control**: Key Vault supports both **access policies** (vault-level, legacy) and **Azure RBAC** (fine-grained, recommended). Use RBAC for new implementations:\n- `Key Vault Secrets User` — read secrets\n- `Key Vault Secrets Officer` — create and manage secrets\n- `Key Vault Administrator` — full control",
          code: {
            lang: "csharp",
            label: "Retrieve a secret from Key Vault using managed identity",
            snippet: `using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

// DefaultAzureCredential uses managed identity in Azure
var client = new SecretClient(
    new Uri("https://mykeyvault.vault.azure.net/"),
    new DefaultAzureCredential());

// Retrieve the latest version of a secret
KeyVaultSecret secret = await client.GetSecretAsync("database-connection-string");
string connectionString = secret.Value;

// Retrieve a specific version
KeyVaultSecret specificVersion = await client.GetSecretAsync(
    "database-connection-string", "abc123version");`,
          },
        },
        {
          heading: "Managed Identities in Practice",
          body: "Managed identities eliminate credential management for service-to-service authentication. The identity's token is obtained from the **Instance Metadata Service (IMDS)** endpoint at `http://169.254.169.254/metadata/identity/oauth2/token` — automatically used by `DefaultAzureCredential`.\n\n**System-assigned**: Automatically created and deleted with the resource. One identity per resource. Suitable for resources that are the sole consumer of the identity.\n\n**User-assigned**: Created independently and assigned to one or more resources. Survives resource recreation. Suitable for sharing an identity across multiple resources (e.g., multiple App Service instances pulling from the same ACR).\n\nTo use a managed identity:\n1. Enable the identity on the resource.\n2. Grant the identity the necessary RBAC role on the target resource.\n3. Use `DefaultAzureCredential` in code — no additional configuration needed.",
        },
      ],
      quiz: [
        {
          id: "az204-d3-q1",
          question:
            "A background service (no user interaction) needs to call Microsoft Graph API using its own identity. Which OAuth 2.0 flow should the developer implement?",
          options: [
            "A) Authorization Code Flow — redirect the service to the login page.",
            "B) Client Credentials Flow — the service authenticates with client ID and secret/certificate.",
            "C) Device Code Flow — the service displays a code for a human to enter.",
            "D) Implicit Flow — the service receives a token directly from the authorization endpoint.",
          ],
          correctIndex: 1,
          explanation:
            "Client Credentials Flow is designed for daemon apps and background services that run without a user. The app authenticates with its own identity (client ID + secret or certificate) and receives an access token using application permissions. Authorization Code (A) and Device Code (C) require user interaction. Implicit Flow (D) is deprecated and designed for SPAs, not daemon services.",
        },
        {
          id: "az204-d3-q2",
          question:
            "A developer stores API keys in Azure Key Vault. An Azure Function needs to retrieve these secrets. What is the MOST secure implementation?",
          options: [
            "A) Store the Key Vault access key in the function app settings as plain text.",
            "B) Enable a managed identity on the Function app, grant it Key Vault Secrets User role, and use `SecretClient` with `DefaultAzureCredential`.",
            "C) Embed the Key Vault admin credentials in the function code.",
            "D) Share the Key Vault secret values directly as environment variables in the function app.",
          ],
          correctIndex: 1,
          explanation:
            "A managed identity with the `Key Vault Secrets User` RBAC role allows the Function to retrieve secrets using `DefaultAzureCredential` — no credentials are stored anywhere. The managed identity token is obtained automatically from the Azure environment. Options A, C, and D all involve storing sensitive credentials in insecure locations.",
        },
        {
          id: "az204-d3-q3",
          question:
            "What is the difference between delegated permissions and application permissions in Microsoft Identity Platform?",
          options: [
            "A) Delegated permissions are for APIs; application permissions are for UI components.",
            "B) Delegated permissions allow an app to act on behalf of a signed-in user; application permissions allow an app to act as itself without a user.",
            "C) Application permissions have higher security than delegated permissions.",
            "D) Delegated permissions require a paid Entra ID license; application permissions are free.",
          ],
          correctIndex: 1,
          explanation:
            "Delegated permissions (user context): the app acts on behalf of the signed-in user — the effective permissions are the intersection of the user's permissions and the app's requested permissions. Application permissions (app context): the app acts as itself with no user — used for daemon apps. Application permissions are typically more powerful and require admin consent. Neither is inherently more secure — it depends on the use case.",
        },
        {
          id: "az204-d3-q4",
          question:
            "A web app running on multiple App Service instances uses MSAL with an in-memory token cache. Users report being forced to re-authenticate frequently when requests are routed to different instances. What is the fix?",
          options: [
            "A) Enable ARR affinity (sticky sessions) on the App Service.",
            "B) Use a distributed token cache backed by Azure Cache for Redis.",
            "C) Increase the token expiry duration in MSAL configuration.",
            "D) Switch from Authorization Code flow to Implicit flow.",
          ],
          correctIndex: 1,
          explanation:
            "An in-memory MSAL token cache is local to each App Service instance. When a request routes to a different instance, it has no cached token and forces re-authentication. A distributed token cache (Redis, SQL) is shared across all instances, so any instance can find the cached token. ARR affinity (A) creates sticky sessions but hurts scalability and is not the recommended solution. Token expiry (C) and Implicit flow (D) do not address the distributed cache problem.",
        },
        {
          id: "az204-d3-q5",
          question:
            "An App Service app needs to reference a secret stored in Key Vault without writing any code to retrieve it. How can this be configured?",
          options: [
            "A) Copy the secret value and paste it into the App Service application settings.",
            "B) Use an App Service Key Vault reference: set the app setting value to `@Microsoft.KeyVault(SecretUri=https://vault.azure.net/secrets/mySecret/)`.",
            "C) Mount the Key Vault as a file share in the App Service container.",
            "D) Use App Configuration linked to Key Vault and manually sync values daily.",
          ],
          correctIndex: 1,
          explanation:
            "App Service Key Vault references allow configuration settings to point directly to Key Vault secrets using the `@Microsoft.KeyVault(...)` syntax. App Service automatically resolves the reference using its managed identity and presents the secret value as an environment variable. No code changes are needed. Copying the secret value (A) creates a stale copy when the secret is rotated. Key Vault file mounts (C) are not supported. Manual sync (D) is error-prone and not real-time.",
        },
        {
          id: "az204-d3-q6",
          question:
            "A developer registers an Entra ID application. What is the purpose of the redirect URI in the app registration?",
          options: [
            "A) It specifies the URL where the API being called is hosted.",
            "B) It is the URL where Entra ID sends the authorization code after successful user authentication.",
            "C) It defines the endpoint that issues access tokens for the application.",
            "D) It configures the logout URL that clears the user session.",
          ],
          correctIndex: 1,
          explanation:
            "After a user authenticates successfully, Entra ID redirects the browser to the registered redirect URI with the authorization code (in Authorization Code Flow) or access token (in Implicit Flow). The redirect URI must be pre-registered to prevent authorization code interception attacks. It is not the API endpoint (A), the token issuer (C), or a logout URL (D — logout URL is a separate registration field).",
        },
        {
          id: "az204-d3-q7",
          question:
            "Which Key Vault RBAC role should be assigned to a managed identity that only needs to read existing secrets (not create or delete them)?",
          options: [
            "A) Key Vault Administrator — full control over the vault.",
            "B) Key Vault Secrets Officer — create, update, and delete secrets.",
            "C) Key Vault Secrets User — read and list secrets only.",
            "D) Contributor — general Azure resource management access.",
          ],
          correctIndex: 2,
          explanation:
            "`Key Vault Secrets User` grants the minimum permissions needed to get and list secret values — following the principle of least privilege. `Key Vault Administrator` (A) and `Secrets Officer` (B) grant more permissions than required. The Azure `Contributor` role (D) manages Azure resources (like creating/deleting the Key Vault itself) but does not grant access to secrets inside the vault.",
        },
        {
          id: "az204-d3-q8",
          question:
            "A developer needs to perform cryptographic signing operations using a key stored in Azure Key Vault, without the key material ever leaving the vault. Which Key Vault SDK client should they use?",
          options: [
            "A) `SecretClient` — retrieve the key as a secret and sign locally.",
            "B) `CertificateClient` — use the certificate's private key for signing.",
            "C) `KeyClient` — perform sign/verify operations within Key Vault using the stored key.",
            "D) `BlobClient` — store the key material in encrypted blob storage.",
          ],
          correctIndex: 2,
          explanation:
            "`KeyClient` provides cryptographic operations (sign, verify, encrypt, decrypt, wrap, unwrap) that execute within Key Vault's HSM — the key material never leaves the vault. `SecretClient` (A) retrieves values, and retrieving a private key as a secret defeats the purpose of HSM protection. `CertificateClient` (B) manages certificates, not arbitrary cryptographic keys. `BlobClient` (D) is for blob storage, not cryptography.",
        },
        {
          id: "az204-d3-q9",
          question:
            "An organization uses Azure App Configuration for centralized feature flags. A new feature should be enabled for only 10% of users initially. Which App Configuration feature flag filter type should be used?",
          options: [
            "A) Time window filter — enable the feature during specific hours.",
            "B) Targeting filter — enable for specific users or groups with percentage rollout.",
            "C) Custom filter — write a custom implementation to randomly allow 10% of users.",
            "D) Percentage filter — randomly enable for 10% of all requests.",
          ],
          correctIndex: 3,
          explanation:
            "The percentage filter (also called 'Microsoft.Percentage' filter) enables a feature flag for a random percentage of requests/users — exactly suited for a 10% canary rollout. The targeting filter (B) enables for specific named users or groups with optional percentage rollout for others, which is more complex than needed here. Time window (A) is for scheduled enabling. Custom filter (C) requires writing code. The percentage filter is the simplest built-in solution.",
        },
        {
          id: "az204-d3-q10",
          question:
            "A developer uses `DefaultAzureCredential` to authenticate to Azure services. In which order does `DefaultAzureCredential` try credential sources?",
          options: [
            "A) Storage account key → Service principal → Managed identity.",
            "B) Environment variables → Workload identity → Managed identity → Azure CLI → Visual Studio → other developer credentials.",
            "C) Managed identity → Azure CLI → connection string → service principal.",
            "D) Azure Key Vault → App Configuration → environment variables → managed identity.",
          ],
          correctIndex: 1,
          explanation:
            "`DefaultAzureCredential` tries credential sources in a defined order: environment variables (service principal credentials), workload identity (Kubernetes), managed identity (IMDS), Azure CLI, Azure PowerShell, Visual Studio, VS Code, and others. In Azure production environments, managed identity is typically the successful credential. On developer machines, Azure CLI or Visual Studio credentials are used. This chain allows the same code to work in both environments.",
        },
        {
          id: "az204-d3-q11",
          question:
            "A developer accidentally commits a Key Vault secret value to a public GitHub repository. What should they do IMMEDIATELY?",
          options: [
            "A) Delete the GitHub repository.",
            "B) Rotate (regenerate) the secret in Key Vault and update all applications using the old value.",
            "C) Make the GitHub repository private.",
            "D) Delete the commit from git history.",
          ],
          correctIndex: 1,
          explanation:
            "Rotating the secret immediately invalidates the compromised value and generates a new one. Applications must be updated to use the new secret (or use Key Vault references that automatically pick up new versions). Making the repository private (C) or deleting history (D) does not invalidate the already-exposed secret — assume the value has been captured. Deleting the repo (A) also does not help if the secret was already scraped.",
        },
        {
          id: "az204-d3-q12",
          question:
            "What is the purpose of the `/.default` scope in an MSAL client credentials token request?",
          options: [
            "A) It requests all permissions that the signed-in user has.",
            "B) It requests all application permissions pre-configured in the Entra ID app registration.",
            "C) It grants admin consent for all delegated permissions automatically.",
            "D) It specifies that the token should use the default expiry duration.",
          ],
          correctIndex: 1,
          explanation:
            "When using the client credentials flow, the `/.default` scope tells Entra ID to issue a token for all application permissions that have been configured and consented to in the app registration. It is not user-specific (A). Admin consent must be granted separately (C). Token expiry is not controlled by the scope value (D).",
        },
        {
          id: "az204-d3-q13",
          question:
            "A developer needs the same user-assigned managed identity to pull images from ACR and read secrets from Key Vault. How should this be configured?",
          options: [
            "A) Create two separate system-assigned identities — one for ACR and one for Key Vault.",
            "B) Create one user-assigned managed identity, assign it to the compute resource, and grant it `AcrPull` on ACR and `Key Vault Secrets User` on Key Vault.",
            "C) Use a service principal with client secret and grant it permissions on both services.",
            "D) Enable admin user on ACR and store credentials alongside the Key Vault admin password in app settings.",
          ],
          correctIndex: 1,
          explanation:
            "A user-assigned managed identity can be granted multiple RBAC roles on multiple resources. Creating one identity and assigning the necessary roles on both ACR and Key Vault is the correct, scalable approach. Two system-assigned identities (A) would require separate identity configuration per resource and cannot be shared. A service principal (C) requires credential management. Storing credentials (D) is a security anti-pattern.",
        },
        {
          id: "az204-d3-q14",
          question:
            "Which Azure service centralizes application settings and feature flags, supports Key Vault references, and enables dynamic configuration without redeploying the application?",
          options: [
            "A) Azure Key Vault — stores secrets and certificates.",
            "B) Azure App Configuration — centralized configuration store with feature management.",
            "C) Azure App Service application settings — per-app environment variables.",
            "D) Azure Storage — store configuration files in Blob Storage.",
          ],
          correctIndex: 1,
          explanation:
            "Azure App Configuration provides a centralized store for application settings and feature flags, supports Key Vault references for secrets, and can push configuration changes to applications dynamically via SDK refresh polling. Apps can pick up config changes without redeployment. Key Vault (A) stores secrets but is not a general configuration store. App Service settings (C) are per-app and require a restart or slot swap to change. Blob Storage (D) requires custom code to read and refresh configuration.",
        },
        {
          id: "az204-d3-q15",
          question:
            "A developer wants to verify that a JWT access token returned by Entra ID is valid before processing a request. Which validation steps are required?",
          options: [
            "A) Decode the JWT and check that the `iss` claim matches the expected issuer.",
            "B) Validate the signature using the Entra ID JWKS endpoint, check expiry (`exp`), issuer (`iss`), audience (`aud`), and any required claims.",
            "C) Send the token to Entra ID's token introspection endpoint for real-time validation.",
            "D) Verify the token length is within expected bounds.",
          ],
          correctIndex: 1,
          explanation:
            "Complete JWT validation requires: (1) verifying the signature using Entra ID's public keys from the JWKS endpoint (`https://login.microsoftonline.com/{tenant}/discovery/keys`), (2) checking expiry (`exp`), (3) verifying the issuer (`iss`) matches your tenant, and (4) verifying the audience (`aud`) matches your app's client ID. Checking only the `iss` claim (A) is insufficient without signature verification. Token introspection (C) is not a standard Entra ID feature. Token length (D) is meaningless for security validation.",
        },
      ],
    },

    // ─── Domain 4: Monitor, Troubleshoot, and Optimize Solutions (15%) ─
    {
      id: "domain-4",
      title: "Monitor, Troubleshoot, and Optimize Solutions",
      weight: "15%",
      order: 4,
      summary:
        "This domain covers implementing observability in Azure applications using **Application Insights**, configuring logging and distributed tracing, and optimizing application performance through caching and CDN strategies. It also tests knowledge of Azure Content Delivery Network (Azure CDN) for static asset optimization.\n\nKey areas include instrumenting applications with the Application Insights SDK, understanding the telemetry data model (requests, dependencies, exceptions, traces, custom events, metrics), configuring **Log Analytics** integration, setting up **availability tests**, and using **Application Map** for distributed system visualization.\n\nExpect questions on implementing custom metrics and events, configuring sampling to reduce telemetry volume, using the Snapshot Debugger for production exception analysis, and understanding when to apply output caching, Redis caching, and CDN caching.",
      keyConceptsForExam: [
        "**Application Insights** — cloud-native APM; auto-instrumentation vs. SDK instrumentation; connection string authentication",
        "**Telemetry types** — requests (HTTP), dependencies (SQL, HTTP, Redis), exceptions, traces (logs), page views, custom events, custom metrics",
        "**Distributed tracing** — `operation_Id` correlates telemetry across services; W3C Trace Context propagation",
        "**Sampling** — adaptive (auto-adjusts rate), fixed-rate, ingestion sampling — reduces data volume while preserving statistical accuracy",
        "**Availability tests** — URL ping test, standard test, multi-step web test; alert on failure count or response time",
        "**Application Map** — visualizes component dependencies and failure rates in distributed systems",
        "**Azure CDN** — caching static content at edge nodes; cache rules; purging; custom domains; compression",
        "**Output caching** — server-side HTTP response caching; `[OutputCache]` attribute or middleware in ASP.NET Core",
      ],
      examTips: [
        "Application Insights now uses **connection strings** rather than instrumentation keys (still supported but deprecated). The connection string includes the endpoint for data ingestion.",
        "Adaptive sampling is enabled by default in Application Insights SDKs for high-volume scenarios. It preserves statistical accuracy by keeping a representative sample of telemetry.",
        "The Application Map automatically discovers dependencies from collected dependency telemetry — you do not need to configure it manually.",
        "CDN caching is controlled by `Cache-Control` headers from the origin server. Setting `Cache-Control: max-age=3600` allows CDN to cache for 1 hour. Override with CDN caching rules.",
        "For the exam, distinguish between client-side caching (browser), CDN caching (edge), server-side output caching, and distributed caching (Redis) — each has different use cases and invalidation mechanisms.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
      ],
      sections: [
        {
          heading: "Application Insights Instrumentation",
          body: "Application Insights provides automatic instrumentation for many frameworks (ASP.NET Core, Node.js, Java, Python) and a code-level SDK for custom telemetry.\n\n**Auto-instrumentation** (via Azure portal or agent) captures:\n- Incoming HTTP requests and response times\n- Outgoing dependency calls (SQL, HTTP, Redis, Azure Service Bus, etc.)\n- Unhandled exceptions with stack traces\n\n**SDK instrumentation** allows:\n- `TelemetryClient.TrackEvent()` — custom business events\n- `TelemetryClient.TrackMetric()` — custom numeric measurements\n- `TelemetryClient.TrackException()` — handled exception logging\n- `TelemetryClient.TrackTrace()` — diagnostic messages\n\nAll telemetry is correlated using an **operation ID** that propagates across service boundaries via HTTP headers (W3C Trace Context: `traceparent`).",
          code: {
            lang: "csharp",
            label: "Application Insights custom telemetry with SDK",
            snippet: `using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;

public class OrderService
{
    private readonly TelemetryClient _telemetry;

    public OrderService(TelemetryClient telemetry) => _telemetry = telemetry;

    public async Task<Order> CreateOrderAsync(OrderRequest request)
    {
        // Track a custom event
        _telemetry.TrackEvent("OrderCreated",
            new Dictionary<string, string> { { "customerId", request.CustomerId } },
            new Dictionary<string, double> { { "orderTotal", request.Total } });

        // Track a custom metric
        _telemetry.TrackMetric("OrderValue", request.Total);

        try
        {
            return await _orderRepository.CreateAsync(request);
        }
        catch (Exception ex)
        {
            // Track handled exception with context
            _telemetry.TrackException(ex,
                new Dictionary<string, string> { { "orderId", request.Id } });
            throw;
        }
    }
}`,
          },
        },
        {
          heading: "Sampling and Data Volume Management",
          body: "At high traffic volumes, Application Insights telemetry costs can be significant. **Sampling** reduces data volume while preserving statistical accuracy for analysis.\n\nThree sampling types:\n- **Adaptive sampling** (default in ASP.NET Core SDK): Automatically adjusts the sampling rate to stay within a configured telemetry volume. Preserves 100% of exceptions.\n- **Fixed-rate sampling**: Developer configures a fixed percentage (e.g., 10% — send 1 in 10 requests). Both client and server must be configured with the same rate to ensure correlated telemetry is preserved together.\n- **Ingestion sampling**: Applied at the Application Insights endpoint after telemetry arrives — discards data before indexing. Does not reduce SDK overhead but reduces storage/cost.\n\nSampling is telemetry-item-aware: all telemetry for a given request (request, dependencies, exceptions, traces) is either kept or dropped together, preserving full traces.",
        },
        {
          heading: "Azure CDN for Performance Optimization",
          body: "Azure CDN caches static content (images, CSS, JavaScript, videos) at globally distributed **Points of Presence (PoPs)** close to users, reducing latency and origin server load.\n\n**Caching behavior** is controlled by:\n- `Cache-Control` headers from the origin (e.g., `max-age=3600`)\n- CDN caching rules that can override origin headers\n- Query string caching behavior (ignore, include, bypass)\n\n**Cache purge**: Immediately remove cached content from all PoPs or specific paths. Use when content is updated before TTL expires.\n\n**Compression**: Azure CDN can compress text-based responses (HTML, CSS, JS) at the edge, reducing transfer size. Enable in CDN profile settings.\n\nFor dynamic content that cannot be cached, CDN provides **origin acceleration** (TCP optimization, connection reuse, pre-fetching) via Azure Front Door Premium.",
          code: {
            lang: "bash",
            label: "Purge CDN cached content after a deployment",
            snippet: `# Purge specific paths from CDN
az cdn endpoint purge \\
  --resource-group myResourceGroup \\
  --profile-name myCDNProfile \\
  --name myEndpoint \\
  --content-paths "/assets/app.js" "/assets/app.css" "/index.html"

# Purge all content (wildcard)
az cdn endpoint purge \\
  --resource-group myResourceGroup \\
  --profile-name myCDNProfile \\
  --name myEndpoint \\
  --content-paths "/*"`,
          },
        },
      ],
      quiz: [
        {
          id: "az204-d4-q1",
          question:
            "A developer wants to track the number of completed orders per minute as a custom metric in Application Insights. Which telemetry method should they use?",
          options: [
            "A) `TrackEvent(\"OrderCompleted\")` — log a discrete event per order.",
            "B) `TrackMetric(\"CompletedOrdersPerMinute\", value)` — log a numeric measurement.",
            "C) `TrackTrace(\"Order completed\", SeverityLevel.Information)` — log a diagnostic message.",
            "D) `TrackDependency(\"OrderDB\", \"Complete\", ...)` — track the database call for completion.",
          ],
          correctIndex: 1,
          explanation:
            "`TrackMetric` is specifically designed for numeric measurements like counts, rates, and durations. Charting and aggregating metrics over time is its primary use case. `TrackEvent` (A) is for discrete business events with custom properties — not suited for numeric aggregation. `TrackTrace` (C) is for log messages. `TrackDependency` (D) tracks outgoing dependency calls (e.g., a database query), not business metrics.",
        },
        {
          id: "az204-d4-q2",
          question:
            "An application uses Application Insights. Users report errors in production but the stack trace shows minified JavaScript filenames. Which Application Insights feature helps debug original source code from minified bundles?",
          options: [
            "A) Snapshot Debugger — captures a memory snapshot at the point of an exception.",
            "B) Source map upload — upload `.map` files so Application Insights de-minifies stack traces.",
            "C) Live Metrics — real-time telemetry stream from the running application.",
            "D) Application Map — visualizes component dependencies.",
          ],
          correctIndex: 1,
          explanation:
            "JavaScript source map files (`.map`) contain mappings from minified code positions back to original source code. Uploading source maps to Application Insights allows the portal to display readable stack traces with original file names and line numbers. Snapshot Debugger (A) captures server-side .NET exceptions. Live Metrics (C) shows real-time data but not de-minified stacks. Application Map (D) shows service topology.",
        },
        {
          id: "az204-d4-q3",
          question:
            "Application Insights is generating too much telemetry data, increasing costs. The team wants to reduce volume but still maintain statistical accuracy for request rate and failure rate analysis. What should they configure?",
          options: [
            "A) Disable Application Insights during peak hours.",
            "B) Enable adaptive sampling — it automatically adjusts the sampling rate while preserving statistical accuracy.",
            "C) Increase the Log Analytics workspace retention to compress old data.",
            "D) Filter out all dependency telemetry.",
          ],
          correctIndex: 1,
          explanation:
            "Adaptive sampling automatically adjusts the sampling percentage to keep telemetry within a target volume while preserving statistical accuracy for metrics like request rate and failure rate. Complete telemetry chains (request + dependencies + traces) are kept or dropped together. Disabling Application Insights (A) loses observability entirely. Retention (C) controls how long data is kept, not how much is collected. Filtering dependencies (D) blinds you to downstream performance issues.",
        },
        {
          id: "az204-d4-q4",
          question:
            "A team has an ASP.NET Core app and a Node.js backend. They want to trace a request as it flows through both services in Application Insights. What mechanism propagates the correlation context?",
          options: [
            "A) A shared Application Insights instrumentation key in both services.",
            "B) W3C Trace Context headers (`traceparent`, `tracestate`) propagated in HTTP requests between services.",
            "C) A shared Redis cache used by both services to store trace IDs.",
            "D) Azure Service Bus message properties containing the operation ID.",
          ],
          correctIndex: 1,
          explanation:
            "Application Insights uses W3C Trace Context standard headers (`traceparent` and `tracestate`) to propagate correlation context across service boundaries. When the ASP.NET Core app calls the Node.js backend, it includes these headers, and the receiving service associates its telemetry with the same operation ID. The instrumentation key/connection string (A) identifies where telemetry is sent, not how traces are correlated. Redis (C) and Service Bus properties (D) are not used for HTTP trace propagation.",
        },
        {
          id: "az204-d4-q5",
          question:
            "A developer wants to set up an alert that fires when the availability test for a web app endpoint fails from 2 or more locations simultaneously. Which Application Insights feature should they configure?",
          options: [
            "A) Custom event alert on the `AvailabilityTestFailed` event.",
            "B) Availability test with an alert rule configured for failures from 2+ locations.",
            "C) Azure Monitor metric alert on HTTP response codes from the App Service.",
            "D) Log search alert querying the `requests` table for failed requests.",
          ],
          correctIndex: 1,
          explanation:
            "Application Insights availability tests run synthetic requests from multiple global probe locations. The associated alert rule can be configured to fire when failures occur at a specified number of locations (e.g., 2+), distinguishing widespread outages from location-specific probing issues. Custom event alerts (A) are not designed for availability test results. App Service metric alerts (C) monitor server-side metrics, not external endpoint availability. Log search alerts (D) can work but are less direct than the built-in availability alert.",
        },
        {
          id: "az204-d4-q6",
          question:
            "What should a developer set in the HTTP response to instruct Azure CDN to cache a response for 2 hours?",
          options: [
            "A) `X-Cache: max-age=7200` response header.",
            "B) `Cache-Control: max-age=7200` response header.",
            "C) `Expires: 2 hours` response header.",
            "D) A CDN rule must be configured — HTTP headers cannot control CDN caching.",
          ],
          correctIndex: 1,
          explanation:
            "`Cache-Control: max-age=7200` (7200 seconds = 2 hours) is the standard HTTP mechanism for controlling cache duration. Azure CDN respects this header from the origin server to determine TTL. `X-Cache` (A) is a response header CDN returns to the client indicating cache status, not a caching instruction. The `Expires` header (C) uses an absolute date/time, not a relative duration like `2 hours`. CDN rules (D) can override or supplement header-based caching, but headers do control caching.",
        },
        {
          id: "az204-d4-q7",
          question:
            "After deploying a new version of static assets to Azure Blob Storage (served via Azure CDN), users still see the old version. What should the administrator do?",
          options: [
            "A) Wait for all CDN TTLs to expire naturally.",
            "B) Purge the CDN cache for the affected paths to force CDN to fetch fresh content from origin.",
            "C) Restart the Azure CDN profile.",
            "D) Change the CDN endpoint hostname.",
          ],
          correctIndex: 1,
          explanation:
            "CDN purge immediately removes cached content from all PoPs (or specified paths), forcing the CDN to fetch fresh content from the origin on the next request. Waiting for TTL (A) works but can take hours depending on the cache duration. CDN profiles cannot be restarted (C). Changing the endpoint hostname (D) would break existing URLs and is not a cache management technique.",
        },
        {
          id: "az204-d4-q8",
          question:
            "What is the main advantage of Application Insights Snapshot Debugger for production debugging?",
          options: [
            "A) It records all HTTP requests and responses for replay.",
            "B) It automatically captures a memory snapshot (including local variables and call stack) at the point where an exception occurs in production.",
            "C) It enables step-through debugging of production code via Visual Studio.",
            "D) It compares production code to the last known good deployment.",
          ],
          correctIndex: 1,
          explanation:
            "Snapshot Debugger captures a memory dump at the moment an exception is thrown in production, preserving local variable values and the full call stack. Developers can inspect this snapshot in Visual Studio or the Azure portal to diagnose the root cause without reproducing the bug locally. It does not record HTTP traffic (A), support live step-through debugging (C — that would halt production), or compare deployments (D).",
        },
        {
          id: "az204-d4-q9",
          question:
            "An API application calls a SQL database and an external REST service. On the Application Map, the SQL database shows a high failure rate. What does this indicate?",
          options: [
            "A) The Application Map is displaying a false positive from misconfigured telemetry.",
            "B) Dependency telemetry for SQL calls is recording failures — likely connection errors, timeouts, or query errors.",
            "C) The SQL database is in a different resource group, causing permission issues in Application Insights.",
            "D) The Application Map only shows HTTP dependencies; SQL data is not accurate.",
          ],
          correctIndex: 1,
          explanation:
            "The Application Map derives its data from dependency telemetry automatically collected by Application Insights (or the SDK). A high failure rate on the SQL dependency node indicates that SQL calls from the API are failing — this could be connection timeouts, deadlocks, constraint violations, or authentication errors. The Application Map supports SQL, HTTP, and other dependency types (D is incorrect). Resource group placement (C) does not affect telemetry accuracy.",
        },
        {
          id: "az204-d4-q10",
          question:
            "A developer wants to configure Application Insights to only sample 25% of successful requests while keeping 100% of exceptions and failed requests. Which sampling approach supports this configuration?",
          options: [
            "A) Adaptive sampling — configure minimum and maximum sampling percentages.",
            "B) Fixed-rate sampling at 25% — all telemetry types are sampled at the same rate.",
            "C) Ingestion sampling — applied after telemetry arrives, cannot differentiate by success/failure.",
            "D) Custom telemetry processor — filter successful requests at a 75% drop rate while keeping all exceptions.",
          ],
          correctIndex: 3,
          explanation:
            "A custom `ITelemetryProcessor` in the Application Insights pipeline can implement any sampling logic, including differentially sampling successful vs. failed requests. Adaptive (A) adjusts rate automatically but does not guarantee 100% exception capture (though in practice it tries to). Fixed-rate (B) applies uniformly to all telemetry types. Ingestion sampling (C) is applied at the data ingestion endpoint and cannot be customized by telemetry type.",
        },
        {
          id: "az204-d4-q11",
          question:
            "Which KQL query in Log Analytics identifies the top 5 most frequently failing dependencies in the last 24 hours?",
          options: [
            "A) `requests | where success == false | top 5 by itemCount`",
            "B) `dependencies | where success == false | where timestamp > ago(24h) | summarize FailureCount=count() by name | top 5 by FailureCount`",
            "C) `exceptions | where timestamp > ago(24h) | top 5 by outerMessage`",
            "D) `traces | where severityLevel == 3 | top 5 by message`",
          ],
          correctIndex: 1,
          explanation:
            "The `dependencies` table contains dependency call telemetry. Filtering by `success == false` and `timestamp > ago(24h)`, then summarizing by dependency name and ordering by count gives the top 5 failing dependencies. The `requests` table (A) captures incoming HTTP requests, not outgoing dependencies. The `exceptions` table (C) captures thrown exceptions. The `traces` table (D) captures log messages.",
        },
        {
          id: "az204-d4-q12",
          question:
            "What is the difference between Live Metrics and Application Insights standard telemetry?",
          options: [
            "A) Live Metrics shows data from the last 24 hours; standard telemetry only shows weekly averages.",
            "B) Live Metrics streams telemetry in near-real time (< 1 second delay) for immediate monitoring; standard telemetry is buffered and indexed (typically 2–5 minute delay).",
            "C) Live Metrics is available only during application debugging; standard telemetry is always on.",
            "D) Live Metrics is billed separately at a higher rate than standard telemetry.",
          ],
          correctIndex: 1,
          explanation:
            "Live Metrics (formerly Quick Pulse) streams telemetry in near real-time directly from the SDK to the Application Insights portal with under 1 second latency, ideal for monitoring deployments or incidents. Standard telemetry is buffered, compressed, and sent in batches — typically appearing in the portal within 2–5 minutes. Live Metrics data is not retained in the Log Analytics workspace (it is streaming only). Both are available whenever the app is running (C is wrong).",
        },
        {
          id: "az204-d4-q13",
          question:
            "A static web app served from Azure Blob Storage via Azure CDN has a 1-hour cache TTL. The team deploys a new version and wants users to get fresh content immediately without changing the CDN TTL. What technique achieves this without waiting for TTL expiry?",
          options: [
            "A) Update the DNS TTL to 0 seconds for immediate propagation.",
            "B) Append a version query string or hash to asset URLs (cache busting) and purge the CDN.",
            "C) Reduce the CDN cache TTL to 1 minute for all assets.",
            "D) Enable CDN real-time logging to invalidate cache entries automatically.",
          ],
          correctIndex: 1,
          explanation:
            "Cache busting changes the asset URL on each deployment (e.g., `app.v2.js` or `app.js?v=abc123`). Since the URL is different, CDN treats it as a new uncached resource and fetches from origin. Combined with a CDN purge of old URLs, this immediately serves fresh content. DNS TTL (A) affects name resolution, not CDN content caching. Reducing TTL (C) affects future deployments but not the current stale cache. CDN logging (D) does not invalidate cache entries.",
        },
        {
          id: "az204-d4-q14",
          question:
            "An Azure Function processes messages from a Service Bus queue. The team wants to see the full end-to-end trace in Application Insights when a web app publishes a message and the function processes it. What ensures the correlation context is propagated?",
          options: [
            "A) Both services must use the same Application Insights instrumentation key.",
            "B) Application Insights SDK on the sender injects correlation headers into the Service Bus message properties; the Function's Application Insights SDK reads these properties to associate telemetry.",
            "C) A shared Azure Monitor workspace collects logs from both services and correlates by timestamp.",
            "D) The developer must manually set the `operation_Id` in both the sender and receiver code.",
          ],
          correctIndex: 1,
          explanation:
            "Application Insights SDKs automatically inject correlation properties (Diagnostic-Id / traceparent) into Service Bus message properties when sending, and read them when receiving. This propagates the operation ID across the queue boundary, enabling end-to-end trace visualization in Application Insights. Using the same instrumentation key/connection string (A) routes telemetry to the same workspace but does not itself correlate the traces. Timestamp-based correlation (C) is imprecise. Manual correlation (D) is not needed when using the SDK.",
        },
        {
          id: "az204-d4-q15",
          question:
            "What is the purpose of the Application Insights `operation_Id` property?",
          options: [
            "A) It identifies the Azure subscription where the telemetry originated.",
            "B) It is a unique identifier that correlates all telemetry (requests, dependencies, traces, exceptions) from a single end-to-end operation across multiple services.",
            "C) It is the Azure resource ID of the Application Insights component.",
            "D) It tracks the number of operations performed by a single user session.",
          ],
          correctIndex: 1,
          explanation:
            "`operation_Id` (also called the trace ID in W3C Trace Context) is a unique identifier generated for each top-level operation (typically an incoming HTTP request). All telemetry emitted during that operation — including dependency calls to downstream services, traces, and exceptions — carries the same `operation_Id`. This allows Application Insights to stitch together the complete end-to-end trace across service boundaries in the Transaction Search and Application Map views.",
        },
      ],
    },

    // ─── Domain 5: Connect to and Consume Azure Services (25%) ──────
    {
      id: "domain-5",
      title: "Connect to and Consume Azure Services",
      weight: "25%",
      order: 5,
      summary:
        "This domain ties with Domain 1 as the heaviest at 25% and tests your ability to integrate Azure services using messaging, eventing, and API management. Developers must know how to use **Azure Service Bus**, **Azure Event Hub**, **Azure Event Grid**, and **Azure API Management (APIM)** programmatically.\n\nKey differences to master: **Service Bus** (reliable messaging, ordering, dead-lettering, sessions) vs. **Event Hub** (high-throughput event streaming, partitioned, checkpoint-based consumer groups) vs. **Event Grid** (reactive eventing, push-based, routing events from Azure services to handlers).\n\nExpect questions on APIM policies (inbound, backend, outbound, on-error), custom domain configuration, API versioning strategies, and implementing webhook event handlers for Event Grid. Azure Logic Apps and Power Automate integration scenarios also appear in this domain.",
      keyConceptsForExam: [
        "**Azure Service Bus** — queues (point-to-point), topics (publish-subscribe); dead-letter queue (DLQ); message sessions for ordering; peek-lock vs. receive-and-delete",
        "**Azure Event Hub** — partitioned event streaming; consumer groups; checkpointing; Event Hub Capture to ADLS/Blob; Kafka-compatible endpoint",
        "**Azure Event Grid** — event routing; built-in Azure source publishers (Blob Storage, Resource Manager, IoT Hub); push delivery to event handlers (Functions, Logic Apps, webhooks)",
        "**APIM policies** — `inbound` (validate, transform, rate-limit, authenticate), `backend` (routing), `outbound` (transform response), `on-error` (error handling)",
        "**APIM products and subscriptions** — group APIs; require subscription keys; manage access tiers",
        "**APIM versioning** — path-based (`/v1/`, `/v2/`), header-based, query string-based; revisions for non-breaking changes",
        "**Webhook validation** — Event Grid sends a validation event (`SubscriptionValidationEvent`) that the handler must echo back",
        "**Azure Logic Apps** — low-code workflow automation; connectors to 400+ services; Standard (single-tenant) vs. Consumption (multi-tenant)",
      ],
      examTips: [
        "Service Bus **peek-lock** mode: messages are locked for processing; if the consumer fails, the lock expires and another consumer can process the message. **Receive-and-delete** mode: message is immediately deleted when received — no retry if processing fails.",
        "Service Bus **sessions** enable ordered processing of related messages — all messages with the same session ID are processed by the same consumer in order. Required for FIFO guarantees.",
        "Event Grid webhooks must complete the validation handshake (echo the `validationCode` or acknowledge via a `validationUrl`) before events are delivered.",
        "APIM `rate-limit-by-key` policy applies per-caller rate limiting. `quota-by-key` applies longer-period usage quotas. Both are critical for API monetization and abuse prevention.",
        "Event Hub consumer groups allow multiple independent consumers to read the same event stream at their own pace. Each group maintains its own checkpoint/offset.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
      ],
      sections: [
        {
          heading: "Azure Service Bus — Reliable Messaging Patterns",
          body: "Azure Service Bus provides enterprise messaging with **queues** (point-to-point) and **topics with subscriptions** (publish-subscribe). Key features:\n\n**Peek-lock mode** (recommended): Consumer receives a message and it becomes invisible to others. Consumer processes it and completes (deletes) or abandons it. If the lock expires before completion, the message becomes visible again for retry. After exceeding the maximum delivery count (default 10), the message moves to the **Dead-Letter Queue (DLQ)**.\n\n**Message sessions**: Messages with the same `SessionId` are processed by a single session-aware consumer in FIFO order. Required for ordered processing of correlated messages (e.g., all events for a specific order).\n\n**Topics and subscriptions** enable pub/sub: publishers send to a topic; multiple subscriptions each receive a copy, filtered by subscription rules.",
          code: {
            lang: "csharp",
            label: "Send and receive Service Bus messages with peek-lock",
            snippet: `// Send a message
await using var sender = serviceBusClient.CreateSender("my-queue");
await sender.SendMessageAsync(new ServiceBusMessage("Hello, Service Bus!") {
    SessionId = "order-123",
    MessageId = Guid.NewGuid().ToString()
});

// Receive with peek-lock (default)
await using var receiver = serviceBusClient.CreateReceiver("my-queue");
var message = await receiver.ReceiveMessageAsync(maxWaitTime: TimeSpan.FromSeconds(30));
if (message != null)
{
    try
    {
        // Process the message
        Console.WriteLine($"Received: {message.Body}");
        await receiver.CompleteMessageAsync(message); // Delete from queue
    }
    catch (Exception ex)
    {
        await receiver.AbandonMessageAsync(message); // Return to queue for retry
    }
}`,
          },
        },
        {
          heading: "Azure API Management Policies",
          body: "APIM policies are XML-based transformations applied to API requests and responses at four processing stages:\n\n- **inbound**: Applied to the request from the caller before it reaches the backend. Used for authentication (`validate-jwt`), rate limiting (`rate-limit-by-key`), request transformation, and caching.\n- **backend**: Modifies how APIM sends the request to the backend service.\n- **outbound**: Applied to the response from the backend before returning to the caller. Used for response transformation, header injection, and caching storage.\n- **on-error**: Handles errors from any stage.\n\nCommon policies:\n- `validate-jwt` — verify JWT token from Entra ID or other IdP\n- `rate-limit-by-key` — limit calls per time period by caller IP, subscription key, or custom expression\n- `set-header` — add or modify request/response headers\n- `rewrite-uri` — change the backend URL\n- `mock-response` — return a static response without hitting the backend",
          code: {
            lang: "xml",
            label: "APIM policy — JWT validation and rate limiting",
            snippet: `<policies>
  <inbound>
    <!-- Validate JWT from Entra ID -->
    <validate-jwt header-name="Authorization" failed-validation-httpcode="401">
      <openid-config url="https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration" />
      <audiences>
        <audience>api://my-api-client-id</audience>
      </audiences>
    </validate-jwt>

    <!-- Rate limit: 100 calls per 60 seconds per subscription key -->
    <rate-limit-by-key calls="100" renewal-period="60"
      counter-key="@(context.Subscription.Id)" />

    <base />
  </inbound>
  <backend>
    <base />
  </backend>
  <outbound>
    <!-- Remove internal headers from response -->
    <set-header name="X-Internal-Server" exists-action="delete" />
    <base />
  </outbound>
  <on-error>
    <base />
  </on-error>
</policies>`,
          },
        },
        {
          heading: "Azure Event Grid — Reactive Event Routing",
          body: "Azure Event Grid provides push-based event routing from **event sources** (publishers) to **event handlers** (subscribers). Built-in Azure sources include Blob Storage (blob created/deleted), Azure Resource Manager (resource events), IoT Hub, Container Registry, and more.\n\n**Event handlers** include Azure Functions, Logic Apps, Event Hub, Service Bus, webhooks, and Azure Relay.\n\n**Webhook validation handshake**: When a webhook endpoint is registered as an Event Grid subscriber, Event Grid sends a `SubscriptionValidationEvent`. The handler must respond with the `validationCode` value from the event payload. Without this, the subscription is not activated.\n\n**Retry policy**: Event Grid retries failed deliveries with exponential backoff for up to 24 hours. Dead-lettering can be configured to capture undeliverable events in a storage account.",
          code: {
            lang: "csharp",
            label: "Event Grid webhook handler with validation",
            snippet: `[HttpPost]
public async Task<IActionResult> HandleEvent([FromBody] EventGridEvent[] events)
{
    foreach (var evt in events)
    {
        // Handle validation handshake
        if (evt.EventType == "Microsoft.EventGrid.SubscriptionValidationEvent")
        {
            var data = evt.Data.ToObjectFromJson<SubscriptionValidationEventData>();
            return Ok(new { validationResponse = data.ValidationCode });
        }

        // Handle actual events
        if (evt.EventType == "Microsoft.Storage.BlobCreated")
        {
            var blobData = evt.Data.ToObjectFromJson<StorageBlobCreatedEventData>();
            await ProcessNewBlob(blobData.Url);
        }
    }
    return Ok();
}`,
          },
        },
      ],
      quiz: [
        {
          id: "az204-d5-q1",
          question:
            "A developer needs to ensure that all messages related to a specific customer order are processed in the correct sequence by a single consumer. Which Azure Service Bus feature enables this?",
          options: [
            "A) Message time-to-live (TTL) — messages expire if not processed in order.",
            "B) Message sessions — all messages with the same SessionId are delivered to a single session-aware consumer in FIFO order.",
            "C) Dead-letter queue — unprocessed messages are reordered automatically.",
            "D) FIFO partitioned queues — automatically sort messages by timestamp.",
          ],
          correctIndex: 1,
          explanation:
            "Service Bus sessions group messages with the same `SessionId` and guarantee they are processed by a single session-aware consumer in the order received. This is the standard pattern for ordered processing of correlated messages. TTL (A) controls message expiry, not ordering. The DLQ (C) holds undeliverable messages, not providing ordering. Partitioned queues (D) improve throughput but do not guarantee cross-partition ordering.",
        },
        {
          id: "az204-d5-q2",
          question:
            "A message processing service crashes after receiving a Service Bus message in peek-lock mode but before completing it. What happens to the message?",
          options: [
            "A) The message is permanently deleted because it was received.",
            "B) The message lock expires and it becomes visible in the queue again for reprocessing.",
            "C) The message is immediately moved to the dead-letter queue.",
            "D) Service Bus sends the message to the next consumer in the consumer group.",
          ],
          correctIndex: 1,
          explanation:
            "In peek-lock mode, the message is locked (made invisible to other consumers) for a configurable lock duration. If the consumer crashes and does not complete, abandon, or renew the lock, the lock expires and the message becomes visible again for another consumer to process. After exceeding the maximum delivery count (default 10), it moves to the DLQ. The message is not deleted on receive (A), not immediately DLQ'd (C), and Service Bus queues do not use consumer groups like Event Hub (D).",
        },
        {
          id: "az204-d5-q3",
          question:
            "An APIM policy needs to reject requests that do not include a valid Entra ID JWT token in the Authorization header. Which policy element achieves this?",
          options: [
            "A) `<check-header name=\"Authorization\" failed-check-httpcode=\"401\"/>`",
            "B) `<validate-jwt header-name=\"Authorization\" failed-validation-httpcode=\"401\">` with OpenID configuration URL.",
            "C) `<authentication-basic username=\"\" password=\"\"/>` for HTTP Basic auth.",
            "D) `<ip-filter action=\"allow\">` for trusted client IPs.",
          ],
          correctIndex: 1,
          explanation:
            "`validate-jwt` validates JSON Web Tokens against the OpenID Connect configuration, checking signature, expiry, issuer, and audience. It returns the configured HTTP status code (401) for invalid tokens. `check-header` (A) only verifies that a header exists and has a specific value — it does not validate JWT signature or claims. `authentication-basic` (C) is for HTTP Basic auth. `ip-filter` (D) restricts by IP, not JWT.",
        },
        {
          id: "az204-d5-q4",
          question:
            "When a new webhook endpoint is registered as an Azure Event Grid subscription, Event Grid sends an initial `SubscriptionValidationEvent`. What must the webhook handler return to activate the subscription?",
          options: [
            "A) HTTP 200 OK with an empty body.",
            "B) HTTP 200 OK with a JSON body containing `{ \"validationResponse\": \"<validationCode>\" }`.",
            "C) HTTP 204 No Content to indicate the validation was accepted.",
            "D) HTTP 202 Accepted to indicate the subscription is being processed asynchronously.",
          ],
          correctIndex: 1,
          explanation:
            "Event Grid's webhook validation handshake requires the endpoint to respond with HTTP 200 and a JSON body echoing the `validationCode` from the event payload as `validationResponse`. Without this specific response, Event Grid considers the endpoint invalid and does not activate the subscription. HTTP 200 with empty body (A), 204 (C), and 202 (D) all fail the validation check.",
        },
        {
          id: "az204-d5-q5",
          question:
            "What is the key architectural difference between Azure Service Bus and Azure Event Hub?",
          options: [
            "A) Service Bus supports HTTP; Event Hub requires AMQP protocol.",
            "B) Service Bus provides reliable message delivery with acknowledgment and DLQ for transactional processing; Event Hub provides high-throughput partitioned event streaming with checkpoint-based consumers.",
            "C) Event Hub supports at-most-once delivery; Service Bus supports exactly-once.",
            "D) They are identical services with different pricing models.",
          ],
          correctIndex: 1,
          explanation:
            "Service Bus is designed for reliable enterprise messaging — transactional processing, ordered delivery, dead-lettering, and acknowledgment-based processing (at-least-once or exactly-once with sessions). Event Hub is designed for high-throughput event streaming (millions of events/second) with partitioned, checkpoint-based consumers — each consumer reads from its position independently. They solve different problems. Both support AMQP and HTTP (A is partially wrong). Event Hub provides at-least-once delivery (C). They are architecturally distinct (D is wrong).",
        },
        {
          id: "az204-d5-q6",
          question:
            "A developer implements APIM API versioning for a breaking API change. Users of the old API must not be affected. Which versioning scheme adds the version to the URL path?",
          options: [
            "A) Header versioning — `api-version: 2` in the request header.",
            "B) Query string versioning — `?api-version=2` in the URL.",
            "C) Path versioning — `/v2/resource` in the URL path.",
            "D) Revision — create a new revision of the existing API.",
          ],
          correctIndex: 2,
          explanation:
            "Path-based versioning includes the version in the URL: `/api/v1/orders` and `/api/v2/orders` are separate routes. This is the most explicit and visible versioning scheme. Header versioning (A) includes the version in a request header — less visible but no URL change. Query string (B) appends `?api-version=`. APIM Revisions (D) are for non-breaking changes to an existing version — they do not create a parallel API version.",
        },
        {
          id: "az204-d5-q7",
          question:
            "Multiple independent analytics systems need to process the same stream of events in real time at their own pace. Which Azure service and feature supports this pattern?",
          options: [
            "A) Azure Service Bus topic with multiple subscriptions — each subscription gets a copy of every message.",
            "B) Azure Event Hub with multiple consumer groups — each group reads the stream independently with its own checkpoint.",
            "C) Azure Event Grid with multiple subscribers — push events to multiple endpoints simultaneously.",
            "D) Azure Storage Queue with multiple readers sharing a single queue.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Event Hub consumer groups allow multiple independent consumers (analytics systems) to read the same partitioned event stream at their own pace. Each consumer group maintains its own offset/checkpoint, so a slow consumer does not block a fast one. Service Bus topics (A) also support multiple subscribers but are designed for reliable delivery of discrete messages, not high-throughput streaming. Event Grid (C) provides push delivery but does not support consumer-controlled pace. Storage Queue (D) is point-to-point — messages are consumed by one reader.",
        },
        {
          id: "az204-d5-q8",
          question:
            "An APIM policy must add a correlation ID header to every request forwarded to the backend. If the incoming request already has a `Correlation-Id` header, use it; otherwise generate a new GUID. Which policy achieves this?",
          options: [
            "A) `<set-header name=\"Correlation-Id\" exists-action=\"override\"><value>@(Guid.NewGuid().ToString())</value></set-header>`",
            "B) `<set-header name=\"Correlation-Id\" exists-action=\"skip\"><value>@(Guid.NewGuid().ToString())</value></set-header>`",
            "C) `<check-header name=\"Correlation-Id\" failed-check-httpcode=\"400\"/>`",
            "D) `<rewrite-uri template=\"?correlationId=@(Guid.NewGuid().ToString())\"/>`",
          ],
          correctIndex: 1,
          explanation:
            "`exists-action=\"skip\"` means: if the header already exists, leave it unchanged; if it does not exist, set it to the new GUID value. This is exactly the behavior described. `exists-action=\"override\"` (A) always replaces the header even if the caller provided one. `check-header` (C) validates a header value, not sets one. `rewrite-uri` (D) modifies the URL, not a header.",
        },
        {
          id: "az204-d5-q9",
          question:
            "A developer wants to configure Event Hub to automatically archive all incoming events to Azure Data Lake Storage Gen2 for long-term retention and batch analytics. Which Event Hub feature should they enable?",
          options: [
            "A) Event Hub consumer groups — create a dedicated group for archival.",
            "B) Event Hub Capture — automatically capture events to Azure Storage or ADLS in Avro format.",
            "C) Event Grid subscription — route events from Event Hub to ADLS.",
            "D) Azure Stream Analytics — stream events to ADLS in real time.",
          ],
          correctIndex: 1,
          explanation:
            "Event Hub Capture is a native Event Hub feature that automatically archives event stream data to Azure Blob Storage or ADLS Gen2 in Apache Avro format. It runs on a configurable time or size window. Consumer groups (A) are for reading events, not archiving. Event Grid (C) can trigger on Event Hub but does not provide the automatic, continuous capture of all events. Stream Analytics (D) can output to ADLS but requires setting up a separate processing pipeline.",
        },
        {
          id: "az204-d5-q10",
          question:
            "An API call through APIM fails with HTTP 429. What does this indicate?",
          options: [
            "A) The backend API returned an internal server error.",
            "B) The caller has exceeded the rate limit or quota configured in an APIM policy.",
            "C) The JWT token in the Authorization header is expired.",
            "D) The APIM subscription key is invalid.",
          ],
          correctIndex: 1,
          explanation:
            "HTTP 429 Too Many Requests indicates the caller has exceeded a rate limit or quota. In APIM, this is typically caused by the `rate-limit-by-key` or `quota-by-key` policy returning 429 when the configured threshold is exceeded. HTTP 500 (A) is a backend server error. HTTP 401 (C) is for authentication failures (expired JWT). HTTP 403 (D) is for authorization failures (invalid subscription key).",
        },
        {
          id: "az204-d5-q11",
          question:
            "What is an APIM Revision used for?",
          options: [
            "A) Creating a new major version of an API that is incompatible with the previous version.",
            "B) Making non-breaking changes to an API (adding optional parameters, new operations) that can be tested before being made current.",
            "C) Archiving old API versions that should no longer be used.",
            "D) Configuring different backend URLs for different geographic regions.",
          ],
          correctIndex: 1,
          explanation:
            "APIM Revisions allow making changes to an API definition (adding operations, updating descriptions, modifying policies) without impacting the current live version. Revisions can be tested before being promoted to current. They are designed for non-breaking changes and operational updates. Breaking changes that require a new contract should use Versions, not Revisions. Archiving (C) and geographic routing (D) are not revision purposes.",
        },
        {
          id: "az204-d5-q12",
          question:
            "A developer receives a Service Bus message but knows the processing cannot succeed due to invalid message content (not a transient error). What should the developer do with the message?",
          options: [
            "A) Call `AbandonMessageAsync` to return the message to the queue for retry.",
            "B) Call `DeadLetterMessageAsync` to immediately move the message to the DLQ with a reason.",
            "C) Let the lock expire so the message is automatically retried and eventually moved to the DLQ.",
            "D) Call `CompleteMessageAsync` to discard the invalid message.",
          ],
          correctIndex: 1,
          explanation:
            "`DeadLetterMessageAsync` explicitly moves the message to the Dead-Letter Queue with a developer-specified reason — the appropriate action for permanently unprocessable messages. `AbandonMessageAsync` (A) returns the message for retry — correct for transient errors, but wastes delivery attempts for messages with invalid content. Letting the lock expire (C) achieves the same eventual outcome but wastes time and delivery count. `CompleteMessageAsync` (D) deletes the message, losing it permanently.",
        },
        {
          id: "az204-d5-q13",
          question:
            "Which Azure service should a developer use to react to Azure Blob Storage events (e.g., a blob being created) and trigger an Azure Function to process the new blob?",
          options: [
            "A) Azure Service Bus — subscribe to Blob Storage events via the SDK.",
            "B) Azure Event Grid — subscribe to Blob Storage events and push to an Azure Function event handler.",
            "C) Azure Monitor — create an alert on Blob Storage operations.",
            "D) Azure Logic Apps — poll Blob Storage every minute for new blobs.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Event Grid has built-in integration with Azure Blob Storage as an event publisher. When a blob is created, Event Grid pushes a `BlobCreated` event to registered subscribers — including Azure Functions (via Event Grid trigger). This provides near-real-time, push-based event handling. Service Bus (A) does not subscribe to Blob Storage events natively. Azure Monitor (C) creates operational alerts, not event processing triggers. Logic Apps polling (D) is a pull-based approach with up to 1-minute latency.",
        },
        {
          id: "az204-d5-q14",
          question:
            "An APIM developer wants to configure the API gateway to return a cached response for identical GET requests within a 5-minute window, reducing backend load. Which policy should be used?",
          options: [
            "A) `<rate-limit-by-key calls=\"1\" renewal-period=\"300\"/>` — limit each unique request to 1 call per 5 minutes.",
            "B) `<cache-lookup/>` in the inbound section and `<cache-store duration=\"300\"/>` in the outbound section.",
            "C) `<mock-response/>` — return a static mock response for all requests.",
            "D) `<set-header name=\"Cache-Control\" value=\"max-age=300\"/>` — instruct clients to cache responses.",
          ],
          correctIndex: 1,
          explanation:
            "APIM's `cache-lookup` (inbound) checks for a cached response; if found, returns it. `cache-store` (outbound) stores the backend response in the cache for the specified duration (300 seconds = 5 minutes). This is APIM's built-in response caching mechanism. Rate limiting (A) controls request frequency but does not cache responses. `mock-response` (C) returns static data, not real backend responses. Setting `Cache-Control` headers (D) instructs clients to cache locally but does not cache in APIM.",
        },
        {
          id: "az204-d5-q15",
          question:
            "Which Azure messaging service is BEST suited for an order processing system where each order message must be processed exactly once, with guaranteed delivery, and orders must not be lost if the processing service is temporarily unavailable?",
          options: [
            "A) Azure Event Grid — push-based routing with 24-hour retry.",
            "B) Azure Event Hub — high-throughput streaming with checkpoint-based consumers.",
            "C) Azure Service Bus Queue with peek-lock mode and dead-letter queue — enterprise reliable messaging.",
            "D) Azure Storage Queue — simple queuing with 7-day message retention.",
          ],
          correctIndex: 2,
          explanation:
            "Azure Service Bus provides enterprise-grade reliable messaging: peek-lock ensures at-least-once delivery, messages are not deleted until explicitly completed, the DLQ captures unprocessable messages, and sessions enable exactly-once ordered processing. Service Bus guarantees messages are not lost if the consumer is temporarily unavailable — messages persist until processed or expire. Event Grid (A) has a 24-hour retry window. Event Hub (B) is for streaming, not transactional messaging. Storage Queue (D) lacks advanced features like DLQ, sessions, and scheduled delivery.",
        },
      ],
    },
  ],
};
