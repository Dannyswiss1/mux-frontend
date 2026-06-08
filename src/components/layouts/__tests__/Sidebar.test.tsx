import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "../Sidebar";

describe("Sidebar navigation", () => {
	it("includes API Keys and Spending Limits links and excludes Orders", () => {
		render(<Sidebar isOpen={true} onClose={() => {}} />);

		expect(screen.getByRole("link", { name: /API Keys/i })).toHaveAttribute(
			"href",
			"/dashboard/api-keys",
		);
		expect(
			screen.getByRole("link", { name: /Spending Limits/i }),
		).toHaveAttribute("href", "/dashboard/spending-limits");
		expect(screen.queryByRole("link", { name: /Orders/i })).toBeNull();
	});
});
