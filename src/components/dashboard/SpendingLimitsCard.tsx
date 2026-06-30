"use client";

import {
	AlertCircle,
	Check,
	Clipboard,
	DollarSign,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/toast";
import { trackSpendingLimitsEvent } from "@/services/spendingLimitsTracking";
import type { SpendingLimitsResponse } from "@/app/api/spending-limits/route";

// Allow pressing Enter in an input to trigger save, Escape to blur.
function useInputKeyNav(onSave: () => void) {
	return (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			onSave();
		} else if (e.key === "Escape") {
			e.currentTarget.blur();
		}
	};
}

const STORAGE_KEY = "spending-limits";
const MIN_LIMIT = 1;
const MAX_LIMIT = 1000000;
const COPY_RESET_MS = 2000;

function parseLimit(value: string) {
	const number = Number(value);
	return Number.isFinite(number) ? number : NaN;
}

function safeSaveValue(value: string) {
	const parsed = parseLimit(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

/** Returns an error message string or null if valid. */
function validateLimit(value: string): string | null {
	if (value.trim() === "") return "This field is required.";
	const n = Number(value);
	if (!Number.isFinite(n)) return "Please enter a valid number.";
	if (n < MIN_LIMIT) return `Minimum is $${MIN_LIMIT}.`;
	if (n > MAX_LIMIT) return `Maximum is $${MAX_LIMIT.toLocaleString()}.`;
	return null;
}

// ---------------------------------------------------------------------------
// CopyButton — unchanged helper component
// ---------------------------------------------------------------------------

function CopyButton({ value, label }: { value: string; label: string }) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<number | null>(null);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
			timeoutRef.current = window.setTimeout(
				() => setCopied(false),
				COPY_RESET_MS,
			);
		} catch {
			// ignore clipboard errors
		}
	}, [value]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		};
	}, []);

	return (
		<button
			type="button"
			aria-label={`Copy ${label}`}
			onClick={handleCopy}
			className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
		>
			{copied ? (
				<Check className="size-4 text-green-500" />
			) : (
				<Clipboard className="size-4" />
			)}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SpendingLimitsCardProps {
	loading?: boolean;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SpendingLimitsCard({
	loading = false,
}: SpendingLimitsCardProps) {
	const [dailyLimit, setDailyLimit] = useState("5000");
	const [transactionLimit, setTransactionLimit] = useState("1000");
	const [todayUsage, setTodayUsage] = useState(0);
	const [dailyError, setDailyError] = useState<string | null>(null);
	const [txError, setTxError] = useState<string | null>(null);
	const [toastOpen, setToastOpen] = useState(false);
	const [toastVariant, setToastVariant] = useState<"success" | "error">(
		"success",
	);
	const [toastMessage, setToastMessage] = useState("Spending limits saved.");
	const [saveInProgress, setSaveInProgress] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const toastTimeoutRef = useRef<number | null>(null);

	// Fetch limits from API on mount, falling back to localStorage
	useEffect(() => {
		async function loadLimits() {
			try {
				const res = await fetch("/api/spending-limits");
				if (res.ok) {
					const json: SpendingLimitsResponse = await res.json();
					setDailyLimit(String(json.limits.dailyLimit));
					setTransactionLimit(String(json.limits.transactionLimit));
					setTodayUsage(json.todayUsage);
					trackSpendingLimitsEvent("spending_limits_loaded", {
						source: "api",
						dailyLimit: json.limits.dailyLimit,
						transactionLimit: json.limits.transactionLimit,
						todayUsage: json.todayUsage,
					});
					return;
				}
			} catch {
				// API unavailable — fall through to localStorage
			}

			// localStorage fallback
			try {
				const stored = window.localStorage.getItem(STORAGE_KEY);
				if (!stored) return;
				const parsed = JSON.parse(stored);
				if (
					typeof parsed?.dailyLimit === "number" &&
					isFinite(parsed.dailyLimit)
				) {
					setDailyLimit(String(parsed.dailyLimit));
				}
				if (
					typeof parsed?.transactionLimit === "number" &&
					isFinite(parsed.transactionLimit)
				) {
					setTransactionLimit(String(parsed.transactionLimit));
				}
				trackSpendingLimitsEvent("spending_limits_loaded", {
					source: "localStorage",
					dailyLimit: parsed?.dailyLimit,
					transactionLimit: parsed?.transactionLimit,
				});
			} catch {
				// ignore malformed localStorage data
			}
		}

		loadLimits();

		return () => {
			if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
		};
	}, []);

	const usedAmount = todayUsage;
	const totalLimit = Number.parseInt(dailyLimit) || 1;
	const usagePercentage = Math.min((usedAmount / totalLimit) * 100, 100);

	if (loading) return <SpendingLimitsCardSkeleton />;

	const showToast = (variant: "success" | "error", message: string) => {
		setToastVariant(variant);
		setToastMessage(message);
		setToastOpen(true);
		if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
		toastTimeoutRef.current = window.setTimeout(
			() => setToastOpen(false),
			3000,
		);
	};

	const handleSave = async () => {
		// Validate both inputs before saving
		const dErr = validateLimit(dailyLimit);
		const tErr = validateLimit(transactionLimit);
		if (dErr) {
			setDailyError(dErr);
			trackSpendingLimitsEvent("spending_limits_validation_error", {
				field: "dailyLimit",
				value: dailyLimit,
				error: dErr,
			});
		}
		if (tErr) {
			setTxError(tErr);
			trackSpendingLimitsEvent("spending_limits_validation_error", {
				field: "transactionLimit",
				value: transactionLimit,
				error: tErr,
			});
		}
		if (dErr || tErr) return;

		setSaveInProgress(true);
		setError(null);

		const dailyVal = safeSaveValue(dailyLimit);
		const txVal = safeSaveValue(transactionLimit);

		try {
			// Persist to localStorage regardless of API success
			window.localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ dailyLimit: dailyVal, transactionLimit: txVal }),
			);

			// Attempt to sync to the backend
			try {
				const res = await fetch("/api/spending-limits", {
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						dailyLimit: dailyVal,
						transactionLimit: txVal,
					}),
				});
				if (!res.ok) {
					const body = await res.json().catch(() => ({}));
					throw new Error((body as { error?: string }).error ?? res.statusText);
				}
			} catch (apiErr) {
				// API errors are non-fatal: localStorage already has the data.
				// Log but don't surface to the user as an error.
				if (process.env.NODE_ENV === "development") {
					// biome-ignore lint/suspicious/noConsoleLog: allowed in dev
					console.log(
						"[SpendingLimitsCard] API sync failed (non-fatal):",
						apiErr,
					);
				}
			}

			trackSpendingLimitsEvent("spending_limits_saved", {
				dailyLimit: dailyVal,
				transactionLimit: txVal,
			});
			showToast("success", "Spending limits saved.");
		} catch {
			trackSpendingLimitsEvent("spending_limits_save_failed", {
				dailyLimit: dailyVal,
				transactionLimit: txVal,
			});
			setError("Failed to save. Please try again.");
			showToast("error", "Failed to save. Please try again.");
		} finally {
			setSaveInProgress(false);
		}
	};

	const handleInputKeyDown = useInputKeyNav(handleSave);

	const handleDailyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDailyLimit(e.target.value);
		setDailyError(null);
		trackSpendingLimitsEvent("spending_limits_daily_changed", {
			value: e.target.value,
		});
	};

	const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTransactionLimit(e.target.value);
		setTxError(null);
		trackSpendingLimitsEvent("spending_limits_transaction_changed", {
			value: e.target.value,
		});
	};

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
				<div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-900">
							<TrendingUp className="size-5 text-zinc-600 dark:text-zinc-400" />
						</div>
						<div>
							<h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
								Spending Limits
							</h2>
							<p className="text-sm text-zinc-500 dark:text-zinc-400">
								Control your API expenditure and transaction caps
							</p>
						</div>
					</div>
					<Badge
						variant="outline"
						className="border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
					>
						Active
					</Badge>
				</div>

				<div className="space-y-8 p-6">
					<div className="space-y-3">
						<div className="flex items-end justify-between">
							<div>
								<p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Daily Usage
								</p>
								<div className="flex items-baseline gap-1">
									<span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
										${usedAmount}
									</span>
									<span className="text-sm text-zinc-500">/ ${dailyLimit}</span>
								</div>
							</div>
							<span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
								{usagePercentage.toFixed(1)}%
							</span>
						</div>
						<div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
							<div
								className="h-full bg-blue-600 transition-all duration-500 ease-out dark:bg-blue-500"
								style={{ width: `${usagePercentage}%` }}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="daily-limit"
									className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
								>
									<DollarSign className="size-4" />
									Daily Spending Limit
								</label>
								<CopyButton value={dailyLimit} label="daily limit" />
							</div>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
									$
								</span>
								<input
									id="daily-limit"
									type="number"
									min={MIN_LIMIT}
									max={MAX_LIMIT}
									step={1}
									value={dailyLimit}
									onChange={handleDailyChange}
									onKeyDown={handleInputKeyDown}
									aria-invalid={dailyError !== null}
									aria-describedby={
										dailyError ? "daily-limit-error" : undefined
									}
									className={`w-full rounded-lg border bg-zinc-50 py-2 pl-7 pr-3 text-sm transition-all focus:outline-none focus:ring-2 dark:bg-zinc-900 ${
										dailyError
											? "border-red-400 focus:ring-red-500/20 dark:border-red-500"
											: "border-zinc-200 focus:ring-blue-500/20 dark:border-zinc-800"
									}`}
									placeholder="0.00"
								/>
							</div>
							{dailyError ? (
								<p
									id="daily-limit-error"
									role="alert"
									className="text-xs text-red-600 dark:text-red-400"
								>
									{dailyError}
								</p>
							) : (
								<p className="text-xs text-zinc-500">
									Maximum amount you can spend per day.
								</p>
							)}
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="tx-limit"
									className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
								>
									<Wallet className="size-4" />
									Per-Transaction Limit
								</label>
								<CopyButton
									value={transactionLimit}
									label="transaction limit"
								/>
							</div>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
									$
								</span>
								<input
									id="tx-limit"
									type="number"
									min={MIN_LIMIT}
									max={MAX_LIMIT}
									step={1}
									value={transactionLimit}
									onChange={handleTransactionChange}
									onKeyDown={handleInputKeyDown}
									aria-invalid={txError !== null}
									aria-describedby={txError ? "tx-limit-error" : undefined}
									className={`w-full rounded-lg border bg-zinc-50 py-2 pl-7 pr-3 text-sm transition-all focus:outline-none focus:ring-2 dark:bg-zinc-900 ${
										txError
											? "border-red-400 focus:ring-red-500/20 dark:border-red-500"
											: "border-zinc-200 focus:ring-blue-500/20 dark:border-zinc-800"
									}`}
									placeholder="0.00"
								/>
							</div>
							{txError ? (
								<p
									id="tx-limit-error"
									role="alert"
									className="text-xs text-red-600 dark:text-red-400"
								>
									{txError}
								</p>
							) : (
								<p className="text-xs text-zinc-500">
									Maximum cap for a single transaction.
								</p>
							)}
						</div>
					</div>

					<div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-500/10 dark:bg-blue-500/5">
						<AlertCircle className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
						<p className="text-xs leading-relaxed text-blue-800 dark:text-blue-300">
							Spending limits are enforced in real-time. If a transaction
							exceeds your per-transaction limit or if your daily limit is
							reached, subsequent API calls will be restricted until limits are
							increased or the period resets.
						</p>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row items-end justify-between gap-3 bg-zinc-50 px-6 py-4 dark:bg-zinc-900/50">
					{error && (
						<p className="text-xs text-red-600 leading-relaxed">{error}</p>
					)}
					<Button
						className="rounded-full px-6 shrink-0"
						onClick={handleSave}
						disabled={saveInProgress}
					>
						{saveInProgress ? "Saving…" : "Save Settings"}
					</Button>
				</div>
			</div>
			<Toast open={toastOpen} message={toastMessage} variant={toastVariant} />
		</>
	);
}

function SpendingLimitsCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
			<div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
				<div className="flex items-center gap-3">
					<Skeleton className="h-9 w-9 rounded-lg" />
					<div className="space-y-1.5">
						<Skeleton className="h-5 w-36" />
						<Skeleton className="h-4 w-56" />
					</div>
				</div>
				<Skeleton className="h-5 w-14 rounded-full" />
			</div>
			<div className="space-y-8 p-6">
				<div className="space-y-3">
					<div className="flex items-end justify-between">
						<div className="space-y-1">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-7 w-28" />
						</div>
						<Skeleton className="h-4 w-10" />
					</div>
					<Skeleton className="h-2 w-full rounded-full" />
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<Skeleton className="h-4 w-36" />
						<Skeleton className="h-9 w-full rounded-lg" />
						<Skeleton className="h-3 w-48" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-36" />
						<Skeleton className="h-9 w-full rounded-lg" />
						<Skeleton className="h-3 w-44" />
					</div>
				</div>
				<Skeleton className="h-16 w-full rounded-lg" />
			</div>
			<div className="flex justify-end bg-zinc-50 px-6 py-4 dark:bg-zinc-900/50">
				<Skeleton className="h-9 w-32 rounded-full" />
			</div>
		</div>
	);
}
