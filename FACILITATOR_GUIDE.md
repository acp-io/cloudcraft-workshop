# Facilitator Guide — AI-Assisted Cloud Development Workshop

## Overview

**Duration:** 45 minutes
**Goal:** Students discover AWS cloud services by adding features to a pre-built todo app, using an AI coding agent (GitHub Copilot CLI) with a structured methodology.

**Key learning outcomes:**
1. Understand how serverless cloud services (DynamoDB, Lambda, API Gateway, S3, Bedrock) work together
2. Experience a structured AI-assisted development workflow: Research → Plan → Build → Verify
3. Take home a reusable `workflow.md` that encodes this methodology for any AI agent

---

## Before the Workshop

### Environment
- Each student has an EC2 instance (Amazon Linux 2023) with IAM role for AWS access
- IAM policy must include Bedrock access for both foundation model AND inference profile:
  ```json
  {
    "Sid": "BedrockModelAccess",
    "Effect": "Allow",
    "Action": ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
    "Resource": [
      "arn:aws:bedrock:*::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0",
      "arn:aws:bedrock:*::inference-profile/eu.anthropic.claude-haiku-4-5-20251001-v1:0"
    ]
  }
  ```

### Pre-check
Students should have run:
```bash
./setup.sh && source ~/.bashrc
gh auth login
```

Verify: `node --version`, `pulumi version`, `gh --version`, `aws sts get-caller-identity`

---

## Workshop Flow

### Intro (3 min)

**Show the finished app** (deploy solution branch beforehand or use screenshots):
- Add a todo → it appears with a category badge and priority badge
- Check it off → strikethrough
- Delete it → gone
- "This is what you'll build. It runs on AWS — serverless, no servers to manage."

**Quick architecture overview** (30 seconds):
> "Your browser talks to S3 for the frontend. When you add a task, it calls API Gateway, which triggers a Lambda function, which stores it in DynamoDB. For AI categorization, Lambda calls Bedrock — that's AWS's AI service."

**Set expectations:**
> "You'll use Copilot CLI as your AI coding partner. But we're going to follow a structured process: Research, Plan, Build, Verify. At the end I'll show you how to encode this process into a file so AI follows it automatically."

---

### Deploy the Starter App (7 min)

Walk students through their first Pulumi deployment step by step. This is hands-on — don't rush it.

**1. Fork and clone** (if not already done):
```bash
gh repo fork <org>/cloudcraft-workshop --clone
cd cloudcraft-workshop
```

**2. Install all dependencies:**
```bash
npm install
cd src/lambda && npm install && npm run build && cd ../..
cd infra && npm install && cd ..
```

**3. Initialize Pulumi:**
```bash
cd infra
pulumi login --local
pulumi stack init dev
pulumi config set aws:region eu-central-2
```

> **Explain:** "Pulumi tracks your cloud resources as a 'stack'. `pulumi login --local` stores this state on your machine. `stack init dev` creates your environment."

**4. Build the frontend:**
```bash
cd ..
npm run build
```

> **Note:** The first deploy doesn't need `NEXT_PUBLIC_API_URL` — the frontend will build but API calls won't work until we set it. That's fine for now.

**5. Deploy:**
```bash
cd infra
pulumi up
```

> **Explain what's happening:** "Pulumi shows you a preview of everything it'll create. You can see DynamoDB, Lambda, API Gateway, S3 — these are all the cloud services. Type `yes` to deploy."

**6. Get the URLs:**
```bash
pulumi stack output apiEndpoint
pulumi stack output siteUrl
```

**7. Rebuild frontend with the API URL:**
```bash
cd ..
NEXT_PUBLIC_API_URL=$(cd infra && pulumi stack output apiEndpoint) npm run build
cd infra && pulumi up -y
```

**8. Test it:**
> "Open the site URL in your browser. Add a todo. It should appear in the list. That's your app running on AWS!"

**If students are stuck:** Walk through each command on the projector. The most common issue is forgetting `npm install` in one of the subdirectories.

---

### Phase 1: Research (5 min)

> "Before we write any code, let's understand what we're working with. Ask Copilot to help you explore."

**Guide students to:**
1. Ask Copilot: *"Explain the architecture of this project. What AWS services does it use and how do they connect?"*
2. Ask Copilot: *"Read the Lambda handler and explain what each endpoint does. Which ones are not implemented yet?"*
3. Read `REQUIREMENTS.md` for the three features they'll implement

**Key things students should discover:**
- The Lambda has stubs returning 501 for delete, update, and categorize
- DynamoDB stores todos with an `id` hash key
- The Bedrock `invokeModel()` helper is already written
- API Gateway routes are already registered — they just need the Lambda to handle them

---

### Phase 2: Plan (3 min)

