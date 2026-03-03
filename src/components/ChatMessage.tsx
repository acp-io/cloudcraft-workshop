"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export default function ChatMessage({
  role,
  content,
  isLoading,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            : "border border-white/10 bg-white/5 text-slate-200"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-1 py-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </p>
        )}
      </div>
    </div>
  );
}
