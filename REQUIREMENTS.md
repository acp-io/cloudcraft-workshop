# TaskFlow — Feature Requirements

You have a working todo app that can **add** and **display** tasks. Your job: use your AI coding agent to implement three new features.

---

## Feature 1: Delete a Todo

**As a user, I want to delete tasks I no longer need.**

### What needs to change

- **Backend** (`src/lambda/handler.ts`): The `deleteTodo` function currently returns 501. Implement it using DynamoDB's `DeleteCommand` to remove the item by `id`.
- **Frontend** (`src/components/TodoItem.tsx`): Add a delete button (trash icon) that appears on hover.
- **Hook** (`src/hooks/useTodos.ts`): Implement `deleteTodo` — call `DELETE /todos/:id` and remove from local state.
- **Wiring**: Pass `deleteTodo` through `TodoApp` → `TodoList` → `TodoItem`.

### Acceptance criteria
- Clicking the delete button removes the task from the UI immediately
- The task is deleted from DynamoDB (doesn't reappear on refresh)

---

## Feature 2: Toggle Complete

**As a user, I want to mark tasks as done and see them visually change.**

### What needs to change

- **Backend** (`src/lambda/handler.ts`): The `updateTodo` function currently returns 501. Implement it using DynamoDB's `UpdateCommand` with dynamic `UpdateExpression` for the fields in the body.
- **Frontend** (`src/components/TodoItem.tsx`): Add a checkbox that toggles completion. Show strikethrough + dimmed text when completed.
- **Hook** (`src/hooks/useTodos.ts`): Implement `toggleTodo` — call `PUT /todos/:id` with `{ completed: !todo.completed }` and update local state.
- **Wiring**: Pass `toggleTodo` through `TodoApp` → `TodoList` → `TodoItem`.

### Acceptance criteria
- Clicking the checkbox toggles the completed state
- Completed tasks show with strikethrough text and a purple checkbox
- State persists across page refreshes

---

## Feature 3: AI Categorization (Stretch Goal)

**As a user, I want new tasks to be automatically categorized and prioritized by AI.**

### What needs to change

- **Backend** (`src/lambda/handler.ts`): The `categorize` function currently returns 501. Implement it using the `invokeModel()` helper (already in the file) to call Claude via AWS Bedrock. Prompt it to return JSON with `{ category, priority }`.
- **Types** (`src/types/todo.ts`): Add optional `category` and `priority` fields to the `Todo` interface.
- **Frontend**: Create `CategoryBadge` and `PriorityBadge` components. Display them in `TodoItem` when present.
- **Hook** (`src/hooks/useTodos.ts`): After creating a new todo, call `POST /categorize` with the text, then update the todo via `PUT /todos/:id` with the result.

### Categories
`work` | `personal` | `shopping` | `health` | `learning` | `other`

### Priorities
`high` | `medium` | `low`

### Acceptance criteria
- New tasks automatically get a category badge and priority badge after a short delay
- Badges are color-coded (e.g., red for high priority, green for low)
- If AI categorization fails, fall back to `other` / `medium`

---

## Hints

- Look for `TODO` comments in the code — they mark exactly where changes are needed
- The Lambda handler already imports `UpdateCommand`, `DeleteCommand`, and the Bedrock client
- The `invokeModel()` helper in the Lambda is ready to use for Feature 3
- After making Lambda changes, rebuild and redeploy:
  ```bash
  cd src/lambda && npm run build && cd ../../infra && pulumi up -y
  ```
- After making frontend changes, rebuild and redeploy:
  ```bash
  NEXT_PUBLIC_API_URL=<your-api-url> npm run build && cd infra && pulumi up -y
  ```
