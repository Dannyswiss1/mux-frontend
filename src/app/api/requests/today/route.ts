import { NextResponse } from "next/server";

export async function GET() {
	// TODO: replace with real telemetry backend integration
	const todayCount = 42;
	return NextResponse.json({ count: todayCount });
}
