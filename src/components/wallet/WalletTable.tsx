"use client";

import { AlertCircle, Check, Copy, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ExplorerLink } from "@/components/ui/ExplorerLink";
import { TestnetHint } from "@/components/ui/TestnetHint";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";
import { StatusIndicator } from "@/components/wallet/StatusIndicator";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { WalletTableProps } from "@/types/wallet";
import { truncateAddress } from "@/utils/addressFormatting";
import { formatDate } from "@/utils/dateFormatting";

function WalletAddressCell({
	address,
	network,
}: {
	address: string;
	network: "mainnet" | "testnet";
}) {
	const { copy, copied, error } = useCopyToClipboard();

	const handleCopy = async () => {
		await copy(address, address);
	};

	return (
		<div className="flex items-center gap-1">
			<code className="rounded bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
				{truncateAddress(address)}
			</code>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={handleCopy}
				title={error ? error : copied ? "Copied!" : "Copy address"}
				disabled={error !== null}
			>
				{error ? (
					<AlertCircle className="h-4 w-4 text-red-500" />
				) : copied ? (
					<Check className="h-4 w-4 text-green-500" />
				) : (
					<Copy className="h-4 w-4" />
				)}
			</Button>
			<ExplorerLink
				address={address}
				network={network}
				type="account"
				size="icon-sm"
				showIcon
				title="View on Stellar Explorer"
			/>
		</div>
	);
}

export function WalletTable({ wallets, onAddWallet }: WalletTableProps) {
	const hasTestnetWallets = useMemo(
		() => wallets.some((wallet) => wallet.network === "testnet"),
		[wallets],
	);

	return (
		<div className="space-y-4">
			{hasTestnetWallets && <TestnetHint variant="default" />}

			<div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
				<div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
					<div>
						<p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
							{wallets.length} wallet{wallets.length !== 1 ? "s" : ""}
						</p>
					</div>
					{onAddWallet && (
						<Button
							size="sm"
							onClick={onAddWallet}
							className="rounded-full px-4"
						>
							<Plus className="h-4 w-4" aria-hidden="true" />
							Add Wallet
						</Button>
					)}
				</div>

				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent dark:hover:bg-transparent">
							<TableHead>Address</TableHead>
							<TableHead>Network</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="hidden sm:table-cell">Balance</TableHead>
							<TableHead className="hidden md:table-cell">Created</TableHead>
							<TableHead className="hidden lg:table-cell">
								Last Activity
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{wallets.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="py-12 text-center text-zinc-500"
								>
									No wallets found for this network.
								</TableCell>
							</TableRow>
						) : (
							wallets.map((wallet) => (
								<TableRow key={wallet.id}>
									<TableCell>
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block"
										>
											<WalletAddressCell
												address={wallet.address}
												network={wallet.network}
											/>
										</Link>
									</TableCell>
									<TableCell>
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block"
										>
											<NetworkBadge network={wallet.network} />
										</Link>
									</TableCell>
									<TableCell>
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block"
										>
											<StatusIndicator status={wallet.status} />
										</Link>
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block text-zinc-700 dark:text-zinc-300"
										>
											{wallet.balance ?? "—"}
										</Link>
									</TableCell>
									<TableCell className="hidden text-zinc-500 md:table-cell dark:text-zinc-400">
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block"
										>
											{formatDate(wallet.createdAt)}
										</Link>
									</TableCell>
									<TableCell className="hidden text-zinc-500 lg:table-cell dark:text-zinc-400">
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block"
										>
											{formatDate(wallet.lastActivity)}
										</Link>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
