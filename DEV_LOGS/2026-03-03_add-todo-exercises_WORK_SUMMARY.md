# ACTION_PLAN: Add TODO Exercises to Workshop Branches

**Date:** 2026-03-03
**Branch:** main (modifying exercise-1, exercise-2, exercise-3)
**Status:** COMPLETE

---

## Stage 1: Exercise-1 TODOs

### Task 1.1: DynamoDB table TODO in `infra/index.ts`
- [x] Replace DynamoDB table definition with TODO placeholder
- Status: COMPLETE

### Task 1.2: Lambda function TODO in `infra/index.ts`
- [x] Replace Lambda function resource with TODO placeholder
- Status: COMPLETE

### Task 1.3: createTodo() TODO in `src/lambda/handler.ts`
- [x] Replace createTodo body with TODO placeholder
- Status: COMPLETE

### Work Summary — Stage 1
- Replaced DynamoDB table with `const todosTable: aws.dynamodb.Table = null as any;` placeholder
- Replaced Lambda function with `const lambdaFunction: aws.lambda.Function = null as any;` placeholder
- Replaced createTodo body with `throw new Error("TODO: implement createTodo");`
- Each TODO has detailed steps and HINT pointing to nearby reference patterns
- `npx tsc --noEmit` passes clean

---

## Stage 2: Exercise-2 TODOs

### Task 2.1: buildSystemPrompt() TODO in `src/lambda/handler.ts`
- [x] Replace buildSystemPrompt body with TODO placeholder
- Status: COMPLETE

### Task 2.2: Chat streaming TODO in `src/lambda/handler.ts`
- [x] Replace Anthropic API call + streaming loop with TODO placeholder
- Status: COMPLETE

### Task 2.3: Chat toggle TODO in `src/components/TodoApp.tsx`
- [x] Replace chat toggle state + button + ChatPanel render with TODO placeholder
- Status: COMPLETE

### Work Summary — Stage 2
- buildSystemPrompt returns static string placeholder instead of dynamic prompt
- chat() returns placeholder string instead of calling Anthropic API
- TodoApp.tsx stripped of showChat state, toggle button, and ChatPanel render
- Imports kept intact (useState, ChatPanel) so students just add the wiring
- `npx tsc --noEmit` passes clean

---

## Stage 3: Exercise-3 TODOs

### Task 3.1: categorize() TODO in `src/lambda/handler.ts`
- [x] Replace categorize body with TODO placeholder
- Status: COMPLETE

### Task 3.2: suggest() TODO in `src/lambda/handler.ts`
- [x] Replace suggest body with TODO placeholder
- Status: COMPLETE

### Task 3.3: suggestTodos() TODO in `src/hooks/useTodos.ts`
- [x] Replace suggestTodos body with TODO placeholder
- Status: COMPLETE

### Work Summary — Stage 3
- categorize() returns default `{ category: "other", priority: "medium" }` placeholder
- suggest() returns default `{ suggestions: [] }` placeholder
- suggestTodos() returns `[]` placeholder
- Rebased exercise-3 onto updated exercise-2 to avoid merge conflicts
- Restored working buildSystemPrompt() and chat() on exercise-3 (students solve those in exercise-2)
- `npx tsc --noEmit` passes clean

---

## Stage 4: README Updates

### Task 4.1: Update README on all branches
- [x] Added "Your Turn" subsection to Exercise 1 (3 TODOs listed)
- [x] Added "Your Turn" subsection to Exercise 2 (3 TODOs listed)
- [x] Added "Your Turn" subsection to Exercise 3 (3 TODOs listed)
- [x] Applied identical README to main, exercise-1, exercise-2, exercise-3
- Status: COMPLETE

---

## Stage 5: Verification

### Task 5.1: Build verification on each branch
- [x] `npx tsc --noEmit` passes on exercise-1
- [x] `npx tsc --noEmit` passes on exercise-2
- [x] `npx tsc --noEmit` passes on exercise-3
- [x] `npx tsc --noEmit` passes on fully merged state
- Status: COMPLETE

### Task 5.2: Sequential merge verification
- [x] main → exercise-1: conflict-free merge
- [x] → exercise-2: conflict-free merge
- [x] → exercise-3: conflict-free merge
- Status: COMPLETE

### Task 5.3: TODO count verification
- exercise-1: 3 TODOs (DynamoDB, Lambda, createTodo) ✓
- exercise-2: 3 TODOs (buildSystemPrompt, chat streaming, chat toggle) ✓
- exercise-3: 3 TODOs (categorize, suggest, suggestTodos) ✓
- README "Your Turn" sections: 3 on all 4 branches ✓
- Status: COMPLETE

### Verification Insights
- Exercise branches required rebasing exercise-3 onto exercise-2 after TODOs were added
- Exercise-3 must have WORKING versions of exercise-2's functions (buildSystemPrompt, chat)
  since students solve those in exercise-2 before merging exercise-3
- Using `null as any` for Pulumi resources and `throw new Error()` / `return []` for functions
  ensures TypeScript compiles while making it obvious what needs implementation

---

## Commits

| Branch | Commit | Description |
|--------|--------|-------------|
| exercise-1 | `d0c4349` | feat: add TODO exercises to exercise-1 branch |
| exercise-1 | `778baef` | docs: add Your Turn TODO sections to README |
| exercise-2 | `3ffae3b` | feat: add TODO exercises to exercise-2 branch |
| exercise-2 | `1559e13` | docs: add Your Turn TODO sections to README |
| exercise-3 | `7323c2d` | feat: add TODO exercises to exercise-3 branch |
| exercise-3 | `f00feb7` | fix: restore working chat functions on exercise-3 |
| main | `2e8d0a9` | docs: add Your Turn TODO sections to README |
