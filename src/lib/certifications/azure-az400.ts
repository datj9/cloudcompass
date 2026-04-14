import type { Certification } from "./types";

export const azureAz400: Certification = {
  id: "azure-az400",
  title: "Azure DevOps Engineer Expert",
  code: "AZ-400",
  cloud: "azure",
  level: "Expert",
  description:
    "Validate your expert-level ability to design and implement DevOps practices including source control, CI/CD pipelines, security, compliance, and instrumentation using Azure DevOps and GitHub.",
  examFormat: {
    questions: 50,
    duration: "100 minutes",
    passingScore: "700/1000",
    cost: "$165 USD",
  },
  domains: [
    // ─── Domain 1: Configure Processes and Communications (10%) ─────
    {
      id: "domain-1",
      title: "Configure Processes and Communications",
      weight: "10%",
      order: 1,
      summary:
        "This domain covers configuring Azure DevOps organizations, projects, teams, and process templates, as well as integrating communication and collaboration tools into DevOps workflows. While the smallest domain at 10%, it establishes the organizational foundation for all DevOps practices.\n\nKey areas include configuring **Azure DevOps organizations** and projects, selecting and customizing **process templates** (Basic, Agile, Scrum, CMMI), setting up **work item tracking** with custom fields and workflows, integrating **Microsoft Teams** and **Slack** with Azure DevOps for notifications, and configuring **service hooks** for webhook-based integrations.\n\nExpect questions on choosing the right process template for a team's methodology, configuring area paths and iteration paths for sprint planning, setting up dashboards with widgets, and connecting Azure DevOps to external tools via service connections and service hooks.",
      keyConceptsForExam: [
        "**Process templates** — Basic (simplest), Agile (user stories, bugs, tasks), Scrum (product backlog items, sprints), CMMI (formal change management)",
        "**Area paths and iteration paths** — organize work by team/component (area) and time period (iteration/sprint)",
        "**Service hooks** — webhook subscriptions to Azure DevOps events (build completed, PR created, work item updated) for external integrations",
        "**Azure DevOps service connections** — secure connections to external services (Azure subscriptions, GitHub, Docker Hub, SonarCloud) used in pipelines",
        "**Teams and permissions** — project-level teams, team administrators, inherited permissions model",
        "**Dashboards and widgets** — team and project dashboards; built-in widgets for burndown, velocity, build status, test results",
        "**Notifications** — team and personal notification subscriptions; filtering by event type, area path, or assignment",
        "**Microsoft Teams integration** — Azure Boards app, pipelines app for notifications; bi-directional work item creation from Teams",
      ],
      examTips: [
        "Process templates cannot be changed for an existing project — the team must choose the right one when creating the project. Agile is the most commonly used for software development teams.",
        "Service hooks use outbound webhooks to notify external systems of Azure DevOps events. They do not require a public endpoint if using Azure Service Bus or Event Grid as intermediaries.",
        "Service connections store credentials securely in Azure DevOps and are referenced by name in pipelines — pipeline code never contains actual credentials.",
        "Area paths define the hierarchical breakdown of the project (e.g., Frontend, Backend, Infrastructure) and control which team sees which work items. Iteration paths define the time-boxing for sprints.",
        "Dashboards are scoped to a team by default but project administrators can create project-wide dashboards visible to all teams.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
      ],
      sections: [
        {
          heading: "Azure DevOps Process Templates",
          body: "Azure DevOps supports four process templates that define the work item types, workflows, and reports available in a project:\n\n- **Basic**: Simplest template — Issues, Tasks, Epics. Suitable for teams new to work item tracking.\n- **Agile**: User Stories, Bugs, Tasks, Features, Epics. Supports kanban and sprint planning. Most popular for Agile/Scrum teams.\n- **Scrum**: Product Backlog Items (PBIs), Bugs, Tasks, Features, Epics. Designed for Scrum ceremonies; includes impediment work items.\n- **CMMI** (Capability Maturity Model Integration): Requirements, Change Requests, Risks, Issues. Formal processes with approval workflows; suited for regulated industries.\n\nCustom process templates can be created by inheriting from a built-in template and adding custom fields, states, and rules — useful for organization-specific workflows without starting from scratch.",
          code: {
            lang: "bash",
            label: "Create an Azure DevOps project with Agile process",
            snippet: `# Install Azure DevOps CLI extension
az extension add --name azure-devops

# Configure organization
az devops configure --defaults organization=https://dev.azure.com/myOrg

# Create project with Agile process
az devops project create \\
  --name "MyApplication" \\
  --process "Agile" \\
  --source-control "git" \\
  --visibility "private"

# Create an area path
az boards area project create \\
  --name "Backend" \\
  --project "MyApplication"`,
          },
        },
        {
          heading: "Service Hooks and External Integrations",
          body: "Service hooks allow Azure DevOps to send event notifications to external services when specific events occur. They are the foundation for integrating DevOps workflows with tools like Slack, Teams (via incoming webhooks), Jira, PagerDuty, and custom applications.\n\n**Common service hook events**:\n- Build and release: `Build completed`, `Release deployment completed`\n- Repositories: `Code pushed`, `Pull request created`, `Pull request updated`\n- Work tracking: `Work item created`, `Work item updated`, `Work item commented`\n\n**Integration patterns**:\n- **Direct webhook**: Azure DevOps posts to a webhook URL (e.g., Slack incoming webhook, Teams connector).\n- **Azure Service Bus**: Azure DevOps publishes events to a Service Bus queue/topic — consumers process asynchronously.\n- **Azure Event Grid**: Route Azure DevOps events through Event Grid for complex fan-out scenarios.\n- **Zapier/Power Automate**: No-code integration platforms that subscribe to Azure DevOps service hooks.",
        },
        {
          heading: "Service Connections and Permissions",
          body: "Service connections securely store credentials for external services referenced in Azure Pipelines. Types include:\n\n- **Azure Resource Manager**: Connect to Azure subscriptions using managed identity (recommended), service principal with secret, or workload identity federation (OIDC).\n- **GitHub**: Personal access token or GitHub App for accessing GitHub repositories.\n- **Docker Registry**: Credentials for Docker Hub, ACR, or other container registries.\n- **Kubernetes**: Kubeconfig or service account for AKS cluster access.\n- **Generic**: Username/password or token for any service.\n\n**Workload Identity Federation** (OIDC) is the recommended approach for Azure service connections — it eliminates stored credentials entirely. Azure DevOps receives an OIDC token from Azure and exchanges it for an Azure access token — no client secret rotation required.\n\nPermissions on service connections control which pipelines can use them. **Grant access permission to all pipelines** (simpler) vs. **per-pipeline approval** (more secure for sensitive connections like production).",
        },
      ],
      quiz: [
        {
          id: "az400-d1-q1",
          question:
            "A regulated financial company needs an Azure DevOps process template that supports formal change requests, risk tracking, and multi-level approval workflows. Which process template should they use?",
          options: [
            "A) Basic — simplest template with issues and tasks.",
            "B) Agile — user stories and sprint planning.",
            "C) Scrum — product backlog items and sprint ceremonies.",
            "D) CMMI — formal change requests, risks, and approval workflows for regulated environments.",
          ],
          correctIndex: 3,
          explanation:
            "CMMI (Capability Maturity Model Integration) is designed for formal processes with change requests, risk tracking, issue management, and approval workflows — appropriate for regulated industries like finance and healthcare. Basic (A) is too simple. Agile (B) and Scrum (C) are for Agile methodologies without the formal change management required here.",
        },
        {
          id: "az400-d1-q2",
          question:
            "A team wants to receive a Slack notification whenever a build fails in Azure Pipelines. Which Azure DevOps feature enables this without writing custom code?",
          options: [
            "A) Azure Monitor alerts — configure an alert when the build metric drops.",
            "B) Azure DevOps service hooks — subscribe to the 'Build completed' event with a failed status filter and a Slack incoming webhook URL.",
            "C) Azure Logic Apps — poll Azure DevOps every minute for build status changes.",
            "D) Azure DevOps email notifications — configure team email and forward to Slack.",
          ],
          correctIndex: 1,
          explanation:
            "Service hooks allow subscribing to specific Azure DevOps events (like 'Build completed' filtered to 'Failed' status) and posting to external webhooks (like Slack incoming webhooks). No custom code is required. Azure Monitor (A) monitors Azure resource metrics, not Azure DevOps build events. Logic Apps polling (C) works but is more complex than the built-in service hook. Email forwarding (D) is cumbersome and not real-time.",
        },
        {
          id: "az400-d1-q3",
          question:
            "What is the recommended authentication method for an Azure Pipelines service connection to an Azure subscription that eliminates the need for rotating client secrets?",
          options: [
            "A) Service principal with client secret stored in Azure Key Vault.",
            "B) Managed identity assigned to the pipeline agent VM.",
            "C) Workload Identity Federation (OIDC) — Azure DevOps exchanges an OIDC token for Azure credentials.",
            "D) Azure subscription owner credentials stored as a pipeline secret variable.",
          ],
          correctIndex: 2,
          explanation:
            "Workload Identity Federation uses OIDC — Azure DevOps presents a short-lived OIDC token to Azure, which is exchanged for temporary credentials. No client secret is stored or requires rotation. Managed identity (B) works when using self-hosted agents on Azure VMs but is not available for Microsoft-hosted agents. Service principal with secret (A) requires secret rotation. Storing owner credentials (D) is a critical security anti-pattern.",
        },
        {
          id: "az400-d1-q4",
          question:
            "A project manager needs to track which team is responsible for each work item in a large Azure DevOps project with 5 teams. How should the project be structured?",
          options: [
            "A) Create five separate Azure DevOps projects, one per team.",
            "B) Create one project with five area paths (one per team) and assign teams to their respective area paths.",
            "C) Use tags on work items to identify the responsible team.",
            "D) Create five separate organizations, one per team.",
          ],
          correctIndex: 1,
          explanation:
            "Area paths in a single project allow organizing work by team/component while maintaining a unified backlog and shared codebase. Each team is associated with one or more area paths — they see only work items in their areas. Tags (C) are informal and harder to manage at scale. Separate projects (A) or organizations (D) make cross-team reporting and shared repositories difficult.",
        },
        {
          id: "az400-d1-q5",
          question:
            "A DevOps engineer changes a service connection in Azure DevOps from 'Grant access permission to all pipelines' to 'per-pipeline approval required.' What is the effect?",
          options: [
            "A) All existing pipelines immediately lose access to the service connection.",
            "B) New pipelines must be explicitly approved to use the service connection; existing approved pipelines continue to work.",
            "C) The service connection is disabled until an administrator re-approves it.",
            "D) Pipelines can still use the connection but must provide additional credentials.",
          ],
          correctIndex: 1,
          explanation:
            "Switching to per-pipeline approval means new pipelines attempting to use the service connection trigger an approval request (the connection shows as 'needs permission'). Pipelines that were previously approved and have already used the connection continue working. Existing pipelines do not immediately lose access (A). The connection remains active (C). No additional credentials are needed (D) — approval is an authorization, not an authentication change.",
        },
        {
          id: "az400-d1-q6",
          question:
            "An Azure DevOps team wants to visualize their sprint velocity, current sprint burndown, and build success rate on a single view. Which feature supports this?",
          options: [
            "A) Azure Monitor Workbooks — create custom dashboards with Azure metrics.",
            "B) Azure DevOps Dashboards with widgets — Sprint Burndown widget, Velocity widget, and Build History widget.",
            "C) Power BI connected to Azure DevOps Analytics — custom reports.",
            "D) Application Insights dashboards — track build and deployment metrics.",
          ],
          correctIndex: 1,
          explanation:
            "Azure DevOps Dashboards provide built-in widgets including Sprint Burndown, Velocity, Build History, and Test Results. They are team-scoped and require no external tools. Azure Monitor Workbooks (A) are for Azure resource monitoring. Power BI (C) works for advanced custom reporting but adds complexity. Application Insights (D) monitors application runtime, not DevOps process metrics.",
        },
        {
          id: "az400-d1-q7",
          question:
            "Which Azure DevOps iteration path configuration supports a two-week Scrum sprint cadence?",
          options: [
            "A) Set the area path schedule to 2 weeks.",
            "B) Create iteration paths with start and end dates 2 weeks apart under the project root iteration.",
            "C) Configure the process template to use 2-week iterations by default.",
            "D) Use the sprint calendar in Microsoft Teams to define sprint boundaries.",
          ],
          correctIndex: 1,
          explanation:
            "Iteration paths in Azure DevOps define time-boxed periods (sprints). Creating child iterations under the root with 2-week start/end date windows defines the sprint cadence. Work items are assigned to iteration paths. Area paths (A) define team ownership, not time. Process templates (C) define work item types, not sprint duration. Teams calendar (D) is unrelated to Azure DevOps sprint configuration.",
        },
        {
          id: "az400-d1-q8",
          question:
            "A DevOps team uses Azure Boards and wants to create a GitHub issue automatically whenever a high-priority bug work item is created in Azure DevOps. Which approach requires the LEAST custom code?",
          options: [
            "A) Write an Azure Function triggered by a service hook that calls the GitHub API.",
            "B) Use Power Automate with an Azure DevOps trigger and a GitHub action to create the issue.",
            "C) Configure a service hook to post to GitHub's webhook endpoint directly.",
            "D) Enable the Azure Boards GitHub integration for bidirectional issue sync.",
          ],
          correctIndex: 1,
          explanation:
            "Power Automate (Microsoft's no-code automation platform) provides pre-built connectors for both Azure DevOps and GitHub. A flow triggered on 'Work item created' filtered to high-priority bugs can create a GitHub issue using the GitHub connector — no custom code required. An Azure Function (A) requires coding. GitHub's webhook endpoint (C) would receive the event but GitHub does not expose an endpoint to create issues via service hooks. The Azure Boards GitHub integration (D) links existing items but does not auto-create GitHub issues from Azure DevOps events.",
        },
        {
          id: "az400-d1-q9",
          question:
            "A company creates a new Azure DevOps project and realizes they chose the wrong process template. They want to switch from Scrum to Agile. How can this be done?",
          options: [
            "A) Go to Project Settings → Process and change the process template.",
            "B) Create a new project with the Agile process template and migrate work items.",
            "C) Export all work items, delete the project, create a new project with Agile, and import.",
            "D) Install the Agile process template extension from the Azure DevOps Marketplace.",
          ],
          correctIndex: 0,
          explanation:
            "Azure DevOps supports changing the process template for an existing project via Project Settings → Boards → Process. You can switch between process templates (e.g., Scrum to Agile) while preserving existing work items. Work item types are mapped between templates. Creating a new project (B or C) is unnecessary and disruptive. The Marketplace (D) provides extensions but not process template changes.",
        },
        {
          id: "az400-d1-q10",
          question:
            "What is the difference between an Azure DevOps organization and a project?",
          options: [
            "A) An organization hosts multiple projects; a project contains repositories, boards, pipelines, and artifacts for a specific application or team.",
            "B) An organization is a billing unit; a project is a security boundary.",
            "C) They are the same concept with different names in different Azure DevOps regions.",
            "D) A project hosts multiple organizations for different business units.",
          ],
          correctIndex: 0,
          explanation:
            "An Azure DevOps **organization** is the top-level container (e.g., `https://dev.azure.com/contoso`) that holds multiple **projects**. Each project is an isolated workspace containing Boards, Repos, Pipelines, Test Plans, and Artifacts for a specific application or team. Organizations can span multiple Entra ID tenants; projects within an organization share the organization's Entra ID tenant and billing.",
        },
        {
          id: "az400-d1-q11",
          question:
            "A team lead wants all Azure DevOps work item assignments to automatically send an email to the assignee. Where is this configured?",
          options: [
            "A) In the work item type definition — add an email action to the assignment state transition.",
            "B) In Azure DevOps personal or team notification settings — subscribe to 'Work item assigned to me' events.",
            "C) In the process template — configure automatic email on assignment.",
            "D) Through a service hook that calls an email API on work item assignment.",
          ],
          correctIndex: 1,
          explanation:
            "Azure DevOps has a built-in notification system. Personal notification settings allow subscribing to events like 'Work item assigned to me' — Azure DevOps sends an email when the subscription condition is met. Team notifications allow project administrators to configure notifications for all team members. Work item type definitions (A) define workflow states, not notifications. Service hooks (D) work but are unnecessary for this built-in capability.",
        },
        {
          id: "az400-d1-q12",
          question:
            "A company wants to connect Azure Boards to GitHub so that work items are automatically linked when commits reference them and PRs can be associated with work items. Which integration enables this?",
          options: [
            "A) Azure DevOps service hooks sending events to GitHub webhooks.",
            "B) The Azure Boards GitHub app — installed in the GitHub repository for bidirectional linking.",
            "C) GitHub Actions workflow that calls the Azure DevOps REST API on commit.",
            "D) A shared service principal with access to both Azure DevOps and GitHub.",
          ],
          correctIndex: 1,
          explanation:
            "The Azure Boards GitHub App provides native bidirectional integration: commits and PRs that mention `AB#<work-item-id>` automatically link to Azure Boards work items. PR completion can transition work items. This is Microsoft's official, first-party integration. Service hooks (A) are unidirectional. GitHub Actions calling the API (C) requires custom implementation. A shared service principal (D) is not a published integration pattern.",
        },
        {
          id: "az400-d1-q13",
          question:
            "What type of Azure DevOps widget would show the number of bugs created vs. bugs closed over the last 4 weeks on a team dashboard?",
          options: [
            "A) Build History widget.",
            "B) Burndown widget — tracks remaining work in a sprint.",
            "C) Lead Time widget — measures time from work item creation to closure.",
            "D) Chart for Work Items widget — configurable query-based chart showing bug counts over time.",
          ],
          correctIndex: 3,
          explanation:
            "The 'Chart for Work Items' widget uses an Azure Boards query and displays results as bar, pie, stacked bar, or trend charts. A trend chart on a query returning bugs grouped by date and state shows created vs. closed over time. Build History (A) shows pipeline build results. Burndown (B) tracks remaining work in a sprint. Lead Time (C) measures individual item cycle time.",
        },
        {
          id: "az400-d1-q14",
          question:
            "A project team uses area paths to separate work between the Frontend and Backend teams. A Frontend developer accidentally creates a work item under the Backend area path. Who can change the work item's area path?",
          options: [
            "A) Only the Project Administrator — area paths are locked after work item creation.",
            "B) Any team member with at least Contributor permission to the project can edit work items including area path.",
            "C) Only the work item creator can change the area path.",
            "D) Area paths cannot be changed after a work item is created.",
          ],
          correctIndex: 1,
          explanation:
            "In Azure DevOps, work item fields including area path can be edited by any user with Contributor (or higher) permission to the project. There is no lock on area path changes after creation. Project Administrators (A) have broader permissions but are not the only ones who can edit. Restricting to the creator (C) is not a default behavior. Area paths are always editable (D is wrong).",
        },
        {
          id: "az400-d1-q15",
          question:
            "Which Azure DevOps feature enables a team to run a retrospective-style review of completed sprints with metrics like velocity trends, defect rates, and test coverage without leaving the DevOps environment?",
          options: [
            "A) Azure DevOps Wiki — document retrospective notes.",
            "B) Azure DevOps Analytics views and Power BI integration — pre-built reports on team velocity, defect trends, and test pass rates.",
            "C) Azure Monitor dashboards — monitor sprint metrics as Azure resources.",
            "D) Azure DevOps Audit Log — review all project actions in the sprint.",
          ],
          correctIndex: 1,
          explanation:
            "Azure DevOps Analytics provides built-in data for velocity, burndown, cumulative flow, test results, and pipeline metrics. The Analytics views can be connected to Power BI for richer custom reporting. This enables data-driven retrospectives without external tools. The Wiki (A) is for documentation. Azure Monitor (C) monitors cloud resources, not DevOps process metrics. Audit Log (D) tracks security events like permission changes, not sprint performance metrics.",
        },
      ],
    },

    // ─── Domain 2: Design and Implement Source Control (15%) ────────
    {
      id: "domain-2",
      title: "Design and Implement Source Control",
      weight: "15%",
      order: 2,
      summary:
        "This domain covers designing and implementing Git-based source control strategies using Azure Repos and GitHub. A DevOps engineer must implement branching strategies, repository policies, and code review processes that support continuous integration and delivery.\n\nKey areas include designing **branching strategies** (Gitflow, GitHub Flow, trunk-based development), configuring **branch policies** in Azure Repos (required reviewers, build validation, comment resolution), implementing **pull request workflows**, managing **large binary files with Git LFS**, and configuring **repository security** with fine-grained permissions.\n\nExpect questions on choosing the right branching strategy for a given release cadence, configuring branch protection rules, implementing inner source patterns, managing secrets in repositories (pre-commit hooks, secret scanning), and migrating repositories from TFVC to Git.",
      keyConceptsForExam: [
        "**Trunk-based development** — short-lived feature branches (< 1 day), continuous integration, feature flags for incomplete features; enables true CI/CD",
        "**Gitflow** — long-lived develop, release, and hotfix branches; suited for scheduled releases; more complex, harder to maintain CI/CD",
        "**GitHub Flow** — main branch always deployable; short feature branches; PR to main; simpler than Gitflow; good for continuous deployment",
        "**Branch policies** — required reviewers, minimum reviewer count, build validation (run CI before merge), comment resolution, linked work items",
        "**Pull request templates** — markdown file (`.azuredevops/pull_request_template.md`) auto-populated in PR descriptions",
        "**Git LFS (Large File Storage)** — store binary files (videos, models, assets) in LFS; Git repo only contains pointers",
        "**CODEOWNERS** — auto-assign reviewers based on file paths; enforced by branch policies requiring owner review",
        "**Secret scanning** — detect accidentally committed secrets; GitHub Advanced Security; `git-secrets` pre-commit hooks",
      ],
      examTips: [
        "Trunk-based development is the recommended strategy for teams practicing true CI/CD — short-lived branches merged frequently prevent integration conflicts.",
        "Branch policies in Azure Repos can be configured at the branch level or at the repository level. Requiring a successful build validation policy before merge is critical for CI.",
        "Git LFS replaces large binary files with text pointers in the Git repository — the actual binary data is stored on an LFS server. Without LFS, large binaries make clone and fetch operations slow.",
        "TFVC to Git migration should use `git-tfs` or the Azure DevOps migration tools — do not manually copy files as this loses history.",
        "Secret scanning (GitHub Advanced Security) scans both new commits and the entire commit history for known secret patterns. If a secret is found in history, it must be rotated even after removal — the commit history retains it.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
      ],
      sections: [
        {
          heading: "Branching Strategy Comparison",
          body: "Choosing a branching strategy affects how frequently teams integrate code and how releases are managed:\n\n**Trunk-Based Development** (recommended for CD):\n- All developers commit to `main` (trunk) or short-lived feature branches (< 1–2 days).\n- Feature flags control incomplete features in production.\n- Continuous integration runs on every commit to main.\n- Supports true CD — `main` is always deployable.\n\n**GitHub Flow**:\n- `main` is always deployable.\n- Feature branches created from `main`, PR required to merge back.\n- Simpler than Gitflow; suitable for web services with continuous deployment.\n\n**Gitflow**:\n- `main` (production), `develop` (integration), `feature/*`, `release/*`, `hotfix/*` branches.\n- Suited for products with versioned releases (mobile apps, libraries).\n- More complex; long-lived branches increase merge conflicts; harder to achieve true CI/CD.\n\nFor most cloud-native applications with continuous deployment, **trunk-based development** or **GitHub Flow** is recommended.",
          code: {
            lang: "bash",
            label: "Configure Azure Repos branch policies via CLI",
            snippet: `# Require minimum 2 reviewers on main branch
az repos policy approver-count create \\
  --allow-downvotes false \\
  --blocking true \\
  --branch main \\
  --creator-vote-counts false \\
  --enabled true \\
  --minimum-approver-count 2 \\
  --repository-id <repo-id> \\
  --project MyProject

# Require successful build validation before merge
az repos policy build create \\
  --blocking true \\
  --branch main \\
  --build-definition-id <pipeline-id> \\
  --display-name "CI Validation" \\
  --enabled true \\
  --manual-queue-only false \\
  --queue-on-source-update-only true \\
  --repository-id <repo-id> \\
  --project MyProject`,
          },
        },
        {
          heading: "Pull Request Workflow and Code Review",
          body: "A well-designed PR workflow balances code quality with development velocity:\n\n**Branch policies in Azure Repos**:\n- **Required reviewers**: Specific individuals or groups must approve.\n- **Minimum reviewer count**: At least N approvals required before merge.\n- **Build validation**: CI pipeline must pass before merge is allowed.\n- **Comment resolution**: All active comments must be resolved.\n- **Linked work items**: PR must reference at least one work item.\n- **Restrict merge types**: Squash merge, rebase, or standard merge — enforcing squash keeps `main` history linear.\n\n**CODEOWNERS file** (supported in Azure Repos and GitHub): Map file paths to owner teams/individuals. When those files are changed, owners are automatically added as required reviewers.\n\n**PR templates**: A markdown template file pre-populates the PR description with a checklist (tests added, documentation updated, screenshots for UI changes) — improves PR quality consistency.",
        },
        {
          heading: "Git Large File Storage (LFS)",
          body: "Git is optimized for text files — binary files (images, videos, 3D models, compiled artifacts) bloat the repository history and slow clone/fetch operations. Git LFS solves this by storing binary file content on a separate LFS server and keeping only lightweight text pointers in the Git repository.\n\n**How LFS works**:\n1. Track file patterns: `git lfs track \"*.psd\"` creates/updates `.gitattributes`.\n2. On `git add`, LFS uploads the binary to the LFS server and stores a pointer.\n3. On `git clone` or `git checkout`, LFS downloads the actual binary for files needed in the working directory.\n4. Old versions of LFS-tracked files are not downloaded by default (lazy fetch).\n\nAzure Repos and GitHub both support Git LFS. Storage for LFS objects is billed separately. Teams working with game assets, ML models, or large media files should always configure LFS from the start of the project.",
          code: {
            lang: "bash",
            label: "Configure Git LFS for binary assets",
            snippet: `# Install Git LFS
git lfs install

# Track specific file types
git lfs track "*.psd"
git lfs track "*.png"
git lfs track "*.mp4"
git lfs track "*.onnx"  # ML models

# Commit .gitattributes
git add .gitattributes
git commit -m "chore: configure Git LFS for binary assets"

# Verify LFS tracking
git lfs ls-files`,
          },
        },
      ],
      quiz: [
        {
          id: "az400-d2-q1",
          question:
            "A team practices continuous deployment — every commit to `main` is automatically deployed to production. Which branching strategy best supports this workflow?",
          options: [
            "A) Gitflow — with dedicated release branches for each deployment.",
            "B) Trunk-based development — short-lived feature branches, all merges to `main`, `main` always deployable.",
            "C) Environment branching — separate branches for dev, staging, and production.",
            "D) Release flow — long-lived release branches with cherry-pick deployments.",
          ],
          correctIndex: 1,
          explanation:
            "Trunk-based development keeps `main` always in a deployable state with short-lived feature branches merged frequently. This aligns directly with continuous deployment where every merge to `main` triggers a deployment. Gitflow (A) has long-lived branches unsuited for continuous deployment. Environment branches (C) couple deployment to branching, creating merge complexity. Release flow (D) uses long-lived branches inappropriate for continuous deployment.",
        },
        {
          id: "az400-d2-q2",
          question:
            "A repository contains files in the `src/payments/` directory that require review from the Payments team before any PR can be merged. How should this be configured?",
          options: [
            "A) Add required reviewers from the Payments team manually to every PR touching payment files.",
            "B) Create a CODEOWNERS file mapping `src/payments/` to the Payments team — they are automatically added as required reviewers.",
            "C) Create a separate repository for payment code with Payments team as the only contributors.",
            "D) Configure a branch policy requiring Payments team approval on the `main` branch for all changes.",
          ],
          correctIndex: 1,
          explanation:
            "A CODEOWNERS file maps directory paths to owner teams. When a PR modifies files matching a CODEOWNERS entry, the specified owners are automatically added as required reviewers. This is automated and path-specific. Manual review addition (A) is error-prone. A separate repository (C) prevents code sharing. A branch policy requiring Payments team approval (D) would require their approval on all PRs, not just payment-related changes.",
        },
        {
          id: "az400-d2-q3",
          question:
            "A developer accidentally commits an AWS access key to a public GitHub repository. Secret scanning detects it. After removing the secret from the latest commit, is the secret still exposed?",
          options: [
            "A) No — removing the secret from the latest commit erases it from the repository.",
            "B) Yes — the secret exists in the commit history and anyone who has cloned or viewed the history still has it.",
            "C) No — GitHub automatically purges secrets from commit history when scanning detects them.",
            "D) Yes — but only if the repository is public; private repositories purge secrets automatically.",
          ],
          correctIndex: 1,
          explanation:
            "Git commits are immutable — removing a secret from the latest commit does not erase it from commit history. Anyone who has cloned the repository or viewed the commit history has the secret. The correct response is to immediately **rotate/revoke the secret** (render the old value invalid), then optionally rewrite history with `git filter-repo` and force-push (which only helps for future cloners). GitHub does not automatically purge secrets from history.",
        },
        {
          id: "az400-d2-q4",
          question:
            "A team's Azure Repos branch policy requires a successful CI build before PRs can be merged to `main`. A developer updates the build validation policy to mark itself as optional. What happens?",
          options: [
            "A) The build still runs but a failed build no longer blocks the merge.",
            "B) The build no longer runs on new PRs.",
            "C) Only administrators can override the optional build requirement.",
            "D) The PR is auto-approved when the optional build passes.",
          ],
          correctIndex: 0,
          explanation:
            "When a build validation policy is set to 'Optional' (non-blocking), Azure Repos still queues and runs the build on PR updates, but a failed build does not block the PR from being merged. Required (blocking) policies must pass before merge is allowed. The build still runs (B is wrong). Any eligible reviewer can merge without waiting for the optional build (C is wrong). PR approval is independent of build status for optional policies (D is wrong).",
        },
        {
          id: "az400-d2-q5",
          question:
            "A game development team stores 50 GB of art assets (`.psd`, `.fbx`, `.png` files) in their Git repository. Developers report that cloning takes 45 minutes. What should be implemented?",
          options: [
            "A) Increase network bandwidth — cloning is a network problem.",
            "B) Configure Git LFS to store binary assets on the LFS server and keep only pointers in the repository.",
            "C) Split the repository into separate repos for code and assets.",
            "D) Use `git sparse-checkout` to only clone specific directories.",
          ],
          correctIndex: 1,
          explanation:
            "Git LFS replaces large binary files in the repository with small text pointers, dramatically reducing repository size and clone time. Only the binary files needed for the current checkout are downloaded. This is the standard solution for large binary assets in game development. Sparse-checkout (D) reduces which files are checked out but does not reduce the repository's history size — downloads still include all binary history. Separate repos (C) create workflow complexity. Bandwidth (A) doesn't address the root cause of bloated history.",
        },
        {
          id: "az400-d2-q6",
          question:
            "An organization is migrating from Team Foundation Version Control (TFVC) to Git. They want to preserve the full commit history. Which tool should they use?",
          options: [
            "A) Copy files from TFVC to a new Git repository and create an initial commit.",
            "B) Use `git-tfs` or the Azure DevOps TFVC to Git migrator to preserve changesets as Git commits.",
            "C) Export TFVC as a ZIP file and extract into a new Git repository.",
            "D) Use Azure Data Factory to migrate TFVC changesets to Git commits.",
          ],
          correctIndex: 1,
          explanation:
            "`git-tfs` is a tool that bridges TFVC and Git, converting TFVC changesets to Git commits while preserving history (author, date, comments). Azure DevOps also provides built-in TFVC import with history. Simply copying files (A) or extracting a ZIP (C) creates a single initial commit with no history. Azure Data Factory (D) is an ETL service for data pipelines, not source control migration.",
        },
        {
          id: "az400-d2-q7",
          question:
            "A team wants to ensure that all PR descriptions follow a standard format with sections for 'Summary', 'Testing done', and 'Breaking changes'. How can this be enforced in Azure Repos?",
          options: [
            "A) Create a branch policy requiring specific keywords in PR titles.",
            "B) Create a pull request template file (`.azuredevops/pull_request_template.md`) that auto-populates the PR description.",
            "C) Train developers to manually follow the format — no technical enforcement available.",
            "D) Use a pipeline task that validates PR description format via regex.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Repos (and GitHub) support PR description templates stored in `.azuredevops/pull_request_template.md` (Azure Repos) or `.github/pull_request_template.md` (GitHub). When a PR is created, the template content pre-populates the description, prompting developers to fill in each section. Branch policies (A) check metadata, not description content. A pipeline task validating regex (D) could enforce format but is more complex and requires custom implementation.",
        },
        {
          id: "az400-d2-q8",
          question:
            "What is the purpose of the `squash merge` option in Azure Repos branch policies?",
          options: [
            "A) Reduces repository storage by compressing commit objects.",
            "B) Combines all commits from a feature branch into a single commit on `main`, keeping history linear and clean.",
            "C) Deletes the source branch automatically after merging.",
            "D) Prevents merge conflicts by rebasing the feature branch first.",
          ],
          correctIndex: 1,
          explanation:
            "Squash merge combines all commits from a feature branch into a single commit when merging to `main`. This keeps the main branch history linear and readable — each entry represents a completed feature rather than individual work-in-progress commits. It does not compress storage (A), auto-delete branches (C — that's a separate option), or prevent conflicts (D).",
        },
        {
          id: "az400-d2-q9",
          question:
            "A feature branch has diverged significantly from `main` over 3 weeks. Before merging via PR, a developer wants to incorporate the latest `main` changes into the feature branch to resolve conflicts. Which Git operation should they use?",
          options: [
            "A) `git merge main` — merge `main` into the feature branch (creates a merge commit).",
            "B) `git rebase main` — replay feature branch commits on top of the latest `main` (linear history).",
            "C) `git cherry-pick main` — apply specific `main` commits to the feature branch.",
            "D) `git reset --hard main` — discard feature branch changes and reset to `main`.",
          ],
          correctIndex: 0,
          explanation:
            "Both `git merge main` (A) and `git rebase main` (B) incorporate latest `main` changes into the feature branch. Merge preserves history with a merge commit; rebase creates a linear history. Both are valid answers — however, for a shared/collaborative feature branch, merge is safer (rebase rewrites history and can cause problems for other collaborators). The question asks what 'should' be used — merge is the safer default for shared branches. `cherry-pick` (C) applies specific commits, not all of `main`. `reset --hard` (D) destroys the feature branch work.",
        },
        {
          id: "az400-d2-q10",
          question:
            "GitHub Advanced Security secret scanning detected a valid API key in a repository commit from 6 months ago. The key has already been rotated. What additional action is required?",
          options: [
            "A) Nothing — rotating the key is sufficient.",
            "B) Rewrite the commit history using `git filter-repo` to remove the secret, force-push, and notify all collaborators to re-clone.",
            "C) Delete the repository and create a new one without the secret in history.",
            "D) Mark the secret scanning alert as resolved in GitHub — this removes it from history.",
          ],
          correctIndex: 1,
          explanation:
            "Even with the secret rotated (rendering the old key invalid), the commit history remains accessible to anyone who has already cloned the repository. Rewriting history with `git filter-repo` removes the secret from all commits, and force-pushing updates the remote. All collaborators must re-clone. Rotating the key (A) is essential but leaves the secret visible in history. Repository deletion (C) is extreme. Resolving the GitHub alert (D) closes the alert but does not remove the secret from history.",
        },
        {
          id: "az400-d2-q11",
          question:
            "A DevOps engineer needs to prevent developers from pushing directly to `main` in Azure Repos. Which configuration enforces this?",
          options: [
            "A) Add all developers to the Read-only group on the main branch.",
            "B) Configure a branch policy on `main` requiring PRs — this disables direct pushes.",
            "C) Remove developer push permissions at the repository level.",
            "D) Enable branch locking on `main`.",
          ],
          correctIndex: 1,
          explanation:
            "When a branch policy (any policy) is configured on `main`, direct pushes to that branch are automatically blocked — all changes must go through a PR. This is the standard way to enforce PR-based workflows. Removing push permissions (C) would block PRs too (the merge is a push). Branch locking (D) prevents all changes including PR merges. Read-only group (A) would block developer contributions entirely.",
        },
        {
          id: "az400-d2-q12",
          question:
            "A team uses feature flags to deploy incomplete features to production. Which branching strategy does this pattern primarily enable?",
          options: [
            "A) Gitflow — feature flags replace release branches.",
            "B) Trunk-based development — code is merged to `main` even when not ready, with feature flags controlling visibility.",
            "C) Environment branching — feature flags replace environment-specific branches.",
            "D) Forking workflow — feature flags allow public contributors to deploy unfinished features.",
          ],
          correctIndex: 1,
          explanation:
            "Feature flags are a key enabler of trunk-based development — they allow incomplete code to be merged to `main` and deployed to production without being visible or active. The feature is activated only when the flag is enabled. This allows continuous integration without waiting for features to be complete. Feature flags complement (not replace) release branches in Gitflow (A). They are not specific to environment branching (C) or forking workflows (D).",
        },
        {
          id: "az400-d2-q13",
          question:
            "What does `git lfs migrate import --include=\"*.psd\"` accomplish?",
          options: [
            "A) Imports LFS-tracked `.psd` files from another repository.",
            "B) Rewrites the repository's commit history to move existing `.psd` files to LFS storage retroactively.",
            "C) Configures Git to track new `.psd` files in LFS going forward.",
            "D) Downloads all LFS `.psd` files from the remote LFS server.",
          ],
          correctIndex: 1,
          explanation:
            "`git lfs migrate import` rewrites the entire commit history to retroactively move files matching the specified pattern into LFS storage. This reduces the repository's historical footprint by converting all past commits that contained those binaries to use LFS pointers instead. `git lfs track` (C) handles future files. `git lfs pull` (D) downloads LFS files. There is no cross-repository import feature (A).",
        },
        {
          id: "az400-d2-q14",
          question:
            "A DevOps engineer wants to prevent secrets from being committed to the repository. Which tool provides pre-commit scanning at the developer's machine?",
          options: [
            "A) Azure DevOps branch policies — scan commits server-side for secrets.",
            "B) `git-secrets` or `gitleaks` — pre-commit hooks that scan staged changes before commit.",
            "C) GitHub Advanced Security — scans after the code is pushed to the remote.",
            "D) Azure Policy — enforce repository content rules at the organization level.",
          ],
          correctIndex: 1,
          explanation:
            "`git-secrets` and `gitleaks` can be configured as Git pre-commit hooks that scan staged changes before `git commit` completes. If a secret pattern is detected, the commit is blocked. This prevents secrets from ever reaching the remote. Branch policies (A) and GitHub Advanced Security (C) scan after the code is pushed — the secret already exists in history at that point. Azure Policy (D) governs Azure resources, not repository content.",
        },
        {
          id: "az400-d2-q15",
          question:
            "What is the benefit of requiring 'comment resolution' as a branch policy in Azure Repos?",
          options: [
            "A) It automatically resolves all PR comments when the build passes.",
            "B) It prevents the PR from being merged until all active review comments are addressed (resolved or replied to).",
            "C) It requires reviewers to comment on every file changed in the PR.",
            "D) It sends email notifications when comments are left unresolved for 24 hours.",
          ],
          correctIndex: 1,
          explanation:
            "The 'Comment resolution' branch policy prevents merging the PR until all active comments are in a resolved state. This ensures that reviewer feedback is not silently ignored — developers must address every comment (by fixing the issue, providing an explanation, or marking as won't fix) before the merge proceeds. It does not auto-resolve comments (A), require comments on every file (C), or send timed notifications (D).",
        },
      ],
    },

    // ─── Domain 3: Design and Implement Build and Release Pipelines (40%) ─
    {
      id: "domain-3",
      title: "Design and Implement Build and Release Pipelines",
      weight: "40%",
      order: 3,
      summary:
        "This is the heaviest domain at 40% and tests your ability to design and implement complete CI/CD pipelines using Azure Pipelines and GitHub Actions. A DevOps engineer must implement multi-stage pipelines, deployment strategies, and artifact management.\n\nKey areas include writing **YAML pipelines** (triggers, stages, jobs, steps, templates), configuring **pipeline agents** (Microsoft-hosted vs. self-hosted), implementing **deployment strategies** (blue-green, canary, rolling), managing **pipeline artifacts** and **Azure Artifacts** feeds, implementing **environment approvals and gates**, configuring **release gates** with Azure Monitor and REST API health checks, and integrating with **infrastructure-as-code** tools (Bicep, Terraform).\n\nExpect hands-on questions about YAML pipeline syntax, configuring multi-stage deployments to multiple environments, implementing deployment strategies with App Service slots or Kubernetes, and securing pipelines with environments and approvals.",
      keyConceptsForExam: [
        "**YAML pipeline structure** — `trigger`, `pool`, `stages`, `jobs`, `steps`; `dependsOn` for ordering; `condition` for conditional execution",
        "**Pipeline templates** — reusable YAML templates (`extends`, `template` keyword); enforce organizational standards across pipelines",
        "**Deployment strategies** — `runOnce` (standard deploy), `rolling` (gradual replacement), `canary` (percentage-based), `blueGreen` (slot swap)",
        "**Environments and approvals** — named environments with deployment history; pre-deployment approvals; branch control checks; exclusive lock",
        "**Release gates** — automated checks before/after deployment: Azure Monitor metric, REST API query, Azure Policy compliance, Service Bus queue drain",
        "**Azure Artifacts** — hosted package feeds (npm, NuGet, Maven, Python, Cargo); upstream sources; feed views (local, prerelease, release)",
        "**Pipeline agents** — Microsoft-hosted (ephemeral, pre-installed tools); self-hosted (persistent, VNet access, custom tools, faster builds)",
        "**GitHub Actions** — workflows (`.github/workflows/`), jobs, steps, actions; reusable workflows; environments for approvals",
      ],
      examTips: [
        "YAML pipeline `stages` run sequentially by default; add `dependsOn: []` to run in parallel. `jobs` within a stage run in parallel by default; add `dependsOn` to make them sequential.",
        "Pipeline templates use `extends` to enforce guardrails — a required template that all pipelines must extend ensures security and compliance checks run on every pipeline.",
        "Deployment jobs (`deployment`) support strategies and track deployment history in Environments. Regular jobs do not have deployment history or approval integration.",
        "Release gates run continuously until they pass or timeout — use Azure Monitor query gates to ensure error rates return to baseline after deployment before proceeding.",
        "Azure Artifacts feed views: `@local` (all packages), `@prerelease` (pre-release), `@release` (stable). Upstream sources allow consuming packages from public registries through the private feed (air-gapping).",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
      ],
      sections: [
        {
          heading: "Multi-Stage YAML Pipeline with Approvals",
          body: "A multi-stage YAML pipeline implements CI/CD with approval gates between environments:\n\n```yaml\ntrigger:\n  branches:\n    include: [main]\n\nstages:\n- stage: Build\n  jobs:\n  - job: BuildJob\n    pool:\n      vmImage: ubuntu-latest\n    steps:\n    - task: DotNetCoreCLI@2\n      inputs:\n        command: build\n\n- stage: DeployStaging\n  dependsOn: Build\n  jobs:\n  - deployment: DeployToStaging\n    environment: staging  # triggers approval check\n    strategy:\n      runOnce:\n        deploy:\n          steps:\n          - task: AzureWebApp@1\n            ...\n\n- stage: DeployProduction\n  dependsOn: DeployStaging\n  jobs:\n  - deployment: DeployToProd\n    environment: production  # triggers approval + gates\n    ...\n```\n\nThe `environment` keyword links the deployment job to an Azure Pipelines Environment, which can have:\n- **Pre-deployment approvals**: Named approvers must approve before the job runs.\n- **Branch control**: Only deployments from specific branches are allowed.\n- **Exclusive lock**: Only one deployment to this environment runs at a time.",
          code: {
            lang: "yaml",
            label: "Multi-stage pipeline with canary deployment strategy",
            snippet: `trigger:
  branches:
    include: [main]

stages:
- stage: Build
  jobs:
  - job: Build
    pool:
      vmImage: ubuntu-latest
    steps:
    - task: Docker@2
      inputs:
        command: buildAndPush
        repository: myapp
        containerRegistry: myACR

- stage: DeployProduction
  dependsOn: Build
  jobs:
  - deployment: CanaryDeploy
    environment: production
    strategy:
      canary:
        increments: [10, 50]   # 10% then 50% then 100%
        preDeploy:
          steps:
          - script: echo "Pre-deploy checks"
        deploy:
          steps:
          - task: KubernetesManifest@1
            inputs:
              action: deploy
              manifests: manifests/*.yaml
        postRouteTraffic:
          steps:
          - task: AzureMonitor@1
            inputs:
              connectedServiceName: myAzureConn
              ResourceGroupName: myRG`,
          },
        },
        {
          heading: "Pipeline Templates for Organizational Standards",
          body: "Pipeline templates allow creating reusable building blocks and enforcing organizational standards:\n\n**Template types**:\n- **Step templates**: Reusable sets of pipeline steps (e.g., build and push Docker image)\n- **Job templates**: Complete job definitions with parameters\n- **Stage templates**: Entire stages with multiple jobs\n- **`extends` templates**: A base template that all pipelines must extend — enforces guardrails\n\nThe `extends` keyword is the most powerful governance tool — it allows an organization to define a required base template that all pipelines must use. The base template can inject mandatory security scans, credential validation, and compliance checks that cannot be bypassed by individual pipeline authors.\n\nTemplates can be stored in a separate 'pipeline templates' repository and referenced across all projects, enabling centralized management of CI/CD standards.",
          code: {
            lang: "yaml",
            label: "Pipeline using an extends template for governance",
            snippet: `# pipeline.yaml (in application repo)
extends:
  template: templates/security-baseline.yaml@templates-repo
  parameters:
    appName: myapp
    deployEnvironment: production

---
# templates/security-baseline.yaml (in templates repo)
parameters:
- name: appName
  type: string
- name: deployEnvironment
  type: string

stages:
- stage: SecurityScan
  jobs:
  - job: CredentialScan
    steps:
    - task: CredScan@3   # Always runs - cannot be skipped
- stage: Build
  jobs:
  - template: jobs/build.yaml
    parameters:
      appName: \${{ parameters.appName }}
- stage: Deploy
  jobs:
  - template: jobs/deploy.yaml
    parameters:
      environment: \${{ parameters.deployEnvironment }}`,
          },
        },
        {
          heading: "Azure Artifacts and Package Management",
          body: "Azure Artifacts provides hosted package feeds for sharing packages within and across organizations:\n\n**Feed configuration**:\n- Create feeds scoped to an organization or project.\n- Configure **upstream sources** to proxy public registries (npmjs.com, NuGet Gallery, PyPI) — all package downloads go through the private feed, enabling air-gapped environments and package curation.\n- **Feed views** control package promotion: `@local` (all), `@prerelease` (pre-release), `@release` (production-ready).\n\n**Package promotion workflow**:\n1. CI pipeline publishes a new package version to the `@local` view.\n2. After testing, the package is promoted to `@prerelease`.\n3. After release validation, promoted to `@release`.\n4. Downstream consumers set their feed URL to `@release` — they only receive promoted packages.\n\n**Universal Packages**: Azure Artifacts also supports Universal Packages for arbitrary binary artifacts (not tied to a specific package format) — useful for storing build outputs, scripts, or deployment packages.",
          code: {
            lang: "bash",
            label: "Publish and promote NuGet package via pipeline",
            snippet: `# In pipeline YAML — publish package
- task: NuGetCommand@2
  inputs:
    command: push
    publishVstsFeed: 'MyProject/MyFeed'
    packagesToPush: '**/*.nupkg'

# Promote package to release view via Azure CLI
az artifacts universal publish \\
  --organization https://dev.azure.com/myOrg \\
  --project MyProject \\
  --feed MyFeed \\
  --name mypackage \\
  --version 1.2.3 \\
  --path ./dist

# Promote to @release view
az artifacts universal promote \\
  --organization https://dev.azure.com/myOrg \\
  --project MyProject \\
  --feed MyFeed \\
  --name mypackage \\
  --version 1.2.3 \\
  --release-view release`,
          },
        },
      ],
      quiz: [
        {
          id: "az400-d3-q1",
          question:
            "A YAML pipeline has a Build stage and two deployment stages (Staging, Production). The Staging and Production stages should both wait for the Build stage but run in parallel with each other. How should `dependsOn` be configured?",
          options: [
            "A) Staging: `dependsOn: Build`; Production: `dependsOn: Staging`",
            "B) Staging: `dependsOn: Build`; Production: `dependsOn: Build`",
            "C) Staging: `dependsOn: []`; Production: `dependsOn: []`",
            "D) No `dependsOn` needed — all stages run in parallel by default.",
          ],
          correctIndex: 1,
          explanation:
            "Both Staging and Production stages should declare `dependsOn: Build` — they both wait for Build to complete, then run in parallel with each other (since neither depends on the other). Option A (Production depends on Staging) is sequential. Option C (no dependencies) causes all three stages to run in parallel immediately. Option D is incorrect — stages run sequentially by default without `dependsOn`.",
        },
        {
          id: "az400-d3-q2",
          question:
            "A DevOps engineer configures a release gate that queries an Azure Monitor metric — average error rate must be below 0.1% for 5 minutes after deployment. When does the gate re-evaluate?",
          options: [
            "A) Once — if it fails the first time, the gate blocks the release permanently.",
            "B) Continuously at a configured sampling interval until the gate passes or the timeout is exceeded.",
            "C) Only when a pipeline administrator manually triggers re-evaluation.",
            "D) Once per hour for up to 24 hours.",
          ],
          correctIndex: 1,
          explanation:
            "Release gates in Azure Pipelines are evaluated continuously at the configured sampling interval (e.g., every 5 minutes) until all gates pass or the timeout period expires. This allows transient spikes to resolve naturally — the deployment proceeds once the metric stays below threshold for the required period. Gates do not permanently block on first failure (A). Manual re-evaluation (C) is not required. The interval and timeout are configurable, not fixed at hourly (D).",
        },
        {
          id: "az400-d3-q3",
          question:
            "An organization wants every pipeline across all projects to run a credential scanning step that cannot be skipped by individual teams. Which pipeline template feature enforces this?",
          options: [
            "A) Required pipeline templates — add the scan step to each project's pipeline manually.",
            "B) `extends` templates — all pipelines must extend a base template that injects the mandatory scan step.",
            "C) Branch policies with build validation — run the credential scan as a PR check.",
            "D) Pipeline decorators — inject steps into all pipelines in the organization automatically.",
          ],
          correctIndex: 3,
          explanation:
            "Pipeline decorators inject steps (pre/post) into all pipeline jobs organization-wide automatically, without requiring individual pipelines to reference or opt into them. This is the strongest enforcement mechanism — teams cannot bypass decorator-injected steps. `extends` templates (B) require pipelines to explicitly use the template (teams could bypass it with a different template). Manual addition (A) requires discipline. Branch policies (C) run checks on PR, not on all pipeline executions.",
        },
        {
          id: "az400-d3-q4",
          question:
            "A deployment job uses the `canary` strategy with `increments: [10, 50]`. How many times does the `deploy` step block run in total?",
          options: [
            "A) 1 — the canary strategy runs all increments in a single deployment step.",
            "B) 2 — once for 10%, once for 50%.",
            "C) 3 — once for 10%, once for 50%, once for the remaining 100%.",
            "D) 4 — once for each: pre-deploy, 10%, 50%, and post-deploy.",
          ],
          correctIndex: 2,
          explanation:
            "With `increments: [10, 50]`, the canary strategy runs the deploy block 3 times: first for 10% of targets, then for 50% of targets, then for 100% of targets (final rollout). Between each increment, `postRouteTraffic` steps can run health checks. If any increment fails, the `on.failure` block runs for rollback.",
        },
        {
          id: "az400-d3-q5",
          question:
            "What is the difference between a Microsoft-hosted agent and a self-hosted agent in Azure Pipelines?",
          options: [
            "A) Microsoft-hosted agents support YAML pipelines; self-hosted agents only support classic pipelines.",
            "B) Microsoft-hosted agents are ephemeral VMs with pre-installed tools, no VNet access; self-hosted agents run on your infrastructure with full network and tool customization.",
            "C) Self-hosted agents are always free; Microsoft-hosted agents require a paid license.",
            "D) Microsoft-hosted agents support Windows only; self-hosted agents support Linux and macOS.",
          ],
          correctIndex: 1,
          explanation:
            "Microsoft-hosted agents are ephemeral VMs provisioned per-job by Microsoft, pre-loaded with common build tools. They cannot access private VNets. Self-hosted agents run on customer-managed infrastructure (VMs, containers, on-premises) — they have persistent state, access to private networks (for deploying to private AKS, SQL MI, etc.), and can have custom tools installed. Both support YAML and classic pipelines. Pricing and OS support differ from the descriptions in A, C, and D.",
        },
        {
          id: "az400-d3-q6",
          question:
            "A pipeline deploys to Azure App Service using deployment slots. After swapping the staging slot to production, a monitoring gate should verify error rates before the release is marked successful. Where in the pipeline should this gate be configured?",
          options: [
            "A) As a pre-deployment approval on the production environment — block before the swap.",
            "B) As a post-deployment gate on the production environment — verify metrics after the swap completes.",
            "C) As a step in the deployment job that polls Azure Monitor after the swap.",
            "D) As a branch policy that runs health checks after the merge to main.",
          ],
          correctIndex: 1,
          explanation:
            "Post-deployment gates run after the deployment completes and verify the system's health before the release stage is considered successful. For App Service slot swaps, a post-deployment Azure Monitor gate queries error rates and blocks release completion if errors are elevated — allowing rollback via a reverse swap. Pre-deployment approvals (A) run before the deployment. A pipeline step polling (C) works but lacks the native gate retry and timeout semantics. Branch policies (D) run on code changes, not deployments.",
        },
        {
          id: "az400-d3-q7",
          question:
            "An Azure Artifacts feed is configured with `npmjs.com` as an upstream source. A developer runs `npm install lodash`. What happens?",
          options: [
            "A) npm fetches lodash directly from npmjs.com, bypassing the Azure Artifacts feed.",
            "B) Azure Artifacts checks its local cache; if not found, fetches from npmjs.com, caches it in the feed, and returns it to the developer.",
            "C) The install fails because lodash is not in the private feed.",
            "D) Azure Artifacts blocks the request — only manually uploaded packages are allowed.",
          ],
          correctIndex: 1,
          explanation:
            "When an upstream source is configured, Azure Artifacts proxies the request: it first checks the feed's local cache, then fetches from the upstream (npmjs.com) on a cache miss, stores the package in the feed, and returns it to the developer. Subsequent requests for the same version are served from cache. This provides dependency air-gapping, caching, and audit of all consumed packages. The feed does not block upstream packages (C, D).",
        },
        {
          id: "az400-d3-q8",
          question:
            "A pipeline needs to deploy to an AKS private cluster whose API server is only accessible within the VNet. Which agent configuration enables this?",
          options: [
            "A) Microsoft-hosted Ubuntu agent — free and pre-configured for Kubernetes.",
            "B) Self-hosted agent running as a pod in the AKS cluster itself.",
            "C) Self-hosted agent on a VM in the same VNet (or peered VNet) that can reach the private API server.",
            "D) Microsoft-hosted agent with a VPN connection to the VNet.",
          ],
          correctIndex: 2,
          explanation:
            "A self-hosted agent on a VM within the VNet (or a VNet with peering/private endpoint access to the AKS API server) can reach the private API server endpoint. Microsoft-hosted agents (A) cannot access private VNets. Running the agent as a pod in the cluster (B) creates a bootstrapping problem — you need an agent to deploy to the cluster to run the agent. Microsoft-hosted agents cannot establish VPN connections (D).",
        },
        {
          id: "az400-d3-q9",
          question:
            "What does the `exclusive lock` check on an Azure Pipelines Environment provide?",
          options: [
            "A) It prevents the environment from being deleted while a deployment is running.",
            "B) It ensures only one active deployment job runs against the environment at a time — concurrent deployments queue up.",
            "C) It locks the environment configuration so only administrators can modify it.",
            "D) It prevents rollbacks — once deployed, the environment state is locked.",
          ],
          correctIndex: 1,
          explanation:
            "The exclusive lock check on an Environment ensures that only one deployment job runs against that environment at any given time. If multiple pipelines trigger deployments to the same environment simultaneously, they queue up and run sequentially. This prevents concurrent deployments from interfering with each other (e.g., two deployments overwriting each other's configuration). It does not prevent deletion (A), lock configuration (C), or block rollbacks (D).",
        },
        {
          id: "az400-d3-q10",
          question:
            "A pipeline publishes a NuGet package to Azure Artifacts. The package should only be available to consumers once it has passed integration testing. Which Azure Artifacts feature supports this promotion workflow?",
          options: [
            "A) Package lifecycle policies — automatically promote packages after 7 days.",
            "B) Feed views — publish to `@local`, promote to `@prerelease` after integration tests, promote to `@release` for consumers.",
            "C) Upstream sources — configure npmjs.com as the promotion target.",
            "D) Package retention policies — delete old packages after promotion.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Artifacts feed views (`@local`, `@prerelease`, `@release`) implement a promotion workflow. Packages are published to `@local` first. After passing tests, they are promoted to `@prerelease`. After release approval, promoted to `@release`. Consumers configure their package source to use the `@release` view — they only see packages that have been fully validated. Lifecycle policies (A) are about retention, not promotion. Upstream sources (C) are for consuming external packages. Retention policies (D) delete old packages.",
        },
        {
          id: "az400-d3-q11",
          question:
            "A GitHub Actions workflow needs to deploy to Azure App Service. The deployment should use a service principal but without storing client secrets in GitHub. Which authentication method should be used?",
          options: [
            "A) Store the service principal client secret as a GitHub Actions secret.",
            "B) Use OpenID Connect (OIDC) with a federated credential — GitHub Actions exchanges an OIDC token for an Azure access token.",
            "C) Use the Azure CLI with username/password stored as environment variables.",
            "D) Deploy via a webhook that triggers the App Service deployment from Azure.",
          ],
          correctIndex: 1,
          explanation:
            "GitHub Actions supports OIDC-based authentication to Azure using the `azure/login` action with `client-id`, `tenant-id`, and `subscription-id` (no secret required). GitHub's OIDC provider issues a short-lived token that Azure trusts via federated credentials configured on the service principal. No client secret is stored. Storing secrets (A) creates rotation overhead. Username/password (C) is insecure. Webhooks (D) are a deployment trigger mechanism, not an authentication solution.",
        },
        {
          id: "az400-d3-q12",
          question:
            "A pipeline stage should only run when the triggering branch is `main`. Which YAML condition expression achieves this?",
          options: [
            "A) `condition: eq(variables['Build.Branch'], 'main')`",
            "B) `condition: eq(variables['Build.SourceBranchName'], 'main')`",
            "C) `condition: branch == 'main'`",
            "D) `condition: startsWith(variables['Build.SourceBranch'], 'refs/heads/main')`",
          ],
          correctIndex: 1,
          explanation:
            "`Build.SourceBranchName` returns just the branch name (e.g., `main`) without the `refs/heads/` prefix, making the comparison straightforward. `Build.Branch` (A) is not a valid Azure Pipelines variable. The bare `branch ==` (C) is not valid YAML condition syntax. `Build.SourceBranch` includes the full ref path (D would work too with `startsWith`, but B is simpler and more readable).",
        },
        {
          id: "az400-d3-q13",
          question:
            "A team wants to implement blue-green deployments for an Azure App Service application. Which App Service feature supports this with zero downtime?",
          options: [
            "A) App Service auto-healing — automatically restarts unhealthy instances.",
            "B) Deployment slots — deploy to staging slot (blue), test, then swap staging↔production (green becomes new staging).",
            "C) App Service scaling — add new instances while keeping old ones running.",
            "D) App Service backup and restore — restore production to a known-good state.",
          ],
          correctIndex: 1,
          explanation:
            "App Service deployment slots naturally implement blue-green deployment: deploy new version to staging (blue), run health checks, then perform a swap — traffic instantly moves from old production (green, now in staging) to new production (previously blue, now in production slot). The old version is immediately available for rollback by swapping back. Auto-healing (A) handles unhealthy instances, not deployments. Scaling (C) does not deploy new code. Backup/restore (D) is for data recovery, not zero-downtime deployments.",
        },
        {
          id: "az400-d3-q14",
          question:
            "A DevOps team stores Terraform state files in Azure Blob Storage. Multiple pipeline runs could corrupt the state file if they run concurrently. Which Azure Blob Storage feature prevents this?",
          options: [
            "A) Blob versioning — each run creates a new version of the state file.",
            "B) Blob leasing — Terraform acquires an exclusive lease on the state blob before modifying it.",
            "C) Storage account firewall — restrict access to the pipeline agent IPs only.",
            "D) Immutable blob policies — prevent the state file from being modified.",
          ],
          correctIndex: 1,
          explanation:
            "The Azure Terraform backend automatically uses blob leasing for state locking. When a Terraform operation begins, it acquires an exclusive lease on the state blob. Other concurrent Terraform operations are blocked until the lease is released. This prevents state corruption from concurrent runs. Versioning (A) preserves history but does not prevent concurrent writes. Firewall (C) restricts who can access the blob but not concurrent access. Immutable policies (D) would prevent any writes — including legitimate state updates.",
        },
        {
          id: "az400-d3-q15",
          question:
            "What is the purpose of the `publishPipelineArtifact` task in an Azure Pipelines YAML pipeline?",
          options: [
            "A) Publishes the pipeline's YAML definition to Azure Artifacts as a package.",
            "B) Saves files produced during a job (build outputs, test results) to a location accessible by subsequent stages and jobs in the same pipeline run.",
            "C) Pushes Docker images to Azure Container Registry.",
            "D) Uploads pipeline logs to Azure Blob Storage for long-term retention.",
          ],
          correctIndex: 1,
          explanation:
            "`publishPipelineArtifact` (or `PublishBuildArtifacts`) uploads files to the pipeline's artifact store, making them available for download by subsequent jobs and stages in the same run using `downloadPipelineArtifact`. This is how build outputs (compiled binaries, Docker image digests, test reports) pass between the Build stage and Deploy stage in a multi-stage pipeline. It does not publish YAML definitions (A), push container images (C), or store logs (D).",
        },
      ],
    },

    // ─── Domain 4: Develop a Security and Compliance Plan (10%) ─────
    {
      id: "domain-4",
      title: "Develop a Security and Compliance Plan",
      weight: "10%",
      order: 4,
      summary:
        "This domain covers implementing security and compliance practices throughout the DevSecOps pipeline. A DevOps engineer must integrate security scanning, secret management, and compliance checks into CI/CD workflows.\n\nKey areas include implementing **SAST** (Static Application Security Testing) and **DAST** (Dynamic Application Security Testing) in pipelines, managing secrets with **Azure Key Vault** and pipeline variable groups, implementing **software composition analysis (SCA)** for dependency vulnerability scanning, configuring **container image scanning**, and ensuring **compliance as code** with Azure Policy.\n\nExpect questions on integrating security tools (SonarCloud, OWASP ZAP, Trivy, Snyk) into Azure Pipelines, configuring Key Vault-linked variable groups, implementing OSS license compliance, and using Microsoft Defender for DevOps for pipeline security posture.",
      keyConceptsForExam: [
        "**SAST** — static code analysis without running the code; finds code quality issues and security vulnerabilities; tools: SonarCloud, Checkmarx, Veracode",
        "**DAST** — tests running application for vulnerabilities; tools: OWASP ZAP, Burp Suite",
        "**SCA** — analyzes open-source dependencies for known CVEs and license compliance; tools: Snyk, OWASP Dependency Check, GitHub Dependabot",
        "**Container scanning** — scan Docker images for OS and library CVEs before pushing to registry; tools: Trivy, Microsoft Defender for Container Registries",
        "**Azure Key Vault variable groups** — link Azure DevOps variable groups to Key Vault; secrets auto-rotated when updated in Key Vault",
        "**Pipeline secret masking** — Azure Pipelines automatically masks secret variable values in logs; never print secrets with `echo`",
        "**Credential scanning** — `CredScan` task, `git-secrets`, GitHub secret scanning — prevent secrets in code",
        "**Microsoft Defender for DevOps** — security posture for Azure DevOps and GitHub organizations; identifies misconfigured pipelines, exposed secrets, and vulnerable dependencies",
      ],
      examTips: [
        "SAST tools scan code without executing it — they run on the source code in the CI pipeline (at build time). DAST tools scan a running application — they run against a deployed environment (staging/QA).",
        "Key Vault-linked variable groups fetch secret values at pipeline execution time. If the secret is rotated in Key Vault, the next pipeline run automatically uses the new value — no pipeline changes required.",
        "Never use `echo` or `print` to output secret variable values in a pipeline — even though Azure Pipelines masks them, the value may appear in subsequent step outputs or logs.",
        "Container image scanning should occur after building but before pushing to the production registry — fail the pipeline if critical CVEs are found.",
        "Software composition analysis (SCA) checks both the vulnerability status (CVE database) AND the license compliance (GPL vs. MIT vs. Apache) of open-source dependencies.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-ad-basics", title: "Azure AD / Entra ID Basics" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Functions Basics" },
      ],
      sections: [
        {
          heading: "Integrating Security Scanning into CI/CD",
          body: "DevSecOps integrates security at each pipeline stage:\n\n**CI Stage (Build time)**:\n- **Credential scanning** (`CredScan@3`): Detect hardcoded secrets in source code.\n- **SAST** (SonarCloud, Checkmarx): Analyze source code for security vulnerabilities and code smells.\n- **SCA** (Snyk, OWASP Dependency Check): Scan package dependency trees for known CVEs and license issues.\n- **Container scanning** (Trivy, `az acr task run`): Scan built Docker images before pushing.\n\n**CD Stage (Deploy time)**:\n- **DAST** (OWASP ZAP): Run automated penetration tests against the deployed application in staging.\n- **Infrastructure scanning** (Checkov, tfsec): Scan Bicep/Terraform code for misconfigurations before deployment.\n- **Policy compliance gates**: Verify Azure Policy compliance before promoting to production.\n\nFailing security scans should block the pipeline — treat security findings as build failures for critical and high severity issues.",
          code: {
            lang: "yaml",
            label: "Pipeline step — Trivy container vulnerability scan",
            snippet: `- stage: SecurityScan
  jobs:
  - job: ContainerScan
    pool:
      vmImage: ubuntu-latest
    steps:
    - task: Docker@2
      inputs:
        command: build
        repository: myapp
        tags: $(Build.BuildId)

    # Scan with Trivy — fail on CRITICAL vulnerabilities
    - script: |
        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
          aquasec/trivy:latest image \\
          --exit-code 1 \\
          --severity CRITICAL \\
          --no-progress \\
          myapp:$(Build.BuildId)
      displayName: 'Trivy - Container Vulnerability Scan'

    # Push only if scan passes
    - task: Docker@2
      inputs:
        command: push
        repository: myapp
        tags: $(Build.BuildId)`,
          },
        },
        {
          heading: "Azure Key Vault Variable Groups",
          body: "Linking an Azure DevOps variable group to Azure Key Vault allows pipelines to use secrets without storing them in Azure DevOps:\n\n**Configuration**:\n1. Create a variable group in Azure DevOps → link to Key Vault.\n2. Select which Key Vault secrets to expose as pipeline variables.\n3. The variable group uses a service connection (with appropriate Key Vault Secrets User role) to fetch secret values at pipeline runtime.\n\n**Benefits**:\n- Secrets are never stored in Azure DevOps — they exist only in Key Vault.\n- Secret rotation in Key Vault is automatically picked up by the next pipeline run.\n- Access to the variable group is controlled by Azure DevOps pipeline permissions.\n- All Key Vault secret reads are audited in Key Vault diagnostic logs.\n\n**Pipeline usage**: Reference variable group in the pipeline YAML with `group: my-keyvault-variables`. Secret values are automatically masked in pipeline logs.\n\n**Important limitation**: Key Vault variable groups fetch secrets at pipeline start, not per-step. Secrets rotated during a pipeline run are not picked up until the next run.",
        },
        {
          heading: "Software Composition Analysis (SCA)",
          body: "Modern applications use hundreds of open-source dependencies. SCA tools analyze these dependencies for:\n\n**Security vulnerabilities**: Cross-reference dependencies against CVE databases (NVD, GitHub Advisory Database, Snyk Intel) to identify known vulnerabilities. Alert when a dependency has a critical CVE and a fix is available.\n\n**License compliance**: Open-source licenses range from permissive (MIT, Apache 2.0) to restrictive (GPL, AGPL). An application using a GPL-licensed dependency may be required to open-source its own code. SCA tools flag license incompatibilities based on configurable allow/deny lists.\n\n**Dependency confusion attacks**: Verify that internal package names are registered in private feeds and cannot be hijacked by public registry packages with the same name.\n\n**Tools**:\n- **GitHub Dependabot**: Automatically creates PRs to update vulnerable dependencies.\n- **Snyk**: Comprehensive SCA with developer-friendly fix suggestions.\n- **OWASP Dependency Check**: Open-source SCA tool integrable with Azure Pipelines.\n- **Microsoft Defender for DevOps**: Integrated SCA for Azure DevOps and GitHub organizations.",
        },
      ],
      quiz: [
        {
          id: "az400-d4-q1",
          question:
            "A pipeline runs SAST on every PR and DAST on every deployment to staging. A critical vulnerability is found by DAST in staging. What should the pipeline do?",
          options: [
            "A) Log the finding and continue deployment to production.",
            "B) Fail the pipeline stage and block promotion to production until the vulnerability is remediated.",
            "C) Send an email to the security team and continue deployment.",
            "D) Quarantine the staging environment and wait for manual security review.",
          ],
          correctIndex: 1,
          explanation:
            "Critical security vulnerabilities found by DAST should fail the pipeline stage and block promotion to production. The DevSecOps principle is to treat security findings as build failures — stopping the pipeline forces remediation before the vulnerable code reaches production. Logging and continuing (A), emailing and continuing (C), and manual-only review (D) all allow vulnerable code to potentially reach production.",
        },
        {
          id: "az400-d4-q2",
          question:
            "A DevOps engineer configures a variable group linked to Azure Key Vault with a database connection string. The DBA rotates the database password in Key Vault. When will the pipeline use the new password?",
          options: [
            "A) Immediately — Azure DevOps fetches the latest secret value on every pipeline step.",
            "B) After the variable group is manually refreshed in Azure DevOps.",
            "C) On the next pipeline run — Key Vault variable groups fetch secrets at pipeline start.",
            "D) After the service connection credentials are updated to match the new password.",
          ],
          correctIndex: 2,
          explanation:
            "Azure DevOps Key Vault-linked variable groups fetch secret values when the pipeline run starts. The new password rotated in Key Vault will be picked up automatically by the next pipeline run — no manual updates are required in Azure DevOps. Secrets are not re-fetched per-step (A). Manual refresh (B) is not required. Service connection credentials authenticate to Key Vault, not to the database — they do not need updating (D).",
        },
        {
          id: "az400-d4-q3",
          question:
            "What is the difference between SAST and DAST in a DevSecOps pipeline?",
          options: [
            "A) SAST scans infrastructure configurations; DAST scans application source code.",
            "B) SAST analyzes source code statically without execution; DAST tests a running application by sending attack traffic.",
            "C) SAST is manual pen testing; DAST is automated code review.",
            "D) SAST runs at deployment time; DAST runs at build time.",
          ],
          correctIndex: 1,
          explanation:
            "SAST (Static Application Security Testing) analyzes source code, bytecode, or binaries without executing the application — runs during the build/CI phase. DAST (Dynamic Application Security Testing) sends malicious requests to a running application to find runtime vulnerabilities (injection, authentication bypass, XSS) — runs against a deployed environment. SAST finds code-level issues; DAST finds runtime behavior issues. Timing is the opposite of D.",
        },
        {
          id: "az400-d4-q4",
          question:
            "A developer sets a pipeline variable `$(DatabasePassword)` as a secret. They add a script step: `echo $(DatabasePassword)`. What appears in the pipeline logs?",
          options: [
            "A) The actual password value — scripts can output any variable.",
            "B) `***` — Azure Pipelines masks secret variable values in logs.",
            "C) An error — secret variables cannot be used in script steps.",
            "D) Empty string — secret variables are not accessible in script steps.",
          ],
          correctIndex: 1,
          explanation:
            "Azure Pipelines automatically masks secret variable values in log output, replacing them with `***`. This applies to any location where the secret value appears in logs. However, this masking is best-effort — the secret value should never be output intentionally as it may appear in artifact files, error messages, or transferred to external systems where masking does not apply. Secret variables ARE accessible in scripts (C, D are wrong).",
        },
        {
          id: "az400-d4-q5",
          question:
            "A company's legal team requires that no open-source library with a GPL license can be used in their commercial application. Which DevSecOps practice enforces this?",
          options: [
            "A) SAST scanning — detect GPL-licensed code in the application source.",
            "B) Software Composition Analysis (SCA) with license compliance policies — fail the build when a GPL-licensed dependency is detected.",
            "C) Container scanning — check container images for GPL-licensed binaries.",
            "D) Azure Policy — deny deployment of applications with GPL dependencies.",
          ],
          correctIndex: 1,
          explanation:
            "SCA tools (Snyk, OWASP Dependency Check, FOSSA) analyze dependency trees and check each dependency's license against configurable allow/deny lists. Configuring a policy that denies GPL licenses fails the pipeline when such a dependency is introduced. SAST (A) analyzes code logic, not license metadata. Container scanning (C) looks for OS/library CVEs, not license types. Azure Policy (D) governs Azure resources, not application dependencies.",
        },
        {
          id: "az400-d4-q6",
          question:
            "A pipeline uses the `CredScan` task. What does this task detect?",
          options: [
            "A) SQL injection vulnerabilities in application code.",
            "B) Hardcoded credentials, API keys, connection strings, and other secrets in source code and pipeline configuration.",
            "C) Vulnerable third-party dependencies with known CVEs.",
            "D) Container images with root user configuration.",
          ],
          correctIndex: 1,
          explanation:
            "Microsoft's CredScan (Credential Scanner) analyzes source code, scripts, configuration files, and build outputs for patterns matching credentials — API keys, connection strings, passwords, certificates, and other secrets. It is a pre-push/CI-stage SAST tool focused specifically on secret detection. SQL injection (A) is a SAST concern for a different tool (like SonarCloud). CVE scanning (C) is SCA. Container configuration (D) is container scanning.",
        },
        {
          id: "az400-d4-q7",
          question:
            "Microsoft Defender for DevOps is enabled for an Azure DevOps organization. What security insights does it provide?",
          options: [
            "A) Runtime application performance monitoring for deployed services.",
            "B) Security posture for pipelines — exposed secrets in pipeline YAML, misconfigured service connections, vulnerable dependencies, and pipeline permissions.",
            "C) Network traffic analysis between Azure DevOps agents and Azure services.",
            "D) User behavior analytics for Azure DevOps administrators.",
          ],
          correctIndex: 1,
          explanation:
            "Microsoft Defender for DevOps (part of Microsoft Defender for Cloud) provides security posture management for Azure DevOps and GitHub: it detects exposed secrets in repositories and pipeline configurations, identifies misconfigured pipeline permissions and service connections, surfaces vulnerable open-source dependencies, and provides code scanning results. It is a source control and pipeline security tool, not runtime APM (A), network analysis (C), or UBA (D).",
        },
        {
          id: "az400-d4-q8",
          question:
            "A pipeline publishes a Docker image to ACR. Before pushing, Trivy scans the image and finds 3 CRITICAL CVEs. The pipeline is configured with `--exit-code 1` for critical findings. What happens?",
          options: [
            "A) The image is pushed with a warning annotation listing the CVEs.",
            "B) The pipeline step fails (non-zero exit code), which fails the pipeline job and blocks the push task.",
            "C) The CVEs are automatically patched by Trivy before the push.",
            "D) The pipeline continues and the security team receives an email about the CVEs.",
          ],
          correctIndex: 1,
          explanation:
            "Trivy's `--exit-code 1` flag causes the Trivy process to exit with a non-zero exit code when findings at or above the specified severity are found. In Azure Pipelines, a non-zero exit code from a script step fails the step, which fails the job, preventing subsequent steps (like the Docker push task) from running. Trivy does not patch CVEs (C) or send email notifications (D). The pipeline does not continue on failure by default (A).",
        },
        {
          id: "az400-d4-q9",
          question:
            "What is a dependency confusion attack and how does SCA help prevent it?",
          options: [
            "A) An attack where a malicious library mimics a legitimate internal package name on a public registry; SCA tools verify package origins and flag packages sourced from unexpected registries.",
            "B) An attack where two dependencies conflict causing application crashes; SCA resolves dependency conflicts.",
            "C) An attack where dependencies are replaced with malicious versions after CI; SCA locks dependency versions.",
            "D) An attack targeting CI/CD agents via malicious npm scripts; SCA blocks script execution.",
          ],
          correctIndex: 0,
          explanation:
            "Dependency confusion attacks exploit package manager behavior: when a private package name exists on a public registry with a higher version number, the package manager may download the public (malicious) version instead of the private one. SCA tools can detect when a package expected to come from a private feed is being sourced from a public registry, flagging potential confusion attacks. Private feed upstream source configuration also mitigates this by controlling which packages are allowed.",
        },
        {
          id: "az400-d4-q10",
          question:
            "A company requires that no secrets are stored in Azure DevOps pipeline variable groups in plain text. All secrets must be in Azure Key Vault. Which configuration achieves this?",
          options: [
            "A) Mark all variable group variables as 'Secret' in Azure DevOps.",
            "B) Create a variable group linked to Azure Key Vault — all secret values are stored in Key Vault and fetched at runtime.",
            "C) Store secrets as Base64-encoded values in the variable group.",
            "D) Use Azure DevOps secure files to store secret values.",
          ],
          correctIndex: 1,
          explanation:
            "A Key Vault-linked variable group stores no secret values in Azure DevOps — only the Key Vault secret names are referenced. At pipeline runtime, the pipeline fetches the actual values from Key Vault using the service connection. Marking variables as 'Secret' in Azure DevOps (A) masks them in logs but still stores the values in Azure DevOps. Base64 encoding (C) is not encryption — the value is still stored in Azure DevOps. Secure files (D) are for files (certificates, configuration), not key-value secret pairs.",
        },
        {
          id: "az400-d4-q11",
          question:
            "A developer introduces a new npm package `lodash` version 4.17.15 into the project. GitHub Dependabot detects a high-severity CVE in this version. What does Dependabot automatically do?",
          options: [
            "A) Blocks the developer's push to the repository.",
            "B) Creates a pull request to upgrade lodash to a version without the vulnerability.",
            "C) Removes the lodash dependency from `package.json` automatically.",
            "D) Sends an email to the security team and waits for manual resolution.",
          ],
          correctIndex: 1,
          explanation:
            "GitHub Dependabot automatically creates a pull request that updates the vulnerable dependency to a patched version. The PR includes a description of the CVE and the fix. It does not block pushes (A) — it detects vulnerabilities after the fact. It does not remove dependencies (C). It creates a PR rather than just sending an email (D), enabling the fix to be reviewed and merged like any other change.",
        },
        {
          id: "az400-d4-q12",
          question:
            "A pipeline runs an OWASP ZAP scan against a staging environment after deployment. What type of vulnerabilities can ZAP detect that SAST cannot?",
          options: [
            "A) Hardcoded credentials in source code.",
            "B) Insecure direct object references, CORS misconfigurations, and authentication bypasses that only manifest in a running application.",
            "C) Vulnerable third-party library versions.",
            "D) Infrastructure misconfigurations in ARM templates.",
          ],
          correctIndex: 1,
          explanation:
            "DAST tools like OWASP ZAP test a running application by simulating real attacks, discovering vulnerabilities that only appear at runtime: insecure direct object references (IDOR), CORS policy misconfigurations, authentication bypass, session management issues, and server-side request forgery (SSRF). SAST cannot find these because they require an executing application with real HTTP responses. Hardcoded credentials (A) are found by SAST/credential scanning. Vulnerable libraries (C) are found by SCA. Infrastructure misconfigurations (D) are found by IaC scanning tools.",
        },
        {
          id: "az400-d4-q13",
          question:
            "A DevOps engineer creates a service connection with a service principal that has Owner access on the production subscription. What is the security risk?",
          options: [
            "A) Owner access allows the service principal to create new subscriptions.",
            "B) A compromised pipeline or misconfigured pipeline could use the Owner role to delete resources, escalate privileges, or exfiltrate data in the production subscription.",
            "C) Service principals cannot have Owner access — only human users can.",
            "D) The service connection will fail because Owner access is too broad for Azure DevOps.",
          ],
          correctIndex: 1,
          explanation:
            "Using Owner access for a service connection violates the principle of least privilege. Owner can delete all resources, assign RBAC roles (privilege escalation), and access all data. A misconfigured or compromised pipeline could cause catastrophic damage to production. The correct approach is to grant only the specific roles needed (e.g., `Contributor` to a specific resource group, or custom roles). Service principals can have Owner access (C is wrong). Service connections work fine with Owner access (D is wrong) — the problem is security, not functionality.",
        },
        {
          id: "az400-d4-q14",
          question:
            "What does the `az acr check-health` command validate for a container registry integration?",
          options: [
            "A) Scans all images in the registry for CVE vulnerabilities.",
            "B) Validates that the local Docker and ACR login credentials are configured correctly for the registry.",
            "C) Checks registry compliance with Azure Policy definitions.",
            "D) Tests the registry's replication status across geo-replicated regions.",
          ],
          correctIndex: 1,
          explanation:
            "`az acr check-health` validates the local environment's health for working with Azure Container Registry — checks Docker installation, ACR login, network connectivity, and authentication. It helps troubleshoot pipeline failures related to ACR connectivity. It does not scan images for CVEs (A — use `az acr task run` with Trivy or Microsoft Defender for Containers), check policy compliance (C), or test geo-replication (D).",
        },
        {
          id: "az400-d4-q15",
          question:
            "A pipeline needs to deploy to production but must first verify that all resources in the production resource group are compliant with Azure Policy. Which pipeline gate type achieves this?",
          options: [
            "A) Azure Monitor query gate — check metrics from the production environment.",
            "B) Azure Policy compliance gate — query the Azure Policy compliance state for the resource group.",
            "C) Manual intervention gate — pause and wait for a human to verify compliance.",
            "D) REST API gate — call the Azure Policy REST API to get compliance results.",
          ],
          correctIndex: 3,
          explanation:
            "Azure Pipelines release gates support a 'Invoke REST API' gate type that can call the Azure Policy compliance API (`/providers/Microsoft.PolicyInsights/policyStates`) and check the compliance state before proceeding. Both B and D describe this approach — but D is more technically accurate (the gate type is 'Invoke REST API', not a built-in 'Azure Policy compliance' named gate). Azure Monitor (A) checks metrics. Manual intervention (C) requires human action.",
        },
      ],
    },

    // ─── Domain 5: Implement an Instrumentation Strategy (10%) ──────
    {
      id: "domain-5",
      title: "Implement an Instrumentation Strategy",
      weight: "10%",
      order: 5,
      summary:
        "This domain covers implementing monitoring, logging, and alerting strategies for DevOps workflows and deployed applications. A DevOps engineer must configure end-to-end observability that spans the pipeline (build/deploy telemetry) and the running application (performance, availability, errors).\n\nKey areas include configuring **Application Insights** for application monitoring, implementing **distributed tracing** across microservices, configuring **Azure Monitor** alerts and action groups, creating **Log Analytics** queries for operational insights, and integrating monitoring with the DevOps feedback loop for continuous improvement.\n\nExpect questions on setting up Application Insights for a pipeline-deployed application, creating KQL queries to detect issues, configuring alerts that feed back into the DevOps process (create work items, trigger pipelines), and designing a monitoring strategy that covers the DORA metrics (deployment frequency, lead time, change failure rate, mean time to recovery).",
      keyConceptsForExam: [
        "**DORA metrics** — Deployment Frequency, Lead Time for Changes, Change Failure Rate, Mean Time to Recovery (MTTR); measure DevOps performance",
        "**Application Insights** — SDK and auto-instrumentation; telemetry types; sampling; availability tests; dependency tracking",
        "**Distributed tracing** — W3C Trace Context; operation ID correlation across microservices; Application Map",
        "**KQL for DevOps** — querying deployment events, failure rates, error trends; `requests`, `exceptions`, `dependencies`, `customEvents` tables",
        "**Azure Monitor alerts to DevOps** — alert action group triggering Azure DevOps work item creation via webhook; closing the feedback loop",
        "**Pipeline telemetry** — Azure DevOps Analytics; pipeline duration, success rate, agent utilization; Power BI integration",
        "**Feature flag monitoring** — measure feature flag impact on error rates and performance; use custom events to track flag exposure",
        "**SLI/SLO design** — Service Level Indicators (measurable metrics) and Service Level Objectives (targets) for reliability engineering",
      ],
      examTips: [
        "DORA metrics measure DevOps team performance — the exam may ask which metric indicates a problem and what pipeline change would improve it. Change Failure Rate improvement = better testing; MTTR improvement = better monitoring and rollback automation.",
        "Application Insights connection strings (not instrumentation keys) are the current recommended configuration method. Connection strings include the ingestion endpoint for sovereign clouds.",
        "When configuring Azure Monitor alerts to create Azure DevOps work items, use an action group with a webhook pointing to the Azure DevOps REST API or use the Azure DevOps Boards action group type.",
        "Feature flag monitoring should track both feature flag exposure (custom event per flag evaluation) and outcome metrics (conversion rate, error rate) to enable data-driven feature decisions.",
        "Mean Time to Recovery (MTTR) is improved by: faster alert detection (shorter evaluation window), automated rollback in pipelines, deployment slot swap rollback, and runbook automation via Azure Automation.",
      ],
      relatedTopics: [
        { cloud: "azure", topicId: "azure-functions-basics", title: "Azure Functions Basics" },
        { cloud: "azure", topicId: "azure-storage-basics", title: "Azure Storage Basics" },
        { cloud: "azure", topicId: "azure-vnet-basics", title: "Azure Virtual Networks" },
      ],
      sections: [
        {
          heading: "DORA Metrics and DevOps Performance",
          body: "DORA (DevOps Research and Assessment) metrics are the industry-standard measures of software delivery performance:\n\n| Metric | Definition | Elite Performers |\n|---|---|---|\n| **Deployment Frequency** | How often deployments to production occur | Multiple times per day |\n| **Lead Time for Changes** | Time from code commit to production deployment | Less than 1 hour |\n| **Change Failure Rate** | % of deployments causing production incidents | 0–15% |\n| **Mean Time to Recovery (MTTR)** | Time to restore service after an incident | Less than 1 hour |\n\n**Improving DORA metrics with Azure DevOps**:\n- Deployment Frequency → Automate CI/CD; remove manual approval gates for low-risk changes.\n- Lead Time → Reduce pipeline execution time; parallelize test stages; use caching.\n- Change Failure Rate → Add SAST, DAST, integration tests; improve test coverage.\n- MTTR → Implement automated rollback (slot swap); improve alert detection time; create runbook automation.\n\nAzure DevOps Analytics and Power BI can visualize DORA metrics from pipeline execution data.",
        },
        {
          heading: "Closing the Feedback Loop with Monitoring",
          body: "A key DevOps principle is the feedback loop — production monitoring findings should feed back into the development process. Azure Monitor and Azure DevOps can be integrated to automate this:\n\n**Alert → Work Item creation**:\n1. Configure an Azure Monitor alert for a production error threshold.\n2. In the action group, add an Azure DevOps work item action (or a webhook to the Azure DevOps REST API).\n3. When the alert fires, an Azure DevOps Bug work item is automatically created with the alert details, assigned to the on-call team.\n4. The team investigates, fixes, and closes the work item — linking it to the resolving commit.\n\n**Deployment context in Application Insights**:\nWhen a pipeline deploys, it can annotate Application Insights with a release annotation — a marker on the timeline showing when each deployment occurred. Teams can correlate performance changes with specific deployments visually.\n\n**Pipeline telemetry**:\nAzure DevOps Analytics provides built-in data on pipeline duration trends, failure rates, agent wait times, and test flakiness. Connecting to Power BI enables custom dashboards for engineering leadership.",
          code: {
            lang: "yaml",
            label: "Pipeline step — create Application Insights release annotation",
            snippet: `- task: PowerShell@2
  displayName: 'Create Release Annotation in App Insights'
  inputs:
    targetType: inline
    script: |
      $annotation = @{
        Id = [Guid]::NewGuid().ToString()
        AnnotationName = "Deployment $(Build.BuildNumber)"
        EventTime = [DateTime]::UtcNow.ToString("o")
        Category = "Deployment"
        Properties = '{"ReleaseName":"$(Release.ReleaseName)"}'
      } | ConvertTo-Json

      $uri = "https://aigs.monitor.azure.com/subscriptions/$(subscriptionId)/resourceGroups/$(resourceGroup)/providers/Microsoft.Insights/components/$(appInsightsName)/Annotations"

      Invoke-RestMethod -Uri $uri -Method Post \\
        -Body $annotation -ContentType "application/json" \\
        -Headers @{Authorization = "Bearer $(azureToken)"}`,
          },
        },
        {
          heading: "SLI/SLO Design for Reliability Engineering",
          body: "Service Level Indicators (SLIs) and Service Level Objectives (SLOs) formalize reliability requirements:\n\n**SLI**: A measurable metric that indicates service health:\n- Request success rate: `(successful requests / total requests) * 100`\n- Latency: % of requests completing within a threshold (e.g., `< 200ms`)\n- Availability: % of time the service is responding to health checks\n\n**SLO**: A target value for an SLI:\n- \"99.9% of requests must succeed\" (three 9s = 8.7 hours downtime/year)\n- \"95% of requests must complete in < 200ms\"\n- \"Availability must be >= 99.5%\"\n\n**Error budget**: `100% - SLO = error budget` (e.g., 0.1% for 99.9% SLO)\n- If the error budget is consumed, stop new feature deployments and focus on reliability.\n- If the error budget is healthy, deploy features aggressively.\n\n**Azure Monitor implementation**: Create metric alerts that fire when SLI falls below the SLO threshold. Track error budget burn rate using KQL queries on Application Insights telemetry.",
        },
      ],
      quiz: [
        {
          id: "az400-d5-q1",
          question:
            "A DevOps team wants to measure how quickly they can recover from production incidents. Which DORA metric measures this?",
          options: [
            "A) Deployment Frequency — how often deployments occur.",
            "B) Lead Time for Changes — time from commit to production.",
            "C) Change Failure Rate — % of deployments causing incidents.",
            "D) Mean Time to Recovery (MTTR) — time to restore service after an incident.",
          ],
          correctIndex: 3,
          explanation:
            "Mean Time to Recovery (MTTR) measures the average time from incident detection to service restoration. Improving MTTR requires better monitoring (faster detection), automated rollback, runbook automation, and on-call escalation procedures. Deployment Frequency (A), Lead Time (B), and Change Failure Rate (C) measure different aspects of DevOps performance.",
        },
        {
          id: "az400-d5-q2",
          question:
            "A production alert fires indicating that the error rate exceeded 5%. A DevOps engineer wants this alert to automatically create a Bug work item in Azure DevOps. Which Azure Monitor feature enables this?",
          options: [
            "A) Azure Monitor Workbooks — display the alert in a dashboard.",
            "B) Action group with an Azure DevOps work item action or webhook to the Azure DevOps REST API.",
            "C) Log Analytics saved query — run on a schedule and create work items.",
            "D) Azure Monitor Metrics export to Azure DevOps Analytics.",
          ],
          correctIndex: 1,
          explanation:
            "An Azure Monitor action group can include an 'Azure DevOps' action type that creates a work item directly, or a 'Webhook' action that calls the Azure DevOps REST API to create a Bug. When the alert fires, the action group triggers the work item creation automatically. Workbooks (A) display data, not create work items. Log Analytics queries (C) are run manually or on a schedule but don't natively create DevOps work items. Metrics export (D) sends data to Azure DevOps Analytics for reporting, not work item creation.",
        },
        {
          id: "az400-d5-q3",
          question:
            "A team deploys frequently (10+ times per day) but has a Change Failure Rate of 35%. What is the MOST impactful improvement to reduce the failure rate?",
          options: [
            "A) Deploy less frequently — reduce the chance of introducing failures.",
            "B) Add automated integration and end-to-end tests to the CI pipeline to catch failures before production.",
            "C) Implement blue-green deployments to enable faster rollback.",
            "D) Add more manual approval steps before production deployment.",
          ],
          correctIndex: 1,
          explanation:
            "A high Change Failure Rate indicates that many deployments introduce bugs — the fix is to catch bugs earlier with better automated testing (integration tests, E2E tests, DAST). This directly reduces the probability that a deployment is faulty. Deploying less frequently (A) reduces exposure but doesn't fix the underlying quality issue. Blue-green deployment (C) improves MTTR (faster rollback), not Change Failure Rate. More manual approvals (D) slow deployments without improving code quality.",
        },
        {
          id: "az400-d5-q4",
          question:
            "A KQL query should find all requests to a web application with response times exceeding 2 seconds in the last hour. Which query is correct?",
          options: [
            "A) `requests | where duration > 2000 | where timestamp > ago(1h)`",
            "B) `requests | where responseTime > 2 | where timestamp > now() - 1h`",
            "C) `traces | where duration > 2000ms | top 100`",
            "D) `dependencies | where duration > 2000 | where timestamp > ago(1h)`",
          ],
          correctIndex: 0,
          explanation:
            "The `requests` table in Application Insights stores HTTP requests. The `duration` column is in milliseconds — 2 seconds = 2000ms. `ago(1h)` returns the timestamp 1 hour ago. `responseTime` (B) is not a valid column name in the `requests` table. The `traces` table (C) stores log messages, not HTTP requests. The `dependencies` table (D) stores outgoing dependency calls, not incoming requests.",
        },
        {
          id: "az400-d5-q5",
          question:
            "What is an Application Insights release annotation and how does it help DevOps teams?",
          options: [
            "A) A tag applied to Azure resources during deployment for cost tracking.",
            "B) A marker on the Application Insights timeline indicating when a deployment occurred, allowing teams to correlate performance changes with specific releases.",
            "C) An annotation in the source code that Application Insights uses to instrument methods.",
            "D) A compliance record proving that the application was deployed according to change management procedures.",
          ],
          correctIndex: 1,
          explanation:
            "Release annotations appear as vertical lines on Application Insights charts (request rate, failure rate, response time) marking when each deployment occurred. Teams can visually see if a metric changed immediately after a deployment — correlating production issues with specific releases. This accelerates root cause analysis. They are not cost tags (A), code annotations (C), or compliance records (D).",
        },
        {
          id: "az400-d5-q6",
          question:
            "A company sets an SLO of 99.9% for their API success rate. In a 30-day month, how many minutes of allowable downtime (error budget) does this SLO permit?",
          options: [
            "A) 0 minutes — 99.9% means no errors allowed.",
            "B) Approximately 43.8 minutes.",
            "C) Approximately 7.2 hours.",
            "D) Approximately 4.3 hours.",
          ],
          correctIndex: 1,
          explanation:
            "Error budget = (100% - 99.9%) = 0.1% of 30 days. 30 days × 24 hours × 60 minutes = 43,200 minutes. 0.1% of 43,200 = 43.2 minutes ≈ 43.8 minutes. This is the allowed budget of failed or slow requests before the SLO is violated. 99.9% (three 9s) equates to approximately 43.8 minutes of downtime per month.",
        },
        {
          id: "az400-d5-q7",
          question:
            "A microservices application has three services: API Gateway, Order Service, and Payment Service. Application Insights is configured on all three. A single user request results in calls to all three services. How does Application Insights correlate all telemetry from this request?",
          options: [
            "A) By user account — all telemetry for the same user is grouped.",
            "B) By timestamp — telemetry within the same 1-second window is correlated.",
            "C) By operation ID — a unique ID propagated via W3C Trace Context headers correlates all telemetry across services.",
            "D) By server IP address — all telemetry from the same server is grouped.",
          ],
          correctIndex: 2,
          explanation:
            "Application Insights uses the `operation_Id` (trace ID in W3C Trace Context) to correlate distributed telemetry. When the API Gateway receives a request, it generates an operation ID and includes it in `traceparent` HTTP headers. Order Service and Payment Service read these headers and include the same operation ID in their telemetry. Application Insights groups all telemetry with the same operation ID into a single end-to-end transaction view.",
        },
        {
          id: "az400-d5-q8",
          question:
            "A team uses feature flags to roll out a new checkout flow to 10% of users. They want to measure whether the new flow increases the checkout error rate. Which Application Insights telemetry approach enables this measurement?",
          options: [
            "A) Track server CPU usage — higher CPU indicates the new flow has issues.",
            "B) Track custom events with a property indicating which flow variant the user received, then compare exception rates between variants.",
            "C) Use A/B testing in Application Gateway to split traffic and measure latency.",
            "D) Check the deployment slot health checks for each variant.",
          ],
          correctIndex: 1,
          explanation:
            "Tracking custom events with a `variant` property (e.g., `checkout_started` with `{variant: 'new'}` or `{variant: 'control'}`) and correlating with exceptions allows comparing error rates between the new and control flows. KQL queries can group by variant to compute per-variant error rates. CPU usage (A) is not specific to checkout errors. Application Gateway A/B (C) is a routing mechanism but doesn't provide Application Insights per-variant metrics natively. Deployment slot health (D) is for infrastructure health, not feature-level error rates.",
        },
        {
          id: "az400-d5-q9",
          question:
            "A DevOps team wants to view the trend of Azure Pipelines deployment frequency and average deployment duration over the past 90 days. Which Azure DevOps feature provides this data natively?",
          options: [
            "A) Azure Monitor Metrics — export pipeline run data as metrics.",
            "B) Azure DevOps Analytics service — provides pipeline duration, success rate, and deployment frequency data queryable via OData or displayed in built-in reports.",
            "C) Application Insights — configure the pipeline to send telemetry during each run.",
            "D) Azure Log Analytics — configure pipeline log export to Log Analytics.",
          ],
          correctIndex: 1,
          explanation:
            "Azure DevOps Analytics is a built-in data platform that captures all Azure DevOps activity data including pipeline run duration, success/failure rates, deployment frequency, agent usage, and work item metrics. This data is accessible via OData APIs for Power BI integration or displayed in built-in Analytics reports and dashboards within Azure DevOps. Azure Monitor (A) monitors Azure resources. Application Insights (C) monitors application runtime. Log Analytics (D) can receive Azure DevOps audit logs but not pipeline performance metrics natively.",
        },
        {
          id: "az400-d5-q10",
          question:
            "An application's error budget (based on a 99.9% SLO) has been consumed for the month. According to SRE (Site Reliability Engineering) principles, what should the team do?",
          options: [
            "A) Increase the SLO to 99.5% to give more error budget.",
            "B) Stop deploying new features and focus all engineering effort on reliability improvements until the error budget is restored next month.",
            "C) Request a budget exception from leadership and continue deployments.",
            "D) Deploy new features anyway — the SLO is a target, not a hard limit.",
          ],
          correctIndex: 1,
          explanation:
            "When the error budget is exhausted, SRE principles dictate pausing feature development to focus on reliability. The error budget represents the organization's agreed tolerance for failure — when it's gone, continued deployments risk further reliability degradation. This creates a self-regulating feedback mechanism: poor reliability slows feature development, incentivizing the team to improve stability. Lowering the SLO (A) just moves the threshold. Budget exceptions (C) and treating SLOs as optional (D) undermine the reliability culture.",
        },
        {
          id: "az400-d5-q11",
          question:
            "A KQL query counts the number of failed requests by operation name in the last 24 hours, sorted by failure count descending. Which query is correct?",
          options: [
            "A) `requests | where success == false | where timestamp > ago(24h) | summarize FailureCount=count() by name | order by FailureCount desc`",
            "B) `requests | filter success=false | groupby name | count | sort desc`",
            "C) `SELECT name, COUNT(*) FROM requests WHERE success=0 GROUP BY name ORDER BY 2 DESC`",
            "D) `requests | success == false | summarize count() | order by count desc`",
          ],
          correctIndex: 0,
          explanation:
            "Option A uses correct KQL syntax: `where` to filter, `ago(24h)` for the time filter, `summarize count() by name` to aggregate by operation name, and `order by FailureCount desc` to sort. Option B uses SQL-like syntax (`filter`, `groupby`) that is not valid KQL. Option C is SQL. Option D is missing the `where` keyword before `success == false`.",
        },
        {
          id: "az400-d5-q12",
          question:
            "Which Azure Monitor feature allows a team to see which Azure Pipelines deployment caused a spike in application errors, directly on the Application Insights failure chart?",
          options: [
            "A) Azure Monitor Diagnostic Settings — correlate diagnostic logs with pipeline runs.",
            "B) Application Insights Release Annotations — deployment markers appear on charts.",
            "C) Azure DevOps work item integration — link errors to work items.",
            "D) Azure Monitor Smart Detection — automatically identify deployment-related spikes.",
          ],
          correctIndex: 1,
          explanation:
            "Release annotations appear as vertical markers on Application Insights charts at the exact time of each deployment. When viewing the failure rate chart, the team can see if the error spike coincides with a specific deployment, immediately identifying the causal release. Smart Detection (D) also detects anomalies and can sometimes attribute them to deployments, but release annotations are the specific feature that places deployment markers on charts.",
        },
        {
          id: "az400-d5-q13",
          question:
            "What is the Lead Time for Changes DORA metric measuring?",
          options: [
            "A) The time from a customer reporting a bug to the bug being fixed.",
            "B) The time from a code commit being made to that code running in production.",
            "C) The time required to provision new Azure infrastructure for a deployment.",
            "D) The time from sprint planning to sprint completion.",
          ],
          correctIndex: 1,
          explanation:
            "Lead Time for Changes measures the end-to-end time from a developer committing code to that code being deployed and running in production. It encompasses CI pipeline execution (build, test, scan), deployment pipeline stages, and any approval gates. Reducing lead time means faster value delivery to customers. Bug fix time (A) is related to MTTR. Infrastructure provisioning (C) is part of lead time but not the complete definition. Sprint duration (D) is a project management concept.",
        },
        {
          id: "az400-d5-q14",
          question:
            "A DevOps team wants to identify the most frequently failing Azure Pipelines pipeline stage across all pipelines in the last 30 days. Which Azure DevOps Analytics entity should they query?",
          options: [
            "A) `WorkItems` — query work items tagged with pipeline failures.",
            "B) `PipelineRunActivityResults` — query individual stage/job execution results with pass/fail status.",
            "C) `TestRuns` — query test execution results for all pipeline runs.",
            "D) `BuildTimeline` — query build timeline events from Azure Monitor.",
          ],
          correctIndex: 1,
          explanation:
            "Azure DevOps Analytics exposes pipeline data through OData entities. `PipelineRunActivityResults` (or similar Analytics views) provide data on individual pipeline stage/job results including pass/fail status, duration, and pipeline name — enabling aggregation to find the most frequently failing stages. Work items (A) are for project tracking, not pipeline results. Test runs (C) are test execution data, not pipeline stage execution. `BuildTimeline` (D) is not an Azure Monitor entity.",
        },
        {
          id: "az400-d5-q15",
          question:
            "An organization wants to measure the impact of DevOps improvements over 12 months using DORA metrics. Which tool provides a pre-built DORA metrics dashboard connected to Azure DevOps data?",
          options: [
            "A) Azure Cost Management — track DevOps investment vs. return.",
            "B) Power BI connected to Azure DevOps Analytics — pre-built DORA metrics reports using the Azure DevOps Analytics OData feed.",
            "C) Microsoft 365 admin center — user productivity metrics.",
            "D) Azure Monitor Workbooks — create custom DevOps dashboards.",
          ],
          correctIndex: 1,
          explanation:
            "Microsoft provides a pre-built Power BI template for DORA metrics that connects to the Azure DevOps Analytics OData feed. It calculates Deployment Frequency, Lead Time for Changes, Change Failure Rate, and MTTR from pipeline and work item data. Azure Cost Management (A) tracks financial data. Microsoft 365 admin center (C) tracks collaboration metrics. Azure Monitor Workbooks (D) can be configured for DevOps metrics but require custom KQL development.",
        },
      ],
    },
  ],
};
