import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WalletTable } from "@/components/wallet/WalletTable";
import type { Wallet } from "@/types/wallet";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const activeMainnetWallet: Wallet = {
	id: "w-001",
	address: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
	network: "mainnet",
	status: "active",
	createdAt: new Date("2024-01-15T10:30:00Z"),
	balance: "1,250.50 XLM",
	lastActivity: new Date("2025-01-20T14:22:00Z"),
};

const pendingTestnetWallet: Wallet = {
	id: "w-002",
	address: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
	network: "testnet",
	status: "pending",
	createdAt: new Date("2024-03-10T16:45:00Z"),
	// No balance or lastActivity — tests the "—" fallback
};

const inactiveWallet: Wallet = {
	id: "w-003",
	address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOBER7KKQOAVSMIA",
	network: "mainnet",
	status: "inactive",
	createdAt: new Date("2023-12-01T09:00:00Z"),
	balance: "75.25 XLM",
	lastActivity: new Date("2024-06-15T18:00:00Z"),
};

const allWallets = [activeMainnetWallet, pendingTestnetWallet, inactiveWallet];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderTable(wallets: Wallet[]) {
	return render(<WalletTable wallets={wallets} />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("WalletTable", () => {
	describe("table structure", () => {
		it("renders the table element", () => {
			renderTable(allWallets);
			expect(screen.getByRole("table")).toBeInTheDocument();
		});

		it("renders all expected column headers", () => {
			renderTable(allWallets);
			expect(
				screen.getByRole("columnheader", { name: /address/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("columnheader", { name: /network/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("columnheader", { name: /status/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("columnheader", { name: /balance/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("columnheader", { name: /created/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("columnheader", { name: /last activity/i }),
			).toBeInTheDocument();
		});

		it("renders one row per wallet", () => {
			renderTable(allWallets);
			// tbody rows only (excludes the header row)
			const rows = screen.getAllByRole("row");
			// 1 header row + 3 data rows
			expect(rows).toHaveLength(4);
		});
	});

	describe("address cell", () => {
		it("displays a truncated version of the wallet address", () => {
			renderTable([activeMainnetWallet]);
			// GBZXN7...MADI
			expect(screen.getByText("GBZXN7...MADI")).toBeInTheDocument();
		});

		it("renders a copy button for each wallet", () => {
			renderTable(allWallets);
			const copyButtons = screen.getAllByRole("button");
			expect(copyButtons).toHaveLength(allWallets.length);
		});

		it("copy button has an accessible title", () => {
			renderTable([activeMainnetWallet]);
			const btn = screen.getByRole("button");
			expect(btn).toHaveAttribute("title", "Copy address");
		});
	});

	describe("copy-to-clipboard interaction", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("calls clipboard.writeText with the full address on copy button click", async () => {
			const user = userEvent.setup();
			renderTable([activeMainnetWallet]);

			const btn = screen.getByRole("button");
			await user.click(btn);

			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
				activeMainnetWallet.address,
			);
		});

		it("shows a check icon and 'Copied!' title after clicking copy", async () => {
			const user = userEvent.setup();
			renderTable([activeMainnetWallet]);

			const btn = screen.getByRole("button");
			await user.click(btn);

			expect(btn).toHaveAttribute("title", "Copied!");
		});
	});

	describe("network badge", () => {
		it("shows 'Mainnet' badge for mainnet wallets", () => {
			renderTable([activeMainnetWallet]);
			expect(screen.getByText("Mainnet")).toBeInTheDocument();
		});

		it("shows 'Testnet' badge for testnet wallets", () => {
			renderTable([pendingTestnetWallet]);
			expect(screen.getByText("Testnet")).toBeInTheDocument();
		});

		it("renders the correct badge for each wallet in a mixed list", () => {
			renderTable(allWallets);
			// 2 mainnet + 1 testnet
			expect(screen.getAllByText("Mainnet")).toHaveLength(2);
			expect(screen.getAllByText("Testnet")).toHaveLength(1);
		});
	});

	describe("status indicator", () => {
		it("shows 'Active' status for active wallets", () => {
			renderTable([activeMainnetWallet]);
			expect(screen.getByText("Active")).toBeInTheDocument();
		});

		it("shows 'Pending' status for pending wallets", () => {
			renderTable([pendingTestnetWallet]);
			expect(screen.getByText("Pending")).toBeInTheDocument();
		});

		it("shows 'Inactive' status for inactive wallets", () => {
			renderTable([inactiveWallet]);
			expect(screen.getByText("Inactive")).toBeInTheDocument();
		});
	});

	describe("balance column", () => {
		it("displays the balance when provided", () => {
			renderTable([activeMainnetWallet]);
			expect(screen.getByText("1,250.50 XLM")).toBeInTheDocument();
		});

		it("displays '—' when balance is undefined", () => {
			renderTable([pendingTestnetWallet]);
			// The balance cell should show the em-dash fallback
			const cells = screen.getAllByRole("cell");
			const balanceCell = cells.find((c) => c.textContent === "—");
			expect(balanceCell).toBeInTheDocument();
		});
	});

	describe("date columns", () => {
		it("displays a formatted createdAt date", () => {
			renderTable([activeMainnetWallet]);
			// Jan 15, 2024
			expect(screen.getByText(/Jan/)).toBeInTheDocument();
			expect(screen.getByText(/2024/)).toBeInTheDocument();
		});

		it("displays '—' for lastActivity when undefined", () => {
			renderTable([pendingTestnetWallet]);
			// pendingTestnetWallet has no lastActivity
			const dashes = screen.getAllByText("—");
			// At least one dash for lastActivity (and one for balance)
			expect(dashes.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe("edge cases", () => {
		it("renders an empty table body when wallets array is empty", () => {
			renderTable([]);
			const rows = screen.getAllByRole("row");
			// Only the header row
			expect(rows).toHaveLength(1);
		});

		it("renders a single wallet correctly", () => {
			renderTable([activeMainnetWallet]);
			const rows = screen.getAllByRole("row");
			expect(rows).toHaveLength(2); // header + 1 data row
		});

		it("renders a large list without errors", () => {
			const manyWallets: Wallet[] = Array.from({ length: 50 }, (_, i) => ({
				id: `w-${i}`,
				address: `GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMAD${i
					.toString()
					.padStart(1, "0")}`,
				network: i % 2 === 0 ? "mainnet" : "testnet",
				status: (["active", "pending", "inactive"] as const)[i % 3],
				createdAt: new Date("2024-01-01"),
			}));
			expect(() => renderTable(manyWallets)).not.toThrow();
			const rows = screen.getAllByRole("row");
			expect(rows).toHaveLength(51); // header + 50 data rows
		});

		it("handles a wallet with all optional fields missing", () => {
			const minimalWallet: Wallet = {
				id: "w-min",
				address: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
				network: "testnet",
				status: "pending",
				createdAt: new Date("2024-01-01"),
			};
			expect(() => renderTable([minimalWallet])).not.toThrow();
		});
	});
});
