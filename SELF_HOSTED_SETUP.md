# Self-Hosted Setup Guide

Want to run the workshop on your own machine? This guide covers everything you need.

During the workshop, you used a pre-configured cloud environment. To run this at home, you'll need your own AWS account and a few tools installed locally.

---

## Prerequisites

### 1. AWS Account

You need an AWS account with billing enabled. If you don't have one:
1. Go to [aws.amazon.com](https://aws.amazon.com/) and click **Create an AWS Account**
2. Follow the signup process (requires a credit card)
3. The workshop uses only free-tier-eligible or very low-cost services

**Estimated cost:** A few cents if you clean up after. The most expensive part is Bedrock API calls (~$0.001 per request with Claude Haiku).

### 2. AWS CLI & Credentials

Install the AWS CLI and configure your credentials:

```bash
# Install AWS CLI (macOS)
brew install awscli

# Install AWS CLI (Linux)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# Configure credentials
aws configure
```

You'll need an **Access Key ID** and **Secret Access Key**. Create them in the AWS Console:
1. Go to **IAM** > **Users** > your user > **Security credentials**
2. Click **Create access key**
3. Choose **Command Line Interface (CLI)**

Verify it works:
```bash
aws sts get-caller-identity
```

### 3. IAM Permissions

Your AWS user needs permissions for the following services:
- **S3** — create buckets, upload objects
- **DynamoDB** — create tables, CRUD operations
- **Lambda** — create and update functions
- **API Gateway** — create HTTP APIs and routes
- **IAM** — create roles and policies (for Lambda execution role)
- **CloudWatch Logs** — Lambda logging
- **Bedrock** — invoke AI models

The simplest approach is to use an IAM user with **AdministratorAccess** for the workshop, then delete the access key when you're done.

### 4. Enable Claude on AWS Bedrock

This is the step most people miss. Bedrock models must be explicitly enabled before use.

1. Open the [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Make sure you're in your target region (the workshop uses **eu-central-2** / Zurich, but you can pick any region that supports Claude)
3. In the left sidebar, go to **Model access**
4. Click **Modify model access**
5. Select **Anthropic > Claude Haiku** (the workshop uses Claude Haiku 4.5)
6. Click **Next** and then **Submit**
7. Wait for the status to show **Access granted** (usually instant)

> **Note on regions:** The workshop defaults to `eu-central-2`. If you pick a different region, update the Pulumi config accordingly (`pulumi config set aws:region <your-region>`) and you may need to update the model ID in `src/lambda/handler.ts` if your region uses a different inference profile prefix.

---

## Local Tool Installation

### Node.js (v20+)

```bash
# macOS
brew install node@20

# Linux (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
```

### Pulumi CLI

```bash
curl -fsSL https://get.pulumi.com | sh
```

Add to your PATH if needed:
```bash
export PATH="$HOME/.pulumi/bin:$PATH"
```

### An AI Coding Agent

The workshop is designed to be done with an AI coding assistant. Pick one:

- **Claude Code** (recommended): `npm install -g @anthropic-ai/claude-code`
- **GitHub Copilot CLI**: `npm install -g @github/copilot`
- Or use any AI assistant you prefer (Cursor, Windsurf, etc.)

---

## Running the Workshop

Once everything above is set up, follow the main [README.md](./README.md) starting from **"Install dependencies"**. The steps are the same — the only difference is you're using your local machine instead of the cloud environment.

Quick recap:

```bash
# Install dependencies
npm install
cd src/lambda && npm install && cd ../..
cd infra && npm install && cd ..

# Build
cd src/lambda && npm run build && cd ../..
npm run build

# Deploy
cd infra
pulumi login --local
pulumi stack init dev
pulumi config set aws:region eu-central-2
pulumi up
```

---

## Troubleshooting

### "Access denied" on Bedrock calls
You haven't enabled model access. See [step 4 above](#4-enable-claude-on-aws-bedrock).

### "Could not find model" or model ID errors
The model ID in the Lambda (`eu.anthropic.claude-haiku-4-5-20251001-v1:0`) uses a European cross-region inference profile. If you're deploying to a non-EU region, you may need to change the prefix from `eu.` to `us.` (for US regions) in `src/lambda/handler.ts`.

### Pulumi says "stack already exists"
You already have a `dev` stack. Either use it (`pulumi stack select dev`) or pick a different name (`pulumi stack init mystack`).

### Lambda timeout or out of memory
The default Lambda configuration should be fine. If you see timeouts on Bedrock calls, check that your region has Bedrock available and the model is enabled.

---

## Cleaning Up

Don't forget to tear down your AWS resources when you're done:

```bash
cd infra
pulumi destroy
pulumi stack rm dev
```

And if you created an AWS access key just for this workshop, delete it in the IAM console.
