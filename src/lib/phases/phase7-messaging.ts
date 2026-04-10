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

// ─── AWS SQS & SNS ──────────────────────────────────────────────────────────

export const sqsSnsTopic: Topic = {
  id: "sqs-sns",
  title: "SQS & SNS — Queues and Notifications",
  level: "Intermediate",
  readTime: "14 min",
  category: "Messaging",
  summary:
    "SQS is AWS's fully managed message queue service for decoupling producers and consumers, while SNS is a pub/sub notification service for fan-out messaging. Together they form the backbone of event-driven architectures on AWS — SQS provides reliable point-to-point delivery with at-least-once semantics, and SNS broadcasts messages to multiple subscribers simultaneously.",
  gcpEquivalent: "Pub/Sub",
  azureEquivalent: "Service Bus + Event Grid",
  sections: [
    {
      heading: "What is SQS?",
      body: "Simple Queue Service (SQS) is a fully managed message queue that decouples message producers from consumers. Messages are stored durably across multiple AZs until a consumer processes and deletes them.\n\nSQS offers two queue types:\n• **Standard queue** — nearly unlimited throughput, at-least-once delivery, best-effort ordering. Messages may be delivered more than once and out of order. Use when your consumer is idempotent and ordering is not critical.\n• **FIFO queue** — exactly-once processing, strict ordering within a message group. Throughput is 300 messages/second by default (3,000 with batching and high-throughput mode). Use for workflows where order matters — payment processing, inventory updates, command sequences.\n\n**Key concepts:**\n• **Visibility timeout** — after a consumer receives a message, it becomes invisible to other consumers for this duration (default 30s, max 12h). If the consumer doesn't delete the message before the timeout expires, it becomes visible again for redelivery.\n• **Long polling** — reduces empty responses and cost by waiting up to 20 seconds for a message to arrive before returning. Always enable long polling (`WaitTimeSeconds=20`) to reduce API calls.\n• **Message retention** — messages are retained for 4 days by default, configurable up to 14 days.",
      code: {
        lang: "bash",
        label: "Create SQS queues (Standard and FIFO)",
        snippet: `# Create a standard queue with long polling and 14-day retention
aws sqs create-queue \\
  --queue-name order-events \\
  --attributes '{
    "ReceiveMessageWaitTimeSeconds": "20",
    "MessageRetentionPeriod": "1209600",
    "VisibilityTimeout": "60"
  }'

# Create a FIFO queue (name must end in .fifo)
aws sqs create-queue \\
  --queue-name order-events.fifo \\
  --attributes '{
    "FifoQueue": "true",
    "ContentBasedDeduplication": "true",
    "ReceiveMessageWaitTimeSeconds": "20"
  }'

# Send a message to the standard queue
QUEUE_URL=$(aws sqs get-queue-url \\
  --queue-name order-events --query QueueUrl --output text)

aws sqs send-message \\
  --queue-url $QUEUE_URL \\
  --message-body '{"orderId":"12345","action":"created"}' \\
  --message-attributes '{"EventType":{"DataType":"String","StringValue":"OrderCreated"}}'

# Receive and delete a message
MSG=$(aws sqs receive-message \\
  --queue-url $QUEUE_URL \\
  --max-number-of-messages 1 \\
  --wait-time-seconds 20 \\
  --query 'Messages[0]')

RECEIPT=$(echo $MSG | jq -r '.ReceiptHandle')
aws sqs delete-message \\
  --queue-url $QUEUE_URL \\
  --receipt-handle "$RECEIPT"`,
      },
    },
    {
      heading: "What is SNS?",
      body: "Simple Notification Service (SNS) is a fully managed pub/sub messaging service. Publishers send messages to a **topic**, and SNS delivers copies to all **subscribers** of that topic — fan-out with zero custom routing code.\n\n**Subscription protocols:**\n• **SQS** — deliver to a queue (most common pattern for backend processing)\n• **Lambda** — invoke a function directly\n• **HTTP/HTTPS** — POST to a webhook endpoint\n• **Email / Email-JSON** — send notification emails\n• **SMS** — send text messages (not available in all regions)\n• **Kinesis Data Firehose** — stream to S3, Redshift, or OpenSearch\n\n**Topic types:**\n• **Standard topic** — best-effort ordering, at-least-once delivery, nearly unlimited throughput\n• **FIFO topic** — strict ordering and exactly-once delivery; can only have SQS FIFO queues as subscribers\n\n**Message filtering:** attach a **filter policy** to a subscription so it only receives messages matching specific attributes. This eliminates the need for consumers to discard irrelevant messages — filtering happens server-side at no extra cost.\n\n**Message size:** up to 256 KB per message. For larger payloads, store the data in S3 and send a reference via SNS (use the Extended Client Library for Java, or implement the pattern manually).",
      code: {
        lang: "bash",
        label: "Create SNS topic and subscribe",
        snippet: `# Create an SNS topic
TOPIC_ARN=$(aws sns create-topic \\
  --name order-notifications \\
  --query TopicArn --output text)

# Subscribe an SQS queue to the topic
QUEUE_ARN=$(aws sqs get-queue-attributes \\
  --queue-url $QUEUE_URL \\
  --attribute-names QueueArn \\
  --query 'Attributes.QueueArn' --output text)

aws sns subscribe \\
  --topic-arn $TOPIC_ARN \\
  --protocol sqs \\
  --notification-endpoint $QUEUE_ARN \\
  --attributes '{"FilterPolicy":"{\"EventType\":[\"OrderCreated\",\"OrderShipped\"]}"}'

# Subscribe a Lambda function
aws sns subscribe \\
  --topic-arn $TOPIC_ARN \\
  --protocol lambda \\
  --notification-endpoint arn:aws:lambda:ap-southeast-1:123456789:function:process-order

# Publish a message with attributes
aws sns publish \\
  --topic-arn $TOPIC_ARN \\
  --message '{"orderId":"12345","status":"shipped"}' \\
  --message-attributes '{"EventType":{"DataType":"String","StringValue":"OrderShipped"}}'`,
      },
    },
    {
      heading: "SQS + SNS fan-out pattern",
      body: "The fan-out pattern combines SNS and SQS to broadcast a single event to multiple independent consumers. The publisher sends one message to an SNS topic, and each consumer has its own SQS queue subscribed to that topic.\n\n**Why fan-out?**\n• **Decoupling** — the publisher doesn't know how many consumers exist or what they do\n• **Independent processing** — each queue has its own visibility timeout, retry policy, and DLQ; one slow consumer doesn't block others\n• **Selective filtering** — each subscription can have a filter policy, so queues only receive relevant messages\n\n**Common architecture:**\n```\nOrder Service → SNS Topic → SQS Queue (Payment) → Payment Lambda\n                          → SQS Queue (Inventory) → Inventory Lambda\n                          → SQS Queue (Analytics) → Analytics Lambda\n                          → SQS Queue (Email) → Email Lambda\n```\n\nEach Lambda processes independently. If the email service is slow, payment processing is unaffected.\n\n**Important:** you must grant SNS permission to send messages to each SQS queue by setting an SQS queue policy. Without this, SNS silently drops messages.",
      code: {
        lang: "bash",
        label: "Set up fan-out: SNS topic → multiple SQS queues",
        snippet: `# Create separate queues for each consumer
for SERVICE in payment inventory analytics email; do
  aws sqs create-queue \\
    --queue-name "order-$SERVICE" \\
    --attributes '{"ReceiveMessageWaitTimeSeconds":"20"}'
done

# Grant SNS permission to send to each queue (queue policy)
TOPIC_ARN=$(aws sns list-topics \\
  --query "Topics[?ends_with(TopicArn,'order-notifications')].TopicArn" \\
  --output text)

for SERVICE in payment inventory analytics email; do
  QUEUE_URL=$(aws sqs get-queue-url \\
    --queue-name "order-$SERVICE" --query QueueUrl --output text)
  QUEUE_ARN=$(aws sqs get-queue-attributes \\
    --queue-url $QUEUE_URL \\
    --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)

  # Set queue policy allowing SNS to send messages
  POLICY="{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"sns.amazonaws.com\"},\"Action\":\"sqs:SendMessage\",\"Resource\":\"$QUEUE_ARN\",\"Condition\":{\"ArnEquals\":{\"aws:SourceArn\":\"$TOPIC_ARN\"}}}]}"
  aws sqs set-queue-attributes \\
    --queue-url $QUEUE_URL \\
    --attributes "{\"Policy\":$(echo $POLICY | jq -Rs .)}"

  # Subscribe the queue to the SNS topic
  aws sns subscribe \\
    --topic-arn $TOPIC_ARN \\
    --protocol sqs \\
    --notification-endpoint $QUEUE_ARN
done`,
      },
    },
    {
      heading: "Dead-letter queues",
      body: "A dead-letter queue (DLQ) captures messages that fail processing after a configured number of attempts. Without a DLQ, poison messages cycle indefinitely — consuming compute and blocking healthy messages in FIFO queues.\n\n**How it works:**\n1. A consumer receives a message and fails to process it (crashes, throws an error, or the visibility timeout expires before deletion)\n2. The message becomes visible again and is redelivered\n3. After `maxReceiveCount` deliveries, SQS moves the message to the DLQ\n4. You inspect, debug, and optionally redrive messages from the DLQ back to the source queue\n\n**Best practices:**\n• Set `maxReceiveCount` to 3–5 for most workloads\n• Set DLQ retention to 14 days (maximum) to give you time to investigate\n• Set up a CloudWatch alarm on `ApproximateNumberOfMessagesVisible` on the DLQ — any message arriving there indicates a processing failure\n• Use the **DLQ redrive** feature (console or API) to move messages back to the source queue after fixing the bug\n• For SNS, configure a DLQ on the subscription (not the topic) to capture delivery failures to a specific endpoint\n\n**SNS delivery retries:** SNS has a built-in retry policy for each protocol. For SQS and Lambda, it retries up to 100,015 times over 23 days. For HTTP endpoints, you configure the retry policy (number of retries, backoff). If all retries fail, the message goes to the subscription's DLQ.",
      code: {
        lang: "bash",
        label: "Configure a dead-letter queue with redrive",
        snippet: `# Create the DLQ
aws sqs create-queue \\
  --queue-name order-events-dlq \\
  --attributes '{"MessageRetentionPeriod":"1209600"}'

DLQ_ARN=$(aws sqs get-queue-attributes \\
  --queue-url $(aws sqs get-queue-url --queue-name order-events-dlq --query QueueUrl --output text) \\
  --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)

# Attach DLQ to the source queue (max 3 receives before DLQ)
QUEUE_URL=$(aws sqs get-queue-url \\
  --queue-name order-events --query QueueUrl --output text)

aws sqs set-queue-attributes \\
  --queue-url $QUEUE_URL \\
  --attributes "{\"RedrivePolicy\":\"{\\\\\"deadLetterTargetArn\\\\\":\\\\\"$DLQ_ARN\\\\\",\\\\\"maxReceiveCount\\\\\":\\\\\"3\\\\\"}\"}"

# Check messages in the DLQ
DLQ_URL=$(aws sqs get-queue-url \\
  --queue-name order-events-dlq --query QueueUrl --output text)

aws sqs get-queue-attributes \\
  --queue-url $DLQ_URL \\
  --attribute-names ApproximateNumberOfMessagesVisible

# Redrive messages from DLQ back to source queue
aws sqs start-message-move-task \\
  --source-arn $DLQ_ARN \\
  --destination-arn $(aws sqs get-queue-attributes \\
    --queue-url $QUEUE_URL \\
    --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)`,
      },
    },
  ],
};

