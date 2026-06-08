"use client";

import { useCallback, useState } from "react";
import type {
	ExportFormat,
	ExportStatus,
	Transaction,
} from "@/types/analytics";
import { exportTransactions } from "@/utils/exportData";

interface UseAnalyticsExportOptions {
	/** Transactions to export. Defaults to `[]`. */
	transactions: Transaction[];
	/** Base filename without extension. Defaults to `"analytics-export"`. */
	filenameBase?: string;
	/** How long (ms) to hold the `"success"` state before resetting. Default: 2000. */
	successResetDelay?: number;
}

interface UseAnalyticsExportReturn {
	/** Current export operation status. */
	status: ExportStatus;
	/** Human-readable error message, set when `status === "error"`. */
	errorMessage: string | null;
	/** Trigger an export in the given format. */
	exportAs: (format: ExportFormat) => Promise<void>;
	/** Reset status back to `"idle"` (e.g. to dismiss an error). */
	reset: () => void;
}

/**
 * Manages the lifecycle of an analytics export operation.
 *
 * Handles:
 * - Async state transitions (idle → exporting → success | error)
 * - Auto-reset to idle after a successful export
 * - Graceful error capture with a human-readable message
 * - Guard against exporting when no data is available
 */
export function useAnalyticsExport({
	transactions,
	filenameBase = "analytics-export",
	successResetDelay = 2000,
}: UseAnalyticsExportOptions): UseAnalyticsExportReturn {
	const [status, setStatus] = useState<ExportStatus>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const reset = useCallback(() => {
		setStatus("idle");
		setErrorMessage(null);
	}, []);

	const exportAs = useCallback(
		async (format: ExportFormat) => {
			// Guard: already in-flight
			if (status === "exporting") return;

			// Guard: no data to export
			if (!transactions || transactions.length === 0) {
				setStatus("error");
				setErrorMessage("No data available to export.");
				return;
			}

			setStatus("exporting");
			setErrorMessage(null);

			try {
				// exportTransactions is synchronous but we wrap in a microtask so
				// the "exporting" state renders before the (potentially blocking)
				// Blob/anchor work happens.
				await Promise.resolve();
				exportTransactions(transactions, format, filenameBase);
				setStatus("success");
				setTimeout(reset, successResetDelay);
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "Export failed. Please try again.";
				setStatus("error");
				setErrorMessage(message);
			}
		},
		[status, transactions, filenameBase, successResetDelay, reset],
	);

	return { status, errorMessage, exportAs, reset };
}
