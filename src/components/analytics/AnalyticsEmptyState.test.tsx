import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";

// ---------------------------------------------------------------------------
// Default rendering
// ---------------------------------------------------------------------------

describe("AnalyticsEmptyState — defaults", () => {
	it("renders with role='status' and accessible label", () => {
		render(<AnalyticsEmptyState />);
		const region = screen.getByRole("status");
		expect(region).toBeInTheDocument();
		expect(region).toHaveAttribute("aria-label", "No analytics data");
	});

	it("renders the default title", () => {
		render(<AnalyticsEmptyState />);
		expect(
			screen.getByRole("heading", { name: /no analytics data yet/i }),
		).toBeInTheDocument();
	});

	it("renders the default description", () => {
		render(<AnalyticsEmptyState />);
		expect(screen.getByText(/no activity to display/i)).toBeInTheDocument();
	});

	it("does not render an action button by default", () => {
		render(<AnalyticsEmptyState />);
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("renders the default bar-chart icon (aria-hidden)", () => {
		const { container } = render(<AnalyticsEmptyState />);
		const svg = container.querySelector('svg[aria-hidden="true"]');
		expect(svg).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// Custom props
// ---------------------------------------------------------------------------

describe("AnalyticsEmptyState — custom props", () => {
	it("renders a custom title", () => {
		render(<AnalyticsEmptyState title="Nothing here" />);
		expect(
			screen.getByRole("heading", { name: /nothing here/i }),
		).toBeInTheDocument();
	});

	it("renders a custom description", () => {
		render(<AnalyticsEmptyState description="Try a different date range." />);
		expect(screen.getByText(/try a different date range/i)).toBeInTheDocument();
	});

	it("renders a custom icon", () => {
		render(<AnalyticsEmptyState icon={<span data-testid="custom-icon" />} />);
		expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// Action button
// ---------------------------------------------------------------------------

describe("AnalyticsEmptyState — action button", () => {
	it("renders the action button with the provided label", () => {
		render(
			<AnalyticsEmptyState action={{ label: "Refresh", onClick: vi.fn() }} />,
		);
		expect(
			screen.getByRole("button", { name: /refresh/i }),
		).toBeInTheDocument();
	});

	it("calls onClick when the action button is clicked", async () => {
		const handleClick = vi.fn();
		render(
			<AnalyticsEmptyState
				action={{ label: "Refresh", onClick: handleClick }}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: /refresh/i }));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("action button has type='button' to avoid accidental form submission", () => {
		render(<AnalyticsEmptyState action={{ label: "Go", onClick: vi.fn() }} />);
		expect(screen.getByRole("button", { name: /go/i })).toHaveAttribute(
			"type",
			"button",
		);
	});
});
