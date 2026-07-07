"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

/**
 * GuestGuard wraps auth pages (login/register) and redirects to /dashboard
 * if the user is already authenticated.
 */
export default function GuestGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // If authenticated, don't flash the login page
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
