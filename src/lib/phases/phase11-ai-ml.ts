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

// ─── AWS SageMaker + Bedrock ─────────────────────────────────────────────────

export const sagemakerBedrockTopic: Topic = {
  id: "sagemaker-bedrock",
  title: "SageMaker & Bedrock — ML and GenAI",
  level: "Intermediate",
  readTime: "14 min",
  category: "AI / ML",
  summary:
    "SageMaker is AWS's end-to-end machine learning platform for building, training, and deploying custom models. Bedrock is AWS's managed service for accessing foundation models (Claude, Llama, Titan) via a simple API — no infrastructure to manage.",
  gcpEquivalent: "Vertex AI",
  azureEquivalent: "Azure ML + Azure OpenAI",
  sections: [
    {
      heading: "What is SageMaker?",
      body: "SageMaker is a fully managed ML platform that covers the entire machine learning lifecycle.\n\n**Key components:**\n• **SageMaker Studio** — web-based IDE with JupyterLab notebooks, experiment tracking, and model registry\n• **Training** — managed training jobs on CPU, GPU, or custom hardware; supports built-in algorithms (XGBoost, Linear Learner) and custom containers (PyTorch, TensorFlow, HuggingFace)\n• **Endpoints** — real-time inference endpoints with auto-scaling; also supports batch transform and async inference for large payloads\n• **Feature Store** — centralized repository for ML features, shared across teams\n• **Pipelines** — CI/CD for ML; define training→evaluation→deployment workflows as code\n\nSageMaker is the right choice when you need to **train custom models** on your own data, fine-tune open-source models, or build MLOps pipelines with full control over the model lifecycle.",
    },
    {
      heading: "What is Bedrock?",
      body: "Bedrock is a fully managed service that provides access to foundation models (FMs) from leading AI companies through a unified API.\n\n**Available model families:**\n• **Anthropic Claude** — text generation, analysis, coding (Claude 3.5 Sonnet, Claude 3 Haiku, etc.)\n• **Meta Llama** — open-weight models for text and code generation\n• **Amazon Titan** — Amazon's own models for text, embeddings, and image generation\n• **Stability AI** — image generation models (Stable Diffusion)\n• **Cohere** — text generation and embeddings optimised for RAG\n\n**Key features:**\n• **Knowledge Bases** — managed RAG (Retrieval-Augmented Generation) with automatic chunking, embedding, and vector storage\n• **Agents** — build autonomous agents that can call APIs, query databases, and chain model invocations\n• **Guardrails** — content filtering, PII redaction, and topic denial policies applied at the API layer\n• **Model customization** — fine-tune select models on your own data without managing training infrastructure\n\nBedrock is the right choice when you want to **use existing foundation models** via API without training or hosting infrastructure.",
    },
    {
      heading: "Using the Bedrock API",
      body: "Bedrock exposes a unified `InvokeModel` API that works across all supported model families. For conversational models like Claude, use the `Converse` API for a provider-agnostic interface.\n\nThe Python SDK (`boto3`) is the most common way to call Bedrock. You need the `bedrock-runtime` client for inference and the `bedrock` client for model management.",
      code: {
        lang: "python",
        label: "Bedrock — invoke Claude with boto3",
        snippet: `import boto3
import json

# Create the Bedrock Runtime client
client = boto3.client("bedrock-runtime", region_name="us-east-1")

# Option 1: Converse API (recommended — provider-agnostic)
response = client.converse(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    messages=[
        {
            "role": "user",
            "content": [{"text": "Explain VPC peering in two sentences."}],
        }
    ],
    inferenceConfig={"maxTokens": 512, "temperature": 0.3},
)

print(response["output"]["message"]["content"][0]["text"])

# Option 2: InvokeModel (model-native format)
body = json.dumps({
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 512,
    "messages": [
        {"role": "user", "content": "Explain VPC peering in two sentences."}
    ],
})

response = client.invoke_model(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    contentType="application/json",
    accept="application/json",
    body=body,
)

result = json.loads(response["body"].read())
print(result["content"][0]["text"])`,
      },
    },
    {
      heading: "Deploy a SageMaker endpoint",
      body: "SageMaker endpoints host your trained model behind a managed HTTPS endpoint with auto-scaling. The typical workflow is: upload model artifacts to S3 → create a Model → create an EndpointConfig → create an Endpoint.\n\nThe Python SDK (`sagemaker`) simplifies this to a few lines.",
      code: {
        lang: "python",
        label: "SageMaker — deploy a HuggingFace model",
        snippet: `from sagemaker.huggingface import HuggingFaceModel
import sagemaker

role = sagemaker.get_execution_role()

# Deploy a HuggingFace model to a real-time endpoint
hub_model = HuggingFaceModel(
    model_data=None,  # Pull directly from HuggingFace Hub
    role=role,
    transformers_version="4.37.0",
    pytorch_version="2.1.0",
    py_version="py310",
    env={
        "HF_MODEL_ID": "distilbert-base-uncased-finetuned-sst-2-english",
        "HF_TASK": "text-classification",
    },
)

# Deploy to an ml.m5.xlarge instance
predictor = hub_model.deploy(
    initial_instance_count=1,
    instance_type="ml.m5.xlarge",
    endpoint_name="sentiment-classifier",
)

# Invoke the endpoint
result = predictor.predict({
    "inputs": "SageMaker makes ML deployment easy!"
})
print(result)
# [{"label": "POSITIVE", "score": 0.9998}]

# Clean up when done
predictor.delete_endpoint()`,
      },
    },
    {
      heading: "SageMaker vs Bedrock — when to use which",
      body: "The choice between SageMaker and Bedrock depends on whether you need **custom training** or **ready-made foundation models**.\n\n**Use Bedrock when:**\n• You want to use an existing foundation model (Claude, Llama, Titan) via API\n• Your use case is text generation, summarisation, RAG, chatbots, or embeddings\n• You want zero infrastructure management — no instances, no model hosting\n• You need managed guardrails and content filtering\n\n**Use SageMaker when:**\n• You need to train a custom model on proprietary data (tabular, time-series, computer vision)\n• You're fine-tuning open-source models and need full control over hyperparameters\n• You need batch inference at scale (millions of predictions per day)\n• You're building MLOps pipelines with model versioning, A/B testing, and shadow deployments\n\n**Use both together when:**\n• Bedrock handles your GenAI use cases (chatbot, document analysis)\n• SageMaker handles your traditional ML use cases (fraud detection, demand forecasting)\n• SageMaker Feature Store feeds features to both SageMaker models and Bedrock Knowledge Bases",
    },
  ],
};

