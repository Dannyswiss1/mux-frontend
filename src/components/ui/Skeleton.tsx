import { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${className}`}
			{...props}
		/>
	);
}

export function WalletTableSkeleton() {
	return (
		<div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
			{/* Table Header Skeleton */}
			<div className="flex flex-col gap-3 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-zinc-800">
				<Skeleton className="h-5 w-24" />
				<Skeleton className="h-9 w-full rounded-full sm:w-28" />
			</div>

			{/* Desktop Table Skeleton */}
			<div className="hidden lg:block">
				<div className="divide-y divide-zinc-100 dark:divide-zinc-800">
					{/* Table Column Headers */}
					<div className="grid grid-cols-6 gap-4 px-6 py-3 bg-zinc-50 dark:bg-zinc-900/50">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-14" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-24" />
					</div>

					{/* Table Rows */}
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="grid grid-cols-6 gap-4 px-6 py-4">
							{/* Address column */}
							<div className="flex items-center gap-2">
								<Skeleton className="h-8 w-32 rounded" />
								<Skeleton className="h-6 w-6 rounded" />
								<Skeleton className="h-6 w-6 rounded" />
							</div>
							{/* Network column */}
							<Skeleton className="h-6 w-20 rounded-full" />
							{/* Status column */}
							<Skeleton className="h-6 w-16 rounded-full" />
							{/* Balance column */}
							<Skeleton className="h-4 w-24" />
							{/* Created column */}
							<Skeleton className="h-4 w-20" />
							{/* Last Activity column */}
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			</div>

			{/* Mobile Card Skeleton */}
			<div className="divide-y divide-zinc-100 lg:hidden dark:divide-zinc-800">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="p-4 space-y-3">
						{/* Top row: Address and Badges */}
						<div className="flex items-start justify-between gap-2">
							<div className="flex items-center gap-2">
								<Skeleton className="h-8 w-32 rounded" />
								<Skeleton className="h-6 w-6 rounded" />
								<Skeleton className="h-6 w-6 rounded" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-6 w-20 rounded-full" />
								<Skeleton className="h-6 w-16 rounded-full" />
							</div>
						</div>

						{/* Metadata grid */}
						<div className="grid grid-cols-2 gap-x-4 gap-y-2">
							<div className="space-y-1">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-24" />
							</div>
							<div className="space-y-1">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-20" />
							</div>
							<div className="col-span-2 space-y-1">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-20" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function CardSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
			<Skeleton className="h-48 w-full rounded-lg" />
			<div className="space-y-2">
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
			</div>
			<div className="flex gap-2">
				<Skeleton className="h-8 w-20 rounded-full" />
				<Skeleton className="h-8 w-20 rounded-full" />
			</div>
		</div>
	);
}
