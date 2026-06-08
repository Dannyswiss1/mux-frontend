import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecoveryLoadingState } from "../RecoveryLoadingState";

describe("RecoveryLoadingState", () => {
	it("renders with default message", () => {
		render(<RecoveryLoadingState />);
		expect(
			screen.getByRole("status", { name: /loading recovery status/i }),
		).toBeInTheDocument();
	});

	it("renders with a custom message", () => {
		render(<RecoveryLoadingState message="Fetching wallet data…" />);
		expect(
			screen.getByRole("status", { name: /fetching wallet data/i }),
		).toBeInTheDocument();
	});

	it("has aria-busy=true", () => {
		render(<RecoveryLoadingState />);
		expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
	});

	it("has aria-live=polite", () => {
		render(<RecoveryLoadingState />);
		expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
	});

	it("renders skeleton placeholder elements", () => {
		const { container } = render(<RecoveryLoadingState />);
		// At least the 3 step skeletons + header skeletons should be present
		const pulsingEls = container.querySelectorAll(".animate-pulse");
		expect(pulsingEls.length).toBeGreaterThan(5);
	});

	it("applies additional className", () => {
		render(<RecoveryLoadingState className="custom-class" />);
		expect(screen.getByRole("status")).toHaveClass("custom-class");
	});

	it("renders sr-only text for screen readers", () => {
		render(<RecoveryLoadingState message="Loading…" />);
		const srOnly = document.querySelector(".sr-only");
		expect(srOnly).toHaveTextContent("Loading…");
	});
});
