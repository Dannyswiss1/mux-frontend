import { PageHeader } from "@/components/ui/PageHeader";
import RequestsToday from "@/components/dashboard/RequestsToday";

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Dashboard"
				description="Welcome to your Mux Protocol developer console."
			/>
			<div>
				<RequestsToday />
			</div>
		</div>
	);
}
