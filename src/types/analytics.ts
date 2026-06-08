/**
 * Analytics domain types for Mux Protocol.
 * Shared between the analytics page, mock data, and export utilities.
 */

export type TransactionStatus = "completed" | "pending" | "failed";
export type TransactionType = "incoming" | "outgoing";

export interface Transaction {
	id: string;
	description: string;
	/** ISO date string, e.g. "2023-10-24" */
	date: string;
	/** Human-readable date, e.g. "Oct 24, 2023" */
	humanDate: string;
	category: string;
	status: TransactionStatus;
	amount: number;
	currency: string;
	type: TransactionType;
}

/** Summary metrics derived from a set of transactions. */
export interface AnalyticsSummary {
	totalTransactions: number;
	totalIncoming: number;
	totalOutgoing: number;
	completedCount: number;
	pendingCount: number;
	failedCount: number;
}

/** Supported export formats. */
export type ExportFormat = "csv" | "json";

/** State machine for the export operation. */
export type ExportStatus = "idle" | "exporting" | "success" | "error";
