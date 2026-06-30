import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SpendingLimitsCard } from "./SpendingLimitsCard";

// ---------------------------------------------------------------------------
// Global fetch mock: return the default API response
// ---------------------------------------------------------------------------

const DEFAULT_API_RESPONSE = {
	limits: { dailyLimit: 5000, transactionLimit: 1000 },
	todayUsage: 750,
};

function mockFetchSuccess(body = DEFAULT_API_RESPONSE) {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(body),
		}),
	);
}

function mockFetchFailure() {
	vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
}

beforeEach(() => {
	mockFetchSuccess();
	vi.stubGlobal("localStorage", {
		getItem: vi.fn().mockReturnValue(null),
		setItem: vi.fn(),
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Basic rendering
// ---------------------------------------------------------------------------

describe("SpendingLimitsCard", () => {
	it("renders the card title and description", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(
				screen.getByRole("heading", { name: /spending limits/i }),
			).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(
				screen.getByText(/control your api expenditure/i),
			).toBeInTheDocument();
		});
	});

	it("renders the Active badge", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByText("Active")).toBeInTheDocument();
		});
	});

	it("renders the daily usage section with API-loaded values", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(screen.getByText("$750")).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText("/ $5000")).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText("15.0%")).toBeInTheDocument();
		});
	});

	it("renders both input fields with API-loaded values", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			const dailyInput = screen.getByRole("spinbutton", {
				name: /daily spending limit/i,
			});
			expect(dailyInput).toHaveValue(5000);
		});
		await waitFor(() => {
			const txInput = screen.getByRole("spinbutton", {
				name: /per-transaction limit/i,
			});
			expect(txInput).toHaveValue(1000);
		});
	});

	it("renders the Save Settings button", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(
				screen.getByRole("button", { name: /save settings/i }),
			).toBeInTheDocument();
		});
	});

	it("renders the policy note", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(
				screen.getByText(/spending limits are enforced in real-time/i),
			).toBeInTheDocument();
		});
	});

	it("updates daily limit when input changes", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const dailyInput = await screen.findByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.clear(dailyInput);
		await user.type(dailyInput, "10000");

		expect(dailyInput).toHaveValue(10000);
	});

	it("updates the usage percentage when daily limit changes", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		// Wait for API data to load
		await waitFor(() => expect(screen.getByText("15.0%")).toBeInTheDocument());

		const dailyInput = screen.getByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.clear(dailyInput);
		await user.type(dailyInput, "1500");

		// 750 / 1500 = 50%
		expect(screen.getByText("50.0%")).toBeInTheDocument();
	});

	it("caps usage percentage at 100 when limit is less than used amount", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		await waitFor(() => expect(screen.getByText("15.0%")).toBeInTheDocument());

		const dailyInput = screen.getByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.clear(dailyInput);
		await user.type(dailyInput, "100");

		// 750 / 100 = 750%, capped at 100%
		expect(screen.getByText("100.0%")).toBeInTheDocument();
	});

	it("shows 100% usage when daily limit is empty (fallback to 1)", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		await waitFor(() => expect(screen.getByText("15.0%")).toBeInTheDocument());

		const dailyInput = screen.getByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.clear(dailyInput);

		// parseInt("") = NaN, fallback to 1 → 750/1 = 75000% capped at 100%
		expect(screen.getByText("100.0%")).toBeInTheDocument();
	});

	it("updates per-transaction limit independently", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const txInput = await screen.findByRole("spinbutton", {
			name: /per-transaction limit/i,
		});
		await user.clear(txInput);
		await user.type(txInput, "2500");

		expect(txInput).toHaveValue(2500);

		// Daily limit and usage should remain unchanged
		const dailyInput = screen.getByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		expect(dailyInput).toHaveValue(5000);
		expect(screen.getByText("15.0%")).toBeInTheDocument();
	});

	it("has proper accessibility: inputs are associated with labels", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(
				screen.getByLabelText(/daily spending limit/i),
			).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(
				screen.getByLabelText(/per-transaction limit/i),
			).toBeInTheDocument();
		});
	});

	it("renders helper text under each input", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(
				screen.getByText(/maximum amount you can spend per day/i),
			).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(
				screen.getByText(/maximum cap for a single transaction/i),
			).toBeInTheDocument();
		});
	});
});

