"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import ChatPanel from "./ChatPanel";

export default function TodoApp() {
  const { todos, isLoaded, addTodo, toggleTodo, deleteTodo, suggestTodos } =
    useTodos();
  const [showChat, setShowChat] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

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

  async function handleSuggest() {
    setIsSuggesting(true);
    const results = await suggestTodos();
    setSuggestions(results);
    setIsSuggesting(false);
  }

  async function handleAddSuggestion(text: string) {
    await addTodo(text);
    setSuggestions((prev) => prev.filter((s) => s !== text));
  }

  return (
    <div
      className={`grid gap-6 ${showChat ? "lg:grid-cols-2" : "grid-cols-1"}`}
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-end gap-2">
          <button
            onClick={handleSuggest}
            disabled={isSuggesting}
            className="rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-slate-400
                       transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            {isSuggesting ? "Thinking..." : "Suggest Tasks"}
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              showChat
                ? "bg-purple-600/20 text-purple-400"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {showChat ? "Hide Chat" : "AI Chat"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mb-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="mb-3 text-sm font-medium text-purple-400">
              AI Suggestions
            </p>
            <div className="flex flex-col gap-2">
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span className="text-sm text-slate-300">{suggestion}</span>
                  <button
                    onClick={() => handleAddSuggestion(suggestion)}
                    className="rounded-lg bg-purple-600/20 px-3 py-1 text-xs font-medium
                               text-purple-400 transition-all hover:bg-purple-600/30"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <TodoInput onAdd={addTodo} />
        </div>

        {todos.length > 0 && (
          <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
            <span>
              {todos.length} task{todos.length !== 1 && "s"}
            </span>
            <span>{completedCount} completed</span>
          </div>
        )}

        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </div>

      {showChat && <ChatPanel todos={todos} />}
    </div>
  );
}
