"use client";

import AuthGuard from "@/components/common/AuthGuard";

export default function DashboardLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
