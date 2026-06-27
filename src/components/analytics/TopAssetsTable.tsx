import type { AssetData } from "@/mock-data/analytics";

interface TopAssetsTableProps {
	assets: AssetData[];
}

export function TopAssetsTable({ assets }: TopAssetsTableProps) {
	return (
		<div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
			<div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
				<h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
					Top Assets by Volume
				</h3>
				<p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
					Highest traded assets on the platform
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-zinc-100 dark:border-zinc-800">
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
								#
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
								Asset
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
								Volume
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
								Change
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
								TVL
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
								Transactions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
						{assets.map((asset) => (
							<tr
								key={asset.rank}
								className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
							>
								<td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
									{asset.rank}
								</td>
								<td className="px-6 py-4">
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
											{asset.symbol.charAt(0)}
										</div>
										<div>
											<p className="font-medium text-zinc-900 dark:text-zinc-50">
												{asset.name}
											</p>
											<p className="text-xs text-zinc-500 dark:text-zinc-400">
												{asset.symbol}
											</p>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 text-right font-medium text-zinc-900 dark:text-zinc-50">
									{asset.volume}
								</td>
								<td className="px-6 py-4 text-right">
									<span
										className={`inline-flex items-center gap-0.5 text-sm font-medium ${
											asset.volumeChange >= 0
												? "text-emerald-600 dark:text-emerald-400"
												: "text-red-600 dark:text-red-400"
										}`}
									>
										<svg
											className="h-3 w-3"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
										>
											{asset.volumeChange >= 0 ? (
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M5 15l7-7 7 7"
												/>
											) : (
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M19 9l-7 7-7-7"
												/>
											)}
										</svg>
										{Math.abs(asset.volumeChange)}%
									</span>
								</td>
								<td className="px-6 py-4 text-right text-zinc-900 dark:text-zinc-50">
									{asset.tvl}
								</td>
								<td className="px-6 py-4 text-right text-zinc-900 dark:text-zinc-50">
									{asset.txCount.toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
