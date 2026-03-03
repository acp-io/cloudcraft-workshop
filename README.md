# TaskFlow — Reference Solution

This branch contains the **complete, working implementation** of the TaskFlow task manager. It's the reference solution for the workshop.

> **Students:** Don't look at this until you've attempted the exercise yourself! The learning happens in the struggle.

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

### 3. Environment setup

Run the setup script to install all required tools (Node.js, Pulumi, GitHub CLI):

```bash
bash ./setup.sh
source ~/.bashrc
```

### 4. Install dependencies

```bash
npm install
```

### 5. Switch to the solution branch

```bash
git checkout solution
```

---

## What's Here

### Frontend (Next.js + Tailwind)
- `src/app/page.tsx` — Main page rendering the TodoApp
- `src/components/TodoApp.tsx` — Main app component with chat toggle
- `src/components/TodoInput.tsx` — Task input form
- `src/components/TodoItem.tsx` — Individual task with complete/delete actions
- `src/components/TodoList.tsx` — Task list container
- `src/components/ChatPanel.tsx` — AI chat side panel
- `src/components/CategoryBadge.tsx` / `PriorityBadge.tsx` — Visual badges
- `src/hooks/useTodos.ts` — API-backed task state management
- `src/hooks/useChat.ts` — Chat with streaming AI responses
- `src/types/todo.ts` — TypeScript types

### Backend (Lambda + DynamoDB)
- `src/lambda/handler.ts` — Full CRUD API + AI chat, categorize, suggest endpoints

### Infrastructure (Pulumi)
- `infra/index.ts` — All AWS resources: DynamoDB, Lambda, API Gateway, S3

---

## How to Deploy

```bash
# 1. Build Lambda
cd src/lambda && npm install && npm run build && cd ../..

# 2. Build frontend
npm run build

# 3. Deploy infrastructure
cd infra && npm install && pulumi login --local && pulumi stack init dev && pulumi config set aws:region eu-central-2 && pulumi up
```

After deploying, get your API URL:

```bash
pulumi stack output apiEndpoint
pulumi stack output siteUrl
```

Then rebuild the frontend with your API URL and redeploy:

```bash
cd ..
NEXT_PUBLIC_API_URL=<your-api-endpoint> npm run build
cd infra && pulumi up -y
```

Replace `<your-api-endpoint>` with the `apiEndpoint` value from above.

The `siteUrl` output is your live app URL.

---

## Architecture

```
Browser → S3 (static website hosting) — frontend
       → API Gateway → Lambda → DynamoDB
                              → Bedrock (Claude Haiku 4.5)
```

## Note

This solution includes the full implementation:
1. Cloud deployment (DynamoDB, Lambda, API Gateway, S3)
2. AI chatbot (Bedrock/Claude streaming)
3. Smart features (auto-categorize, task suggestions)

---

## Pulumi Basics

Pulumi is an Infrastructure as Code (IaC) tool — you define cloud resources in TypeScript, and Pulumi creates, updates, and deletes them on AWS for you.

**Key concepts:**

- **Stack** — an isolated deployment environment (e.g., `dev`). Each student has their own stack.
- **State** — Pulumi tracks what resources exist so it can update them incrementally (add new ones, modify changed ones, remove deleted ones).
- **`pulumi up`** — preview and deploy changes to AWS.
- **`pulumi destroy`** — tear down all resources in the stack.

---

## Cleaning Up

When you're done, destroy your AWS resources and remove the Pulumi stack:

```bash
cd infra
pulumi destroy                # Tear down all AWS resources
pulumi stack rm dev           # Remove the stack and its state
```

`pulumi destroy` removes all AWS resources (DynamoDB table, Lambda, API Gateway, S3 bucket). You'll be shown a preview of what will be deleted before confirming.

`pulumi stack rm` removes the stack itself and its local state file. This is optional but keeps things clean.

---

## Running on Your Own Machine

Want to run this workshop outside of the provided cloud environment? See the [Self-Hosted Setup Guide](./SELF_HOSTED_SETUP.md) for instructions on setting up your own AWS account and local tools.