// ─── GCP Vertex AI ───────────────────────────────────────────────────────────

export const vertexAiTopic: Topic = {
  id: "vertex-ai",
  title: "Vertex AI — Unified ML Platform",
  level: "Intermediate",
  readTime: "13 min",
  category: "AI / ML",
  summary:
    "Vertex AI is GCP's unified machine learning platform that combines custom model training, AutoML, managed prediction endpoints, the Gemini API for generative AI, and Model Garden for open-source models — all under a single API surface.",
  awsEquivalent: "SageMaker + Bedrock",
  azureEquivalent: "Azure ML + Azure OpenAI",
  sections: [
    {
      heading: "What is Vertex AI?",
      body: "Vertex AI consolidates GCP's ML services into a single platform that supports the full lifecycle — from data preparation to production deployment.\n\n**Core capabilities:**\n• **Custom Training** — run training jobs on managed compute (CPUs, GPUs, TPUs) using any framework (TensorFlow, PyTorch, JAX, XGBoost)\n• **AutoML** — train high-quality models on tabular, image, text, or video data with no code; GCP handles architecture search and hyperparameter tuning\n• **Prediction** — deploy models to online endpoints (real-time) or batch prediction jobs; supports traffic splitting for A/B testing\n• **Vertex AI Studio** — web UI for prototyping with Gemini models, tuning prompts, and grounding responses in your own data\n• **Pipelines** — orchestrate ML workflows using Kubeflow Pipelines or TFX; managed execution with lineage tracking\n• **Feature Store** — low-latency serving of ML features with point-in-time correctness for training and online inference\n\nVertex AI is the single entry point for both **traditional ML** (custom training, AutoML) and **generative AI** (Gemini, Model Garden) on GCP.",
    },
    {
      heading: "Gemini API",
      body: "Gemini is Google's multimodal foundation model family, accessible through Vertex AI. It handles text, images, audio, video, and code in a single model.\n\n**Model variants:**\n• **Gemini 1.5 Pro** — long-context model (up to 2M tokens); best for document analysis, code generation, and complex reasoning\n• **Gemini 1.5 Flash** — optimised for speed and cost; handles most production workloads\n• **Gemini 1.0 Pro** — legacy model, still available for existing integrations\n\nThe Vertex AI SDK provides a Python interface that mirrors the Gemini API but routes through your GCP project for billing, IAM, and data residency.",
      code: {
        lang: "python",
        label: "Vertex AI — call Gemini with Python SDK",
        snippet: `import vertexai
from vertexai.generative_models import GenerativeModel

# Initialise Vertex AI with your project and region
vertexai.init(project="my-gcp-project", location="us-central1")

# Load a Gemini model
model = GenerativeModel("gemini-1.5-flash-002")

# Generate text
response = model.generate_content(
    "Explain Kubernetes pod autoscaling in three bullet points.",
    generation_config={
        "temperature": 0.3,
        "max_output_tokens": 512,
    },
)

print(response.text)

# Multimodal: send an image with a text prompt
from vertexai.generative_models import Image

image = Image.load_from_file("architecture-diagram.png")

response = model.generate_content(
    [image, "Describe this cloud architecture diagram."],
    generation_config={"temperature": 0.2},
)

print(response.text)`,
      },
    },
    {
      heading: "Model Garden",
      body: "Model Garden is Vertex AI's catalogue of open-source and third-party models that you can deploy directly to Vertex AI endpoints — no container building required.\n\n**Available models include:**\n• **Llama 3** — Meta's open-weight LLM, deployable on GPU endpoints\n• **Mistral / Mixtral** — efficient open models for text generation\n• **Stable Diffusion** — image generation models\n• **BERT, T5, PaLM** — various NLP models for classification, summarisation, translation\n\nModel Garden handles the serving infrastructure — you select a model, choose an instance type, and deploy. Vertex AI manages scaling, health checks, and GPU allocation.",
      code: {
        lang: "bash",
        label: "Deploy a Model Garden model via gcloud",
        snippet: `# List available models in Model Garden
gcloud ai models list \\
  --region=us-central1 \\
  --filter="displayName:llama"

# Deploy a model from Model Garden to an endpoint
# (typical flow uses the Console or Vertex AI SDK)
gcloud ai endpoints create \\
  --region=us-central1 \\
  --display-name=llama3-endpoint

# Deploy the model to the endpoint
gcloud ai endpoints deploy-model ENDPOINT_ID \\
  --region=us-central1 \\
  --model=MODEL_ID \\
  --display-name=llama3-deployment \\
  --machine-type=g2-standard-12 \\
  --accelerator=type=nvidia-l4,count=1 \\
  --traffic-split=0=100

# Send a prediction request
curl -X POST \\
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  -H "Content-Type: application/json" \\
  "https://us-central1-aiplatform.googleapis.com/v1/projects/my-project/locations/us-central1/endpoints/ENDPOINT_ID:predict" \\
  -d '{
    "instances": [{"prompt": "Explain load balancing in one paragraph."}],
    "parameters": {"temperature": 0.3, "maxOutputTokens": 256}
  }'`,
      },
    },
    {
      heading: "AutoML and custom training",
      body: "Vertex AI supports two paths for building your own models — **AutoML** for no-code training and **custom training** for full framework control.\n\n**AutoML:**\n• Upload a labelled dataset (tabular, image, text, or video)\n• Vertex AI automatically selects the best architecture, tunes hyperparameters, and trains the model\n• Produces a deployable model with evaluation metrics — no ML expertise required\n• Best for: classification, regression, object detection, entity extraction, sentiment analysis\n\n**Custom Training:**\n• Write your training code in any framework (PyTorch, TensorFlow, JAX, scikit-learn)\n• Package as a Python script or custom Docker container\n• Submit as a managed training job with configurable machine type, GPU count, and distributed strategy\n• Best for: novel architectures, reinforcement learning, large-scale pre-training, specialised loss functions\n\nBoth paths produce models that can be registered in the **Model Registry** and deployed to the same Vertex AI prediction endpoints.",
      code: {
        lang: "bash",
        label: "Submit a custom training job",
        snippet: `# Submit a custom PyTorch training job on GPU
gcloud ai custom-jobs create \\
  --region=us-central1 \\
  --display-name=train-text-classifier \\
  --worker-pool-spec=machine-type=n1-standard-8,\\
accelerator-type=NVIDIA_TESLA_T4,\\
accelerator-count=1,\\
replica-count=1,\\
container-image-uri=us-docker.pkg.dev/vertex-ai/training/pytorch-gpu.2-1:latest,\\
local-package-path=./trainer,\\
python-module=trainer.task

# Monitor the training job
gcloud ai custom-jobs describe JOB_ID \\
  --region=us-central1

# After training, upload the model to Model Registry
gcloud ai models upload \\
  --region=us-central1 \\
  --display-name=text-classifier-v1 \\
  --container-image-uri=us-docker.pkg.dev/vertex-ai/prediction/pytorch-gpu.2-1:latest \\
  --artifact-uri=gs://my-bucket/model-artifacts/`,
      },
    },
  ],
};

