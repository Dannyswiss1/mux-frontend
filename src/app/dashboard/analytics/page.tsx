"use client";

import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { AnalyticsLoadingSkeleton } from "@/components/analytics/AnalyticsLoadingSkeleton";
import { MetricsCards } from "@/components/analytics/MetricsCards";
import { TopAssetsTable } from "@/components/analytics/TopAssetsTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
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
		<div className="space-y-6">
			<AnalyticsHeader />

			<MetricsCards metrics={data.metrics} />

			<div className="grid gap-6 lg:grid-cols-2">
				<AnalyticsChart
					title="Volume"
					description="Total transaction volume over the selected period"
					data={data.volumeData}
					formatValue={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
				/>
				<AnalyticsChart
					title="Transactions"
					description="Number of transactions over the selected period"
					data={data.transactionsData}
				/>
			</div>

			<TopAssetsTable assets={data.topAssets} />
		</div>
	);
}
