# CloudCraft Workshop — TaskFlow

Build a modern task manager, deploy it to AWS, and add AI superpowers — all in about an hour.

## What You'll Build

**TaskFlow** is a sleek to-do app. You'll start with a working local version, then switch to exercise branches that add cloud infrastructure and AI features. Each exercise has TODO placeholders where you'll write real code.

---

## Prerequisites

Before you begin, make sure the following are installed on your machine:

- **Node.js 20+** — verify with `node --version`
- **Pulumi CLI** — verify with `pulumi version`
- **GitHub CLI** — verify with `gh --version`
- **AWS credentials** — Your EC2 instance already has these via its IAM role. Verify with: `aws sts get-caller-identity`

### EC2 Quick Setup

You're on an Amazon Linux 2023 EC2 instance, run the setup script to install all prerequisites at once:

```bash
chmod +x setup.sh
./setup.sh
source ~/.bashrc
```

The script installs Node.js 20 (via nvm), Pulumi CLI, and GitHub CLI. It's safe to re-run — it skips tools that are already installed.

---

## Getting Started

### 1. Authenticate with GitHub

This lets you clone your fork and push changes from your EC2 instance:

```bash
gh auth login
```

Follow the prompts: select **GitHub.com**, choose **HTTPS**, and authenticate via **browser**. You'll get a one-time code to enter at [github.com/login/device](https://github.com/login/device).

### 2. Fork and clone the repo

Go to the workshop repo on GitHub and click **Fork**. Then clone your fork:

```bash
gh repo clone <your-username>/cloudcraft-workshop
cd cloudcraft-workshop
```

### 3. Install dependencies and start the app

```bash
npm install
npm run dev
```

### 4. Open the app

