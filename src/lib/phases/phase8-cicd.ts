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

// ─── AWS CodePipeline & CodeBuild ────────────────────────────────────────────

export const codePipelineTopic: Topic = {
  id: "codepipeline",
  title: "CodePipeline & CodeBuild — AWS CI/CD",
  level: "Intermediate",
  readTime: "13 min",
  category: "CI/CD",
  summary:
    "AWS CodePipeline orchestrates end-to-end delivery pipelines — source, build, test, deploy — while CodeBuild provides fully managed build environments. Together they form AWS's native CI/CD stack, eliminating the need to run Jenkins or other self-hosted build servers.",
  gcpEquivalent: "Cloud Build",
  azureEquivalent: "Azure DevOps Pipelines",
  sections: [
    {
      heading: "What is CodePipeline?",
      body: "CodePipeline is a fully managed continuous delivery service that models your release process as a series of **stages** and **actions**.\n\n**Core concepts:**\n• **Pipeline** — the top-level resource; defines the full workflow from source to production\n• **Stage** — a logical phase (Source, Build, Test, Deploy, Approval); stages run sequentially\n• **Action** — a task within a stage (pull code, run tests, deploy to ECS); actions within a stage can run in parallel\n• **Artifact** — the output of one action passed as input to the next (zip files stored in a dedicated S3 bucket)\n• **Transition** — the link between stages; can be disabled to pause the pipeline before a stage\n\nA typical pipeline has 3–5 stages: **Source → Build → Test → Approval → Deploy**. Each action has a provider (CodeCommit, CodeBuild, CodeDeploy, S3, Lambda, CloudFormation, ECS, etc.) and runs in the context of an IAM role you define.\n\nCodePipeline itself is an orchestrator — it does not execute builds or tests. It delegates to action providers like CodeBuild for compilation, CodeDeploy for deployment, and Lambda for custom logic.",
    },
    {
      heading: "CodeBuild and buildspec.yml",
      body: "CodeBuild is a fully managed build service that compiles source code, runs tests, and produces deployment artifacts. It scales automatically — each build runs in a fresh, isolated container.\n\n**Key features:**\n• **Managed environments** — curated Docker images for popular runtimes (Node.js, Python, Java, Go, .NET, Ruby)\n• **Custom images** — bring your own Docker image from ECR or Docker Hub for specialised toolchains\n• **Build caching** — cache dependencies in S3 to cut build times by 50–80%\n• **Concurrent builds** — default limit of 60 concurrent builds per account (adjustable via Service Quotas)\n• **VPC access** — run builds inside your VPC to reach private resources (databases, internal APIs)\n\nThe build is defined in a **buildspec.yml** file at the root of your repository. It specifies phases (install, pre_build, build, post_build), environment variables, and output artifacts.",
      code: {
        lang: "yaml",
        label: "buildspec.yml — Node.js application",
        snippet: `version: 0.2

env:
  variables:
    NODE_ENV: production
  parameter-store:
    DB_PASSWORD: /myapp/prod/db-password

phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - npm ci --production=false
  pre_build:
    commands:
      - echo "Running linter and type checks..."
      - npm run lint
      - npx tsc --noEmit
  build:
    commands:
      - echo "Running tests..."
      - npm test -- --coverage
      - echo "Building application..."
      - npm run build
  post_build:
    commands:
      - echo "Build completed on $(date)"

artifacts:
  files:
    - 'dist/**/*'
    - package.json
    - package-lock.json
  base-directory: .

cache:
  paths:
    - 'node_modules/**/*'`,
      },
    },
    {
      heading: "Building a pipeline — Source to Deploy",
      body: "A complete pipeline connects your source repository to your deployment target. The AWS CLI lets you create pipelines programmatically, but for production use, define them in CloudFormation or CDK.\n\nThe example below creates a three-stage pipeline: pull from CodeCommit, build with CodeBuild, deploy to ECS.",
      code: {
        lang: "bash",
        label: "Create a CodePipeline via AWS CLI",
        snippet: `# 1. Create a CodeBuild project
aws codebuild create-project \\
  --name myapp-build \\
  --source type=CODECOMMIT,location=https://git-codecommit.ap-southeast-1.amazonaws.com/v1/repos/myapp \\
  --artifacts type=CODEPIPELINE \\
  --environment type=LINUX_CONTAINER,computeType=BUILD_GENERAL1_MEDIUM,image=aws/codebuild/amazonlinux2-x86_64-standard:5.0 \\
  --service-role arn:aws:iam::123456789012:role/codebuild-role

# 2. Create the pipeline (from JSON definition)
cat > pipeline.json << 'PIPELINE'
{
  "pipeline": {
    "name": "myapp-pipeline",
    "roleArn": "arn:aws:iam::123456789012:role/codepipeline-role",
    "artifactStore": {
      "type": "S3",
      "location": "myapp-pipeline-artifacts"
    },
    "stages": [
      {
        "name": "Source",
        "actions": [{
          "name": "CodeCommit",
          "actionTypeId": {
            "category": "Source",
            "owner": "AWS",
            "provider": "CodeCommit",
            "version": "1"
          },
          "outputArtifacts": [{"name": "SourceOutput"}],
          "configuration": {
            "RepositoryName": "myapp",
            "BranchName": "main"
          }
        }]
      },
      {
        "name": "Build",
        "actions": [{
          "name": "CodeBuild",
          "actionTypeId": {
            "category": "Build",
            "owner": "AWS",
            "provider": "CodeBuild",
            "version": "1"
          },
          "inputArtifacts": [{"name": "SourceOutput"}],
          "outputArtifacts": [{"name": "BuildOutput"}],
          "configuration": {
            "ProjectName": "myapp-build"
          }
        }]
      },
      {
        "name": "Deploy",
        "actions": [{
          "name": "ECS-Deploy",
          "actionTypeId": {
            "category": "Deploy",
            "owner": "AWS",
            "provider": "ECS",
            "version": "1"
          },
          "inputArtifacts": [{"name": "BuildOutput"}],
          "configuration": {
            "ClusterName": "myapp-cluster",
            "ServiceName": "myapp-service"
          }
        }]
      }
    ]
  }
}
PIPELINE

aws codepipeline create-pipeline --cli-input-json file://pipeline.json

# 3. Check pipeline status
aws codepipeline get-pipeline-state --name myapp-pipeline`,
      },
    },
    {
      heading: "CodeDeploy for blue/green deployments",
      body: "CodeDeploy automates application deployments to EC2 instances, ECS services, and Lambda functions. Its most powerful feature is **blue/green deployment** — traffic is shifted from the old version (blue) to the new version (green) with automatic rollback on failure.\n\n**Deployment strategies for ECS:**\n• **AllAtOnce** — shift 100% of traffic immediately (fastest, riskiest)\n• **Linear10PercentEvery1Minute** — shift 10% every minute over 10 minutes\n• **Canary10Percent5Minutes** — shift 10% immediately, wait 5 minutes, then shift remaining 90%\n\n**How blue/green works with ECS:**\n1. CodeDeploy creates a **replacement task set** (green) alongside the original (blue)\n2. Traffic is routed to the green task set via the ALB target group\n3. CodeDeploy runs **lifecycle hooks** (BeforeAllowTraffic, AfterAllowTraffic) — use these to run integration tests\n4. If the health check passes, the blue task set is terminated\n5. If any alarm triggers during the shift, CodeDeploy **automatically rolls back** to the blue task set\n\n**Rollback triggers:**\n• CloudWatch alarms (5xx rate, latency, error count)\n• Failed lifecycle hook Lambda functions\n• Manual rollback via console or CLI",
      code: {
        lang: "bash",
        label: "Create a blue/green deployment group",
        snippet: `# Create a CodeDeploy application for ECS
aws deploy create-application \\
  --application-name myapp \\
  --compute-platform ECS

# Create a deployment group with blue/green config
aws deploy create-deployment-group \\
  --application-name myapp \\
  --deployment-group-name myapp-prod \\
  --service-role-arn arn:aws:iam::123456789012:role/codedeploy-role \\
  --deployment-config-name CodeDeployDefault.ECSCanary10Percent5Minutes \\
  --ecs-services clusterName=myapp-cluster,serviceName=myapp-service \\
  --load-balancer-info targetGroupPairInfoList=[{targetGroups=[{name=blue-tg},{name=green-tg}],prodTrafficRoute={listenerArns=[arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:listener/app/myapp-alb/abc123/def456]}}] \\
  --auto-rollback-configuration enabled=true,events=DEPLOYMENT_FAILURE \\
  --blue-green-deployment-configuration "terminateBlueInstancesOnDeploymentSuccess={action=TERMINATE,terminationWaitTimeInMinutes=5},deploymentReadyOption={actionOnTimeout=CONTINUE_DEPLOYMENT}"

# Trigger a deployment
aws deploy create-deployment \\
  --application-name myapp \\
  --deployment-group-name myapp-prod \\
  --revision revisionType=AppSpecContent,appSpecContent='{content: "..."}'`,
      },
    },
  ],
};

