import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiKeysTable } from "./ApiKeysTable";

describe("ApiKeysTable", () => {
	it("renders API keys table", () => {
		render(<ApiKeysTable />);
		expect(screen.getByText("API Keys")).toBeInTheDocument();
	});

	it("displays mock API keys", () => {
		render(<ApiKeysTable />);
		expect(screen.getByText("Default Key")).toBeInTheDocument();
		expect(screen.getByText("Development Key")).toBeInTheDocument();
	});

	it("opens modal when create button is clicked", () => {
		render(<ApiKeysTable />);

		const createButton = screen.getByText("Create new key");
		fireEvent.click(createButton);

		expect(screen.getByText("Create API Key")).toBeInTheDocument();
	});

	it("adds new key when modal creates one", async () => {
		render(<ApiKeysTable />);

		const createButton = screen.getByText("Create new key");
		fireEvent.click(createButton);

		const input = screen.getByLabelText(/key name/i);
		fireEvent.change(input, { target: { value: "New Test Key" } });

		const generateButton = screen.getByText(/generate key/i);
		fireEvent.click(generateButton);

		await waitFor(() => {
			expect(screen.getByText("New Test Key")).toBeInTheDocument();
		});
	});

	it("revokes key when revoke button is clicked", async () => {
		render(<ApiKeysTable />);

		const revokeButtons = screen.getAllByText("Revoke");
		fireEvent.click(revokeButtons[0]);

		await waitFor(() => {
			const revokedBadge = screen.getAllByText("Revoked");
			expect(revokedBadge.length).toBeGreaterThan(0);
		});
	});
});
