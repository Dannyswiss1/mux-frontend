import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Wallet } from "@/types/wallet";

const useWalletMock = vi.fn();

vi.mock("next/navigation", () => ({
	notFound: vi.fn(),
	useParams: () => ({ id: "wallet-001" }),
}));

vi.mock("@/hooks/useWallet", () => ({
	useWallet: () => useWalletMock(),
}));

import WalletDetailPage from "./page";

const mockWallet: Wallet = {
	id: "wallet-001",
	address: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
	network: "mainnet",
	status: "active",
	createdAt: new Date("2024-01-15T10:30:00Z"),
	balance: "1,250.50 XLM",
	lastActivity: new Date("2024-01-20T10:30:00Z"),
};

describe("WalletDetailPage", () => {
	beforeEach(() => {
		useWalletMock.mockReset();
	});

	it("opens the receive QR stub from the detail page", async () => {
		const user = userEvent.setup();
		useWalletMock.mockReturnValue({
			wallet: mockWallet,
			loading: false,
			error: null,
			refetch: vi.fn(),
		});

		render(<WalletDetailPage />);

		await waitFor(() => {
			expect(
				screen.getByRole("button", { name: /receive funds/i }),
			).toBeInTheDocument();
		});

		await user.click(screen.getByRole("button", { name: /receive funds/i }));

		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeInTheDocument();
		expect(within(dialog).getByText(/qr stub/i)).toBeInTheDocument();
		expect(within(dialog).getByText(mockWallet.address)).toBeInTheDocument();
	});

	it("disables receive when the wallet address is invalid", async () => {
		useWalletMock.mockReturnValue({
			wallet: {
				...mockWallet,
				address: "invalid-address",
			},
			loading: false,
			error: null,
			refetch: vi.fn(),
		});

		render(<WalletDetailPage />);

		await waitFor(() => {
			const receiveButton = screen.getByRole("button", {
				name: /cannot receive/i,
			});
			expect(receiveButton).toBeDisabled();
		});
	});
});