// ---------------------------------------------------------------------------
// Analytics tracking
// ---------------------------------------------------------------------------

describe("SpendingLimitsCard analytics tracking", () => {
	it("fires spending_limits_loaded on mount when API succeeds", async () => {
		const { trackSpendingLimitsEvent } = await import(
			"@/services/spendingLimitsTracking"
		);
		const trackSpy = vi.spyOn(
			{ trackSpendingLimitsEvent },
			"trackSpendingLimitsEvent",
		);

		// Re-import the module to get the actual exported function
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		render(<SpendingLimitsCard />);

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				"[Analytics] spending_limits_loaded",
				expect.objectContaining({ source: "api", dailyLimit: 5000 }),
			);
		});

		consoleSpy.mockRestore();
		trackSpy.mockRestore();
	});

	it("fires spending_limits_loaded with localStorage source when API fails", async () => {
		mockFetchFailure();
		vi.mocked(localStorage.getItem).mockReturnValue(
			JSON.stringify({ dailyLimit: 3000, transactionLimit: 500 }),
		);

		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		render(<SpendingLimitsCard />);

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				"[Analytics] spending_limits_loaded",
				expect.objectContaining({ source: "localStorage", dailyLimit: 3000 }),
			);
		});

		consoleSpy.mockRestore();
	});

	it("fires spending_limits_saved when save succeeds", async () => {
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		const user = userEvent.setup();

		render(<SpendingLimitsCard />);
		await screen.findByRole("button", { name: /save settings/i });

		await user.click(screen.getByRole("button", { name: /save settings/i }));

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				"[Analytics] spending_limits_saved",
				expect.objectContaining({ dailyLimit: 5000, transactionLimit: 1000 }),
			);
		});

		consoleSpy.mockRestore();
	});

	it("fires spending_limits_save_failed when localStorage throws", async () => {
		vi.mocked(localStorage.setItem).mockImplementation(() => {
			throw new Error("QuotaExceededError");
		});

		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		const user = userEvent.setup();

		render(<SpendingLimitsCard />);
		await screen.findByRole("button", { name: /save settings/i });

		await user.click(screen.getByRole("button", { name: /save settings/i }));

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				"[Analytics] spending_limits_save_failed",
				expect.any(Object),
			);
		});

		consoleSpy.mockRestore();
	});

	it("fires spending_limits_daily_changed when daily input changes", async () => {
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		const user = userEvent.setup();

		render(<SpendingLimitsCard />);
		const dailyInput = await screen.findByRole("spinbutton", {
			name: /daily spending limit/i,
		});

		await user.clear(dailyInput);
		await user.type(dailyInput, "8000");

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				"[Analytics] spending_limits_daily_changed",
				expect.any(Object),
			);
		});

		consoleSpy.mockRestore();
	});

	it("fires spending_limits_transaction_changed when tx input changes", async () => {
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		const user = userEvent.setup();

		render(<SpendingLimitsCard />);
		const txInput = await screen.findByRole("spinbutton", {
			name: /per-transaction limit/i,
		});

		await user.clear(txInput);
		await user.type(txInput, "2000");

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				"[Analytics] spending_limits_transaction_changed",
				expect.any(Object),
			);
		});

		consoleSpy.mockRestore();
	});
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

describe("SpendingLimitsCard keyboard navigation", () => {
	it("pressing Enter in the daily limit input triggers save", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const dailyInput = await screen.findByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.click(dailyInput);
		await user.keyboard("{Enter}");

		expect(localStorage.setItem).toHaveBeenCalled();
	});

	it("pressing Enter in the tx limit input triggers save", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const txInput = await screen.findByRole("spinbutton", {
			name: /per-transaction limit/i,
		});
		await user.click(txInput);
		await user.keyboard("{Enter}");

		expect(localStorage.setItem).toHaveBeenCalled();
	});

	it("pressing Escape blurs the input", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const dailyInput = await screen.findByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.click(dailyInput);
		expect(dailyInput).toHaveFocus();

		await user.keyboard("{Escape}");
		expect(dailyInput).not.toHaveFocus();
	});

	it("Save Settings button is focusable via keyboard", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const saveBtn = await screen.findByRole("button", {
			name: /save settings/i,
		});
		saveBtn.focus();
		expect(saveBtn).toHaveFocus();

		await user.keyboard("{Enter}");
		expect(localStorage.setItem).toHaveBeenCalled();
	});
});

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

