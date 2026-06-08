import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddWalletModal } from "./AddWalletModal";

const VALID_ADDRESS =
	"GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";

function renderModal(
	props?: Partial<React.ComponentProps<typeof AddWalletModal>>,
) {
	const onClose = vi.fn();
	const onAdd = vi.fn();
	render(
		<AddWalletModal isOpen={true} onClose={onClose} onAdd={onAdd} {...props} />,
	);
	return { onClose, onAdd };
}

// ─── Visibility ───────────────────────────────────────────────────────────────

describe("AddWalletModal visibility", () => {
	it("renders when isOpen is true", () => {
		renderModal();
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText("Add Wallet")).toBeInTheDocument();
	});

	it("does not render when isOpen is false", () => {
		render(<AddWalletModal isOpen={false} onClose={vi.fn()} onAdd={vi.fn()} />);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});

// ─── Form fields ──────────────────────────────────────────────────────────────

describe("AddWalletModal form", () => {
	it("renders address input and network select", () => {
		renderModal();
		expect(screen.getByLabelText(/stellar address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/network/i)).toBeInTheDocument();
	});

	it("defaults network to mainnet", () => {
		renderModal();
		const select = screen.getByLabelText(/network/i) as HTMLSelectElement;
		expect(select.value).toBe("mainnet");
	});

	it("allows switching network to testnet", async () => {
		const user = userEvent.setup();
		renderModal();
		const select = screen.getByLabelText(/network/i);
		await user.selectOptions(select, "testnet");
		expect((select as HTMLSelectElement).value).toBe("testnet");
	});
});

// ─── Validation ───────────────────────────────────────────────────────────────

describe("AddWalletModal validation", () => {
	it("shows an error when submitting an empty address", async () => {
		const user = userEvent.setup();
		renderModal();
		await user.click(screen.getByRole("button", { name: /add wallet/i }));
		expect(await screen.findByRole("alert")).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent(/required/i);
	});

	it("shows an error for an address that doesn't start with G", async () => {
		const user = userEvent.setup();
		renderModal();
		await user.type(
			screen.getByLabelText(/stellar address/i),
			"XBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
		);
		await user.click(screen.getByRole("button", { name: /add wallet/i }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			/start with 'G'/i,
		);
	});

	it("shows an error for an address that is too short", async () => {
		const user = userEvent.setup();
		renderModal();
		await user.type(screen.getByLabelText(/stellar address/i), "GABC");
		await user.click(screen.getByRole("button", { name: /add wallet/i }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			/56 characters/i,
		);
	});

	it("clears the error when the user starts typing again", async () => {
		const user = userEvent.setup();
		renderModal();
		// Trigger error
		await user.click(screen.getByRole("button", { name: /add wallet/i }));
		expect(await screen.findByRole("alert")).toBeInTheDocument();
		// Start typing
		await user.type(screen.getByLabelText(/stellar address/i), "G");
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});
});

// ─── Successful submission ────────────────────────────────────────────────────

describe("AddWalletModal successful submission", () => {
	it("calls onAdd with a new wallet and shows success state", async () => {
		const user = userEvent.setup();
		const { onAdd } = renderModal();

		await user.type(screen.getByLabelText(/stellar address/i), VALID_ADDRESS);
		await user.click(screen.getByRole("button", { name: /add wallet/i }));

		// Success banner
		await waitFor(() =>
			expect(
				screen.getByText(/wallet added successfully/i),
			).toBeInTheDocument(),
		);

		expect(onAdd).toHaveBeenCalledOnce();
		const wallet = onAdd.mock.calls[0][0];
		expect(wallet.address).toBe(VALID_ADDRESS);
		expect(wallet.network).toBe("mainnet");
		expect(wallet.status).toBe("pending");
	});

	it("shows the correct network in the success summary", async () => {
		const user = userEvent.setup();
		renderModal();

		await user.type(screen.getByLabelText(/stellar address/i), VALID_ADDRESS);
		await user.selectOptions(screen.getByLabelText(/network/i), "testnet");
		await user.click(screen.getByRole("button", { name: /add wallet/i }));

		await waitFor(() =>
			expect(
				screen.getByText(/wallet added successfully/i),
			).toBeInTheDocument(),
		);

		expect(screen.getByText("testnet")).toBeInTheDocument();
	});

	it("resets the form when 'Add Another' is clicked", async () => {
		const user = userEvent.setup();
		renderModal();

		await user.type(screen.getByLabelText(/stellar address/i), VALID_ADDRESS);
		await user.click(screen.getByRole("button", { name: /add wallet/i }));
		await waitFor(() =>
			expect(
				screen.getByText(/wallet added successfully/i),
			).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: /add another/i }));

		// Back to form
		expect(screen.getByLabelText(/stellar address/i)).toBeInTheDocument();
		expect(
			(screen.getByLabelText(/stellar address/i) as HTMLInputElement).value,
		).toBe("");
	});
});

// ─── Close / cancel ───────────────────────────────────────────────────────────

describe("AddWalletModal close behaviour", () => {
	it("calls onClose when Cancel is clicked", async () => {
		const user = userEvent.setup();
		const { onClose } = renderModal();
		await user.click(screen.getByRole("button", { name: /cancel/i }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("calls onClose when the X button is clicked", async () => {
		const user = userEvent.setup();
		const { onClose } = renderModal();
		await user.click(screen.getByRole("button", { name: /close dialog/i }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("calls onClose when the backdrop is clicked", async () => {
		const user = userEvent.setup();
		const { onClose } = renderModal();
		// The backdrop is the sibling div with aria-hidden
		const backdrop = document.querySelector(
			'[aria-hidden="true"]',
		) as HTMLElement;
		await user.click(backdrop);
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("calls onClose when Escape is pressed", async () => {
		const user = userEvent.setup();
		const { onClose } = renderModal();
		await user.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalledOnce();
	});
});
