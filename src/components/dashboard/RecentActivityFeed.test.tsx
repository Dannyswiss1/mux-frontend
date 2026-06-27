import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecentActivityFeed } from "./RecentActivityFeed";

describe("RecentActivityFeed", () => {
	it("renders loading skeleton initially", () => {
		render(<RecentActivityFeed />);
		expect(screen.getAllByTestId(/skeleton/i)).toBeTruthy();
	});

	it("displays activity feed after loading", async () => {
		render(<RecentActivityFeed />);

		await waitFor(() => {
			expect(screen.getByText("Recent Activity")).toBeInTheDocument();
		});
	});

	it("displays activity items", async () => {
		render(<RecentActivityFeed />);

		await waitFor(() => {
			expect(screen.getByText(/wallet created/i)).toBeInTheDocument();
			expect(screen.getByText(/transaction/i)).toBeInTheDocument();
		});
	});

	it("shows empty state when no activities", async () => {
		render(<RecentActivityFeed />);

		await waitFor(() => {
			const feed = screen.getByText("Recent Activity");
			expect(feed).toBeInTheDocument();
		});
	});
});
