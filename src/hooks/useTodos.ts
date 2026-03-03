"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo, Category, Priority } from "@/types/todo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  async function categorizeTodo(
    todoId: string,
    text: string
  ): Promise<{ category: Category; priority: Priority } | null> {
    try {
      const res = await fetch(`${API_URL}/categorize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function addTodo(text: string) {
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const newTodo = await res.json();
      setTodos((prev) => [newTodo, ...prev]);

      const classification = await categorizeTodo(newTodo.id, text);
      if (classification) {
        const updated = await fetch(`${API_URL}/todos/${newTodo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completed: false,
            category: classification.category,
            priority: classification.priority,
          }),
        });
        const updatedTodo = await updated.json();
        setTodos((prev) =>
          prev.map((t) => (t.id === newTodo.id ? updatedTodo : t))
        );
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  }

  async function toggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const updated = await res.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  }

  async function deleteTodo(id: string) {
    try {
      await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }

  async function suggestTodos(): Promise<string[]> {
    try {
      const res = await fetch(`${API_URL}/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todos }),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.suggestions || [];
    } catch {
      return [];
    }
  }

  return { todos, isLoaded, addTodo, toggleTodo, deleteTodo, suggestTodos };
}
