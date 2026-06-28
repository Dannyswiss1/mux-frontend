import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SpendingLimitsCard } from "../SpendingLimitsCard";

const mockGetResponse = {
	limits: { dailyLimit: 5000, transactionLimit: 1000 },
	todayUsage: 750,
};

const mockPutResponse = {
	limits: { dailyLimit: 8000, transactionLimit: 2000 },
	todayUsage: 750,
};

let fetchMock: ReturnType<typeof vi.fn>;

function setupFetchMock(options?: { putFails?: boolean; putDelay?: boolean }) {
	fetchMock = vi.fn((url: string, init?: RequestInit) => {
		if (init?.method === "PUT") {
			if (options?.putFails) {
				return Promise.resolve({
					ok: false,
					status: 400,
					json: () => Promise.resolve({ error: "Validation failed" }),
				});
			}
			// Delay the PUT response so "Saving…" state is rendered
			const delay = options?.putDelay ? 100 : 0;
			return new Promise((resolve) =>
				setTimeout(
					() =>
						resolve({
							ok: true,
							json: () => Promise.resolve(mockPutResponse),
						}),
					delay,
				),
			);
		}
		return Promise.resolve({
			ok: true,
			json: () => Promise.resolve(mockGetResponse),
		});
	});
	vi.stubGlobal("fetch", fetchMock);
}

describe("SpendingLimitsCard", () => {
	beforeEach(() => {
		setupFetchMock();
		window.localStorage.clear();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("renders the skeleton when loading prop is true", () => {
		const { container } = render(<SpendingLimitsCard loading />);
		const skeletons = container.querySelectorAll(".animate-pulse");
		expect(skeletons.length).toBeGreaterThan(0);
	});

	it("renders with default values after API fetch", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
		});
		expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
		expect(screen.getByText("Spending Limits")).toBeInTheDocument();
		expect(screen.getByText("Active")).toBeInTheDocument();
		expect(screen.getByText("Save Settings")).toBeInTheDocument();
	});

	it("fetches limits from API on mount", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledWith("/api/spending-limits");
		});
	});

	it("displays the daily usage bar with correct percentage", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			const bar = document.querySelector(".h-full");
			expect(bar).toBeInTheDocument();
			expect(bar).toHaveStyle("width: 15%");
		});
	});

	it("allows updating daily limit input", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
		});
		const dailyInput = screen.getByLabelText("Daily Spending Limit");
		await user.clear(dailyInput);
		await user.type(dailyInput, "8000");
		expect(screen.getByDisplayValue("8000")).toBeInTheDocument();
	});

	it("allows updating transaction limit input", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
		});
		const txInput = screen.getByLabelText("Per-Transaction Limit");
		await user.clear(txInput);
		await user.type(txInput, "2000");
		expect(screen.getByDisplayValue("2000")).toBeInTheDocument();
	});

	it("saves limits via PUT API when Save Settings is clicked", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledWith("/api/spending-limits");
		});
		const saveButton = screen.getByText("Save Settings");
		await user.click(saveButton);
		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledWith("/api/spending-limits", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					dailyLimit: 5000,
					transactionLimit: 1000,
				}),
			});
		});
	});

	it("shows loading state on save button while saving", async () => {
		// Use putDelay so the saving state is visible before the response resolves
		setupFetchMock({ putDelay: true });
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByText("Save Settings")).toBeInTheDocument();
		});
		const saveButton = screen.getByText("Save Settings");
		await user.click(saveButton);
		await waitFor(() => {
			expect(screen.getByText("Saving…")).toBeInTheDocument();
		});
	});

	it("shows error message when save fails", async () => {
		setupFetchMock({ putFails: true });
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByText("Save Settings")).toBeInTheDocument();
		});
		const saveButton = screen.getByText("Save Settings");
		await user.click(saveButton);
		await waitFor(() => {
			expect(screen.getByText("Validation failed")).toBeInTheDocument();
		});
	});

	it("shows error when API fetch fails", async () => {
		fetchMock = vi.fn().mockRejectedValue(new Error("Network error"));
		vi.stubGlobal("fetch", fetchMock);
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByText(/Network error/)).toBeInTheDocument();
		});
	});

	it("falls back to localStorage when API is unreachable on mount", async () => {
		window.localStorage.setItem(
			"spending-limits",
			JSON.stringify({ dailyLimit: 9999, transactionLimit: 500 }),
		);
		fetchMock = vi.fn().mockRejectedValue(new Error("Network error"));
		vi.stubGlobal("fetch", fetchMock);
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByDisplayValue("9999")).toBeInTheDocument();
		});
		expect(screen.getByDisplayValue("500")).toBeInTheDocument();
	});

	it("handles empty localStorage gracefully on fallback", async () => {
		fetchMock = vi.fn().mockRejectedValue(new Error("Network error"));
		vi.stubGlobal("fetch", fetchMock);
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
		});
	});

	it("persists optimistic save to localStorage on save", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByText("Save Settings")).toBeInTheDocument();
		});
		const saveButton = screen.getByText("Save Settings");
		await user.click(saveButton);
		await waitFor(() => {
			const stored = window.localStorage.getItem("spending-limits");
			expect(stored).not.toBeNull();
			if (stored) {
				const parsed = JSON.parse(stored);
				expect(parsed.dailyLimit).toBe(5000);
				expect(parsed.transactionLimit).toBe(1000);
			}
		});
	});
});
