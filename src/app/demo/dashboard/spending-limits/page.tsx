import { SpendingLimitsCard } from "@/components/dashboard/SpendingLimitsCard";
import { PageHeader } from "@/components/ui/PageHeader";

const BILLING_DOCS_URL = "https://docs.mux.com/billing";

export default function SpendingLimitsPage() {
	return (
		<div className="space-y-8">
			<PageHeader
				title="Spending Limits"
				description="Configure your API spending thresholds and monitor your daily consumption."
			/>

			<div className="grid gap-8">
				<SpendingLimitsCard />

				<div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
					<h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
						Billing & Overages
					</h3>
					<p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
						Once you reach your daily spending limit, your API requests will
						return a 429 status code. You can increase your limits by contacting
						our support team or upgrading your plan.
					</p>
					<a
						href="#"
						className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline inline-flex items-center gap-1"
					>
						View billing details
					</a>
				</div>
			</div>
		</div>
	);
}
