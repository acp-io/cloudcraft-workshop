export type Priority = "high" | "medium" | "low";

export type Category =
  | "work"
  | "personal"
  | "shopping"
  | "health"
  | "learning"
  | "other";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  category?: Category;
  priority?: Priority;
}
