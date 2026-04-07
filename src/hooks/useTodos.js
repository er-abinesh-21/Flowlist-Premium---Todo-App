"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  addTodoForUser,
  deleteTodoById,
  reorderTodos,
  subscribeToTodos,
  toggleTodoStatus,
  updateTodoById,
} from "@/services/firebase/todos";

export function useTodos(userId) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) {
      setTodos([]);
      setLoading(false);
      return () => {};
    }

    setLoading(true);

    const unsubscribe = subscribeToTodos(
      userId,
      (items) => {
        setTodos(items);
        setLoading(false);
      },
      (error) => {
        if (error?.code === "permission-denied") {
          toast.error("Firestore denied access. Deploy rules and verify authenticated user access.");
        } else {
          toast.error("Unable to sync your tasks right now.");
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const highestOrder = useMemo(() => {
    if (!todos.length) {
      return 0;
    }

    return Math.max(...todos.map((todo) => Number(todo.order) || 0));
  }, [todos]);

  const createTodo = useCallback(
    async (payload) => {
      if (!userId) {
        return false;
      }

      setSaving(true);

      try {
        await addTodoForUser(userId, payload, highestOrder + 100);
        toast.success("Task created");
        return true;
      } catch (error) {
        toast.error(error?.message || "Failed to create task.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [highestOrder, userId],
  );

  const editTodo = useCallback(async (todoId, payload) => {
    setSaving(true);

    try {
      await updateTodoById(todoId, payload);
      toast.success("Task updated");
      return true;
    } catch (error) {
      toast.error(error?.message || "Failed to update task.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const removeTodo = useCallback(async (todoId) => {
    try {
      await deleteTodoById(todoId);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task.");
    }
  }, []);

  const toggleTodo = useCallback(
    async (todoId, completed) => {
      setTodos((current) =>
        current.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                completed,
              }
            : todo,
        ),
      );

      try {
        await toggleTodoStatus(todoId, completed);
      } catch {
        setTodos((current) =>
          current.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  completed: !completed,
                }
              : todo,
          ),
        );

        toast.error("Failed to update task state.");
      }
    },
    [],
  );

  const saveOrder = useCallback(async (orderedTodos) => {
    setTodos(orderedTodos);

    try {
      await reorderTodos(orderedTodos);
    } catch {
      toast.error("Could not save task order.");
    }
  }, []);

  return {
    todos,
    loading,
    saving,
    createTodo,
    editTodo,
    removeTodo,
    toggleTodo,
    saveOrder,
  };
}
