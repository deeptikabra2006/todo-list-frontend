"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function RegisterForm() {
  const router = useRouter();
  const { register, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setLocalError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.meta.requestStatus === "fulfilled") {
      router.push("/login");
    }
  };

  const displayError = localError || (error?.message || error);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-10 transform transition-all duration-300 hover:shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-650 text-white font-bold text-xl mb-4 shadow-lg shadow-blue-500/25">
              ✓
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Join TaskFlow to organize your tasks
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {displayError && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-650 dark:text-red-400 text-xs font-semibold rounded-xl px-4 py-3">
                {displayError}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              fullWidth
              variant="primary"
              className="mt-2"
            >
              Get Started
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}