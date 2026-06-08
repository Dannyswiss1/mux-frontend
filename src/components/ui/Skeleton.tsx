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
			<div className="divide-y divide-zinc-100 dark:divide-zinc-800">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="flex items-center gap-4 p-4">
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="ml-auto h-4 w-24" />
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
