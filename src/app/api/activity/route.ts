import { NextResponse } from "next/server";
import { mockTransactions } from "@/mock-data/transactions";

// Simple token validation similar to other API routes
const VALID_ACCESS_TOKEN = "mock-access-token";

/**
 * Transform mock transaction data into activity items expected by RecentActivityFeed.
 * This is a lightweight mapping; in a real implementation the backend would provide
 * appropriately shaped data.
 */
function mapTransactionToActivity(tx) {
	// Determine activity type based on transaction status and direction (simplified)
	const type =
		tx.from === "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
			? "wallet_created"
			: "transaction";

	return {
		id: tx.hash,
		type,
		description: `${tx.from.slice(0, 4)} → ${tx.to.slice(0, 4)}: ${tx.amountXlm} XLM`,
		timestamp: tx.createdAt,
		status:
			tx.status === "completed"
				? "success"
				: tx.status === "pending"
					? "pending"
					: "error",
	};
}

export async function GET(request: Request) {
	const authorization = request.headers.get("authorization");
	if (!authorization?.startsWith("Bearer ")) {
		return NextResponse.json({ error: "missing_auth" }, { status: 401 });
	}

	const token = authorization.slice("Bearer ".length).trim();
	if (token !== VALID_ACCESS_TOKEN) {
		return NextResponse.json({ error: "invalid_token" }, { status: 401 });
	}

	// Map mock transactions to activity items
	const activities = mockTransactions.map(mapTransactionToActivity);

	return NextResponse.json(activities);
}
