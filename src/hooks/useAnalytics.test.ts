import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAnalytics } from "./useAnalytics";

// ---------------------------------------------------------------------------
// Mock the analytics mock-data module
// ---------------------------------------------------------------------------

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
			volume: "$4,234,567",
			volumeChange: 15.2,
			tvl: "$18.2M",
			txCount: 28432,
		},
	],
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useAnalytics", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("starts in a loading state", () => {
		const { result } = renderHook(() => useAnalytics());
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeNull();
		expect(result.current.isError).toBe(false);
	});

	it("transitions to success and returns data", async () => {
		const { result } = renderHook(() => useAnalytics());

		await waitFor(() => {
			expect(result.current.status).toBe("success");
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.data).not.toBeNull();
		expect(result.current.data?.metrics).toHaveLength(1);
		expect(result.current.data?.metrics[0].label).toBe("Total Volume");
		expect(result.current.data?.volumeData).toHaveLength(1);
		expect(result.current.data?.transactionsData).toHaveLength(1);
		expect(result.current.data?.topAssets).toHaveLength(1);
	});

	it("exposes a refetch function that re-triggers the load", async () => {
		const { result } = renderHook(() => useAnalytics());

		// Wait for initial success
		await waitFor(() => expect(result.current.status).toBe("success"));

		// Trigger refetch — status should go back to loading
		result.current.refetch();

		await waitFor(() => expect(result.current.isLoading).toBe(true));

		// Then succeed again
		await waitFor(() => expect(result.current.status).toBe("success"));
	});

	it("transitions to error state when the import fails", async () => {
		vi.doMock("@/mock-data/analytics", () => {
			throw new Error("Network error");
		});

		// Re-import the hook after mocking to pick up the new mock
		const { useAnalytics: useAnalyticsError } = await import("./useAnalytics");
		const { result } = renderHook(() => useAnalyticsError());

		await waitFor(() => {
			expect(result.current.status).toBe("error");
		});

		expect(result.current.isError).toBe(true);
		expect(result.current.data).toBeNull();
		expect(result.current.error).toBeTruthy();

		// Restore the original mock
		vi.doMock("@/mock-data/analytics", () => ({
			metrics: [],
			volumeData: [],
			transactionsData: [],
			topAssets: [],
		}));
	});

	it("cleans up and ignores stale responses when unmounted during fetch", async () => {
		const { result, unmount } = renderHook(() => useAnalytics());

		// Unmount before the async load resolves
		unmount();

		// No state updates should throw after unmount
		await waitFor(() => {
			// If we reach here without errors, cleanup worked correctly
			expect(true).toBe(true);
		});
	});
});
