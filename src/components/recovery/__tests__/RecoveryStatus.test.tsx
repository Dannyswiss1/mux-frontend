import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RecoveryStatusValue } from "../RecoveryStatus";
import { RecoveryStatus } from "../RecoveryStatus";

describe("RecoveryStatus", () => {
	it("renders 'Active' badge by default", () => {
		render(<RecoveryStatus />);
		expect(screen.getByText("Active")).toBeInTheDocument();
	});

	const cases: Array<{ status: RecoveryStatusValue; label: string }> = [
		{ status: "active", label: "Active" },
		{ status: "monitoring", label: "Monitoring" },
		{ status: "ready", label: "Ready" },
		{ status: "error", label: "Error" },
		{ status: "disconnected", label: "Disconnected" },
		{ status: "unknown", label: "Unknown" },
	];

	for (const { status, label } of cases) {
		it(`renders correct label for status "${status}"`, () => {
			render(<RecoveryStatus status={status} />);
			expect(screen.getByText(label)).toBeInTheDocument();
		});

		it(`has accessible aria-label for status "${status}"`, () => {
			render(<RecoveryStatus status={status} />);
			expect(
				screen.getByRole("generic", { name: `Recovery status: ${status}` }),
			).toBeInTheDocument();
		});
	}

	it("renders 'Unknown' badge for an unrecognised status value", () => {
		// Cast to bypass TS — simulates a stale/invalid value from an API
		render(<RecoveryStatus status={"stale" as RecoveryStatusValue} />);
		expect(screen.getByText("Unknown")).toBeInTheDocument();
	});

	it("applies additional className to the badge", () => {
		render(<RecoveryStatus status="active" className="test-class" />);
		const badge = screen.getByText("Active").closest("[data-slot='badge']");
		expect(badge).toHaveClass("test-class");
	});

	it("dot indicator is hidden from assistive technology", () => {
		render(<RecoveryStatus status="active" />);
		const badge = screen.getByRole("generic", {
			name: "Recovery status: active",
		});
		const dot = badge.querySelector("span");
		expect(dot).toHaveAttribute("aria-hidden", "true");
	});

	it("monitoring badge has animated dot", () => {
		render(<RecoveryStatus status="monitoring" />);
		const badge = screen.getByRole("generic", {
			name: "Recovery status: monitoring",
		});
		const dot = badge.querySelector("span");
		expect(dot?.className).toContain("animate-pulse");
	});
});
