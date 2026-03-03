# CloudCraft Workshop — TaskFlow

Build a modern task manager and deploy it to AWS with AI superpowers.

## Quick Start (Local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your to-do app is running locally with localStorage.

---

## Exercise 1: Deploy to AWS (~20 min)

```bash
git fetch origin
git merge origin/exercise-1
npm install
```

**Walk-through:**
1. Explore `infra/index.ts` — each AWS resource is explained
2. Explore `src/lambda/handler.ts` — your serverless API
3. Deploy: `cd infra && npm install && pulumi up`
4. Visit the CloudFront URL from the stack outputs

**What you'll deploy:**
- DynamoDB table for storing tasks
- Lambda function running your API
- API Gateway routing HTTP requests
- S3 bucket hosting your frontend
- CloudFront CDN serving everything globally

---

## Exercise 2: AI Chatbot (~20 min)

```bash
git merge origin/exercise-2
npm install
cd infra && pulumi up
```

**What's added:**
- Chat side panel with streaming AI responses
- Claude via AWS Bedrock — context-aware assistant
- Chat knows about your current tasks

**Files to explore:**
- `src/lambda/handler.ts` — the `/chat` route
- `src/components/ChatPanel.tsx` — chat UI
- `src/hooks/useChat.ts` — streaming logic

---

## Exercise 3: Smart AI Features (stretch, ~15 min)

```bash
git merge origin/exercise-3
cd infra && pulumi up
```

**What's added:**
- Auto-categorization of new tasks (AI assigns category + priority)
- "Suggest tasks" button for AI-powered recommendations
- Category badges and priority indicators

---

## Tech Stack

- **Next.js 14+** (App Router) + TypeScript
- **Tailwind CSS** — dark theme with glass-morphism design
- **Pulumi** — Infrastructure as Code (TypeScript)
- **AWS** — DynamoDB, Lambda, API Gateway, S3, CloudFront, Bedrock
- **Claude** — AI assistant via `@anthropic-ai/bedrock-sdk`
