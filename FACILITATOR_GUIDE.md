# Facilitator Guide — AI-Assisted Cloud Development Workshop

## Overview

**Duration:** ~65 minutes
**Goal:** Students build the same cloud app twice with AI — first unstructured, then structured — and see the difference firsthand.

**Key learning outcome:** AI amplifies your process. Structure in, quality out.

---

## Before the Workshop

### Environment
- Each student has an EC2 instance (Amazon Linux 2023) with IAM role for AWS access
- Or: students use their own machines with AWS credentials configured

### Pre-check
Students should have run:
```bash
./setup.sh && source ~/.bashrc
gh auth login
```

Verify: `node --version`, `pulumi version`, `gh --version`, `copilot --version`, `aws sts get-caller-identity`

---

## Setup Phase (~5 min)

- Have students fork and clone the repo
- Run `npm install` on the root
- Quick show of hands: who has used AI coding tools before?

---

## Phase 1: "The Cowboy" (~25 min)

### Setup
```bash
git checkout phase-1
npm install
```

### What students get
- `REQUIREMENTS.md` — PM-style product brief with tech hints
- Minimal scaffold (config files, no app code)
- **No AI context files, no workflow**

### What to tell students
> "You have 25 minutes. Your job: build and deploy a task manager to AWS. Use Copilot CLI however you want. The requirements are in REQUIREMENTS.md. Go."

### What to watch for
- Students who dive straight into code vs. those who plan first
- Common AI mistakes: hallucinated APIs, wrong Pulumi patterns, missing CORS headers
- Students spending most of their time debugging rather than building
- Frustration levels — this is expected and part of the learning

### Common issues students will hit
| Issue | Cause |
|-------|-------|
| Pulumi type errors | AI generates wrong resource properties |
| Lambda handler doesn't work | Wrong event parsing, missing CORS headers |
| Frontend can't call API | Missing NEXT_PUBLIC_API_URL, CORS issues |
| Build fails | AI forgets `output: "export"` in next.config |
| Deploy fails | IAM permissions missing, wrong runtime |

### At 20 minutes
Give a 5-minute warning. Most students won't have a fully working app — that's fine.

### Checkpoint questions (ask the group)
- "How many got a fully deployed, working app?" (expect: very few)
- "What did you spend most of your time on?" (expect: debugging)
- "Did the AI get things right on the first try?" (expect: no)

---

## Phase 2: "The Engineer" (~25 min)

### Setup
```bash
git checkout phase-2
npm install
```

### What to tell students
> "Same challenge, fresh start. But this time, read WORKFLOW.md first. Follow the three steps. The AI now has project context — let it use it."

### Key differences to point out
- `.github/copilot-instructions.md` gives the AI architecture knowledge
- `WORKFLOW.md` provides a simple methodology: Understand → Plan → Build & Verify
- The scaffold is identical — only the AI context is different

### What to watch for
- Students following the workflow vs. skipping steps
- AI producing more consistent, correct code
- Less back-and-forth debugging
- Students finishing further in the same time

### At 20 minutes
Give a 5-minute warning.

### Checkpoint questions (same as Phase 1)
- "How many got a fully deployed, working app?" (expect: more than Phase 1)
- "How many iterations this time?" (expect: fewer)
- "What felt different?" (expect: "AI seemed to know what I wanted")

---

## Wrap-Up Discussion (~10 min)

### Key questions to drive the conversation

**1. "What was different between Phase 1 and Phase 2?"**
- Let students share their experience
- Common answers: "less debugging", "AI was more consistent", "I had a plan"

**2. "Was the AI smarter in Phase 2?"**
- No! Same tool, same model
- The difference: better context (instructions file) and better process (workflow)

**3. "What made the biggest difference — the context file or the workflow?"**
- Both matter, but for different reasons:
  - **Context file** → AI produces code that fits the project (right patterns, right conventions)
  - **Workflow** → You catch mistakes early, build incrementally, don't skip steps

**4. "How does this apply to your real work?"**
- Invest time in context files for your projects
- Follow a structured process, even a simple one
- AI is a tool — it's only as good as the instructions you give it

### Takeaways to emphasize
1. **AI amplifies your process** — chaos in → chaos out; structure in → quality out
2. **Context is everything** — writing good instructions is like onboarding a new team member
3. **Simple workflows work** — you don't need a complex methodology, just: understand, plan, verify
4. **Cloud deployment is achievable** — with the right approach, AI can help you deploy real infrastructure

### Optional: show the solution
```bash
git checkout solution
```
Walk through the reference implementation. Show how it compares to what students built.

---

## Timing Summary

| Phase | Duration | Key Activity |
|-------|----------|-------------|
| Setup | 5 min | Environment check, clone repo |
| Phase 1 | 25 min | Unstructured AI development |
| Phase 2 | 25 min | Structured AI development |
| Wrap-up | 10 min | Discussion and takeaways |
| **Total** | **~65 min** | |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Copilot CLI not found | `npm install -g @github/copilot` |
| AWS credentials missing | Check IAM role on EC2, or `aws configure` |
| Pulumi login issues | `pulumi login --local` for local state |
| npm install fails | `rm -rf node_modules package-lock.json && npm install` |
| Student stuck in Phase 1 | Let them struggle — it's the point. Offer a hint if they're completely blocked. |
| Student finishes Phase 1 early | Ask them to document what went well/wrong before starting Phase 2 |
