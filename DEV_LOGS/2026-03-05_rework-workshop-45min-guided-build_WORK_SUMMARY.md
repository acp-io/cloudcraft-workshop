# ACTION_PLAN: Rework Workshop for 45-Minute Guided Build

**Date:** 2026-03-05
**Branch:** main
**Related Work:** Existing solution branch (complete TaskFlow app), existing FACILITATOR_GUIDE.md on main

---

## Objective

Rework the `main` branch into a guided 45-minute workshop where students:
1. Deploy a pre-built starter todo app to AWS
2. Implement 3 features using GitHub Copilot CLI (delete, toggle complete, AI categorization)
3. Follow a structured Research → Plan → Build → Verify methodology manually
4. Receive a reusable `workflow.md` context file at the end that encodes this methodology for any AI agent

---

## Workshop Structure (45 minutes)

| Phase | Time | Activity |
|-------|------|----------|
| Intro | 3 min | Demo finished app, overview of what we're building |
| Deploy Starter | 7 min | Walk through first Pulumi deployment (hands-on cloud intro) |
| Research | 5 min | Explore codebase with Copilot, understand AWS services |
| Plan | 3 min | Generate a plan for feature implementation |
| Build | 20 min | Implement 3 features with Copilot (delete → toggle → AI categorize) |
| Verify + Reveal | 7 min | Test features, present workflow.md as the takeaway |

---

## What the Starter App Includes (pre-built on `main`)

### Infrastructure (complete — students don't modify)
- DynamoDB table
- Lambda function with IAM role
- API Gateway (HTTP)
- S3 static website hosting
- Bedrock IAM policy (for Feature 3)

### Lambda Handler (partial)
- `GET /todos` — fetch all todos ✅
- `POST /todos` — create a todo ✅
- `PUT /todos/{id}` — **STUB: returns 501 Not Implemented**
- `DELETE /todos/{id}` — **STUB: returns 501 Not Implemented**
- `POST /categorize` — **STUB: returns 501 Not Implemented**
- CORS headers, helper functions for Bedrock — ✅ included

### Frontend (partial)
- TodoApp, TodoInput, TodoList — ✅ working (add + display)
- TodoItem — **simplified: no toggle checkbox, no delete button** (just displays text)
- useTodos hook — **has addTodo + fetchTodos only; toggleTodo, deleteTodo, categorizeTodo are stubs**
- Types — **basic Todo without category/priority fields**
- CategoryBadge, PriorityBadge, ChatPanel, useChat — **NOT included** (Chat is out of scope; badges come with Feature 3)

### API Gateway Routes (in Pulumi)
- All routes pre-registered (including PUT, DELETE, POST /categorize) so students don't need to touch infra

---

## Three Features Students Implement

### Feature 1: Delete a Todo
- **Lambda:** Implement `deleteTodo()` function (DynamoDB DeleteCommand)
- **Frontend:** Add delete button to TodoItem component
- **Hook:** Implement `deleteTodo()` in useTodos (DELETE fetch + state update)
- **Cloud learning:** DynamoDB delete operations, REST DELETE method

### Feature 2: Toggle Complete
- **Lambda:** Implement `updateTodo()` function (DynamoDB UpdateCommand)
- **Frontend:** Add toggle checkbox to TodoItem component, strikethrough styling
- **Hook:** Implement `toggleTodo()` in useTodos (PUT fetch + state update)
- **Cloud learning:** DynamoDB update expressions, REST PUT method

### Feature 3: AI Categorization (stretch goal)
- **Lambda:** Implement `categorize()` function (Bedrock InvokeModelCommand)
- **Frontend:** Add CategoryBadge + PriorityBadge components, render in TodoItem
- **Hook:** Implement `categorizeTodo()` in useTodos, call after addTodo
- **Types:** Add `category` and `priority` fields to Todo type
- **Cloud learning:** AWS Bedrock, AI model invocation, prompt engineering

---

## Stages of Work

