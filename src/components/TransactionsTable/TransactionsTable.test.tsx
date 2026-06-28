import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TransactionsTable from "./TransactionsTable";
import type { Transaction } from "@/types/transaction";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const TX_COMPLETED: Transaction = {
	hash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
	from: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
	to: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
	amountXlm: "250.0000000",
	memo: "payment-ref-001",
	ledger: 1000,
	fee: "0.0000100",
	network: "mainnet",
	status: "completed",
	createdAt: "2025-05-28T14:22:00Z",
};

const TX_PENDING: Transaction = {
	hash: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
	from: "GCFONE23AB7Y6C5YZOMKUKGETPIAJA752ZPMORQO5VKA6LHXHC7Y3YPE",
	to: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOBER7KKQOAVSMIA",
	amountXlm: "1000.0000000",
	ledger: 999,
	fee: "0.0000100",
	network: "testnet",
	status: "pending",
	createdAt: "2025-05-27T09:45:00Z",
};

const TX_FAILED: Transaction = {
	hash: "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
	from: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOBER7KKQOAVSMIA",
	to: "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
	amountXlm: "50.0000000",
	memo: "refund",
	ledger: 998,
	fee: "0.0000100",
	network: "mainnet",
	status: "failed",
	createdAt: "2025-05-26T08:00:00Z",
};

const ALL_TXS = [TX_COMPLETED, TX_PENDING, TX_FAILED];

// Helper: render with controlled transactions (bypasses hook/fetch)
function renderWith(
	txs: Transaction[],
	extra?: Partial<React.ComponentProps<typeof TransactionsTable>>,
) {
	return render(
		<TransactionsTable transactions={txs} loading={false} error={null} {...extra} />,
	);
}

// ---------------------------------------------------------------------------
// Loading state (#251 / #252 prerequisite)
// ---------------------------------------------------------------------------

describe("TransactionsTable — loading state", () => {
	it("renders a loading skeleton when loading=true", () => {
		render(
			<TransactionsTable transactions={[]} loading={true} error={null} />,
		);
		expect(screen.getByTestId("transactions-loading")).toBeInTheDocument();
		expect(screen.getByLabelText("Loading transactions")).toBeInTheDocument();
	});

	it("does not render the transactions header while loading", () => {
		render(
			<TransactionsTable transactions={[]} loading={true} error={null} />,
		);
		expect(screen.queryByText("Transactions")).not.toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// Empty state (#251)
// ---------------------------------------------------------------------------

describe("TransactionsTable — empty state", () => {
	it("renders the EmptyState when transactions array is empty", () => {
		renderWith([]);
		expect(screen.getByText("No transactions yet")).toBeInTheDocument();
	});

	it("shows a helpful description in the empty state", () => {
		renderWith([]);
		expect(
			screen.getByText(/transactions will appear here/i),
		).toBeInTheDocument();
	});

	it("does not render the table or filter controls when empty", () => {
		renderWith([]);
		expect(screen.queryByLabelText("Search transactions")).not.toBeInTheDocument();
		expect(screen.queryByTestId("tx-row")).not.toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// Error state (#252)
// ---------------------------------------------------------------------------

describe("TransactionsTable — error state", () => {
	it("renders the ErrorState when error is provided", () => {
		render(
			<TransactionsTable transactions={[]} loading={false} error="Network error" />,
		);
		expect(screen.getByText("Network error")).toBeInTheDocument();
		// ErrorState renders default title
		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
	});

	it("renders a retry button in the error state", () => {
		render(
			<TransactionsTable transactions={[]} loading={false} error="Fetch failed" />,
		);
		expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
	});

	it("calls onRetry when the retry button is clicked", async () => {
		const onRetry = vi.fn();
		render(
			<TransactionsTable
				transactions={[]}
				loading={false}
				error="Fetch failed"
				onRetry={onRetry}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: /try again/i }));
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("does not render table or filters when in error state", () => {
		render(
			<TransactionsTable transactions={[]} loading={false} error="err" />,
		);
		expect(screen.queryByLabelText("Search transactions")).not.toBeInTheDocument();
		expect(screen.queryByTestId("tx-row")).not.toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// Data rendering (#249)
// ---------------------------------------------------------------------------

describe("TransactionsTable — data rendering", () => {
	it("renders the Transactions heading", () => {
		renderWith(ALL_TXS);
		expect(screen.getByText("Transactions")).toBeInTheDocument();
		// Check that at least one mock transaction is rendered
		// e.g. amount 250.00
		expect(screen.getAllByText("250.00")[0]).toBeInTheDocument();
	});

	it("filters transactions by address prop", () => {
		const targetAddress = "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
		render(<TransactionsTable address={targetAddress} />);
		
		// The transaction from/to targetAddress should be present
		expect(screen.getAllByText("250.00")[0]).toBeInTheDocument();
		
		// Transaction not involving targetAddress should NOT be present (e.g. 50.50 amount)
		expect(screen.queryByText("50.50")).not.toBeInTheDocument();
	});

	it("filters by search query", async () => {
		const user = userEvent.setup();
		render(<TransactionsTable />);
		
		const searchInput = screen.getByPlaceholderText("Hash, address, memo…");
		await user.type(searchInput, "payment-ref");
		
		expect(screen.getAllByText("250.00")[0]).toBeInTheDocument();
		// The 1000.00 tx doesn't have this memo
		expect(screen.queryByText("1,000.00")).not.toBeInTheDocument();
	});
});
