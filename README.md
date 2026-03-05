# CloudCraft Workshop — AI-Assisted Cloud Development

Build a cloud-based task manager on AWS — using AI as your coding partner.

## What You'll Build

**TaskFlow** — a task management app deployed on AWS. You'll start with a working app that can add and display tasks, then implement three new features using GitHub Copilot CLI as your AI coding partner:

1. **Delete tasks** — remove tasks from DynamoDB
2. **Toggle complete** — mark tasks as done with DynamoDB updates
3. **AI categorization** — auto-categorize tasks using AWS Bedrock (Claude AI)

Along the way you'll discover how serverless cloud services work together: DynamoDB, Lambda, API Gateway, S3, and Bedrock.

### Architecture

```
Browser → S3 (static frontend)
        → API Gateway → Lambda → DynamoDB (task storage)
                                → Bedrock (AI categorization)
```

---

## Environment Setup

Run the setup script to install all required tools (Node.js, Pulumi, GitHub CLI):

```bash
bash ./setup.sh
source ~/.bashrc
```

Verify everything installed:

```bash
node --version    # Should be v20+
pulumi version    # Should show a version
gh --version      # Should show a version
aws sts get-caller-identity  # Should show your AWS account
```

---

## Getting Started

### 1. Fork the repository

1. Open the workshop repository in your browser: `https://github.com/acp-io/cloudcraft-workshop`
2. Click the **Fork** button in the top-right corner
3. Select your personal GitHub account as the destination
4. Wait for the fork to complete — you'll be redirected to your own copy

### 2. Clone your fork


```bash
git clone https://github.com/<your-username>/cloudcraft-workshop.git
cd cloudcraft-workshop
```

Replace `<your-username>` with your GitHub username.

### 3. Install dependencies

There are three separate packages to install — the frontend, the Lambda function, and the infrastructure:

```bash
npm install
cd src/lambda && npm install && cd ../..
cd infra && npm install && cd ..
```

---

## Deploy the Starter App

This section walks you through your first deployment to AWS using Pulumi.

### 1. Build the Lambda function

```bash
cd src/lambda
npm run build
cd ../..
```

This compiles the TypeScript Lambda handler into JavaScript that AWS can run.

### 2. Build the frontend

```bash
npm run build
```

This creates a static export of the Next.js app in the `out/` directory.

### 3. Initialize Pulumi

```bash
cd infra
pulumi login --local
pulumi stack init dev
pulumi config set aws:region eu-central-2
```

**What this does:**
- `pulumi login --local` — stores infrastructure state on your machine (no account needed)
- `pulumi stack init dev` — creates an isolated deployment environment called "dev"
- `pulumi config set aws:region eu-central-2` — tells Pulumi to deploy to the Zurich AWS region

### 4. Deploy to AWS

```bash
pulumi up
```

Pulumi will show you a preview of everything it's about to create:
- A **DynamoDB table** — your database
- A **Lambda function** — your API code
- An **API Gateway** — gives your Lambda a public URL
- An **S3 bucket** — hosts your frontend files
- **IAM roles** — permissions for Lambda to access DynamoDB and Bedrock

Review the preview and type **`yes`** to deploy.

### 5. Get your URLs

```bash
pulumi stack output apiEndpoint
pulumi stack output siteUrl
```

Save these — you'll need them.

### 6. Rebuild the frontend with your API URL

The frontend needs to know where your API lives. Rebuild with the API URL set:

```bash
cd ..
NEXT_PUBLIC_API_URL=$(cd infra && pulumi stack output apiEndpoint) npm run build
cd infra
pulumi up -y
```

### 7. Test it

Open the **site URL** in your browser. Add a todo — it should appear in the list. That's your app running on AWS!

---

## Your Mission

Read **`REQUIREMENTS.md`** for the three features you need to implement. Follow this process:

1. **Research** — explore the codebase, understand the architecture
2. **Plan** — map out what files and functions need to change
3. **Build** — implement features one at a time, deploy and test each one
4. **Verify** — confirm everything works end-to-end

### Build & Deploy Cycle

After making changes, rebuild and redeploy:

```bash
# After Lambda changes:
cd src/lambda && npm run build && cd ../../infra && pulumi up -y

# After frontend changes (from project root):
NEXT_PUBLIC_API_URL=$(cd infra && pulumi stack output apiEndpoint) npm run build
cd infra && pulumi up -y
```

### Stuck?

- Look for `TODO` comments in the code — they mark exactly where changes are needed
- Check the `solution` branch to see the completed code:
  ```bash
  git show solution:src/lambda/handler.ts    # See the finished Lambda
  git show solution:src/hooks/useTodos.ts    # See the finished hook
  ```

---

## Project Structure

```
cloudcraft-workshop/
├── src/
│   ├── app/              # Next.js pages (page.tsx, layout.tsx)
│   ├── components/       # React components (TodoApp, TodoItem, etc.)
│   ├── hooks/            # Custom hooks (useTodos)
│   ├── lambda/           # Lambda function (handler.ts)
│   └── types/            # TypeScript types (Todo)
├── infra/                # Pulumi infrastructure code (index.ts)
├── REQUIREMENTS.md       # Feature specs for the workshop
└── README.md             # You are here
```

---

## Pulumi Basics

**Pulumi** is an Infrastructure as Code (IaC) tool. You define cloud resources in TypeScript, and Pulumi creates, updates, and deletes them on AWS for you.

**Key concepts:**

- **Stack** — an isolated deployment environment (e.g., `dev`). Each student has their own stack.
- **State** — Pulumi tracks what resources exist so it can update them incrementally.
- **`pulumi up`** — preview and deploy changes to AWS.
- **`pulumi destroy`** — tear down all resources in the stack.

---

## Cleaning Up

When you're done with the workshop, destroy your AWS resources:

```bash
cd infra
pulumi destroy           # Tear down all AWS resources
pulumi stack rm dev      # Remove the stack and its state
```

`pulumi destroy` removes all AWS resources (DynamoDB table, Lambda, API Gateway, S3 bucket). You'll be shown a preview before confirming.

---

## Tech Stack

| Technology | Role |
|-----------|------|
| **Next.js 14** (static export) | Frontend framework |
| **TypeScript** | Type-safe code |
| **Tailwind CSS** | Styling (dark theme) |
| **Pulumi** | Infrastructure as Code |
| **AWS DynamoDB** | NoSQL database for tasks |
| **AWS Lambda** | Serverless API |
| **AWS API Gateway** | HTTP routing |
| **AWS S3** | Static website hosting |
| **AWS Bedrock** | AI model invocation (Claude) |
