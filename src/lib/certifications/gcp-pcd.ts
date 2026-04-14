import type { Certification } from "./types";

export const gcpPcd: Certification = {
  id: "gcp-pcd",
  title: "Google Cloud Professional Cloud Developer",
  code: "PCD",
  cloud: "gcp",
  level: "Professional",
  description:
    "Demonstrate ability to build scalable, highly available applications using Google Cloud tools and best practices.",
  examFormat: {
    questions: 50,
    duration: "120 minutes",
    passingScore: "~70%",
    cost: "$200 USD",
  },
  domains: [
    // ─── Domain 1: Designing Highly Scalable, Available, and Reliable Cloud-Native Applications (25%) ───
    {
      id: "domain-1",
      title: "Designing Highly Scalable, Available, and Reliable Cloud-Native Applications",
      weight: "25%",
      order: 1,
      summary:
        "This domain covers designing application architectures that can scale to meet demand while remaining highly available and resilient to failures. You must understand the trade-offs between different compute options — **Cloud Run**, **GKE**, **App Engine**, and **Cloud Functions** — and select the right one based on traffic patterns, operational overhead, and workload characteristics.\n\nExpect questions about designing stateless services, applying the 12-factor app methodology, and using managed services to offload operational complexity. You should know how to design event-driven architectures using **Pub/Sub** for decoupling services, and how to use **Firestore** and **Cloud SQL** for different data persistence needs. Resilience patterns like circuit breakers, retries with exponential backoff, and graceful degradation are tested heavily.",
      keyConceptsForExam: [
        "**Cloud Run** — serverless containers, auto-scales to zero, stateless, HTTP/gRPC, concurrency model, min/max instances, CPU allocation",
        "**GKE** — managed Kubernetes, node pools, Autopilot vs Standard mode, Horizontal Pod Autoscaler, Cluster Autoscaler",
        "**Cloud Functions (Gen 2)** — event-driven, Eventarc triggers, longer timeouts, concurrency support, Cloud Run under the hood",
        "**Pub/Sub** — asynchronous messaging, at-least-once delivery, push/pull subscriptions, dead-letter topics, message ordering",
        "**Stateless design** — 12-factor app, externalize session state to Memorystore/Firestore, avoid local disk writes",
      ],
      examTips: [
        "Cloud Run is the default answer for stateless HTTP containers — it scales to zero, eliminates node management, and supports traffic splitting for gradual rollouts. Use GKE when you need Kubernetes-native features like DaemonSets, StatefulSets, or custom scheduling.",
        "Pub/Sub dead-letter topics capture unprocessable messages after a configurable retry count — always configure them in production to avoid silent message loss.",
        "For exam scenarios requiring 'no single point of failure', the answer almost always involves deploying across multiple zones (multi-zonal GKE) or using a globally load-balanced Cloud Run service.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "cloud-run", title: "Cloud Run" },
        { cloud: "gcp", topicId: "gke-basics", title: "GKE — Google Kubernetes Engine" },
        { cloud: "gcp", topicId: "pubsub", title: "Pub/Sub Messaging" },
      ],
      sections: [
        {
          heading: "Choosing the Right Compute Platform",
          body: "Google Cloud offers multiple compute tiers for application workloads. **Cloud Run** is the recommended default for new stateless HTTP services — it runs any container, scales automatically from zero to thousands of instances, and charges only for request processing time. Use it when you want zero infrastructure management and variable traffic patterns.\n\n**GKE** is the right choice when you need Kubernetes-native primitives: custom controllers, StatefulSets for databases, DaemonSets for log agents, or fine-grained pod scheduling. GKE Autopilot removes node management, while GKE Standard gives you full node control. **Cloud Functions (Gen 2)** is ideal for lightweight event handlers — triggered by Pub/Sub, Cloud Storage events, Firestore writes, or HTTP. They're backed by Cloud Run infrastructure and support longer timeouts and concurrency.",
          code: {
            lang: "yaml",
            label: "Cloud Run service with min instances and concurrency",
            snippet: `# cloud-run-service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: my-api
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "2"
        autoscaling.knative.dev/maxScale: "100"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 80
      containers:
        - image: gcr.io/my-project/my-api:latest
          resources:
            limits:
              cpu: "2"
              memory: 1Gi`,
          },
        },
        {
          heading: "Event-Driven Architecture with Pub/Sub",
          body: "**Pub/Sub** decouples producers from consumers, enabling asynchronous processing and resilient pipelines. Producers publish messages to **topics**; consumers read from **subscriptions**. Each subscription receives an independent copy of every message, enabling fan-out patterns.\n\nUse **push subscriptions** to deliver messages to HTTP endpoints (Cloud Run, App Engine) — Pub/Sub handles retries with exponential backoff. Use **pull subscriptions** when consumers control the rate of processing — useful for batch workloads and high-throughput pipelines via Dataflow.\n\nConfigure **dead-letter topics** to capture messages that exceed the maximum delivery attempts. Set **message retention** up to 7 days and **acknowledgment deadlines** based on processing time. For ordered processing, use **message ordering keys** — all messages with the same key are delivered in order to a single subscriber.",
          code: {
            lang: "bash",
            label: "Create a Pub/Sub topic with dead-letter configuration",
            snippet: `# Create main topic and dead-letter topic
gcloud pubsub topics create orders-topic
gcloud pubsub topics create orders-deadletter

# Create subscription with dead-letter config
gcloud pubsub subscriptions create orders-sub \\
  --topic=orders-topic \\
  --dead-letter-topic=orders-deadletter \\
  --max-delivery-attempts=5 \\
  --ack-deadline=60 \\
  --message-retention-duration=7d`,
          },
        },
      ],
      quiz: [
        {
          id: "pcd-d1-q1",
          question:
            "A startup is building a stateless REST API that expects minimal traffic most of the day with occasional spikes to thousands of requests per minute. They want zero infrastructure management and to pay only for what they use. Which compute option is BEST?",
          options: [
            "A) GKE Standard with cluster autoscaling.",
            "B) Compute Engine managed instance group with autoscaling.",
            "C) Cloud Run with minimum instances set to 0.",
            "D) App Engine Standard with automatic scaling.",
          ],
          correctIndex: 2,
          explanation:
            "Cloud Run scales to zero when idle (no requests), eliminating cost during quiet periods, and scales rapidly during spikes. It requires no infrastructure management and charges per request. GKE (A) and managed instance groups (B) require running nodes at all times, incurring baseline costs. App Engine Standard (D) also scales to zero but is more restrictive on runtimes and is a legacy choice compared to Cloud Run.",
        },
        {
          id: "pcd-d1-q2",
          question:
            "An e-commerce platform uses a microservices architecture. The order service must notify the inventory, billing, and shipping services when an order is placed. What is the RECOMMENDED pattern?",
          options: [
            "A) The order service calls each downstream service synchronously via REST APIs.",
            "B) The order service publishes an event to a Pub/Sub topic; each downstream service has its own subscription.",
            "C) The order service writes to a Cloud SQL table that downstream services poll every second.",
            "D) The order service calls a Cloud Function that fans out to downstream services.",
          ],
          correctIndex: 1,
          explanation:
            "Pub/Sub fan-out with separate subscriptions per consumer is the standard event-driven pattern. Each service gets an independent copy of the message, services are decoupled, and Pub/Sub handles retries. Synchronous calls (A) create tight coupling and cascade failures. Database polling (C) creates contention and latency. A fan-out Cloud Function (D) is a synchronous bottleneck rather than true decoupling.",
        },
        {
          id: "pcd-d1-q3",
          question:
            "A Cloud Run service is experiencing cold start latency spikes for the first request after a period of inactivity. Users notice occasional slow responses. What is the BEST solution?",
          options: [
            "A) Increase the container CPU and memory limits.",
            "B) Set minimum instances to a non-zero value to keep warm containers.",
            "C) Switch to GKE to avoid cold starts.",
            "D) Use Cloud CDN to cache API responses.",
          ],
          correctIndex: 1,
          explanation:
            "Setting `autoscaling.knative.dev/minScale` to 1 or more keeps warm instances running, eliminating cold starts for those requests. This adds a baseline cost for the always-on instances but resolves the latency problem. Increasing resources (A) speeds up cold start slightly but doesn't eliminate it. GKE (C) avoids cold starts but adds significant operational overhead. CDN (D) only helps with cacheable responses, not dynamic API calls.",
        },
        {
          id: "pcd-d1-q4",
          question:
            "A team wants to deploy a GKE workload that requires exactly one pod per node (e.g., a log collection agent). Which Kubernetes resource should they use?",
          options: [
            "A) Deployment with replicaCount matching the number of nodes.",
            "B) StatefulSet with ordinal pod naming.",
            "C) DaemonSet.",
            "D) CronJob with node affinity rules.",
          ],
          correctIndex: 2,
          explanation:
            "A **DaemonSet** ensures exactly one pod runs on every node (or a subset matching node selectors). It automatically adds pods to new nodes as the cluster scales. Deployments (A) spread replicas across nodes but don't guarantee one per node. StatefulSets (B) are for ordered, stateful applications. CronJobs (D) are for scheduled batch tasks.",
        },
        {
          id: "pcd-d1-q5",
          question:
            "A Cloud Functions service processes Pub/Sub messages but occasionally fails due to a transient backend error. Messages are being retried indefinitely, filling the queue. What should the team configure?",
          options: [
            "A) Set the function timeout to a lower value.",
            "B) Configure a dead-letter topic on the Pub/Sub subscription with a maximum delivery attempt count.",
            "C) Add a try-catch in the function and log errors to Cloud Logging.",
            "D) Switch to a pull subscription and implement manual retry logic.",
          ],
          correctIndex: 1,
          explanation:
            "A dead-letter topic captures messages that exceed the maximum delivery attempts (e.g., 5). Failed messages are moved to the dead-letter topic for later inspection and reprocessing. Lowering timeout (A) doesn't prevent indefinite retries. Logging errors (C) helps debugging but doesn't stop retries. Manual pull with retry logic (D) is complex and reinvents what Pub/Sub provides natively.",
        },
        {
          id: "pcd-d1-q6",
          question:
            "A developer needs to store application session data so that any Cloud Run instance can access it. Which approach follows best practices for stateless Cloud Run services?",
          options: [
            "A) Write session data to the container's local filesystem.",
            "B) Store session data in Memorystore (Redis) and access it from each Cloud Run instance.",
            "C) Use environment variables to pass session state between requests.",
            "D) Store session data in a Cloud Run volume mount backed by a Persistent Disk.",
          ],
          correctIndex: 1,
          explanation:
            "Memorystore (Redis) is a managed in-memory store that all Cloud Run instances can access, making the service stateless at the container level. Local filesystem writes (A) are lost when a container terminates or a new instance serves the request. Environment variables (C) are static configuration, not per-request state. Cloud Run does not support Persistent Disk volume mounts — it uses in-memory volumes or Cloud Storage FUSE.",
        },
        {
          id: "pcd-d1-q7",
          question:
            "A company's GKE application needs to scale its pods based on the number of unprocessed Pub/Sub messages in a subscription. Which GKE feature enables this?",
          options: [
            "A) Cluster Autoscaler based on node CPU utilization.",
            "B) Horizontal Pod Autoscaler (HPA) with a custom metric from Cloud Monitoring.",
            "C) Vertical Pod Autoscaler (VPA) with Pub/Sub queue depth.",
            "D) Node auto-provisioning based on pending pod requests.",
          ],
          correctIndex: 1,
          explanation:
            "The Horizontal Pod Autoscaler can scale based on custom external metrics from Cloud Monitoring, including Pub/Sub subscription message count (`pubsub.googleapis.com/subscription/num_undelivered_messages`). This allows scaling based on workload queue depth rather than CPU. Cluster Autoscaler (A) scales nodes, not pods. VPA (C) adjusts resource requests/limits, not replica count. Node auto-provisioning (D) provisions new node pools, not pod replicas.",
        },
        {
          id: "pcd-d1-q8",
          question:
            "A Cloud Run service must process HTTP requests that take up to 5 minutes to complete. The default Cloud Run request timeout is 60 seconds. What should the developer configure?",
          options: [
            "A) Deploy to GKE instead — Cloud Run cannot handle long-running requests.",
            "B) Set the Cloud Run service request timeout to up to 3600 seconds (1 hour).",
            "C) Break the request into smaller chunks that each complete in under 60 seconds.",
            "D) Use Cloud Tasks to queue the work and return a 202 Accepted immediately.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Run supports request timeouts up to 3600 seconds (1 hour), configurable via the service definition or `gcloud run deploy --timeout`. This is sufficient for 5-minute requests. GKE (A) is unnecessary — Cloud Run supports long requests. Breaking into chunks (C) adds application complexity without need. Cloud Tasks (D) is a valid async pattern but adds architecture complexity when simply extending the timeout suffices.",
        },
        {
          id: "pcd-d1-q9",
          question:
            "A team is designing a new GKE application in a single region. They want to ensure availability if a single zone within the region fails. What is the MINIMUM configuration required?",
          options: [
            "A) Deploy the GKE cluster as a regional cluster spanning at least 3 zones.",
            "B) Deploy a zonal cluster and use Cloud Load Balancing for failover.",
            "C) Deploy two zonal clusters in different zones and use Traffic Director.",
            "D) Use a regional managed instance group with GKE nodes.",
          ],
          correctIndex: 0,
          explanation:
            "A **regional GKE cluster** distributes the control plane and nodes across 3 zones within the region. If one zone fails, the control plane and application pods in the remaining zones continue serving traffic. A zonal cluster (B, C) places the control plane in a single zone — a zone failure takes down the API server. Traffic Director (C) is a service mesh, not a substitute for multi-zone cluster deployment.",
        },
        {
          id: "pcd-d1-q10",
          question:
            "An application deployed on Cloud Run uses Pub/Sub push subscriptions to receive messages. The Cloud Run service URL is private (ingress set to 'internal'). How should push delivery be configured?",
          options: [
            "A) Make the Cloud Run service public so Pub/Sub can reach it.",
            "B) Use a Pub/Sub pull subscription instead — push requires a public endpoint.",
            "C) Configure the Pub/Sub subscription to authenticate with the Cloud Run service using a service account with the Cloud Run Invoker role.",
            "D) Deploy a VPC connector so Pub/Sub can reach the private Cloud Run service.",
          ],
          correctIndex: 2,
          explanation:
            "Pub/Sub push subscriptions support authentication via an OIDC token from a service account. By granting that service account the `roles/run.invoker` role on the private Cloud Run service, Pub/Sub can authenticate and deliver messages without making the service public. A public service (A) is a security risk. Pull subscriptions (B) work but require the service to manage polling. VPC connectors (D) are for egress from Cloud Run, not for Pub/Sub ingress.",
        },
      ],
    },

    // ─── Domain 2: Building and Testing Applications (20%) ───
    {
      id: "domain-2",
      title: "Building and Testing Applications",
      weight: "20%",
      order: 2,
      summary:
        "This domain covers how to build, containerize, test, and configure applications using Google Cloud developer tools. You must understand **Cloud Build** for CI/CD pipelines, **Artifact Registry** for storing container images and packages, and how to write effective Dockerfiles for Cloud Run and GKE deployments.\n\nExpect questions about unit testing, integration testing, and load testing strategies for cloud-native applications. You should know how to use **Cloud Build triggers** for automated builds on code pushes, how to configure build steps with substitutions and artifacts, and best practices for secrets management using **Secret Manager** instead of environment variables or config files.",
      keyConceptsForExam: [
        "**Cloud Build** — fully managed CI/CD, `cloudbuild.yaml` steps, substitution variables, build triggers (push, PR, tag), artifact storage",
        "**Artifact Registry** — OCI-compliant image registry, language package support (npm, Maven, PyPI), vulnerability scanning, IAM-based access",
        "**Secret Manager** — versioned secrets, IAM access control, automatic rotation, `--set-secrets` in Cloud Run and Cloud Build",
        "**Container best practices** — multi-stage builds, non-root users, minimal base images (distroless), layer caching",
        "**Testing strategies** — unit tests (fast, isolated), integration tests (real services), load tests (locust, k6), canary testing with traffic splitting",
      ],
      examTips: [
        "Cloud Build substitution variables like `$PROJECT_ID`, `$COMMIT_SHA`, and `$BRANCH_NAME` are built-in and available in all build steps — use `$COMMIT_SHA` to tag images for traceability.",
        "Secret Manager secrets should be mounted as files or environment variables in Cloud Run via `--set-secrets`, not hardcoded or stored in Artifact Registry images.",
        "Multi-stage Docker builds reduce final image size by separating the build environment (with compilers, dev tools) from the runtime image — critical for Cloud Run cold start performance.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "cloud-build", title: "Cloud Build CI/CD" },
        { cloud: "gcp", topicId: "artifact-registry", title: "Artifact Registry" },
      ],
      sections: [
        {
          heading: "Cloud Build Pipelines",
          body: "**Cloud Build** executes build pipelines defined in a `cloudbuild.yaml` file. Each step runs in a Docker container, enabling any tool available as a container image. Built-in builders include `gcr.io/cloud-builders/docker`, `gcr.io/cloud-builders/gcloud`, `gcr.io/cloud-builders/kubectl`, and `gcr.io/cloud-builders/npm`.\n\nBuild **triggers** automatically start builds on repository events: push to branch, pull request, or new tag. Use **substitution variables** (`$PROJECT_ID`, `$COMMIT_SHA`, `$BRANCH_NAME`, `$TAG_NAME`) to parameterize builds. Store build artifacts — container images, JAR files, test reports — in **Artifact Registry** or **Cloud Storage**.\n\nFor secrets in builds, use `secretManager` in `cloudbuild.yaml` to inject secrets from Secret Manager as environment variables. Never embed secrets in `cloudbuild.yaml` or Dockerfiles.",
          code: {
            lang: "yaml",
            label: "cloudbuild.yaml — build, test, push, deploy",
            snippet: `steps:
  # Run unit tests
  - name: node:20
    entrypoint: npm
    args: [ci]
  - name: node:20
    entrypoint: npm
    args: [test]

  # Build and push container image
  - name: gcr.io/cloud-builders/docker
    args:
      - build
      - -t
      - us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA
      - .

  # Push to Artifact Registry
  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA

  # Deploy to Cloud Run
  - name: gcr.io/cloud-builders/gcloud
    args:
      - run
      - deploy
      - my-app
      - --image=us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA
      - --region=us-central1
      - --platform=managed`,
          },
        },
        {
          heading: "Artifact Registry and Container Best Practices",
          body: "**Artifact Registry** is the recommended registry for container images, replacing Container Registry. It supports Docker images, npm packages, Maven artifacts, Python packages, and more — all in the same platform with IAM-based access control.\n\nEnable **vulnerability scanning** on Artifact Registry repositories to detect CVEs in container images automatically after push. Integrate with **Binary Authorization** to enforce that only verified images (signed by Cloud Build) can be deployed to GKE or Cloud Run.\n\nFor container images, follow these best practices: use **multi-stage builds** to keep the final image lean; use **distroless** or `alpine`-based base images; run as a **non-root user**; avoid copying secrets or credentials into the image. Tag images with the `$COMMIT_SHA` for traceability and keep a `latest` tag for the most recent build.",
          code: {
            lang: "dockerfile",
            label: "Multi-stage Dockerfile for a Node.js app",
            snippet: `# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime (distroless for security)
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER nonroot:nonroot
EXPOSE 8080
CMD ["server.js"]`,
          },
        },
      ],
      quiz: [
        {
          id: "pcd-d2-q1",
          question:
            "A team wants Cloud Build to automatically build and deploy their application every time code is pushed to the `main` branch. What should they configure?",
          options: [
            "A) A Cloud Scheduler job that runs `gcloud builds submit` every 5 minutes.",
            "B) A Cloud Build trigger connected to the repository, filtered to the `main` branch.",
            "C) A Cloud Function triggered by a Pub/Sub message from the source repository.",
            "D) A GKE CronJob that polls the repository for changes.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Build triggers natively integrate with Cloud Source Repositories, GitHub, and GitLab to automatically start builds on branch pushes, pull requests, or tags. A trigger with a branch filter of `^main$` starts a build on every push to main. Cloud Scheduler (A) is for time-based jobs, not code event triggers. Cloud Functions (C) and CronJobs (D) are roundabout workarounds.",
        },
        {
          id: "pcd-d2-q2",
          question:
            "A Cloud Build step needs to access a database password to run integration tests. What is the MOST secure way to provide this credential?",
          options: [
            "A) Store the password in a Cloud Build substitution variable.",
            "B) Hardcode the password in the `cloudbuild.yaml` file.",
            "C) Store the password in Secret Manager and reference it using the `secretManager` field in `cloudbuild.yaml`.",
            "D) Base64-encode the password and store it in a Cloud Storage bucket.",
          ],
          correctIndex: 2,
          explanation:
            "Secret Manager is the purpose-built secret store for GCP. Cloud Build natively supports fetching secrets from Secret Manager via the `availableSecrets.secretManager` field — secrets are injected as environment variables in specified steps. Substitution variables (A) are visible in build logs and the Cloud Build console. Hardcoding (B) is a critical security violation. Base64 encoding (D) is obfuscation, not encryption — the secret remains in plain text when decoded.",
        },
        {
          id: "pcd-d2-q3",
          question:
            "A developer builds a container image with a Dockerfile that includes both build tools (gcc, make) and the compiled binary. The resulting image is 1.2 GB, causing slow Cloud Run cold starts. What is the BEST solution?",
          options: [
            "A) Compress the image using gzip before pushing to Artifact Registry.",
            "B) Use a multi-stage Dockerfile — build in one stage, copy only the binary to a minimal runtime image.",
            "C) Increase Cloud Run CPU and memory to reduce cold start time.",
            "D) Use Kaniko to build the image without a Docker daemon.",
          ],
          correctIndex: 1,
          explanation:
            "Multi-stage builds separate the build environment (with compilers and build tools) from the final runtime image. Only the compiled binary is copied into the lean final stage (e.g., distroless or alpine), dramatically reducing image size. Compressing (A) reduces transfer size but the extracted image is still large. More CPU (C) helps slightly but doesn't address the root cause — large image size. Kaniko (D) is an alternative build mechanism but doesn't reduce final image size.",
        },
        {
          id: "pcd-d2-q4",
          question:
            "A company wants to prevent deployment of container images that have not been built by their Cloud Build pipeline and verified. Which GCP feature enforces this?",
          options: [
            "A) Artifact Registry vulnerability scanning.",
            "B) Binary Authorization with an attestation policy.",
            "C) Cloud Armor with a WAF policy.",
            "D) VPC Service Controls around the container registry.",
          ],
          correctIndex: 1,
          explanation:
            "Binary Authorization enforces that only attested images — cryptographically signed by a trusted attestor (e.g., Cloud Build) — can be deployed to GKE or Cloud Run. Vulnerability scanning (A) detects CVEs but doesn't prevent deployment of unverified images. Cloud Armor (C) is a WAF/DDoS protection service, not image verification. VPC Service Controls (D) restrict API access, not image provenance.",
        },
        {
          id: "pcd-d2-q5",
          question:
            "A team needs to store and share private npm packages within their organization alongside Docker images. Which service provides this capability?",
          options: [
            "A) Cloud Storage with a public bucket.",
            "B) Artifact Registry with an npm repository type.",
            "C) Container Registry with a custom metadata store.",
            "D) Cloud Source Repositories npm package hosting.",
          ],
          correctIndex: 1,
          explanation:
            "Artifact Registry supports multiple repository formats including Docker, npm, Maven, Python (pip), Go, and others — all with IAM-based access control and vulnerability scanning. This makes it a unified registry for all artifact types. Cloud Storage (A) can store packages but has no package-manager integration. Container Registry (C) is Docker-only and is deprecated in favor of Artifact Registry. Cloud Source Repositories (D) is a source code repository, not a package registry.",
        },
        {
          id: "pcd-d2-q6",
          question:
            "A Cloud Run service image is tagged as `latest` in Artifact Registry. A production incident reveals that a bad image was deployed. The team wants to roll back to the previous version. What is the BEST practice to prevent this issue in the future?",
          options: [
            "A) Always deploy with the `latest` tag and rely on Artifact Registry versioning.",
            "B) Tag images with the Git commit SHA and deploy using the immutable SHA-tagged image.",
            "C) Use semantic versioning (v1.2.3) for all image tags.",
            "D) Keep a `stable` tag that is manually updated after testing.",
          ],
          correctIndex: 1,
          explanation:
            "Tagging images with the Git commit SHA (`$COMMIT_SHA` in Cloud Build) creates an immutable, traceable reference. Each deployment specifies an exact image digest, making rollbacks as simple as redeploying the previous SHA. The `latest` tag (A) is mutable — it can point to different images over time, making rollbacks ambiguous. Semantic versioning (C) works but requires a manual tagging step. A manual `stable` tag (D) is error-prone.",
        },
        {
          id: "pcd-d2-q7",
          question:
            "A developer wants to run integration tests in Cloud Build that require a running PostgreSQL database. What is the RECOMMENDED approach?",
          options: [
            "A) Connect to a shared production Cloud SQL instance from the Cloud Build step.",
            "B) Use a Docker `postgres` container as a Cloud Build step service with `waitFor`.",
            "C) Provision a new Cloud SQL instance at the start of each build and delete it afterward.",
            "D) Mock the database layer in all integration tests to avoid needing a real database.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Build supports running background services (like a PostgreSQL Docker container) using the `waitFor` feature — a test step waits for the database service to be ready before running. This is fast, isolated, and costs nothing. Using production databases (A) is dangerous and creates dependencies. Provisioning Cloud SQL per build (C) is slow (minutes to provision) and expensive. Mocking databases (D) reduces integration test value — real database interactions may behave differently.",
        },
        {
          id: "pcd-d2-q8",
          question:
            "A team uses Artifact Registry for container images and wants to automatically detect vulnerabilities in newly pushed images. What should they enable?",
          options: [
            "A) Cloud Security Command Center threat detection.",
            "B) Container Analysis and vulnerability scanning on the Artifact Registry repository.",
            "C) Cloud Armor WAF scanning for container content.",
            "D) Cloud Build automatic security step after each push.",
          ],
          correctIndex: 1,
          explanation:
            "Artifact Registry integrates with **Container Analysis** to automatically scan images for known CVEs when they are pushed. Scan results appear in the Artifact Registry console and can be queried via the Container Analysis API. Security Command Center (A) provides a broader security posture view but doesn't scan container images directly. Cloud Armor (C) is a network WAF. Cloud Build (D) can run scanners as steps but Artifact Registry's built-in scanning is simpler.",
        },
        {
          id: "pcd-d2-q9",
          question:
            "A team wants to test a new Cloud Run revision with 10% of production traffic before full rollout. Which Cloud Run feature supports this?",
          options: [
            "A) Cloud Run concurrency settings with request weighting.",
            "B) Traffic splitting between Cloud Run revisions.",
            "C) Cloud Load Balancing weighted backend services.",
            "D) Pub/Sub message routing to different service versions.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Run supports **traffic splitting** between named revisions — you can allocate specific percentages of traffic to each revision (e.g., 10% to new, 90% to stable). This enables canary deployments and gradual rollouts with instant rollback capability. Concurrency settings (A) control requests per container, not traffic distribution. Cloud Load Balancing (C) operates at a different layer and isn't used for Cloud Run revision routing. Pub/Sub (D) is for messaging, not HTTP traffic routing.",
        },
        {
          id: "pcd-d2-q10",
          question:
            "A Cloud Build pipeline builds a Docker image and stores it in Artifact Registry. The Cloud Build service account needs permission to push images. Which role should be granted?",
          options: [
            "A) `roles/artifactregistry.admin` on the project.",
            "B) `roles/artifactregistry.writer` on the Artifact Registry repository.",
            "C) `roles/storage.admin` on the Cloud Storage bucket backing Artifact Registry.",
            "D) `roles/editor` on the project.",
          ],
          correctIndex: 1,
          explanation:
            "`roles/artifactregistry.writer` grants permission to push (write) images to a specific repository without overly broad project-level permissions. Granting it on the repository (rather than project) follows least-privilege. `artifactregistry.admin` (A) grants full admin including deletion. `storage.admin` (C) is for Cloud Storage, not Artifact Registry repositories. Project `editor` (D) is an overly broad basic role.",
        },
      ],
    },

    // ─── Domain 3: Deploying Applications (20%) ───
    {
      id: "domain-3",
      title: "Deploying Applications",
      weight: "20%",
      order: 3,
      summary:
        "This domain tests your knowledge of deploying applications to Google Cloud compute platforms using best practices for zero-downtime deployments, rollback strategies, and infrastructure as code. You must understand **Cloud Run deployment** patterns (traffic splitting, revisions, tags), **GKE deployment strategies** (rolling updates, blue/green, canary), and how to manage configuration and secrets at deploy time.\n\nExpect questions about using **Terraform** or **Cloud Deployment Manager** for infrastructure as code, configuring **Cloud Run** environment variables and secrets, managing **Kubernetes ConfigMaps** and **Secrets**, and deploying to **App Engine** with version management and traffic splitting.",
      keyConceptsForExam: [
        "**Cloud Run revisions** — immutable snapshots of service configuration, traffic splitting, revision tags for direct URL access",
        "**GKE rolling updates** — `maxSurge`, `maxUnavailable`, `minReadySeconds`, `readinessProbe` for zero-downtime deployment",
        "**Blue/green deployments** — deploy new version alongside old, switch traffic atomically, instant rollback",
        "**Terraform on GCP** — `google` provider, `google_cloud_run_service`, `google_container_cluster`, state in Cloud Storage",
        "**ConfigMaps and Secrets** — Kubernetes configuration injection via environment variables or volume mounts",
      ],
      examTips: [
        "Cloud Run revisions are immutable — each `gcloud run deploy` creates a new revision. Use `--no-traffic` to deploy without shifting traffic, then use `gcloud run services update-traffic` to gradually shift.",
        "GKE `readinessProbe` is critical for zero-downtime rolling updates — Kubernetes only routes traffic to a pod once the readiness probe passes. Always configure it before deploying production workloads.",
        "For the exam, Terraform state storage in Cloud Storage with state locking via Firestore (or Cloud Storage) is the recommended pattern for team environments.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "gke-basics", title: "GKE — Google Kubernetes Engine" },
        { cloud: "gcp", topicId: "cloud-run", title: "Cloud Run" },
      ],
      sections: [
        {
          heading: "Zero-Downtime Deployments on GKE",
          body: "GKE uses Kubernetes **rolling update** strategy by default for Deployments. During a rolling update, new pods are gradually created and old pods are terminated — `maxSurge` controls how many extra pods can exist above desired count, and `maxUnavailable` controls how many pods can be unavailable during the update.\n\nThe key to zero-downtime is a properly configured **readinessProbe** — Kubernetes only sends traffic to a pod when the probe succeeds. Without it, traffic may be routed to pods that are not yet ready. Combine with `preStop` lifecycle hooks to allow in-flight requests to complete before pod termination.\n\n**Blue/green deployments** on GKE involve deploying a new Deployment (`v2`) alongside the existing one (`v1`) and updating the Service's label selector to switch traffic atomically. This enables instant rollback by reverting the label selector.",
          code: {
            lang: "yaml",
            label: "GKE Deployment with rolling update and readiness probe",
            snippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
        - name: my-app
          image: us-central1-docker.pkg.dev/my-project/repo/my-app:v2
          readinessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "sleep 5"]`,
          },
        },
        {
          heading: "Cloud Run Deployment Patterns",
          body: "Every `gcloud run deploy` creates an immutable **revision** of a Cloud Run service. By default, 100% of traffic is routed to the latest revision. Use `--no-traffic` to deploy a new revision without shifting any traffic — useful for testing before gradual rollout.\n\n**Revision tags** provide a stable URL to a specific revision for testing (e.g., `https://v2---my-service.a.run.app`). Once validated, shift traffic incrementally: `gcloud run services update-traffic my-service --to-revisions=v2=10,v1=90` for a canary release.\n\nUse **--min-instances** to prevent cold starts in production and **--max-instances** to control cost and protect downstream services from overload. Configure **--concurrency** based on your application's thread-safety — higher concurrency reduces the number of instances needed.",
          code: {
            lang: "bash",
            label: "Cloud Run canary deployment workflow",
            snippet: `# Deploy new revision without traffic
gcloud run deploy my-service \\
  --image=us-central1-docker.pkg.dev/my-project/repo/my-app:v2 \\
  --region=us-central1 \\
  --no-traffic \\
  --tag=v2

# Test new revision via tag URL
curl https://v2---my-service-abc123-uc.a.run.app/healthz

# Canary: send 10% to new revision
gcloud run services update-traffic my-service \\
  --region=us-central1 \\
  --to-revisions=v2=10,LATEST=90

# Full rollout after validation
gcloud run services update-traffic my-service \\
  --region=us-central1 \\
  --to-latest`,
          },
        },
      ],
      quiz: [
        {
          id: "pcd-d3-q1",
          question:
            "A team is doing a rolling update on a GKE Deployment. Some users experience errors during the update because new pods receive traffic before they are fully initialized. What should the team configure to fix this?",
          options: [
            "A) Increase `maxUnavailable` in the rolling update strategy.",
            "B) Add a `readinessProbe` to the container spec.",
            "C) Set `minReadySeconds` to 0 so pods are marked ready immediately.",
            "D) Use a `livenessProbe` instead.",
          ],
          correctIndex: 1,
          explanation:
            "A `readinessProbe` tells Kubernetes when a pod is ready to receive traffic. Kubernetes does not route traffic to a pod until the readiness probe succeeds. Without it, traffic is sent as soon as the container starts, which may be before the application is ready. Increasing `maxUnavailable` (A) makes the rolling update faster but doesn't fix readiness. `minReadySeconds` of 0 (C) is the default and means no additional wait. `livenessProbe` (D) restarts unhealthy pods but doesn't gate traffic routing.",
        },
        {
          id: "pcd-d3-q2",
          question:
            "A Cloud Run service has been deployed with a new revision. The team wants to test the new revision internally before exposing it to users. What feature should they use?",
          options: [
            "A) Deploy the new revision to a separate Cloud Run service.",
            "B) Use a revision tag to get a stable test URL for the new revision without routing production traffic to it.",
            "C) Enable Cloud Run authentication to restrict the new revision to internal users.",
            "D) Set the new revision to 0% traffic and use the Cloud Run console to test.",
          ],
          correctIndex: 1,
          explanation:
            "Revision tags create a stable HTTPS URL for a specific revision (e.g., `https://v2---service.a.run.app`) without affecting production traffic distribution. Internal users can test via the tag URL before any traffic is shifted. A separate service (A) is operationally heavy. Authentication (C) restricts access generally. Deploying with 0% traffic and testing via the console (D) works but requires console access and lacks a stable URL.",
        },
        {
          id: "pcd-d3-q3",
          question:
            "A team needs to perform a blue/green deployment on GKE to enable instant rollback. How is this typically implemented?",
          options: [
            "A) Use two separate GKE clusters — route traffic between them using Cloud Load Balancing.",
            "B) Deploy a new Deployment (`v2`) alongside the existing one, then update the Service selector to switch traffic.",
            "C) Use Kubernetes `maxSurge: 100%` in the rolling update to replace all pods simultaneously.",
            "D) Use GKE Autopilot's built-in blue/green deployment feature.",
          ],
          correctIndex: 1,
          explanation:
            "Blue/green on GKE involves running two Deployments (`v1` and `v2`) concurrently. The Service's label selector points to the active version. Switching traffic is atomic — update the selector from `version: v1` to `version: v2`. Rollback is equally instant: revert the selector. Two clusters (A) is expensive and complex for blue/green. `maxSurge: 100%` (C) creates a rolling update, not a true blue/green switch. GKE Autopilot (D) doesn't have a built-in blue/green feature.",
        },
        {
          id: "pcd-d3-q4",
          question:
            "A Cloud Run service needs a database connection string that differs between staging and production. How should this be managed?",
          options: [
            "A) Hardcode both connection strings in the application and use an if-else based on a `DEPLOYMENT_ENV` variable.",
            "B) Store connection strings in Secret Manager with separate secrets per environment; reference them in each Cloud Run service.",
            "C) Bake the connection string into the Docker image at build time using build args.",
            "D) Store connection strings in a Cloud Storage bucket and fetch them at runtime.",
          ],
          correctIndex: 1,
          explanation:
            "Secret Manager provides separate, versioned secrets for each environment. Cloud Run services reference secrets by name via `--set-secrets`, and each environment's service references its own secret. This follows the 12-factor app principle of environment-specific configuration. Hardcoding (A) is a security and maintainability problem. Baking into images (C) creates different images per environment, defeating the purpose of image immutability. Cloud Storage (D) adds latency and requires IAM and error handling.",
        },
        {
          id: "pcd-d3-q5",
          question:
            "A team manages GKE infrastructure using Terraform. Multiple developers collaborate and need to ensure the Terraform state is consistent. Where should the Terraform state be stored?",
          options: [
            "A) In a local `terraform.tfstate` file committed to the Git repository.",
            "B) In a Cloud Storage bucket with versioning enabled, used as the Terraform backend.",
            "C) In a Firestore database with per-developer documents.",
            "D) In Artifact Registry as a Terraform module artifact.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Storage is the recommended Terraform backend for GCP projects. Versioning enables state history and rollback. The Google Cloud Storage backend supports state locking via Cloud Storage object locking or via a Firestore/Cloud SQL lock, preventing concurrent `terraform apply` operations. Committing state to Git (A) risks conflicts and exposes sensitive resource IDs. Firestore (C) is not a standard Terraform backend. Artifact Registry (D) is for code artifacts, not Terraform state.",
        },
        {
          id: "pcd-d3-q6",
          question:
            "A developer deploys a new Cloud Run revision and immediately receives reports of errors. What is the FASTEST way to restore service to the previous working revision?",
          options: [
            "A) Redeploy the old container image from Artifact Registry.",
            "B) Use `gcloud run services update-traffic` to route 100% of traffic back to the previous revision.",
            "C) Delete the new revision and wait for Cloud Run to fall back.",
            "D) Scale the new revision to 0 instances.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Run keeps all revisions available. `gcloud run services update-traffic my-service --to-revisions=PREVIOUS_REVISION=100` instantly shifts all traffic back to the known-good revision without redeployment. Redeploying from Artifact Registry (A) creates a new revision, adding unnecessary steps. Deleting the revision (C) doesn't automatically shift traffic. Cloud Run doesn't support scaling revisions to 0 directly (D) — traffic allocation controls which revision serves requests.",
        },
        {
          id: "pcd-d3-q7",
          question:
            "A Kubernetes pod needs to access a Cloud SQL database password. The team stores it in a Kubernetes Secret. What is a security best practice when using Kubernetes Secrets?",
          options: [
            "A) Base64-encode the password and store it directly in the `deployment.yaml`.",
            "B) Enable etcd encryption at rest in GKE and restrict Secret access with RBAC.",
            "C) Store the password in a ConfigMap since Secrets and ConfigMaps have the same security properties.",
            "D) Use a Kubernetes annotation to mark the Secret as confidential.",
          ],
          correctIndex: 1,
          explanation:
            "Kubernetes Secrets are stored in etcd. In GKE, enabling **application-layer encryption** for etcd ensures secrets are encrypted at rest. Combined with **RBAC** (Role-Based Access Control) to restrict which pods and service accounts can access specific secrets, this follows security best practices. Base64 in deployment.yaml (A) is plaintext. ConfigMaps (C) have no special encryption and are for non-sensitive configuration. Annotations (D) are metadata only, not a security control.",
        },
        {
          id: "pcd-d3-q8",
          question:
            "A team uses App Engine to serve a web application. They deploy a new version and want to gradually shift traffic from the old version to the new one. What command achieves this?",
          options: [
            "A) `gcloud app versions migrate v2`",
            "B) `gcloud app services set-traffic default --splits v1=0.9,v2=0.1`",
            "C) `gcloud app deploy --version=v2 --promote`",
            "D) `gcloud app versions start v2 --stop-previous`",
          ],
          correctIndex: 1,
          explanation:
            "`gcloud app services set-traffic` with `--splits` controls the traffic distribution between App Engine versions. Splitting 90/10 between v1 and v2 implements a gradual rollout (canary). `gcloud app versions migrate` (A) migrates all traffic immediately. `gcloud app deploy --promote` (C) deploys and immediately shifts all traffic to the new version. `versions start` (D) starts a stopped version but doesn't control traffic splitting.",
        },
        {
          id: "pcd-d3-q9",
          question:
            "A team wants to use Terraform to create a Cloud Run service and grant it access to a Secret Manager secret. Which Terraform resources are needed?",
          options: [
            "A) `google_cloud_run_service` and `google_secret_manager_secret_iam_binding`.",
            "B) `google_cloud_run_service` and `google_project_iam_member`.",
            "C) `google_cloud_run_v2_service` and `google_secret_manager_secret_iam_member`.",
            "D) `google_cloud_run_service` and `google_secret_manager_secret_version`.",
          ],
          correctIndex: 2,
          explanation:
            "`google_cloud_run_v2_service` is the current Terraform resource for Cloud Run (v2 API). To grant the Cloud Run service's service account access to a secret, use `google_secret_manager_secret_iam_member` with `roles/secretmanager.secretAccessor`. Using the older `google_cloud_run_service` (A, B) works but the v2 resource is preferred. `google_secret_manager_secret_version` (D) manages secret versions, not IAM bindings.",
        },
        {
          id: "pcd-d3-q10",
          question:
            "A GKE application uses a ConfigMap to store non-sensitive configuration. After updating the ConfigMap, the running pods do not pick up the new values. Why?",
          options: [
            "A) ConfigMaps can only be updated during pod creation.",
            "B) Pods that consume ConfigMaps as environment variables do not automatically reload — they must be restarted.",
            "C) ConfigMaps must be versioned — update the ConfigMap name to trigger a reload.",
            "D) ConfigMap updates require a GKE cluster upgrade.",
          ],
          correctIndex: 1,
          explanation:
            "When a ConfigMap is consumed as **environment variables**, changes to the ConfigMap do not propagate to running pods — the environment variables were set at pod startup. To pick up new values, pods must be restarted (e.g., `kubectl rollout restart deployment my-app`). If ConfigMaps are mounted as **volumes**, updates eventually propagate to running pods (after a kubelet sync interval). ConfigMaps don't require versioned names (C) unless you want to trigger rolling restarts automatically.",
        },
      ],
    },

    // ─── Domain 4: Integrating Google Cloud Services (20%) ───
    {
      id: "domain-4",
      title: "Integrating Google Cloud Services",
      weight: "20%",
      order: 4,
      summary:
        "This domain tests your ability to integrate Google Cloud services within application code. You must understand how to use **Firestore** and **Cloud SQL** for data persistence, **Cloud Storage** for object storage, **Pub/Sub** for messaging, and **Cloud Tasks** for reliable task queue management. You should also know how to use **client libraries** to authenticate and call GCP APIs from application code using Application Default Credentials.\n\nExpect questions about choosing the right storage service for a given workload (Firestore vs Cloud SQL vs Bigtable vs BigQuery), implementing idempotent message processing, handling Cloud Tasks retries and rate limiting, and using **Cloud Endpoints** or **Apigee** for API management.",
      keyConceptsForExam: [
        "**Firestore** — NoSQL document database, real-time listeners, offline sync, serverless, native mode vs Datastore mode",
        "**Cloud SQL** — managed MySQL/PostgreSQL/SQL Server, read replicas, failover replicas, Cloud SQL Auth Proxy for secure connections",
        "**Cloud Storage** — object storage, signed URLs for temporary access, lifecycle policies, storage classes, CORS configuration",
        "**Cloud Tasks** — managed task queues, HTTP and App Engine targets, rate limiting, retry configuration, deduplication",
        "**Application Default Credentials (ADC)** — automatic credential discovery from service account, environment variable, or metadata server",
      ],
      examTips: [
        "Use **Cloud SQL Auth Proxy** to connect to Cloud SQL securely without managing SSL certificates or whitelisting IPs — the proxy handles IAM authentication.",
        "Cloud Tasks vs Pub/Sub: Cloud Tasks is for targeted, delayed, or rate-limited task delivery to a specific service; Pub/Sub is for fan-out event streaming to multiple subscribers.",
        "Signed URLs grant temporary access to Cloud Storage objects without requiring the requester to have a GCP account — use for file download links in web applications.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "firestore", title: "Firestore" },
        { cloud: "gcp", topicId: "cloud-sql", title: "Cloud SQL" },
        { cloud: "gcp", topicId: "cloud-storage", title: "Cloud Storage" },
      ],
      sections: [
        {
          heading: "Data Storage Selection and Integration",
          body: "Choosing the right data store is a critical design decision. **Firestore** is the default for mobile/web applications needing real-time sync, offline support, and flexible document schemas. It scales automatically with no provisioning required. **Cloud SQL** is for existing relational workloads — use the **Cloud SQL Auth Proxy** to connect securely from any compute platform without managing SSL certificates.\n\n**Cloud Bigtable** is for low-latency, high-throughput time-series and analytics workloads at massive scale (terabytes to petabytes). **BigQuery** is for analytics and reporting — use for complex SQL queries over large datasets, not for OLTP. **Memorystore** (Redis or Valkey) provides managed in-memory caching to reduce database load and latency for hot-path reads.\n\nFor application code, use **Google Cloud client libraries** with Application Default Credentials — no service account keys needed when running on GCP compute. Client libraries automatically find credentials from the environment.",
          code: {
            lang: "python",
            label: "Firestore and Cloud SQL integration with ADC",
            snippet: `from google.cloud import firestore
import sqlalchemy
from google.cloud.sql.connector import Connector

# Firestore — no explicit credentials needed on GCP
db = firestore.Client()
doc_ref = db.collection("users").document("alice")
doc_ref.set({"name": "Alice", "role": "admin"})

# Cloud SQL via Cloud SQL Connector (Auth Proxy alternative)
connector = Connector()
def get_connection():
    return connector.connect(
        "project:region:instance",
        "pg8000",
        user="app-user",
        db="mydb",
        enable_iam_auth=True,
    )
engine = sqlalchemy.create_engine(
    "postgresql+pg8000://",
    creator=get_connection,
)`,
          },
        },
        {
          heading: "Cloud Tasks for Reliable Async Processing",
          body: "**Cloud Tasks** is a managed task queue service for reliable asynchronous processing. Unlike Pub/Sub, Cloud Tasks delivers tasks to a specific HTTP endpoint (Cloud Run, App Engine, external HTTP) with configurable retry policies and rate limiting.\n\nKey use cases: deferred processing (send an email after registration), rate-limited API calls to external services, and scheduled work at a specific future time. Configure **retry settings** (maxAttempts, maxBackoff, minBackoff) and **rate limits** (maxConcurrentDispatches, maxDispatchesPerSecond) at the queue level.\n\nFor **deduplication**, Cloud Tasks uses task names — attempting to create a task with the same name within 4 hours returns an `ALREADY_EXISTS` error, preventing duplicate processing. Always design task handlers to be **idempotent** since retries are possible.",
          code: {
            lang: "python",
            label: "Create a Cloud Tasks HTTP task with deduplication",
            snippet: `from google.cloud import tasks_v2
import json

client = tasks_v2.CloudTasksClient()
parent = client.queue_path("my-project", "us-central1", "email-queue")

task = {
    "name": f"{parent}/tasks/send-welcome-user-123",  # dedup key
    "http_request": {
        "http_method": tasks_v2.HttpMethod.POST,
        "url": "https://my-service.run.app/tasks/send-email",
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"user_id": "123"}).encode(),
        "oidc_token": {
            "service_account_email": "task-runner@my-project.iam.gserviceaccount.com"
        },
    },
    "schedule_time": None,  # process immediately
}

client.create_task(parent=parent, task=task)`,
          },
        },
      ],
      quiz: [
        {
          id: "pcd-d4-q1",
          question:
            "A mobile application needs a database that supports real-time data synchronization to connected clients and works offline. Which GCP service is BEST suited?",
          options: [
            "A) Cloud SQL (PostgreSQL).",
            "B) Firestore in Native mode.",
            "C) Cloud Bigtable.",
            "D) BigQuery with streaming inserts.",
          ],
          correctIndex: 1,
          explanation:
            "Firestore Native mode is purpose-built for mobile and web applications with real-time listeners that push updates to clients and SDK-level offline persistence. Cloud SQL (A) requires server-side connection management and has no mobile offline sync. Bigtable (C) is for high-throughput analytics, not mobile sync. BigQuery (D) is an analytics warehouse with no real-time client push capabilities.",
        },
        {
          id: "pcd-d4-q2",
          question:
            "A Cloud Run service needs to connect to a Cloud SQL PostgreSQL instance. Which method is RECOMMENDED for secure, managed connectivity?",
          options: [
            "A) Whitelist the Cloud Run service's external IP in Cloud SQL authorized networks.",
            "B) Use the Cloud SQL Auth Proxy sidecar or the Cloud SQL Go/Python/Java connector.",
            "C) Connect via a VPC connector using the Cloud SQL private IP.",
            "D) Use a Cloud SQL service account key stored in Secret Manager.",
          ],
          correctIndex: 1,
          explanation:
            "The Cloud SQL Auth Proxy and language-specific connectors authenticate using IAM and handle SSL automatically — no IP whitelisting or certificate management required. On Cloud Run, the connector is the simplest approach since it uses the built-in socket mechanism. Whitelisting external IPs (A) is fragile (Cloud Run doesn't have static IPs) and less secure. VPC connectors (C) work but require additional network configuration. Service account keys for SQL connections (D) is not how Cloud SQL authentication works.",
        },
        {
          id: "pcd-d4-q3",
          question:
            "A team needs to give external users temporary, time-limited download access to files stored in a private Cloud Storage bucket without requiring a Google account. What should they use?",
          options: [
            "A) Make the Cloud Storage bucket public with a lifecycle policy to expire access.",
            "B) Generate a signed URL with an expiration time using a service account.",
            "C) Grant the `allUsers` IAM binding on the specific objects.",
            "D) Use Cloud CDN with a Cloud Armor policy to restrict access.",
          ],
          correctIndex: 1,
          explanation:
            "Signed URLs provide temporary, cryptographically signed access to specific Cloud Storage objects. They work without a Google account and expire at a configured time. Making the bucket public (A, C) exposes all objects permanently. Cloud CDN with Armor (D) can restrict geographic access but doesn't provide per-user, time-limited access control.",
        },
        {
          id: "pcd-d4-q4",
          question:
            "A payment processing service needs to trigger a single email notification per order completion, even if the order-complete message is delivered more than once. What should the email handler implement?",
          options: [
            "A) Discard all messages after the first one in a 1-hour window.",
            "B) Idempotent processing — check if the email was already sent (e.g., via Firestore record) before sending.",
            "C) Use a Pub/Sub ordered subscription to ensure exactly-once delivery.",
            "D) Configure Cloud Tasks with a short retry count of 1.",
          ],
          correctIndex: 1,
          explanation:
            "Pub/Sub guarantees **at-least-once** delivery — duplicate messages are possible. The correct pattern is idempotent processing: before sending the email, check a Firestore document (or Cloud SQL record) to see if the order was already processed. If not, send and record. This ensures exactly-once effect regardless of redeliveries. Pub/Sub does not support exactly-once delivery natively (C). Cloud Tasks (D) still retries on failure — the handler must be idempotent.",
        },
        {
          id: "pcd-d4-q5",
          question:
            "An application needs to call a third-party API that allows a maximum of 10 requests per second. The application may receive bursts of hundreds of requests. Which GCP service manages this rate limiting?",
          options: [
            "A) Cloud Armor with rate-based ban rules.",
            "B) Cloud Tasks queue with `maxDispatchesPerSecond` set to 10.",
            "C) Pub/Sub with a pull subscription and throttled polling.",
            "D) Cloud Load Balancing with connection draining.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Tasks queues support `maxDispatchesPerSecond` to rate-limit dispatch to downstream services. Queued tasks are held and dispatched within the rate limit, naturally handling bursts. Cloud Armor (A) applies rate limits to incoming traffic, not outgoing API calls. Pub/Sub pull (C) requires custom throttling logic in the consumer. Load Balancing (D) is for distributing incoming traffic, not rate-limiting outgoing calls.",
        },
        {
          id: "pcd-d4-q6",
          question:
            "A Cloud Run service uses Application Default Credentials to access Firestore. When deployed to Cloud Run with an attached service account, no credentials configuration is needed in the code. Why does this work?",
          options: [
            "A) Cloud Run automatically injects the service account key as an environment variable.",
            "B) The GCP metadata server provides credentials for the attached service account; the client library discovers them automatically via ADC.",
            "C) Firestore grants all Cloud Run services access by default.",
            "D) Cloud Run shares the project owner's credentials with all deployed services.",
          ],
          correctIndex: 1,
          explanation:
            "Application Default Credentials (ADC) checks for credentials in this order: GOOGLE_APPLICATION_CREDENTIALS env var → `gcloud auth application-default` credentials → GCP metadata server. On Cloud Run, the metadata server provides tokens for the attached service account. Client libraries use ADC automatically — no key file needed. The service account must have appropriate Firestore IAM roles on the project.",
        },
        {
          id: "pcd-d4-q7",
          question:
            "A team needs to process large files uploaded to Cloud Storage. When a file is uploaded, a Cloud Function should start processing. Which trigger type should be configured?",
          options: [
            "A) HTTP trigger with a Cloud Scheduler job polling Cloud Storage.",
            "B) Eventarc trigger on `google.cloud.storage.object.v1.finalized` event.",
            "C) Pub/Sub trigger with a Cloud Storage notification to a topic.",
            "D) Both B and C are valid approaches.",
          ],
          correctIndex: 3,
          explanation:
            "Both approaches work for Cloud Functions (Gen 2). **Eventarc** provides a unified eventing layer that directly triggers functions on Cloud Storage events. **Cloud Storage notifications to Pub/Sub** is the older pattern — Pub/Sub delivers the event, Cloud Functions has a Pub/Sub trigger. Gen 2 Cloud Functions prefer Eventarc, but both are valid. The exam may test both patterns.",
        },
        {
          id: "pcd-d4-q8",
          question:
            "A Cloud Spanner database is being considered for a gaming leaderboard that needs strong consistency across regions and must handle thousands of writes per second. What is a best practice for schema design to avoid write hotspots?",
          options: [
            "A) Use sequential auto-increment integers as primary keys.",
            "B) Use UUIDs or hash-based primary keys to distribute writes across splits.",
            "C) Use timestamp-based primary keys to sort leaderboard entries.",
            "D) Use a single row per user that is updated on every score change.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Spanner automatically shards data across splits based on primary key range. Sequential integers cause all writes to go to the same split (the 'hotspot'), limiting throughput. UUIDs or bit-reversed integers distribute writes evenly across splits. Timestamp-based keys (C) also cause hotspots — recent data concentrates on the same split. Single-row updates (D) create contention on that row during high write volume.",
        },
        {
          id: "pcd-d4-q9",
          question:
            "An application stores user-uploaded images in Cloud Storage. Images older than 90 days should be moved to cheaper storage, and deleted after 1 year. Which feature automates this?",
          options: [
            "A) A Cloud Scheduler job that runs a Cloud Function to check and move old objects.",
            "B) Cloud Storage lifecycle rules with `SetStorageClass` and `Delete` actions.",
            "C) Retention policies on the bucket with a 90-day minimum.",
            "D) A Cloud Dataflow pipeline that periodically scans and migrates objects.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Storage **lifecycle rules** automate object management based on age, storage class, and other conditions. A `SetStorageClass` action can downgrade objects to Nearline (after 30 days), Coldline (after 90 days), or Archive (after 365 days). A `Delete` action removes objects at 365 days. This is fully managed with no code required. Cloud Scheduler + Cloud Function (A) and Dataflow (D) require custom code. Retention policies (C) prevent deletion, not automate it.",
        },
        {
          id: "pcd-d4-q10",
          question:
            "A backend service needs to upload a large file (5 GB) to Cloud Storage. Which upload method should be used?",
          options: [
            "A) Simple upload — send the entire 5 GB in a single HTTP request.",
            "B) Resumable upload — initiate an upload session and send the file in chunks.",
            "C) Streaming upload via the `gsutil cp` command from the application.",
            "D) Multipart upload with a single request containing the file and metadata.",
          ],
          correctIndex: 1,
          explanation:
            "**Resumable uploads** are required for objects larger than 5 MB and strongly recommended for any large file. The client initiates an upload session, receiving a session URI. The file is sent in chunks; if the connection drops, the upload can be resumed from the last byte received. Simple uploads (A) cannot handle large files and will fail or timeout. `gsutil cp` (C) is a CLI tool, not a programmatic API. Multipart upload (D) is for files with metadata in a single request — it has the same reliability issues as simple upload for large files.",
        },
      ],
    },

    // ─── Domain 5: Managing Application Performance Monitoring (15%) ───
    {
      id: "domain-5",
      title: "Managing Application Performance Monitoring",
      weight: "15%",
      order: 5,
      summary:
        "This domain covers using Google Cloud's observability suite to monitor, debug, and improve application performance. You must understand **Cloud Trace** for distributed tracing, **Cloud Profiler** for CPU and memory profiling, **Error Reporting** for aggregating application exceptions, and **Cloud Logging** for structured log management. Together with **Cloud Monitoring**, these tools form the full observability stack for GCP applications.\n\nExpect questions about setting up alerting policies based on SLOs, using structured logging with severity levels, tracing requests across microservices, and interpreting profiler flame graphs. You should understand the difference between metrics, logs, and traces, and when to use each for diagnosing performance issues.",
      keyConceptsForExam: [
        "**Cloud Trace** — distributed tracing, latency analysis across microservices, trace sampling, integration with Cloud Run and GKE automatically",
        "**Cloud Profiler** — continuous CPU and memory profiling, flame graphs, no significant performance overhead, language support (Go, Java, Python, Node.js)",
        "**Error Reporting** — automatic exception aggregation, deduplication, first-seen/last-seen timestamps, notification integration",
        "**Cloud Logging** — structured JSON logs, log-based metrics, log sinks (BigQuery, Pub/Sub, Cloud Storage), log exclusion filters",
        "**SLOs and Alerting** — Service Level Objectives in Cloud Monitoring, alerting policies on latency/error rate, notification channels (email, PagerDuty, Slack)",
      ],
      examTips: [
        "Cloud Trace is automatically enabled for Cloud Run and App Engine — no code changes needed for basic latency tracing. For GKE, add the Cloud Trace agent or use OpenTelemetry instrumentation.",
        "Error Reporting requires no separate setup — it automatically parses error messages and stack traces from Cloud Logging for supported runtimes (Python, Java, Node.js, Go, Ruby, PHP, .NET).",
        "Log-based metrics let you create custom Cloud Monitoring metrics from log entries (e.g., count of 500-error log entries) — use these when a Cloud Monitoring metric doesn't already exist.",
      ],
      relatedTopics: [
        { cloud: "gcp", topicId: "cloud-logging", title: "Cloud Logging" },
        { cloud: "gcp", topicId: "cloud-monitoring", title: "Cloud Monitoring" },
      ],
      sections: [
        {
          heading: "Distributed Tracing with Cloud Trace",
          body: "**Cloud Trace** provides distributed tracing to understand end-to-end latency across microservices. A **trace** represents a single user request as it flows through multiple services. Each step is a **span** — spans form a tree showing which service called which and how long each took.\n\nCloud Run, App Engine, and Cloud Functions automatically generate trace data. For GKE or Compute Engine workloads, use the **Cloud Trace API** or instrument with **OpenTelemetry** and export to Cloud Trace. Propagate trace context (using W3C `traceparent` headers or Google's `X-Cloud-Trace-Context` header) between services to stitch spans into a complete trace.\n\n**Latency analysis** in Cloud Trace shows percentile distributions (p50, p95, p99) of request latency. Use this to identify slow operations, database queries, or external API calls that inflate tail latency.",
          code: {
            lang: "python",
            label: "OpenTelemetry tracing with Cloud Trace export",
            snippet: `from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.cloud_trace import CloudTraceSpanExporter

# Configure Cloud Trace exporter
tracer_provider = TracerProvider()
tracer_provider.add_span_processor(
    BatchSpanProcessor(CloudTraceSpanExporter())
)
trace.set_tracer_provider(tracer_provider)

tracer = trace.get_tracer(__name__)

def process_order(order_id: str):
    with tracer.start_as_current_span("process_order") as span:
        span.set_attribute("order.id", order_id)
        # fetch_inventory creates a child span
        with tracer.start_as_current_span("fetch_inventory"):
            inventory = fetch_inventory(order_id)
        return inventory`,
          },
        },
        {
          heading: "Structured Logging and Error Reporting",
          body: "**Structured logging** (JSON format) is the recommended practice for Cloud Logging. Structured logs are machine-parseable, enabling powerful filtering, log-based metrics, and automated analysis. Include `severity`, `message`, `httpRequest`, and custom fields relevant to your application (e.g., `user_id`, `order_id`, `trace`).\n\nUse the `logging.googleapis.com/trace` field in log entries to correlate logs with Cloud Trace traces — logs and traces are linked automatically in Cloud Console when this field matches the trace ID.\n\n**Error Reporting** aggregates errors from Cloud Logging automatically for supported runtimes. It groups similar errors, shows occurrence count, first/last seen, and can send notifications via email or PagerDuty when new error types are detected. For custom runtimes, write error logs with the `ERROR` severity and a stack trace — Error Reporting will parse them.\n\nCreate **log-based metrics** to count specific log entries (e.g., `httpRequest.status >= 500`) and alert via Cloud Monitoring when thresholds are exceeded.",
          code: {
            lang: "python",
            label: "Structured logging with severity and trace correlation",
            snippet: `import json
import logging
import os

class StructuredLogger:
    def __init__(self, service: str):
        self.service = service

    def log(self, severity: str, message: str, **fields):
        entry = {
            "severity": severity,
            "message": message,
            "service": self.service,
            **fields,
        }
        # Cloud Run injects TRACE env var from X-Cloud-Trace-Context
        trace = os.environ.get("TRACE_ID")
        if trace:
            entry["logging.googleapis.com/trace"] = (
                f"projects/{os.environ['GOOGLE_CLOUD_PROJECT']}/traces/{trace}"
            )
        print(json.dumps(entry))

    def error(self, message: str, exc: Exception = None, **fields):
        import traceback
        if exc:
            fields["stack_trace"] = traceback.format_exc()
        self.log("ERROR", message, **fields)

logger = StructuredLogger("order-service")
logger.log("INFO", "Order processed", order_id="123", amount=99.99)`,
          },
        },
      ],
      quiz: [
        {
          id: "pcd-d5-q1",
          question:
            "A team notices that their Cloud Run service has high p99 latency but acceptable p50 latency. Which tool provides the BEST insight into what is causing the tail latency?",
          options: [
            "A) Cloud Monitoring — view the request_latencies metric dashboard.",
            "B) Cloud Trace — analyze individual slow traces to identify slow spans.",
            "C) Cloud Profiler — view CPU flame graphs for the slow requests.",
            "D) Error Reporting — check if errors correlate with slow requests.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Trace shows individual request traces with per-span latency breakdowns. High p99 latency means a small percentage of requests are very slow — trace analysis reveals which span (database query, downstream API, etc.) is the bottleneck for those specific requests. Cloud Monitoring (A) shows aggregate latency distributions but not root causes. Cloud Profiler (C) shows CPU/memory usage patterns, not per-request latency. Error Reporting (D) focuses on exceptions, not latency.",
        },
        {
          id: "pcd-d5-q2",
          question:
            "A Python Cloud Run service crashes with an unhandled exception. The developer wants to be notified immediately and see the full stack trace. Which services provide this capability automatically?",
          options: [
            "A) Cloud Monitoring alert on the error rate metric.",
            "B) Error Reporting — it automatically groups exceptions and notifies on new error types.",
            "C) Cloud Debugger — it captures exception snapshots automatically.",
            "D) Cloud Trace — it records exceptions as span events.",
          ],
          correctIndex: 1,
          explanation:
            "Error Reporting automatically parses stack traces from Cloud Logging for Python (and other supported runtimes) running on Cloud Run. It groups similar errors, shows occurrence counts, and sends notifications when new error types appear. Cloud Monitoring (A) requires a manually configured log-based metric and alert. Cloud Debugger (C) is for debugging running code, not exception aggregation. Cloud Trace (D) records latency spans, not exception aggregation.",
        },
        {
          id: "pcd-d5-q3",
          question:
            "A team wants to alert on-call engineers when the number of HTTP 500 responses exceeds 10 per minute for more than 5 minutes. Cloud Monitoring does not have a built-in 500-error-count metric. What should they create?",
          options: [
            "A) A Cloud Trace filter for spans with `http.status_code=500`.",
            "B) A log-based metric counting log entries where `httpRequest.status >= 500`, then an alerting policy on that metric.",
            "C) An Error Reporting notification for error rate exceeding a threshold.",
            "D) A Cloud Function triggered by Cloud Logging that sends a PagerDuty alert.",
          ],
          correctIndex: 1,
          explanation:
            "Log-based metrics extract numerical values from log entries, creating custom Cloud Monitoring metrics. A counter metric on `httpRequest.status >= 500` creates a metric that Cloud Monitoring can alert on with duration conditions. Error Reporting (C) aggregates exceptions but doesn't provide rate-based alerting against a threshold with a duration window. Cloud Functions (D) are a workaround — log-based metrics + alerting is the purpose-built solution.",
        },
        {
          id: "pcd-d5-q4",
          question:
            "A GKE application runs multiple microservices. The team wants to trace requests as they flow through the services. Which header must services propagate to link spans into a complete trace?",
          options: [
            "A) `Authorization` header with the service account token.",
            "B) `X-Cloud-Trace-Context` or W3C `traceparent` header with the trace ID.",
            "C) `X-Request-ID` header with a UUID.",
            "D) `Content-Type: application/trace+json` header.",
          ],
          correctIndex: 1,
          explanation:
            "Distributed tracing requires propagating trace context between services so spans can be assembled into a complete trace tree. Google Cloud uses `X-Cloud-Trace-Context` (format: `TRACE_ID/SPAN_ID;o=TRACE_TRUE`) or the W3C standard `traceparent` header. When a service receives a request with this header, it starts a child span using the parent's trace ID. Without propagation, each service creates isolated traces.",
        },
        {
          id: "pcd-d5-q5",
          question:
            "A team wants to analyze application CPU usage to find functions that consume excessive CPU time in production. Which tool provides this without significant performance overhead?",
          options: [
            "A) Cloud Trace — review high-CPU spans.",
            "B) Cloud Profiler — continuous profiling with flame graph visualization.",
            "C) Cloud Monitoring — CPU utilization metric on the Cloud Run service.",
            "D) Adding `time.time()` instrumentation around every function call.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Profiler provides continuous, low-overhead profiling (typically < 1% overhead) of CPU time, heap memory, and goroutine/thread usage. Flame graphs visualize which functions consume the most CPU. It integrates with Python, Go, Java, and Node.js via a profiling agent. Cloud Trace (A) measures request latency, not CPU-level function profiling. Cloud Monitoring CPU metrics (C) show aggregate instance utilization, not per-function breakdown. Manual timing (D) is invasive and requires code changes.",
        },
        {
          id: "pcd-d5-q6",
          question:
            "A company needs to retain application logs for 7 years for compliance. Cloud Logging's default retention is 30 days for most logs. What should they configure?",
          options: [
            "A) Increase Cloud Logging retention to 7 years in the log bucket settings.",
            "B) Create a log sink to export logs to Cloud Storage with a lifecycle policy retaining for 7 years.",
            "C) Export logs to BigQuery and configure a dataset expiration of 7 years.",
            "D) Both B and C are valid approaches for long-term retention.",
          ],
          correctIndex: 3,
          explanation:
            "Cloud Logging supports up to 30 days retention in `_Default` buckets, but custom log buckets can be configured for up to 3650 days (10 years). For cost-effective long-term archival, log sinks to **Cloud Storage** (B) are the standard approach — cheap archival storage with configurable lifecycle. Exporting to **BigQuery** (C) also works for queryable long-term storage. Both are correct — the exam accepts either approach for compliance archival.",
        },
        {
          id: "pcd-d5-q7",
          question:
            "A developer wants to correlate Cloud Run request logs with their application logs for the same request. What field should be included in structured application log entries?",
          options: [
            "A) `requestId` matching the Cloud Run generated request ID.",
            "B) `logging.googleapis.com/trace` with the trace ID from the `X-Cloud-Trace-Context` header.",
            "C) `spanId` from the Cloud Run metadata server.",
            "D) `correlationId` — a Cloud Logging reserved field for request correlation.",
          ],
          correctIndex: 1,
          explanation:
            "The `logging.googleapis.com/trace` field in a structured log entry links that log to a Cloud Trace trace. Cloud Run's platform request logs already include the trace ID. Application logs with the same trace ID are grouped together in Cloud Logging's request-centric view. Extract the trace ID from the `X-Cloud-Trace-Context` header and include it in all log entries for that request. Cloud Logging does not have a `correlationId` reserved field (D).",
        },
        {
          id: "pcd-d5-q8",
          question:
            "A team defines an SLO for their API: 99% of requests must complete in under 200ms over a 30-day window. Which Cloud Monitoring feature lets them track this SLO and alert when it is at risk?",
          options: [
            "A) Uptime checks with a 200ms timeout threshold.",
            "B) Service Level Objectives (SLOs) in Cloud Monitoring with a latency threshold and burn rate alerting.",
            "C) Custom dashboards showing p99 latency over a 30-day period.",
            "D) Cloud Trace latency analysis with a 200ms filter.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Monitoring's **Service Level Objectives** feature allows defining request-based SLOs (e.g., 99% of requests under 200ms) with a compliance period. **Burn rate alerting** triggers alerts when the error budget is being consumed faster than expected — allowing teams to respond before the SLO is violated. Uptime checks (A) test endpoint availability, not latency distributions. Custom dashboards (C) provide visibility but not automated alerting. Cloud Trace (D) shows traces but doesn't track SLO compliance.",
        },
        {
          id: "pcd-d5-q9",
          question:
            "A security team wants to audit all access to a sensitive Cloud Storage bucket. Which Cloud Logging log type captures data access events?",
          options: [
            "A) Admin Activity audit logs — enabled by default.",
            "B) Data Access audit logs — must be enabled per service.",
            "C) VPC Flow Logs — captures all network traffic including Cloud Storage.",
            "D) Cloud Trace spans — records all Cloud Storage API calls.",
          ],
          correctIndex: 1,
          explanation:
            "**Data Access audit logs** capture read and write operations on data — for Cloud Storage, this includes object reads, writes, and metadata operations. They must be explicitly enabled as they can generate high log volumes and costs. **Admin Activity logs** (A) capture administrative operations (creating/deleting buckets) and are always on. VPC Flow Logs (C) capture network flow metadata, not API calls. Cloud Trace (D) records latency spans, not security audit events.",
        },
        {
          id: "pcd-d5-q10",
          question:
            "After deploying a new version of a Java application to GKE, the team notices increased heap memory usage. Which tool helps identify which objects are consuming memory?",
          options: [
            "A) Cloud Monitoring — view the memory utilization metric for the GKE pod.",
            "B) Cloud Profiler — heap profiling shows memory allocation by function and object type.",
            "C) Cloud Trace — memory spans show allocation events.",
            "D) Error Reporting — OutOfMemoryErrors are automatically reported.",
          ],
          correctIndex: 1,
          explanation:
            "Cloud Profiler supports **heap profiling** for Java (and other languages), showing which functions and code paths are allocating memory. The flame graph visualizes the call stack leading to allocations, helping identify memory leaks or unexpectedly large object retention. Cloud Monitoring (A) shows aggregate memory usage at the pod level, not per-function allocation. Cloud Trace (C) measures latency, not memory. Error Reporting (D) captures OOM errors after they occur — Profiler helps prevent them by identifying the cause.",
        },
      ],
    },
  ],
};
