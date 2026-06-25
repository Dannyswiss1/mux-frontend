"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { WalletTable } from "@/components/wallet/WalletTable";
import { useWallets } from "@/hooks/useWallets";

export default function WalletsPage() {
	const { wallets, loading, error, refetch } = useWallets();

	return (
		<div className="space-y-8">
			<PageHeader
				title="Wallet Monitoring"
				description="Track and manage your Stellar wallets"
			/>

			{loading ? (
				<div className="space-y-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full" />
					))}
				</div>
			) : error ? (
				<ErrorState description={error} retry={{ onRetry: refetch }} />
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
