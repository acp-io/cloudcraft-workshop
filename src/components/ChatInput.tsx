"use client";

import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about your tasks..."
        disabled={disabled}
        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5
                   text-sm text-white placeholder-slate-400 outline-none
                   transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                   disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5
                   text-sm font-semibold text-white shadow-lg shadow-purple-500/25
                   transition-all hover:shadow-purple-500/40 hover:brightness-110
                   active:scale-95 disabled:opacity-50 disabled:active:scale-100"
      >
        Send
      </button>
    </form>
  );
}
