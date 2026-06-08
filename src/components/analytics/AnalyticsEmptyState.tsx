import { ReactNode } from "react";

interface AnalyticsEmptyStateProps {
	/** Override the default icon. */
	icon?: ReactNode;
	/** Override the default title. */
	title?: string;
	/** Override the default description. */
	description?: string;
	/** Optional action button (e.g. "Refresh" or "Connect wallet"). */
	action?: {
		label: string;
		onClick: () => void;
	};
}

/**
 * Full-page empty state for the analytics dashboard.
 *
 * Shown when the data fetch succeeds but returns no metrics, charts, or
 * assets — i.e. the account has no activity yet for the selected period.
 */
export function AnalyticsEmptyState({
	icon,
	title = "No analytics data yet",
	description = "There is no activity to display for the selected period. Data will appear here once transactions start flowing through the platform.",
	action,
}: AnalyticsEmptyStateProps) {
	return (
		<div
			role="status"
			aria-label="No analytics data"
			className="flex min-h-[480px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
		>
			{/* Icon */}
			<div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
				{icon ?? <DefaultChartIcon />}
			</div>

			{/* Heading */}
			<h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
				{title}
			</h2>

			{/* Description */}
			<p className="mb-6 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
				{description}
			</p>

			{/* Optional action */}
			{action && (
				<button
					type="button"
					onClick={action.onClick}
					className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-50"
				>
					{action.label}
				</button>
			)}
		</div>
	);
}

/** Bar-chart icon used as the default visual. */
function DefaultChartIcon() {
	return (
		<svg
			aria-hidden="true"
			className="h-10 w-10 text-zinc-400 dark:text-zinc-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
			/>
		</svg>
	);
}
