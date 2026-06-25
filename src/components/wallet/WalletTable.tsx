"use client";

import { AlertCircle, Check, Copy, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
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
	const router = useRouter();
	const [focusedIndex, setFocusedIndex] = useState<number>(-1);
	const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

	const hasTestnetWallets = useMemo(
		() => wallets.some((wallet) => wallet.network === "testnet"),
		[wallets],
	);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLTableRowElement>, index: number) => {
			switch (event.key) {
				case "ArrowDown":
					event.preventDefault();
					if (index < wallets.length - 1) {
						setFocusedIndex(index + 1);
						rowRefs.current[index + 1]?.focus();
					}
					break;
				case "ArrowUp":
					event.preventDefault();
					if (index > 0) {
						setFocusedIndex(index - 1);
						rowRefs.current[index - 1]?.focus();
					}
					break;
				case "Enter":
				case " ":
					event.preventDefault();
					router.push(`/demo/dashboard/wallets/${wallets[index].id}`);
					break;
				case "Home":
					event.preventDefault();
					setFocusedIndex(0);
					rowRefs.current[0]?.focus();
					break;
				case "End":
					event.preventDefault();
					const lastIndex = wallets.length - 1;
					setFocusedIndex(lastIndex);
					rowRefs.current[lastIndex]?.focus();
					break;
			}
		},
		[wallets, router],
	);

	// Handle row focus
	const handleRowFocus = useCallback((index: number) => {
		setFocusedIndex(index);
	}, []);

	// Handle row blur
	const handleRowBlur = useCallback(() => {
		setFocusedIndex(-1);
	}, []);

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
							wallets.map((wallet, index) => (
								<TableRow
									key={wallet.id}
									ref={(el) => {
										rowRefs.current[index] = el;
									}}
									tabIndex={0}
									onKeyDown={(e) => handleKeyDown(e, index)}
									onFocus={() => handleRowFocus(index)}
									onBlur={handleRowBlur}
									className={`cursor-pointer transition-colors ${
										focusedIndex === index
											? "ring-2 ring-blue-500 ring-inset dark:ring-blue-400"
											: ""
									}`}
									data-testid={`wallet-row-${index}`}
									aria-label={`Wallet ${truncateAddress(wallet.address)}, ${wallet.network}, ${wallet.status}`}
								>
									<TableCell>
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block"
											tabIndex={-1}
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
											tabIndex={-1}
										>
											<NetworkBadge network={wallet.network} />
										</Link>
									</TableCell>
									<TableCell>
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block"
											tabIndex={-1}
										>
											<StatusIndicator status={wallet.status} />
										</Link>
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block text-zinc-700 dark:text-zinc-300"
											tabIndex={-1}
										>
											{wallet.balance ?? "—"}
										</Link>
									</TableCell>
									<TableCell className="hidden text-zinc-500 md:table-cell dark:text-zinc-400">
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block"
											tabIndex={-1}
										>
											{formatDate(wallet.createdAt)}
										</Link>
									</TableCell>
									<TableCell className="hidden text-zinc-500 lg:table-cell dark:text-zinc-400">
										<Link
											href={`/demo/dashboard/wallets/${wallet.id}`}
											className="block"
											tabIndex={-1}
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
