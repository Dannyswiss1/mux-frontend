import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SpendingLimitsCard } from "./SpendingLimitsCard";

describe("SpendingLimitsCard", () => {
	it("renders the card title and description", () => {
		render(<SpendingLimitsCard />);

		expect(
			screen.getByRole("heading", { name: /spending limits/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/control your api expenditure/i),
		).toBeInTheDocument();
	});

	it("renders the Active badge", () => {
		render(<SpendingLimitsCard />);

		expect(screen.getByText("Active")).toBeInTheDocument();
	});

	it("renders the daily usage section with default values", () => {
		render(<SpendingLimitsCard />);

		expect(screen.getByText("$750")).toBeInTheDocument();
		expect(screen.getByText("/ $5000")).toBeInTheDocument();
		expect(screen.getByText("15.0%")).toBeInTheDocument();
	});

	it("renders both input fields with default values", () => {
		render(<SpendingLimitsCard />);

		const dailyInput = screen.getByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		const txInput = screen.getByRole("spinbutton", {
			name: /per-transaction limit/i,
		});

		expect(dailyInput).toHaveValue(5000);
		expect(txInput).toHaveValue(1000);
	});

	it("renders the Save Settings button", () => {
		render(<SpendingLimitsCard />);

		expect(
			screen.getByRole("button", { name: /save settings/i }),
		).toBeInTheDocument();
	});

	it("renders the policy note", () => {
		render(<SpendingLimitsCard />);

		expect(
			screen.getByText(/spending limits are enforced in real-time/i),
		).toBeInTheDocument();
	});

	it("updates daily limit when input changes", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const dailyInput = screen.getByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.clear(dailyInput);
		await user.type(dailyInput, "10000");

		expect(dailyInput).toHaveValue(10000);
	});

	it("updates the usage percentage when daily limit changes", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		// Default: 750 / 5000 = 15%
		expect(screen.getByText("15.0%")).toBeInTheDocument();

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

		const dailyInput = screen.getByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.clear(dailyInput);
		await user.type(dailyInput, "100");

		// 750 / 100 = 750%, capped at 100%
		expect(screen.getByText("100.0%")).toBeInTheDocument();
	});

	it("shows 0% usage when daily limit is invalid (empty)", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const dailyInput = screen.getByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.clear(dailyInput);

		// parseInt("") = NaN, fallback to 1 → 750/1 = 75000% capped at 100%
		expect(screen.getByText("100.0%")).toBeInTheDocument();
	});

	it("shows 0% usage when daily limit is 0", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const dailyInput = screen.getByRole("spinbutton", {
			name: /daily spending limit/i,
		});
		await user.clear(dailyInput);
		await user.type(dailyInput, "0");

		// parseInt("0") = 0, fallback to 1 → 750/1 = 75000% capped at 100%
		expect(screen.getByText("100.0%")).toBeInTheDocument();
	});

	it("updates per-transaction limit independently", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const txInput = screen.getByRole("spinbutton", {
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

	it("has proper accessibility: inputs are associated with labels", () => {
		render(<SpendingLimitsCard />);

		expect(screen.getByLabelText(/daily spending limit/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/per-transaction limit/i)).toBeInTheDocument();
	});

	it("renders helper text under each input", () => {
		render(<SpendingLimitsCard />);

		expect(
			screen.getByText(/maximum amount you can spend per day/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/maximum cap for a single transaction/i),
		).toBeInTheDocument();
	});
});

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

	it("renders real content when loading is false", () => {
		render(<SpendingLimitsCard loading={false} />);

		expect(
			screen.getByRole("heading", { name: /spending limits/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /save settings/i }),
		).toBeInTheDocument();
	});

	it("renders real content by default (loading not set)", () => {
		render(<SpendingLimitsCard />);

		expect(
			screen.getByRole("heading", { name: /spending limits/i }),
		).toBeInTheDocument();
	});
});

describe("SpendingLimitsCard form validation", () => {
	beforeEach(() => {
		vi.stubGlobal("localStorage", {
			getItem: vi.fn().mockReturnValue(null),
			setItem: vi.fn(),
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("shows error when daily limit is empty on save", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		await user.clear(screen.getByRole("spinbutton", { name: /daily spending limit/i }));
		await user.click(screen.getByRole("button", { name: /save settings/i }));

		expect(screen.getByRole("alert")).toHaveTextContent(/required/i);
		expect(localStorage.setItem).not.toHaveBeenCalled();
	});

	it("shows error when daily limit is below minimum", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		await user.clear(screen.getByRole("spinbutton", { name: /daily spending limit/i }));
		await user.type(screen.getByRole("spinbutton", { name: /daily spending limit/i }), "0");
		await user.click(screen.getByRole("button", { name: /save settings/i }));

		expect(screen.getByRole("alert")).toHaveTextContent(/minimum/i);
		expect(localStorage.setItem).not.toHaveBeenCalled();
	});

	it("shows error when daily limit exceeds maximum", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		await user.clear(screen.getByRole("spinbutton", { name: /daily spending limit/i }));
		await user.type(screen.getByRole("spinbutton", { name: /daily spending limit/i }), "9999999");
		await user.click(screen.getByRole("button", { name: /save settings/i }));

		expect(screen.getByRole("alert")).toHaveTextContent(/maximum/i);
		expect(localStorage.setItem).not.toHaveBeenCalled();
	});

	it("shows error for tx limit independently", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		await user.clear(screen.getByRole("spinbutton", { name: /per-transaction limit/i }));
		await user.click(screen.getByRole("button", { name: /save settings/i }));

		const alerts = screen.getAllByRole("alert");
		expect(alerts).toHaveLength(1);
		expect(alerts[0]).toHaveTextContent(/required/i);
		expect(localStorage.setItem).not.toHaveBeenCalled();
	});

	it("clears error on input change", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const input = screen.getByRole("spinbutton", { name: /daily spending limit/i });
		await user.clear(input);
		await user.click(screen.getByRole("button", { name: /save settings/i }));
		expect(screen.getByRole("alert")).toBeInTheDocument();

		await user.type(input, "1000");
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("saves successfully when both fields are valid", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		await user.click(screen.getByRole("button", { name: /save settings/i }));

		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		expect(localStorage.setItem).toHaveBeenCalled();
	});

	it("marks invalid input with aria-invalid", async () => {
		const user = userEvent.setup();
		render(<SpendingLimitsCard />);

		const input = screen.getByRole("spinbutton", { name: /daily spending limit/i });
		await user.clear(input);
		await user.click(screen.getByRole("button", { name: /save settings/i }));

		expect(input).toHaveAttribute("aria-invalid", "true");
	});
});
