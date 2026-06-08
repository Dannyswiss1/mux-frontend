import { NextResponse } from "next/server";

const VALID_REFRESH_TOKEN = "mock-refresh-token";

export async function POST(request: Request) {
	const body = await request.json().catch(() => ({}));
	if (body.refreshToken !== VALID_REFRESH_TOKEN) {
		return NextResponse.json({ error: "invalid_refresh" }, { status: 401 });
	}

	return NextResponse.json({
		accessToken: "mock-access-token",
		refreshToken: VALID_REFRESH_TOKEN,
		expiresIn: 30,
	});
}
