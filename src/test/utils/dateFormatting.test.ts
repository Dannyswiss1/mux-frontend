import { describe, expect, it } from "vitest";
import { formatDate } from "@/utils/dateFormatting";

describe("formatDate", () => {
	it("returns '—' for undefined", () => {
		expect(formatDate(undefined)).toBe("—");
	});

	it("formats a known date to en-US short format", () => {
		// Jan 15, 2024
		const date = new Date("2024-01-15T10:30:00Z");
		const result = formatDate(date);
		// Intl.DateTimeFormat output varies slightly by locale/timezone in CI,
		// so we assert the key parts are present.
		expect(result).toMatch(/Jan/);
		expect(result).toMatch(/2024/);
	});

	it("formats another known date correctly", () => {
		const date = new Date("2025-06-15T00:00:00Z");
		const result = formatDate(date);
		expect(result).toMatch(/Jun/);
		expect(result).toMatch(/2025/);
	});

	it("handles the epoch date without throwing", () => {
		const epoch = new Date(0);
		expect(() => formatDate(epoch)).not.toThrow();
	});

	it("handles a far-future date without throwing", () => {
		const future = new Date("2099-12-31T23:59:59Z");
		const result = formatDate(future);
		expect(result).toMatch(/2099/);
	});
});
