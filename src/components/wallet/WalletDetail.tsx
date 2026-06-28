"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/toast";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";
import { StatusIndicator } from "@/components/wallet/StatusIndicator";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { truncateAddress } from "@/utils/addressFormatting";
import { formatDate } from "@/utils/dateFormatting";

/**
 * Props for the WalletDetail component.
 */
interface WalletDetailProps {
	/**
	 * The unique identifier of the wallet to display.
	 * Used to fetch live balance and metadata from the backend.
	 */
	id: string;
}

const TOAST_DURATION_MS = 3000;

/**
 * Displays live balance and metadata for a single wallet.
 *
 * Fetches wallet data via `useWalletBalance` and auto-refreshes on an interval.
 * Provides one-click copy of the wallet address with toast confirmation,
 * a manual refresh button with feedback, and graceful error/loading states.
 *
 * @example
 * ```tsx
 * <WalletDetail id="wallet-001" />
 * ```
 */
export function WalletDetail({ id }: WalletDetailProps) {
	const { wallet, balance, loading, error, lastUpdated, refresh } =
		useWalletBalance(id);
	const { copy, copied, error: copyError } = useCopyToClipboard();

	const [toastOpen, setToastOpen] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showToast = useCallback((message: string) => {
		setToastMessage(message);
		setToastOpen(true);
		if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
		toastTimeoutRef.current = setTimeout(() => {
			setToastOpen(false);
		}, TOAST_DURATION_MS);
	}, []);

	useEffect(() => {
		if (copied) showToast("Address copied to clipboard.");
	}, [copied, showToast]);

	useEffect(() => {
		if (copyError) showToast(`Copy failed: ${copyError}`);
	}, [copyError, showToast]);

	useEffect(() => {
		return () => {
			if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
		};
	}, []);

	const handleRefresh = useCallback(async () => {
		await refresh();
		showToast("Balance refreshed.");
	}, [refresh, showToast]);

	if (error && !wallet) {
		return (
			<ErrorState
				description={error}
				retry={{ label: "Retry", onRetry: refresh }}
			/>
		);
	}

	return (
		<>
			<div className="space-y-6">
				{/* Balance card */}
				<div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-none">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
							Live Balance
						</h2>
						<div className="flex items-center gap-2">
							{lastUpdated && (
								<span className="text-xs text-zinc-400 dark:text-zinc-500">
									Updated {formatDate(lastUpdated)}
								</span>
							)}
							<button
								type="button"
								onClick={handleRefresh}
								disabled={loading}
								aria-label="Refresh balance"
								className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
							>
								<RefreshCw
									className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
								/>
							</button>
						</div>
					</div>

					{loading && !balance ? (
						<Skeleton className="h-12 w-48" />
					) : (
						<p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							{balance ?? "—"}
						</p>
					)}

					{error && wallet && (
						<p className="mt-2 text-sm text-red-600 dark:text-red-400">
							{error}
						</p>
					)}
				</div>

				{/* Wallet metadata */}
				{wallet ? (
					<div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-none">
						<h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
							Wallet Info
						</h2>
						<dl className="divide-y divide-zinc-100 dark:divide-zinc-800">
							<div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
								<dt className="text-sm text-zinc-500 dark:text-zinc-400">
									Address
								</dt>
								<dd className="flex items-center gap-2">
									<code className="rounded bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
										{truncateAddress(wallet.address)}
									</code>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => copy(wallet.address)}
										title={copied ? "Copied!" : "Copy address"}
										aria-label={
											copied ? "Address copied" : "Copy wallet address"
										}
									>
										{copied ? (
											<Check className="h-4 w-4 text-green-500 dark:text-green-400" />
										) : (
											<Copy className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
										)}
									</Button>
								</dd>
							</div>
							<div className="flex items-center justify-between py-3">
								<dt className="text-sm text-zinc-500 dark:text-zinc-400">
									Network
								</dt>
								<dd>
									<NetworkBadge network={wallet.network} />
								</dd>
							</div>
							<div className="flex items-center justify-between py-3">
								<dt className="text-sm text-zinc-500 dark:text-zinc-400">
									Status
								</dt>
								<dd>
									<StatusIndicator status={wallet.status} />
								</dd>
							</div>
							<div className="flex items-center justify-between py-3">
								<dt className="text-sm text-zinc-500 dark:text-zinc-400">
									Created
								</dt>
								<dd className="text-sm text-zinc-700 dark:text-zinc-300">
									{formatDate(wallet.createdAt)}
								</dd>
							</div>
							{wallet.lastActivity && (
								<div className="flex items-center justify-between py-3 last:pb-0">
									<dt className="text-sm text-zinc-500 dark:text-zinc-400">
										Last Activity
									</dt>
									<dd className="text-sm text-zinc-700 dark:text-zinc-300">
										{formatDate(wallet.lastActivity)}
									</dd>
								</div>
							)}
						</dl>
					</div>
				) : (
					<div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-none">
						<Skeleton className="mb-4 h-4 w-24" />
						<div className="space-y-4">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="flex items-center justify-between">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-6 w-32" />
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<Toast open={toastOpen} message={toastMessage} />
		</>
	);
}
