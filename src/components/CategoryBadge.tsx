"use client";

import { Category } from "@/types/todo";

const categoryStyles: Record<Category, string> = {
  work: "bg-blue-500/20 text-blue-400",
  personal: "bg-purple-500/20 text-purple-400",
  shopping: "bg-green-500/20 text-green-400",
  health: "bg-red-500/20 text-red-400",
  learning: "bg-yellow-500/20 text-yellow-400",
  other: "bg-slate-500/20 text-slate-400",
};

interface CategoryBadgeProps {
  category: Category;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryStyles[category]}`}
    >
      {category}
    </span>
  );
}
