"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { WalletTableSkeleton } from "@/components/ui/Skeleton";
import { WalletTable } from "@/components/wallet/WalletTable";
import { useNetwork } from "@/context/NetworkContext";
import { dummyWallets } from "@/mock-data/wallets";
import type { Wallet } from "@/types/wallet";

export default function WalletsPage() {
	const { network } = useNetwork();
	const [isLoading, setIsLoading] = useState(true);
	const [wallets, setWallets] = useState<Wallet[]>([]);

	useEffect(() => {
		// Simulate loading state to demonstrate skeleton
		setIsLoading(true);
		const timer = setTimeout(() => {
			const filteredWallets = dummyWallets.filter((w) => w.network === network);
			setWallets(filteredWallets);
			setIsLoading(false);
		}, 800);

		return () => clearTimeout(timer);
	}, [network]);

	return (
		<div className="space-y-8">
			<PageHeader
				title="Wallet Monitoring"
				description="Track and manage your Stellar wallets"
			/>

			{isLoading ? (
				<WalletTableSkeleton />
			) : wallets.length > 0 ? (
				<WalletTable wallets={wallets} />
			) : (
				<EmptyState
					title="No wallets found"
					description="You haven't added any wallets to monitor yet. Add your first wallet to start tracking."
					action={{
						label: "Add Wallet",
						onClick: () => {},
					}}
				/>
			)}
		</div>
	);
}
