const STORAGE_KEY = "mux-auth-session";

function parseSession(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function saveSession(session) {
	if (typeof window === "undefined") return;

	if (session) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
	} else {
		localStorage.removeItem(STORAGE_KEY);
	}
}

function loadSession() {
	if (typeof window === "undefined") return null;

	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return null;

	const session = parseSession(raw);
	if (!session || typeof session !== "object") {
		localStorage.removeItem(STORAGE_KEY);
		return null;
	}

	return session;
}

function clearSession() {
	saveSession(null);
}

function isSessionValid(session) {
	return (
		!!session &&
		typeof session.expiresAt === "number" &&
		Date.now() < session.expiresAt
	);
}

function createDemoSession() {
	return {
		accessToken: "mock-access-token",
		refreshToken: "mock-refresh-token",
		expiresAt: Date.now() + 30_000,
	};
}

function createExpiredDemoSession() {
	return {
		accessToken: "expired-token",
		refreshToken: "mock-refresh-token",
		expiresAt: Date.now() - 5_000,
	};
}

module.exports = {
	STORAGE_KEY,
	loadSession,
	saveSession,
	clearSession,
	isSessionValid,
	createDemoSession,
	createExpiredDemoSession,
};
