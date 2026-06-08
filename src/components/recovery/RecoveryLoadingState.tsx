import { cn } from "@/lib/utils";

interface RecoveryLoadingStateProps {
	/** Optional message shown below the spinner. */
	message?: string;
	/** Extra classes on the root element. */
	className?: string;
}

/**
 * Full-section loading state for the recovery UI.
 * Shown while initial recovery status is being fetched.
 * Uses a skeleton layout that mirrors the RecoveryExplanation structure
 * so the page doesn't jump when content loads.
 */
export function RecoveryLoadingState({
	message = "Loading recovery status\u2026",
	className,
}: RecoveryLoadingStateProps) {
	return (
		<div
			role="status"
			aria-label={message}
			aria-live="polite"
			aria-busy="true"
			className={cn("space-y-8", className)}
		>
			{/* Status card skeleton */}
			<div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-40 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
							<div className="h-3 w-56 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
						</div>
					</div>
					<div className="h-6 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
				</div>
			</div>

			{/* Explanation card skeleton */}
			<div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 space-y-6">
				<div className="space-y-2">
					<div className="h-6 w-64 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
					<div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
					<div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
				</div>

				<div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-4">
					<div className="h-5 w-32 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex gap-4">
							<div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
							<div className="flex-1 space-y-2">
								<div className="h-4 w-40 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
								<div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
								<div className="h-3 w-4/5 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Visually hidden accessible label */}
			<span className="sr-only">{message}</span>
		</div>
	);
}
