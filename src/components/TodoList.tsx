"use client";

import { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  // TODO [Feature 1]: Add onDelete prop — (id: string) => void
  // TODO [Feature 2]: Add onToggle prop — (id: string) => void
}

export default function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-slate-500">No tasks yet</p>
        <p className="mt-1 text-sm text-slate-600">Add one above to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          // TODO [Feature 1]: Pass onDelete prop
          // TODO [Feature 2]: Pass onToggle prop
        />
      ))}
    </div>
  );
}
