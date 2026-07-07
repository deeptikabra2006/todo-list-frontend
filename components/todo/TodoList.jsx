"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Loader from "@/components/common/Loader";
import EmptyState from "./EmptyState";
import TodoFilters from "./TodoFilters";
import TodoEditModal from "./TodoEditModal";
import useTodo from "@/hooks/useTodo";

// Compact subtask and formatting helper component for Table Row
function TodoRow({ todo, index, currentPage, itemsPerPage, onEdit, onDeleteClick, onStatusChange, onImageClick, onSubtaskToggle, totalRows }) {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const checklistRef = useRef(null);
  const openUpward = index > 0 && index >= totalRows - 2;

  useEffect(() => {
    if (!isChecklistOpen) return;
    const handleClickOutside = (event) => {
      if (checklistRef.current && !checklistRef.current.contains(event.target)) {
        setIsChecklistOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChecklistOpen]);
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
      bg: "bg-amber-50/80 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
      label: "Pending"
    },
    IN_PROGRESS: {
      bg: "bg-blue-50/80 dark:bg-blue-950/20 text-blue-700 dark:text-blue-450 border-blue-200 dark:border-blue-900/30",
      label: "In Progress"
    },
    COMPLETED: {
      bg: "bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
      label: "Completed"
    }
  };

  const currentPriority = priorityStyles[todo.priority] || priorityStyles.MEDIUM;
  const currentStatus = statusStyles[todo.status] || statusStyles.PENDING;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.status === "COMPLETED") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Subtask progress
  const totalSubtasks = todo.subtasks?.length || 0;
  const completedSubtasks = todo.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Simple HTML markdown parser for description snippet
  const getParsedDescription = (desc) => {
    if (!desc) return "";
    return desc
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .substring(0, 80) + (desc.length > 80 ? "..." : "");
  };

  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-all duration-200">
      <td className="py-3 px-4 whitespace-nowrap text-center text-xs font-bold text-slate-500 dark:text-slate-400">
        {(currentPage - 1) * itemsPerPage + index + 1}
      </td>
      <td className="py-3 px-4 whitespace-nowrap text-center">
        {/* Task Image */}
        {todo.imageUrl ? (
          <div
            onClick={() => onImageClick && onImageClick(todo.imageUrl)}
            className="relative w-9 h-9 mx-auto rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm shrink-0 cursor-zoom-in hover:scale-105 active:scale-95 transition-all duration-200"
            title="Click to view image"
          >
            <img
              src={todo.imageUrl}
              alt="Task attachment"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-9 h-9 mx-auto rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center text-slate-350 dark:text-slate-650 text-xs font-black shrink-0">
            🖼️
          </div>
        )}
      </td>

      <td className="py-3 px-4">
        {/* Title & Description details */}
        <div className="space-y-0.5 min-w-0">
          <div className={`font-bold text-sm text-slate-900 dark:text-slate-100 truncate ${todo.status === "COMPLETED" ? "line-through text-slate-400 dark:text-slate-550" : ""}`}>
            {todo.title}
          </div>
          {todo.description && (
            <div className="text-[11px] text-slate-450 dark:text-slate-400 font-medium truncate">
              {getParsedDescription(todo.description)}
            </div>
          )}
        </div>
      </td>

      <td className="py-3 px-4 whitespace-nowrap">
        {/* Priority label */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border ${currentPriority.bg}`}>
          <span className={`w-1 h-1 rounded-full ${currentPriority.dot}`} />
          {currentPriority.label}
        </span>
      </td>

      <td className="py-3 px-4 whitespace-nowrap">
        {/* Due Date value */}
        <span className={`text-[11px] font-semibold ${isOverdue() ? "text-rose-500 font-extrabold animate-pulse" : "text-slate-500 dark:text-slate-400"}`}>
          {isOverdue() ? "⚠️ Overdue " : ""}
          {formatDate(todo.dueDate)}
        </span>
      </td>

      <td className="py-3 px-4 whitespace-nowrap">
        {/* Status dropdown select */}
        <div className="relative inline-block">
          <select
            value={todo.status}
            onChange={(e) => onStatusChange(todo._id, e.target.value)}
            className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border appearance-none pr-5 focus:outline-none focus:ring-1 focus:ring-blue-500/20 cursor-pointer transition-all duration-200 ${currentStatus.bg}`}
          >
            <option value="PENDING" className="bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 font-semibold">⏳ Pending</option>
            <option value="IN_PROGRESS" className="bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 font-semibold">⚡ In Progress</option>
            <option value="COMPLETED" className="bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-semibold">✅ Completed</option>
          </select>
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[7px] text-slate-500 dark:text-slate-400">
            ▼
          </span>
        </div>
      </td>

      <td className="py-3 px-4">
        {/* Tags Chips */}
        {todo.tags && todo.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-[130px]">
            {todo.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 px-1.5 py-0.5 rounded-md text-[9px] font-bold whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {todo.tags.length > 2 && (
              <span className="text-[9px] font-bold text-slate-400">+{todo.tags.length - 2}</span>
            )}
          </div>
        ) : (
          <span className="text-slate-300 dark:text-slate-700 text-[11px]">-</span>
        )}
      </td>

      <td className="py-3 px-4 whitespace-nowrap">
        {/* Checklist subtasks statistics */}
        {totalSubtasks > 0 ? (
          <div ref={checklistRef} className="relative inline-block">
            <div
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              className="space-y-1 w-24 cursor-pointer group/checklist select-none hover:opacity-80 transition-opacity"
              title="Click to view/toggle subtasks"
            >
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 dark:text-slate-400 group-hover/checklist:text-blue-500 transition-colors">
                <span>{completedSubtasks}/{totalSubtasks} 📋</span>
                <span>{subtaskPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full"
                  style={{ width: `${subtaskPercentage}%` }}
                />
              </div>
            </div>

            {/* Checklist Dropdown Popover */}
            {isChecklistOpen && (
              <div className={`absolute left-1/2 -translate-x-1/2 z-50 w-52 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3 shadow-xl text-left select-none animate-scale-up ${openUpward ? "bottom-full mb-3" : "top-full mt-3"}`}>
                {/* Tooltip Arrow pointing up or down to the center of the progress bar */}
                {openUpward ? (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white/80 dark:bg-slate-900/85 border-b border-r border-slate-200/50 dark:border-slate-800/50 rotate-45 -translate-y-[6px]" />
                ) : (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white/80 dark:bg-slate-900/85 border-t border-l border-slate-200/50 dark:border-slate-800/50 rotate-45 translate-y-[6px]" />
                )}
                
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Subtasks Checklist
                  </h4>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded-full">
                    {completedSubtasks}/{totalSubtasks} Done
                  </span>
                </div>
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                  {todo.subtasks.map((sub) => (
                    <label
                      key={sub._id}
                      className="flex items-start gap-2.5 cursor-pointer text-xs group text-slate-700 dark:text-slate-350"
                    >
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => onSubtaskToggle && onSubtaskToggle(todo._id, sub._id)}
                        className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                      />
                      <span className={`leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors ${sub.completed ? "line-through text-slate-405 dark:text-slate-550" : ""}`}>
                        {sub.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <span className="text-slate-300 dark:text-slate-700 text-[11px]">-</span>
        )}
      </td>

      <td className="py-3 px-4 whitespace-nowrap">
        {/* Actions cells */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDeleteClick(todo)}
            className="p-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-650 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30 transition cursor-pointer"
            title="Delete task"
          >
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
}

// Mobile-friendly card component for task list
function TodoMobileRow({ todo, index, currentPage, itemsPerPage, onEdit, onDeleteClick, onStatusChange, onImageClick, onSubtaskToggle }) {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

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
      bg: "bg-amber-50/80 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
      label: "Pending"
    },
    IN_PROGRESS: {
      bg: "bg-blue-50/80 dark:bg-blue-950/20 text-blue-700 dark:text-blue-450 border-blue-200 dark:border-blue-900/30",
      label: "In Progress"
    },
    COMPLETED: {
      bg: "bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
      label: "Completed"
    }
  };

  const currentPriority = priorityStyles[todo.priority] || priorityStyles.MEDIUM;
  const currentStatus = statusStyles[todo.status] || statusStyles.PENDING;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.status === "COMPLETED") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const totalSubtasks = todo.subtasks?.length || 0;
  const completedSubtasks = todo.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const getParsedDescription = (desc) => {
    if (!desc) return "";
    return desc
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .substring(0, 80) + (desc.length > 80 ? "..." : "");
  };

  return (
    <div className="p-4 sm:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-200">
      {/* Top row: Serial number, Priority badge, and Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            #{(currentPage - 1) * itemsPerPage + index + 1}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border ${currentPriority.bg}`}>
            <span className={`w-1 h-1 rounded-full ${currentPriority.dot}`} />
            {currentPriority.label}
          </span>
        </div>
        {/* Actions with good mobile spacing */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(todo)}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/80 transition active:scale-90 cursor-pointer"
            title="Edit task"
            suppressHydrationWarning
          >
            ✏️
          </button>
          <button
            onClick={() => onDeleteClick(todo)}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-450 border border-rose-100/50 dark:border-rose-900/30 transition active:scale-90 cursor-pointer"
            title="Delete task"
            suppressHydrationWarning
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Middle section: Image + Title/Desc */}
      <div className="flex items-start gap-3.5 mb-4">
        {/* Task Image */}
        {todo.imageUrl ? (
          <div
            onClick={() => onImageClick && onImageClick(todo.imageUrl)}
            className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm shrink-0 cursor-zoom-in hover:scale-105 active:scale-95 transition-all duration-200"
            title="Click to view image"
          >
            <img
              src={todo.imageUrl}
              alt="Task attachment"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center text-slate-350 dark:text-slate-650 text-sm font-black shrink-0">
            🖼️
          </div>
        )}

        {/* Title & Description */}
        <div className="min-w-0 flex-1">
          <h3 className={`font-black text-sm text-slate-900 dark:text-slate-100 leading-snug break-words ${todo.status === "COMPLETED" ? "line-through text-slate-400 dark:text-slate-550" : ""}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-[11px] text-slate-450 dark:text-slate-400 font-medium mt-1 break-words line-clamp-2">
              {getParsedDescription(todo.description)}
            </p>
          )}
        </div>
      </div>

      {/* Bottom details layout */}
      <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-slate-100/60 dark:border-slate-800/60">
        {/* Due Date & Tags */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
            Due Date
          </div>
          <div className={`text-[11px] font-bold ${isOverdue() ? "text-rose-500 animate-pulse" : "text-slate-650 dark:text-slate-350"}`}>
            {isOverdue() ? "⚠️ Overdue " : ""}
            {formatDate(todo.dueDate)}
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
            Status
          </div>
          <div className="relative w-full">
            <select
              value={todo.status}
              onChange={(e) => onStatusChange(todo._id, e.target.value)}
              className={`w-full text-[11px] font-bold px-2 py-1.5 rounded-lg border appearance-none pr-6 focus:outline-none focus:ring-1 focus:ring-blue-500/20 cursor-pointer transition-all duration-200 ${currentStatus.bg}`}
            >
              <option value="PENDING" className="bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 font-semibold">⏳ Pending</option>
              <option value="IN_PROGRESS" className="bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 font-semibold">⚡ In Progress</option>
              <option value="COMPLETED" className="bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-semibold">✅ Completed</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[7px] text-slate-500 dark:text-slate-400">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Tags and Checklist row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3.5 pt-3 border-t border-slate-100/60 dark:border-slate-800/60">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 items-center">
          {todo.tags && todo.tags.length > 0 ? (
            todo.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-650 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 px-1.5 py-0.5 rounded-md text-[9px] font-bold whitespace-nowrap"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-slate-350 dark:text-slate-655 text-[10px] font-bold">No Tags</span>
          )}
        </div>

        {/* Subtask Checklist Progress */}
        {totalSubtasks > 0 && (
          <div className="w-full sm:w-auto flex items-center justify-end">
            <button
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              className="flex items-center justify-between w-full sm:w-28 bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-850 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              suppressHydrationWarning
            >
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                Checklist ({completedSubtasks}/{totalSubtasks})
              </span>
              <span className="text-[8px] text-slate-450 dark:text-slate-500 ml-1.5">
                {isChecklistOpen ? "▲" : "▼"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Expanded Checklist details */}
      {isChecklistOpen && totalSubtasks > 0 && (
        <div className="mt-3 p-3 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850/80 rounded-2xl animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Subtasks Checklist
            </h4>
            <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded-full">
              {subtaskPercentage}% Completed
            </span>
          </div>
          <div className="space-y-2.5">
            {todo.subtasks.map((sub) => (
              <label
                key={sub._id}
                className="flex items-start gap-2.5 cursor-pointer text-xs group text-slate-700 dark:text-slate-350"
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => onSubtaskToggle && onSubtaskToggle(todo._id, sub._id)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                />
                <span className={`leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors ${sub.completed ? "line-through text-slate-405 dark:text-slate-550" : ""}`}>
                  {sub.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TodoList() {
  const {
    todos,
    totalCount,
    totalPages: storeTotalPages,
    loading,
    fetchTodos,
    editTodo,
    removeTodo,
  } = useTodo();

  // Filter and Sort states
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [tagFilter, setTagFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt_desc");

  const handleSearchSubmit = () => {
    setActiveSearch(search);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setActiveSearch("");
    setCurrentPage(1);
  };

  // Dialog Modals states
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingTodo, setDeletingTodo] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [mounted, setMounted] = useState(false);

  const [availableTags, setAvailableTags] = useState([]);

  // 1. Fetch all todos once on mount just to build the tag filter dropdown values list
  useEffect(() => {
    const loadAllTags = async () => {
      try {
        const response = await fetchTodos({ all: true });
        if (response && response.payload && Array.isArray(response.payload.todos)) {
          const tagsSet = new Set();
          response.payload.todos.forEach((todo) => {
            if (todo.tags) {
              todo.tags.forEach((t) => tagsSet.add(t));
            }
          });
          setAvailableTags(Array.from(tagsSet));
        }
      } catch (err) {
        console.error("Failed to load tag filter options", err);
      } finally {
        setMounted(true);
      }
    };
    loadAllTags();
    return () => setMounted(false);
  }, [fetchTodos]);

  // 2. Fetch paginated, filtered, and sorted todos reactively when query filters change
  useEffect(() => {
    if (mounted) {
      fetchTodos({
        page: currentPage,
        limit: itemsPerPage,
        search: activeSearch.trim() || undefined,
        status: statusFilter,
        priority: priorityFilter,
        tag: tagFilter,
        sortBy: sortBy,
      });
    }
  }, [mounted, currentPage, itemsPerPage, activeSearch, statusFilter, priorityFilter, tagFilter, sortBy, fetchTodos]);

  // Sliced server results mapping
  const paginatedTodos = todos || [];
  const totalPages = storeTotalPages || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleHeaderSort = (colType) => {
    if (colType === "title") {
      setSortBy((prev) => (prev === "title_asc" ? "title_desc" : "title_asc"));
    } else if (colType === "priority") {
      setSortBy((prev) => (prev === "priority_desc" ? "priority_asc" : "priority_desc"));
    } else if (colType === "dueDate") {
      setSortBy((prev) => (prev === "dueDate_asc" ? "dueDate_desc" : "dueDate_asc"));
    } else if (colType === "status") {
      setSortBy((prev) => (prev === "status_asc" ? "status_desc" : "status_asc"));
    }
    setCurrentPage(1);
  };

  const getSortIcon = (colType) => {
    if (colType === "title") {
      if (sortBy === "title_asc") return "▲";
      if (sortBy === "title_desc") return "▼";
    }
    if (colType === "priority") {
      if (sortBy === "priority_asc") return "▲";
      if (sortBy === "priority_desc") return "▼";
    }
    if (colType === "dueDate") {
      if (sortBy === "dueDate_asc") return "▲";
      if (sortBy === "dueDate_desc") return "▼";
    }
    if (colType === "status") {
      if (sortBy === "status_asc") return "▲";
      if (sortBy === "status_desc") return "▼";
    }
    return "↕";
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id, updatedData) => {
    await editTodo(id, updatedData);
  };

  const handleStatusChange = async (id, nextStatus) => {
    const todo = todos.find((t) => t._id === id);
    if (todo) {
      await editTodo(id, { ...todo, status: nextStatus });
    }
  };

  const handleSubtaskToggle = async (todoId, subtaskId) => {
    const todo = todos.find((t) => t._id === todoId);
    if (!todo) return;
    const updatedSubtasks = todo.subtasks.map((sub) =>
      sub._id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );

    // Auto-update status based on subtasks completion percentage
    let updatedStatus = todo.status;
    const totalSubtasks = updatedSubtasks.length;
    const completedSubtasks = updatedSubtasks.filter((s) => s.completed).length;

    if (totalSubtasks > 0) {
      if (completedSubtasks === totalSubtasks) {
        updatedStatus = "COMPLETED";
      } else if (completedSubtasks === 0) {
        // If all subtasks are unchecked, revert from completed/in_progress to pending
        if (todo.status === "COMPLETED" || todo.status === "IN_PROGRESS") {
          updatedStatus = "PENDING";
        }
      } else {
        // Some subtasks checked (between 1 and total - 1)
        if (todo.status === "PENDING" || todo.status === "COMPLETED") {
          updatedStatus = "IN_PROGRESS";
        }
      }
    }

    await editTodo(todoId, {
      ...todo,
      subtasks: updatedSubtasks,
      status: updatedStatus,
    });
  };

  if (loading && !todos.length) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      {/* Search, filters and sorting panel */}
      <TodoFilters
        search={search}
        setSearch={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        priorityFilter={priorityFilter}
        setPriorityFilter={(val) => {
          setPriorityFilter(val);
          setCurrentPage(1);
        }}
        tagFilter={tagFilter}
        setTagFilter={(val) => {
          setTagFilter(val);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        setSortBy={(val) => {
          setSortBy(val);
          setCurrentPage(1);
        }}
        availableTags={availableTags}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={(val) => {
          setItemsPerPage(val);
          setCurrentPage(1);
        }}
      />

      {/* Main tasks list rendering in Table Rows & Columns */}
      {paginatedTodos.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px] table-fixed">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider select-none">
                  <th className="py-3 px-4 w-[5%] text-slate-400 dark:text-slate-500 font-extrabold text-center">S.No.</th>
                  <th className="py-3 px-4 w-[7%] text-slate-400 dark:text-slate-500 font-extrabold text-center">Image</th>
                  <th
                    onClick={() => handleHeaderSort("title")}
                    className="py-3 px-4 w-[18%] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    <div className="flex items-center gap-1">
                      Task
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-350 font-bold transition-colors">
                        {getSortIcon("title")}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => handleHeaderSort("priority")}
                    className="py-3 px-4 w-[10%] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    <div className="flex items-center gap-1">
                      Priority
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-355 font-bold transition-colors">
                        {getSortIcon("priority")}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => handleHeaderSort("dueDate")}
                    className="py-3 px-4 w-[12%] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    <div className="flex items-center gap-1">
                      Due Date
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-355 font-bold transition-colors">
                        {getSortIcon("dueDate")}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => handleHeaderSort("status")}
                    className="py-3 px-4 w-[14%] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-355 font-bold transition-colors">
                        {getSortIcon("status")}
                      </span>
                    </div>
                  </th>
                  <th className="py-3 px-4 w-[12%]">Tags</th>
                  <th className="py-3 px-4 w-[12%]">Checklist</th>
                  <th className="py-3 px-4 w-[10%] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedTodos.map((todo, idx) => (
                  <TodoRow
                    key={todo._id}
                    todo={todo}
                    index={idx}
                    currentPage={safeCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onEdit={handleEditClick}
                    onDeleteClick={(t) => setDeletingTodo(t)}
                    onStatusChange={handleStatusChange}
                    onSubtaskToggle={handleSubtaskToggle}
                    onImageClick={(image) => {
                      setLightboxImage(image);
                    }}
                    totalRows={paginatedTodos.length}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedTodos.map((todo, idx) => (
              <TodoMobileRow
                key={todo._id}
                todo={todo}
                index={idx}
                currentPage={safeCurrentPage}
                itemsPerPage={itemsPerPage}
                onEdit={handleEditClick}
                onDeleteClick={(t) => setDeletingTodo(t)}
                onStatusChange={handleStatusChange}
                onSubtaskToggle={handleSubtaskToggle}
                onImageClick={(image) => {
                  setLightboxImage(image);
                }}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            {/* Info label */}
            <div className="text-xs text-slate-505 dark:text-slate-400 font-semibold text-center sm:text-left">
              Total Tasks: <span className="text-slate-900 dark:text-white font-extrabold">{totalCount}</span>
            </div>

            {/* Pagination Controls & Items selector */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Items per page selector moved to top filter bar */}

              {/* Navigation buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
                {/* Prev button */}
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  ◀
                </button>

                {/* Page numbers list */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  // Smart ellipsis range showing first, active page neighbours, and last page
                  if (
                    totalPages > 5 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - safeCurrentPage) > 1
                  ) {
                    if (pageNum === 2 && safeCurrentPage > 3) {
                      return (
                        <span key={pageNum} className="px-1 text-slate-400 text-xs select-none">
                          ...
                        </span>
                      );
                    }
                    if (pageNum === totalPages - 1 && safeCurrentPage < totalPages - 2) {
                      return (
                        <span key={pageNum} className="px-1 text-slate-400 text-xs select-none">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${safeCurrentPage === pageNum
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                        : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next button */}
                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
          {activeSearch || statusFilter !== "ALL" || priorityFilter !== "ALL" || tagFilter !== "ALL" ? (
            <p>No tasks match your filter criteria. Try clearing some filters!</p>
          ) : (
            <EmptyState />
          )}
        </div>
      )}

      {/* Shared Task Edit Modal */}
      <TodoEditModal
        todo={editingTodo}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal Portal */}
      {deletingTodo && mounted && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 transition-opacity duration-300"
            onClick={() => setDeletingTodo(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 max-w-sm w-full z-10 text-center animate-scale-up">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl border border-red-100/50 dark:border-red-900/30">
              ⚠️
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-2">Delete Task</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-6">
              Are you sure want to delete?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeletingTodo(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await removeTodo(deletingTodo._id);
                  setDeletingTodo(null);
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

      {/* Lightbox Image Viewer Modal Portal */}
      {lightboxImage && mounted && createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Black Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setLightboxImage(null)}
          />

          {/* Close button */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center font-bold z-10 transition cursor-pointer"
            title="Close viewer"
          >
            ✕
          </button>

          {/* Image slide */}
          <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center z-10 animate-scale-up">
            <img
              src={lightboxImage}
              alt="Attachment preview"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}