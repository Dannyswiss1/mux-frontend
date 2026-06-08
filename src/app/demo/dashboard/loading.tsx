import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
	return (
		<div className="space-y-6">
			{/* Page header skeleton */}
			<div className="flex flex-col gap-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-72" />
			</div>

			{/* Stats row skeleton */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }, (_, i) => (
					<div key={i} className="rounded-xl border border-border bg-card p-4">
						<Skeleton className="mb-3 h-4 w-24" />
						<Skeleton className="h-7 w-16" />
					</div>
				))}
			</div>

			{/* Table skeleton */}
			<div className="rounded-xl border border-border bg-card">
				<div className="border-b border-border p-4">
					<Skeleton className="h-5 w-32" />
				</div>
				<div className="divide-y divide-border">
					{Array.from({ length: 5 }, (_, i) => (
						<div key={i} className="flex items-center gap-4 px-4 py-3">
							<Skeleton className="h-4 w-4 rounded-full" />
							<Skeleton className="h-4 flex-1" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-6 w-16 rounded-full" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
