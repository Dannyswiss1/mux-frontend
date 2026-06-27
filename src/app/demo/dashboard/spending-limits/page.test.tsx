import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SpendingLimitsPage from "./page";

describe("SpendingLimitsPage", () => {
	it("links to the billing docs URL", () => {
		render(<SpendingLimitsPage />);

		const billingLink = screen.getByRole("link", {
			name: /view billing details/i,
		});

		expect(billingLink.getAttribute("href")).toBe(
			"https://docs.mux.com/billing",
		);
		expect(billingLink.getAttribute("target")).toBe("_blank");
		expect(billingLink.getAttribute("rel")).toBe("noreferrer");
	});
});
