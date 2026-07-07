"use client";

import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import useTodo from "@/hooks/useTodo";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { todos, fetchTodos, loading } = useTodo();

  useEffect(() => {
    fetchTodos({ all: true });
  }, []);

  const stats = useMemo(() => {
    const list = todos || [];
    const total = list.length;
    const completed = list.filter((t) => t.status === "COMPLETED").length;
    const inProgress = list.filter((t) => t.status === "IN_PROGRESS").length;
    const pending = list.filter((t) => t.status === "PENDING").length;

    const highPriority = list.filter((t) => t.priority === "HIGH" && t.status !== "COMPLETED").length;
    const mediumPriority = list.filter((t) => t.priority === "MEDIUM" && t.status !== "COMPLETED").length;
    const lowPriority = list.filter((t) => t.priority === "LOW" && t.status !== "COMPLETED").length;

    const now = new Date();
    now.setHours(0, 0, 0, 0); // start of today
    const overdue = list.filter((t) => {
      if (!t.dueDate || t.status === "COMPLETED") return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < now;
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Get 3 most urgent pending tasks
    const urgentTasks = list
      .filter((t) => t.status !== "COMPLETED")
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      })
      .slice(0, 3);

    return {
      total,
      completed,
      inProgress,
      pending,
      highPriority,
      mediumPriority,
      lowPriority,
      overdue,
      completionRate,
      urgentTasks,
    };
  }, [todos]);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper to get priority badge style
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border-rose-100 dark:border-rose-900/30";
      case "MEDIUM":
        return "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border-amber-100 dark:border-amber-900/30";
      case "LOW":
      default:
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 space-y-8 select-none">

      {/* Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl shadow-xl p-6 sm:p-10 text-white border border-slate-800/40">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/5 text-blue-300">
            📊 Productivity Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="text-slate-350 text-sm sm:text-base font-medium leading-relaxed mb-6 sm:mb-8">
            You have <span className="text-white font-black">{stats.pending + stats.inProgress} active</span> items pending. Head over to your task list to complete them and stay productive.
          </p>

          <Link
            href="/todos"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-white/5 text-sm sm:text-base cursor-pointer"
          >
            Manage Tasks
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tasks card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm transition-all duration-300 hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Goals
            </p>
            <p className="text-4xl font-black text-slate-900 dark:text-white">
              {stats.total}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Tasks created in workspace
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 flex items-center justify-center text-xl">
            📝
          </div>
        </div>

        {/* Completion Rate Circle Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm transition-all duration-300 hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Completion Rate
            </p>
            <p className="text-4xl font-black text-slate-900 dark:text-white">
              {stats.completionRate}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="text-emerald-500 font-bold">{stats.completed} completed</span> / {stats.total} tasks
            </p>
          </div>
          {/* Radial ring using conic-gradient */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 relative shadow-sm"
            style={{
              background: `conic-gradient(#10b981 ${stats.completionRate}%, ${typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                ? "#1e293b"
                : "#f1f5f9"
                } 0)`,
            }}
          >
            {/* Center overlay circle to form the ring */}
            <div className="w-[82%] h-[82%] rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-650 dark:text-slate-350">
              🎯
            </div>
          </div>
        </div>

        {/* Overdue alert card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm transition-all duration-300 hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overdue Tasks
            </p>
            <p className="text-4xl font-black text-rose-600 dark:text-rose-455">
              {stats.overdue}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Tasks past their due date
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30 flex items-center justify-center text-xl">
            ⚠️
          </div>
        </div>
      </div>

      {/* Stacked Status Funnel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Task Status Funnel
        </p>

        {/* Single Stack Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden mb-4 border border-slate-200/20 dark:border-slate-700/20">
          {stats.total > 0 ? (
            <>
              {/* Completed */}
              <div
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                className="h-full bg-emerald-500 transition-all duration-500"
                title={`Completed: ${stats.completed}`}
              />
              {/* In Progress */}
              <div
                style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                className="h-full bg-blue-500 transition-all duration-500"
                title={`In Progress: ${stats.inProgress}`}
              />
              {/* Pending */}
              <div
                style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                className="h-full bg-amber-500 transition-all duration-500"
                title={`Pending: ${stats.pending}`}
              />
            </>
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />
          )}
        </div>

        {/* Status Legends Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Pending
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white">{stats.pending}</p>
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              In Progress
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white">{stats.inProgress}</p>
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Completed
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Urgent Tasks & Priority Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Urgent Tasks List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                ⚠️ Upcoming / Urgent
              </p>
              <Link href="/todos" className="text-xs font-bold text-blue-600 dark:text-blue-450 hover:underline">
                View All Tasks
              </Link>
            </div>

            {stats.urgentTasks.length > 0 ? (
              <div className="space-y-3">
                {stats.urgentTasks.map((todo) => (
                  <div
                    key={todo._id}
                    className="flex items-center justify-between p-3.5 bg-slate-50/70 dark:bg-slate-950/20 border border-slate-100/80 dark:border-slate-850 rounded-2xl hover:border-slate-200 dark:hover:border-slate-700/80 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Priority Dot */}
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {todo.title}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                          Due: {formatDate(todo.dueDate)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-lg border ${getPriorityStyle(todo.priority)}`}>
                      {todo.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm font-semibold">
                ✨ No urgent tasks pending!
              </div>
            )}
          </div>
        </div>

        {/* Priority breakdown metric bars */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
              🔥 Priority Distribution (Active)
            </p>

            <div className="space-y-4">
              {/* High */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    High Priority
                  </span>
                  <span>{stats.highPriority} tasks</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0}%` }}
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Medium Priority
                  </span>
                  <span>{stats.mediumPriority} tasks</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${stats.total > 0 ? (stats.mediumPriority / stats.total) * 100 : 0}%` }}
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Low */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Low Priority
                  </span>
                  <span>{stats.lowPriority} tasks</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${stats.total > 0 ? (stats.lowPriority / stats.total) * 100 : 0}%` }}
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}