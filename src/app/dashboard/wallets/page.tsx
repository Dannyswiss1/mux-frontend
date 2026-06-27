"use client";

import { useCallback, useEffect, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { WalletTableSkeleton } from "@/components/ui/Skeleton";
import { WalletTable } from "@/components/wallet/WalletTable";
import { useNetwork } from "@/context/NetworkContext";
import { dummyWallets } from "@/mock-data/wallets";
import type { Wallet } from "@/types/wallet";

export default function WalletsPage() {
	const { network } = useNetwork();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [wallets, setWallets] = useState<Wallet[]>([]);

	const load = useCallback(() => {
		setIsLoading(true);
		setError(null);
		const timer = setTimeout(() => {
			try {
				setWallets(dummyWallets.filter((w) => w.network === network));
			} catch {
				setError("Failed to load wallets. Please try again.");
			} finally {
				setIsLoading(false);
			}
		}, 800);
		return timer;
	}, [network]);

	useEffect(() => {
		const timer = load();
		return () => clearTimeout(timer);
	}, [load]);

	return (
		<div className="space-y-8">
			<PageHeader
				title="Wallet Monitoring"
				description="Track and manage your Stellar wallets"
			/>

			{isLoading ? (
				<WalletTableSkeleton />
			) : error ? (
				<ErrorState description={error} retry={{ onRetry: load }} />
			) : (
				<WalletTable wallets={wallets} />
			)}
		</div>
	);
}
