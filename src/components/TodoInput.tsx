"use client";

import { useState } from "react";

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3
                   text-white placeholder-slate-400 outline-none
                   transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
      />
      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3
                   font-semibold text-white shadow-lg shadow-purple-500/25
                   transition-all hover:shadow-purple-500/40 hover:brightness-110
                   active:scale-95"
      >
        Add
      </button>
    </form>
  );
}
