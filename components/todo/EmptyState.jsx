export default function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-slate-200/80 p-12 text-center shadow-sm">
      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 text-3xl mb-6 shadow-inner">
        📋
      </div>

      <h2 className="text-xl font-bold text-slate-800 tracking-tight">
        No Tasks Found
      </h2>

      <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm font-medium leading-relaxed">
        Your task list is completely clear. Get started by creating your very first task above!
      </p>
    </div>
  );
}