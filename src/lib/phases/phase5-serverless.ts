// Inline type definitions — do not import from content.ts

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

// ─── AWS API Gateway ──────────────────────────────────────────────────────────

export const apiGatewayTopic: Topic = {
  id: "api-gateway",
  title: "API Gateway — Managed HTTP APIs",
  level: "Intermediate",
  readTime: "10 min",
  category: "Compute",
  summary:
    "API Gateway is AWS's fully managed service for creating, publishing, and securing HTTP, REST, and WebSocket APIs at any scale — with built-in throttling, auth, and TLS termination.",
  gcpEquivalent: "Cloud Endpoints / API Gateway",
  azureEquivalent: "Azure API Management",
  sections: [
    {
      heading: "What is API Gateway?",
      body: "API Gateway sits in front of your backend (Lambda, HTTP endpoints, or other AWS services) and handles the HTTP layer for you.\n\nIt offers three distinct API types:\n• **REST API** — fully featured: request/response transformation, usage plans, API keys, caching\n• **HTTP API** — lightweight and 70% cheaper; supports JWT auth and Lambda/HTTP proxy only\n• **WebSocket API** — persistent two-way connections, ideal for real-time apps (chat, live dashboards)\n\n**Deployment flavours:** Regional (traffic stays in-region) or Edge-Optimised (routed through CloudFront's global edge network). Managed TLS is included on all deployment types — no certificate management required.",
    },
    {
      heading: "HTTP API vs REST API",
      body: "Choosing between HTTP API and REST API depends on the features you need versus the cost you want to pay.\n\n**HTTP API** — use by default for new projects:\n• ~$1/million requests vs ~$3.50 for REST API\n• JWT authorizer (Cognito, Auth0, any OIDC provider) built-in\n• Lambda proxy and HTTP proxy integrations only\n• No request/response transformation, no API keys, no usage plans\n\n**REST API** — use when you need advanced features:\n• **API keys** and **usage plans** (rate-limit per API key)\n• **Request validation** (validate body/query params against a JSON Schema)\n• **Mapping templates** (transform request/response payloads with Velocity)\n• **Response caching** (reduce Lambda invocations, configurable TTL)\n• **WAF integration** at the API level\n\nRule of thumb: start with HTTP API; migrate to REST API only when you need a specific REST API-only feature.",
    },
    {
      heading: "Integrate with Lambda",
      body: "The most common pattern is a **Lambda proxy integration** — API Gateway forwards the entire HTTP request as a structured event to your function, and your function returns the HTTP response.\n\nFor HTTP API, the payload format defaults to **version 2.0** (simpler than the v1.0 format used by REST API). The event includes `routeKey`, `rawPath`, `headers`, `queryStringParameters`, and `body`.",
      code: {
        lang: "bash",
        label: "Create HTTP API + Lambda integration",
        snippet: `# 1. Create the HTTP API
API_ID=$(aws apigatewayv2 create-api \\
  --name my-http-api \\
  --protocol-type HTTP \\
  --query ApiId --output text)

# 2. Create Lambda integration (proxy, payload format 2.0)
INTEGRATION_ID=$(aws apigatewayv2 create-integration \\
  --api-id $API_ID \\
  --integration-type AWS_PROXY \\
  --integration-uri arn:aws:lambda:ap-southeast-1:123456789:function:my-fn \\
  --payload-format-version 2.0 \\
  --query IntegrationId --output text)

# 3. Create a route
aws apigatewayv2 create-route \\
  --api-id $API_ID \\
  --route-key "GET /hello" \\
  --target "integrations/$INTEGRATION_ID"

# 4. Deploy to $default stage (auto-deploy enabled)
aws apigatewayv2 create-stage \\
  --api-id $API_ID \\
  --stage-name '$default' \\
  --auto-deploy

# 5. Grant API Gateway permission to invoke the function
aws lambda add-permission \\
  --function-name my-fn \\
  --statement-id apigateway-invoke \\
  --action lambda:InvokeFunction \\
  --principal apigateway.amazonaws.com \\
  --source-arn "arn:aws:execute-api:ap-southeast-1:123456789:$API_ID/*"

echo "Endpoint: https://$API_ID.execute-api.ap-southeast-1.amazonaws.com/hello"`,
      },
    },
    {
      heading: "Auth options",
      body: "API Gateway supports three distinct auth mechanisms — pick based on your identity architecture:\n\n• **JWT authorizer** (HTTP API only) — validates a Bearer token against an OIDC/OAuth2 issuer (Cognito user pool, Auth0, Google Identity). Zero code required; configure `issuer` and `audience` in the authorizer. Best choice for modern SPAs and mobile apps.\n• **Lambda authorizer** (REST API and HTTP API) — a Lambda function that receives the token and returns an IAM policy or a simple `isAuthorized` boolean. Use when you need custom token formats, database lookups, or multi-tenant logic that a standard JWT check can't express.\n• **API keys** (REST API only) — a static key sent in the `x-api-key` header. Not a security mechanism on its own; combine with usage plans to **rate-limit and quota** per consumer (partner APIs, internal services). Never use API keys as the sole auth for user-facing APIs.\n\nFor most greenfield APIs backed by Cognito, use the **JWT authorizer on HTTP API** — it's the simplest, cheapest, and most maintainable option.",
    },
    {
      heading: "Throttling & quotas",
      body: "API Gateway applies throttling at two levels to protect your backend and your AWS account limits.\n\n**Account-level defaults (per region):**\n• Steady-state limit: **10,000 requests/second**\n• Burst limit: **5,000 requests** (token bucket)\n\nWhen either limit is exceeded, API Gateway returns **HTTP 429 Too Many Requests**. Your clients should implement exponential back-off with jitter.\n\n**Per-route throttling** (REST API and HTTP API):\n• Set `DefaultRouteThrottlingConfig` on a stage, or override per route\n• Use REST API **usage plans** to apply distinct rate and quota limits per API key\n\n**Best practices:**\n• Request a limit increase in the AWS Service Quotas console before launch if you expect >5k req/s bursts\n• Return `Retry-After` headers from your Lambda so clients know when to retry\n• Monitor `4XXError` and `5XXError` CloudWatch metrics — a spike in 429s indicates under-provisioned throttle limits",
    },
  ],
};

