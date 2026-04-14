import type { Certification } from "./types";

export const awsDopC02: Certification = {
  id: "aws-dop-c02",
  title: "AWS DevOps Engineer Professional",
  code: "DOP-C02",
  cloud: "aws",
  level: "Professional",
  description:
    "Demonstrate proficiency in provisioning, operating, and managing distributed systems on AWS. Covers CI/CD, IaC, monitoring, security, and incident response.",
  examFormat: {
    questions: 75,
    duration: "180 minutes",
    passingScore: "750/1000",
    cost: "$300 USD",
  },
  domains: [
    // ─── Domain 1: SDLC Automation (22%) ───────────────
    {
      id: "domain-1",
      title: "SDLC Automation",
      weight: "22%",
      order: 1,
      summary:
        "The heaviest domain tests your ability to design and implement end-to-end CI/CD pipelines on AWS. Topics include CodePipeline orchestration, CodeBuild build environments, CodeDeploy deployment strategies, and advanced deployment patterns such as blue/green, canary, and linear.\n\nScenario-based questions present complex pipeline failures, deployment rollback requirements, and multi-account/multi-region pipeline architectures. You must understand when to use each CodeDeploy deployment type and how to integrate testing stages into pipelines.",
      keyConceptsForExam: [
        "**CodePipeline** — stages, actions, artifacts, cross-account pipelines, approval actions, parallel execution",
        "**CodeBuild** — buildspec.yml, environment variables, build caching (S3/local), VPC integration, privileged mode for Docker",
        "**CodeDeploy** — EC2/on-premises (in-place, blue/green), ECS (blue/green with ALB), Lambda (canary, linear, all-at-once), AppSpec file",
        "**Deployment strategies** — canary (small % first), linear (equal increments), all-at-once, blue/green traffic shifting",
        "**Pipeline triggers** — CodeCommit events, S3 object changes, EventBridge rules, webhook for GitHub/Bitbucket",
      ],
      examTips: [
        "CodeDeploy blue/green for ECS deploys a new task set, then shifts traffic via ALB weighted target groups — the appspec.yml defines lifecycle hooks.",
        "For zero-downtime Lambda deployments, CodeDeploy canary shifts a percentage of traffic to the new version first, then shifts the rest after a wait period.",
        "Cross-account CodePipeline uses IAM roles — the pipeline assumes a role in the target account; KMS keys must be shared for artifact decryption.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 — Elastic Compute Cloud" },
        { cloud: "aws", topicId: "iam-deep-dive", title: "IAM Deep Dive" },
      ],
      sections: [
        {
          heading: "CodePipeline Architecture and Cross-Account Deployments",
          body: "A CodePipeline consists of **stages** (Source, Build, Test, Deploy, Approval) and **actions** within each stage. Artifacts pass between stages via an S3 bucket. For cross-account pipelines, the pipeline assumes an IAM role in the target account and decrypts artifacts using a shared KMS CMK.\n\nCodePipeline integrates natively with CodeCommit, GitHub, Bitbucket, and S3 as sources. EventBridge rules provide event-driven triggers. **Manual approval actions** pause the pipeline and send an SNS notification — useful for promoting to production after QA sign-off.",
          code: {
            lang: "yaml",
            label: "CodeBuild buildspec.yml example",
            snippet: `version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 18
  pre_build:
    commands:
      - npm ci
  build:
    commands:
      - npm run test
      - npm run build
  post_build:
    commands:
      - echo "Build completed"
artifacts:
  files:
    - '**/*'
  base-directory: dist
cache:
  paths:
    - node_modules/**/*`,
          },
        },
        {
          heading: "CodeDeploy Deployment Strategies",
          body: "**EC2/on-premises deployments**: In-place updates running instances; blue/green launches a replacement fleet, shifts traffic, then terminates the original.\n\n**ECS deployments**: Blue/green only. A new task set is created alongside the existing one. Traffic shifts from the old task set to the new one via ALB weighted target groups, controlled by CodeDeploy's canary, linear, or all-at-once configuration.\n\n**Lambda deployments**: CodeDeploy aliases shift traffic between function versions. Canary10Percent5Minutes shifts 10% immediately, then 90% after 5 minutes if no alarms trigger. Pre/post traffic hooks execute validation Lambda functions during the shift.",
        },
      ],
      quiz: [
        {
          id: "dop-d1-q1",
          question:
            "A CodeDeploy blue/green deployment to an ECS service fails. The new task set is unhealthy and traffic must be immediately reverted. What happens automatically?",
          options: [
            "A) CodeDeploy terminates the new task set and the original task set continues serving traffic.",
            "B) CodeDeploy shifts all traffic back to the original task set and marks the deployment as failed.",
            "C) The ALB detects the unhealthy targets and stops routing traffic to the new task set.",
            "D) An EventBridge event triggers a Lambda function to update the ALB listener.",
          ],
          correctIndex: 1,
          explanation:
            "When a CodeDeploy ECS blue/green deployment fails (either due to health check failures or exceeding the deployment timeout), CodeDeploy automatically shifts all traffic back to the original (blue) task set and marks the deployment as failed. The original task set is preserved during the deployment precisely for this rollback capability.",
        },
        {
          id: "dop-d1-q2",
          question:
            "A team needs a CodePipeline that deploys to a production account from a tools account. The pipeline artifact bucket is in the tools account. What is required for the deployment to succeed?",
          options: [
            "A) Copy the artifact bucket to the production account before deploying.",
            "B) Create a cross-account IAM role in the production account trusted by the pipeline, and share the KMS key used to encrypt pipeline artifacts.",
            "C) Deploy CodePipeline in both accounts and synchronize them.",
            "D) Use S3 Cross-Region Replication to sync artifacts.",
          ],
          correctIndex: 1,
          explanation:
            "Cross-account CodePipeline requires: (1) an IAM role in the target account with a trust policy allowing the pipeline role to assume it, (2) the S3 artifact bucket policy allowing access from the target account, and (3) the KMS key policy allowing the target account to decrypt artifacts. This tri-part configuration is the standard cross-account pipeline pattern.",
        },
        {
          id: "dop-d1-q3",
          question:
            "A Lambda function must be deployed with canary traffic shifting — 10% of traffic goes to the new version for 10 minutes before full cutover. A CloudWatch alarm must halt the deployment if error rate exceeds 1%. What CodeDeploy configuration achieves this?",
          options: [
            "A) Deployment config: CodeDeployDefault.LambdaCanary10Percent10Minutes with a CloudWatch alarm on the deployment group.",
            "B) Deployment config: CodeDeployDefault.LambdaLinear10PercentEvery1Minute with a manual approval step.",
            "C) Deployment config: CodeDeployDefault.LambdaAllAtOnce with pre-traffic hooks.",
            "D) Use Lambda weighted aliases directly without CodeDeploy.",
          ],
          correctIndex: 0,
          explanation:
            "CodeDeployDefault.LambdaCanary10Percent10Minutes shifts 10% of traffic immediately and the remaining 90% after 10 minutes. Adding a CloudWatch alarm to the deployment group causes CodeDeploy to automatically roll back if the alarm triggers during the traffic-shifting window. This is the purpose-built canary deployment pattern for Lambda.",
        },
        {
          id: "dop-d1-q4",
          question:
            "A CodeBuild project needs to build a Docker image and push it to ECR. The build fails with 'Cannot connect to the Docker daemon.' What is the MOST likely cause?",
          options: [
            "A) The CodeBuild service role lacks ECR permissions.",
            "B) Privileged mode is not enabled on the CodeBuild project.",
            "C) The VPC configuration is blocking Docker traffic.",
            "D) The base image is not available in the specified region.",
          ],
          correctIndex: 1,
          explanation:
            "Running Docker commands inside CodeBuild requires the build environment to have elevated permissions. Privileged mode must be enabled on the CodeBuild project to allow Docker daemon access. Without it, `docker build` commands fail with daemon connectivity errors. ECR permissions (A) would cause a push failure, not a daemon error.",
        },
        {
          id: "dop-d1-q5",
          question:
            "A CodePipeline must be triggered whenever a specific file pattern changes in an S3 bucket used as the source. What is the recommended approach?",
          options: [
            "A) Configure the pipeline source to poll S3 every minute.",
            "B) Enable S3 event notifications that trigger an EventBridge rule, which starts the pipeline.",
            "C) Use a Lambda function on a CloudWatch Events schedule to check for changes.",
            "D) Configure CloudTrail to monitor S3 PutObject events and alert the pipeline.",
          ],
          correctIndex: 1,
          explanation:
            "S3 event notifications publish to EventBridge, which can trigger a CodePipeline execution directly. This provides event-driven, low-latency pipeline triggering. AWS recommends EventBridge over S3 polling for CodePipeline source actions. Polling (A) is the older detection mode, which introduces latency and is being deprecated in favor of EventBridge.",
        },
        {
          id: "dop-d1-q6",
          question:
            "A deployment requires running database migrations before updating application servers. How should this be implemented in CodeDeploy for EC2?",
          options: [
            "A) Add a CodeBuild stage before the CodeDeploy stage in CodePipeline.",
            "B) Use the BeforeInstall lifecycle event hook in the AppSpec file to run migrations.",
            "C) Use the ApplicationStart lifecycle event hook to run migrations after the application starts.",
            "D) Run migrations as a separate CodePipeline stage after deployment.",
          ],
          correctIndex: 1,
          explanation:
            "The CodeDeploy AppSpec file defines lifecycle event hooks that execute scripts at specific points during deployment. BeforeInstall runs before the new application files are installed, making it appropriate for pre-deployment tasks like database migrations. ApplicationStart (C) runs after the application starts, which would be too late for migrations that must precede the new code version.",
        },
        {
          id: "dop-d1-q7",
          question:
            "A team wants to enforce that every PR to the main branch in CodeCommit passes unit tests before merging. What is the BEST approach?",
          options: [
            "A) Create a CodePipeline that runs tests on push to main.",
            "B) Configure an EventBridge rule on CodeCommit PR events to trigger CodeBuild, and use an approval rule template requiring passing builds.",
            "C) Use AWS Lambda to run tests on every commit.",
            "D) Configure CodeDeploy to run tests as a pre-deployment hook.",
          ],
          correctIndex: 1,
          explanation:
            "CodeCommit approval rule templates require pull requests to meet defined conditions before merging. Combining this with an EventBridge rule that triggers CodeBuild on PR events creates automated test gating. The build status (success/failure) can be published back to CodeCommit to block or allow the merge. This is the native CodeCommit PR workflow.",
        },
        {
          id: "dop-d1-q8",
          question:
            "A CodeBuild project consistently has long build times due to downloading the same npm packages. What is the MOST effective optimization?",
          options: [
            "A) Increase the CodeBuild instance size.",
            "B) Enable S3 caching in CodeBuild to cache the node_modules directory.",
            "C) Use a custom Docker image with pre-installed packages as the build environment.",
            "D) Store packages in an S3 bucket and download them at build start.",
          ],
          correctIndex: 1,
          explanation:
            "CodeBuild S3 caching saves specified directories (like node_modules) to S3 after the build and restores them at the start of the next build, avoiding redundant downloads. Both B and C are effective, but S3 caching (B) is simpler to maintain — you don't need to rebuild a custom image whenever dependencies change. Custom images (C) also work but require more management.",
        },
        {
          id: "dop-d1-q9",
          question:
            "A CodePipeline includes a manual approval action before production deployment. The approval notification must include a summary of changes in the release. What is the BEST approach?",
          options: [
            "A) The approval email automatically includes CodeCommit commit messages.",
            "B) Use a Lambda function in a prior pipeline stage to generate a summary and include a custom URL in the approval action.",
            "C) Configure CodeCommit to send change summaries to SNS.",
            "D) Include the change summary as a static message in the pipeline approval action.",
          ],
          correctIndex: 1,
          explanation:
            "The CodePipeline approval action supports a custom external approval URL and custom message. A Lambda stage can fetch commit messages, run diff analysis, and store a generated summary (e.g., in S3), then pass the URL to the approval action so approvers see the relevant changes. Static messages (D) are possible but don't include dynamic change information.",
        },
        {
          id: "dop-d1-q10",
          question:
            "Which AWS service provides native integration with AWS CodeDeploy for blue/green deployments of containerized applications using Amazon ECS?",
          options: [
            "A) Amazon ECR",
            "B) Application Load Balancer with weighted target groups",
            "C) AWS App Mesh",
            "D) Amazon ECS service auto scaling",
          ],
          correctIndex: 1,
          explanation:
            "CodeDeploy blue/green deployments for ECS work by creating a replacement task set and shifting traffic using ALB weighted target groups. The ALB routes production traffic to the blue task set during deployment, then progressively shifts to the green task set. After a validation period, the original task set is terminated. This is the foundational mechanism for ECS blue/green deployments.",
        },
      ],
    },

    // ─── Domain 2: Configuration Management and IaC (17%) ───────────────
    {
      id: "domain-2",
      title: "Configuration Management and IaC",
      weight: "17%",
      order: 2,
      summary:
        "This domain covers infrastructure as code with AWS CloudFormation and AWS CDK, along with configuration management using Systems Manager and OpsWorks. You must understand how to design reusable, modular IaC patterns and manage configuration drift.\n\nScenario questions often involve choosing between CloudFormation StackSets, CDK, and Terraform, or troubleshooting complex CloudFormation scenarios like circular dependencies, custom resources, and macro processing.",
      keyConceptsForExam: [
        "**CloudFormation advanced features** — custom resources (Lambda-backed), macros, dynamic references (SSM, Secrets Manager), StackSets",
        "**AWS CDK** — constructs (L1/L2/L3), stacks, apps, CDK pipelines, asset bundling, cdk diff/deploy",
        "**Systems Manager State Manager** — association documents, compliance baseline, scheduled configuration enforcement",
        "**CloudFormation Guard (cfn-guard)** — policy-as-code validation of CloudFormation templates before deployment",
        "**Drift detection** — stack-level and resource-level drift, remediation strategies, import existing resources",
      ],
      examTips: [
        "CloudFormation custom resources using Lambda allow you to provision anything not natively supported — know the request/response lifecycle.",
        "CDK constructs at L2 level provide sensible defaults and best practices; L1 constructs are 1:1 mappings to CloudFormation resources.",
        "CloudFormation macros process templates before deployment using Lambda — use them to create template transformations and domain-specific languages.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "iam-deep-dive", title: "IAM Deep Dive" },
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 — Elastic Compute Cloud" },
      ],
      sections: [
        {
          heading: "Advanced CloudFormation Patterns",
          body: "**Custom resources** use Lambda to extend CloudFormation with non-native resource types. The Lambda function receives a CloudFormation event (Create/Update/Delete) and must respond with a success or failure signal to a presigned S3 URL.\n\n**CloudFormation macros** are Lambda-backed transforms that process template snippets. The built-in `AWS::Include` transform inserts template snippets from S3. `AWS::Serverless` (SAM) is a macro that expands serverless resources.\n\n**Dynamic references** resolve values at deployment time: `{{resolve:ssm:/path/to/param}}` retrieves from Parameter Store; `{{resolve:secretsmanager:secret-id:SecretString:key}}` retrieves from Secrets Manager — avoiding hardcoded values in templates.",
          code: {
            lang: "yaml",
            label: "CloudFormation custom resource with Lambda",
            snippet: `Resources:
  CustomResourceFunction:
    Type: AWS::Lambda::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs18.x
      Role: !GetAtt LambdaRole.Arn

  MyCustomResource:
    Type: Custom::MyResource
    Properties:
      ServiceToken: !GetAtt CustomResourceFunction.Arn
      BucketName: !Ref MyBucket
      ConfigValue: !Sub "{{resolve:ssm:/my/param}}"`,
          },
        },
        {
          heading: "AWS CDK and Configuration Enforcement",
          body: "AWS CDK generates CloudFormation templates from code. **L2 constructs** (e.g., `aws-cdk-lib/aws-s3.Bucket`) provide defaults and helper methods. **L3 constructs** (patterns) combine multiple L2 constructs into higher-level architectures (e.g., `ApplicationLoadBalancedFargateService`).\n\n**CDK Pipelines** construct creates a self-mutating CodePipeline that deploys CDK applications. It handles bootstrapping, synthesis, and multi-account/multi-region deployments automatically.\n\n**Systems Manager State Manager** enforces desired configuration states using association documents. It runs on a schedule and reports compliance, automatically re-applying configurations that have drifted from the desired state.",
        },
      ],
      quiz: [
        {
          id: "dop-d2-q1",
          question:
            "A CloudFormation template must provision an external DNS record in a third-party DNS provider during stack creation. What is the BEST approach?",
          options: [
            "A) Use AWS::Route53::RecordSet to create the DNS record.",
            "B) Create a CloudFormation custom resource backed by a Lambda function that calls the DNS provider's API.",
            "C) Use a CloudFormation macro to inject the DNS record.",
            "D) Use Systems Manager Automation to create the DNS record after stack deployment.",
          ],
          correctIndex: 1,
          explanation:
            "CloudFormation custom resources allow you to provision any resource that CloudFormation doesn't natively support. A Lambda-backed custom resource can call the third-party DNS API during stack Create/Update/Delete operations and report success/failure back to CloudFormation. Route53 (A) only manages Route 53, not third-party providers.",
        },
        {
          id: "dop-d2-q2",
          question:
            "An organization wants to enforce that all CloudFormation templates used in production do not create security groups allowing `0.0.0.0/0` on port 22. What is the BEST pre-deployment control?",
          options: [
            "A) AWS Config rule `restricted-ssh` with auto-remediation.",
            "B) CloudFormation Guard (cfn-guard) rules in the CI/CD pipeline to validate templates before deployment.",
            "C) SCP denying ec2:AuthorizeSecurityGroupIngress for all accounts.",
            "D) CloudFormation stack policies preventing security group updates.",
          ],
          correctIndex: 1,
          explanation:
            "CloudFormation Guard is a policy-as-code tool that validates CloudFormation templates against defined rules before deployment. Integrating cfn-guard into the CI/CD pipeline prevents non-compliant templates from reaching deployment. This is a shift-left approach — preventing misconfigurations before they're deployed. AWS Config (A) is detective and post-deployment.",
        },
        {
          id: "dop-d2-q3",
          question:
            "An AWS CDK application synthesizes a CloudFormation template with an asset (Lambda function code). The asset hash changes on every synthesis even though the code hasn't changed. What is the MOST likely cause?",
          options: [
            "A) The CDK version has a bug.",
            "B) Non-deterministic build output — timestamps or random values embedded during build.",
            "C) The S3 bucket for assets is not configured correctly.",
            "D) The Lambda runtime version is unsupported.",
          ],
          correctIndex: 1,
          explanation:
            "CDK asset hashes are calculated from the content of the asset directory. If build tools embed timestamps, random values, or environment-specific paths in the output, the hash changes on every synthesis. Ensuring deterministic builds (same input → same output) resolves this. This is a common problem with compiled languages or bundled JavaScript.",
        },
        {
          id: "dop-d2-q4",
          question:
            "A CloudFormation StackSet deployment fails for 3 out of 20 target accounts. The default failure tolerance is 0. What happens to the other 17 successfully deployed accounts?",
          options: [
            "A) CloudFormation rolls back all 20 accounts.",
            "B) CloudFormation keeps the 17 successful deployments and reports failure for the 3 accounts.",
            "C) CloudFormation pauses and waits for manual intervention.",
            "D) CloudFormation retries the 3 failed accounts automatically.",
          ],
          correctIndex: 1,
          explanation:
            "CloudFormation StackSets do not automatically roll back successfully deployed stacks when other accounts fail. The failure tolerance setting determines how many accounts can fail before the entire operation fails, but successful account stacks remain deployed. You must manually roll back or remediate the failed accounts. Set failure tolerance > 0 to allow partial failures.",
        },
        {
          id: "dop-d2-q5",
          question:
            "A DevOps team wants to use CloudFormation dynamic references to securely inject a database password into an RDS resource without hardcoding it in the template. Which reference type should they use?",
          options: [
            "A) `{{resolve:ssm:/db/password}}` with a String parameter type.",
            "B) `{{resolve:ssm-secure:/db/password}}` or `{{resolve:secretsmanager:db-secret:SecretString:password}}`",
            "C) Fn::ImportValue from a separate secrets stack.",
            "D) AWS::SSM::Parameter::Value<String> parameter type.",
          ],
          correctIndex: 1,
          explanation:
            "For sensitive values, use `{{resolve:ssm-secure:...}}` (SecureString in Parameter Store) or `{{resolve:secretsmanager:...}}` (Secrets Manager). These resolve at deployment time without exposing the value in template parameters or outputs. Standard SSM Parameter Store without the `-secure` suffix (A) is for non-sensitive values. Fn::ImportValue (C) exposes the value as a stack output.",
        },
        {
          id: "dop-d2-q6",
          question:
            "A Systems Manager State Manager association is configured to enforce a configuration baseline on EC2 instances. An instance's configuration has drifted. What does State Manager do?",
          options: [
            "A) State Manager detects the drift and sends an alert but does not remediate.",
            "B) State Manager automatically re-applies the association document on the next scheduled run, restoring the desired state.",
            "C) State Manager terminates the non-compliant instance.",
            "D) State Manager creates a new instance from the golden AMI.",
          ],
          correctIndex: 1,
          explanation:
            "State Manager continuously enforces desired states by running association documents on a schedule. When an instance drifts from the desired configuration, the next scheduled execution of the association document re-applies the configuration, restoring compliance. State Manager is both detective and corrective for configuration drift.",
        },
        {
          id: "dop-d2-q7",
          question:
            "A CloudFormation stack has a circular dependency between two resources. What is the correct way to resolve it?",
          options: [
            "A) Split the circular resources into separate CloudFormation stacks.",
            "B) Use DependsOn to explicitly define the dependency order.",
            "C) Refactor the template to break the circular dependency, potentially using a custom resource to resolve the ordering.",
            "D) Use CloudFormation macros to reorder resource creation.",
          ],
          correctIndex: 2,
          explanation:
            "Circular dependencies cannot be resolved with DependsOn — DependsOn specifies ordering but cannot break a true circular reference. The solution is to refactor the template to eliminate the circular dependency, which often involves using a custom resource to defer part of the resource configuration until after both resources are created. Splitting into stacks (A) may work but doesn't inherently solve the circular dependency.",
        },
        {
          id: "dop-d2-q8",
          question:
            "A company wants to import existing, manually created EC2 instances into CloudFormation management. What is the correct approach?",
          options: [
            "A) Delete the instances and let CloudFormation recreate them.",
            "B) Use CloudFormation resource import with the existing resource's physical ID.",
            "C) Create a new CloudFormation stack referencing the existing resource ARNs.",
            "D) Use AWS Config to generate a CloudFormation template from existing resources.",
          ],
          correctIndex: 1,
          explanation:
            "CloudFormation resource import allows you to bring existing resources under CloudFormation management without recreating them. You provide the resource's physical ID (e.g., instance-id), and CloudFormation associates the resource with a template definition. After import, the stack manages the resource normally. AWS Config (D) can generate templates but does not import resources into stack management.",
        },
        {
          id: "dop-d2-q9",
          question:
            "A CDK application uses the `Pipeline` construct to deploy to multiple AWS accounts. After modifying the CDK app, a developer runs `cdk deploy`. The pipeline does not reflect the changes. Why?",
          options: [
            "A) CDK pipelines require manual re-deployment of the pipeline stack.",
            "B) CDK pipelines are self-mutating — the pipeline first updates itself, then runs the application stages.",
            "C) The CDK CLI does not support multi-account deployments.",
            "D) The CDK synthesis step failed silently.",
          ],
          correctIndex: 1,
          explanation:
            "CDK Pipelines are self-mutating. When the CDK app changes, you deploy the pipeline stack with `cdk deploy`. The pipeline then runs, first updating itself (the UpdatePipeline stage using `cdk deploy`), then running the application stages with the new code. This means you don't need to manually update the pipeline configuration for every CDK change.",
        },
        {
          id: "dop-d2-q10",
          question:
            "A CloudFormation macro is configured to transform templates. The macro Lambda function times out during template processing. What is the result?",
          options: [
            "A) CloudFormation deploys the original template without transformation.",
            "B) CloudFormation stack creation fails with a macro processing error.",
            "C) CloudFormation retries the macro transformation three times.",
            "D) CloudFormation logs a warning and continues deployment.",
          ],
          correctIndex: 1,
          explanation:
            "If a CloudFormation macro Lambda function times out or returns an error, CloudFormation fails the stack operation with a macro processing error. Macros must complete successfully for the template to be processed. CloudFormation does not fall back to the original template or retry the macro. Ensure macro Lambda functions have sufficient timeout and error handling.",
        },
      ],
    },

    // ─── Domain 3: Resilient Cloud Solutions (15%) ───────────────
    {
      id: "domain-3",
      title: "Resilient Cloud Solutions",
      weight: "15%",
      order: 3,
      summary:
        "This domain focuses on designing and implementing highly available, fault-tolerant, and disaster-resilient architectures on AWS. Topics include multi-region architectures, chaos engineering with AWS FIS, Auto Scaling strategies, and DR planning.\n\nProfessional-level questions present complex trade-offs between RPO/RTO, cost, and operational complexity. You must select appropriate DR strategies and understand the implications of multi-region active-active vs. active-passive configurations.",
      keyConceptsForExam: [
        "**Multi-region DR strategies** — active-active, active-passive (pilot light, warm standby), backup-restore; RPO/RTO trade-offs",
        "**AWS Fault Injection Simulator (FIS)** — chaos engineering experiments, fault types (EC2 terminate, CPU stress, network disruption), stop conditions",
        "**Global Accelerator** — anycast IPs, health-based routing, traffic dials for blue/green global deployments",
        "**DynamoDB Global Tables** — multi-region active-active replication, last-writer-wins conflict resolution",
        "**Route 53 health checks and failover** — endpoint, CloudWatch alarm, calculated health checks; failover routing policy",
      ],
      examTips: [
        "Global Accelerator provides static anycast IPs that don't change during failover — ideal for non-HTTP workloads or clients that cache DNS.",
        "DynamoDB Global Tables use last-writer-wins conflict resolution — design your application to handle the eventual consistency window.",
        "AWS FIS stop conditions use CloudWatch alarms to automatically halt experiments if real impact is detected — always configure them before running experiments in production.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 — Elastic Compute Cloud" },
      ],
      sections: [
        {
          heading: "Multi-Region Architecture Patterns",
          body: "Selecting the right DR strategy depends on RPO/RTO requirements and budget:\n\n- **Backup and Restore**: Cheapest, highest RPO (hours) and RTO (hours to days). Data backed up periodically.\n- **Pilot Light**: Core services running in standby region (e.g., database), compute scaled to zero. RTO: 10s of minutes.\n- **Warm Standby**: Scaled-down but functional copy running. RTO: minutes. RPO: near-zero with synchronous replication.\n- **Active-Active**: Full capacity in both regions, traffic split. RTO/RPO: near-zero.\n\nFor stateful services, use **Aurora Global Database** (sub-second replication, 1-minute failover), **DynamoDB Global Tables** (multi-region active-active), or **S3 Cross-Region Replication**.",
        },
        {
          heading: "Chaos Engineering and Resilience Testing",
          body: "**AWS Fault Injection Simulator (FIS)** enables controlled fault injection experiments to validate application resilience. Experiments define targets (EC2, RDS, ECS, EKS), actions (terminate, stop, CPU stress, network disruption), and **stop conditions** (CloudWatch alarms that halt the experiment if impact exceeds expectations).\n\nThe chaos engineering cycle: hypothesize steady state → inject fault → observe behavior → remediate weaknesses. FIS supports pre-built **experiment templates** for common scenarios. Use IAM roles with least-privilege to limit experiment blast radius.",
        },
      ],
      quiz: [
        {
          id: "dop-d3-q1",
          question:
            "A financial application requires RPO of 1 minute and RTO of 5 minutes for a regional failure. The primary region is us-east-1. Which solution meets these requirements?",
          options: [
            "A) Backup and restore with hourly snapshots and a CloudFormation stack ready to deploy.",
            "B) Aurora Global Database with a warm standby in a secondary region and automated failover.",
            "C) RDS Multi-AZ in us-east-1 with cross-region read replica promoted on failure.",
            "D) EBS snapshot replication every 15 minutes to a secondary region.",
          ],
          correctIndex: 1,
          explanation:
            "Aurora Global Database provides sub-second RPO with typical replication lag under 1 second, and RTO of approximately 1 minute for managed failover. A warm standby with auto-scaling configured meets the 5-minute RTO. RDS Multi-AZ (C) protects within a single region only. EBS snapshots (D) every 15 minutes exceed the 1-minute RPO.",
        },
        {
          id: "dop-d3-q2",
          question:
            "During an AWS FIS experiment that terminates EC2 instances, the application error rate exceeds 5% instead of the expected 0.1%. What should prevent the experiment from causing further impact?",
          options: [
            "A) The FIS experiment has a maximum duration configured.",
            "B) A stop condition linked to a CloudWatch alarm on application error rate automatically halts the experiment.",
            "C) The FIS experiment's IAM role limits the number of instances that can be terminated.",
            "D) AWS FIS automatically halts experiments when service health checks fail.",
          ],
          correctIndex: 1,
          explanation:
            "FIS stop conditions are CloudWatch alarms that automatically halt an experiment when the alarm enters the ALARM state. Configuring a stop condition on application error rate protects against experiments that cause more impact than expected. Without a stop condition, the experiment continues to its scheduled end. Stop conditions are a best practice for production experiments.",
        },
        {
          id: "dop-d3-q3",
          question:
            "A company runs an active-active multi-region application using DynamoDB Global Tables. A user updates an item in us-east-1 and another user updates the same item 50ms later in eu-west-1 before the first update replicates. What determines the final state?",
          options: [
            "A) The update from the largest region wins.",
            "B) DynamoDB uses last-writer-wins based on the item's timestamp.",
            "C) DynamoDB rejects the conflicting write and returns an error.",
            "D) Both writes are queued and applied sequentially.",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB Global Tables use a last-writer-wins conflict resolution mechanism based on each item's write timestamp. The write with the most recent timestamp takes precedence when conflicts are resolved during replication. Applications must be designed to tolerate this behavior, as it can cause one write to silently overwrite another in concurrent scenarios.",
        },
        {
          id: "dop-d3-q4",
          question:
            "An application uses AWS Global Accelerator for DNS-based routing. During a regional failure, some users continue to reach the failed region. What is the MOST likely cause?",
          options: [
            "A) Global Accelerator DNS TTL is too high.",
            "B) Users are connecting to the application's ALB DNS name directly, bypassing Global Accelerator.",
            "C) Global Accelerator health checks are not configured.",
            "D) Route 53 is not routing traffic through Global Accelerator.",
          ],
          correctIndex: 1,
          explanation:
            "Global Accelerator uses static anycast IP addresses. If users connect directly to the ALB DNS name (which can be obtained from browser history, hard-coded configurations, etc.), they bypass Global Accelerator's health-based routing. The solution is to ensure all traffic enters via the Global Accelerator IPs and to restrict direct ALB access (e.g., using security groups that only allow traffic from Global Accelerator IPs).",
        },
        {
          id: "dop-d3-q5",
          question:
            "A DevOps team wants to test that their application correctly handles sudden loss of 50% of its EC2 instances. Which FIS action should they use?",
          options: [
            "A) aws:ec2:stop-instances on 50% of instances in the target resource group.",
            "B) aws:ec2:terminate-instances on 50% of instances in the target resource group.",
            "C) aws:ec2:send-spot-instance-interruptions on 50% of instances.",
            "D) aws:ssm:send-command with a script to stop the application process.",
          ],
          correctIndex: 1,
          explanation:
            "Terminating instances (aws:ec2:terminate-instances) tests the full failure scenario — Auto Scaling must detect the loss and replace the instances. The FIS target configuration using resource tags with selection mode `PERCENT(50)` terminates exactly 50% of matching instances. Stopping instances (A) is a less severe failure scenario. Spot interruptions (C) are only applicable to Spot instances.",
        },
        {
          id: "dop-d3-q6",
          question:
            "An application on ECS Fargate must continue operating if an entire Availability Zone fails. What is the minimum configuration required?",
          options: [
            "A) ECS tasks running in a single AZ with auto-recovery enabled.",
            "B) ECS service with tasks spread across at least 2 AZs, behind an ALB.",
            "C) ECS tasks with reserved capacity in each AZ.",
            "D) ECS cluster with Fargate Spot capacity providers in each AZ.",
          ],
          correctIndex: 1,
          explanation:
            "Running ECS tasks across at least 2 Availability Zones with an ALB in front ensures that if one AZ fails, the ALB routes all traffic to healthy tasks in the remaining AZ. The ECS service maintains the desired task count and replaces any tasks lost in the failed AZ. ECS task placement constraints and spread strategies are used to ensure cross-AZ distribution.",
        },
        {
          id: "dop-d3-q7",
          question:
            "A company wants to implement a pilot light DR strategy. What resources must remain running in the DR region at all times?",
          options: [
            "A) Full application stack at reduced capacity.",
            "B) Only the database (data layer) with compute resources scaled to zero.",
            "C) Only load balancers and DNS records.",
            "D) No resources — everything is created from backups during failover.",
          ],
          correctIndex: 1,
          explanation:
            "Pilot light maintains only the core data layer (databases) running continuously in the DR region, with all compute resources at zero capacity. During failover, compute resources are provisioned from AMIs/templates and scaled up. This balances cost (only paying for database) with recovery time (minutes to scale compute). Full running capacity (A) is warm standby.",
        },
        {
          id: "dop-d3-q8",
          question:
            "An S3 Cross-Region Replication (CRR) rule is configured but objects uploaded before CRR was enabled are not being replicated. What must be done to replicate existing objects?",
          options: [
            "A) Disable and re-enable CRR.",
            "B) Use S3 Batch Operations with the ReplicateObject operation.",
            "C) Manually copy objects using the AWS CLI sync command.",
            "D) Enable S3 Transfer Acceleration on the source bucket.",
          ],
          correctIndex: 1,
          explanation:
            "S3 CRR only replicates new objects uploaded after the replication rule is created. For existing objects, use S3 Batch Operations with the ReplicateObject API to trigger replication of all existing objects. This is a one-time operation to backfill the destination bucket. The AWS CLI sync (C) would copy objects but not using the CRR mechanism (different checksums, no replication metadata).",
        },
        {
          id: "dop-d3-q9",
          question:
            "An Auto Scaling group must scale out immediately when CPU exceeds 80% without waiting for the default cooldown period. What configuration change achieves this?",
          options: [
            "A) Set the default cooldown period to 0 seconds.",
            "B) Use a target tracking policy, which overrides cooldown for scale-out actions when the metric exceeds the target.",
            "C) Enable instance warm-up to allow new instances to contribute metrics sooner.",
            "D) Use step scaling with a cooldown of 0 seconds for the scale-out step.",
          ],
          correctIndex: 3,
          explanation:
            "Step scaling policies support configuring the cooldown period per scaling step. Setting the scale-out step's cooldown to 0 allows immediate scale-out without waiting. Target tracking (B) has its own scale-out cooldown that cannot be set to 0 independently. Setting the default cooldown (A) affects all scaling actions, including scale-in, which could cause rapid termination cycles.",
        },
        {
          id: "dop-d3-q10",
          question:
            "A company needs to validate that their DR runbook can achieve a 30-minute RTO before an actual disaster occurs. What approach provides the most realistic validation?",
          options: [
            "A) Review the DR runbook documentation with the team.",
            "B) Conduct a tabletop exercise simulating regional failure scenarios.",
            "C) Execute a game day: simulate a regional failure by failing over to DR in production using AWS FIS.",
            "D) Test the DR runbook in a separate non-production environment.",
          ],
          correctIndex: 2,
          explanation:
            "A game day with actual failover in production (using AWS FIS to simulate regional failure) provides the most realistic validation of RTO. Tabletop exercises (B) are valuable but don't reveal timing issues or gaps in automation. Non-production testing (D) may not reflect production scale, data volumes, or traffic patterns. Only real execution under production conditions validates the actual RTO.",
        },
      ],
    },

    // ─── Domain 4: Monitoring and Logging (15%) ───────────────
    {
      id: "domain-4",
      title: "Monitoring and Logging",
      weight: "15%",
      order: 4,
      summary:
        "This domain covers implementing comprehensive observability for distributed systems on AWS. Topics include CloudWatch advanced features, AWS X-Ray distributed tracing, CloudTrail for audit logging, and EventBridge for event-driven architectures.\n\nProfessional-level questions focus on designing observability architectures for complex microservices and multi-account environments. You must know when to use X-Ray vs. CloudWatch vs. CloudTrail, and how to correlate data across multiple services.",
      keyConceptsForExam: [
        "**AWS X-Ray** — traces, segments, subsegments, service maps, sampling rules, X-Ray daemon vs. SDK, groups and filter expressions",
        "**CloudWatch Contributor Insights** — identifies top contributors to operational issues from log and metric data",
        "**CloudWatch ServiceLens** — unified view combining X-Ray traces, CloudWatch metrics/logs/alarms for microservices",
        "**EventBridge** — event buses (default, partner, custom), rules, targets, schema registry, event replay, pipes",
        "**CloudWatch cross-account observability** — sharing metrics, logs, and traces across accounts using monitoring accounts",
      ],
      examTips: [
        "X-Ray sampling rules control what percentage of requests are traced — configure higher rates for debugging and lower for production steady state.",
        "CloudWatch ServiceLens correlates X-Ray traces with CloudWatch metrics and logs — use it when troubleshooting latency in microservices.",
        "EventBridge Pipes connect event sources directly to targets with optional filtering and transformation — reduces Lambda glue code.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "cloudwatch-deep-dive", title: "CloudWatch Deep Dive" },
        { cloud: "aws", topicId: "ec2-basics", title: "EC2 — Elastic Compute Cloud" },
      ],
      sections: [
        {
          heading: "Distributed Tracing with AWS X-Ray",
          body: "AWS X-Ray traces requests as they travel through distributed systems. Each request generates a **trace** composed of **segments** (one per service) and **subsegments** (for downstream calls). The **X-Ray service map** visualizes service relationships and latency.\n\nThe **X-Ray daemon** (sidecar or installed agent) batches segment data and sends to the X-Ray API. The **X-Ray SDK** is embedded in application code to instrument HTTP calls, database queries, and AWS SDK calls.\n\n**Sampling rules** control what percentage of requests are traced. Reservoir + rate rules allow consistent sampling: always sample up to the reservoir size per second, then apply a fixed rate. Use **X-Ray Analytics** and **filter expressions** to query traces by specific attributes.",
          code: {
            lang: "python",
            label: "Instrument a Lambda function with X-Ray SDK",
            snippet: `from aws_xray_sdk.core import xray_recorder, patch_all
import boto3

# Patch all boto3 clients to add X-Ray tracing
patch_all()

@xray_recorder.capture('process_order')
def process_order(order_id):
    # This subsegment will appear in X-Ray
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Orders')
    return table.get_item(Key={'orderId': order_id})`,
          },
        },
        {
          heading: "EventBridge and CloudWatch Cross-Account Observability",
          body: "**EventBridge** is the event bus service for loosely coupled, event-driven architectures. Events match **rules** and are routed to **targets** (Lambda, SQS, SNS, Step Functions, etc.). The **schema registry** auto-discovers event schemas, enabling typed SDK code generation.\n\n**EventBridge Pipes** create point-to-point integrations between event sources (SQS, Kinesis, DynamoDB Streams) and targets with built-in filtering, enrichment, and transformation.\n\n**CloudWatch cross-account observability** designates a monitoring account that receives metrics, logs, and traces from source accounts. This enables centralized dashboards and alarms across an entire organization without log aggregation pipelines.",
        },
      ],
      quiz: [
        {
          id: "dop-d4-q1",
          question:
            "An application uses Lambda functions and API Gateway. Users report intermittent high latency. Which tool provides an end-to-end view correlating API response times with Lambda execution details and downstream DynamoDB calls?",
          options: [
            "A) CloudWatch Dashboards with metrics from each service.",
            "B) AWS X-Ray with ServiceLens to see the complete trace map.",
            "C) CloudTrail event history for API Gateway and Lambda.",
            "D) CloudWatch Contributor Insights on Lambda logs.",
          ],
          correctIndex: 1,
          explanation:
            "AWS X-Ray ServiceLens provides a unified view combining X-Ray traces with CloudWatch metrics and logs. The service map shows latency between API Gateway, Lambda, and DynamoDB, and you can drill into individual traces to identify which component is slow. CloudWatch metrics (A) show aggregate data but not request-level traces. CloudTrail (C) records API calls, not latency data.",
        },
        {
          id: "dop-d4-q2",
          question:
            "X-Ray is configured with a default sampling rate of 5%. A specific Lambda function handling health check requests generates excessive trace data. How should sampling be optimized?",
          options: [
            "A) Disable X-Ray for the Lambda function entirely.",
            "B) Create a custom sampling rule with a lower rate targeting the health check function's service name and URL path.",
            "C) Increase the global sampling rate to capture more data.",
            "D) Use X-Ray groups to filter out health check traces from the service map.",
          ],
          correctIndex: 1,
          explanation:
            "X-Ray sampling rules evaluate in priority order. A custom rule targeting the specific function (by service name) and URL path (health check endpoint) with a 0% rate or very low rate prevents unnecessary trace data collection. X-Ray groups (D) are for filtering the view of existing traces, not controlling collection. Disabling X-Ray entirely (A) removes observability for the function.",
        },
        {
          id: "dop-d4-q3",
          question:
            "A DevOps team needs to identify which IAM users and roles are making the most requests to an S3 bucket across all accounts in the organization. Which combination provides this insight?",
          options: [
            "A) VPC Flow Logs analysis with Athena.",
            "B) Enable S3 server access logging, aggregate logs to a central S3 bucket, and analyze with Athena or CloudWatch Contributor Insights.",
            "C) CloudTrail data events for S3 with CloudWatch Contributor Insights.",
            "D) Amazon Macie scanning of the S3 bucket.",
          ],
          correctIndex: 2,
          explanation:
            "CloudTrail data events capture every S3 API call with the requester's identity. CloudWatch Contributor Insights can analyze CloudTrail logs to identify top contributors (IAM principals making the most requests). This combination provides IAM-level attribution across accounts when using an organization-level CloudTrail. S3 server access logs (B) include requester info but are harder to analyze for IAM attribution.",
        },
        {
          id: "dop-d4-q4",
          question:
            "An EventBridge rule must route events to different Lambda functions based on whether the `environment` field in the event detail is `production` or `staging`. What EventBridge feature enables this?",
          options: [
            "A) Event pattern matching on the `detail.environment` field.",
            "B) EventBridge event bus routing.",
            "C) EventBridge Pipes with Lambda enrichment.",
            "D) EventBridge schema registry.",
          ],
          correctIndex: 0,
          explanation:
            "EventBridge rules use event pattern matching to filter events. Two separate rules can be created — one with pattern `{\"detail\": {\"environment\": [\"production\"]}}` pointing to the production Lambda, and another with `{\"detail\": {\"environment\": [\"staging\"]}}` pointing to the staging Lambda. This is the standard EventBridge content-based routing pattern.",
        },
        {
          id: "dop-d4-q5",
          question:
            "A company processes events from multiple SaaS partners via EventBridge partner event buses. They want to replay 6 hours of events to a new Lambda function after fixing a processing bug. What EventBridge feature enables this?",
          options: [
            "A) EventBridge Dead-Letter Queue (DLQ) retention.",
            "B) EventBridge Archive and Replay.",
            "C) Kinesis Data Streams as an EventBridge target with data retention.",
            "D) SQS with a long retention period as the EventBridge target.",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge Archive stores events from an event bus for a configurable retention period. The Replay feature replays archived events to any rule (including newly created rules) from a specified time window. This is exactly the pattern needed to reprocess events with the fixed Lambda. DLQ (A) stores failed events, not all events.",
        },
        {
          id: "dop-d4-q6",
          question:
            "A microservices application spans 5 AWS accounts. The observability team wants a single CloudWatch dashboard showing metrics from all accounts. What is the recommended approach?",
          options: [
            "A) Create IAM roles in each account and use cross-account data queries in CloudWatch.",
            "B) Configure CloudWatch cross-account observability with a central monitoring account.",
            "C) Export metrics to a central S3 bucket and visualize with Amazon QuickSight.",
            "D) Use Prometheus with AWS Managed Service for Prometheus for cross-account metrics.",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch cross-account observability designates a monitoring account that can view and interact with metrics, logs, alarms, and traces from linked source accounts. The monitoring account can create unified dashboards and alarms across all accounts. Cross-account data queries (A) also work but require more manual configuration per query. The native cross-account observability feature is the recommended approach.",
        },
        {
          id: "dop-d4-q7",
          question:
            "A Lambda function is experiencing cold starts causing p99 latency spikes. X-Ray traces show initialization time exceeds 2 seconds. What X-Ray data should be analyzed to confirm this is a cold start issue?",
          options: [
            "A) Trace annotations for `ColdStart=true`.",
            "B) The Initialization subsegment duration in the Lambda trace segment.",
            "C) The fault and error percentages in the service map.",
            "D) The sampling rate configuration for Lambda traces.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Lambda automatically includes an Initialization subsegment in X-Ray traces when a cold start occurs. This subsegment shows the time spent initializing the Lambda execution environment (loading code, running initialization code outside the handler). Analyzing this subsegment duration confirms whether latency spikes are caused by cold starts vs. handler execution.",
        },
        {
          id: "dop-d4-q8",
          question:
            "A CloudWatch Logs subscription filter is forwarding logs to Kinesis Data Firehose for delivery to S3. The team notices some log events are missing in S3. What is the MOST likely cause?",
          options: [
            "A) CloudWatch Logs retention is too short.",
            "B) Kinesis Data Firehose is dropping records due to S3 throttling or delivery failures — check the Firehose error output prefix.",
            "C) The subscription filter pattern is too restrictive.",
            "D) S3 bucket lifecycle is deleting recent objects.",
          ],
          correctIndex: 1,
          explanation:
            "Kinesis Data Firehose delivers records to S3 in batches. When delivery fails (S3 throttling, permissions, or other errors), Firehose can be configured to write failed records to an error output prefix in S3. Check CloudWatch metrics for Firehose (DeliveryToS3.DataFreshness, DeliveryToS3.Success) and the error output prefix for failed records. A too-restrictive filter (C) would cause consistent filtering, not intermittent loss.",
        },
        {
          id: "dop-d4-q9",
          question:
            "An organization wants to detect anomalous spending patterns across AWS accounts automatically. Which CloudWatch feature provides ML-based anomaly detection for cost metrics?",
          options: [
            "A) CloudWatch metric alarms with static thresholds.",
            "B) AWS Cost Explorer anomaly detection with SNS notifications.",
            "C) CloudWatch anomaly detection bands on billing metrics.",
            "D) AWS Trusted Advisor cost optimization checks.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Cost Explorer anomaly detection uses ML to identify spending anomalies and can send alerts via SNS. It's purpose-built for cost anomaly detection across services, accounts, and usage types. CloudWatch anomaly detection (C) works on CloudWatch metrics (which include billing metrics), but Cost Explorer anomaly detection is more specialized for cost patterns. Trusted Advisor (D) provides static best-practice checks, not anomaly detection.",
        },
        {
          id: "dop-d4-q10",
          question:
            "A team wants to correlate application logs with X-Ray traces for a specific request. What must be included in the application logs to enable this correlation?",
          options: [
            "A) The AWS request ID from the HTTP response headers.",
            "B) The X-Ray trace ID from the `X-Amzn-Trace-Id` header or the X-Ray SDK context.",
            "C) The CloudWatch log stream name.",
            "D) The Lambda function ARN.",
          ],
          correctIndex: 1,
          explanation:
            "To correlate logs with X-Ray traces, include the X-Ray trace ID in your application log entries. The X-Ray SDK provides the current trace ID via `xray_recorder.current_segment().trace_id` (or equivalent in other SDKs). CloudWatch Insights can then search for log entries with the same trace ID as an X-Ray trace. CloudWatch ServiceLens performs this correlation automatically when trace IDs are present in Lambda logs.",
        },
      ],
    },

    // ─── Domain 5: Incident and Event Response (14%) ───────────────
    {
      id: "domain-5",
      title: "Incident and Event Response",
      weight: "14%",
      order: 5,
      summary:
        "This domain covers designing automated incident response systems and event-driven automation using AWS services. Topics include EventBridge rules for operational events, Lambda for automated remediation, SNS for alerting, and Systems Manager OpsCenter for incident tracking.\n\nQuestions often present scenarios where automation must respond to AWS Health events, GuardDuty findings, or CloudWatch alarms. You must design multi-step incident response workflows that balance speed with safety.",
      keyConceptsForExam: [
        "**AWS Health** — account-specific events for service issues, planned maintenance, and limit notifications via EventBridge",
        "**Systems Manager OpsCenter** — centralized operational work items (OpsItems), integration with GuardDuty/Config/Trusted Advisor",
        "**EventBridge + Lambda automation** — remediation patterns for common operational events (isolated instance, quarantine, snapshot)",
        "**SNS fan-out** — SQS + Lambda for parallel processing, SNS message filtering for targeted notifications",
        "**AWS Incident Manager** — response plans, escalation plans, runbooks (SSM documents), engagement contacts for serious incidents",
      ],
      examTips: [
        "AWS Health events arrive in EventBridge as `aws.health` source events — create rules to automate responses to service disruptions or maintenance notifications.",
        "Systems Manager OpsCenter aggregates operational issues across services — integrate with Runbooks for one-click remediation.",
        "AWS Incident Manager runbooks execute SSM Automation documents with human approval steps for sensitive operations.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "cloudwatch-deep-dive", title: "CloudWatch Deep Dive" },
        { cloud: "aws", topicId: "iam-deep-dive", title: "IAM Deep Dive" },
      ],
      sections: [
        {
          heading: "Automated Incident Response Architecture",
          body: "A cloud-native incident response system uses **EventBridge** as the event backbone. AWS services publish events (GuardDuty findings, Config rule violations, Health events, CloudWatch alarms) to EventBridge, which routes them to automated response targets.\n\nA typical pattern: GuardDuty finding → EventBridge rule → Lambda (isolate instance, create forensic snapshot, notify security team) → SNS → PagerDuty/Slack.\n\n**AWS Systems Manager OpsCenter** provides a structured interface for tracking and resolving operational issues. OpsItems are created automatically from CloudWatch alarms, GuardDuty findings, and Config violations, with associated runbooks for remediation.",
        },
        {
          heading: "AWS Health and Maintenance Events",
          body: "**AWS Health** provides personalized views of AWS service health. Account-specific events include: upcoming EC2 instance retirement, EBS volume impairment, and Trusted Advisor limit notifications.\n\nHealth events are published to EventBridge under the `aws.health` source. Create EventBridge rules to automate responses: for instance retirement events, the automation can create an AMI backup, launch a replacement, and deregister the old instance.\n\n**AWS Incident Manager** (part of Systems Manager) provides on-call management, escalation plans, and response plan automation for high-severity incidents. Response plans define who to engage, which runbook to execute, and ChatOps channels to activate.",
        },
      ],
      quiz: [
        {
          id: "dop-d5-q1",
          question:
            "AWS Health notifies that an EC2 instance is scheduled for retirement in 2 weeks. What automated response should be implemented?",
          options: [
            "A) Create a CloudWatch alarm to monitor the instance until retirement.",
            "B) Create an EventBridge rule matching the AWS Health retirement event to trigger a Lambda function that creates an AMI, launches a replacement, and updates DNS.",
            "C) Enable EC2 Auto Recovery on the instance.",
            "D) Configure an SNS notification and manually replace the instance.",
          ],
          correctIndex: 1,
          explanation:
            "The fully automated response uses EventBridge to detect the Health event (source: `aws.health`, detailType: `AWS_EC2_INSTANCE_RETIREMENT_SCHEDULED`) and triggers a Lambda function that creates an AMI, launches a replacement instance, transfers the Elastic IP or updates the load balancer, and terminates the retiring instance. Auto Recovery (C) handles instance failures, not planned retirement.",
        },
        {
          id: "dop-d5-q2",
          question:
            "A GuardDuty finding indicates an EC2 instance may be compromised. The incident response plan requires isolating the instance while preserving forensic evidence. What is the correct automation sequence?",
          options: [
            "A) Terminate the instance immediately.",
            "B) Create a forensic EBS snapshot → change security group to deny-all → notify security team via SNS.",
            "C) Stop the instance and delete its security group.",
            "D) Enable VPC Flow Logs on the instance's VPC and wait for analysis.",
          ],
          correctIndex: 1,
          explanation:
            "The forensic-safe incident response sequence: (1) create a snapshot of attached EBS volumes to preserve disk state, (2) isolate the instance by replacing its security group with a deny-all group to stop further malicious activity, (3) notify the security team for manual investigation. Termination (A) destroys forensic evidence. Stopping the instance (C) without isolation first allows continued communication until stopped.",
        },
        {
          id: "dop-d5-q3",
          question:
            "A company wants to automatically create a Systems Manager OpsItem whenever a CloudWatch Alarm enters the ALARM state. What is the simplest approach?",
          options: [
            "A) Configure a CloudWatch Alarm action targeting SNS, then use a Lambda to create the OpsItem.",
            "B) Configure the CloudWatch Alarm to directly create an OpsItem using the Systems Manager action type in the alarm configuration.",
            "C) Create an EventBridge rule on the CloudWatch Alarm state change to invoke Systems Manager.",
            "D) Use AWS Config rules to create OpsItems from alarms.",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Alarms natively support Systems Manager OpsCenter as an alarm action type. When the alarm enters ALARM state, it automatically creates an OpsItem in OpsCenter without requiring Lambda or EventBridge. This is the simplest integration path. The alarm action is configured in the CloudWatch console under alarm notifications.",
        },
        {
          id: "dop-d5-q4",
          question:
            "Multiple Lambda functions need to receive copies of every SNS message, but each function should only process messages with specific attributes (e.g., `eventType: ORDER_PLACED`). How should this be designed?",
          options: [
            "A) Create separate SNS topics for each event type.",
            "B) Use SNS message filtering — subscribe each Lambda with a filter policy on the `eventType` attribute.",
            "C) Use SQS queues between SNS and Lambda with message selectors.",
            "D) Add routing logic inside each Lambda function.",
          ],
          correctIndex: 1,
          explanation:
            "SNS message filtering allows subscribers to define filter policies based on message attributes. Each Lambda subscription can have a filter policy (e.g., `{\"eventType\": [\"ORDER_PLACED\"]}`) so only matching messages are delivered. This eliminates unnecessary Lambda invocations and avoids creating separate topics per event type. SQS selectors (C) don't exist; SQS queues don't have message attribute filtering for SNS fan-out.",
        },
        {
          id: "dop-d5-q5",
          question:
            "An on-call incident response requires that a critical runbook step (deleting a database) be approved by a senior engineer before execution. Which service supports human approval steps within automated runbooks?",
          options: [
            "A) AWS CodePipeline manual approval action.",
            "B) AWS Systems Manager Automation with an `aws:approve` action.",
            "C) AWS Step Functions with a task token waiting for approval.",
            "D) AWS Incident Manager with an engagement plan.",
          ],
          correctIndex: 1,
          explanation:
            "Systems Manager Automation supports the `aws:approve` action, which pauses the runbook and sends an approval request via SNS. Designated approvers receive a notification and can approve or reject the step via the Systems Manager console, CLI, or API. Only after approval does the automation continue to the next (potentially destructive) step. Step Functions (C) also supports this pattern but is not the SSM-native approach.",
        },
        {
          id: "dop-d5-q6",
          question:
            "An EventBridge rule successfully matches events but the target Lambda function is failing. Events are being lost. How should the architecture be modified to prevent event loss?",
          options: [
            "A) Increase the EventBridge rule concurrency limit.",
            "B) Add a Dead-Letter Queue (SQS) to the EventBridge target configuration.",
            "C) Enable EventBridge archive on the event bus.",
            "D) Use EventBridge Pipes instead of rules.",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge target retry policies and DLQs handle delivery failures. When Lambda fails and retries are exhausted, EventBridge can deliver unprocessed events to an SQS DLQ for later processing or investigation. EventBridge archive (C) stores all events for replay but doesn't prevent loss from target failures. The DLQ specifically captures events that could not be successfully delivered after retries.",
        },
        {
          id: "dop-d5-q7",
          question:
            "A DevOps team needs real-time notification in Slack when any EC2 instance in any account across the organization is terminated. What is the MOST scalable architecture?",
          options: [
            "A) Create a CloudTrail trail per account with Lambda triggers.",
            "B) Configure an EventBridge rule in each account forwarding EC2 state-change events to a central event bus, then route to Lambda for Slack notification.",
            "C) Enable AWS Config in all accounts with SNS notification.",
            "D) Use AWS Health events to detect EC2 terminations.",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge supports cross-account event forwarding. Source accounts can forward events to a central monitoring account's event bus using resource policies. A single EventBridge rule in the central account matches EC2 state-change events (state=terminated) and triggers a Lambda that posts to Slack. This is the scalable, centralized approach that doesn't require Lambda per account.",
        },
        {
          id: "dop-d5-q8",
          question:
            "An AWS Config rule detects that an S3 bucket has public access enabled. The auto-remediation SSM Automation document fails because the Lambda execution role lacks the necessary S3 permissions. What is the FASTEST fix?",
          options: [
            "A) Recreate the SSM Automation document with elevated permissions.",
            "B) Update the IAM role used by the SSM Automation document to include s3:PutBucketPublicAccessBlock permission.",
            "C) Add an explicit allow for the Lambda role in the S3 bucket policy.",
            "D) Use a different AWS Config rule with a built-in remediation.",
          ],
          correctIndex: 1,
          explanation:
            "SSM Automation documents execute with an IAM role (the Automation Assume Role). Adding the required S3 permission (`s3:PutBucketPublicAccessBlock`) to this role is the fastest and correct fix. This is a pure IAM permissions issue — the document logic is correct, but the execution role lacks the necessary permissions. Modifying the bucket policy (C) would require per-bucket changes for every remediated bucket.",
        },
        {
          id: "dop-d5-q9",
          question:
            "An application generates events that must trigger different response workflows based on severity (HIGH, MEDIUM, LOW). HIGH severity requires immediate Lambda invocation; MEDIUM requires SQS queuing with delay; LOW can be batched to S3. What EventBridge feature routes these events most efficiently?",
          options: [
            "A) Three separate EventBridge rules with pattern matching on the severity attribute.",
            "B) A single EventBridge rule with multiple targets and input transformation.",
            "C) EventBridge Pipes with filtering on severity.",
            "D) SNS with filter policies for each severity level.",
          ],
          correctIndex: 0,
          explanation:
            "Three separate EventBridge rules each match a specific severity value (e.g., `{\"detail\": {\"severity\": [\"HIGH\"]}}`) and route to the appropriate target (Lambda for HIGH, SQS with message delay for MEDIUM, S3 via Firehose for LOW). This is cleaner and more maintainable than a single rule with complex transformation logic. Each rule independently manages its target's configuration.",
        },
        {
          id: "dop-d5-q10",
          question:
            "AWS Incident Manager is configured for a P1 incident. The on-call engineer does not acknowledge the engagement within 5 minutes. What Incident Manager feature automatically escalates to the next contact?",
          options: [
            "A) Response plan auto-escalation.",
            "B) Escalation plan with defined stages and acknowledgment timeouts.",
            "C) PagerDuty integration.",
            "D) SNS topic subscription with multiple endpoints.",
          ],
          correctIndex: 1,
          explanation:
            "AWS Incident Manager escalation plans define contact stages with acknowledgment timeout periods. If the first contact does not acknowledge the engagement within the configured timeout, Incident Manager automatically engages the next stage's contacts. This ensures incidents are always acted upon even when the first responder is unavailable.",
        },
      ],
    },

    // ─── Domain 6: Security and Compliance (17%) ───────────────
    {
      id: "domain-6",
      title: "Security and Compliance",
      weight: "17%",
      order: 6,
      summary:
        "This domain covers implementing and enforcing security and compliance controls across AWS environments at scale. Topics include IAM advanced patterns, AWS Organizations SCPs, AWS Config for compliance, Security Hub, and secrets management with automatic rotation.\n\nProfessional-level questions require designing security architectures that span multiple accounts and automate compliance enforcement. You must understand when to use SCPs vs. permission boundaries vs. IAM policies, and how to automate secrets rotation.",
      keyConceptsForExam: [
        "**SCPs and permission boundaries** — SCPs are account-level guardrails (don't grant permissions); permission boundaries restrict the maximum permissions an IAM entity can have",
        "**Secrets Manager rotation** — Lambda-based rotation function, rotation schedule, staged secret versions (AWSCURRENT/AWSPENDING/AWSPREVIOUS)",
        "**AWS Config aggregator** — multi-account/multi-region compliance dashboard, organization aggregator",
        "**AWS Security Hub** — ASFF findings, custom insights, security standards (CIS, FSBP, PCI DSS), automated response with EventBridge",
        "**Service Control Policies (SCPs)** — deny-first logic, combining with IAM, common guardrail patterns (region restriction, MFA enforcement, root account protection)",
      ],
      examTips: [
        "SCPs do not grant permissions — they restrict the maximum permissions available. An account still needs IAM policies to allow actions within the SCP bounds.",
        "Permission boundaries define the maximum permissions an IAM identity can have, while identity-based policies grant permissions within those boundaries — both must allow an action.",
        "Secrets Manager rotation uses a Lambda function that follows the create/set/test/finish lifecycle with staged versions to enable zero-downtime rotation.",
      ],
      relatedTopics: [
        { cloud: "aws", topicId: "iam-deep-dive", title: "IAM Deep Dive" },
        { cloud: "aws", topicId: "vpc-basics", title: "VPC — Virtual Private Cloud" },
      ],
      sections: [
        {
          heading: "Multi-Account Security Governance",
          body: "AWS Organizations **Service Control Policies (SCPs)** provide guardrails across member accounts. SCPs follow deny-first logic and define the maximum permissions available in an account — they do not grant permissions themselves.\n\nCommon SCP patterns:\n- **Region restriction**: Deny all actions except those in allowed regions using `aws:RequestedRegion` condition.\n- **Root account protection**: Deny all actions for the root user except emergency operations.\n- **Resource tag enforcement**: Deny resource creation without required cost allocation tags.\n\n**Permission boundaries** are IAM policies attached to IAM identities (users/roles) that define the maximum permissions the identity can exercise. They're commonly used to allow developers to create IAM roles that can only perform limited actions, preventing privilege escalation.",
          code: {
            lang: "json",
            label: "SCP to restrict operations to approved regions",
            snippet: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyNonApprovedRegions",
    "Effect": "Deny",
    "NotAction": [
      "iam:*", "sts:*", "cloudfront:*",
      "route53:*", "support:*", "budgets:*"
    ],
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": ["us-east-1", "eu-west-1"]
      }
    }
  }]
}`,
          },
        },
        {
          heading: "Secrets Rotation and Compliance Automation",
          body: "**AWS Secrets Manager** automatic rotation uses a Lambda function to rotate secrets on a schedule. The rotation process follows staged versions:\n1. **AWSPENDING**: Lambda creates the new secret version.\n2. Lambda sets the new credentials on the target service (e.g., RDS password change).\n3. Lambda verifies the new credentials work.\n4. **AWSCURRENT**: Lambda marks the new version as current; old version becomes AWSPREVIOUS.\n\nApplications that use `GetSecretValue` always receive the AWSCURRENT version — zero application changes needed for rotation.\n\n**AWS Config aggregator** with organization-level deployment provides a centralized compliance dashboard. Combined with Security Hub, you can create custom insights and automate remediation via EventBridge.",
        },
      ],
      quiz: [
        {
          id: "dop-d6-q1",
          question:
            "A developer creates an IAM role with AdministratorAccess but a permission boundary restricts the role to only S3 and DynamoDB actions. The role attempts to invoke a Lambda function. What happens?",
          options: [
            "A) The invocation succeeds because the IAM policy grants AdministratorAccess.",
            "B) The invocation fails because the permission boundary does not include Lambda actions.",
            "C) The permission boundary is ignored because AdministratorAccess overrides it.",
            "D) The invocation succeeds if the Lambda resource policy allows the role.",
          ],
          correctIndex: 1,
          explanation:
            "Permission boundaries define the maximum permissions an IAM entity can have. Even though the identity-based policy grants AdministratorAccess, the effective permissions are the intersection of the identity-based policy and the permission boundary. Since the permission boundary only allows S3 and DynamoDB, Lambda invocation is denied. Both the policy AND the boundary must allow an action.",
        },
        {
          id: "dop-d6-q2",
          question:
            "An SCP attached to the root OU denies `iam:CreateUser`. A member account administrator tries to create an IAM user. What is the result?",
          options: [
            "A) The action succeeds if the administrator has AdministratorAccess.",
            "B) The action is denied — SCPs override IAM policies in member accounts.",
            "C) The action succeeds but generates a CloudTrail audit event.",
            "D) The action succeeds only if the management account approves it.",
          ],
          correctIndex: 1,
          explanation:
            "SCPs define the maximum permissions available in a member account. A Deny in an SCP cannot be overridden by any IAM policy in the account, including AdministratorAccess. Even the account root user cannot perform actions denied by an SCP (except the management account). SCPs are the highest-level guardrail in the AWS Organizations permission model.",
        },
        {
          id: "dop-d6-q3",
          question:
            "A Secrets Manager secret for an RDS database is configured for automatic rotation every 30 days. After rotation, a Lambda function fails with authentication errors. What is the MOST likely cause?",
          options: [
            "A) The Lambda function is still using a cached secret value and not fetching the latest AWSCURRENT version.",
            "B) The RDS password rotation failed and the old password was invalidated.",
            "C) The Secrets Manager rotation Lambda function doesn't have RDS network access.",
            "D) The Lambda function's IAM role lacks secretsmanager:GetSecretValue permission.",
          ],
          correctIndex: 0,
          explanation:
            "After rotation, the Lambda function must call `GetSecretValue` to retrieve the new AWSCURRENT secret. If the function caches the old credentials (in a global variable or connection pool), it continues using the rotated-away password. The fix is to catch authentication exceptions and refresh the cached credentials by fetching from Secrets Manager. This is the most common post-rotation failure pattern.",
        },
        {
          id: "dop-d6-q4",
          question:
            "A company wants to enforce that all new IAM roles created by developers cannot have more permissions than the developer who creates them (preventing privilege escalation). What IAM feature achieves this?",
          options: [
            "A) SCPs on the developer accounts.",
            "B) Permission boundaries — require all developer-created roles to have a permission boundary that limits their permissions.",
            "C) IAM Access Analyzer continuously validates role permissions.",
            "D) CloudTrail monitoring of CreateRole API calls with Lambda remediation.",
          ],
          correctIndex: 1,
          explanation:
            "Permission boundaries are the standard pattern for preventing privilege escalation by non-admin users. Administrators grant developers the ability to create roles but require those roles to have a specific permission boundary attached. The developer's policy allows `iam:CreateRole` only when `iam:PermissionsBoundary` equals the required boundary. CloudTrail remediation (D) is reactive and doesn't prevent the escalation.",
        },
        {
          id: "dop-d6-q5",
          question:
            "A Security Hub finding indicates an S3 bucket has public access enabled in a member account. The security team wants to automatically remediate this finding. What is the BEST architecture?",
          options: [
            "A) Create an AWS Config rule with auto-remediation in the member account.",
            "B) Create an EventBridge rule in the Security Hub aggregator account matching the finding, invoke a Lambda that assumes a cross-account role in the member account and calls s3:PutPublicAccessBlock.",
            "C) Use Security Hub custom actions to manually trigger remediation.",
            "D) Create an SCP that denies public S3 access in all accounts.",
          ],
          correctIndex: 1,
          explanation:
            "For centralized automated remediation from Security Hub, the pattern is: EventBridge rule (Security Hub finding) → Lambda (in security account) → assume cross-account role → remediate in member account. This centralizes remediation logic while acting in the appropriate account. SCPs (D) are preventive, not corrective. Custom actions (C) require manual triggering.",
        },
        {
          id: "dop-d6-q6",
          question:
            "An audit requires demonstrating that all API calls made in the organization's AWS accounts over the past 90 days are captured and cannot be tampered with. What configuration achieves this?",
          options: [
            "A) Enable CloudTrail in each account with a 90-day retention period.",
            "B) Create an organization-level CloudTrail delivering to an S3 bucket with Object Lock (Compliance mode) enabled and a 90-day retention period.",
            "C) Use AWS Config to record all resource changes for 90 days.",
            "D) Enable VPC Flow Logs in all accounts and archive to S3.",
          ],
          correctIndex: 1,
          explanation:
            "An organization-level CloudTrail captures API activity across all member accounts and delivers to a centralized S3 bucket. Enabling S3 Object Lock in Compliance mode with a 90-day retention period prevents any modification or deletion of log files, satisfying tamper-evidence requirements. AWS Config (C) records resource configuration changes, not all API calls. VPC Flow Logs (D) capture network traffic, not API calls.",
        },
        {
          id: "dop-d6-q7",
          question:
            "A company needs IAM roles in member accounts that can only be assumed by specific services running in a central tooling account. What is the correct trust policy pattern?",
          options: [
            "A) Trust policy allowing `sts:AssumeRole` for `AWS: *` with a condition on the requesting account.",
            "B) Trust policy allowing `sts:AssumeRole` for the specific IAM role ARN in the tooling account.",
            "C) Trust policy allowing `sts:AssumeRoleWithWebIdentity` for the tooling account.",
            "D) Resource-based policy on the IAM role allowing the tooling account root to assume it.",
          ],
          correctIndex: 1,
          explanation:
            "The trust policy for cross-account access should specify the exact IAM principal (role ARN) in the tooling account that is allowed to assume the role. This follows the principle of least privilege — only the specific service role, not the entire account. `AWS: *` with account condition (A) is too broad. AssumeRoleWithWebIdentity (C) is for federated access (OIDC/SAML), not cross-account role assumption.",
        },
        {
          id: "dop-d6-q8",
          question:
            "AWS Config aggregator shows 200 non-compliant resources across the organization. The compliance team needs to prioritize remediation. Which Security Hub feature helps identify and prioritize the most critical findings?",
          options: [
            "A) Security Hub security score and finding severity levels.",
            "B) CloudTrail event history for Config violations.",
            "C) Config conformance pack compliance scores.",
            "D) Trusted Advisor checks for security issues.",
          ],
          correctIndex: 0,
          explanation:
            "Security Hub provides a consolidated security score (0-100%) per security standard and aggregates findings with severity levels (CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL). The security score and severity distribution help prioritize remediation. Security Hub custom insights can further filter findings by resource type, account, or other criteria. Config conformance packs (C) show compliance percentages but don't prioritize by risk.",
        },
        {
          id: "dop-d6-q9",
          question:
            "A company runs ECS tasks that need temporary AWS credentials. The tasks must not use long-term access keys. What is the CORRECT mechanism for credential delivery?",
          options: [
            "A) Inject credentials as environment variables in the ECS task definition.",
            "B) Assign an ECS task IAM role — the ECS agent automatically provides temporary credentials via the task metadata endpoint.",
            "C) Mount a credential file from an S3 bucket into the container.",
            "D) Use Secrets Manager to store and retrieve access keys at container startup.",
          ],
          correctIndex: 1,
          explanation:
            "ECS task IAM roles provide automatic temporary credential delivery. The ECS agent fetches credentials from STS and makes them available to containers via the container metadata endpoint (169.254.170.2). AWS SDKs automatically discover and refresh these credentials. This is the secure, zero-management approach — no access keys, no rotation needed. Environment variables (A) with access keys are long-term credentials and a security anti-pattern.",
        },
        {
          id: "dop-d6-q10",
          question:
            "A Secrets Manager custom rotation Lambda function fails during the `setSecret` phase. What is the state of the secret after the failure?",
          options: [
            "A) The old secret (AWSPREVIOUS) becomes AWSCURRENT and is accessible to applications.",
            "B) The new secret remains in AWSPENDING status; the AWSCURRENT version is still the old value — applications continue to work.",
            "C) Both AWSCURRENT and AWSPENDING are invalid and applications cannot authenticate.",
            "D) Secrets Manager automatically retries the rotation immediately.",
          ],
          correctIndex: 1,
          explanation:
            "Secrets Manager rotation uses staged versioning for safety. Until the `finishSecret` phase completes and the new version is promoted to AWSCURRENT, the old version remains AWSCURRENT. A failure during `setSecret` (before the version is promoted) means the AWSPENDING version exists but AWSCURRENT is still valid. Applications retrieving AWSCURRENT continue to work during the failed rotation attempt.",
        },
      ],
    },
  ],
};
