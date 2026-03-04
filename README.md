# CloudCraft Workshop — AI-Assisted Cloud Development

Build a cloud-based task manager on AWS — using AI as your coding partner.

## What You'll Build

A **task management app** (TaskFlow) deployed to AWS — using AI as your coding partner. You'll learn how to use AI effectively for cloud development by building a full-stack serverless application.

---

## Environment Setup

Run the setup script to install all required tools (Node.js, Pulumi, GitHub CLI, Copilot CLI):

```bash
bash ./setup.sh
source ~/.bashrc
```

---

## Getting Started

### 1. Authenticate with GitHub

```bash
gh auth login
```

Follow the prompts: select **GitHub.com**, choose **HTTPS**, and authenticate via **browser**.

### 2. Fork and clone the repo

```bash
gh repo fork acp-io/cloudcraft-workshop --clone
cd cloudcraft-workshop
```

This creates a fork under your GitHub account and clones it locally.

### 3. Install dependencies

```bash
npm install
```

### 4. Start building

Follow the workshop instructions provided by your facilitator.

---

## Pulumi Basics

This workshop uses **Pulumi** to deploy infrastructure to AWS. Pulumi is an Infrastructure as Code (IaC) tool — you define cloud resources in TypeScript, and Pulumi creates, updates, and deletes them on AWS for you.

**Key concepts:**

- **Stack** — an isolated deployment environment (e.g., `dev`). Each student has their own stack.
- **State** — Pulumi tracks what resources exist so it can update them incrementally (add new ones, modify changed ones, remove deleted ones).
- **`pulumi up`** — preview and deploy changes to AWS.
- **`pulumi destroy`** — tear down all resources in the stack.

**Common commands:**

```bash
cd infra
npm install
pulumi login --local                       # Store state locally (no account needed)
pulumi stack init dev                      # Create a new stack called 'dev'
pulumi config set aws:region eu-central-2  # Set AWS region to Zurich
pulumi up                                  # Deploy infrastructure
pulumi destroy                             # Tear down everything
```

---

## Cleaning Up

When you're done with the workshop, destroy your AWS resources and remove the Pulumi stack:

```bash
cd infra
pulumi destroy                # Tear down all AWS resources
pulumi stack rm dev           # Remove the stack and its state
```

`pulumi destroy` removes all AWS resources (DynamoDB table, Lambda, API Gateway, S3 bucket). You'll be shown a preview of what will be deleted before confirming.

`pulumi stack rm` removes the stack itself and its local state file. This is optional but keeps things clean.

---

## Tech Stack

| Technology | Role |
|-----------|------|
| **Next.js 14** (static export) | Frontend framework |
| **TypeScript** | Type-safe code everywhere |
| **Tailwind CSS** | Styling (dark theme) |
| **Pulumi** | Infrastructure as Code |
| **AWS DynamoDB** | NoSQL database |
| **AWS Lambda** | Serverless compute |
| **AWS API Gateway** | HTTP API routing |
| **AWS S3** | Static website hosting |