// ─── Azure OpenAI + Azure ML ─────────────────────────────────────────────────

export const azureOpenAiTopic: Topic = {
  id: "azure-openai-ml",
  title: "Azure OpenAI & Azure ML",
  level: "Intermediate",
  readTime: "13 min",
  category: "AI / ML",
  summary:
    "Azure OpenAI Service provides access to OpenAI's models (GPT-4, GPT-4o, DALL-E, embeddings) with enterprise security, private networking, and content filtering. Azure Machine Learning is the full MLOps platform for training, deploying, and managing custom models at scale.",
  awsEquivalent: "SageMaker + Bedrock",
  gcpEquivalent: "Vertex AI",
  sections: [
    {
      heading: "What is Azure OpenAI?",
      body: "Azure OpenAI Service is Microsoft's managed offering that provides REST API access to OpenAI's foundation models — hosted in Azure data centres with enterprise-grade security.\n\n**Available models:**\n• **GPT-4o / GPT-4o mini** — latest multimodal models for text, image, and audio understanding\n• **GPT-4 / GPT-4 Turbo** — high-capability text and code generation\n• **o1 / o1-mini** — reasoning models optimised for math, science, and complex logic\n• **DALL-E 3** — image generation from text prompts\n• **Whisper** — speech-to-text transcription\n• **text-embedding-ada-002 / text-embedding-3** — vector embeddings for RAG and semantic search\n\n**Enterprise features that differentiate Azure OpenAI from direct OpenAI API:**\n• **Private endpoints** — keep all traffic on your Azure VNet, no public internet\n• **Managed identity** — authenticate with Azure AD instead of API keys\n• **Content filtering** — configurable safety filters for hate, violence, self-harm, and sexual content\n• **Data residency** — choose the Azure region where your data is processed\n• **Provisioned throughput** — reserve capacity for predictable latency and cost",
    },
    {
      heading: "Chat completions API",
      body: "The chat completions API is the primary interface for interacting with GPT models on Azure OpenAI. It uses a messages array with roles (`system`, `user`, `assistant`) to manage conversation context.\n\nAzure OpenAI uses a different endpoint format than OpenAI — the URL includes your resource name and deployment name.",
      code: {
        lang: "python",
        label: "Azure OpenAI — chat completion with Python SDK",
        snippet: `from openai import AzureOpenAI

# Initialise the Azure OpenAI client
client = AzureOpenAI(
    api_key="your-api-key",           # Or use Azure AD: azure_ad_token
    api_version="2024-10-21",
    azure_endpoint="https://my-resource.openai.azure.com",
)

# Create a chat completion
response = client.chat.completions.create(
    model="gpt-4o",  # This is the deployment name, not the model name
    messages=[
        {
            "role": "system",
            "content": "You are a cloud engineering assistant. Be concise.",
        },
        {
            "role": "user",
            "content": "What is the difference between Azure VNet and AWS VPC?",
        },
    ],
    temperature=0.3,
    max_tokens=512,
)

print(response.choices[0].message.content)

# Streaming response
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "List 5 Azure networking services."}
    ],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`,
      },
    },
    {
      heading: "Azure Machine Learning",
      body: "Azure ML is the full-lifecycle MLOps platform for building, training, and deploying custom models.\n\n**Core components:**\n• **Compute** — managed compute instances (notebooks), compute clusters (distributed training), and serverless compute (pay-per-job)\n• **Datastores & Datasets** — connect to Azure Blob Storage, Data Lake, SQL databases; version and track training data\n• **Environments** — reproducible runtime definitions (Docker + conda/pip); prebuilt curated environments for PyTorch, TensorFlow, scikit-learn\n• **Pipelines** — define multi-step ML workflows (data prep → training → evaluation → registration → deployment) as code\n• **Managed Endpoints** — deploy models to real-time or batch endpoints with auto-scaling, blue-green deployment, and traffic splitting\n• **Model Registry** — version, tag, and track all trained models with lineage back to training data and code\n\nAzure ML integrates with **MLflow** for experiment tracking and model packaging, making it easy to migrate from open-source MLflow workflows.",
      code: {
        lang: "bash",
        label: "Azure ML — create resources and deploy with az CLI",
        snippet: `# Create an Azure ML workspace
az ml workspace create \\
  --name my-ml-workspace \\
  --resource-group my-rg \\
  --location eastus

# Create a compute cluster for training
az ml compute create \\
  --name gpu-cluster \\
  --type AmlCompute \\
  --size Standard_NC6s_v3 \\
  --min-instances 0 \\
  --max-instances 4 \\
  --resource-group my-rg \\
  --workspace-name my-ml-workspace

# Submit a training job
az ml job create \\
  --file train-job.yml \\
  --resource-group my-rg \\
  --workspace-name my-ml-workspace

# Create a managed online endpoint
az ml online-endpoint create \\
  --name sentiment-endpoint \\
  --resource-group my-rg \\
  --workspace-name my-ml-workspace

# Deploy a model to the endpoint
az ml online-deployment create \\
  --name blue \\
  --endpoint-name sentiment-endpoint \\
  --model azureml:sentiment-model@latest \\
  --instance-type Standard_DS3_v2 \\
  --instance-count 1 \\
  --resource-group my-rg \\
  --workspace-name my-ml-workspace

# Test the endpoint
az ml online-endpoint invoke \\
  --name sentiment-endpoint \\
  --request-file sample-request.json \\
  --resource-group my-rg \\
  --workspace-name my-ml-workspace`,
      },
    },
    {
      heading: "Responsible AI",
      body: "Azure places strong emphasis on responsible AI practices, providing built-in tools for safety, fairness, and transparency.\n\n**Content Safety:**\n• Azure OpenAI includes **configurable content filters** that score prompts and completions for hate, violence, self-harm, and sexual content on a 0–7 severity scale\n• You can adjust filter thresholds per deployment — stricter for consumer apps, relaxed for research\n• **Blocklists** let you define custom blocked terms beyond the default filters\n\n**Azure AI Content Safety (standalone service):**\n• Image and text moderation APIs that work with any model, not just Azure OpenAI\n• **Prompt Shields** — detect jailbreak attempts and indirect prompt injections\n• **Groundedness detection** — verify that model outputs are grounded in provided source material (reduces hallucination)\n\n**Responsible AI dashboard (Azure ML):**\n• **Fairness analysis** — detect bias across demographic groups in classification and regression models\n• **Error analysis** — identify cohorts where your model underperforms\n• **Interpretability** — feature importance and individual prediction explanations (SHAP values)\n• **Counterfactual analysis** — show what minimal input changes would flip a prediction\n\n**Red teaming best practices:**\n• Azure provides a **red teaming guide** for systematically testing GenAI applications\n• Test for prompt injection, data exfiltration, off-topic abuse, and bias before production launch\n• Use Azure OpenAI's **abuse monitoring** to detect and alert on anomalous usage patterns post-launch",
    },
  ],
};
