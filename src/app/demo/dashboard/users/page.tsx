import { ContentContainer } from "@/components/layouts/ContentContainer";

export default function UsersPage() {
	return (
		<ContentContainer>
			<div className="space-y-4">
				<div className="border-b border-gray-200 pb-4">
					<h2 className="text-2xl font-bold text-gray-900">Users</h2>
					<p className="mt-1 text-sm text-gray-500">
						Manage and view all registered users.
					</p>
				</div>
				<div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-8">
					<div className="text-center">
						<h3 className="text-lg font-medium text-gray-600">
							Users Overview
						</h3>
						<p className="mt-2 text-sm text-gray-400">
							User management features will be available here.
						</p>
					</div>
				</div>
			</div>
		</ContentContainer>
	);
}
