"use client";

export default function Loader({ size = "md", fullPage = false }) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-[3px]",
    lg: "h-16 w-16 border-4",
  };

  const spinner = (
    <div
      className={`rounded-full border-blue-600/20 border-t-blue-600 animate-spin ${sizeClasses[size] || sizeClasses.md}`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-md gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-blue-500/10 blur-xl animate-pulse" />
          {spinner}
        </div>
        <span className="text-sm font-semibold tracking-wide text-slate-500 animate-pulse">
          Loading TaskFlow...
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      {spinner}
    </div>
  );
}