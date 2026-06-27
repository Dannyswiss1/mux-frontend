import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AnalyticsExportButton } from "./AnalyticsExportButton";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderButton(
	overrides: Partial<React.ComponentProps<typeof AnalyticsExportButton>> = {},
) {
	const defaults: React.ComponentProps<typeof AnalyticsExportButton> = {
		status: "idle",
		errorMessage: null,
		onExport: vi.fn(),
		onReset: vi.fn(),
		rowCount: 12,
	};
	return render(<AnalyticsExportButton {...defaults} {...overrides} />);
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("AnalyticsExportButton — rendering", () => {
	it("renders CSV and JSON buttons", () => {
		renderButton();
		expect(
			screen.getByRole("button", { name: /export.*csv/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /export.*json/i }),
		).toBeInTheDocument();
	});

	it("shows the row count hint when rowCount > 0", () => {
		renderButton({ rowCount: 5 });
		expect(screen.getByText(/5 rows? will be exported/i)).toBeInTheDocument();
	});

	it("shows singular 'row' when rowCount is 1", () => {
		renderButton({ rowCount: 1 });
		expect(screen.getByText(/1 row will be exported/i)).toBeInTheDocument();
	});

	it("shows 'No data to export' when rowCount is 0", () => {
		renderButton({ rowCount: 0 });
		expect(screen.getByText(/no data to export/i)).toBeInTheDocument();
	});

	it("disables both buttons when rowCount is 0", () => {
		renderButton({ rowCount: 0 });
		expect(screen.getByRole("button", { name: /export.*csv/i })).toBeDisabled();
		expect(
			screen.getByRole("button", { name: /export.*json/i }),
		).toBeDisabled();
	});

	it("disables both buttons while exporting", () => {
		renderButton({ status: "exporting" });
		expect(screen.getByRole("button", { name: /export.*csv/i })).toBeDisabled();
		expect(
			screen.getByRole("button", { name: /export.*json/i }),
		).toBeDisabled();
	});

	it("shows a spinner while exporting", () => {
		renderButton({ status: "exporting" });
		// The Loader2 icon has animate-spin class
		const spinner = document.querySelector(".animate-spin");
		expect(spinner).toBeInTheDocument();
	});

	it("shows a success icon when status is success", () => {
		renderButton({ status: "success" });
		expect(screen.getByLabelText(/export successful/i)).toBeInTheDocument();
	});

	it("shows an error icon when status is error", () => {
		renderButton({ status: "error", errorMessage: "Something went wrong" });
		expect(screen.getByLabelText(/export failed/i)).toBeInTheDocument();
	});

	it("shows the error message when status is error", () => {
		renderButton({
			status: "error",
			errorMessage: "No data available to export.",
		});
		expect(screen.getByRole("alert")).toHaveTextContent(
			"No data available to export.",
		);
	});

	it("shows a Dismiss button when there is an error", () => {
		renderButton({ status: "error", errorMessage: "Oops" });
		expect(
			screen.getByRole("button", { name: /dismiss export error/i }),
		).toBeInTheDocument();
	});

	it("does not show an error alert when status is idle", () => {
		renderButton({ status: "idle" });
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// Interactions
// ---------------------------------------------------------------------------

describe("AnalyticsExportButton — interactions", () => {
	it("calls onExport('csv') when CSV button is clicked", async () => {
		const onExport = vi.fn();
		renderButton({ onExport });
		await userEvent.click(screen.getByRole("button", { name: /export.*csv/i }));
		expect(onExport).toHaveBeenCalledWith("csv");
	});

	it("calls onExport('json') when JSON button is clicked", async () => {
		const onExport = vi.fn();
		renderButton({ onExport });
		await userEvent.click(
			screen.getByRole("button", { name: /export.*json/i }),
		);
		expect(onExport).toHaveBeenCalledWith("json");
	});

	it("does not call onExport when buttons are disabled (rowCount 0)", async () => {
		const onExport = vi.fn();
		renderButton({ onExport, rowCount: 0 });
		await userEvent.click(screen.getByRole("button", { name: /export.*csv/i }));
		expect(onExport).not.toHaveBeenCalled();
	});

	it("calls onReset when Dismiss is clicked", async () => {
		const onReset = vi.fn();
		renderButton({
			status: "error",
			errorMessage: "Oops",
			onReset,
		});
		await userEvent.click(
			screen.getByRole("button", { name: /dismiss export error/i }),
		);
		expect(onReset).toHaveBeenCalledTimes(1);
	});
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("AnalyticsExportButton — accessibility", () => {
	it("has an accessible group label", () => {
		renderButton();
		expect(
			screen.getByRole("group", { name: /export analytics data/i }),
		).toBeInTheDocument();
	});

	it("error alert has role='alert' for screen readers", () => {
		renderButton({ status: "error", errorMessage: "Oops" });
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	it("row count hint has aria-live='polite'", () => {
		renderButton({ rowCount: 5 });
		const hint = screen.getByText(/5 rows? will be exported/i);
		expect(hint).toHaveAttribute("aria-live", "polite");
	});
});
