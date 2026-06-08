import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusIndicator } from "@/components/wallet/StatusIndicator";

describe("StatusIndicator", () => {
	it("renders 'Active' label for active status", () => {
		render(<StatusIndicator status="active" />);
		expect(screen.getByText("Active")).toBeInTheDocument();
	});

	it("renders 'Pending' label for pending status", () => {
		render(<StatusIndicator status="pending" />);
		expect(screen.getByText("Pending")).toBeInTheDocument();
	});

	it("renders 'Inactive' label for inactive status", () => {
		render(<StatusIndicator status="inactive" />);
		expect(screen.getByText("Inactive")).toBeInTheDocument();
	});

	it("applies green color classes for active status", () => {
		const { container } = render(<StatusIndicator status="active" />);
		const badge = container.firstChild as HTMLElement;
		expect(badge.className).toMatch(/green/);
	});

	it("applies yellow color classes for pending status", () => {
		const { container } = render(<StatusIndicator status="pending" />);
		const badge = container.firstChild as HTMLElement;
		expect(badge.className).toMatch(/yellow/);
	});

	it("applies zinc color classes for inactive status", () => {
		const { container } = render(<StatusIndicator status="inactive" />);
		const badge = container.firstChild as HTMLElement;
		expect(badge.className).toMatch(/zinc/);
	});

	it("renders a dot span for the status color indicator", () => {
		const { container } = render(<StatusIndicator status="active" />);
		// The dot is a span with rounded-full
		const dot = container.querySelector("span span");
		expect(dot).toBeInTheDocument();
		expect(dot?.className).toMatch(/rounded-full/);
	});

	it("adds animate-pulse class to the dot for pending status", () => {
		const { container } = render(<StatusIndicator status="pending" />);
		const dot = container.querySelector("span span");
		expect(dot?.className).toMatch(/animate-pulse/);
	});

	it("does NOT add animate-pulse for active status", () => {
		const { container } = render(<StatusIndicator status="active" />);
		const dot = container.querySelector("span span");
		expect(dot?.className).not.toMatch(/animate-pulse/);
	});

	it("accepts and applies an additional className", () => {
		const { container } = render(
			<StatusIndicator status="active" className="my-custom" />,
		);
		const badge = container.firstChild as HTMLElement;
		expect(badge.className).toContain("my-custom");
	});
});
