"use client";

import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  // TODO [Feature 1]: Add onDelete prop — (id: string) => void
  // TODO [Feature 2]: Add onToggle prop — (id: string) => void
}

export default function TodoItem({ todo }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all hover:border-white/10 hover:bg-white/[0.07]">
      {/* TODO [Feature 2]: Add a toggle checkbox button here
          - When clicked, call onToggle(todo.id)
          - Show a checkmark when todo.completed is true
          - Style: rounded-md border-2, purple when completed */}

      <span className="flex-1 text-slate-200">
        {/* TODO [Feature 2]: Add strikethrough + dimmed text when todo.completed */}
        {todo.text}
      </span>

      {/* TODO [Feature 3]: Show CategoryBadge and PriorityBadge here when todo has category/priority */}

      {/* TODO [Feature 1]: Add a delete button here
          - When clicked, call onDelete(todo.id)
          - Style: hidden by default, visible on hover (group-hover:opacity-100)
          - Use a trash icon (SVG) */}
    </div>
  );
}