// ─── GCP Cloud Build ─────────────────────────────────────────────────────────

export const cloudBuildTopic: Topic = {
  id: "cloud-build",
  title: "Cloud Build — Serverless CI/CD",
  level: "Intermediate",
  readTime: "11 min",
  category: "CI/CD",
  summary:
    "Cloud Build is GCP's fully managed, serverless CI/CD platform. Define your pipeline in a cloudbuild.yaml file, connect it to a repository trigger, and Cloud Build handles the rest — no servers, no Jenkins, no maintenance.",
  awsEquivalent: "CodePipeline + CodeBuild",
  azureEquivalent: "Azure DevOps Pipelines",
  sections: [
    {
      heading: "What is Cloud Build?",
      body: "Cloud Build executes your builds as a series of **steps**, each running in a Docker container. It is fully serverless — you pay only for the build minutes consumed, with no idle infrastructure.\n\n**Key features:**\n• **Build steps** — each step is a Docker container that runs a single command; steps execute sequentially by default or in parallel via `waitFor`\n• **Builder images** — Google provides curated images for common tools (gcloud, docker, npm, go, maven, gradle); you can use any public or private Docker image\n• **Substitutions** — built-in variables like `$PROJECT_ID`, `$COMMIT_SHA`, `$BRANCH_NAME`, and custom substitutions for parameterised builds\n• **Artifacts** — upload build outputs to Cloud Storage or Artifact Registry automatically\n• **Private pools** — run builds inside your VPC for access to private resources (Cloud SQL, Memorystore, internal APIs)\n• **Build approval** — gate deployments behind a manual approval step for production releases\n\n**Pricing tiers:**\n• Free tier: 120 build-minutes/day on e2-medium machines\n• Beyond free tier: ~$0.003/build-minute (e2-medium) to ~$0.064/build-minute (e2-highcpu-32)\n• Private pools incur additional per-minute charges",
    },
    {
      heading: "cloudbuild.yaml structure",
      body: "The `cloudbuild.yaml` file defines your entire pipeline. Each `step` specifies a builder image and the command to run. Steps share a `/workspace` volume that persists across the build.",
      code: {
        lang: "yaml",
        label: "cloudbuild.yaml — Node.js app with tests and Docker push",
        snippet: `steps:
  # Step 1: Install dependencies
  - name: 'node:20'
    entrypoint: 'npm'
    args: ['ci']

  # Step 2: Run linter
  - name: 'node:20'
    entrypoint: 'npm'
    args: ['run', 'lint']

  # Step 3: Run tests
  - name: 'node:20'
    entrypoint: 'npm'
    args: ['test', '--', '--coverage']

  # Step 4: Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - '\${_REGION}-docker.pkg.dev/$PROJECT_ID/\${_REPO}/myapp:$COMMIT_SHA'
      - '-t'
      - '\${_REGION}-docker.pkg.dev/$PROJECT_ID/\${_REPO}/myapp:latest'
      - '.'

  # Step 5: Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '--all-tags'
      - '\${_REGION}-docker.pkg.dev/$PROJECT_ID/\${_REPO}/myapp'

substitutions:
  _REGION: asia-southeast1
  _REPO: docker-repo

options:
  logging: CLOUD_LOGGING_ONLY
  machineType: E2_HIGHCPU_8

timeout: '1200s'`,
      },
    },
    {
      heading: "Build triggers — GitHub and Cloud Source Repos",
      body: "Build triggers automatically start a build when code changes land in your repository. Cloud Build supports GitHub, GitHub Enterprise, GitLab, Bitbucket, and Cloud Source Repositories.\n\n**Trigger types:**\n• **Push to branch** — build on every push to a matching branch pattern (e.g., `^main$`, `^release-.*`)\n• **Push new tag** — build when a Git tag matching a pattern is pushed (e.g., `^v\\d+\\.\\d+\\.\\d+$`)\n• **Pull request** — build on PR creation or update; post build status back to the PR\n• **Manual invocation** — trigger via gcloud CLI, API, or console\n• **Pub/Sub** — trigger from a Pub/Sub message for event-driven pipelines\n\n**Trigger filters** let you skip builds when only certain files change (e.g., skip CI when only docs change).",
      code: {
        lang: "bash",
        label: "Create build triggers with gcloud",
        snippet: `# Connect a GitHub repository (interactive, run once)
gcloud builds repositories create my-github-connection \\
  --remote-uri=https://github.com/myorg/myapp.git \\
  --region=asia-southeast1

# Create a trigger for pushes to main
gcloud builds triggers create github \\
  --name=deploy-main \\
  --repository=projects/my-project/locations/asia-southeast1/connections/my-github-connection/repositories/myapp \\
  --branch-pattern='^main$' \\
  --build-config=cloudbuild.yaml \\
  --region=asia-southeast1

# Create a trigger for version tags
gcloud builds triggers create github \\
  --name=release-tag \\
  --repository=projects/my-project/locations/asia-southeast1/connections/my-github-connection/repositories/myapp \\
  --tag-pattern='^v[0-9]+\\.[0-9]+\\.[0-9]+$' \\
  --build-config=cloudbuild-release.yaml \\
  --region=asia-southeast1

# List triggers
gcloud builds triggers list --region=asia-southeast1

# Manually run a trigger
gcloud builds triggers run deploy-main \\
  --branch=main \\
  --region=asia-southeast1`,
      },
    },
    {
      heading: "Deploy to Cloud Run and GKE",
      body: "Cloud Build integrates directly with Cloud Run and GKE for deployment. The `gcloud` builder image provides CLI access to deploy services in a single step.\n\n**Cloud Run deployment** is the simplest path — build the image, push it, and deploy in one pipeline. For GKE, use `kubectl` or the `gke-deploy` builder to apply Kubernetes manifests.",
      code: {
        lang: "yaml",
        label: "cloudbuild.yaml — Deploy to Cloud Run",
        snippet: `steps:
  # Build and push the container image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'asia-southeast1-docker.pkg.dev/$PROJECT_ID/docker-repo/myapp:$COMMIT_SHA'
      - '.'

  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'asia-southeast1-docker.pkg.dev/$PROJECT_ID/docker-repo/myapp:$COMMIT_SHA'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'myapp'
      - '--image=asia-southeast1-docker.pkg.dev/$PROJECT_ID/docker-repo/myapp:$COMMIT_SHA'
      - '--region=asia-southeast1'
      - '--platform=managed'
      - '--allow-unauthenticated'
      - '--memory=512Mi'
      - '--cpu=1'
      - '--min-instances=1'
      - '--max-instances=10'

  # Deploy to GKE (alternative)
  # - name: 'gcr.io/cloud-builders/kubectl'
  #   args: ['apply', '-f', 'k8s/']
  #   env:
  #     - 'CLOUDSDK_COMPUTE_REGION=asia-southeast1'
  #     - 'CLOUDSDK_CONTAINER_CLUSTER=my-gke-cluster'

images:
  - 'asia-southeast1-docker.pkg.dev/$PROJECT_ID/docker-repo/myapp:$COMMIT_SHA'`,
      },
    },
  ],
};

