"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo } from "@/types/todo";

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

  async function addTodo(text: string) {
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const newTodo = await res.json();
      setTodos((prev) => [newTodo, ...prev]);

      // TODO [Feature 3]: After adding a todo, call categorizeTodo() to auto-categorize it
      //   - Send the todo text to POST /categorize
      //   - Use the returned { category, priority } to update the todo via PUT /todos/:id
      //   - Update the local state with the categorized todo
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  }

  // TODO [Feature 2]: Implement toggleTodo(id: string)
  //   - Find the todo by id in the todos array
  //   - Send PUT /todos/:id with { completed: !todo.completed }
  //   - Update local state with the response

  // TODO [Feature 1]: Implement deleteTodo(id: string)
  //   - Send DELETE /todos/:id
  //   - Remove the todo from local state

  return { todos, isLoaded, addTodo };
  // TODO: Add toggleTodo and deleteTodo to the return object
}
