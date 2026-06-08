import { describe, expect, it } from "vitest";
import type { Transaction } from "@/types/analytics";
import {
	computeAnalyticsSummary,
	transactionsToCsv,
	transactionsToJson,
} from "./exportData";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const completedIncoming: Transaction = {
	id: "1",
	description: "Design Project",
	date: "2023-10-23",
	humanDate: "Oct 23, 2023",
	category: "Income",
	status: "completed",
	amount: 1000,
	currency: "USD",
	type: "incoming",
};

const pendingOutgoing: Transaction = {
	id: "2",
	description: "Uber Ride",
	date: "2023-10-22",
	humanDate: "Oct 22, 2023",
	category: "Transport",
	status: "pending",
	amount: 24.5,
	currency: "USD",
	type: "outgoing",
};

const failedOutgoing: Transaction = {
	id: "3",
	description: "ATM Withdrawal",
	date: "2023-10-20",
	humanDate: "Oct 20, 2023",
	category: "Cash",
	status: "failed",
	amount: 200,
	currency: "USD",
	type: "outgoing",
};

const withCommaInDescription: Transaction = {
	id: "4",
	description: "Coffee, Snacks",
	date: "2023-10-15",
	humanDate: "Oct 15, 2023",
	category: "Food",
	status: "completed",
	amount: 6.5,
	currency: "USD",
	type: "outgoing",
};

const withQuoteInDescription: Transaction = {
	id: "5",
	description: 'He said "hello"',
	date: "2023-10-14",
	humanDate: "Oct 14, 2023",
	category: "Other",
	status: "completed",
	amount: 0,
	currency: "USD",
	type: "outgoing",
};

// ---------------------------------------------------------------------------
// transactionsToCsv
// ---------------------------------------------------------------------------

describe("transactionsToCsv", () => {
	it("returns only the header row for an empty array", () => {
		const result = transactionsToCsv([]);
		expect(result).toBe(
			"ID,Date,Description,Category,Type,Status,Amount,Currency",
		);
	});

	it("produces the correct number of lines (header + one per transaction)", () => {
		const result = transactionsToCsv([completedIncoming, pendingOutgoing]);
		const lines = result.split("\n");
		expect(lines).toHaveLength(3); // header + 2 rows
	});

	it("includes all expected column headers", () => {
		const result = transactionsToCsv([]);
		expect(result).toContain("ID");
		expect(result).toContain("Date");
		expect(result).toContain("Description");
		expect(result).toContain("Category");
		expect(result).toContain("Type");
		expect(result).toContain("Status");
		expect(result).toContain("Amount");
		expect(result).toContain("Currency");
	});

	it("maps transaction fields to the correct columns", () => {
		const result = transactionsToCsv([completedIncoming]);
		const dataRow = result.split("\n")[1];
		expect(dataRow).toContain("1");
		expect(dataRow).toContain("2023-10-23");
		expect(dataRow).toContain("Design Project");
		expect(dataRow).toContain("Income");
		expect(dataRow).toContain("incoming");
		expect(dataRow).toContain("completed");
		expect(dataRow).toContain("1000");
		expect(dataRow).toContain("USD");
	});

	it("wraps cells containing commas in double-quotes", () => {
		const result = transactionsToCsv([withCommaInDescription]);
		expect(result).toContain('"Coffee, Snacks"');
	});

	it("escapes double-quotes inside cell values per RFC 4180", () => {
		const result = transactionsToCsv([withQuoteInDescription]);
		// RFC 4180: double-quote is escaped as two double-quotes, wrapped in outer quotes
		expect(result).toContain('"He said ""hello"""');
	});

	it("handles a large dataset without throwing", () => {
		const many: Transaction[] = Array.from({ length: 500 }, (_, i) => ({
			...completedIncoming,
			id: String(i),
		}));
		expect(() => transactionsToCsv(many)).not.toThrow();
		const lines = transactionsToCsv(many).split("\n");
		expect(lines).toHaveLength(501);
	});
});

// ---------------------------------------------------------------------------
// transactionsToJson
// ---------------------------------------------------------------------------