describe("SpendingLimitsCard loading state", () => {
	it("renders skeleton placeholders when loading is true", () => {
		const { container } = render(<SpendingLimitsCard loading />);
		const skeletons = container.querySelectorAll(".animate-pulse");
		expect(skeletons.length).toBeGreaterThan(0);
	});

	it("does not render real content when loading", () => {
		render(<SpendingLimitsCard loading />);
		expect(
			screen.queryByRole("heading", { name: /spending limits/i }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("spinbutton", { name: /daily spending limit/i }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /save settings/i }),
		).not.toBeInTheDocument();
		expect(screen.queryByText("Active")).not.toBeInTheDocument();
	});

	it("renders real content when loading is false", async () => {
		render(<SpendingLimitsCard loading={false} />);
		await waitFor(() => {
			expect(
				screen.getByRole("heading", { name: /spending limits/i }),
			).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(
				screen.getByRole("button", { name: /save settings/i }),
			).toBeInTheDocument();
		});
	});

	it("renders real content by default (loading not set)", async () => {
		render(<SpendingLimitsCard />);
		await waitFor(() => {
			expect(
				screen.getByRole("heading", { name: /spending limits/i }),
			).toBeInTheDocument();
		});
	});
});

// ---------------------------------------------------------------------------
// Toast feedback
// ---------------------------------------------------------------------------

describe("SpendingLimitsCard toast feedback", () => {
	it("shows success toast after saving valid settings", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		await screen.findByRole("button", { name: /save settings/i });
		await user.click(screen.getByRole("button", { name: /save settings/i }));

		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(screen.getByText("Success")).toBeInTheDocument();
		expect(screen.getByText(/spending limits saved/i)).toBeInTheDocument();
	});

	it("shows error toast when localStorage throws", async () => {
		vi.mocked(localStorage.setItem).mockImplementation(() => {
			throw new Error("QuotaExceededError");
		});

		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		await screen.findByRole("button", { name: /save settings/i });
		await user.click(screen.getByRole("button", { name: /save settings/i }));

		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(screen.getByText("Error")).toBeInTheDocument();
		// Both the inline error text and toast may show; use getAllByText
		const failedMessages = screen.getAllByText(/failed to save/i);
		expect(failedMessages.length).toBeGreaterThanOrEqual(1);
	});

	it("toast is not visible before saving", async () => {
		render(<SpendingLimitsCard />);
		await screen.findByRole("button", { name: /save settings/i });
		expect(screen.queryByRole("status")).not.toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// API fallback to localStorage
// ---------------------------------------------------------------------------

describe("SpendingLimitsCard — API unavailable fallback", () => {
	it("loads limits from localStorage when API is unavailable", async () => {
		mockFetchFailure();
		vi.mocked(localStorage.getItem).mockReturnValue(
			JSON.stringify({ dailyLimit: 2000, transactionLimit: 300 }),
		);

		render(<SpendingLimitsCard />);

		await waitFor(() => {
			const dailyInput = screen.getByRole("spinbutton", {
				name: /daily spending limit/i,
			});
			expect(dailyInput).toHaveValue(2000);
		});
		await waitFor(() => {
			const txInput = screen.getByRole("spinbutton", {
				name: /per-transaction limit/i,
			});
			expect(txInput).toHaveValue(300);
		});
	});

	it("uses default values when API unavailable and no localStorage", async () => {
		mockFetchFailure();
		vi.mocked(localStorage.getItem).mockReturnValue(null);

		render(<SpendingLimitsCard />);

		// Defaults are 5000 / 1000 from useState initialization
		await waitFor(() => {
			const dailyInput = screen.getByRole("spinbutton", {
				name: /daily spending limit/i,
			});
			expect(dailyInput).toHaveValue(5000);
		});
	});
});
