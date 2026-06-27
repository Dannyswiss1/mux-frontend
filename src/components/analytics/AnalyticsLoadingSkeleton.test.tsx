import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	AnalyticsChartSkeleton,
	AnalyticsLoadingSkeleton,
	MetricsCardsSkeleton,
	TopAssetsTableSkeleton,
} from "./AnalyticsLoadingSkeleton";

// ---------------------------------------------------------------------------
// AnalyticsLoadingSkeleton (full-page)
// ---------------------------------------------------------------------------

describe("AnalyticsLoadingSkeleton", () => {
	it("renders with role='status' and accessible label", () => {
		render(<AnalyticsLoadingSkeleton />);
		const region = screen.getByRole("status");
		expect(region).toBeInTheDocument();
		expect(region).toHaveAttribute("aria-label", "Loading analytics data");
	});

	it("has aria-live='polite' so screen readers announce the update", () => {
		render(<AnalyticsLoadingSkeleton />);
		expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
	});

	it("renders the metrics cards skeleton section", () => {
		render(<AnalyticsLoadingSkeleton />);
		expect(screen.getByLabelText("Loading metrics")).toBeInTheDocument();
	});

	it("renders two chart skeleton sections", () => {
		render(<AnalyticsLoadingSkeleton />);
		const charts = screen.getAllByLabelText("Loading chart");
		expect(charts).toHaveLength(2);
	});

	it("renders the top assets table skeleton section", () => {
		render(<AnalyticsLoadingSkeleton />);
		expect(screen.getByLabelText("Loading top assets")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// MetricsCardsSkeleton
// ---------------------------------------------------------------------------

describe("MetricsCardsSkeleton", () => {
	it("renders 4 skeleton cards", () => {
		const { container } = render(<MetricsCardsSkeleton />);
		// Each card is a direct child div of the grid
		const grid = screen.getByLabelText("Loading metrics");
		expect(grid.children).toHaveLength(4);
	});

	it("has aria-busy='true'", () => {
		render(<MetricsCardsSkeleton />);
		expect(screen.getByLabelText("Loading metrics")).toHaveAttribute(
			"aria-busy",
			"true",
		);
	});
});

// ---------------------------------------------------------------------------
// AnalyticsChartSkeleton
// ---------------------------------------------------------------------------

describe("AnalyticsChartSkeleton", () => {
	it("renders with aria-busy='true'", () => {
		render(<AnalyticsChartSkeleton />);
		expect(screen.getByLabelText("Loading chart")).toHaveAttribute(
			"aria-busy",
			"true",
		);
	});

	it("renders 7 bar placeholders", () => {
		const { container } = render(<AnalyticsChartSkeleton />);
		// The bar area is a flex container; each bar is a child div
		const barArea = container.querySelector(
			'[aria-label="Loading chart"] .flex.items-end',
		);
		expect(barArea).not.toBeNull();
		expect(barArea?.children).toHaveLength(7);
	});
});

// ---------------------------------------------------------------------------
// TopAssetsTableSkeleton
// ---------------------------------------------------------------------------

describe("TopAssetsTableSkeleton", () => {
	it("renders 5 rows by default", () => {
		const { container } = render(<TopAssetsTableSkeleton />);
		const rowContainer = container.querySelector(
			'[aria-label="Loading top assets"] .divide-y',
		);
		expect(rowContainer?.children).toHaveLength(5);
	});

	it("renders the requested number of rows", () => {
		const { container } = render(<TopAssetsTableSkeleton rows={3} />);
		const rowContainer = container.querySelector(
			'[aria-label="Loading top assets"] .divide-y',
		);
		expect(rowContainer?.children).toHaveLength(3);
	});

	it("has aria-busy='true'", () => {
		render(<TopAssetsTableSkeleton />);
		expect(screen.getByLabelText("Loading top assets")).toHaveAttribute(
			"aria-busy",
			"true",
		);
	});
});
