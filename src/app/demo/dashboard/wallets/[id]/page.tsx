import Link from "next/link";
import { WalletDetail } from "@/components/wallet/WalletDetail";

interface WalletDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function WalletDetailPage({
	params,
}: WalletDetailPageProps) {
	const { id } = await params;

	return (
		<div className="min-h-screen bg-zinc-50 p-6 dark:bg-black md:p-12">
			<div className="mx-auto max-w-2xl space-y-8">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							Wallet Detail
						</h1>
						<p className="mt-1 text-zinc-500 dark:text-zinc-400">
							Live balance and wallet information
						</p>
"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import ReceiveWalletModal from "@/components/wallet/ReceiveWalletModal";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";
import { StatusIndicator } from "@/components/wallet/StatusIndicator";
import { useWallet } from "@/hooks/useWallet";
import { isValidStellarAddress } from "@/utils/addressValidation";
import { formatDate } from "@/utils/dateFormatting";

export default function WalletDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { wallet, loading, error, refetch } = useWallet(id);
	const [isReceiveOpen, setIsReceiveOpen] = useState(false);

	if (!loading && error === "not_found") notFound();

	const address = wallet?.address.trim() ?? "";
	const canReceive = !!wallet && isValidStellarAddress(address);

	return (
		<div className="min-h-screen bg-zinc-50 p-6 dark:bg-black md:p-12">
			<div className="mx-auto max-w-4xl space-y-8">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							Wallet Details
						</h1>
						{wallet ? (
							<p className="mt-1 break-all text-zinc-500 dark:text-zinc-400">
								{wallet.address}
							</p>
						) : (
							<p className="mt-1 text-zinc-500 dark:text-zinc-400">
								View the wallet record, network state, and receive details.
							</p>
						)}
					</div>
					<Link
						href="/demo/dashboard/wallets"
						className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
					>
						← Back to Wallets
					</Link>
				</header>

				<WalletDetail id={id} />
			</div>
						Back to Wallets
					</Link>
				</header>

				{loading && (
					<section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<div className="grid gap-6 sm:grid-cols-2">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-3 w-20" />
									<Skeleton className="h-5 w-32" />
								</div>
							))}
						</div>
					</section>
				)}

				{!loading && error && error !== "not_found" && (
					<ErrorState description={error} retry={{ onRetry: refetch }} />
				)}

				{!loading && wallet && (
					<section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<dl className="grid gap-6 sm:grid-cols-2">
							<div>
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Network
								</dt>
								<dd className="mt-1">
									<NetworkBadge network={wallet.network} />
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Status
								</dt>
								<dd className="mt-1">
									<StatusIndicator status={wallet.status} />
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Balance
								</dt>
								<dd className="mt-1 font-mono text-zinc-900 dark:text-zinc-50">
									{wallet.balance ?? "—"}
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Created
								</dt>
								<dd className="mt-1 text-zinc-700 dark:text-zinc-300">
									{formatDate(wallet.createdAt)}
								</dd>
							</div>
							{wallet.lastActivity && (
								<div>
									<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
										Last Activity
									</dt>
									<dd className="mt-1 text-zinc-700 dark:text-zinc-300">
										{formatDate(wallet.lastActivity)}
									</dd>
								</div>
							)}
							<div className="sm:col-span-2">
								<dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
									Address
								</dt>
								<dd className="mt-1">
									<code className="break-all rounded bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
										{wallet.address}
									</code>
								</dd>
							</div>
						</dl>

						<div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
										Receive funds
									</p>
									<p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
										Open the QR stub to copy the address or review the receive
										state for this wallet.
									</p>
								</div>
								<div className="flex flex-wrap gap-3">
									<Button
										variant="outline"
										onClick={() => setIsReceiveOpen(true)}
										disabled={!canReceive}
										title={
											canReceive
												? "Show receive QR stub"
												: "Wallet address is invalid"
										}
										aria-label={
											canReceive
												? "Receive funds"
												: "Cannot receive: wallet address is invalid"
										}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											className="h-4 w-4"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 3v18m9-9H3"
											/>
										</svg>
										Receive
									</Button>
								</div>
							</div>
						</div>
					</section>
				)}
			</div>

			<ReceiveWalletModal
				isOpen={isReceiveOpen}
				wallet={wallet}
				onClose={() => setIsReceiveOpen(false)}
			/>
		</div>
	);
}
