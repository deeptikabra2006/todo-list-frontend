"use client";

import { useState } from "react";

export default function TodoFilters({
  search,
  setSearch,
  onSearchSubmit,
  onClearSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  tagFilter,
  setTagFilter,
  sortBy,
  setSortBy,
  availableTags = [],
  itemsPerPage,
  setItemsPerPage,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const sortOptions = [
    { value: "createdAt_desc", label: "🆕 Newest First" },
    { value: "createdAt_asc", label: "⏳ Oldest First" },
    { value: "dueDate_asc", label: "📅 Due Date (Soonest)" },
    { value: "dueDate_desc", label: "📅 Due Date (Latest)" },
    { value: "priority_desc", label: "🔥 Priority (High to Low)" },
    { value: "priority_asc", label: "💧 Priority (Low to High)" },
    { value: "title_asc", label: "🔤 Title (A to Z)" },
  ];

  const statusOptions = [
    { value: "ALL", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "ALL", label: "All Priorities" },
    { value: "HIGH", label: "🔴 High" },
    { value: "MEDIUM", label: "🟡 Medium" },
    { value: "LOW", label: "🟢 Low" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 mb-6 transition-all duration-300 hover:shadow-md">
      {/* Search and Sort row */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchSubmit && onSearchSubmit();
              }
            }}
            placeholder="Search tasks by title or details..."
            className="w-full pl-11 pr-26 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl text-slate-900 dark:text-slate-100 text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  onClearSearch && onClearSearch();
                }}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-300 font-bold p-1 cursor-pointer transition-colors"
                title="Clear search"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => onSearchSubmit && onSearchSubmit()}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-wrap w-full md:w-auto gap-2 items-center">
          {/* Rows per page selector */}
          <div className="flex-1 md:flex-initial relative">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full md:w-32 appearance-none bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all duration-300 cursor-pointer"
              title="Rows per page"
            >
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={num} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {num} Rows
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 text-xs">
              ▼
            </span>
          </div>

          {/* Sort By Select */}
          <div className="flex-1 md:flex-initial relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 appearance-none bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all duration-300 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 text-xs">
              ▼
            </span>
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-3 border rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              showAdvanced
                ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-800/80 dark:text-blue-400"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
            }`}
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Filters</span>
            {showAdvanced ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Panel */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-105 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider">
              Filter by Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-755 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white text-sm font-medium focus:outline-none focus:border-blue-500 transition-all duration-300 cursor-pointer"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 text-xs">
                ▼
              </span>
            </div>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider">
              Filter by Priority
            </label>
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-700 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white text-sm font-medium focus:outline-none focus:border-blue-500 transition-all duration-300 cursor-pointer"
              >
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 text-xs">
                ▼
              </span>
            </div>
          </div>

          {/* Tags Chips Bar */}
          {availableTags.length > 0 && (
            <div className="sm:col-span-2 space-y-2 mt-2">
              <label className="text-xs font-bold text-slate-550 dark:text-slate-405 uppercase tracking-wider block">
                Filter by Tag
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTagFilter("ALL")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    tagFilter === "ALL"
                      ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  All Tags
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tag)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      tagFilter === tag
                        ? "bg-blue-600 dark:bg-blue-700 text-white shadow-sm"
                        : "bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    }`}
                  >
                    🏷️ {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
