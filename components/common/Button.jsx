"use client";

export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
  loading = false,
  fullWidth = false,
}) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 focus:ring-blue-500/20",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-md shadow-red-500/10 hover:shadow-red-500/20 focus:ring-red-500/20",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 focus:ring-emerald-500/20",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-500/10",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-500/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        font-semibold
        py-2.5
        px-5
        rounded-xl
        transition-all
        duration-300
        focus:outline-none
        focus:ring-4
        hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        ${fullWidth ? "w-full" : ""}
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}