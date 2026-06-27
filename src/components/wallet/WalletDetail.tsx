"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";
import { StatusIndicator } from "@/components/wallet/StatusIndicator";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { truncateAddress } from "@/utils/addressFormatting";
import { formatDate } from "@/utils/dateFormatting";

interface WalletDetailProps {
	id: string;
}

export function WalletDetail({ id }: WalletDetailProps) {
	const { wallet, balance, loading, error, lastUpdated, refresh } =
		useWalletBalance(id);
	const { copy, copied } = useCopyToClipboard();

	if (error && !wallet) {
		return (
			<ErrorState
				description={error}
				retry={{ label: "Retry", onRetry: refresh }}
			/>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Balance card */}
			<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
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
							onClick={refresh}
							disabled={loading}
							aria-label="Refresh balance"
							className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
						>
							<RefreshCw
								className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
							/>
						</button>
					</div>
				</div>

				{loading && !balance ? (
					<Skeleton className="h-10 w-40 sm:h-12 sm:w-48" />
				) : (
					<p className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
						{balance ?? "—"}
					</p>
				)}

				{error && wallet && (
					<p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
				)}
			</div>

			{/* Wallet metadata */}
			{wallet ? (
				<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
					<h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
						Wallet Info
					</h2>
					<dl className="space-y-4">
						<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
							<dt className="text-sm text-zinc-500 dark:text-zinc-400">
								Address
							</dt>
							<dd className="flex min-w-0 items-center gap-2">
								<code className="min-w-0 truncate rounded bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-700 sm:max-w-[200px] dark:bg-zinc-800 dark:text-zinc-300">
									{truncateAddress(wallet.address)}
								</code>
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => copy(wallet.address)}
									aria-label={copied ? "Address copied" : "Copy wallet address"}
									title={copied ? "Copied!" : "Copy address"}
								>
									{copied ? (
										<Check className="h-4 w-4 text-green-500" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</dd>
						</div>
						<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
							<dt className="text-sm text-zinc-500 dark:text-zinc-400">
								Network
							</dt>
							<dd>
								<NetworkBadge network={wallet.network} />
							</dd>
						</div>
						<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
							<dt className="text-sm text-zinc-500 dark:text-zinc-400">
								Status
							</dt>
							<dd>
								<StatusIndicator status={wallet.status} />
							</dd>
						</div>
						<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
							<dt className="text-sm text-zinc-500 dark:text-zinc-400">
								Created
							</dt>
							<dd className="text-sm text-zinc-700 dark:text-zinc-300">
								{formatDate(wallet.createdAt)}
							</dd>
						</div>
						{wallet.lastActivity && (
							<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
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
				<div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
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
	);
}
