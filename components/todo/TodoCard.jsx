"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import useTodo from "@/hooks/useTodo";

export default function TodoCard({ todo, onEdit }) {
  const { editTodo, removeTodo } = useTodo();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  const priorityStyles = {
    HIGH: {
      bg: "bg-rose-50 dark:bg-rose-950/25 text-rose-650 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
      dot: "bg-rose-500",
      label: "High"
    },
    MEDIUM: {
      bg: "bg-amber-50 dark:bg-amber-950/25 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
      dot: "bg-amber-500",
      label: "Medium"
    },
    LOW: {
      bg: "bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/30",
      dot: "bg-emerald-500",
      label: "Low"
    },
  };

  const statusStyles = {
    PENDING: {
      bg: "bg-slate-50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-800",
      label: "Pending"
    },
    IN_PROGRESS: {
      bg: "bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/30",
      label: "In Progress"
    },
    COMPLETED: {
      bg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
      label: "Completed"
    }
  };

  const currentPriority = priorityStyles[todo.priority] || priorityStyles.MEDIUM;
  const currentStatus = statusStyles[todo.status] || statusStyles.PENDING;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDueDateStatus = () => {
    if (!todo.dueDate || todo.status === "COMPLETED") return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);

    if (due < today) {
      return { label: "⚠️ Overdue", class: "bg-rose-50 dark:bg-rose-950/30 text-rose-650 dark:text-rose-455 border-rose-100/85 dark:border-rose-900/30 animate-pulse" };
    } else if (due.getTime() === today.getTime()) {
      return { label: "⏳ Due Today", class: "bg-amber-55/75 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30" };
    }
    return null;
  };

  const dueStatus = getDueDateStatus();

  // Subtask statistics
  const totalSubtasks = todo.subtasks?.length || 0;
  const completedSubtasks = todo.subtasks?.filter((sub) => sub.completed).length || 0;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Toggle subtask status directly from card
  const handleToggleSubtask = async (subtaskIndex) => {
    const updatedSubtasks = todo.subtasks.map((sub, idx) =>
      idx === subtaskIndex ? { ...sub, completed: !sub.completed } : sub
    );

    let updatedStatus = todo.status;
    if (updatedSubtasks.every(s => s.completed) && totalSubtasks > 0 && todo.status !== "COMPLETED") {
      updatedStatus = "COMPLETED";
    } else if (updatedSubtasks.some(s => s.completed) && todo.status === "PENDING") {
      updatedStatus = "IN_PROGRESS";
    }

    await editTodo(todo._id, {
      ...todo,
      subtasks: updatedSubtasks,
      status: updatedStatus
    });
  };

  const handleStatusChange = async (e) => {
    await editTodo(todo._id, {
      ...todo,
      status: e.target.value
    });
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl shadow-sm border p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${
        todo.status === "COMPLETED"
          ? "border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20 opacity-70"
          : "border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900/50"
      }`}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${currentPriority.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentPriority.dot}`} />
              {currentPriority.label}
            </span>

            {dueStatus && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-extrabold border ${dueStatus.class}`}>
                {dueStatus.label}
              </span>
            )}
          </div>

          {/* Status Dropdown selector */}
          <div className="relative">
            <select
              value={todo.status}
              onChange={handleStatusChange}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none pr-7 bg-white dark:bg-slate-900 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${currentStatus.bg}`}
            >
              <option value="PENDING">⏳ Pending</option>
              <option value="IN_PROGRESS">⚡ In Progress</option>
              <option value="COMPLETED">✅ Completed</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-500 dark:text-slate-400">
              ▼
            </span>
          </div>
        </div>

        {/* Task Content */}
        <div className="space-y-2">
          <h3 className={`text-lg font-black text-slate-900 dark:text-slate-100 leading-snug tracking-tight ${todo.status === "COMPLETED" ? "line-through text-slate-400 dark:text-slate-500" : ""}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <div
              className={`text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed ${todo.status === "COMPLETED" ? "line-through opacity-60" : ""}`}
              dangerouslySetInnerHTML={{
                __html: todo.description
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.*?)\*/g, "<em>$1</em>")
                  .replace(/__(.*?)__/g, "<u>$1</u>")
                  .replace(/\n/g, "<br />")
              }}
            />
          )}
        </div>

        {/* Color-coded Tags */}
        {todo.tags && todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {todo.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/40 px-2 py-0.5 rounded-lg text-[10px] font-bold"
              >
                🏷️ {tag}
              </span>
            ))}
          </div>
        )}

        {/* Subtasks Progress Section */}
        {totalSubtasks > 0 && (
          <div className="mt-4 space-y-2 bg-slate-50/60 dark:bg-slate-950/30 border border-slate-100/50 dark:border-slate-800/80 rounded-2xl p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-650 dark:text-slate-400">Checklist Progress</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-450 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-lg">
                {completedSubtasks}/{totalSubtasks} ({subtaskPercentage}%)
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-355"
                style={{ width: `${subtaskPercentage}%` }}
              />
            </div>

            {/* Micro subtask toggle items */}
            <div className="space-y-1.5 pt-1.5 max-h-32 overflow-y-auto pr-0.5">
              {todo.subtasks.map((sub, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => handleToggleSubtask(idx)}
                    className="w-3.5 h-3.5 rounded text-blue-600 dark:text-blue-500 border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-blue-500/10 cursor-pointer"
                  />
                  <span className={sub.completed ? "line-through text-slate-400 dark:text-slate-550 font-medium" : ""}>
                    {sub.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
        {todo.dueDate ? (
          <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold flex items-center gap-1.5">
            📅 {formatDate(todo.dueDate)}
          </span>
        ) : (
          <span className="text-slate-300 dark:text-slate-600 text-xs font-medium">
            No due date
          </span>
        )}

        <div className="flex gap-2">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(todo)}
            className="p-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 active:bg-slate-200 dark:active:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-205 dark:border-slate-750 transition duration-200 cursor-pointer"
            title="Edit task"
          >
            ✏️
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="p-2 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900 active:bg-red-200 dark:active:bg-red-850 text-red-655 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 transition duration-200 cursor-pointer"
            title="Delete task"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal - Centered on Viewport/Desktop */}
      {showConfirmDelete && mounted && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop (Darkened layer, no blur) */}
          <div
            className="absolute inset-0 bg-slate-950/40 transition-opacity duration-300"
            onClick={() => setShowConfirmDelete(false)}
          />
          {/* Confirmation Content box */}
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 max-w-sm w-full z-10 text-center animate-scale-up">
            <div className="w-12 h-12 bg-red-55/75 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl border border-red-100 dark:border-red-900/30">
              ⚠️
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-2">Delete Task</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-6">
              Are you sure want to delete?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  removeTodo(todo._id);
                  setShowConfirmDelete(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 dark:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-red-500/10"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}