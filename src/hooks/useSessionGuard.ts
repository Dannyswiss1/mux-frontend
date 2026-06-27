"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * useSessionGuard
 *
 * Client-side complement to the Next.js middleware route protection.
 * Redirects unauthenticated users to the login page once the auth state
 * has finished loading, handling the case where the middleware cookie check
 * passes but the in-memory session is stale or missing (e.g. after a hard
 * refresh with an expired sessionStorage record).
 *
 * Usage — place at the top of any protected page or layout:
 *
 *   export default function DashboardPage() {
 *     useSessionGuard();
 *     // ...
 *   }
 *
 * @param redirectTo - Path to redirect unauthenticated users to (default: "/login")
 */
export function useSessionGuard(redirectTo = "/login"): void {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated) {
			const callbackUrl = encodeURIComponent(window.location.pathname);
			router.replace(`${redirectTo}?callbackUrl=${callbackUrl}`);
		}
	}, [isAuthenticated, isLoading, redirectTo, router]);
}
