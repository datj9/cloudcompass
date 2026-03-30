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

// ─── AWS Observability Module ────────────────────────────────────────────────

export const awsObservabilityModule: Module = {
  id: "observability",
  title: "Observability",
  desc: "Monitor your AWS workloads with CloudWatch metrics, logs, alarms, and the CloudWatch Agent.",
  category: "Observability",
  topics: [
    {
      id: "cloudwatch-basics",
      title: "CloudWatch — Metrics, Logs & Alarms",
      level: "Beginner",
      readTime: "10 min",
      category: "Observability",
      summary:
        "Learn how AWS CloudWatch unifies metrics, logs, and alarms into a single observability platform, covering dashboards, Insights queries, SNS notifications, and the CloudWatch Agent for host-level telemetry.",
      gcpEquivalent: "Cloud Monitoring",
      azureEquivalent: "Azure Monitor",
      sections: [
        {
          heading: "What is CloudWatch?",
          body:
            "**Amazon CloudWatch** is AWS's unified observability service that collects **metrics**, **logs**, **traces**, and fires **alarms** — all from a single console. Many AWS services (EC2, Lambda, RDS, etc.) automatically publish metrics to CloudWatch at no extra cost; you can also push **custom metrics** from your own applications. Traces are gathered via **AWS X-Ray**, which integrates tightly with CloudWatch. Together these signals give you end-to-end visibility without running separate monitoring infrastructure.",
        },
        {
          heading: "Metrics & Dashboards",
          body:
            "Metrics are organised by **namespace** (e.g. `AWS/EC2`) and further scoped with **dimensions** (e.g. `InstanceId`). Each metric supports multiple **statistics** — `Average`, `Sum`, `Maximum`, `Minimum`, and percentiles such as `p99`. You can combine metrics from different namespaces onto a single **CloudWatch Dashboard** to get a real-time operational view. Dashboards are shareable across accounts and can be automated via the CLI.",
          code: {
            lang: "bash",
            label: "Create a CloudWatch dashboard via AWS CLI",
            snippet: `# Create a simple dashboard that charts EC2 CPU utilisation
aws cloudwatch put-dashboard \\
  --dashboard-name "MyAppDashboard" \\
  --dashboard-body '{
    "widgets": [{
      "type": "metric",
      "properties": {
        "title": "EC2 CPU Utilisation",
        "metrics": [
          ["AWS/EC2", "CPUUtilization", "InstanceId", "i-0123456789abcdef0"]
        ],
        "period": 300,
        "stat": "Average",
        "view": "timeSeries"
      }
    }]
  }'`,
          },
        },
        {
          heading: "CloudWatch Logs",
          body:
            "Application and infrastructure logs land in **log groups**, which are subdivided into **log streams** per source (e.g. one stream per EC2 instance or Lambda invocation). **CloudWatch Logs Insights** provides a purpose-built query language to filter, aggregate, and visualise log data at scale. You should set a **retention policy** on every log group — without one, logs are kept forever and accrue storage costs. Use the `aws logs tail` command during development to stream live logs directly to your terminal.",
          code: {
            lang: "bash",
            label: "Tail a CloudWatch log group in real time",
            snippet: `# Stream the most recent log events and follow new ones as they arrive
aws logs tail /aws/lambda/my-function \\
  --follow \\
  --format short

# Run a Logs Insights query to find error messages in the last hour
aws logs start-query \\
  --log-group-name /aws/lambda/my-function \\
  --start-time $(date -d '-1 hour' +%s) \\
  --end-time $(date +%s) \\
  --query-string 'fields @timestamp, @message | filter @message like /ERROR/ | sort @timestamp desc | limit 20'`,
          },
        },
        {
          heading: "Alarms & Notifications",
          body:
            "A **CloudWatch Alarm** watches a single metric over a defined evaluation period and transitions between `OK`, `ALARM`, and `INSUFFICIENT_DATA` states. **Composite alarms** combine multiple alarms with AND/OR logic to reduce alert noise. When an alarm fires it can trigger an **SNS topic**, which can in turn send an email, invoke a Lambda, post to Slack, or call a webhook. Always test your alarm flow end-to-end by using the `set-alarm-state` command before relying on it in production.",
          code: {
            lang: "bash",
            label: "Create a CPU alarm that notifies via SNS",
            snippet: `# Create an alarm: notify if average CPU > 80% for two consecutive 5-minute periods
aws cloudwatch put-metric-alarm \\
  --alarm-name "HighCPU-i-0123456789abcdef0" \\
  --alarm-description "CPU utilisation above 80%" \\
  --metric-name CPUUtilization \\
  --namespace AWS/EC2 \\
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \\
  --statistic Average \\
  --period 300 \\
  --evaluation-periods 2 \\
  --threshold 80 \\
  --comparison-operator GreaterThanThreshold \\
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts \\
  --ok-actions    arn:aws:sns:us-east-1:123456789012:ops-alerts`,
          },
        },
        {
          heading: "CloudWatch Agent",
          body:
            "The default EC2 metrics do not include **memory utilisation** or **disk usage** — the hypervisor cannot see inside the guest OS. Install the **CloudWatch Agent** on your EC2 instances to collect these host-level metrics and forward application log files. The agent reads a JSON configuration file (typically at `/opt/aws/amazon-cloudwatch-agent/bin/config.json`) that specifies which metrics and log paths to collect. You can generate this config interactively with `amazon-cloudwatch-agent-config-wizard` and then distribute it via **AWS Systems Manager Parameter Store** for fleet-wide deployments. After installation, start the agent with `sudo systemctl start amazon-cloudwatch-agent`.",
        },
      ],
    },
  ],
};

