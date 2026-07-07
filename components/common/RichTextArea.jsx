"use client";

export default function RichTextArea({
  label,
  name,
  value = "",
  onChange,
  placeholder,
  className = "",
  rows = 4,
  id,
  required = false,
}) {
  const inputId = id || name;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
        </label>
      )}

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all duration-300">
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          suppressHydrationWarning
          className={`
            w-full
            px-4
            py-3
            text-slate-900
            dark:text-slate-100
            placeholder-slate-400
            dark:placeholder-slate-500
            bg-transparent
            focus:outline-none
            resize-y
            text-sm
            leading-relaxed
            ${className}
          `}
        />
      </div>
    </div>
  );
}
