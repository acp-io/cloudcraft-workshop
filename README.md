# CloudCraft Workshop — AI-Assisted Cloud Development

Build a cloud-based task manager on AWS — using AI as your coding partner.

## What You'll Learn

This workshop has two phases. You'll build the **same app twice**, with the same AI tool, but with a very different approach:

| | Phase 1: "The Cowboy" | Phase 2: "The Engineer" |
|---|---|---|
| **What you get** | Product requirements + tech hints | Same requirements + AI context files + structured workflow |
| **How you work** | However you want | Following a 3-step methodology |
| **Expected result** | Frustration, partial success | Cleaner code, faster progress |

**The takeaway:** AI amplifies your process. Structure in, quality out.

---

## Prerequisites

- **Node.js 20+** — `node --version`
- **Pulumi CLI** — `pulumi version`
- **GitHub CLI** — `gh --version`
- **GitHub Copilot CLI** — `copilot --version`
- **AWS credentials** — `aws sts get-caller-identity`

### EC2 Quick Setup

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
gh repo clone <your-username>/cloudcraft-workshop
cd cloudcraft-workshop
```

### 3. Install dependencies

```bash
npm install
```

---

## Phase 1: The Cowboy (~25 min)

**Goal:** Build and deploy the task manager using AI, with no structured approach.

```bash
git checkout phase-1
npm install
```

1. Read `REQUIREMENTS.md` — this is your product brief
2. Open Copilot CLI: `copilot`
3. Build the app using AI however you want
4. Try to deploy it to AWS with Pulumi

That's it. No rules, no guidance files. Go.

---

## Phase 2: The Engineer (~25 min)

**Goal:** Build the same app, from scratch, but this time with structure.

```bash
git checkout phase-2
npm install
```

1. Read `REQUIREMENTS.md` — same requirements as Phase 1
2. Read `WORKFLOW.md` — your 3-step methodology
3. Open Copilot CLI: `copilot`
4. **Follow the workflow:** Understand → Plan → Build & Verify
5. The AI now has project context (`.github/copilot-instructions.md`) — let it use it

Notice the difference.

---

## Wrap-Up Discussion

After both phases, compare your experience:

- Did your app deploy successfully in Phase 1? Phase 2?
- How many back-and-forth iterations did you need each time?
- What felt different about the structured approach?

**Key insight:** The AI didn't get smarter between phases — you gave it better context and followed a better process.

---

## Cleaning Up

```bash
cd infra
pulumi destroy
```

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
| **AWS S3 + CloudFront** | Static hosting + CDN |
| **GitHub Copilot CLI** | AI coding assistant |
