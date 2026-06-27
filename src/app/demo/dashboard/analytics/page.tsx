"use client";

import { useState } from "react";
import {
	AnalyticsChart,
	AnalyticsHeader,
	type DateRange,
	AnalyticsLoadingSkeleton,
	MetricsCards,
	TopAssetsTable,
} from "@/components/analytics";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
	const [range, setRange] = useState<DateRange>(() => {
		const to = new Date();
		const from = new Date();
		from.setDate(from.getDate() - 7);
		return {
			from: from.toISOString().slice(0, 10),
			to: to.toISOString().slice(0, 10),
		};
	});
	const { data, isLoading, isError, error, refetch } = useAnalytics();

	if (isLoading) {
		return <AnalyticsLoadingSkeleton />;
	}

	if (isError || !data) {
		return (
			<ErrorState
				title="Failed to load analytics"
				description={error ?? "An unexpected error occurred. Please try again."}
				retry={{ onRetry: refetch }}
			/>
		);
	}

	return (
		<div className="space-y-8">
			<AnalyticsHeader range={range} onRangeChange={setRange} />

			<MetricsCards metrics={data.metrics} />

			<div className="grid gap-6 lg:grid-cols-2">
				<AnalyticsChart
					title="Volume Over Time"
					description="Total daily trading volume in USD"
					data={data.volumeData}
					formatValue={(v) => `$${(v / 1000000).toFixed(1)}M`}
				/>
				<AnalyticsChart
					title="Transactions Over Time"
					description="Total daily transaction count"
					data={data.transactionsData}
				/>
			</div>

			<TopAssetsTable assets={data.topAssets} />
		</div>
	);
}
