import { useCallback, useEffect, useRef, useState } from "react";
import {
	fetchRecoveryStatus,
	pollRecoveryStatus,
	type RecoveryStatusResponse,
} from "@/services/recoveryApi";
import type { RecoveryTimeline } from "@/types/recovery";

/**
 * Loading states for recovery status
 */
export type RecoveryLoadingState = "idle" | "loading" | "success" | "error";

/**
 * Hook for fetching and managing recovery status from API
 *
 * Features:
 * - Fetches recovery status from API
 * - Handles loading, success, and error states
 * - Automatic polling for in-progress recoveries
 * - Retry logic with exponential backoff
 * - Graceful error handling
 * - Stale state detection
 *
 * @param walletId - The wallet ID to fetch recovery status for
 * @param options - Configuration options
 * @returns Object containing recovery status, loading state, and utility functions
 *
 * @example
 * const { timeline, loading, error, refetch } = useRecoveryStatus("wallet-123");
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * if (timeline) return <RecoveryTimelineList events={timeline.events} />;
 */
export function useRecoveryStatus(
	walletId: string | null,
	options: {
		autoFetch?: boolean;
		pollInterval?: number;
		maxPollDuration?: number;
		onStatusChange?: (timeline: RecoveryTimeline) => void;
		onError?: (error: string) => void;
	} = {},
) {
	const {
		autoFetch = true,
		pollInterval = 5000,
		maxPollDuration = 300000,
		onStatusChange,
		onError,
	} = options;

	const [timeline, setTimeline] = useState<RecoveryTimeline | null>(null);
	const [loading, setLoading] = useState<RecoveryLoadingState>("idle");
	const [error, setError] = useState<string | null>(null);
	const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
	const [isStale, setIsStale] = useState(false);

	const pollStopRef = useRef<(() => void) | null>(null);
	const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	/**
	 * Validates if data is stale (older than 1 minute)
	 */
	const checkIfStale = useCallback((fetchTime: number): boolean => {
		const staleThreshold = 60000; // 1 minute
		return Date.now() - fetchTime > staleThreshold;
	}, []);

	/**
	 * Fetches recovery status from API
	 */
	const fetchStatus = useCallback(async () => {
		if (!walletId) {
			setError("No wallet ID provided");
			setLoading("error");
			return;
		}

		setLoading("loading");
		setError(null);

		try {
			const response = await fetchRecoveryStatus(walletId);

			if (response.success && response.data) {
				setTimeline(response.data);
				setLastFetchTime(response.timestamp);
				setIsStale(false);
				setError(null);
				setLoading("success");

				// Call callback if provided
				onStatusChange?.(response.data);

				// Start polling if recovery is in progress
				if (response.data.status === "in_progress") {
					startPolling();
				}
			} else {
				const errorMessage =
					response.error || "Failed to fetch recovery status";
				setError(errorMessage);
				setLoading("error");
				onError?.(errorMessage);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			setError(errorMessage);
			setLoading("error");
			onError?.(errorMessage);
		}
	}, [walletId, onStatusChange, onError]);

	/**
	 * Starts polling for recovery status updates
	 */
	const startPolling = useCallback(() => {
		if (!walletId || pollStopRef.current) {
			return;
		}

		pollStopRef.current = pollRecoveryStatus(
			walletId,
			pollInterval,
			maxPollDuration,
			(response: RecoveryStatusResponse) => {
				if (response.success && response.data) {
					setTimeline(response.data);
					setLastFetchTime(response.timestamp);
					setIsStale(false);
					setError(null);
					setLoading("success");

					onStatusChange?.(response.data);

					// Stop polling if recovery is complete or failed
					if (
						response.data.status === "completed" ||
						response.data.status === "failed"
					) {
						stopPolling();
					}
				} else {
					const errorMessage = response.error || "Polling error";
					setError(errorMessage);
					setLoading("error");
					onError?.(errorMessage);
				}
			},
		);
	}, [walletId, pollInterval, maxPollDuration, onStatusChange, onError]);

	/**
	 * Stops polling for recovery status updates
	 */
	const stopPolling = useCallback(() => {
		if (pollStopRef.current) {
			pollStopRef.current();
			pollStopRef.current = null;
		}
	}, []);

	/**
	 * Refetches recovery status
	 */
	const refetch = useCallback(async () => {
		stopPolling();
		await fetchStatus();
	}, [fetchStatus, stopPolling]);

	/**
	 * Marks data as stale
	 */
	const markAsStale = useCallback(() => {
		setIsStale(true);
	}, []);

	/**
	 * Clears error state
	 */
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	/**
	 * Effect: Auto-fetch on mount or when walletId changes
	 */
	useEffect(() => {
		if (autoFetch && walletId) {
			fetchStatus();
		}

		return () => {
			stopPolling();
			if (fetchTimeoutRef.current) {
				clearTimeout(fetchTimeoutRef.current);
			}
		};
	}, [walletId, autoFetch, fetchStatus, stopPolling]);

	/**
	 * Effect: Check for stale data periodically
	 */
	useEffect(() => {
		if (!lastFetchTime) return;

		const checkStale = () => {
			if (checkIfStale(lastFetchTime)) {
				setIsStale(true);
			}
		};

		const interval = setInterval(checkStale, 30000); // Check every 30 seconds

		return () => clearInterval(interval);
	}, [lastFetchTime, checkIfStale]);

	return {
		// State
		timeline,
		loading,
		error,
		isStale,
		lastFetchTime,

		// Methods
		refetch,
		startPolling,
		stopPolling,
		markAsStale,
		clearError,

		// Computed
		isLoading: loading === "loading",
		isError: loading === "error",
		isSuccess: loading === "success",
		isIdle: loading === "idle",
	};
}
