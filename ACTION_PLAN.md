# ACTION PLAN: CloudCraft Workshop — TaskFlow

**Date:** 2026-03-03
**Branch:** main (then exercise-1, exercise-2, exercise-3)
**Related Work:** None — greenfield project

---

## Overview

Build the **cloudcraft-workshop** workshop repo with a polished to-do app called "TaskFlow" (Next.js 14+, TypeScript, Tailwind CSS) and exercise branches for AWS deployment (Pulumi), AI chatbot (Bedrock), and smart AI features.

---

## Stage 1: Project Setup & CLAUDE.md Customization

### Tasks
- [x] 1.1 Customize CLAUDE.md with TaskFlow project details
- [x] 1.2 Update .gitignore for Node.js/Next.js/Pulumi
- [x] 1.3 Initialize Next.js project (package.json, tsconfig, next.config, tailwind.config, postcss.config)

### Verification
- CLAUDE.md reflects correct tech stack and directories
- .gitignore covers node_modules, .next, out/, infra/node_modules

---

## Stage 2: Main Branch — To-Do App Skeleton

### Tasks
- [x] 2.1 Create types: `src/types/todo.ts`
- [x] 2.2 Create hook: `src/hooks/useTodos.ts` (localStorage CRUD)
- [x] 2.3 Create components: TodoInput, TodoItem, TodoList, TodoApp
- [x] 2.4 Create pages: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- [x] 2.5 Configure Tailwind: dark theme, Inter font, glass-morphism design
- [x] 2.6 Scaffold Pulumi: `infra/Pulumi.yaml`, `infra/Pulumi.dev.yaml`, `infra/package.json`, `infra/tsconfig.json`, `infra/index.ts` (empty exports)
- [x] 2.7 Write README.md with workshop instructions

### Verification
- [x] `npm install && npm run dev` runs successfully on localhost:3000 (HTTP 200)
- [x] `npm run build` compiles successfully (4 static pages)
- [x] Pulumi scaffold exists with valid config
- [ ] Commit main branch

**WORK SUMMARY — Stage 2:**
- Used `next.config.mjs` (not `.ts`) since Next.js 14.2 doesn't support TS config
- Build output: 88.9 kB first load JS, compiled successfully
- Dev server: Ready in 955ms, compiled / in 1112ms

---

## Stage 3: Exercise-1 Branch — AWS Deployment

### Tasks
- [ ] 3.1 Create `exercise-1` branch from main
- [ ] 3.2 Create Lambda handler: `src/lambda/handler.ts` (CRUD on DynamoDB)
- [ ] 3.3 Create Lambda package.json and tsconfig.json
- [ ] 3.4 Update `src/hooks/useTodos.ts` to use API Gateway fetch
- [ ] 3.5 Update `next.config.ts` with `output: 'export'`
- [ ] 3.6 Update root `package.json` with build scripts and AWS SDK deps
- [ ] 3.7 Write full `infra/index.ts`: DynamoDB, Lambda, API GW, S3, CloudFront, IAM, outputs
- [ ] 3.8 Update README for exercise-1

### Verification
- Merge exercise-1 into main is conflict-free
- `npm run build` produces static export
- Pulumi program is syntactically valid (TypeScript compiles)
- Commit exercise-1 branch

---

## Stage 4: Exercise-2 Branch — AI Chatbot

### Tasks
- [ ] 4.1 Create `exercise-2` branch from exercise-1
- [ ] 4.2 Create chat components: ChatPanel, ChatMessage, ChatInput
- [ ] 4.3 Create chat hook: `src/hooks/useChat.ts`
- [ ] 4.4 Update TodoApp.tsx for two-column layout + chat toggle
- [ ] 4.5 Update page.tsx to widen to max-w-7xl
- [ ] 4.6 Add `/chat` POST route to Lambda handler with Bedrock streaming
- [ ] 4.7 Update Lambda package.json with `@anthropic-ai/bedrock-sdk`
- [ ] 4.8 Update `infra/index.ts`: chat DynamoDB table, Bedrock IAM, /chat route
- [ ] 4.9 Update README for exercise-2

### Verification
- Merge exercise-2 into exercise-1 is conflict-free
- TypeScript compiles
- Chat UI renders alongside todo list
- Commit exercise-2 branch

---

## Stage 5: Exercise-3 Branch — Smart AI Features

### Tasks
- [ ] 5.1 Create `exercise-3` branch from exercise-2
- [ ] 5.2 Expand `src/types/todo.ts` with Priority, Category types
- [ ] 5.3 Add `/categorize` and `/suggest` Lambda routes
- [ ] 5.4 Update TodoInput.tsx for auto-categorization
- [ ] 5.5 Update TodoApp.tsx with "Suggest tasks" button
- [ ] 5.6 Add category/priority badge components
- [ ] 5.7 Update infra/index.ts for new routes
- [ ] 5.8 Update README for exercise-3

### Verification
- Merge exercise-3 into exercise-2 is conflict-free
- TypeScript compiles
- UI shows category badges and priority indicators
- Commit exercise-3 branch

---

## Stage 6: Final Verification

### Tasks
- [ ] 6.1 Test fresh sequential merges: main → exercise-1 → exercise-2 → exercise-3
- [ ] 6.2 Verify `npm install && npm run dev` works on main
- [ ] 6.3 Verify `npm run build` works after exercise-1 merge
- [ ] 6.4 Verify UI is polished at every stage

---

## Implementation Notes

- All branches will be created with proper git branching
- Each exercise branch builds on the previous one
- Code uses modern Next.js 14+ App Router patterns
- Tailwind design: slate-950 bg, glass-morphism, purple-blue gradients, Inter font
- Lambda handler uses esbuild-compatible TypeScript
