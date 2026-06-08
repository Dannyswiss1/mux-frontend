import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TransactionsTable from "./TransactionsTable";
import { mockTransactions } from "@/mock-data/transactions";

describe("TransactionsTable", () => {
	it("renders transactions correctly", () => {
		render(<TransactionsTable />);
		// Check that the header is rendered
		expect(screen.getByText("Transactions")).toBeInTheDocument();
		// Check that at least one mock transaction is rendered
		// e.g. amount 250.00
		expect(screen.getByText("250.00")).toBeInTheDocument();
	});

	it("filters transactions by address prop", () => {
		const targetAddress = "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI";
		render(<TransactionsTable address={targetAddress} />);
		
		// The transaction from/to targetAddress should be present
		expect(screen.getByText("250.00")).toBeInTheDocument();
		
		// Transaction not involving targetAddress should NOT be present (e.g. 50.50 amount)
		expect(screen.queryByText("50.50")).not.toBeInTheDocument();
	});

	it("filters by search query", async () => {
		const user = userEvent.setup();
		render(<TransactionsTable />);
		
		const searchInput = screen.getByPlaceholderText("Hash, address, memo…");
		await user.type(searchInput, "payment-ref");
		
		expect(screen.getByText("250.00")).toBeInTheDocument();
		// The 1000.00 tx doesn't have this memo
		expect(screen.queryByText("1,000.00")).not.toBeInTheDocument();
	});
});