Go to [http://localhost:3000](http://localhost:3000) in your browser. You should see the TaskFlow app — try adding, completing, and deleting some tasks. Right now everything is stored in your browser's localStorage.

---

## Exercise 1: Deploy to AWS (~20 min)

**Goal:** Move your app from localhost to the cloud. You'll deploy a real backend with a database, serverless API, and a globally distributed frontend.

### What you'll get

| Service | What it does |
|---------|-------------|
| **DynamoDB** | Stores your tasks in a cloud database |
| **Lambda** | Runs your API code without managing servers |
| **API Gateway** | Gives your Lambda function a public URL |
| **S3** | Hosts your frontend files (HTML, CSS, JS) |
| **CloudFront** | CDN that serves your app fast, worldwide |

### Steps

**Step 1** — Switch to the exercise branch and install dependencies:

```bash
git checkout exercise-1
npm install
```

**Step 2** — Explore the new files. Open these and read through them:

- `infra/index.ts` — The Pulumi program that defines all your AWS resources. Each section has a comment explaining what it does and why.
- `src/lambda/handler.ts` — Your serverless API. It handles GET/POST/PUT/DELETE requests for todos.
- `src/hooks/useTodos.ts` — Compare with the previous version — it now fetches from an API instead of localStorage.

### Your Turn — Code TODOs

**Step 3** — You'll find **3 TODO placeholders** where you need to write real code:

| File | TODO | What to implement |
|------|------|-------------------|
| `infra/index.ts` | TODO #1 | Create the DynamoDB table resource (~5 lines) |
| `infra/index.ts` | TODO #2 | Create the Lambda function resource (~14 lines) |
| `src/lambda/handler.ts` | TODO #3 | Implement the `createTodo()` function body (~12 lines) |

**Reference patterns:**
- For TODO #1 & #2: Look at the S3 bucket resource in the same file for the Pulumi pattern
- For TODO #3: Look at `deleteTodo()` in the same file for the DynamoDB command pattern

Complete all 3 TODOs before building and deploying. The hints in each TODO will guide you!

**Step 4** — Build the Lambda function:

```bash
cd src/lambda
npm install
npm run build
cd ../..
```

**Step 5** — Build the frontend for static hosting:

```bash
npm run build
```

This creates an `out/` folder with your static site.

**Step 6** — Set up Pulumi and deploy everything to AWS:

```bash
cd infra
npm install
pulumi login --local
pulumi stack init dev
pulumi up
```

Pulumi will show you all the resources it wants to create. Review them, then confirm with **yes**. This takes a few minutes.

**Step 7** — Visit your app! Copy the `siteUrl` from the Pulumi outputs — your app is now live on the internet.

---

## Exercise 2: AI Chatbot (~20 min)

**Goal:** Add an AI-powered chat assistant that knows about your tasks and can help you manage them.

### What you'll get

- A chat side panel alongside your to-do list
- Streaming responses from Claude (via AWS Bedrock)
- The AI knows about your current tasks and can help you organize them

### Steps

**Step 1** — Switch to the exercise branch and install dependencies:

```bash
git checkout exercise-2
npm install
```

**Step 2** — Explore the new files:

- `src/components/ChatPanel.tsx` — The chat UI with scrollable messages and input
- `src/hooks/useChat.ts` — Handles sending messages and streaming the AI response
- `src/lambda/handler.ts` — New `/chat` route that calls Claude via Bedrock. Notice the system prompt that includes your current tasks.
- `src/components/TodoApp.tsx` — Two-column layout with a chat toggle button

### Your Turn — Code TODOs

**Step 3** — You'll find **3 TODO placeholders** where you need to write real code:

| File | TODO | What to implement |
|------|------|-------------------|
| `src/lambda/handler.ts` | TODO #1 | Build the `buildSystemPrompt()` function — inject task context into the AI prompt (~8 lines) |
| `src/lambda/handler.ts` | TODO #2 | Call the Anthropic API and consume the streaming response in `chat()` (~12 lines) |
| `src/components/TodoApp.tsx` | TODO #3 | Add chat toggle state, button, and `<ChatPanel>` render (~10 lines) |

**Reference patterns:**
- For TODO #1: The function signature and return type are there — you just need the body
- For TODO #2: Look at `createTodo()` for the async/await pattern; the `anthropic` client is initialized at the top
- For TODO #3: `ChatPanel` is already imported; look at it in `src/components/ChatPanel.tsx` to see what props it needs

Complete all 3 TODOs before building and deploying. The hints in each TODO will guide you!

**Step 4** — Rebuild and redeploy:

```bash
cd src/lambda && npm install && npm run build && cd ../..
npm run build
cd infra && pulumi up
```

**Step 5** — Open your CloudFront URL. Click "AI Chat" and ask the assistant about your tasks!

---

## Exercise 3: Smart AI Features (stretch, ~15 min)

**Goal:** Make your app smarter — tasks automatically get categorized and prioritized by AI, and you can ask AI for task suggestions.

### What you'll get

- **Auto-categorize**: When you add a task, AI assigns a category (work, personal, shopping, health, learning) and priority (high, medium, low)
- **Task suggestions**: A "Suggest Tasks" button that asks AI for related tasks
- Color-coded badges for categories and priorities

### Steps

**Step 1** — Switch to the exercise branch:

```bash
git checkout exercise-3
```

**Step 2** — Explore the new files:

- `src/types/todo.ts` — New `Priority` and `Category` types added to `Todo`
- `src/lambda/handler.ts` — New `/categorize` and `/suggest` routes. Look at the system prompts — they use structured JSON output.
- `src/components/CategoryBadge.tsx` & `PriorityBadge.tsx` — Color-coded badge components
- `src/components/TodoApp.tsx` — "Suggest Tasks" button with inline suggestion cards

### Your Turn — Code TODOs

**Step 3** — You'll find **3 TODO placeholders** where you need to write real code:

| File | TODO | What to implement |
|------|------|-------------------|
| `src/lambda/handler.ts` | TODO #1 | Implement `categorize()` — call Claude to classify a task and parse the JSON response (~15 lines) |
| `src/lambda/handler.ts` | TODO #2 | Implement `suggest()` — call Claude to suggest 3 new tasks based on existing ones (~15 lines) |
| `src/hooks/useTodos.ts` | TODO #3 | Implement `suggestTodos()` — call the `/suggest` API endpoint from the frontend (~10 lines) |

**Reference patterns:**
- For TODO #1 & #2: Look at `chat()` in the same file for the Anthropic API call pattern (non-streaming this time)
- For TODO #3: Look at `addTodo()` in the same file for the fetch POST pattern

Complete all 3 TODOs before building and deploying. The hints in each TODO will guide you!

**Step 4** — Rebuild and redeploy:

```bash
cd src/lambda && npm install && npm run build && cd ../..
npm run build
cd infra && pulumi up
```

**Step 5** — Try adding a task like "Buy groceries for dinner" and watch it auto-categorize. Hit "Suggest Tasks" to see AI recommendations.

---

## Cleaning Up

When you're done, tear down all AWS resources:

```bash
cd infra
pulumi destroy
```

---

## Tech Stack

| Technology | Role |
|-----------|------|
| **Next.js 14** (App Router) | Frontend framework |
| **TypeScript** | Type-safe code |
| **Tailwind CSS** | Styling (dark theme, glass-morphism) |
| **Pulumi** | Infrastructure as Code |
| **AWS DynamoDB** | NoSQL database |
| **AWS Lambda** | Serverless compute |
| **AWS API Gateway** | HTTP API routing |
| **AWS S3 + CloudFront** | Static hosting + CDN |
| **AWS Bedrock (Claude)** | AI assistant |
