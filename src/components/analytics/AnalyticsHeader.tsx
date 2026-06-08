"use client";

import type { DateRange } from "./DateRangePicker";
import { DateRangePicker } from "./DateRangePicker";

export type { DateRange };

interface AnalyticsHeaderProps {
	/** Currently selected date range. */
	range: DateRange;
	/** Called when the user picks a new range. */
	onRangeChange: (range: DateRange) => void;
}

export function AnalyticsHeader({
	range,
	onRangeChange,
}: AnalyticsHeaderProps) {
	return (
		<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
					Analytics
				</h1>
				<p className="mt-1 text-zinc-500 dark:text-zinc-400">
					Comprehensive overview of platform metrics, volumes, and trends
				</p>
			</div>

			<DateRangePicker value={range} onChange={onRangeChange} />
		</header>
	);
}
