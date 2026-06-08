import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";

export default function Home() {
	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
					Dashboard
				</h1>
				<p className="text-zinc-500 dark:text-zinc-400">
					Welcome back! Here's what's happening with your Mux Protocol
					integration.
				</p>
			</div>

			<DashboardOverview />

			<div className="grid gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<RecentActivityFeed />
				</div>
			</div>
		</div>
	);
}