// ─── GCP Observability Module ─────────────────────────────────────────────────

export const gcpObservabilityModule: Module = {
  id: "observability",
  title: "Observability",
  desc: "Monitor GCP workloads with Cloud Monitoring, Cloud Logging, uptime checks, and Cloud Trace.",
  category: "Observability",
  topics: [
    {
      id: "cloud-monitoring",
      title: "Cloud Monitoring & Logging",
      level: "Beginner",
      readTime: "10 min",
      category: "Observability",
      summary:
        "Explore GCP's integrated observability suite: Cloud Monitoring for metrics and dashboards, Cloud Logging for structured log management, uptime checks for availability alerts, and Cloud Trace for distributed request tracing.",
      awsEquivalent: "CloudWatch",
      azureEquivalent: "Azure Monitor",
      sections: [
        {
          heading: "What is Cloud Monitoring?",
          body:
            "**Google Cloud Monitoring** (part of the **Cloud Operations Suite**, formerly Stackdriver) automatically collects **metrics** from all GCP services without any configuration. The **Metrics Explorer** lets you query, chart, and compare metrics using a point-and-click interface or the Monitoring Query Language (**MQL**). You can organise related metrics and charts into **Dashboards** that are shared across your team. **Alerting policies** watch metrics or log-based metrics and send notifications when conditions are breached.",
        },
        {
          heading: "Cloud Logging",
          body:
            "**Cloud Logging** ingests structured and unstructured logs from GCP services, VMs, Kubernetes pods, and custom applications. Logs are stored in **log buckets** (`_Default` and `_Required` are created automatically); you can create custom buckets with different retention periods. **Log sinks** export matching log entries to Cloud Storage, BigQuery, or Pub/Sub for long-term storage or analysis. **Log Explorer** in the console provides a powerful filter interface using the **Logging query language**, and **structured logging** with JSON payloads enables richer querying than plain-text lines.",
          code: {
            lang: "bash",
            label: "Read recent logs with gcloud CLI",
            snippet: `# List the 20 most recent log entries for a specific Cloud Run service
gcloud logging read \\
  'resource.type="cloud_run_revision" AND resource.labels.service_name="my-service" AND severity>=ERROR' \\
  --limit 20 \\
  --format "table(timestamp, severity, textPayload)" \\
  --project my-gcp-project

# Stream logs in real time (follows new entries)
gcloud beta logging tail \\
  'resource.type="cloud_run_revision" AND resource.labels.service_name="my-service"' \\
  --project my-gcp-project`,
          },
        },
        {
          heading: "Uptime Checks & Alerting",
          body:
            "**Uptime checks** probe your public HTTP/HTTPS endpoints or TCP ports from multiple global locations and report latency and availability. An **alerting policy** combines a **condition** (e.g. metric threshold or uptime failure) with one or more **notification channels** such as email, PagerDuty, Slack, or Pub/Sub. Notification channels must be created before they can be referenced by a policy. Always configure a **documentation** field on your alerting policy — it appears in the alert notification and gives on-call engineers immediate context.",
          code: {
            lang: "bash",
            label: "Create an uptime check with gcloud CLI",
            snippet: `# Create an HTTP uptime check that hits your app every 60 seconds
gcloud monitoring uptime create my-app-uptime \\
  --resource-type=uptime-url \\
  --hostname=my-app.example.com \\
  --path=/ \\
  --port=443 \\
  --use-ssl \\
  --check-interval=60s \\
  --project my-gcp-project

# List existing uptime checks
gcloud monitoring uptime list --project my-gcp-project`,
          },
        },
        {
          heading: "Cloud Trace & Profiler",
          body:
            "**Cloud Trace** is GCP's **distributed tracing** system — it collects latency data as requests travel through your microservices and displays waterfall charts that make it easy to find bottlenecks. Instrumentation uses **OpenTelemetry** (recommended) or the legacy Cloud Trace client libraries; GCP services like App Engine and Cloud Run send traces automatically. **Sampling rate** controls cost: 100% sampling is useful during development, but production systems typically sample 1–10% of requests. **Cloud Profiler** complements tracing by continuously capturing **CPU** and **heap** profiles from live production processes with minimal overhead, surfacing which functions consume the most resources over time.",
        },
      ],
    },
  ],
};

