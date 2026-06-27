"use client";

import { Skeleton } from "@/components/ui/Skeleton";

/**
 * AuthLoadingSkeleton
 *
 * Full-page skeleton displayed while the auth state is being rehydrated
 * from sessionStorage on the client (issue #44).
 *
 * Mirrors the DashboardLayout chrome (sidebar + topnav + content area) so
 * the page does not flash an empty or unstyled state during the brief
 * loading window.
 */
export function AuthLoadingSkeleton() {
	return (
		<div
			className="relative flex min-h-screen bg-gray-50"
			aria-busy="true"
			aria-label="Loading application"
			data-testid="auth-loading-skeleton"
		>
			{/* Sidebar skeleton — visible on large screens */}
			<div className="hidden lg:flex lg:flex-col lg:w-64 border-r bg-white">
				{/* Logo area */}
				<div className="flex h-16 items-center gap-3 border-b px-6">
					<Skeleton className="h-8 w-8 rounded-lg" />
					<Skeleton className="h-5 w-24" />
				</div>

				{/* Nav items */}
				<nav className="flex-1 space-y-1 px-4 py-6" aria-hidden="true">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
							key={i}
							className="flex items-center gap-3 rounded-lg px-4 py-3"
						>
							<Skeleton className="h-5 w-5 shrink-0 rounded" />
							<Skeleton className="h-4 w-28" />
						</div>
					))}
				</nav>

				{/* User profile area */}
				<div className="border-t p-4">
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-full shrink-0" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-2 w-16" />
						</div>
					</div>
				</div>
			</div>

			{/* Main content area */}
			<div className="flex flex-col flex-1 min-w-0">
				{/* TopNav skeleton */}
				<header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-8">
					{/* Mobile menu button placeholder */}
					<Skeleton className="h-6 w-6 rounded lg:hidden" />
					<div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

					{/* Page title */}
					<div className="flex flex-1 items-center gap-x-4">
						<Skeleton className="h-6 w-32" />

						{/* Right-side actions */}
						<div className="ml-auto flex items-center gap-x-4">
							<Skeleton className="h-8 w-32 rounded-lg" />
							<Skeleton className="hidden h-8 w-64 rounded-lg lg:block" />
							<Skeleton className="h-8 w-8 rounded-full" />
							<div className="flex items-center gap-2">
								<Skeleton className="h-8 w-8 rounded-full" />
								<Skeleton className="hidden h-4 w-20 lg:block" />
							</div>
						</div>
					</div>
				</header>

				{/* Page content skeleton */}
				<main className="flex-1 py-6">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
						{/* Page header */}
						<div className="space-y-2">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-72" />
						</div>

						{/* Content cards */}
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
									key={i}
									className="rounded-xl border border-gray-200 bg-white p-6 space-y-4"
								>
									<div className="flex items-center justify-between">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-6 w-6 rounded" />
									</div>
									<Skeleton className="h-8 w-32" />
									<Skeleton className="h-3 w-20" />
								</div>
							))}
						</div>

						{/* Table skeleton */}
						<div className="rounded-xl border border-gray-200 bg-white">
							<div className="border-b px-6 py-4">
								<Skeleton className="h-5 w-32" />
							</div>
							<div className="divide-y divide-gray-100">
								{Array.from({ length: 5 }).map((_, i) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
										key={i}
										className="flex items-center gap-4 px-6 py-4"
									>
										<Skeleton className="h-4 w-48" />
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-16" />
										<Skeleton className="ml-auto h-4 w-24" />
									</div>
								))}
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
