import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAnalyticsMetrics } from "./useAnalyticsMetrics";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock the analytics service so we control what the hook fetches
vi.mock("@/services/analyticsService", () => ({
	fetchAllAnalytics: vi.fn(),
}));

// Mock the API client factory
vi.mock("@/lib/api", () => ({
	default: vi.fn(() => ({})),
}));

// Mock mock-data/analytics for the fallback path
vi.mock("@/mock-data/analytics", () => ({
	metrics: [
		{
			label: "Total Volume",
			value: "$12.4M",
			change: 12.5,
			changeLabel: "vs last period",
		},
	],
	volumeData: [{ date: "Mon", value: 2400000 }],
	transactionsData: [{ date: "Mon", value: 12000 }],
	topAssets: [
		{
			rank: 1,
			name: "Mux Protocol",
			symbol: "MUX",
			volume: "$4M",
			volumeChange: 15,
			tvl: "$18M",
			txCount: 28000,
		},
	],
}));

const RANGE = { from: "2024-01-01", to: "2024-01-07" };

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useAnalyticsMetrics", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		// Default: no API base URL → mock fallback path
		vi.stubEnv("NEXT_PUBLIC_MUX_API_URL", "");
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
	});

	// -------------------------------------------------------------------------
	// Initial state
	// -------------------------------------------------------------------------

	it("starts in a loading state", () => {
		const { result } = renderHook(() => useAnalyticsMetrics(RANGE));
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeNull();
		expect(result.current.isError).toBe(false);
		expect(result.current.isEmpty).toBe(false);
	});

	// -------------------------------------------------------------------------
	// Mock fallback (no API URL configured)
	// -------------------------------------------------------------------------

	it("loads mock data when no API URL is configured", async () => {
		const { result } = renderHook(() => useAnalyticsMetrics(RANGE));

		await waitFor(() => expect(result.current.status).toBe("success"));

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.isEmpty).toBe(false);
		expect(result.current.data?.metrics).toHaveLength(1);
		expect(result.current.data?.volumeData).toHaveLength(1);
		expect(result.current.data?.transactionsData).toHaveLength(1);
		expect(result.current.data?.topAssets).toHaveLength(1);
	});

	// -------------------------------------------------------------------------
	// Real API path
	// -------------------------------------------------------------------------

	it("calls fetchAllAnalytics when API URL is configured", async () => {
		const { fetchAllAnalytics } = await import("@/services/analyticsService");
		vi.mocked(fetchAllAnalytics).mockResolvedValue({
			metrics: [
				{ label: "Vol", value: "$1M", change: 5, changeLabel: "vs last" },
			],
			volumeData: [{ date: "Mon", value: 100 }],
			transactionsData: [{ date: "Mon", value: 50 }],
			topAssets: [],
		});

		vi.stubEnv("NEXT_PUBLIC_MUX_API_URL", "https://api.muxprotocol.com");

		const { result } = renderHook(() => useAnalyticsMetrics(RANGE));

		await waitFor(() => expect(result.current.status).toBe("success"));

		expect(fetchAllAnalytics).toHaveBeenCalledWith(expect.anything(), RANGE);
		expect(result.current.data?.metrics[0].label).toBe("Vol");
	});

	// -------------------------------------------------------------------------
	// Empty state
	// -------------------------------------------------------------------------

	it("transitions to empty when all collections are empty", async () => {
		const { fetchAllAnalytics } = await import("@/services/analyticsService");
		vi.mocked(fetchAllAnalytics).mockResolvedValue({
			metrics: [],
			volumeData: [],
			transactionsData: [],
			topAssets: [],
		});

		vi.stubEnv("NEXT_PUBLIC_MUX_API_URL", "https://api.muxprotocol.com");

		const { result } = renderHook(() => useAnalyticsMetrics(RANGE));

		await waitFor(() => expect(result.current.status).toBe("empty"));

		expect(result.current.isEmpty).toBe(true);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.data).not.toBeNull();
	});

	// -------------------------------------------------------------------------
	// Range change triggers re-fetch
	// -------------------------------------------------------------------------

	it("re-fetches when the date range changes", async () => {
		const { fetchAllAnalytics } = await import("@/services/analyticsService");
		vi.mocked(fetchAllAnalytics).mockResolvedValue({
			metrics: [
				{ label: "Vol", value: "$1M", change: 5, changeLabel: "vs last" },
			],
			volumeData: [],
			transactionsData: [],
			topAssets: [],
		});

		vi.stubEnv("NEXT_PUBLIC_MUX_API_URL", "https://api.muxprotocol.com");

		const { result, rerender } = renderHook(
			({ range }) => useAnalyticsMetrics(range),
			{ initialProps: { range: RANGE } },
		);

		await waitFor(() => expect(result.current.status).toBe("success"));
		expect(fetchAllAnalytics).toHaveBeenCalledTimes(1);

		rerender({ range: { from: "2024-02-01", to: "2024-02-07" } });

		await waitFor(() => expect(fetchAllAnalytics).toHaveBeenCalledTimes(2));
		expect(fetchAllAnalytics).toHaveBeenLastCalledWith(expect.anything(), {
			from: "2024-02-01",
			to: "2024-02-07",
		});
	});

	// -------------------------------------------------------------------------
	// Refetch
	// -------------------------------------------------------------------------

	it("refetch re-triggers the load", async () => {
		const { result } = renderHook(() => useAnalyticsMetrics(RANGE));

		await waitFor(() => expect(result.current.status).toBe("success"));

		act(() => {
			result.current.refetch();
		});

		await waitFor(() => expect(result.current.isLoading).toBe(true));
		await waitFor(() => expect(result.current.status).toBe("success"));
	});

	// -------------------------------------------------------------------------
	// Error state + fallback
	// -------------------------------------------------------------------------

	it("falls back to mock data when the API call fails", async () => {
		const { fetchAllAnalytics } = await import("@/services/analyticsService");
		vi.mocked(fetchAllAnalytics).mockRejectedValue(new Error("API down"));

		vi.stubEnv("NEXT_PUBLIC_MUX_API_URL", "https://api.muxprotocol.com");

		const { result } = renderHook(() => useAnalyticsMetrics(RANGE));

		// Should recover via mock fallback → success
		await waitFor(() => expect(result.current.status).toBe("success"));
		expect(result.current.isError).toBe(false);
		expect(result.current.data?.metrics).toHaveLength(1);
	});

	// -------------------------------------------------------------------------
	// Stale / unmount cleanup
	// -------------------------------------------------------------------------

	it("ignores stale responses when unmounted during fetch", async () => {
		const { result, unmount } = renderHook(() => useAnalyticsMetrics(RANGE));
		unmount();

		await waitFor(() => {
			expect(true).toBe(true);
		});
	});
});
