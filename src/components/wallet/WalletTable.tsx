"use client";

import { AlertCircle, Check, Copy, Plus } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExplorerLink } from "@/components/ui/ExplorerLink";
import { TestnetHint } from "@/components/ui/TestnetHint";
import { Toast } from "@/components/ui/toast";
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
	onCopySuccess,
	onCopyError,
}: {
	address: string;
	network: "mainnet" | "testnet";
	onCopySuccess?: (address: string) => void;
	onCopyError?: (error: string) => void;
}) {
	const { copy, copied, error } = useCopyToClipboard();

	const handleCopy = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		
		try {
			await copy(address, address);
			// Success callback will be triggered by effect monitoring copied state
		} catch (err) {
			// Error will be set in hook state
			const errorMessage = err instanceof Error ? err.message : "Failed to copy";
			if (onCopyError) {
				onCopyError(errorMessage);
			}
		}
	};

	// Trigger success callback when copied changes to true
	React.useEffect(() => {
		if (copied && onCopySuccess) {
			onCopySuccess(address);
		}
	}, [copied, address, onCopySuccess]);

	// Trigger error callback when error is set
	React.useEffect(() => {
		if (error && onCopyError) {
			onCopyError(error);
		}
	}, [error, onCopyError]);

	return (
		<div className="flex items-center gap-1">
			<code className="rounded bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-700 transition-colors dark:bg-zinc-800 dark:text-zinc-300">
				{truncateAddress(address)}
			</code>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={handleCopy}
				title={error ? error : copied ? "Copied!" : "Copy address"}
				disabled={error !== null}
				className="transition-all hover:scale-110"
				aria-label={copied ? "Address copied to clipboard" : "Copy address to clipboard"}
				data-testid="copy-address-button"
			>
				{error ? (
					<AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
				) : copied ? (
					<Check className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" aria-hidden="true" />
				) : (
					<Copy className="h-4 w-4 transition-colors hover:text-blue-600 dark:hover:text-blue-400" aria-hidden="true" />
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
	const [toastOpen, setToastOpen] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState<"success" | "error">("success");

	const hasTestnetWallets = useMemo(
		() => wallets.some((wallet) => wallet.network === "testnet"),
		[wallets],
	);

	const handleCopySuccess = (address: string) => {
		const truncated = truncateAddress(address);
		setToastMessage(`Address ${truncated} copied to clipboard`);
		setToastType("success");
		setToastOpen(true);
		
		// Auto-dismiss after 3 seconds
		setTimeout(() => {
			setToastOpen(false);
		}, 3000);
	};

	const handleCopyError = (error: string) => {
		setToastMessage(error || "Failed to copy address");
		setToastType("error");
		setToastOpen(true);
		
		// Auto-dismiss after 4 seconds (longer for errors)
		setTimeout(() => {
			setToastOpen(false);
		}, 4000);
	};

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
												onCopySuccess={handleCopySuccess}
												onCopyError={handleCopyError}
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

			{/* Toast notification for copy feedback */}
			<CopyToast 
				open={toastOpen} 
				message={toastMessage} 
				type={toastType}
			/>
		</div>
	);
}

interface CopyToastProps {
	open: boolean;
	message: string;
	type: "success" | "error";
}

function CopyToast({ open, message, type }: CopyToastProps) {
	if (!open) {
		return null;
	}

	return (
		<div 
			className="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg bg-zinc-950/95 p-4 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md animate-in slide-in-from-bottom-5 fade-in duration-300"
			role="status"
			aria-live="polite"
			data-testid="copy-toast"
		>
			<div className="flex items-start gap-3">
				{type === "success" ? (
					<Check className="h-5 w-5 text-green-400 flex-shrink-0" aria-hidden="true" />
				) : (
					<AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" aria-hidden="true" />
				)}
				<div className="space-y-1 flex-1 min-w-0">
					<p className="text-sm font-semibold">
						{type === "success" ? "Copied!" : "Copy Failed"}
					</p>
					<p className="text-sm text-zinc-200 break-words">{message}</p>
				</div>
			</div>
		</div>
	);
}
