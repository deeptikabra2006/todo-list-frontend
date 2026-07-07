"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "@/redux/features/todo/todoSlice";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleStatus,
} from "@/redux/features/todo/todoThunk";

export default function useTodo() {
  const dispatch = useDispatch();

  const { todos, totalCount, totalPages, stats, loading, error } = useSelector((state) => state.todo);

  return {
    todos,
    totalCount,
    totalPages,
    stats,
    loading,
    error,

    fetchTodos: useCallback((params) => dispatch(getTodos(params)), [dispatch]),

    addTodo: useCallback((data) => dispatch(createTodo(data)), [dispatch]),

    editTodo: useCallback(
      (id, todoData) =>
        dispatch(
          updateTodo({
            id,
            todoData,
          }),
        ),
      [dispatch]
    ),

    removeTodo: useCallback((id) => dispatch(deleteTodo(id)), [dispatch]),

    toggleTodoStatus: useCallback((id) => dispatch(toggleStatus(id)), [dispatch]),

    clearError: useCallback(() => dispatch(clearError()), [dispatch]),
  };
}