### Stage 1: Create Starter App Files on `main` — COMPLETE
**Tasks:**
- [x] 1.1 Create starter `src/types/todo.ts` (basic, no category/priority)
- [x] 1.2 Create starter `src/lambda/handler.ts` (GET + POST working, PUT/DELETE/categorize as stubs)
- [x] 1.3 Create starter `src/lambda/package.json` and `src/lambda/tsconfig.json`
- [x] 1.4 Create starter `src/hooks/useTodos.ts` (addTodo + fetchTodos only, stubs for rest)
- [x] 1.5 Create starter `src/components/TodoInput.tsx` (same as solution)
- [x] 1.6 Create starter `src/components/TodoItem.tsx` (simplified — display only, no toggle/delete)
- [x] 1.7 Create starter `src/components/TodoList.tsx` (simplified — no onToggle/onDelete)
- [x] 1.8 Create starter `src/components/TodoApp.tsx` (simplified — no chat, no suggestions, no toggle/delete)
- [x] 1.9 Create `src/app/page.tsx`
- [x] 1.10 Create `infra/index.ts` (complete infra — all routes pre-registered)
- [x] 1.11 Create `infra/Pulumi.dev.yaml`
- [x] 1.12 `next.config.mjs` already has `output: "export"` — no change needed
- [x] 1.13 `setup.sh` already correct — no change needed
- [x] 1.14 Updated `.gitignore` for lambda node_modules/lock + infra lock

### Stage 2: Create Workshop Documentation — COMPLETE
**Tasks:**
- [x] 2.1 Create `REQUIREMENTS.md` — product brief describing the 3 features
- [x] 2.2 Create `FACILITATOR_GUIDE.md` — new 45-min workshop guide
- [x] 2.3 Update `README.md` — student-facing setup + deployment walkthrough
- [x] 2.4 Create `workflow.md` — the generic reusable agent workflow file (the reveal/deliverable)

### Stage 3: Verify — COMPLETE
**Tasks:**
- [x] 3.1 All builds pass: frontend (Next.js static export), Lambda (esbuild), infra (tsc --noEmit)
- [x] 3.2 22 TODO comments across 7 files, clearly labeled by feature [Feature 1/2/3]
- [x] 3.3 Solution branch is unaffected (separate commit history, no shared file changes)
- [x] 3.4 Documentation reviewed: README has full deployment walkthrough, FACILITATOR_GUIDE has timing + scripts + troubleshooting, REQUIREMENTS has acceptance criteria, workflow.md has 4-phase methodology with tool placement table

### Build Verification Output
```
Frontend:  ✓ Compiled successfully, ✓ Generating static pages (4/4)
Lambda:    dist/handler.js 3.9kb, ⚡ Done in 1ms
Infra:     tsc --noEmit passed with no errors
```

---

## Key Design Decisions

1. **Infra is complete** — students focus on application code, not infrastructure wiring. Cloud discovery happens through reading the infra code during Research phase.

2. **Lambda stubs return 501** — makes it obvious what's not implemented. Students see "Not Implemented" in the browser console, which naturally guides them.

3. **API routes pre-registered** — avoids students needing to touch Pulumi at all. The routes exist, the Lambda just needs to handle them.

4. **Bedrock helpers pre-included** — `invokeModel()` function is already in handler.ts so students don't need to figure out Bedrock client setup. They just need to call it in the `categorize()` function.

5. **Feature 3 as stretch goal** — delete and toggle are achievable in 20 min. AI categorization adds Bedrock complexity and is there for fast students.

6. **`workflow.md` is NOT in the repo during the workshop** — students follow the phases manually. The file is only revealed at the end as "here's how you automate this process."

---

## Notes

- The `solution` branch remains unchanged as the reference implementation
- The `.claude/` directory and `CLAUDE.md` should NOT be on main (they're for the solution/dev workflow, not the student experience)
- Students use GitHub Copilot CLI, not Claude Code
- The `workflow.md` deliverable should be tool-agnostic in methodology but mention it can be placed in `.github/copilot-instructions.md` for Copilot
