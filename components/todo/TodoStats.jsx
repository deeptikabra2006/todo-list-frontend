"use client";

import useTodo from "@/hooks/useTodo";

export default function TodoStats() {
  const { stats: serverStats } = useTodo();
  console.log("DEBUG: TodoStats serverStats =", serverStats);

  const total = serverStats?.total || 0;
  const completed = serverStats?.completed || 0;
  const inProgress = serverStats?.inProgress || 0;
  const pending = serverStats?.pending || 0;

  const completionRate = serverStats?.completionRate || 0;

  const stats = [
    {
      label: "Total Tasks",
      value: total,
      bg: "bg-blue-50/55 dark:bg-blue-950/30",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100/60 dark:border-blue-900/30",
      icon: "📋"
    },
    {
      label: "Completed",
      value: completed,
      bg: "bg-emerald-55/40 dark:bg-emerald-950/20",
      text: "text-emerald-600 dark:text-emerald-450",
      border: "border-emerald-100/60 dark:border-emerald-900/30",
      icon: "✅"
    },
    {
      label: "In Progress",
      value: inProgress,
      bg: "bg-sky-50/60 dark:bg-sky-950/30",
      text: "text-sky-600 dark:text-sky-400",
      border: "border-sky-100/60 dark:border-sky-900/30",
      icon: "⚡"
    },
    {
      label: "Pending",
      value: pending,
      bg: "bg-amber-50/50 dark:bg-amber-950/30",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/30",
      icon: "⏳"
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* 4-Column Grid for Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white dark:bg-slate-900 border ${stat.border} rounded-3xl p-3.5 sm:p-5 flex items-center justify-between gap-2 shadow-xs transition-all duration-300 hover:shadow-md`}
          >
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 truncate">
                {stat.label}
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {stat.value}
              </h2>
            </div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center text-sm sm:text-lg`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Completion Progress Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-150">Productivity Score</h4>
            <p className="text-[11px] font-medium text-slate-450 dark:text-slate-400">Percentage of overall goals completed</p>
          </div>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-xl">
            {completionRate}% Completed
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}