"use client";

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
  error = "",
  id,
  ...props
}) {
  const inputId = id || name;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          suppressHydrationWarning
          className={`
            w-full
            border
            rounded-xl
            px-4
            py-3
            text-slate-900
            dark:text-slate-100
            placeholder-slate-400
            dark:placeholder-slate-500
            bg-white
            dark:bg-slate-900
            shadow-sm
            transition-all
            duration-300
            focus:outline-none
            focus:ring-4
            ${
              error
                ? "border-red-300 dark:border-red-900/50 focus:ring-red-500/10 focus:border-red-500"
                : "border-slate-200 dark:border-slate-800 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:ring-blue-500/5 dark:focus:border-blue-500"
            }
            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-red-500 text-xs font-semibold mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}