> "Now ask Copilot to help you plan. Don't start coding yet — have it outline what files need to change and in what order."

**Suggested prompt:** *"Based on REQUIREMENTS.md, create a step-by-step plan to implement all three features. For each feature, list the exact files and functions that need to change."*

Students should arrive at something like:
1. Feature 1 (Delete): `handler.ts` → `useTodos.ts` → `TodoItem.tsx` → `TodoList.tsx` → `TodoApp.tsx`
2. Feature 2 (Toggle): Same files, different functions
3. Feature 3 (Categorize): `handler.ts` → `todo.ts` types → badge components → `useTodos.ts` → `TodoItem.tsx`

> "Having a plan means you know what to ask the AI for. Without it, you'd be guessing."

---

### Phase 3: Build (20 min)

> "Now execute your plan with Copilot. Work feature by feature. After each feature, rebuild and redeploy to test it."

**Suggested order:** Feature 1 → Feature 2 → Feature 3

**Rebuild & redeploy cycle:**
```bash
# After Lambda changes:
cd src/lambda && npm run build && cd ../../infra && pulumi up -y

# After frontend changes (run from project root):
NEXT_PUBLIC_API_URL=$(cd infra && pulumi stack output apiEndpoint) npm run build
cd infra && pulumi up -y
```

**Checkpoints:**

**~7 min mark — Feature 1 checkpoint:**
> "You should have delete working by now. If you're stuck, look at the TODO comments in the code — they tell you exactly what to do. If you're really stuck, check the `solution` branch: `git show solution:src/lambda/handler.ts`"

**~15 min mark — Feature 2 checkpoint:**
> "Toggle complete should be working. If you haven't started Feature 2 yet, focus on getting at least one feature fully working rather than rushing through all three. Quality over quantity."

**~18 min — Feature 3 guidance:**
> "Feature 3 uses AWS Bedrock — that's AI as a cloud service. The `invokeModel()` helper is already in the Lambda. You just need to prompt it and parse the response. If you're short on time, this is the stretch goal — it's okay to skip it."

**If students are completely stuck:** They can copy individual files from the solution branch:
```bash
git show solution:src/lambda/handler.ts > src/lambda/handler.ts
```

---

### Phase 4: Verify + The Reveal (7 min)

**Verify (2 min):**
> "Open your app. Test each feature:
> - Add a todo — does it appear?
> - Delete it — does it disappear?
> - Add another, toggle it complete — does it show strikethrough?
> - If you did Feature 3: does it get a category badge?"

**The Reveal (5 min):**

> "Let's step back. What process did we just follow?"

Write on board / show slide:
1. **Research** — understood the codebase and cloud services
2. **Plan** — mapped out what to change before touching code
3. **Build** — implemented feature by feature, testing along the way
4. **Verify** — tested everything works end-to-end

> "This process works. But you had to follow it manually. What if the AI agent could follow it *automatically* every time you start a new session?"

**Show `workflow.md`:**

> "This is a workflow file. It encodes the exact methodology you just used. When you put this file in your repo, AI agents like Copilot will follow these steps every time — research first, plan before coding, verify after building."

Show the file on screen. Walk through each phase briefly.

> "For Copilot specifically, you'd place this as `.github/copilot-instructions.md`. For other tools like Claude Code, it goes in `CLAUDE.md`. The methodology is the same — only the file name changes."

**Key takeaway:**
> "AI agents are powerful, but they're only as good as the process they follow. Structure in, quality out. This file is your template — adapt it to your own projects."

---

## Timing Summary

| Phase | Duration | Key Activity |
|-------|----------|-------------|
| Intro | 3 min | Demo finished app, architecture overview |
| Deploy Starter | 7 min | First Pulumi deployment, hands-on |
| Research | 5 min | Explore codebase with Copilot |
| Plan | 3 min | Generate implementation plan |
| Build | 20 min | Implement features with checkpoints |
| Verify + Reveal | 7 min | Test + show workflow.md |
| **Total** | **45 min** | |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `pulumi up` fails with region error | `pulumi config set aws:region eu-central-2` |
| AWS credentials missing | Check IAM role on EC2, or `aws configure` |
| `pulumi login` asks for token | Use `pulumi login --local` |
| Lambda 501 responses | The stubs haven't been implemented yet — that's the exercise |
| Frontend shows blank / loading forever | Check `NEXT_PUBLIC_API_URL` is set correctly before `npm run build` |
| Bedrock access denied | Check IAM policy includes inference profile ARN |
| `npm run build` fails | Check for TypeScript errors — read the error message carefully |
| Student completely stuck | Point them to `REQUIREMENTS.md` TODO hints or solution branch |
| `pulumi up` says "no changes" | Rebuild the Lambda or frontend before deploying |
| npm install fails | `rm -rf node_modules package-lock.json && npm install` |
