"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/common/Loader";

/**
 * AuthGuard wraps protected pages and redirects to /login if unauthenticated.
 * Also checks if a token exists in localStorage and fetches the user profile
 * to restore auth state after a page refresh.
 */
export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, profile } = useAuth();

  useEffect(() => {
    // If Redux says not authenticated, check if a token exists in localStorage
    // (happens after page refresh since Redux state resets)
    const token = localStorage.getItem("token");

    if (!isAuthenticated && token) {
      // Token exists but Redux state was lost — restore by fetching profile
      profile();
    } else if (!isAuthenticated && !token) {
      // No token at all — redirect to login
      router.replace("/login");
    }
  }, [isAuthenticated, router, profile]);

  // Show loader while checking auth
  if (loading || !isAuthenticated) {
    return <Loader />;
  }

  return <>{children}</>;
}
