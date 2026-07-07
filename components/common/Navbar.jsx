"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/hooks/useAuth";
import useTodo from "@/hooks/useTodo";
import { clearToast } from "@/redux/features/todo/todoSlice";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { todos, fetchTodos } = useTodo();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useSelector((state) => state.todo || {});

  // Fetch todos inside Navbar on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos({ all: true });
    }
  }, [isAuthenticated, fetchTodos]);

  // Compute urgent notifications list
  const notifications = useMemo(() => {
    if (!isAuthenticated || !todos) return [];

    const list = todos || [];
    const now = new Date();
    now.setHours(0, 0, 0, 0); // start of today

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1); // start of tomorrow

    const result = [];

    list.forEach((todo) => {
      if (todo.status === "COMPLETED" || !todo.dueDate) return;

      const due = new Date(todo.dueDate);
      due.setHours(0, 0, 0, 0);

      if (due < now) {
        result.push({
          id: todo._id,
          type: "OVERDUE",
          message: `🔴 OVERDUE: "${todo.title}" was due on ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}!`,
          color: "text-red-500 font-extrabold dark:text-red-400",
        });
      } else if (due.getTime() === now.getTime()) {
        result.push({
          id: todo._id,
          type: "TODAY",
          message: `🟡 URGENT: "${todo.title}" is due today!`,
          color: "text-amber-600 dark:text-amber-400 font-bold",
        });
      } else if (due.getTime() === tomorrow.getTime()) {
        result.push({
          id: todo._id,
          type: "TOMORROW",
          message: `🔵 REMINDER: "${todo.title}" is due tomorrow.`,
          color: "text-blue-600 dark:text-blue-400 font-semibold",
        });
      }
    });

    return result;
  }, [todos, isAuthenticated]);

  // Sync state with current document class on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const handle = requestAnimationFrame(() => setTheme(isDark ? "dark" : "light"));
    return () => cancelAnimationFrame(handle);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    router.push("/login");
  };

  const authLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Todos", href: "/todos" },
  ];

  const guestLinks = [
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  const links = isAuthenticated ? authLinks : guestLinks;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/60 transition-all duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 transform group-hover:scale-105 transition-transform duration-300">
              ✓
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${pathname === link.href
                      ? "bg-slate-900/5 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-slate-800/50"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-850 flex items-center justify-center text-base transition-all duration-300 border border-slate-200/40 dark:border-slate-800 cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              suppressHydrationWarning
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* Desktop Notifications Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative w-9 h-9 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-855 flex items-center justify-center text-base transition-all duration-300 border border-slate-200/40 dark:border-slate-800 cursor-pointer"
                  title="Notifications"
                  suppressHydrationWarning
                >
                  🔔
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black border border-white dark:border-slate-950 animate-bounce">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotifOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotifOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-3.5 z-50 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xl animate-scale-up max-h-[350px] overflow-y-auto">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-450 dark:text-slate-500">
                          Urgent Alerts
                        </h3>
                        {notifications.length > 0 && (
                          <span className="text-[10px] font-bold text-rose-500 dark:text-rose-455 bg-rose-50 dark:bg-rose-955/20 px-2 py-0.5 rounded-full">
                            {notifications.length} Pending
                          </span>
                        )}
                      </div>

                      <div className="pt-2 space-y-2">
                        {notifications.length > 0 ? (
                          notifications.map((notif, index) => (
                            <Link
                              key={index}
                              href="/todos"
                              onClick={() => setIsNotifOpen(false)}
                              className="block p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all duration-200"
                            >
                              <p className={`text-xs leading-relaxed ${notif.color}`}>
                                {notif.message}
                              </p>
                            </Link>
                          ))
                        ) : (
                          <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                            ✨ No urgent alerts. You are caught up!
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {isAuthenticated && (
              <div className="relative flex items-center pl-4 border-l border-slate-200/80 dark:border-slate-800">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:bg-slate-900/5 dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none"
                  title="View Profile Details"
                  suppressHydrationWarning
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm border border-white/10">
                    {user?.name ? user.name[0] : "U"}
                  </div>
                  <span className="text-slate-700 dark:text-white text-sm font-bold max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <span className="text-[8px] text-slate-400 dark:text-slate-500 transition-transform duration-250">
                    {isProfileOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Profile popover dropdown card */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-3.5 z-50 w-72 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xl animate-scale-up">
                      <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-black uppercase shadow-md mb-3 border border-white/20">
                          {user?.name ? user.name[0] : "U"}
                        </div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                          {user?.name}
                        </h3>
                        <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold truncate max-w-full">
                          {user?.email || "deepti@example.com"}
                        </p>
                      </div>

                      <div className="py-4 space-y-2.5">
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-4 py-2.5 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Account Type</span>
                          <span className="text-xs font-extrabold text-blue-605 dark:text-blue-400">Standard User</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={handleLogout}
                          className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-3 rounded-2xl text-xs sm:text-sm font-black shadow-sm shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                          suppressHydrationWarning
                        >
                          Logout Account
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Theme Toggle & Mobile Menu Hamburger Button */}
          <div className="md:hidden flex items-center gap-1.5">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-850 flex items-center justify-center text-base transition-all duration-300 border border-slate-200/40 dark:border-slate-800 cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              suppressHydrationWarning
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-450 hover:text-slate-950 dark:hover:text-white p-2 rounded-xl focus:outline-none hover:bg-slate-900/5 dark:hover:bg-slate-800/40 transition cursor-pointer"
              aria-label="Toggle menu"
              suppressHydrationWarning
            >
              {isOpen ? (
                <span className="text-xl font-black">✕</span>
              ) : (
                <span className="text-xl font-black">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3 animate-fadeIn">
            <div className="flex flex-col gap-1.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 block ${pathname === link.href
                      ? "bg-slate-900/5 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-slate-800/40"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-3">
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                    {user?.name ? user.name[0] : "U"}
                  </div>
                  <span className="text-slate-705 dark:text-white text-sm font-bold">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-3 rounded-xl text-sm font-bold shadow-sm shadow-red-500/10 hover:shadow-red-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  suppressHydrationWarning
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md px-5 py-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-slide-down border transition-all duration-300 ${
          toast.type === "error"
            ? "bg-rose-950/95 border-rose-900/60 text-rose-100"
            : "bg-slate-900 border-slate-800 text-white"
        }`}>
          <span className="text-sm font-semibold truncate flex-1 leading-snug">
            {toast.message}
          </span>
          <button
            onClick={() => dispatch(clearToast())}
            className={`font-extrabold cursor-pointer text-sm shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200 ${
              toast.type === "error"
                ? "text-rose-300 hover:text-white hover:bg-rose-900/50"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
            suppressHydrationWarning
          >
            ✕
          </button>
        </div>
      )}
    </nav>
  );
}