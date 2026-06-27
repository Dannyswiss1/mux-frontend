import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "@/components/ui/ErrorState";

describe("ErrorState", () => {
	it("renders the default title when none is provided", () => {
		render(<ErrorState description="Something failed." />);
		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
	});

	it("renders a custom title when provided", () => {
		render(
			<ErrorState title="Failed to load wallets" description="Try again." />,
		);
		expect(screen.getByText("Failed to load wallets")).toBeInTheDocument();
	});

	it("renders the description", () => {
		render(<ErrorState description="Unable to fetch wallet data." />);
		expect(
			screen.getByText("Unable to fetch wallet data."),
		).toBeInTheDocument();
	});

	it("renders the retry button when retry prop is provided", () => {
		render(<ErrorState description="Error." retry={{ onRetry: vi.fn() }} />);
		expect(
			screen.getByRole("button", { name: "Try Again" }),
		).toBeInTheDocument();
	});

	it("renders a custom retry label", () => {
		render(
			<ErrorState
				description="Error."
				retry={{ label: "Reload Wallets", onRetry: vi.fn() }}
			/>,
		);
		expect(
			screen.getByRole("button", { name: "Reload Wallets" }),
		).toBeInTheDocument();
	});

	it("does NOT render a retry button when retry prop is omitted", () => {
		render(<ErrorState description="Error." />);
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("calls retry.onRetry when the button is clicked", async () => {
		const user = userEvent.setup();
		const onRetry = vi.fn();
		render(<ErrorState description="Error." retry={{ onRetry }} />);
		await user.click(screen.getByRole("button", { name: "Try Again" }));
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("renders a custom icon when provided", () => {
		render(
			<ErrorState
				description="Error."
				icon={<span data-testid="custom-err-icon">⚠️</span>}
			/>,
		);
		expect(screen.getByTestId("custom-err-icon")).toBeInTheDocument();
	});

	it("renders the default SVG icon when no icon prop is provided", () => {
		const { container } = render(<ErrorState description="Error." />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});
});
