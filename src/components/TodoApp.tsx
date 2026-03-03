"use client";

import { useTodos } from "@/hooks/useTodos";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";

export default function TodoApp() {
  const { todos, isLoaded, addTodo, toggleTodo, deleteTodo } = useTodos();

  if (!isLoaded) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      <div className="mb-6">
        <TodoInput onAdd={addTodo} />
      </div>

      {todos.length > 0 && (
        <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
          <span>{todos.length} task{todos.length !== 1 && "s"}</span>
          <span>{completedCount} completed</span>
        </div>
      )}

      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}
