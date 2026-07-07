"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import TodoHeader from "@/components/todo/TodoHeader";
import TodoForm from "@/components/todo/TodoForm";
import TodoStats from "@/components/todo/TodoStats";
import TodoList from "@/components/todo/TodoList";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:p-6 animate-fadeIn">
      {/* Page Header with trigger action */}
      <TodoHeader onAddClick={() => setIsCreateModalOpen(true)} />

      {/* Task Statistics */}
      <TodoStats />

      {/* Filter panel & tasks list */}
      <TodoList />

      {/* Add Task Dialog Portal popup */}
      {isCreateModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/40 dark:bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsCreateModalOpen(false)}
          />

          {/* Modal card content wrapper */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 animate-scale-up">
            <TodoForm onClose={() => setIsCreateModalOpen(false)} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}