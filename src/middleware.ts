import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Protected route prefixes.
 * Any request whose pathname starts with one of these values requires
 * the user to be authenticated (indicated by the presence of the
 * `mux_auth_session` cookie set during sign-in).
 *
 * See docs/auth-local-setup.md for the full auth flow documentation.
 */
const PROTECTED_PREFIXES = ["/dashboard"];

/**
 * The path users are redirected to when they are not authenticated.
 * A `callbackUrl` query param is appended so the login page can
 * redirect back after a successful sign-in.
 */
const LOGIN_PATH = "/login";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isProtected = PROTECTED_PREFIXES.some((prefix) =>
		pathname.startsWith(prefix),
	);

	if (!isProtected) {
		return NextResponse.next();
	}

	const session = request.cookies.get("mux_auth_session");

	if (!session?.value) {
		const loginUrl = request.nextUrl.clone();
		loginUrl.pathname = LOGIN_PATH;
		loginUrl.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	/*
	 * Match all routes under /dashboard.
	 * Exclude Next.js internals and static assets.
	 */
	matcher: ["/dashboard", "/dashboard/:path*"],
};