// ─── Azure DevOps Pipelines ──────────────────────────────────────────────────

export const azureDevOpsTopic: Topic = {
  id: "azure-devops",
  title: "Azure Pipelines — Enterprise CI/CD",
  level: "Intermediate",
  readTime: "12 min",
  category: "CI/CD",
  summary:
    "Azure Pipelines is Microsoft's enterprise-grade CI/CD service — part of Azure DevOps. Define your pipeline in YAML, use multi-stage pipelines for complex workflows, and gate production deployments with environments and approvals.",
  awsEquivalent: "CodePipeline + CodeBuild",
  gcpEquivalent: "Cloud Build",
  sections: [
    {
      heading: "What is Azure Pipelines?",
      body: "Azure Pipelines is a cloud-hosted CI/CD service that builds, tests, and deploys code from any Git repository — Azure Repos, GitHub, GitLab, or Bitbucket.\n\n**Core concepts:**\n• **Pipeline** — the top-level YAML definition that describes your entire CI/CD workflow\n• **Stage** — a logical division of your pipeline (Build, Test, Deploy-Staging, Deploy-Production); stages run sequentially by default or in parallel with `dependsOn`\n• **Job** — a unit of work within a stage; runs on a single agent. Jobs within a stage can run in parallel\n• **Step** — a single task or script within a job (run a command, invoke a built-in task, call a marketplace extension)\n• **Agent pool** — a group of machines that run your jobs; use Microsoft-hosted agents (zero maintenance) or self-hosted agents (full control)\n• **Environment** — a named deployment target (staging, production) with **approval gates**, **deployment history**, and **Kubernetes/VM resource tracking**\n\n**Microsoft-hosted agents** support Ubuntu, macOS, and Windows — each job gets a fresh VM with common tools pre-installed (Node.js, Python, Java, .NET, Docker, kubectl, Helm, Terraform).\n\n**Free tier:** 1 Microsoft-hosted parallel job with 1,800 minutes/month for public repos; 1 parallel job with 1,800 minutes/month for private repos.",
    },
    {
      heading: "azure-pipelines.yml structure",
      body: "The pipeline YAML file lives at the root of your repository. It defines triggers, stages, jobs, and steps. Azure Pipelines supports **template expressions**, **variable groups**, and **conditional insertion** for advanced scenarios.",
      code: {
        lang: "yaml",
        label: "azure-pipelines.yml — Node.js build and test",
        snippet: `trigger:
  branches:
    include:
      - main
      - release/*
  paths:
    exclude:
      - '**/*.md'
      - docs/

pr:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '20.x'
  npmCacheFolder: $(Pipeline.Workspace)/.npm

stages:
  - stage: Build
    displayName: 'Build & Test'
    jobs:
      - job: BuildJob
        displayName: 'Build, Lint, Test'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)
            displayName: 'Install Node.js'

          - task: Cache@2
            inputs:
              key: 'npm | "$(Agent.OS)" | package-lock.json'
              path: $(npmCacheFolder)
            displayName: 'Cache npm packages'

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npm run lint
            displayName: 'Run linter'

          - script: npm test -- --coverage
            displayName: 'Run tests'

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/junit.xml'
            condition: succeededOrFailed()

          - task: PublishCodeCoverageResults@2
            inputs:
              summaryFileLocation: 'coverage/cobertura-coverage.xml'

          - script: npm run build
            displayName: 'Build application'

          - publish: $(System.DefaultWorkingDirectory)/dist
            artifact: app-dist
            displayName: 'Publish build artifact'`,
      },
    },
    {
      heading: "Multi-stage pipelines",
      body: "Multi-stage pipelines model your entire release workflow in a single YAML file — from build through staging to production. Each stage can target a different **environment** with its own approval rules.\n\n**Stage dependencies:**\n• By default, stages run sequentially in the order defined\n• Use `dependsOn` to create parallel stages or complex DAGs\n• Use `condition` to skip stages based on branch, variable, or previous stage outcome\n\n**Deployment jobs** are a special job type that records deployment history against an environment and supports deployment strategies (runOnce, rolling, canary).",
      code: {
        lang: "yaml",
        label: "Multi-stage pipeline — Build → Staging → Production",
        snippet: `stages:
  - stage: Build
    displayName: 'Build & Test'
    jobs:
      - job: BuildJob
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - script: npm ci && npm test && npm run build
            displayName: 'Install, Test, Build'
          - publish: dist
            artifact: app

  - stage: DeployStaging
    displayName: 'Deploy to Staging'
    dependsOn: Build
    jobs:
      - deployment: DeployStaging
        environment: staging
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: app
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'my-azure-connection'
                    appName: 'myapp-staging'
                    package: '$(Pipeline.Workspace)/app'

  - stage: DeployProduction
    displayName: 'Deploy to Production'
    dependsOn: DeployStaging
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployProduction
        environment: production
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: app
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'my-azure-connection'
                    appName: 'myapp-prod'
                    package: '$(Pipeline.Workspace)/app'`,
      },
    },
    {
      heading: "Environments and approvals",
      body: "Environments are the cornerstone of Azure Pipelines' deployment governance. They provide **manual approvals**, **deployment gates**, **exclusive locks**, and **audit history**.\n\n**Setting up approvals:**\n1. Create an environment in Azure DevOps (Pipelines → Environments → New)\n2. Add **approvers** — one or more users or groups who must approve before the stage runs\n3. Configure **gates** — automated checks that must pass (Azure Monitor alerts, REST API health checks, work item queries)\n4. Set a **timeout** — how long the pipeline waits for approval before failing\n\n**Deployment strategies for Kubernetes environments:**\n• **runOnce** — deploy to all pods at once\n• **rolling** — update pods in batches with configurable `maxUnavailable`\n• **canary** — deploy to a percentage of pods, validate, then promote to full rollout\n\nEnvironments also track deployment history — you can see which commits are currently deployed to staging vs production, who approved each deployment, and roll back to a previous deployment.",
      code: {
        lang: "bash",
        label: "Manage environments and approvals via az CLI",
        snippet: `# Install the Azure DevOps CLI extension
az extension add --name azure-devops

# Configure defaults
az devops configure --defaults organization=https://dev.azure.com/myorg project=myproject

# Create a new pipeline from YAML
az pipelines create \\
  --name 'myapp-pipeline' \\
  --repository myapp \\
  --branch main \\
  --yml-path azure-pipelines.yml \\
  --repository-type tfsgit

# List pipeline runs
az pipelines run list --pipeline-name 'myapp-pipeline' --top 5

# Trigger a pipeline run manually
az pipelines run --name 'myapp-pipeline' --branch main

# Show pipeline run details
az pipelines run show --id 42

# List environments
az devops invoke \\
  --area distributedtask \\
  --resource environments \\
  --route-parameters project=myproject \\
  --api-version 7.1

# Approve a pending deployment (via REST API)
# Approvals are managed through the Azure DevOps UI or REST API:
# PATCH https://dev.azure.com/{org}/{project}/_apis/pipelines/approvals/{approvalId}
# Body: { "status": "approved", "comment": "Staging tests passed" }`,
      },
    },
  ],
};