// ─── Azure Observability Module ───────────────────────────────────────────────

export const azureObservabilityModule: Module = {
  id: "observability",
  title: "Observability",
  desc: "Monitor Azure workloads with Azure Monitor, Log Analytics, metric alerts, and Application Insights.",
  category: "Observability",
  topics: [
    {
      id: "azure-monitor",
      title: "Azure Monitor — Metrics, Logs & Alerts",
      level: "Beginner",
      readTime: "10 min",
      category: "Observability",
      summary:
        "Understand Azure Monitor as the unified observability layer for Azure: platform metrics, Log Analytics with KQL, metric and log-based alerts with action groups, and Application Insights for application performance monitoring.",
      awsEquivalent: "CloudWatch",
      gcpEquivalent: "Cloud Monitoring",
      sections: [
        {
          heading: "What is Azure Monitor?",
          body:
            "**Azure Monitor** is the overarching observability platform for Azure — it collects, analyses, and acts on telemetry from your cloud and on-premises environments. It covers three signal types: **platform metrics** (auto-collected numeric time-series from Azure resources), **activity logs** (control-plane events such as resource creation and role assignments), and **resource logs** (data-plane diagnostics that must be explicitly enabled via a **diagnostic setting**). All signals flow into a unified pipeline and feed downstream tools like **Log Analytics**, **Metrics Explorer**, and **Alerts**. Enabling **diagnostic settings** on each resource is the first step to gaining full observability.",
        },
        {
          heading: "Log Analytics & KQL",
          body:
            "**Log Analytics workspaces** are the storage and query engine for Azure Monitor logs. Resources send their logs to a workspace via diagnostic settings; multiple resources and even multiple subscriptions can write to the same workspace for centralised analysis. Queries are written in **Kusto Query Language** (**KQL**), a read-only, SQL-inspired language optimised for time-series data. Common patterns include filtering with `where`, aggregating with `summarize`, and joining tables with `join`. The `| render timechart` operator renders query results as a chart directly in the portal.",
          code: {
            lang: "kql",
            label: "KQL — find slow HTTP responses in the last 24 hours",
            snippet: `// Query requests taking longer than 1 second in the past 24 hours
// Run this in Log Analytics workspace → Logs
AppRequests
| where TimeGenerated > ago(24h)
| where DurationMs > 1000
| summarize
    Count       = count(),
    AvgDuration = avg(DurationMs),
    P99Duration = percentile(DurationMs, 99)
    by Name, ResultCode
| order by AvgDuration desc
| take 20`,
          },
        },
        {
          heading: "Metric Alerts & Action Groups",
          body:
            "**Metric alerts** fire when a resource metric crosses a threshold over an evaluation window. Azure supports both **static thresholds** (e.g. CPU > 80%) and **dynamic thresholds** that use machine learning to detect anomalies without manually tuning a number. When an alert fires it triggers an **action group** — a reusable set of notifications and actions such as email, SMS, Azure Function, Logic App, or webhook. Separating the alert rule from the action group means you can reuse the same notification channel across many alerts. Always set a **severity** (0–4) on your alert rules so on-call teams can triage at a glance.",
          code: {
            lang: "bash",
            label: "Create a CPU metric alert with az CLI",
            snippet: `# Create an action group that emails the ops team
az monitor action-group create \\
  --resource-group my-rg \\
  --name ops-email-group \\
  --short-name OpsEmail \\
  --action email ops-team ops@example.com

# Create a metric alert: CPU > 80% for 5 minutes triggers the action group
az monitor metrics alert create \\
  --name "HighCPU-myVM" \\
  --resource-group my-rg \\
  --scopes /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.Compute/virtualMachines/myVM \\
  --condition "avg Percentage CPU > 80" \\
  --window-size 5m \\
  --evaluation-frequency 1m \\
  --severity 2 \\
  --action ops-email-group \\
  --description "CPU utilisation exceeded 80%"`,
          },
        },
        {
          heading: "Application Insights",
          body:
            "**Application Insights** is Azure Monitor's **APM** (Application Performance Monitoring) component, designed for live application telemetry. It auto-collects **request rates**, **response times**, **failure rates**, and **dependency calls** (to databases, HTTP APIs, queues) with minimal SDK integration. **Availability tests** run synthetic HTTP requests from global Azure regions on a schedule and alert you if your endpoint becomes unreachable or too slow. **Smart Detection** uses anomaly detection to proactively surface unusual failure rates or performance degradations without you needing to write alert rules. Use the **Application Map** view to visualise inter-service dependencies and pinpoint where latency is introduced in a distributed system.",
        },
      ],
    },
  ],
};
