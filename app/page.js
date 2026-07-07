import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">
        
        {/* Animated Accent */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-3xl mb-8 shadow-xl shadow-blue-500/30 group hover:rotate-6 transition-all duration-300">
          <div className="absolute inset-0 rounded-3xl bg-blue-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
          ✓
        </div>

        <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
          Organize Your Life,<br />One Task at a Time
        </h1>

        <p className="text-slate-550 dark:text-slate-400 mb-10 text-lg font-medium max-w-md mx-auto leading-relaxed">
          TaskFlow helps you list, track, and complete your daily goals with a clean, focused, and intuitive dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto">
          <Link
            href="/login"
            className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-bold py-3.5 rounded-2xl transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 text-center"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="w-full sm:flex-1 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 active:scale-95 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-2xl transition-all duration-200 text-center shadow-sm"
          >
            Create Account
          </Link>
        </div>

      </div>
    </main>
  );
}