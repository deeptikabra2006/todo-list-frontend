import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center p-6 max-w-sm w-full">
        <h1 className="text-7xl font-black text-red-500 tracking-tight animate-bounce">
          404
        </h1>

        <h2 className="text-3xl font-black mt-4 text-slate-900 dark:text-slate-50 tracking-tight">
          Page Not Found
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm font-semibold">
          The page you are looking for doesn&apos;t exist.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/25 transition cursor-pointer"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}