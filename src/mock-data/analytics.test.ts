/**
 * Contract tests for src/mock-data/analytics.ts
 *
 * These tests verify that every export matches the shape documented in
 * src/docs/Analytics_Data_Sources.md. If a field is added, removed, or
 * renamed in the mock data, these tests will catch the drift before it
 * reaches components or the real API integration.
 */

import { describe, expect, it } from "vitest";
import { metrics, topAssets, transactionsData, volumeData } from "./analytics";

// ---------------------------------------------------------------------------
// metrics
// ---------------------------------------------------------------------------

describe("metrics", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(metrics)).toBe(true);
		expect(metrics.length).toBeGreaterThan(0);
	});

	it("every metric has a label, value, change, and changeLabel", () => {
		for (const m of metrics) {
			expect(typeof m.label).toBe("string");
			expect(m.label.trim().length).toBeGreaterThan(0);
			expect(typeof m.value).toBe("string");
			expect(m.value.trim().length).toBeGreaterThan(0);
			expect(typeof m.change).toBe("number");
			expect(typeof m.changeLabel).toBe("string");
		}
	});

	it("contains exactly 4 metrics", () => {
		expect(metrics).toHaveLength(4);
	});
});

// ---------------------------------------------------------------------------
// volumeData
// ---------------------------------------------------------------------------

describe("volumeData", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(volumeData)).toBe(true);
		expect(volumeData.length).toBeGreaterThan(0);
	});

	it("every data point has a date string and a positive numeric value", () => {
		for (const point of volumeData) {
			expect(typeof point.date).toBe("string");
			expect(point.date.trim().length).toBeGreaterThan(0);
			expect(typeof point.value).toBe("number");
			expect(point.value).toBeGreaterThan(0);
		}
	});

	it("contains 7 data points (one per day of the week)", () => {
		expect(volumeData).toHaveLength(7);
	});
});

// ---------------------------------------------------------------------------
// transactionsData
// ---------------------------------------------------------------------------

describe("transactionsData", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(transactionsData)).toBe(true);
		expect(transactionsData.length).toBeGreaterThan(0);
	});

	it("every data point has a date string and a positive numeric value", () => {
		for (const point of transactionsData) {
			expect(typeof point.date).toBe("string");
			expect(point.date.trim().length).toBeGreaterThan(0);
			expect(typeof point.value).toBe("number");
			expect(point.value).toBeGreaterThan(0);
		}
	});

	it("contains 7 data points (one per day of the week)", () => {
		expect(transactionsData).toHaveLength(7);
	});
});

// ---------------------------------------------------------------------------
// topAssets
// ---------------------------------------------------------------------------

describe("topAssets", () => {
	it("is a non-empty array", () => {
		expect(Array.isArray(topAssets)).toBe(true);
		expect(topAssets.length).toBeGreaterThan(0);
	});

	it("every asset has required fields with correct types", () => {
		for (const asset of topAssets) {
			expect(typeof asset.rank).toBe("number");
			expect(asset.rank).toBeGreaterThan(0);
			expect(typeof asset.name).toBe("string");
			expect(asset.name.trim().length).toBeGreaterThan(0);
			expect(typeof asset.symbol).toBe("string");
			expect(asset.symbol.trim().length).toBeGreaterThan(0);
			expect(typeof asset.volume).toBe("string");
			expect(typeof asset.volumeChange).toBe("number");
			expect(typeof asset.tvl).toBe("string");
			expect(typeof asset.txCount).toBe("number");
			expect(asset.txCount).toBeGreaterThan(0);
		}
	});

	it("ranks are unique and sequential starting from 1", () => {
		const ranks = topAssets.map((a) => a.rank);
		const sorted = [...ranks].sort((a, b) => a - b);
		expect(sorted[0]).toBe(1);
		for (let i = 1; i < sorted.length; i++) {
			expect(sorted[i]).toBe(sorted[i - 1] + 1);
		}
	});

	it("contains 5 assets", () => {
		expect(topAssets).toHaveLength(5);
	});
});
