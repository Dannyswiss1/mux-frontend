"use client";

import { useEffect, useState } from "react";
import type { AssetData, ChartDataPoint, Metric } from "@/mock-data/analytics";

export interface AnalyticsData {
	metrics: Metric[];
	volumeData: ChartDataPoint[];
	transactionsData: ChartDataPoint[];
	topAssets: AssetData[];
}

export type AnalyticsStatus = "idle" | "loading" | "success" | "error";

export interface UseAnalyticsResult {
	data: AnalyticsData | null;
	status: AnalyticsStatus;
	isLoading: boolean;
	isError: boolean;
	error: string | null;
	/** Re-trigger the fetch (e.g. after an error or range change). */
	refetch: () => void;
}

/**
 * Hook that manages analytics data fetching lifecycle.
 *
 * Currently backed by mock data with a simulated async delay so the loading
 * skeleton is exercised in development.  Swap the `loadAnalytics` function
 * body for a real API call when the backend is ready.
 */
export function useAnalytics(): UseAnalyticsResult {
	const [status, setStatus] = useState<AnalyticsStatus>("idle");
	const [data, setData] = useState<AnalyticsData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [fetchKey, setFetchKey] = useState(0);

	useEffect(() => {
		let cancelled = false;

		async function loadAnalytics() {
			setStatus("loading");
			setError(null);

			try {
				// Dynamic import keeps the mock data out of the initial bundle and
				// lets us swap this for a real fetch without touching the hook API.
				const mock = await import("@/mock-data/analytics");

				// Simulate network latency in development so the skeleton is visible.
				if (process.env.NODE_ENV === "development") {
					await new Promise((resolve) => setTimeout(resolve, 800));
				}

				if (cancelled) return;

				setData({
					metrics: mock.metrics,
					volumeData: mock.volumeData,
					transactionsData: mock.transactionsData,
					topAssets: mock.topAssets,
				});
				setStatus("success");
			} catch (err) {
				if (cancelled) return;
				const message =
					err instanceof Error ? err.message : "Failed to load analytics data.";
				setError(message);
				setStatus("error");
			}
		}

		loadAnalytics();

		return () => {
			cancelled = true;
		};
	}, [fetchKey]);

	return {
		data,
		status,
		isLoading: status === "loading" || status === "idle",
		isError: status === "error",
		error,
		refetch: () => setFetchKey((k) => k + 1),
	};
}
