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
		</div>
	);
}
