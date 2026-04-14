import type { Certification } from "./types";

export const awsDvaC02: Certification = {
  id: "aws-dva-c02",
  title: "AWS Developer Associate",
  code: "DVA-C02",
  cloud: "aws",
  level: "Associate",
  description:
    "Validate your ability to develop, deploy, and debug cloud-based applications on AWS. Covers serverless computing, CI/CD pipelines, security best practices for developers, and application optimization.",
  examFormat: {
    questions: 65,
    duration: "130 minutes",
    passingScore: "720/1000",
    cost: "$150 USD",
  },
  domains: [
    // ─── Domain 1: Development with AWS Services (32%) ───────────────
    {
      id: "domain-1",
      title: "Development with AWS Services",
      weight: "32%",
      order: 1,
      summary:
        "This domain covers the core AWS services that developers use to build cloud-native and serverless applications. It carries the largest weight on the exam (32%), reflecting the breadth of services a developer must understand to build production-grade applications on AWS.\n\nExpect scenario-based questions on **AWS Lambda** function configuration, invocation models, and integration with event sources. You will also be tested on **Amazon API Gateway** (REST vs. HTTP APIs), **DynamoDB** data modeling and query patterns, **S3** operations with SDKs, and message-passing services such as **SQS**, **SNS**, and **EventBridge**.\n\nKey services to master include Lambda, API Gateway, DynamoDB, S3, SQS, SNS, Kinesis, Step Functions, and AppSync. Questions often combine multiple services — for example, building an event-driven pipeline using S3 events, Lambda, SQS, and DynamoDB in a single scenario.",
      keyConceptsForExam: [
        "**AWS Lambda** — execution model, cold starts, concurrency (reserved vs. provisioned), layers, environment variables, and event source mappings",
        "**Amazon API Gateway** — REST API vs. HTTP API vs. WebSocket API, integration types (Lambda proxy, HTTP, AWS), mapping templates, and usage plans",
        "**DynamoDB** — partition key design, sort keys, GSIs vs. LSIs, `GetItem`/`Query`/`Scan` differences, and DynamoDB Streams",
        "**Amazon SQS** — standard vs. FIFO queues, visibility timeout, dead-letter queues, long polling vs. short polling",
        "**Amazon SNS** — fan-out pattern, message filtering, SNS-to-SQS integration",
        "**AWS Step Functions** — state machine types (Standard vs. Express), task states, error handling with `Catch` and `Retry`",
        "**Amazon Kinesis** — Data Streams shards, partition keys, enhanced fan-out, vs. SQS for streaming use cases",
        "**AWS SDKs** — retry logic with exponential backoff, pagination with `NextToken`, and presigned URLs for S3",
      ],
      examTips: [
        "When a question asks about ordering guarantees, FIFO SQS is the answer — standard queues offer best-effort ordering only.",
        "Lambda cold starts are reduced by provisioned concurrency — remember that reserved concurrency limits the maximum concurrent executions and does NOT eliminate cold starts.",
        "DynamoDB `Query` requires a partition key; `Scan` reads every item — `Scan` is always the wrong answer when performance matters.",
        "For fanout to multiple consumers, use SNS-to-SQS (each consumer gets its own SQS queue) — this decouples producers from consumers and enables independent scaling.",
        "Step Functions Standard Workflows are for long-running, durable workflows; Express Workflows are for high-volume, short-duration workloads — know the differences in pricing and execution history.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "lambda-in-depth", title: "Lambda In Depth" },
        {
          cloud: "aws",
          topicId: "dynamodb-deep-dive",
          title: "DynamoDB Deep Dive",
        },
        { cloud: "aws", topicId: "s3-deep-dive", title: "S3 Deep Dive" },
      ],
      sections: [
        {
          heading: "Lambda Invocation Models",
          body: "Lambda supports three invocation models, each suited to different workloads:\n\n**Synchronous invocation** — the caller waits for the response. API Gateway, ALB, and SDK calls use this model. Errors are returned directly to the caller, so retry logic must be implemented by the caller.\n\n**Asynchronous invocation** — the caller receives a 202 immediately and Lambda retries failed invocations up to twice. S3 event notifications, SNS, and EventBridge use this model. Configure a **Dead Letter Queue** (SQS or SNS) or a **Lambda destination** to capture failed events.\n\n**Poll-based (event source mapping)** — Lambda polls the source (SQS, Kinesis, DynamoDB Streams, MSK) and invokes the function with a batch of records. For SQS, Lambda scales by adding pollers; for Kinesis, one shard maps to one concurrent Lambda invocation. Understanding these differences is critical for exam questions about error handling and throughput.",
          code: {
            lang: "python",
            label: "Lambda handler with SQS event source mapping",
            snippet: `import json

def handler(event, context):
    failed_items = []
    for record in event["Records"]:
        try:
            body = json.loads(record["body"])
            process_message(body)
        except Exception as e:
            # Return partial batch failures so only failed messages go to DLQ
            failed_items.append({"itemIdentifier": record["messageId"]})

    return {"batchItemFailures": failed_items}

def process_message(body):
    print(f"Processing: {body}")`,
          },
        },
        {
          heading: "DynamoDB Data Modeling",
          body: "DynamoDB is a **key-value and document** NoSQL database that scales horizontally. The partition key determines which physical partition stores the item — a well-chosen partition key distributes load evenly and avoids **hot partition** problems.\n\nFor access patterns that require querying on non-key attributes, use a **Global Secondary Index (GSI)**. GSIs have their own provisioned throughput and are eventually consistent. A **Local Secondary Index (LSI)** shares the partition key of the base table and must be created at table creation time.\n\nThe exam frequently tests the difference between `Query` (requires partition key, returns items in sort key order) and `Scan` (reads every item — expensive). Use **DynamoDB Streams** with Lambda for change data capture patterns. **Conditional expressions** implement optimistic locking, preventing lost updates in concurrent environments.",
          code: {
            lang: "python",
            label: "DynamoDB conditional put to prevent overwrites",
            snippet: `import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Orders")

def create_order_if_not_exists(order_id, item):
    try:
        table.put_item(
            Item={"orderId": order_id, **item},
            ConditionExpression="attribute_not_exists(orderId)"
        )
        return True
    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return False  # Item already exists
        raise`,
          },
        },
        {
          heading: "SQS and SNS Messaging Patterns",
          body: "**Amazon SQS** decouples producers from consumers using a pull model. The **visibility timeout** temporarily hides a message after a consumer reads it — if processing completes, the consumer deletes the message; if not, it reappears in the queue for another consumer.\n\nFor **FIFO queues**, use a `MessageGroupId` to partition ordering within the queue and a `MessageDeduplicationId` (or enable content-based deduplication) to prevent duplicate processing. FIFO queues are limited to 3,000 messages/second with batching.\n\n**Amazon SNS** uses a push model to fan out messages to multiple subscribers (SQS queues, Lambda functions, HTTP/S endpoints, email). The **SNS-to-SQS fan-out pattern** ensures each consumer processes every message independently, handles backpressure, and supports replay via the queue. **Message filtering** on SNS subscriptions lets each queue receive only the message types it cares about.",
        },
      ],
      quiz: [
        {
          id: "dva-d1-q1",
          question:
            "A Lambda function processes messages from an SQS standard queue. During load testing, you observe that some messages are processed more than once. What is the MOST likely cause?",
          options: [
            "A) The Lambda function is timing out and the visibility timeout is shorter than the function duration, causing messages to reappear.",
            "B) SQS FIFO queues are enabled, causing message deduplication failures.",
            "C) The Lambda function's reserved concurrency is set too high.",
            "D) The SQS queue's message retention period has expired.",
          ],
          correctIndex: 0,
          explanation:
            "When a Lambda function's execution time exceeds the SQS visibility timeout, the message becomes visible again before Lambda deletes it, causing duplicate processing. Set the visibility timeout to at least 6 times the Lambda function timeout. FIFO queues (B) reduce duplicates. Reserved concurrency (C) limits scale but doesn't cause duplicates. Message retention (D) controls how long unprocessed messages stay in the queue.",
        },
        {
          id: "dva-d1-q2",
          question:
            "A developer is building a serverless API that must handle 10,000 concurrent requests. The team is concerned about Lambda cold starts affecting response latency. Which configuration BEST addresses this?",
          options: [
            "A) Set reserved concurrency to 10,000 on the Lambda function.",
            "B) Enable provisioned concurrency and configure it to pre-warm a sufficient number of execution environments.",
            "C) Increase the Lambda function memory to 10 GB to reduce execution time.",
            "D) Use Lambda layers to package dependencies and reduce cold start time.",
          ],
          correctIndex: 1,
          explanation:
            "Provisioned concurrency pre-initializes execution environments, eliminating cold starts for the configured number of instances. Reserved concurrency (A) limits the maximum concurrency but doesn't eliminate cold starts. Increasing memory (C) can reduce execution time but not initialization latency for cold starts. Layers (D) reduce package size but don't prevent cold starts from occurring.",
        },
        {
          id: "dva-d1-q3",
          question:
            "An application writes orders to DynamoDB with `orderId` as the partition key. A new requirement asks for the ability to query all orders for a specific customer. Which is the BEST approach?",
          options: [
            "A) Perform a DynamoDB Scan filtered by customerId on every query.",
            "B) Add a Global Secondary Index with customerId as the partition key and orderDate as the sort key.",
            "C) Add a Local Secondary Index with customerId as the sort key.",
            "D) Change the table's primary key to use customerId as the partition key.",
          ],
          correctIndex: 1,
          explanation:
            "A GSI with `customerId` as the partition key enables efficient queries for all orders belonging to a customer. Scan (A) reads every item and is expensive and slow. An LSI (C) cannot change the partition key — it must share the base table's partition key (`orderId`). Changing the primary key (D) would break existing access by `orderId`.",
        },
        {
          id: "dva-d1-q4",
          question:
            "A developer needs to send a message to an SQS queue from a browser-based application without exposing AWS credentials. Which approach is MOST appropriate?",
          options: [
            "A) Hardcode IAM access keys in the JavaScript bundle.",
            "B) Use Amazon Cognito Identity Pools to issue temporary AWS credentials scoped to SQS send permissions.",
            "C) Create a public Lambda function URL that receives the message and forwards it to SQS.",
            "D) Store credentials in an environment variable read by the browser at runtime.",
          ],
          correctIndex: 1,
          explanation:
            "Cognito Identity Pools issue short-lived AWS credentials that can be scoped to specific SQS actions, following the principle of least privilege. Hardcoding credentials (A) or storing them in environment variables (D) exposes long-term keys in the browser. A public Lambda URL (C) works but adds an additional hop and requires its own authentication mechanism.",
        },
        {
          id: "dva-d1-q5",
          question:
            "A Step Functions state machine orchestrates a multi-step order processing workflow that can take up to 48 hours. Which workflow type should be used?",
          options: [
            "A) Express Workflow — it supports workflows up to 5 minutes.",
            "B) Standard Workflow — it supports workflows up to 1 year with exactly-once execution semantics.",
            "C) Express Workflow — it is cheaper and suitable for long-running workflows.",
            "D) Standard Workflow — it must be combined with Lambda to support durations over 15 minutes.",
          ],
          correctIndex: 1,
          explanation:
            "Standard Workflows support durations up to 1 year, provide exactly-once execution, and persist full execution history. Express Workflows (A, C) support durations up to 5 minutes and offer at-least-once execution — they are for high-volume, short-duration workloads. Standard Workflows natively support waiting states (D is incorrect — no Lambda combination is needed).",
        },
        {
          id: "dva-d1-q6",
          question:
            "A developer wants to allow an external partner to upload files directly to an S3 bucket without giving them AWS credentials. Which approach should be used?",
          options: [
            "A) Make the S3 bucket public.",
            "B) Generate a presigned URL with `s3:PutObject` permission and share it with the partner.",
            "C) Create an IAM user for the partner and share access keys.",
            "D) Enable S3 Transfer Acceleration and share the accelerated endpoint.",
          ],
          correctIndex: 1,
          explanation:
            "Presigned URLs grant time-limited access to a specific S3 operation (PUT, GET) without requiring AWS credentials. They expire after a configurable period. Making the bucket public (A) allows anyone to upload. IAM user credentials (C) are long-term and give broader access. Transfer Acceleration (D) improves upload speed but doesn't address authentication.",
        },
        {
          id: "dva-d1-q7",
          question:
            "A developer calls a DynamoDB `UpdateItem` operation but wants to ensure the update only succeeds if the current `version` attribute equals 5. Which feature implements this?",
          options: [
            "A) DynamoDB Streams with a Lambda trigger to validate the version.",
            "B) A conditional expression: `ConditionExpression='version = :v', ExpressionAttributeValues={':v': 5}`.",
            "C) DynamoDB Transactions using `TransactWriteItems`.",
            "D) A Global Secondary Index on the version attribute.",
          ],
          correctIndex: 1,
          explanation:
            "Conditional expressions on `UpdateItem` implement optimistic locking — the update only proceeds if the condition is true, preventing lost updates in concurrent scenarios. DynamoDB Streams (A) are event-driven and cannot prevent the write. Transactions (C) provide atomicity across multiple items but don't inherently implement version checks — you'd still need a condition. A GSI (D) is for querying, not write validation.",
        },
        {
          id: "dva-d1-q8",
          question:
            "An application must fan out notifications to both an email list and an SQS queue whenever a new order is placed. Which architecture should the developer use?",
          options: [
            "A) Write to SQS first, then trigger a Lambda to send emails via SES.",
            "B) Publish to an SNS topic with an email subscription and an SQS subscription.",
            "C) Write to DynamoDB and use DynamoDB Streams to trigger Lambda for each downstream system.",
            "D) Use EventBridge Scheduler to periodically check for new orders and distribute notifications.",
          ],
          correctIndex: 1,
          explanation:
            "SNS natively supports multiple subscription types (email, SQS, Lambda, HTTP) from a single publish. Publishing to SNS fans the message out to all subscribers simultaneously. Option A requires custom code. DynamoDB Streams (C) work but add unnecessary complexity when SNS solves the problem directly. EventBridge Scheduler (D) is for time-based triggers, not event-driven fanout.",
        },
        {
          id: "dva-d1-q9",
          question:
            "A developer is reading from a Kinesis Data Stream using a Lambda function. The stream has 4 shards. What is the maximum number of concurrent Lambda invocations reading from this stream?",
          options: [
            "A) Unlimited — Lambda scales automatically based on load.",
            "B) 4 — one Lambda invocation per shard.",
            "C) 1 — Kinesis triggers only one Lambda at a time.",
            "D) 10 — the default Lambda concurrency limit per stream.",
          ],
          correctIndex: 1,
          explanation:
            "With standard Kinesis-to-Lambda event source mapping, Lambda creates one concurrent invocation per shard. With 4 shards, there are at most 4 concurrent Lambda invocations. Enhanced fan-out with multiple consumers can increase parallelism but doesn't change per-consumer shard limits. Lambda does not auto-scale beyond shard count for Kinesis.",
        },
        {
          id: "dva-d1-q10",
          question:
            "A developer wants to invoke a Lambda function from an API Gateway endpoint and return the Lambda response directly to the client. Which integration type should be configured?",
          options: [
            "A) HTTP integration — forwards the request to an HTTP backend.",
            "B) AWS Lambda Proxy integration — passes the full request to Lambda and returns Lambda's response directly.",
            "C) AWS integration with mapping templates — transforms the request before sending to Lambda.",
            "D) Mock integration — returns a hardcoded response without invoking Lambda.",
          ],
          correctIndex: 1,
          explanation:
            "Lambda Proxy integration passes the entire HTTP request (headers, query params, body) to the Lambda function as a structured event and returns Lambda's response as-is to the client. The HTTP integration (A) targets HTTP backends, not Lambda. AWS integration with mapping templates (C) requires writing Velocity templates and is the non-proxy mode. Mock integration (D) never invokes Lambda.",
        },
        {
          id: "dva-d1-q11",
          question:
            "A Lambda function is failing intermittently with throttling errors when calling DynamoDB. The developer wants to implement a retry strategy. What is the AWS-recommended approach?",
          options: [
            "A) Retry immediately in a tight loop until the call succeeds.",
            "B) Implement exponential backoff with jitter between retry attempts.",
            "C) Switch to DynamoDB Streams to avoid direct API calls.",
            "D) Increase the Lambda function timeout to allow more time for retries.",
          ],
          correctIndex: 1,
          explanation:
            "Exponential backoff with jitter is the AWS-recommended retry strategy. It reduces the load on the downstream service by spreading retries over time and avoids thundering herd problems. Tight loops (A) can worsen throttling. DynamoDB Streams (C) are for consuming change events, not a retry mechanism. Increasing timeout (D) allows more time but doesn't address the throttling pattern.",
        },
        {
          id: "dva-d1-q12",
          question:
            "A developer needs to share common dependencies (such as `boto3` and helper utilities) across 10 Lambda functions without duplicating the code in each deployment package. What is the BEST approach?",
          options: [
            "A) Copy the dependencies into each function's deployment package.",
            "B) Create a Lambda Layer containing the shared dependencies and attach it to each function.",
            "C) Store the dependencies in an S3 bucket and download them at function startup.",
            "D) Use AWS CodeArtifact to publish and install dependencies at runtime.",
          ],
          correctIndex: 1,
          explanation:
            "Lambda Layers allow you to package shared code and dependencies separately and attach them to multiple functions. This reduces deployment package size and promotes code reuse. Copying dependencies (A) leads to duplication and maintenance overhead. Downloading from S3 (C) adds latency on every cold start. CodeArtifact (D) is a package repository — installing at runtime adds significant cold start latency.",
        },
        {
          id: "dva-d1-q13",
          question:
            "An API Gateway REST API is receiving a high volume of identical requests. The developer wants to reduce Lambda invocations and improve response time for repeated requests. Which feature should be enabled?",
          options: [
            "A) API Gateway usage plans with throttling.",
            "B) API Gateway caching on the stage, with an appropriate TTL.",
            "C) Lambda reserved concurrency to limit invocations.",
            "D) CloudFront in front of API Gateway to cache responses.",
          ],
          correctIndex: 1,
          explanation:
            "API Gateway stage-level caching stores responses and serves them directly without invoking Lambda for the TTL duration, reducing latency and cost. Usage plans with throttling (A) limit requests but don't cache responses. Reserved concurrency (C) limits concurrent Lambda executions but doesn't cache. CloudFront (D) can cache API responses but requires additional configuration and is a separate service.",
        },
        {
          id: "dva-d1-q14",
          question:
            "A developer is building an application that must handle both real-time data streams and batch analytics on the same data. Which combination of AWS services is MOST appropriate?",
          options: [
            "A) Amazon SQS for streaming and Amazon S3 for batch.",
            "B) Amazon Kinesis Data Streams for real-time processing and Kinesis Data Firehose to deliver data to S3 for batch analytics.",
            "C) Amazon SNS for streaming and Amazon RDS for batch analytics.",
            "D) AWS Lambda with EventBridge Scheduler for both real-time and batch processing.",
          ],
          correctIndex: 1,
          explanation:
            "Kinesis Data Streams enables real-time processing with multiple consumers. Kinesis Data Firehose can read from the same stream (or directly) and deliver data to S3, Redshift, or OpenSearch for batch analytics. SQS (A) is not designed for replay or multi-consumer streaming. SNS and RDS (C) are not suitable for high-throughput streaming and batch analytics. Lambda with EventBridge Scheduler (D) is for scheduled jobs, not event-driven streaming.",
        },
        {
          id: "dva-d1-q15",
          question:
            "A developer notices that a Lambda function's execution environment is being reused across invocations. Which of the following correctly describes a best practice for using this behavior?",
          options: [
            "A) Avoid declaring variables outside the handler — execution context reuse causes cross-request data leakage.",
            "B) Initialize database connections and SDK clients outside the handler to reuse them across warm invocations.",
            "C) Disable execution context reuse by setting the function timeout to 1 second.",
            "D) Store user-specific data in the `/tmp` directory between invocations for performance.",
          ],
          correctIndex: 1,
          explanation:
            "AWS recommends initializing expensive resources (database connections, SDK clients) outside the handler function so they are reused across warm invocations, reducing latency. Variables outside the handler persist between invocations on the same container, which is a feature, not a bug — but you must not store user-specific data there (A is partially correct as a warning, but the best practice is B). The `/tmp` directory (D) persists between warm invocations but should not hold sensitive user-specific data. You cannot disable execution context reuse by setting the timeout (C).",
        },
      ],
    },

    // ─── Domain 2: Security (26%) ───────────────────────────────────
    {
      id: "domain-2",
      title: "Security",
      weight: "26%",
      order: 2,
      summary:
        "This domain tests your ability to implement security controls in application code and infrastructure. Security carries 26% of the exam weight, reflecting its importance for developers building production applications on AWS.\n\nExpect questions on **IAM roles and policies** for application workloads (not just users), **Amazon Cognito** for user authentication and authorization, **AWS KMS** for encrypting data in code, and **AWS Secrets Manager** for managing application secrets. You must understand how to implement least-privilege access in serverless and containerized applications.\n\nKey services include IAM, Cognito User Pools and Identity Pools, KMS, Secrets Manager, ACM, and SSM Parameter Store. Questions often test whether you know which credential type to use — instance profiles for EC2, task roles for ECS, and execution roles for Lambda.",
      keyConceptsForExam: [
        "**IAM execution roles** — Lambda execution roles, ECS task roles, EC2 instance profiles — temporary credentials for compute services",
        "**Amazon Cognito User Pools** — user directory with sign-up/sign-in, MFA, hosted UI, and JWT token issuance",
        "**Amazon Cognito Identity Pools** — federated identity, exchanging tokens for temporary AWS credentials (STS AssumeRoleWithWebIdentity)",
        "**AWS KMS** — `GenerateDataKey`, envelope encryption pattern, key policies vs. IAM policies, customer-managed keys",
        "**AWS Secrets Manager** — automatic rotation, SDK integration to retrieve secrets, comparison with SSM Parameter Store",
        "**SSM Parameter Store** — Standard vs. Advanced parameters, SecureString type with KMS encryption",
        "**STS** — `AssumeRole`, `AssumeRoleWithWebIdentity`, `GetSessionToken` — use cases for each",
        "**API Gateway authorization** — Cognito User Pool authorizer, Lambda (custom) authorizer, IAM authorization",
      ],
      examTips: [
        "When the question asks for the LEAST operational overhead for user authentication, Cognito User Pools is almost always the answer — it handles user storage, password policies, MFA, and OAuth flows.",
        "Cognito User Pools issue **JWTs** (ID token, access token, refresh token). Cognito Identity Pools issue **temporary AWS credentials** — know which one to use for which purpose.",
        "Never use IAM users or long-term access keys for EC2, Lambda, or ECS workloads — always use roles and temporary credentials.",
        "KMS envelope encryption: use `GenerateDataKey` to get a plaintext + encrypted data key, encrypt data with the plaintext key, store the encrypted key alongside the data, and discard the plaintext key.",
        "Secrets Manager supports automatic rotation; SSM Parameter Store does not — this distinction is a common exam question.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "iam-deep-dive", title: "IAM Deep Dive" },
        { cloud: "aws", topicId: "s3-deep-dive", title: "S3 Deep Dive" },
        {
          cloud: "aws",
          topicId: "cloudwatch-deep-dive",
          title: "CloudWatch Deep Dive",
        },
      ],
      sections: [
        {
          heading: "Cognito User Pools vs. Identity Pools",
          body: "**Cognito User Pools** is a managed user directory. It handles user registration, authentication, MFA, and issues **JWT tokens** (ID token, access token, refresh token) upon successful sign-in. API Gateway integrates directly with User Pools as a native authorizer — no custom Lambda code required.\n\n**Cognito Identity Pools** (Federated Identities) exchanges external identity tokens (from User Pools, Google, Facebook, or SAML) for **temporary AWS credentials** via `STS:AssumeRoleWithWebIdentity`. These credentials allow the client application to call AWS services (S3, DynamoDB) directly.\n\nThe typical pattern: User Pool authenticates the user → client gets JWT → Identity Pool exchanges JWT for AWS credentials → client accesses AWS resources. On the exam, if the question asks for AWS resource access from a mobile/web app, the answer involves Identity Pools. If the question asks for API authentication, the answer involves User Pools.",
          code: {
            lang: "python",
            label: "Lambda: retrieve secret from Secrets Manager",
            snippet: `import boto3
import json

_client = boto3.client("secretsmanager")
_cached_secret = None

def get_db_credentials():
    global _cached_secret
    if _cached_secret is None:
        response = _client.get_secret_value(SecretId="prod/myapp/db")
        _cached_secret = json.loads(response["SecretString"])
    return _cached_secret

def handler(event, context):
    creds = get_db_credentials()  # reused on warm invocations
    # connect to database using creds["username"] and creds["password"]`,
          },
        },
        {
          heading: "KMS Envelope Encryption",
          body: "AWS KMS supports encryption of objects up to 4 KB directly. For larger data, use **envelope encryption**: call `GenerateDataKey` to receive a plaintext data key and an encrypted copy of that key. Encrypt your data with the plaintext key using a symmetric algorithm (e.g., AES-256), then store the encrypted data key alongside the ciphertext. Discard the plaintext key immediately.\n\nTo decrypt: pass the encrypted data key to KMS `Decrypt` to recover the plaintext key, then decrypt the data locally. This minimizes KMS API calls and keeps large data encrypted locally.\n\n**KMS key policies** always control access to a CMK — even IAM policies cannot grant access to a KMS key unless the key policy also allows it. Use **grants** for temporary, fine-grained access delegation (e.g., allowing an AWS service to use the key on your behalf).",
        },
        {
          heading: "Securing Lambda Functions",
          body: "Each Lambda function should have a **dedicated execution role** that grants only the permissions the function needs. Avoid attaching `AdministratorAccess` or `PowerUserAccess` policies to Lambda roles.\n\nStore sensitive configuration (database passwords, API keys) in **AWS Secrets Manager** or **SSM Parameter Store (SecureString)** — not in Lambda environment variables, which are stored in plaintext in the console (though they are encrypted at rest by AWS). If you use environment variables for secrets, encrypt them with a **customer-managed KMS key**.\n\nEnable **function URL** authentication with `AWS_IAM` when exposing Lambda directly over HTTPS, or use API Gateway with Cognito or a Lambda authorizer for user-facing APIs. Use **resource-based policies** to control which services and accounts can invoke the function.",
        },
      ],
      quiz: [
        {
          id: "dva-d2-q1",
          question:
            "A mobile app authenticates users via Cognito User Pools. After sign-in, the app needs to upload files directly to an S3 bucket on behalf of the user. Which service issues the temporary AWS credentials the app needs?",
          options: [
            "A) Cognito User Pools — it issues JWT tokens that can be used as AWS credentials.",
            "B) Cognito Identity Pools — it exchanges the User Pool JWT for temporary AWS credentials via STS.",
            "C) AWS STS GetSessionToken — the app calls STS directly with the JWT.",
            "D) IAM roles — the developer assigns an IAM role to each mobile user.",
          ],
          correctIndex: 1,
          explanation:
            "Cognito Identity Pools exchange User Pool JWTs (and other identity tokens) for temporary AWS credentials (access key, secret key, session token) via `AssumeRoleWithWebIdentity`. User Pool JWTs (A) are for authenticating API calls, not for calling AWS SDKs directly. The app shouldn't call STS directly (C) — Identity Pools abstract this. IAM roles (D) are assigned through Identity Pools, not directly to mobile users.",
        },
        {
          id: "dva-d2-q2",
          question:
            "A developer needs to encrypt a 50 MB file using AWS KMS before storing it in S3. The KMS `Encrypt` API call fails with a `LimitExceededException`. What is the correct approach?",
          options: [
            "A) Compress the file to under 4 KB before calling KMS Encrypt.",
            "B) Use envelope encryption: call GenerateDataKey, encrypt the file locally with the plaintext key, store the encrypted file and encrypted data key in S3.",
            "C) Split the file into 4 KB chunks and call KMS Encrypt on each chunk.",
            "D) Use SSE-S3 instead, which has no size limits.",
          ],
          correctIndex: 1,
          explanation:
            "KMS `Encrypt` supports up to 4 KB of data. For larger payloads, use envelope encryption: `GenerateDataKey` returns a plaintext key (for local encryption) and an encrypted key (stored alongside the data). The file is encrypted locally; KMS only encrypts the small data key. Compressing to 4 KB (A) is impractical for large files. Chunking (C) is complex and not the recommended pattern. SSE-S3 (D) doesn't use customer-managed keys.",
        },
        {
          id: "dva-d2-q3",
          question:
            "A Lambda function requires a database password that must be automatically rotated every 30 days. Which is the BEST storage option?",
          options: [
            "A) Lambda environment variable encrypted with a KMS key.",
            "B) SSM Parameter Store Standard parameter.",
            "C) AWS Secrets Manager with automatic rotation enabled.",
            "D) An encrypted S3 object in a private bucket.",
          ],
          correctIndex: 2,
          explanation:
            "Secrets Manager natively supports automatic rotation for database credentials and custom secrets using Lambda rotation functions. Lambda environment variables (A) require redeployment to update. SSM Parameter Store (B) stores parameters but does not support automatic rotation. S3 (D) has no built-in rotation mechanism and requires custom code to retrieve and update secrets.",
        },
        {
          id: "dva-d2-q4",
          question:
            "An API Gateway REST API should only be accessible to users who have authenticated with Cognito User Pools. Which authorizer type should be configured?",
          options: [
            "A) Lambda authorizer (TOKEN type) — validates JWTs from Cognito.",
            "B) Cognito User Pool authorizer — natively validates User Pool JWTs with no custom code.",
            "C) IAM authorization — requires clients to sign requests with SigV4.",
            "D) API key authorization — distribute API keys to authenticated users.",
          ],
          correctIndex: 1,
          explanation:
            "API Gateway has built-in support for Cognito User Pool authorizers. When configured, API Gateway validates the JWT ID or access token from Cognito with no custom Lambda code required. A Lambda authorizer (A) works but requires writing and maintaining custom validation logic. IAM authorization (C) is for AWS principal authentication, not end-user flows. API keys (D) are for throttling and usage plans, not authentication.",
        },
        {
          id: "dva-d2-q5",
          question:
            "A developer wants to allow an EC2 instance to read objects from an S3 bucket. What is the MOST secure approach?",
          options: [
            "A) Store IAM user access keys in the application code.",
            "B) Store IAM user access keys in environment variables on the EC2 instance.",
            "C) Attach an IAM role with the required S3 permissions to the EC2 instance profile.",
            "D) Use the root account access keys for maximum permissions.",
          ],
          correctIndex: 2,
          explanation:
            "EC2 instance profiles provide temporary, automatically rotated credentials via the instance metadata service. Application code using the AWS SDK automatically retrieves these credentials without any configuration. Hardcoding access keys (A) or storing them in environment variables (B) exposes long-term credentials that don't rotate. Root account keys (D) are a critical security violation and give unrestricted access to the account.",
        },
        {
          id: "dva-d2-q6",
          question:
            "A developer is using the AWS CLI and needs temporary credentials to assume an IAM role in another AWS account for a one-time data migration. Which STS API should be called?",
          options: [
            "A) STS:GetSessionToken — returns temporary credentials for the current user.",
            "B) STS:AssumeRole — returns temporary credentials for the target role in the other account.",
            "C) STS:GetFederationToken — suitable for federated web identity authentication.",
            "D) STS:AssumeRoleWithSAML — requires SAML assertion from an IdP.",
          ],
          correctIndex: 1,
          explanation:
            "`AssumeRole` is designed for cross-account access and role switching. It returns temporary credentials (access key, secret key, session token) for the assumed role. `GetSessionToken` (A) returns temporary credentials for the current IAM user — it doesn't switch roles. `GetFederationToken` (C) is for mobile/web app federation, not CLI cross-account access. `AssumeRoleWithSAML` (D) requires a SAML 2.0 identity provider.",
        },
        {
          id: "dva-d2-q7",
          question:
            "A team stores sensitive configuration values in SSM Parameter Store. Some values are passwords that should be encrypted. Which parameter type should they use?",
          options: [
            "A) String — the simplest type, no encryption overhead.",
            "B) StringList — supports multiple values in a comma-separated list.",
            "C) SecureString — encrypted at rest using a KMS key.",
            "D) EncryptedString — the dedicated type for encrypted values.",
          ],
          correctIndex: 2,
          explanation:
            "SSM Parameter Store's `SecureString` type encrypts parameter values using AWS KMS. Access to the decrypted value requires both SSM read permission and KMS decrypt permission. `String` (A) stores values in plaintext. `StringList` (B) stores comma-separated plaintext values. `EncryptedString` (D) does not exist as a Parameter Store type.",
        },
        {
          id: "dva-d2-q8",
          question:
            "An application's Lambda function needs to access a third-party API key. The key should not appear in CloudWatch Logs or be visible in the Lambda console. What is the BEST approach?",
          options: [
            "A) Store the API key as a Lambda environment variable without encryption.",
            "B) Store the API key in AWS Secrets Manager and retrieve it in the Lambda handler using the SDK.",
            "C) Hardcode the API key as a Python constant in the function code.",
            "D) Pass the API key as a query string parameter from the invoking service.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Secrets Manager stores secrets encrypted with KMS. The Lambda function retrieves the secret at runtime using the SDK — the key never appears in environment variables, code, or logs. Lambda environment variables without encryption (A) are visible in the console. Hardcoding (C) exposes the key in source code and version control. Passing as a query string (D) logs the key in API Gateway access logs and request history.",
        },
        {
          id: "dva-d2-q9",
          question:
            "A developer must implement a Lambda authorizer for API Gateway that validates a custom JWT. Upon successful validation, what should the authorizer return?",
          options: [
            "A) An HTTP 200 response with the decoded JWT payload.",
            "B) An IAM policy document (allow/deny) with a principalId.",
            "C) A Cognito User Pool token.",
            "D) A boolean (true/false) indicating whether the request is authorized.",
          ],
          correctIndex: 1,
          explanation:
            "Lambda authorizers must return an IAM policy document containing Effect (Allow/Deny), Action (execute-api:Invoke), Resource (the API ARN), and a principalId. API Gateway evaluates this policy to allow or deny the request. A raw HTTP response (A) is not a valid authorizer output. Returning a Cognito token (C) or boolean (D) does not match the API Gateway Lambda authorizer contract.",
        },
        {
          id: "dva-d2-q10",
          question:
            "A company has multiple AWS accounts and wants to use a single KMS key to encrypt data across all accounts. How can another account decrypt data encrypted with a KMS key in the primary account?",
          options: [
            "A) Share the KMS key ARN — any account can use any KMS key by ARN.",
            "B) Add the other account's principal to the KMS key policy, and grant the IAM role in that account the kms:Decrypt permission.",
            "C) Export the KMS key material and import it into the other account.",
            "D) Use SSE-S3 encryption, which automatically works cross-account.",
          ],
          correctIndex: 1,
          explanation:
            "Cross-account KMS usage requires two conditions: (1) the key policy in the owning account must allow the other account's principal, and (2) the IAM role in the other account must have `kms:Decrypt` permission. Neither condition alone is sufficient. KMS keys are not publicly accessible by ARN (A). Exporting key material (C) is only for external key stores, not standard cross-account use. SSE-S3 (D) uses AWS-managed keys, not customer-managed cross-account keys.",
        },
        {
          id: "dva-d2-q11",
          question:
            "A developer wants to restrict which resources a Lambda function can access at a fine-grained level. The function currently uses an execution role with `AmazonDynamoDBFullAccess`. What is the recommended change?",
          options: [
            "A) Replace with a custom IAM policy that allows only the specific DynamoDB table ARNs and required actions (e.g., GetItem, PutItem).",
            "B) Add a permissions boundary to the execution role to log all API calls.",
            "C) Remove the execution role — Lambda can access DynamoDB without a role.",
            "D) Enable Lambda resource-based policies to restrict DynamoDB access.",
          ],
          correctIndex: 0,
          explanation:
            "Least-privilege access means granting only the permissions needed for specific resources and actions. Replacing `AmazonDynamoDBFullAccess` with a custom policy specifying exact table ARNs and required actions (GetItem, PutItem, etc.) reduces the blast radius of a compromise. Permissions boundaries (B) are scope limits, not replacements for proper policies. Lambda cannot call DynamoDB without a role (C). Resource-based policies on Lambda (D) control who can invoke the function, not what the function can access.",
        },
        {
          id: "dva-d2-q12",
          question:
            "A developer is building a web application with a login page. Users must be able to sign up, sign in, and reset their passwords without any custom backend code. Which AWS service provides these capabilities?",
          options: [
            "A) AWS IAM with password policies.",
            "B) Amazon Cognito User Pools with the hosted UI.",
            "C) Amazon Cognito Identity Pools.",
            "D) AWS Directory Service.",
          ],
          correctIndex: 1,
          explanation:
            "Cognito User Pools provides a fully managed user directory with sign-up, sign-in, MFA, and password reset flows. The hosted UI provides a pre-built, customizable web interface for these flows with no custom backend required. IAM (A) is for AWS account users, not application users. Identity Pools (C) federate identities for AWS resource access, not user authentication flows. Directory Service (D) is for enterprise Active Directory integration.",
        },
        {
          id: "dva-d2-q13",
          question:
            "A Lambda function written in Python makes multiple calls to the same Secrets Manager secret during its execution. The developer wants to minimize latency and API costs. What is the BEST approach?",
          options: [
            "A) Call GetSecretValue inside the handler on every invocation.",
            "B) Cache the secret in a module-level variable outside the handler and retrieve it only on cold starts.",
            "C) Hardcode the secret value in the function code.",
            "D) Use SSM Parameter Store instead — it has lower latency than Secrets Manager.",
          ],
          correctIndex: 1,
          explanation:
            "Caching the secret in a module-level variable takes advantage of Lambda execution context reuse — warm invocations skip the Secrets Manager API call. This reduces latency and API costs. Calling `GetSecretValue` on every invocation (A) adds latency and incurs API charges. Hardcoding (C) is a security violation. SSM Parameter Store (D) is not inherently faster and lacks automatic rotation.",
        },
        {
          id: "dva-d2-q14",
          question:
            "An API Gateway endpoint is currently open to the public. The team wants to restrict access to only authenticated AWS IAM principals. Which change should be made?",
          options: [
            "A) Add an API key to each method.",
            "B) Change the method authorization to AWS_IAM — callers must sign requests with SigV4.",
            "C) Deploy the API to a VPC-linked endpoint.",
            "D) Enable a usage plan with throttling.",
          ],
          correctIndex: 1,
          explanation:
            "Setting method authorization to `AWS_IAM` requires callers to sign requests with Signature Version 4 using their IAM credentials. Only principals with `execute-api:Invoke` permission can call the API. API keys (A) are for throttling and usage tracking, not authentication. VPC endpoints (C) restrict network access but don't enforce IAM authentication. Usage plans (D) control rate limits, not authentication.",
        },
        {
          id: "dva-d2-q15",
          question:
            "A company wants to enforce MFA for all Cognito User Pool sign-ins. Where is this configured?",
          options: [
            "A) In the IAM password policy for the AWS account.",
            "B) In the Cognito User Pool MFA settings, set to Required.",
            "C) In the Lambda post-authentication trigger.",
            "D) In the API Gateway method request settings.",
          ],
          correctIndex: 1,
          explanation:
            "Cognito User Pools have a built-in MFA configuration where you can set MFA to Off, Optional, or Required. Setting it to Required forces all users to complete MFA before receiving tokens. IAM password policies (A) apply to IAM users, not Cognito users. A Lambda trigger (C) could enforce MFA programmatically but is unnecessary when Cognito provides the setting natively. API Gateway (D) handles request authorization, not MFA enforcement.",
        },
      ],
    },

    // ─── Domain 3: Deployment (24%) ─────────────────────────────────
    {
      id: "domain-3",
      title: "Deployment",
      weight: "24%",
      order: 3,
      summary:
        "This domain covers the tools and services developers use to build, test, and deploy applications on AWS. It accounts for 24% of the exam and focuses on automation, infrastructure as code, and deployment strategies.\n\nExpect questions on **AWS CodePipeline** for orchestrating CI/CD workflows, **CodeBuild** for compiling and testing code, **CodeDeploy** for deploying to EC2, Lambda, and ECS, and **CloudFormation** and **SAM** for defining infrastructure as code. You will also be tested on **Elastic Beanstalk** deployment policies.\n\nKey concepts include deployment strategies (blue/green, canary, rolling), `buildspec.yml` structure for CodeBuild, CloudFormation stack updates and change sets, SAM template syntax for serverless resources, and Elastic Beanstalk environment types.",
      keyConceptsForExam: [
        "**AWS CodePipeline** — pipeline stages (Source, Build, Test, Deploy), integration with CodeBuild and CodeDeploy, manual approval actions",
        "**AWS CodeBuild** — `buildspec.yml` phases (install, pre_build, build, post_build), environment variables, artifacts",
        "**AWS CodeDeploy** — deployment types (in-place vs. blue/green), `AppSpec.yml` for EC2/Lambda/ECS, deployment configurations (AllAtOnce, HalfAtATime, OneAtATime, Canary, Linear)",
        "**AWS CloudFormation** — stack lifecycle, change sets, `DependsOn`, `Outputs`, `Mappings`, `Parameters`, cross-stack references with `!ImportValue`",
        "**AWS SAM** — `Transform: AWS::Serverless-2016-10-31`, `AWS::Serverless::Function`, `AWS::Serverless::Api`, `sam build` and `sam deploy`",
        "**Elastic Beanstalk** — deployment policies (All at once, Rolling, Rolling with additional batch, Immutable, Traffic splitting), `.ebextensions` customization",
        "**Blue/Green deployments** — zero-downtime, instant rollback, DNS or traffic-based switching",
        "**CodeArtifact** — managed artifact repository, upstream repositories, integration with npm, pip, Maven",
      ],
      examTips: [
        "Elastic Beanstalk **Immutable** deployment replaces all instances before switching traffic — it's the safest option for production and supports fast rollback by terminating the new ASG.",
        "CodeDeploy **AppSpec.yml** specifies lifecycle event hooks — for Lambda deployments, hooks include `BeforeAllowTraffic` and `AfterAllowTraffic`.",
        "CloudFormation change sets show what will change before applying — always use change sets in production to preview updates.",
        "SAM extends CloudFormation — `sam build` packages dependencies and `sam deploy` is equivalent to `cloudformation package` + `cloudformation deploy`.",
        "CodeBuild environment variables set at the project level can be overridden at the build run level — use Parameter Store or Secrets Manager for sensitive values.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "lambda-in-depth", title: "Lambda In Depth" },
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 Fundamentals" },
        {
          cloud: "aws",
          topicId: "cloudwatch-deep-dive",
          title: "CloudWatch Deep Dive",
        },
      ],
      sections: [
        {
          heading: "CodeDeploy Deployment Strategies",
          body: "CodeDeploy supports multiple deployment configurations to balance speed and risk:\n\n**In-place (EC2/on-premises)**: the application is stopped, the new version is deployed, and the application is restarted. `AllAtOnce` is fastest but has downtime. `HalfAtATime` reduces risk. `OneAtATime` is the safest but slowest.\n\n**Blue/Green (EC2)**: a new Auto Scaling group (green) is provisioned with the new version. After validation, traffic is shifted from the old group (blue) to green. Rollback is instant — re-route traffic back to blue.\n\n**Lambda and ECS**: CodeDeploy shifts traffic using weighted aliases (Lambda) or load balancer rules (ECS). `Canary` sends a small percentage first (e.g., 10%) and shifts the rest after a wait period. `Linear` shifts traffic in equal increments over time. These strategies enable validation with real traffic before full rollout.",
          code: {
            lang: "yaml",
            label: "CodeDeploy AppSpec for Lambda (canary deployment)",
            snippet: `version: 0.0
Resources:
  - MyLambdaFunction:
      Type: AWS::Lambda::Function
      Properties:
        Name: !Ref MyFunction
        Alias: !Ref MyAlias
        CurrentVersion: !Ref PreviousVersion
        TargetVersion: !Ref NewVersion
Hooks:
  - BeforeAllowTraffic: ValidateBeforeTrafficShift
  - AfterAllowTraffic: ValidateAfterTrafficShift`,
          },
        },
        {
          heading: "AWS SAM for Serverless Applications",
          body: "AWS SAM (Serverless Application Model) is a CloudFormation extension that simplifies serverless resource definitions. The `Transform: AWS::Serverless-2016-10-31` directive at the top of a SAM template tells CloudFormation to process SAM-specific resource types.\n\n`AWS::Serverless::Function` automatically creates a Lambda function, an IAM execution role, and optionally a Lambda alias and version. Event sources (API Gateway, SQS, S3) are declared inline under the `Events` property — SAM creates the event source mapping or trigger automatically.\n\nUse `sam local invoke` to test functions locally and `sam local start-api` to run a local API Gateway emulator. `sam deploy --guided` walks through stack configuration interactively on first deploy.",
          code: {
            lang: "yaml",
            label: "SAM template — Lambda + API Gateway + DynamoDB",
            snippet: `Transform: AWS::Serverless-2016-10-31

Resources:
  OrdersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: orderId
          AttributeType: S
      KeySchema:
        - AttributeName: orderId
          KeyType: HASH

  CreateOrderFunction:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: python3.12
      Handler: app.handler
      Environment:
        Variables:
          TABLE_NAME: !Ref OrdersTable
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref OrdersTable
      Events:
        CreateOrder:
          Type: Api
          Properties:
            Path: /orders
            Method: post`,
          },
        },
        {
          heading: "CloudFormation Change Sets",
          body: "A **change set** previews the changes CloudFormation will make to a stack before executing them. This is critical for production environments where unexpected resource replacements (e.g., deleting and recreating an RDS instance) would cause data loss.\n\nWhen a resource's physical ID changes in a CloudFormation update, CloudFormation replaces the resource — deleting the old one and creating a new one. Change sets show whether each resource will be `Add`, `Modify`, or `Remove`, and whether a modify will require **Replacement**.\n\nUse `DependsOn` to explicitly control resource creation order when CloudFormation cannot infer the dependency automatically. Use `Outputs` and `!ImportValue` for **cross-stack references** — the exporting stack must be deployed before the importing stack can reference its outputs.",
        },
      ],
      quiz: [
        {
          id: "dva-d3-q1",
          question:
            "A developer deploys a Lambda function via CodeDeploy and wants to validate the new version with 10% of traffic before shifting the remaining 90%. Which deployment configuration achieves this?",
          options: [
            "A) CodeDeployDefault.LambdaAllAtOnce",
            "B) CodeDeployDefault.LambdaCanary10Percent5Minutes",
            "C) CodeDeployDefault.LambdaLinear10PercentEvery1Minute",
            "D) CodeDeployDefault.LambdaOneAtATime",
          ],
          correctIndex: 1,
          explanation:
            "Canary configurations shift a small percentage of traffic first (10%) and then shift the remainder after a wait period (5 minutes in this case). `AllAtOnce` (A) shifts all traffic immediately. `Linear` (C) shifts traffic in equal increments over time. `OneAtATime` (D) is for EC2 deployments, not Lambda.",
        },
        {
          id: "dva-d3-q2",
          question:
            "A CodeBuild project needs to access a database password stored in SSM Parameter Store during the build. What is the RECOMMENDED approach?",
          options: [
            "A) Hardcode the password in the buildspec.yml file.",
            "B) Set the password as a plaintext environment variable in the CodeBuild project.",
            "C) Reference the SSM Parameter Store parameter using the parameter-store environment variable type in CodeBuild.",
            "D) Store the password in an S3 object and download it in the pre_build phase.",
          ],
          correctIndex: 2,
          explanation:
            "CodeBuild supports native SSM Parameter Store and Secrets Manager integration for environment variables. Setting the type to `PARAMETER_STORE` and specifying the parameter name causes CodeBuild to retrieve and inject the value securely — it's masked in logs. Hardcoding (A) exposes the password in source control. Plaintext environment variables (B) are visible in the console. S3 download (D) requires additional IAM permissions and custom code.",
        },
        {
          id: "dva-d3-q3",
          question:
            "A team uses Elastic Beanstalk to deploy a web application. They want to ensure that the new application version is fully deployed and healthy before any traffic is sent to it. Which deployment policy should they use?",
          options: [
            "A) All at once — deploys to all instances simultaneously.",
            "B) Rolling — deploys to a batch of instances at a time.",
            "C) Immutable — deploys to new instances, and shifts traffic only after health checks pass.",
            "D) Rolling with additional batch — adds instances before deploying.",
          ],
          correctIndex: 2,
          explanation:
            "Immutable deployment launches a fresh set of instances in a new Auto Scaling group, deploys the new version, and only swaps traffic after health checks pass. If anything fails, the new group is terminated. All at once (A) causes downtime. Rolling (B) deploys to existing instances in batches, meaning some instances run the old version during deployment. Rolling with additional batch (D) maintains capacity but still uses existing instances.",
        },
        {
          id: "dva-d3-q4",
          question:
            "A CloudFormation update will replace an RDS instance. A developer wants to preview this change before applying it. What should they do?",
          options: [
            "A) Run `aws cloudformation update-stack` and review the events.",
            "B) Create a CloudFormation change set and review the proposed changes before executing.",
            "C) Deploy to a staging environment first and compare resources.",
            "D) Use AWS Config to detect resource changes before the update.",
          ],
          correctIndex: 1,
          explanation:
            "Change sets display a preview of all resource additions, modifications, and replacements before any changes are made to the stack. A `Replacement: True` flag indicates the resource will be deleted and recreated. `update-stack` (A) applies changes immediately without a preview. Staging environments (C) are good practice but slower and don't show CloudFormation-specific change details. AWS Config (D) is for compliance monitoring, not pre-update change preview.",
        },
        {
          id: "dva-d3-q5",
          question:
            "A developer is configuring a CodeBuild `buildspec.yml` for a Node.js project. In which phase should `npm install` be run?",
          options: [
            "A) `install` phase — installs the runtime and dependencies.",
            "B) `pre_build` phase — runs before the main build.",
            "C) `build` phase — the primary build commands.",
            "D) `post_build` phase — runs after the build completes.",
          ],
          correctIndex: 0,
          explanation:
            "The `install` phase in `buildspec.yml` is intended for installing the runtime environment and dependencies (e.g., `npm install`, `pip install -r requirements.txt`). `pre_build` (B) is for pre-build tasks like logging into ECR. `build` (C) is for compiling, testing, and packaging. `post_build` (D) is for post-processing like pushing Docker images.",
        },
        {
          id: "dva-d3-q6",
          question:
            "A team wants to share a CloudFormation stack's output (e.g., a VPC ID) with another stack in the same account and region. Which mechanism should they use?",
          options: [
            "A) SSM Parameter Store — store the VPC ID as a parameter and reference it.",
            "B) CloudFormation `Outputs` with `Export` and `!ImportValue` in the consuming stack.",
            "C) Hardcode the VPC ID in the consuming stack's template.",
            "D) Use AWS RAM to share the VPC across stacks.",
          ],
          correctIndex: 1,
          explanation:
            "CloudFormation cross-stack references use `Outputs` with an `Export` name in the source stack and `!ImportValue` in the consuming stack. This creates an explicit dependency — CloudFormation prevents deletion of the source stack while it is referenced. SSM Parameter Store (A) works but is not native CloudFormation and doesn't enforce stack dependencies. Hardcoding (C) is brittle. AWS RAM (D) shares resources across accounts, not between stacks.",
        },
        {
          id: "dva-d3-q7",
          question:
            "A developer uses AWS SAM to define a serverless application. After making code changes, which commands should be run to deploy the update? (Choose the correct sequence.)",
          options: [
            "A) `sam package` → `sam deploy`",
            "B) `sam build` → `sam deploy`",
            "C) `sam validate` → `sam publish`",
            "D) `sam local invoke` → `sam deploy`",
          ],
          correctIndex: 1,
          explanation:
            "`sam build` compiles the application, installs dependencies, and creates a build artifact in `.aws-sam/`. `sam deploy` packages the build artifact, uploads it to S3, and deploys or updates the CloudFormation stack. `sam package` (A) is an older command largely replaced by `sam deploy --resolve-s3`. `sam validate` (C) checks template syntax; `sam publish` publishes to the Serverless Application Repository. `sam local invoke` (D) runs the function locally and doesn't trigger a deployment.",
        },
        {
          id: "dva-d3-q8",
          question:
            "A CodePipeline pipeline has stages: Source (CodeCommit) → Build (CodeBuild) → Deploy (CodeDeploy). A developer wants to require manual approval before deployment to production. Where should the approval action be added?",
          options: [
            "A) As a new stage between Build and Deploy.",
            "B) Inside the Build stage as a CodeBuild post_build command.",
            "C) As a CloudWatch alarm on the Build stage.",
            "D) As a Lambda function triggered after the Source stage.",
          ],
          correctIndex: 0,
          explanation:
            "CodePipeline supports a `Manual Approval` action type that can be placed as a stage between Build and Deploy. The pipeline pauses until an authorized user approves or rejects the deployment via the console, CLI, or SNS notification. Approval cannot be implemented inside a CodeBuild phase (B) since CodeBuild runs non-interactively. CloudWatch alarms (C) and Lambda (D) can trigger pipeline actions but are not the mechanism for manual approval.",
        },
        {
          id: "dva-d3-q9",
          question:
            "A developer wants to customize an Elastic Beanstalk environment by installing a custom software package on every EC2 instance at launch. Which mechanism should be used?",
          options: [
            "A) Modify the Elastic Beanstalk platform by creating a custom platform.",
            "B) Use `.ebextensions` configuration files in the application source bundle.",
            "C) Add a user data script to the Elastic Beanstalk launch template.",
            "D) Create an EC2 AMI with the package pre-installed and reference it in Beanstalk.",
          ],
          correctIndex: 1,
          explanation:
            "`.ebextensions` are YAML configuration files placed in a `.ebextensions/` directory in the application source bundle. They can install packages (`packages`), run commands (`commands`), create files (`files`), and configure services — without requiring a custom platform. Custom platforms (A) are for significant platform-level changes. User data scripts (C) can be configured but require more complex customization. Custom AMIs (D) work but require AMI maintenance and rebuild on every change.",
        },
        {
          id: "dva-d3-q10",
          question:
            "A developer has two CloudFormation stacks: `network-stack` (creates a VPC) and `app-stack` (creates EC2 instances in the VPC). The `app-stack` must be deployed after `network-stack`. Which `app-stack` template feature enforces this dependency?",
          options: [
            "A) `DependsOn` between the two stacks.",
            "B) `!ImportValue` referencing an exported output from `network-stack`.",
            "C) `AWS::CloudFormation::WaitCondition` in the `app-stack`.",
            "D) A `Metadata` block declaring the stack dependency.",
          ],
          correctIndex: 1,
          explanation:
            "Using `!ImportValue` to reference an exported value from `network-stack` creates an implicit dependency — CloudFormation cannot deploy `app-stack` until `network-stack` exports the referenced value. It also prevents deletion of `network-stack` while `app-stack` references it. `DependsOn` (A) works between resources within the same stack, not across stacks. `WaitCondition` (C) waits for signals from resources. `Metadata` (D) is informational only.",
        },
        {
          id: "dva-d3-q11",
          question:
            "A development team wants to publish internal npm packages to a private repository that CodeBuild can access. Which AWS service should they use?",
          options: [
            "A) Amazon S3 — store packages as zip files.",
            "B) AWS CodeArtifact — a fully managed artifact repository supporting npm, pip, and Maven.",
            "C) Amazon ECR — a managed container registry.",
            "D) AWS CodeCommit — store packages in a Git repository.",
          ],
          correctIndex: 1,
          explanation:
            "AWS CodeArtifact is a managed artifact repository that supports npm, pip, Maven, NuGet, and other package formats. CodeBuild can authenticate with CodeArtifact to pull and publish packages. S3 (A) can store files but doesn't support package manager protocols. ECR (C) is for container images, not npm packages. CodeCommit (D) is for source code, not package distribution.",
        },
        {
          id: "dva-d3-q12",
          question:
            "During a CodeDeploy in-place deployment with the `OneAtATime` configuration on 10 EC2 instances, an instance fails the health check. What happens to the deployment?",
          options: [
            "A) CodeDeploy continues deploying to the remaining instances.",
            "B) CodeDeploy stops the deployment and rolls back all instances to the previous version.",
            "C) CodeDeploy stops the deployment; already-deployed instances stay at the new version and the rest remain at the old version.",
            "D) CodeDeploy automatically retries the failed instance 3 times.",
          ],
          correctIndex: 2,
          explanation:
            "By default, CodeDeploy stops on the first failed instance in an in-place deployment. Instances already updated stay at the new version; instances not yet updated remain at the old version. Rollback requires a separate rollback deployment. CodeDeploy does not automatically retry failed health checks (D) or continue past failures (A). Full automatic rollback (B) must be explicitly configured using deployment group rollback settings.",
        },
        {
          id: "dva-d3-q13",
          question:
            "A developer wants the CodePipeline source stage to trigger automatically when code is pushed to a specific branch in AWS CodeCommit. Which configuration achieves this?",
          options: [
            "A) Configure a CodeBuild trigger on the CodeCommit repository.",
            "B) Set the CodePipeline source stage to use CodeCommit and enable the EventBridge rule (change detection).",
            "C) Set up a CodeCommit webhook pointing to the CodePipeline API.",
            "D) Schedule a CloudWatch Events rule to poll CodeCommit every minute.",
          ],
          correctIndex: 1,
          explanation:
            "When configuring a CodeCommit source in CodePipeline, enabling change detection creates an EventBridge (CloudWatch Events) rule that triggers the pipeline automatically on push events. CodeBuild (A) is a build service, not a pipeline trigger. CodeCommit does not support webhooks to CodePipeline directly (C). Polling (D) adds latency and is less efficient than event-driven triggers.",
        },
        {
          id: "dva-d3-q14",
          question:
            "A SAM application's Lambda function needs 512 MB of memory and a 30-second timeout. Where are these properties configured in the SAM template?",
          options: [
            "A) In the `Globals` section to apply to all functions.",
            "B) In the `AWS::Serverless::Function` resource's `Properties` section.",
            "C) In the `buildspec.yml` CodeBuild configuration.",
            "D) In the Lambda function's environment variables.",
          ],
          correctIndex: 1,
          explanation:
            "Function-specific properties like `MemorySize` and `Timeout` are set in the `Properties` section of an `AWS::Serverless::Function` resource. The `Globals` section (A) sets defaults that apply to all functions in the template — individual functions can override these. `buildspec.yml` (C) is for build configuration, not function configuration. Environment variables (D) pass runtime configuration, not compute resource settings.",
        },
        {
          id: "dva-d3-q15",
          question:
            "A developer updates a CloudFormation stack and receives the error: \"UPDATE_ROLLBACK_FAILED\". What is the BEST course of action?",
          options: [
            "A) Delete the stack and redeploy from scratch.",
            "B) Use the `ContinueUpdateRollback` API to skip the problematic resources and complete the rollback.",
            "C) Manually fix the resources in the AWS console and retry the stack update.",
            "D) Contact AWS Support — this state cannot be resolved.",
          ],
          correctIndex: 1,
          explanation:
            "`UPDATE_ROLLBACK_FAILED` occurs when CloudFormation cannot roll back to the previous state. The `ContinueUpdateRollback` API allows you to skip resources that are blocking the rollback, returning the stack to a stable `UPDATE_ROLLBACK_COMPLETE` state. Deleting the stack (A) may cause data loss. Manual fixes (C) can sometimes help but the recommended approach is `ContinueUpdateRollback`. This state is fully resolvable without AWS Support (D).",
        },
      ],
    },

    // ─── Domain 4: Troubleshooting and Optimization (18%) ───────────
    {
      id: "domain-4",
      title: "Troubleshooting and Optimization",
      weight: "18%",
      order: 4,
      summary:
        "This domain tests your ability to monitor, debug, and optimize AWS applications using the observability and performance tooling available on the platform. It accounts for 18% of the exam.\n\nExpect questions on **Amazon CloudWatch** (metrics, logs, alarms, dashboards), **AWS X-Ray** (distributed tracing, service maps, subsegment annotations), debugging Lambda functions (timeouts, out-of-memory errors, throttling), and performance tuning for DynamoDB and API Gateway.\n\nKey concepts include CloudWatch Log Insights queries, X-Ray tracing segments and subsegments, Lambda power tuning, DynamoDB capacity planning, and API Gateway throttling vs. usage plans. Understanding how to diagnose issues from metrics and logs is tested in scenario-based questions.",
      keyConceptsForExam: [
        "**Amazon CloudWatch** — metric namespaces, custom metrics, log groups, log streams, metric filters, composite alarms",
        "**CloudWatch Logs Insights** — query syntax for filtering, aggregating, and visualizing log data across log groups",
        "**AWS X-Ray** — traces, segments, subsegments, sampling rules, service maps, X-Ray SDK instrumentation",
        "**Lambda debugging** — CloudWatch Logs for print/log output, X-Ray active tracing, timeout vs. out-of-memory errors in logs",
        "**DynamoDB optimization** — on-demand vs. provisioned capacity, auto scaling, DAX for read-heavy workloads, hot partitions",
        "**API Gateway throttling** — account-level limits, stage-level throttling, usage plans per API key",
        "**Lambda performance** — memory allocation increases CPU proportionally, power tuning, concurrency limits and scaling behavior",
        "**CloudWatch Contributor Insights** — identify top contributors to traffic or errors in high-cardinality log data",
      ],
      examTips: [
        "When a Lambda function logs `Task timed out after X seconds`, increase the function timeout — not the memory.",
        "When a Lambda function logs `Runtime exited with error: signal: killed` or `Out of Memory`, increase the memory allocation.",
        "X-Ray service maps show the architecture of your application and latency at each node — use subsegments to trace external HTTP calls and DynamoDB operations within a Lambda function.",
        "DynamoDB `ProvisionedThroughputExceededException` usually indicates hot partitions — redesign the partition key or use DynamoDB DAX to cache reads.",
        "CloudWatch Logs Insights queries are the fastest way to search structured logs — know the basic syntax: `fields`, `filter`, `stats`, `sort`, `limit`.",
      ],
      relatedTopics: [
        {
          cloud: "aws",
          topicId: "cloudwatch-deep-dive",
          title: "CloudWatch Deep Dive",
        },
        { cloud: "aws", topicId: "lambda-in-depth", title: "Lambda In Depth" },
        {
          cloud: "aws",
          topicId: "dynamodb-deep-dive",
          title: "DynamoDB Deep Dive",
        },
      ],
      sections: [
        {
          heading: "Debugging Lambda Functions",
          body: "Lambda writes all output from `print()`, `console.log()`, and the logging framework to **CloudWatch Logs** automatically. Each function invocation creates a log event prefixed with `START`, `END`, and `REPORT` lines. The `REPORT` line includes billed duration, memory used, and maximum memory configured — use this to right-size memory allocation.\n\n**Common error patterns:**\n- `Task timed out after X seconds` → increase the function timeout (max 15 minutes)\n- `Runtime exited with error: signal: killed` → increase memory allocation (Lambda allocates CPU proportionally to memory)\n- `TooManyRequestsException (429)` → function is throttled; increase reserved concurrency or implement retry logic\n\nEnable **X-Ray active tracing** in the Lambda function configuration to generate traces automatically. Use the X-Ray SDK to add custom subsegments around DynamoDB calls, HTTP requests, and other external operations.",
          code: {
            lang: "python",
            label: "Lambda with X-Ray SDK subsegment tracing",
            snippet: `from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
import boto3

patch_all()  # Auto-patches boto3 calls

dynamodb = boto3.resource("dynamodb")

def handler(event, context):
    with xray_recorder.in_subsegment("fetch-user") as subsegment:
        subsegment.put_annotation("userId", event["userId"])
        table = dynamodb.Table("Users")
        response = table.get_item(Key={"userId": event["userId"]})
        subsegment.put_metadata("response", response)
    return response.get("Item")`,
          },
        },
        {
          heading: "CloudWatch Logs Insights",
          body: "CloudWatch Logs Insights provides a query language for searching and analyzing log data. Key commands:\n\n- `fields @timestamp, @message` — select specific fields\n- `filter @message like /ERROR/` — filter log events by pattern\n- `stats count(*) by bin(5m)` — aggregate metrics over time windows\n- `sort @timestamp desc` — order results\n- `limit 20` — limit the number of results\n\nFor Lambda functions, the `@duration`, `@billedDuration`, `@memorySize`, and `@maxMemoryUsed` fields are automatically parsed from `REPORT` log lines. Use these to identify slow invocations and optimize memory allocation.\n\n**Metric filters** extract numeric values from log events and publish them as CloudWatch custom metrics, enabling alarms on log-based data (e.g., count of ERROR log lines per minute).",
          code: {
            lang: "sql",
            label: "Logs Insights: find slow Lambda invocations",
            snippet: `fields @timestamp, @duration, @billedDuration, @maxMemoryUsed
| filter @type = "REPORT"
| filter @duration > 5000
| sort @duration desc
| limit 50`,
          },
        },
        {
          heading: "DynamoDB Performance Optimization",
          body: "**Hot partitions** occur when a disproportionate amount of traffic goes to a single partition key value. Symptoms include `ProvisionedThroughputExceededException` even when total capacity is not exceeded. Solutions include adding a random suffix to partition keys (write sharding) or choosing a higher-cardinality attribute as the partition key.\n\n**DynamoDB Accelerator (DAX)** is a fully managed, in-memory cache for DynamoDB that delivers sub-millisecond read latency. DAX is ideal for read-heavy workloads with repetitive reads of the same items. It is a drop-in replacement — the DAX SDK is compatible with the DynamoDB SDK. DAX does not cache `Scan` results or conditional writes.\n\nFor variable workloads, use **on-demand capacity mode** — DynamoDB automatically scales and you pay per request. For predictable workloads, **provisioned capacity with auto scaling** is more cost-effective.",
        },
      ],
      quiz: [
        {
          id: "dva-d4-q1",
          question:
            "A Lambda function is failing with the error `Task timed out after 3.00 seconds`. The function calls an external API that occasionally takes 5 seconds to respond. What is the CORRECT fix?",
          options: [
            "A) Increase the Lambda function's memory to 1024 MB.",
            "B) Increase the Lambda function's timeout to at least 10 seconds.",
            "C) Enable Lambda provisioned concurrency.",
            "D) Reduce the function's reserved concurrency.",
          ],
          correctIndex: 1,
          explanation:
            "The timeout error indicates the function was killed before the external API responded. Increasing the timeout gives the function sufficient time to receive the response. Memory (A) increases CPU but doesn't affect the timeout duration. Provisioned concurrency (C) reduces cold starts. Reducing reserved concurrency (D) limits scale and would make throttling more likely.",
        },
        {
          id: "dva-d4-q2",
          question:
            "A developer wants to trace an entire request from API Gateway through Lambda to DynamoDB. Which service should be used, and what must be enabled?",
          options: [
            "A) CloudWatch Logs — enable detailed logging on API Gateway and Lambda.",
            "B) AWS X-Ray — enable active tracing on API Gateway and Lambda; use the X-Ray SDK to instrument DynamoDB calls.",
            "C) AWS CloudTrail — enable data events for Lambda and DynamoDB.",
            "D) VPC Flow Logs — capture network traffic between services.",
          ],
          correctIndex: 1,
          explanation:
            "X-Ray distributed tracing creates a trace that spans across API Gateway, Lambda, and DynamoDB (and any other downstream services). Enabling active tracing on both API Gateway and Lambda and using the X-Ray SDK to instrument the DynamoDB client produces a complete service map. CloudWatch Logs (A) captures output but doesn't correlate requests across services. CloudTrail (C) logs API calls for auditing, not latency tracing. VPC Flow Logs (D) capture network metadata, not application traces.",
        },
        {
          id: "dva-d4-q3",
          question:
            "A DynamoDB table is experiencing `ProvisionedThroughputExceededException` on certain partition key values despite having sufficient total capacity. What is the MOST likely cause and fix?",
          options: [
            "A) The table needs more read/write capacity units — increase provisioned throughput.",
            "B) Hot partitions — some partition keys receive disproportionate traffic; redesign the partition key for higher cardinality or implement write sharding.",
            "C) The table has too many GSIs — remove unused GSIs to free capacity.",
            "D) DynamoDB Streams is consuming capacity — disable streams.",
          ],
          correctIndex: 1,
          explanation:
            "Hot partitions occur when traffic concentrates on a few partition key values, exceeding the per-partition limit even when total table capacity is available. The fix is to redesign the partition key to distribute traffic more evenly, or to use write sharding (adding a random suffix). Simply increasing capacity (A) doesn't solve hot partitions. GSIs (C) have their own capacity and don't affect base table partitions in this way. DynamoDB Streams (D) uses minimal capacity and is not the cause.",
        },
        {
          id: "dva-d4-q4",
          question:
            "A developer wants to count the number of ERROR log entries per minute from a Lambda function and trigger an alarm when this count exceeds 5. Which combination of CloudWatch features achieves this?",
          options: [
            "A) CloudWatch Logs Insights query + SNS notification.",
            "B) CloudWatch Logs metric filter (extracting error count) + CloudWatch Alarm on the custom metric.",
            "C) AWS X-Ray annotations + CloudWatch Dashboard.",
            "D) CloudTrail event + EventBridge rule.",
          ],
          correctIndex: 1,
          explanation:
            "A CloudWatch Logs metric filter scans incoming log events for a pattern (e.g., `[ERROR]`) and increments a custom metric counter. A CloudWatch Alarm on this metric triggers an SNS notification when the threshold is exceeded. Logs Insights (A) is for ad-hoc querying, not real-time alerting. X-Ray annotations (C) are for filtering traces, not log-based alerting. CloudTrail and EventBridge (D) are for API call events, not application log data.",
        },
        {
          id: "dva-d4-q5",
          question:
            "A Lambda function that reads from DynamoDB has a p99 latency of 200 ms. The team wants to reduce this to under 5 ms for repeated reads of the same items. What should they implement?",
          options: [
            "A) Increase the Lambda memory to 3008 MB to maximize CPU.",
            "B) Enable DynamoDB Accelerator (DAX) and update the Lambda function to use the DAX endpoint.",
            "C) Use DynamoDB strong consistency reads instead of eventual consistency.",
            "D) Add a GSI on the attribute being queried.",
          ],
          correctIndex: 1,
          explanation:
            "DAX is an in-memory cache for DynamoDB that delivers sub-millisecond (microsecond) read latency for cached items. It's ideal for repetitive reads of the same items. The DAX SDK is a drop-in replacement for the DynamoDB SDK. Increasing Lambda memory (A) reduces CPU-bound latency but not DynamoDB network latency. Strong consistency reads (C) are slower than eventual consistency, not faster. A GSI (D) improves query patterns but doesn't reduce read latency for existing access patterns.",
        },
        {
          id: "dva-d4-q6",
          question:
            "A Lambda function logs `Runtime exited with error: signal: killed` after processing large JSON payloads. What is the MOST likely cause?",
          options: [
            "A) The function timeout is too short.",
            "B) The function ran out of memory — increase the memory allocation.",
            "C) The function hit the concurrency limit.",
            "D) The Lambda execution role lacks permissions.",
          ],
          correctIndex: 1,
          explanation:
            "`signal: killed` indicates the Lambda runtime was killed by the operating system, which occurs when the function exceeds its allocated memory. The `REPORT` log line will show `Max Memory Used` equal to or exceeding `Memory Size`. Increase the memory allocation. Timeout errors (A) produce a `Task timed out` message. Concurrency limits (C) result in throttling errors (429). Permission errors (D) produce `AccessDeniedException`.",
        },
        {
          id: "dva-d4-q7",
          question:
            "A developer wants to identify which Lambda function invocations are taking longer than 5 seconds over the past hour. Which tool provides this analysis MOST efficiently?",
          options: [
            "A) Review CloudWatch Logs manually for each invocation.",
            "B) Use CloudWatch Logs Insights to query the function's log group for REPORT lines where @duration > 5000.",
            "C) Enable CloudTrail data events for Lambda and filter by duration.",
            "D) Use AWS X-Ray to set a sampling rate of 100% and review all traces.",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Logs Insights can query Lambda's structured REPORT log lines and filter by `@duration` in milliseconds. A query like `filter @duration > 5000` returns all invocations exceeding 5 seconds efficiently across thousands of log events. Manual review (A) is impractical at scale. CloudTrail (C) records Lambda invoke API calls but not execution duration. X-Ray (D) can show slow traces but requires 100% sampling (costly) and doesn't filter directly in the same way.",
        },
        {
          id: "dva-d4-q8",
          question:
            "An API Gateway stage is receiving 10,000 requests per second but the backend Lambda function can only handle 1,000 requests per second. The team wants to protect the Lambda function from being overwhelmed. Which API Gateway feature should be configured?",
          options: [
            "A) Enable API Gateway caching to absorb some requests.",
            "B) Configure stage-level throttling limits on API Gateway to limit the request rate.",
            "C) Increase Lambda reserved concurrency to 10,000.",
            "D) Enable API Gateway mutual TLS to reduce unauthorized requests.",
          ],
          correctIndex: 1,
          explanation:
            "API Gateway stage-level throttling (rate limit and burst limit) limits the number of requests per second forwarded to the backend. Requests exceeding the limit receive a `429 Too Many Requests` response. This protects the Lambda function from being overwhelmed. Caching (A) helps for repeated identical requests but doesn't throttle new unique requests. Increasing concurrency (C) allows more parallel Lambda invocations but doesn't prevent overload. Mutual TLS (D) is an authentication mechanism, not a rate-limiting tool.",
        },
        {
          id: "dva-d4-q9",
          question:
            "A developer uses X-Ray to trace a Lambda function. The X-Ray service map shows high latency in the `DynamoDB` node. Which X-Ray feature provides more detail about which DynamoDB operation is slow?",
          options: [
            "A) X-Ray sampling rules — increase the sampling rate for DynamoDB calls.",
            "B) X-Ray subsegments — the X-Ray SDK automatically creates subsegments for each AWS SDK call, including DynamoDB operations.",
            "C) X-Ray groups — filter traces by DynamoDB error responses.",
            "D) CloudWatch Container Insights — shows DynamoDB latency per container.",
          ],
          correctIndex: 1,
          explanation:
            "When you use `patch_all()` or instrument the AWS SDK with the X-Ray SDK, it automatically creates subsegments for each AWS SDK call (GetItem, Query, PutItem, etc.) with timing and metadata. This shows exactly which DynamoDB operation is slow within the function's segment. Sampling rules (A) control which requests are traced, not the detail level. X-Ray groups (C) filter traces but don't add operation detail. Container Insights (D) is for ECS/EKS, not Lambda.",
        },
        {
          id: "dva-d4-q10",
          question:
            "A Lambda function's `REPORT` log shows: `Duration: 800.00 ms, Billed Duration: 800 ms, Memory Size: 128 MB, Max Memory Used: 127 MB`. What should the developer do to optimize cost?",
          options: [
            "A) Reduce the timeout to 800 ms to avoid over-provisioning.",
            "B) Increase memory to 256 MB — more CPU may reduce duration enough to lower overall cost.",
            "C) Enable provisioned concurrency to reduce duration.",
            "D) Nothing — the function is running optimally at 128 MB.",
          ],
          correctIndex: 1,
          explanation:
            "Lambda billing is based on `GB-seconds` (memory × duration). The function is nearly out of memory (127/128 MB used) and may be CPU-constrained. Doubling memory to 256 MB doubles CPU allocation — if this halves the duration to 400 ms, the cost is the same but performance improves. AWS Lambda Power Tuning tool can find the optimal memory setting. Reducing timeout (A) doesn't affect billed duration. Provisioned concurrency (C) reduces cold starts, not execution duration. Running at 127/128 MB used (D) is risky — any additional memory use will cause an out-of-memory kill.",
        },
        {
          id: "dva-d4-q11",
          question:
            "A microservices application has intermittent failures. The developer wants to identify which service is causing the failure across a chain of Lambda function calls. Which AWS service provides a visual service dependency map?",
          options: [
            "A) Amazon CloudWatch Container Insights.",
            "B) AWS X-Ray service map.",
            "C) AWS CloudTrail event history.",
            "D) Amazon CloudWatch Synthetics.",
          ],
          correctIndex: 1,
          explanation:
            "X-Ray automatically constructs a service map showing each service node, the connections between them, response time distribution, and error/fault rates. This makes it easy to identify which service in the chain is causing failures. Container Insights (A) is for ECS/EKS container metrics. CloudTrail (C) records API calls for auditing. CloudWatch Synthetics (D) runs canary scripts for endpoint monitoring.",
        },
        {
          id: "dva-d4-q12",
          question:
            "A developer wants to receive an SNS alert when a Lambda function's error rate exceeds 5% over a 5-minute period. Which CloudWatch feature should be used to calculate the error rate?",
          options: [
            "A) A CloudWatch Alarm on the `Errors` metric.",
            "B) A CloudWatch Alarm using a metric math expression: `Errors / Invocations * 100 > 5`.",
            "C) A CloudWatch Logs Insights scheduled query.",
            "D) An EventBridge rule matching Lambda error events.",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch metric math allows you to combine multiple metrics in a single alarm expression. Dividing `Errors` by `Invocations` and multiplying by 100 gives the error percentage. An alarm on just `Errors` (A) doesn't account for invocation volume — a function with 1 error in 1 invocation and one with 1 error in 1,000 invocations would trigger the same alarm. Logs Insights queries (C) are not real-time. EventBridge (D) detects specific events, not calculated rate thresholds.",
        },
        {
          id: "dva-d4-q13",
          question:
            "A developer is troubleshooting why a Lambda function is being throttled. CloudWatch shows the `ConcurrentExecutions` metric is consistently hitting the account limit. What are the TWO BEST solutions?",
          options: [
            "A) Request a concurrency limit increase via AWS Service Quotas and set reserved concurrency on lower-priority functions.",
            "B) Switch the Lambda function to Fargate — Fargate has no concurrency limits.",
            "C) Use SQS as a buffer between the event source and Lambda to absorb bursts.",
            "D) Enable Lambda Destinations to route throttled events to S3.",
          ],
          correctIndex: 0,
          explanation:
            "Two approaches work together: (1) requesting a concurrency limit increase via AWS Service Quotas to raise the account ceiling, and (2) setting reserved concurrency on lower-priority functions to prevent them from consuming all available concurrency. This combination addresses both the ceiling and the allocation. Fargate (B) is for containers and has different scaling characteristics — it doesn't directly solve Lambda throttling. SQS buffering (C) is a valid architectural pattern but doesn't resolve the concurrency limit. Lambda Destinations (D) handle async invocation outcomes, not throttling events from synchronous sources.",
        },
        {
          id: "dva-d4-q14",
          question:
            "An application writes custom business metrics (e.g., orders per minute) to CloudWatch. The developer uses `put_metric_data` in Lambda. On high-traffic days, the function is called 50,000 times per minute. What is the MOST efficient way to publish the metric?",
          options: [
            "A) Call `put_metric_data` on every Lambda invocation.",
            "B) Aggregate metrics in the Lambda function and publish a single `put_metric_data` call with multiple MetricData entries at the end of each batch window.",
            "C) Write metrics to CloudWatch Logs and use a metric filter to extract the values.",
            "D) Store metrics in DynamoDB and create a scheduled Lambda to aggregate and publish them.",
          ],
          correctIndex: 2,
          explanation:
            "CloudWatch Logs metric filters are an efficient way to publish high-volume custom metrics — write a structured log line (e.g., `[METRIC] orders=1`) and the filter extracts and sums the values, publishing a custom metric. This avoids 50,000 individual `put_metric_data` API calls. Calling `put_metric_data` on every invocation (A) is expensive and may hit API rate limits. Aggregating in Lambda (B) requires stateful logic. DynamoDB + scheduled Lambda (D) adds complexity and latency.",
        },
        {
          id: "dva-d4-q15",
          question:
            "A developer deployed a new Lambda function version. After deployment, error rates increased. The developer wants to quickly route all traffic back to the previous version. How should they have configured the deployment to enable this?",
          options: [
            "A) Deploy using a Lambda alias pointing to the new version — update the alias to point to the previous version to roll back.",
            "B) Keep both versions deployed and manually update the event source mapping.",
            "C) Use Lambda layers to version the code — revert the layer version.",
            "D) Re-deploy the previous code package directly to `$LATEST`.",
          ],
          correctIndex: 0,
          explanation:
            "Lambda aliases (e.g., `prod`) are pointers to specific function versions. API Gateway, event source mappings, and other services invoke the alias, not the version directly. Rolling back is as simple as updating the alias to point to the previous version — no client changes required. Manually updating event source mappings (B) requires identifying and updating all integrations. Layers (C) package dependencies, not function code logic for rollback. Redeploying to `$LATEST` (D) overwrites the latest code but doesn't publish a new version for the alias to point to.",
        },
      ],
    },
  ],
};