// ─── GCP Pub/Sub ─────────────────────────────────────────────────────────────

export const pubSubTopic: Topic = {
  id: "pub-sub",
  title: "Pub/Sub — Global Messaging",
  level: "Intermediate",
  readTime: "12 min",
  category: "Messaging",
  summary:
    "Pub/Sub is GCP's globally distributed messaging service that delivers at-least-once semantics with both push and pull delivery modes. It decouples publishers from subscribers across regions, handles automatic scaling from zero to millions of messages per second, and supports exactly-once delivery for critical workloads.",
  awsEquivalent: "SQS + SNS",
  azureEquivalent: "Service Bus + Event Grid",
  sections: [
    {
      heading: "What is Pub/Sub?",
      body: "Pub/Sub is a fully managed, real-time messaging service that lets you send and receive messages between independent applications. Publishers send messages to a **topic**, and subscribers receive messages through **subscriptions** attached to that topic.\n\n**Core concepts:**\n• **Topic** — a named resource to which publishers send messages. A topic can have zero or more subscriptions.\n• **Subscription** — a named resource representing a stream of messages from a single topic. Each subscription receives a copy of every message published to its topic.\n• **Message** — the data (up to 10 MB) plus optional attributes (key-value metadata). Messages are stored for up to 31 days if unacknowledged.\n\n**Delivery modes:**\n• **Pull** — the subscriber calls the Pub/Sub API to retrieve messages. Use for backend services, batch processing, and workloads that need flow control. The subscriber controls the rate of consumption.\n• **Push** — Pub/Sub delivers messages to an HTTPS endpoint (Cloud Run, App Engine, Cloud Functions, or any public URL). Use for serverless event-driven architectures. Pub/Sub handles retries with exponential backoff.\n\n**Global by default:** topics and subscriptions are global resources. A publisher in us-central1 and a subscriber in asia-southeast1 work seamlessly — Pub/Sub routes messages through Google's global network with no extra configuration.",
      code: {
        lang: "bash",
        label: "Create topic, subscription, publish and pull",
        snippet: `# Create a topic
gcloud pubsub topics create order-events

# Create a pull subscription
gcloud pubsub subscriptions create order-processor \\
  --topic=order-events \\
  --ack-deadline=60 \\
  --message-retention-duration=7d \\
  --expiration-period=never

# Create a push subscription (delivers to Cloud Run)
gcloud pubsub subscriptions create order-webhook \\
  --topic=order-events \\
  --push-endpoint=https://order-service-xyz.run.app/webhook \\
  --ack-deadline=30 \\
  --push-auth-service-account=pubsub-invoker@my-project.iam.gserviceaccount.com

# Publish a message with attributes
gcloud pubsub topics publish order-events \\
  --message='{"orderId":"12345","status":"created"}' \\
  --attribute=eventType=OrderCreated,region=ap-southeast-1

# Pull messages (acknowledge after processing)
gcloud pubsub subscriptions pull order-processor \\
  --limit=10 \\
  --auto-ack`,
      },
    },
    {
      heading: "Exactly-once delivery",
      body: "By default, Pub/Sub provides **at-least-once** delivery — a message may be delivered more than once if the subscriber doesn't acknowledge it before the ack deadline. For most workloads, design idempotent consumers and at-least-once is sufficient.\n\nFor workloads where duplicate processing is unacceptable (financial transactions, inventory decrements), Pub/Sub offers **exactly-once delivery** on pull subscriptions.\n\n**How it works:**\n1. Enable exactly-once delivery on the subscription\n2. Pub/Sub assigns a unique `ack_id` to each delivery attempt\n3. The subscriber acknowledges using this `ack_id`\n4. If the acknowledgement succeeds, Pub/Sub guarantees the message won't be redelivered\n5. If the acknowledgement fails (e.g., network issue), the subscriber may receive the message again — but with a **new** `ack_id`\n\n**Trade-offs:**\n• Higher publish and acknowledge latency (~50–100ms additional)\n• Only available for pull subscriptions (not push)\n• The subscriber must still handle the case where an ack fails — exactly-once is about delivery, not processing. Use an idempotency key for end-to-end exactly-once semantics.\n\n**When to use:** payment systems, ledger updates, inventory management. For analytics, logging, and notifications, at-least-once with idempotent consumers is simpler and cheaper.",
      code: {
        lang: "bash",
        label: "Enable exactly-once delivery",
        snippet: `# Create a subscription with exactly-once delivery
gcloud pubsub subscriptions create payment-processor \\
  --topic=order-events \\
  --enable-exactly-once-delivery \\
  --ack-deadline=60 \\
  --message-retention-duration=7d

# Verify exactly-once is enabled
gcloud pubsub subscriptions describe payment-processor \\
  --format="value(enableExactlyOnceDelivery)"

# Update an existing subscription to enable exactly-once
gcloud pubsub subscriptions update order-processor \\
  --enable-exactly-once-delivery`,
      },
    },
    {
      heading: "Dead-letter topics",
      body: "A dead-letter topic (DLT) captures messages that fail processing after a configured number of delivery attempts. This prevents poison messages from blocking the subscription indefinitely.\n\n**Configuration:**\n• **max-delivery-attempts** — number of times Pub/Sub delivers a message before forwarding it to the DLT (default: 5, range: 5–100)\n• The dead-letter topic is a regular Pub/Sub topic — create a subscription on it to inspect or redrive failed messages\n\n**Required permissions:** the Pub/Sub service account needs `pubsub.topics.publish` on the dead-letter topic and `pubsub.subscriptions.consume` on the source subscription. GCP sets these automatically when you configure via `gcloud`.\n\n**Monitoring:**\n• Create a subscription on the DLT to process or inspect failed messages\n• Set up a Cloud Monitoring alert on `subscription/num_undelivered_messages` for the DLT subscription\n• Use Pub/Sub's built-in metrics to track delivery attempts per message\n\n**Redriving:** unlike SQS, Pub/Sub has no built-in redrive. To replay dead-letter messages, consume from the DLT subscription and republish to the original topic (manually or via a Cloud Function).",
      code: {
        lang: "bash",
        label: "Configure dead-letter topic",
        snippet: `# Create the dead-letter topic and a subscription to inspect failures
gcloud pubsub topics create order-events-dlt
gcloud pubsub subscriptions create dlt-inspector \\
  --topic=order-events-dlt \\
  --message-retention-duration=14d

# Update the source subscription to use the dead-letter topic
gcloud pubsub subscriptions update order-processor \\
  --dead-letter-topic=order-events-dlt \\
  --max-delivery-attempts=5

# Verify dead-letter configuration
gcloud pubsub subscriptions describe order-processor \\
  --format="yaml(deadLetterPolicy)"

# Pull messages from the dead-letter topic for inspection
gcloud pubsub subscriptions pull dlt-inspector \\
  --limit=5 \\
  --format="json"`,
      },
    },
    {
      heading: "Ordering keys",
      body: "By default, Pub/Sub does not guarantee message ordering. For workloads where order matters (e.g., all events for a specific user or order must be processed sequentially), use **ordering keys**.\n\n**How ordering keys work:**\n1. The publisher attaches an ordering key to each message (e.g., the order ID or user ID)\n2. Messages with the **same ordering key** are delivered to the subscriber in the order they were published\n3. Messages with **different ordering keys** may be delivered in any order and can be processed in parallel\n\n**Important behaviours:**\n• The subscription must have `enable-message-ordering` set to `true`\n• If a message with an ordering key fails acknowledgement, all subsequent messages with that same key are **paused** until the failed message is acknowledged or nacked\n• Ordering is per-region: if you publish from multiple regions, order is guaranteed only within each region\n• Ordering keys act as a partitioning mechanism — all messages with the same key go through the same internal partition, limiting throughput per key to about 1 MB/s\n\n**Best practices:**\n• Use fine-grained ordering keys (order ID, not customer ID) to maximise parallelism\n• Keep the number of unique ordering keys high to distribute load\n• Handle nack carefully — nacking pauses the entire key's stream",
      code: {
        lang: "bash",
        label: "Publish and consume ordered messages",
        snippet: `# Create a subscription with message ordering enabled
gcloud pubsub subscriptions create order-sequencer \\
  --topic=order-events \\
  --enable-message-ordering \\
  --ack-deadline=60

# Publish ordered messages (same ordering key = guaranteed order)
gcloud pubsub topics publish order-events \\
  --message='{"orderId":"12345","step":"payment_received"}' \\
  --ordering-key=order-12345 \\
  --attribute=step=1

gcloud pubsub topics publish order-events \\
  --message='{"orderId":"12345","step":"inventory_reserved"}' \\
  --ordering-key=order-12345 \\
  --attribute=step=2

gcloud pubsub topics publish order-events \\
  --message='{"orderId":"12345","step":"shipped"}' \\
  --ordering-key=order-12345 \\
  --attribute=step=3

# Messages for order-12345 are delivered in order: step 1 → 2 → 3
# Messages for different orders are delivered independently`,
      },
    },
  ],
};

