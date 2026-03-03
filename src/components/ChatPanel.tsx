"use client";

import { useRef, useEffect } from "react";
import { Todo } from "@/types/todo";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface ChatPanelProps {
  todos: Todo[];
}

export default function ChatPanel({ todos }: ChatPanelProps) {
  const { messages, isStreaming, sendMessage } = useChat(todos);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="font-semibold text-white">AI Assistant</h2>
        <p className="text-xs text-slate-400">Powered by Claude</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-sm text-slate-500">
              Ask me anything about your tasks!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {isStreaming && (
              <ChatMessage role="assistant" content="" isLoading />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}
