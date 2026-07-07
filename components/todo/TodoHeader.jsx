export default function TodoHeader({ onAddClick }) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <span>My Tasks</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Organize, plan, and track your daily routine tasks
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Decorative premium badge */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-slate-600 dark:text-slate-455 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Live syncing active
        </div>

        {/* Add Task Trigger Button */}
        <button
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-1.5"
        >
          <span className="text-white font-extrabold text-base leading-none mr-0.5">✚</span> Add Task
        </button>
      </div>
    </div>
  );
}