// ─── Azure Service Bus ───────────────────────────────────────────────────────

export const serviceBusTopic: Topic = {
  id: "service-bus",
  title: "Service Bus — Enterprise Messaging",
  level: "Intermediate",
  readTime: "12 min",
  category: "Messaging",
  summary:
    "Azure Service Bus is a fully managed enterprise message broker with queues (point-to-point) and topics (pub/sub). It provides advanced features like sessions for ordered processing, transactions for atomic multi-queue operations, scheduled delivery, and dead-lettering — making it the backbone for mission-critical messaging on Azure.",
  awsEquivalent: "SQS + SNS",
  gcpEquivalent: "Pub/Sub",
  sections: [
    {
      heading: "What is Service Bus?",
      body: "Azure Service Bus is a cloud-native message broker that supports two communication patterns:\n\n**Queues** — point-to-point messaging. One sender, one receiver. Messages are stored durably and delivered in FIFO order. Each message is processed by exactly one consumer (competing consumers pattern for horizontal scaling).\n\n**Topics and subscriptions** — pub/sub messaging. Publishers send to a topic, and each subscription receives a copy. Subscriptions support **SQL-like filter rules** to receive only relevant messages — filtering happens server-side.\n\n**Key features:**\n• **Message size** — up to 256 KB (Standard tier) or 100 MB (Premium tier)\n• **Message lock** — when a consumer receives a message in PeekLock mode, it's locked (invisible to others) for a configurable duration. The consumer must complete or abandon the message.\n• **Scheduled delivery** — enqueue a message now but make it available only at a future time\n• **Duplicate detection** — Service Bus deduplicates messages based on a message ID within a configurable time window\n• **Auto-forwarding** — chain queues and topics together; messages arriving in one entity are automatically forwarded to another\n\n**Tiers:**\n• **Basic** — queues only, no topics, no sessions, no transactions. Use for simple workloads.\n• **Standard** — queues and topics, shared infrastructure, variable throughput, pay-per-message.\n• **Premium** — dedicated resources, predictable latency, up to 100 MB messages, VNet integration. Use for production workloads requiring SLA guarantees.",
      code: {
        lang: "bash",
        label: "Create Service Bus namespace, queue, and topic",
        snippet: `# Create a Service Bus namespace (Standard tier)
az servicebus namespace create \\
  --name order-messaging \\
  --resource-group cloud-learn-rg \\
  --location southeastasia \\
  --sku Standard

# Create a queue with sessions and dead-lettering
az servicebus queue create \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --name order-processing \\
  --lock-duration PT1M \\
  --max-delivery-count 5 \\
  --default-message-time-to-live P14D \\
  --enable-dead-lettering-on-message-expiration true \\
  --enable-session true

# Create a topic with subscriptions
az servicebus topic create \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --name order-events \\
  --default-message-time-to-live P7D

# Create subscriptions with SQL filters
az servicebus topic subscription create \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --topic-name order-events \\
  --name payment-sub

az servicebus topic subscription rule create \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --topic-name order-events \\
  --subscription-name payment-sub \\
  --name payment-filter \\
  --filter-sql-expression "eventType = 'OrderCreated' OR eventType = 'PaymentReceived'"`,
      },
    },
    {
      heading: "Sessions and FIFO",
      body: "Service Bus **sessions** provide guaranteed FIFO ordering and exclusive processing for related messages. They solve two problems simultaneously: strict ordering and message affinity (ensuring all messages in a group are processed by the same consumer).\n\n**How sessions work:**\n1. The publisher sets a `SessionId` on each message (e.g., the order ID)\n2. Messages with the same session ID are stored in order within the queue\n3. A consumer **accepts a session** — Service Bus locks that session exclusively to that consumer\n4. The consumer processes all messages in the session in order\n5. When done, the consumer closes the session (or it times out), making it available for others\n\n**Session state:** each session can store up to 256 KB of state data. Use this to track workflow progress — e.g., store which steps of a multi-step order process have completed. Session state persists across consumer restarts.\n\n**Key behaviours:**\n• A queue/subscription must be created with `--enable-session true`\n• Non-session-aware consumers **cannot** receive from a session-enabled queue\n• Multiple consumers can process different sessions in parallel — each consumer locks a different session ID\n• If a consumer crashes, the session lock expires and another consumer picks it up\n\n**Use cases:**\n• Multi-step order processing (all steps for order-123 processed in sequence)\n• User activity streams (all events for user-456 processed by one handler)\n• Device telemetry (all readings from sensor-789 processed in order)",
      code: {
        lang: "bash",
        label: "Send session-aware messages",
        snippet: `# Get the connection string
CONN_STR=$(az servicebus namespace authorization-rule keys list \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --name RootManageSharedAccessKey \\
  --query primaryConnectionString --output tsv)

# Send messages with session IDs using the Service Bus CLI extension
# Messages with the same session-id are delivered in FIFO order
az servicebus queue send \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --queue-name order-processing \\
  --session-id "order-12345" \\
  --body '{"step":"validate","orderId":"12345"}'

az servicebus queue send \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --queue-name order-processing \\
  --session-id "order-12345" \\
  --body '{"step":"charge","orderId":"12345"}'

az servicebus queue send \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --queue-name order-processing \\
  --session-id "order-12345" \\
  --body '{"step":"ship","orderId":"12345"}'

# Messages for order-12345 are always delivered: validate → charge → ship`,
      },
    },
    {
      heading: "Event Grid vs Service Bus",
      body: "Azure has two messaging services that overlap in functionality — choosing the right one depends on your use case.\n\n**Event Grid** — reactive event routing:\n• Designed for **event-driven architectures** where you react to state changes\n• Push-based delivery to event handlers (Azure Functions, Logic Apps, webhooks)\n• Events are lightweight notifications (\"something happened\") — typically <1 MB\n• At-least-once delivery, no ordering guarantees\n• Per-event pricing (~$0.60 per million events), no idle cost\n• Best for: Azure resource events (blob created, VM started), IoT telemetry, webhook fan-out\n\n**Service Bus** — enterprise message brokering:\n• Designed for **command and workflow patterns** where reliable, ordered processing matters\n• Pull-based or push-based (with Azure Functions trigger) consumption\n• Messages are **commands or documents** that carry payload and must be processed exactly once\n• FIFO ordering (sessions), transactions, dead-lettering, scheduled delivery\n• Namespace pricing (Standard: ~$10/month + per-message; Premium: ~$668/month for 1 MU)\n• Best for: order processing, payment workflows, B2B integrations, saga orchestration\n\n**When to combine them:**\nUse Event Grid to **detect** events (e.g., blob uploaded to storage) and route them to a Service Bus queue for **reliable, ordered processing**. Event Grid handles fan-out and filtering; Service Bus handles durability and workflow.\n\n**Rule of thumb:** if you need \"fire and forget\" event notification, use Event Grid. If you need guaranteed delivery, ordering, or transactions, use Service Bus.",
    },
    {
      heading: "Dead-letter queues",
      body: "Service Bus automatically provides a **dead-letter queue (DLQ)** for every queue and subscription — no manual creation required. The DLQ is a sub-queue accessible at `<queue-name>/$deadletterqueue`.\n\n**Messages are dead-lettered when:**\n• **Max delivery count exceeded** — the message has been received and abandoned (or lock expired) more times than `max-delivery-count` (default: 10)\n• **TTL expired** — the message's time-to-live expires and `enable-dead-lettering-on-message-expiration` is true\n• **Filter evaluation exception** — a subscription rule filter throws an error\n• **Explicit dead-lettering** — the consumer programmatically dead-letters the message (e.g., invalid payload)\n\n**DLQ properties:** each dead-lettered message retains its original properties plus additional metadata:\n• `DeadLetterReason` — why it was dead-lettered (e.g., \"MaxDeliveryCountExceeded\")\n• `DeadLetterErrorDescription` — additional context\n\n**Monitoring and reprocessing:**\n• Monitor the DLQ depth via Azure Monitor metrics (`DeadletteredMessages`)\n• Set up an alert when `DeadletteredMessages > 0`\n• Use Service Bus Explorer (Azure Portal) or the CLI to inspect and resubmit messages\n• For automated redriving, create an Azure Function triggered by the DLQ that republishes messages to the source queue after applying fixes",
      code: {
        lang: "bash",
        label: "Inspect and manage dead-letter queue",
        snippet: `# View dead-letter message count
az servicebus queue show \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --name order-processing \\
  --query "countDetails.deadLetterMessageCount"

# Peek at dead-letter messages (read without removing)
az servicebus queue peek \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --queue-name order-processing \\
  --is-dead-letter-queue true \\
  --message-count 5

# Receive (and remove) a message from the dead-letter queue
az servicebus queue receive \\
  --namespace-name order-messaging \\
  --resource-group cloud-learn-rg \\
  --queue-name order-processing \\
  --is-dead-letter-queue true

# Set up Azure Monitor alert for dead-letter messages
az monitor metrics alert create \\
  --name dlq-alert \\
  --resource-group cloud-learn-rg \\
  --scopes "/subscriptions/{sub-id}/resourceGroups/cloud-learn-rg/providers/Microsoft.ServiceBus/namespaces/order-messaging" \\
  --condition "total DeadletteredMessages > 0" \\
  --window-size 5m \\
  --evaluation-frequency 1m \\
  --action "/subscriptions/{sub-id}/resourceGroups/cloud-learn-rg/providers/Microsoft.Insights/actionGroups/ops-team"`,
      },
    },
  ],
};