describe("transactionsToJson", () => {
	it("returns '[]' for an empty array", () => {
		expect(transactionsToJson([])).toBe("[]");
	});

	it("produces valid JSON that round-trips correctly", () => {
		const input = [completedIncoming, pendingOutgoing];
		const json = transactionsToJson(input);
		const parsed = JSON.parse(json) as Transaction[];
		expect(parsed).toHaveLength(2);
		expect(parsed[0].id).toBe("1");
		expect(parsed[1].status).toBe("pending");
	});

	it("preserves all transaction fields", () => {
		const json = transactionsToJson([completedIncoming]);
		const parsed = JSON.parse(json) as Transaction[];
		const tx = parsed[0];
		expect(tx.id).toBe(completedIncoming.id);
		expect(tx.description).toBe(completedIncoming.description);
		expect(tx.date).toBe(completedIncoming.date);
		expect(tx.humanDate).toBe(completedIncoming.humanDate);
		expect(tx.category).toBe(completedIncoming.category);
		expect(tx.status).toBe(completedIncoming.status);
		expect(tx.amount).toBe(completedIncoming.amount);
		expect(tx.currency).toBe(completedIncoming.currency);
		expect(tx.type).toBe(completedIncoming.type);
	});

	it("is pretty-printed (contains newlines and spaces)", () => {
		const json = transactionsToJson([completedIncoming]);
		expect(json).toContain("\n");
		expect(json).toContain("  ");
	});
});

// ---------------------------------------------------------------------------
// computeAnalyticsSummary
// ---------------------------------------------------------------------------

describe("computeAnalyticsSummary", () => {
	it("returns all-zero summary for an empty array", () => {
		const summary = computeAnalyticsSummary([]);
		expect(summary.totalTransactions).toBe(0);
		expect(summary.totalIncoming).toBe(0);
		expect(summary.totalOutgoing).toBe(0);
		expect(summary.completedCount).toBe(0);
		expect(summary.pendingCount).toBe(0);
		expect(summary.failedCount).toBe(0);
	});

	it("counts total transactions correctly", () => {
		const summary = computeAnalyticsSummary([
			completedIncoming,
			pendingOutgoing,
			failedOutgoing,
		]);
		expect(summary.totalTransactions).toBe(3);
	});

	it("sums incoming amounts correctly", () => {
		const summary = computeAnalyticsSummary([
			completedIncoming,
			pendingOutgoing,
		]);
		expect(summary.totalIncoming).toBe(1000);
	});

	it("sums outgoing amounts correctly", () => {
		const summary = computeAnalyticsSummary([pendingOutgoing, failedOutgoing]);
		expect(summary.totalOutgoing).toBeCloseTo(224.5);
	});

	it("counts completed transactions correctly", () => {
		const summary = computeAnalyticsSummary([
			completedIncoming,
			pendingOutgoing,
			failedOutgoing,
		]);
		expect(summary.completedCount).toBe(1);
	});

	it("counts pending transactions correctly", () => {
		const summary = computeAnalyticsSummary([
			completedIncoming,
			pendingOutgoing,
			failedOutgoing,
		]);
		expect(summary.pendingCount).toBe(1);
	});

	it("counts failed transactions correctly", () => {
		const summary = computeAnalyticsSummary([
			completedIncoming,
			pendingOutgoing,
			failedOutgoing,
		]);
		expect(summary.failedCount).toBe(1);
	});

	it("handles a single incoming transaction", () => {
		const summary = computeAnalyticsSummary([completedIncoming]);
		expect(summary.totalIncoming).toBe(1000);
		expect(summary.totalOutgoing).toBe(0);
	});

	it("handles a single outgoing transaction", () => {
		const summary = computeAnalyticsSummary([pendingOutgoing]);
		expect(summary.totalIncoming).toBe(0);
		expect(summary.totalOutgoing).toBeCloseTo(24.5);
	});

	it("accumulates floating-point amounts without catastrophic precision loss", () => {
		const txs: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
			...completedIncoming,
			id: String(i),
			amount: 0.1,
		}));
		const summary = computeAnalyticsSummary(txs);
		// 10 × 0.1 = 1.0 — use toBeCloseTo to tolerate IEEE 754 drift
		expect(summary.totalIncoming).toBeCloseTo(1.0);
	});
});