// ─── GCP Cloud Functions ──────────────────────────────────────────────────────

export const cloudFunctionsTopic: Topic = {
  id: "cloud-functions",
  title: "Cloud Functions — Event-Driven Serverless",
  level: "Beginner",
  readTime: "8 min",
  category: "Compute",
  summary:
    "Cloud Functions is GCP's fully managed serverless runtime for event-driven code. Write a function, deploy it, and GCP handles servers, scaling, and availability.",
  awsEquivalent: "AWS Lambda",
  azureEquivalent: "Azure Functions",
  sections: [
    {
      heading: "What is Cloud Functions?",
      body: "Cloud Functions lets you run code in response to events without provisioning or managing servers. GCP handles all infrastructure — OS, runtime patches, auto-scaling, and high availability.\n\nTwo generations are available:\n• **1st gen** — original runtime; one concurrent request per instance, 9-minute timeout, up to 8GB memory\n• **2nd gen** — built on Cloud Run; supports **concurrency** (multiple requests per instance), 60-minute timeout, up to 32GB memory, and **Eventarc** as the event backbone\n\n**Trigger styles:**\n• **HTTP triggers** — synchronous; function returns an HTTP response directly\n• **Event triggers** — asynchronous; function processes events from Pub/Sub, Cloud Storage, Firestore, etc.\n\nFor new projects, default to **2nd gen** — it has lower cold-start overhead, better concurrency, and broader Eventarc event support.",
    },
    {
      heading: "Triggers",
      body: "Cloud Functions can be invoked by a wide range of GCP events:\n\n• **HTTP** — a public or authenticated HTTPS endpoint; the function receives a standard HTTP request object\n• **Pub/Sub** — the function is subscribed to a topic; invoked once per message, receives base64-encoded message data\n• **Cloud Storage** — triggers on object finalise, delete, archive, or metadata update events within a bucket\n• **Eventarc (2nd gen)** — unified event bus supporting 90+ GCP event types (Audit Logs, Pub/Sub, direct events from GCS, Artifact Registry, etc.) plus custom CloudEvents\n• **Firestore** — triggers on document create, update, delete, or write within a specific collection\n\nEventarc is the recommended trigger mechanism for 2nd gen functions — it provides a consistent event format (CloudEvents spec) and a single place to manage routing rules.",
    },
    {
      heading: "Write and deploy a function",
      body: "An HTTP Cloud Function in Node.js receives an Express-compatible `Request` and `Response` object. The 2nd gen runtime uses the same programming model.",
      code: {
        lang: "javascript",
        label: "HTTP function (Node.js)",
        snippet: `// index.js — 2nd gen HTTP Cloud Function
const { http } = require("@google-cloud/functions-framework");

http("helloEngineer", (req, res) => {
  const name = req.query.name ?? "Engineer";
  res.json({ message: \`Hello, \${name}! Running on Cloud Functions.\` });
});`,
      },
    },
    {
      heading: "Deploy via gcloud CLI",
      body: "Deploy the function with `gcloud functions deploy`. The `--gen2` flag targets the 2nd gen runtime.",
      code: {
        lang: "bash",
        label: "Deploy Cloud Function (2nd gen)",
        snippet: `# Deploy an HTTP-triggered function
gcloud functions deploy hello-engineer \\
  --gen2 \\
  --runtime=nodejs22 \\
  --region=asia-southeast1 \\
  --source=. \\
  --entry-point=helloEngineer \\
  --trigger-http \\
  --allow-unauthenticated \\
  --memory=256Mi \\
  --timeout=30s \\
  --min-instances=0 \\
  --max-instances=50

# Retrieve the trigger URL
gcloud functions describe hello-engineer \\
  --gen2 --region=asia-southeast1 \\
  --format="value(serviceConfig.uri)"

# Invoke via curl
curl "$(gcloud functions describe hello-engineer \\
  --gen2 --region=asia-southeast1 \\
  --format='value(serviceConfig.uri)')?name=CloudCompass"`,
      },
    },
    {
      heading: "Cold starts and concurrency",
      body: "Cold starts occur when GCP must initialise a new function instance — this adds 200ms–2s of latency on top of your function's execution time.\n\n**1st gen behaviour:** each instance handles **one request at a time**. Under concurrent load, GCP spawns many instances in parallel — each a potential cold start.\n\n**2nd gen behaviour:** each instance can handle **up to 1,000 concurrent requests** (configurable via `--concurrency`). Far fewer instances are needed, reducing total cold starts significantly.\n\n**Strategies to minimise cold starts:**\n• Set `--min-instances=1` (or higher) to keep warm instances ready — you pay for idle time but eliminate cold starts entirely\n• Keep the deployment package small; avoid heavy `require`/`import` chains at module load\n• Move expensive initialisation (DB connections, config loads) outside the handler function so it runs once per instance\n• Use `--concurrency` with 2nd gen to serve more traffic from fewer warm instances\n\nFor latency-sensitive endpoints (payments, auth), `--min-instances=1` is usually worth the cost (~$5–15/month for a single always-warm instance).",
    },
    {
      heading: "Cloud Scheduler integration",
      body: "Cloud Scheduler is GCP's managed cron service. It can invoke Cloud Functions on a schedule via HTTP or Pub/Sub.\n\nHTTP invocation is simpler for 2nd gen functions — Scheduler calls the function's HTTPS endpoint directly with an OIDC token for authentication.",
      code: {
        lang: "bash",
        label: "Scheduled Cloud Function via Cloud Scheduler",
        snippet: `# Get the function URL
FUNC_URL=$(gcloud functions describe hello-engineer \\
  --gen2 --region=asia-southeast1 \\
  --format="value(serviceConfig.uri)")

# Create a Cloud Scheduler job (runs every day at 08:00 SGT / 00:00 UTC)
gcloud scheduler jobs create http daily-hello \\
  --location=asia-southeast1 \\
  --schedule="0 0 * * *" \\
  --uri="$FUNC_URL?name=Scheduler" \\
  --http-method=GET \\
  --oidc-service-account-email=scheduler-sa@my-project.iam.gserviceaccount.com \\
  --oidc-token-audience="$FUNC_URL"

# Trigger the job manually to test
gcloud scheduler jobs run daily-hello --location=asia-southeast1

# View recent job execution history
gcloud scheduler jobs describe daily-hello --location=asia-southeast1`,
      },
    },
  ],
};
